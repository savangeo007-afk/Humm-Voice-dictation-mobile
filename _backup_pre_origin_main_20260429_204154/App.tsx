import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {Theme} from './src/theme';
import {initializeWhisper, isWhisperInitialized} from './src/services/whisper';
import type {RootStackParamList} from './src/navigation/types';
import {useOverlayDictation} from './src/hooks/useOverlayDictation';

const Stack = createNativeStackNavigator<RootStackParamList>();

function HomeScreen(): React.JSX.Element {
  const [whisperStatus, setWhisperStatus] = useState<
    'loading' | 'ready' | 'error'
  >('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    async function loadWhisper() {
      try {
        await initializeWhisper();
        setWhisperStatus('ready');
      } catch (error: any) {
        setWhisperStatus('error');
        setErrorMessage(error?.message || 'Failed to load.');
      }
    }

    if (!isWhisperInitialized()) {
      loadWhisper();
    } else {
      setWhisperStatus('ready');
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Theme.colors.background} />
      <View style={styles.content}>
        <Text style={styles.title}>Humm</Text>
        <Text style={styles.subtitle}>Voice Dictation</Text>

        <View style={styles.statusCard}>
          {whisperStatus === 'loading' && (
            <>
              <ActivityIndicator size="large" color={Theme.colors.orange} />
              <Text style={styles.statusText}>Loading Whisper model...</Text>
            </>
          )}
          {whisperStatus === 'ready' && (
            <>
              <Text style={styles.statusIcon}>●</Text>
              <Text style={[styles.statusText, {color: Theme.colors.green}]}>
                Whisper model ready
              </Text>
            </>
          )}
          {whisperStatus === 'error' && (
            <>
              <Text style={[styles.statusIcon, {color: Theme.colors.orange}]}>
                ●
              </Text>
              <Text style={[styles.statusText, {color: Theme.colors.orange}]}>
                {errorMessage}
              </Text>
            </>
          )}
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={[styles.statValue, {color: Theme.colors.orange}]}>
              0
            </Text>
            <Text style={styles.statLabel}>Total Words</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statValue, {color: Theme.colors.green}]}>
              0
            </Text>
            <Text style={styles.statLabel}>WPM</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statValue, {color: Theme.colors.white}]}>
              0
            </Text>
            <Text style={styles.statLabel}>Streak</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

function App(): React.JSX.Element {
  useOverlayDictation();

  return (
    <GestureHandlerRootView style={styles.root}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            contentStyle: {backgroundColor: Theme.colors.background},
            animation: 'fade',
          }}>
          <Stack.Screen name="Home" component={HomeScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 48,
    fontWeight: '900',
    color: Theme.colors.white,
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 16,
    color: Theme.colors.white,
    opacity: 0.6,
    marginTop: 4,
    marginBottom: 48,
  },
  statusCard: {
    backgroundColor: Theme.colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    padding: 24,
    alignItems: 'center',
    width: '100%',
    marginBottom: 32,
  },
  statusIcon: {
    fontSize: 24,
    color: Theme.colors.green,
    marginBottom: 8,
  },
  statusText: {
    fontSize: 14,
    color: Theme.colors.white,
    marginTop: 12,
    opacity: 0.8,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: Theme.colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    padding: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 32,
    fontWeight: '900',
  },
  statLabel: {
    fontSize: 12,
    color: Theme.colors.white,
    opacity: 0.5,
    marginTop: 4,
  },
});

export default App;
