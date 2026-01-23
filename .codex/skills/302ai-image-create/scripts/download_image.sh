#!/usr/bin/env bash
set -euo pipefail

if [ "$#" -ne 2 ]; then
  echo "用法: download_image.sh <image_url> <output_path>" >&2
  exit 1
fi

IMAGE_URL="$1"
OUTPUT_PATH="$2"

OUTPUT_DIR="$(dirname "$OUTPUT_PATH")"
mkdir -p "$OUTPUT_DIR"

if command -v curl >/dev/null 2>&1; then
  curl -L "$IMAGE_URL" -o "$OUTPUT_PATH"
elif command -v wget >/dev/null 2>&1; then
  wget -O "$OUTPUT_PATH" "$IMAGE_URL"
else
  echo "未找到 curl 或 wget，无法下载图片" >&2
  exit 1
fi

echo "已下载: $OUTPUT_PATH"
