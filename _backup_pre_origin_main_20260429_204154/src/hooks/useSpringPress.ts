import {useCallback} from 'react';
import {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import {Theme} from '../theme';

export function useSpringPress(scaleTo: number = 0.96) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
  }));

  const onPressIn = useCallback(() => {
    scale.value = withSpring(scaleTo, Theme.spring);
  }, [scale, scaleTo]);

  const onPressOut = useCallback(() => {
    scale.value = withSpring(1, Theme.spring);
  }, [scale]);

  return {animatedStyle, onPressIn, onPressOut};
}
