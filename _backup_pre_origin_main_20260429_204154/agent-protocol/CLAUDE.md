# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Mandatory Session Start

Before planning or executing **any** task, read these two files in order:

1. `agent-protocol/lessons.md` — accumulated rules from past corrections; violations repeat known mistakes
2. `agent-protocol/workflow-orchestration,md` — core dev standards (plan mode, subagents, verification, elegance)

Then check `agent-protocol/CLAUDE.md` (this file) for project architecture.

---

## Lessons Auto-Update Rule

After **every** user correction or newly discovered mistake:

1. Open `agent-protocol/lessons.md`
2. Add or update a rule that prevents the exact same mistake
3. Write the rule in the format: `Rule [Category]-[Number] — [Short title]` + one-line explanation
4. Keep iterating until the error rate for that category reaches zero

This is not optional. It is the primary quality loop for this project.

---

## Project Overview

**Humm** is a React Native 0.73+ (New Architecture / Fabric) voice-to-action transcription app for power users. Privacy-first: all transcriptions default to local offline processing. The repository is currently in specification phase — source code scaffolding has not yet begun.

Deep-dive specs live in `docs/`:

| File | Contents |
|------|----------|
| `docs/context.md` | Master spec: features, system integration, architecture decisions |
| `docs/libraryanddependency.md` | Full dependency stack with exact versions |
| `docs/UIconsent.md` | Morphic design system, color palette, animation constants |
| `docs/whispr-setup-guide.md` | Whisper.cpp native integration (NDK, JNI, CMake, model setup) |
| `docs/fallback-mechanishm.md` | Zero-loss fallback chain for all failure modes |
| `docs/backend.md` | Supabase project config, secrets, privacy policy rules |

---

## Architecture

### Three-Tier AI Engine

```
Audio Input
    │
    ▼
[1] Local Whisper (whisper.rn / whisper.cpp)   ← DEFAULT (offline, privacy)
    │  if Indic language detected or Ultra-Accuracy Mode enabled:
    ▼
[2] Sarvam AI (SAARAS v3)                      ← Cloud, Indic languages only
    │  transcription result (from either engine):
    ▼
[3] Gemini 2.5 Flash Formatter                 ← Post-processing (punctuation, casing, personalization)
```

Fallback order on failure: Sarvam → Local Whisper → raw unpunctuated text. Gemini failure → return raw transcription. See `docs/fallback-mechanishm.md` for all UI state transitions.

### System Integration

- **Android**: `AccessibilityService` → `ACTION_SET_TEXT` injection into target app
- **iOS**: `KeyboardExtension` → `textDocumentProxy` injection
- **Settings sync**: `react-native-mmkv` (C++ MMKV) — bridges app ↔ background service instantly

### Storage

- Supabase PostgreSQL — transcription history (only with user consent / privacy mode off)
- MMKV — local cache, app-to-extension sync, offline stats
- Persistent internal storage (NOT cache) — Whisper model files (`ggml-base.bin`)

---

## Key Dependency Stack

```
React Native 0.73.x (New Architecture)
react-navigation/native ^6.x + native-stack ^6.x
react-native-reanimated ~3.6.x      # Spring physics animations
react-native-gesture-handler ^2.14.x
react-native-svg ^14.x
lucide-react-native                 # Icons — NO EMOJIS anywhere in the app
react-native-sound ^0.11.x          # Success chime
react-native-haptic-feedback ^2.x
react-native-iap ^12.x              # Premium subscriptions
react-native-mmkv ^2.x
whisper.rn ^0.x                     # Local transcription
```

Animation constants (non-negotiable): `damping: 18, stiffness: 120, mass: 1`

---

## Design System

**Theme**: "Elevated Dark Morphic" — every element has physical weight.

```
Background:        #000000
Primary Surface:   #0A0A0A
Secondary Surface: #141414
Border:            #1A1A1A
Accent Orange:     #FF9500  (Total Words stat)
Accent Green:      #34C759  (WPM stat)
Text White:        #FFFFFF
```

- **Typography**: Anton for headers, Inter/Anthropie for body
- **No emojis** — ever. Use `lucide-react-native` icons only.
- Minimum border radius: 16pt. All corners curved.
- Custom Morphic Switch (Reanimated, not React Native's Switch)

---

## Whisper.cpp Integration Rules

- Model file: `ggml-base.bin` — do NOT rename, do NOT compress manually
- Android path: `android/app/src/main/assets/models/ggml-base.bin`
- NDK version: `25.2.9519653`; enable `-O3` and NEON for ARM in CMakeLists.txt
- Audio format required: WAV, 16kHz, mono — convert before passing to native
- Always run inference on a background thread — NEVER on the UI thread
- JNI bridge exposes only: `initModel(path)`, `transcribe(audioPath)`, `release()`
- Free context after use; avoid loading multiple models simultaneously

---

## Backend Rules

- Supabase project: `xuywudntgfvuxunkdnlo`
- Secrets (`sarvam_key`, `sarvam_editor_google_api`) live in Supabase Vault — never hardcode in source
- **No mock data** — all metrics fetched from the live `transcriptions` table
- Privacy mode: when enabled, transcriptions are NOT saved. Once saved, data persists even if privacy mode is later enabled. No ambiguity between saved and unsaved states.

---

## Development Workflow (Summary)

Full rules in `agent-protocol/workflow-orchestration,md`. Key rules:

- Enter **plan mode** for any task with 3+ steps or architectural impact
- Use **subagents** for research, exploration, and parallel analysis — keep main context clean
- **Never declare done** without proof: run tests, check logs, verify correctness
- On any correction: **update `agent-protocol/lessons.md` immediately**
- Touch only what is necessary — no scope creep, no speculative abstractions

---

## Project Bootstrap (when source code scaffolding begins)

Standard React Native 0.73 commands will apply:

```bash
npm install                        # Install dependencies
npx react-native run-android       # Run on Android
npx react-native run-ios           # Run on iOS
npx react-native start             # Start Metro bundler
npx jest                           # Run tests
npx jest path/to/test.spec.ts      # Run single test
```

Android NDK and CMakeLists.txt setup is required before first build — see `docs/whispr-setup-guide.md`.
