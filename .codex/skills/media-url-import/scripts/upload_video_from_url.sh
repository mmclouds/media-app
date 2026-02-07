#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'EOF'
用法:
  bash upload_video_from_url.sh --url "<外部文件URL>" --filename "demo.mp4" [--token "<bearer token>"]

说明:
  - bucket 固定为 R2_BUCKET
  - objectKey 固定前缀 0/public/ + filename
  - 如未传 --token，则读取环境变量 MEDIA_UPLOAD_TOKEN
  - 输出 key 与 internal_url
EOF
}

url=""
filename=""
token=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --url)
      url="$2"
      shift 2
      ;;
    --filename)
      filename="$2"
      shift 2
      ;;
    --token)
      token="$2"
      shift 2
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "未知参数: $1" >&2
      usage
      exit 1
      ;;
  esac
done

if [[ -z "$token" && -n "${MEDIA_UPLOAD_TOKEN:-}" ]]; then
  token="${MEDIA_UPLOAD_TOKEN}"
fi

if [[ -z "$url" || -z "$filename" || -z "$token" ]]; then
  echo "缺少必填参数。" >&2
  usage
  exit 1
fi

if [[ "$filename" == *"/"* ]]; then
  echo "filename 不能包含路径分隔符: ${filename}" >&2
  exit 1
fi

response=$(
  curl -sS --max-time 240 --location --request POST 'https://media.vlook.ai/media/upload' \
    --header "Authorization: bearer ${token}" \
    --header 'Content-Type: application/json' \
    --data-raw "{
  \"url\": \"${url}\",
  \"bucket\": \"R2_BUCKET\",
  \"objectKey\": \"0/public/${filename}\"
}"
)

key=$(python3 - <<'PY' "$response"
import json
import sys

try:
  data = json.loads(sys.argv[1])
except Exception:
  print("")
  sys.exit(0)

print(data.get("key", ""))
PY
)

if [[ -z "$key" ]]; then
  echo "解析响应失败: ${response}" >&2
  exit 1
fi

echo "key: ${key}"
echo "internal_url: https://media.vlook.ai/media/download/${key}"
