import React, {useState, useMemo} from 'react';
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
import LanguageChip from '../../components/onboarding/LanguageChip';
import type {LanguageHubScreenProps} from '../../navigation/types';

const ALL_LANGUAGES = [
  'English',
  'Hindi',
  'Tamil',
  'Telugu',
  'Kannada',
  'Malayalam',
  'Bengali',
  'Marathi',
  'Gujarati',
  'Punjabi',
  'Urdu',
  'Odia',
  'Assamese',
  'Maithili',
  'Sanskrit',
  'Nepali',
  'Sindhi',
  'Konkani',
  'Dogri',
  'Manipuri',
  'Bodo',
  'Santali',
  'Kashmiri',
  'Arabic',
  'French',
  'Spanish',
  'German',
  'Portuguese',
  'Italian',
  'Dutch',
  'Russian',
  'Japanese',
  'Korean',
  'Mandarin Chinese',
  'Cantonese',
  'Thai',
  'Vietnamese',
  'Indonesian',
  'Malay',
  'Turkish',
  'Persian',
  'Swahili',
  'Amharic',
  'Yoruba',
  'Igbo',
  'Hausa',
  'Zulu',
  'Afrikaans',
  'Polish',
  'Czech',
  'Romanian',
  'Hungarian',
  'Greek',
  'Swedish',
  'Norwegian',
  'Danish',
  'Finnish',
  'Ukrainian',
  'Bulgarian',
  'Serbian',
  'Croatian',
  'Catalan',
  'Basque',
  'Galician',
  'Welsh',
  'Irish',
  'Scottish Gaelic',
  'Icelandic',
  'Latvian',
  'Lithuanian',
  'Estonian',
  'Slovak',
  'Slovenian',
  'Albanian',
  'Macedonian',
  'Bosnian',
  'Montenegrin',
  'Georgian',
  'Armenian',
  'Azerbaijani',
  'Uzbek',
  'Kazakh',
  'Turkmen',
  'Tajik',
  'Kyrgyz',
  'Mongolian',
  'Burmese',
  'Khmer',
  'Lao',
  'Sinhala',
  'Filipino',
  'Tagalog',
  'Cebuano',
  'Javanese',
  'Sundanese',
  'Malagasy',
  'Somali',
  'Pashto',
  'Dari',
  'Kurdish',
  'Hebrew',
  'Yiddish',
  'Auto-Detect',
];

export default function LanguageHubScreen({
  navigation,
  route,
}: LanguageHubScreenProps) {
  const {name, age} = route.params ?? {};
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string[]>([]);

  const filteredLanguages = useMemo(() => {
    if (!search.trim()) {
      return ALL_LANGUAGES;
    }
    const query = search.toLowerCase().trim();
    return ALL_LANGUAGES.filter(lang => lang.toLowerCase().includes(query));
  }, [search]);

  const toggleLanguage = (language: string) => {
    setSelected(prev =>
      prev.includes(language)
        ? prev.filter(l => l !== language)
        : [...prev, language],
    );
  };

  const canContinue = selected.length > 0;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={Theme.colors.background}
      />

      <View style={styles.header}>
        <StepIndicator totalSteps={7} currentStep={2} />
      </View>

      <Text style={styles.title}>Language Hub</Text>
      <Text style={styles.subtitle}>Select your spoken languages</Text>

      <View style={styles.searchContainer}>
        <MorphicInput
          label="Search languages"
          value={search}
          onChangeText={setSearch}
          placeholder="Type to filter..."
        />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.chipGrid}
        keyboardShouldPersistTaps="handled">
        {filteredLanguages.map(language => (
          <LanguageChip
            key={language}
            language={language}
            selected={selected.includes(language)}
            onPress={() => toggleLanguage(language)}
          />
        ))}
      </ScrollView>

      {selected.length > 0 && (
        <Text style={styles.selectedCount}>
          {selected.length} language{selected.length !== 1 ? 's' : ''} selected
        </Text>
      )}

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
                navigation.navigate('SarvamIntro', {
                  name,
                  age,
                  languages: selected,
                })
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
  title: {
    fontFamily: Theme.typography.anton,
    fontSize: 32,
    color: Theme.colors.textPrimary,
    marginTop: Theme.spacing.xxl,
    marginBottom: Theme.spacing.sm,
  },
  subtitle: {
    fontFamily: Theme.typography.inter,
    fontSize: 16,
    color: Theme.colors.textSecondary,
    marginBottom: Theme.spacing.lg,
  },
  searchContainer: {
    marginBottom: Theme.spacing.lg,
  },
  scrollView: {
    flex: 1,
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Theme.spacing.sm,
    paddingBottom: Theme.spacing.lg,
  },
  selectedCount: {
    fontFamily: Theme.typography.interMedium,
    fontSize: 14,
    color: Theme.colors.orange,
    textAlign: 'center',
    paddingVertical: Theme.spacing.sm,
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
