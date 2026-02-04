---
name: media-url-import
description: 将外部视频 URL 通过媒体上传接口转成站内可访问的视频 URL。适用于用户说“把外链视频转成内部链接/可访问链接/媒体 URL”、需要走 media.vlook.ai 的 upload 接口、或需要生成 `https://media.vlook.ai/media/download/{key}` 地址时。
---

# Media Url Import

## 概览

将外部视频 URL 通过 `https://media.vlook.ai/media/upload` 导入到内部存储，获得响应 `key`，再拼成内部可访问地址。

## 工作流（必走）

1. **收集输入**：外部 `url` 与文件名（用于拼接 `objectKey`）。
2. **构造请求体**：
   - `url`: 外部视频地址
   - `bucket`: 固定 `R2_BUCKET`
   - `objectKey`: 固定前缀 `0/public/` + 文件名（例如 `0/public/demo.mp4`）
3. **调用上传接口**：`POST https://media.vlook.ai/media/upload`，带 `Authorization: bearer <token>` 与 JSON body。
4. **解析响应**：读取返回 JSON 的 `key`。
5. **生成内部 URL**：`https://media.vlook.ai/media/download` + `key`。

## 快速命令（推荐）

使用脚本 `scripts/upload_video_from_url.sh`：

```bash
bash .codex/skills/media-url-import/scripts/upload_video_from_url.sh \\
  --url \"<外部视频URL>\" \\
  --filename \"demo.mp4\" \\
  --token \"<bearer token>\"
```

输出：
- `key`（例如 `0/public/demo.mp4`）
- `internal_url`（例如 `https://media.vlook.ai/media/download0/public/demo.mp4`）

## 注意事项

- `bucket` 固定为 `R2_BUCKET`，不要改。
- `objectKey` 必须以 `0/public/` 开头。
- `Authorization` 形如：`bearer <token>`。
- 不要在日志里泄露 token。

## 参考资料

- 详细接口说明见：`references/media-upload-api.md`
