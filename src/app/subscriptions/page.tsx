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
  // 세부 일정 필드
  SPSPLY_RCEPT_BGNDE: string | null;
  GNRL_RNK1_CRSPAREA_RCPTDE: string | null;
  GNRL_RNK2_CRSPAREA_RCPTDE: string | null;
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

interface CalendarEvent {
  date: string;
  type: 'announcement' | 'application' | 'result' | 'special' | 'rank1' | 'rank2';
  title: string;
  houseName: string;
  subscription: SubscriptionProperty;
}

// 청약홈 URL 생성 함수
const getSubscriptionUrl = (sub: SubscriptionProperty): string => {
  // PBLANC_URL이 있고 유효한 URL인 경우 사용
  if (sub.PBLANC_URL && sub.PBLANC_URL.startsWith('http')) {
    return sub.PBLANC_URL;
  }
  // 기본 청약홈 상세 페이지 URL 생성 (가장 안정적)
  return `https://www.applyhome.co.kr/ai/aia/selectAPTLttotPblancDetail.do?houseManageNo=${sub.HOUSE_MANAGE_NO}&pblancNo=${sub.PBLANC_NO}`;
};

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
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<Date | null>(null);

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

          // 캘린더 이벤트 생성 (세부 일정 포함)
          const events: CalendarEvent[] = [];
          data.data.forEach((sub: SubscriptionProperty) => {
            if (sub.RCRIT_PBLANC_DE) {
              events.push({
                date: sub.RCRIT_PBLANC_DE,
                type: 'announcement',
                title: '공고',
                houseName: sub.HOUSE_NM,
                subscription: sub
              });
            }
            // 특별공급 일정
            if (sub.SPSPLY_RCEPT_BGNDE) {
              events.push({
                date: sub.SPSPLY_RCEPT_BGNDE,
                type: 'special',
                title: '특별공급',
                houseName: sub.HOUSE_NM,
                subscription: sub
              });
            }
            // 1순위 접수일
            if (sub.GNRL_RNK1_CRSPAREA_RCPTDE) {
              events.push({
                date: sub.GNRL_RNK1_CRSPAREA_RCPTDE,
                type: 'rank1',
                title: '1순위',
                houseName: sub.HOUSE_NM,
                subscription: sub
              });
            }
            // 2순위 접수일
            if (sub.GNRL_RNK2_CRSPAREA_RCPTDE) {
              events.push({
                date: sub.GNRL_RNK2_CRSPAREA_RCPTDE,
                type: 'rank2',
                title: '2순위',
                houseName: sub.HOUSE_NM,
                subscription: sub
              });
            }
            if (sub.PRZWNER_PRESNATN_DE) {
              events.push({
                date: sub.PRZWNER_PRESNATN_DE,
                type: 'result',
                title: '당첨발표',
                houseName: sub.HOUSE_NM,
                subscription: sub
              });
            }
          });
          setCalendarEvents(events);
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

  // 날짜별 이벤트 확인
  const getEventsForDate = (date: Date) => {
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    return calendarEvents.filter(e => e.date === dateStr);
  };

  // 선택된 날짜의 청약 매물 가져오기 (중복 제거 후 최대 4개)
  const getSubscriptionsForSelectedDate = () => {
    if (!selectedCalendarDate) return [];
    const events = getEventsForDate(selectedCalendarDate);
    const uniqueSubs = new Map<string, { sub: SubscriptionProperty; events: CalendarEvent[] }>();

    events.forEach(event => {
      const key = `${event.subscription.HOUSE_MANAGE_NO}-${event.subscription.PBLANC_NO}`;
      if (uniqueSubs.has(key)) {
        uniqueSubs.get(key)!.events.push(event);
      } else {
        uniqueSubs.set(key, { sub: event.subscription, events: [event] });
      }
    });

    return Array.from(uniqueSubs.values()).slice(0, 4);
  };

  const selectedDateSubscriptions = getSubscriptionsForSelectedDate();
  const selectedDateStr = selectedCalendarDate
    ? `${selectedCalendarDate.getFullYear()}년 ${selectedCalendarDate.getMonth() + 1}월 ${selectedCalendarDate.getDate()}일`
    : '';

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

        {/* 대형 청약 일정 안내판 */}
        <section className="relative pb-12">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              <GlassCard className="p-4 md:p-6 mb-8">
                {/* 캘린더 헤더 */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
                      <Calendar className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg md:text-xl font-bold text-white">청약 일정 안내</h2>
                      <p className="text-gray-400 text-xs">날짜를 클릭하면 해당일 청약 정보를 확인할 수 있습니다</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        const newDate = new Date(selectedDate);
                        newDate.setMonth(newDate.getMonth() - 1);
                        setSelectedDate(newDate);
                      }}
                      className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4 text-white" />
                    </button>
                    <div className="text-base font-bold text-white min-w-[110px] text-center">
                      {selectedDate.getFullYear()}년 {selectedDate.getMonth() + 1}월
                    </div>
                    <button
                      onClick={() => {
                        const newDate = new Date(selectedDate);
                        newDate.setMonth(newDate.getMonth() + 1);
                        setSelectedDate(newDate);
                      }}
                      className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                    >
                      <ChevronRight className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>

                {/* 요일 헤더 */}
                <div className="grid grid-cols-7 gap-1 mb-1">
                  {['일', '월', '화', '수', '목', '금', '토'].map((day, i) => (
                    <div key={day} className={`text-center py-1.5 text-xs font-bold ${
                      i === 0 ? 'text-red-400' : i === 6 ? 'text-blue-400' : 'text-gray-400'
                    }`}>
                      {day}
                    </div>
                  ))}
                </div>

                {/* 월간 캘린더 그리드 - 컴팩트 버전 */}
                <div className="grid grid-cols-7 gap-1 mb-4">
                  {(() => {
                    const year = selectedDate.getFullYear();
                    const month = selectedDate.getMonth();
                    const firstDay = new Date(year, month, 1);
                    const lastDay = new Date(year, month + 1, 0);
                    const daysInMonth = lastDay.getDate();
                    const startingDay = firstDay.getDay();
                    const today = new Date();

                    const cells = [];

                    // 빈 셀
                    for (let i = 0; i < startingDay; i++) {
                      cells.push(<div key={`empty-${i}`} className="h-12 md:h-16" />);
                    }

                    // 날짜 셀
                    for (let day = 1; day <= daysInMonth; day++) {
                      const currentDate = new Date(year, month, day);
                      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                      const dayEvents = calendarEvents.filter(e => e.date === dateStr);
                      const hasEvents = dayEvents.length > 0;
                      const isTodayDate = today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;
                      const isSelected = selectedCalendarDate?.toDateString() === currentDate.toDateString();
                      const dayOfWeek = (startingDay + day - 1) % 7;

                      cells.push(
                        <button
                          key={day}
                          onClick={() => hasEvents && setSelectedCalendarDate(isSelected ? null : currentDate)}
                          className={`h-12 md:h-16 p-0.5 rounded-lg flex flex-col items-center justify-center transition-all ${
                            isSelected
                              ? 'bg-orange-500 border border-orange-300 shadow-md shadow-orange-500/50'
                              : isTodayDate
                              ? 'bg-cyan-500/30 border border-cyan-400'
                              : hasEvents
                              ? 'bg-white/10 border border-white/20 hover:bg-white/20 cursor-pointer'
                              : 'bg-white/5 border border-white/5'
                          }`}
                        >
                          <span className={`text-xs md:text-sm font-semibold ${
                            isSelected ? 'text-white' :
                            isTodayDate ? 'text-white' :
                            dayOfWeek === 0 ? 'text-red-400' :
                            dayOfWeek === 6 ? 'text-blue-400' : 'text-gray-300'
                          }`}>
                            {day}
                          </span>
                          {hasEvents && (
                            <div className="flex gap-0.5 mt-0.5">
                              {dayEvents.slice(0, 3).map((event, idx) => (
                                <div
                                  key={idx}
                                  className={`w-1 h-1 rounded-full ${
                                    isSelected ? 'bg-white' :
                                    event.type === 'announcement' ? 'bg-blue-400' :
                                    event.type === 'special' ? 'bg-purple-400' :
                                    event.type === 'rank1' ? 'bg-green-400' :
                                    event.type === 'rank2' ? 'bg-cyan-400' : 'bg-orange-400'
                                  }`}
                                />
                              ))}
                            </div>
                          )}
                          {isTodayDate && !isSelected && (
                            <span className="text-[8px] text-cyan-400">오늘</span>
                          )}
                        </button>
                      );
                    }

                    return cells;
                  })()}
                </div>

                {/* 범례 */}
                <div className="flex flex-wrap justify-center gap-2 md:gap-3 text-xs border-t border-white/10 pt-3">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-blue-400" />
                    <span className="text-gray-400">공고</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-purple-400" />
                    <span className="text-gray-400">특별공급</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-green-400" />
                    <span className="text-gray-400">1순위</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-cyan-400" />
                    <span className="text-gray-400">2순위</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-orange-400" />
                    <span className="text-gray-400">당첨발표</span>
                  </div>
                </div>

                {/* 선택된 날짜 일정 */}
                {selectedCalendarDate && (
                  <div className="mt-4 p-4 bg-gradient-to-br from-orange-500/20 to-amber-500/10 rounded-xl border border-orange-500/30">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-orange-400" />
                        {selectedDateStr} 청약 일정
                      </h4>
                      <button
                        onClick={() => setSelectedCalendarDate(null)}
                        className="px-2 py-0.5 text-xs text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                      >
                        닫기 ✕
                      </button>
                    </div>
                    {getEventsForDate(selectedCalendarDate).length > 0 ? (
                      <div className="space-y-2">
                        {getEventsForDate(selectedCalendarDate).map((event, idx) => (
                          <a
                            key={idx}
                            href={getSubscriptionUrl(event.subscription)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 p-2 bg-white/5 rounded-lg text-sm hover:bg-white/10 transition-colors cursor-pointer group"
                          >
                            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                              event.type === 'announcement' ? 'bg-blue-400' :
                              event.type === 'special' ? 'bg-purple-400' :
                              event.type === 'rank1' ? 'bg-green-400' :
                              event.type === 'rank2' ? 'bg-cyan-400' : 'bg-orange-400'
                            }`} />
                            <span className={`font-semibold min-w-[50px] text-xs ${
                              event.type === 'announcement' ? 'text-blue-400' :
                              event.type === 'special' ? 'text-purple-400' :
                              event.type === 'rank1' ? 'text-green-400' :
                              event.type === 'rank2' ? 'text-cyan-400' : 'text-orange-400'
                            }`}>{event.title}</span>
                            <span className="text-white text-xs truncate group-hover:text-cyan-300 transition-colors flex-1">{event.houseName}</span>
                            <ExternalLink className="w-3 h-3 text-gray-500 group-hover:text-cyan-400 transition-colors flex-shrink-0" />
                          </a>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-400 text-center py-2 text-sm">해당 날짜에 청약 일정이 없습니다.</p>
                    )}
                  </div>
                )}
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

              {/* 필터 버튼 - 유형별 */}
              <div className="flex flex-wrap justify-center gap-3">
                <button
                  onClick={() => { setSelectedType(''); setCurrentPage(1); }}
                  className={`px-6 py-3 rounded-full font-semibold text-sm transition-all duration-300 ${
                    selectedType === ''
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/30'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white border border-white/10'
                  }`}
                >
                  전체
                </button>
                <button
                  onClick={() => { setSelectedType('apt'); setCurrentPage(1); }}
                  className={`px-6 py-3 rounded-full font-semibold text-sm transition-all duration-300 ${
                    selectedType === 'apt'
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/30'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white border border-white/10'
                  }`}
                >
                  APT
                </button>
                <button
                  onClick={() => { setSelectedType('officetel'); setCurrentPage(1); }}
                  className={`px-6 py-3 rounded-full font-semibold text-sm transition-all duration-300 ${
                    selectedType === 'officetel'
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white border border-white/10'
                  }`}
                >
                  오피스텔
                </button>
                <button
                  onClick={() => { setSelectedType('remndr'); setCurrentPage(1); }}
                  className={`px-6 py-3 rounded-full font-semibold text-sm transition-all duration-300 ${
                    selectedType === 'remndr'
                      ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-lg shadow-green-500/30'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white border border-white/10'
                  }`}
                >
                  공공지원민간임대
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* 선택된 날짜의 청약 매물 표시 */}
        {selectedCalendarDate && selectedDateSubscriptions.length > 0 && (
          <section className="relative pb-8">
            <div className="container mx-auto px-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <Calendar className="w-5 h-5 text-orange-400" />
                  <h3 className="text-xl font-bold text-white">
                    {selectedDateStr} 청약 매물
                  </h3>
                  <span className="px-3 py-1 bg-orange-500/20 text-orange-400 text-sm rounded-full">
                    {selectedDateSubscriptions.length}건
                  </span>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {selectedDateSubscriptions.map(({ sub, events }, index) => (
                    <motion.div
                      key={`${sub.HOUSE_MANAGE_NO}-${sub.PBLANC_NO}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                      <GlassCard className="p-4 h-full cursor-pointer group" hover>
                        {/* 이벤트 배지들 */}
                        <div className="flex flex-wrap gap-1 mb-3">
                          {events.map((event, idx) => (
                            <span
                              key={idx}
                              className={`px-2 py-0.5 rounded text-xs font-semibold ${
                                event.type === 'announcement' ? 'bg-blue-500/20 text-blue-400' :
                                event.type === 'application' ? 'bg-green-500/20 text-green-400' : 'bg-orange-500/20 text-orange-400'
                              }`}
                            >
                              {event.title}
                            </span>
                          ))}
                        </div>

                        {/* 단지명 */}
                        <h4 className="text-base font-bold text-white mb-2 group-hover:text-orange-300 transition-colors line-clamp-2">
                          {sub.HOUSE_NM}
                        </h4>

                        {/* 위치 */}
                        <div className="flex items-center gap-2 text-gray-400 text-xs mb-3">
                          <MapPin className="w-3 h-3" />
                          <span className="line-clamp-1">{sub.SUBSCRPT_AREA_CODE_NM}</span>
                        </div>

                        {/* 세대수 */}
                        <div className="flex items-center gap-2 text-gray-400 text-xs mb-3">
                          <Users className="w-3 h-3" />
                          <span>{sub.TOT_SUPLY_HSHLDCO?.toLocaleString() || '-'}세대</span>
                        </div>

                        {/* 청약홈 링크 */}
                        <a
                          href={getSubscriptionUrl(sub)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full px-3 py-2 bg-gradient-to-r from-orange-500/30 to-amber-500/30 text-orange-300 rounded-lg hover:from-orange-500/50 hover:to-amber-500/50 transition-all text-xs font-medium flex items-center justify-center gap-2 animate-pulse hover:animate-none border border-orange-500/30"
                        >
                          <ExternalLink className="w-3 h-3" />
                          청약홈에서 보기
                        </a>
                      </GlassCard>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </section>
        )}

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
                    <GlassCard className="overflow-hidden h-full flex flex-col" hover glow={sub.status === 'open'}>
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
                      <div className="p-4 flex flex-col flex-1">
                        <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">
                          {sub.HOUSE_NM}
                        </h3>

                        <div className="flex items-center gap-2 text-gray-400 mb-4">
                          <MapPin className="w-4 h-4 flex-shrink-0" />
                          <span className="text-sm line-clamp-1">{sub.SUBSCRPT_AREA_CODE_NM}</span>
                        </div>

                        <div className="space-y-2 text-sm mb-4 flex-1">
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
                          <div className="flex justify-between">
                            <span className="text-gray-400">시공사</span>
                            <span className="text-blue-400 text-xs line-clamp-1">
                              {sub.CNSTRCT_ENTRPS_NM || '-'}
                            </span>
                          </div>
                        </div>

                        {/* 버튼 - 항상 하단 고정 */}
                        <a
                          href={getSubscriptionUrl(sub)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full px-4 py-2.5 bg-gradient-to-r from-cyan-500/30 to-blue-500/30 text-cyan-300 rounded-lg hover:from-cyan-500/50 hover:to-blue-500/50 transition-all text-sm font-medium flex items-center justify-center gap-2 animate-pulse hover:animate-none border border-cyan-500/30 mt-auto"
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
