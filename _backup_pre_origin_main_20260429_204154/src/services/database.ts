import {supabase} from './supabase';
import {getCurrentUser} from './auth';
import type {
  AppStats,
  DictionaryEntry,
  EngineChoice,
  PersonalContext,
  TranscriptionHistoryItem,
  UserPlan,
  UserProfile,
} from '../types';

// ─────────────────────────────────────────────
// User Profile
// ─────────────────────────────────────────────

export async function upsertUserProfile(profile: UserProfile): Promise<void> {
  const user = await getCurrentUser();
  if (!user) {
    return;
  }

  await supabase.from('user_profiles').upsert({
    id: user.id,
    name: profile.name,
    age: profile.age,
    languages: profile.languages,
    plan: profile.plan,
    email: profile.email ?? user.email ?? null,
  });
}

export async function fetchUserProfile(): Promise<UserProfile | null> {
  const user = await getCurrentUser();
  if (!user) {
    return null;
  }

  const {data} = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!data) {
    return null;
  }

  return {
    id: data.id,
    name: data.name,
    age: data.age,
    languages: data.languages ?? [],
    plan: data.plan as UserPlan,
    email: data.email ?? undefined,
  };
}

// ─────────────────────────────────────────────
// User Settings
// ─────────────────────────────────────────────

type SettingsPayload = {
  privacyMode: boolean;
  engineChoice: EngineChoice;
  soundEnabled: boolean;
  hapticEnabled: boolean;
  byokKey: string;
};

export async function upsertUserSettings(
  settings: Partial<SettingsPayload>,
): Promise<void> {
  const user = await getCurrentUser();
  if (!user) {
    return;
  }

  const payload: Record<string, unknown> = {id: user.id};
  if (settings.privacyMode !== undefined) {
    payload.privacy_mode = settings.privacyMode;
  }
  if (settings.engineChoice !== undefined) {
    payload.engine_choice = settings.engineChoice;
  }
  if (settings.soundEnabled !== undefined) {
    payload.sound_enabled = settings.soundEnabled;
  }
  if (settings.hapticEnabled !== undefined) {
    payload.haptic_enabled = settings.hapticEnabled;
  }
  if (settings.byokKey !== undefined) {
    payload.byok_key = settings.byokKey;
  }

  await supabase.from('user_settings').upsert(payload);
}

export async function fetchUserSettings(): Promise<Partial<SettingsPayload> | null> {
  const user = await getCurrentUser();
  if (!user) {
    return null;
  }

  const {data} = await supabase
    .from('user_settings')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!data) {
    return null;
  }

  return {
    privacyMode: data.privacy_mode,
    engineChoice: data.engine_choice as EngineChoice,
    soundEnabled: data.sound_enabled,
    hapticEnabled: data.haptic_enabled,
    byokKey: data.byok_key,
  };
}

// ─────────────────────────────────────────────
// Transcriptions
// ─────────────────────────────────────────────

export async function insertTranscription(
  item: TranscriptionHistoryItem,
): Promise<void> {
  const user = await getCurrentUser();
  if (!user) {
    return;
  }

  await supabase.from('transcriptions').insert({
    id: item.id,
    user_id: user.id,
    text: item.text,
    timestamp: item.timestamp,
    word_count: item.wordCount,
    duration_seconds: item.duration ?? null,
    language: item.language,
    status: item.status,
    app_name: item.appName ?? null,
    source: item.source,
    engine_used: item.engineUsed,
    formatted: item.formatted,
    insertion_status: item.insertionStatus,
    retry_count: item.retryCount,
    error_code: item.errorCode ?? null,
  });
}

export async function fetchTranscriptions(
  limit = 50,
  offset = 0,
): Promise<TranscriptionHistoryItem[]> {
  const user = await getCurrentUser();
  if (!user) {
    return [];
  }

  const {data} = await supabase
    .from('transcriptions')
    .select('*')
    .eq('user_id', user.id)
    .order('timestamp', {ascending: false})
    .range(offset, offset + limit - 1);

  if (!data) {
    return [];
  }

  return data.map(row => ({
    id: row.id,
    text: row.text,
    timestamp: Number(row.timestamp),
    wordCount: row.word_count,
    duration: row.duration_seconds ?? undefined,
    language: row.language,
    status: row.status as TranscriptionHistoryItem['status'],
    appName: row.app_name ?? undefined,
    source: row.source as TranscriptionHistoryItem['source'],
    engineUsed: row.engine_used as TranscriptionHistoryItem['engineUsed'],
    formatted: Boolean(row.formatted),
    insertionStatus:
      (row.insertion_status as TranscriptionHistoryItem['insertionStatus']) ??
      'clipboard_only',
    retryCount: row.retry_count ?? 0,
    errorCode: row.error_code ?? undefined,
  }));
}

