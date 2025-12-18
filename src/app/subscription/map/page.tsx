'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Map,
  List,
  Search,
  Building2,
  MapPin,
  Flame,
  ChevronRight,
  X,
  Calendar,
  Users,
  ArrowLeft,
} from 'lucide-react';
import KakaoMap from '@/components/map/KakaoMap';

// 분양 데이터 (좌표 포함)
const SUBSCRIPTIONS = [
  {
    id: '2025000524',
    name: '용인 푸르지오 원클러스터파크',
    type: '민영주택',
    households: 710,
    region: '경기',
    address: '경기도 용인시 처인구 양지면',
    lat: 37.2347,
    lng: 127.2892,
    pricePerPyeong: 1651,
    subscriptionDate: '2025-12-17',
    status: 'ongoing',
    isHot: true,
  },
  {
    id: '2025000525',
    name: '역삼센트럴자이',
    type: '민영주택',
    households: 87,
    region: '서울',
    address: '서울특별시 강남구 역삼동',
    lat: 37.5000,
    lng: 127.0367,
    pricePerPyeong: 8500,
    subscriptionDate: '2025-12-15',
    status: 'ongoing',
    isHot: true,
  },
  {
    id: '2025000526',
    name: '한화포레나 부산대연',
    type: '민영주택',
    households: 104,
    region: '부산',
    address: '부산광역시 남구 대연동',
    lat: 35.1379,
    lng: 129.0845,
    pricePerPyeong: 1820,
    subscriptionDate: '2025-12-22',
    status: 'upcoming',
    isHot: false,
  },
  {
    id: '2025000527',
    name: '이천 중리지구 금성백조 예미지',
    type: '민영주택',
    households: 1009,
    region: '경기',
    address: '경기도 이천시 중리지구',
    lat: 37.2792,
    lng: 127.4350,
    pricePerPyeong: 1450,
    subscriptionDate: '2025-12-22',
    status: 'upcoming',
    isHot: false,
  },
  {
    id: '2025000528',
    name: '검단신도시 AB22블록 제일풍경채',
    type: '민영주택',
    households: 584,
    region: '인천',
    address: '인천광역시 서구 검단동',
    lat: 37.5965,
    lng: 126.6821,
    pricePerPyeong: 1580,
    subscriptionDate: '2025-12-23',
    status: 'upcoming',
    isHot: true,
  },
  {
    id: '2025000529',
    name: '광명 철산자이 더헤리티지',
    type: '민영주택',
    households: 1240,
    region: '경기',
    address: '경기도 광명시 철산동',
    lat: 37.4759,
    lng: 126.8666,
    pricePerPyeong: 3200,
    subscriptionDate: '2025-12-10',
    status: 'announced',
    isHot: true,
    competitionRate: 45.2,
  },
  {
    id: '2025000530',
    name: '힐스테이트 대구역 센트럴',
    type: '민영주택',
    households: 892,
    region: '대구',
    address: '대구광역시 북구 칠성동',
    lat: 35.8814,
    lng: 128.5963,
    pricePerPyeong: 1680,
    subscriptionDate: '2025-12-08',
    status: 'announced',
    isHot: false,
    competitionRate: 12.8,
  },
  {
    id: '2025000531',
    name: '세종 6-3생활권 더샵',
    type: '민영주택',
    households: 1456,
    region: '세종',
    address: '세종특별자치시 6-3생활권',
    lat: 36.4800,
    lng: 127.2890,
    pricePerPyeong: 1720,
    subscriptionDate: '2025-12-26',
    status: 'upcoming',
    isHot: true,
  },
];

const REGIONS = ['전국', '서울', '경기', '부산', '대구', '인천', '세종'];

function formatPricePerPyeong(price: number): string {
  if (price >= 10000) {
    return `${(price / 10000).toFixed(1)}억`;
  }
  return `${price.toLocaleString()}만`;
}

function getStatusBadge(status: string) {
  switch (status) {
    case 'ongoing':
      return { text: '청약중', color: 'bg-red-500' };
    case 'upcoming':
      return { text: '청약예정', color: 'bg-blue-500' };
    case 'announced':
      return { text: '당첨발표', color: 'bg-green-500' };
    default:
      return { text: '마감', color: 'bg-gray-500' };
  }
}

