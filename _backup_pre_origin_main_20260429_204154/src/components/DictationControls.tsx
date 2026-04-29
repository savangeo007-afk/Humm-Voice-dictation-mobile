import React, {useCallback} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {Theme} from '../theme';
import {useApp} from '../context/AppContext';
import FloatIcon from './FloatIcon';

export default function DictationControls() {
  const {
    activeDictationSource,
    pipelineStatus,
    pipelineError,
    startDictation,
    stopDictation,
  } = useApp();

  const floatingActive = activeDictationSource === 'floating_icon';
  const isBusy = pipelineStatus !== 'idle' && pipelineStatus !== 'listening';

  const handleFloatingPress = useCallback(async () => {
    if (floatingActive) {
      await stopDictation('floating_icon', 'Floating');
      return;
    }

    if (isBusy) {
      return;
    }

    await startDictation('floating_icon');
  }, [floatingActive, isBusy, startDictation, stopDictation]);

  return (
    <View style={styles.container}>
      <Pressable
        onPress={handleFloatingPress}
        style={[styles.iconWrap, floatingActive && styles.iconWrapActive]}>
        <FloatIcon size={48} />
      </Pressable>
      <Text style={styles.status}>
        {floatingActive
          ? 'Listening... tap to stop'
          : `Floating icon: ${pipelineStatus}`}
      </Text>
      {pipelineError.length > 0 ? (
        <Text style={styles.error}>{pipelineError}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: Theme.spacing.lg,
    bottom: 124,
    alignItems: 'center',
    gap: Theme.spacing.xs,
  },
  iconWrap: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Theme.colors.surface,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapActive: {
    borderColor: Theme.colors.orange,
    backgroundColor: '#2A1A00',
  },
  status: {
    fontFamily: Theme.typography.inter,
    fontSize: 11,
    color: Theme.colors.textSecondary,
    backgroundColor: Theme.colors.surface,
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: Theme.borderRadius.pill,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  error: {
    fontFamily: Theme.typography.inter,
    fontSize: 11,
    color: Theme.colors.error,
    textAlign: 'center',
    maxWidth: 180,
  },
});
