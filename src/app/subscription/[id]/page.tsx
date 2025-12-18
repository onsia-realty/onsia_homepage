'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Building2,
  Calendar,
  MapPin,
  Users,
  Home,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Phone,
  Clock,
  Award,
  TrendingUp,
  Flame,
  Share2,
  Heart,
  FileText
} from 'lucide-react';
import { useState, useMemo } from 'react';
import KakaoMap from '@/components/map/KakaoMap';

// Mock 상세 분양 데이터
const MOCK_SUBSCRIPTION_DETAILS: Record<string, SubscriptionDetail> = {
  '2025000524': {
    id: '2025000524',
    name: '용인 푸르지오 원클러스터파크',
    type: '민영주택',
    buildingType: '아파트',
    households: 710,
    region: '경기',
    address: '경기도 용인시 처인구 양지면 양지리',
    addressDetail: '양지리 일원',
    developer: '대우건설',
    contractor: '대우건설(주)',
    supervisionCompany: '(주)희림종합건축사사무소',
    subscriptionStart: '2025-12-17',
    subscriptionEnd: '2025-12-19',
    announcementDate: '2025-12-26',
    moveInDate: '2028-12',
    status: 'today',
    isHot: true,
    viewCount: 15420,
    pricePerPyeong: 1651,
    heatingType: '지역난방',
    lat: 37.2347,
    lng: 127.2892,
    supplySchedule: {
      specialSupply: '2025-12-17',
      firstPriority: '2025-12-18',
      secondPriority: '2025-12-19',
      announcement: '2025-12-26',
      contract: '2026-01-06 ~ 2026-01-08',
    },
    supplyTypes: [
      { type: '59A', area: 59.98, supplyArea: 84.12, households: 120, price: 38000, pricePerPyeong: 1520 },
      { type: '59B', area: 59.95, supplyArea: 84.45, households: 80, price: 38500, pricePerPyeong: 1540 },
      { type: '74A', area: 74.92, supplyArea: 99.87, households: 150, price: 47000, pricePerPyeong: 1580 },
      { type: '84A', area: 84.97, supplyArea: 114.23, households: 200, price: 55000, pricePerPyeong: 1620 },
      { type: '84B', area: 84.89, supplyArea: 114.15, households: 100, price: 56000, pricePerPyeong: 1650 },
      { type: '101A', area: 101.45, supplyArea: 134.56, households: 60, price: 69000, pricePerPyeong: 1720 },
    ],
    specialSupply: {
      multiChild: 72,
      newlywed: 142,
      firstHome: 142,
      elderly: 36,
      institution: 36,
      others: 0,
      total: 428,
    },
    competitionRates: [
      { region: '경기', type: '59A', applicants: 1250, supply: 60, rate: 20.83 },
      { region: '경기', type: '74A', applicants: 980, supply: 75, rate: 13.07 },
      { region: '경기', type: '84A', applicants: 1560, supply: 100, rate: 15.60 },
      { region: '기타', type: '59A', applicants: 340, supply: 60, rate: 5.67 },
      { region: '기타', type: '74A', applicants: 280, supply: 75, rate: 3.73 },
      { region: '기타', type: '84A', applicants: 420, supply: 100, rate: 4.20 },
    ],
    images: [
      '/images/subscription/2025000524/bird.jpg',
      '/images/subscription/2025000524/entrance.jpg',
      '/images/subscription/2025000524/lobby.jpg',
    ],
    nearbyCompare: [
      { name: '양지리더샵', distance: '1.2km', pricePerPyeong: 1420, yearBuilt: 2022 },
      { name: '양지코오롱하늘채', distance: '0.8km', pricePerPyeong: 1380, yearBuilt: 2021 },
      { name: '처인롯데캐슬', distance: '2.5km', pricePerPyeong: 1550, yearBuilt: 2023 },
    ],
    applyUrl: 'https://www.applyhome.co.kr',
  },
  '2025000525': {
    id: '2025000525',
    name: '역삼센트럴자이',
    type: '민영주택',
    buildingType: '아파트',
    households: 87,
    region: '서울',
    address: '서울특별시 강남구 역삼동',
    addressDetail: '역삼동 일원',
    developer: 'GS건설',
    contractor: 'GS건설(주)',
    supervisionCompany: '(주)정림건축종합건축사사무소',
    subscriptionStart: '2025-12-15',
    subscriptionEnd: '2025-12-18',
    announcementDate: '2025-12-24',
    moveInDate: '2027-06',
    status: 'today',
    isHot: true,
    viewCount: 28350,
    pricePerPyeong: 8500,
    heatingType: '지역난방',
    lat: 37.5000,
    lng: 127.0367,
    supplySchedule: {
      specialSupply: '2025-12-15',
      firstPriority: '2025-12-16',
      secondPriority: '2025-12-18',
      announcement: '2025-12-24',
      contract: '2026-01-02 ~ 2026-01-05',
    },
    supplyTypes: [
      { type: '59A', area: 59.92, supplyArea: 79.85, households: 27, price: 158000, pricePerPyeong: 8200 },
      { type: '84A', area: 84.98, supplyArea: 112.34, households: 40, price: 225000, pricePerPyeong: 8450 },
      { type: '114A', area: 114.85, supplyArea: 148.92, households: 20, price: 320000, pricePerPyeong: 8900 },
    ],
    specialSupply: {
      multiChild: 9,
      newlywed: 17,
      firstHome: 17,
      elderly: 4,
      institution: 4,
      others: 0,
      total: 51,
    },
    competitionRates: [
      { region: '서울', type: '59A', applicants: 4520, supply: 14, rate: 322.86 },
      { region: '서울', type: '84A', applicants: 6230, supply: 20, rate: 311.50 },
      { region: '기타', type: '59A', applicants: 1280, supply: 13, rate: 98.46 },
      { region: '기타', type: '84A', applicants: 1850, supply: 20, rate: 92.50 },
    ],
    images: [],
    nearbyCompare: [
      { name: '역삼래미안', distance: '0.3km', pricePerPyeong: 8100, yearBuilt: 2019 },
      { name: '역삼아이파크', distance: '0.5km', pricePerPyeong: 7850, yearBuilt: 2018 },
      { name: '테헤란로자이', distance: '0.7km', pricePerPyeong: 8300, yearBuilt: 2021 },
    ],
    applyUrl: 'https://www.applyhome.co.kr',
  },
};

