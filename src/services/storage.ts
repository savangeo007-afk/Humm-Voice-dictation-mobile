import {MMKV} from 'react-native-mmkv';
import type {
  DictationSource,
  EngineUsed,
  InsertionStatus,
  DictionaryEntry,
  EngineChoice,
  PersonalContext,
  TranscriptionHistoryItem,
  UserPlan,
  UserProfile,
} from '../types';

export const storage = new MMKV();

const KEYS = {
  ONBOARDING_COMPLETE: 'onboardingComplete',
  USER_PROFILE: 'userProfile',
  PRIVACY_MODE: 'privacyMode',
  ENGINE_CHOICE: 'engineChoice',
  SOUND_ENABLED: 'soundEnabled',
  HAPTIC_ENABLED: 'hapticEnabled',
  CUSTOM_DICTIONARY: 'customDictionary',
  PERSONAL_CONTEXTS: 'personalContexts',
  BYOK_KEY: 'byokKey',
  SELECTED_PLAN: 'selectedPlan',
  TRANSCRIPTION_HISTORY: 'transcriptionHistory',
} as const;

export function isOnboardingComplete(): boolean {
  return storage.getBoolean(KEYS.ONBOARDING_COMPLETE) ?? false;
}

export function setOnboardingComplete(value: boolean): void {
  storage.set(KEYS.ONBOARDING_COMPLETE, value);
}

export function getUserProfile(): UserProfile | null {
  const json = storage.getString(KEYS.USER_PROFILE);
  if (!json) {
    return null;
  }
  try {
    return JSON.parse(json) as UserProfile;
  } catch {
    return null;
  }
}

export function setUserProfile(profile: UserProfile): void {
  storage.set(KEYS.USER_PROFILE, JSON.stringify(profile));
}

export function getPrivacyMode(): boolean {
  return storage.getBoolean(KEYS.PRIVACY_MODE) ?? true;
}

export function setPrivacyMode(value: boolean): void {
  storage.set(KEYS.PRIVACY_MODE, value);
}

export function getEngineChoice(): EngineChoice {
  return (storage.getString(KEYS.ENGINE_CHOICE) as EngineChoice) ?? 'local';
}

export function setEngineChoice(value: EngineChoice): void {
  storage.set(KEYS.ENGINE_CHOICE, value);
}

export function getSoundEnabled(): boolean {
  return storage.getBoolean(KEYS.SOUND_ENABLED) ?? true;
}

export function setSoundEnabled(value: boolean): void {
  storage.set(KEYS.SOUND_ENABLED, value);
}

export function getHapticEnabled(): boolean {
  return storage.getBoolean(KEYS.HAPTIC_ENABLED) ?? true;
}

export function setHapticEnabled(value: boolean): void {
  storage.set(KEYS.HAPTIC_ENABLED, value);
}

export function getCustomDictionary(): DictionaryEntry[] {
  const json = storage.getString(KEYS.CUSTOM_DICTIONARY);
  if (!json) {
    return [];
  }
  try {
    return JSON.parse(json) as DictionaryEntry[];
  } catch {
    return [];
  }
}

export function setCustomDictionary(entries: DictionaryEntry[]): void {
  storage.set(KEYS.CUSTOM_DICTIONARY, JSON.stringify(entries));
}

export function getPersonalContexts(): PersonalContext[] {
  const json = storage.getString(KEYS.PERSONAL_CONTEXTS);
  if (!json) {
    return [];
  }
  try {
    return JSON.parse(json) as PersonalContext[];
  } catch {
    return [];
  }
}

export function setPersonalContexts(contexts: PersonalContext[]): void {
  storage.set(KEYS.PERSONAL_CONTEXTS, JSON.stringify(contexts));
}

export function getBYOKKey(): string {
  return storage.getString(KEYS.BYOK_KEY) ?? '';
}

export function setBYOKKey(key: string): void {
  storage.set(KEYS.BYOK_KEY, key);
}

export function getSelectedPlan(): UserPlan {
  return (storage.getString(KEYS.SELECTED_PLAN) as UserPlan) ?? 'free';
}

export function setSelectedPlan(plan: UserPlan): void {
  storage.set(KEYS.SELECTED_PLAN, plan);
}

// ─────────────────────────────────────────────
// Transcription History  (always local, persists until uninstall)
// ─────────────────────────────────────────────

export function getTranscriptionHistory(): TranscriptionHistoryItem[] {
  const json = storage.getString(KEYS.TRANSCRIPTION_HISTORY);
  if (!json) {
    return [];
  }
  try {
    const parsed = JSON.parse(json) as Partial<TranscriptionHistoryItem>[];
    return parsed.map(item => ({
      id: item.id ?? `${Date.now()}`,
      text: item.text ?? '',
      timestamp: item.timestamp ?? Date.now(),
      wordCount: item.wordCount ?? 0,
      duration: item.duration,
      language: item.language ?? 'auto',
      status: item.status ?? 'pending',
      appName: item.appName,
      source: (item.source as DictationSource) ?? 'floating_icon',
      engineUsed: (item.engineUsed as EngineUsed) ?? 'local',
      formatted: item.formatted ?? false,
      insertionStatus:
        (item.insertionStatus as InsertionStatus) ?? 'clipboard_only',
      retryCount: item.retryCount ?? 0,
      errorCode: item.errorCode,
    }));
  } catch {
    return [];
  }
}

export function setTranscriptionHistory(
  items: TranscriptionHistoryItem[],
): void {
  storage.set(KEYS.TRANSCRIPTION_HISTORY, JSON.stringify(items));
}

/**
 * Prepends a new transcription to the front of the local history list.
 * Returns the updated list.
 */
export function prependTranscription(
  item: TranscriptionHistoryItem,
): TranscriptionHistoryItem[] {
  const existing = getTranscriptionHistory();
  const updated = [item, ...existing];
  setTranscriptionHistory(updated);
  return updated;
}

/**
 * Removes a transcription by id from local history.
 * Returns the updated list.
 */
export function removeTranscription(id: string): TranscriptionHistoryItem[] {
  const updated = getTranscriptionHistory().filter(t => t.id !== id);
  setTranscriptionHistory(updated);
  return updated;
}
