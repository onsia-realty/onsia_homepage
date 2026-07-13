'use client';
/**
 * SubscriptionCalendar - 청약 일정 캘린더 (추출 + 강화)
 * - 부모(FeaturedSubscriptionsSection)로부터 subscriptions / calendarEvents props 수신 (자체 fetch 없음)
 * - 강화 A: 모바일 아코디언 노출
 * - 강화 B: 임박 청약 D-Day 스트립
 * - 강화 C: 이벤트 타입 토글 필터
 */
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Users, MapPin, Clock, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { GlassCard } from './ui/GlassCard';
import Link from 'next/link';

// ── 공유 타입 (단일 소스) ──────────────────────────────
export interface Subscription {
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

export interface CalendarEvent {
  date: string;
  type: 'announcement' | 'application' | 'result' | 'special' | 'rank1' | 'rank2';
  title: string;
  houseName: string;
  subscription: Subscription;
}

// ── 이벤트 타입 메타 (범례/토글/점 색상 단일 소스) ──────
type EventType = CalendarEvent['type'];

const EVENT_TYPE_META: { type: EventType; label: string; dot: string }[] = [
  { type: 'announcement', label: '공고', dot: 'bg-evt-announcement' },
  { type: 'special', label: '특별', dot: 'bg-evt-special' },
  { type: 'rank1', label: '1순위', dot: 'bg-evt-rank1' },
  { type: 'rank2', label: '2순위', dot: 'bg-evt-rank2' },
  { type: 'result', label: '당첨', dot: 'bg-evt-result' },
];

const dotClassFor = (type: EventType) =>
  EVENT_TYPE_META.find((m) => m.type === type)?.dot ?? 'bg-evt-result';

interface Props {
  subscriptions: Subscription[];
  calendarEvents: CalendarEvent[];
}

export const SubscriptionCalendar = ({ subscriptions, calendarEvents }: Props) => {
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeTypes, setActiveTypes] = useState<Set<EventType>>(
    () => new Set<EventType>(EVENT_TYPE_META.map((m) => m.type))
  );

