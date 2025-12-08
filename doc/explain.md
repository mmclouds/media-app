---

## 2. explain.md（讲解内容）必须包含以下部分

### 🟦 A. React 核心概念讲解
- `SoraConfigFields`、`SingleImageUploadField` 仍是函数组件，受控模式由父级提供配置和回调；限制提示由 props 派生。
- `SingleImageUploadField` 通过 `useState` 管理读取状态与错误，`useRef` 关联隐藏的 file input，实现受控触发；校验逻辑仍在组件内完成。
- 使用派生值（如 `normalizedMaxSize`、`mode`、`inputImage`）在渲染前做合法性与兜底处理，避免空态或异常值带来的渲染问题。
- 视图随 props/state 变化即时更新：切换模式或上传通过回调修改父级状态后，空态提示/限制文案、按钮样式都会重渲染。

### 🟦 B. Next.js 核心概念讲解（若本次代码使用 Next.js）
- 顶部的 `"use client"` 让组件运行在浏览器端，可使用 FileReader、事件处理等客户端能力，与 App Router 的服务器组件组合时由 SSR 输出初始结构，水合后执行交互。
- 组件位于 `src/components/marketing/media-generator/...`，与路由层解耦；结构清晰利于按需引入并被 Next.js 按目录分块。
- 无服务端数据拉取，纯客户端交互场景：初始 HTML 由 SSR 输出，占位提示可立即呈现，水合后才可触发上传与校验。

### 🟦 C. 代码逻辑拆解与架构说明
- `single-image-upload-field.tsx`：仅校验单张图片的大小，`normalizedMaxSize` 复用在校验、占位提示和底部提示。读取成功返回 dataURL，失败给出英文错误并记录中文日志。
- 空态区域：占位卡片内直接展示大小限制，底部 Limit 行同步展示，保持提示一致。
- `sora-config-fields.tsx`：Image to Video 模式下渲染单图上传控件，透传 10MB 大小限制。
- 数据流：父组件集中持有 `config`，子组件只在内部做校验与回调；模式切换与上传输入都通过 `onChange` 写回，确保提交时参数完整一致。

### 🟦 D. 初学者学习重点总结
- 受控组件与状态提升：值存父级，子组件只渲染和回调。
- 派生值兜底：用 normalized 大小值统一限制，避免非法输入。
- 客户端组件：声明 `"use client"` 才能使用 FileReader/事件。
- 文件上传校验：按大小校验并给出友好文案提示。
- 数据驱动 UI：限制提示、按钮文案、预览均由配置派生，便于扩展。

---
