'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect, useMemo } from 'react';
import {
  Calendar, Building2, MapPin, Users, Phone, Globe,
  ArrowLeft, ExternalLink, Clock, CheckCircle, XCircle,
  Home, Briefcase, FileText, Award, TrendingUp,
  Share2, Heart, X, ZoomIn, Download, Image as ImageIcon,
  Layers,
} from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { GlassCard } from '@/components/ui/GlassCard';
import { ParticlesBackground } from '@/components/ParticlesBackground';
import KakaoMap from '@/components/map/KakaoMap';
import type { CheongyakProperty } from '@/lib/cheongyakApi';

interface SubscriptionWithStatus extends CheongyakProperty {
  status: string;
  statusText: string;
  dDay: number | null;
}

interface Props {
  subscription: SubscriptionWithStatus;
  coords: { lat: number; lng: number } | null;
}

/* ---------- API 응답 타입 (라우트와 1:1 일치) ---------- */

interface HousingType {
  type: string;
  modelNo: string;
  supplyArea: string;
  totalHouseholds: number;
  generalHouseholds: number;
  specialHouseholds: number;
  topPrice: number;
  pricePerPyeong: number;
}

interface CompetitionEntry {
  type: string;
  modelNo: string;
  supplyHouseholds: number;
  regions: {
    region: string;
    regionCode: string;
    requestCount: number;
    competitionRate: number | string;
    rank: number;
  }[];
}

interface SpecialSupplyEntry {
  type: string;
  totalSpecial: number;
  multichild: number;
  newlywed: number;
  firstLife: number;
  elderly: number;
  institution: number;
  newborn: number;
  youth: number;
  status: string;
}

interface DetailData {
  summary: {
    totalHouseholds: number;
    totalGeneral: number;
    totalSpecial: number;
    avgPrice: number;
    avgPricePerPyeong: number;
    typeCount: number;
  };
  housingTypes: HousingType[];
  competition: CompetitionEntry[];
  specialSupply: SpecialSupplyEntry[];
}

interface ImageItem {
  url: string;
  name: string;
}

interface CategoryImages {
  category: string;
  label: string;
  images: ImageItem[];
}

interface ImagesData {
  hasImages: boolean;
  categories: CategoryImages[];
  pdfUrl: string | null;
  totalImages: number;
}

interface CompareComplex {
  name: string;
  dong: string;
  avgPrice: number;
  avgPricePerPyeong: number;
  avgArea: number;
  recentDate: string;
  count: number;
  buildYear: string;
  priceDiff: number;
  priceDiffPercent: number;
}

interface CompareData {
  complexes: CompareComplex[];
  summary: {
    avgPricePerPyeong: number;
    marketDiffPercent?: number;
    marketDiffText?: string;
  };
}

/* ---------- 포맷 유틸 ---------- */

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return '-';
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
}

function formatMoveInDate(ymStr: string | null): string {
  if (!ymStr || ymStr.length !== 6) return '-';
  const year = ymStr.substring(0, 4);
  const month = ymStr.substring(4, 6);
  return `${year}년 ${parseInt(month, 10)}월`;
}

// 만원 단위 → "N억 N만"
function formatPrice(price: number): string {
  if (!price) return '-';
  if (price >= 10000) {
    const uk = Math.floor(price / 10000);
    const man = price % 10000;
    if (man === 0) return `${uk}억`;
    return `${uk}억 ${man.toLocaleString()}만`;
  }
  return `${price.toLocaleString()}만`;
}

function formatPricePerPyeong(pricePerPyeong: number): string {
  if (!pricePerPyeong) return '-';
  if (pricePerPyeong >= 10000) {
    return `${(pricePerPyeong / 10000).toFixed(1)}억`;
  }
  return `${pricePerPyeong.toLocaleString()}만`;
}

function sqmToPyeong(sqm: number): string {
  return (sqm / 3.3058).toFixed(0);
}

// 주택형 코드에서 전용면적 추출 (예: "084.8950A" → 84.90)
function extractArea(typeName: string): number {
  const match = typeName.match(/^(\d+)\.?(\d*)/);
  if (match) return parseFloat(`${match[1]}.${match[2] || '0'}`);
  return 0;
}

