import React, {useState, useCallback} from 'react';
import {View, Text, Pressable, ScrollView, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {StatusBar} from 'react-native';
import {ChevronLeft} from 'lucide-react-native';
import {Theme} from '../../theme';
import {useApp} from '../../context/AppContext';
import {useAutoSave} from '../../hooks/useAutoSave';
import MorphicCard from '../../components/MorphicCard';
import MorphicInput from '../../components/MorphicInput';
import MorphicButton from '../../components/MorphicButton';
import type {BYOKHubScreenProps} from '../../navigation/types';

export default function BYOKHubScreen({navigation}: BYOKHubScreenProps) {
  const {byokKey, setBYOKKey} = useApp();
  const [apiKey, setApiKey] = useState(byokKey);

  const handleSave = useCallback(
    (value: string) => {
      setBYOKKey(value);
    },
    [setBYOKKey],
  );

  useAutoSave(apiKey, handleSave);

  const handleClear = useCallback(() => {
    setApiKey('');
    setBYOKKey('');
  }, [setBYOKKey]);

  const hasKey = apiKey.trim().length > 0;

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
          <View>
            <Text style={styles.title}>BYOK Hub</Text>
            <Text style={styles.subtitle}>Bring Your Own Key</Text>
          </View>
        </View>

        <MorphicCard style={styles.explanationCard}>
          <Text style={styles.explanationText}>
            Provide your own OpenAI API key to bypass internal limits. Your key
            is stored securely on-device.
          </Text>
        </MorphicCard>

        <View style={styles.inputSection}>
          <MorphicInput
            label="OpenAI API Key"
            value={apiKey}
            onChangeText={setApiKey}
            placeholder="sk-..."
            secureTextEntry
          />
        </View>

        {hasKey && (
          <View style={styles.statusSection}>
            <View style={styles.statusBadge}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>Key configured</Text>
            </View>

            <MorphicButton
              variant="ghost"
              label="Clear Key"
              onPress={handleClear}
              compact
            />
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
  subtitle: {
    fontFamily: Theme.typography.inter,
    fontSize: 13,
    color: Theme.colors.textSecondary,
    marginTop: 2,
  },
  explanationCard: {
    marginBottom: Theme.spacing.xxl,
  },
  explanationText: {
    fontFamily: Theme.typography.inter,
    fontSize: 15,
    color: Theme.colors.textSecondary,
    lineHeight: 22,
  },
  inputSection: {
    marginBottom: Theme.spacing.xl,
  },
  statusSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.sm,
    backgroundColor: Theme.colors.surfaceSecondary,
    borderRadius: Theme.borderRadius.pill,
    paddingVertical: Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.lg,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Theme.colors.green,
  },
  statusText: {
    fontFamily: Theme.typography.interMedium,
    fontSize: 13,
    color: Theme.colors.green,
  },
});
