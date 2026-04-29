import React, {useCallback, useEffect, useState} from 'react';
import {
  AppState,
  type AppStateStatus,
  View,
  Text,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import {
  Layers,
  Mic,
  Bell,
  BatteryCharging,
  CheckCircle,
} from 'lucide-react-native';
import {Theme} from '../../theme';
import MorphicButton from '../../components/MorphicButton';
import MorphicCard from '../../components/MorphicCard';
import StepIndicator from '../../components/onboarding/StepIndicator';
import {
  checkBatteryOptimizationDisabled,
  checkMicrophonePermission,
  checkNotificationPermission,
  checkOverlayPermission,
  getPermissionState,
  requestMicrophonePermission,
  requestNotificationPermission,
  openOverlayPermission,
  openBatteryOptimization,
} from '../../utils/permissions';
import type {PermissionsConsentScreenProps} from '../../navigation/types';

type PermissionItem = {
  id: 'overlay' | 'microphone' | 'notifications' | 'battery';
  icon: typeof Layers;
  title: string;
  description: string;
  request: () => Promise<void>;
  check: () => Promise<boolean>;
};

const PERMISSIONS: PermissionItem[] = [
  {
    id: 'overlay',
    icon: Layers,
    title: 'Display Overlay',
    description:
      'Show the floating dictation bubble on top of other apps so you can dictate anywhere.',
    request: async () => {
      await openOverlayPermission();
    },
    check: checkOverlayPermission,
  },
  {
    id: 'microphone',
    icon: Mic,
    title: 'Microphone Access',
    description:
      'Listen to your voice and convert speech to text in real time.',
    request: async () => {
      await requestMicrophonePermission();
    },
    check: checkMicrophonePermission,
  },
  {
    id: 'notifications',
    icon: Bell,
    title: 'Notifications',
    description:
      'Show retry options when auto-paste fails and keep you informed of transcription status.',
    request: async () => {
      await requestNotificationPermission();
    },
    check: checkNotificationPermission,
  },
  {
    id: 'battery',
    icon: BatteryCharging,
    title: 'Battery Optimization',
    description:
      'Prevent the system from stopping Humm in the background while you dictate.',
    request: async () => {
      await openBatteryOptimization();
    },
    check: checkBatteryOptimizationDisabled,
  },
];

export default function PermissionsConsentScreen({
  navigation,
  route,
}: PermissionsConsentScreenProps) {
  const params = route.params ?? {};

  const [granted, setGranted] = useState<Record<PermissionItem['id'], boolean>>(
    {
      overlay: false,
      microphone: false,
      notifications: false,
      battery: false,
    },
  );

  const refreshPermissions = useCallback(async () => {
    const state = await getPermissionState();
    setGranted({
      overlay: state.overlay,
      microphone: state.microphone,
      notifications: state.notifications,
      battery: state.battery,
    });
  }, []);

  useEffect(() => {
    refreshPermissions();
  }, [refreshPermissions]);

  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      // Re-check permissions after returning from Android settings screens.
      if (nextAppState === 'active') {
        refreshPermissions();
      }
    };

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );
    return () => {
      subscription.remove();
    };
  }, [refreshPermissions]);

  const handleRequestPermission = useCallback(
    async (permission: PermissionItem) => {
      await permission.request();
      const grantedNow = await permission.check();
      setGranted(prev => ({...prev, [permission.id]: grantedNow}));
    },
    [],
  );

  const handleConfigureAll = useCallback(async () => {
    for (const permission of PERMISSIONS) {
      if (!granted[permission.id]) {
        await permission.request();
        const grantedNow = await permission.check();
        setGranted(prev => ({...prev, [permission.id]: grantedNow}));
      }
    }
  }, [granted]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={Theme.colors.background}
      />

      <View style={styles.header}>
        <StepIndicator totalSteps={7} currentStep={5} />
      </View>

      <Text style={styles.title}>App Permissions</Text>
      <Text style={styles.subtitle}>
        Humm needs a few permissions to work its magic
      </Text>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {PERMISSIONS.map(permission => {
          const isGranted = granted[permission.id] === true;
          const IconComponent = permission.icon;

          return (
            <MorphicCard key={permission.id} style={styles.permissionCard}>
              <View style={styles.permissionRow}>
                <View style={styles.permissionIconContainer}>
                  <IconComponent
                    size={24}
                    color={isGranted ? Theme.colors.green : Theme.colors.orange}
                    strokeWidth={2}
                  />
                </View>
                <View style={styles.permissionInfo}>
                  <Text style={styles.permissionTitle}>{permission.title}</Text>
                  <Text style={styles.permissionDescription}>
                    {permission.description}
                  </Text>
                </View>
                {isGranted ? (
                  <CheckCircle
                    size={28}
                    color={Theme.colors.green}
                    strokeWidth={2}
                  />
                ) : (
                  <View style={styles.enableButtonContainer}>
                    <MorphicButton
                      variant="outline"
                      label="Enable"
                      onPress={() => handleRequestPermission(permission)}
                      compact
                    />
                  </View>
                )}
              </View>
            </MorphicCard>
          );
        })}
      </ScrollView>

      <View style={styles.footer}>
        <MorphicButton
          variant="primary"
          label="Configure All"
          onPress={handleConfigureAll}
        />

        <View style={styles.buttonRow}>
          <View style={styles.backButton}>
            <MorphicButton
              variant="ghost"
              label="Back"
              onPress={() => navigation.goBack()}
            />
          </View>
          <View style={styles.nextButton}>
            <MorphicButton
              variant="ghost"
              label="Skip"
              onPress={() => navigation.navigate('Welcome', params)}
            />
          </View>
          <View style={styles.nextButton}>
            <MorphicButton
              variant="primary"
              label="Next"
              onPress={() => navigation.navigate('Welcome', params)}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
    paddingHorizontal: Theme.spacing.xl,
  },
  header: {
    paddingTop: Theme.spacing.lg,
  },
  title: {
    fontFamily: Theme.typography.anton,
    fontSize: 32,
    color: Theme.colors.textPrimary,
    marginTop: Theme.spacing.xxl,
    marginBottom: Theme.spacing.sm,
  },
  subtitle: {
    fontFamily: Theme.typography.inter,
    fontSize: 16,
    color: Theme.colors.textSecondary,
    marginBottom: Theme.spacing.xl,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    gap: Theme.spacing.md,
    paddingBottom: Theme.spacing.lg,
  },
  permissionCard: {
    padding: Theme.spacing.lg,
  },
  permissionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.md,
  },
  permissionIconContainer: {
    width: 44,
    height: 44,
    borderRadius: Theme.borderRadius.default,
    backgroundColor: Theme.colors.surface,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  permissionInfo: {
    flex: 1,
  },
  permissionTitle: {
    fontFamily: Theme.typography.interSemiBold,
    fontSize: 15,
    color: Theme.colors.textPrimary,
    marginBottom: Theme.spacing.xs,
  },
  permissionDescription: {
    fontFamily: Theme.typography.inter,
    fontSize: 13,
    color: Theme.colors.textSecondary,
    lineHeight: 18,
  },
  enableButtonContainer: {
    minWidth: 80,
  },
  footer: {
    paddingBottom: Theme.spacing.xxl,
    gap: Theme.spacing.md,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: Theme.spacing.md,
  },
  backButton: {
    flex: 1,
  },
  nextButton: {
    flex: 1,
  },
});
