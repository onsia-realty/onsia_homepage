'use client';

import { motion } from 'framer-motion';
import { ArrowRight, MapPin, TrendingUp, Building2, Calculator, Eye } from 'lucide-react';
import { GlassCard } from './ui/GlassCard';
import Link from 'next/link';
import Image from 'next/image';

// 임시 추천 매물 데이터
const featuredProperties = [
  {
    id: '1',
    title: '신광교 클라우드시티',
    developer: '대우건설',
    location: '경기 수원시 영통구',
    district: '영통구',
    basePrice: 1350000000,
    pricePerPyeong: 4500000,
    profitRate: 18.5,
    availableUnits: 156,
    completionDate: '2025-12',
    buildingType: 'APARTMENT',
    image: '/property-1-gwanggyo-cloud.png',
    featured: true,
    badge: '투자추천'
  },
  {
    id: '2',
    title: '용인 경남아너스빌',
    developer: '경남기업',
    location: '경기 용인시 기흥구',
    district: '기흥구',
    basePrice: 890000000,
    pricePerPyeong: 3200000,
    profitRate: 22.3,
    availableUnits: 324,
    completionDate: '2026-03',
    buildingType: 'APARTMENT',
    image: '/property-2-yongin-honors.png',
    featured: true,
    badge: '고수익'
  },
  {
    id: '3',
    title: '이천 부발역 에피트',
    developer: '대방건설',
    location: '경기 이천시 부발읍',
    district: '부발읍',
    basePrice: 1180000000,
    pricePerPyeong: 4100000,
    profitRate: 15.7,
    availableUnits: 89,
    completionDate: '2025-09',
    buildingType: 'APARTMENT',
    image: '/property-3-bubal-station.png',
    featured: true,
    badge: '프리미엄'
  }
];

export const FeaturedPropertiesSection = () => {
  const formatPrice = (price: number) => {
    const eok = Math.floor(price / 100000000);
    const man = Math.floor((price % 100000000) / 10000);
    return `${eok}억 ${man > 0 ? man + '만' : ''}`;
  };

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case '투자추천':
        return 'from-blue-500 to-cyan-500';
      case '고수익':
        return 'from-green-500 to-emerald-500';
      case '프리미엄':
        return 'from-purple-500 to-pink-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <section className="relative py-20">
      <div className="container mx-auto px-6">
        {/* 섹션 헤더 */}
        <motion.div
          className="max-w-4xl mx-auto text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-blue-500/20 border border-blue-400/30 mb-8 backdrop-blur-sm">
            <Building2 className="w-5 h-5 text-blue-300" />
            <span className="text-blue-200 font-semibold text-sm">추천 분양권 매물</span>
          </div>

          <div className="mb-6">
            <div className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-wider mb-4">
              <span className="text-white">FEATURED</span>
              <span className="text-blue-400 ml-3">listings</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent">
                엄선된 분양권 선택 기회
              </span>
            </h2>
          </div>

          <p className="text-lg text-gray-300 leading-relaxed">
            온시아 공인중개사 스페셜리스트가 엄선하여 자신있게 추천드리는 분양권 추천 매물입니다.
          </p>
        </motion.div>

        {/* 매물 카드 그리드 */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {featuredProperties.map((property, index) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <Link href={`/properties/${property.id}`}>
                <GlassCard
                  className="overflow-hidden cursor-pointer group h-full"
                  hover
                  glow
                  size="lg"
                >
                  {/* 이미지 섹션 */}
                  <div className="relative h-64 overflow-hidden">
                    {/* 배경 이미지 */}
                    <Image
                      src={property.image}
                      alt={property.title}
                      fill
                      className="object-cover"
                      quality={75}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />

                    {/* 배지 */}
                    <div className={`absolute top-4 left-4 px-4 py-2 rounded-full text-white text-sm font-bold bg-gradient-to-r ${getBadgeColor(property.badge)} shadow-lg z-10`}>
                      {property.badge}
                    </div>

                    {/* 수익률 배지 */}
                    <div className="absolute top-4 right-4 px-3 py-2 bg-black/50 backdrop-blur-sm rounded-full text-green-400 text-sm font-semibold flex items-center gap-1 z-10">
                      <TrendingUp className="w-3 h-3" />
                      {property.profitRate}%
                    </div>

                    {/* 그라데이션 오버레이 */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    {/* 하단 정보 */}
                    <div className="absolute bottom-4 left-4 right-4 z-10">
                      <div className="flex items-center gap-2 text-white/90 text-sm">
                        <MapPin className="w-3 h-3" />
                        <span>{property.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* 콘텐츠 섹션 */}
                  <div className="p-6">
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
                        {property.title}
                      </h3>
                      <p className="text-gray-400 text-sm">{property.developer}</p>
                    </div>

                    {/* 가격 정보 */}
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">분양가</span>
                        <span className="text-white font-bold text-lg">{formatPrice(property.basePrice)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">평단가</span>
                        <span className="text-white font-semibold">{(property.pricePerPyeong / 10000).toFixed(0)}만원/평</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">잔여세대</span>
                        <span className="text-white font-semibold">{property.availableUnits}세대</span>
                      </div>
                    </div>

                    {/* 투자 지표 */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="text-center p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                        <div className="text-green-400 font-bold text-lg">{property.profitRate}%</div>
                        <div className="text-gray-400 text-xs">예상수익률</div>
                      </div>
                      <div className="text-center p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                        <div className="text-blue-400 font-bold text-lg">{property.completionDate}</div>
                        <div className="text-gray-400 text-xs">입주예정</div>
                      </div>
                    </div>

                    {/* 액션 버튼 */}
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          // 상세 페이지로 이동
                        }}
                        className="flex-1 px-4 py-3 bg-blue-500/20 text-blue-300 rounded-xl hover:bg-blue-500/30 transition-all duration-300 font-semibold text-sm flex items-center justify-center gap-2 group"
                      >
                        <Eye className="w-4 h-4" />
                        상세보기
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          // 수익률 계산기 모달
                        }}
                        className="px-4 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors"
                      >
                        <Calculator className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </GlassCard>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* 더보기 버튼 */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Link
            href="/properties"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-blue-600/80 to-cyan-600/80 border border-blue-400/30 font-semibold text-white hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 group"
          >
            <span>전체 매물 보기</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* 통계 섹션 */}
        <motion.div
          className="mt-20 grid md:grid-cols-4 gap-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {[
            { label: '등록 매물', value: '2,847', unit: '개', color: 'blue' },
            { label: '평균 수익률', value: '19.2', unit: '%', color: 'green' },
            { label: '성공 투자', value: '1,236', unit: '건', color: 'purple' },
            { label: '전문 컨설턴트', value: '47', unit: '명', color: 'cyan' }
          ].map((stat, index) => (
            <GlassCard
              key={index}
              className="text-center p-6"
              hover
              glow={false}
            >
              <div className={`text-3xl font-bold mb-2 bg-gradient-to-r from-${stat.color}-400 to-${stat.color}-600 bg-clip-text text-transparent`}>
                {stat.value}
                <span className="text-lg">{stat.unit}</span>
              </div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </GlassCard>
          ))}
        </motion.div>
      </div>
    </section>
  );
};