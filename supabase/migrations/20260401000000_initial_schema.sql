-- =============================================================
-- Humm Voice Dictation Mobile — Initial Schema Migration
-- =============================================================

-- 0. Auto-update updated_at trigger function
-- -------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- =============================================================
-- 1. user_profiles (1:1 with auth.users)
-- =============================================================
CREATE TABLE public.user_profiles (
  id          uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name        text NOT NULL DEFAULT '',
  age         text NOT NULL DEFAULT '',
  languages   text[] NOT NULL DEFAULT '{}',
  plan        text NOT NULL DEFAULT 'free'
              CHECK (plan IN ('free', 'premium')),
  email       text,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER set_updated_at_user_profiles
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON public.user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.user_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.user_profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can delete own profile"
  ON public.user_profiles FOR DELETE
  USING (auth.uid() = id);


-- =============================================================
-- 2. user_settings (1:1 with auth.users)
-- =============================================================
CREATE TABLE public.user_settings (
  id              uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  privacy_mode    boolean NOT NULL DEFAULT true,
  engine_choice   text NOT NULL DEFAULT 'local'
                  CHECK (engine_choice IN ('local', 'sarvam', 'byok')),
  sound_enabled   boolean NOT NULL DEFAULT true,
  haptic_enabled  boolean NOT NULL DEFAULT true,
  byok_key        text NOT NULL DEFAULT '',
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER set_updated_at_user_settings
  BEFORE UPDATE ON public.user_settings
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own settings"
  ON public.user_settings FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own settings"
  ON public.user_settings FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own settings"
  ON public.user_settings FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can delete own settings"
  ON public.user_settings FOR DELETE
  USING (auth.uid() = id);


-- =============================================================
-- 3. transcriptions (1:many, only stored when privacy_mode = false)
-- =============================================================
CREATE TABLE public.transcriptions (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  text              text NOT NULL DEFAULT '',
  timestamp         bigint NOT NULL,
  word_count        integer NOT NULL DEFAULT 0,
  duration_seconds  integer,
  language          text NOT NULL DEFAULT '',
  status            text NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('success', 'pending', 'failed')),
  app_name          text,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_transcriptions_user_id
  ON public.transcriptions(user_id);

CREATE INDEX idx_transcriptions_user_timestamp
  ON public.transcriptions(user_id, timestamp DESC);

CREATE INDEX idx_transcriptions_user_status
  ON public.transcriptions(user_id, status);

CREATE TRIGGER set_updated_at_transcriptions
  BEFORE UPDATE ON public.transcriptions
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.transcriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own transcriptions"
  ON public.transcriptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transcriptions"
  ON public.transcriptions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own transcriptions"
  ON public.transcriptions FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own transcriptions"
  ON public.transcriptions FOR DELETE
  USING (auth.uid() = user_id);


-- =============================================================
-- 4. custom_dictionary (1:many)
-- =============================================================
CREATE TABLE public.custom_dictionary (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  wrong       text NOT NULL,
  correct     text NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, wrong)
);

CREATE INDEX idx_custom_dictionary_user_id
  ON public.custom_dictionary(user_id);

CREATE TRIGGER set_updated_at_custom_dictionary
  BEFORE UPDATE ON public.custom_dictionary
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.custom_dictionary ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own dictionary"
  ON public.custom_dictionary FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own dictionary"
  ON public.custom_dictionary FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own dictionary"
  ON public.custom_dictionary FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own dictionary"
  ON public.custom_dictionary FOR DELETE
  USING (auth.uid() = user_id);


-- =============================================================
-- 5. personal_contexts (1:many)
-- =============================================================
CREATE TABLE public.personal_contexts (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  trigger_phrase  text NOT NULL,
  snippet         text NOT NULL,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, trigger_phrase)
);

CREATE INDEX idx_personal_contexts_user_id
  ON public.personal_contexts(user_id);

CREATE TRIGGER set_updated_at_personal_contexts
  BEFORE UPDATE ON public.personal_contexts
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.personal_contexts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own contexts"
  ON public.personal_contexts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own contexts"
  ON public.personal_contexts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own contexts"
  ON public.personal_contexts FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own contexts"
  ON public.personal_contexts FOR DELETE
  USING (auth.uid() = user_id);
