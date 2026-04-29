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
import type {PersonalContext} from '../types';

type ContextCardProps = {
  context: PersonalContext;
  onEdit: (context: PersonalContext) => void;
  onDelete: (context: PersonalContext) => void;
};

export default function ContextCard({
  context,
  onEdit,
  onDelete,
}: ContextCardProps) {
  const {animatedStyle, onPressIn, onPressOut} = useSpringPress(0.98);

  const handleEdit = useCallback(() => {
    onEdit(context);
  }, [context, onEdit]);

  const handleDelete = useCallback(() => {
    onDelete(context);
  }, [context, onDelete]);

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
              <Text style={styles.trigger} numberOfLines={1}>
                {context.trigger}
              </Text>
              <ArrowRight size={16} color={Theme.colors.textSecondary} />
              <Text style={styles.snippet} numberOfLines={1}>
                {context.snippet}
              </Text>
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
  trigger: {
    fontFamily: Theme.typography.interSemiBold,
    fontSize: 15,
    color: Theme.colors.orange,
    maxWidth: '35%',
  },
  snippet: {
    fontFamily: Theme.typography.inter,
    fontSize: 15,
    color: Theme.colors.white,
    maxWidth: '35%',
  },
  actions: {
    flexDirection: 'row',
    gap: Theme.spacing.md,
  },
  actionBtn: {
    padding: Theme.spacing.xs,
  },
});
