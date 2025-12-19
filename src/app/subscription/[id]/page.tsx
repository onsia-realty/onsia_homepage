'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
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
  FileText,
  X,
  ChevronRight,
  Layers,
  Info,
  Image as ImageIcon,
  Download,
  ZoomIn,
  ChevronLeft
} from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
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
    lat: 37.2324527,
    lng: 127.2901531,
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

interface ImageItem {
  url: string;
  name: string;
}

interface CategoryImages {
  category: string;
  label: string;
  images: ImageItem[];
}

interface SubscriptionImages {
  hasImages: boolean;
  categories: CategoryImages[];
  pdfUrl: string | null;
  totalImages: number;
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

function formatPricePerPyeong(pricePerPyeong: number): string {
  if (pricePerPyeong >= 10000) {
    const uk = pricePerPyeong / 10000;
    return `${uk.toFixed(1)}억`;
  }
  return `${pricePerPyeong.toLocaleString()}만`;
}

// 모든 분양 데이터 (지도에 표시용)
const ALL_SUBSCRIPTIONS = [
  { id: '2025000524', name: '용인 푸르지오 원클러스터파크', lat: 37.2324527, lng: 127.2901531, pricePerPyeong: 1651, households: 710 },
  { id: '2025000525', name: '역삼센트럴자이', lat: 37.5000, lng: 127.0367, pricePerPyeong: 8500, households: 87 },
  { id: '2025000526', name: '한화포레나 부산대연', lat: 35.1379, lng: 129.0845, pricePerPyeong: 1820, households: 104 },
  { id: '2025000527', name: '이천 중리지구 금성백조', lat: 37.2792, lng: 127.4350, pricePerPyeong: 1450, households: 1009 },
  { id: '2025000528', name: '검단신도시 제일풍경채', lat: 37.5965, lng: 126.6821, pricePerPyeong: 1580, households: 584 },
  { id: '2025000529', name: '광명 철산자이 더헤리티지', lat: 37.4759, lng: 126.8666, pricePerPyeong: 3200, households: 1240 },
  { id: '2025000530', name: '힐스테이트 대구역 센트럴', lat: 35.8814, lng: 128.5963, pricePerPyeong: 1680, households: 892 },
  { id: '2025000531', name: '세종 6-3생활권 더샵', lat: 36.4800, lng: 127.2890, pricePerPyeong: 1720, households: 1456 },
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
  const [activeSection, setActiveSection] = useState<'info' | 'supply' | 'schedule' | 'compare' | 'images'>('info');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [isPanelExpanded, setIsPanelExpanded] = useState(true);
  const [subscriptionImages, setSubscriptionImages] = useState<SubscriptionImages | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imagesLoading, setImagesLoading] = useState(true);

  // API 데이터 상태
  const [apiDetail, setApiDetail] = useState<{
    housingTypes: { type: string; modelNo: string; supplyArea: string; totalHouseholds: number; generalHouseholds: number; specialHouseholds: number; topPrice: number; pricePerPyeong: number }[];
    competition: { type: string; modelNo: string; supplyHouseholds: number; regions: { region: string; regionCode: string; requestCount: number; competitionRate: number | string; rank: number }[] }[];
    summary: { totalHouseholds: number; avgPricePerPyeong: number };
  } | null>(null);
  const [compareData, setCompareData] = useState<{
    complexes: { name: string; dong: string; avgPrice: number; avgPricePerPyeong: number; avgArea: number; recentDate: string; count: number; buildYear: string; priceDiff: number; priceDiffPercent: number }[];
    summary: { avgPricePerPyeong: number; marketDiffPercent: number; marketDiffText: string };
  } | null>(null);

  const subscription = MOCK_SUBSCRIPTION_DETAILS[id] || { ...DEFAULT_DETAIL, id, name: `분양 ${id}` };

  // 마커 클릭 시 해당 분양 상세로 이동
  const handleMarkerClick = (marker: { id: string }) => {
    if (marker.id !== id) {
      window.location.href = `/subscription/${marker.id}`;
    }
  };

  const daysUntilStart = getDaysUntil(subscription.subscriptionStart);

