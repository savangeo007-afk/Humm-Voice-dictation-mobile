import React from 'react';
import {StyleSheet, View, type StyleProp, type ViewStyle} from 'react-native';
import {Theme} from '../theme';

type MorphicCardProps = {
  variant?: 'primary' | 'secondary';
  glowColor?: string;
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
};

export default function MorphicCard({
  variant = 'primary',
  glowColor,
  style,
  children,
}: MorphicCardProps) {
  const backgroundColor =
    variant === 'primary'
      ? Theme.colors.surface
      : Theme.colors.surfaceSecondary;

  const borderColor = glowColor ? glowColor + '40' : Theme.colors.border;

  return (
    <View
      style={[
        styles.card,
        {backgroundColor, borderColor},
        glowColor ? Theme.shadows.glow(glowColor) : undefined,
        style,
      ]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Theme.borderRadius.default,
    borderWidth: 1,
    padding: Theme.spacing.lg,
  },
});
