import {
  Linking,
  NativeModules,
  PermissionsAndroid,
  Platform,
} from 'react-native';

export type PermissionState = {
  microphone: boolean;
  notifications: boolean;
  overlay: boolean;
  battery: boolean;
};

export async function checkMicrophonePermission(): Promise<boolean> {
  if (Platform.OS !== 'android') {
    return true;
  }
  return PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO);
}

export async function requestMicrophonePermission(): Promise<boolean> {
  if (Platform.OS !== 'android') {
    return true;
  }

  const alreadyGranted = await checkMicrophonePermission();
  if (alreadyGranted) {
    return true;
  }

  const result = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
    {
      title: 'Microphone Access',
      message:
        'Humm needs microphone access to transcribe your voice into text.',
      buttonPositive: 'Grant Access',
      buttonNegative: 'Not Now',
    },
  );
  return result === PermissionsAndroid.RESULTS.GRANTED;
}

export async function checkNotificationPermission(): Promise<boolean> {
  if (Platform.OS !== 'android') {
    return true;
  }
  if (Platform.Version < 33) {
    return true;
  }
  return PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
  );
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (Platform.OS !== 'android') {
    return true;
  }
  if (Platform.Version < 33) {
    return true;
  }

  const alreadyGranted = await checkNotificationPermission();
  if (alreadyGranted) {
    return true;
  }

  const result = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    {
      title: 'Notification Access',
      message:
        'Humm uses notifications to show retry options when auto-paste fails.',
      buttonPositive: 'Allow',
      buttonNegative: 'Not Now',
    },
  );
  return result === PermissionsAndroid.RESULTS.GRANTED;
}

export async function checkOverlayPermission(): Promise<boolean> {
  if (Platform.OS !== 'android') {
    return true;
  }

  const permissionsAndroidAny = PermissionsAndroid as unknown as {
    canDrawOverlays?: () => Promise<boolean>;
  };

  if (permissionsAndroidAny.canDrawOverlays) {
    return permissionsAndroidAny.canDrawOverlays();
  }

  return false;
}

export async function openOverlayPermission(): Promise<void> {
  if (Platform.OS !== 'android') {
    return;
  }
  await Linking.openSettings();
}

export async function checkBatteryOptimizationDisabled(): Promise<boolean> {
  if (Platform.OS !== 'android') {
    return true;
  }
  const moduleAny = NativeModules.IntentLauncher as
    | {isIgnoringBatteryOptimizations?: () => Promise<boolean>}
    | undefined;

  if (moduleAny?.isIgnoringBatteryOptimizations) {
    return moduleAny.isIgnoringBatteryOptimizations();
  }

  return false;
}

export async function openBatteryOptimization(): Promise<void> {
  if (Platform.OS !== 'android') {
    return;
  }
  try {
    const intent = NativeModules.IntentLauncher;
    if (intent?.startActivity) {
      await intent.startActivity({
        action: 'android.settings.IGNORE_BATTERY_OPTIMIZATION_SETTINGS',
      });
      return;
    }
  } catch {}
  await Linking.openSettings();
}

export async function openAccessibilitySettings(): Promise<void> {
  if (Platform.OS !== 'android') {
    return;
  }
  try {
    await Linking.sendIntent('android.settings.ACCESSIBILITY_SETTINGS');
  } catch {
    await Linking.openSettings();
  }
}

export async function getPermissionState(): Promise<PermissionState> {
  const [microphone, notifications, overlay, battery] = await Promise.all([
    checkMicrophonePermission(),
    checkNotificationPermission(),
    checkOverlayPermission(),
    checkBatteryOptimizationDisabled(),
  ]);

  return {microphone, notifications, overlay, battery};
}
