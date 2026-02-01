# 变更：新增多模型 Media Studio 内页与导航入口

## 为什么
现有仅提供部分模型内页与入口，需补齐 gpt-image-1.5 / z-image / nano-banana-pro / kling-2.6 / suno 的独立内页与导航链接，方便用户按模型快速进入并形成一致的营销体验。

## 变更内容
- 新增 5 个模型内页，复用 Nano Banana 页面结构，使用基础占位文案
- 为新页面补充 Metadata 的 pathname
- 在 Navbar 与 Footer 中增加对应入口与分组链接
- 补齐中英文 i18n 文案键

## 影响
- 受影响规范：新增 media-studio-model-pages 规范增量
- 受影响代码：路由、Navbar/Footer 配置、i18n 文案、模型页面文件
