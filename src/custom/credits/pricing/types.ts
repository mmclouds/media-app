/**
 * 积分计算模块类型定义
 */

/**
 * 价格规则 - 定义美元价格，积分由计算得出
 * params 为任意键值对，支持不同模型的不同参数组合
 */
export interface CreditPricingRule {
  /**
   * 模型标识
   * 可以是单个模型（如 'sora-2-text-to-video'）
   * 或多个模型的数组（如 ['sora-2-text-to-video', 'sora-2-image-to-video']）
   */
  model: string | string[];
  /** 参数匹配条件，任意键值对 */
  params: Record<string, unknown>;
  /** 美元价格 */
  priceUsd: number;
  /** 可选，行级汇率覆盖（未定义则使用全局汇率） */
  exchangeRate?: number;
}

/**
 * 价格配置
 */
export interface CreditPricingConfig {
  /** 配置版本，如 '2024.12' */
  version: string;
  /** 生效日期 */
  effectiveDate: string;
  /** 全局汇率：1 USD = exchangeRate 积分 */
  exchangeRate: number;
  /** 价格规则列表 */
  rules: CreditPricingRule[];
}

/**
 * 积分计算结果
 */
export interface CalculateCreditsResult {
  /** 计算后的积分（整数） */
  credits: number;
  /** 美元价格 */
  priceUsd: number;
  model: string;
}
