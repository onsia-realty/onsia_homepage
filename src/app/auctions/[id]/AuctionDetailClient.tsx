'use client';

import { useState } from 'react';
import { Fragment } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
  MapPin, Calendar, Gavel, Building, TrendingDown, AlertTriangle,
  Phone, MessageCircle, ChevronLeft, Share2, Heart, ExternalLink,
  Clock, Users, Shield, FileText
} from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { GlassCard } from '@/components/ui/GlassCard';
import { RightsAnalysis } from '@/components/auction/RightsAnalysis';
import { TenantStatus } from '@/components/auction/TenantStatus';
import { BidHistory } from '@/components/auction/BidHistory';
import { ExternalLinks } from '@/components/auction/ExternalLinks';
import { AIBidAnalysis } from '@/components/auction/AIBidAnalysis';

interface AuctionItem {
  id: string;
  caseNumber: string;
  caseNumberFull: string | null;
  courtCode: string | null;
  courtName: string | null;
  pnu: string | null;
  address: string;
  addressDetail: string | null;
  city: string;
  district: string;
  itemType: string;
  landArea: number | null;
  buildingArea: number | null;
  floor: string | null;
  totalFloors: string | null;
  buildingStructure: string | null;
  buildingUsage: string | null;
  landUseZone: string | null;
  // 감정평가 정보
  appraisalOrg: string | null;
  appraisalDate: string | null;
  preservationDate: string | null;
  approvalDate: string | null;
  landAppraisalPrice: string | null;
  buildingAppraisalPrice: string | null;
  appraisalPrice: string;
  minimumPrice: string;
  minimumRate: number | null;
  deposit: string | null;
  saleDate: string | null;
  saleTime: string | null;
  bidCount: number;
  bidEndDate: string | null;
  referenceDate: string | null;
  hasRisk: boolean;
  riskNote: string | null;
  owner: string | null;
  debtor: string | null;
  creditor: string | null;
  status: string;
  featured: boolean;
  // 현황/위치 정보
  surroundings: string | null;
  transportation: string | null;
  nearbyFacilities: string | null;
  heatingType: string | null;
  facilities: string | null;
  locationNote: string | null;
  // 외부 데이터
  realPrice: string | null;
  buildingInfo: string | null;
  naverComplexId: string | null;
  // SEO
  seoTitle: string | null;
  seoDescription: string | null;
  // 메타
  viewCount: number;
  inquiryCount: number;
  createdAt: string;
  updatedAt: string;
  images: Array<{
    id: string;
    imageType: string;
    url: string;
    alt: string | null;
  }>;
  bids: Array<{
    id: string;
    round: number;
    bidDate: string | null;
    minimumPrice: string;
    result: string;
    winningPrice: string | null;
    bidderCount: number | null;
  }>;
  registers: Array<{
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
  }>;
  tenants: Array<{
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
  }>;
}

interface Props {
  item: AuctionItem;
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
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  });
}