// 기본 상세 데이터 (없는 ID용)
const DEFAULT_DETAIL: SubscriptionDetail = {
  id: 'default',
  name: '분양 정보',
  type: '민영주택',
  buildingType: '아파트',
  households: 500,
  region: '경기',
  address: '경기도 일원',
  addressDetail: '',
  developer: '건설사',
  contractor: '건설사(주)',
  supervisionCompany: '감리사',
  subscriptionStart: '2025-12-20',
  subscriptionEnd: '2025-12-22',
  announcementDate: '2025-12-29',
  moveInDate: '2028-06',
  status: 'upcoming',
  isHot: false,
  viewCount: 1000,
  pricePerPyeong: 1500,
  heatingType: '지역난방',
  lat: 37.5,
  lng: 127.0,
  supplySchedule: {
    specialSupply: '2025-12-20',
    firstPriority: '2025-12-21',
    secondPriority: '2025-12-22',
    announcement: '2025-12-29',
    contract: '2026-01-10 ~ 2026-01-12',
  },
  supplyTypes: [
    { type: '59A', area: 59.0, supplyArea: 84.0, households: 150, price: 40000, pricePerPyeong: 1500 },
    { type: '84A', area: 84.0, supplyArea: 114.0, households: 200, price: 55000, pricePerPyeong: 1600 },
  ],
  specialSupply: {
    multiChild: 50,
    newlywed: 100,
    firstHome: 100,
    elderly: 25,
    institution: 25,
    others: 0,
    total: 300,
  },
  competitionRates: [],
  images: [],
  nearbyCompare: [],
  applyUrl: 'https://www.applyhome.co.kr',
};

interface SupplyType {
  type: string;
  area: number;
  supplyArea: number;
  households: number;
  price: number;
  pricePerPyeong: number;
}

interface SpecialSupply {
  multiChild: number;
  newlywed: number;
  firstHome: number;
  elderly: number;
  institution: number;
  others: number;
  total: number;
}

interface CompetitionRate {
  region: string;
  type: string;
  applicants: number;
  supply: number;
  rate: number;
}

