import React, {useCallback} from 'react';
import {
  View,
  Pressable,
  TextInput,
  Text,
  StyleSheet,
  type KeyboardTypeOptions,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import {Mic} from 'lucide-react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolateColor,
} from 'react-native-reanimated';
import {Theme} from '../theme';
import {useApp} from '../context/AppContext';

type MorphicInputProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  multiline?: boolean;
  style?: StyleProp<ViewStyle>;
  showDictationToolbarIcon?: boolean;
};

const AnimatedView = Animated.View;

export default function MorphicInput({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType,
  multiline = false,
  style,
  showDictationToolbarIcon = true,
}: MorphicInputProps) {
  const {activeDictationSource, startDictation, stopDictation} = useApp();
  const focusProgress = useSharedValue(0);

  const handleFocus = useCallback(() => {
    focusProgress.value = withSpring(1, Theme.spring);
  }, [focusProgress]);

  const handleBlur = useCallback(() => {
    focusProgress.value = withSpring(0, Theme.spring);
  }, [focusProgress]);

  const borderStyle = useAnimatedStyle(() => ({
    borderColor: interpolateColor(
      focusProgress.value,
      [0, 1],
      [Theme.colors.border, Theme.colors.orange],
    ),
  }));

  const keyboardDictationActive = activeDictationSource === 'keyboard_toolbar';

  const handleDictationPress = useCallback(async () => {
    if (keyboardDictationActive) {
      await stopDictation('keyboard_toolbar', 'Keyboard');
      return;
    }
    await startDictation('keyboard_toolbar');
  }, [keyboardDictationActive, startDictation, stopDictation]);

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.label}>{label}</Text>
      <AnimatedView style={[styles.inputWrapper, borderStyle]}>
        <TextInput
          style={[styles.input, multiline && styles.multiline]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={Theme.colors.textSecondary}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          multiline={multiline}
          onFocus={handleFocus}
          onBlur={handleBlur}
          selectionColor={Theme.colors.orange}
        />
        {showDictationToolbarIcon ? (
          <Pressable
            style={[
              styles.toolbarButton,
              keyboardDictationActive && styles.toolbarButtonActive,
            ]}
            onPress={handleDictationPress}>
            <Mic
              size={16}
              color={
                keyboardDictationActive
                  ? Theme.colors.orange
                  : Theme.colors.textSecondary
              }
            />
          </Pressable>
        ) : null}
      </AnimatedView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    fontFamily: Theme.typography.interMedium,
    fontSize: 14,
    color: Theme.colors.textSecondary,
    marginBottom: Theme.spacing.sm,
  },
  inputWrapper: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.default,
    borderWidth: 1,
    position: 'relative',
  },
  input: {
    fontFamily: Theme.typography.inter,
    fontSize: 16,
    color: Theme.colors.white,
    paddingHorizontal: 16,
    paddingVertical: 14,
    paddingRight: 48,
  },
  multiline: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  toolbarButton: {
    position: 'absolute',
    right: 10,
    top: '50%',
    marginTop: -14,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Theme.colors.surfaceSecondary,
  },
  toolbarButtonActive: {
    backgroundColor: '#2A1A00',
  },
});
