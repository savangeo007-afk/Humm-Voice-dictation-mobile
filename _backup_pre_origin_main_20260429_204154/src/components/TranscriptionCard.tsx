import React, {useState, useCallback} from 'react';
import {View, Text, Pressable, StyleSheet} from 'react-native';
import Animated, {
  FadeInDown,
  FadeOutUp,
  FadeIn,
  FadeOut,
  LinearTransition,
} from 'react-native-reanimated';
import {MoreVertical, Copy, RotateCcw, Trash2} from 'lucide-react-native';
import {Theme} from '../theme';
import {useSpringPress} from '../hooks/useSpringPress';
import MorphicCard from './MorphicCard';
import type {TranscriptionHistoryItem} from '../types';

type TranscriptionCardProps = {
  item: TranscriptionHistoryItem;
  onCopy: (item: TranscriptionHistoryItem) => void;
  onRetry: (item: TranscriptionHistoryItem) => void;
  onDelete: (item: TranscriptionHistoryItem) => void;
};

export default function TranscriptionCard({
  item,
  onCopy,
  onRetry,
  onDelete,
}: TranscriptionCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const {animatedStyle, onPressIn, onPressOut} = useSpringPress(0.98);

  const handleCopy = useCallback(() => {
    onCopy(item);
    setMenuOpen(false);
  }, [item, onCopy]);

  const handleRetry = useCallback(() => {
    onRetry(item);
    setMenuOpen(false);
  }, [item, onRetry]);

  const handleDelete = useCallback(() => {
    onDelete(item);
    setMenuOpen(false);
  }, [item, onDelete]);

  const timeString = new Date(item.timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  const statusColor =
    item.status === 'success'
      ? Theme.colors.green
      : item.status === 'failed'
      ? Theme.colors.error
      : Theme.colors.orange;

  return (
    <Animated.View
      style={animatedStyle}
      layout={LinearTransition.springify().damping(Theme.spring.damping).stiffness(Theme.spring.stiffness)}
      entering={FadeInDown.duration(Theme.motion.duration.short)}
      exiting={FadeOutUp.duration(Theme.motion.duration.short)}>
      <Pressable
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        onPress={handleCopy}>
        <MorphicCard style={styles.card}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View
                style={[styles.statusDot, {backgroundColor: statusColor}]}
              />
              <Text style={styles.time}>{timeString}</Text>
              <Text style={styles.wordCount}>{item.wordCount} words</Text>
            </View>
            <Pressable
              onPress={() => setMenuOpen(!menuOpen)}
              hitSlop={8}
              style={styles.menuButton}>
              <MoreVertical size={18} color={Theme.colors.textSecondary} />
            </Pressable>
          </View>
          <Text style={styles.text} numberOfLines={3}>
            {item.text}
          </Text>
          {item.language ? (
            <Text style={styles.language}>{item.language}</Text>
          ) : null}
          {menuOpen && (
            <Animated.View
              entering={FadeInDown.duration(Theme.motion.duration.short).withInitialValues({transform: [{translateY: -Theme.motion.lift.md}]})}
              exiting={FadeOut.duration(100)}
              style={styles.menu}>
              <Pressable style={styles.menuItem} onPress={handleCopy}>
                <Copy size={16} color={Theme.colors.white} />
                <Text style={styles.menuItemText}>Copy</Text>
              </Pressable>
              <Pressable style={styles.menuItem} onPress={handleRetry}>
                <RotateCcw size={16} color={Theme.colors.orange} />
                <Text
                  style={[styles.menuItemText, {color: Theme.colors.orange}]}>
                  Retry
                </Text>
              </Pressable>
              <Pressable style={styles.menuItem} onPress={handleDelete}>
                <Trash2 size={16} color={Theme.colors.error} />
                <Text
                  style={[styles.menuItemText, {color: Theme.colors.error}]}>
                  Delete
                </Text>
              </Pressable>
            </Animated.View>
          )}
        </MorphicCard>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: Theme.spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.sm,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.sm,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  time: {
    fontFamily: Theme.typography.inter,
    fontSize: 12,
    color: Theme.colors.textSecondary,
  },
  wordCount: {
    fontFamily: Theme.typography.inter,
    fontSize: 12,
    color: Theme.colors.textSecondary,
  },
  text: {
    fontFamily: Theme.typography.inter,
    fontSize: 15,
    color: Theme.colors.white,
    lineHeight: 22,
  },
  language: {
    fontFamily: Theme.typography.inter,
    fontSize: 11,
    color: Theme.colors.textSecondary,
    marginTop: Theme.spacing.sm,
  },
  menuButton: {
    padding: Theme.spacing.xs,
  },
  menu: {
    marginTop: Theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: Theme.colors.border,
    paddingTop: Theme.spacing.md,
    gap: Theme.spacing.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.sm,
    paddingVertical: Theme.spacing.sm,
  },
  menuItemText: {
    fontFamily: Theme.typography.interMedium,
    fontSize: 14,
    color: Theme.colors.white,
  },
});
