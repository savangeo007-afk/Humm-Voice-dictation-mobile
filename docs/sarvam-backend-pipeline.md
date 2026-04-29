Backend & AI Pipeline Specification

1. The Transcription Pipeline (Two-Stage)

To ensure high-quality output for Indic languages, we use a hybrid approach:

Stage 1: Raw ASR (Speech-to-Text)

Provider: Sarvam AI (saahas model).

Input: Base64 encoded audio (m4a/wav).

Output: Raw, unformatted string (e.g., "hello how are you i am in delhi today").

Stage 2: Morphic Formatting (LLM Post-Processing)

Provider: Gemini 2.5 Flash Preview (gemini-2.5-flash-preview-09-2025).

System Prompt: > "You are a professional editor. Your task is to take the following raw transcription and apply perfect punctuation, capitalization, and logical paragraph breaks. Fix minor phonetic errors (e.g., 'Delhi' instead of 'delhi'). Do not summarize; preserve every word spoken. Output ONLY the formatted text."

Contextual Injection: If the user has "Personal Context" or "Dictionary" entries enabled, inject them into the prompt (e.g., "Note: The user's email is 'user@example.com'. If they say 'my email', replace it with this.").

2. API Implementation Details

Sarvam AI Integration

Endpoint: https://api.sarvam.ai/speech-to-text

Headers: api-subscription-key: ${SARVAM_KEY}

Requirement: Must handle multi-part form data for audio uploads.

Gemini Formatting Integration

Endpoint: https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent

Optimization: Use a low temperature (0.1) to prevent the AI from "hallucinating" or changing the user's words.

3. Auto-Paste & Clipboard Logic

Receive Formatted Text: From Gemini.

Clipboard: Write to system clipboard immediately.

Android (Accessibility): Use the AccessibilityService to find the current AccessibilityNodeInfo and perform ACTION_SET_TEXT.

iOS (Keyboard): Use textDocumentProxy.insertText(text).