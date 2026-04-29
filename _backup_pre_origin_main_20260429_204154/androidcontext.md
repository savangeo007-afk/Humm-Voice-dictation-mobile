Android System Configuration & Permissions Context

Overview

Because the Voice Transcription App relies on drawing over other applications (the floating pill) and injecting text directly into active input fields (auto-pasting), Android's strict background and accessibility restrictions require a dedicated configuration flow.

This document outlines the required permissions and the specific UI/UX for the Android Configuration Screen during onboarding, as well as the active monitoring required on the Home Screen.

1. Required System Permissions & Accessibilities

A. Accessibility Service (BIND_ACCESSIBILITY_SERVICE)

Purpose: Allows the app to detect which text field the user is currently focused on and automatically paste the transcribed text without requiring manual copying.

Configuration UI: Needs a clear visual guide.

Placeholder for User Image: ![Accessibility Settings Guide](assets/images/android-accessibility-guide.png)

B. Display Over Other Apps (SYSTEM_ALERT_WINDOW)

Purpose: Allows the "Pill" voice animation overlay to appear seamlessly on top of whatever app the user is currently using (e.g., WhatsApp, Chrome).

Configuration UI: Direct deep-link to the "Draw over other apps" settings page.

Placeholder for User Image: ![Overlay Settings Guide](assets/images/android-overlay-guide.png)

C. Keyboard Toolbar Configuration

Purpose: Instructs the user on how to pin or access the app's trigger icon within Gboard or their default keyboard toolbar.

Configuration UI: Step-by-step visual tutorial.

Placeholder for User Image: ![Keyboard Toolbar Guide](assets/images/android-keyboard-guide.png)

D. Battery Optimization (Unrestricted)

Purpose: Prevents Android's aggressive battery management from silently killing the transcription listener in the background.

2. The Android Configuration Screen (Onboarding)

Located immediately after the Payment Wall in the onboarding flow.

Layout: Scrollable step-by-step wizard.

Content: Uses the images provided by the user alongside clear, concise instructions (e.g., "Step 1: Enable Accessibility for Auto-Pasting").

Action: Each step should have a primary button that utilizes Android Intent deep-linking to take the user directly to the exact system settings menu required.

3. Active State Monitoring (Home Screen)

Android OS can revoke Accessibility or Overlay permissions during updates or battery-saver events. The app must continuously monitor the state of these services.

Home Screen Status Chip

Trigger: Monitors the native Android Accessibility state.

Active State: Chip is hidden or shows a subtle green "Active" indicator.

Disabled State: A prominent Morphic chip appears on the Home screen stating "Turn on".

Configuration Alert Modal

Trigger: If the user attempts to use the overlay/pasting while it is disabled, or periodically upon opening the Home screen when the required services are detected as OFF.

UI: A Morphic-styled bottom-sheet modal matching the uicontext.md specifications (curved edges, heavy background blur, smooth spring entrance).

Copy: "This is turned off. In order to auto-paste everything, you need to turn this on."

Action: A prominent button routing the user directly back to the Android settings to re-enable the service.