  const toggleType = (type: EventType) => {
    setActiveTypes((prev) => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type);
      else next.add(type);
      return next;
    });
  };

  // ── 캘린더 헬퍼 ──────────────────────────────
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    return { daysInMonth: lastDay.getDate(), startingDay: firstDay.getDay() };
  };

  const getEventsForDate = (day: number) => {
    const dateStr = `${calendarMonth.getFullYear()}-${String(calendarMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return calendarEvents.filter((e) => e.date === dateStr);
  };

  // 활성 필터 반영 이벤트
  const getActiveEventsForDate = (day: number) =>
    getEventsForDate(day).filter((e) => activeTypes.has(e.type));

  const getSubscriptionsForSelectedDate = () => {
    if (selectedDate === null) return [];
    const events = getActiveEventsForDate(selectedDate);
    const uniqueSubs = new Map<string, { sub: Subscription; events: CalendarEvent[] }>();
    events.forEach((event) => {
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
  const selectedDateStr = selectedDate
    ? `${calendarMonth.getFullYear()}년 ${calendarMonth.getMonth() + 1}월 ${selectedDate}일`
    : '';

  const { daysInMonth, startingDay } = getDaysInMonth(calendarMonth);
  const today = new Date();
  const isCurrentMonth =
    today.getFullYear() === calendarMonth.getFullYear() &&
    today.getMonth() === calendarMonth.getMonth();

  // ── 강화 B: 임박 청약 D-Day 스트립 ──────────────
  const dDayStrip = subscriptions
    .filter((s) => s.status === 'open' || s.status === 'upcoming')
    .sort((a, b) => {
      if (a.status !== b.status) return a.status === 'open' ? -1 : 1;
      return (a.dDay ?? 999) - (b.dDay ?? 999);
    });

  const openCount = subscriptions.filter((s) => s.status === 'open').length;
  const upcomingCount = subscriptions.filter((s) => s.status === 'upcoming').length;

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      {/* ── 강화 B: 이번 주 청약 접수 D-Day 스트립 ── */}
      {dDayStrip.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-orange-300" />
            <span className="text-xs font-semibold text-orange-200">이번 주 청약 접수</span>
          </div>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            {dDayStrip.map((sub) => (
              <Link
                key={`strip-${sub.HOUSE_MANAGE_NO}-${sub.PBLANC_NO}`}
                href={`/subscriptions/${sub.HOUSE_MANAGE_NO}`}
                className="flex-shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
              >
                <span className="text-xs text-gray-200 max-w-[120px] truncate">{sub.HOUSE_NM}</span>
                {sub.status === 'open' ? (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-sub-open-soft text-sub-open">
                    접수중
                  </span>
                ) : (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-sub-upcoming-soft text-sub-upcoming">
                    {sub.dDay !== null ? `D-${sub.dDay}` : '예정'}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ── 강화 A: 모바일 아코디언 헤더 (lg 미만 전용) ── */}
      <button
        onClick={() => setMobileOpen((v) => !v)}
        className="lg:hidden w-full flex items-center justify-between px-4 py-3 mb-3 rounded-xl bg-white/5 border border-white/10"
        aria-expanded={mobileOpen}
      >
        <span className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-orange-300" />
          <span className="text-sm font-bold text-white">청약 일정 캘린더</span>
          <span className="text-xs text-gray-400">
            접수중 {openCount} · 예정 {upcomingCount}
          </span>
        </span>
        <ChevronDown
          className={`w-5 h-5 text-gray-400 transition-transform ${mobileOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* ── 접이식 콘텐츠 (모바일: 애니메이션 / PC: 항상 펼침) ── */}
      <motion.div
        initial={false}
        animate={{ height: mobileOpen ? 'auto' : 0 }}
        transition={{ duration: 0.35, ease: 'easeInOut' }}
        className="overflow-hidden lg:!h-auto lg:overflow-visible"
      >
        <GlassCard className="p-5">
          {/* 캘린더 헤더 */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white">청약 일정</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1))
                }
                className="p-1 hover:bg-white/10 rounded transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-gray-400" />
              </button>
              <span className="text-white font-semibold min-w-[100px] text-center">
                {calendarMonth.getFullYear()}년 {calendarMonth.getMonth() + 1}월
              </span>
              <button
                onClick={() =>
                  setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1))
                }
                className="p-1 hover:bg-white/10 rounded transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>

          {/* 요일 헤더 */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['일', '월', '화', '수', '목', '금', '토'].map((day, i) => (
              <div
                key={day}
                className={`text-center text-xs font-semibold py-2 ${
                  i === 0 ? 'text-red-400' : i === 6 ? 'text-blue-400' : 'text-gray-400'
                }`}
              >
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
              const events = getActiveEventsForDate(day);
              const isToday = isCurrentMonth && today.getDate() === day;
              const isSelected = selectedDate === day;
              const hasEvents = events.length > 0;

              return (
                <div
                  key={day}
                  onClick={() => hasEvents && setSelectedDate(isSelected ? null : day)}
                  className={`aspect-square flex flex-col items-center justify-start p-1 rounded-lg text-xs relative transition-all duration-200 ${
                    isSelected
                      ? 'bg-orange-500 border border-orange-300 shadow-lg shadow-orange-500/50'
                      : isToday
                        ? 'bg-orange-500/30 border border-orange-400'
                        : hasEvents
                          ? 'hover:bg-white/10 cursor-pointer'
                          : 'hover:bg-white/5'
                  }`}
                >
                  <span
                    className={`font-semibold ${
                      isSelected
                        ? 'text-white'
                        : dayOfWeek === 0
                          ? 'text-red-400'
                          : dayOfWeek === 6
                            ? 'text-blue-400'
                            : 'text-gray-300'
                    }`}
                  >
                    {day}
                  </span>
                  {events.length > 0 && (
                    <div className="flex gap-0.5 mt-0.5 flex-wrap justify-center">
                      {events.slice(0, 3).map((event, idx) => (
                        <div
                          key={idx}
                          className={`w-1.5 h-1.5 rounded-full ${
                            isSelected ? 'bg-white' : dotClassFor(event.type)
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* ── 강화 C: 범례 = 이벤트 타입 토글 필터 ── */}
          <div className="mt-4 pt-4 border-t border-white/10">
            <div className="flex flex-wrap gap-2 text-xs">
              {EVENT_TYPE_META.map((meta) => {
                const active = activeTypes.has(meta.type);
                return (
                  <button
                    key={meta.type}
                    onClick={() => toggleType(meta.type)}
                    className={`flex items-center gap-1.5 px-2 py-1 rounded-full border transition-all ${
                      active
                        ? 'border-white/15 bg-white/5'
                        : 'border-transparent opacity-40 line-through'
                    }`}
                    aria-pressed={active}
                  >
                    <div className={`w-2 h-2 rounded-full ${meta.dot}`} />
                    <span className="text-gray-300">{meta.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 선택된 날짜 일정 */}
          {selectedDate !== null && (
            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-white">{selectedDateStr} 일정</h4>
                <button
                  onClick={() => setSelectedDate(null)}
                  className="text-xs text-gray-400 hover:text-white transition-colors"
                >
                  닫기 ✕
                </button>
              </div>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {getActiveEventsForDate(selectedDate).map((event, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${dotClassFor(event.type)}`} />
                    <span className="text-orange-300 font-semibold">{event.title}</span>
                    <span className="text-gray-300 line-clamp-1">{event.houseName}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </GlassCard>

        {/* ── 선택된 날짜의 청약 매물 (컬럼 내부 세로 스택) ── */}
        {selectedDate !== null && selectedDateSubscriptions.length > 0 && (
          <motion.div
            className="mt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-4 h-4 text-orange-400" />
              <h3 className="text-sm font-bold text-white">{selectedDateStr} 청약 매물</h3>
              <span className="px-2 py-0.5 bg-orange-500/20 text-orange-400 text-xs rounded-full">
                {selectedDateSubscriptions.length}건
              </span>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {selectedDateSubscriptions.map(({ sub, events }, index) => (
                <motion.div
                  key={`${sub.HOUSE_MANAGE_NO}-${sub.PBLANC_NO}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <GlassCard className="p-4 h-full group" hover>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {events.map((event, idx) => (
                        <span
                          key={idx}
                          className={`px-2 py-0.5 rounded text-xs font-semibold ${
                            event.type === 'announcement'
                              ? 'bg-evt-announcement/20 text-evt-announcement'
                              : event.type === 'application' || event.type === 'rank1'
                                ? 'bg-evt-rank1/20 text-evt-rank1'
                                : 'bg-evt-result/20 text-evt-result'
                          }`}
                        >
                          {event.title}
                        </span>
                      ))}
                    </div>
                    <Link href={`/subscriptions/${sub.HOUSE_MANAGE_NO}`}>
                      <h4 className="text-base font-bold text-white mb-2 line-clamp-2 hover:text-orange-300 transition-colors">
                        {sub.HOUSE_NM}
                      </h4>
                    </Link>
                    <div className="flex items-center gap-2 text-gray-400 text-xs mb-3">
                      <MapPin className="w-3 h-3" />
                      <span className="line-clamp-1">{sub.SUBSCRPT_AREA_CODE_NM}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400 text-xs mb-3">
                      <Users className="w-3 h-3" />
                      <span>{sub.TOT_SUPLY_HSHLDCO?.toLocaleString() || '-'}세대</span>
                    </div>
                    <Link
                      href={`/subscriptions/${sub.HOUSE_MANAGE_NO}`}
                      className="w-full px-3 py-2 bg-gradient-to-r from-orange-500/30 to-amber-500/30 text-orange-300 rounded-lg hover:from-orange-500/50 hover:to-amber-500/50 transition-all text-xs font-medium flex items-center justify-center gap-2 border border-orange-500/30"
                    >
                      상세보기
                    </Link>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};
