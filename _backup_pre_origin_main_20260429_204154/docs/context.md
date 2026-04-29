Hum: Premium Voice-to-Action Specification

1. Executive Summary

Hum is a high-end voice transcription utility designed for power users who value speed, privacy, and perfect formatting. The core engine is built on a high-performance, offline implementation of OpenAI's Whisper, with an optional cloud-tier for advanced Indic language processing and formatting.

2. The User Experience (UX) Architecture

2.1 The "Morphic" Design Language

The UI follows an Elevated Dark Morphic aesthetic. This moves beyond flat design by giving every element physical weight:

Surfaces: Pure black (#000000) backgrounds with secondary surfaces in grayish-black (#0A0A0A).

Depth: Elements use 1px borders (#1A1A1A) and subtle inner shadows to appear embossed or debossed.

Fluidity: All interactions use spring physics (Damping: 18, Stiffness: 120). Transitions must feel like a single continuous "morph."

No Emojis: Only professional vector icons (Lucide/Phosphor) are permitted.

2.2 Global Navigation: The Floating Pill

A bottom-docked, pill-shaped navigation bar persists across the app.

Skeuomorphic Animation: Icons physically "depress" into the pill when tapped.

Expansion: On the Home screen, the pill can expand into a control center for status monitoring.

3. Technical Architecture & AI Engines

3.1 Primary Engine: Local Whisper (Whisper.cpp)

The "Privacy-First" promise is fulfilled by running OpenAI's Whisper model locally on the device.

Implementation: Utilizing whisper.rn, which wraps Whisper.cpp for high-performance C++ execution on mobile hardware (CoreML on iOS, GGUF/NCNN logic on Android).

Packaging:

Model Management: The app must package/download the base or tiny models. Models must be stored in the app's persistent internal storage, not the cache, to prevent OS deletion.

Resource Allocation: Optimized for 16KB page sizes (Android 2025 standards) to ensure low-latency inference without blocking the UI thread.

Default Behavior: All transcriptions default to this local engine unless the user explicitly opts into "Premium Cloud" mode.

3.2 Optional Secondary Engine: Sarvam AI (Indic Premium)

Sarvam AI serves as an optional, non-conflicting cloud layer.

Trigger: Activated only for specific Indic languages or when the user toggles "Ultra-Accuracy Mode" in settings.

Conflict Resolution: If Sarvam is active, the local Whisper engine is paused to save battery and compute. If Sarvam fails (network error), the system automatically falls back to local Whisper.

3.3 The Formatting Pipeline (Gemini 2.5 Flash)

Once raw text is generated (either by local Whisper or Sarvam), it is sent to Gemini 2.5 Flash for:

Morphic Formatting: Adding punctuation, casing, and structure.

Personalization: Replacing keywords (e.g., "my email") with user-defined data.

4. System Integration (The "Watchdog")

Hum operates globally across the OS:

Android: AccessibilityService for global ACTION_SET_TEXT injection.

iOS: KeyboardExtension using textDocumentProxy for direct insertion.

Sync: react-native-mmkv handles instant settings sync (like "Engine Choice" or "Sound On/Off") between the app and background processes.

5. Key Features: Personalization & Privacy

Local Whisper Engine

Technical: Whisper.cpp (Offline)

Goal: 100% Privacy & Offline usage.

Auto-Pasting Service

Technical: Accessibility (Android) / Extension (iOS)

Goal: Zero-tap text delivery into any app.

Personal Context Engine

Technical: LLM Prompt Injection

Goal: Dynamic substitution (e.g., "My phone" → "+1-555-0199").

Sarvam Cloud Integration

Technical: Optional API Routing

Goal: High-accuracy Indic ASR for complex dialects.

Service Watchdog

Technical: Native Module Listener

Goal: Immediate "Turn On" alerts if OS kills background services.

6. Development Standards

Version: React Native 0.73+ (New Architecture).

Motion: react-native-reanimated for all Morphic transitions.

Audio: react-native-sound for a "Success Chime" on final text injection.

Packaging: Native C++ binaries for Whisper.cpp must be correctly linked in CMakeLists.txt (Android) and Podfile (iOS).


High-End UI/UX & Motion System

Color Theme: Elevated Dark.

Background: #000000 (Pitch Black).

Surfaces/Cards: #0A0A0A (Grayish Black).

Accents/Borders: #1A1A1A (Premium Gray).

Text: #FFFFFF (Primary), #888888 (Secondary).

Typography: * Headers: Anton (Bold, impactful).

Body: Sans Serif (Anthropie/Inter style, clean).

Visual Style: * Glassmorphism & Neumorphism: Subtle depth using blurs and soft shadows.

Curved Edges: No sharp corners; use consistent high-radius rounding for all containers and modals.

Custom Components: No standard "Ugly" React Native Modals. Use custom-built bottom sheets and animated overlays.

Motion: * Spring Physics: All animations must use premium spring damping (no linear transitions).

Smooth Transitions: Page-to-page sliding and element morphing.

Haptic Feedback: Premium touch effects on all interactions.

Tech Stack

Frontend: React Native + TypeScript + react-native-reanimated (for Morphic motion).

Backend: Supabase.

IAP: react-native-iap for Premium features.

AI Engine: whisper.rn (Local), Sarvam AI (Indic Cloud - Premium), OpenAI SDK (BYOK - Premium).

Android Permission & Consent Flow

Since the Android build requires high-level permissions, the onboarding includes a dedicated Consent & Config screen:

Explanation: High-clarity text on why we need specific access.

Action: Clicking "Configure" triggers a sequence taking the user to:

Display Over Other Apps (SYSTEM_ALERT_WINDOW for the Floating Pill).

Microphone Access (RECORD_AUDIO).

Notification Access (For the fallback/retry chips).

Battery Optimization: Requesting "Unrestricted" to prevent the background engine from being killed.

Screen Architecture & User Flow (Comprehensive)

The application consists of a strictly ordered Onboarding Phase, followed by a Main Application accessible via a Floating Pill Navigation Bar.

Phase 1: Onboarding Flow (Strict Sequence)

Get Started (Auth Screen): * UI: Minimalist layout with the app's Home icon centered.

Action: Google Authentication. At the bottom of the screen is a pill-shaped, black-or-white Morphic button labeled "Continue and Sign In".

Payment Wall (paywall.tsx): * Trigger: Appears immediately after successful authentication.

UI: Premium Morphic design detailing subscription tiers to unlock cloud AI features.

About You (Profile): * UI: Clean, highly curved input boxes.

Action: User inputs their Name and Age.

Language Hub: * UI: A searchable list of 100+ languages.

Action: User selects their primary spoken languages.

Sarvam Experience Intro: * UI: The top of the screen features a fully-fitted image (sarvam.png).

Content: Explains that the app's high-fidelity Indic language fluencies are powered by Sarvam AI.

Phase 2: Main Application (Floating Pill Navigation)

After onboarding, the user enters the main app. Navigation is handled by a bottom-docked, floating pill-shaped bar with skeuomorphic depth containing icons for the main features.

Home Page (Dashboard & Feed):

Top Dashboard (4 Morphic Chips):

Total Words: Lifetime word count (increments in real-time).

Apps: Number of different applications the user has auto-pasted into.

WPM: Real-time Words Per Minute calculation.

Languages Spoken: A header with a chip showing detected languages using a dotted color indicator and small font.

Transcription Feed: * Lifetime history separated by single-line dividers.

Interactions: Tapping the text directly triggers a "Tap the text to copy" action. Each entry features a Morphic 3-dot menu opening options to "Retry" or "Delete".

Custom Dictionary:

Purpose: A personalized collection to fix recurring transcription errors (e.g., correcting "Cloud" to "Claude").

UI: Card format. Users add the correct spelling for frequently misunderstood words. The AI engine uses this to automatically correct future transcriptions.

Personal Contexts:

Purpose: Keyword-to-snippet mapping.

Action: Users can add specific phrases. For example, setting "use my email" to map to "user@example.com". When the user says the trigger phrase, the app pastes the mapped snippet.

Main Settings Hub:

UI: Central routing for app configurations.

Privacy Mode Toggle: Located at the bottom of the main settings screen (not a sub-page). A custom Morphic switch.

Logic: Toggling ON routes transcriptions through Cloud AI. Toggling OFF forces Local Whisper. Crucial: Transcriptions already stored in the cloud remain there regardless of future toggle states.

Phase 3: Settings Sub-Screens

Accessible from the Main Settings Hub.

Personal Details:

UI: Full-screen page displaying Name, Age, and Languages used.

Interaction (One-Click Edit): No explicit "Save" buttons. When the user taps their name, the keyboard pops up; typing automatically and instantly saves the new data to the database.

Sarvam Configuration:

UI: Displays the Sarvam logo prominently.

Content: Below the main button, there must be a professional one-liner explicitly stating: "This is a sole project not affiliated with Sarvam."

BYOK Hub (Bring Your Own Key):

Purpose: Allows power users to bypass internal API limits by providing their own OpenAI SDK key.

UI: Secure input field for the OpenAI API Key. Routing must strictly prioritize this key for formatting if provided.

My Billing & Subscriptions:

Action: If the user is on a free tier, tapping this routes them directly back to the paywall.tsx screen to upgrade. Displays current subscription status for premium users.

Implementation Rules

Transition: Use react-navigation with custom shared-element transitions where possible.

Toggles: Use custom animated pill switches, not the native Switch component.

Data Integrity: The Dashboard chips (Words, Apps, WPM) and History Feed must only display real data synced from the Supabase database.

Fallbacks: If a transcript fails to auto-paste, use the Android Notification Context (tiny chip) to allow an immediate "Tap to Retry," and place a "Failed - Retry" card at the top of the Home Feed.