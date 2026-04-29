import React, {useState, useCallback, useRef, useEffect} from 'react';
import {View, StyleSheet, StatusBar} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import FloatingPill from '../components/FloatingPill';
import DictationControls from '../components/DictationControls';
import {HomeContent} from './HomeScreen';
import {CustomDictionaryContent} from './CustomDictionaryScreen';
import {PersonalContextsContent} from './PersonalContextsScreen';
import {SettingsHubContent} from './SettingsHubScreen';
import {Theme} from '../theme';
import {useReducedMotion} from '../hooks/useReducedMotion';

type TabKey = 'home' | 'dictionary' | 'contexts' | 'settings';

const TAB_KEYS: TabKey[] = ['home', 'dictionary', 'contexts', 'settings'];

const TAB_COMPONENTS: Record<TabKey, React.ComponentType> = {
  home: HomeContent,
  dictionary: CustomDictionaryContent,
  contexts: PersonalContextsContent,
  settings: SettingsHubContent,
};

/**
 * Wraps a single tab scene in an Animated.View that crossfades + lifts.
 * The scene stays mounted at all times so scroll position / state is preserved.
 */
function TabScene({
  tabKey,
  activeTab,
  reducedMotion,
}: {
  tabKey: TabKey;
  activeTab: TabKey;
  reducedMotion: boolean;
}) {
  const isActive = activeTab === tabKey;
  const opacity = useSharedValue(isActive ? 1 : 0);
  const translateY = useSharedValue(isActive ? 0 : Theme.motion.lift.sm);

  // Track whether this is the first render (skip animation on mount)
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const duration = reducedMotion ? 0 : Theme.motion.duration.screen;
    const easing = Easing.bezier(
      Theme.motion.easing.outCubic[0],
      Theme.motion.easing.outCubic[1],
      Theme.motion.easing.outCubic[2],
      Theme.motion.easing.outCubic[3],
    );

    if (isActive) {
      opacity.value = withTiming(1, {duration, easing});
      translateY.value = withTiming(0, {duration, easing});
    } else {
      // Fade out slightly faster so the new tab feels snappy
      const outDuration = reducedMotion ? 0 : Theme.motion.duration.short;
      opacity.value = withTiming(0, {duration: outDuration, easing});
      translateY.value = withTiming(Theme.motion.lift.sm, {
        duration: outDuration,
        easing,
      });
    }
  }, [isActive, reducedMotion, opacity, translateY]);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{translateY: translateY.value}],
  }));

  const Component = TAB_COMPONENTS[tabKey];

  return (
    <Animated.View
      style={[styles.scene, animStyle]}
      pointerEvents={isActive ? 'auto' : 'none'}>
      <Component />
    </Animated.View>
  );
}

export default function MainAppScreen() {
  const [activeTab, setActiveTab] = useState<TabKey>('home');
  const reducedMotion = useReducedMotion();

  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab as TabKey);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.content}>
        {TAB_KEYS.map(key => (
          <TabScene
            key={key}
            tabKey={key}
            activeTab={activeTab}
            reducedMotion={reducedMotion}
          />
        ))}
      </View>
      <DictationControls />
      <FloatingPill activeTab={activeTab} onTabChange={handleTabChange} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  content: {
    flex: 1,
  },
  scene: {
    ...StyleSheet.absoluteFillObject,
  },
});
