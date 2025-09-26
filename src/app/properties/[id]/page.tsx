'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin, Building2, Calendar, Users, Car, TrendingUp,
  Calculator, Phone, Mail, Share2, Heart, ChevronLeft,
  ChevronRight, Wifi, Dumbbell, Car as CarIcon, TreePine,
  ShoppingCart, School, Hospital, Bus, ArrowRight
} from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { ParticlesBackground } from '@/components/ParticlesBackground';
import Link from 'next/link';

// 임시 상세 데이터
const mockProperty = {
  id: '1',
  title: '신광교 클라우드시티',
  developer: '대우건설',
  location: '경기 수원시 영통구 광교중앙로 123',
  district: '영통구',
  basePrice: 1350000000,
  pricePerPyeong: 4500000,
  rightsFee: 50000000,
  totalUnits: 842,
  availableUnits: 156,
  completionDate: '2025년 12월',
  moveInDate: '2026년 2월',
  profitRate: 18.5,
  investmentGrade: 'A+',
  buildingType: 'APARTMENT',
  totalBuildingCount: 7,
  parkingSpaces: 1200,
  description: '강남 중심부에 위치한 프리미엄 단지로, 뛰어난 접근성과 투자가치를 자랑합니다.',

  // 가격 정보
  priceInfo: [
    { type: '59A', size: 59, price: 1180000000, count: 156 },
    { type: '74A', size: 74, price: 1350000000, count: 234 },
    { type: '84A', size: 84, price: 1480000000, count: 198 },
    { type: '99A', size: 99, price: 1650000000, count: 123 }
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
    { icon: TreePine, name: '조경공원' },
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
    { id: 'price', label: '분양가격' },
    { id: 'investment', label: '투자분석' },
    { id: 'location', label: '입지분석' }
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
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-purple-500/30 flex items-center justify-center">
            <Building2 className="w-32 h-32 text-white/30" />
          </div>
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
                    <div className="text-2xl font-bold text-white">
                      {formatPrice(mockProperty.basePrice)}
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
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <div className="text-gray-400 text-sm">총 세대수</div>
                          <div className="text-white font-semibold">{mockProperty.totalUnits}세대</div>
                        </div>
                        <div>
                          <div className="text-gray-400 text-sm">총 동수</div>
                          <div className="text-white font-semibold">{mockProperty.totalBuildingCount}동</div>
                        </div>
                        <div>
                          <div className="text-gray-400 text-sm">주차대수</div>
                          <div className="text-white font-semibold">{mockProperty.parkingSpaces}대</div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <div className="text-gray-400 text-sm">준공예정</div>
                          <div className="text-white font-semibold">{mockProperty.completionDate}</div>
                        </div>
                        <div>
                          <div className="text-gray-400 text-sm">입주예정</div>
                          <div className="text-white font-semibold">{mockProperty.moveInDate}</div>
                        </div>
                        <div>
                          <div className="text-gray-400 text-sm">건축주</div>
                          <div className="text-white font-semibold">{mockProperty.developer}</div>
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

                  {/* 수익률 계산기 */}
                  <GlassCard className="p-6">
                    <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <Calculator className="w-5 h-5" />
                      수익률 계산기
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <div className="text-gray-400 text-sm">현재 시세</div>
                        <div className="text-white font-semibold">{formatPrice(mockProperty.investmentAnalysis.currentMarketPrice)}</div>
                      </div>
                      <div>
                        <div className="text-gray-400 text-sm">예상 수익</div>
                        <div className="text-green-400 font-semibold">{formatPrice(mockProperty.investmentAnalysis.expectedProfit)}</div>
                      </div>
                      <div>
                        <div className="text-gray-400 text-sm">수익률</div>
                        <div className="text-green-400 font-semibold">{mockProperty.investmentAnalysis.profitRate}%</div>
                      </div>
                      <button className="w-full px-4 py-2 bg-green-500/20 text-green-300 rounded-lg hover:bg-green-500/30 transition-colors text-sm">
                        상세 계산하기
                      </button>
                    </div>
                  </GlassCard>
                </div>
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
                            <td className="py-4 text-gray-300">{item.size}㎡</td>
                            <td className="py-4 text-white font-semibold">{formatPrice(item.price)}</td>
                            <td className="py-4 text-gray-300">{(item.price / item.size / 10000).toFixed(0)}만원/㎡</td>
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
          </div>
        </section>

        {/* 하단 고정 액션 바 */}
        <div className="fixed bottom-0 left-0 right-0 z-30 p-6">
          <GlassCard className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-gray-400 text-sm">분양가</div>
                <div className="text-xl font-bold text-white">{formatPrice(mockProperty.basePrice)}</div>
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