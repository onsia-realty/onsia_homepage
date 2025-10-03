'use client';

import { useState, useEffect } from 'react';
import React from 'react';
import { motion } from 'framer-motion';
import {
  MapPin, Building2, Calendar, Users, Car, TrendingUp,
  Calculator, Phone, Mail, Share2, Heart, ChevronLeft,
  ArrowRight, Check, Home, Award, Star, Clock, Wifi,
  Trees, Dumbbell, Store, GraduationCap
} from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { ParticlesBackground } from '@/components/ParticlesBackground';
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
  totalBuildingCount: number | null;
  parkingSpaces: number | null;
  facilities: string | null;
  status: string;
  featured: boolean;
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

  const formatPrice = (price: string) => {
    if (!price) return '가격문의';
    const numPrice = parseInt(price);
    if (isNaN(numPrice)) return '가격문의';
    const eok = Math.floor(numPrice / 100000000);
    const man = Math.floor((numPrice % 100000000) / 10000);

    if (eok === 0 && man === 0) return '가격문의';
    if (man === 0) return `${eok}억`;
    return `${eok}억 ${man}만`;
  };

  const formatDate = (date: Date) => {
    if (!date) return '-';
    const d = new Date(date);
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

  // 이미지 선택 함수
  const getPropertyImages = () => {
    // 실제 이미지가 없으므로 임시 이미지 배열 생성
    const imageIndex = property?.id === 'cmgafd7w7000iupjg8xmpjku3' ? 0 :
                       property?.id === 'cmgafd7xa000kupjgcp9y7kkr' ? 1 : 2;
    const images = [
      '/property-1-gwanggyo-cloud-new.png',
      '/property-2-yongin-honors-new.png',
      '/property-3-bubal-station.png'
    ];
    return [images[imageIndex]];
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
              {/* 이미지 갤러리 */}
              <div className="mb-8">
                <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden">
                  <Image
                    src={propertyImages[selectedImage]}
                    alt={property.title}
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  {/* 오버레이 정보 */}
                  <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                    <div className="flex flex-wrap gap-3 mb-4">
                      {property.featured && (
                        <span className="px-4 py-2 bg-blue-500 text-white text-sm font-bold rounded-full">
                          추천매물
                        </span>
                      )}
                      {property.investmentGrade && (
                        <span className="px-4 py-2 bg-purple-500 text-white text-sm font-bold rounded-full">
                          투자등급 {property.investmentGrade}
                        </span>
                      )}
                      {property.keyFeature && (
                        <span className="px-4 py-2 bg-green-500 text-white text-sm font-bold rounded-full">
                          {property.keyFeature}
                        </span>
                      )}
                    </div>
                    <h1 className="text-3xl md:text-5xl font-bold mb-4">
                      {property.title}
                    </h1>
                    <div className="flex items-center gap-4 text-lg">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5" />
                        <span>{property.city} {property.district}</span>
                      </div>
                      {property.constructor && (
                        <div className="flex items-center gap-2">
                          <Building2 className="w-5 h-5" />
                          <span>{property.constructor}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* 주요 정보 카드 그리드 */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <GlassCard className="p-6 text-center">
                  <div className="text-sm text-gray-400 mb-2">입주예정</div>
                  <div className="text-2xl font-bold text-white">
                    2029년 5월
                  </div>
                </GlassCard>

                <GlassCard className="p-6 text-center">
                  <div className="text-sm text-gray-400 mb-2">분양가</div>
                  <div className="text-2xl font-bold text-white">
                    4억대~
                  </div>
                </GlassCard>

                <GlassCard className="p-6 text-center bg-green-500/10 border-green-400/30">
                  <div className="text-sm text-gray-400 mb-2">특장점</div>
                  <div className="text-2xl font-bold text-green-400 flex items-center justify-center gap-1">
                    계약금 0원
                  </div>
                </GlassCard>

                <GlassCard className="p-6 text-center bg-gradient-to-br from-yellow-500/10 to-yellow-500/20 border-yellow-400/30">
                  <div className="text-sm text-gray-400 mb-2">상담문의</div>
                  <div className="text-xl font-bold text-yellow-400">
                    카카오톡
                  </div>
                </GlassCard>
              </div>
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
                            3,140
                          </div>
                          <div className="text-xs text-gray-400">세대</div>
                        </div>

                        {/* 총 동수 */}
                        <div className="bg-gradient-to-br from-white/5 to-white/10 rounded-lg p-4 text-center backdrop-blur-sm border border-white/10 hover:border-purple-400/30 hover:from-purple-500/10 hover:to-purple-500/20 transition-all duration-300 group">
                          <div className="text-2xl font-bold text-white mb-1 group-hover:text-purple-300 transition-colors">
                            5
                          </div>
                          <div className="text-xs text-gray-400">동</div>
                        </div>

                        {/* 주차대수 */}
                        <div className="bg-gradient-to-br from-white/5 to-white/10 rounded-lg p-4 text-center backdrop-blur-sm border border-white/10 hover:border-green-400/30 hover:from-green-500/10 hover:to-green-500/20 transition-all duration-300 group">
                          <div className="text-2xl font-bold text-white mb-1 group-hover:text-green-300 transition-colors">
                            2,556
                          </div>
                          <div className="text-xs text-gray-400">주차대수</div>
                        </div>

                        {/* 시행사 */}
                        <div className="bg-gradient-to-br from-white/5 to-white/10 rounded-lg p-4 text-center backdrop-blur-sm border border-white/10 hover:border-blue-400/30 hover:from-blue-500/10 hover:to-blue-500/20 transition-all duration-300 group">
                          <div className="text-base font-semibold text-blue-400 mb-1 group-hover:text-blue-300 transition-colors">
                            기세
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
                            <span className="text-white font-semibold">2029년 5월</span>
                          </div>
                        </div>

                        {/* 대지면적 */}
                        <div className="bg-white/5 rounded-lg px-4 py-3 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-400">대지면적</span>
                            <span className="text-white font-semibold text-sm">26,975.10 m²</span>
                          </div>
                        </div>

                        {/* 건축면적 */}
                        <div className="bg-white/5 rounded-lg px-4 py-3 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors col-span-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-400">건축면적</span>
                            <span className="text-white font-semibold">346,350.13 m²</span>
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

                {/* 단지 내 시설 */}
                {facilities.length > 0 && (
                  <GlassCard className="p-8">
                    <h2 className="text-2xl font-bold text-white mb-6">단지 내 시설</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {facilities.map((facility, index) => (
                        <div key={index} className="flex items-center gap-3 p-4 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-400/20">
                          <div className="text-blue-400">
                            {getFacilityIcon(facility)}
                          </div>
                          <span className="text-gray-200 font-medium">{facility}</span>
                        </div>
                      ))}
                    </div>
                  </GlassCard>
                )}

                {/* 매물 특장점 */}
                <GlassCard className="p-6">
                  <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-400" />
                    매물 특장점
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold">1</div>
                      <p className="text-gray-200 text-sm">삼성 반도체 배후수요를 둔 하이엔드 지식산업센터</p>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center text-xs font-bold">2</div>
                      <p className="text-gray-200 text-sm">계약금 5% 중도금 무이자</p>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-purple-500 text-white flex items-center justify-center text-xs font-bold">3</div>
                      <p className="text-gray-200 text-sm">계약시 축하금 3% 지급</p>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-cyan-500 text-white flex items-center justify-center text-xs font-bold">4</div>
                      <p className="text-gray-200 text-sm">상업지역 시공, 헬스장, 회의실, 골프장, 커뮤니티 시설이 완비된 오피스</p>
                    </div>
                  </div>
                </GlassCard>

                {/* 중도금 일정 */}
                {interimPayments.length > 0 && (
                  <GlassCard className="p-8">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                      <Calendar className="w-6 h-6 text-blue-400" />
                      중도금 납부 일정
                    </h2>
                    <div className="space-y-4">
                      {interimPayments.map((payment: any, index: number) => (
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
                    <div className="flex justify-between items-center pb-3 border-b border-white/10">
                      <span className="text-gray-400">평단가</span>
                      <span className="text-white font-bold">
                        {property.pricePerPyeong && !isNaN(parseInt(property.pricePerPyeong))
                          ? `${(parseInt(property.pricePerPyeong) / 10000).toFixed(0)}만원/평`
                          : '가격문의'}
                      </span>
                    </div>
                    {property.contractDeposit && (
                      <div className="flex justify-between items-center pb-3 border-b border-white/10">
                        <span className="text-gray-400">계약금</span>
                        <span className="text-white font-bold">{formatPrice(property.contractDeposit)}</span>
                      </div>
                    )}
                    {property.rightsFee && (
                      <div className="flex justify-between items-center pb-3 border-b border-white/10">
                        <span className="text-gray-400">권리금</span>
                        <span className="text-white font-bold">{formatPrice(property.rightsFee)}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center pb-3 border-b border-white/10">
                      <span className="text-gray-400">준공예정</span>
                      <span className="text-white font-semibold">{formatDate(property.completionDate)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">입주예정</span>
                      <span className="text-white font-semibold">{formatDate(property.moveInDate)}</span>
                    </div>
                  </div>
                </GlassCard>

                {/* 문의하기 */}
                <GlassCard className="p-6">
                  <h3 className="text-xl font-bold text-white mb-6">상담 문의</h3>
                  <div className="space-y-3">
                    <button className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all font-semibold">
                      <Phone className="w-5 h-5" />
                      <span>전화 문의</span>
                    </button>
                    <button className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors font-semibold">
                      <Mail className="w-5 h-5" />
                      <span>이메일 문의</span>
                    </button>
                    <button className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-green-500/20 text-green-300 rounded-xl hover:bg-green-500/30 transition-colors font-semibold">
                      <Calculator className="w-5 h-5" />
                      <span>수익률 계산기</span>
                    </button>
                  </div>
                </GlassCard>

                {/* 공유 및 저장 */}
                <div className="flex gap-3">
                  <button className="flex-1 flex items-center justify-center gap-2 p-3 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors">
                    <Heart className="w-5 h-5" />
                    <span>저장</span>
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 p-3 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors">
                    <Share2 className="w-5 h-5" />
                    <span>공유</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}