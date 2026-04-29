Hum: Comprehensive Fallback & Resilience Architecture

This document defines the high-level error handling and data recovery protocols for Hum. The goal is to ensure that no spoken word is lost, even during API timeouts, system service crashes, or network interruptions.

1. The "Zero-Loss" Transcription Pipeline

1.1 AI Engine Handover (Cloud to Local)

Scenario: Sarvam AI (Indic Premium) or Gemini (Formatter) fails due to a 5xx error, timeout (>5s), or loss of internet connectivity.

Automatic Fallback: The system must immediately (within 200ms of failure detection) trigger the Local Whisper Engine.

User Feedback: The Floating Pill/Toolbar shifts from a "Processing" state to a "Local Mode" state (subtle icon change) and continues the task.

Raw Output Guard: If the Gemini Formatter fails but transcription succeeded, the app must return the raw transcription string. It is better to provide unpunctuated text than no text.

1.2 The "Tick" Button Retry Logic

Scenario: The user taps the "Tick" (Process) button, but the request fails before reaching the clipboard/auto-paste layer.

Solution: The "Tick" button morphs into a Retry Icon (Circular Arrow).

State Persistence: The raw audio or the cached raw transcription is held in memory. The user can tap "Retry" up to 3 times before the system offers a "Save to Home" fallback.

2. Auto-Paste & Clipboard Failures

2.1 Manual Fallback for Failed Injection

Scenario: The Accessibility Service (Android) or textDocumentProxy (iOS) fails to inject text into the target field.

Solution: 1. The text is automatically copied to the System Clipboard as a baseline fallback.
2. A "Copy Manual" notification chip appears in the overlay.
3. The failed transcription is instantly synced to the Home Page History Feed.

2.2 Home Page Recovery Sync

Requirement: Any transcription that was not successfully "Processed" (Ticked and Pasted) must appear at the top of the Home Page history.

UI Indication: These items are marked with a "Pending/Failed" status chip.

Action: The user can tap the item to re-copy or trigger a manual "Retry Formatting" using the latest settings. If a transcription completely fails, a "Transcription failed, retry" button is displayed on the card.

3. System Service Watchdog (The "Heartbeat")

3.1 Permission Revocation

Scenario: Android OS disables the Accessibility Service or Overlay permission.

Detection: The app runs a background "Heartbeat" check every time the app comes to the foreground or the overlay is invoked.

The "Turn On" Modal: If services are OFF, a Morphic Bottom Sheet appears immediately.

Logic: "This feature is turned off. To auto-paste and use the overlay, please enable permissions."

Action: Single-tap deep link to the specific Android Settings page.

3.2 Keyboard Extension Crash (iOS)

Scenario: The iOS Keyboard Extension process is killed by the OS.

Recovery: The main app uses the App Group shared container to detect the crash and guides the user to restore the service.

4. Real Data Integrity & Sync

4.1 No Mock Data Policy

Metrics (Words, WPM, Apps): These chips must only display data calculated from the transcriptions table in Supabase. No hardcoded or estimated values.

Sync Logic:

Local to Cloud: Local Whisper transcriptions are cached in MMKV and synced to Supabase as soon as a connection is detected.

Cloud to Local: Global stats are fetched from Supabase and cached locally so the "Morphic Chips" show real data even when offline.

5. Summary of Fallback UI States

API Timeout

UI: Pill shows "Local Mode"

Action: Auto-retry with Whisper

Pasting Failed

UI: Success Sound + Clipboard Copy

Action: Manual Paste / Check Home Feed

Service Killed

UI: Red Pulse on Pill / Home Chip

Action: "Turn On" (Deep Link to Settings)

Auth Expired

UI: Morphic Bottom Sheet

Action: Re-authenticate via Supabase

Critical Error

UI: Card in History Feed

Action: "Transcription failed, retry" button
