'use client';

import { useState, useEffect } from 'react';
import React from 'react';
import { motion } from 'framer-motion';
import {
  MapPin, Building2, Calendar, Users, Car, TrendingUp,
  Phone, Share2, Heart, ChevronLeft,
  ArrowRight, Check, Home, Award, Star, Wifi,
  Trees, Dumbbell, Store, GraduationCap, Play, FileText,
  Navigation2, Square
} from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { ParticlesBackground } from '@/components/ParticlesBackground';
import { InquiryForm } from '@/components/InquiryForm';
import Link from 'next/link';
import Image from 'next/image';

// API에서 받아올 데이터 타입
interface Developer {
  id: string;
  name: string;
  description: string | null;
  logoUrl: string | null;
  website: string | null;
}

interface Property {
  id: string;
  title: string;
  slug: string;
  description: string;
  address: string;
  district: string;
  city: string;
  zipCode: string | null;
  totalUnits: number;
  availableUnits: number;
  buildingType: string;
  completionDate: Date;
  moveInDate: Date;
  basePrice: string;
  pricePerPyeong: string;
  contractDeposit: string | null;
  interimPayments: string | null;
  rightsFee: string | null;
  profitRate: number | null;
  investmentGrade: string | null;
  constructor: string | null;
  keyFeature: string | null;
  keyFeatures: string | null;
  loanRatio: string | null;
  totalBuildingCount: number | null;
  parkingSpaces: number | null;
  facilities: string | null;
  status: string;
  featured: boolean;
  // 신규 필드
  pdfUrl: string | null;
  youtubeVideoId: string | null;
  locationDesc: string | null;
  pyeongTypes: string | null;
  subdomain: string | null;
  isPremium: boolean;
  developer: Developer;
  images: Array<{
    id: string;
    url: string;
    alt: string | null;
    order: number;
  }>;
}

