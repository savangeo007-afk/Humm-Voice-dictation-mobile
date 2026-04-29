import React, {useCallback} from 'react';
import {Pressable, StyleSheet} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolateColor,
  interpolate,
} from 'react-native-reanimated';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import {Theme} from '../theme';

const TRACK_WIDTH = 52;
const TRACK_HEIGHT = 30;
const THUMB_SIZE = 26;
const THUMB_MARGIN = 2;
const TRAVEL = TRACK_WIDTH - THUMB_SIZE - THUMB_MARGIN * 2;

type MorphicSwitchProps = {
  value: boolean;
  onValueChange: (val: boolean) => void;
  disabled?: boolean;
};

export default function MorphicSwitch({
  value,
  onValueChange,
  disabled = false,
}: MorphicSwitchProps) {
  const progress = useSharedValue(value ? 1 : 0);

  React.useEffect(() => {
    progress.value = withSpring(value ? 1 : 0, Theme.spring);
  }, [value, progress]);

  const handleToggle = useCallback(() => {
    if (disabled) {
      return;
    }
    ReactNativeHapticFeedback.trigger('impactLight');
    onValueChange(!value);
  }, [disabled, onValueChange, value]);

  const trackStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      [Theme.colors.border, Theme.colors.orange],
    ),
  }));

  const thumbStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      progress.value,
      [0, 1],
      [THUMB_MARGIN, THUMB_MARGIN + TRAVEL],
    );

    const scaleX = interpolate(progress.value, [0, 0.5, 1], [1, 1.3, 1]);

    return {
      transform: [{translateX}, {scaleX}],
    };
  });

  return (
    <Pressable onPress={handleToggle} disabled={disabled}>
      <Animated.View
        style={[styles.track, trackStyle, disabled && styles.disabled]}>
        <Animated.View style={[styles.thumb, thumbStyle]} />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: {
    width: TRACK_WIDTH,
    height: TRACK_HEIGHT,
    borderRadius: Theme.borderRadius.pill,
    justifyContent: 'center',
  },
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: Theme.colors.white,
  },
  disabled: {
    opacity: 0.4,
  },
});
