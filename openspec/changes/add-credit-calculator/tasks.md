# 任务清单：通用积分计算系统

## 1. 核心模块实现
- [x] 1.1 创建 `src/custom/credits/pricing/types.ts` - 定义类型接口
  - CreditPricingRule 接口（params 为 Record<string, unknown>）
  - CreditPricingConfig 接口（包含 exchangeRate）
  - CalculateCreditsResult 类型（包含 credits, priceUsd, exchangeRate）
- [x] 1.2 创建 `src/custom/credits/pricing/config.ts` - 价格配置表
  - sora2 价格规则（sora-2-text-to-video / sora-2-image-to-video）
  - sora2-pro 价格规则（standard/high × 10s/15s）
  - 全局 exchangeRate: 200
  - 配置版本和生效日期
- [x] 1.3 创建 `src/custom/credits/pricing/calculator.ts` - 计算逻辑
  - extractPricingParams 函数（从媒体生成请求提取参数）
  - calculateCredits 函数（入参与 /api/media/generate 一致）
  - computeCredits 函数（priceUsd × exchangeRate，取整）
  - 参数精确匹配逻辑
- [x] 1.4 创建 `src/custom/credits/pricing/index.ts` - 模块导出

**验证**：✅ 类型正确，API 测试通过

## 2. API 接口实现
- [x] 2.1 创建 `src/app/api/custom/credits/calculate/route.ts`
  - POST 请求支持（入参与 /api/media/generate 一致）
  - 无需认证（项目内部使用）
  - 错误处理和响应格式

**验证**：✅ curl 测试成功，返回正确的积分计算结果

## 3. 前端集成
- [x] 3.1 在 `sora-config-fields.tsx` 中集成积分预估
  - 复用 buildSoraRequestBody 构建 payload
  - 调用 calculateCredits 计算积分
  - 显示预估积分数
- [x] 3.2 创建 `CreditEstimate` 展示组件
  - 显示积分数和对应价格
  - 余额不足提示

**验证**：✅ 创建了 CreditEstimate 组件，集成到 sora-config-fields.tsx

## 4. 重构媒体生成接口
- [x] 4.1 移除 `/api/media/generate` 中的默认值逻辑
  - 删除 DEFAULT_MODEL_NAME, DEFAULT_MODEL 等常量
  - 删除 DEFAULT_SECONDS, DEFAULT_SIZE 等常量
  - 确保前端提供完整参数

**验证**：✅ 已移除所有默认值常量，改为必需参数检查

## 5. 扩展支持（后续模型）
- [ ] 5.1 添加新模型价格配置
  - 在 config.ts 中添加规则
  - 设置对应的 priceUsd

**验证**：新模型积分计算正确

## 依赖关系

```
1.1 → 1.2 → 1.3 → 1.4 (顺序依赖)
1.4 → 2.1 (API 依赖核心模块)
1.4 → 3.1 (前端依赖核心模块)
3.1 → 3.2 → 4.1 (前端集成完成)
```

## 可并行工作

- 1.1-1.4 与 3.2 可并行（组件 UI 不依赖具体逻辑）
- 2.1 完成后可独立测试