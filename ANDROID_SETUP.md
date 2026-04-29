# Android Setup for Humm

## Open in Android Studio

1. Open Android Studio.
2. Click **Open** or **File -> Open**.
3. Select the `android` folder inside this project:
   ```text
   D:\Humm Voice Dictation Mobile\android
   ```
4. Wait for Gradle sync to finish.
5. Run the `app` configuration on a connected Android device or emulator.

Select the `android` folder, not the repository root.

## Local SDK Setup

Android Studio normally creates `android/local.properties` for you. If Gradle cannot find the SDK, create that file locally with your SDK path:

```properties
sdk.dir=C\:\\Users\\User\\AppData\\Local\\Android\\Sdk
```

`android/local.properties` is intentionally ignored by git because it is machine-specific.

## Required SDK Tools

- Android SDK Platform 35
- Android SDK Build-Tools 34.0.0
- Android NDK 26.1.10909125
- JDK 17

## Build from Command Line

```powershell
cd "D:\Humm Voice Dictation Mobile\android"
.\gradlew.bat assembleDebug
```

The debug APK is generated at:

```text
android\app\build\outputs\apk\debug\app-debug.apk
```

## Release Signing

Release builds are unsigned unless a release keystore is configured. Add these values to `android/gradle.properties` locally, or pass them as Gradle properties in CI:

```properties
HUMM_UPLOAD_STORE_FILE=path/to/upload-keystore.jks
HUMM_UPLOAD_STORE_PASSWORD=your-store-password
HUMM_UPLOAD_KEY_ALIAS=your-key-alias
HUMM_UPLOAD_KEY_PASSWORD=your-key-password
```
