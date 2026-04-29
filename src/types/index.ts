export type OnboardingData = {
  name: string;
  age: string;
  languages: string[];
};

export type DictationSource = 'floating_icon' | 'keyboard_toolbar';

export type EngineUsed = 'local' | 'sarvam';

export type InsertionStatus = 'inserted' | 'clipboard_only' | 'failed';

export type PipelineStatus =
  | 'idle'
  | 'listening'
  | 'transcribing_local'
  | 'transcribing_cloud'
  | 'formatting'
  | 'inserting'
  | 'success'
  | 'failed';

export type TranscriptionHistoryItem = {
  id: string;
  text: string;
  timestamp: number;
  wordCount: number;
  duration?: number; // seconds, used for WPM calculation
  language: string;
  status: 'success' | 'pending' | 'failed';
  appName?: string;
  source: DictationSource;
  engineUsed: EngineUsed;
  formatted: boolean;
  insertionStatus: InsertionStatus;
  retryCount: number;
  errorCode?: string;
};

export type DictionaryEntry = {
  id: string;
  wrong: string;
  correct: string;
};

export type PersonalContext = {
  id: string;
  trigger: string;
  snippet: string;
};

export type EngineChoice = 'local' | 'sarvam' | 'byok';

export type UserPlan = 'free' | 'premium';

export type UserProfile = {
  id?: string;
  name: string;
  age: string;
  languages: string[];
  plan: UserPlan;
  email?: string;
};

export type AppStats = {
  totalWords: number;
  appsUsed: number;
  wpm: number;
  languagesSpoken: string[];
};
