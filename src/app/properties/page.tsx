'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Grid3x3, List, MapPin, TrendingUp, Building2, Calculator, ChevronLeft, ChevronRight } from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { ParticlesBackground } from '@/components/ParticlesBackground';
import Image from 'next/image';
import Link from 'next/link';

// API에서 받아올 데이터 타입
interface Developer {
  id: string;
  name: string;
}

interface PropertyImage {
  id: string;
  url: string;
  alt: string;
  order: number;
}

interface Property {
  id: string;
  title: string;
  developer: Developer;
  address: string;
  district: string;
  basePrice: string; // BigInt는 문자열로 전송됨
  priceDisplay?: string | null;
  pricePerPyeong: string;
  totalUnits: number;
  availableUnits: number;
  completionDate: Date;
  moveInDate: Date;
  profitRate?: number | null;
  buildingType: string;
  featured?: boolean;
  constructor?: string | null;
  keyFeature?: string | null;
  images?: PropertyImage[];
}

export default function PropertiesPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const ITEMS_PER_PAGE = 9;

  // API에서 매물 데이터 가져오기 (페이지네이션)
  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/properties?page=${currentPage}&limit=${ITEMS_PER_PAGE}`);
        const data = await response.json();

        if (data.properties && Array.isArray(data.properties)) {
          setProperties(data.properties);
          setTotalPages(data.pagination.totalPages);
          setTotalCount(data.pagination.total);
        } else if (Array.isArray(data)) {
          // 이전 형식 호환
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
  }, [currentPage]);

  const districts = ['영통구', '기흥구', '부발읍', '서초구', '마포구'];
  const buildingTypes = ['APARTMENT', 'OFFICETEL', 'VILLA'];

  // 필터링된 매물 목록
  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDistrict = !selectedDistrict || property.district === selectedDistrict;
    const matchesType = !selectedType || property.buildingType === selectedType;

    return matchesSearch && matchesDistrict && matchesType;
  });

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
    return `${eok}억 ${man > 0 ? man + '만' : ''}`;
  };

  // priceDisplay 우선 사용하는 가격 표시
  const getDisplayPrice = (property: Property) => {
    if (property.priceDisplay) {
      return property.priceDisplay;
    }
    return formatPrice(property.basePrice);
  };

  const formatDate = (date: unknown) => {
    if (!date) return '-';

    let d: Date;

    // superjson DateTime 형식 처리
    if (typeof date === 'object' && date !== null && '$type' in date && 'value' in date) {
      d = new Date((date as { value: string }).value);
    } else if (typeof date === 'string') {
      d = new Date(date);
    } else if (date instanceof Date) {
      d = date;
    } else {
      return '-';
    }

    if (isNaN(d.getTime())) return '-';
    return `${d.getFullYear()}년 ${d.getMonth() + 1}월`;
  };

  return (
    <>
      <Navigation />
      <main className="relative min-h-screen">
        <ParticlesBackground />

        {/* 페이지 헤더 */}
        <section className="relative pt-20 pb-12">
          <div className="container mx-auto px-6">
            <motion.div
              className="max-w-4xl mx-auto text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-blue-500/20 border border-blue-400/30 mb-6 backdrop-blur-sm">
                <Building2 className="w-5 h-5 text-blue-300" />
                <span className="text-blue-200 font-semibold text-sm">분양권 전문 플랫폼</span>
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent">
                  전국 분양권 매물
                </span>
              </h1>

              <p className="text-lg text-gray-300 leading-relaxed">
                AI 분석과 블록체인 기술로 검증된 분양권 투자 기회를 찾아보세요
              </p>
            </motion.div>

            {/* 검색 및 필터 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <GlassCard className="p-6 mb-8">
                <div className="flex flex-col lg:flex-row gap-4">
                  {/* 검색창 */}
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="단지명 또는 지역으로 검색..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-blue-400/50 focus:outline-none transition-colors"
                    />
                  </div>

                  {/* 필터 */}
                  <div className="flex gap-4">
                    <select
                      value={selectedDistrict}
                      onChange={(e) => setSelectedDistrict(e.target.value)}
                      className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:border-blue-400/50 focus:outline-none"
                    >
                      <option value="">전체 지역</option>
                      {districts.map(district => (
                        <option key={district} value={district} className="text-black">
                          {district}
                        </option>
                      ))}
                    </select>

                    <select
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:border-blue-400/50 focus:outline-none"
                    >
                      <option value="">전체 타입</option>
                      <option value="APARTMENT" className="text-black">아파트</option>
                      <option value="OFFICETEL" className="text-black">오피스텔</option>
                      <option value="VILLA" className="text-black">빌라</option>
                    </select>

                    {/* 뷰 모드 전환 */}
                    <div className="flex rounded-xl border border-white/20 overflow-hidden">
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`p-3 transition-colors ${viewMode === 'grid' ? 'bg-blue-500/30 text-blue-300' : 'text-gray-400 hover:text-white'}`}
                      >
                        <Grid3x3 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={`p-3 transition-colors ${viewMode === 'list' ? 'bg-blue-500/30 text-blue-300' : 'text-gray-400 hover:text-white'}`}
                      >
                        <List className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </section>

        {/* 매물 목록 */}
        <section className="relative pb-20">
          <div className="container mx-auto px-6">
            {/* 결과 요약 */}
            <div className="flex justify-between items-center mb-8">
              <p className="text-gray-300">
                총 <span className="text-white font-semibold">{totalCount}</span>개의 매물 중
                <span className="text-blue-400 font-semibold ml-1">{filteredProperties.length}</span>개 표시
              </p>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:border-blue-400/50 focus:outline-none"
              >
                <option value="latest" className="text-black">최신순</option>
                <option value="price-low" className="text-black">가격 낮은순</option>
                <option value="price-high" className="text-black">가격 높은순</option>
                <option value="profit-high" className="text-black">수익률 높은순</option>
              </select>
            </div>

            {/* 로딩 상태 */}
            {loading && (
              <div className="text-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
                <p className="text-gray-400">매물을 불러오는 중...</p>
              </div>
            )}

            {/* 매물 카드 */}
            {!loading && (
              <div className={`grid gap-8 ${viewMode === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                {filteredProperties.map((property, index) => (
                  <motion.div
                    key={property.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <GlassCard
                      className={`overflow-hidden cursor-pointer group ${property.featured ? 'ring-2 ring-blue-400/50' : ''}`}
                      hover
                      glow={property.featured}
                    >
                      {/* 이미지 */}
                      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-500/20 to-purple-500/20">
                        {property.featured && (
                          <div className="absolute top-4 left-4 px-3 py-1 bg-blue-500 text-white text-xs font-semibold rounded-full z-10">
                            추천매물
                          </div>
                        )}
                        {property.images && property.images.length > 0 ? (
                          <Image
                            src={property.images[0].url}
                            alt={property.images[0].alt || property.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            unoptimized={property.images[0].url.startsWith('http')}
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Building2 className="w-16 h-16 text-white/30" />
                          </div>
                        )}
                      </div>

                      {/* 콘텐츠 */}
                      <div className="p-6">
                        <div className="mb-4">
                          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
                            {property.title}
                          </h3>
                          <div className="flex items-center gap-2 text-gray-400 mb-2">
                            <MapPin className="w-4 h-4" />
                            <span className="text-sm">{property.address}</span>
                          </div>
                          <p className="text-sm text-gray-400">{property.developer.name}</p>
                        </div>

                        <div className="space-y-3 mb-6">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">분양가</span>
                            <span className="text-white font-semibold">{getDisplayPrice(property)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">입주예정</span>
                            <span className="text-white font-semibold">{formatDate(property.moveInDate)}</span>
                          </div>
                          {property.constructor && (
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-400">시공사</span>
                              <span className="text-blue-400 font-semibold">
                                {property.constructor}
                              </span>
                            </div>
                          )}
                          {property.keyFeature && (
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-400">특장점</span>
                              <span className="text-green-400 font-semibold flex items-center gap-1">
                                <TrendingUp className="w-3 h-3" />
                                {property.keyFeature}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <Link href={`/properties/${property.id}`} className="flex-1">
                            <button className="w-full px-4 py-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-colors text-sm font-medium">
                              상세보기
                            </button>
                          </Link>
                          <button className="px-3 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors">
                            <Calculator className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </GlassCard>
                  </motion.div>
                ))}
              </div>
            )}

            {!loading && filteredProperties.length === 0 && (
              <div className="text-center py-20">
                <Building2 className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">검색 조건에 맞는 매물이 없습니다.</p>
              </div>
            )}

            {/* 페이지네이션 */}
            {!loading && totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-center items-center gap-2 mt-12"
              >
                {/* 이전 버튼 */}
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className={`p-3 rounded-xl border transition-all ${
                    currentPage === 1
                      ? 'border-white/10 text-gray-600 cursor-not-allowed'
                      : 'border-white/20 text-white hover:bg-white/10 hover:border-blue-400/50'
                  }`}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {/* 페이지 번호 */}
                <div className="flex gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-10 h-10 rounded-xl font-semibold transition-all ${
                        currentPage === pageNum
                          ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/30'
                          : 'border border-white/20 text-gray-400 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}
                </div>

                {/* 다음 버튼 */}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className={`p-3 rounded-xl border transition-all ${
                    currentPage === totalPages
                      ? 'border-white/10 text-gray-600 cursor-not-allowed'
                      : 'border-white/20 text-white hover:bg-white/10 hover:border-blue-400/50'
                  }`}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </motion.div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}