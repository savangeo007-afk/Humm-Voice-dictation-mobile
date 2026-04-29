# Whisper Configuration Guide (React Native)

## Objective

Provide a stable, offline speech-to-text setup using Whisper (multilingual) inside a React Native app without runtime crashes, ANRs, or memory issues.

---

## Architecture Overview

* Native Layer: C++ (whisper.cpp)
* Bridge: JNI (Android) / Objective-C++ (iOS)
* JS Layer: React Native UI + orchestration
* Model: ggml-base.bin (multilingual)

Flow:
Audio → WAV → Native (whisper.cpp) → Text → JS → Cleanup layer

---

## Directory Structure

```
root/
 ├── android/
 │   └── app/src/main/
 │        ├── cpp/whisper/
 │        ├── jniLibs/
 │        └── assets/models/
 ├── ios/
 │   └── Whisper/
 └── src/
```

---

## Model Setup

### Download

```
git clone https://github.com/ggerganov/whisper.cpp
cd whisper.cpp
bash ./models/download-ggml-model.sh base
```

### Placement

```
android/app/src/main/assets/models/ggml-base.bin
```

### Rules

* DO NOT rename model
* DO NOT compress model inside APK manually
* Load via asset manager stream

---

## Android Native Setup

### Enable NDK

In `android/build.gradle`:

```
ndkVersion "25.2.9519653"
```

### CMakeLists.txt

* Add whisper.cpp source files
* Enable -O3 optimization
* Enable NEON if ARM

### Memory Safety

* Use streaming inference
* Avoid loading multiple models
* Free context after use

---

## JNI Bridge

Expose minimal API:

```
initModel(path)
transcribe(audioPath)
release()
```

Guidelines:

* Always check null pointers
* Wrap calls in try/catch
* Return errors explicitly

---

## Audio Requirements

* Format: WAV
* Sample rate: 16kHz
* Mono only

Do NOT pass raw microphone buffers directly without conversion.

---

## Runtime Configuration

Set parameters:

```
params.translate = false
params.detect_language = true
params.n_threads = 4
```

Threading:

* Use background thread
* NEVER run on UI thread

---

## Indic Language Routing (Premium Layer)

Detection:

* Use Whisper language output

Routing Logic:

```
if (language in ["hi","ta","ml","kn","te"]) {
   applyIndicProcessing()
} else {
   standardProcessing()
}
```

Indic Processing:

* punctuation normalization
* filler removal tuned for local speech

---

## Performance Optimization

* Use base model (balance)
* Enable quantized models if needed
* Cache model in memory
* Avoid re-initialization

---

## Failure Handling

Handle:

* model not found
* corrupted audio
* memory overflow

Return structured errors:

```
{ success: false, error: "MODEL_LOAD_FAILED" }
```

---

## Testing Checklist

* English audio
* Hindi audio
* Malayalam audio
* Long audio (>2 min)
* Low-end device test

---

## Do NOT Do

* Do NOT bundle multiple large models
* Do NOT run inference on main thread
* Do NOT ignore memory cleanup

---

## Future Extensions

* Add LLM cleanup layer
* Add streaming transcription
* Add cloud fallback

---

## Summary

Use whisper.cpp + base multilingual model, load from assets, run in native layer, expose minimal bridge, and add language-based routing for premium features.
