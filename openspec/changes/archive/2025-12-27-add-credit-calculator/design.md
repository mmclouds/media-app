# 技术设计：通用积分计算系统

## 上下文
- 项目需要为多种 AI 模型（sora2、sora2-pro 等）计算积分消费
- 积分价格由模型类型和参数组合决定（时长、质量等）
- 需要前后端共用计算逻辑，确保一致性
- 需要支持未来的积分涨价/降价调整
- 积分由美元价格实时计算，便于统一调整汇率

## 目标
- 提供统一的积分计算 API，入参与 `/api/media/generate` 保持一致
- 配置驱动，新增模型或调整价格无需修改逻辑代码
- 前后端共享，避免重复实现
- 类型安全，编译时发现配置错误
- 支持价格版本控制，便于追溯和回滚
- 积分由美元价格 × 汇率实时计算，支持全局汇率调整

## 非目标
- 不处理积分扣费逻辑（已有 `consumeCredits` 处理）
- 不存储历史价格到数据库（通过配置版本管理）
- 不实现实时价格同步（配置变更需重新部署）
- 不对外部提供 API（仅项目内部使用）

## 决策

### 1. 价格配置结构

采用灵活的参数匹配结构，不同模型可以有不同的定价参数：

```typescript
// src/custom/credits/pricing/types.ts

/**
 * 价格规则 - 定义美元价格，积分由计算得出
 * params 为任意键值对，支持不同模型的不同参数组合
 */
export interface CreditPricingRule {
  model: string;                      // 模型标识，如 'sora-2-text-to-video'
  params: Record<string, unknown>;    // 参数匹配条件，任意键值对
  priceUsd: number;                   // 美元价格
  exchangeRate?: number;              // 可选，行级汇率覆盖（未定义则使用全局汇率）
}

/**
 * 价格配置
 */
export interface CreditPricingConfig {
  version: string;                    // 配置版本，如 '2024.12'
  effectiveDate: string;              // 生效日期
  exchangeRate: number;               // 全局汇率：1 USD = exchangeRate 积分
  rules: CreditPricingRule[];         // 价格规则列表
}

/**
 * 计算结果
 */
export interface CalculateCreditsResult {
  credits: number;                    // 计算后的积分（整数）
  priceUsd: number;                   // 原始美元价格
  exchangeRate: number;               // 使用的汇率
  model: string;                      // 匹配的模型
  configVersion: string;              // 配置版本
}
```

### 2. API 入参设计

入参与 `/api/media/generate` 保持一致，直接透传请求体：

```typescript
// API 入参格式（与 /api/media/generate 相同）
interface CalculateRequest {
  mediaType?: string;                 // 媒体类型：VIDEO | IMAGE | AUDIO
  modelName?: string;                 // 模型名称，如 'sora2'
  model?: string;                     // 具体模型，如 'sora-2-text-to-video'
  input?: {                           // 模型输入参数
    prompt?: string;
    aspect_ratio?: string;
    n_frames?: string;                // 时长帧数，如 '10', '15'
    size?: string;                    // 质量等级：'standard' | 'high'
    [key: string]: unknown;
  };
  [key: string]: unknown;             // 其他透传参数
}
```

### 3. 匹配算法

从请求体中提取关键参数，与配置规则进行精确匹配：

```typescript
// src/custom/credits/pricing/calculator.ts

/**
 * 从媒体生成请求中提取定价参数
 */
function extractPricingParams(payload: Record<string, unknown>): {
  model: string | null;
  params: Record<string, unknown>;
} {
  // 提取 model（优先使用 payload.model，其次使用 modelName）
  // 提取 input 中的定价相关参数（n_frames, size 等）
}

/**
 * 计算积分
 * @param payload - 与 /api/media/generate 相同的请求体
 * @returns 计算结果或 null（未匹配）
 */
export function calculateCredits(
  payload: Record<string, unknown>
): CalculateCreditsResult | null {
  // 1. 提取定价参数
  // 2. 在规则列表中查找匹配项（model + params 精确匹配）
  // 3. 计算积分：Math.round(priceUsd * exchangeRate)
  // 4. 返回结果（包含积分、价格、汇率等信息）
}
```

### 4. 配置示例

