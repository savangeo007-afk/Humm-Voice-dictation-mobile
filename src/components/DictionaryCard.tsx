import React, {useCallback} from 'react';
import {View, Text, Pressable, StyleSheet} from 'react-native';
import Animated, {
  FadeInDown,
  FadeOutUp,
  LinearTransition,
} from 'react-native-reanimated';
import {ArrowRight, Pencil, Trash2} from 'lucide-react-native';
import {Theme} from '../theme';
import {useSpringPress} from '../hooks/useSpringPress';
import MorphicCard from './MorphicCard';
import type {DictionaryEntry} from '../types';

type DictionaryCardProps = {
  entry: DictionaryEntry;
  onEdit: (entry: DictionaryEntry) => void;
  onDelete: (entry: DictionaryEntry) => void;
};

export default function DictionaryCard({
  entry,
  onEdit,
  onDelete,
}: DictionaryCardProps) {
  const {animatedStyle, onPressIn, onPressOut} = useSpringPress(0.98);

  const handleEdit = useCallback(() => {
    onEdit(entry);
  }, [entry, onEdit]);

  const handleDelete = useCallback(() => {
    onDelete(entry);
  }, [entry, onDelete]);

  return (
    <Animated.View
      style={animatedStyle}
      layout={LinearTransition.springify().damping(Theme.spring.damping).stiffness(Theme.spring.stiffness)}
      entering={FadeInDown.duration(Theme.motion.duration.short)}
      exiting={FadeOutUp.duration(Theme.motion.duration.short)}>
      <Pressable
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        onPress={handleEdit}>
        <MorphicCard style={styles.card}>
          <View style={styles.row}>
            <View style={styles.mapping}>
              <Text style={styles.wrong}>{entry.wrong}</Text>
              <ArrowRight size={16} color={Theme.colors.textSecondary} />
              <Text style={styles.correct}>{entry.correct}</Text>
            </View>
            <View style={styles.actions}>
              <Pressable
                onPress={handleEdit}
                hitSlop={8}
                style={styles.actionBtn}>
                <Pencil size={16} color={Theme.colors.textSecondary} />
              </Pressable>
              <Pressable
                onPress={handleDelete}
                hitSlop={8}
                style={styles.actionBtn}>
                <Trash2 size={16} color={Theme.colors.error} />
              </Pressable>
            </View>
          </View>
        </MorphicCard>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: Theme.spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mapping: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.sm,
    flex: 1,
  },
  wrong: {
    fontFamily: Theme.typography.inter,
    fontSize: 15,
    color: Theme.colors.error,
    textDecorationLine: 'line-through',
  },
  correct: {
    fontFamily: Theme.typography.interSemiBold,
    fontSize: 15,
    color: Theme.colors.green,
  },
  actions: {
    flexDirection: 'row',
    gap: Theme.spacing.md,
  },
  actionBtn: {
    padding: Theme.spacing.xs,
  },
});
