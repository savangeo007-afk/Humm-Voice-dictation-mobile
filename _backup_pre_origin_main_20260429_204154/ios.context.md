iOS System Configuration & Keyboard Extension Context

Overview

Unlike Android's global overlay and accessibility model, the iOS implementation relies on a Custom Keyboard Extension. This extension operates in a highly restrictive sandbox. To provide a seamless experience (transcription, AI formatting, and auto-insertion), specific system-level configurations and shared data containers are required.

1. Keyboard Extension Architecture

A. Extension Lifecycle & Sandbox

Mechanism: The keyboard extension is a separate binary bundled with the main app. It is managed by the iOS InputUI process.

Full Access (RequestsOpenAccess): By default, keyboard extensions have no network access and cannot share data with the parent app.

Requirement: The user must manually enable "Allow Full Access" in iOS Settings. This is non-negotiable for:

Accessing the Microphone for transcription.

Communicating with the parent app's shared container (App Groups).

Making network requests to OpenAI/Sarvam APIs.

Audio Playback: Required to play the success/interaction sounds via the extension.

B. Shared Data via App Groups (group.com.yourbound.app)

Mechanism: Since the Keyboard and Main App are different processes, they do not share UserDefaults or local storage by default.

Implementation: We use App Groups to sync:

User API Keys (BYOK).

Personal Dictionary & Custom Context.

Sound Preferences: A boolean flag (isSoundEnabled) to determine if the dictation sound should play.

Transcription History (if local).

2. iOS Configuration Screen (Onboarding)

Located after the Payment Wall. This screen acts as a technical guide for extension initialization.

Layout: Premium Morphic guide with high-radius curved containers.

Step-by-Step Instructions:

Install Keyboard: Guide to Settings > General > Keyboard > Keyboards > Add New Keyboard.

Enable Full Access: Critical explanation that "Full Access" is required for Microphone, AI features, and Audio feedback.

Select Keyboard: Instructions on using the "Globe" icon to switch to the transcription keyboard.

Deep-Linking: Use UIApplication.shared.open(URL(string: UIApplication.openSettingsURLString)!) to jump the user as close to the keyboard settings as iOS allows.

3. UI/UX: The Keyboard Transformation & Audio Feedback

When the user switches to the app's keyboard extension:

The Morphic Shift: The standard QWERTY layout morphs into a minimalist "Voice Interface."

Elements: A central Pulsing Audio Waveform, Globe icon, and Process (Tick) / Cancel (Cross) buttons.

Audio Feedback (React Native Sound): * Trigger: Upon a successful dictation and the user clicking the "Tick" (Process) button.

Implementation: Initialize Sound from react-native-sound using the asset provided in the /assets/sounds/ directory.

Logic: Check the isSoundEnabled flag from the App Group container before calling .play().

Text Injection: Uses textDocumentProxy to insert formatted text.

4. Technical Monitoring & Fallbacks

Permission Check: The main app monitors if the keyboard extension is active and if "Full Access" is granted.

Watchdog UI: Shows "Setup iOS Keyboard" chip if permissions are missing.

Haptics & Sound: Combines UIImpactFeedbackGenerator with the react-native-sound success clip for a high-end skeuomorphic feel.