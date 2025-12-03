'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Building2, Calendar, MessageCircle, FileText, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { GlassCard } from './ui/GlassCard';
import Link from 'next/link';
import Image from 'next/image';

interface Developer {
  id: string;
  name: string;
}

interface PropertyImage {
  id: string;
  url: string;
  alt?: string;
  order: number;
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
  contractDeposit: string;
  totalUnits: number;
  availableUnits: number;
  moveInDate: Date;
  completionDate: Date;
  profitRate?: number | null;
  constructor?: string | null;
  keyFeature?: string | null;
  featured: boolean;
  images?: PropertyImage[];
}

// 유틸리티 함수들
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
  return `${eok}억 ${man > 0 ? man + '만' : ''}`;
};

const formatDate = (date: unknown) => {
  if (!date) return '-';
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

const getBadge = (index: number) => {
  const badges = ['투자추천', '고수익', '프리미엄', '추천'];
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

// 매물 카드 컴포넌트 (PC/모바일 공용)
const PropertyCard = ({ property, index, isFeatured = true, isMobile = false }: {
  property: Property;
  index: number;
  isFeatured?: boolean;
  isMobile?: boolean;
}) => {
  const badge = isFeatured ? getBadge(index) : '일반';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: isMobile ? 0 : index * 0.1 }}
      className={isMobile ? "flex-shrink-0 w-[280px]" : ""}
    >
      <Link href={`/properties/${property.id}`}>
        <GlassCard
          className="overflow-hidden cursor-pointer group h-full"
          hover
          glow={isFeatured}
          size="lg"
        >
          {/* 이미지 섹션 */}
          <div className={`relative overflow-hidden ${isMobile ? 'h-44' : 'h-64'}`}>
            <Image
              src={property.images && property.images.length > 0
                ? property.images[0].url
                : '/property-placeholder.png'}
              alt={property.title}
              fill
              className="object-cover"
              quality={75}
              sizes={isMobile ? "280px" : "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
            />

            {/* 배지 */}
            {isFeatured && (
              <div className={`absolute top-3 left-3 px-3 py-1.5 rounded-full text-white text-xs sm:text-sm font-bold bg-gradient-to-r ${getBadgeColor(badge)} shadow-lg z-10`}>
                {badge}
              </div>
            )}

            {/* 시공사 배지 */}
            {property.constructor && (
              <div className="absolute top-3 right-3 px-2.5 py-1.5 bg-black/50 backdrop-blur-sm rounded-full text-blue-400 text-xs font-semibold flex items-center gap-1 z-10">
                <Building2 className="w-3 h-3" />
                <span className="max-w-[80px] truncate">{property.constructor}</span>
              </div>
            )}

            {/* 그라데이션 오버레이 */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            {/* 하단 위치 정보 */}
            <div className="absolute bottom-3 left-3 right-3 z-10">
              <div className="flex items-center gap-1.5 text-white/90 text-sm">
                <MapPin className="w-3 h-3" />
                <span className="truncate">{property.city} {property.district}</span>
              </div>
            </div>
          </div>

          {/* 콘텐츠 섹션 */}
          <div className={`flex flex-col ${isMobile ? 'p-4' : 'p-5'}`} style={{ minHeight: isMobile ? '220px' : '320px' }}>
            <div className="mb-3">
              <h3
                className={`font-bold text-white group-hover:text-blue-300 transition-colors line-clamp-1 ${isMobile ? 'text-sm' : 'text-base'}`}
                style={!isMobile ? { fontSize: 'clamp(14px, 1.1vw, 18px)' } : undefined}
                title={property.title}
              >
                {property.title}
              </h3>
              <p className="text-gray-400 text-xs mt-1">{property.constructor || '시공사 미정'}</p>
            </div>

            {/* 가격 정보 */}
            <div className="space-y-2 mb-4 flex-shrink-0">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-xs">분양가</span>
                <span className={`text-white font-bold ${isMobile ? 'text-sm' : 'text-base'}`}>{formatPrice(property.basePrice)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-xs">계약금</span>
                <span className="text-white font-semibold text-sm">
                  {property.contractDeposit && !isNaN(parseInt(property.contractDeposit))
                    ? formatPrice(property.contractDeposit)
                    : '문의'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-xs">총 세대수</span>
                <span className="text-white font-semibold text-sm">{property.totalUnits}세대</span>
              </div>
            </div>

            {/* 특장점 */}
            <div className={`mb-3 flex-shrink-0 ${isMobile ? 'h-8' : 'h-10'}`}>
              {property.keyFeature ? (
                <div className="p-2 bg-green-500/10 rounded-lg border border-green-500/20 h-full flex items-center">
                  <div className="text-green-400 font-semibold text-xs line-clamp-1">{property.keyFeature}</div>
                </div>
              ) : (
                <div className="h-full" />
              )}
            </div>

            {/* 준공예정 */}
            <div className="flex items-center gap-2 text-gray-400 text-xs mb-3 flex-shrink-0">
              <Calendar className="w-3 h-3" />
              <span>준공예정: <span className="text-white font-semibold">{formatDate(property.completionDate)}</span></span>
            </div>

            {/* 버튼 영역 */}
            <div className="mt-auto space-y-2">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  window.open('https://open.kakao.com/o/sRJgAO4h', '_blank');
                }}
                className="w-full px-3 py-2.5 bg-[#FEE500] text-[#3C1E1E] rounded-lg hover:bg-[#FDD835] transition-all duration-300 font-bold text-xs flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                카카오톡 문의
              </button>

              <button
                onClick={(e) => {
                  e.preventDefault();
                  window.open('https://open.kakao.com/o/sRJgAO4h', '_blank');
                }}
                className="w-full px-3 py-2.5 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg hover:bg-blue-500/30 transition-all duration-300 font-bold text-xs flex items-center justify-center gap-2"
              >
                <FileText className="w-3.5 h-3.5" />
                교육자료 요청
              </button>
            </div>
          </div>
        </GlassCard>
      </Link>
    </motion.div>
  );
};

// 모바일 슬라이더 컴포넌트
const MobileSlider = ({ properties, isFeatured = true }: { properties: Property[]; isFeatured?: boolean }) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollButtons = () => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScrollButtons();
    const slider = sliderRef.current;
    if (slider) {
      slider.addEventListener('scroll', checkScrollButtons);
      return () => slider.removeEventListener('scroll', checkScrollButtons);
    }
  }, [properties]);

  const scroll = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative group/slider">
      {/* 왼쪽 화살표 */}
      {canScrollLeft && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-black/70 hover:bg-black/90 backdrop-blur-sm rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-300"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}

      {/* 오른쪽 화살표 */}
      {canScrollRight && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-black/70 hover:bg-black/90 backdrop-blur-sm rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-300"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}

      {/* 슬라이더 컨테이너 */}
      <div
        ref={sliderRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4 -mx-4 px-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {properties.map((property, index) => (
          <PropertyCard
            key={property.id}
            property={property}
            index={index}
            isFeatured={isFeatured}
            isMobile={true}
          />
        ))}
      </div>

      {/* 스크롤 인디케이터 */}
      <div className="flex justify-center gap-1.5 mt-3">
        {properties.slice(0, Math.min(properties.length, 5)).map((_, idx) => (
          <div key={idx} className="w-1.5 h-1.5 rounded-full bg-white/30" />
        ))}
      </div>
    </div>
  );
};

export const FeaturedPropertiesSection = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch('/api/properties');
        const data = await response.json();
        if (Array.isArray(data)) {
          setProperties(data);
        } else {
          setProperties([]);
        }
      } catch (error) {
        console.error('Failed to fetch properties:', error);
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  // 추천 매물: featured=true 중 상위 4개
  const featuredProperties = properties.filter((p: Property) => p.featured).slice(0, 4);
  const featuredIds = new Set(featuredProperties.map(p => p.id));

  // 일반 매물: 추천 4개 제외한 나머지 중 8개
  const regularProperties = properties.filter((p: Property) => !featuredIds.has(p.id)).slice(0, 8);

  if (loading) {
    return (
      <section className="relative py-12 md:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center text-gray-400">매물 정보를 불러오는 중...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-12 md:py-20">
      <div className="container mx-auto px-4 sm:px-6">
        {/* 섹션 헤더 */}
        <motion.div
          className="max-w-4xl mx-auto text-center mb-8 md:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 md:px-6 md:py-3 rounded-full bg-blue-500/20 border border-blue-400/30 mb-6 md:mb-8 backdrop-blur-sm">
            <Building2 className="w-4 h-4 md:w-5 md:h-5 text-blue-300" />
            <span className="text-blue-200 font-semibold text-xs md:text-sm">추천 분양권 매물</span>
          </div>

          <div className="mb-4 md:mb-6">
            <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-wider mb-2 md:mb-4">
              <span className="text-white">FEATURED</span>
              <span className="text-blue-400 ml-2 md:ml-3">listings</span>
            </div>
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-2 md:mb-4">
              <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent">
                온시아가 자신있게 추천드리는 매물
              </span>
            </h2>
          </div>

          <p className="text-sm md:text-lg text-gray-300 leading-relaxed">
            온시아 공인중개사 스페셜리스트가 엄선하여 자신있게 추천드리는 분양권 추천 매물입니다.
          </p>
        </motion.div>

        {/* 추천 매물 - PC: 그리드 / 모바일: 슬라이더 */}
        {featuredProperties.length > 0 && (
          <>
            {/* PC 그리드 (md 이상) */}
            <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {featuredProperties.map((property, index) => (
                <PropertyCard key={property.id} property={property} index={index} isFeatured={true} />
              ))}
            </div>

            {/* 모바일 슬라이더 (md 미만) */}
            <div className="md:hidden mb-8">
              <MobileSlider properties={featuredProperties} isFeatured={true} />
            </div>
          </>
        )}

        {/* 구분선 + 텍스트 */}
        {regularProperties.length > 0 && (
          <motion.div
            className="my-10 md:my-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center justify-center gap-3 md:gap-4">
              <div className="h-px flex-1 max-w-[40px] md:max-w-xs bg-gradient-to-r from-transparent via-blue-400/30 to-blue-400/50" />
              <div className="flex items-center gap-2 md:gap-3">
                <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-cyan-400" />
                <h3 className="text-base sm:text-lg md:text-2xl lg:text-3xl font-bold">
                  <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent">
                    엄선된 분양권 선택 기회
                  </span>
                </h3>
                <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-cyan-400" />
              </div>
              <div className="h-px flex-1 max-w-[40px] md:max-w-xs bg-gradient-to-r from-blue-400/50 via-blue-400/30 to-transparent" />
            </div>
            <p className="text-center text-gray-400 mt-3 md:mt-4 text-xs md:text-base">
              다양한 분양권 매물을 비교하고 나에게 맞는 투자처를 찾아보세요
            </p>
          </motion.div>
        )}

        {/* 일반 매물 - PC: 그리드 / 모바일: 슬라이더 */}
        {regularProperties.length > 0 && (
          <>
            {/* PC 그리드 (md 이상) */}
            <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
              {regularProperties.map((property, index) => (
                <PropertyCard key={property.id} property={property} index={index} isFeatured={false} />
              ))}
            </div>

            {/* 모바일 슬라이더 (md 미만) */}
            <div className="md:hidden mb-8">
              <MobileSlider properties={regularProperties} isFeatured={false} />
            </div>
          </>
        )}

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
            className="inline-flex items-center gap-2 md:gap-3 px-6 py-3 md:px-8 md:py-4 rounded-full bg-gradient-to-r from-blue-600/80 to-cyan-600/80 border border-blue-400/30 font-semibold text-white text-sm md:text-base hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 group"
          >
            <span>전체 매물 보기</span>
            <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