interface NearbyCompare {
  name: string;
  distance: string;
  pricePerPyeong: number;
  yearBuilt: number;
}

interface SubscriptionDetail {
  id: string;
  name: string;
  type: string;
  buildingType: string;
  households: number;
  region: string;
  address: string;
  addressDetail: string;
  developer: string;
  contractor: string;
  supervisionCompany: string;
  subscriptionStart: string;
  subscriptionEnd: string;
  announcementDate: string;
  moveInDate: string;
  status: string;
  isHot: boolean;
  viewCount: number;
  pricePerPyeong: number;
  heatingType: string;
  lat: number;
  lng: number;
  supplySchedule: {
    specialSupply: string;
    firstPriority: string;
    secondPriority: string;
    announcement: string;
    contract: string;
  };
  supplyTypes: SupplyType[];
  specialSupply: SpecialSupply;
  competitionRates: CompetitionRate[];
  images: string[];
  nearbyCompare: NearbyCompare[];
  applyUrl: string;
}

function formatPrice(price: number): string {
  if (price >= 10000) {
    const uk = Math.floor(price / 10000);
    const man = price % 10000;
    if (man === 0) return `${uk}억`;
    return `${uk}억 ${man.toLocaleString()}만`;
  }
  return `${price.toLocaleString()}만`;
}

// 평당가 포맷 (만원 단위 → 억/만 표시)
function formatPricePerPyeong(pricePerPyeong: number): string {
  if (pricePerPyeong >= 10000) {
    // 1억 이상
    const uk = pricePerPyeong / 10000;
    return `${uk.toFixed(1)}억`;
  }
  return `${pricePerPyeong.toLocaleString()}만`;
}

// 모든 분양 데이터 (지도에 표시용) - lat/lng 포함
const ALL_SUBSCRIPTIONS = [
  {
    id: '2025000524',
    name: '용인 푸르지오 원클러스터파크',
    lat: 37.2347,
    lng: 127.2892,
    pricePerPyeong: 1651,
    households: 710,
  },
  {
    id: '2025000525',
    name: '역삼센트럴자이',
    lat: 37.5000,
    lng: 127.0367,
    pricePerPyeong: 8500,
    households: 87,
  },
  {
    id: '2025000526',
    name: '한화포레나 부산대연',
    lat: 35.1379,
    lng: 129.0845,
    pricePerPyeong: 1820,
    households: 104,
  },
  {
    id: '2025000527',
    name: '이천 중리지구 금성백조',
    lat: 37.2792,
    lng: 127.4350,
    pricePerPyeong: 1450,
    households: 1009,
  },
  {
    id: '2025000528',
    name: '검단신도시 제일풍경채',
    lat: 37.5965,
    lng: 126.6821,
    pricePerPyeong: 1580,
    households: 584,
  },
  {
    id: '2025000529',
    name: '광명 철산자이 더헤리티지',
    lat: 37.4759,
    lng: 126.8666,
    pricePerPyeong: 3200,
    households: 1240,
  },
  {
    id: '2025000530',
    name: '힐스테이트 대구역 센트럴',
    lat: 35.8814,
    lng: 128.5963,
    pricePerPyeong: 1680,
    households: 892,
  },
  {
    id: '2025000531',
    name: '세종 6-3생활권 더샵',
    lat: 36.4800,
    lng: 127.2890,
    pricePerPyeong: 1720,
    households: 1456,
  },
];

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return `${date.getMonth() + 1}월 ${date.getDate()}일`;
}

