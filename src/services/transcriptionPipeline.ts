import Clipboard from '@react-native-clipboard/clipboard';
import {
  transcribeAudio,
  type TranscriptionResult as LocalTranscriptionResult,
} from './whisper';
import {invokeFormatter, invokeSarvamTranscribe} from './edgeFunctions';
import type {
  DictationSource,
  DictionaryEntry,
  EngineChoice,
  EngineUsed,
  PersonalContext,
  PipelineStatus,
  TranscriptionHistoryItem,
  UserPlan,
} from '../types';

const INDIC_LANGUAGES = new Set(['hi', 'ta', 'ml', 'kn', 'te']);
const MAX_RETRY_COUNT = 3;

type BuildOptions = {
  source: DictationSource;
  audioPath: string;
  durationSeconds: number;
  appName?: string;
  engineChoice: EngineChoice;
  selectedPlan: UserPlan;
  byokKey?: string;
  dictionary: DictionaryEntry[];
  contexts: PersonalContext[];
};

type RetryEnvelope = {
  options: BuildOptions;
  retryCount: number;
};

const retryCache = new Map<string, RetryEnvelope>();

function applyDictionaryAndContexts(
  text: string,
  dictionary: DictionaryEntry[],
  contexts: PersonalContext[],
): string {
  let result = text;

  for (const entry of dictionary) {
    if (!entry.wrong.trim()) {
      continue;
    }
    const escaped = entry.wrong.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    result = result.replace(
      new RegExp(`\\b${escaped}\\b`, 'gi'),
      entry.correct,
    );
  }

  for (const context of contexts) {
    if (!context.trigger.trim()) {
      continue;
    }
    const escaped = context.trigger.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    result = result.replace(
      new RegExp(`\\b${escaped}\\b`, 'gi'),
      context.snippet,
    );
  }

  return result;
}

function countWords(text: string): number {
  const tokens = text.trim().split(/\s+/).filter(Boolean);
  return tokens.length;
}

function shouldRouteToSarvam(input: {
  engineChoice: EngineChoice;
  selectedPlan: UserPlan;
  language?: string;
}): boolean {
  if (input.selectedPlan !== 'premium') {
    return false;
  }

  if (input.engineChoice === 'sarvam') {
    return true;
  }

  return input.language ? INDIC_LANGUAGES.has(input.language) : false;
}

async function runLocalTranscription(audioPath: string): Promise<{
  text: string;
  language: string;
  result: LocalTranscriptionResult;
}> {
  const localResult = await transcribeAudio(audioPath);
  if (!localResult.success || !localResult.text) {
    throw new Error(localResult.error || 'LOCAL_TRANSCRIPTION_FAILED');
  }
  return {
    text: localResult.text,
    language: localResult.language || 'auto',
    result: localResult,
  };
}

export async function runTranscriptionPipeline(
  options: BuildOptions,
  onStatus: (status: PipelineStatus) => void,
  retryCount = 0,
): Promise<TranscriptionHistoryItem> {
  const timestamp = Date.now();
  let engineUsed: EngineUsed = 'local';
  let errorCode: string | undefined;
  let formatted = false;
  let insertionStatus: TranscriptionHistoryItem['insertionStatus'] =
    'clipboard_only';

  try {
    onStatus('transcribing_local');
    const local = await runLocalTranscription(options.audioPath);
    let transcriptText = local.text;
    let language = local.language;

    if (
      shouldRouteToSarvam({
        engineChoice: options.engineChoice,
        selectedPlan: options.selectedPlan,
        language,
      })
    ) {
      try {
        onStatus('transcribing_cloud');
        const sarvam = await invokeSarvamTranscribe({
          audioPath: options.audioPath,
          languageHint: language,
        });
        if (sarvam.text.trim().length > 0) {
          transcriptText = sarvam.text;
          language = sarvam.language || language;
          engineUsed = 'sarvam';
        }
      } catch {
        engineUsed = 'local';
      }
    }

    const personalized = applyDictionaryAndContexts(
      transcriptText,
      options.dictionary,
      options.contexts,
    );

    let finalText = personalized;
    try {
      onStatus('formatting');
      const formattedResponse = await invokeFormatter({
        rawText: personalized,
        dictionary: options.dictionary,
        contexts: options.contexts,
        byokKey: options.byokKey,
      });
      if (formattedResponse.text.trim().length > 0) {
        finalText = formattedResponse.text;
        formatted = true;
      }
    } catch {
      formatted = false;
    }

    onStatus('inserting');
    try {
      Clipboard.setString(finalText);
      insertionStatus = 'clipboard_only';
    } catch {
      insertionStatus = 'failed';
      errorCode = 'INSERTION_FAILED';
    }

    const item: TranscriptionHistoryItem = {
      id: `${timestamp}`,
      text: finalText,
      timestamp,
      wordCount: countWords(finalText),
      duration: options.durationSeconds,
      language,
      status: insertionStatus === 'failed' ? 'failed' : 'success',
      appName: options.appName,
      source: options.source,
      engineUsed,
      formatted,
      insertionStatus,
      retryCount,
      errorCode,
    };

    retryCache.set(item.id, {options, retryCount});
    onStatus(item.status === 'failed' ? 'failed' : 'success');
    return item;
  } catch (err: any) {
    const failed: TranscriptionHistoryItem = {
      id: `${timestamp}`,
      text: '',
      timestamp,
      wordCount: 0,
      duration: options.durationSeconds,
      language: 'auto',
      status: 'failed',
      appName: options.appName,
      source: options.source,
      engineUsed,
      formatted: false,
      insertionStatus: 'failed',
      retryCount,
      errorCode: err?.message || 'PIPELINE_FAILED',
    };

    retryCache.set(failed.id, {options, retryCount});
    onStatus('failed');
    return failed;
  }
}

export async function retryPipeline(
  item: TranscriptionHistoryItem,
  onStatus: (status: PipelineStatus) => void,
): Promise<TranscriptionHistoryItem> {
  const envelope = retryCache.get(item.id);
  if (!envelope) {
    throw new Error('RETRY_PAYLOAD_NOT_FOUND');
  }

  const nextRetryCount = Math.max(item.retryCount + 1, envelope.retryCount + 1);
  if (nextRetryCount > MAX_RETRY_COUNT) {
    throw new Error('MAX_RETRIES_EXCEEDED');
  }

  return runTranscriptionPipeline(envelope.options, onStatus, nextRetryCount);
}
