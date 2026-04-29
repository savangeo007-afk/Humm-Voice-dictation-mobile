import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  AppState,
  ScrollView,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Animated, {FadeIn, FadeOut} from 'react-native-reanimated';
import {Shield, Eye, Layers} from 'lucide-react-native';
import {Theme} from '../../theme';
import MorphicButton from '../../components/MorphicButton';
import MorphicCard from '../../components/MorphicCard';
import {
  checkAllOverlayPermissions,
  openOverlaySettings,
  openAccessibilitySettings,
} from '../../modules/NativeOverlayBridge';
import type {OverlayPermissions} from '../../modules/NativeOverlayBridge';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'OverlayPermissions'>;

/**
 * Full-screen guidance page that walks the user through enabling
 * "Display over other apps" and "Accessibility Service" permissions.
 *
 * Re-checks permissions every time the app returns to the foreground
 * (i.e. after the user comes back from Android Settings).
 */
export default function OverlayPermissionsScreen({navigation}: Props) {
  const [perms, setPerms] = useState<OverlayPermissions>({
    overlay: false,
    accessibility: false,
    allGranted: false,
  });

  const refresh = useCallback(async () => {
    const result = await checkAllOverlayPermissions();
    setPerms(result);
    if (result.allGranted) {
      // If we came from settings, go back; otherwise replace to MainApp
      if (navigation.canGoBack()) {
        navigation.goBack();
      } else {
        navigation.replace('MainApp');
      }
    }
  }, [navigation]);

  // Re-check whenever the app comes back to foreground
  useEffect(() => {
    refresh();
    const sub = AppState.addEventListener('change', state => {
      if (state === 'active') {
        refresh();
      }
    });
    return () => sub.remove();
  }, [refresh]);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconCircle}>
            <Shield size={36} color={Theme.colors.white} strokeWidth={1.5} />
          </View>
          <Text style={styles.title}>Enable System Typing</Text>
          <Text style={styles.subtitle}>
            Humm needs two special permissions to show the dictation button over
            other apps and type your transcriptions directly into text fields.
          </Text>
        </View>

        {/* Permission cards */}
        <Animated.View
          entering={FadeIn.duration(Theme.motion.duration.screen)}
          style={styles.cards}>
          {/* Overlay permission */}
          <MorphicCard style={styles.card}>
            <View style={styles.cardHeader}>
              <Layers
                size={22}
                color={
                  perms.overlay ? Theme.colors.green : Theme.colors.orange
                }
                strokeWidth={2}
              />
              <Text style={styles.cardTitle}>Display Over Other Apps</Text>
            </View>
            <Text style={styles.cardDesc}>
              This lets the Humm floating button appear on top of any app when
              you tap a text field.
            </Text>
            {perms.overlay ? (
              <Animated.View
                entering={FadeIn.duration(200)}
                exiting={FadeOut.duration(200)}>
                <Text style={styles.granted}>✓ Granted</Text>
              </Animated.View>
            ) : (
              <MorphicButton
                label="Open Settings"
                onPress={openOverlaySettings}
                style={styles.btn}
              />
            )}
          </MorphicCard>

          {/* Accessibility permission */}
          <MorphicCard style={styles.card}>
            <View style={styles.cardHeader}>
              <Eye
                size={22}
                color={
                  perms.accessibility
                    ? Theme.colors.green
                    : Theme.colors.orange
                }
                strokeWidth={2}
              />
              <Text style={styles.cardTitle}>Accessibility Service</Text>
            </View>
            <Text style={styles.cardDesc}>
              Humm uses this to detect when you tap into a text field and to
              paste your transcription directly. Find "Humm" in the list and
              enable it.
            </Text>
            {perms.accessibility ? (
              <Animated.View
                entering={FadeIn.duration(200)}
                exiting={FadeOut.duration(200)}>
                <Text style={styles.granted}>✓ Granted</Text>
              </Animated.View>
            ) : (
              <MorphicButton
                label="Open Accessibility Settings"
                onPress={openAccessibilitySettings}
                style={styles.btn}
              />
            )}
          </MorphicCard>
        </Animated.View>

        {/* Skip / go back */}
        <MorphicButton
          label={navigation.canGoBack() ? 'Go back' : 'Skip for now'}
          variant="ghost"
          onPress={() => {
            if (navigation.canGoBack()) {
              navigation.goBack();
            } else {
              navigation.replace('MainApp');
            }
          }}
          style={styles.skip}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  scroll: {
    paddingHorizontal: Theme.spacing.xl,
    paddingTop: Theme.spacing.xxxl,
    paddingBottom: Theme.spacing.xxxl,
  },
  header: {
    alignItems: 'center',
    marginBottom: Theme.spacing.xxl,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Theme.colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Theme.spacing.lg,
  },
  title: {
    fontFamily: Theme.typography.anton,
    fontSize: 28,
    color: Theme.colors.white,
    textAlign: 'center',
    marginBottom: Theme.spacing.sm,
  },
  subtitle: {
    fontFamily: Theme.typography.inter,
    fontSize: 15,
    color: Theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: Theme.spacing.md,
  },
  cards: {
    gap: Theme.spacing.lg,
  },
  card: {
    paddingVertical: Theme.spacing.xl,
    paddingHorizontal: Theme.spacing.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.sm,
    marginBottom: Theme.spacing.sm,
  },
  cardTitle: {
    fontFamily: Theme.typography.interSemiBold,
    fontSize: 16,
    color: Theme.colors.white,
  },
  cardDesc: {
    fontFamily: Theme.typography.inter,
    fontSize: 14,
    color: Theme.colors.textSecondary,
    lineHeight: 20,
    marginBottom: Theme.spacing.lg,
  },
  granted: {
    fontFamily: Theme.typography.interMedium,
    fontSize: 14,
    color: Theme.colors.green,
  },
  btn: {
    alignSelf: 'flex-start',
  },
  skip: {
    marginTop: Theme.spacing.xxl,
    alignSelf: 'center',
  },
});
