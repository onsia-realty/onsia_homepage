'use client';
/**
 * FeaturedSubscriptionsSection - SEO Internal Links Update v2
 * Last updated: 2025-12-14T12:55:00
 * - Category buttons now use Link components for SEO
 * - Subscription cards wrapped with internal links
 */
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Building2, Calendar, Users, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { GlassCard } from './ui/GlassCard';
import Link from 'next/link';
import { SubscriptionCalendar, type Subscription, type CalendarEvent } from './SubscriptionCalendar';

const getStatusBadge = (status: string, dDay: number | null) => {
  switch (status) {
    case 'open':
      return (
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-sub-open-soft text-sub-open border border-sub-open/30">
          접수중 {dDay !== null && `D-${dDay}`}
        </span>
      );
    case 'upcoming':
      return (
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-sub-upcoming-soft text-sub-upcoming border border-sub-upcoming/30">
          접수예정 {dDay !== null && `D-${dDay}`}
        </span>
      );
    default:
      return (
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-sub-closed-soft text-sub-closed border border-sub-closed/30">
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
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);

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

          {/* 오른쪽: 청약 일정 캘린더 (모바일 아코디언 + PC 상시) */}
          <div className="lg:col-span-1">
            <SubscriptionCalendar subscriptions={subscriptions} calendarEvents={calendarEvents} />
          </div>
        </div>

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
