import React, {useCallback} from 'react';
import {Pressable, Text, StyleSheet} from 'react-native';
import Animated, {useAnimatedStyle, withSpring} from 'react-native-reanimated';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import {Theme} from '../../theme';
import {useSpringPress} from '../../hooks/useSpringPress';

type LanguageChipProps = {
  language: string;
  selected: boolean;
  onPress: () => void;
};

export default function LanguageChip({
  language,
  selected,
  onPress,
}: LanguageChipProps) {
  const {animatedStyle, onPressIn, onPressOut} = useSpringPress(0.96);

  const borderStyle = useAnimatedStyle(() => ({
    borderColor: withSpring(
      selected ? Theme.colors.orange : Theme.colors.border,
      Theme.spring,
    ),
  }));

  const handlePress = useCallback(() => {
    ReactNativeHapticFeedback.trigger('impactLight');
    onPress();
  }, [onPress]);

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={handlePress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}>
        <Animated.View
          style={[
            styles.chip,
            borderStyle,
            selected && Theme.shadows.glow(Theme.colors.orange),
          ]}>
          <Text
            style={[
              styles.label,
              {
                color: selected
                  ? Theme.colors.white
                  : Theme.colors.textSecondary,
              },
            ]}>
            {language}
          </Text>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderRadius: Theme.borderRadius.pill,
    borderWidth: 1.5,
    paddingHorizontal: Theme.spacing.lg,
    paddingVertical: Theme.spacing.sm,
  },
  label: {
    fontFamily: Theme.typography.interMedium,
    fontSize: 14,
  },
});
