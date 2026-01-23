# 302ai-custom-mcp 返回字段

## 关键路径
- 图片地址数组：`content.data.outputs`
- 取首个地址：`content.data.outputs[0]`

## 示例
```json
{
  "content": {
    "code": 200,
    "message": "success",
    "data": {
      "id": "3950c8904a5942cb8a0aa50b6262915e",
      "model": "google/nano-banana-pro/text-to-image",
      "outputs": [
        "https://file.302.ai/gpt/imgs/20260123/bdbf30bb82a40e1954105a1de8939ada.png"
      ],
      "urls": {
        "get": "https://api.302.ai/ws/api/v3/predictions/3950c8904a5942cb8a0aa50b6262915e/result"
      },
      "status": "completed"
    }
  }
}
```
