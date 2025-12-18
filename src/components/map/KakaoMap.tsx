'use client';

import { useEffect, useRef, useState } from 'react';

// 카카오 지도 타입 선언
declare global {
  interface Window {
    kakao: any;
  }
}

interface MapCenter {
  lat: number;
  lng: number;
}

interface MarkerData {
  id: string;
  lat: number;
  lng: number;
  type: 'auction' | 'transaction' | 'apartment';
  title: string;
  price?: string;
  discount?: string;
  info?: string;
}

interface KakaoMapProps {
  center?: MapCenter;
  level?: number;
  markers?: MarkerData[];
  onMarkerClick?: (marker: MarkerData) => void;
  onMapClick?: (lat: number, lng: number) => void;
  onBoundsChange?: (bounds: { sw: MapCenter; ne: MapCenter }) => void;
  className?: string;
}

export default function KakaoMap({
  center = { lat: 37.5665, lng: 126.978 }, // 서울 시청 기본값
  level = 8,
  markers = [],
  onMarkerClick,
  onMapClick,
  onBoundsChange,
  className = 'w-full h-full',
}: KakaoMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const markersRef = useRef<any[]>([]);
  const overlaysRef = useRef<any[]>([]);

  const apiKey = process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY;

  // 카카오 SDK 동적 로드
  useEffect(() => {
    if (!apiKey) {
      setError('API 키가 설정되지 않았습니다');
      return;
    }

    // 이미 로드되어 있는지 확인
    if (window.kakao && window.kakao.maps) {
      window.kakao.maps.load(() => {
        setIsLoaded(true);
      });
      return;
    }

    // 스크립트 동적 로드
    const script = document.createElement('script');
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&autoload=false&libraries=services,clusterer`;
    script.async = true;

    script.onload = () => {
      if (window.kakao && window.kakao.maps) {
        window.kakao.maps.load(() => {
          console.log('카카오 지도 SDK 로드 완료');
          setIsLoaded(true);
        });
      } else {
        setError('카카오 SDK 로드 실패');
      }
    };

    script.onerror = () => {
      setError('카카오 SDK 스크립트 로드 실패');
    };

    document.head.appendChild(script);

    return () => {
      // 컴포넌트 언마운트 시 스크립트 제거하지 않음 (재사용 위해)
    };
  }, [apiKey]);

  // 지도 초기화
  useEffect(() => {
    if (!isLoaded || !mapRef.current) return;

    try {
      const options = {
        center: new window.kakao.maps.LatLng(center.lat, center.lng),
        level: level,
      };

      const kakaoMap = new window.kakao.maps.Map(mapRef.current, options);
      setMap(kakaoMap);

      // 지도 클릭 이벤트
      if (onMapClick) {
        window.kakao.maps.event.addListener(kakaoMap, 'click', (mouseEvent: any) => {
          const latlng = mouseEvent.latLng;
          onMapClick(latlng.getLat(), latlng.getLng());
        });
      }

      // 지도 이동/줌 이벤트
      if (onBoundsChange) {
        const handleBoundsChange = () => {
          const bounds = kakaoMap.getBounds();
          const sw = bounds.getSouthWest();
          const ne = bounds.getNorthEast();
          onBoundsChange({
            sw: { lat: sw.getLat(), lng: sw.getLng() },
            ne: { lat: ne.getLat(), lng: ne.getLng() },
          });
        };
        window.kakao.maps.event.addListener(kakaoMap, 'idle', handleBoundsChange);
      }

      // 줌 컨트롤 추가
      const zoomControl = new window.kakao.maps.ZoomControl();
      kakaoMap.addControl(zoomControl, window.kakao.maps.ControlPosition.RIGHT);

      // 지도 타입 컨트롤 추가
      const mapTypeControl = new window.kakao.maps.MapTypeControl();
      kakaoMap.addControl(mapTypeControl, window.kakao.maps.ControlPosition.TOPRIGHT);

      console.log('카카오 지도 초기화 완료');
    } catch (err) {
      console.error('지도 초기화 에러:', err);
      setError('지도 초기화 실패');
    }
  }, [isLoaded]);

  // 마커 업데이트
  useEffect(() => {
    if (!map || !isLoaded) return;

    // 기존 마커/오버레이 제거
    markersRef.current.forEach(marker => marker.setMap(null));
    overlaysRef.current.forEach(overlay => overlay.setMap(null));
    markersRef.current = [];
    overlaysRef.current = [];

    // 새 마커 추가
    markers.forEach((markerData) => {
      const position = new window.kakao.maps.LatLng(markerData.lat, markerData.lng);

      // 커스텀 오버레이 내용 생성
      const content = createMarkerContent(markerData);

      // 커스텀 오버레이 생성
      const overlay = new window.kakao.maps.CustomOverlay({
        position: position,
        content: content,
        yAnchor: 1.2,
      });

      overlay.setMap(map);
      overlaysRef.current.push(overlay);

      // 클릭 이벤트는 DOM 요소에 직접 추가
      setTimeout(() => {
        const element = document.getElementById(`marker-${markerData.id}`);
        if (element && onMarkerClick) {
          element.addEventListener('click', () => onMarkerClick(markerData));
        }
      }, 100);
    });

  }, [map, markers, isLoaded, onMarkerClick]);

  // 마커 콘텐츠 생성
  const createMarkerContent = (marker: MarkerData): string => {
    const bgColor = marker.type === 'auction'
      ? 'bg-red-500'
      : marker.type === 'transaction'
        ? 'bg-blue-500'
        : 'bg-emerald-500';

    const discountBadge = marker.discount
      ? `<span class="absolute -top-2 -right-2 bg-yellow-400 text-xs text-black px-1 rounded font-bold">${marker.discount}</span>`
      : '';

    return `
      <div id="marker-${marker.id}" class="relative cursor-pointer transform hover:scale-110 transition-transform">
        ${discountBadge}
        <div class="${bgColor} text-white px-2 py-1 rounded-lg shadow-lg text-xs whitespace-nowrap">
          <div class="font-bold">${marker.title}</div>
          ${marker.price ? `<div class="text-yellow-200">${marker.price}</div>` : ''}
          ${marker.info ? `<div class="text-white/80 text-[10px]">${marker.info}</div>` : ''}
        </div>
        <div class="absolute left-1/2 -translate-x-1/2 -bottom-2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent ${
          marker.type === 'auction' ? 'border-t-red-500' :
          marker.type === 'transaction' ? 'border-t-blue-500' :
          'border-t-emerald-500'
        }"></div>
      </div>
    `;
  };

  // 지도 중심 이동
  useEffect(() => {
    if (!map) return;
    const newCenter = new window.kakao.maps.LatLng(center.lat, center.lng);
    map.panTo(newCenter);
  }, [map, center.lat, center.lng]);

  // 줌 레벨 변경
  useEffect(() => {
    if (!map) return;
    map.setLevel(level);
  }, [map, level]);

  if (!apiKey) {
    return (
      <div className={`${className} flex items-center justify-center bg-slate-800 rounded-xl`}>
        <div className="text-center text-gray-400">
          <p className="mb-2">카카오 지도 API 키가 설정되지 않았습니다</p>
          <p className="text-sm">.env 파일에 NEXT_PUBLIC_KAKAO_MAP_API_KEY를 추가하세요</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${className} flex items-center justify-center bg-slate-800 rounded-xl`}>
        <div className="text-center text-red-400">
          <p className="mb-2">지도 로드 오류</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={mapRef} className={className}>
      {!isLoaded && (
        <div className="w-full h-full flex items-center justify-center bg-slate-800">
          <div className="text-gray-400 flex items-center gap-2">
            <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
            지도 로딩 중...
          </div>
        </div>
      )}
    </div>
  );
}
