## 新增需求
### 需求：多模型 Media Studio 内页
系统必须新增以下模型内页，并复用 Nano Banana 页面结构与区块顺序：
- GPT-Image-1.5
- Z-Image
- Nano Banana Pro
- Kling 2.6
- Suno

#### 场景：访问模型内页
- **当** 用户访问 `/media-studio/gpt-image-1-5`、`/media-studio/z-image`、`/media-studio/nano-banana-pro`、`/media-studio/kling-2-6`、`/media-studio/suno`
- **那么** 页面结构与 Nano Banana 内页一致，仅文案与模型配置按该模型替换
- **并且** 示例图片区域可使用视频静帧或视频示意图

### 需求：模型内页 Metadata
系统必须为每个新增内页配置 metadata pathname，与页面路由保持一致。

#### 场景：生成页面 Metadata
- **当** 系统生成模型内页的 Metadata
- **那么** pathname 必须等于对应内页 URL

### 需求：导航入口
系统必须在 Navbar 中提供新增模型的入口链接，并与现有模型分组一致。

#### 场景：浏览模型入口
- **当** 用户打开 Navbar 的模型下拉菜单
- **那么** 能看到并点击新增模型入口

### 需求：Footer 入口
系统必须在 Footer 的模型分组中增加新增模型入口，与现有分组结构一致。

#### 场景：浏览 Footer 模型入口
- **当** 用户查看页面 Footer
- **那么** 能看到新增模型入口并跳转到对应内页

### 需求：基础占位文案
系统必须提供新增内页的中英文基础占位文案，且前台展示内容使用英文。

#### 场景：渲染页面文案
- **当** 用户以任一语言访问新增模型内页
- **那么** 页面显示与该模型对应的基础文案，不出现空文案键