export default function SubscriptionMapPage() {
  const [selectedRegion, setSelectedRegion] = useState('전국');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubscription, setSelectedSubscription] = useState<typeof SUBSCRIPTIONS[0] | null>(null);
  const [mapCenter, setMapCenter] = useState({ lat: 37.5, lng: 127.0 }); // 서울 강남권 중심
  const [mapLevel, setMapLevel] = useState(9); // 수도권 보기
  const [showList, setShowList] = useState(true);

  // 필터링된 분양 목록
  const filteredSubscriptions = SUBSCRIPTIONS.filter((sub) => {
    if (selectedRegion !== '전국' && sub.region !== selectedRegion) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        sub.name.toLowerCase().includes(query) ||
        sub.address.toLowerCase().includes(query)
      );
    }
    return true;
  });

  // 리스트 아이템 클릭 시 지도 이동
  const handleListItemClick = useCallback((subscription: typeof SUBSCRIPTIONS[0]) => {
    setSelectedSubscription(subscription);
    setMapCenter({ lat: subscription.lat, lng: subscription.lng });
    setMapLevel(4); // 상세 보기
  }, []);

  // 마커 클릭 핸들러
  const handleMarkerClick = useCallback((marker: { id: string }) => {
    const sub = SUBSCRIPTIONS.find((s) => s.id === marker.id);
    if (sub) {
      setSelectedSubscription(sub);
    }
  }, []);

  // 지도 마커 데이터
  const markers = filteredSubscriptions.map((sub) => ({
    id: sub.id,
    lat: sub.lat,
    lng: sub.lng,
    type: 'apartment' as const,
    title: sub.name.length > 10 ? sub.name.substring(0, 10) + '...' : sub.name,
    price: `평당 ${formatPricePerPyeong(sub.pricePerPyeong)}`,
    info: `${sub.households.toLocaleString()}세대`,
  }));

  return (
    <div className="h-screen bg-[#0a0a0f] text-white flex flex-col">
      {/* Header */}
      <header className="flex-shrink-0 bg-[#12121a] border-b border-white/5 px-4 py-3 z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/subscription" className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-2">
              <Map className="w-5 h-5 text-blue-400" />
              <span className="font-bold">지도로 분양 찾기</span>
            </div>
          </div>
          <button
            onClick={() => setShowList(!showList)}
            className="flex items-center gap-2 px-3 py-1.5 bg-[#1a1a24] rounded-lg hover:bg-[#22222e] transition-colors"
          >
            {showList ? <Map className="w-4 h-4" /> : <List className="w-4 h-4" />}
            <span className="text-sm">{showList ? '지도만' : '목록'}</span>
          </button>
        </div>

        {/* 검색 + 지역 필터 */}
        <div className="mt-3 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="분양 단지명 검색"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#1a1a24] border border-white/10 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
            />
          </div>
        </div>

        {/* 지역 필터 */}
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {REGIONS.map((region) => (
            <button
              key={region}
              onClick={() => {
                setSelectedRegion(region);
                if (region === '전국') {
                  setMapCenter({ lat: 37.5, lng: 127.0 });
                  setMapLevel(9);
                }
              }}
              className={`px-3 py-1 rounded-full text-sm whitespace-nowrap transition-all ${
                selectedRegion === region
                  ? 'bg-blue-500 text-white'
                  : 'bg-[#1a1a24] text-gray-400 hover:bg-[#22222e]'
              }`}
            >
              {region}
            </button>
          ))}
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* 지도 */}
        <div className={`flex-1 relative ${showList ? 'hidden md:block' : 'block'}`}>
          <KakaoMap
            center={mapCenter}
            level={mapLevel}
            markers={markers}
            onMarkerClick={handleMarkerClick}
            className="w-full h-full"
          />

          {/* 선택된 분양 팝업 */}
          <AnimatePresence>
            {selectedSubscription && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-[#12121a] border border-white/10 rounded-xl shadow-2xl overflow-hidden"
              >
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusBadge(selectedSubscription.status).color}`}>
                        {getStatusBadge(selectedSubscription.status).text}
                      </span>
                      {selectedSubscription.isHot && (
                        <Flame className="w-4 h-4 text-orange-500" />
                      )}
                    </div>
                    <button
                      onClick={() => setSelectedSubscription(null)}
                      className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>

                  <h3 className="font-bold text-lg mb-1">{selectedSubscription.name}</h3>

                  <div className="flex items-center gap-1 text-sm text-gray-400 mb-3">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{selectedSubscription.address}</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="bg-[#1a1a24] rounded-lg p-2 text-center">
                      <p className="text-xs text-gray-500">세대수</p>
                      <p className="font-medium">{selectedSubscription.households.toLocaleString()}</p>
                    </div>
                    <div className="bg-[#1a1a24] rounded-lg p-2 text-center">
                      <p className="text-xs text-gray-500">평당가</p>
                      <p className="font-medium text-blue-400">{formatPricePerPyeong(selectedSubscription.pricePerPyeong)}</p>
                    </div>
                    <div className="bg-[#1a1a24] rounded-lg p-2 text-center">
                      <p className="text-xs text-gray-500">청약일</p>
                      <p className="font-medium">{selectedSubscription.subscriptionDate.slice(5)}</p>
                    </div>
                  </div>

                  <Link
                    href={`/subscription/${selectedSubscription.id}`}
                    className="flex items-center justify-center gap-2 w-full py-2.5 bg-blue-500 hover:bg-blue-600 rounded-lg font-medium transition-colors"
                  >
                    상세정보 보기
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 지도 하단 카운트 */}
          <div className="absolute top-4 left-4 bg-[#12121a]/90 backdrop-blur-sm px-3 py-2 rounded-lg border border-white/10">
            <span className="text-sm">
              <span className="text-blue-400 font-bold">{filteredSubscriptions.length}</span>개 분양
            </span>
          </div>
        </div>

        {/* 목록 패널 */}
        <AnimatePresence>
          {showList && (
            <motion.div
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              className={`w-full md:w-96 bg-[#0a0a0f] border-l border-white/5 flex flex-col ${
                showList ? 'block' : 'hidden'
              }`}
            >
              {/* 목록 헤더 */}
              <div className="flex-shrink-0 p-4 border-b border-white/5">
                <div className="flex items-center justify-between">
                  <h2 className="font-bold flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-blue-400" />
                    분양 목록
                  </h2>
                  <span className="text-sm text-gray-400">{filteredSubscriptions.length}건</span>
                </div>
              </div>

              {/* 목록 */}
              <div className="flex-1 overflow-y-auto">
                {filteredSubscriptions.map((subscription) => (
                  <motion.div
                    key={subscription.id}
                    onClick={() => handleListItemClick(subscription)}
                    className={`p-4 border-b border-white/5 cursor-pointer hover:bg-[#12121a] transition-colors ${
                      selectedSubscription?.id === subscription.id ? 'bg-[#12121a] border-l-2 border-l-blue-500' : ''
                    }`}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusBadge(subscription.status).color}`}>
                          {getStatusBadge(subscription.status).text}
                        </span>
                        {subscription.isHot && (
                          <Flame className="w-4 h-4 text-orange-500" />
                        )}
                      </div>
                      <span className="text-xs text-gray-500">{subscription.region}</span>
                    </div>

                    <h3 className="font-medium mb-1 line-clamp-1">{subscription.name}</h3>

                    <p className="text-sm text-gray-400 mb-2 line-clamp-1">{subscription.address}</p>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-3 text-gray-500">
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5" />
                          {subscription.households.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {subscription.subscriptionDate.slice(5)}
                        </span>
                      </div>
                      <span className="font-medium text-blue-400">
                        {formatPricePerPyeong(subscription.pricePerPyeong)}/평
                      </span>
                    </div>

                    {subscription.competitionRate && (
                      <div className="mt-2 text-sm">
                        <span className="text-orange-400">경쟁률 {subscription.competitionRate}:1</span>
                      </div>
                    )}
                  </motion.div>
                ))}

                {filteredSubscriptions.length === 0 && (
                  <div className="p-8 text-center text-gray-500">
                    <Building2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>조건에 맞는 분양이 없습니다.</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
