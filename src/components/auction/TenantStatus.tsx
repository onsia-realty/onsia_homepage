'use client';

import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, Users, Home } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';

interface Tenant {
  id: string;
  tenantName: string | null;
  hasPriority: boolean | null;
  occupiedPart: string | null;
  moveInDate: string | null;
  fixedDate: string | null;
  hasBidRequest: boolean | null;
  deposit: string | null;
  monthlyRent: string | null;
  analysis: string | null;
  note: string | null;
}

interface TenantStatusProps {
  tenants: Tenant[];
  referenceDate: string | null;
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

export function TenantStatus({ tenants, referenceDate }: TenantStatusProps) {
  if (tenants.length === 0) {
    return (
      <GlassCard className="p-6 text-center">
        <Users className="w-12 h-12 text-gray-500 mx-auto mb-3" />
        <p className="text-gray-400">등록된 임차인 정보가 없습니다.</p>
      </GlassCard>
    );
  }

  // 대항력 있는 임차인 수
  const priorityTenants = tenants.filter(t => t.hasPriority === true);

  return (
    <div className="space-y-4">
      {/* 요약 */}
      <div className="grid grid-cols-2 gap-4">
        <GlassCard className="p-4 text-center">
          <p className="text-sm text-gray-400 mb-1">전체 임차인</p>
          <p className="text-2xl font-bold text-white">{tenants.length}명</p>
        </GlassCard>
        <GlassCard className={`p-4 text-center ${priorityTenants.length > 0 ? 'bg-yellow-500/10 border-yellow-500/30' : ''}`}>
          <p className="text-sm text-gray-400 mb-1">대항력 있음</p>
          <p className={`text-2xl font-bold ${priorityTenants.length > 0 ? 'text-yellow-400' : 'text-white'}`}>
            {priorityTenants.length}명
          </p>
        </GlassCard>
      </div>

      {/* 임차인 목록 */}
      <div className="space-y-3">
        {tenants.map((tenant, index) => (
          <motion.div
            key={tenant.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <GlassCard className={`p-4 ${
              tenant.hasPriority
                ? 'bg-yellow-500/10 border-yellow-500/30'
                : 'bg-green-500/5 border-green-500/20'
            }`}>
              {/* 대항력 상태 */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  {tenant.hasPriority ? (
                    <AlertTriangle className="w-5 h-5 text-yellow-400" />
                  ) : (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  )}
                  <span className={`font-medium ${
                    tenant.hasPriority ? 'text-yellow-400' : 'text-green-400'
                  }`}>
                    대항력 {tenant.hasPriority ? '있음 (인수)' : '없음 (소멸)'}
                  </span>
                </div>
                {tenant.hasBidRequest !== null && (
                  <span className={`px-2 py-1 rounded text-xs ${
                    tenant.hasBidRequest
                      ? 'bg-blue-500/20 text-blue-300'
                      : 'bg-gray-500/20 text-gray-400'
                  }`}>
                    배당요구 {tenant.hasBidRequest ? 'O' : 'X'}
                  </span>
                )}
              </div>

              {/* 임차인 정보 */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                {tenant.tenantName && (
                  <div>
                    <span className="text-gray-400">임차인</span>
                    <p className="text-white">{tenant.tenantName}</p>
                  </div>
                )}
                {tenant.occupiedPart && (
                  <div>
                    <span className="text-gray-400">점유부분</span>
                    <p className="text-white">{tenant.occupiedPart}</p>
                  </div>
                )}
                <div>
                  <span className="text-gray-400">전입일</span>
                  <p className="text-white">{formatDate(tenant.moveInDate)}</p>
                </div>
                <div>
                  <span className="text-gray-400">확정일자</span>
                  <p className="text-white">{formatDate(tenant.fixedDate)}</p>
                </div>
                <div>
                  <span className="text-gray-400">보증금</span>
                  <p className="text-white font-medium">{formatPrice(tenant.deposit)}</p>
                </div>
                {tenant.monthlyRent && parseInt(tenant.monthlyRent) > 0 && (
                  <div>
                    <span className="text-gray-400">월차임</span>
                    <p className="text-white">{formatPrice(tenant.monthlyRent)}</p>
                  </div>
                )}
              </div>

              {/* 분석 결과 */}
              {tenant.analysis && (
                <div className="mt-3 pt-3 border-t border-white/10">
                  <p className="text-sm text-gray-300">{tenant.analysis}</p>
                </div>
              )}

              {/* 비고 */}
              {tenant.note && (
                <div className="mt-2">
                  <p className="text-sm text-gray-400 italic">{tenant.note}</p>
                </div>
              )}
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* 참고 안내 */}
      <GlassCard className="p-4 bg-blue-500/10 border-blue-500/20">
        <p className="text-sm text-blue-300">
          <strong>참고:</strong> 대항력이 있는 임차인의 보증금은 낙찰자가 인수해야 합니다.
          배당요구를 한 임차인은 배당절차를 통해 보증금을 반환받을 수 있습니다.
        </p>
      </GlassCard>
    </div>
  );
}
