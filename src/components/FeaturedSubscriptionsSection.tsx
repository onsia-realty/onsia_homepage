'use client';
// Force rebuild - SEO internal links update
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Building2, Calendar, Users, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { GlassCard } from './ui/GlassCard';
import Link from 'next/link';

interface Subscription {
  HOUSE_MANAGE_NO: string;
  PBLANC_NO: string;
  HOUSE_NM: string;
  HOUSE_SECD_NM: string;
  HSSPLY_ADRES: string;
  TOT_SUPLY_HSHLDCO: number;
  RCRIT_PBLANC_DE: string;
  RCEPT_BGNDE: string;
  RCEPT_ENDDE: string;
  PRZWNER_PRESNATN_DE: string;
  SUBSCRPT_AREA_CODE_NM: string;
  PBLANC_URL: string;
  HMPG_ADRES: string;
  SPSPLY_RCEPT_BGNDE: string | null;
  GNRL_RNK1_CRSPAREA_RCPTDE: string | null;
  GNRL_RNK2_CRSPAREA_RCPTDE: string | null;
  status: 'upcoming' | 'open' | 'closed';
  statusText: string;
  dDay: number | null;
}

interface CalendarEvent {
  date: string;
  type: 'announcement' | 'application' | 'result' | 'special' | 'rank1' | 'rank2';
  title: string;
  houseName: string;
  subscription: Subscription;
}

const getStatusBadge = (status: string, dDay: number | null) => {
  switch (status) {
    case 'open':
      return (
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-500/20 text-green-400 border border-green-500/30">
          접수중 {dDay !== null && `D-${dDay}`}
        </span>
      );
    case 'upcoming':
      return (
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-500/20 text-orange-400 border border-orange-500/30">
          접수예정 {dDay !== null && `D-${dDay}`}
        </span>
      );
    default:
      return (
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-500/20 text-gray-400 border border-gray-500/30">
          마감
        </span>
      );
  }
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  return `${date.getMonth() + 1}/${date.getDate()}`;
};

