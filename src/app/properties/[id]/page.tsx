'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin, Building2, Calendar, Users, Car, TrendingUp,
  Calculator, Phone, Mail, Share2, Heart, ChevronLeft,
  ChevronRight, Wifi, Dumbbell, Car as CarIcon, TreePine,
  ShoppingCart, School, Hospital, Bus, ArrowRight, Check,
  Home, Layers, Briefcase, Award, Star, Clock, FileText
} from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { ParticlesBackground } from '@/components/ParticlesBackground';
import Link from 'next/link';
import Image from 'next/image';

// 임시 상세 데이터
const mockProperty = {
  id: '1',
  title: '신광교 클라우드시티',
  developer: '기세',
  location: '경기 용인시 기흥구 영덕동 1306번지',
  district: '기흥구',
  basePrice: 1100000000,
  minPrice: 400000000,
  maxPrice: 1100000000,
  pricePerPyeong: 4500000,
  rightsFee: 50000000,
  totalUnits: 3140,
  availableUnits: 156,
  completionDate: '2029년 5월',
  moveInDate: '2029년 7월',
  profitRate: 18.5,
  investmentGrade: 'A+',
  buildingType: 'APARTMENT',
  totalBuildingCount: 5,
  parkingSpaces: 2556,
  landArea: '26,975.10㎡',
  buildingArea: '346,350.13㎡',
  floorAreaRatio: '799.75%',
  buildingCoverageRatio: '50%',
  description: '수원 광교 신도시 호수공원 인근에 위치한 하이엔드 지식산업센터로, 우수한 접근성과 높은 투자가치를 자랑합니다. 입주사들이 이용하는 커뮤니티 시설은 하이엔드의 가치를 높여드립니다.',

  // 특장점
  keyFeatures: [
    { icon: Star, title: '프리미엄 입지', desc: '광교신도시 핵심상권 인접' },
    { icon: Building2, title: '대형 브랜드', desc: '대우건설 최고급 브랜드' },
    { icon: TreePine, title: '우수한 조망', desc: '광교호수공원 조망권 확보' },
    { icon: Car, title: '교통편의성', desc: '신분당선 광교역 도보 10분' },
    { icon: School, title: '교육환경', desc: '광교초·중·고 도보권' },
    { icon: ShoppingCart, title: '생활편의', desc: '갤러리아백화점 5분 거리' }
  ],

  // 분양 조건
  saleConditions: {
    preSaleDate: '2024년 9월',
    contractDate: '2024년 10월',
    completionDate: '2029년 5월',
    moveInDate: '2029년 7월',
    applicationQualification: '만 19세 이상 내국인 및 재외국민',
    restrictions: '투기과열지구 지정으로 재당첨 제한 적용',
    loanLimit: '60% (최대 4억원)'
  },

  // 가격 정보
  priceInfo: [
    { type: 'BW1001', size: 10.55, price: 400000000, count: 800 },
    { type: 'Aw506', size: 15.03, price: 680000000, count: 500 },
    { type: 'EW501', size: 14.03, price: 780000000, count: 900 },
    { type: 'CW629', size: 51.89, price: 590000000, count: 810 }
  ],

  // 납부 일정
  paymentSchedule: [
    { step: '계약금', rate: 10, amount: 135000000, date: '계약시' },
    { step: '1차 중도금', rate: 10, amount: 135000000, date: '2024.06' },
    { step: '2차 중도금', rate: 10, amount: 135000000, date: '2024.12' },
    { step: '3차 중도금', rate: 10, amount: 135000000, date: '2025.06' },
    { step: '잔금', rate: 60, amount: 810000000, date: '입주시' }
  ],

  // 단지 시설
  facilities: [
    { icon: Dumbbell, name: '피트니스센터' },
    { icon: Car, name: '지하주차장' },
    { icon: TreePine, name: '500평 대 골프장' },
    { icon: Wifi, name: '무선인터넷' }
  ],

  // 주변 인프라
  infrastructure: [
    { type: '교육', icon: School, items: ['개포초등학교 (400m)', '개포중학교 (600m)', '대치고등학교 (800m)'] },
    { type: '교통', icon: Bus, items: ['3호선 개포동역 (500m)', '분당선 개포동역 (500m)', '경부고속도로 (2km)'] },
    { type: '의료', icon: Hospital, items: ['강남세브란스병원 (3km)', '삼성서울병원 (4km)', '개포내과 (200m)'] },
    { type: '상업', icon: ShoppingCart, items: ['롯데백화점 (2km)', '현대백화점 (2.5km)', '개포시장 (300m)'] }
  ],

  // 투자 분석
  investmentAnalysis: {
    currentMarketPrice: 1450000000,
    projectedPrice: 1600000000,
    expectedProfit: 250000000,
    profitRate: 18.5,
    riskLevel: 'LOW',
    marketTrend: 'RISING'
  }
};

