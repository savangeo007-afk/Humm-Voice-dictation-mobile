import {serve} from 'https://deno.land/std@0.224.0/http/server.ts';

type DictionaryEntry = {wrong: string; correct: string};
type PersonalContext = {trigger: string; snippet: string};

type Payload = {
  rawText?: string;
  dictionary?: DictionaryEntry[];
  contexts?: PersonalContext[];
  byokKey?: string;
};

function applyLocalPersonalization(
  text: string,
  dictionary: DictionaryEntry[],
  contexts: PersonalContext[],
): string {
  let result = text;

  for (const entry of dictionary) {
    if (!entry.wrong?.trim()) continue;
    const escaped = entry.wrong.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    result = result.replace(
      new RegExp(`\\b${escaped}\\b`, 'gi'),
      entry.correct,
    );
  }

  for (const context of contexts) {
    if (!context.trigger?.trim()) continue;
    const escaped = context.trigger.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    result = result.replace(
      new RegExp(`\\b${escaped}\\b`, 'gi'),
      context.snippet,
    );
  }

  return result;
}

serve(async req => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', {status: 405});
  }

  try {
    const body = (await req.json()) as Payload;
    const rawText = body.rawText?.trim() ?? '';

    if (!rawText) {
      return Response.json({error: 'rawText is required'}, {status: 400});
    }

    const dictionary = body.dictionary ?? [];
    const contexts = body.contexts ?? [];
    const personalized = applyLocalPersonalization(
      rawText,
      dictionary,
      contexts,
    );

    const apiKey = body.byokKey || Deno.env.get('sarvam_editor_google_api');
    if (!apiKey) {
      return Response.json({text: personalized});
    }

    const prompt =
      'Format the provided transcript by fixing punctuation and casing while preserving meaning. Return plain text only.';

    const upstream = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{text: `${prompt}\n\nTranscript:\n${personalized}`}],
            },
          ],
          generationConfig: {
            temperature: 0.1,
          },
        }),
      },
    );

    if (!upstream.ok) {
      return Response.json({text: personalized});
    }

    const data = await upstream.json();
    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || personalized;

    return Response.json({text});
  } catch (err) {
    return Response.json(
      {error: 'formatter_function_failed', details: String(err)},
      {status: 500},
    );
  }
});
