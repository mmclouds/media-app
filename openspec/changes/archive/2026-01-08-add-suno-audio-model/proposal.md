# 变更：新增 SUNO 音频生成模型

## 为什么
支持 SUNO V5 音频生成并统一接入媒体工作区，同时按固定 12 积分计费。

## 变更内容
- 新增 SUNO V5 音频模型参数与请求映射
- 扩展 PromptEditor 以支持自定义标题/占位/提示，并新增短文本输入组件
- 增加 SUNO V5 积分定价规则（12 积分）

## 影响
- 受影响规范：suno-audio-model（新增）
- 受影响代码：`src/components/marketing/media-generator/**`、`src/custom/credits/pricing/config.ts`
