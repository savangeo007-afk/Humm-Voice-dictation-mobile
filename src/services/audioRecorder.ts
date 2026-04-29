import {Platform} from 'react-native';
import AudioRecorderPlayer, {
  AudioEncoderAndroidType,
  AudioSourceAndroidType,
  AVEncodingOption,
  OutputFormatAndroidType,
} from 'react-native-audio-recorder-player';
import {requestMicrophonePermission} from '../utils/permissions';

const audioRecorderPlayer = new AudioRecorderPlayer();

let activeRecordingStart = 0;

export async function startAudioRecording(): Promise<void> {
  const hasPermission = await requestMicrophonePermission();
  if (!hasPermission) {
    throw new Error('MIC_PERMISSION_DENIED');
  }

  activeRecordingStart = Date.now();
  await audioRecorderPlayer.startRecorder(
    undefined,
    {
      AudioSourceAndroid: AudioSourceAndroidType.VOICE_RECOGNITION,
      OutputFormatAndroid: OutputFormatAndroidType.MPEG_4,
      AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
      AudioSamplingRateAndroid: 16000,
      AudioEncodingBitRateAndroid: 96000,
      AVFormatIDKeyIOS: AVEncodingOption.aac,
      AVSampleRateKeyIOS: 16000,
      AVNumberOfChannelsKeyIOS: 1,
    },
    true,
  );
}

export async function stopAudioRecording(): Promise<{
  audioPath: string;
  durationSeconds: number;
}> {
  try {
    const rawPath = await audioRecorderPlayer.stopRecorder();
    const elapsedMs = Date.now() - activeRecordingStart;
    const durationSeconds = Math.max(0, Math.round(elapsedMs / 1000));

    if (!rawPath || rawPath === 'Already stopped') {
      throw new Error('RECORDING_FAILED: No audio file was produced');
    }

    const audioPath =
      Platform.OS === 'android' && rawPath.startsWith('file://')
        ? rawPath.replace('file://', '')
        : rawPath;

    return {audioPath, durationSeconds};
  } finally {
    activeRecordingStart = 0;
  }
}
