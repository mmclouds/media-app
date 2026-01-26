## 新增需求
### 需求：Sora2 页面模块使用 custom-blocks
系统必须将 Sora2 页面中除 studio 模块外的模块替换为 `src/components/custom-blocks/` 组件。

#### 场景：页面模块复用
- **当** 渲染 Sora2 落地页
- **那么** studio 模块保持原组件，其他模块由 custom-blocks 组件渲染

### 需求：页面内联中英文文案
系统必须在 `sora2/page.tsx` 内直接写入中英文文案，且 `zh` 使用中文文本。

#### 场景：本地化内容渲染
- **当** locale 为 `zh`
- **那么** 页面展示中文文案且不依赖外部文案文件

### 需求：Hero 结构可覆盖原有信息
系统必须支持 hero 区域保留 eyebrow、标题、副标题与 CTA 文案的展示。

#### 场景：Hero 复用
- **当** 迁移到 custom-blocks 组件
- **那么** hero 仍可展示原有四段信息

### 需求：保持 SEO 与 studio 模块不变
系统必须保持 Sora2 页面 SEO 元数据与 studio 模块行为不变。

#### 场景：页面关键内容稳定
- **当** 完成模块替换
- **那么** metadata 与 `MediaOnlyGeneratorWorkspace` 用法保持一致