// 청약 카드 컴포넌트 (PC/모바일 공용)
const SubscriptionCard = ({ sub, index, isMobile = false }: {
  sub: Subscription;
  index: number;
  isMobile?: boolean;
}) => {
  return (
    <motion.div
      key={`${sub.HOUSE_MANAGE_NO}-${sub.PBLANC_NO}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: isMobile ? 0 : index * 0.1 }}
      className={isMobile ? "flex-shrink-0 w-[280px]" : ""}
    >
      <Link href={`/subscriptions/${sub.HOUSE_MANAGE_NO}`}>
        <GlassCard className="p-5 h-full group" hover glow>
          {/* 상단: 상태 배지 + 타입 */}
          <div className="flex items-center justify-between mb-4">
            {getStatusBadge(sub.status, sub.dDay)}
            <span className="text-xs text-gray-400 bg-white/5 px-2 py-1 rounded">
              {sub.HOUSE_SECD_NM || 'APT'}
            </span>
          </div>

          {/* 단지명 */}
          <h3 className="text-lg font-bold text-white mb-2 line-clamp-1 group-hover:text-orange-300 transition-colors">
            {sub.HOUSE_NM}
          </h3>

          {/* 위치 */}
          <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
            <MapPin className="w-4 h-4" />
            <span className="line-clamp-1">{sub.HSSPLY_ADRES || sub.SUBSCRPT_AREA_CODE_NM}</span>
          </div>

          {/* 정보 그리드 */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-white/5 rounded-lg p-3">
              <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
                <Users className="w-3 h-3" />
                <span>총 세대</span>
              </div>
              <div className="text-white font-bold">{sub.TOT_SUPLY_HSHLDCO?.toLocaleString() || '-'}세대</div>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
                <Calendar className="w-3 h-3" />
                <span>청약접수</span>
              </div>
              <div className="text-white font-bold text-sm">
                {formatDate(sub.RCEPT_BGNDE)} ~ {formatDate(sub.RCEPT_ENDDE)}
              </div>
            </div>
          </div>

          {/* 당첨자 발표일 */}
          <div className="flex items-center gap-2 text-gray-400 text-xs mb-4">
            <Clock className="w-3 h-3" />
            <span>당첨발표: {sub.PRZWNER_PRESNATN_DE || '미정'}</span>
          </div>

          {/* 상세보기 버튼 */}
          <div className="w-full px-4 py-2.5 bg-gradient-to-r from-orange-500/30 to-amber-500/30 text-orange-300 rounded-lg group-hover:from-orange-500/50 group-hover:to-amber-500/50 transition-all text-sm font-medium flex items-center justify-center gap-2 border border-orange-500/30">
            상세보기
          </div>
        </GlassCard>
      </Link>
    </motion.div>
  );
};

// 모바일 슬라이더 컴포넌트
const MobileSlider = ({ subscriptions }: { subscriptions: Subscription[] }) => {
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
  }, [subscriptions]);

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
        {subscriptions.map((sub, index) => (
          <SubscriptionCard key={`${sub.HOUSE_MANAGE_NO}-${sub.PBLANC_NO}`} sub={sub} index={index} isMobile={true} />
        ))}
      </div>

      {/* 스크롤 인디케이터 */}
      <div className="flex justify-center gap-1.5 mt-3">
        {subscriptions.slice(0, Math.min(subscriptions.length, 5)).map((_, idx) => (
          <div key={idx} className="w-1.5 h-1.5 rounded-full bg-white/30" />
        ))}
      </div>
    </div>
  );
};

export const FeaturedSubscriptionsSection = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const response = await fetch('/api/subscriptions?perPage=50');
        const data = await response.json();
        if (data.data) {
          setSubscriptions(data.data);

          // 캘린더 이벤트 생성
          const events: CalendarEvent[] = [];
          data.data.forEach((sub: Subscription) => {
            if (sub.RCRIT_PBLANC_DE) {
              events.push({ date: sub.RCRIT_PBLANC_DE, type: 'announcement', title: '공고', houseName: sub.HOUSE_NM, subscription: sub });
            }
            if (sub.SPSPLY_RCEPT_BGNDE) {
              events.push({ date: sub.SPSPLY_RCEPT_BGNDE, type: 'special', title: '특별공급', houseName: sub.HOUSE_NM, subscription: sub });
            }
            if (sub.GNRL_RNK1_CRSPAREA_RCPTDE) {
              events.push({ date: sub.GNRL_RNK1_CRSPAREA_RCPTDE, type: 'rank1', title: '1순위', houseName: sub.HOUSE_NM, subscription: sub });
            }
            if (sub.GNRL_RNK2_CRSPAREA_RCPTDE) {
              events.push({ date: sub.GNRL_RNK2_CRSPAREA_RCPTDE, type: 'rank2', title: '2순위', houseName: sub.HOUSE_NM, subscription: sub });
            }
            if (sub.PRZWNER_PRESNATN_DE) {
              events.push({ date: sub.PRZWNER_PRESNATN_DE, type: 'result', title: '당첨발표', houseName: sub.HOUSE_NM, subscription: sub });
            }
          });
          setCalendarEvents(events);
        }
      } catch (error) {
        console.error('Failed to fetch subscriptions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, []);

  // 타입별 필터링
  const getFilteredSubscriptions = () => {
    let filtered = subscriptions;

    if (selectedType === 'closed') {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      filtered = subscriptions.filter(s => {
        if (s.status !== 'closed') return false;
        const endDate = new Date(s.RCEPT_ENDDE);
        return endDate >= thirtyDaysAgo;
      });

      return filtered
        .sort((a, b) => new Date(b.RCEPT_ENDDE || '1900-01-01').getTime() - new Date(a.RCEPT_ENDDE || '1900-01-01').getTime())
        .slice(0, 4);
    }

    filtered = subscriptions.filter(s => s.status !== 'closed');

    if (selectedType === 'apt') {
      filtered = filtered.filter(s => {
        const type = (s.HOUSE_SECD_NM || '').toLowerCase();
        return type.includes('apt') || type.includes('아파트') || type.includes('신혼') || type.includes('국민') || type.includes('민영') || type.includes('분양');
      });
    } else if (selectedType === 'officetel') {
      filtered = filtered.filter(s => {
        const type = (s.HOUSE_SECD_NM || '').toLowerCase();
        return type.includes('오피스텔') || type.includes('도시형');
      });
    } else if (selectedType === 'public') {
      filtered = filtered.filter(s => {
        const type = (s.HOUSE_SECD_NM || '').toLowerCase();
        return type.includes('민간임대') || type.includes('공공') || type.includes('임대');
      });
    }

    return filtered
      .sort((a, b) => {
        const statusPriority = { open: 0, upcoming: 1, closed: 2 };
        const priorityDiff = statusPriority[a.status] - statusPriority[b.status];
        if (priorityDiff !== 0) return priorityDiff;
        return (a.dDay ?? 999) - (b.dDay ?? 999);
      })
      .slice(0, 4);
  };

  const featuredSubscriptions = getFilteredSubscriptions();

  // 캘린더 관련
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    return { daysInMonth: lastDay.getDate(), startingDay: firstDay.getDay() };
  };

  const getEventsForDate = (day: number) => {
    const dateStr = `${calendarMonth.getFullYear()}-${String(calendarMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return calendarEvents.filter(e => e.date === dateStr);
  };

  const getSubscriptionsForSelectedDate = () => {
    if (selectedDate === null) return [];
    const events = getEventsForDate(selectedDate);
    const uniqueSubs = new Map<string, { sub: Subscription; events: CalendarEvent[] }>();
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
  const selectedDateStr = selectedDate ? `${calendarMonth.getFullYear()}년 ${calendarMonth.getMonth() + 1}월 ${selectedDate}일` : '';

  const { daysInMonth, startingDay } = getDaysInMonth(calendarMonth);
  const today = new Date();
  const isCurrentMonth = today.getFullYear() === calendarMonth.getFullYear() && today.getMonth() === calendarMonth.getMonth();

  if (loading) {
    return (
      <section className="relative py-12 md:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center text-gray-400">청약 정보를 불러오는 중...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-12 md:py-20">
      <div className="container mx-auto px-4 sm:px-6">
        {/* 섹션 헤더 */}
        <motion.div
          className="max-w-4xl mx-auto text-center mb-8 md:mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 md:px-6 md:py-3 rounded-full bg-orange-500/20 border border-orange-400/30 mb-6 md:mb-8 backdrop-blur-sm">
            <Building2 className="w-4 h-4 md:w-5 md:h-5 text-orange-300" />
            <span className="text-orange-200 font-semibold text-xs md:text-sm">실시간 청약 정보</span>
          </div>

          <div className="mb-4 md:mb-6">
            <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-wider mb-2 md:mb-4">
              <span className="text-white">SUBSCRIPTION</span>
              <span className="text-orange-400 ml-2 md:ml-3">info</span>
            </div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 md:mb-4">
              <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500 bg-clip-text text-transparent">
                청약홈 추천 매물
              </span>
            </h2>
          </div>

          <p className="text-sm md:text-lg text-gray-300 leading-relaxed mb-6 md:mb-8">
            온시아만의 독자적인 실시간 데이터 처리 기술로 제공되는 청약홈 정보입니다.
          </p>

          {/* 카테고리 링크 버튼 */}
          <div className="flex flex-wrap justify-center gap-2 md:gap-3">
            <Link
              href="/subscriptions"
              className={`px-4 py-2 md:px-6 md:py-3 rounded-full font-semibold text-xs md:text-sm transition-all duration-300 ${
                selectedType === 'all'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/30'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white border border-white/10'
              }`}
            >
              전체
            </Link>
            <Link
              href="/subscriptions/apt"
              className="px-4 py-2 md:px-6 md:py-3 rounded-full font-semibold text-xs md:text-sm transition-all duration-300 bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white border border-white/10"
            >
              APT
            </Link>
            <Link
              href="/subscriptions/officetel"
              className="px-4 py-2 md:px-6 md:py-3 rounded-full font-semibold text-xs md:text-sm transition-all duration-300 bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white border border-white/10"
            >
              오피스텔
            </Link>
            <Link
              href="/subscriptions/remndr"
              className="px-4 py-2 md:px-6 md:py-3 rounded-full font-semibold text-xs md:text-sm transition-all duration-300 bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white border border-white/10"
            >
              무순위/잔여
            </Link>
          </div>
        </motion.div>

        {/* 메인 컨텐츠 */}
        <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
          {/* 왼쪽: 매물 카드 */}
          <div className="lg:col-span-2">
            {/* PC 그리드 (md 이상) */}
            <div className="hidden md:grid md:grid-cols-2 gap-6">
              {featuredSubscriptions.map((sub, index) => (
                <SubscriptionCard key={`${sub.HOUSE_MANAGE_NO}-${sub.PBLANC_NO}`} sub={sub} index={index} />
              ))}
            </div>

            {/* 모바일 슬라이더 (md 미만) */}
            <div className="md:hidden">
              <MobileSlider subscriptions={featuredSubscriptions} />
            </div>
          </div>

          {/* 오른쪽: 미니 캘린더 (PC만) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="hidden lg:block"
          >
            <GlassCard className="p-5 h-full">
              {/* 캘린더 헤더 */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">청약 일정</h3>
                <div className="flex items-center gap-2">
                  <button onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1))} className="p-1 hover:bg-white/10 rounded transition-colors">
                    <ChevronLeft className="w-5 h-5 text-gray-400" />
                  </button>
                  <span className="text-white font-semibold min-w-[100px] text-center">
                    {calendarMonth.getFullYear()}년 {calendarMonth.getMonth() + 1}월
                  </span>
                  <button onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1))} className="p-1 hover:bg-white/10 rounded transition-colors">
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              </div>

              {/* 요일 헤더 */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['일', '월', '화', '수', '목', '금', '토'].map((day, i) => (
                  <div key={day} className={`text-center text-xs font-semibold py-2 ${i === 0 ? 'text-red-400' : i === 6 ? 'text-blue-400' : 'text-gray-400'}`}>
                    {day}
                  </div>
                ))}
              </div>

              {/* 날짜 그리드 */}
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: startingDay }).map((_, i) => (
                  <div key={`empty-${i}`} className="aspect-square" />
                ))}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const dayOfWeek = (startingDay + i) % 7;
                  const events = getEventsForDate(day);
                  const isToday = isCurrentMonth && today.getDate() === day;
                  const isSelected = selectedDate === day;
                  const hasEvents = events.length > 0;

                  return (
                    <div
                      key={day}
                      onClick={() => hasEvents && setSelectedDate(isSelected ? null : day)}
                      className={`aspect-square flex flex-col items-center justify-start p-1 rounded-lg text-xs relative transition-all duration-200 ${
                        isSelected ? 'bg-orange-500 border border-orange-300 shadow-lg shadow-orange-500/50' :
                        isToday ? 'bg-orange-500/30 border border-orange-400' :
                        hasEvents ? 'hover:bg-white/10 cursor-pointer' : 'hover:bg-white/5'
                      }`}
                    >
                      <span className={`font-semibold ${isSelected ? 'text-white' : dayOfWeek === 0 ? 'text-red-400' : dayOfWeek === 6 ? 'text-blue-400' : 'text-gray-300'}`}>
                        {day}
                      </span>
                      {events.length > 0 && (
                        <div className="flex gap-0.5 mt-0.5 flex-wrap justify-center">
                          {events.slice(0, 3).map((event, idx) => (
                            <div key={idx} className={`w-1.5 h-1.5 rounded-full ${
                              isSelected ? 'bg-white' :
                              event.type === 'announcement' ? 'bg-blue-400' :
                              event.type === 'special' ? 'bg-purple-400' :
                              event.type === 'rank1' ? 'bg-green-400' :
                              event.type === 'rank2' ? 'bg-cyan-400' : 'bg-orange-400'
                            }`} />
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* 범례 */}
              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="flex flex-wrap gap-3 text-xs">
                  <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-blue-400" /><span className="text-gray-400">공고</span></div>
                  <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-purple-400" /><span className="text-gray-400">특별</span></div>
                  <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-green-400" /><span className="text-gray-400">1순위</span></div>
                  <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-cyan-400" /><span className="text-gray-400">2순위</span></div>
                  <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-orange-400" /><span className="text-gray-400">당첨</span></div>
                </div>
              </div>

              {/* 선택된 날짜 일정 */}
              {selectedDate !== null && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold text-white">{selectedDateStr} 일정</h4>
                    <button onClick={() => setSelectedDate(null)} className="text-xs text-gray-400 hover:text-white transition-colors">닫기 ✕</button>
                  </div>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {getEventsForDate(selectedDate).map((event, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs">
                        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                          event.type === 'announcement' ? 'bg-blue-400' :
                          event.type === 'special' ? 'bg-purple-400' :
                          event.type === 'rank1' ? 'bg-green-400' :
                          event.type === 'rank2' ? 'bg-cyan-400' : 'bg-orange-400'
                        }`} />
                        <span className="text-orange-300 font-semibold">{event.title}</span>
                        <span className="text-gray-300 line-clamp-1">{event.houseName}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </GlassCard>
          </motion.div>
        </div>

        {/* 선택된 날짜의 청약 매물 (PC만) */}
        {selectedDate !== null && selectedDateSubscriptions.length > 0 && (
          <motion.div className="mt-8 hidden lg:block" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex items-center gap-3 mb-6">
              <Calendar className="w-5 h-5 text-orange-400" />
              <h3 className="text-xl font-bold text-white">{selectedDateStr} 청약 매물</h3>
              <span className="px-3 py-1 bg-orange-500/20 text-orange-400 text-sm rounded-full">{selectedDateSubscriptions.length}건</span>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {selectedDateSubscriptions.map(({ sub, events }, index) => (
                <motion.div key={`${sub.HOUSE_MANAGE_NO}-${sub.PBLANC_NO}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: index * 0.1 }}>
                  <GlassCard className="p-4 h-full group" hover>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {events.map((event, idx) => (
                        <span key={idx} className={`px-2 py-0.5 rounded text-xs font-semibold ${
                          event.type === 'announcement' ? 'bg-blue-500/20 text-blue-400' :
                          event.type === 'application' ? 'bg-green-500/20 text-green-400' : 'bg-orange-500/20 text-orange-400'
                        }`}>{event.title}</span>
                      ))}
                    </div>
                    <Link href={`/subscriptions/${sub.HOUSE_MANAGE_NO}`}>
                      <h4 className="text-base font-bold text-white mb-2 line-clamp-2 hover:text-orange-300 transition-colors">{sub.HOUSE_NM}</h4>
                    </Link>
                    <div className="flex items-center gap-2 text-gray-400 text-xs mb-3">
                      <MapPin className="w-3 h-3" /><span className="line-clamp-1">{sub.SUBSCRPT_AREA_CODE_NM}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400 text-xs mb-3">
                      <Users className="w-3 h-3" /><span>{sub.TOT_SUPLY_HSHLDCO?.toLocaleString() || '-'}세대</span>
                    </div>
                    <Link href={`/subscriptions/${sub.HOUSE_MANAGE_NO}`} className="w-full px-3 py-2 bg-gradient-to-r from-orange-500/30 to-amber-500/30 text-orange-300 rounded-lg hover:from-orange-500/50 hover:to-amber-500/50 transition-all text-xs font-medium flex items-center justify-center gap-2 border border-orange-500/30">
                      상세보기
                    </Link>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* 더보기 버튼 */}
        <motion.div className="text-center mt-10 md:mt-12" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.4 }}>
          <Link href="/subscriptions" className="inline-flex items-center gap-2 md:gap-3 px-6 py-3 md:px-8 md:py-4 rounded-full bg-gradient-to-r from-orange-600/80 to-amber-600/80 border border-orange-400/30 font-semibold text-white text-sm md:text-base hover:shadow-lg hover:shadow-orange-500/30 transition-all duration-300 group">
            <span>전체 청약 매물 보기</span>
            <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
