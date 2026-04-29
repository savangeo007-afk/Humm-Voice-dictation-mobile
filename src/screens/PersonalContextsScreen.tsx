import React, {useState, useCallback} from 'react';
import {View, Text, ScrollView, StyleSheet} from 'react-native';
import {Theme} from '../theme';
import {useApp} from '../context/AppContext';
import {deletePersonalContext} from '../services/database';
import MorphicButton from '../components/MorphicButton';
import MorphicInput from '../components/MorphicInput';
import MorphicBottomSheet from '../components/MorphicBottomSheet';
import ContextCard from '../components/ContextCard';
import type {PersonalContext} from '../types';

export function PersonalContextsContent() {
  const {personalContexts, setPersonalContexts} = useApp();
  const [sheetVisible, setSheetVisible] = useState(false);
  const [deleteSheetVisible, setDeleteSheetVisible] = useState(false);
  const [editingContext, setEditingContext] = useState<PersonalContext | null>(
    null,
  );
  const [deletingContext, setDeletingContext] =
    useState<PersonalContext | null>(null);
  const [triggerPhrase, setTriggerPhrase] = useState('');
  const [snippet, setSnippet] = useState('');

  const handleAdd = useCallback(() => {
    setEditingContext(null);
    setTriggerPhrase('');
    setSnippet('');
    setSheetVisible(true);
  }, []);

  const handleEdit = useCallback((ctx: PersonalContext) => {
    setEditingContext(ctx);
    setTriggerPhrase(ctx.trigger);
    setSnippet(ctx.snippet);
    setSheetVisible(true);
  }, []);

  const handleDeletePrompt = useCallback((ctx: PersonalContext) => {
    setDeletingContext(ctx);
    setDeleteSheetVisible(true);
  }, []);

  const handleDeleteConfirm = useCallback(() => {
    if (deletingContext) {
      const updated = personalContexts.filter(c => c.id !== deletingContext.id);
      setPersonalContexts(updated);
      deletePersonalContext(deletingContext.id);
    }
    setDeleteSheetVisible(false);
    setDeletingContext(null);
  }, [deletingContext, personalContexts, setPersonalContexts]);

  const handleSave = useCallback(() => {
    if (!triggerPhrase.trim() || !snippet.trim()) {
      return;
    }

    if (editingContext) {
      setPersonalContexts(
        personalContexts.map(c =>
          c.id === editingContext.id
            ? {...c, trigger: triggerPhrase.trim(), snippet: snippet.trim()}
            : c,
        ),
      );
    } else {
      const newContext: PersonalContext = {
        id: Date.now().toString(),
        trigger: triggerPhrase.trim(),
        snippet: snippet.trim(),
      };
      setPersonalContexts([...personalContexts, newContext]);
    }

    setSheetVisible(false);
    setTriggerPhrase('');
    setSnippet('');
    setEditingContext(null);
  }, [
    triggerPhrase,
    snippet,
    editingContext,
    personalContexts,
    setPersonalContexts,
  ]);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.title}>Personal Contexts</Text>
            <Text style={styles.subtitle}>
              Map trigger phrases to text snippets
            </Text>
          </View>
          <MorphicButton
            variant="outline"
            compact
            label="Add Context"
            onPress={handleAdd}
          />
        </View>

        {personalContexts.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              Add phrases like "my email" to auto-replace with your actual email
            </Text>
          </View>
        ) : (
          personalContexts.map(ctx => (
            <ContextCard
              key={ctx.id}
              context={ctx}
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
          {editingContext ? 'Edit Context' : 'Add Context'}
        </Text>
        <View style={styles.sheetInputs}>
          <MorphicInput
            label="Trigger phrase"
            value={triggerPhrase}
            onChangeText={setTriggerPhrase}
            placeholder='e.g. "my email"'
          />
          <MorphicInput
            label="Snippet"
            value={snippet}
            onChangeText={setSnippet}
            placeholder="e.g. john@example.com"
            multiline
          />
        </View>
        <MorphicButton
          label="Save"
          onPress={handleSave}
          disabled={!triggerPhrase.trim() || !snippet.trim()}
        />
      </MorphicBottomSheet>

      <MorphicBottomSheet
        visible={deleteSheetVisible}
        onClose={() => setDeleteSheetVisible(false)}>
        <Text style={styles.sheetTitle}>Delete Context</Text>
        <Text style={styles.deleteText}>
          Are you sure you want to delete the context for "
          {deletingContext?.trigger}"?
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
    lineHeight: 22,
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
