import React, {useCallback} from 'react';
import {View, Text, Pressable, StyleSheet} from 'react-native';
import Animated from 'react-native-reanimated';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import {Check} from 'lucide-react-native';
import {Theme} from '../../theme';
import {useSpringPress} from '../../hooks/useSpringPress';
import MorphicCard from '../MorphicCard';

type PlanCardProps = {
  plan: 'free' | 'premium';
  selected: boolean;
  onPress: () => void;
  price?: string;
};

const FREE_FEATURES = [
  'Basic voice dictation',
  'Up to 5 dictionary entries',
  'English language support',
  'Local processing',
];

const PREMIUM_FEATURES = [
  'Unlimited voice dictation',
  'Unlimited dictionary entries',
  'All languages supported',
  'Cloud processing with Sarvam AI',
  'Personal contexts',
  'Priority support',
];

export default function PlanCard({
  plan,
  selected,
  onPress,
  price,
}: PlanCardProps) {
  const {animatedStyle, onPressIn, onPressOut} = useSpringPress(0.96);

  const handlePress = useCallback(() => {
    ReactNativeHapticFeedback.trigger('impactLight');
    onPress();
  }, [onPress]);

  const isFree = plan === 'free';
  const title = isFree ? 'Free Forever' : 'Premium';
  const features = isFree ? FREE_FEATURES : PREMIUM_FEATURES;
  const glowColor = selected ? Theme.colors.orange : undefined;

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={handlePress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}>
        <MorphicCard glowColor={glowColor}>
          <Text style={styles.title}>{title}</Text>
          {!isFree && price && <Text style={styles.price}>{price}</Text>}
          <View style={styles.featureList}>
            {features.map((feature, index) => (
              <View key={index} style={styles.featureRow}>
                <Check
                  size={16}
                  color={
                    selected ? Theme.colors.orange : Theme.colors.textSecondary
                  }
                />
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>
        </MorphicCard>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontFamily: Theme.typography.interSemiBold,
    fontSize: 20,
    color: Theme.colors.white,
    marginBottom: Theme.spacing.xs,
  },
  price: {
    fontFamily: Theme.typography.anton,
    fontSize: 24,
    color: Theme.colors.orange,
    marginBottom: Theme.spacing.md,
  },
  featureList: {
    marginTop: Theme.spacing.md,
    gap: Theme.spacing.md,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.sm,
  },
  featureText: {
    fontFamily: Theme.typography.inter,
    fontSize: 14,
    color: Theme.colors.textSecondary,
  },
});
