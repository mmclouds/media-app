/**
 * 积分计算器
 */

import { currentPricingConfig } from './config';
import type { CalculateCreditsResult, CreditPricingRule } from './types';

/**
 * 检查值是否为 Record 类型
 */
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * 从媒体生成请求中提取定价参数
 * @param payload - 与 /api/media/generate 相同的请求体
 */
function extractPricingParams(payload: Record<string, unknown>): {
  model: string | null;
  params: Record<string, unknown>;
} {
  // 提取 model
  const model =
    typeof payload.model === 'string' && payload.model.trim().length > 0
      ? payload.model.trim()
      : null;

  // 提取 input 中的定价相关参数
  const input = isRecord(payload.input) ? payload.input : {};
  const params: Record<string, unknown> = {};

  // 提取 n_frames（时长）
  if (typeof input.n_frames === 'string' && input.n_frames.trim().length > 0) {
    params.n_frames = input.n_frames.trim();
  }

  // 提取 size（质量等级，仅 pro 模型使用）
  if (typeof input.size === 'string' && input.size.trim().length > 0) {
    params.size = input.size.trim();
  }

  // 提取 quality（图片模型质量）
  if (typeof input.quality === 'string' && input.quality.trim().length > 0) {
    params.quality = input.quality.trim();
  }

  // 提取 duration（视频时长）
  if (typeof input.duration === 'string' && input.duration.trim().length > 0) {
    params.duration = input.duration.trim();
  } else if (
    typeof input.duration === 'number' &&
    Number.isFinite(input.duration)
  ) {
    params.duration = String(input.duration);
  }

  // 提取 sound（是否生成音频）
  if (typeof input.sound === 'boolean') {
    params.sound = input.sound;
  }

  return { model, params };
}

/**
 * 检查规则是否匹配
 * @param rule - 价格规则
 * @param model - 模型标识
 * @param params - 请求参数
 */
function matchRule(
  rule: CreditPricingRule,
  model: string,
  params: Record<string, unknown>
): boolean {
  // 模型必须匹配
  const ruleModels = Array.isArray(rule.model) ? rule.model : [rule.model];
  if (!ruleModels.includes(model)) {
    return false;
  }

  // 规则中的所有参数必须在请求中存在且值相等
  for (const [key, value] of Object.entries(rule.params)) {
    if (params[key] !== value) {
      return false;
    }
  }

  return true;
}

/**
 * 计算积分
 * @param priceUsd - 美元价格
 * @param exchangeRate - 汇率
 */
function computeCredits(priceUsd: number, exchangeRate: number): number {
  return Math.round(priceUsd * exchangeRate);
}

/**
 * 计算积分
 * @param payload - 与 /api/media/generate 相同的请求体
 * @returns 计算结果或 null（未匹配）
 */
export function calculateCredits(
  payload: Record<string, unknown>
): CalculateCreditsResult | null {
  const { model, params } = extractPricingParams(payload);

  if (!model) {
    return null;
  }

  // 在规则列表中查找匹配项
  const config = currentPricingConfig;
  const matchedRule = config.rules.find((rule) =>
    matchRule(rule, model, params)
  );

  if (!matchedRule) {
    return null;
  }

  // 使用规则级汇率或全局汇率
  const exchangeRate = matchedRule.exchangeRate ?? config.exchangeRate;
  const credits = computeCredits(matchedRule.priceUsd, exchangeRate);

  return {
    credits,
    priceUsd: matchedRule.priceUsd,
    model,
  };
}

/**
 * 获取当前价格配置
 */
export function getPricingConfig() {
  return currentPricingConfig;
}