  const statusBadge = useMemo(() => {
    if (daysUntilStart <= 0 && getDaysUntil(subscription.subscriptionEnd) >= 0) {
      return { text: '청약진행중', color: 'bg-red-500', textColor: 'text-white' };
    }
    if (daysUntilStart > 0 && daysUntilStart <= 7) {
      return { text: `D-${daysUntilStart}`, color: 'bg-blue-500', textColor: 'text-white' };
    }
    if (daysUntilStart > 7) {
      return { text: '청약예정', color: 'bg-gray-600', textColor: 'text-white' };
    }
    return { text: '청약마감', color: 'bg-gray-700', textColor: 'text-gray-300' };
  }, [daysUntilStart, subscription.subscriptionEnd]);

  // 선택된 타입 초기화
  useEffect(() => {
    if (subscription.supplyTypes.length > 0 && !selectedType) {
      setSelectedType(subscription.supplyTypes[0].type);
    }
  }, [subscription.supplyTypes, selectedType]);

  // 이미지 데이터 로드
  useEffect(() => {
    const fetchImages = async () => {
      setImagesLoading(true);
      try {
        const response = await fetch(`/api/subscriptions/${id}/images`);
        const result = await response.json();
        if (result.success) {
          setSubscriptionImages(result.data);
        }
      } catch (error) {
        console.error('Failed to fetch images:', error);
      } finally {
        setImagesLoading(false);
      }
    };

    fetchImages();
  }, [id]);

  // API 상세 데이터 로드
  useEffect(() => {
    const fetchApiData = async () => {
      try {
        // 상세 정보 API 호출
        const detailRes = await fetch(`/api/subscriptions/${id}/detail`);
        const detailData = await detailRes.json();
        if (detailData.success && detailData.data) {
          setApiDetail(detailData.data);
        }

        // 경쟁단지 비교 API 호출
        const compareRes = await fetch(
          `/api/subscriptions/${id}/compare?address=${encodeURIComponent(subscription.address)}&pricePerPyeong=${subscription.pricePerPyeong}`
        );
        const compareResult = await compareRes.json();
        if (compareResult.success && compareResult.data) {
          setCompareData(compareResult.data);
        }
      } catch (error) {
        console.error('API 데이터 로드 실패:', error);
      }
    };

    fetchApiData();
  }, [id, subscription.address, subscription.pricePerPyeong]);

  const selectedSupplyType = subscription.supplyTypes.find(t => t.type === selectedType);

