'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Calendar, AlertTriangle, Gavel, Building, TrendingDown } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';

interface AuctionCardProps {
  item: {
    id: string;
    caseNumber: string;
    courtName: string | null;
    address: string;
    district: string;
    city: string;
    itemType: string;
    buildingArea: number | null;
    landArea: number | null;
    appraisalPrice: string;
    minimumPrice: string;
    minimumRate: number | null;
    saleDate: string | null;
    bidCount: number;
    status: string;
    hasRisk: boolean;
    referenceDate: string | null;
    images: Array<{ url: string; alt: string | null }>;
    _count?: {
      registers: number;
      tenants: number;
    };
  };
  index?: number;
}

const itemTypeLabels: Record<string, string> = {
  APARTMENT: '아파트',
  VILLA: '빌라',
  OFFICETEL: '오피스텔',
  HOUSE: '단독주택',
  COMMERCIAL: '상가',
  LAND: '토지',
  FACTORY: '공장',
  BUILDING: '건물',
  OTHER: '기타',
};

const statusLabels: Record<string, { label: string; color: string }> = {
  SCHEDULED: { label: '매각예정', color: 'bg-blue-500' },
  BIDDING: { label: '입찰중', color: 'bg-green-500' },
  SUCCESSFUL: { label: '낙찰', color: 'bg-purple-500' },
  FAILED: { label: '유찰', color: 'bg-orange-500' },
  WITHDRAWN: { label: '취하', color: 'bg-gray-500' },
  CANCELED: { label: '취소', color: 'bg-red-500' },
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
  return `${date.getMonth() + 1}/${date.getDate()}`;
}

function getDaysUntil(dateStr: string | null): number | null {
  if (!dateStr) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export function AuctionCard({ item, index = 0 }: AuctionCardProps) {
  const statusInfo = statusLabels[item.status] || statusLabels.SCHEDULED;
  const daysUntil = getDaysUntil(item.saleDate);
  const imageUrl = item.images[0]?.url || '/images/auction-placeholder.jpg';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link href={`/auctions/${item.id}`}>
        <GlassCard className="overflow-hidden group cursor-pointer h-full" hover>
          {/* 이미지 영역 */}
          <div className="relative h-48 overflow-hidden">
            <Image
              src={imageUrl}
              alt={item.address}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              unoptimized
            />
            {/* 오버레이 그라데이션 */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            {/* 상태 배지 */}
            <div className="absolute top-3 left-3 flex gap-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${statusInfo.color}`}>
                {statusInfo.label}
              </span>
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-800/80 text-white">
                {item.bidCount}회차
              </span>
            </div>

            {/* 위험 물건 표시 */}
            {item.hasRisk && (
              <div className="absolute top-3 right-3">
                <span className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-500/90 text-white">
                  <AlertTriangle className="w-3 h-3" />
                  주의
                </span>
              </div>
            )}

            {/* D-Day 표시 */}
            {daysUntil !== null && item.status === 'SCHEDULED' && (
              <div className="absolute bottom-3 right-3">
                <span className={`px-2 py-1 rounded-lg text-sm font-bold ${
                  daysUntil <= 3 ? 'bg-red-500 text-white' :
                  daysUntil <= 7 ? 'bg-orange-500 text-white' :
                  'bg-blue-500/80 text-white'
                }`}>
                  {daysUntil === 0 ? 'D-Day' : daysUntil > 0 ? `D-${daysUntil}` : `D+${Math.abs(daysUntil)}`}
                </span>
              </div>
            )}

            {/* 법원 정보 */}
            <div className="absolute bottom-3 left-3">
              <span className="px-2 py-1 rounded-lg text-xs bg-black/50 text-white backdrop-blur-sm">
                {item.courtName || '법원정보없음'}
              </span>
            </div>
          </div>

          {/* 정보 영역 */}
          <div className="p-4 space-y-3">
            {/* 사건번호 */}
            <div className="flex items-center gap-2 text-blue-400 text-sm font-medium">
              <Gavel className="w-4 h-4" />
              {item.caseNumber}
            </div>

            {/* 주소 */}
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <p className="text-white font-medium line-clamp-2 text-sm">{item.address}</p>
            </div>

            {/* 물건 정보 */}
            <div className="flex items-center gap-3 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <Building className="w-3 h-3" />
                {itemTypeLabels[item.itemType] || item.itemType}
              </span>
              {item.buildingArea && (
                <span>{item.buildingArea.toFixed(1)}m&sup2;</span>
              )}
              {item.landArea && !item.buildingArea && (
                <span>{item.landArea.toFixed(1)}m&sup2;</span>
              )}
            </div>

            {/* 가격 정보 */}
            <div className="pt-2 border-t border-white/10 space-y-1">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">감정가</span>
                <span className="text-gray-300">{formatPrice(item.appraisalPrice)}원</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm flex items-center gap-1">
                  <TrendingDown className="w-3 h-3 text-green-400" />
                  최저가
                </span>
                <div className="text-right">
                  <span className="text-lg font-bold text-green-400">
                    {formatPrice(item.minimumPrice)}원
                  </span>
                  {item.minimumRate && (
                    <span className="ml-2 text-xs text-green-400/80">
                      ({item.minimumRate}%)
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* 매각기일 */}
            <div className="flex items-center justify-between text-sm pt-2 border-t border-white/10">
              <span className="flex items-center gap-1 text-gray-400">
                <Calendar className="w-4 h-4" />
                매각기일
              </span>
              <span className="text-white font-medium">
                {item.saleDate ? new Date(item.saleDate).toLocaleDateString('ko-KR', {
                  month: 'short',
                  day: 'numeric',
                  weekday: 'short',
                }) : '-'}
              </span>
            </div>

            {/* 권리분석 요약 */}
            {(item._count?.tenants || 0) > 0 && (
              <div className="flex items-center gap-2 text-xs">
                <span className="px-2 py-1 rounded bg-yellow-500/20 text-yellow-400">
                  임차인 {item._count?.tenants}명
                </span>
              </div>
            )}
          </div>
        </GlassCard>
      </Link>
    </motion.div>
  );
}
