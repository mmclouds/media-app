/**
 * 积分价格配置
 */

import type { CreditPricingConfig } from './types';

/**
 * 当前价格配置
 * 积分 = priceUsd × exchangeRate（四舍五入取整）
 */
export const currentPricingConfig: CreditPricingConfig = {
  version: '2024.12',
  effectiveDate: '2024-12-01',
  exchangeRate: 200, // 全局汇率：1 USD = 200 积分 (0.005 $/积分)
  rules: [
    // ==================== sora2 ====================
    // sora-2-text-to-video
    {
      model: 'sora-2-text-to-video',
      params: { n_frames: '10' },
      priceUsd: 0.15, // 30 积分
    },
    {
      model: 'sora-2-text-to-video',
      params: { n_frames: '15' },
      priceUsd: 0.175, // 35 积分
    },
    // sora-2-image-to-video
    {
      model: 'sora-2-image-to-video',
      params: { n_frames: '10' },
      priceUsd: 0.15, // 30 积分
    },
    {
      model: 'sora-2-image-to-video',
      params: { n_frames: '15' },
      priceUsd: 0.175, // 35 积分
    },

    // ==================== sora2-pro standard ====================
    // sora-2-pro-text-to-video standard
    {
      model: 'sora-2-pro-text-to-video',
      params: { n_frames: '10', size: 'standard' },
      priceUsd: 0.75, // 150 积分
    },
    {
      model: 'sora-2-pro-text-to-video',
      params: { n_frames: '15', size: 'standard' },
      priceUsd: 1.35, // 270 积分
    },
    // sora-2-pro-image-to-video standard
    {
      model: 'sora-2-pro-image-to-video',
      params: { n_frames: '10', size: 'standard' },
      priceUsd: 0.75, // 150 积分
    },
    {
      model: 'sora-2-pro-image-to-video',
      params: { n_frames: '15', size: 'standard' },
      priceUsd: 1.35, // 270 积分
    },

    // ==================== sora2-pro high ====================
    // sora-2-pro-text-to-video high
    {
      model: 'sora-2-pro-text-to-video',
      params: { n_frames: '10', size: 'high' },
      priceUsd: 1.65, // 330 积分
    },
    {
      model: 'sora-2-pro-text-to-video',
      params: { n_frames: '15', size: 'high' },
      priceUsd: 3.15, // 630 积分
    },
    // sora-2-pro-image-to-video high
    {
      model: 'sora-2-pro-image-to-video',
      params: { n_frames: '10', size: 'high' },
      priceUsd: 1.65, // 330 积分
    },
    {
      model: 'sora-2-pro-image-to-video',
      params: { n_frames: '15', size: 'high' },
      priceUsd: 3.15, // 630 积分
    },
  ],
};
