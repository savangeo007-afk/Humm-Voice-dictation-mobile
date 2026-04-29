import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Theme} from '../theme';
import MorphicCard from './MorphicCard';

type StatChipProps = {
  label: string;
  value: string | number;
  color: string;
};

export default function StatChip({label, value, color}: StatChipProps) {
  return (
    <MorphicCard
      style={[styles.card, Theme.shadows.glow(color)]}
      variant="secondary">
      <View style={styles.content}>
        <Text style={[styles.value, {color}]}>{value}</Text>
        <Text style={styles.label}>{label}</Text>
      </View>
    </MorphicCard>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingVertical: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.lg,
  },
  content: {
    alignItems: 'center',
  },
  value: {
    fontFamily: Theme.typography.anton,
    fontSize: 28,
  },
  label: {
    fontFamily: Theme.typography.inter,
    fontSize: 11,
    color: Theme.colors.textSecondary,
    marginTop: Theme.spacing.xs,
  },
});