/* ---------- 상태 배지 토큰 매핑 ---------- */

const STATUS_STYLE: Record<string, { text: string; bg: string; border: string; Icon: typeof CheckCircle }> = {
  open: { text: 'text-sub-open', bg: 'bg-sub-open-soft', border: 'border-sub-open/40', Icon: CheckCircle },
  upcoming: { text: 'text-sub-upcoming', bg: 'bg-sub-upcoming-soft', border: 'border-sub-upcoming/40', Icon: Clock },
  closed: { text: 'text-sub-closed', bg: 'bg-sub-closed-soft', border: 'border-sub-closed/40', Icon: XCircle },
};

export default function SubscriptionDetailClient({ subscription, coords }: Props) {
  const id = subscription.HOUSE_MANAGE_NO;

  const [detail, setDetail] = useState<DetailData | null>(null);
  const [images, setImages] = useState<ImagesData | null>(null);
  const [compare, setCompare] = useState<CompareData | null>(null);
  const [imagesLoading, setImagesLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);

  const statusStyle = STATUS_STYLE[subscription.status] || STATUS_STYLE.closed;
  const StatusIcon = statusStyle.Icon;

  // 청약홈 신청 URL
  const applyUrl = useMemo(() => {
    if (subscription.PBLANC_URL && subscription.PBLANC_URL.startsWith('http')) {
      return subscription.PBLANC_URL;
    }
    return `https://www.applyhome.co.kr/ai/aia/selectAPTLttotPblancDetail.do?houseManageNo=${subscription.HOUSE_MANAGE_NO}&pblancNo=${subscription.PBLANC_NO}`;
  }, [subscription.PBLANC_URL, subscription.HOUSE_MANAGE_NO, subscription.PBLANC_NO]);

  // 이미지 로드
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setImagesLoading(true);
      try {
        const res = await fetch(`/api/subscriptions/${id}/images`);
        const json = await res.json();
        if (!cancelled && json.success) setImages(json.data);
      } catch (e) {
        console.error('이미지 로드 실패:', e);
      } finally {
        if (!cancelled) setImagesLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [id]);

  // 상세(주택형/경쟁률/특별공급) → 그 평당가로 시세비교 순차 로드
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const detailRes = await fetch(`/api/subscriptions/${id}/detail`);
        const detailJson = await detailRes.json();
        let ppp = 0;
        if (!cancelled && detailJson.success && detailJson.data) {
          setDetail(detailJson.data);
          ppp = detailJson.data.summary?.avgPricePerPyeong || 0;
        }

        const address = subscription.HSSPLY_ADRES || '';
        if (address) {
          const compareRes = await fetch(
            `/api/subscriptions/${id}/compare?address=${encodeURIComponent(address)}&pricePerPyeong=${ppp}`
          );
          const compareJson = await compareRes.json();
          if (!cancelled && compareJson.success && compareJson.data) {
            setCompare(compareJson.data);
          }
        }
      } catch (e) {
        console.error('상세 데이터 로드 실패:', e);
      }
    })();
    return () => { cancelled = true; };
  }, [id, subscription.HSSPLY_ADRES]);

  // 특별공급 집계 (타입별 합산)
  const specialTotals = useMemo(() => {
    if (!detail?.specialSupply?.length) return null;
    const acc = { multichild: 0, newlywed: 0, firstLife: 0, elderly: 0, institution: 0, newborn: 0, youth: 0, total: 0 };
    for (const s of detail.specialSupply) {
      acc.multichild += s.multichild || 0;
      acc.newlywed += s.newlywed || 0;
      acc.firstLife += s.firstLife || 0;
      acc.elderly += s.elderly || 0;
      acc.institution += s.institution || 0;
      acc.newborn += s.newborn || 0;
      acc.youth += s.youth || 0;
    }
    acc.total = acc.multichild + acc.newlywed + acc.firstLife + acc.elderly + acc.institution + acc.newborn + acc.youth;
    return acc.total > 0 ? acc : null;
  }, [detail]);

  const hasImages = !!images?.hasImages && images.categories.length > 0;
  const heroImage =
    images?.categories.find(c => c.category === 'gallery')?.images[0]?.url ||
    images?.categories.find(c => c.category === 'location')?.images[0]?.url ||
    images?.categories.find(c => c.category === 'modelhouse')?.images[0]?.url ||
    null;

  const handleShare = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    try {
      if (navigator.share) {
        await navigator.share({ title: subscription.HOUSE_NM, url });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
      }
    } catch {
      /* 사용자 취소 등 무시 */
    }
  };

  const specialCategories: { label: string; value: number }[] = specialTotals
    ? [
        { label: '다자녀가구', value: specialTotals.multichild },
        { label: '신혼부부', value: specialTotals.newlywed },
        { label: '생애최초', value: specialTotals.firstLife },
        { label: '노부모부양', value: specialTotals.elderly },
        { label: '기관추천', value: specialTotals.institution },
        { label: '신생아', value: specialTotals.newborn },
        { label: '청년', value: specialTotals.youth },
      ].filter(c => c.value > 0)
    : [];

  return (
    <>
      <Navigation />
      <main className="relative min-h-screen">
        <ParticlesBackground />

        {/* 이미지 확대 모달 */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
              onClick={() => setSelectedImage(null)}
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                aria-label="닫기"
              >
                <X className="w-6 h-6 text-white" />
              </button>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <motion.img
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                src={selectedImage}
                alt="확대 이미지"
                className="max-w-full max-h-full object-contain rounded-lg"
                onClick={(e) => e.stopPropagation()}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* 뒤로가기 */}
        <section className="relative pt-20 pb-4">
          <div className="container mx-auto px-6">
            <Link
              href="/subscriptions"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              청약 목록으로 돌아가기
            </Link>
          </div>
        </section>

        {/* 헤더 */}
        <section className="relative pb-8">
          <div className="container mx-auto px-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <GlassCard hover={false} className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                  <div>
                    {/* 배지 */}
                    <div className="flex items-center gap-3 mb-4 flex-wrap">
                      <span className={`px-4 py-2 rounded-full text-sm font-semibold border flex items-center gap-2 ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}>
                        <StatusIcon className="w-4 h-4" />
                        {subscription.statusText}
                      </span>
                      {subscription.dDay !== null && (
                        <span className={`text-lg font-bold ${statusStyle.text}`}>
                          {subscription.dDay > 0 ? `D-${subscription.dDay}` : subscription.dDay === 0 ? 'D-Day' : `D+${Math.abs(subscription.dDay)}`}
                        </span>
                      )}
                      {subscription.HOUSE_SECD_NM && (
                        <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-sm rounded-full">
                          {subscription.HOUSE_SECD_NM}
                        </span>
                      )}
                      {subscription.HOUSE_DTL_SECD_NM && (
                        <span className="px-3 py-1 bg-purple-500/20 text-purple-400 text-sm rounded-full">
                          {subscription.HOUSE_DTL_SECD_NM}
                        </span>
                      )}
                    </div>

                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
                      {subscription.HOUSE_NM}
                    </h1>

                    <div className="flex items-center gap-2 text-gray-300 mb-2">
                      <MapPin className="w-5 h-5 text-cyan-400" />
                      <span>{subscription.HSSPLY_ADRES}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Building2 className="w-4 h-4" />
                      <span>{subscription.SUBSCRPT_AREA_CODE_NM}</span>
                    </div>
                  </div>

                  {/* CTA + 액션 */}
                  <div className="flex flex-col gap-3">
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => setIsLiked(v => !v)}
                        className={`p-2.5 rounded-full border border-white/10 transition-colors ${isLiked ? 'text-red-400 bg-red-500/10' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}
                        aria-label="관심"
                      >
                        <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                      </button>
                      <button
                        onClick={handleShare}
                        className="p-2.5 rounded-full border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                        aria-label="공유"
                      >
                        <Share2 className="w-5 h-5" />
                      </button>
                    </div>
                    <a
                      href={applyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl hover:from-cyan-600 hover:to-blue-600 transition-all font-semibold flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/30"
                    >
                      <ExternalLink className="w-5 h-5" />
                      청약홈에서 신청하기
                    </a>
                    {subscription.HMPG_ADRES && (
                      <a
                        href={subscription.HMPG_ADRES}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-3 bg-white/10 border border-white/20 text-white rounded-xl hover:bg-white/20 transition-all font-semibold flex items-center justify-center gap-2"
                      >
                        <Globe className="w-5 h-5" />
                        분양 홈페이지
                      </a>
                    )}
                  </div>
                </div>

                {/* 핵심 정보 그리드 */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-white/10">
                  <div className="text-center p-4 bg-white/5 rounded-xl">
                    <Users className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
                    <p className="text-gray-400 text-sm mb-1">총 공급</p>
                    <p className="text-white text-xl font-bold">
                      {(detail?.summary?.totalHouseholds || subscription.TOT_SUPLY_HSHLDCO)?.toLocaleString() || '-'}세대
                    </p>
                  </div>
                  <div className="text-center p-4 bg-white/5 rounded-xl">
                    <Calendar className="w-6 h-6 text-green-400 mx-auto mb-2" />
                    <p className="text-gray-400 text-sm mb-1">청약 접수</p>
                    <p className="text-white text-lg font-bold">{formatDate(subscription.RCEPT_BGNDE)}</p>
                  </div>
                  <div className="text-center p-4 bg-white/5 rounded-xl">
                    <FileText className="w-6 h-6 text-orange-400 mx-auto mb-2" />
                    <p className="text-gray-400 text-sm mb-1">당첨 발표</p>
                    <p className="text-white text-lg font-bold">{formatDate(subscription.PRZWNER_PRESNATN_DE)}</p>
                  </div>
                  <div className="text-center p-4 bg-white/5 rounded-xl">
                    <Home className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                    <p className="text-gray-400 text-sm mb-1">입주 예정</p>
                    <p className="text-white text-lg font-bold">{formatMoveInDate(subscription.MVN_PREARNGE_YM)}</p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </section>

        {/* 이미지 갤러리 */}
        {(imagesLoading || hasImages) && (
          <section className="relative pb-8">
            <div className="container mx-auto px-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.05 }}>
                <GlassCard hover={false} className="p-6 md:p-8">
                  <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-cyan-400" />
                    단지 이미지
                    {images?.totalImages ? <span className="text-sm font-normal text-gray-400">({images.totalImages}장)</span> : null}
                  </h2>

                  {imagesLoading ? (
                    <div className="py-12 flex flex-col items-center justify-center text-gray-400">
                      <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mb-3" />
                      <p className="text-sm">이미지 로딩 중...</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* 대표 이미지 */}
                      {heroImage && (
                        <div
                          onClick={() => setSelectedImage(heroImage)}
                          className="relative aspect-video rounded-xl overflow-hidden cursor-pointer group"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={heroImage} alt="단지 대표 이미지" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                            <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </div>
                      )}

                      {/* 카테고리별 그리드 */}
                      {images?.categories.map((category) => (
                        <div key={category.category}>
                          <h3 className="text-sm font-bold text-gray-200 mb-3 flex items-center gap-2">
                            {category.label}
                            <span className="text-xs font-normal text-gray-400">({category.images.length})</span>
                          </h3>
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                            {category.images.map((image, index) => (
                              <div
                                key={index}
                                onClick={() => setSelectedImage(image.url)}
                                className="relative aspect-[4/3] rounded-lg overflow-hidden cursor-pointer group border border-white/5"
                              >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={image.url} alt={`${category.label} ${index + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                                  <ZoomIn className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}

                      {/* 모집공고문 PDF */}
                      {images?.pdfUrl && (
                        <a
                          href={images.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-colors border border-white/10"
                        >
                          <div className="flex items-center gap-3">
                            <FileText className="w-6 h-6 text-red-400" />
                            <div>
                              <p className="font-medium text-white">모집공고문</p>
                              <p className="text-xs text-gray-400">PDF 문서</p>
                            </div>
                          </div>
                          <Download className="w-5 h-5 text-gray-400" />
                        </a>
                      )}
                    </div>
                  )}
                </GlassCard>
              </motion.div>
            </div>
          </section>
        )}

        {/* 지도 */}
        {coords && (
          <section className="relative pb-8">
            <div className="container mx-auto px-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
                <GlassCard hover={false} className="p-6 md:p-8">
                  <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-cyan-400" />
                    위치
                  </h2>
                  <div className="rounded-xl overflow-hidden h-[360px] md:h-[420px]">
                    <KakaoMap
                      center={coords}
                      level={4}
                      markers={[
                        {
                          id,
                          lat: coords.lat,
                          lng: coords.lng,
                          type: 'apartment',
                          title: subscription.HOUSE_NM,
                          info: subscription.TOT_SUPLY_HSHLDCO ? `${subscription.TOT_SUPLY_HSHLDCO.toLocaleString()}세대` : undefined,
                        },
                      ]}
                      className="w-full h-full"
                    />
                  </div>
                  <p className="mt-3 text-sm text-gray-400 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {subscription.HSSPLY_ADRES}
                  </p>
                </GlassCard>
              </motion.div>
            </div>
          </section>
        )}

        {/* 주택형별 분양가 */}
        {detail?.housingTypes && detail.housingTypes.length > 0 && (
          <section className="relative pb-8">
            <div className="container mx-auto px-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <GlassCard hover={false} className="p-6 md:p-8">
                  <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Home className="w-5 h-5 text-cyan-400" />
                    주택형별 분양가
                  </h2>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm min-w-[560px]">
                      <thead>
                        <tr className="text-gray-400 border-b border-white/10">
                          <th className="py-3 px-3 text-left font-medium">타입</th>
                          <th className="py-3 px-3 text-right font-medium">전용면적</th>
                          <th className="py-3 px-3 text-right font-medium">공급면적</th>
                          <th className="py-3 px-3 text-right font-medium">세대</th>
                          <th className="py-3 px-3 text-right font-medium">분양최고가</th>
                          <th className="py-3 px-3 text-right font-medium">평당가</th>
                        </tr>
                      </thead>
                      <tbody>
                        {detail.housingTypes.map((t, i) => {
                          const area = extractArea(t.type);
                          return (
                            <tr key={`${t.type}-${i}`} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                              <td className="py-3 px-3 font-semibold text-cyan-400">{t.type}</td>
                              <td className="py-3 px-3 text-right text-gray-200">
                                {area > 0 ? `${area.toFixed(1)}㎡ (${sqmToPyeong(area)}평)` : '-'}
                              </td>
                              <td className="py-3 px-3 text-right text-gray-300">
                                {t.supplyArea ? `${parseFloat(t.supplyArea).toFixed(1)}㎡` : '-'}
                              </td>
                              <td className="py-3 px-3 text-right text-gray-300">
                                {t.totalHouseholds.toLocaleString()}
                                <span className="text-xs text-gray-500 ml-1">(일반 {t.generalHouseholds}/특별 {t.specialHouseholds})</span>
                              </td>
                              <td className="py-3 px-3 text-right font-bold text-white">{formatPrice(t.topPrice)}</td>
                              <td className="py-3 px-3 text-right text-gray-200">{formatPricePerPyeong(t.pricePerPyeong)}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  {detail.summary?.avgPricePerPyeong > 0 && (
                    <div className="mt-4 flex justify-end">
                      <span className="text-sm text-gray-400">
                        평균 평당가 <span className="text-white font-bold ml-1">{formatPricePerPyeong(detail.summary.avgPricePerPyeong)}</span>
                      </span>
                    </div>
                  )}
                </GlassCard>
              </motion.div>
            </div>
          </section>
        )}

        {/* 청약 경쟁률 */}
        {detail?.competition && detail.competition.length > 0 && (
          <section className="relative pb-8">
            <div className="container mx-auto px-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <GlassCard hover={false} className="p-6 md:p-8">
                  <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-brand-accent" />
                    청약 경쟁률
                  </h2>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm min-w-[420px]">
                      <thead>
                        <tr className="text-gray-400 border-b border-white/10">
                          <th className="py-3 px-3 text-left font-medium">타입</th>
                          <th className="py-3 px-3 text-center font-medium">해당지역</th>
                          <th className="py-3 px-3 text-center font-medium">기타지역</th>
                        </tr>
                      </thead>
                      <tbody>
                        {detail.competition.map((comp, idx) => {
                          const local = comp.regions.find(r => r.region === '해당지역');
                          const other = comp.regions.find(r => r.region === '기타지역');
                          const cell = (rate: number | string | undefined) => {
                            if (rate === undefined || rate === null || rate === 0) return <span className="text-gray-500">-</span>;
                            const isShort = typeof rate === 'string' && rate.includes('미달');
                            return <span className={isShort ? 'text-red-400' : 'text-cyan-400 font-bold'}>{typeof rate === 'number' ? `${rate}:1` : rate}</span>;
                          };
                          return (
                            <tr key={idx} className="border-b border-white/5">
                              <td className="py-3 px-3 font-semibold text-white">{comp.type}</td>
                              <td className="py-3 px-3 text-center">{cell(local?.competitionRate)}</td>
                              <td className="py-3 px-3 text-center">{cell(other?.competitionRate)}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </GlassCard>
              </motion.div>
            </div>
          </section>
        )}

        {/* 특별공급 */}
        {specialCategories.length > 0 && specialTotals && (
          <section className="relative pb-8">
            <div className="container mx-auto px-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <GlassCard hover={false} className="p-6 md:p-8">
                  <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Award className="w-5 h-5 text-evt-special" />
                    특별공급 <span className="text-sm font-normal text-gray-400">(총 {specialTotals.total.toLocaleString()}세대)</span>
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {specialCategories.map((c) => (
                      <div key={c.label} className="flex flex-col items-center py-4 bg-white/5 rounded-xl border border-white/5">
                        <span className="text-xs text-gray-400 mb-1">{c.label}</span>
                        <span className="text-lg font-bold text-white">{c.value.toLocaleString()}</span>
                        <span className="text-xs text-gray-500">세대</span>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </motion.div>
            </div>
          </section>
        )}

        {/* 청약 일정 */}
        <section className="relative pb-8">
          <div className="container mx-auto px-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <GlassCard hover={false} className="p-6 md:p-8">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-cyan-400" />
                  청약 일정
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-gray-300 border-b border-white/10 pb-2">접수 일정</h3>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-400">모집공고일</span>
                      <span className="text-white font-medium">{formatDate(subscription.RCRIT_PBLANC_DE)}</span>
                    </div>
                    {subscription.SPSPLY_RCEPT_BGNDE && (
                      <div className="flex justify-between items-center py-2 bg-evt-special/10 px-3 rounded-lg">
                        <span className="text-evt-special">특별공급</span>
                        <span className="text-white font-medium">
                          {formatDate(subscription.SPSPLY_RCEPT_BGNDE)} ~ {formatDate(subscription.SPSPLY_RCEPT_ENDDE)}
                        </span>
                      </div>
                    )}
                    {subscription.GNRL_RNK1_CRSPAREA_RCPTDE && (
                      <div className="flex justify-between items-center py-2 bg-evt-rank1/10 px-3 rounded-lg">
                        <span className="text-evt-rank1">1순위 (해당지역)</span>
                        <span className="text-white font-medium">{formatDate(subscription.GNRL_RNK1_CRSPAREA_RCPTDE)}</span>
                      </div>
                    )}
                    {subscription.GNRL_RNK2_CRSPAREA_RCPTDE && (
                      <div className="flex justify-between items-center py-2 bg-evt-rank2/10 px-3 rounded-lg">
                        <span className="text-evt-rank2">2순위</span>
                        <span className="text-white font-medium">{formatDate(subscription.GNRL_RNK2_CRSPAREA_RCPTDE)}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-400">청약접수 기간</span>
                      <span className="text-white font-medium">
                        {formatDate(subscription.RCEPT_BGNDE)} ~ {formatDate(subscription.RCEPT_ENDDE)}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-gray-300 border-b border-white/10 pb-2">발표 및 계약</h3>
                    <div className="flex justify-between items-center py-2 bg-evt-result/10 px-3 rounded-lg">
                      <span className="text-evt-result">당첨자 발표일</span>
                      <span className="text-white font-medium">{formatDate(subscription.PRZWNER_PRESNATN_DE)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-400">계약 기간</span>
                      <span className="text-white font-medium">
                        {formatDate(subscription.CNTRCT_CNCLS_BGNDE)} ~ {formatDate(subscription.CNTRCT_CNCLS_ENDDE)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-400">입주 예정</span>
                      <span className="text-white font-medium">{formatMoveInDate(subscription.MVN_PREARNGE_YM)}</span>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </section>

        {/* 주변 시세 비교 */}
        {compare?.complexes && compare.complexes.length > 0 && (
          <section className="relative pb-8">
            <div className="container mx-auto px-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <GlassCard hover={false} className="p-6 md:p-8">
                  <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-cyan-400" />
                    주변 시세 비교 <span className="text-sm font-normal text-gray-400">(실거래가 기준)</span>
                  </h2>

                  {/* 분양가 vs 주변 시세 요약 */}
                  <div className="bg-white/5 rounded-xl p-4 mb-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400 mb-1">분양 평당가</p>
                      <p className="text-2xl font-bold text-cyan-400">
                        {formatPricePerPyeong(detail?.summary?.avgPricePerPyeong || 0)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-400 mb-1">주변 평균 시세</p>
                      <p className="text-2xl font-bold text-white">{formatPricePerPyeong(compare.summary.avgPricePerPyeong)}</p>
                    </div>
                  </div>
                  {compare.summary.marketDiffText && (
                    <div className={`mb-4 px-4 py-3 rounded-lg text-sm font-medium ${
                      (compare.summary.marketDiffPercent || 0) > 0 ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'
                    }`}>
                      {compare.summary.marketDiffText}
                    </div>
                  )}

                  <div className="space-y-2">
                    {compare.complexes.slice(0, 8).map((c, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-white">{c.name}</p>
                          <p className="text-xs text-gray-400">{c.dong} · {c.buildYear}년 · {c.count}건</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-white">{formatPricePerPyeong(c.avgPricePerPyeong)}</p>
                          {c.priceDiffPercent !== 0 && (
                            <p className={`text-xs ${c.priceDiffPercent > 0 ? 'text-green-400' : 'text-red-400'}`}>
                              분양가 대비 {c.priceDiffPercent > 0 ? '+' : ''}{c.priceDiffPercent}%
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </motion.div>
            </div>
          </section>
        )}

        {/* 사업자 정보 + CTA */}
        <section className="relative pb-20">
          <div className="container mx-auto px-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <GlassCard hover={false} className="p-6 md:p-8">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-cyan-400" />
                  사업자 정보
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-white/10">
                      <span className="text-gray-400">사업주체</span>
                      <span className="text-white font-medium">{subscription.BSNS_MBY_NM || '-'}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-white/10">
                      <span className="text-gray-400">시공사</span>
                      <span className="text-blue-400 font-medium">{subscription.CNSTRCT_ENTRPS_NM || '-'}</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {subscription.MDHS_TELNO && (
                      <div className="flex justify-between items-center py-2 border-b border-white/10">
                        <span className="text-gray-400 flex items-center gap-2">
                          <Phone className="w-4 h-4" /> 문의전화
                        </span>
                        <a href={`tel:${subscription.MDHS_TELNO}`} className="text-cyan-400 font-medium hover:underline">
                          {subscription.MDHS_TELNO}
                        </a>
                      </div>
                    )}
                    {subscription.HMPG_ADRES && (
                      <div className="flex justify-between items-center py-2 border-b border-white/10">
                        <span className="text-gray-400 flex items-center gap-2">
                          <Globe className="w-4 h-4" /> 홈페이지
                        </span>
                        <a
                          href={subscription.HMPG_ADRES}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-cyan-400 font-medium hover:underline truncate max-w-[200px]"
                        >
                          {subscription.HMPG_ADRES.replace(/^https?:\/\//, '')}
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href={applyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl hover:from-cyan-600 hover:to-blue-600 transition-all font-semibold flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/30 text-lg"
                  >
                    <ExternalLink className="w-5 h-5" />
                    청약홈에서 상세보기
                  </a>
                  <Link
                    href="/subscriptions"
                    className="px-8 py-4 bg-white/10 border border-white/20 text-white rounded-xl hover:bg-white/20 transition-all font-semibold flex items-center justify-center gap-2 text-lg"
                  >
                    <Layers className="w-5 h-5" />
                    목록으로 돌아가기
                  </Link>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </section>
      </main>
    </>
  );
}
