import {serve} from 'https://deno.land/std@0.224.0/http/server.ts';

const LANGUAGE_MAP: Record<string, string> = {
  hi: 'hi-IN',
  bn: 'bn-IN',
  kn: 'kn-IN',
  ml: 'ml-IN',
  mr: 'mr-IN',
  od: 'od-IN',
  pa: 'pa-IN',
  ta: 'ta-IN',
  te: 'te-IN',
  en: 'en-IN',
  gu: 'gu-IN',
};

function toSarvamLanguageCode(languageHint?: string | null): string {
  if (!languageHint || languageHint === 'auto') {
    return 'unknown';
  }

  return LANGUAGE_MAP[languageHint] ?? languageHint;
}

serve(async req => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', {status: 405});
  }

  try {
    const sarvamKey = Deno.env.get('sarvam_key');
    if (!sarvamKey) {
      return Response.json({error: 'sarvam_key secret missing'}, {status: 500});
    }

    const form = await req.formData();
    const file = form.get('file');
    if (!(file instanceof File)) {
      return Response.json({error: 'file is required'}, {status: 400});
    }

    const upstreamForm = new FormData();
    upstreamForm.append('file', file, file.name || 'humm-dictation.m4a');
    upstreamForm.append('model', 'saaras:v3');
    upstreamForm.append('mode', 'transcribe');
    upstreamForm.append(
      'language_code',
      toSarvamLanguageCode(form.get('languageHint')?.toString()),
    );

    const upstream = await fetch('https://api.sarvam.ai/speech-to-text', {
      method: 'POST',
      headers: {
        'api-subscription-key': sarvamKey,
      },
      body: upstreamForm,
    });

    if (!upstream.ok) {
      const errText = await upstream.text();
      return Response.json(
        {error: 'sarvam_upstream_failed', details: errText},
        {status: 502},
      );
    }

    const data = await upstream.json();
    return Response.json({
      text: data?.transcript ?? '',
      language: data?.language_code ?? 'auto',
    });
  } catch (err) {
    return Response.json(
      {error: 'sarvam_function_failed', details: String(err)},
      {status: 500},
    );
  }
});
