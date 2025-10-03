'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, TrendingUp, Building2, Calculator, Eye } from 'lucide-react';
import { GlassCard } from './ui/GlassCard';
import Link from 'next/link';
import Image from 'next/image';

interface Developer {
  id: string;
  name: string;
}

interface Property {
  id: string;
  title: string;
  developer: Developer;
  address: string;
  district: string;
  city: string;
  basePrice: string;
  pricePerPyeong: string;
  availableUnits: number;
  moveInDate: Date;
  profitRate?: number | null;
  constructor?: string | null;
  keyFeature?: string | null;
  featured: boolean;
}

export const FeaturedPropertiesSection = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch('/api/properties');
        const data = await response.json();
        console.log('All properties:', data);
        // featured 속성이 true인 매물만 필터링
        const featuredProps = data.filter((p: Property) => p.featured);
        console.log('Featured properties:', featuredProps);
        setProperties(featuredProps);
      } catch (error) {
        console.error('Failed to fetch properties:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);
  const formatPrice = (price: string) => {
    if (!price) return '0억';
    const numPrice = parseInt(price);
    if (isNaN(numPrice)) return '0억';
    const eok = Math.floor(numPrice / 100000000);
    const man = Math.floor((numPrice % 100000000) / 10000);
    return `${eok}억 ${man > 0 ? man + '만' : ''}`;
  };

  const formatDate = (date: Date) => {
    if (!date) return '-';
    const d = new Date(date);
    if (isNaN(d.getTime())) return '-';
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  };

  const getBadge = (index: number) => {
    const badges = ['투자추천', '고수익', '프리미엄'];
    return badges[index] || '추천';
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
          {properties.map((property, index) => {
            const badge = getBadge(index);
            return (
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
                      src={index === 0 ? '/property-1-gwanggyo-cloud-new.png' : index === 1 ? '/property-2-yongin-honors-new.png' : '/property-3-bubal-station.png'}
                      alt={property.title}
                      fill
                      className="object-cover"
                      quality={75}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />

                    {/* 배지 */}
                    <div className={`absolute top-4 left-4 px-4 py-2 rounded-full text-white text-sm font-bold bg-gradient-to-r ${getBadgeColor(badge)} shadow-lg z-10`}>
                      {badge}
                    </div>

                    {/* 시공사 배지 */}
                    {property.constructor && (
                      <div className="absolute top-4 right-4 px-3 py-2 bg-black/50 backdrop-blur-sm rounded-full text-blue-400 text-sm font-semibold flex items-center gap-1 z-10">
                        <Building2 className="w-3 h-3" />
                        {property.constructor}
                      </div>
                    )}

                    {/* 그라데이션 오버레이 */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    {/* 하단 정보 */}
                    <div className="absolute bottom-4 left-4 right-4 z-10">
                      <div className="flex items-center gap-2 text-white/90 text-sm">
                        <MapPin className="w-3 h-3" />
                        <span>{property.city} {property.district}</span>
                      </div>
                    </div>
                  </div>

                  {/* 콘텐츠 섹션 */}
                  <div className="p-6">
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
                        {property.title}
                      </h3>
                      <p className="text-gray-400 text-sm">{property.developer.name}</p>
                    </div>

                    {/* 가격 정보 */}
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">분양가</span>
                        <span className="text-white font-bold text-lg">{formatPrice(property.basePrice)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">평단가</span>
                        <span className="text-white font-semibold">
                          {property.pricePerPyeong && !isNaN(parseInt(property.pricePerPyeong))
                            ? `${(parseInt(property.pricePerPyeong) / 10000).toFixed(0)}만원/평`
                            : '가격문의'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">잔여세대</span>
                        <span className="text-white font-semibold">{property.availableUnits}세대</span>
                      </div>
                    </div>

                    {/* 투자 지표 */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="text-center p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                        <div className="text-blue-400 font-bold text-base md:text-lg whitespace-nowrap">{property.constructor}</div>
                      </div>
                      <div className="text-center p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                        <div className="text-green-400 font-bold text-base md:text-lg">{property.keyFeature}</div>
                      </div>
                      <div className="col-span-2 text-center p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                        <div className="text-purple-400 font-bold text-lg">{formatDate(property.moveInDate)}</div>
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
            );
          })}
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