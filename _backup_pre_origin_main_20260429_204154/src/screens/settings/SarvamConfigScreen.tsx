import React from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {StatusBar} from 'react-native';
import {ChevronLeft, Check} from 'lucide-react-native';
import {Theme} from '../../theme';
import {useApp} from '../../context/AppContext';
import MorphicCard from '../../components/MorphicCard';
import MorphicButton from '../../components/MorphicButton';
import type {SarvamConfigScreenProps} from '../../navigation/types';

const PREMIUM_FEATURES = [
  'Cloud-powered Sarvam AI engine',
  'Multi-language transcription',
  'Higher accuracy for Indian languages',
  'Priority processing queue',
  'Advanced punctuation and formatting',
];

export default function SarvamConfigScreen({
  navigation,
}: SarvamConfigScreenProps) {
  const {selectedPlan, engineChoice} = useApp();
  const isPremium = selectedPlan === 'premium';

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Pressable
            onPress={() => navigation.goBack()}
            hitSlop={12}
            style={styles.backButton}>
            <ChevronLeft size={24} color={Theme.colors.white} />
          </Pressable>
          <Text style={styles.title}>Sarvam Configuration</Text>
        </View>

        <MorphicCard glowColor={Theme.colors.orange} style={styles.logoCard}>
          <Image
            source={require('../../../Assests/sarvam-image.png')}
            style={styles.sarvamImage}
            resizeMode="cover"
          />
          <Text style={styles.sarvamSubtitle}>
            Indic language transcription engine
          </Text>
        </MorphicCard>

        {isPremium ? (
          <View style={styles.premiumSection}>
            <MorphicCard style={styles.statusCard}>
              <View style={styles.statusRow}>
                <View
                  style={[
                    styles.statusDot,
                    {
                      backgroundColor:
                        engineChoice === 'sarvam'
                          ? Theme.colors.green
                          : Theme.colors.textSecondary,
                    },
                  ]}
                />
                <Text style={styles.statusLabel}>
                  {engineChoice === 'sarvam'
                    ? 'Sarvam engine active'
                    : 'Sarvam engine available'}
                </Text>
              </View>
            </MorphicCard>

            <MorphicCard style={styles.configCard}>
              <Text style={styles.configLabel}>Engine Status</Text>
              <Text style={styles.configValue}>
                {engineChoice === 'sarvam' ? 'Active' : 'Standby'}
              </Text>
            </MorphicCard>
          </View>
        ) : (
          <View style={styles.freeSection}>
            <Text style={styles.upgradeHeading}>Unlock Sarvam AI</Text>
            <Text style={styles.upgradeDescription}>
              Upgrade to Premium to access the Sarvam AI transcription engine
              with enhanced support for Indian languages.
            </Text>

            <View style={styles.featureList}>
              {PREMIUM_FEATURES.map(feature => (
                <View key={feature} style={styles.featureRow}>
                  <View style={styles.checkIcon}>
                    <Check size={16} color={Theme.colors.green} />
                  </View>
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>

            <MorphicButton
              label="Upgrade to Premium"
              onPress={() => navigation.navigate('Billing')}
            />
          </View>
        )}

        <Text style={styles.disclaimer}>
          This is a sole project not affiliated with Sarvam.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Theme.spacing.xl,
    paddingTop: Theme.spacing.lg,
    paddingBottom: Theme.spacing.xxxl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.lg,
    marginBottom: Theme.spacing.xxl,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: Theme.typography.anton,
    fontSize: 24,
    color: Theme.colors.white,
  },
  logoCard: {
    alignItems: 'center',
    paddingVertical: Theme.spacing.xxl,
    marginBottom: Theme.spacing.xxl,
    padding: 0,
    overflow: 'hidden',
  },
  sarvamImage: {
    width: '112%',
    height: 220,
    marginLeft: '-6%',
  },
  sarvamSubtitle: {
    fontFamily: Theme.typography.inter,
    fontSize: 14,
    color: Theme.colors.textSecondary,
  },
  premiumSection: {
    gap: Theme.spacing.lg,
  },
  statusCard: {
    paddingVertical: Theme.spacing.lg,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.md,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  statusLabel: {
    fontFamily: Theme.typography.interMedium,
    fontSize: 15,
    color: Theme.colors.white,
  },
  configCard: {
    paddingVertical: Theme.spacing.lg,
  },
  configLabel: {
    fontFamily: Theme.typography.inter,
    fontSize: 13,
    color: Theme.colors.textSecondary,
    marginBottom: Theme.spacing.xs,
  },
  configValue: {
    fontFamily: Theme.typography.interSemiBold,
    fontSize: 16,
    color: Theme.colors.white,
  },
  freeSection: {
    gap: Theme.spacing.xl,
  },
  upgradeHeading: {
    fontFamily: Theme.typography.anton,
    fontSize: 22,
    color: Theme.colors.white,
  },
  upgradeDescription: {
    fontFamily: Theme.typography.inter,
    fontSize: 15,
    color: Theme.colors.textSecondary,
    lineHeight: 22,
  },
  featureList: {
    gap: Theme.spacing.md,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.md,
  },
  checkIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Theme.colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: {
    fontFamily: Theme.typography.inter,
    fontSize: 15,
    color: Theme.colors.white,
    flex: 1,
  },
  disclaimer: {
    fontFamily: Theme.typography.inter,
    fontSize: 13,
    color: Theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: Theme.spacing.xxxl,
  },
});
