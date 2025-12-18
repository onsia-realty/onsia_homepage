'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Gavel, MapPin, Building, X, ChevronDown } from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { GlassCard } from '@/components/ui/GlassCard';
import { AuctionCard } from '@/components/auction/AuctionCard';

interface AuctionItem {
  id: string;
  caseNumber: string;
  courtName: string | null;
  address: string;
  district: string;
  city: string;
  itemType: string;
  buildingArea: number | null;
  landArea: number | null;
  appraisalPrice: string;
  minimumPrice: string;
  minimumRate: number | null;
  saleDate: string | null;
  bidCount: number;
  status: string;
  hasRisk: boolean;
  referenceDate: string | null;
  images: Array<{ url: string; alt: string | null }>;
  _count?: {
    registers: number;
    tenants: number;
  };
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const cities = [
  { value: '', label: '전체 지역' },
  { value: '서울', label: '서울' },
  { value: '경기', label: '경기' },
  { value: '인천', label: '인천' },
  { value: '부산', label: '부산' },
  { value: '대구', label: '대구' },
  { value: '광주', label: '광주' },
  { value: '대전', label: '대전' },
  { value: '울산', label: '울산' },
  { value: '세종', label: '세종' },
  { value: '강원', label: '강원' },
  { value: '충북', label: '충북' },
  { value: '충남', label: '충남' },
  { value: '전북', label: '전북' },
  { value: '전남', label: '전남' },
  { value: '경북', label: '경북' },
  { value: '경남', label: '경남' },
  { value: '제주', label: '제주' },
];

const itemTypes = [
  { value: '', label: '전체 종류' },
  { value: 'APARTMENT', label: '아파트' },
  { value: 'VILLA', label: '빌라' },
  { value: 'OFFICETEL', label: '오피스텔' },
  { value: 'HOUSE', label: '단독주택' },
  { value: 'COMMERCIAL', label: '상가' },
  { value: 'LAND', label: '토지' },
  { value: 'FACTORY', label: '공장' },
  { value: 'BUILDING', label: '건물' },
];

const statuses = [
  { value: '', label: '전체 상태' },
  { value: 'SCHEDULED', label: '매각예정' },
  { value: 'BIDDING', label: '입찰중' },
  { value: 'SUCCESSFUL', label: '낙찰' },
  { value: 'FAILED', label: '유찰' },
];

export default function AuctionsPage() {
  const [items, setItems] = useState<AuctionItem[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);

  // 필터 상태
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('');
  const [itemType, setItemType] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);

  const [showFilters, setShowFilters] = useState(false);

  const fetchAuctions = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', page.toString());
      params.set('limit', '12');
      if (search) params.set('search', search);
      if (city) params.set('city', city);
      if (itemType) params.set('itemType', itemType);
      if (status) params.set('status', status);

      const response = await fetch(`/api/auctions-supabase?${params.toString()}`);
      const data = await response.json();

