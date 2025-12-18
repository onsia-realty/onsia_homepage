'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Flame, Calendar, Building2, MapPin, Users, ChevronRight, Bell, TrendingUp, Map } from 'lucide-react';

// Mock 분양 데이터
const MOCK_SUBSCRIPTIONS = [
  {
    id: '2025000524',
    name: '용인 푸르지오 원클러스터파크',
    type: '민영주택',
    buildingType: '아파트',
    households: 710,
    region: '경기',
    address: '경기도 용인시 처인구 양지면 양지리',
    developer: '대우건설',
    subscriptionStart: '2025-12-17',
    subscriptionEnd: '2025-12-19',
    announcementDate: '2025-12-26',
    moveInDate: '2028-12',
    status: 'today', // today, upcoming, announced, closed
    isHot: true,
    viewCount: 15420,
    pricePerPyeong: 1651,
  },
  {
    id: '2025000525',
    name: '역삼센트럴자이',
    type: '민영주택',
    buildingType: '아파트',
    households: 87,
    region: '서울',
    address: '서울특별시 강남구 역삼동',
    developer: 'GS건설',
    subscriptionStart: '2025-12-15',
    subscriptionEnd: '2025-12-18',
    announcementDate: '2025-12-24',
    moveInDate: '2027-06',
    status: 'today',
    isHot: true,
    viewCount: 28350,
    pricePerPyeong: 8500,
  },
  {
    id: '2025000526',
    name: '한화포레나 부산대연',
    type: '민영주택',
    buildingType: '아파트',
    households: 104,
    region: '부산',
    address: '부산광역시 남구 대연동',
    developer: '한화건설',
    subscriptionStart: '2025-12-22',
    subscriptionEnd: '2025-12-24',
    announcementDate: '2025-12-31',
    moveInDate: '2028-03',
    status: 'upcoming',
    isHot: false,
    viewCount: 5230,
    pricePerPyeong: 1820,
  },
  {
    id: '2025000527',
    name: '이천 중리지구 B3블록 금성백조 예미지',
    type: '민영주택',
    buildingType: '아파트',
    households: 1009,
    region: '경기',
    address: '경기도 이천시 중리지구 B3블록',
    developer: '금성백조',
    subscriptionStart: '2025-12-22',
    subscriptionEnd: '2025-12-24',
    announcementDate: '2025-12-31',
    moveInDate: '2028-06',
    status: 'upcoming',
    isHot: false,
    viewCount: 8920,
    pricePerPyeong: 1450,
  },
  {
    id: '2025000528',
    name: '검단신도시 AB22블록 제일풍경채',
    type: '민영주택',
    buildingType: '아파트',
    households: 584,
    region: '인천',
    address: '인천광역시 서구 검단동',
    developer: '제일건설',
    subscriptionStart: '2025-12-23',
    subscriptionEnd: '2025-12-26',
    announcementDate: '2026-01-02',
    moveInDate: '2028-09',
    status: 'upcoming',
    isHot: true,
    viewCount: 12450,
    pricePerPyeong: 1580,
  },
  {
    id: '2025000529',
    name: '광명 철산자이 더헤리티지',
    type: '민영주택',
    buildingType: '아파트',
    households: 1240,
    region: '경기',
    address: '경기도 광명시 철산동',
    developer: 'GS건설',
    subscriptionStart: '2025-12-10',
    subscriptionEnd: '2025-12-12',
    announcementDate: '2025-12-18',
    moveInDate: '2028-04',
    status: 'announced',
    isHot: true,
    viewCount: 32100,
    pricePerPyeong: 3200,
    competitionRate: 45.2,
  },
  {
    id: '2025000530',
    name: '힐스테이트 대구역 센트럴',
    type: '민영주택',
    buildingType: '아파트',
    households: 892,
    region: '대구',
    address: '대구광역시 북구 칠성동',
    developer: '현대건설',
    subscriptionStart: '2025-12-08',
    subscriptionEnd: '2025-12-10',
    announcementDate: '2025-12-16',
    moveInDate: '2028-02',
    status: 'announced',
    isHot: false,
    viewCount: 9800,
    pricePerPyeong: 1680,
    competitionRate: 12.8,
  },
  {
    id: '2025000531',
    name: '세종 6-3생활권 더샵',
    type: '민영주택',
    buildingType: '아파트',
    households: 1456,
    region: '세종',
    address: '세종특별자치시 6-3생활권',
    developer: '포스코이앤씨',
    subscriptionStart: '2025-12-26',
    subscriptionEnd: '2025-12-30',
    announcementDate: '2026-01-06',
    moveInDate: '2028-12',
    status: 'upcoming',
    isHot: true,
    viewCount: 18200,
    pricePerPyeong: 1720,
  },
];

