import {initWhisper, WhisperContext} from 'whisper.rn';

const MODEL_PATH = 'models/ggml-base.bin';
const INDIC_LANGUAGES = ['hi', 'ta', 'ml', 'kn', 'te'];

let whisperContext: WhisperContext | null = null;

export type TranscriptionResult = {
  success: boolean;
  text?: string;
  language?: string;
  isIndicLanguage?: boolean;
  segments?: Array<{text: string; t0: number; t1: number}>;
  error?: string;
};

export async function initializeWhisper(): Promise<void> {
  if (whisperContext) {
    return;
  }

  try {
    whisperContext = await initWhisper({
      filePath: MODEL_PATH,
      isBundleAsset: true,
    });
  } catch (error: any) {
    throw new Error(`MODEL_LOAD_FAILED: ${error?.message || 'Unknown error'}`);
  }
}

export async function transcribeAudio(
  audioPath: string,
  onProgress?: (progress: number) => void,
): Promise<TranscriptionResult> {
  try {
    if (!whisperContext) {
      await initializeWhisper();
    }

    if (!whisperContext) {
      return {success: false, error: 'MODEL_LOAD_FAILED'};
    }

    const {promise} = whisperContext.transcribe(audioPath, {
      language: 'auto',
      translate: false,
      maxLen: 0,
      tokenTimestamps: false,
      onProgress,
    });

    const result = await promise;

    if (result.isAborted) {
      return {success: false, error: 'TRANSCRIPTION_ABORTED'};
    }

    const detectedLang = result.language;
    const isIndic = INDIC_LANGUAGES.includes(detectedLang);

    return {
      success: true,
      text: result.result,
      language: detectedLang,
      isIndicLanguage: isIndic,
      segments: result.segments,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || 'TRANSCRIPTION_FAILED',
    };
  }
}

export function startRealtimeTranscription(
  onSegment: (text: string, isFinal: boolean) => void,
  options?: {
    realtimeAudioSec?: number;
    useVad?: boolean;
  },
) {
  if (!whisperContext) {
    throw new Error('Whisper not initialized. Call initializeWhisper() first.');
  }

  return whisperContext.transcribe('', {
    language: 'auto',
    translate: false,
    ...options,
  });
}

export async function releaseWhisper(): Promise<void> {
  if (whisperContext) {
    await whisperContext.release();
    whisperContext = null;
  }
}

export function isWhisperInitialized(): boolean {
  return whisperContext !== null;
}
