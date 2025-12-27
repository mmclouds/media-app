# credit-calculator Specification

## Purpose
TBD - created by archiving change add-credit-calculator. Update Purpose after archive.
## 需求
### 需求：积分计算核心功能
系统必须提供统一的积分计算函数 `calculateCredits(payload)`，入参与 `/api/media/generate` 接口保持一致，根据模型和参数返回计算后的积分数。

#### 场景：计算 sora2 文本生成视频 10秒积分
- **当** 调用 `calculateCredits({ model: 'sora-2-text-to-video', input: { n_frames: '10' } })` 时
- **那么** 返回结果包含 `credits: 30`（0.15 × 200 = 30）

#### 场景：计算 sora2-pro high 质量 15秒积分
- **当** 调用 `calculateCredits({ model: 'sora-2-pro-text-to-video', input: { n_frames: '15', size: 'high' } })` 时
- **那么** 返回结果包含 `credits: 630`（3.15 × 200 = 630）

#### 场景：未匹配的模型参数
- **当** 调用 `calculateCredits({ model: 'unknown-model', input: {} })` 时
- **那么** 返回 null 表示无法计算

### 需求：价格配置管理
系统必须通过配置文件管理美元价格和汇率，积分由价格 × 汇率实时计算得出。

#### 场景：读取当前价格配置
- **当** 导入 `currentPricingConfig` 时
- **那么** 返回包含版本号、生效日期、全局汇率和价格规则列表的配置对象

#### 场景：配置包含美元价格和汇率
- **当** 查看价格规则时
- **那么** 每条规则必须包含 `priceUsd` 字段（美元价格），可选包含 `exchangeRate` 字段覆盖全局汇率

#### 场景：积分实时计算
- **当** 匹配到价格规则后计算积分时
- **那么** 积分 = Math.round(priceUsd × exchangeRate)，优先使用规则级 exchangeRate，未定义则使用全局 exchangeRate

### 需求：灵活的参数匹配
系统必须支持任意参数组合的精确匹配，不同模型可以有不同的定价参数。

#### 场景：sora2 模型按时长定价
- **当** sora2 模型配置规则 `{ model: 'sora-2-text-to-video', params: { n_frames: '10' }, priceUsd: 0.15 }` 时
- **那么** 只需匹配 `n_frames` 参数即可计算积分

#### 场景：sora2-pro 模型按时长和质量定价
- **当** sora2-pro 模型配置规则 `{ model: 'sora-2-pro-text-to-video', params: { n_frames: '15', size: 'high' }, priceUsd: 3.15 }` 时
- **那么** 需同时匹配 `n_frames` 和 `size` 参数才能计算积分

### 需求：积分计算 API
系统必须提供 `/api/custom/credits/calculate` HTTP 接口，入参与 `/api/media/generate` 保持一致。

#### 场景：POST 请求计算积分
- **当** 发送 `POST /api/custom/credits/calculate` 请求，body 为 `{ "model": "sora-2-text-to-video", "input": { "n_frames": "10" } }` 时
- **那么** 返回 JSON 响应 `{ "success": true, "data": { "credits": 30, "priceUsd": 0.15, "exchangeRate": 200, "model": "sora-2-text-to-video", "configVersion": "2024.12" } }`

#### 场景：无效模型参数
- **当** 发送请求的模型或参数无法匹配价格规则时
- **那么** 返回 JSON 响应 `{ "success": false, "message": "No matching pricing rule found" }` 和 HTTP 400 状态码

#### 场景：缺少必需参数
- **当** 发送请求缺少 `model` 字段且无法从 payload 中提取模型信息时
- **那么** 返回 JSON 响应 `{ "success": false, "message": "Missing required parameter: model" }` 和 HTTP 400 状态码

### 需求：前后端共享计算逻辑
积分计算核心模块必须支持在前端和后端环境中使用，不依赖平台特定 API。

#### 场景：前端导入使用
- **当** 在 React 客户端组件中 `import { calculateCredits } from '@/custom/credits/pricing'` 时
- **那么** 可以正常调用并获取计算结果

#### 场景：后端导入使用
- **当** 在 Next.js API 路由中 `import { calculateCredits } from '@/custom/credits/pricing'` 时
- **那么** 可以正常调用并获取计算结果

### 需求：类型安全
积分计算模块必须提供完整的 TypeScript 类型定义，支持编译时类型检查。

#### 场景：价格规则类型定义
- **当** 定义价格规则时
- **那么** `params` 字段类型为 `Record<string, unknown>`，支持任意参数组合

#### 场景：计算结果类型
- **当** 调用 `calculateCredits` 函数时
- **那么** 返回类型为 `CalculateCreditsResult | null`，包含 credits、priceUsd、exchangeRate、model、configVersion 字段

### 需求：价格扩展支持
系统必须支持通过添加配置来扩展新模型的价格，无需修改计算逻辑。

#### 场景：添加新模型价格
- **当** 在 `config.ts` 的 `rules` 数组中添加新的 `CreditPricingRule` 对象时
- **那么** `calculateCredits` 函数自动支持新模型的积分计算

#### 场景：全局汇率调整
- **当** 修改配置中的全局 `exchangeRate` 值时
- **那么** 所有使用全局汇率的规则自动按新汇率计算积分

#### 场景：单独规则汇率覆盖
- **当** 某条规则需要使用不同汇率时
- **那么** 可以在规则中设置 `exchangeRate` 字段覆盖全局汇率

