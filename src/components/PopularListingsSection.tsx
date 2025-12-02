'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Building2, TrendingUp, Flame, Eye } from 'lucide-react';
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
  availableUnits: number;
  moveInDate: Date;
  profitRate?: number | null;
  constructor?: string | null;
  keyFeature?: string | null;
  featured: boolean;
  buildingType?: string;
  images?: PropertyImage[];
}

// 종목별 카테고리 정의
const buildingTypes = [
  { id: 'all', name: '전체', dbValue: null },
  { id: 'apartment', name: '아파트', dbValue: 'APARTMENT' },
  { id: 'officetel', name: '오피스텔', dbValue: 'OFFICETEL' },
  { id: 'knowledge', name: '지식산업센터', dbValue: 'KNOWLEDGE_INDUSTRY' },
  { id: 'commercial', name: '상가', dbValue: 'COMMERCIAL' },
  { id: 'special', name: '특수물건', dbValue: 'SPECIAL' },
];

export const PopularListingsSection = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeType, setActiveType] = useState('all');

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch('/api/properties');
        const data = await response.json();
        // 배열인지 확인
        if (Array.isArray(data)) {
          setProperties(data);
        } else {
          console.log('Data is not an array, using empty array');
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

  const formatPrice = (price: string) => {
    if (!price) return '가격문의';
    const numPrice = parseInt(price);
    if (isNaN(numPrice)) return '가격문의';
    const eok = Math.floor(numPrice / 100000000);
    const man = Math.floor((numPrice % 100000000) / 10000);
    if (eok === 0 && man === 0) return '가격문의';
    if (man === 0) return `${eok}억`;
    return `${eok}억 ${man > 0 ? man.toLocaleString() + '만' : ''}`;
  };

  const formatDate = (date: Date) => {
    if (!date) return '-';
    const d = new Date(date);
    if (isNaN(d.getTime())) return '-';
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}`;
  };

  // 종목별 필터링 (featured 매물은 제외 - FeaturedPropertiesSection에서 표시)
  const nonFeaturedProperties = properties.filter(p => !p.featured);

  const filteredProperties = activeType === 'all'
    ? nonFeaturedProperties
    : nonFeaturedProperties.filter(p => {
        const selectedType = buildingTypes.find(t => t.id === activeType);
        return selectedType && p.buildingType === selectedType.dbValue;
      });

  // DB 이미지 또는 기본 이미지
  const getPropertyImage = (property: Property) => {
    if (property.images && property.images.length > 0) {
      return property.images[0].url;
    }
    return '/property-placeholder.png';
  };

  return (
    <section className="relative py-20">
      <div className="container mx-auto px-6">
        {/* 섹션 헤더 */}
        <motion.div
          className="max-w-4xl mx-auto text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-orange-500/20 border border-orange-400/30 mb-8 backdrop-blur-sm">
            <Flame className="w-5 h-5 text-orange-300" />
            <span className="text-orange-200 font-semibold text-sm">인기 매물</span>
          </div>

          <div className="mb-6">
            <div className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-wider mb-4">
              <span className="text-white">PROPERTY</span>
              <span className="text-orange-400 ml-3">types</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold mb-4">
              <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500 bg-clip-text text-transparent">
                종목별 분양권 매물
              </span>
            </h2>
          </div>

          <p className="text-lg text-gray-300 leading-relaxed mb-8">
            투자자들이 가장 많이 찾는 분양권 매물을 종목별로 확인하세요.
          </p>

          {/* 종목별 탭 필터 */}
          <div className="flex flex-wrap justify-center gap-3">
            {buildingTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setActiveType(type.id)}
                className={`px-6 py-3 rounded-full font-semibold text-sm transition-all duration-300 ${
                  activeType === type.id
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/30'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white border border-white/10'
                }`}
              >
                {type.name}
              </button>
            ))}
          </div>
        </motion.div>

        {/* 매물 카드 그리드 - 4열 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {filteredProperties.slice(0, 6).map((property, index) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link href={`/properties/${property.id}`}>
                <GlassCard
                  className="overflow-hidden cursor-pointer group h-full"
                  hover
                  glow={false}
                >
                  {/* 이미지 */}
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={getPropertyImage(property)}
                      alt={property.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                    {/* 인기 뱃지 */}
                    <div className="absolute top-3 left-3 px-3 py-1.5 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                      <Flame className="w-3 h-3" />
                      인기
                    </div>

                    {/* 조회수 (임시) */}
                    <div className="absolute top-3 right-3 px-2 py-1 bg-black/50 backdrop-blur-sm text-white text-xs rounded-full flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {Math.floor(Math.random() * 500 + 100)}
                    </div>

                    {/* 위치 */}
                    <div className="absolute bottom-3 left-3 flex items-center gap-1 text-white text-sm">
                      <MapPin className="w-3 h-3" />
                      <span>{property.city} {property.district}</span>
                    </div>
                  </div>

                  {/* 콘텐츠 */}
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-orange-300 transition-colors line-clamp-1">
                      {property.title}
                    </h3>

                    <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
                      <Building2 className="w-4 h-4" />
                      <span>{property.constructor || property.developer.name}</span>
                    </div>

                    {/* 가격 정보 */}
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs text-gray-400 mb-1">분양가</div>
                        <div className="text-xl font-bold text-orange-400">{formatPrice(property.basePrice)}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-400 mb-1">입주예정</div>
                        <div className="text-white font-semibold">{formatDate(property.moveInDate)}</div>
                      </div>
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
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Link
            href="/properties"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-orange-500/80 to-amber-500/80 border border-orange-400/30 font-semibold text-white hover:shadow-lg hover:shadow-orange-500/30 transition-all duration-300 group"
          >
            <span>전체 매물 보기</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