export default function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await fetch(`/api/properties/${id}`);
        if (response.ok) {
          const data = await response.json();
          setProperty(data);
        }
      } catch (error) {
        console.error('Failed to fetch property:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  // BigInt 값 추출 (superjson 형식 처리)
  const extractValue = (val: unknown): string => {
    if (val === null || val === undefined) return '0';
    if (typeof val === 'string') return val;
    if (typeof val === 'number') return val.toString();
    if (typeof val === 'object' && val !== null && '$type' in val && 'value' in val) {
      return (val as { value: string }).value;
    }
    return '0';
  };

  const formatPrice = (price: unknown) => {
    const priceStr = extractValue(price);
    const numPrice = parseInt(priceStr);
    if (isNaN(numPrice) || numPrice === 0) return '가격문의';
    const eok = Math.floor(numPrice / 100000000);
    const man = Math.floor((numPrice % 100000000) / 10000);

    if (eok === 0 && man === 0) return '가격문의';
    if (man === 0) return `${eok}억`;
    return `${eok}억 ${man}만`;
  };

  const formatDate = (date: unknown) => {
    if (!date) return '-';
    // superjson DateTime 형식 처리
    let dateStr: string;
    if (typeof date === 'object' && date !== null && '$type' in date && 'value' in date) {
      dateStr = (date as { value: string }).value;
    } else if (typeof date === 'string') {
      dateStr = date;
    } else {
      return '-';
    }
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '-';
    return `${d.getFullYear()}년 ${d.getMonth() + 1}월`;
  };

  const parseFacilities = (facilitiesJson: string | null): string[] => {
    if (!facilitiesJson) return [];
    try {
      return JSON.parse(facilitiesJson);
    } catch {
      return [];
    }
  };

  const parseInterimPayments = (paymentsJson: string | null) => {
    if (!paymentsJson) return [];
    try {
      const parsed = JSON.parse(paymentsJson);
      return parsed.payments || [];
    } catch {
      return [];
    }
  };

  const parsePyeongTypes = (pyeongTypesJson: string | null): string[] => {
    if (!pyeongTypesJson) return [];
    try {
      return JSON.parse(pyeongTypesJson);
    } catch {
      return [];
    }
  };

  const parseKeyFeatures = (keyFeaturesJson: string | null): string[] => {
    if (!keyFeaturesJson) return [];
    try {
      return JSON.parse(keyFeaturesJson);
    } catch {
      return [];
    }
  };

  // 이미지 선택 함수 - DB 이미지 우선, 없으면 기본 이미지
  const getPropertyImages = () => {
    // DB에 등록된 이미지가 있으면 사용
    if (property?.images && property.images.length > 0) {
      return property.images
        .sort((a, b) => a.order - b.order)
        .map(img => img.url);
    }
    // 기본 이미지 (DB에 이미지 없을 때)
    const defaultImages = [
      '/property-1-gwanggyo-cloud-new.png',
      '/property-2-yongin-honors-new.png',
      '/property-3-bubal-station.png'
    ];
    const imageIndex = property?.id === 'cmgafd7w7000iupjg8xmpjku3' ? 0 :
                       property?.id === 'cmgafd7xa000kupjgcp9y7kkr' ? 1 : 2;
    return [defaultImages[imageIndex % defaultImages.length]];
  };

  const getFacilityIcon = (facility: string) => {
    if (facility.includes('피트니스') || facility.includes('헬스')) return <Dumbbell className="w-5 h-5" />;
    if (facility.includes('주차')) return <Car className="w-5 h-5" />;
    if (facility.includes('인터넷')) return <Wifi className="w-5 h-5" />;
    if (facility.includes('공원') || facility.includes('산책')) return <Trees className="w-5 h-5" />;
    if (facility.includes('도서관')) return <GraduationCap className="w-5 h-5" />;
    if (facility.includes('상가') || facility.includes('커뮤니티')) return <Store className="w-5 h-5" />;
    return <Check className="w-5 h-5" />;
  };

  if (loading) {
    return (
      <>
        <Navigation />
        <main className="relative min-h-screen">
          <ParticlesBackground />
          <div className="container mx-auto px-6 pt-32 pb-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
              <p className="text-gray-400">매물 정보를 불러오는 중...</p>
            </div>
          </div>
        </main>
      </>
    );
  }

  if (!property) {
    return (
      <>
        <Navigation />
        <main className="relative min-h-screen">
          <ParticlesBackground />
          <div className="container mx-auto px-6 pt-32 pb-20">
            <div className="text-center">
              <Building2 className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400 text-lg mb-8">매물을 찾을 수 없습니다.</p>
              <Link href="/properties">
                <button className="px-6 py-3 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-colors">
                  매물 목록으로 돌아가기
                </button>
              </Link>
            </div>
          </div>
        </main>
      </>
    );
  }

  const facilities = parseFacilities(property.facilities);
  const interimPayments = parseInterimPayments(property.interimPayments);
  const propertyImages = getPropertyImages();
  const pyeongTypes = parsePyeongTypes(property.pyeongTypes);
  const keyFeatures = parseKeyFeatures(property.keyFeatures);

  // 특장점별 스타일 배열
  const featureStyles = [
    { bg: 'from-blue-500/10 to-blue-500/5', border: 'border-blue-500/20 hover:border-blue-400/40', icon: 'from-blue-500 to-blue-600', iconShadow: 'shadow-blue-500/30', arrow: 'text-blue-400', emoji: '🏢' },
    { bg: 'from-green-500/10 to-green-500/5', border: 'border-green-500/20 hover:border-green-400/40', icon: 'from-green-500 to-green-600', iconShadow: 'shadow-green-500/30', arrow: 'text-green-400', emoji: '💰' },
    { bg: 'from-purple-500/10 to-purple-500/5', border: 'border-purple-500/20 hover:border-purple-400/40', icon: 'from-purple-500 to-purple-600', iconShadow: 'shadow-purple-500/30', arrow: 'text-purple-400', emoji: '🎁' },
    { bg: 'from-cyan-500/10 to-cyan-500/5', border: 'border-cyan-500/20 hover:border-cyan-400/40', icon: 'from-cyan-500 to-cyan-600', iconShadow: 'shadow-cyan-500/30', arrow: 'text-cyan-400', emoji: '🏋️' },
  ];

  return (
    <>
      <Navigation />
      <main className="relative min-h-screen">
        <ParticlesBackground />

        {/* 뒤로가기 버튼 */}
        <div className="container mx-auto px-6 pt-24 pb-4">
          <Link href="/properties">
            <button className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
              <ChevronLeft className="w-5 h-5" />
              <span>목록으로</span>
            </button>
          </Link>
        </div>

        {/* 헤더 섹션 - 이미지와 주요 정보 */}
        <section className="relative pb-12">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* 히어로 이미지 갤러리 - 임팩트 극대화 */}
              <div className="mb-8">
                <div className="relative h-[500px] md:h-[600px] rounded-3xl overflow-hidden group">
                  {/* 외곽 글로우 효과 */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-3xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-500" />

                  <div className="relative h-full rounded-3xl overflow-hidden">
                    <Image
                      src={propertyImages[selectedImage]}
                      alt={property.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      priority
                    />
                    {/* 다층 그라데이션 오버레이 */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-90" />
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-900/40 via-transparent to-purple-900/30" />
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent" />

                    {/* 프리미엄 뱃지 (좌측 상단) - 애니메이션 추가 */}
                    {property.isPremium && (
                      <motion.div
                        className="absolute top-6 left-6 z-10"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <div className="relative">
                          <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full blur opacity-75 animate-pulse" />
                          <div className="relative px-6 py-2.5 bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-500 text-black text-sm font-black rounded-full shadow-2xl shadow-yellow-500/50 flex items-center gap-2 backdrop-blur-sm">
                            <Star className="w-4 h-4 fill-current animate-spin" style={{ animationDuration: '3s' }} />
                            PREMIUM
                            <Star className="w-4 h-4 fill-current animate-spin" style={{ animationDuration: '3s', animationDirection: 'reverse' }} />
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* 투자등급 뱃지 (우측 상단) */}
                    {property.investmentGrade && (
                      <motion.div
                        className="absolute top-6 right-6 z-10"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        <div className="relative group/grade">
                          <div className="absolute -inset-1 bg-gradient-to-r from-purple-400 to-pink-500 rounded-2xl blur opacity-50 group-hover/grade:opacity-75 transition-opacity" />
                          <div className="relative backdrop-blur-xl bg-black/40 border border-purple-400/50 rounded-2xl px-6 py-4 text-center">
                            <div className="text-3xl font-black bg-gradient-to-r from-purple-300 to-pink-400 bg-clip-text text-transparent">{property.investmentGrade}</div>
                            <div className="text-xs text-purple-300/80 font-medium tracking-wider">투자등급</div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* 오버레이 정보 - 하단 */}
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 p-8 text-white"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5, duration: 0.6 }}
                    >
                      {/* 배지들 - 순차 애니메이션 */}
                      <div className="flex flex-wrap gap-3 mb-5">
                        {property.featured && (
                          <motion.span
                            initial={{ scale: 0, rotate: -10 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: "spring", delay: 0.6 }}
                            className="relative group/badge"
                          >
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-400 to-red-500 rounded-full blur opacity-60 group-hover/badge:opacity-100 transition-opacity" />
                            <div className="relative px-5 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-bold rounded-full shadow-xl">
                              🔥 추천매물
                            </div>
                          </motion.span>
                        )}
                        {property.investmentGrade && (
                          <motion.span
                            initial={{ scale: 0, rotate: 10 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: "spring", delay: 0.7 }}
                            className="relative group/badge"
                          >
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full blur opacity-60 group-hover/badge:opacity-100 transition-opacity" />
                            <div className="relative px-5 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-bold rounded-full shadow-xl">
                              🏆 투자등급 {property.investmentGrade}
                            </div>
                          </motion.span>
                        )}
                        {property.keyFeature && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", delay: 0.8 }}
                            className="relative group/badge"
                          >
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full blur opacity-60 group-hover/badge:opacity-100 transition-opacity animate-pulse" />
                            <div className="relative px-5 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-bold rounded-full shadow-xl">
                              ✨ {property.keyFeature}
                            </div>
                          </motion.span>
                        )}
                      </div>

                      {/* 제목 - 그라데이션 텍스트 */}
                      <h1 className="text-4xl md:text-6xl font-black mb-4">
                        <span className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent drop-shadow-2xl">
                          {property.title}
                        </span>
                      </h1>

                      {/* 위치 및 시공사 - 호버 효과 강화 */}
                      <div className="flex flex-wrap items-center gap-4 text-lg">
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          className="flex items-center gap-2 backdrop-blur-md bg-white/15 px-5 py-2.5 rounded-full border border-white/20 hover:bg-white/25 transition-all cursor-pointer"
                        >
                          <MapPin className="w-5 h-5 text-blue-400" />
                          <span className="font-semibold">{property.city} {property.district}</span>
                        </motion.div>
                        {property.constructor && (
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="flex items-center gap-2 backdrop-blur-md bg-white/15 px-5 py-2.5 rounded-full border border-white/20 hover:bg-white/25 transition-all cursor-pointer"
                          >
                            <Building2 className="w-5 h-5 text-cyan-400" />
                            <span className="font-semibold">{property.constructor}</span>
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* 주요 정보 카드 그리드 - 임팩트 강화 */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <GlassCard className="p-6 text-center hover:scale-105 transition-transform duration-300 cursor-pointer group">
                    <Calendar className="w-8 h-8 text-blue-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                    <div className="text-xs text-gray-400 mb-1 uppercase tracking-wider">입주예정</div>
                    <div className="text-2xl font-black text-white">
                      {formatDate(property.moveInDate)}
                    </div>
                  </GlassCard>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <GlassCard className="p-6 text-center hover:scale-105 transition-transform duration-300 cursor-pointer group bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-400/30">
                    <TrendingUp className="w-8 h-8 text-cyan-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                    <div className="text-xs text-gray-400 mb-1 uppercase tracking-wider">분양가</div>
                    <div className="text-2xl font-black text-cyan-400">
                      {formatPrice(property.basePrice)}
                    </div>
                  </GlassCard>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <GlassCard className="p-6 text-center hover:scale-105 transition-transform duration-300 cursor-pointer group bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-400/30">
                    <Award className="w-8 h-8 text-green-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                    <div className="text-xs text-gray-400 mb-1 uppercase tracking-wider">특장점</div>
                    <div className="text-xl font-black text-green-400">
                      {property.keyFeature || '프리미엄'}
                    </div>
                  </GlassCard>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <GlassCard className="p-6 text-center hover:scale-105 transition-transform duration-300 cursor-pointer group bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-400/30">
                    <Users className="w-8 h-8 text-purple-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                    <div className="text-xs text-gray-400 mb-1 uppercase tracking-wider">총 세대수</div>
                    <div className="text-xl font-black text-purple-400">
                      {property.totalUnits.toLocaleString()}세대
                    </div>
                  </GlassCard>
                </motion.div>
              </div>

              {/* 위치 정보 섹션 */}
              {property.locationDesc && (
                <GlassCard className="p-6 mb-8 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-blue-400/20">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-500/20 rounded-xl">
                      <Navigation2 className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white mb-2">위치 및 교통</h3>
                      <p className="text-gray-300 leading-relaxed">{property.locationDesc}</p>
                    </div>
                  </div>
                </GlassCard>
              )}

              {/* 평형 구성 */}
              {pyeongTypes.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Square className="w-5 h-5 text-purple-400" />
                    평형 구성
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {pyeongTypes.map((pyeong, index) => (
                      <div
                        key={index}
                        className="px-4 py-2 bg-purple-500/20 border border-purple-400/30 rounded-lg text-purple-300 font-medium"
                      >
                        {pyeong}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 유튜브 영상 섹션 */}
              {property.youtubeVideoId && (
                <GlassCard className="p-6 mb-8">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Play className="w-5 h-5 text-red-400" />
                    현장 소개 영상
                  </h3>
                  <div className="relative aspect-video rounded-xl overflow-hidden">
                    <iframe
                      src={`https://www.youtube.com/embed/${property.youtubeVideoId}`}
                      title={`${property.title} 소개 영상`}
                      className="absolute inset-0 w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </GlassCard>
              )}
            </motion.div>
          </div>
        </section>

        {/* 상세 정보 탭 섹션 */}
        <section className="relative pb-20">
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-3 gap-8">

              {/* 메인 콘텐츠 */}
              <div className="lg:col-span-2 space-y-8">

                {/* 단지 정보 - 프로덕션 사이트 UI 스타일 */}
                <GlassCard className="p-8">
                  <h2 className="text-2xl font-bold text-white mb-6">
                    단지 정보
                  </h2>

                  {/* 이미지와 정보 그리드 레이아웃 */}
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* 왼쪽: 매물 이미지 */}
                    <div className="lg:w-1/3">
                      <div className="relative aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-blue-500/20 to-purple-500/20">
                        <Image
                          src={propertyImages[0]}
                          alt={property.title}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                          <p className="text-white font-bold text-lg">{property.title}</p>
                          <p className="text-gray-300 text-sm">{property.city} {property.district}</p>
                        </div>
                      </div>
                    </div>

                    {/* 오른쪽: 정보 그리드 */}
                    <div className="lg:w-2/3">
                      <div className="grid grid-cols-3 gap-3">
                        {/* 총세대수 */}
                        <div className="bg-gradient-to-br from-white/5 to-white/10 rounded-lg p-4 text-center backdrop-blur-sm border border-white/10 hover:border-blue-400/30 hover:from-blue-500/10 hover:to-blue-500/20 transition-all duration-300 group">
                          <div className="text-2xl font-bold text-white mb-1 group-hover:text-blue-300 transition-colors">
                            {property.totalUnits.toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-400">세대</div>
                        </div>

                        {/* 총 동수 */}
                        <div className="bg-gradient-to-br from-white/5 to-white/10 rounded-lg p-4 text-center backdrop-blur-sm border border-white/10 hover:border-purple-400/30 hover:from-purple-500/10 hover:to-purple-500/20 transition-all duration-300 group">
                          <div className="text-2xl font-bold text-white mb-1 group-hover:text-purple-300 transition-colors">
                            {property.totalBuildingCount || '-'}
                          </div>
                          <div className="text-xs text-gray-400">동</div>
                        </div>

                        {/* 주차대수 */}
                        <div className="bg-gradient-to-br from-white/5 to-white/10 rounded-lg p-4 text-center backdrop-blur-sm border border-white/10 hover:border-green-400/30 hover:from-green-500/10 hover:to-green-500/20 transition-all duration-300 group">
                          <div className="text-2xl font-bold text-white mb-1 group-hover:text-green-300 transition-colors">
                            {property.parkingSpaces?.toLocaleString() || '-'}
                          </div>
                          <div className="text-xs text-gray-400">주차대수</div>
                        </div>

                        {/* 시행사 */}
                        <div className="bg-gradient-to-br from-white/5 to-white/10 rounded-lg p-4 text-center backdrop-blur-sm border border-white/10 hover:border-blue-400/30 hover:from-blue-500/10 hover:to-blue-500/20 transition-all duration-300 group">
                          <div className="text-base font-semibold text-blue-400 mb-1 group-hover:text-blue-300 transition-colors">
                            {property.developer?.name || '미정'}
                          </div>
                          <div className="text-xs text-gray-400">시행사</div>
                        </div>

                        {/* 시공사 */}
                        <div className="bg-gradient-to-br from-white/5 to-white/10 rounded-lg p-4 text-center backdrop-blur-sm border border-white/10 hover:border-cyan-400/30 hover:from-cyan-500/10 hover:to-cyan-500/20 transition-all duration-300 group">
                          <div className="text-base font-semibold text-cyan-400 mb-1 group-hover:text-cyan-300 transition-colors">
                            {property.constructor || '미정'}
                          </div>
                          <div className="text-xs text-gray-400">시공사</div>
                        </div>

                        {/* 분양가 */}
                        <div className="bg-gradient-to-br from-white/5 to-white/10 rounded-lg p-4 text-center backdrop-blur-sm border border-white/10 hover:border-yellow-400/30 hover:from-yellow-500/10 hover:to-yellow-500/20 transition-all duration-300 group">
                          <div className="text-base font-semibold text-yellow-400 mb-1 group-hover:text-yellow-300 transition-colors">
                            {formatPrice(property.basePrice)}
                          </div>
                          <div className="text-xs text-gray-400">분양가</div>
                        </div>
                      </div>

                      {/* 추가 정보 행 */}
                      <div className="grid grid-cols-2 gap-3 mt-3">
                        {/* 입주예정일 */}
                        <div className="bg-white/5 rounded-lg px-4 py-3 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-400">입주예정일</span>
                            <span className="text-white font-semibold">{formatDate(property.moveInDate)}</span>
                          </div>
                        </div>

                        {/* 잔여세대 */}
                        <div className="bg-white/5 rounded-lg px-4 py-3 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-400">잔여세대</span>
                            <span className="text-white font-semibold">{property.availableUnits}세대</span>
                          </div>
                        </div>

                        {/* 투자등급 */}
                        <div className="bg-white/5 rounded-lg px-4 py-3 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors col-span-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-400">투자등급</span>
                            <span className="text-purple-400 font-semibold">{property.investmentGrade || '-'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 상세 설명 */}
                  <div className="mt-6 pt-6 border-t border-white/10">
                    <p className="text-gray-300 leading-relaxed">
                      {property.description}
                    </p>
                  </div>
                </GlassCard>

                {/* 단지 내 시설 - 애니메이션 추가 */}
                {facilities.length > 0 && (
                  <GlassCard className="p-8 overflow-hidden relative">
                    <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl" />
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg">
                        <Home className="w-6 h-6 text-purple-400" />
                      </div>
                      단지 내 시설
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 relative">
                      {facilities.map((facility, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ scale: 1.05, y: -5 }}
                          className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-br from-white/5 to-white/10 border border-white/10 hover:border-purple-400/30 hover:from-purple-500/10 hover:to-pink-500/10 transition-all cursor-pointer group"
                        >
                          <div className="p-2 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg group-hover:from-blue-500/30 group-hover:to-purple-500/30 transition-all">
                            {getFacilityIcon(facility)}
                          </div>
                          <span className="text-gray-200 font-medium group-hover:text-white transition-colors">{facility}</span>
                        </motion.div>
                      ))}
                    </div>
                  </GlassCard>
                )}

                {/* 매물 특장점 - 동적 렌더링 */}
                {keyFeatures.length > 0 && (
                  <GlassCard className="p-8 overflow-hidden relative">
                    <div className="absolute -top-20 -left-20 w-40 h-40 bg-yellow-500/10 rounded-full blur-3xl" />
                    <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl" />

                    <h4 className="text-2xl font-bold text-white mb-6 flex items-center gap-3 relative">
                      <div className="p-2 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-lg">
                        <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                      </div>
                      매물 특장점
                      <div className="ml-auto px-3 py-1 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-full text-sm text-yellow-300 font-medium">
                        WHY INVEST?
                      </div>
                    </h4>
                    <div className="space-y-4 relative">
                      {keyFeatures.map((feature, index) => {
                        const style = featureStyles[index % featureStyles.length];
                        return (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.15 }}
                            whileHover={{ scale: 1.02, x: 10 }}
                            className={`flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r ${style.bg} border ${style.border} transition-all cursor-pointer group`}
                          >
                            <div className={`flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br ${style.icon} text-white flex items-center justify-center text-lg font-bold shadow-lg ${style.iconShadow}`}>
                              {style.emoji}
                            </div>
                            <p className="text-gray-200 font-medium group-hover:text-white transition-colors">{feature}</p>
                            <ArrowRight className={`w-5 h-5 ${style.arrow} opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all ml-auto`} />
                          </motion.div>
                        );
                      })}
                    </div>
                  </GlassCard>
                )}

                {/* 중도금 일정 */}
                {interimPayments.length > 0 && (
                  <GlassCard className="p-8">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                      <Calendar className="w-6 h-6 text-blue-400" />
                      중도금 납부 일정
                    </h2>
                    <div className="space-y-4">
                      {interimPayments.map((payment: { step: string; date: string; amount: string }, index: number) => (
                        <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                              {index + 1}
                            </div>
                            <div>
                              <div className="text-white font-semibold">{payment.step}</div>
                              <div className="text-sm text-gray-400">{payment.date}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-white font-bold text-lg">{payment.rate}%</div>
                            <div className="text-sm text-gray-400">{formatPrice(payment.amount.toString())}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </GlassCard>
                )}

                {/* 문의 폼 섹션 - 메인 콘텐츠 영역 */}
                <div className="mt-8">
                  <InquiryForm
                    propertyId={property.id}
                    propertyTitle={property.title}
                  />
                </div>
              </div>

              {/* 사이드바 */}
              <div className="lg:sticky lg:top-24 space-y-6 h-fit">

                {/* 투자 정보 요약 */}
                <GlassCard className="p-6 bg-gradient-to-br from-blue-500/10 to-purple-500/10">
                  <h3 className="text-xl font-bold text-white mb-6">투자 정보</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-3 border-b border-white/10">
                      <span className="text-gray-400">분양가</span>
                      <span className="text-white font-bold text-lg">{formatPrice(property.basePrice)}</span>
                    </div>
                    {property.contractDeposit && (
                      <div className="flex justify-between items-center pb-3 border-b border-white/10">
                        <span className="text-gray-400">계약금</span>
                        <span className="text-white font-bold">{formatPrice(property.contractDeposit)}</span>
                      </div>
                    )}
                    {property.investmentGrade && (
                      <div className="flex justify-between items-center pb-3 border-b border-white/10">
                        <span className="text-gray-400">투자등급</span>
                        <span className="text-purple-400 font-bold">{property.investmentGrade}</span>
                      </div>
                    )}
                    {property.loanRatio && (
                      <div className="flex justify-between items-center pb-3 border-b border-white/10">
                        <span className="text-gray-400">중도금 대출</span>
                        <span className="text-cyan-400 font-bold">{property.loanRatio}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">입주예정</span>
                      <span className="text-white font-semibold">{formatDate(property.moveInDate)}</span>
                    </div>
                  </div>
                </GlassCard>

                {/* 문의하기 - 간소화된 CTA */}
                <GlassCard className="p-6 overflow-hidden relative">
                  {/* 배경 애니메이션 */}
                  <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl" />
                  <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-yellow-500/20 rounded-full blur-3xl" />

                  <h3 className="text-xl font-bold text-white mb-6 relative">
                    상담 문의
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                  </h3>
                  <div className="space-y-3 relative">
                    {/* 일반 문의 - 메인 CTA */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full relative group"
                    >
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500 rounded-xl blur opacity-60 group-hover:opacity-100 transition-opacity animate-pulse" />
                      <div className="relative flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-bold shadow-xl shadow-blue-500/25">
                        <Phone className="w-5 h-5 animate-bounce" />
                        <span>일반 문의</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </motion.button>

                    {/* 카카오톡 문의 */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => window.open('https://open.kakao.com/o/sRJgAO4h', '_blank')}
                      className="w-full relative group"
                    >
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-xl blur opacity-0 group-hover:opacity-60 transition-opacity" />
                      <div className="relative flex items-center justify-center gap-3 px-6 py-4 bg-[#FEE500] text-[#3C1E1E] rounded-xl font-bold shadow-lg shadow-yellow-500/20 hover:bg-[#FDD835] transition-all">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 3C6.48 3 2 6.58 2 11c0 2.8 1.8 5.27 4.54 6.71-.2.74-.73 2.68-.84 3.1-.14.52.19.52.41.38.17-.11 2.72-1.84 3.83-2.59.68.09 1.38.14 2.06.14 5.52 0 10-3.58 10-8 0-4.42-4.48-8-10-8z"/>
                        </svg>
                        <span>카카오톡 문의</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </motion.button>
                  </div>
                </GlassCard>

                {/* 공유 및 저장 - 호버 효과 강화 */}
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 flex items-center justify-center gap-2 p-4 rounded-xl bg-white/10 text-white hover:bg-pink-500/20 hover:text-pink-300 transition-all border border-white/10 hover:border-pink-400/30 group"
                  >
                    <Heart className="w-5 h-5 group-hover:fill-pink-400 transition-all" />
                    <span className="font-medium">저장</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 flex items-center justify-center gap-2 p-4 rounded-xl bg-white/10 text-white hover:bg-blue-500/20 hover:text-blue-300 transition-all border border-white/10 hover:border-blue-400/30"
                  >
                    <Share2 className="w-5 h-5" />
                    <span className="font-medium">공유</span>
                  </motion.button>
                </div>

                {/* PDF 다운로드 버튼 */}
                {property.pdfUrl && (
                  <motion.a
                    href={property.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="block"
                  >
                    <GlassCard className="p-5 hover:bg-white/10 transition-all cursor-pointer group">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-xl group-hover:from-red-500/30 group-hover:to-orange-500/30 transition-all">
                          <FileText className="w-6 h-6 text-red-400" />
                        </div>
                        <div className="flex-1">
                          <div className="text-white font-bold">교육자료 PDF</div>
                          <div className="text-sm text-gray-400">상세 현장 정보 다운로드</div>
                        </div>
                        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
                      </div>
                    </GlassCard>
                  </motion.a>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}