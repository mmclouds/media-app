/**
 * 积分计算模块
 *
 * 提供通用的积分计算功能，支持：
 * - 根据模型和参数计算积分消费
 * - 前后端共享计算逻辑
 * - 配置驱动的价格管理
 *
 * @example
 * ```typescript
 * import { calculateCredits } from '@/custom/credits/pricing';
 *
 * const result = calculateCredits({
 *   model: 'sora-2-text-to-video',
 *   input: { n_frames: '10' }
 * });
 *
 * if (result) {
 *   console.log(`预计消耗 ${result.credits} 积分`);
 * }
 * ```
 */

export { calculateCredits, getPricingConfig } from './calculator';
export { currentPricingConfig } from './config';
export type {
  CalculateCreditsResult,
  CreditPricingConfig,
  CreditPricingRule,
} from './types';
