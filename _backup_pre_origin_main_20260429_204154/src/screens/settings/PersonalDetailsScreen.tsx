import React, {useState, useCallback} from 'react';
import {View, Text, Pressable, ScrollView, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {StatusBar} from 'react-native';
import {ChevronLeft} from 'lucide-react-native';
import {Theme} from '../../theme';
import {useApp} from '../../context/AppContext';
import {useAutoSave} from '../../hooks/useAutoSave';
import MorphicInput from '../../components/MorphicInput';
import type {PersonalDetailsScreenProps} from '../../navigation/types';

export default function PersonalDetailsScreen({
  navigation,
}: PersonalDetailsScreenProps) {
  const {userProfile, setUserProfile} = useApp();
  const [name, setName] = useState(userProfile?.name || '');
  const [age, setAge] = useState(userProfile?.age || '');

  const handleSave = useCallback(
    (values: {name: string; age: string}) => {
      if (userProfile) {
        setUserProfile({
          ...userProfile,
          name: values.name,
          age: values.age,
        });
      }
    },
    [userProfile, setUserProfile],
  );

  useAutoSave({name, age}, handleSave);

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
          <Text style={styles.title}>Personal Details</Text>
        </View>

        <View style={styles.form}>
          <MorphicInput
            label="Name"
            value={name}
            onChangeText={setName}
            placeholder="Your name"
          />
          <MorphicInput
            label="Age"
            value={age}
            onChangeText={setAge}
            placeholder="Your age"
            keyboardType="numeric"
          />
        </View>

        {userProfile?.languages && userProfile.languages.length > 0 && (
          <View style={styles.languagesSection}>
            <Text style={styles.languagesLabel}>Languages</Text>
            <View style={styles.languageChips}>
              {userProfile.languages.map(lang => (
                <View key={lang} style={styles.languageChip}>
                  <Text style={styles.languageChipText}>{lang}</Text>
                </View>
              ))}
            </View>
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
  form: {
    gap: Theme.spacing.xl,
  },
  languagesSection: {
    marginTop: Theme.spacing.xxl,
  },
  languagesLabel: {
    fontFamily: Theme.typography.interMedium,
    fontSize: 14,
    color: Theme.colors.textSecondary,
    marginBottom: Theme.spacing.md,
  },
  languageChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Theme.spacing.sm,
  },
  languageChip: {
    backgroundColor: Theme.colors.surfaceSecondary,
    borderRadius: Theme.borderRadius.pill,
    paddingVertical: Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.lg,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  languageChipText: {
    fontFamily: Theme.typography.interMedium,
    fontSize: 14,
    color: Theme.colors.white,
  },
});
