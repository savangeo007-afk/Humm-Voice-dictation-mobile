import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Pressable,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import {Theme} from '../theme';
import {useReducedMotion} from '../hooks/useReducedMotion';

const {height: SCREEN_HEIGHT} = Dimensions.get('window');

type MorphicBottomSheetProps = {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export default function MorphicBottomSheet({
  visible,
  onClose,
  children,
}: MorphicBottomSheetProps) {
  const [isRendered, setIsRendered] = useState(false);
  const reducedMotion = useReducedMotion();

  const translateY = useSharedValue(SCREEN_HEIGHT);
  const backdropOpacity = useSharedValue(0);

  const handleAnimationEnd = useCallback((isFinished?: boolean) => {
    if (isFinished && !visible) {
      setIsRendered(false);
    }
  }, [visible]);

  useEffect(() => {
    if (visible) {
      setIsRendered(true);
      if (reducedMotion) {
        translateY.value = 0;
        backdropOpacity.value = withTiming(1, {duration: 100});
      } else {
        translateY.value = withSpring(0, Theme.spring);
        backdropOpacity.value = withSpring(1, Theme.spring);
      }
    } else if (isRendered) {
      if (reducedMotion) {
        backdropOpacity.value = withTiming(0, {duration: 100}, (finished) => {
            runOnJS(handleAnimationEnd)(finished);
        });
      } else {
        translateY.value = withSpring(SCREEN_HEIGHT, Theme.spring, (finished) => {
            runOnJS(handleAnimationEnd)(finished);
        });
        backdropOpacity.value = withSpring(0, Theme.spring);
      }
    }
  }, [visible, isRendered, translateY, backdropOpacity, reducedMotion, handleAnimationEnd]);

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{translateY: translateY.value}],
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  if (!isRendered) {
    return null;
  }

  return (
    <View style={styles.overlay}>
      <Animated.View style={[styles.backdrop, backdropStyle]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      </Animated.View>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}>
        <Animated.View style={[styles.sheet, sheetStyle]}>
          <View style={styles.handle} />
          {children}
        </Animated.View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    zIndex: 100,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Theme.colors.overlay,
  },
  keyboardView: {
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: Theme.colors.surface,
    borderTopLeftRadius: Theme.borderRadius.large,
    borderTopRightRadius: Theme.borderRadius.large,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: Theme.colors.border,
    padding: Theme.spacing.xl,
    paddingBottom: Theme.spacing.xxxl,
    maxHeight: SCREEN_HEIGHT * 0.7,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Theme.colors.border,
    alignSelf: 'center',
    marginBottom: Theme.spacing.xl,
  },
});
