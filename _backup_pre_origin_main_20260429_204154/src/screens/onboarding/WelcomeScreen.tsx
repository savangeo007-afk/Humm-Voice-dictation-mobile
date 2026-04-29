import React from 'react';
import {View, Text, StyleSheet, StatusBar, SafeAreaView} from 'react-native';
import {CheckCircle} from 'lucide-react-native';
import {Theme} from '../../theme';
import MorphicButton from '../../components/MorphicButton';
import MorphicCard from '../../components/MorphicCard';
import StepIndicator from '../../components/onboarding/StepIndicator';
import {setOnboardingComplete} from '../../services/storage';
import type {WelcomeScreenProps} from '../../navigation/types';

export default function WelcomeScreen({navigation, route}: WelcomeScreenProps) {
  const params = route.params ?? {};
  const {name = 'there', languages = []} = params;

  const handleLetsGo = () => {
    setOnboardingComplete(true);
    navigation.reset({
      index: 0,
      routes: [{name: 'MainApp'}],
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={Theme.colors.background}
      />

      <View style={styles.header}>
        <StepIndicator totalSteps={7} currentStep={6} />
      </View>

      <View style={styles.content}>
        <View style={styles.checkContainer}>
          <CheckCircle size={80} color={Theme.colors.green} strokeWidth={1.5} />
        </View>

        <Text style={styles.title}>You're All Set!</Text>
        <Text style={styles.subtitle}>Your voice assistant is ready</Text>

        <MorphicCard
          variant="secondary"
          glowColor={Theme.colors.green}
          style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Name</Text>
            <Text style={styles.summaryValue}>{name}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Languages</Text>
            <Text style={styles.summaryValue}>{languages.length} selected</Text>
          </View>
        </MorphicCard>
      </View>

      <View style={styles.footer}>
        <MorphicButton
          variant="primary"
          label="Let's Go"
          onPress={handleLetsGo}
        />
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
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkContainer: {
    marginBottom: Theme.spacing.xxl,
    ...Theme.shadows.glow(Theme.colors.green),
  },
  title: {
    fontFamily: Theme.typography.anton,
    fontSize: 36,
    color: Theme.colors.textPrimary,
    marginBottom: Theme.spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: Theme.typography.inter,
    fontSize: 16,
    color: Theme.colors.textSecondary,
    marginBottom: Theme.spacing.xxxl,
    textAlign: 'center',
  },
  summaryCard: {
    width: '100%',
    padding: Theme.spacing.xl,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Theme.spacing.sm,
  },
  summaryLabel: {
    fontFamily: Theme.typography.inter,
    fontSize: 15,
    color: Theme.colors.textSecondary,
  },
  summaryValue: {
    fontFamily: Theme.typography.interSemiBold,
    fontSize: 15,
    color: Theme.colors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: Theme.colors.border,
    marginVertical: Theme.spacing.sm,
  },
  footer: {
    paddingBottom: Theme.spacing.xxl,
  },
});
