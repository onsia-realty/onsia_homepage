'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Search, ChevronRight, ChevronLeft, ChevronDown,
  MapPin, Gavel, BarChart3, TrendingUp, TrendingDown,
  SlidersHorizontal, X, Building2, Sparkles, Calendar,
  Home, Layers, RefreshCw, ExternalLink, Info
} from 'lucide-react';
import KakaoMap from '@/components/map/KakaoMap';
import { getSidoList, getSigunguList } from '@/lib/lawd-codes';

// 서울 구별 좌표
const DISTRICT_COORDS: Record<string, { lat: number; lng: number }> = {
  '강남구': { lat: 37.5172, lng: 127.0473 },
  '강동구': { lat: 37.5301, lng: 127.1238 },
  '강북구': { lat: 37.6396, lng: 127.0257 },
  '강서구': { lat: 37.5509, lng: 126.8495 },
  '관악구': { lat: 37.4784, lng: 126.9516 },
  '광진구': { lat: 37.5385, lng: 127.0823 },
  '구로구': { lat: 37.4954, lng: 126.8874 },
  '금천구': { lat: 37.4519, lng: 126.9020 },
  '노원구': { lat: 37.6542, lng: 127.0568 },
  '도봉구': { lat: 37.6688, lng: 127.0471 },
  '동대문구': { lat: 37.5744, lng: 127.0400 },
  '동작구': { lat: 37.5124, lng: 126.9393 },
  '마포구': { lat: 37.5663, lng: 126.9014 },
  '서대문구': { lat: 37.5791, lng: 126.9368 },
  '서초구': { lat: 37.4837, lng: 127.0324 },
  '성동구': { lat: 37.5633, lng: 127.0371 },
  '성북구': { lat: 37.5894, lng: 127.0167 },
  '송파구': { lat: 37.5145, lng: 127.1066 },
  '양천구': { lat: 37.5270, lng: 126.8561 },
  '영등포구': { lat: 37.5264, lng: 126.8963 },
  '용산구': { lat: 37.5324, lng: 126.9906 },
  '은평구': { lat: 37.6027, lng: 126.9291 },
  '종로구': { lat: 37.5735, lng: 126.9790 },
  '중구': { lat: 37.5641, lng: 126.9979 },
  '중랑구': { lat: 37.6066, lng: 127.0928 },
};

interface Transaction {
  id: string;
  buildingName: string;
  dong: string;
  area: number;
  pyeong: number;
  floor: string;
  price: number;
  priceFormatted: string;
  pricePerPyeong: number;
  pricePerPyeongFormatted: string;
  dealDate: string;
  buildYear: string;
  lat: number;
  lng: number;
}

interface Stats {
  avgPrice: number;
  avgPricePerPyeong: number;
  maxPrice: number;
  minPrice: number;
  totalCount: number;
  avgPriceFormatted: string;
  avgPricePerPyeongFormatted: string;
  maxPriceFormatted: string;
  minPriceFormatted: string;
}

interface ApartmentGroup {
  name: string;
  transactions: Transaction[];
  avgPrice: number;
  avgPriceFormatted: string;
  minPrice: number;
  maxPrice: number;
  count: number;
  buildYear?: string;
  dong?: string;
  lat: number;
  lng: number;
  mainPyeong?: number;
}