  return (
    <div className="h-screen w-full flex flex-col bg-white overflow-hidden">
      {/* 이미지 확대 모달 */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={selectedImage}
              alt="확대 이미지"
              className="max-w-full max-h-full object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 상단 헤더 - 아실 스타일 */}
      <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 flex-shrink-0 z-50">
        <div className="flex items-center gap-3">
          <Link href="/subscription/map" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${statusBadge.color} ${statusBadge.textColor}`}>
              {statusBadge.text}
            </span>
            {subscription.isHot && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-orange-100 text-orange-600 text-xs font-medium">
                <Flame className="w-3 h-3" /> HOT
              </span>
            )}
          </div>
          <h1 className="text-lg font-bold text-gray-900 truncate max-w-[300px]">{subscription.name}</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsLiked(!isLiked)}
            className={`p-2 rounded-full transition-colors ${isLiked ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
          </button>
          <button className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
            <Share2 className="w-5 h-5" />
          </button>
          <a
            href={subscription.applyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <FileText className="w-4 h-4" />
            청약신청
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </header>

      {/* 메인 컨텐츠 - 왼쪽 패널 + 오른쪽 지도 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 왼쪽 정보 패널 - 아실 스타일 */}
        <AnimatePresence>
          {isPanelExpanded && (
            <motion.div
              initial={{ x: '-100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '-100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-full lg:w-[420px] h-full bg-white border-r border-gray-200 flex flex-col overflow-hidden"
            >
              {/* 패널 헤더 */}
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">{subscription.region} · {subscription.type}</p>
                    <h2 className="text-xl font-bold text-gray-900">{subscription.name}</h2>
                  </div>
                  <button
                    onClick={() => setIsPanelExpanded(false)}
                    className="lg:hidden p-1.5 rounded-full hover:bg-gray-100"
                  >
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
                <div className="flex items-center gap-1 text-gray-600 text-sm">
                  <MapPin className="w-4 h-4" />
                  <span>{subscription.address}</span>
                </div>
              </div>

              {/* 핵심 정보 카드 */}
              <div className="p-4 border-b border-gray-100">
                <div className="grid grid-cols-4 gap-2">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">청약일</p>
                    <p className="text-sm font-bold text-gray-900">{formatDate(subscription.subscriptionStart)}</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">당첨발표</p>
                    <p className="text-sm font-bold text-gray-900">{formatDate(subscription.announcementDate)}</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">입주예정</p>
                    <p className="text-sm font-bold text-gray-900">{subscription.moveInDate}</p>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <p className="text-xs text-blue-600 mb-1">세대수</p>
                    <p className="text-sm font-bold text-blue-600">{subscription.households.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* 탭 네비게이션 */}
              <div className="flex border-b border-gray-200 overflow-x-auto">
                {[
                  { key: 'info', label: '기본정보', icon: Info },
                  { key: 'supply', label: '공급대상', icon: Home },
                  { key: 'schedule', label: '일정', icon: Calendar },
                  { key: 'compare', label: '시세비교', icon: TrendingUp },
                  { key: 'images', label: '단지정보', icon: ImageIcon, badge: subscriptionImages?.totalImages },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveSection(tab.key as typeof activeSection)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                      activeSection === tab.key
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                    {tab.badge && tab.badge > 0 && (
                      <span className="ml-1 px-1.5 py-0.5 text-xs bg-blue-100 text-blue-600 rounded-full">
                        {tab.badge}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* 스크롤 가능한 컨텐츠 영역 */}
              <div className="flex-1 overflow-y-auto">
                {/* 기본정보 */}
                {activeSection === 'info' && (
                  <div className="p-4 space-y-4">
                    {/* 이미지 갤러리 */}
                    {subscriptionImages?.hasImages && (
                      <div className="space-y-3">
                        {/* 대표 이미지 */}
                        {(subscriptionImages.categories.find(c => c.category === 'gallery')?.images[0] ||
                          subscriptionImages.categories.find(c => c.category === 'location')?.images[0]) && (
                          <div
                            onClick={() => setSelectedImage(
                              subscriptionImages.categories.find(c => c.category === 'gallery')?.images[0]?.url ||
                              subscriptionImages.categories.find(c => c.category === 'location')?.images[0]?.url || null
                            )}
                            className="relative aspect-video rounded-xl overflow-hidden cursor-pointer group"
                          >
                            <img
                              src={
                                subscriptionImages.categories.find(c => c.category === 'gallery')?.images[0]?.url ||
                                subscriptionImages.categories.find(c => c.category === 'location')?.images[0]?.url
                              }
                              alt="단지 대표 이미지"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                            <div className="absolute bottom-3 left-3 text-white">
                              <p className="text-sm font-medium">단지안내</p>
                            </div>
                            <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/50 px-2 py-1 rounded-full">
                              <ImageIcon className="w-3.5 h-3.5 text-white" />
                              <span className="text-white text-xs">{subscriptionImages.totalImages}장</span>
                            </div>
                          </div>
                        )}

                        {/* 썸네일 그리드 */}
                        <div className="grid grid-cols-4 gap-2">
                          {/* 배치도 */}
                          {subscriptionImages.categories.find(c => c.category === 'layout')?.images[0] && (
                            <div
                              onClick={() => setSelectedImage(subscriptionImages.categories.find(c => c.category === 'layout')?.images[0]?.url || null)}
                              className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group"
                            >
                              <img
                                src={subscriptionImages.categories.find(c => c.category === 'layout')?.images[0]?.url}
                                alt="단지배치도"
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                <span className="text-white text-xs font-medium">배치도</span>
                              </div>
                            </div>
                          )}
                          {/* 평면도 */}
                          {subscriptionImages.categories.find(c => c.category === 'floorplan')?.images[0] && (
                            <div
                              onClick={() => setSelectedImage(subscriptionImages.categories.find(c => c.category === 'floorplan')?.images[0]?.url || null)}
                              className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group"
                            >
                              <img
                                src={subscriptionImages.categories.find(c => c.category === 'floorplan')?.images[0]?.url}
                                alt="평면도"
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                <span className="text-white text-xs font-medium">평면도</span>
                              </div>
                            </div>
                          )}
                          {/* 호수표 */}
                          {subscriptionImages.categories.find(c => c.category === 'unit-layout')?.images[0] && (
                            <div
                              onClick={() => setSelectedImage(subscriptionImages.categories.find(c => c.category === 'unit-layout')?.images[0]?.url || null)}
                              className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group"
                            >
                              <img
                                src={subscriptionImages.categories.find(c => c.category === 'unit-layout')?.images[0]?.url}
                                alt="동호수배치표"
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                <span className="text-white text-xs font-medium">호수표</span>
                              </div>
                            </div>
                          )}
                          {/* 더보기 */}
                          <button
                            onClick={() => setActiveSection('images')}
                            className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 hover:bg-gray-200 transition-colors flex flex-col items-center justify-center"
                          >
                            <ImageIcon className="w-5 h-5 text-gray-500 mb-1" />
                            <span className="text-xs text-gray-600 font-medium">+{Math.max(0, subscriptionImages.totalImages - 3)}</span>
                          </button>
                        </div>

                        {/* 모집공고문 PDF */}
                        {subscriptionImages.pdfUrl && (
                          <a
                            href={subscriptionImages.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              <FileText className="w-5 h-5 text-red-500" />
                              <span className="text-sm font-medium text-gray-700">모집공고문 PDF</span>
                            </div>
                            <Download className="w-4 h-4 text-gray-400" />
                          </a>
                        )}
                      </div>
                    )}

                    {/* 기본 정보 테이블 */}
                    <div className="space-y-3">
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-500 text-sm">공급위치</span>
                        <span className="text-sm font-medium text-gray-900 text-right max-w-[60%]">
                          {subscription.address} {subscription.addressDetail}
                        </span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-500 text-sm">공급규모</span>
                        <span className="text-sm font-medium text-gray-900">{subscription.households.toLocaleString()}세대</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-500 text-sm">시공사</span>
                        <span className="text-sm font-medium text-gray-900">{subscription.developer}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-500 text-sm">건설업체</span>
                        <span className="text-sm font-medium text-gray-900">{subscription.contractor}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-500 text-sm">감리사</span>
                        <span className="text-sm font-medium text-gray-900 text-right max-w-[60%]">{subscription.supervisionCompany}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-500 text-sm">난방방식</span>
                        <span className="text-sm font-medium text-gray-900">{subscription.heatingType}</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-gray-500 text-sm">입주예정</span>
                        <span className="text-sm font-medium text-gray-900">{subscription.moveInDate}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 공급대상 */}
                {activeSection === 'supply' && (
                  <div className="p-4 space-y-4">
                    {/* 타입 선택 버튼 - API 데이터 우선, Mock 폴백 */}
                    <div className="flex flex-wrap gap-2">
                      {(apiDetail?.housingTypes && apiDetail.housingTypes.length > 0
                        ? apiDetail.housingTypes
                        : subscription.supplyTypes
                      ).map((type) => {
                        const typeKey = 'type' in type ? type.type : type.type;
                        return (
                          <button
                            key={typeKey}
                            onClick={() => setSelectedType(typeKey)}
                            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                              selectedType === typeKey
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            {typeKey}
                          </button>
                        );
                      })}
                    </div>

                    {/* 선택된 타입 상세 - API 데이터 우선 */}
                    {(() => {
                      const apiType = apiDetail?.housingTypes?.find(t => t.type === selectedType);
                      const mockType = subscription.supplyTypes.find(t => t.type === selectedType);
                      // 타입명에서 전용면적 추출 (예: 084.8950A → 84.895)
                      const extractArea = (typeName: string) => {
                        const match = typeName.match(/^(\d+)\.?(\d*)/);
                        if (match) {
                          return parseFloat(`${match[1]}.${match[2] || '0'}`);
                        }
                        return 0;
                      };

                      if (apiType) {
                        const area = extractArea(apiType.type);
                        return (
                          <div className="bg-blue-50 rounded-xl p-4">
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-lg font-bold text-blue-600">{apiType.type}타입</span>
                              <div className="text-right">
                                <span className="text-sm text-gray-500">{apiType.totalHouseholds}세대</span>
                                <span className="text-xs text-gray-400 ml-1">
                                  (일반 {apiType.generalHouseholds} / 특별 {apiType.specialHouseholds})
                                </span>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">전용면적</span>
                                <span className="text-sm font-medium">{area.toFixed(2)}㎡ ({sqmToPyeong(area)}평)</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">공급면적</span>
                                <span className="text-sm font-medium">{parseFloat(apiType.supplyArea).toFixed(2)}㎡</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">분양최고가</span>
                                <span className="text-sm font-bold text-blue-600">{formatPrice(apiType.topPrice)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">평당가</span>
                                <span className="text-sm font-medium">{formatPricePerPyeong(apiType.pricePerPyeong)}</span>
                              </div>
                            </div>
                          </div>
                        );
                      } else if (mockType) {
                        return (
                          <div className="bg-blue-50 rounded-xl p-4">
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-lg font-bold text-blue-600">{mockType.type}타입</span>
                              <span className="text-sm text-gray-500">{mockType.households}세대</span>
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">전용면적</span>
                                <span className="text-sm font-medium">{mockType.area}㎡ ({sqmToPyeong(mockType.area)}평)</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">공급면적</span>
                                <span className="text-sm font-medium">{mockType.supplyArea}㎡</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">분양가</span>
                                <span className="text-sm font-bold text-blue-600">{formatPrice(mockType.price)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">평당가</span>
                                <span className="text-sm font-medium">{formatPricePerPyeong(mockType.pricePerPyeong)}</span>
                              </div>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    })()}

                    {/* 경쟁률 - API 데이터 */}
                    {apiDetail?.competition && apiDetail.competition.length > 0 && (
                      <div className="mt-4">
                        <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-orange-500" />
                          청약 경쟁률
                        </h3>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="bg-gray-100">
                                <th className="py-2 px-3 text-left font-medium text-gray-600">타입</th>
                                <th className="py-2 px-3 text-center font-medium text-gray-600">해당지역</th>
                                <th className="py-2 px-3 text-center font-medium text-gray-600">기타지역</th>
                              </tr>
                            </thead>
                            <tbody>
                              {apiDetail.competition.slice(0, 5).map((comp, idx) => {
                                const localRegion = comp.regions.find(r => r.region === '해당지역');
                                const otherRegion = comp.regions.find(r => r.region === '기타지역');
                                return (
                                  <tr key={idx} className="border-b border-gray-100">
                                    <td className="py-2 px-3 font-medium text-gray-900">{comp.type}</td>
                                    <td className="py-2 px-3 text-center">
                                      <span className={`text-sm ${
                                        typeof localRegion?.competitionRate === 'string' && localRegion.competitionRate.includes('미달')
                                          ? 'text-red-500'
                                          : 'text-blue-600 font-bold'
                                      }`}>
                                        {localRegion?.competitionRate || '-'}
                                      </span>
                                    </td>
                                    <td className="py-2 px-3 text-center">
                                      <span className={`text-sm ${
                                        typeof otherRegion?.competitionRate === 'string' && otherRegion.competitionRate.includes('미달')
                                          ? 'text-red-500'
                                          : 'text-blue-600 font-bold'
                                      }`}>
                                        {otherRegion?.competitionRate || '-'}
                                      </span>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                        {apiDetail.competition.length > 5 && (
                          <p className="text-xs text-gray-400 mt-2 text-center">
                            외 {apiDetail.competition.length - 5}개 타입
                          </p>
                        )}
                      </div>
                    )}

                    {/* 특별공급 */}
                    <div className="mt-4">
                      <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <Award className="w-4 h-4 text-blue-500" />
                        특별공급 ({apiDetail?.summary?.totalHouseholds
                          ? Math.round((apiDetail.housingTypes?.reduce((sum, t) => sum + t.specialHouseholds, 0) || 0))
                          : subscription.specialSupply.total}세대)
                      </h3>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex justify-between py-2 px-3 bg-gray-50 rounded-lg">
                          <span className="text-xs text-gray-500">다자녀가구</span>
                          <span className="text-xs font-medium">{subscription.specialSupply.multiChild}세대</span>
                        </div>
                        <div className="flex justify-between py-2 px-3 bg-gray-50 rounded-lg">
                          <span className="text-xs text-gray-500">신혼부부</span>
                          <span className="text-xs font-medium">{subscription.specialSupply.newlywed}세대</span>
                        </div>
                        <div className="flex justify-between py-2 px-3 bg-gray-50 rounded-lg">
                          <span className="text-xs text-gray-500">생애최초</span>
                          <span className="text-xs font-medium">{subscription.specialSupply.firstHome}세대</span>
                        </div>
                        <div className="flex justify-between py-2 px-3 bg-gray-50 rounded-lg">
                          <span className="text-xs text-gray-500">노부모부양</span>
                          <span className="text-xs font-medium">{subscription.specialSupply.elderly}세대</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 일정 */}
                {activeSection === 'schedule' && (
                  <div className="p-4">
                    <div className="relative">
                      {/* 타임라인 */}
                      <div className="absolute left-3 top-3 bottom-3 w-0.5 bg-gray-200" />

                      <div className="space-y-4">
                        {[
                          { label: '특별공급', date: subscription.supplySchedule.specialSupply, isPast: getDaysUntil(subscription.supplySchedule.specialSupply) < 0 },
                          { label: '1순위 청약', date: subscription.supplySchedule.firstPriority, isPast: getDaysUntil(subscription.supplySchedule.firstPriority) < 0 },
                          { label: '2순위 청약', date: subscription.supplySchedule.secondPriority, isPast: getDaysUntil(subscription.supplySchedule.secondPriority) < 0 },
                          { label: '당첨자 발표', date: subscription.supplySchedule.announcement, isPast: getDaysUntil(subscription.supplySchedule.announcement) < 0, isHighlight: true },
                          { label: '계약기간', date: subscription.supplySchedule.contract, isPast: false },
                        ].map((item, index) => (
                          <div key={index} className="flex items-start gap-4 relative">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center z-10 ${
                              item.isHighlight ? 'bg-blue-500' : item.isPast ? 'bg-gray-400' : 'bg-white border-2 border-blue-500'
                            }`}>
                              {item.isPast && <div className="w-2 h-2 bg-white rounded-full" />}
                            </div>
                            <div className="flex-1 pb-2">
                              <p className={`text-sm font-medium ${item.isHighlight ? 'text-blue-600' : 'text-gray-900'}`}>
                                {item.label}
                              </p>
                              <p className="text-sm text-gray-500">
                                {item.label === '계약기간' ? item.date : formatFullDate(item.date)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 시세비교 */}
                {activeSection === 'compare' && (
                  <div className="p-4 space-y-4">
                    {/* 현재 매물 평당가 */}
                    <div className="bg-blue-50 rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">분양 평당가</p>
                          <p className="text-2xl font-bold text-blue-600">
                            {apiDetail?.summary?.avgPricePerPyeong
                              ? formatPricePerPyeong(apiDetail.summary.avgPricePerPyeong)
                              : formatPricePerPyeong(subscription.pricePerPyeong)}
                          </p>
                        </div>
                        <Building2 className="w-10 h-10 text-blue-300" />
                      </div>
                      {/* 시세 대비 요약 */}
                      {compareData?.summary && (
                        <div className={`mt-3 pt-3 border-t border-blue-100 ${compareData.summary.marketDiffPercent > 0 ? 'text-red-600' : 'text-green-600'}`}>
                          <p className="text-sm font-medium">{compareData.summary.marketDiffText}</p>
                        </div>
                      )}
                    </div>

                    {/* 주변 시세 비교 - API 데이터 */}
                    {compareData?.complexes && compareData.complexes.length > 0 ? (
                      <div>
                        <h3 className="text-sm font-bold text-gray-900 mb-3">주변 단지 시세 (실거래가 기준)</h3>
                        <div className="space-y-2">
                          {compareData.complexes.slice(0, 6).map((complex, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div>
                                <p className="text-sm font-medium text-gray-900">{complex.name}</p>
                                <p className="text-xs text-gray-500">{complex.dong} · {complex.buildYear}년</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-bold text-gray-900">{formatPricePerPyeong(complex.avgPricePerPyeong)}</p>
                                <p className={`text-xs ${complex.priceDiffPercent > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                  {complex.priceDiffPercent > 0 ? '+' : ''}{complex.priceDiffPercent}%
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                        {/* 평균 시세 요약 */}
                        <div className="mt-4 p-3 bg-gray-100 rounded-lg">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">주변 평균 시세</span>
                            <span className="font-bold text-gray-900">{formatPricePerPyeong(compareData.summary.avgPricePerPyeong)}</span>
                          </div>
                        </div>
                      </div>
                    ) : subscription.nearbyCompare.length > 0 ? (
                      /* 기존 Mock 데이터 폴백 */
                      <div>
                        <h3 className="text-sm font-bold text-gray-900 mb-3">주변 단지 시세</h3>
                        <div className="space-y-2">
                          {subscription.nearbyCompare.map((compare, index) => {
                            const diff = subscription.pricePerPyeong - compare.pricePerPyeong;
                            const diffPercent = ((diff / compare.pricePerPyeong) * 100).toFixed(1);
                            return (
                              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div>
                                  <p className="text-sm font-medium text-gray-900">{compare.name}</p>
                                  <p className="text-xs text-gray-500">{compare.distance} · {compare.yearBuilt}년</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm font-bold text-gray-900">{formatPricePerPyeong(compare.pricePerPyeong)}</p>
                                  <p className={`text-xs ${diff > 0 ? 'text-red-500' : 'text-green-500'}`}>
                                    {diff > 0 ? '+' : ''}{diffPercent}%
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Building2 className="w-12 h-12 mx-auto mb-3 opacity-30" />
                        <p className="text-sm">주변 시세 정보를 불러오는 중...</p>
                      </div>
                    )}
                  </div>
                )}

                {/* 단지정보 (이미지) */}
                {activeSection === 'images' && (
                  <div className="p-4 space-y-6">
                    {imagesLoading ? (
                      <div className="text-center py-12">
                        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                        <p className="text-sm text-gray-500">이미지 로딩 중...</p>
                      </div>
                    ) : subscriptionImages?.hasImages ? (
                      <>
                        {/* 모집공고문 PDF */}
                        {subscriptionImages.pdfUrl && (
                          <div className="bg-gray-50 rounded-xl p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <FileText className="w-8 h-8 text-red-500" />
                                <div>
                                  <p className="font-medium text-gray-900">모집공고문</p>
                                  <p className="text-xs text-gray-500">PDF 문서</p>
                                </div>
                              </div>
                              <a
                                href={subscriptionImages.pdfUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors"
                              >
                                <Download className="w-4 h-4" />
                                다운로드
                              </a>
                            </div>
                          </div>
                        )}

                        {/* 카테고리별 이미지 */}
                        {subscriptionImages.categories.map((category) => (
                          <div key={category.category}>
                            <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                              <ImageIcon className="w-4 h-4 text-blue-500" />
                              {category.label}
                              <span className="text-xs font-normal text-gray-400">({category.images.length})</span>
                            </h3>
                            <div className="grid grid-cols-2 gap-2">
                              {category.images.map((image, index) => (
                                <div
                                  key={index}
                                  onClick={() => setSelectedImage(image.url)}
                                  className="relative aspect-[4/3] rounded-lg overflow-hidden cursor-pointer group"
                                >
                                  <img
                                    src={image.url}
                                    alt={`${category.label} ${index + 1}`}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                  />
                                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                    <ZoomIn className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </>
                    ) : (
                      <div className="text-center py-12 text-gray-500">
                        <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
                        <p className="text-sm mb-2">단지 이미지가 없습니다.</p>
                        <p className="text-xs text-gray-400">
                          아실에서 이미지 크롤링 후 표시됩니다.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* 하단 CTA */}
              <div className="p-4 border-t border-gray-200 bg-white">
                <div className="flex gap-3">
                  <button className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium text-gray-700 transition-colors flex items-center justify-center gap-2">
                    <Phone className="w-5 h-5" />
                    대표번호
                  </button>
                  <a
                    href={subscription.applyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-3 bg-blue-500 hover:bg-blue-600 rounded-xl font-medium text-white transition-colors flex items-center justify-center gap-2"
                  >
                    청약홈 바로가기
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 오른쪽 지도 영역 */}
        <div className="flex-1 relative">
          <KakaoMap
            center={{ lat: subscription.lat, lng: subscription.lng }}
            level={4}
            markers={ALL_SUBSCRIPTIONS.map((sub) => ({
              id: sub.id,
              lat: sub.lat,
              lng: sub.lng,
              type: 'apartment' as const,
              title: sub.id === id ? subscription.name : sub.name,
              price: `평당 ${formatPricePerPyeong(sub.pricePerPyeong)}`,
              info: sub.id === id ? '현재 보는 매물' : `${sub.households.toLocaleString()}세대`,
            }))}
            onMarkerClick={handleMarkerClick}
            className="w-full h-full"
          />

          {/* 패널 토글 버튼 (모바일용) */}
          <button
            onClick={() => setIsPanelExpanded(!isPanelExpanded)}
            className="lg:hidden absolute bottom-4 left-4 z-10 p-3 bg-white rounded-full shadow-lg border border-gray-200"
          >
            <Layers className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
}
