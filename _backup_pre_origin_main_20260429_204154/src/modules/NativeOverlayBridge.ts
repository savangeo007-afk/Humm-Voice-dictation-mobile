import {NativeModules, NativeEventEmitter, Platform} from 'react-native';
import type {EmitterSubscription} from 'react-native';

const {HummBridge} = NativeModules;

/**
 * Typed wrapper around the native `HummBridge` module.
 *
 * Provides:
 * - Permission checks for overlay + accessibility
 * - Launchers for system settings pages
 * - Text injection into the active text field (via accessibility)
 * - Event listeners for floating pill button taps
 */

/* ------------------------------------------------------------------ */
/*  Permission helpers                                                */
/* ------------------------------------------------------------------ */

export type OverlayPermissions = {
  overlay: boolean;
  accessibility: boolean;
  allGranted: boolean;
};

export async function checkOverlayPermission(): Promise<boolean> {
  if (Platform.OS !== 'android') return false;
  return HummBridge.checkOverlayPermission();
}

export async function checkAccessibilityPermission(): Promise<boolean> {
  if (Platform.OS !== 'android') return false;
  return HummBridge.checkAccessibilityPermission();
}

export async function checkAllOverlayPermissions(): Promise<OverlayPermissions> {
  if (Platform.OS !== 'android') {
    return {overlay: false, accessibility: false, allGranted: false};
  }
  return HummBridge.checkAllPermissions();
}

/* ------------------------------------------------------------------ */
/*  Settings launchers                                                */
/* ------------------------------------------------------------------ */

export function openOverlaySettings(): void {
  if (Platform.OS !== 'android') return;
  HummBridge.openOverlaySettings();
}

export function openAccessibilitySettings(): void {
  if (Platform.OS !== 'android') return;
  HummBridge.openAccessibilitySettings();
}

/* ------------------------------------------------------------------ */
/*  Text injection                                                    */
/* ------------------------------------------------------------------ */

export async function injectText(text: string): Promise<boolean> {
  if (Platform.OS !== 'android') return false;
  return HummBridge.injectText(text);
}

/* ------------------------------------------------------------------ */
/*  Manual overlay control                                            */
/* ------------------------------------------------------------------ */

export function showOverlay(): void {
  if (Platform.OS !== 'android') return;
  HummBridge.showOverlay();
}

export function hideOverlay(): void {
  if (Platform.OS !== 'android') return;
  HummBridge.hideOverlay();
}

/* ------------------------------------------------------------------ */
/*  Event emitter                                                     */
/* ------------------------------------------------------------------ */

export type OverlayEvent =
  | 'onDictationStart'
  | 'onDictationCancel'
  | 'onDictationConfirm';

const emitter =
  Platform.OS === 'android' && HummBridge
    ? new NativeEventEmitter(HummBridge)
    : null;

/**
 * Subscribe to events emitted by the native floating pill overlay.
 *
 * - `onDictationStart`  – user tapped the mic button
 * - `onDictationCancel` – user tapped the X button
 * - `onDictationConfirm` – user tapped the ✓ button
 */
export function addOverlayListener(
  event: OverlayEvent,
  callback: () => void,
): EmitterSubscription | undefined {
  return emitter?.addListener(event, callback);
}
