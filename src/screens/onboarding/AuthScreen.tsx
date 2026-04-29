import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import {Theme} from '../../theme';
import HummLogo from '../../components/HummLogo';
import MorphicButton from '../../components/MorphicButton';
import StepIndicator from '../../components/onboarding/StepIndicator';
import {googleSignIn} from '../../services/auth';
import {setUserProfile} from '../../services/storage';
import {bootstrapUserData} from '../../services/database';
import type {AuthScreenProps} from '../../navigation/types';

export default function AuthScreen({navigation, route}: AuthScreenProps) {
  const params = route.params ?? {};
  const {name = '', age = '', languages = []} = params;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');

    const result = await googleSignIn();

    if (result.success) {
      const profile = {
        name,
        age,
        languages,
        plan: 'free' as const,
        email: result.email,
      };
      setUserProfile(profile);
      // Bulk-save profile + default settings to Supabase
      await bootstrapUserData(profile);
      navigation.navigate('PermissionsConsent', {
        ...params,
        email: result.email,
      });
    } else {
      setError(result.error ?? 'Sign-in failed. Please try again.');
    }

    setLoading(false);
  };

  const handleSkip = () => {
    setUserProfile({
      name,
      age,
      languages,
      plan: 'free',
    });
    navigation.navigate('PermissionsConsent', params);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={Theme.colors.background}
      />

      <View style={styles.header}>
        <StepIndicator totalSteps={7} currentStep={4} />
      </View>

      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <HummLogo width={120} showText={true} />
        </View>

        <Text style={styles.title}>Sign In</Text>
        <Text style={styles.subtitle}>
          Create your account to sync across devices
        </Text>
      </View>

      <View style={styles.footer}>
        {loading && (
          <ActivityIndicator
            size="large"
            color={Theme.colors.orange}
            style={styles.loader}
          />
        )}

        {error.length > 0 && <Text style={styles.errorText}>{error}</Text>}

        <MorphicButton
          variant="primary"
          label="Continue with Google"
          onPress={handleGoogleSignIn}
          disabled={loading}
        />

        <View style={styles.skipContainer}>
          <MorphicButton
            variant="ghost"
            label="Skip for now"
            onPress={handleSkip}
            disabled={loading}
          />
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
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: Theme.spacing.xxl,
  },
  title: {
    fontFamily: Theme.typography.anton,
    fontSize: 32,
    color: Theme.colors.textPrimary,
    marginBottom: Theme.spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: Theme.typography.inter,
    fontSize: 16,
    color: Theme.colors.textSecondary,
    textAlign: 'center',
  },
  footer: {
    paddingBottom: Theme.spacing.xxl,
  },
  loader: {
    marginBottom: Theme.spacing.lg,
  },
  errorText: {
    fontFamily: Theme.typography.inter,
    fontSize: 14,
    color: Theme.colors.error,
    textAlign: 'center',
    marginBottom: Theme.spacing.lg,
  },
  skipContainer: {
    marginTop: Theme.spacing.md,
  },
});
