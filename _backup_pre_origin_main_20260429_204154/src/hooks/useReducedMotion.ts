import {useState, useEffect} from 'react';
import {AccessibilityInfo} from 'react-native';

/**
 * Returns `true` when the OS-level "Reduce Motion" preference is enabled.
 * All animation helpers should check this flag and fall back to
 * near-instant fades / no translation when it is `true`.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    // Query the current value once on mount.
    AccessibilityInfo.isReduceMotionEnabled().then(setReduced);

    // Subscribe to future changes.
    const subscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      setReduced,
    );

    return () => {
      subscription.remove();
    };
  }, []);

  return reduced;
}
