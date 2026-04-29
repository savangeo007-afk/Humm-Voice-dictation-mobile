import React, {useEffect} from 'react';
import {View, StyleSheet, StatusBar} from 'react-native';
import {Theme} from '../theme';
import HummLogo from '../components/HummLogo';
import {isOnboardingComplete} from '../services/storage';
import type {SplashScreenProps} from '../navigation/types';

export function SplashScreen({
  navigation,
}: SplashScreenProps): React.JSX.Element {
  useEffect(() => {
    const timer = setTimeout(() => {
      const onboarded = isOnboardingComplete();
      navigation.reset({
        index: 0,
        routes: [{name: onboarded ? 'MainApp' : 'GetStarted'}],
      });
    }, 2800);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={Theme.colors.background}
      />
      <HummLogo width={320} animated showText />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