```typescript
// src/custom/credits/pricing/config.ts
export const currentPricingConfig: CreditPricingConfig = {
  version: '2024.12',
  effectiveDate: '2024-12-01',
  exchangeRate: 200, // 全局汇率：1 USD = 200 积分 (0.005 $/积分)
  rules: [
    // sora2 (sora-2-text-to-video / sora-2-image-to-video)
    {
      model: 'sora-2-text-to-video',
      params: { n_frames: '10' },
      priceUsd: 0.15
    },
    {
      model: 'sora-2-text-to-video',
      params: { n_frames: '15' },
      priceUsd: 0.175
    },
    {
      model: 'sora-2-image-to-video',
      params: { n_frames: '10' },
      priceUsd: 0.15
    },
    {
      model: 'sora-2-image-to-video',
      params: { n_frames: '15' },
      priceUsd: 0.175
    },

    // sora2-pro standard (sora-2-pro-text-to-video / sora-2-pro-image-to-video)
    {
      model: 'sora-2-pro-text-to-video',
      params: { n_frames: '10', size: 'standard' },
      priceUsd: 0.75
    },
    {
      model: 'sora-2-pro-text-to-video',
      params: { n_frames: '15', size: 'standard' },
      priceUsd: 1.35
    },

    // sora2-pro high
    {
      model: 'sora-2-pro-text-to-video',
      params: { n_frames: '10', size: 'high' },
      priceUsd: 1.65
    },
    {
      model: 'sora-2-pro-text-to-video',
      params: { n_frames: '15', size: 'high' },
      priceUsd: 3.15
    },

    // ... sora-2-pro-image-to-video 类似配置
  ],
};
```

### 5. 积分计算逻辑

```typescript
// 积分计算公式
function computeCredits(priceUsd: number, exchangeRate: number): number {
  // 美元价格 × 汇率，四舍五入取整
  return Math.round(priceUsd * exchangeRate);
}

// 示例计算
// sora2 10s: 0.15 * 200 = 30 积分
// sora2-pro high 15s: 3.15 * 200 = 630 积分
```

### 6. API 接口

```typescript
// src/app/api/custom/credits/calculate/route.ts
// POST /api/custom/credits/calculate
// 入参与 /api/media/generate 相同，直接透传整个请求体

// 请求示例（与 /api/media/generate 相同格式）
{
  "modelName": "sora2",
  "model": "sora-2-text-to-video",
  "input": {
    "prompt": "A cat walking",
    "aspect_ratio": "landscape",
    "n_frames": "10"
  }
}

// 响应格式
{
  "success": true,
  "data": {
    "credits": 30,
    "priceUsd": 0.15,
    "exchangeRate": 200,
    "model": "sora-2-text-to-video",
    "configVersion": "2024.12"
  }
}

// 错误响应
{
  "success": false,
  "message": "No matching pricing rule found"
}
```

### 7. 前端集成

前端负责提供完整参数，不依赖后端默认值：

```typescript
// 组件中使用
import { calculateCredits } from '@/custom/credits/pricing';

// 构建与生成接口相同的 payload
const payload = buildSoraRequestBody({ prompt, resolvedConfig, fileUuids });
const result = calculateCredits(payload);

if (result) {
  // 显示：预计消耗 30 积分 ($0.15)
  console.log(`预计消耗 ${result.credits} 积分 ($${result.priceUsd})`);
}
```

### 8. 默认值处理原则

**重要**：`/api/media/generate` 不应添加任何默认值逻辑，所有参数默认值由前端提供：

- 前端组件（如 `sora-config-fields.tsx`）负责设置默认值
- 前端在调用生成接口前构建完整的 payload
- 积分计算使用相同的 payload，确保一致性
- 后端 API 仅做透传，不修改参数

## 考虑的替代方案

### A. 数据库存储价格配置
- **优点**：支持动态修改价格，无需重新部署
- **缺点**：增加数据库依赖，前端无法直接使用，增加复杂度
- **结论**：暂不采用，配置变更频率低，代码配置足够

### B. 直接存储积分而非美元价格
- **优点**：计算更简单
- **缺点**：全局汇率调整时需修改所有规则，维护成本高
- **结论**：不采用，存储美元价格 + 汇率更灵活

### C. 固定参数字段定义
- **优点**：类型更严格
- **缺点**：不同模型参数不同，无法统一定义
- **结论**：不采用，使用 `Record<string, unknown>` 更灵活

## 风险与权衡

| 风险 | 缓解措施 |
|------|----------|
| 配置遗漏导致计算失败 | TypeScript 类型检查 + 参数匹配失败返回 null |
| 前后端配置不同步 | 共享同一配置文件，CI 校验 |
| 汇率计算精度问题 | 使用 Math.round 确保整数积分 |
| 参数匹配模糊 | 严格精确匹配所有 params 字段 |
| 前端未提供完整参数 | 前端组件统一设置默认值，API 不做默认值处理 |

## 迁移计划

1. **第一阶段**：实现核心计算模块和 API
2. **第二阶段**：前端集成，展示积分预估
3. **第三阶段**：重构 `/api/media/generate`，移除默认值逻辑

无需数据库迁移，不影响现有积分系统。

## 待决问题

1. 积分预估是否需要考虑用户等级折扣？
   - 暂不考虑，后续需求明确后再扩展
2. 是否需要支持行级汇率覆盖的场景？
   - 已支持，但当前所有规则使用全局汇率
