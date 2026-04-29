import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import {Theme} from '../../theme';
import MorphicButton from '../../components/MorphicButton';
import MorphicInput from '../../components/MorphicInput';
import StepIndicator from '../../components/onboarding/StepIndicator';
import type {AboutYouScreenProps} from '../../navigation/types';

export default function AboutYouScreen({navigation}: AboutYouScreenProps) {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');

  const canContinue = name.trim().length > 0;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={Theme.colors.background}
      />

      <View style={styles.header}>
        <StepIndicator totalSteps={7} currentStep={1} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>About You</Text>
        <Text style={styles.subtitle}>Tell us a bit about yourself</Text>

        <View style={styles.inputContainer}>
          <MorphicInput
            label="Your Name"
            value={name}
            onChangeText={setName}
            placeholder="Enter your name"
          />
        </View>

        <View style={styles.inputContainer}>
          <MorphicInput
            label="Your Age"
            value={age}
            onChangeText={setAge}
            placeholder="Enter your age"
            keyboardType="number-pad"
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
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
              onPress={() =>
                navigation.navigate('LanguageHub', {name: name.trim(), age})
              }
              disabled={!canContinue}
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
  title: {
    fontFamily: Theme.typography.anton,
    fontSize: 32,
    color: Theme.colors.textPrimary,
    marginBottom: Theme.spacing.sm,
  },
  subtitle: {
    fontFamily: Theme.typography.inter,
    fontSize: 16,
    color: Theme.colors.textSecondary,
    marginBottom: Theme.spacing.xxl,
  },
  inputContainer: {
    marginBottom: Theme.spacing.xl,
  },
  footer: {
    paddingBottom: Theme.spacing.xxl,
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
