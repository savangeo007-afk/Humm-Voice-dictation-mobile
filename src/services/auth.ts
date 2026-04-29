import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {supabase} from './supabase';

// TODO: Replace with actual Web Client ID from Google Cloud Console
// After building, run: cd android && ./gradlew signingReport
// Add the SHA1 to Google Cloud Console OAuth credentials
// Then paste the Web Client ID here
const WEB_CLIENT_ID =
  '1077405414695-7efsfs8j0qiektgk01i5bdra0du42kal.apps.googleusercontent.com';

let isConfigured = false;

function configureGoogleSignIn() {
  if (isConfigured) {
    return;
  }
  GoogleSignin.configure({
    webClientId: WEB_CLIENT_ID,
    offlineAccess: true,
  });
  isConfigured = true;
}

export async function googleSignIn(): Promise<{
  success: boolean;
  email?: string;
  error?: string;
}> {
  try {
    configureGoogleSignIn();
    await GoogleSignin.hasPlayServices();
    const signInResult = await GoogleSignin.signIn();
    const idToken = signInResult.data?.idToken;

    if (!idToken) {
      return {success: false, error: 'No ID token received from Google'};
    }

    const {data, error} = await supabase.auth.signInWithIdToken({
      provider: 'google',
      token: idToken,
    });

    if (error) {
      return {success: false, error: error.message};
    }

    return {
      success: true,
      email: data.user?.email ?? undefined,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Google Sign-In failed',
    };
  }
}

export async function signOut(): Promise<void> {
  try {
    await GoogleSignin.signOut();
  } catch {}
  await supabase.auth.signOut();
}

export async function getSession() {
  const {data} = await supabase.auth.getSession();
  return data.session;
}

export async function getCurrentUser() {
  const {data} = await supabase.auth.getUser();
  return data.user;
}
