import React, {useEffect} from 'react';
import Svg, {Path, G} from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedG = Animated.createAnimatedComponent(G);

type HummLogoProps = {
  width?: number;
  height?: number;
  animated?: boolean;
  showText?: boolean;
};

const BUBBLE_LENGTH = 600;
const WAVE_LENGTH = 800;

export default function HummLogo({
  width = 200,
  height = 80,
  animated = false,
  showText = true,
}: HummLogoProps) {
  const bubbleOffset = useSharedValue(animated ? BUBBLE_LENGTH : 0);
  const waveOffset = useSharedValue(animated ? WAVE_LENGTH : 0);
  const textOpacity = useSharedValue(animated ? 0 : 1);

  useEffect(() => {
    if (!animated) {
      return;
    }

    const timingConfig = {duration: 1200, easing: Easing.out(Easing.cubic)};

    bubbleOffset.value = withTiming(0, timingConfig);
    waveOffset.value = withDelay(400, withTiming(0, timingConfig));
    textOpacity.value = withDelay(1000, withTiming(1, {duration: 600}));
  }, [animated, bubbleOffset, waveOffset, textOpacity]);

  const bubbleAnimatedProps = useAnimatedProps(() => ({
    strokeDashoffset: bubbleOffset.value,
  }));

  const waveAnimatedProps = useAnimatedProps(() => ({
    strokeDashoffset: waveOffset.value,
  }));

  const textAnimatedProps = useAnimatedProps(() => ({
    opacity: textOpacity.value,
  }));

  return (
    <Svg width={width} height={height} viewBox="0 0 1000 400">
      <AnimatedPath
        d="M 415 130 C 365 50, 215 50, 165 130 C 125 200, 175 270, 225 290 Q 215 320, 210 335 Q 235 315, 250 290 C 315 280, 385 240, 405 200"
        stroke="#FFFFFF"
        strokeWidth={12}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={BUBBLE_LENGTH}
        animatedProps={bubbleAnimatedProps}
      />
      <AnimatedPath
        d="M 155 180 Q 165 170, 175 180 Q 185 190, 190 175 Q 195 160, 205 185 L 220 90 L 240 240 L 260 110 L 280 210 L 300 140 Q 315 200, 355 185 Q 390 170, 425 180"
        stroke="#FFFFFF"
        strokeWidth={10}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={WAVE_LENGTH}
        animatedProps={waveAnimatedProps}
      />
      {showText && (
        <AnimatedG animatedProps={textAnimatedProps}>
          <Path
            d="M 455 130 h 25 v 35 h 30 v -35 h 25 v 100 h -25 v -40 h -30 v 40 h -25 z"
            fill="#FFFFFF"
          />
          <Path
            d="M 555 130 L 580 130 L 580 190 A 15 15 0 0 0 610 190 L 610 130 L 635 130 L 635 190 A 40 40 0 0 1 555 190 Z"
            fill="#FFFFFF"
          />
          <Path
            d="M 655 130 L 680 130 L 697.5 185 L 715 130 L 740 130 L 740 230 L 715 230 L 715 165 L 697.5 220 L 680 165 L 680 230 L 655 230 Z"
            fill="#FFFFFF"
          />
          <Path
            d="M 760 130 L 785 130 L 802.5 185 L 820 130 L 845 130 L 845 230 L 820 230 L 820 165 L 802.5 220 L 785 165 L 785 230 L 760 230 Z"
            fill="#FFFFFF"
          />
        </AnimatedG>
      )}
    </Svg>
  );
}