function formatFullDate(dateStr: string): string {
  const date = new Date(dateStr);
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}(${days[date.getDay()]})`;
}

function getDaysUntil(dateStr: string): number {
  const target = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

function sqmToPyeong(sqm: number): string {
  return (sqm / 3.3058).toFixed(0);
}

export default function SubscriptionDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [isLiked, setIsLiked] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'supply' | 'competition' | 'map'>('info');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    basic: true,
    schedule: true,
    supply: true,
    special: false,
    competition: true,
    compare: false,
  });
  const [visibleSubscriptions, setVisibleSubscriptions] = useState(ALL_SUBSCRIPTIONS);
  const [mapLevel, setMapLevel] = useState(6); // 더 넓은 범위로 시작

  const subscription = MOCK_SUBSCRIPTION_DETAILS[id] || { ...DEFAULT_DETAIL, id, name: `분양 ${id}` };

  // 지도 범위 변경 시 해당 범위 내 매물 필터링
  const handleBoundsChange = (bounds: { sw: { lat: number; lng: number }; ne: { lat: number; lng: number } }) => {
    const filtered = ALL_SUBSCRIPTIONS.filter((sub) => {
      return (
        sub.lat >= bounds.sw.lat &&
        sub.lat <= bounds.ne.lat &&
        sub.lng >= bounds.sw.lng &&
        sub.lng <= bounds.ne.lng
      );
    });
    setVisibleSubscriptions(filtered.length > 0 ? filtered : ALL_SUBSCRIPTIONS);
  };

  // 마커 클릭 시 해당 분양 상세로 이동
  const handleMarkerClick = (marker: { id: string }) => {
    if (marker.id !== id) {
      window.location.href = `/subscription/${marker.id}`;
    }
  };

  const daysUntilStart = getDaysUntil(subscription.subscriptionStart);
  const daysUntilAnnounce = getDaysUntil(subscription.announcementDate);

  const statusBadge = useMemo(() => {
    if (daysUntilStart <= 0 && getDaysUntil(subscription.subscriptionEnd) >= 0) {
      return { text: '청약진행중', color: 'bg-red-500' };
    }
    if (daysUntilStart > 0 && daysUntilStart <= 7) {
      return { text: `D-${daysUntilStart}`, color: 'bg-blue-500' };
    }
    if (daysUntilStart > 7) {
      return { text: '청약예정', color: 'bg-gray-500' };
    }
    return { text: '청약마감', color: 'bg-gray-600' };
  }, [daysUntilStart, subscription.subscriptionEnd]);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0a0a0f]/95 backdrop-blur-md border-b border-white/5">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/subscription" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span>분양정보</span>
            </Link>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`p-2 rounded-full transition-colors ${isLiked ? 'text-red-500' : 'text-gray-400 hover:text-white'}`}
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
              </button>
              <button className="p-2 rounded-full text-gray-400 hover:text-white transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#12121a] to-[#0a0a0f] border-b border-white/5">
        <div className="max-w-3xl mx-auto px-4 py-6">
          {/* 상태 배지 */}
          <div className="flex items-center gap-2 mb-3">
            <span className={`px-2.5 py-1 rounded text-xs font-medium ${statusBadge.color}`}>
              {statusBadge.text}
            </span>
            {subscription.isHot && (
              <span className="flex items-center gap-1 px-2.5 py-1 rounded bg-orange-500/20 text-orange-400 text-xs font-medium">
                <Flame className="w-3 h-3" /> HOT
              </span>
            )}
            <span className="text-xs text-gray-500">{subscription.type}</span>
          </div>

          {/* 단지명 */}
          <h1 className="text-2xl font-bold mb-2">{subscription.name}</h1>

          {/* 주소 */}
          <div className="flex items-center gap-1 text-gray-400 text-sm mb-4">
            <MapPin className="w-4 h-4" />
            <span>{subscription.address}</span>
          </div>

          {/* 핵심 정보 */}
          <div className="grid grid-cols-4 gap-3 bg-[#1a1a24] rounded-xl p-4">
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-1">청약일</p>
              <p className="text-sm font-medium">{formatDate(subscription.subscriptionStart)}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-1">당첨발표</p>
              <p className="text-sm font-medium">{formatDate(subscription.announcementDate)}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-1">입주예정</p>
              <p className="text-sm font-medium">{subscription.moveInDate}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-1">세대수</p>
              <p className="text-sm font-medium">{subscription.households.toLocaleString()}세대</p>
            </div>
          </div>

          {/* 청약하기 버튼 */}
          <a
            href={subscription.applyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full mt-4 py-3.5 bg-blue-500 hover:bg-blue-600 rounded-xl font-medium transition-colors"
          >
            <FileText className="w-5 h-5" />
            청약홈에서 청약하기
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </section>

      {/* Tab Navigation */}
      <div className="sticky top-[57px] z-40 bg-[#0a0a0f] border-b border-white/5">
        <div className="max-w-3xl mx-auto px-4">
          <div className="flex">
            {[
              { key: 'info', label: '기본정보' },
              { key: 'supply', label: '공급대상' },
              { key: 'competition', label: '경쟁률' },
              { key: 'map', label: '위치' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as typeof activeTab)}
                className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.key
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-4 py-6">
        {/* 기본정보 탭 */}
        {activeTab === 'info' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* 청약일정 */}
            <div className="bg-[#12121a] rounded-xl border border-white/5 overflow-hidden">
              <button
                onClick={() => toggleSection('schedule')}
                className="flex items-center justify-between w-full p-4 text-left"
              >
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-400" />
                  <span className="font-medium">청약일정</span>
                </div>
                {expandedSections.schedule ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
              </button>
              {expandedSections.schedule && (
                <div className="px-4 pb-4">
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-white/5">
                      <span className="text-gray-400">특별공급</span>
                      <span className="font-medium">{formatFullDate(subscription.supplySchedule.specialSupply)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-white/5">
                      <span className="text-gray-400">1순위 청약</span>
                      <span className="font-medium">{formatFullDate(subscription.supplySchedule.firstPriority)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-white/5">
                      <span className="text-gray-400">2순위 청약</span>
                      <span className="font-medium">{formatFullDate(subscription.supplySchedule.secondPriority)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-white/5">
                      <span className="text-gray-400">당첨자 발표</span>
                      <span className="font-medium text-blue-400">{formatFullDate(subscription.supplySchedule.announcement)}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-gray-400">계약기간</span>
                      <span className="font-medium">{subscription.supplySchedule.contract}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 기본정보 */}
            <div className="bg-[#12121a] rounded-xl border border-white/5 overflow-hidden">
              <button
                onClick={() => toggleSection('basic')}
                className="flex items-center justify-between w-full p-4 text-left"
              >
                <div className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-blue-400" />
                  <span className="font-medium">기본정보</span>
                </div>
                {expandedSections.basic ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
              </button>
              {expandedSections.basic && (
                <div className="px-4 pb-4">
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-white/5">
                      <span className="text-gray-400">공급위치</span>
                      <span className="font-medium text-right max-w-[60%]">{subscription.address} {subscription.addressDetail}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-white/5">
                      <span className="text-gray-400">공급규모</span>
                      <span className="font-medium">{subscription.households.toLocaleString()}세대</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-white/5">
                      <span className="text-gray-400">건설업체</span>
                      <span className="font-medium">{subscription.contractor}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-white/5">
                      <span className="text-gray-400">시공사</span>
                      <span className="font-medium">{subscription.developer}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-white/5">
                      <span className="text-gray-400">감리사</span>
                      <span className="font-medium text-right max-w-[60%]">{subscription.supervisionCompany}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-white/5">
                      <span className="text-gray-400">난방방식</span>
                      <span className="font-medium">{subscription.heatingType}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-gray-400">입주예정</span>
                      <span className="font-medium">{subscription.moveInDate}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 경쟁단지 비교 */}
            {subscription.nearbyCompare.length > 0 && (
              <div className="bg-[#12121a] rounded-xl border border-white/5 overflow-hidden">
                <button
                  onClick={() => toggleSection('compare')}
                  className="flex items-center justify-between w-full p-4 text-left"
                >
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-400" />
                    <span className="font-medium">경쟁단지 가격비교</span>
                  </div>
                  {expandedSections.compare ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
                </button>
                {expandedSections.compare && (
                  <div className="px-4 pb-4">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-gray-500 border-b border-white/5">
                            <th className="text-left py-2 font-medium">단지명</th>
                            <th className="text-right py-2 font-medium">거리</th>
                            <th className="text-right py-2 font-medium">평당가</th>
                            <th className="text-right py-2 font-medium">준공</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-white/5 bg-blue-500/10">
                            <td className="py-3 font-medium text-blue-400">{subscription.name.split(' ')[0]}</td>
                            <td className="text-right text-gray-400">-</td>
                            <td className="text-right font-medium text-blue-400">{formatPricePerPyeong(subscription.pricePerPyeong)}</td>
                            <td className="text-right text-gray-400">{subscription.moveInDate}</td>
                          </tr>
                          {subscription.nearbyCompare.map((compare, index) => (
                            <tr key={index} className="border-b border-white/5 last:border-0">
                              <td className="py-3 font-medium">{compare.name}</td>
                              <td className="text-right text-gray-400">{compare.distance}</td>
                              <td className="text-right">{formatPricePerPyeong(compare.pricePerPyeong)}</td>
                              <td className="text-right text-gray-400">{compare.yearBuilt}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}

        {/* 공급대상 탭 */}
        {activeTab === 'supply' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* 일반공급 */}
            <div className="bg-[#12121a] rounded-xl border border-white/5 overflow-hidden">
              <button
                onClick={() => toggleSection('supply')}
                className="flex items-center justify-between w-full p-4 text-left"
              >
                <div className="flex items-center gap-2">
                  <Home className="w-5 h-5 text-blue-400" />
                  <span className="font-medium">공급대상 ({subscription.supplyTypes.length}개 타입)</span>
                </div>
                {expandedSections.supply ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
              </button>
              {expandedSections.supply && (
                <div className="px-4 pb-4">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-gray-500 border-b border-white/5">
                          <th className="text-left py-2 font-medium">타입</th>
                          <th className="text-right py-2 font-medium">전용면적</th>
                          <th className="text-right py-2 font-medium">세대수</th>
                          <th className="text-right py-2 font-medium">분양가</th>
                          <th className="text-right py-2 font-medium">평당가</th>
                        </tr>
                      </thead>
                      <tbody>
                        {subscription.supplyTypes.map((type, index) => (
                          <tr key={index} className="border-b border-white/5 last:border-0">
                            <td className="py-3 font-medium text-blue-400">{type.type}</td>
                            <td className="text-right">
                              <span>{type.area}㎡</span>
                              <span className="text-gray-500 ml-1">({sqmToPyeong(type.area)}평)</span>
                            </td>
                            <td className="text-right">{type.households}세대</td>
                            <td className="text-right font-medium">{formatPrice(type.price)}</td>
                            <td className="text-right text-gray-400">{formatPricePerPyeong(type.pricePerPyeong)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* 특별공급 */}
            <div className="bg-[#12121a] rounded-xl border border-white/5 overflow-hidden">
              <button
                onClick={() => toggleSection('special')}
                className="flex items-center justify-between w-full p-4 text-left"
              >
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-blue-400" />
                  <span className="font-medium">특별공급 ({subscription.specialSupply.total}세대)</span>
                </div>
                {expandedSections.special ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
              </button>
              {expandedSections.special && (
                <div className="px-4 pb-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex justify-between py-2 px-3 bg-[#1a1a24] rounded-lg">
                      <span className="text-gray-400">다자녀가구</span>
                      <span className="font-medium">{subscription.specialSupply.multiChild}세대</span>
                    </div>
                    <div className="flex justify-between py-2 px-3 bg-[#1a1a24] rounded-lg">
                      <span className="text-gray-400">신혼부부</span>
                      <span className="font-medium">{subscription.specialSupply.newlywed}세대</span>
                    </div>
                    <div className="flex justify-between py-2 px-3 bg-[#1a1a24] rounded-lg">
                      <span className="text-gray-400">생애최초</span>
                      <span className="font-medium">{subscription.specialSupply.firstHome}세대</span>
                    </div>
                    <div className="flex justify-between py-2 px-3 bg-[#1a1a24] rounded-lg">
                      <span className="text-gray-400">노부모부양</span>
                      <span className="font-medium">{subscription.specialSupply.elderly}세대</span>
                    </div>
                    <div className="flex justify-between py-2 px-3 bg-[#1a1a24] rounded-lg">
                      <span className="text-gray-400">기관추천</span>
                      <span className="font-medium">{subscription.specialSupply.institution}세대</span>
                    </div>
                    <div className="flex justify-between py-2 px-3 bg-blue-500/20 rounded-lg">
                      <span className="text-blue-400 font-medium">합계</span>
                      <span className="font-medium text-blue-400">{subscription.specialSupply.total}세대</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* 경쟁률 탭 */}
        {activeTab === 'competition' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="bg-[#12121a] rounded-xl border border-white/5 overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-400" />
                  <span className="font-medium">청약접수 경쟁률 현황</span>
                </div>
              </div>
              <div className="px-4 pb-4 pt-2">
                {subscription.competitionRates.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-gray-500 border-b border-white/5">
                          <th className="text-left py-2 font-medium">지역</th>
                          <th className="text-left py-2 font-medium">타입</th>
                          <th className="text-right py-2 font-medium">접수</th>
                          <th className="text-right py-2 font-medium">공급</th>
                          <th className="text-right py-2 font-medium">경쟁률</th>
                        </tr>
                      </thead>
                      <tbody>
                        {subscription.competitionRates.map((rate, index) => (
                          <tr key={index} className="border-b border-white/5 last:border-0">
                            <td className="py-3">{rate.region}</td>
                            <td className="py-3 font-medium text-blue-400">{rate.type}</td>
                            <td className="text-right">{rate.applicants.toLocaleString()}</td>
                            <td className="text-right">{rate.supply}</td>
                            <td className="text-right font-medium">
                              <span className={rate.rate > 50 ? 'text-red-400' : rate.rate > 10 ? 'text-orange-400' : 'text-green-400'}>
                                {rate.rate.toFixed(2)}:1
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>청약 접수 전입니다.</p>
                    <p className="text-sm mt-1">청약 접수가 시작되면 경쟁률이 표시됩니다.</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* 위치 탭 */}
        {activeTab === 'map' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="bg-[#12121a] rounded-xl border border-white/5 overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-400" />
                  <span className="font-medium">분양위치</span>
                </div>
              </div>
              <div className="p-4">
                <div className="rounded-xl h-[350px] overflow-hidden mb-4">
                  <KakaoMap
                    center={{ lat: subscription.lat, lng: subscription.lng }}
                    level={mapLevel}
                    markers={visibleSubscriptions.map((sub) => ({
                      id: sub.id,
                      lat: sub.lat,
                      lng: sub.lng,
                      type: 'apartment' as const,
                      title: sub.name.length > 12 ? sub.name.substring(0, 12) + '...' : sub.name,
                      price: `평당 ${formatPricePerPyeong(sub.pricePerPyeong)}`,
                      info: sub.id === id ? '현재 보는 매물' : `${sub.households.toLocaleString()}세대`,
                    }))}
                    onBoundsChange={handleBoundsChange}
                    onMarkerClick={handleMarkerClick}
                    className="w-full h-full rounded-xl"
                  />
                </div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm text-gray-400">
                    지도 내 <span className="text-blue-400 font-medium">{visibleSubscriptions.length}</span>개 분양 매물
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setMapLevel(Math.max(1, mapLevel - 1))}
                      className="px-2 py-1 text-xs bg-[#1a1a24] rounded hover:bg-[#22222e] transition-colors"
                    >
                      확대
                    </button>
                    <button
                      onClick={() => setMapLevel(Math.min(14, mapLevel + 1))}
                      className="px-2 py-1 text-xs bg-[#1a1a24] rounded hover:bg-[#22222e] transition-colors"
                    >
                      축소
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">{subscription.address}</p>
                      {subscription.addressDetail && (
                        <p className="text-sm text-gray-400">{subscription.addressDetail}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 주변 시세 */}
            {subscription.nearbyCompare.length > 0 && (
              <div className="bg-[#12121a] rounded-xl border border-white/5 overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-blue-400" />
                    <span className="font-medium">주변 시세</span>
                  </div>
                </div>
                <div className="p-4">
                  <div className="space-y-3">
                    {subscription.nearbyCompare.map((compare, index) => (
                      <div key={index} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                        <div>
                          <p className="font-medium">{compare.name}</p>
                          <p className="text-xs text-gray-500">{compare.distance} | {compare.yearBuilt}년</p>
                        </div>
                        <p className="font-medium">{formatPricePerPyeong(compare.pricePerPyeong)}/평</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </main>

      {/* Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#0a0a0f]/95 backdrop-blur-md border-t border-white/5 p-4">
        <div className="max-w-3xl mx-auto flex gap-3">
          <button className="flex-1 py-3.5 bg-[#1a1a24] hover:bg-[#22222e] rounded-xl font-medium transition-colors flex items-center justify-center gap-2">
            <Phone className="w-5 h-5" />
            대표번호
          </button>
          <a
            href={subscription.applyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-3.5 bg-blue-500 hover:bg-blue-600 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
          >
            청약신청
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Bottom padding for fixed CTA */}
      <div className="h-24" />
    </div>
  );
}
