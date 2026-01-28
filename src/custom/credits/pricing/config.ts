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

    // ==================== veo3.1 ====================
    {
      model: 'veo3_fast',
      params: {},
      priceUsd: 0.3, // 60 积分
    },
    {
      model: 'veo3',
      params: {},
      priceUsd: 1.25, // 250 积分
    },

    // ==================== kling 2.6 ====================
    {
      model: ['kling-2.6/text-to-video', 'kling-2.6/image-to-video'],
      params: { sound: false, duration: '5' },
      priceUsd: 0.28, // 56 积分
    },
    {
      model: ['kling-2.6/text-to-video', 'kling-2.6/image-to-video'],
      params: { sound: false, duration: '10' },
      priceUsd: 0.55, // 110 积分
    },
    {
      model: ['kling-2.6/text-to-video', 'kling-2.6/image-to-video'],
      params: { sound: true, duration: '5' },
      priceUsd: 0.55, // 110 积分
    },
    {
      model: ['kling-2.6/text-to-video', 'kling-2.6/image-to-video'],
      params: { sound: true, duration: '10' },
      priceUsd: 1.1, // 220 积分
    },

    // ==================== nano-banana ====================
    {
      model: ['google/nano-banana', 'google/nano-banana-edit'],
      params: {},
      priceUsd: 0.02, // 4 积分
    },

    // ==================== nano-banana-pro ====================
    {
      model: 'google/nano-banana-pro',
      params: { resolution: '1K' },
      priceUsd: 0.09, // 18 积分
    },
    {
      model: 'google/nano-banana-pro',
      params: { resolution: '2K' },
      priceUsd: 0.09, // 18 积分
    },
    {
      model: 'google/nano-banana-pro',
      params: { resolution: '4K' },
      priceUsd: 0.12, // 24 积分
    },

    // ==================== gpt-image-1.5 ====================
    {
      model: ['gpt-image/1.5-text-to-image', 'gpt-image/1.5-image-to-image'],
      params: { quality: 'medium' },
      priceUsd: 0.02, // 4 积分
    },
    {
      model: ['gpt-image/1.5-text-to-image', 'gpt-image/1.5-image-to-image'],
      params: { quality: 'high' },
      priceUsd: 0.11, // 22 积分
    },

    // ==================== z-image ====================
    {
      model: 'z-image',
      params: {},
      priceUsd: 0.004, // 1 积分
    },

    // ==================== suno v5 ====================
    {
      model: 'V5',
      params: {},
      priceUsd: 0.06, // 12 积分
    },
  ],
};
