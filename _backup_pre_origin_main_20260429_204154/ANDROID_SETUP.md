# Opening Humm in Android Studio

## Steps to Open the Android Project

1. **Open Android Studio**

2. **Click "Open"** (or File → Open)

3. **Navigate to and select the `android` folder** inside the project:
   ```
   D:\Humm Voice Dictation Mobile\android
   ```
   ⚠️ **Important**: Select the `android` folder, NOT the root project folder.

4. **Click "OK"**
   - Android Studio will recognize it as an Android project
   - Wait for Gradle sync to complete (bottom right shows progress)

5. **Run the app**:
   - Connect an Android device or start an emulator
   - Click **Run** → **Run 'app'** (or press Shift+F10)
   - Select your device

## If Gradle Sync Fails

- Click **File** → **Sync Now**
- Or check that NDK 26.1 is installed (Settings → SDK Manager → SDK Tools)

## Build from Command Line

If you prefer terminal:
```bash
cd D:\Humm Voice Dictation Mobile\android
./gradlew assembleDebug
```

The APK will be in: `app/build/outputs/apk/debug/app-debug.apk`
