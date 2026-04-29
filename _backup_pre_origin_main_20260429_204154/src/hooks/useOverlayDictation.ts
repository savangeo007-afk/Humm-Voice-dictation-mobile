import {useEffect, useRef} from 'react';
import {addOverlayListener, injectText} from '../modules/NativeOverlayBridge';
import {
  startAudioRecording,
  stopAudioRecording,
} from '../services/audioRecorder';
import {runTranscriptionPipeline} from '../services/transcriptionPipeline';
import * as Storage from '../services/storage';
import type {PipelineStatus} from '../types';

/**
 * Global hook that subscribes to native overlay button events and
 * orchestrates the record -> transcribe -> inject pipeline.
 */
export function useOverlayDictation() {
  const isRecording = useRef(false);
  const isProcessing = useRef(false);

  useEffect(() => {
    const startSub = addOverlayListener('onDictationStart', async () => {
      if (isRecording.current || isProcessing.current) {
        return;
      }

      isRecording.current = true;
      try {
        await startAudioRecording();
      } catch {
        isRecording.current = false;
      }
    });

    const confirmSub = addOverlayListener('onDictationConfirm', async () => {
      if (!isRecording.current || isProcessing.current) {
        return;
      }

      isRecording.current = false;
      isProcessing.current = true;

      try {
        const {audioPath, durationSeconds} = await stopAudioRecording();
        if (durationSeconds < 1) {
          return;
        }

        const statusCallback = (_status: PipelineStatus) => {
          // Native status feedback can be added here without changing pipeline state.
        };

        const result = await runTranscriptionPipeline(
          {
            source: 'floating_icon',
            audioPath,
            durationSeconds,
            appName: 'SystemOverlay',
            engineChoice: Storage.getEngineChoice(),
            selectedPlan: Storage.getSelectedPlan(),
            byokKey: Storage.getBYOKKey(),
            dictionary: Storage.getCustomDictionary(),
            contexts: Storage.getPersonalContexts(),
          },
          statusCallback,
        );

        if (result.status === 'success' && result.text.trim().length > 0) {
          try {
            const inserted = await injectText(result.text);
            result.insertionStatus = inserted ? 'inserted' : 'clipboard_only';
          } catch {
            result.insertionStatus = 'clipboard_only';
          }
        }

        Storage.prependTranscription(result);
      } catch {
      } finally {
        isProcessing.current = false;
      }
    });

    const cancelSub = addOverlayListener('onDictationCancel', async () => {
      if (!isRecording.current) {
        return;
      }

      isRecording.current = false;
      try {
        await stopAudioRecording();
      } catch {
        // Already stopped or nothing to stop.
      }
    });

    return () => {
      startSub?.remove();
      confirmSub?.remove();
      cancelSub?.remove();
    };
  }, []);
}
