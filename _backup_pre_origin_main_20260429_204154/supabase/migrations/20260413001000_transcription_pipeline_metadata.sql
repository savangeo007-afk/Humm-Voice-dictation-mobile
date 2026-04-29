-- Add metadata for shared dictation pipeline observability and retries

ALTER TABLE public.transcriptions
ADD COLUMN IF NOT EXISTS source text NOT NULL DEFAULT 'floating_icon'
  CHECK (source IN ('floating_icon', 'keyboard_toolbar'));

ALTER TABLE public.transcriptions
ADD COLUMN IF NOT EXISTS engine_used text NOT NULL DEFAULT 'local'
  CHECK (engine_used IN ('local', 'sarvam'));

ALTER TABLE public.transcriptions
ADD COLUMN IF NOT EXISTS formatted boolean NOT NULL DEFAULT false;

ALTER TABLE public.transcriptions
ADD COLUMN IF NOT EXISTS insertion_status text NOT NULL DEFAULT 'clipboard_only'
  CHECK (insertion_status IN ('inserted', 'clipboard_only', 'failed'));

ALTER TABLE public.transcriptions
ADD COLUMN IF NOT EXISTS retry_count integer NOT NULL DEFAULT 0;

ALTER TABLE public.transcriptions
ADD COLUMN IF NOT EXISTS error_code text;

