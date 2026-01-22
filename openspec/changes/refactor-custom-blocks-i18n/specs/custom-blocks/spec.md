## 新增需求
### 需求：提供 Home blocks 的可复用自定义副本
系统必须在 `src/components/custom-blocks/` 下提供 Home 页面 blocks 的可复用组件副本，覆盖 Home 页面中当前使用或注释的 blocks 组件。

#### 场景：创建自定义 blocks 目录
- **当** 需要为其他页面复用 Home blocks
- **那么** `src/components/custom-blocks/` 下存在与 Home blocks 对应的组件文件

### 需求：自定义 blocks 不依赖 next-intl
系统必须移除自定义 blocks 中对 `next-intl` 的使用，避免组件内部直接调用多语言逻辑。

#### 场景：组件复用到其他页面
- **当** 页面需要传入自定义文案
- **那么** 自定义 blocks 通过 props 接收文案与节点，而不是在组件内部调用 `next-intl`

### 需求：多语言文案以扁平 props 传入
系统必须使用扁平 props 传入多语言内容，且允许 `ReactNode` 作为内容值。

#### 场景：传入富文本或带链接内容
- **当** 调用方需要在文案中插入链接或强调样式
- **那么** 自定义 blocks 支持通过 `ReactNode` 传入对应内容

### 需求：保持原 blocks 与 Home 页面不变
系统必须保持 `src/components/blocks/` 与 Home 页面现有实现不变，禁止修改其代码。

#### 场景：迁移复用能力
- **当** 新增自定义 blocks
- **那么** 原 `src/components/blocks/` 与 Home 页面保持原状且功能不受影响
