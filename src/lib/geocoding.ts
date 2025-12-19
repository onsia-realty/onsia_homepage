// 카카오맵 지오코딩 API - 주소를 좌표로 변환

const KAKAO_REST_API_KEY = process.env.KAKAO_REST_API_KEY || '';

export interface GeocodingResult {
  lat: number;
  lng: number;
  address: string;
}

interface KakaoAddressDocument {
  address_name: string;
  x: string; // 경도 (longitude)
  y: string; // 위도 (latitude)
  address_type: string;
  address?: {
    address_name: string;
    region_1depth_name: string;
    region_2depth_name: string;
    region_3depth_name: string;
  };
  road_address?: {
    address_name: string;
    road_name: string;
    building_name: string;
  };
}

interface KakaoGeocodingResponse {
  documents: KakaoAddressDocument[];
  meta: {
    total_count: number;
    pageable_count: number;
    is_end: boolean;
  };
}

/**
 * 주소를 좌표로 변환 (카카오맵 API)
 * @param address 검색할 주소
 * @returns 좌표 정보 또는 null
 */
export async function getCoordinatesFromAddress(address: string): Promise<GeocodingResult | null> {
  if (!KAKAO_REST_API_KEY) {
    console.warn('KAKAO_REST_API_KEY가 설정되지 않았습니다. 지오코딩을 사용할 수 없습니다.');
    return null;
  }

  try {
    const encodedAddress = encodeURIComponent(address);
    const url = `https://dapi.kakao.com/v2/local/search/address.json?query=${encodedAddress}`;

    const response = await fetch(url, {
      headers: {
        'Authorization': `KakaoAK ${KAKAO_REST_API_KEY}`,
      },
    });

    if (!response.ok) {
      console.error(`카카오 지오코딩 API 오류: ${response.status}`);
      return null;
    }

    const data: KakaoGeocodingResponse = await response.json();

    if (data.documents.length === 0) {
      // 주소 검색 실패 시 키워드 검색으로 재시도
      return getCoordinatesFromKeyword(address);
    }

    const doc = data.documents[0];
    return {
      lat: parseFloat(doc.y),
      lng: parseFloat(doc.x),
      address: doc.address_name,
    };
  } catch (error) {
    console.error('지오코딩 오류:', error);
    return null;
  }
}

/**
 * 키워드로 장소 검색하여 좌표 반환 (주소 검색 실패 시 fallback)
 * @param keyword 검색할 키워드
 * @returns 좌표 정보 또는 null
 */
export async function getCoordinatesFromKeyword(keyword: string): Promise<GeocodingResult | null> {
  if (!KAKAO_REST_API_KEY) {
    return null;
  }

  try {
    const encodedKeyword = encodeURIComponent(keyword);
    const url = `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodedKeyword}`;

    const response = await fetch(url, {
      headers: {
        'Authorization': `KakaoAK ${KAKAO_REST_API_KEY}`,
      },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    if (data.documents.length === 0) {
      return null;
    }

    const doc = data.documents[0];
    return {
      lat: parseFloat(doc.y),
      lng: parseFloat(doc.x),
      address: doc.address_name,
    };
  } catch (error) {
    console.error('키워드 검색 오류:', error);
    return null;
  }
}

/**
 * 분양 주택명과 주소로 좌표 검색
 * @param name 주택명
 * @param address 주소
 * @returns 좌표 정보 또는 기본값
 */
export async function getSubscriptionCoordinates(
  name: string,
  address: string
): Promise<GeocodingResult> {
  // 1. 주소로 먼저 검색
  let result = await getCoordinatesFromAddress(address);

  if (result) {
    return result;
  }

  // 2. 주택명 + 아파트로 검색
  result = await getCoordinatesFromKeyword(`${name} 아파트`);

  if (result) {
    return result;
  }

  // 3. 주소에서 시/구/동 추출하여 검색
  const simplifiedAddress = simplifyAddress(address);
  if (simplifiedAddress !== address) {
    result = await getCoordinatesFromAddress(simplifiedAddress);
    if (result) {
      return result;
    }
  }

  // 4. 기본값 반환 (서울 중심)
  console.warn(`좌표를 찾을 수 없음: ${name}, ${address}. 기본값 사용.`);
  return {
    lat: 37.5665,
    lng: 126.9780,
    address: address,
  };
}

/**
 * 주소 간소화 (지번 제거)
 */
function simplifyAddress(address: string): string {
  // "경기도 용인시 처인구 양지면 양지리 산 97-12" → "경기도 용인시 처인구 양지면 양지리"
  return address
    .replace(/\s+산\s*\d+(-\d+)?$/, '')  // 산 번지 제거
    .replace(/\s+\d+(-\d+)?$/, '')         // 번지 제거
    .replace(/\s+일원$/, '')               // "일원" 제거
    .trim();
}

/**
 * 여러 주소를 일괄 변환 (rate limiting 적용)
 * @param items 주소 목록 [{name, address}]
 * @param delayMs 요청 간 딜레이 (ms)
 * @returns 좌표가 추가된 목록
 */
export async function batchGeocode<T extends { name: string; address: string }>(
  items: T[],
  delayMs: number = 200
): Promise<(T & { lat: number; lng: number })[]> {
  const results: (T & { lat: number; lng: number })[] = [];

  for (const item of items) {
    const coords = await getSubscriptionCoordinates(item.name, item.address);
    results.push({
      ...item,
      lat: coords.lat,
      lng: coords.lng,
    });

    // Rate limiting
    if (delayMs > 0) {
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }

  return results;
}

// 지역별 기본 좌표 (fallback용)
export const REGION_DEFAULT_COORDINATES: Record<string, { lat: number; lng: number }> = {
  '서울': { lat: 37.5665, lng: 126.9780 },
  '경기': { lat: 37.2750, lng: 127.0094 },
  '인천': { lat: 37.4563, lng: 126.7052 },
  '부산': { lat: 35.1796, lng: 129.0756 },
  '대구': { lat: 35.8714, lng: 128.6014 },
  '대전': { lat: 36.3504, lng: 127.3845 },
  '광주': { lat: 35.1595, lng: 126.8526 },
  '울산': { lat: 35.5384, lng: 129.3114 },
  '세종': { lat: 36.4800, lng: 127.2890 },
  '강원': { lat: 37.8228, lng: 128.1555 },
  '충북': { lat: 36.6357, lng: 127.4914 },
  '충남': { lat: 36.6588, lng: 126.6728 },
  '전북': { lat: 35.8203, lng: 127.1088 },
  '전남': { lat: 34.8161, lng: 126.4629 },
  '경북': { lat: 36.4919, lng: 128.8889 },
  '경남': { lat: 35.4606, lng: 128.2132 },
  '제주': { lat: 33.4996, lng: 126.5312 },
};

/**
 * 지역명으로 기본 좌표 반환
 */
export function getDefaultCoordinatesForRegion(region: string): { lat: number; lng: number } {
  return REGION_DEFAULT_COORDINATES[region] || REGION_DEFAULT_COORDINATES['서울'];
}
