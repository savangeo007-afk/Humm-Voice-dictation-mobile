import React, {useCallback} from 'react';
import {View, Pressable, Text, StyleSheet} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  FadeIn,
  FadeOut,
  LinearTransition,
} from 'react-native-reanimated';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import {Home, BookOpen, MessageSquare, Settings} from 'lucide-react-native';
import {Theme} from '../theme';

type FloatingPillProps = {
  activeTab: string;
  onTabChange: (tab: string) => void;
};

const TABS = [
  {key: 'home', label: 'Home', Icon: Home},
  {key: 'dictionary', label: 'Dictionary', Icon: BookOpen},
  {key: 'contexts', label: 'Contexts', Icon: MessageSquare},
  {key: 'settings', label: 'Settings', Icon: Settings},
];

/** Duration used for label enter / exit (ms). */
const LABEL_ANIM_MS = Theme.motion.duration.short;

export default function FloatingPill({
  activeTab,
  onTabChange,
}: FloatingPillProps) {
  return (
    <View style={styles.wrapper}>
      <Animated.View
        style={styles.pill}
        layout={LinearTransition.duration(Theme.motion.duration.short)}>
        {TABS.map(tab => (
          <TabItem
            key={tab.key}
            tabKey={tab.key}
            label={tab.label}
            Icon={tab.Icon}
            isActive={activeTab === tab.key}
            onPress={onTabChange}
          />
        ))}
      </Animated.View>
    </View>
  );
}

type TabItemProps = {
  tabKey: string;
  label: string;
  Icon: React.ElementType;
  isActive: boolean;
  onPress: (key: string) => void;
};

function TabItem({tabKey, label, Icon, isActive, onPress}: TabItemProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
  }));

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.9, Theme.spring);
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, Theme.spring);
  }, [scale]);

  const handlePress = useCallback(() => {
    ReactNativeHapticFeedback.trigger('impactLight');
    onPress(tabKey);
  }, [onPress, tabKey]);

  const color = isActive ? Theme.colors.orange : Theme.colors.textSecondary;

  return (
    <Animated.View
      style={animatedStyle}
      layout={LinearTransition.duration(Theme.motion.duration.short)}>
      <Pressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[styles.tabItem, isActive && styles.tabItemActive]}>
        <Icon size={20} color={color} strokeWidth={2} />
        {isActive && (
          <Animated.Text
            entering={FadeIn.duration(LABEL_ANIM_MS)}
            exiting={FadeOut.duration(LABEL_ANIM_MS)}
            style={[styles.tabLabel, {color}]}>
            {label}
          </Animated.Text>
        )}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 32,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  pill: {
    flexDirection: 'row',
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.pill,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: Theme.spacing.sm,
    gap: Theme.spacing.xs,
  },
  tabItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.md,
    borderRadius: Theme.borderRadius.pill,
    gap: Theme.spacing.sm,
  },
  tabItemActive: {
    backgroundColor: Theme.colors.surfaceSecondary,
  },
  tabLabel: {
    fontFamily: Theme.typography.interMedium,
    fontSize: 13,
  },
});