      setItems(data.items || []);
      setPagination(data.pagination || null);
    } catch (error) {
      console.error('Failed to fetch auctions:', error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [page, search, city, itemType, status]);

  useEffect(() => {
    fetchAuctions();
  }, [fetchAuctions]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchAuctions();
  };

  const clearFilters = () => {
    setSearch('');
    setCity('');
    setItemType('');
    setStatus('');
    setPage(1);
  };

  const hasActiveFilters = search || city || itemType || status;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Navigation />

      {/* 히어로 섹션 */}
      <section className="relative pt-8 pb-12 px-6">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/20 border border-blue-500/30 mb-4">
              <Gavel className="w-5 h-5 text-blue-400" />
              <span className="text-blue-300 font-medium">법원경매</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
              법원경매 물건
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              전국 법원경매 물건을 한눈에 확인하세요. 권리분석과 시세 정보를 제공합니다.
            </p>
          </motion.div>

          {/* 검색/필터 섹션 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <GlassCard className="p-4 md:p-6">
              <form onSubmit={handleSearch}>
                {/* 검색바 */}
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="주소, 사건번호, 법원명으로 검색"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white hover:bg-white/20 transition-colors md:hidden"
                  >
                    <Filter className="w-5 h-5" />
                    필터
                    <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl transition-colors"
                  >
                    검색
                  </button>
                </div>

                {/* 필터 옵션 */}
                <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 ${showFilters ? 'block' : 'hidden md:grid'}`}>
                  <select
                    value={city}
                    onChange={(e) => { setCity(e.target.value); setPage(1); }}
                    className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 [&>option]:bg-slate-800"
                  >
                    {cities.map((c) => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>

                  <select
                    value={itemType}
                    onChange={(e) => { setItemType(e.target.value); setPage(1); }}
                    className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 [&>option]:bg-slate-800"
                  >
                    {itemTypes.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>

                  <select
                    value={status}
                    onChange={(e) => { setStatus(e.target.value); setPage(1); }}
                    className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 [&>option]:bg-slate-800"
                  >
                    {statuses.map((s) => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>

                {/* 활성 필터 표시 */}
                {hasActiveFilters && (
                  <div className="flex items-center gap-2 mt-4 flex-wrap">
                    <span className="text-sm text-gray-400">활성 필터:</span>
                    {search && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-500/20 text-blue-300 rounded-lg text-sm">
                        &quot;{search}&quot;
                        <button onClick={() => setSearch('')} className="hover:text-white">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                    {city && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-500/20 text-blue-300 rounded-lg text-sm">
                        {cities.find(c => c.value === city)?.label}
                        <button onClick={() => setCity('')} className="hover:text-white">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                    {itemType && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-500/20 text-blue-300 rounded-lg text-sm">
                        {itemTypes.find(t => t.value === itemType)?.label}
                        <button onClick={() => setItemType('')} className="hover:text-white">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                    {status && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-500/20 text-blue-300 rounded-lg text-sm">
                        {statuses.find(s => s.value === status)?.label}
                        <button onClick={() => setStatus('')} className="hover:text-white">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                    <button
                      onClick={clearFilters}
                      className="text-sm text-gray-400 hover:text-white underline"
                    >
                      전체 초기화
                    </button>
                  </div>
                )}
              </form>
            </GlassCard>
          </motion.div>
        </div>
      </section>

      {/* 목록 섹션 */}
      <section className="px-6 pb-16">
        <div className="container mx-auto">
          {/* 결과 요약 */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-400">
              {pagination ? (
                <>
                  총 <span className="text-white font-medium">{pagination.total}</span>건의 물건
                </>
              ) : (
                '검색 중...'
              )}
            </p>
          </div>

          {/* 로딩 상태 */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <GlassCard className="h-[400px]">
                    <div className="h-48 bg-white/10 rounded-t-xl" />
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-white/10 rounded w-1/2" />
                      <div className="h-4 bg-white/10 rounded w-3/4" />
                      <div className="h-4 bg-white/10 rounded w-full" />
                      <div className="h-8 bg-white/10 rounded w-2/3 mt-4" />
                    </div>
                  </GlassCard>
                </div>
              ))}
            </div>
          ) : items.length === 0 ? (
            /* 빈 상태 */
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <GlassCard className="max-w-md mx-auto p-8">
                <Gavel className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">
                  등록된 경매 물건이 없습니다
                </h3>
                <p className="text-gray-400 mb-4">
                  {hasActiveFilters
                    ? '검색 조건을 변경해 보세요.'
                    : '곧 새로운 물건이 등록될 예정입니다.'}
                </p>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                  >
                    필터 초기화
                  </button>
                )}
              </GlassCard>
            </motion.div>
          ) : (
            /* 물건 그리드 */
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {items.map((item, index) => (
                  <AuctionCard key={item.id} item={item} index={index} />
                ))}
              </div>

              {/* 페이지네이션 */}
              {pagination && pagination.totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-colors"
                  >
                    이전
                  </button>

                  <div className="flex items-center gap-1">
                    {[...Array(pagination.totalPages)].map((_, i) => {
                      const pageNum = i + 1;
                      // 현재 페이지 주변만 표시
                      if (
                        pageNum === 1 ||
                        pageNum === pagination.totalPages ||
                        (pageNum >= page - 2 && pageNum <= page + 2)
                      ) {
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setPage(pageNum)}
                            className={`w-10 h-10 rounded-lg transition-colors ${
                              page === pageNum
                                ? 'bg-blue-500 text-white'
                                : 'bg-white/10 text-white hover:bg-white/20'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      } else if (pageNum === page - 3 || pageNum === page + 3) {
                        return <span key={pageNum} className="text-gray-400 px-1">...</span>;
                      }
                      return null;
                    })}
                  </div>

                  <button
                    onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                    disabled={page === pagination.totalPages}
                    className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-colors"
                  >
                    다음
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
