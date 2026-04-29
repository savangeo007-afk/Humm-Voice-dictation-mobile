import React from 'react';
import {View, StyleSheet, StatusBar, SafeAreaView} from 'react-native';
import {Theme} from '../../theme';
import HummLogo from '../../components/HummLogo';
import MorphicButton from '../../components/MorphicButton';
import StepIndicator from '../../components/onboarding/StepIndicator';
import type {GetStartedScreenProps} from '../../navigation/types';

export default function GetStartedScreen({navigation}: GetStartedScreenProps) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={Theme.colors.background}
      />

      <View style={styles.header}>
        <StepIndicator totalSteps={7} currentStep={0} />
      </View>

      <View style={styles.logoContainer}>
        <HummLogo width={300} animated={true} />
      </View>

      <View style={styles.footer}>
        <MorphicButton
          variant="primary"
          label="Continue"
          onPress={() => navigation.navigate('AboutYou')}
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
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    paddingBottom: Theme.spacing.xxl,
  },
});
