import type {NativeStackScreenProps} from '@react-navigation/native-stack';

export type OnboardingParams = {
  name?: string;
  age?: string;
  languages?: string[];
  email?: string;
};

export type RootStackParamList = {
  Home: undefined;
  Splash: undefined;
  GetStarted: undefined;
  AboutYou: undefined;
  LanguageHub: OnboardingParams | undefined;
  SarvamIntro: OnboardingParams | undefined;
  Auth: OnboardingParams | undefined;
  PermissionsConsent: OnboardingParams | undefined;
  OverlayPermissions: undefined;
  Welcome: OnboardingParams | undefined;
  MainApp: undefined;
  PersonalDetails: undefined;
  SarvamConfig: undefined;
  BYOKHub: undefined;
  Billing: undefined;
};

export type SplashScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Splash'
>;
export type GetStartedScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'GetStarted'
>;
export type AboutYouScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'AboutYou'
>;
export type LanguageHubScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'LanguageHub'
>;
export type SarvamIntroScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'SarvamIntro'
>;
export type AuthScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Auth'
>;
export type PermissionsConsentScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'PermissionsConsent'
>;
export type WelcomeScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Welcome'
>;
export type OverlayPermissionsScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'OverlayPermissions'
>;
export type MainAppScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'MainApp'
>;
export type PersonalDetailsScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'PersonalDetails'
>;
export type SarvamConfigScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'SarvamConfig'
>;
export type BYOKHubScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'BYOKHub'
>;
export type BillingScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Billing'
>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
