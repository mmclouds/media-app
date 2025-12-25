/**
 * 积分价格配置
 */

import type { CreditPricingConfig } from './types';

/**
 * 当前价格配置
 * 积分 = priceUsd × exchangeRate（四舍五入取整）
 *
 * model 支持单个模型或多个模型数组，可以合并相同参数的不同模型配置
 */
export const currentPricingConfig: CreditPricingConfig = {
  version: '2024.12',
  effectiveDate: '2024-12-01',
  exchangeRate: 200, // 全局汇率：1 USD = 200 积分 (0.005 $/积分)
  rules: [
    // ==================== sora2 ====================
    // 10 秒视频（text-to-video 和 image-to-video 合并）
    {
      model: ['sora-2-text-to-video', 'sora-2-image-to-video'],
      params: { n_frames: '10' },
      priceUsd: 0.15, // 30 积分
    },
    // 15 秒视频（text-to-video 和 image-to-video 合并）
    {
      model: ['sora-2-text-to-video', 'sora-2-image-to-video'],
      params: { n_frames: '15' },
      priceUsd: 0.175, // 35 积分
    },

    // ==================== sora2-pro standard ====================
    // 10 秒 standard 质量（text-to-video 和 image-to-video 合并）
    {
      model: ['sora-2-pro-text-to-video', 'sora-2-pro-image-to-video'],
      params: { n_frames: '10', size: 'standard' },
      priceUsd: 0.75, // 150 积分
    },
    // 15 秒 standard 质量（text-to-video 和 image-to-video 合并）
    {
      model: ['sora-2-pro-text-to-video', 'sora-2-pro-image-to-video'],
      params: { n_frames: '15', size: 'standard' },
      priceUsd: 1.35, // 270 积分
    },

    // ==================== sora2-pro high ====================
    // 10 秒 high 质量（text-to-video 和 image-to-video 合并）
    {
      model: ['sora-2-pro-text-to-video', 'sora-2-pro-image-to-video'],
      params: { n_frames: '10', size: 'high' },
      priceUsd: 1.65, // 330 积分
    },
    // 15 秒 high 质量（text-to-video 和 image-to-video 合并）
    {
      model: ['sora-2-pro-text-to-video', 'sora-2-pro-image-to-video'],
      params: { n_frames: '15', size: 'high' },
      priceUsd: 3.15, // 630 积分
    },
  ],
};
