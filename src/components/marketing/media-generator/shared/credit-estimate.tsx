/**
 * 积分预估展示组件
 */

import type { CalculateCreditsResult } from '@/custom/credits/pricing/types';

interface CreditEstimateProps {
  /** 积分计算结果 */
  result: CalculateCreditsResult | null;
  /** 是否正在计算 */
  loading?: boolean;
  /** 错误信息 */
  error?: string | null;
  /** 用户当前积分余额 */
  userCredits?: number;
}

export function CreditEstimate({
  result,
  loading,
  error,
  userCredits,
}: CreditEstimateProps) {
  // 显示加载状态
  if (loading) {
    return (
      <div className="rounded-2xl border border-white/15 bg-[#0b0d10] p-3 text-sm shadow-inner shadow-black/40">
        <div className="flex items-center justify-between">
          <span className="text-white/70">积分预估</span>
          <span className="h-4 w-16 animate-pulse rounded bg-white/20"></span>
        </div>
        <div className="mt-1 flex items-center justify-between text-xs text-white/50">
          <span>价格</span>
          <span className="h-3 w-12 animate-pulse rounded bg-white/10"></span>
        </div>
      </div>
    );
  }

  // 显示错误信息
  if (error) {
    return (
      <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-3 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-white/70">积分预估</span>
          <span className="text-red-400">计算失败</span>
        </div>
        <div className="mt-1 text-xs text-red-400/80">{error}</div>
      </div>
    );
  }

  // 显示计算结果
  if (result) {
    const hasEnoughCredits =
      userCredits === undefined || userCredits >= result.credits;

    return (
      <div
        className={`rounded-2xl border p-3 text-sm ${
          hasEnoughCredits
            ? 'border-green-500/30 bg-green-500/10'
            : 'border-red-500/30 bg-red-500/10'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-white/70">积分预估</span>
          <span
            className={`font-semibold ${
              hasEnoughCredits ? 'text-green-400' : 'text-red-400'
            }`}
          >
            {result.credits} 积分
          </span>
        </div>
        <div className="mt-1 flex items-center justify-between text-xs">
          <span className="text-white/50">价格</span>
          <span className="text-white/70">${result.priceUsd.toFixed(3)}</span>
        </div>
        {userCredits !== undefined && (
          <div className="mt-1 flex items-center justify-between text-xs">
            <span className="text-white/50">余额</span>
            <span
              className={
                hasEnoughCredits ? 'text-green-400/80' : 'text-red-400/80'
              }
            >
              {userCredits} 积分
            </span>
          </div>
        )}
      </div>
    );
  }

  // 无数据状态
  return (
    <div className="rounded-2xl border border-white/15 bg-[#0b0d10] p-3 text-sm shadow-inner shadow-black/40">
      <div className="flex items-center justify-between">
        <span className="text-white/70">积分预估</span>
        <span className="text-white/50">-</span>
      </div>
      <div className="mt-1 flex items-center justify-between text-xs text-white/50">
        <span>配置后显示预估</span>
      </div>
    </div>
  );
}
