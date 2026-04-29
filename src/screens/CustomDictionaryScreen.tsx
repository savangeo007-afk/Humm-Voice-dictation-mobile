import React, {useState, useCallback} from 'react';
import {View, Text, ScrollView, StyleSheet} from 'react-native';
import {Theme} from '../theme';
import {useApp} from '../context/AppContext';
import {deleteCustomDictionaryEntry} from '../services/database';
import MorphicButton from '../components/MorphicButton';
import MorphicInput from '../components/MorphicInput';
import MorphicBottomSheet from '../components/MorphicBottomSheet';
import DictionaryCard from '../components/DictionaryCard';
import type {DictionaryEntry} from '../types';

export function CustomDictionaryContent() {
  const {customDictionary, setCustomDictionary} = useApp();
  const [sheetVisible, setSheetVisible] = useState(false);
  const [deleteSheetVisible, setDeleteSheetVisible] = useState(false);
  const [editingEntry, setEditingEntry] = useState<DictionaryEntry | null>(
    null,
  );
  const [deletingEntry, setDeletingEntry] = useState<DictionaryEntry | null>(
    null,
  );
  const [wrongWord, setWrongWord] = useState('');
  const [correctWord, setCorrectWord] = useState('');

  const handleAdd = useCallback(() => {
    setEditingEntry(null);
    setWrongWord('');
    setCorrectWord('');
    setSheetVisible(true);
  }, []);

  const handleEdit = useCallback((entry: DictionaryEntry) => {
    setEditingEntry(entry);
    setWrongWord(entry.wrong);
    setCorrectWord(entry.correct);
    setSheetVisible(true);
  }, []);

  const handleDeletePrompt = useCallback((entry: DictionaryEntry) => {
    setDeletingEntry(entry);
    setDeleteSheetVisible(true);
  }, []);

  const handleDeleteConfirm = useCallback(() => {
    if (deletingEntry) {
      const updated = customDictionary.filter(e => e.id !== deletingEntry.id);
      setCustomDictionary(updated);
      deleteCustomDictionaryEntry(deletingEntry.id);
    }
    setDeleteSheetVisible(false);
    setDeletingEntry(null);
  }, [deletingEntry, customDictionary, setCustomDictionary]);

  const handleSave = useCallback(() => {
    if (!wrongWord.trim() || !correctWord.trim()) {
      return;
    }

    if (editingEntry) {
      setCustomDictionary(
        customDictionary.map(e =>
          e.id === editingEntry.id
            ? {...e, wrong: wrongWord.trim(), correct: correctWord.trim()}
            : e,
        ),
      );
    } else {
      const newEntry: DictionaryEntry = {
        id: Date.now().toString(),
        wrong: wrongWord.trim(),
        correct: correctWord.trim(),
      };
      setCustomDictionary([...customDictionary, newEntry]);
    }

    setSheetVisible(false);
    setWrongWord('');
    setCorrectWord('');
    setEditingEntry(null);
  }, [
    wrongWord,
    correctWord,
    editingEntry,
    customDictionary,
    setCustomDictionary,
  ]);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.title}>Custom Dictionary</Text>
            <Text style={styles.subtitle}>
              Correct recurring transcription errors
            </Text>
          </View>
          <MorphicButton
            variant="outline"
            compact
            label="Add Word"
            onPress={handleAdd}
          />
        </View>

        {customDictionary.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              Add words that get transcribed incorrectly
            </Text>
          </View>
        ) : (
          customDictionary.map(entry => (
            <DictionaryCard
              key={entry.id}
              entry={entry}
              onEdit={handleEdit}
              onDelete={handleDeletePrompt}
            />
          ))
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>

      <MorphicBottomSheet
        visible={sheetVisible}
        onClose={() => setSheetVisible(false)}>
        <Text style={styles.sheetTitle}>
          {editingEntry ? 'Edit Word' : 'Add Word'}
        </Text>
        <View style={styles.sheetInputs}>
          <MorphicInput
            label="Wrong word"
            value={wrongWord}
            onChangeText={setWrongWord}
            placeholder="e.g. teh"
          />
          <MorphicInput
            label="Correct word"
            value={correctWord}
            onChangeText={setCorrectWord}
            placeholder="e.g. the"
          />
        </View>
        <MorphicButton
          label="Save"
          onPress={handleSave}
          disabled={!wrongWord.trim() || !correctWord.trim()}
        />
      </MorphicBottomSheet>

      <MorphicBottomSheet
        visible={deleteSheetVisible}
        onClose={() => setDeleteSheetVisible(false)}>
        <Text style={styles.sheetTitle}>Delete Entry</Text>
        <Text style={styles.deleteText}>
          Are you sure you want to delete the correction for "
          {deletingEntry?.wrong}"?
        </Text>
        <View style={styles.deleteActions}>
          <MorphicButton
            variant="ghost"
            label="Cancel"
            onPress={() => setDeleteSheetVisible(false)}
            compact
          />
          <MorphicButton label="Delete" onPress={handleDeleteConfirm} compact />
        </View>
      </MorphicBottomSheet>
    </View>
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
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Theme.spacing.xxl,
  },
  headerText: {
    flex: 1,
    marginRight: Theme.spacing.lg,
  },
  title: {
    fontFamily: Theme.typography.anton,
    fontSize: 28,
    color: Theme.colors.white,
    marginBottom: Theme.spacing.xs,
  },
  subtitle: {
    fontFamily: Theme.typography.inter,
    fontSize: 14,
    color: Theme.colors.textSecondary,
  },
  emptyContainer: {
    paddingVertical: Theme.spacing.xxxl,
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: Theme.typography.inter,
    fontSize: 15,
    color: Theme.colors.textSecondary,
    textAlign: 'center',
  },
  bottomSpacer: {
    height: 100,
  },
  sheetTitle: {
    fontFamily: Theme.typography.anton,
    fontSize: 22,
    color: Theme.colors.white,
    marginBottom: Theme.spacing.xl,
  },
  sheetInputs: {
    gap: Theme.spacing.lg,
    marginBottom: Theme.spacing.xl,
  },
  deleteText: {
    fontFamily: Theme.typography.inter,
    fontSize: 15,
    color: Theme.colors.textSecondary,
    marginBottom: Theme.spacing.xl,
    lineHeight: 22,
  },
  deleteActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: Theme.spacing.md,
  },
});
