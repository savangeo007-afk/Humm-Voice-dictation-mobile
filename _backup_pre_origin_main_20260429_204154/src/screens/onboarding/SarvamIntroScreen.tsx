import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import {Globe, Mic, Zap} from 'lucide-react-native';
import {Theme} from '../../theme';
import MorphicButton from '../../components/MorphicButton';
import MorphicCard from '../../components/MorphicCard';
import StepIndicator from '../../components/onboarding/StepIndicator';
import type {SarvamIntroScreenProps} from '../../navigation/types';

const FEATURES = [
  {
    icon: Globe,
    title: 'Multi-Language Support',
    description:
      'Transcribe across 10+ Indic languages with native-level accuracy.',
  },
  {
    icon: Mic,
    title: 'High-Fidelity Audio',
    description: 'SAARAS captures nuances in tone, dialect, and pronunciation.',
  },
  {
    icon: Zap,
    title: 'Real-Time Processing',
    description: 'Ultra-low latency voice recognition for seamless dictation.',
  },
];

export default function SarvamIntroScreen({
  navigation,
  route,
}: SarvamIntroScreenProps) {
  const params = route.params ?? {};

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={Theme.colors.background}
      />

      <View style={styles.header}>
        <StepIndicator totalSteps={7} currentStep={3} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <MorphicCard
          variant="primary"
          glowColor={Theme.colors.orange}
          style={styles.sarvamCard}>
          <Image
            source={require('../../../Assests/sarvam-image.png')}
            style={styles.sarvamImage}
            resizeMode="cover"
          />
        </MorphicCard>

        <Text style={styles.description}>
          Humm uses Sarvam AI's SAARAS technology for high-fidelity Indic
          language transcription. Experience natural voice recognition in Hindi,
          Tamil, Telugu, Kannada, Malayalam, and more.
        </Text>

        <View style={styles.featureList}>
          {FEATURES.map(feature => (
            <View key={feature.title} style={styles.featureRow}>
              <View style={styles.featureIconContainer}>
                <feature.icon
                  size={24}
                  color={Theme.colors.orange}
                  strokeWidth={2}
                />
              </View>
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>
                  {feature.description}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.caption}>
          Not affliated to sarvam, this is a independent project
        </Text>
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
              variant="primary"
              label="Continue"
              onPress={() => navigation.navigate('Auth', params)}
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: Theme.spacing.xxl,
    paddingBottom: Theme.spacing.xl,
  },
  sarvamCard: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Theme.spacing.xxl,
    marginBottom: Theme.spacing.xxl,
    padding: 0,
    overflow: 'hidden',
  },
  sarvamImage: {
    width: '112%',
    height: 240,
    marginLeft: '-6%',
  },
  description: {
    fontFamily: Theme.typography.inter,
    fontSize: 16,
    color: Theme.colors.textSecondary,
    lineHeight: 24,
    marginBottom: Theme.spacing.xxl,
  },
  featureList: {
    gap: Theme.spacing.lg,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Theme.spacing.lg,
  },
  featureIconContainer: {
    width: 48,
    height: 48,
    borderRadius: Theme.borderRadius.default,
    backgroundColor: Theme.colors.surface,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontFamily: Theme.typography.interSemiBold,
    fontSize: 16,
    color: Theme.colors.textPrimary,
    marginBottom: Theme.spacing.xs,
  },
  featureDescription: {
    fontFamily: Theme.typography.inter,
    fontSize: 14,
    color: Theme.colors.textSecondary,
    lineHeight: 20,
  },
  footer: {
    paddingBottom: Theme.spacing.xxl,
  },
  caption: {
    fontFamily: Theme.typography.inter,
    fontSize: 11,
    color: Theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: Theme.spacing.sm,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: Theme.spacing.md,
  },
  backButton: {
    flex: 1,
  },
  nextButton: {
    flex: 2,
  },
});
