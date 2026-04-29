import React from 'react';
import {View, StyleSheet} from 'react-native';
import Animated, {useAnimatedStyle, withSpring} from 'react-native-reanimated';
import {Theme} from '../../theme';

type StepIndicatorProps = {
  totalSteps: number;
  currentStep: number;
};

function Dot({
  isActive,
  isCompleted,
}: {
  isActive: boolean;
  isCompleted: boolean;
}) {
  const animatedStyle = useAnimatedStyle(() => {
    const isFilled = isActive || isCompleted;
    return {
      width: withSpring(isActive ? 24 : 8, Theme.spring),
      backgroundColor: isFilled ? Theme.colors.orange : Theme.colors.border,
    };
  });

  return <Animated.View style={[styles.dot, animatedStyle]} />;
}

export default function StepIndicator({
  totalSteps,
  currentStep,
}: StepIndicatorProps) {
  return (
    <View style={styles.container}>
      {Array.from({length: totalSteps}, (_, index) => (
        <Dot
          key={index}
          isActive={index === currentStep}
          isCompleted={index < currentStep}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Theme.spacing.sm,
  },
  dot: {
    height: 8,
    borderRadius: Theme.borderRadius.pill,
  },
});
