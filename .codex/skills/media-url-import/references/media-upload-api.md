# Media Upload API（外部 URL 转内部文件）

## 目标

将外部文件 URL 上传为内部可访问的媒体文件，返回 `key` 供拼接访问地址。

## 端点

- `POST https://media.vlook.ai/media/upload`

## 请求头

- 固定值： `Authorization: bearer diannaoqiqi66.`
- `Content-Type: application/json`

## 请求体

```json
{
  "url": "https://example.com/video.mp4",
  "bucket": "R2_BUCKET",
  "objectKey": "0/public/the-file-name.mp4"
}
```

字段说明：
- `url`: 外部文件 URL
- `bucket`: 固定 `R2_BUCKET`
- `objectKey`: 固定前缀 `0/public/` + 文件名

## 响应

```json
{
  "key": "0/public/sora2.mp4"
}
```

## 内部访问 URL

```
https://media.vlook.ai/media/download/{key}
```

示例：
```
https://media.vlook.ai/media/download/0/public/sora2.mp4
```
