## 新增需求
### 需求：Nano Banana Studio 页面默认模型
系统应提供 media-studio 的 nano-banana 页面，并在进入时默认选中图片类型与 nano-banana 模型，同时允许用户切换媒体类型与模型。

#### 场景：默认进入 nano-banana
- **当** 用户访问 `/media-studio/nano-banana`
- **那么** 媒体类型默认为 `image`
- **并且** 默认模型为 `nano-banana`
- **并且** 用户仍可切换到其他媒体类型与模型

### 需求：页面元信息
系统应为 nano-banana 页面提供独立的 metadata 以便 SEO 与导航识别。

#### 场景：生成 metadata
- **当** 生成 `/media-studio/nano-banana` 的 metadata
- **那么** `title` 与 `description` 使用该页面专属文案
- **并且** `pathname` 为 `/media-studio/nano-banana`
