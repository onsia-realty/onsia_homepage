'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Search, Calendar, Building2, MapPin, Users,
  ChevronLeft, ChevronRight, ExternalLink, Clock,
  CheckCircle, AlertCircle, XCircle
} from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { GlassCard } from '@/components/ui/GlassCard';
import { ParticlesBackground } from '@/components/ParticlesBackground';
import Link from 'next/link';

interface SubscriptionProperty {
  HOUSE_MANAGE_NO: string;
  PBLANC_NO: string;
  HOUSE_NM: string;
  HOUSE_SECD_NM: string;
  HOUSE_DTL_SECD_NM: string;
  HSSPLY_ADRES: string;
  TOT_SUPLY_HSHLDCO: number;
  RCRIT_PBLANC_DE: string;
  RCEPT_BGNDE: string;
  RCEPT_ENDDE: string;
  PRZWNER_PRESNATN_DE: string;
  CNTRCT_CNCLS_BGNDE: string;
  CNTRCT_CNCLS_ENDDE: string;
  SUBSCRPT_AREA_CODE_NM: string;
  CNSTRCT_ENTRPS_NM: string;
  PBLANC_URL: string;
  HMPG_ADRES: string;
  status: 'upcoming' | 'open' | 'closed';
  statusText: string;
  dDay: number | null;
}

