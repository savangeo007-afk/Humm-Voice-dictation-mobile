import React, {useCallback} from 'react';
import {Pressable, Text, StyleSheet, ViewStyle} from 'react-native';
import Animated from 'react-native-reanimated';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import {Theme} from '../theme';
import {useSpringPress} from '../hooks/useSpringPress';

type MorphicButtonProps = {
  variant?: 'primary' | 'outline' | 'ghost';
  label: string;
  onPress: () => void;
  disabled?: boolean;
  compact?: boolean;
  style?: ViewStyle;
};

export default function MorphicButton({
  variant = 'primary',
  label,
  onPress,
  disabled = false,
  compact = false,
  style,
}: MorphicButtonProps) {
  const {animatedStyle, onPressIn, onPressOut} = useSpringPress(0.96);

  const handlePress = useCallback(() => {
    if (disabled) {
      return;
    }
    ReactNativeHapticFeedback.trigger('impactLight');
    onPress();
  }, [disabled, onPress]);

  const variantStyles = getVariantStyles(variant, disabled);

  return (
    <Animated.View style={[animatedStyle, !compact && styles.fullWidth, style]}>
      <Pressable
        onPress={handlePress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        disabled={disabled}
        style={[
          styles.button,
          variantStyles.button,
          compact && styles.compact,
        ]}>
        <Text style={[styles.label, variantStyles.label]}>{label}</Text>
      </Pressable>
    </Animated.View>
  );
}

function getVariantStyles(variant: string, disabled: boolean) {
  const opacity = disabled ? 0.4 : 1;

  switch (variant) {
    case 'outline':
      return {
        button: {
          backgroundColor: 'transparent',
          borderWidth: 1.5,
          borderColor: Theme.colors.orange,
          opacity,
        },
        label: {
          color: Theme.colors.orange,
        },
      };
    case 'ghost':
      return {
        button: {
          backgroundColor: 'transparent',
          borderWidth: 0,
          opacity,
        },
        label: {
          color: Theme.colors.white,
        },
      };
    default:
      return {
        button: {
          backgroundColor: Theme.colors.orange,
          borderWidth: 0,
          opacity,
        },
        label: {
          color: Theme.colors.white,
        },
      };
  }
}

const styles = StyleSheet.create({
  fullWidth: {
    width: '100%',
  },
  button: {
    borderRadius: Theme.borderRadius.pill,
    paddingVertical: 14,
    paddingHorizontal: Theme.spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compact: {
    alignSelf: 'flex-start',
  },
  label: {
    fontFamily: Theme.typography.interSemiBold,
    fontSize: 16,
  },
});
