---

## 2. explain.md（讲解内容）必须包含以下部分

### 🟦 A. React 核心概念讲解
- 三个控件仍是函数组件，依赖 props 驱动；`defaultValue` 改为必填，父级必须显式传入初始值，通过 `value ?? defaultValue` 计算 `selectedValue`，确保受控入口统一。
- 依旧未引入 useState/useEffect，保持完全受控（或“半受控”：无 value 时落到 defaultValue），防止内部状态漂移。
- 渲染机制：选中态由 `selectedValue` 对比 option 值得出，父级更新 value/defaultValue 会触发重新渲染并更新样式。
- 最佳实践：必填默认值让组件职责清晰，避免忘记传默认导致无选中态；空值合并 `??` 可保留 0/空串等合法值。

### 🟦 B. Next.js 核心概念讲解（若本次代码使用 Next.js）
- 顶部 `"use client"` 使这些交互控件运行在浏览器端，符合 App Router 客户端组件规范，同时可与 SSR 页面组合。
- 组件位于共享目录，路由层只需引入即可复用，不需改动 page/layout；文件结构决定了 bundling 及复用边界。
- 无服务端数据获取，依赖父组件的客户端状态与 props；SSR 负责初始 HTML，水合后才能根据 value/defaultValue 呈现选中态，保证首屏后即可看到默认选项。
- TooltipProvider、Select 等属于客户端组件，只能在 `"use client"` 文件中使用，避免在 Server Component 中引入浏览器 API。

### 🟦 C. 代码逻辑拆解与架构说明
- 文件结构：`src/components/marketing/media-generator/shared/config-field-controls.tsx` 集中存放可复用的配置控件，本次仅调整其中三个组件的入参。
- ModelVersionSwitcher：`defaultValue` 必填，选中态由 `value ?? defaultValue ?? options[0]?.value ?? ''` 得出；Sora 调用处用 options 首项作为默认，若配置中的值不在 options 内则回落到默认避免无选中。
- SliderField（用于 video length、帧率、质量等离散值）：`defaultValue` 必填，Sora/Audio/Veo3 调用均传入清晰的默认秒数或帧率，选中按钮由 `selectedValue` 决定。
- AspectRatioField：同样强制 `defaultValue`，Sora/Still Image 传入默认比例；Sora 对 size 做 `replace('x', ':')` 归一化并校验是否在 options 中，不合法时回落默认。
- 其他 SelectField、ToggleField 未改动，保持纯受控；统一的必填默认值减少调用方遗漏导致的空态。

### 🟦 D. 初学者学习重点总结
- 默认值与受控值的关系：`value` 优先，其次必填的 `defaultValue`，最后兜底 options[0]；用 `??` 避免把 0/'' 当作未赋值。
- 受控组件模式：父级状态 -> props -> 组件渲染 -> onChange 回传，防止内部状态漂移。
- `"use client"` 的含义：启用客户端渲染与事件处理，App Router 下必须在文件顶部声明。
- Tooltip/卡片/按钮依赖 props 渲染，说明 UI 完全由数据驱动，易于扩展新选项；离散 options 比连续滑块更清晰可控。

---