export default function MarketPage() {
  // 지역
  const [sido, setSido] = useState('서울특별시');
  const [sigungu, setSigungu] = useState('강남구');
  const [sigunguList, setSigunguList] = useState<string[]>([]);

  // 검색/필터
  const [searchQuery, setSearchQuery] = useState('');
  const [propertyType, setPropertyType] = useState('아파트');
  const [months, setMonths] = useState(3);
  const [sortBy, setSortBy] = useState<'price' | 'name' | 'count'>('price');

  // 지도
  const [mapCenter, setMapCenter] = useState({ lat: 37.5172, lng: 127.0473 });
  const [mapLevel, setMapLevel] = useState(5);

  // 데이터
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // UI 상태
  const [showPanel, setShowPanel] = useState(true);
  const [selectedApt, setSelectedApt] = useState<ApartmentGroup | null>(null);
  const [showLocationSelect, setShowLocationSelect] = useState(false);

  // 시/도 변경
  useEffect(() => {
    const list = getSigunguList(sido);
    setSigunguList(list);
    if (list.length > 0 && !list.includes(sigungu)) {
      setSigungu(list[0]);
    }
  }, [sido]);

  // 시/군/구 변경 시 지도 이동
  useEffect(() => {
    if (DISTRICT_COORDS[sigungu]) {
      setMapCenter(DISTRICT_COORDS[sigungu]);
      setMapLevel(5);
    }
    setSelectedApt(null);
  }, [sigungu]);

  // 데이터 로드
  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [transRes, statsRes] = await Promise.all([
        fetch(`/api/real-price?sido=${encodeURIComponent(sido)}&sigungu=${encodeURIComponent(sigungu)}&propertyType=${encodeURIComponent(propertyType)}&months=${months}`),
        fetch(`/api/real-price/stats?sido=${encodeURIComponent(sido)}&sigungu=${encodeURIComponent(sigungu)}&propertyType=${encodeURIComponent(propertyType)}&months=${months}`),
      ]);

      const transData = await transRes.json();
      const statsData = await statsRes.json();

      if (transData.success) {
        const baseCoord = DISTRICT_COORDS[sigungu] || { lat: 37.5172, lng: 127.0473 };
        const txs: Transaction[] = (transData.data?.transactions || []).map((tx: any, i: number) => ({
          ...tx,
          id: `tx-${i}`,
          lat: baseCoord.lat + (Math.random() - 0.5) * 0.018,
          lng: baseCoord.lng + (Math.random() - 0.5) * 0.018,
        }));
        setTransactions(txs);
      }

      if (statsData.success) {
        setStats(statsData.data?.stats || null);
      }
    } catch (e) {
      console.error('데이터 로드 실패:', e);
    } finally {
      setIsLoading(false);
    }
  }, [sido, sigungu, propertyType, months]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // 아파트별 그룹화
  const apartments = useMemo(() => {
    const map: Record<string, ApartmentGroup> = {};

    transactions.forEach((tx) => {
      if (!map[tx.buildingName]) {
        map[tx.buildingName] = {
          name: tx.buildingName,
          transactions: [],
          avgPrice: 0,
          avgPriceFormatted: '',
          minPrice: Infinity,
          maxPrice: 0,
          count: 0,
          buildYear: tx.buildYear,
          dong: tx.dong,
          lat: tx.lat,
          lng: tx.lng,
        };
      }
      map[tx.buildingName].transactions.push(tx);
      map[tx.buildingName].minPrice = Math.min(map[tx.buildingName].minPrice, tx.price);
      map[tx.buildingName].maxPrice = Math.max(map[tx.buildingName].maxPrice, tx.price);
    });

    return Object.values(map)
      .map((apt) => {
        const total = apt.transactions.reduce((s, t) => s + t.price, 0);
        apt.avgPrice = total / apt.transactions.length;
        apt.avgPriceFormatted = formatPrice(apt.avgPrice);
        apt.count = apt.transactions.length;
        apt.mainPyeong = apt.transactions[0]?.pyeong;
        return apt;
      })
      .filter((apt) => !searchQuery || apt.name.includes(searchQuery))
      .sort((a, b) => {
        if (sortBy === 'price') return b.avgPrice - a.avgPrice;
        if (sortBy === 'count') return b.count - a.count;
        return a.name.localeCompare(b.name);
      });
  }, [transactions, searchQuery, sortBy]);

  // 마커 생성
  const markers = useMemo(() => {
    return apartments.slice(0, 60).map((apt) => ({
      id: apt.name,
      lat: apt.lat,
      lng: apt.lng,
      type: 'apartment' as const,
      title: apt.name,
      price: apt.avgPriceFormatted,
      info: apt.mainPyeong ? `${apt.mainPyeong}평` : undefined,
    }));
  }, [apartments]);

  function formatPrice(price: number): string {
    if (price >= 100000000) {
      const uk = Math.floor(price / 100000000);
      const man = Math.floor((price % 100000000) / 10000);
      return man > 0 ? `${uk}억${man > 999 ? Math.round(man / 1000) + '천' : ''}` : `${uk}억`;
    }
    return `${Math.floor(price / 10000).toLocaleString()}만`;
  }

  const shortSido = sido.replace('특별시', '').replace('광역시', '').replace('도', '');

  return (
    <div className="h-screen bg-slate-950 flex flex-col overflow-hidden">
      {/* 상단 바 */}
      <header className="flex-shrink-0 h-14 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-cyan-500/20 flex items-center px-4 gap-4 z-50">
        {/* 로고 */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-white hidden sm:block">온시아</span>
        </Link>

        <div className="w-px h-6 bg-white/10" />

        {/* 지역 선택 */}
        <button
          onClick={() => setShowLocationSelect(!showLocationSelect)}
          className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-white/10 rounded-lg transition-colors"
        >
          <MapPin className="w-4 h-4 text-cyan-400" />
          <span className="text-white font-medium">{shortSido}</span>
          <ChevronRight className="w-3 h-3 text-gray-500" />
          <span className="text-cyan-400 font-medium">{sigungu}</span>
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showLocationSelect ? 'rotate-180' : ''}`} />
        </button>

        {/* 기간 선택 */}
        <div className="hidden md:flex items-center bg-slate-800/50 rounded-lg p-0.5">
          {[1, 3, 6, 12].map((m) => (
            <button
              key={m}
              onClick={() => setMonths(m)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                months === m
                  ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {m === 12 ? '1년' : `${m}개월`}
            </button>
          ))}
        </div>

        <div className="flex-1" />

        {/* 통계 요약 */}
        {stats && (
          <div className="hidden lg:flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1.5">
              <span className="text-gray-500">평균</span>
              <span className="text-white font-bold">{stats.avgPriceFormatted}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-gray-500">평당</span>
              <span className="text-cyan-400 font-bold">{stats.avgPricePerPyeongFormatted}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-gray-500">거래</span>
              <span className="text-white font-bold">{stats.totalCount}건</span>
            </div>
          </div>
        )}

        {/* 경매 링크 */}
        <Link
          href={`/auctions?city=${encodeURIComponent(sido)}&district=${encodeURIComponent(sigungu)}`}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-red-500/20 to-orange-500/20 hover:from-red-500/30 hover:to-orange-500/30 border border-red-500/30 rounded-lg transition-all group"
        >
          <Gavel className="w-4 h-4 text-red-400" />
          <span className="text-red-400 text-sm font-medium">경매</span>
        </Link>
      </header>

      {/* 지역 선택 드롭다운 */}
      <AnimatePresence>
        {showLocationSelect && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-14 left-0 right-0 bg-slate-900/98 backdrop-blur-xl border-b border-cyan-500/20 z-40 p-4"
          >
            <div className="max-w-4xl mx-auto">
              <div className="flex gap-6">
                {/* 시/도 */}
                <div className="w-40">
                  <div className="text-xs text-gray-500 mb-2 font-medium">시/도</div>
                  <div className="space-y-1 max-h-64 overflow-y-auto">
                    {getSidoList().map((s) => (
                      <button
                        key={s}
                        onClick={() => setSido(s)}
                        className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${
                          sido === s
                            ? 'bg-cyan-500/20 text-cyan-400'
                            : 'text-gray-400 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        {s.replace('특별시', '').replace('광역시', '')}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 시/군/구 */}
                <div className="flex-1">
                  <div className="text-xs text-gray-500 mb-2 font-medium">시/군/구</div>
                  <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-1 max-h-64 overflow-y-auto">
                    {sigunguList.map((s) => (
                      <button
                        key={s}
                        onClick={() => {
                          setSigungu(s);
                          setShowLocationSelect(false);
                        }}
                        className={`px-3 py-2 rounded-lg text-sm transition-all ${
                          sigungu === s
                            ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30'
                            : 'text-gray-400 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 메인 영역 */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* 좌측 패널 */}
        <AnimatePresence>
          {showPanel && (
            <motion.aside
              initial={{ x: -320, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -320, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-80 flex-shrink-0 bg-slate-900/95 backdrop-blur-xl border-r border-white/5 flex flex-col z-30"
            >
              {/* 검색 */}
              <div className="p-3 border-b border-white/5">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    placeholder="아파트명 검색..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-white/5 rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all"
                  />
                </div>
              </div>

              {/* 정렬 */}
              <div className="px-3 py-2 border-b border-white/5 flex items-center justify-between">
                <div className="flex gap-1">
                  {[
                    { key: 'price', label: '가격순' },
                    { key: 'count', label: '거래순' },
                    { key: 'name', label: '이름순' },
                  ].map((opt) => (
                    <button
                      key={opt.key}
                      onClick={() => setSortBy(opt.key as typeof sortBy)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                        sortBy === opt.key
                          ? 'bg-cyan-500/20 text-cyan-400'
                          : 'text-gray-500 hover:text-white'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
                <span className="text-xs text-gray-600">{apartments.length}개</span>
              </div>

              {/* 목록 */}
              <div className="flex-1 overflow-y-auto">
                {isLoading ? (
                  <div className="flex items-center justify-center py-20">
                    <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : apartments.length === 0 ? (
                  <div className="text-center py-20 text-gray-600">
                    <Building2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>거래 내역이 없습니다</p>
                  </div>
                ) : (
                  apartments.map((apt) => (
                    <button
                      key={apt.name}
                      onClick={() => {
                        setSelectedApt(apt);
                        setMapCenter({ lat: apt.lat, lng: apt.lng });
                        setMapLevel(3);
                      }}
                      className={`w-full p-4 text-left border-b border-white/5 hover:bg-white/5 transition-all ${
                        selectedApt?.name === apt.name ? 'bg-cyan-500/10 border-l-2 border-l-cyan-500' : ''
                      }`}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-white truncate">{apt.name}</div>
                          <div className="text-xs text-gray-500 mt-1">
                            {apt.buildYear && <span>{apt.buildYear}년</span>}
                            {apt.dong && <span> · {apt.dong}</span>}
                            <span> · {apt.count}건</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-cyan-400 font-bold">{apt.avgPriceFormatted}</div>
                          {apt.mainPyeong && (
                            <div className="text-[10px] text-gray-500">{apt.mainPyeong}평 기준</div>
                          )}
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* 패널 토글 */}
        <button
          onClick={() => setShowPanel(!showPanel)}
          className={`absolute top-4 z-40 bg-slate-800 hover:bg-slate-700 border border-white/10 p-2 rounded-r-lg transition-all ${
            showPanel ? 'left-80' : 'left-0'
          }`}
        >
          {showPanel ? (
            <ChevronLeft className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-400" />
          )}
        </button>

        {/* 지도 */}
        <div className="flex-1 relative">
          <KakaoMap
            center={mapCenter}
            level={mapLevel}
            markers={markers}
            onMarkerClick={(m) => {
              const apt = apartments.find((a) => a.name === m.id);
              if (apt) setSelectedApt(apt);
            }}
            className="w-full h-full"
          />

          {/* 로딩 */}
          {isLoading && (
            <div className="absolute inset-0 bg-slate-950/60 flex items-center justify-center z-10">
              <div className="bg-slate-800 px-6 py-4 rounded-2xl flex items-center gap-3 shadow-xl">
                <div className="w-5 h-5 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-white text-sm">불러오는 중...</span>
              </div>
            </div>
          )}

          {/* 하단 정보 */}
          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between pointer-events-none z-10">
            <div className="bg-slate-900/90 backdrop-blur-xl rounded-xl px-4 py-2 border border-white/10 pointer-events-auto">
              <div className="text-xs text-gray-500">
                {sigungu} {propertyType} · 최근 {months === 12 ? '1년' : `${months}개월`}
              </div>
              <div className="text-white font-medium">
                {apartments.length}개 단지 · {transactions.length}건 거래
              </div>
            </div>
          </div>
        </div>

        {/* 선택된 아파트 상세 */}
        <AnimatePresence>
          {selectedApt && (
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 100, opacity: 0 }}
              className="absolute right-4 top-4 bottom-20 w-80 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl z-20 flex flex-col overflow-hidden"
            >
              {/* 헤더 */}
              <div className="p-4 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-b border-white/5">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg text-white">{selectedApt.name}</h3>
                    <p className="text-sm text-gray-400 mt-1">
                      {sigungu} {selectedApt.dong}
                      {selectedApt.buildYear && ` · ${selectedApt.buildYear}년`}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedApt(null)}
                    className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>

                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-white">{selectedApt.avgPriceFormatted}</span>
                  <span className="text-gray-500 text-sm">평균</span>
                </div>

                <div className="mt-3 flex gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">최저 </span>
                    <span className="text-green-400 font-medium">{formatPrice(selectedApt.minPrice)}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">최고 </span>
                    <span className="text-red-400 font-medium">{formatPrice(selectedApt.maxPrice)}</span>
                  </div>
                </div>
              </div>

              {/* 거래 내역 */}
              <div className="flex-1 overflow-y-auto p-4">
                <div className="text-xs text-gray-500 mb-3 font-medium">
                  최근 거래 ({selectedApt.count}건)
                </div>
                <div className="space-y-2">
                  {selectedApt.transactions.slice(0, 10).map((tx, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center p-3 bg-slate-800/50 rounded-xl"
                    >
                      <div>
                        <div className="text-white font-medium">{tx.pyeong}평</div>
                        <div className="text-xs text-gray-500">
                          {tx.floor}층 · {tx.dealDate}
                        </div>
                      </div>
                      <div className="text-cyan-400 font-bold">{tx.priceFormatted}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 경매 유도 */}
              <div className="p-4 border-t border-white/5">
                <Link
                  href={`/auctions?keyword=${encodeURIComponent(selectedApt.name)}`}
                  className="flex items-center justify-between p-3 bg-gradient-to-r from-red-500/10 to-orange-500/10 hover:from-red-500/20 hover:to-orange-500/20 border border-red-500/20 rounded-xl transition-all group"
                >
                  <div className="flex items-center gap-2">
                    <Gavel className="w-4 h-4 text-red-400" />
                    <span className="text-white text-sm font-medium">이 단지 경매물건</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-red-400 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
