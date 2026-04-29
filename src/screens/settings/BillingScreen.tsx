import React from 'react';
import {View, Text, Pressable, ScrollView, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {StatusBar} from 'react-native';
import {ChevronLeft, Check, X} from 'lucide-react-native';
import {Theme} from '../../theme';
import {useApp} from '../../context/AppContext';
import MorphicCard from '../../components/MorphicCard';
import MorphicButton from '../../components/MorphicButton';
import type {BillingScreenProps} from '../../navigation/types';

type FeatureComparison = {
  feature: string;
  free: boolean;
  premium: boolean;
};

const FEATURE_TABLE: FeatureComparison[] = [
  {feature: 'Local Whisper transcription', free: true, premium: true},
  {feature: 'Custom dictionary', free: true, premium: true},
  {feature: 'Personal contexts', free: true, premium: true},
  {feature: 'Sarvam AI engine', free: false, premium: true},
  {feature: 'Cloud AI routing', free: false, premium: true},
  {feature: 'Multi-language support', free: false, premium: true},
  {feature: 'Priority processing', free: false, premium: true},
];

const GREEN_ALPHA = Theme.colors.green + '20';

export default function BillingScreen({navigation}: BillingScreenProps) {
  const {selectedPlan} = useApp();
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
          <Text style={styles.title}>Billing & Subscriptions</Text>
        </View>

        {isPremium ? (
          <View style={styles.premiumSection}>
            <MorphicCard glowColor={Theme.colors.green} style={styles.planCard}>
              <View style={styles.planBadge}>
                <Text style={styles.planBadgeText}>Premium</Text>
              </View>
              <Text style={styles.planStatus}>Your subscription is active</Text>
            </MorphicCard>

            <MorphicCard style={styles.detailCard}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Plan</Text>
                <Text style={styles.detailValue}>Premium</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Renewal</Text>
                <Text style={styles.detailValue}>Monthly</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Next billing date</Text>
                <Text style={styles.detailValue}>--</Text>
              </View>
            </MorphicCard>

            <MorphicButton
              variant="outline"
              label="Manage Subscription"
              onPress={() => {}}
            />
          </View>
        ) : (
          <View style={styles.freeSection}>
            <MorphicCard style={styles.freePlanCard}>
              <Text style={styles.freePlanTitle}>You are on the Free plan</Text>
              <Text style={styles.freePlanDescription}>
                Upgrade to Premium to unlock cloud AI, Sarvam engine, and more.
              </Text>
            </MorphicCard>

            <View style={styles.comparisonSection}>
              <View style={styles.comparisonHeader}>
                <Text style={[styles.comparisonCol, styles.comparisonFeature]}>
                  Feature
                </Text>
                <Text style={styles.comparisonCol}>Free</Text>
                <Text
                  style={[styles.comparisonCol, {color: Theme.colors.orange}]}>
                  Premium
                </Text>
              </View>

              {FEATURE_TABLE.map(row => (
                <View key={row.feature} style={styles.comparisonRow}>
                  <Text
                    style={[styles.comparisonCol, styles.comparisonFeature]}
                    numberOfLines={1}>
                    {row.feature}
                  </Text>
                  <View style={styles.comparisonCol}>
                    {row.free ? (
                      <Check size={16} color={Theme.colors.green} />
                    ) : (
                      <X size={16} color={Theme.colors.textSecondary} />
                    )}
                  </View>
                  <View style={styles.comparisonCol}>
                    {row.premium ? (
                      <Check size={16} color={Theme.colors.green} />
                    ) : (
                      <X size={16} color={Theme.colors.textSecondary} />
                    )}
                  </View>
                </View>
              ))}
            </View>

            <MorphicButton label="Upgrade to Premium" onPress={() => {}} />
          </View>
        )}
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
    flex: 1,
  },
  premiumSection: {
    gap: Theme.spacing.xl,
  },
  planCard: {
    alignItems: 'center',
    paddingVertical: Theme.spacing.xxl,
  },
  planBadge: {
    backgroundColor: GREEN_ALPHA,
    borderRadius: Theme.borderRadius.pill,
    paddingVertical: Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.xl,
    marginBottom: Theme.spacing.md,
  },
  planBadgeText: {
    fontFamily: Theme.typography.interSemiBold,
    fontSize: 16,
    color: Theme.colors.green,
  },
  planStatus: {
    fontFamily: Theme.typography.inter,
    fontSize: 14,
    color: Theme.colors.textSecondary,
  },
  detailCard: {
    paddingVertical: Theme.spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Theme.spacing.md,
  },
  detailLabel: {
    fontFamily: Theme.typography.inter,
    fontSize: 14,
    color: Theme.colors.textSecondary,
  },
  detailValue: {
    fontFamily: Theme.typography.interMedium,
    fontSize: 14,
    color: Theme.colors.white,
  },
  divider: {
    height: 1,
    backgroundColor: Theme.colors.border,
  },
  freeSection: {
    gap: Theme.spacing.xl,
  },
  freePlanCard: {
    paddingVertical: Theme.spacing.xxl,
    alignItems: 'center',
  },
  freePlanTitle: {
    fontFamily: Theme.typography.anton,
    fontSize: 22,
    color: Theme.colors.white,
    marginBottom: Theme.spacing.sm,
  },
  freePlanDescription: {
    fontFamily: Theme.typography.inter,
    fontSize: 14,
    color: Theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  comparisonSection: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.default,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    overflow: 'hidden',
  },
  comparisonHeader: {
    flexDirection: 'row',
    paddingVertical: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
  },
  comparisonRow: {
    flexDirection: 'row',
    paddingVertical: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
    alignItems: 'center',
  },
  comparisonCol: {
    width: 60,
    alignItems: 'center',
    fontFamily: Theme.typography.interMedium,
    fontSize: 12,
    color: Theme.colors.textSecondary,
  },
  comparisonFeature: {
    flex: 1,
    fontFamily: Theme.typography.inter,
    fontSize: 13,
    color: Theme.colors.white,
  },
});
