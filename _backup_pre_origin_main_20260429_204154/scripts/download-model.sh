#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
MODEL_DIR="$SCRIPT_DIR/../android/app/src/main/assets/models"
MODEL_FILE="$MODEL_DIR/ggml-base.bin"
MODEL_URL="https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-base.bin"

mkdir -p "$MODEL_DIR"

if [ -f "$MODEL_FILE" ]; then
  echo "Model already exists at $MODEL_FILE"
  echo "Size: $(du -h "$MODEL_FILE" | cut -f1)"
  exit 0
fi

echo "Downloading ggml-base.bin (~142MB)..."
echo "Source: $MODEL_URL"

if command -v curl &> /dev/null; then
  curl -L --progress-bar -o "$MODEL_FILE" "$MODEL_URL"
elif command -v wget &> /dev/null; then
  wget --show-progress -O "$MODEL_FILE" "$MODEL_URL"
else
  echo "Error: Neither curl nor wget found. Please install one of them."
  exit 1
fi

if [ -f "$MODEL_FILE" ]; then
  echo "Download complete."
  echo "Size: $(du -h "$MODEL_FILE" | cut -f1)"
else
  echo "Error: Download failed."
  exit 1
fi
