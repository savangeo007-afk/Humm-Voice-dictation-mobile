declare module 'whisper.rn' {
  export type WhisperSegment = {text: string; t0: number; t1: number};

  export type WhisperTranscribeResult = {
    isAborted: boolean;
    language: string;
    result: string;
    segments: WhisperSegment[];
  };

  export type WhisperTranscribeOptions = {
    language?: string;
    translate?: boolean;
    maxLen?: number;
    tokenTimestamps?: boolean;
    onProgress?: (progress: number) => void;
    realtimeAudioSec?: number;
    useVad?: boolean;
  };

  export interface WhisperContext {
    transcribe(
      audioPath: string,
      options: WhisperTranscribeOptions,
    ): {promise: Promise<WhisperTranscribeResult>};
    release(): Promise<void>;
  }

  export function initWhisper(options: {
    filePath: string;
    isBundleAsset?: boolean;
  }): Promise<WhisperContext>;
}