interface SubscriptionStats {
  total: number;
  upcoming: number;
  open: number;
  closed: number;
}

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<SubscriptionProperty[]>([]);
  const [stats, setStats] = useState<SubscriptionStats>({ total: 0, upcoming: 0, open: 0, closed: 0 });
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedType, setSelectedType] = useState('');

  const ITEMS_PER_PAGE = 12;

  const regions = ['서울', '경기', '인천', '부산', '대구', '광주', '대전', '울산', '세종', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주'];

  // 주간 캘린더 데이터 생성
  const getWeekDates = () => {
    const today = new Date();
    const dates = [];
    for (let i = -1; i < 6; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const weekDates = getWeekDates();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // API에서 청약 데이터 가져오기
  useEffect(() => {
    const fetchSubscriptions = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: currentPage.toString(),
          perPage: ITEMS_PER_PAGE.toString(),
        });

        if (selectedRegion) params.append('region', selectedRegion);
        if (selectedStatus) params.append('status', selectedStatus);
        if (selectedType) params.append('type', selectedType);

        const response = await fetch(`/api/subscriptions?${params}`);
        const data = await response.json();

        if (data.data) {
          setSubscriptions(data.data);
          setStats(data.stats);
          setTotalPages(data.pagination.totalPages);
        }
      } catch (error) {
        console.error('Failed to fetch subscriptions:', error);
        setSubscriptions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, [currentPage, selectedRegion, selectedStatus, selectedType]);

  // 필터링
  const filteredSubscriptions = subscriptions.filter(sub => {
    const matchesSearch = sub.HOUSE_NM.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sub.HSSPLY_ADRES.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  const formatFullDate = (dateStr: string) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
  };

  const getDayName = (date: Date) => {
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    return days[date.getDay()];
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'upcoming':
        return <Clock className="w-4 h-4 text-yellow-400" />;
      case 'closed':
        return <XCircle className="w-4 h-4 text-gray-400" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'upcoming':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'closed':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <>
      <Navigation />
      <main className="relative min-h-screen">
        <ParticlesBackground />

        {/* 페이지 헤더 */}
        <section className="relative pt-20 pb-8">
          <div className="container mx-auto px-6">
            <motion.div
              className="max-w-4xl mx-auto text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-cyan-500/20 border border-cyan-400/30 mb-6 backdrop-blur-sm">
                <Calendar className="w-5 h-5 text-cyan-300" />
                <span className="text-cyan-200 font-semibold text-sm">청약홈 연동</span>
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-cyan-400 via-blue-300 to-cyan-500 bg-clip-text text-transparent">
                  전국 청약 매물
                </span>
              </h1>

              <p className="text-lg text-gray-300 leading-relaxed">
                청약홈 공공데이터 API를 통해 실시간 청약 정보를 확인하세요
              </p>
            </motion.div>
          </div>
        </section>

        {/* 두인경매 스타일 캘린더 + 현황 섹션 */}
        <section className="relative pb-8">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              <GlassCard className="p-6 mb-8">
                {/* 주간 캘린더 */}
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-cyan-400" />
                    청약 일정
                  </h3>
                  <div className="text-sm text-gray-400">
                    {new Date().getFullYear()}년 {new Date().getMonth() + 1}월
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-2 mb-6">
                  {weekDates.map((date, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedDate(date)}
                      className={`p-3 rounded-xl text-center transition-all ${
                        isToday(date)
                          ? 'bg-cyan-500/30 border-2 border-cyan-400'
                          : selectedDate.toDateString() === date.toDateString()
                          ? 'bg-blue-500/20 border border-blue-400/50'
                          : 'bg-white/5 border border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <div className={`text-xs mb-1 ${isToday(date) ? 'text-cyan-300' : 'text-gray-400'}`}>
                        {getDayName(date)}
                      </div>
                      <div className={`text-lg font-bold ${isToday(date) ? 'text-white' : 'text-gray-300'}`}>
                        {date.getDate()}
                      </div>
                      {isToday(date) && (
                        <div className="text-xs text-cyan-400 mt-1">오늘</div>
                      )}
                    </button>
                  ))}
                </div>

                {/* 오늘의 현황 */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white/5 rounded-xl p-4 text-center">
                    <div className="text-3xl font-bold text-white mb-1">{stats.total}</div>
                    <div className="text-sm text-gray-400">전체</div>
                  </div>
                  <div className="bg-yellow-500/10 rounded-xl p-4 text-center border border-yellow-500/20">
                    <div className="text-3xl font-bold text-yellow-400 mb-1">{stats.upcoming}</div>
                    <div className="text-sm text-yellow-300/70">접수예정</div>
                  </div>
                  <div className="bg-green-500/10 rounded-xl p-4 text-center border border-green-500/20">
                    <div className="text-3xl font-bold text-green-400 mb-1">{stats.open}</div>
                    <div className="text-sm text-green-300/70">접수중</div>
                  </div>
                  <div className="bg-gray-500/10 rounded-xl p-4 text-center border border-gray-500/20">
                    <div className="text-3xl font-bold text-gray-400 mb-1">{stats.closed}</div>
                    <div className="text-sm text-gray-400/70">접수마감</div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </section>

        {/* 종목별 청약홈 매물 섹션 */}
        <section className="relative pb-8">
          <div className="container mx-auto px-6">
            <motion.div
              className="max-w-4xl mx-auto text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-orange-500/20 border border-orange-400/30 mb-8 backdrop-blur-sm">
                <Building2 className="w-5 h-5 text-orange-300" />
                <span className="text-orange-200 font-semibold text-sm">실시간 청약 정보</span>
              </div>

              <div className="mb-6">
                <div className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-wider mb-4">
                  <span className="text-white">SUBSCRIPTION</span>
                  <span className="text-orange-400 ml-3">info</span>
                </div>
                <h2 className="text-xl md:text-2xl font-bold mb-4">
                  <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500 bg-clip-text text-transparent">
                    청약홈 매물
                  </span>
                </h2>
              </div>

              <p className="text-lg text-gray-300 leading-relaxed mb-8">
                공공데이터 API를 통해 실시간으로 제공되는 청약 정보입니다.
              </p>

              {/* 필터 버튼 */}
              <div className="flex flex-wrap justify-center gap-3">
                <button
                  onClick={() => setSelectedStatus('')}
                  className={`px-6 py-3 rounded-full font-semibold text-sm transition-all duration-300 ${
                    selectedStatus === ''
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/30'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white border border-white/10'
                  }`}
                >
                  전체
                </button>
                <button
                  onClick={() => setSelectedStatus('upcoming')}
                  className={`px-6 py-3 rounded-full font-semibold text-sm transition-all duration-300 ${
                    selectedStatus === 'upcoming'
                      ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-white shadow-lg shadow-yellow-500/30'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white border border-white/10'
                  }`}
                >
                  접수예정
                </button>
                <button
                  onClick={() => setSelectedStatus('open')}
                  className={`px-6 py-3 rounded-full font-semibold text-sm transition-all duration-300 ${
                    selectedStatus === 'open'
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/30'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white border border-white/10'
                  }`}
                >
                  접수중
                </button>
                <button
                  onClick={() => setSelectedStatus('closed')}
                  className={`px-6 py-3 rounded-full font-semibold text-sm transition-all duration-300 ${
                    selectedStatus === 'closed'
                      ? 'bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-lg shadow-gray-500/30'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white border border-white/10'
                  }`}
                >
                  접수마감
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* 검색 및 필터 */}
        <section className="relative pb-8">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
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
                      className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-cyan-400/50 focus:outline-none transition-colors"
                    />
                  </div>

                  {/* 지역 필터 */}
                  <select
                    value={selectedRegion}
                    onChange={(e) => {
                      setSelectedRegion(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:border-cyan-400/50 focus:outline-none"
                  >
                    <option value="">전체 지역</option>
                    {regions.map(region => (
                      <option key={region} value={region} className="text-black">
                        {region}
                      </option>
                    ))}
                  </select>

                  {/* 유형 필터 */}
                  <select
                    value={selectedType}
                    onChange={(e) => {
                      setSelectedType(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:border-cyan-400/50 focus:outline-none"
                  >
                    <option value="">전체 유형</option>
                    <option value="apt" className="text-black">아파트</option>
                    <option value="officetel" className="text-black">오피스텔</option>
                    <option value="remndr" className="text-black">무순위/잔여</option>
                  </select>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </section>

        {/* 청약 매물 목록 */}
        <section className="relative pb-20">
          <div className="container mx-auto px-6">
            {/* 결과 요약 */}
            <div className="flex justify-between items-center mb-8">
              <p className="text-gray-300">
                총 <span className="text-white font-semibold">{stats.total}</span>개의 청약 중
                <span className="text-cyan-400 font-semibold ml-1">{filteredSubscriptions.length}</span>개 표시
              </p>
            </div>

            {/* 로딩 상태 */}
            {loading && (
              <div className="text-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
                <p className="text-gray-400">청약 정보를 불러오는 중...</p>
              </div>
            )}

            {/* 청약 카드 */}
            {!loading && (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredSubscriptions.map((sub, index) => (
                  <motion.div
                    key={sub.HOUSE_MANAGE_NO}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.05 }}
                  >
                    <GlassCard className="overflow-hidden h-full" hover glow={sub.status === 'open'}>
                      {/* 상단 배지 */}
                      <div className="p-4 border-b border-white/10">
                        <div className="flex items-center justify-between mb-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(sub.status)}`}>
                            {sub.statusText}
                          </span>
                          {sub.dDay !== null && (
                            <span className={`text-sm font-bold ${sub.status === 'open' ? 'text-green-400' : 'text-yellow-400'}`}>
                              D{sub.dDay > 0 ? `-${sub.dDay}` : sub.dDay === 0 ? '-Day' : `+${Math.abs(sub.dDay)}`}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-400">
                          {sub.HOUSE_SECD_NM} · {sub.HOUSE_DTL_SECD_NM}
                        </div>
                      </div>

                      {/* 콘텐츠 */}
                      <div className="p-4">
                        <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">
                          {sub.HOUSE_NM}
                        </h3>

                        <div className="flex items-center gap-2 text-gray-400 mb-4">
                          <MapPin className="w-4 h-4 flex-shrink-0" />
                          <span className="text-sm line-clamp-1">{sub.SUBSCRPT_AREA_CODE_NM}</span>
                        </div>

                        <div className="space-y-2 text-sm mb-4">
                          <div className="flex justify-between">
                            <span className="text-gray-400">청약접수</span>
                            <span className="text-white">
                              {formatDate(sub.RCEPT_BGNDE)} ~ {formatDate(sub.RCEPT_ENDDE)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">당첨발표</span>
                            <span className="text-white">{formatFullDate(sub.PRZWNER_PRESNATN_DE)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">총 세대</span>
                            <span className="text-cyan-400 font-semibold">
                              {sub.TOT_SUPLY_HSHLDCO?.toLocaleString() || '-'}세대
                            </span>
                          </div>
                          {sub.CNSTRCT_ENTRPS_NM && (
                            <div className="flex justify-between">
                              <span className="text-gray-400">시공사</span>
                              <span className="text-blue-400 text-xs line-clamp-1">
                                {sub.CNSTRCT_ENTRPS_NM}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* 버튼 */}
                        <a
                          href={sub.PBLANC_URL || sub.HMPG_ADRES}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full px-4 py-2.5 bg-cyan-500/20 text-cyan-300 rounded-lg hover:bg-cyan-500/30 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                        >
                          <ExternalLink className="w-4 h-4" />
                          청약홈에서 보기
                        </a>
                      </div>
                    </GlassCard>
                  </motion.div>
                ))}
              </div>
            )}

            {!loading && filteredSubscriptions.length === 0 && (
              <div className="text-center py-20">
                <Building2 className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">검색 조건에 맞는 청약이 없습니다.</p>
              </div>
            )}

            {/* 페이지네이션 */}
            {!loading && totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-center items-center gap-2 mt-12"
              >
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className={`p-3 rounded-xl border transition-all ${
                    currentPage === 1
                      ? 'border-white/10 text-gray-600 cursor-not-allowed'
                      : 'border-white/20 text-white hover:bg-white/10 hover:border-cyan-400/50'
                  }`}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <div className="flex gap-2">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-10 h-10 rounded-xl font-semibold transition-all ${
                          currentPage === pageNum
                            ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/30'
                            : 'border border-white/20 text-gray-400 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className={`p-3 rounded-xl border transition-all ${
                    currentPage === totalPages
                      ? 'border-white/10 text-gray-600 cursor-not-allowed'
                      : 'border-white/20 text-white hover:bg-white/10 hover:border-cyan-400/50'
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
