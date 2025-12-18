'use client';

import { motion } from 'framer-motion';
import { TrendingDown, TrendingUp, Minus, Calendar, Users } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';

interface Bid {
  id: string;
  round: number;
  bidDate: string | null;
  minimumPrice: string;
  result: string;
  winningPrice: string | null;
  bidderCount: number | null;
}

interface BidHistoryProps {
  bids: Bid[];
  appraisalPrice: string;
}

const resultLabels: Record<string, { label: string; color: string; icon: typeof TrendingDown }> = {
  FAILED: { label: '유찰', color: 'text-orange-400', icon: TrendingDown },
  SUCCESSFUL: { label: '낙찰', color: 'text-green-400', icon: TrendingUp },
  WITHDRAWN: { label: '취하', color: 'text-gray-400', icon: Minus },
  POSTPONED: { label: '연기', color: 'text-blue-400', icon: Calendar },
};

function formatPrice(price: string | number): string {
  const num = typeof price === 'string' ? parseInt(price) : price;
  if (num >= 100000000) {
    const uk = Math.floor(num / 100000000);
    const man = Math.floor((num % 100000000) / 10000);
    return man > 0 ? `${uk}억 ${man.toLocaleString()}만` : `${uk}억`;
  }
  if (num >= 10000) {
    return `${Math.floor(num / 10000).toLocaleString()}만`;
  }
  return num.toLocaleString();
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function calculateRate(price: string, appraisalPrice: string): number {
  const p = parseInt(price);
  const a = parseInt(appraisalPrice);
  return Math.round((p / a) * 100);
}

export function BidHistory({ bids, appraisalPrice }: BidHistoryProps) {
  // 회차 기준 정렬 (최신 순)
  const sortedBids = [...bids].sort((a, b) => b.round - a.round);

  if (sortedBids.length === 0) {
    return (
      <GlassCard className="p-6 text-center">
        <Calendar className="w-12 h-12 text-gray-500 mx-auto mb-3" />
        <p className="text-gray-400">입찰 내역이 없습니다.</p>
        <p className="text-sm text-gray-500 mt-1">1회차 입찰 예정입니다.</p>
      </GlassCard>
    );
  }

  return (
    <div className="space-y-4">
      {/* 타임라인 */}
      <div className="relative">
        {sortedBids.map((bid, index) => {
          const resultInfo = resultLabels[bid.result] || resultLabels.FAILED;
          const ResultIcon = resultInfo.icon;
          const rate = calculateRate(bid.minimumPrice, appraisalPrice);

          return (
            <motion.div
              key={bid.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="relative pl-8 pb-4 last:pb-0"
            >
              {/* 연결선 */}
              {index < sortedBids.length - 1 && (
                <div className="absolute left-3 top-8 bottom-0 w-0.5 bg-white/10" />
              )}

              {/* 회차 마커 */}
              <div className={`absolute left-0 top-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                bid.result === 'SUCCESSFUL'
                  ? 'bg-green-500 text-white'
                  : bid.result === 'FAILED'
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-600 text-white'
              }`}>
                {bid.round}
              </div>

              <GlassCard className={`p-4 ${
                bid.result === 'SUCCESSFUL'
                  ? 'bg-green-500/10 border-green-500/30'
                  : ''
              }`}>
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm text-gray-400">
                        {formatDate(bid.bidDate)}
                      </span>
                      <span className={`flex items-center gap-1 text-sm font-medium ${resultInfo.color}`}>
                        <ResultIcon className="w-4 h-4" />
                        {resultInfo.label}
                      </span>
                    </div>

                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-bold text-white">
                        {formatPrice(bid.minimumPrice)}원
                      </span>
                      <span className="text-sm text-gray-400">
                        (감정가 대비 {rate}%)
                      </span>
                    </div>

                    {/* 낙찰가 표시 */}
                    {bid.result === 'SUCCESSFUL' && bid.winningPrice && (
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-sm text-gray-400">낙찰가:</span>
                        <span className="text-green-400 font-bold">
                          {formatPrice(bid.winningPrice)}원
                        </span>
                        <span className="text-sm text-gray-400">
                          ({calculateRate(bid.winningPrice, appraisalPrice)}%)
                        </span>
                      </div>
                    )}
                  </div>

                  {/* 입찰자 수 */}
                  {bid.bidderCount !== null && (
                    <div className="flex items-center gap-1 text-sm text-gray-400">
                      <Users className="w-4 h-4" />
                      {bid.bidderCount}명
                    </div>
                  )}
                </div>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>

      {/* 가격 변동 요약 */}
      {sortedBids.length > 1 && (
        <GlassCard className="p-4 bg-blue-500/10 border-blue-500/20">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">가격 하락률</span>
            <span className="text-blue-300 font-medium">
              {(() => {
                const firstBid = sortedBids[sortedBids.length - 1];
                const lastBid = sortedBids[0];
                const firstRate = calculateRate(firstBid.minimumPrice, appraisalPrice);
                const lastRate = calculateRate(lastBid.minimumPrice, appraisalPrice);
                return `${firstRate}% → ${lastRate}% (${firstRate - lastRate}%↓)`;
              })()}
            </span>
          </div>
        </GlassCard>
      )}
    </div>
  );
}
