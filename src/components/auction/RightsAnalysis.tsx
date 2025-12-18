'use client';

import { motion } from 'framer-motion';
import { AlertTriangle, Shield, Clock } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';

interface Register {
  id: string;
  registerType: string | null;
  registerNo: string | null;
  receiptDate: string | null;
  purpose: string | null;
  rightHolder: string | null;
  claimAmount: string | null;
  isReference: boolean;
  willExpire: boolean;
  note: string | null;
}

interface RightsAnalysisProps {
  referenceDate: string | null;
  hasRisk: boolean;
  riskNote: string | null;
  registers: Register[];
}

function formatPrice(price: string | number | null): string {
  if (!price) return '-';
  const num = typeof price === 'string' ? parseInt(price) : price;
  if (num >= 100000000) {
    const uk = Math.floor(num / 100000000);
    const man = Math.floor((num % 100000000) / 10000);
    return man > 0 ? `${uk}억 ${man.toLocaleString()}만원` : `${uk}억원`;
  }
  if (num >= 10000) {
    return `${Math.floor(num / 10000).toLocaleString()}만원`;
  }
  return `${num.toLocaleString()}원`;
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

export function RightsAnalysis({ referenceDate, hasRisk, riskNote, registers }: RightsAnalysisProps) {
  // 등기 내역을 접수일 기준 정렬
  const sortedRegisters = [...registers].sort((a, b) => {
    if (!a.receiptDate) return 1;
    if (!b.receiptDate) return -1;
    return new Date(a.receiptDate).getTime() - new Date(b.receiptDate).getTime();
  });

  return (
    <div className="space-y-6">
      {/* 말소기준일 배너 */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <GlassCard className="p-4 border-l-4 border-red-500">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500/20 rounded-lg">
              <Clock className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">말소기준일</p>
              <p className="text-xl font-bold text-white">
                {formatDate(referenceDate)}
              </p>
            </div>
          </div>
          <p className="mt-3 text-sm text-gray-400">
            이 날짜 이후에 설정된 권리는 매각으로 소멸됩니다.
          </p>
        </GlassCard>
      </motion.div>

      {/* 위험 알림 */}
      {hasRisk && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <GlassCard className="p-4 bg-red-500/10 border border-red-500/30">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0" />
              <div>
                <p className="font-medium text-red-400">주의가 필요한 물건입니다</p>
                {riskNote && (
                  <p className="mt-1 text-sm text-gray-300">{riskNote}</p>
                )}
              </div>
            </div>
          </GlassCard>
        </motion.div>
      )}

      {/* 등기 내역 타임라인 */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-blue-400" />
          등기 내역
        </h3>

        {sortedRegisters.length === 0 ? (
          <GlassCard className="p-6 text-center">
            <p className="text-gray-400">등록된 등기 내역이 없습니다.</p>
          </GlassCard>
        ) : (
          <div className="relative">
            {/* 타임라인 선 */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-white/10" />

            <div className="space-y-3">
              {sortedRegisters.map((register, index) => (
                <motion.div
                  key={register.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="relative pl-10"
                >
                  {/* 타임라인 점 */}
                  <div className={`absolute left-2.5 top-4 w-3 h-3 rounded-full border-2 ${
                    register.isReference
                      ? 'bg-red-500 border-red-400'
                      : register.willExpire
                        ? 'bg-green-500 border-green-400'
                        : 'bg-yellow-500 border-yellow-400'
                  }`} />

                  <GlassCard className={`p-4 ${
                    register.isReference
                      ? 'bg-red-500/10 border-red-500/30'
                      : register.willExpire
                        ? 'bg-green-500/5 border-green-500/20'
                        : 'bg-yellow-500/10 border-yellow-500/30'
                  }`}>
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm text-gray-400">
                            {formatDate(register.receiptDate)}
                          </span>
                          {register.registerType && (
                            <span className="px-2 py-0.5 text-xs rounded bg-white/10 text-gray-300">
                              {register.registerType}구 {register.registerNo}
                            </span>
                          )}
                          {register.isReference && (
                            <span className="px-2 py-0.5 text-xs rounded bg-red-500/30 text-red-300 font-medium">
                              말소기준등기
                            </span>
                          )}
                        </div>
                        <p className="text-white font-medium mt-1">
                          {register.purpose || '-'}
                        </p>
                        <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-400">
                          {register.rightHolder && (
                            <span>권리자: {register.rightHolder}</span>
                          )}
                          {register.claimAmount && (
                            <span>채권액: {formatPrice(register.claimAmount)}</span>
                          )}
                        </div>
                        {register.note && (
                          <p className="mt-2 text-sm text-gray-400 italic">
                            {register.note}
                          </p>
                        )}
                      </div>

                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        register.willExpire
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {register.willExpire ? '소멸' : '인수'}
                      </span>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
