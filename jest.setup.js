/* global jest */
import 'react-native-gesture-handler/jestSetup';

jest.mock('react-native-reanimated', () => {
  const React = require('react');
  const {View} = require('react-native');
  const AnimatedView = React.forwardRef((props, ref) =>
    React.createElement(View, {...props, ref}),
  );

  return {
    __esModule: true,
    default: {
      View: AnimatedView,
      createAnimatedComponent: Component => Component,
    },
    View: AnimatedView,
    createAnimatedComponent: Component => Component,
    useSharedValue: value => ({value}),
    useAnimatedStyle: fn => fn(),
    useAnimatedProps: fn => fn(),
    withSpring: value => value,
    withTiming: value => value,
    withDelay: (_delay, value) => value,
    interpolateColor: () => '#000000',
    interpolate: (_value, _input, output) => output[0],
    runOnJS: fn => fn,
    Easing: {
      out: fn => fn,
      cubic: () => 0,
    },
  };
});

jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

jest.mock('react-native-haptic-feedback', () => ({
  trigger: jest.fn(),
}));

jest.mock('@react-native-google-signin/google-signin', () => ({
  GoogleSignin: {
    configure: jest.fn(),
    hasPlayServices: jest.fn().mockResolvedValue(true),
    signIn: jest.fn().mockResolvedValue({data: {idToken: 'test-token'}}),
    signOut: jest.fn().mockResolvedValue(undefined),
  },
}));

jest.mock(
  'whisper.rn',
  () => ({
    initWhisper: jest.fn().mockResolvedValue({
      transcribe: jest.fn(() => ({
        promise: Promise.resolve({
          isAborted: false,
          language: 'en',
          result: 'test transcript',
          segments: [],
        }),
      })),
      release: jest.fn().mockResolvedValue(undefined),
    }),
  }),
  {virtual: true},
);

jest.mock('react-native-audio-recorder-player', () => {
  return jest.fn().mockImplementation(() => ({
    startRecorder: jest.fn().mockResolvedValue(''),
    stopRecorder: jest.fn().mockResolvedValue('/tmp/mock.wav'),
  }));
});

jest.mock('@react-native-clipboard/clipboard', () => ({
  __esModule: true,
  default: {
    setString: jest.fn(),
    getString: jest.fn().mockResolvedValue(''),
    hasString: jest.fn().mockResolvedValue(false),
  },
}));