export async function updateTranscriptionStatus(
  id: string,
  status: TranscriptionHistoryItem['status'],
): Promise<void> {
  const user = await getCurrentUser();
  if (!user) {
    return;
  }

  await supabase
    .from('transcriptions')
    .update({status})
    .eq('id', id)
    .eq('user_id', user.id);
}

export async function deleteTranscription(id: string): Promise<void> {
  const user = await getCurrentUser();
  if (!user) {
    return;
  }

  await supabase
    .from('transcriptions')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);
}

// ─────────────────────────────────────────────
// Stats  (no mock data — calculated from DB)
// ─────────────────────────────────────────────

export async function fetchStats(): Promise<AppStats> {
  const user = await getCurrentUser();
  if (!user) {
    return {totalWords: 0, appsUsed: 0, wpm: 0, languagesSpoken: []};
  }

  const {data} = await supabase
    .from('transcriptions')
    .select('word_count, duration_seconds, language, app_name')
    .eq('user_id', user.id)
    .eq('status', 'success');

  if (!data || data.length === 0) {
    return {totalWords: 0, appsUsed: 0, wpm: 0, languagesSpoken: []};
  }

  const totalWords = data.reduce((sum, row) => sum + (row.word_count ?? 0), 0);

  const appsUsed = new Set(data.map(row => row.app_name).filter(Boolean)).size;

  const totalDuration = data.reduce(
    (sum, row) => sum + (row.duration_seconds ?? 0),
    0,
  );
  const wpm =
    totalDuration > 0 ? Math.round(totalWords / (totalDuration / 60)) : 0;

  const languagesSpoken = Array.from(
    new Set(data.map(row => row.language).filter(Boolean)),
  );

  return {totalWords, appsUsed, wpm, languagesSpoken};
}

// ─────────────────────────────────────────────
// Custom Dictionary
// ─────────────────────────────────────────────

export async function upsertCustomDictionary(
  entries: DictionaryEntry[],
): Promise<void> {
  const user = await getCurrentUser();
  if (!user) {
    return;
  }

  if (entries.length === 0) {
    return;
  }

  await supabase.from('custom_dictionary').upsert(
    entries.map(e => ({
      id: e.id,
      user_id: user.id,
      wrong: e.wrong,
      correct: e.correct,
    })),
    {onConflict: 'user_id,wrong'},
  );
}

export async function deleteCustomDictionaryEntry(id: string): Promise<void> {
  const user = await getCurrentUser();
  if (!user) {
    return;
  }

  await supabase
    .from('custom_dictionary')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);
}

export async function fetchCustomDictionary(): Promise<DictionaryEntry[]> {
  const user = await getCurrentUser();
  if (!user) {
    return [];
  }

  const {data} = await supabase
    .from('custom_dictionary')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', {ascending: true});

  if (!data) {
    return [];
  }

  return data.map(row => ({
    id: row.id,
    wrong: row.wrong,
    correct: row.correct,
  }));
}

// ─────────────────────────────────────────────
// Personal Contexts
// ─────────────────────────────────────────────

export async function upsertPersonalContexts(
  contexts: PersonalContext[],
): Promise<void> {
  const user = await getCurrentUser();
  if (!user) {
    return;
  }

  if (contexts.length === 0) {
    return;
  }

  await supabase.from('personal_contexts').upsert(
    contexts.map(c => ({
      id: c.id,
      user_id: user.id,
      trigger_phrase: c.trigger,
      snippet: c.snippet,
    })),
    {onConflict: 'user_id,trigger_phrase'},
  );
}

export async function deletePersonalContext(id: string): Promise<void> {
  const user = await getCurrentUser();
  if (!user) {
    return;
  }

  await supabase
    .from('personal_contexts')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);
}

export async function fetchPersonalContexts(): Promise<PersonalContext[]> {
  const user = await getCurrentUser();
  if (!user) {
    return [];
  }

  const {data} = await supabase
    .from('personal_contexts')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', {ascending: true});

  if (!data) {
    return [];
  }

  return data.map(row => ({
    id: row.id,
    trigger: row.trigger_phrase,
    snippet: row.snippet,
  }));
}

// ─────────────────────────────────────────────
// Bulk bootstrap  (called after onboarding sign-in)
// ─────────────────────────────────────────────

export async function bootstrapUserData(profile: UserProfile): Promise<void> {
  await Promise.all([
    upsertUserProfile(profile),
    upsertUserSettings({
      privacyMode: true,
      engineChoice: 'local',
      soundEnabled: true,
      hapticEnabled: true,
      byokKey: '',
    }),
  ]);
}