function getDaysUntil(dateStr: string | null): number | null {
  if (!dateStr) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export function AuctionDetailClient({ item }: Props) {
  const [selectedImage, setSelectedImage] = useState(0);

  const statusInfo = statusLabels[item.status] || statusLabels.SCHEDULED;
  const daysUntil = getDaysUntil(item.saleDate);

  const photos = item.images.filter(img => img.imageType === 'PHOTO');
  const currentImage = photos[selectedImage]?.url || '/images/auction-placeholder.jpg';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Navigation />

      {/* 히어로 섹션 - 모바일 최적화 */}
      <section className="relative pt-16">
        {/* 뒤로가기 - 고정 위치 */}
        <div className="fixed top-20 left-4 z-30 md:absolute md:top-4">
          <Link href="/auctions">
            <GlassCard className="p-2 hover:bg-white/20 transition-colors backdrop-blur-md">
              <ChevronLeft className="w-6 h-6 text-white" />
            </GlassCard>
          </Link>
        </div>

        {/* 모바일: 카드형 레이아웃 / 데스크탑: 풀스크린 이미지 */}
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* 메인 카드 */}
            <GlassCard className="overflow-hidden">
              {/* 상단: 이미지 + 기본정보 */}
              <div className="flex flex-col lg:flex-row">
                {/* 이미지 섹션 */}
                <div className="relative w-full lg:w-1/2 h-[280px] md:h-[400px] lg:h-[480px]">
                  <Image
                    src={currentImage}
                    alt={item.address}
                    fill
                    className="object-cover"
                    unoptimized
                    priority
                  />

                  {/* 상태 배지 - 이미지 위 */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                    <span className={`px-3 py-1.5 rounded-full text-xs md:text-sm font-medium text-white shadow-lg ${statusInfo.color}`}>
                      {statusInfo.label}
                    </span>
                    <span className="px-3 py-1.5 rounded-full text-xs md:text-sm font-medium bg-gray-900/80 text-white shadow-lg">
                      {item.bidCount}회차
                    </span>
                    {item.hasRisk && (
                      <span className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs md:text-sm font-medium bg-red-500/90 text-white shadow-lg">
                        <AlertTriangle className="w-3 h-3 md:w-4 md:h-4" />
                        주의
                      </span>
                    )}
                  </div>

                  {/* D-Day 배지 */}
                  {daysUntil !== null && item.status === 'SCHEDULED' && (
                    <div className="absolute top-3 right-3">
                      <span className={`px-3 py-1.5 rounded-full text-sm font-bold shadow-lg ${
                        daysUntil <= 3 ? 'bg-red-500 text-white' :
                        daysUntil <= 7 ? 'bg-orange-500 text-white' :
                        'bg-blue-500 text-white'
                      }`}>
                        {daysUntil === 0 ? 'D-Day' : daysUntil > 0 ? `D-${daysUntil}` : `D+${Math.abs(daysUntil)}`}
                      </span>
                    </div>
                  )}

                  {/* 이미지 썸네일 - 하단 */}
                  {photos.length > 1 && (
                    <div className="absolute bottom-3 left-3 right-3 flex justify-center gap-2">
                      {photos.slice(0, 5).map((img, idx) => (
                        <button
                          key={img.id}
                          onClick={() => setSelectedImage(idx)}
                          className={`w-12 h-9 md:w-16 md:h-12 rounded-lg overflow-hidden border-2 transition-all shadow-lg ${
                            selectedImage === idx
                              ? 'border-blue-500 scale-105'
                              : 'border-white/40 opacity-80 hover:opacity-100'
                          }`}
                        >
                          <Image
                            src={img.url}
                            alt={img.alt || `이미지 ${idx + 1}`}
                            width={64}
                            height={48}
                            className="w-full h-full object-cover"
                            unoptimized
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* 정보 섹션 */}
                <div className="w-full lg:w-1/2 p-4 md:p-6 lg:p-8 flex flex-col">
                  {/* 사건번호 & 법원 */}
                  <div className="flex items-center gap-2 text-blue-400 mb-2">
                    <Gavel className="w-4 h-4 md:w-5 md:h-5" />
                    <span className="font-medium text-sm md:text-base">{item.caseNumber}</span>
                    <span className="text-gray-500">|</span>
                    <span className="text-gray-400 text-sm">{item.courtName}</span>
                  </div>

                  {/* 주소 */}
                  <h1 className="text-lg md:text-2xl lg:text-3xl font-bold text-white mb-3 leading-tight">
                    {item.address}
                  </h1>

                  {/* 물건 정보 태그 */}
                  <div className="flex flex-wrap items-center gap-2 text-gray-400 text-sm mb-4">
                    <span className="flex items-center gap-1 px-2 py-1 bg-white/5 rounded-md">
                      <Building className="w-3.5 h-3.5" />
                      {itemTypeLabels[item.itemType] || item.itemType}
                    </span>
                    {item.buildingArea && (
                      <span className="px-2 py-1 bg-white/5 rounded-md">
                        {item.buildingArea.toFixed(1)}m²
                      </span>
                    )}
                    {item.landArea && (
                      <span className="px-2 py-1 bg-white/5 rounded-md">
                        대지 {item.landArea.toFixed(1)}m²
                      </span>
                    )}
                    {item.floor && (
                      <span className="px-2 py-1 bg-white/5 rounded-md">{item.floor}</span>
                    )}
                  </div>

                  {/* 가격 정보 - 강조 박스 */}
                  <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-xl p-4 mb-4 border border-white/10">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs md:text-sm text-gray-400 mb-1">감정가</p>
                        <p className="text-base md:text-xl font-bold text-gray-300 line-through decoration-gray-500">
                          {formatPrice(item.appraisalPrice)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs md:text-sm text-gray-400 mb-1 flex items-center gap-1">
                          <TrendingDown className="w-3.5 h-3.5 text-green-400" />
                          최저가
                        </p>
                        <p className="text-xl md:text-2xl font-bold text-green-400">
                          {formatPrice(item.minimumPrice)}
                        </p>
                        {item.minimumRate && (
                          <span className="text-xs md:text-sm text-green-400/70">
                            감정가 대비 {item.minimumRate}%
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 매각기일 */}
                  <div className="bg-white/5 rounded-xl p-4 mb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-gray-400 text-sm flex items-center gap-2 mb-1">
                          <Calendar className="w-4 h-4" />
                          매각기일
                        </span>
                        <p className="text-lg md:text-xl font-bold text-white">
                          {formatDate(item.saleDate)}
                        </p>
                        {item.saleTime && (
                          <p className="text-gray-400 text-sm">{item.saleTime}</p>
                        )}
                      </div>
                      {item.deposit && (
                        <div className="text-right">
                          <span className="text-gray-400 text-sm">보증금</span>
                          <p className="text-base md:text-lg font-bold text-white">
                            {formatPrice(item.deposit)}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* CTA 버튼 - 하단 고정 스타일 */}
                  <div className="mt-auto space-y-3">
                    <div className="flex gap-2">
                      <a
                        href="tel:031-000-0000"
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl transition-colors text-sm md:text-base"
                      >
                        <Phone className="w-4 h-4 md:w-5 md:h-5" />
                        전화상담
                      </a>
                      <a
                        href="https://pf.kakao.com/_example"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center px-4 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-medium rounded-xl transition-colors"
                      >
                        <MessageCircle className="w-4 h-4 md:w-5 md:h-5" />
                      </a>
                    </div>

                    {/* 공유/저장 */}
                    <div className="flex gap-2">
                      <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors text-sm">
                        <Share2 className="w-4 h-4" />
                        공유
                      </button>
                      <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors text-sm">
                        <Heart className="w-4 h-4" />
                        저장
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </section>

      {/* 기본 정보 테이블 - 모바일: 그리드 / 데스크탑: 테이블 */}
      <section className="container mx-auto px-4 md:px-6 py-4 md:py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* 모바일용 그리드 레이아웃 */}
          <div className="md:hidden space-y-3">
            <GlassCard className="p-4">
              <h3 className="text-sm font-medium text-gray-400 mb-2">소재지</h3>
              <p className="text-white font-medium text-sm leading-relaxed">
                {item.address}
                {item.addressDetail && (
                  <span className="text-gray-400 block mt-1">{item.addressDetail}</span>
                )}
              </p>
            </GlassCard>

            <div className="grid grid-cols-2 gap-3">
              <GlassCard className="p-3">
                <span className="text-xs text-gray-400">물건종류</span>
                <p className="text-white font-medium text-sm">{itemTypeLabels[item.itemType] || item.itemType}</p>
              </GlassCard>
              <GlassCard className="p-3">
                <span className="text-xs text-gray-400">상태</span>
                <p className="mt-1">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium text-white ${statusInfo.color}`}>
                    {statusInfo.label} ({item.bidCount}회차)
                  </span>
                </p>
              </GlassCard>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <GlassCard className="p-3">
                <span className="text-xs text-gray-400">대지면적</span>
                <p className="text-white font-medium text-sm">
                  {item.landArea ? `${item.landArea.toFixed(1)}㎡` : '-'}
                </p>
              </GlassCard>
              <GlassCard className="p-3">
                <span className="text-xs text-gray-400">건물면적</span>
                <p className="text-white font-medium text-sm">
                  {item.buildingArea ? `${item.buildingArea.toFixed(1)}㎡` : '-'}
                </p>
              </GlassCard>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <GlassCard className="p-3">
                <span className="text-xs text-gray-400">소유자</span>
                <p className="text-white font-medium text-sm">{item.owner || '-'}</p>
              </GlassCard>
              <GlassCard className="p-3">
                <span className="text-xs text-gray-400">채무자</span>
                <p className="text-white font-medium text-sm">{item.debtor || '-'}</p>
              </GlassCard>
              <GlassCard className="p-3">
                <span className="text-xs text-gray-400">채권자</span>
                <p className="text-white font-medium text-sm">{item.creditor || '-'}</p>
              </GlassCard>
            </div>

            <GlassCard className="p-3">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-xs text-gray-400">말소기준일</span>
                  <p className="text-red-400 font-medium text-sm">
                    {item.referenceDate ? new Date(item.referenceDate).toLocaleDateString('ko-KR') : '-'}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-gray-400">배당요구종기</span>
                  <p className="text-white font-medium text-sm">
                    {item.bidEndDate ? new Date(item.bidEndDate).toLocaleDateString('ko-KR') : '-'}
                  </p>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* 데스크탑용 테이블 레이아웃 */}
          <GlassCard className="overflow-hidden hidden md:block">
            <table className="w-full text-sm">
              <tbody className="divide-y divide-white/10">
                {/* 소재지 */}
                <tr>
                  <th className="w-[12%] px-4 py-3 bg-white/5 text-gray-400 text-left font-medium">
                    소재지
                  </th>
                  <td colSpan={5} className="px-4 py-3 text-white font-bold">
                    {item.address}
                    {item.addressDetail && (
                      <span className="text-gray-400 font-normal ml-2">
                        {item.addressDetail}
                      </span>
                    )}
                  </td>
                </tr>

                {/* 물건종류 | 입찰회차 | 상태 */}
                <tr className="divide-x divide-white/10">
                  <th className="w-[12%] px-4 py-3 bg-white/5 text-gray-400 text-left font-medium">
                    물건종류
                  </th>
                  <td className="w-[21%] px-4 py-3 text-white">
                    {itemTypeLabels[item.itemType] || item.itemType}
                  </td>
                  <th className="w-[12%] px-4 py-3 bg-white/5 text-gray-400 text-left font-medium">
                    입찰회차
                  </th>
                  <td className="w-[21%] px-4 py-3 text-white">
                    {item.bidCount}회
                  </td>
                  <th className="w-[12%] px-4 py-3 bg-white/5 text-gray-400 text-left font-medium">
                    상태
                  </th>
                  <td className="w-[22%] px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium text-white ${statusInfo.color}`}>
                      {statusInfo.label}
                    </span>
                  </td>
                </tr>

                {/* 대지면적 | 소유자 | 감정가 */}
                <tr className="divide-x divide-white/10">
                  <th className="px-4 py-3 bg-white/5 text-gray-400 text-left font-medium">
                    대지면적
                  </th>
                  <td className="px-4 py-3 text-white">
                    {item.landArea ? (
                      <>
                        {item.landArea.toFixed(2)}㎡
                        <span className="text-gray-400 ml-1">
                          ({(item.landArea / 3.3058).toFixed(2)}평)
                        </span>
                      </>
                    ) : '-'}
                  </td>
                  <th className="px-4 py-3 bg-white/5 text-gray-400 text-left font-medium">
                    소유자
                  </th>
                  <td className="px-4 py-3 text-white">
                    {item.owner || '-'}
                  </td>
                  <th className="px-4 py-3 bg-white/5 text-gray-400 text-left font-medium">
                    감정가
                  </th>
                  <td className="px-4 py-3 text-right">
                    <span className="text-white font-bold">
                      {parseInt(item.appraisalPrice).toLocaleString()}원
                    </span>
                  </td>
                </tr>

                {/* 건물면적 | 채무자 | 최저가 */}
                <tr className="divide-x divide-white/10">
                  <th className="px-4 py-3 bg-white/5 text-gray-400 text-left font-medium">
                    건물면적
                  </th>
                  <td className="px-4 py-3 text-white">
                    {item.buildingArea ? (
                      <>
                        {item.buildingArea.toFixed(2)}㎡
                        <span className="text-gray-400 ml-1">
                          ({(item.buildingArea / 3.3058).toFixed(2)}평)
                        </span>
                      </>
                    ) : '-'}
                  </td>
                  <th className="px-4 py-3 bg-white/5 text-gray-400 text-left font-medium">
                    채무자
                  </th>
                  <td className="px-4 py-3 text-white">
                    {item.debtor || '-'}
                  </td>
                  <th className="px-4 py-3 bg-white/5 text-gray-400 text-left font-medium">
                    최저가
                  </th>
                  <td className="px-4 py-3 text-right">
                    <span className="text-green-400 font-bold">
                      ({item.minimumRate || '-'}%) {parseInt(item.minimumPrice).toLocaleString()}원
                    </span>
                  </td>
                </tr>

                {/* 매각물건 | 채권자 | 보증금 */}
                <tr className="divide-x divide-white/10">
                  <th className="px-4 py-3 bg-white/5 text-gray-400 text-left font-medium">
                    매각물건
                  </th>
                  <td className="px-4 py-3 text-white">
                    {item.landArea && item.buildingArea ? '토지·건물 일괄매각' :
                     item.landArea ? '토지' :
                     item.buildingArea ? '건물' : '-'}
                  </td>
                  <th className="px-4 py-3 bg-white/5 text-gray-400 text-left font-medium">
                    채권자
                  </th>
                  <td className="px-4 py-3 text-white">
                    {item.creditor || '-'}
                  </td>
                  <th className="px-4 py-3 bg-white/5 text-gray-400 text-left font-medium">
                    보증금
                  </th>
                  <td className="px-4 py-3 text-right">
                    {item.deposit ? (
                      <span className="text-white font-bold">
                        (10%) {parseInt(item.deposit).toLocaleString()}원
                      </span>
                    ) : '-'}
                  </td>
                </tr>

                {/* 말소기준일 | 배당요구종기 | 조회수 */}
                <tr className="divide-x divide-white/10">
                  <th className="px-4 py-3 bg-white/5 text-gray-400 text-left font-medium">
                    말소기준일
                  </th>
                  <td className="px-4 py-3">
                    {item.referenceDate ? (
                      <span className="text-red-400 font-medium">
                        {new Date(item.referenceDate).toLocaleDateString('ko-KR')}
                      </span>
                    ) : '-'}
                  </td>
                  <th className="px-4 py-3 bg-white/5 text-gray-400 text-left font-medium">
                    배당요구종기
                  </th>
                  <td className="px-4 py-3 text-white">
                    {item.bidEndDate ? new Date(item.bidEndDate).toLocaleDateString('ko-KR') : '-'}
                  </td>
                  <th className="px-4 py-3 bg-white/5 text-gray-400 text-left font-medium">
                    조회수
                  </th>
                  <td className="px-4 py-3 text-right text-white">
                    {item.viewCount.toLocaleString()}회
                  </td>
                </tr>
              </tbody>
            </table>
          </GlassCard>
        </motion.div>
      </section>

      {/* 상세 정보 섹션 - 모든 정보를 순차적으로 표시 */}
      <section className="container mx-auto px-4 md:px-6 py-4 md:py-8">
        <div className="flex flex-col lg:flex-row gap-4 md:gap-8">
          {/* 메인 콘텐츠 - 모든 섹션을 길게 나열 */}
          <div className="flex-1 space-y-6 md:space-y-8">

            {/* ===== 1. 물건현황 섹션 ===== */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Building className="w-6 h-6 text-blue-400" />
                <h2 className="text-xl md:text-2xl font-bold text-white">물건현황</h2>
              </div>

              {/* 건물 정보 */}
              <GlassCard className="p-4 md:p-6">
                <h3 className="text-base md:text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Building className="w-5 h-5 text-purple-400" />
                  건물 정보
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400">물건용도</p>
                    <p className="text-white font-medium">{itemTypeLabels[item.itemType] || item.itemType}</p>
                  </div>
                  {item.totalFloors && (
                    <div>
                      <p className="text-gray-400">총 층수</p>
                      <p className="text-white font-medium">{item.totalFloors}</p>
                    </div>
                  )}
                  {item.floor && (
                    <div>
                      <p className="text-gray-400">해당 층</p>
                      <p className="text-white font-medium">{item.floor}</p>
                    </div>
                  )}
                  {item.buildingStructure && (
                    <div>
                      <p className="text-gray-400">건물구조</p>
                      <p className="text-white font-medium">{item.buildingStructure}</p>
                    </div>
                  )}
                  {item.landUseZone && (
                    <div>
                      <p className="text-gray-400">토지이용계획</p>
                      <p className="text-white font-medium">{item.landUseZone}</p>
                    </div>
                  )}
                  {item.heatingType && (
                    <div>
                      <p className="text-gray-400">난방방식</p>
                      <p className="text-white font-medium">{item.heatingType}</p>
                    </div>
                  )}
                  {item.landArea && (
                    <div>
                      <p className="text-gray-400">대지면적</p>
                      <p className="text-white font-medium">{item.landArea.toFixed(2)}㎡ ({(item.landArea * 0.3025).toFixed(2)}평)</p>
                    </div>
                  )}
                  {item.buildingArea && (
                    <div>
                      <p className="text-gray-400">건물면적</p>
                      <p className="text-white font-medium">{item.buildingArea.toFixed(2)}㎡ ({(item.buildingArea * 0.3025).toFixed(2)}평)</p>
                    </div>
                  )}
                </div>
              </GlassCard>

              {/* 편의시설 */}
              {item.facilities && (
                <GlassCard className="p-4 md:p-6">
                  <h3 className="text-base md:text-lg font-bold text-white mb-4">편의시설</h3>
                  <div className="flex flex-wrap gap-2">
                    {JSON.parse(item.facilities).map((facility: string, index: number) => (
                      <span key={index} className="px-3 py-1.5 bg-blue-500/20 text-blue-300 rounded-full text-sm">
                        {facility}
                      </span>
                    ))}
                  </div>
                </GlassCard>
              )}

              {/* 주변환경 */}
              {item.surroundings && (
                <GlassCard className="p-4 md:p-6">
                  <h3 className="text-base md:text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-green-400" />
                    주변환경
                  </h3>
                  <p className="text-gray-300 leading-relaxed">{item.surroundings}</p>
                </GlassCard>
              )}

              {/* 교통정보 */}
              {item.transportation && (
                <GlassCard className="p-4 md:p-6">
                  <h3 className="text-base md:text-lg font-bold text-white mb-4">교통정보</h3>
                  <p className="text-gray-300 leading-relaxed">{item.transportation}</p>
                </GlassCard>
              )}

              {/* 근린시설 */}
              {item.nearbyFacilities && (
                <GlassCard className="p-4 md:p-6">
                  <h3 className="text-base md:text-lg font-bold text-white mb-4">근린시설</h3>
                  <p className="text-gray-300">{item.nearbyFacilities}</p>
                </GlassCard>
              )}

              {/* 위치 특이사항 */}
              {item.locationNote && (
                <GlassCard className="p-4 md:p-6 border border-yellow-500/30">
                  <h3 className="text-base md:text-lg font-bold text-yellow-400 mb-4">위치 특이사항</h3>
                  <p className="text-gray-300 leading-relaxed">{item.locationNote}</p>
                </GlassCard>
              )}
            </div>

            {/* ===== 2. 권리분석 섹션 ===== */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-6 h-6 text-red-400" />
                <h2 className="text-xl md:text-2xl font-bold text-white">권리분석</h2>
              </div>
              <RightsAnalysis
                referenceDate={item.referenceDate}
                hasRisk={item.hasRisk}
                riskNote={item.riskNote}
                registers={item.registers}
              />
            </div>

            {/* ===== 3. 임차인현황 섹션 ===== */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-6 h-6 text-orange-400" />
                <h2 className="text-xl md:text-2xl font-bold text-white">임차인현황</h2>
              </div>
              <TenantStatus
                tenants={item.tenants}
                referenceDate={item.referenceDate}
              />
            </div>

            {/* ===== 4. 입찰내역 섹션 ===== */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-6 h-6 text-green-400" />
                <h2 className="text-xl md:text-2xl font-bold text-white">입찰내역</h2>
              </div>
              <BidHistory
                bids={item.bids}
                appraisalPrice={item.appraisalPrice}
              />
            </div>
          </div>

          {/* 사이드바 - 모바일에서는 가로 스크롤 또는 간소화 */}
          <div className="lg:w-80 space-y-4 md:space-y-6">
            {/* AI 입찰 분석 & 법원 정보 */}
            <AIBidAnalysis
              appraisalPrice={parseInt(item.appraisalPrice)}
              minimumPrice={parseInt(item.minimumPrice)}
              minimumRate={item.minimumRate || undefined}
              bidCount={item.bidCount}
              address={item.address}
              itemType={item.itemType}
              landArea={item.landArea || undefined}
              buildingArea={item.buildingArea || undefined}
              courtName={item.courtName || ''}
              saleDate={item.saleDate || undefined}
              saleTime={item.saleTime || undefined}
              hasRisk={item.hasRisk}
              riskNote={item.riskNote || undefined}
              tenantCount={item.tenants.length}
            />

            {/* 당사자 정보 - 모바일에서 숨김 */}
            {(item.owner || item.debtor || item.creditor) && (
              <GlassCard className="p-4 md:p-6 hidden lg:block">
                <h3 className="text-base md:text-lg font-bold text-white mb-3 md:mb-4">당사자 정보</h3>
                <div className="space-y-2 md:space-y-3 text-sm">
                  {item.owner && (
                    <div>
                      <span className="text-gray-400 text-xs md:text-sm">소유자</span>
                      <p className="text-white">{item.owner}</p>
                    </div>
                  )}
                  {item.debtor && (
                    <div>
                      <span className="text-gray-400 text-xs md:text-sm">채무자</span>
                      <p className="text-white">{item.debtor}</p>
                    </div>
                  )}
                  {item.creditor && (
                    <div>
                      <span className="text-gray-400 text-xs md:text-sm">채권자</span>
                      <p className="text-white">{item.creditor}</p>
                    </div>
                  )}
                </div>
              </GlassCard>
            )}

            {/* 외부 링크 */}
            <ExternalLinks
              pnu={item.pnu}
              caseNumber={item.caseNumber}
              courtCode={item.courtCode}
              courtName={item.courtName}
              address={item.address}
            />

            {/* 상담 문의 - 모바일에서도 표시 */}
            <GlassCard className="p-4 md:p-6 bg-gradient-to-br from-blue-500/20 to-purple-500/20">
              <h3 className="text-base md:text-lg font-bold text-white mb-2">전문가 상담</h3>
              <p className="text-xs md:text-sm text-gray-300 mb-3 md:mb-4">
                권리분석, 입찰 전략, 명도 등 경매 전문가와 상담하세요.
              </p>
              <a
                href="tel:031-000-0000"
                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 md:py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl transition-colors text-sm md:text-base"
              >
                <Phone className="w-4 h-4 md:w-5 md:h-5" />
                무료 상담 신청
              </a>
            </GlassCard>
          </div>
        </div>
      </section>
    </div>
  );
}
