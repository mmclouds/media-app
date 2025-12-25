# 变更：添加通用积分计算系统

## 为什么
当前项目需要为不同的 AI 模型计算积分消费，以 Sora2 视频生成为例，不同模型版本、时长、质量参数对应不同的积分价格。随着后续模型增加，需要一个统一、可扩展、前后端共用的积分计算模块，以便：
1. 前端展示生成前的积分预估
2. 后端扣费时精确计算
3. 支持未来积分涨价/降价的灵活调整

## 变更内容
- 新增通用积分计算模块 `src/custom/credits/pricing/`
- 采用**配置驱动设计**，积分价格表集中管理
- 提供统一的 `calculateCredits(model, params)` 函数，前后端共用
- 支持版本化价格配置，便于积分涨价/降价调整
- 新增 API 接口 `/api/custom/credits/calculate` 供外部调用

### 价格表示例（基于 sora2）

| 模型 | 参数 | 价格 | 积分（0.005$/积分）|
|------|------|------|-------------------|
| sora2 | 10s | $0.15 | 30 |
| sora2 | 15s | $0.175 | 35 |
| sora2-pro | standard-10s | $0.75 | 150 |
| sora2-pro | standard-15s | $1.35 | 270 |
| sora2-pro | high-10s | $1.65 | 330 |
| sora2-pro | high-15s | $3.15 | 630 |

## 设计原则

### 配置驱动
- 价格配置存储在 TypeScript 对象中，便于类型检查
- 支持按 `modelId` + `参数组合` 查找价格
- 配置变更仅需修改配置文件，无需改动逻辑代码

### 前后端共享
- 核心计算逻辑放在 `src/custom/credits/pricing/` 目录
- 不依赖 Node.js 或 React 特定 API，纯 TypeScript 实现
- 通过相对导入在前端组件和后端 API 中复用

### 扩展性
- 新增模型只需添加对应的价格配置项
- 支持多维度参数组合（模型版本、时长、质量等）
- 预留价格版本字段，支持历史价格追溯

### 类型安全
- 使用 TypeScript 强类型定义模型和参数
- 编译时检查配置完整性
- 防止运行时参数错误

## 影响
- 受影响规范：新增 `credit-calculator` 功能规范
- 受影响代码：
  - `src/custom/credits/pricing/` (新增：积分计算模块)
    - `types.ts` - 类型定义
    - `config.ts` - 价格配置表
    - `calculator.ts` - 计算逻辑
    - `index.ts` - 模块导出
  - `src/app/api/custom/credits/calculate/route.ts` (新增：积分计算 API)
  - `src/components/marketing/media-generator/` (修改：展示积分预估)
  - AI Gateway (无需集成)
