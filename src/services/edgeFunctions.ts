import {supabase} from './supabase';
import type {DictionaryEntry, PersonalContext} from '../types';

export async function invokeSarvamTranscribe(input: {
  audioPath: string;
  languageHint?: string;
}): Promise<{text: string; language: string}> {
  const form = new FormData();
  const audioUri = input.audioPath.startsWith('file://')
    ? input.audioPath
    : `file://${input.audioPath}`;

  form.append('file', {
    uri: audioUri,
    name: 'humm-dictation.m4a',
    type: 'audio/mp4',
  } as unknown as Blob);

  if (input.languageHint) {
    form.append('languageHint', input.languageHint);
  }

  const {data, error} = await supabase.functions.invoke('sarvam-transcribe', {
    body: form,
  });

  if (error) {
    throw error;
  }

  return {
    text: data?.text ?? '',
    language: data?.language ?? 'auto',
  };
}

export async function invokeFormatter(input: {
  rawText: string;
  dictionary: DictionaryEntry[];
  contexts: PersonalContext[];
  byokKey?: string;
}): Promise<{text: string}> {
  const {data, error} = await supabase.functions.invoke('format-transcript', {
    body: input,
  });

  if (error) {
    throw error;
  }

  return {text: data?.text ?? input.rawText};
}
