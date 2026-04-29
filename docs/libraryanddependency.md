Voice Transcription App - Library & Dependency Specification

This document outlines the high-performance, compatible library stack required to achieve a premium Morphic UI/UX with functional system integration on Android (API 35) and iOS.

1. Core Framework & Navigation

Library

Version

Purpose

react-native

0.73.x

Base framework (Stable for New Architecture/Fabric).

react-navigation/native

^6.x

Foundation for all screen transitions.

react-navigation/native-stack

^6.x

Native-optimized screen transitions.

2. Morphic Motion & UI

Library

Version

Purpose

react-native-reanimated

~3.6.x

Critical. Used for all spring physics, shared element transitions, and glassmorphism blurs.

react-native-gesture-handler

^2.14.x

Handles complex pan/drag gestures for the floating pill.

react-native-svg

^14.x

Required for professional vector icon rendering.

lucide-react-native

^0.x

Professional, consistent icon set. NO EMOJIS.

3. Audio & Sensory Feedback

Library

Version

Purpose

react-native-sound

^0.11.x

Low-latency playback for the "Success" chime. Supports background/extension execution.

react-native-haptic-feedback

^2.x

Skeuomorphic "click" feels for buttons and toggles.

4. System & Premium Integration

Library

Version

Purpose

react-native-iap

^12.x

Handles the Premium paywall and subscription lifecycle.

react-native-mmkv

^2.x

High-speed C++ based storage for syncing settings (Sound ON/OFF) between App and Extension/Overlay.

whisper.rn

^0.x

Local transcription engine.

5. Implementation & Configuration Guide

A. Custom Morphic Switch (Instead of react-native-switch)

Do not use the standard native switch. Implement a custom component using reanimated:

Thumb: Use withSpring for the position.

Morph Effect: Apply a slight scaleX transformation during the transition to simulate "stretching."

B. Audio Asset Setup

Android: Save success_chime.wav to android/app/src/main/res/raw/.

iOS: Drag success_chime.wav into the Xcode project; ensure it is added to the "Copy Bundle Resources" phase and accessible by the App Group container.

C. The "Elevated Dark" Theme Constants

export const Theme = {
  colors: {
    background: '#000000',
    surface: '#0A0A0A',
    border: '#1A1A1A',
    orange: '#FF9500', // Total Words
    green: '#34C759',  // WPM
    white: '#FFFFFF',  // Text/Streak
  },
  spring: {
    damping: 18,
    stiffness: 120,
    mass: 1,
  }
};


D. Compatibility Warning

Ensure metro.config.js is configured to handle svg and wav assets correctly. For iOS Keyboard Extensions, ensure all libraries used (like react-native-mmkv) are linked to both the Main App and the Extension target in the Podfile.