const REGIONS = ['전국', '서울', '경기', '부산', '대구', '인천', '광주', '대전', '울산', '세종', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주'];

const STATUS_FILTERS = [
  { key: 'today', label: '오늘청약', icon: Calendar },
  { key: 'announced', label: '당첨발표', icon: Bell },
  { key: 'hot', label: '조회 급등', icon: TrendingUp },
];

function getDaysUntil(dateStr: string): number {
  const target = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

function getStatusText(subscription: typeof MOCK_SUBSCRIPTIONS[0]): { primary: string; secondary: string; isToday: boolean } {
  const daysUntilStart = getDaysUntil(subscription.subscriptionStart);
  const daysUntilEnd = getDaysUntil(subscription.subscriptionEnd);
  const daysUntilAnnounce = getDaysUntil(subscription.announcementDate);

  if (subscription.status === 'announced') {
    return {
      primary: `경쟁률 ${subscription.competitionRate}:1`,
      secondary: `당첨발표 ${daysUntilAnnounce === 0 ? '오늘' : daysUntilAnnounce < 0 ? `${Math.abs(daysUntilAnnounce)}일전 완료` : `${daysUntilAnnounce}일후`}`,
      isToday: daysUntilAnnounce === 0,
    };
  }

  if (daysUntilStart <= 0 && daysUntilEnd >= 0) {
    // 청약 진행 중
    const dayNum = Math.abs(daysUntilStart) + 1;
    return {
      primary: dayNum === 1 ? '1순위청약 오늘' : `${dayNum}순위청약 오늘`,
      secondary: daysUntilEnd === 0 ? '청약 마감일' : `청약 마감 ${daysUntilEnd}일전`,
      isToday: true,
    };
  }

  if (daysUntilStart > 0) {
    return {
      primary: daysUntilStart <= 7 ? `특별청약 ${daysUntilStart}일전` : `청약시작 ${daysUntilStart}일전`,
      secondary: `1순위 청약 ${daysUntilStart + 1}일전`,
      isToday: false,
    };
  }

  return {
    primary: '청약마감',
    secondary: `당첨발표 ${daysUntilAnnounce}일전`,
    isToday: false,
  };
}

function formatPrice(pricePerPyeong: number): string {
  if (pricePerPyeong >= 10000) {
    return `${(pricePerPyeong / 10000).toFixed(1)}억`;
  }
  return `${pricePerPyeong.toLocaleString()}만`;
}

export default function SubscriptionPage() {
  const [selectedRegion, setSelectedRegion] = useState('전국');
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSubscriptions = useMemo(() => {
    let result = [...MOCK_SUBSCRIPTIONS];

    // 지역 필터
    if (selectedRegion !== '전국') {
      result = result.filter(s => s.region === selectedRegion);
    }

    // 상태 필터
    if (selectedStatus === 'today') {
      result = result.filter(s => {
        const status = getStatusText(s);
        return status.isToday;
      });
    } else if (selectedStatus === 'announced') {
      result = result.filter(s => s.status === 'announced');
    } else if (selectedStatus === 'hot') {
      result = result.filter(s => s.isHot);
    }

    // 검색 필터
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(s =>
        s.name.toLowerCase().includes(query) ||
        s.address.toLowerCase().includes(query) ||
        s.developer.toLowerCase().includes(query)
      );
    }

    return result;
  }, [selectedRegion, selectedStatus, searchQuery]);

  // 오늘 청약 / 곧 시작 분류
  const todaySubscriptions = filteredSubscriptions.filter(s => getStatusText(s).isToday);
  const upcomingSubscriptions = filteredSubscriptions.filter(s => !getStatusText(s).isToday && s.status !== 'announced');
  const announcedSubscriptions = filteredSubscriptions.filter(s => s.status === 'announced');

  const statusCounts = {
    today: MOCK_SUBSCRIPTIONS.filter(s => getStatusText(s).isToday).length,
    announced: MOCK_SUBSCRIPTIONS.filter(s => s.status === 'announced').length,
    hot: MOCK_SUBSCRIPTIONS.filter(s => s.isHot).length,
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0a0a0f]/95 backdrop-blur-md border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg">온시아</span>
              <span className="text-gray-500 text-sm ml-1">분양</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link
                href="/subscription/map"
                className="flex items-center gap-1.5 text-sm text-blue-400 hover:text-blue-300 transition-colors"
              >
                <Map className="w-4 h-4" />
                지도로 보기
              </Link>
              <Link
                href="/market"
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                실거래가 →
              </Link>
            </div>
          </div>

          {/* 검색바 */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="분양 단지명을 검색해보세요."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-[#12121a] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition-colors"
            />
          </div>

          {/* 지역 필터 */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {REGIONS.map((region) => (
              <button
                key={region}
                onClick={() => setSelectedRegion(region)}
                className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap transition-all ${
                  selectedRegion === region
                    ? 'bg-blue-500 text-white'
                    : 'bg-[#1a1a24] text-gray-400 hover:bg-[#22222e] hover:text-white'
                }`}
              >
                {region}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Status Filter Tabs */}
      <div className="border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex">
            {STATUS_FILTERS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setSelectedStatus(selectedStatus === key ? null : key)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-all ${
                  selectedStatus === key
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-300'
                }`}
              >
                {key === 'hot' && <Flame className="w-4 h-4 text-orange-500" />}
                {label}
                <span className={`ml-1 ${selectedStatus === key ? 'text-blue-400' : 'text-gray-600'}`}>
                  ({statusCounts[key as keyof typeof statusCounts]})
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        <AnimatePresence>
          {/* 오늘 청약 섹션 */}
          {todaySubscriptions.length > 0 && (
            <motion.section
              key="today-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <h2 className="text-lg font-bold">오늘 청약 진행중</h2>
                <span className="text-gray-500 text-sm">({todaySubscriptions.length})</span>
              </div>
              <div className="space-y-3">
                {todaySubscriptions.map((subscription) => (
                  <SubscriptionCard key={subscription.id} subscription={subscription} />
                ))}
              </div>
            </motion.section>
          )}

          {/* 곧 시작할 단지 섹션 */}
          {upcomingSubscriptions.length > 0 && (
            <motion.section
              key="upcoming-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-8"
            >
              <div className="bg-[#1a1a24] -mx-4 px-4 py-3 mb-4">
                <h2 className="text-sm font-medium text-gray-400">1순위 청약 곧 시작할 단지</h2>
              </div>
              <div className="space-y-3">
                {upcomingSubscriptions.map((subscription) => (
                  <SubscriptionCard key={subscription.id} subscription={subscription} />
                ))}
              </div>
            </motion.section>
          )}

          {/* 당첨발표 완료 섹션 */}
          {announcedSubscriptions.length > 0 && (
            <motion.section
              key="announced-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="bg-[#1a1a24] -mx-4 px-4 py-3 mb-4">
                <h2 className="text-sm font-medium text-gray-400">당첨발표 완료</h2>
              </div>
              <div className="space-y-3">
                {announcedSubscriptions.map((subscription) => (
                  <SubscriptionCard key={subscription.id} subscription={subscription} />
                ))}
              </div>
            </motion.section>
          )}

          {/* 결과 없음 */}
          {filteredSubscriptions.length === 0 && (
            <motion.div
              key="empty-section"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <Building2 className="w-16 h-16 text-gray-700 mx-auto mb-4" />
              <p className="text-gray-500">조건에 맞는 분양 정보가 없습니다.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

function SubscriptionCard({ subscription }: { subscription: typeof MOCK_SUBSCRIPTIONS[0] }) {
  const status = getStatusText(subscription);

  return (
    <Link href={`/subscription/${subscription.id}`}>
      <motion.div
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className="bg-[#12121a] border border-white/5 rounded-xl p-4 hover:border-white/10 transition-all cursor-pointer"
      >
        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0">
            {/* 단지명 */}
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-bold text-white truncate">{subscription.name}</h3>
              {subscription.isHot && <Flame className="w-4 h-4 text-orange-500 flex-shrink-0" />}
            </div>

            {/* 정보 태그 */}
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
              <span>{subscription.type}</span>
              <span className="text-gray-600">|</span>
              <span>{subscription.buildingType}</span>
              <span className="text-gray-600">|</span>
              <span>{subscription.households.toLocaleString()}세대</span>
            </div>

            {/* 주소 */}
            <div className="flex items-center gap-1 text-sm">
              <MapPin className="w-3.5 h-3.5 text-gray-500" />
              <span className="text-blue-400 hover:underline">{subscription.address}</span>
            </div>

            {/* 평당가 */}
            <div className="mt-2 text-xs text-gray-500">
              평당 {formatPrice(subscription.pricePerPyeong)}원
            </div>
          </div>

          {/* 상태 */}
          <div className="text-right flex-shrink-0 ml-4">
            <p className={`text-sm font-medium ${status.isToday ? 'text-blue-400' : 'text-gray-400'}`}>
              {status.primary}
            </p>
            <p className="text-xs text-gray-500 mt-1">{status.secondary}</p>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
