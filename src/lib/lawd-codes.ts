/**
 * 법정동 코드 매핑
 *
 * 공공데이터포털 실거래가 API에서 사용하는 법정동코드 5자리
 * https://www.code.go.kr/stdcode/regCodeL.do
 */

// 서울특별시 구별 법정동 코드
export const SEOUL_CODES: Record<string, string> = {
  '종로구': '11110',
  '중구': '11140',
  '용산구': '11170',
  '성동구': '11200',
  '광진구': '11215',
  '동대문구': '11230',
  '중랑구': '11260',
  '성북구': '11290',
  '강북구': '11305',
  '도봉구': '11320',
  '노원구': '11350',
  '은평구': '11380',
  '서대문구': '11410',
  '마포구': '11440',
  '양천구': '11470',
  '강서구': '11500',
  '구로구': '11530',
  '금천구': '11545',
  '영등포구': '11560',
  '동작구': '11590',
  '관악구': '11620',
  '서초구': '11650',
  '강남구': '11680',
  '송파구': '11710',
  '강동구': '11740',
};

// 경기도 주요 시/군 법정동 코드
export const GYEONGGI_CODES: Record<string, string> = {
  '수원시': '41110',
  '성남시': '41130',
  '의정부시': '41150',
  '안양시': '41170',
  '부천시': '41190',
  '광명시': '41210',
  '평택시': '41220',
  '동두천시': '41250',
  '안산시': '41270',
  '고양시': '41280',
  '과천시': '41290',
  '구리시': '41310',
  '남양주시': '41360',
  '오산시': '41370',
  '시흥시': '41390',
  '군포시': '41410',
  '의왕시': '41430',
  '하남시': '41450',
  '용인시': '41460',
  '파주시': '41480',
  '이천시': '41500',
  '안성시': '41550',
  '김포시': '41570',
  '화성시': '41590',
  '광주시': '41610',
  '양주시': '41630',
  '포천시': '41650',
  '여주시': '41670',
};

// 광역시 법정동 코드
export const METRO_CODES: Record<string, Record<string, string>> = {
  '부산광역시': {
    '중구': '26110',
    '서구': '26140',
    '동구': '26170',
    '영도구': '26200',
    '부산진구': '26230',
    '동래구': '26260',
    '남구': '26290',
    '북구': '26320',
    '해운대구': '26350',
    '사하구': '26380',
    '금정구': '26410',
    '강서구': '26440',
    '연제구': '26470',
    '수영구': '26500',
    '사상구': '26530',
    '기장군': '26710',
  },
  '인천광역시': {
    '중구': '28110',
    '동구': '28140',
    '미추홀구': '28177',
    '연수구': '28185',
    '남동구': '28200',
    '부평구': '28237',
    '계양구': '28245',
    '서구': '28260',
    '강화군': '28710',
    '옹진군': '28720',
  },
  '대구광역시': {
    '중구': '27110',
    '동구': '27140',
    '서구': '27170',
    '남구': '27200',
    '북구': '27230',
    '수성구': '27260',
    '달서구': '27290',
    '달성군': '27710',
  },
  '대전광역시': {
    '동구': '30110',
    '중구': '30140',
    '서구': '30170',
    '유성구': '30200',
    '대덕구': '30230',
  },
  '광주광역시': {
    '동구': '29110',
    '서구': '29140',
    '남구': '29155',
    '북구': '29170',
    '광산구': '29200',
  },
  '울산광역시': {
    '중구': '31110',
    '남구': '31140',
    '동구': '31170',
    '북구': '31200',
    '울주군': '31710',
  },
  '세종특별자치시': {
    '세종시': '36110',
  },
};

// 시/도 코드
export const SIDO_CODES: Record<string, string> = {
  '서울특별시': '11',
  '부산광역시': '26',
  '대구광역시': '27',
  '인천광역시': '28',
  '광주광역시': '29',
  '대전광역시': '30',
  '울산광역시': '31',
  '세종특별자치시': '36',
  '경기도': '41',
  '강원도': '42',
  '충청북도': '43',
  '충청남도': '44',
  '전라북도': '45',
  '전라남도': '46',
  '경상북도': '47',
  '경상남도': '48',
  '제주특별자치도': '50',
};

/**
 * 시/도, 시/군/구로 법정동 코드 조회
 */
export function getLawdCode(sido: string, sigungu: string): string | null {
  // 서울특별시
  if (sido === '서울특별시' || sido === '서울') {
    return SEOUL_CODES[sigungu] || null;
  }

  // 경기도
  if (sido === '경기도' || sido === '경기') {
    return GYEONGGI_CODES[sigungu] || null;
  }

  // 광역시
  const metroKey = Object.keys(METRO_CODES).find(
    key => key === sido || key.startsWith(sido.replace('광역시', '').replace('특별시', '').replace('특별자치시', ''))
  );
  if (metroKey && METRO_CODES[metroKey]) {
    return METRO_CODES[metroKey][sigungu] || null;
  }

  return null;
}

/**
 * 법정동 코드로 시/도, 시/군/구 이름 조회
 */
export function getRegionName(lawdCode: string): { sido: string; sigungu: string } | null {
  // 서울
  for (const [sigungu, code] of Object.entries(SEOUL_CODES)) {
    if (code === lawdCode) {
      return { sido: '서울특별시', sigungu };
    }
  }

  // 경기도
  for (const [sigungu, code] of Object.entries(GYEONGGI_CODES)) {
    if (code === lawdCode) {
      return { sido: '경기도', sigungu };
    }
  }

  // 광역시
  for (const [sido, districts] of Object.entries(METRO_CODES)) {
    for (const [sigungu, code] of Object.entries(districts)) {
      if (code === lawdCode) {
        return { sido, sigungu };
      }
    }
  }

  return null;
}

/**
 * 시/도 목록 반환
 */
export function getSidoList(): string[] {
  return Object.keys(SIDO_CODES);
}

/**
 * 시/도에 해당하는 시/군/구 목록 반환
 */
export function getSigunguList(sido: string): string[] {
  if (sido === '서울특별시' || sido === '서울') {
    return Object.keys(SEOUL_CODES);
  }

  if (sido === '경기도' || sido === '경기') {
    return Object.keys(GYEONGGI_CODES);
  }

  const metroKey = Object.keys(METRO_CODES).find(
    key => key === sido || key.includes(sido.replace('광역시', '').replace('특별시', '').replace('특별자치시', ''))
  );
  if (metroKey && METRO_CODES[metroKey]) {
    return Object.keys(METRO_CODES[metroKey]);
  }

  return [];
}
