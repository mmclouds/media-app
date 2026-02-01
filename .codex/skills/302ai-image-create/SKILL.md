---
name: 302ai-image-create
description: 使用 302ai-custom-mcp 生成图片并落地到项目 public 目录的完整流程。适用于用户要求“生成/创建图片、插图、配图、封面”或需要将生成图片下载到 public 并在代码中引用的场景。
---

# 302ai Image Create

## Overview

用 302ai-custom-mcp 调用文生图模型获取图片链接（content.data.outputs 数组），将图片下载到 public 路径并在项目代码中引用。

## 工作流（顺序执行）

### 1) 先给用户“多风格中文提示词选项”
- 根据每张图片的需求，先生成多种不同风格的中文提示词
- 用 A/B/C（或 A/B/C/D）标号列出，便于用户选择
- 每条提示词需明确 16:9 或“宽屏”，并含关键场景、光线、材质、镜头与风格约束
- 若用户要求“电影感/画面丰富/科技风/无文字/允许人物”等，务必在提示词里体现

### 2) 用户选择后，进行提示词润色与丰富
- 基于用户选择的版本进行二次润色
- 补充：镜头语言（景深/光比/颗粒）、材质细节、环境层次、氛围光
- 保持与项目风格一致，不引入文字/标识（除非用户允许）
- 明确 16:9 或“宽屏”

### 3) 生成图片（必须 16:9）
- 使用`302ai-custom-mcp`mcp下面的工具：`xxxImages_Generations`
- prompt 必须明确 16:9 比例（如 “16:9” 或 “宽屏”）
- 输出 JSON 的图片地址位于 `content.data.outputs`（数组）

### 4) 取图地址
- 从 `content.data.outputs[0]` 读取 URL
- 若数组为空，直接报错并让用户重试或更换 prompt

### 5) 下载到 public
- 选择落地目录：建议 `public/images/xxx/`
- 文件名用可读英文+时间戳（ASCII），如 `cat-20260123-001.png`
- 使用脚本 `scripts/download_image.sh` 下载

### 6) 在代码里引用
- Next.js 中直接使用 `/images/xxx/xxx.png`
- 如果是前台展示文案，保持英文（如按钮/标题），注释与日志用中文

## 快速示例

**示例：调用 MCP 获取 URL**

```json
{
  "content": {
    "code": 200,
    "message": "success",
    "data": {
      "outputs": [
        "https://file.302.ai/gpt/imgs/20260123/bdbf30bb82a40e1954105a1de8939ada.png"
      ]
    }
  }
}
```

**下载图片**

```bash
bash .codex/skills/302ai-image-create/scripts/download_image.sh \
  "https://file.302.ai/gpt/imgs/20260123/bdbf30bb82a40e1954105a1de8939ada.png" \
  "public/images/generated/cat-20260123-001.png"
```

## Resources

### scripts/
`download_image.sh`：将图片 URL 下载到指定 public 路径。

### references/
`response-schema.md`：MCP 返回字段说明与示例。