export default function PropertyDetailPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const tabs = [
    { id: 'overview', label: '단지개요' },
    { id: 'features', label: '특장점' },
    { id: 'price', label: '분양가격' },
    { id: 'investment', label: '투자분석' },
    { id: 'location', label: '입지분석' },
    { id: 'conditions', label: '분양조건' }
  ];

  const formatPrice = (price: number) => {
    const eok = Math.floor(price / 100000000);
    const man = Math.floor((price % 100000000) / 10000);
    return `${eok}억 ${man > 0 ? man + '만' : ''}`;
  };

  return (
    <>
      <Navigation />
      <main className="relative min-h-screen">
        <ParticlesBackground />

        {/* 뒤로가기 & 액션 버튼 */}
        <div className="fixed top-24 left-6 right-6 z-30">
          <div className="flex justify-between items-center">
            <Link
              href="/properties"
              className="glass-hover p-3 rounded-full bg-black/20 backdrop-blur-sm border border-white/20 text-white hover:bg-white/10 transition-all"
            >
              <ChevronLeft className="w-6 h-6" />
            </Link>

            <div className="flex gap-3">
              <button className="glass-hover p-3 rounded-full bg-black/20 backdrop-blur-sm border border-white/20 text-white hover:bg-white/10 transition-all">
                <Share2 className="w-5 h-5" />
              </button>
              <button className="glass-hover p-3 rounded-full bg-black/20 backdrop-blur-sm border border-white/20 text-white hover:bg-white/10 transition-all">
                <Heart className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* 메인 이미지 갤러리 */}
        <section className="relative h-screen">
          <Image
            src="/page5_111.jpg"
            alt={mockProperty.title}
            fill
            className="object-cover"
            quality={75}
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />

          {/* 매물 기본 정보 오버레이 */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="container mx-auto">
              <motion.div
                className="max-w-4xl"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="mb-4 flex flex-wrap gap-3">
                  <span className="px-4 py-2 bg-blue-500/30 text-blue-200 rounded-full text-sm font-medium backdrop-blur-sm">
                    분양권
                  </span>
                  <span className="px-4 py-2 bg-green-500/30 text-green-200 rounded-full text-sm font-medium backdrop-blur-sm">
                    투자등급 {mockProperty.investmentGrade}
                  </span>
                </div>

                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                  {mockProperty.title}
                </h1>

                <div className="flex flex-wrap items-center gap-6 text-gray-300 mb-6">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    <span>{mockProperty.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 className="w-5 h-5" />
                    <span>{mockProperty.developer}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    <span>입주 {mockProperty.moveInDate}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-8">
                  <div>
                    <div className="text-gray-400 text-sm">분양가</div>
                    <div className="text-xl md:text-2xl font-bold text-white whitespace-nowrap">
                      {formatPrice(mockProperty.minPrice)} ~ {formatPrice(mockProperty.maxPrice)}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-400 text-sm">예상수익률</div>
                    <div className="text-2xl font-bold text-green-400 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      {mockProperty.profitRate}%
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-400 text-sm">잔여세대</div>
                    <div className="text-2xl font-bold text-white">
                      {mockProperty.availableUnits}세대
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* 탭 네비게이션 */}
        <section className="sticky top-20 z-20 bg-black/50 backdrop-blur-sm border-b border-white/10">
          <div className="container mx-auto px-6">
            <div className="flex space-x-8 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-2 whitespace-nowrap font-medium transition-colors border-b-2 ${
                    activeTab === tab.id
                      ? 'text-blue-300 border-blue-400'
                      : 'text-gray-400 border-transparent hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* 탭 콘텐츠 */}
        <section className="relative py-20">
          <div className="container mx-auto px-6">
            {/* 단지개요 */}
            {activeTab === 'overview' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid lg:grid-cols-3 gap-8"
              >
                {/* 단지 정보 */}
                <div className="lg:col-span-2 space-y-8">
                  <GlassCard className="p-8">
                    <h3 className="text-2xl font-bold text-white mb-6">단지 정보</h3>

                    <div className="mb-6 relative rounded-xl overflow-hidden border border-white/20">
                      <Image
                        src="/1029 신광교 클라우드 시티 상담북 37p 수정_2.jpg"
                        alt="단지 정보"
                        width={1200}
                        height={800}
                        className="w-full h-auto"
                        quality={75}
                      />
                    </div>

                    <div className="mb-6">
                      <p className="text-gray-300 leading-relaxed">{mockProperty.description}</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="space-y-4">
                        <div className="p-4 bg-white/5 rounded-lg">
                          <div className="text-gray-400 text-sm mb-1">총 세대수</div>
                          <div className="text-white font-bold text-xl">{mockProperty.totalUnits} <span className="text-sm font-normal">세대</span></div>
                        </div>
                        <div className="p-4 bg-white/5 rounded-lg">
                          <div className="text-gray-400 text-sm mb-1">총 동수</div>
                          <div className="text-white font-bold text-xl">{mockProperty.totalBuildingCount} <span className="text-sm font-normal">동</span></div>
                        </div>
                        <div className="p-4 bg-white/5 rounded-lg">
                          <div className="text-gray-400 text-sm mb-1">주차대수</div>
                          <div className="text-white font-bold text-xl">{mockProperty.parkingSpaces} <span className="text-sm font-normal">대</span></div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="p-4 bg-white/5 rounded-lg">
                          <div className="text-gray-400 text-sm mb-1">대지면적</div>
                          <div className="text-white font-bold text-lg">{mockProperty.landArea}</div>
                        </div>
                        <div className="p-4 bg-white/5 rounded-lg">
                          <div className="text-gray-400 text-sm mb-1">건축면적</div>
                          <div className="text-white font-bold text-lg">{mockProperty.buildingArea}</div>
                        </div>
                        <div className="p-4 bg-white/5 rounded-lg">
                          <div className="text-gray-400 text-sm mb-1">용적률 / 건폐율</div>
                          <div className="text-white font-bold text-lg">{mockProperty.floorAreaRatio} / {mockProperty.buildingCoverageRatio}</div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="p-4 bg-white/5 rounded-lg">
                          <div className="text-gray-400 text-sm mb-1">준공예정</div>
                          <div className="text-white font-bold text-lg">{mockProperty.completionDate}</div>
                        </div>
                        <div className="p-4 bg-white/5 rounded-lg">
                          <div className="text-gray-400 text-sm mb-1">입주예정</div>
                          <div className="text-white font-bold text-lg">{mockProperty.moveInDate}</div>
                        </div>
                        <div className="p-4 bg-white/5 rounded-lg">
                          <div className="text-gray-400 text-sm mb-1">건축주</div>
                          <div className="text-white font-bold text-lg">{mockProperty.developer}</div>
                        </div>
                      </div>
                    </div>
                  </GlassCard>

                  {/* 단지 시설 */}
                  <GlassCard className="p-8">
                    <h3 className="text-2xl font-bold text-white mb-6">단지 내 시설</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      {mockProperty.facilities.map((facility, index) => (
                        <div key={index} className="text-center">
                          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                            <facility.icon className="w-6 h-6 text-white" />
                          </div>
                          <p className="text-gray-300 text-sm">{facility.name}</p>
                        </div>
                      ))}
                    </div>
                  </GlassCard>
                </div>

                {/* 사이드바 */}
                <div className="space-y-6">
                  {/* 문의하기 */}
                  <GlassCard className="p-6 text-center">
                    <h4 className="text-xl font-bold text-white mb-4">매물 문의</h4>
                    <div className="space-y-3">
                      <button className="w-full px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2">
                        <Phone className="w-4 h-4" />
                        전화 상담
                      </button>
                      <button className="w-full px-6 py-3 border border-white/20 text-white rounded-xl font-semibold hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
                        <Mail className="w-4 h-4" />
                        온라인 문의
                      </button>
                    </div>
                  </GlassCard>

                  {/* 매물 특장점 */}
                  <GlassCard className="p-6">
                    <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <Star className="w-5 h-5 text-yellow-400" />
                      매물 특장점
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold">
                          1
                        </div>
                        <p className="text-gray-200 text-xs">
                          삼성 반도체 배후수요를 둔 하이엔드 지식산업센터
                        </p>
                      </div>
                      <div className="flex items-center gap-2 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center text-xs font-bold">
                          2
                        </div>
                        <p className="text-gray-200 text-xs">
                          계약금 5% 중도금 무이자
                        </p>
                      </div>
                      <div className="flex items-center gap-2 p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-purple-500 text-white flex items-center justify-center text-xs font-bold">
                          3
                        </div>
                        <p className="text-gray-200 text-xs">
                          계약시 축하금 3% 지급
                        </p>
                      </div>
                      <div className="flex items-center gap-2 p-3 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-cyan-500 text-white flex items-center justify-center text-xs font-bold">
                          4
                        </div>
                        <p className="text-gray-200 text-xs">
                          상업지역 시공, 헬스장, 회의실, 골프장, 커뮤니티 시설이<br />완비된 오피스
                        </p>
                      </div>
                    </div>
                  </GlassCard>
                </div>
              </motion.div>
            )}

            {/* 특장점 */}
            {activeTab === 'features' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <GlassCard className="p-8">
                  <h3 className="text-2xl font-bold text-white mb-8">단지 특장점</h3>

                  <div className="mb-8 space-y-6">
                    <div className="relative rounded-xl overflow-hidden border border-white/20">
                      <Image
                        src="/신광교 클라우드시티 브리핑북_20240920_12.jpg"
                        alt="단지 특장점 1"
                        width={1200}
                        height={800}
                        className="w-full h-auto"
                        quality={75}
                      />
                    </div>
                    <div className="relative rounded-xl overflow-hidden border border-white/20">
                      <Image
                        src="/신광교 클라우드시티 브리핑북_20240920_15.jpg"
                        alt="단지 특장점 2"
                        width={1200}
                        height={800}
                        className="w-full h-auto"
                        quality={75}
                      />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {mockProperty.keyFeatures.map((feature, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-6 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl border border-white/10 hover:border-blue-400/50 transition-all duration-300 group"
                      >
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                          <feature.icon className="w-7 h-7 text-white" />
                        </div>
                        <h4 className="text-xl font-bold text-white mb-2">{feature.title}</h4>
                        <p className="text-gray-300">{feature.desc}</p>
                      </motion.div>
                    ))}
                  </div>
                </GlassCard>

                <GlassCard className="p-8">
                  <h3 className="text-2xl font-bold text-white mb-6">투자 포인트</h3>
                  <div className="space-y-4">
                    {[
                      { icon: Check, title: '프리미엄 입지', desc: '광교신도시 중심상업지구 위치로 향후 발전가능성 높음' },
                      { icon: Check, title: '교통 편의성', desc: '신분당선 광교역 도보 10분, GTX-C노선 예정으로 교통여건 우수' },
                      { icon: Check, title: '학군 우수', desc: '광교초·중·고 도보권, 경기과학고 인접으로 교육환경 양호' },
                      { icon: Check, title: '생활 인프라', desc: '갤러리아백화점, 이마트 등 대형상권 인접' },
                      { icon: Check, title: '브랜드 가치', desc: '대우건설 최고급 브랜드로 안정적 시공 및 A/S 보장' }
                    ].map((point, index) => (
                      <div key={index} className="flex gap-4 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                          <point.icon className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-white mb-1">{point.title}</h4>
                          <p className="text-gray-300 text-sm">{point.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </motion.div>
            )}

            {/* 분양가격 */}
            {activeTab === 'price' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <GlassCard className="p-8">
                  <h3 className="text-2xl font-bold text-white mb-6">타입별 분양가</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/20">
                          <th className="text-left py-4 text-gray-400">타입</th>
                          <th className="text-left py-4 text-gray-400">전용면적</th>
                          <th className="text-left py-4 text-gray-400">분양가</th>
                          <th className="text-left py-4 text-gray-400">평단가</th>
                          <th className="text-left py-4 text-gray-400">세대수</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mockProperty.priceInfo.map((item, index) => (
                          <tr key={index} className="border-b border-white/10">
                            <td className="py-4 text-white font-medium">{item.type}</td>
                            <td className="py-4 text-gray-300">{item.size}평</td>
                            <td className="py-4 text-white font-semibold">{formatPrice(item.price)}</td>
                            <td className="py-4 text-gray-300">{(item.price / item.size / 10000).toFixed(0)}만원/평</td>
                            <td className="py-4 text-gray-300">{item.count}세대</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </GlassCard>

                <GlassCard className="p-8">
                  <h3 className="text-2xl font-bold text-white mb-6">납부 일정</h3>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      {mockProperty.paymentSchedule.map((payment, index) => (
                        <div key={index} className="flex justify-between items-center p-4 bg-white/5 rounded-lg">
                          <div>
                            <div className="text-white font-medium">{payment.step}</div>
                            <div className="text-gray-400 text-sm">{payment.date}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-white font-semibold">{payment.rate}%</div>
                            <div className="text-gray-300 text-sm">{formatPrice(payment.amount)}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-4">
                      <div className="p-6 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl">
                        <h4 className="text-lg font-bold text-white mb-4">권리금 정보</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-300">현재 권리금</span>
                            <span className="text-white font-semibold">{formatPrice(mockProperty.rightsFee)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-300">총 투자금액</span>
                            <span className="text-white font-semibold">{formatPrice(mockProperty.basePrice + mockProperty.rightsFee)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            )}

            {/* 투자분석 */}
            {activeTab === 'investment' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid lg:grid-cols-2 gap-8"
              >
                <GlassCard className="p-8">
                  <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <TrendingUp className="w-6 h-6 text-green-400" />
                    투자 수익률 분석
                  </h3>
                  <div className="space-y-6">
                    <div className="p-6 bg-green-500/10 rounded-xl border border-green-500/20">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-400 mb-2">
                          {mockProperty.investmentAnalysis.profitRate}%
                        </div>
                        <div className="text-gray-300">예상 수익률</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-gray-400 text-sm">현재가</div>
                        <div className="text-white font-semibold">{formatPrice(mockProperty.investmentAnalysis.currentMarketPrice)}</div>
                      </div>
                      <div>
                        <div className="text-gray-400 text-sm">예상가</div>
                        <div className="text-white font-semibold">{formatPrice(mockProperty.investmentAnalysis.projectedPrice)}</div>
                      </div>
                    </div>

                    <div>
                      <div className="text-gray-400 text-sm mb-2">투자 위험도</div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-white/10 rounded-full h-2">
                          <div className="bg-green-400 h-2 rounded-full w-1/4"></div>
                        </div>
                        <span className="text-green-400 font-medium">낮음</span>
                      </div>
                    </div>
                  </div>
                </GlassCard>

                <GlassCard className="p-8">
                  <h3 className="text-2xl font-bold text-white mb-6">시장 동향</h3>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-400">지역 시세 동향</span>
                        <span className="text-green-400 flex items-center gap-1">
                          <TrendingUp className="w-4 h-4" />
                          상승
                        </span>
                      </div>
                      <div className="text-gray-300 text-sm">
                        강남구 신규 아파트 시세가 꾸준히 상승하고 있습니다.
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-400">입지 특성</span>
                        <span className="text-blue-400">우수</span>
                      </div>
                      <div className="text-gray-300 text-sm">
                        교통 접근성과 교육 인프라가 잘 갖춰진 지역입니다.
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-400">공급 현황</span>
                        <span className="text-orange-400">제한적</span>
                      </div>
                      <div className="text-gray-300 text-sm">
                        주변 지역 신규 분양 물량이 제한적이어서 프리미엄이 예상됩니다.
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            )}

            {/* 입지분석 */}
            {activeTab === 'location' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <GlassCard className="p-8">
                  <h3 className="text-2xl font-bold text-white mb-6">주변 인프라</h3>
                  <div className="grid md:grid-cols-2 gap-8">
                    {mockProperty.infrastructure.map((infra, index) => (
                      <div key={index}>
                        <div className="flex items-center gap-2 mb-4">
                          <infra.icon className="w-6 h-6 text-blue-400" />
                          <h4 className="text-lg font-semibold text-white">{infra.type}</h4>
                        </div>
                        <div className="space-y-2">
                          {infra.items.map((item, itemIndex) => (
                            <div key={itemIndex} className="text-gray-300 text-sm flex items-center gap-2">
                              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                              {item}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassCard>

                {/* 지도 플레이스홀더 */}
                <GlassCard className="p-8">
                  <h3 className="text-2xl font-bold text-white mb-6">위치 정보</h3>
                  <div className="h-96 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="w-16 h-16 text-white/50 mx-auto mb-4" />
                      <p className="text-gray-400">지도 연동 예정</p>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            )}

            {/* 분양조건 */}
            {activeTab === 'conditions' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <GlassCard className="p-8">
                  <h3 className="text-2xl font-bold text-white mb-8">분양 일정</h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="p-6 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl border border-white/10">
                      <div className="flex items-center gap-3 mb-3">
                        <Calendar className="w-6 h-6 text-blue-400" />
                        <h4 className="font-semibold text-white">분양공고</h4>
                      </div>
                      <p className="text-2xl font-bold text-white">{mockProperty.saleConditions.preSaleDate}</p>
                    </div>
                    <div className="p-6 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl border border-white/10">
                      <div className="flex items-center gap-3 mb-3">
                        <FileText className="w-6 h-6 text-purple-400" />
                        <h4 className="font-semibold text-white">계약일</h4>
                      </div>
                      <p className="text-2xl font-bold text-white">{mockProperty.saleConditions.contractDate}</p>
                    </div>
                    <div className="p-6 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl border border-white/10">
                      <div className="flex items-center gap-3 mb-3">
                        <Building2 className="w-6 h-6 text-green-400" />
                        <h4 className="font-semibold text-white">준공</h4>
                      </div>
                      <p className="text-2xl font-bold text-white">{mockProperty.saleConditions.completionDate}</p>
                    </div>
                    <div className="p-6 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl border border-white/10">
                      <div className="flex items-center gap-3 mb-3">
                        <Home className="w-6 h-6 text-cyan-400" />
                        <h4 className="font-semibold text-white">입주</h4>
                      </div>
                      <p className="text-2xl font-bold text-white">{mockProperty.saleConditions.moveInDate}</p>
                    </div>
                  </div>
                </GlassCard>

                <div className="grid lg:grid-cols-2 gap-8">
                  <GlassCard className="p-8">
                    <h3 className="text-2xl font-bold text-white mb-6">청약 자격</h3>
                    <div className="space-y-4">
                      <div className="p-4 bg-white/5 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Users className="w-5 h-5 text-blue-400" />
                          <h4 className="font-semibold text-white">신청 자격</h4>
                        </div>
                        <p className="text-gray-300">{mockProperty.saleConditions.applicationQualification}</p>
                      </div>
                      <div className="p-4 bg-white/5 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Award className="w-5 h-5 text-purple-400" />
                          <h4 className="font-semibold text-white">제한 사항</h4>
                        </div>
                        <p className="text-gray-300">{mockProperty.saleConditions.restrictions}</p>
                      </div>
                      <div className="p-4 bg-white/5 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Briefcase className="w-5 h-5 text-green-400" />
                          <h4 className="font-semibold text-white">대출 한도</h4>
                        </div>
                        <p className="text-gray-300">{mockProperty.saleConditions.loanLimit}</p>
                      </div>
                    </div>
                  </GlassCard>

                  <GlassCard className="p-8">
                    <h3 className="text-2xl font-bold text-white mb-6">유의 사항</h3>
                    <div className="space-y-3">
                      {[
                        '본 매물은 투기과열지구로 지정되어 재당첨 제한이 적용됩니다.',
                        '청약통장 가입 기간 및 납입 회차를 확인하시기 바랍니다.',
                        '분양가상한제 적용 단지로 추가 프리미엄 발생 가능성이 있습니다.',
                        '전매 제한 기간은 소유권 이전 등기일로부터 3년입니다.',
                        '대출 규제로 인해 실제 대출 한도는 개인별로 상이할 수 있습니다.',
                        '분양 계약 전 관련 법규 및 조건을 반드시 확인하시기 바랍니다.'
                      ].map((notice, index) => (
                        <div key={index} className="flex gap-3 p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                          <div className="flex-shrink-0 w-5 h-5 rounded-full bg-yellow-500/20 flex items-center justify-center mt-0.5">
                            <span className="text-yellow-400 text-xs font-bold">!</span>
                          </div>
                          <p className="text-gray-300 text-sm">{notice}</p>
                        </div>
                      ))}
                    </div>
                  </GlassCard>
                </div>
              </motion.div>
            )}
          </div>
        </section>

        {/* 하단 고정 액션 바 */}
        <div className="fixed bottom-0 left-0 right-0 z-30 p-6">
          <GlassCard className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-gray-400 text-sm">분양가</div>
                <div className="text-base font-bold text-white whitespace-nowrap">{formatPrice(mockProperty.minPrice)} ~ {formatPrice(mockProperty.maxPrice)}</div>
              </div>
              <div className="flex gap-3">
                <button className="px-6 py-3 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 transition-colors">
                  관심매물
                </button>
                <button className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold transition-colors flex items-center gap-2">
                  상담신청
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* 하단 스페이서 */}
        <div className="h-24" />
      </main>
    </>
  );
}