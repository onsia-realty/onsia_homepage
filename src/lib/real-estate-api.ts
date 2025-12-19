/**
 * 국토교통부 실거래가 API 클라이언트
 *
 * 공공데이터포털 API 6종:
 * - 아파트 매매 실거래가
 * - 아파트 매매 실거래가 상세
 * - 연립다세대 매매 실거래가
 * - 오피스텔 매매 실거래가
 * - 상업업무용 부동산 매매 실거래가
 * - 공장/창고 부동산 매매 실거래가
 */

import { getLawdCode } from './lawd-codes';

// 실거래가 거래 데이터 타입 (선 정의)
export interface RealTransaction {
  dealDate: string;        // 거래일 (YYYYMMDD)
  dealYear: string;        // 거래년도
  dealMonth: string;       // 거래월
  dealDay: string;         // 거래일
  buildingName: string;    // 건물명/단지명
  dong: string;            // 법정동
  area: number;            // 전용면적 (㎡)
  floor: string;           // 층
  price: number;           // 거래금액 (만원)
  pricePerPyeong: number;  // 평당가 (만원)
  buildYear: string;       // 건축년도
}

// Mock 데이터 사용 여부 (외부 API 접속 불가 시 true)
const USE_MOCK_DATA = true;

// 용인시 처인구 Mock 데이터 (2025년 기준) - 양지면 주변 아파트 실거래
const YONGIN_CHEOIN_MOCK_DATA: RealTransaction[] = [
  // 용인경남아너스빌디센트3단지 (양지면 양지리)
  { dealDate: '20250615', dealYear: '2025', dealMonth: '06', dealDay: '15', buildingName: '용인경남아너스빌디센트3단지', dong: '양지리', area: 111.42, floor: '8', price: 43834, pricePerPyeong: 1328, buildYear: '2021' },
  { dealDate: '20250520', dealYear: '2025', dealMonth: '05', dealDay: '20', buildingName: '용인경남아너스빌디센트3단지', dong: '양지리', area: 111.42, floor: '12', price: 44500, pricePerPyeong: 1348, buildYear: '2021' },
  { dealDate: '20250418', dealYear: '2025', dealMonth: '04', dealDay: '18', buildingName: '용인경남아너스빌디센트3단지', dong: '양지리', area: 84.98, floor: '5', price: 33500, pricePerPyeong: 1302, buildYear: '2021' },
  // 용인경남아너스빌디센트2단지 (양지면 양지리)
  { dealDate: '20250612', dealYear: '2025', dealMonth: '06', dealDay: '12', buildingName: '용인경남아너스빌디센트2단지', dong: '양지리', area: 111.42, floor: '10', price: 38850, pricePerPyeong: 1177, buildYear: '2019' },
  { dealDate: '20250510', dealYear: '2025', dealMonth: '05', dealDay: '10', buildingName: '용인경남아너스빌디센트2단지', dong: '양지리', area: 84.98, floor: '7', price: 30500, pricePerPyeong: 1186, buildYear: '2019' },
  { dealDate: '20250408', dealYear: '2025', dealMonth: '04', dealDay: '08', buildingName: '용인경남아너스빌디센트2단지', dong: '양지리', area: 111.42, floor: '15', price: 39500, pricePerPyeong: 1197, buildYear: '2019' },
  // 용인양지세영리첼 (양지면)
  { dealDate: '20251210', dealYear: '2025', dealMonth: '12', dealDay: '10', buildingName: '용인양지세영리첼', dong: '양지리', area: 100.56, floor: '6', price: 34800, pricePerPyeong: 1160, buildYear: '2018' },
  { dealDate: '20251105', dealYear: '2025', dealMonth: '11', dealDay: '05', buildingName: '용인양지세영리첼', dong: '양지리', area: 84.95, floor: '9', price: 29800, pricePerPyeong: 1159, buildYear: '2018' },
  { dealDate: '20250915', dealYear: '2025', dealMonth: '09', dealDay: '15', buildingName: '용인양지세영리첼', dong: '양지리', area: 100.56, floor: '12', price: 35200, pricePerPyeong: 1173, buildYear: '2018' },
  // 양지리더샵 (양지면)
  { dealDate: '20250610', dealYear: '2025', dealMonth: '06', dealDay: '10', buildingName: '양지리더샵', dong: '양지리', area: 84.95, floor: '8', price: 42800, pricePerPyeong: 1665, buildYear: '2022' },
  { dealDate: '20250505', dealYear: '2025', dealMonth: '05', dealDay: '05', buildingName: '양지리더샵', dong: '양지리', area: 111.42, floor: '15', price: 55200, pricePerPyeong: 1672, buildYear: '2022' },
  { dealDate: '20250320', dealYear: '2025', dealMonth: '03', dealDay: '20', buildingName: '양지리더샵', dong: '양지리', area: 84.95, floor: '11', price: 43500, pricePerPyeong: 1692, buildYear: '2022' },
  // 양지코오롱하늘채 (양지면)
  { dealDate: '20250601', dealYear: '2025', dealMonth: '06', dealDay: '01', buildingName: '양지코오롱하늘채', dong: '양지리', area: 84.95, floor: '10', price: 45200, pricePerPyeong: 1758, buildYear: '2020' },
  { dealDate: '20250415', dealYear: '2025', dealMonth: '04', dealDay: '15', buildingName: '양지코오롱하늘채', dong: '양지리', area: 111.42, floor: '18', price: 58500, pricePerPyeong: 1772, buildYear: '2020' },
  { dealDate: '20250228', dealYear: '2025', dealMonth: '02', dealDay: '28', buildingName: '양지코오롱하늘채', dong: '양지리', area: 84.95, floor: '6', price: 44800, pricePerPyeong: 1743, buildYear: '2020' },
  // 처인롯데캐슬 (남사면)
  { dealDate: '20250525', dealYear: '2025', dealMonth: '05', dealDay: '25', buildingName: '처인롯데캐슬', dong: '남사리', area: 84.95, floor: '12', price: 35500, pricePerPyeong: 1381, buildYear: '2019' },
  { dealDate: '20250410', dealYear: '2025', dealMonth: '04', dealDay: '10', buildingName: '처인롯데캐슬', dong: '남사리', area: 111.42, floor: '8', price: 46200, pricePerPyeong: 1399, buildYear: '2019' },
  { dealDate: '20250305', dealYear: '2025', dealMonth: '03', dealDay: '05', buildingName: '처인롯데캐슬', dong: '남사리', area: 84.95, floor: '15', price: 35800, pricePerPyeong: 1393, buildYear: '2019' },
];

// 강남구 Mock 데이터 (2025년 기준)
const GANGNAM_MOCK_DATA: RealTransaction[] = [
  { dealDate: '20251215', dealYear: '2025', dealMonth: '12', dealDay: '15', buildingName: '래미안대치팰리스', dong: '대치동', area: 84.97, floor: '15', price: 295000, pricePerPyeong: 11470, buildYear: '2015' },
  { dealDate: '20251212', dealYear: '2025', dealMonth: '12', dealDay: '12', buildingName: '래미안대치팰리스', dong: '대치동', area: 114.85, floor: '23', price: 398000, pricePerPyeong: 11450, buildYear: '2015' },
  { dealDate: '20251210', dealYear: '2025', dealMonth: '12', dealDay: '10', buildingName: '은마아파트', dong: '대치동', area: 76.79, floor: '8', price: 292000, pricePerPyeong: 12570, buildYear: '1979' },
  { dealDate: '20251208', dealYear: '2025', dealMonth: '12', dealDay: '8', buildingName: '도곡렉슬', dong: '도곡동', area: 134.82, floor: '18', price: 435000, pricePerPyeong: 10660, buildYear: '2003' },
  { dealDate: '20251205', dealYear: '2025', dealMonth: '12', dealDay: '5', buildingName: '타워팰리스', dong: '도곡동', area: 163.58, floor: '45', price: 598000, pricePerPyeong: 12080, buildYear: '2002' },
  { dealDate: '20251203', dealYear: '2025', dealMonth: '12', dealDay: '3', buildingName: '개포자이프레지던스', dong: '개포동', area: 84.96, floor: '12', price: 308000, pricePerPyeong: 11980, buildYear: '2020' },
  { dealDate: '20251201', dealYear: '2025', dealMonth: '12', dealDay: '1', buildingName: '삼성래미안', dong: '삼성동', area: 149.87, floor: '20', price: 468000, pricePerPyeong: 10320, buildYear: '2008' },
  { dealDate: '20251128', dealYear: '2025', dealMonth: '11', dealDay: '28', buildingName: '청담자이', dong: '청담동', area: 164.55, floor: '25', price: 648000, pricePerPyeong: 13020, buildYear: '2011' },
  { dealDate: '20251125', dealYear: '2025', dealMonth: '11', dealDay: '25', buildingName: '압구정현대', dong: '압구정동', area: 196.02, floor: '10', price: 710000, pricePerPyeong: 11970, buildYear: '1987' },
  { dealDate: '20251122', dealYear: '2025', dealMonth: '11', dealDay: '22', buildingName: '압구정현대', dong: '압구정동', area: 141.24, floor: '7', price: 545000, pricePerPyeong: 12760, buildYear: '1987' },
  { dealDate: '20251120', dealYear: '2025', dealMonth: '11', dealDay: '20', buildingName: '한양아파트', dong: '압구정동', area: 179.64, floor: '5', price: 575000, pricePerPyeong: 10580, buildYear: '1978' },
  { dealDate: '20251118', dealYear: '2025', dealMonth: '11', dealDay: '18', buildingName: '신반포자이', dong: '잠원동', area: 84.98, floor: '28', price: 338000, pricePerPyeong: 13150, buildYear: '2019' },
  { dealDate: '20251115', dealYear: '2025', dealMonth: '11', dealDay: '15', buildingName: '래미안퍼스티지', dong: '반포동', area: 84.92, floor: '16', price: 385000, pricePerPyeong: 14990, buildYear: '2009' },
  { dealDate: '20251112', dealYear: '2025', dealMonth: '11', dealDay: '12', buildingName: '아크로리버파크', dong: '반포동', area: 129.92, floor: '32', price: 610000, pricePerPyeong: 15520, buildYear: '2016' },
  { dealDate: '20251110', dealYear: '2025', dealMonth: '11', dealDay: '10', buildingName: '래미안원베일리', dong: '반포동', area: 84.99, floor: '38', price: 448000, pricePerPyeong: 17420, buildYear: '2023' },
  { dealDate: '20251108', dealYear: '2025', dealMonth: '11', dealDay: '8', buildingName: '래미안대치팰리스', dong: '대치동', area: 59.97, floor: '10', price: 208000, pricePerPyeong: 11460, buildYear: '2015' },
  { dealDate: '20251105', dealYear: '2025', dealMonth: '11', dealDay: '5', buildingName: '은마아파트', dong: '대치동', area: 76.79, floor: '12', price: 288000, pricePerPyeong: 12400, buildYear: '1979' },
  { dealDate: '20251103', dealYear: '2025', dealMonth: '11', dealDay: '3', buildingName: '도곡렉슬', dong: '도곡동', area: 84.87, floor: '8', price: 298000, pricePerPyeong: 11600, buildYear: '2003' },
  { dealDate: '20251101', dealYear: '2025', dealMonth: '11', dealDay: '1', buildingName: '타워팰리스', dong: '도곡동', area: 195.87, floor: '52', price: 752000, pricePerPyeong: 12690, buildYear: '2002' },
  { dealDate: '20251028', dealYear: '2025', dealMonth: '10', dealDay: '28', buildingName: '개포자이프레지던스', dong: '개포동', area: 114.92, floor: '18', price: 398000, pricePerPyeong: 11450, buildYear: '2020' },
  { dealDate: '20251025', dealYear: '2025', dealMonth: '10', dealDay: '25', buildingName: '삼성래미안', dong: '삼성동', area: 84.96, floor: '15', price: 298000, pricePerPyeong: 11590, buildYear: '2008' },
  { dealDate: '20251022', dealYear: '2025', dealMonth: '10', dealDay: '22', buildingName: '청담자이', dong: '청담동', area: 84.98, floor: '20', price: 385000, pricePerPyeong: 14980, buildYear: '2011' },
  { dealDate: '20251020', dealYear: '2025', dealMonth: '10', dealDay: '20', buildingName: '역삼래미안', dong: '역삼동', area: 84.95, floor: '12', price: 278000, pricePerPyeong: 10820, buildYear: '2005' },
  { dealDate: '20251018', dealYear: '2025', dealMonth: '10', dealDay: '18', buildingName: '논현아이파크', dong: '논현동', area: 114.87, floor: '22', price: 338000, pricePerPyeong: 9720, buildYear: '2010' },
  { dealDate: '20251015', dealYear: '2025', dealMonth: '10', dealDay: '15', buildingName: '신사역센트라스', dong: '신사동', area: 59.92, floor: '8', price: 185000, pricePerPyeong: 10200, buildYear: '2018' },
  { dealDate: '20251012', dealYear: '2025', dealMonth: '10', dealDay: '12', buildingName: '세곡푸르지오', dong: '세곡동', area: 84.98, floor: '15', price: 178000, pricePerPyeong: 6920, buildYear: '2016' },
  { dealDate: '20251010', dealYear: '2025', dealMonth: '10', dealDay: '10', buildingName: '자곡LH', dong: '자곡동', area: 59.95, floor: '10', price: 105000, pricePerPyeong: 5790, buildYear: '2019' },
  { dealDate: '20251008', dealYear: '2025', dealMonth: '10', dealDay: '8', buildingName: '래미안대치팰리스', dong: '대치동', area: 84.97, floor: '18', price: 292000, pricePerPyeong: 11360, buildYear: '2015' },
  { dealDate: '20251005', dealYear: '2025', dealMonth: '10', dealDay: '5', buildingName: '은마아파트', dong: '대치동', area: 102.83, floor: '5', price: 328000, pricePerPyeong: 10540, buildYear: '1979' },
  { dealDate: '20251003', dealYear: '2025', dealMonth: '10', dealDay: '3', buildingName: '래미안원베일리', dong: '반포동', area: 59.98, floor: '25', price: 312000, pricePerPyeong: 17200, buildYear: '2023' },
];

// 송파구 Mock 데이터 (2025년 기준)
const SONGPA_MOCK_DATA: RealTransaction[] = [
  { dealDate: '20251216', dealYear: '2025', dealMonth: '12', dealDay: '16', buildingName: '잠실엘스', dong: '잠실동', area: 84.82, floor: '25', price: 268000, pricePerPyeong: 10440, buildYear: '2008' },
  { dealDate: '20251214', dealYear: '2025', dealMonth: '12', dealDay: '14', buildingName: '헬리오시티', dong: '송파동', area: 84.98, floor: '38', price: 258000, pricePerPyeong: 10030, buildYear: '2018' },
  { dealDate: '20251212', dealYear: '2025', dealMonth: '12', dealDay: '12', buildingName: '잠실파크리오', dong: '신천동', area: 84.95, floor: '20', price: 248000, pricePerPyeong: 9650, buildYear: '2008' },
  { dealDate: '20251210', dealYear: '2025', dealMonth: '12', dealDay: '10', buildingName: '리센츠', dong: '잠실동', area: 84.99, floor: '15', price: 252000, pricePerPyeong: 9800, buildYear: '2008' },
  { dealDate: '20251208', dealYear: '2025', dealMonth: '12', dealDay: '8', buildingName: '잠실주공5단지', dong: '잠실동', area: 76.5, floor: '12', price: 248000, pricePerPyeong: 10710, buildYear: '1978' },
  { dealDate: '20251205', dealYear: '2025', dealMonth: '12', dealDay: '5', buildingName: '레이크팰리스', dong: '잠실동', area: 114.98, floor: '18', price: 325000, pricePerPyeong: 9350, buildYear: '2008' },
  { dealDate: '20251203', dealYear: '2025', dealMonth: '12', dealDay: '3', buildingName: '롯데캐슬골드', dong: '신천동', area: 84.92, floor: '28', price: 235000, pricePerPyeong: 9150, buildYear: '2007' },
  { dealDate: '20251201', dealYear: '2025', dealMonth: '12', dealDay: '1', buildingName: '잠실래미안아이파크', dong: '잠실동', area: 59.96, floor: '22', price: 185000, pricePerPyeong: 10200, buildYear: '2019' },
  { dealDate: '20251128', dealYear: '2025', dealMonth: '11', dealDay: '28', buildingName: '올림픽선수촌', dong: '방이동', area: 134.82, floor: '8', price: 285000, pricePerPyeong: 6990, buildYear: '1988' },
  { dealDate: '20251125', dealYear: '2025', dealMonth: '11', dealDay: '25', buildingName: '아시아선수촌', dong: '오륜동', area: 162.65, floor: '10', price: 310000, pricePerPyeong: 6300, buildYear: '1986' },
  { dealDate: '20251122', dealYear: '2025', dealMonth: '11', dealDay: '22', buildingName: '잠실엘스', dong: '잠실동', area: 119.92, floor: '30', price: 345000, pricePerPyeong: 9510, buildYear: '2008' },
  { dealDate: '20251120', dealYear: '2025', dealMonth: '11', dealDay: '20', buildingName: '헬리오시티', dong: '송파동', area: 59.97, floor: '42', price: 195000, pricePerPyeong: 10750, buildYear: '2018' },
  { dealDate: '20251118', dealYear: '2025', dealMonth: '11', dealDay: '18', buildingName: '잠실파크리오', dong: '신천동', area: 114.85, floor: '25', price: 328000, pricePerPyeong: 9440, buildYear: '2008' },
  { dealDate: '20251115', dealYear: '2025', dealMonth: '11', dealDay: '15', buildingName: '리센츠', dong: '잠실동', area: 59.95, floor: '18', price: 178000, pricePerPyeong: 9810, buildYear: '2008' },
  { dealDate: '20251112', dealYear: '2025', dealMonth: '11', dealDay: '12', buildingName: '잠실주공5단지', dong: '잠실동', area: 82.5, floor: '8', price: 265000, pricePerPyeong: 10620, buildYear: '1978' },
  { dealDate: '20251110', dealYear: '2025', dealMonth: '11', dealDay: '10', buildingName: '갈대공원풍경채', dong: '문정동', area: 84.95, floor: '15', price: 168000, pricePerPyeong: 6540, buildYear: '2016' },
  { dealDate: '20251108', dealYear: '2025', dealMonth: '11', dealDay: '8', buildingName: '송파한양수자인', dong: '가락동', area: 84.98, floor: '20', price: 152000, pricePerPyeong: 5910, buildYear: '2019' },
  { dealDate: '20251105', dealYear: '2025', dealMonth: '11', dealDay: '5', buildingName: '가락삼익맨숀', dong: '가락동', area: 59.92, floor: '5', price: 105000, pricePerPyeong: 5790, buildYear: '1983' },
  { dealDate: '20251103', dealYear: '2025', dealMonth: '11', dealDay: '3', buildingName: '잠실엘스', dong: '잠실동', area: 84.82, floor: '18', price: 265000, pricePerPyeong: 10330, buildYear: '2008' },
  { dealDate: '20251101', dealYear: '2025', dealMonth: '11', dealDay: '1', buildingName: '헬리오시티', dong: '송파동', area: 99.95, floor: '35', price: 285000, pricePerPyeong: 9420, buildYear: '2018' },
  { dealDate: '20251028', dealYear: '2025', dealMonth: '10', dealDay: '28', buildingName: '잠실파크리오', dong: '신천동', area: 59.92, floor: '12', price: 175000, pricePerPyeong: 9660, buildYear: '2008' },
  { dealDate: '20251025', dealYear: '2025', dealMonth: '10', dealDay: '25', buildingName: '리센츠', dong: '잠실동', area: 114.92, floor: '22', price: 315000, pricePerPyeong: 9060, buildYear: '2008' },
  { dealDate: '20251022', dealYear: '2025', dealMonth: '10', dealDay: '22', buildingName: '레이크팰리스', dong: '잠실동', area: 84.95, floor: '15', price: 248000, pricePerPyeong: 9650, buildYear: '2008' },
  { dealDate: '20251020', dealYear: '2025', dealMonth: '10', dealDay: '20', buildingName: '잠실래미안아이파크', dong: '잠실동', area: 84.96, floor: '28', price: 265000, pricePerPyeong: 10310, buildYear: '2019' },
  { dealDate: '20251018', dealYear: '2025', dealMonth: '10', dealDay: '18', buildingName: '올림픽선수촌', dong: '방이동', area: 84.82, floor: '10', price: 185000, pricePerPyeong: 7210, buildYear: '1988' },
  { dealDate: '20251015', dealYear: '2025', dealMonth: '10', dealDay: '15', buildingName: '잠실주공5단지', dong: '잠실동', area: 76.5, floor: '5', price: 245000, pricePerPyeong: 10580, buildYear: '1978' },
  { dealDate: '20251012', dealYear: '2025', dealMonth: '10', dealDay: '12', buildingName: '잠실엘스', dong: '잠실동', area: 59.95, floor: '20', price: 188000, pricePerPyeong: 10370, buildYear: '2008' },
  { dealDate: '20251010', dealYear: '2025', dealMonth: '10', dealDay: '10', buildingName: '헬리오시티', dong: '송파동', area: 114.98, floor: '45', price: 358000, pricePerPyeong: 10290, buildYear: '2018' },
  { dealDate: '20251008', dealYear: '2025', dealMonth: '10', dealDay: '8', buildingName: '송파시그니처롯데캐슬', dong: '문정동', area: 84.92, floor: '18', price: 175000, pricePerPyeong: 6810, buildYear: '2020' },
  { dealDate: '20251005', dealYear: '2025', dealMonth: '10', dealDay: '5', buildingName: '가락래미안e편한세상', dong: '가락동', area: 59.98, floor: '12', price: 128000, pricePerPyeong: 7050, buildYear: '2015' },
];

// 서초구 Mock 데이터 (2025년 기준)
const SEOCHO_MOCK_DATA: RealTransaction[] = [
  { dealDate: '20251217', dealYear: '2025', dealMonth: '12', dealDay: '17', buildingName: '반포자이', dong: '반포동', area: 84.95, floor: '28', price: 398000, pricePerPyeong: 15490, buildYear: '2009' },
  { dealDate: '20251215', dealYear: '2025', dealMonth: '12', dealDay: '15', buildingName: '래미안퍼스티지', dong: '반포동', area: 114.92, floor: '22', price: 498000, pricePerPyeong: 14320, buildYear: '2009' },
  { dealDate: '20251213', dealYear: '2025', dealMonth: '12', dealDay: '13', buildingName: '아크로리버파크', dong: '반포동', area: 84.98, floor: '35', price: 458000, pricePerPyeong: 17810, buildYear: '2016' },
  { dealDate: '20251211', dealYear: '2025', dealMonth: '12', dealDay: '11', buildingName: '래미안원베일리', dong: '반포동', area: 84.99, floor: '42', price: 458000, pricePerPyeong: 17810, buildYear: '2023' },
  { dealDate: '20251209', dealYear: '2025', dealMonth: '12', dealDay: '9', buildingName: '신반포자이', dong: '잠원동', area: 84.98, floor: '32', price: 345000, pricePerPyeong: 13420, buildYear: '2019' },
  { dealDate: '20251207', dealYear: '2025', dealMonth: '12', dealDay: '7', buildingName: '반포래미안아이파크', dong: '반포동', area: 59.96, floor: '18', price: 285000, pricePerPyeong: 15710, buildYear: '2019' },
  { dealDate: '20251205', dealYear: '2025', dealMonth: '12', dealDay: '5', buildingName: '래미안서초에스티지', dong: '서초동', area: 84.92, floor: '15', price: 298000, pricePerPyeong: 11600, buildYear: '2021' },
  { dealDate: '20251203', dealYear: '2025', dealMonth: '12', dealDay: '3', buildingName: '서초그랑자이', dong: '서초동', area: 114.85, floor: '25', price: 385000, pricePerPyeong: 11080, buildYear: '2020' },
  { dealDate: '20251201', dealYear: '2025', dealMonth: '12', dealDay: '1', buildingName: '방배래미안원펜타스', dong: '방배동', area: 84.95, floor: '28', price: 325000, pricePerPyeong: 12640, buildYear: '2024' },
  { dealDate: '20251128', dealYear: '2025', dealMonth: '11', dealDay: '28', buildingName: '반포힐스테이트', dong: '반포동', area: 149.87, floor: '18', price: 568000, pricePerPyeong: 12520, buildYear: '2018' },
  { dealDate: '20251125', dealYear: '2025', dealMonth: '11', dealDay: '25', buildingName: '반포자이', dong: '반포동', area: 59.95, floor: '22', price: 285000, pricePerPyeong: 15710, buildYear: '2009' },
  { dealDate: '20251122', dealYear: '2025', dealMonth: '11', dealDay: '22', buildingName: '래미안퍼스티지', dong: '반포동', area: 84.92, floor: '28', price: 398000, pricePerPyeong: 15500, buildYear: '2009' },
  { dealDate: '20251120', dealYear: '2025', dealMonth: '11', dealDay: '20', buildingName: '아크로리버파크', dong: '반포동', area: 129.92, floor: '40', price: 625000, pricePerPyeong: 15900, buildYear: '2016' },
  { dealDate: '20251118', dealYear: '2025', dealMonth: '11', dealDay: '18', buildingName: '래미안원베일리', dong: '반포동', area: 114.98, floor: '38', price: 598000, pricePerPyeong: 17190, buildYear: '2023' },
  { dealDate: '20251115', dealYear: '2025', dealMonth: '11', dealDay: '15', buildingName: '신반포자이', dong: '잠원동', area: 59.96, floor: '25', price: 248000, pricePerPyeong: 13670, buildYear: '2019' },
  { dealDate: '20251112', dealYear: '2025', dealMonth: '11', dealDay: '12', buildingName: '반포래미안아이파크', dong: '반포동', area: 84.98, floor: '22', price: 385000, pricePerPyeong: 14980, buildYear: '2019' },
  { dealDate: '20251110', dealYear: '2025', dealMonth: '11', dealDay: '10', buildingName: '서초푸르지오써밋', dong: '서초동', area: 84.95, floor: '18', price: 285000, pricePerPyeong: 11090, buildYear: '2019' },
  { dealDate: '20251108', dealYear: '2025', dealMonth: '11', dealDay: '8', buildingName: '방배그랑자이', dong: '방배동', area: 59.92, floor: '15', price: 185000, pricePerPyeong: 10210, buildYear: '2022' },
  { dealDate: '20251105', dealYear: '2025', dealMonth: '11', dealDay: '5', buildingName: '서초삼풍', dong: '서초동', area: 114.82, floor: '8', price: 275000, pricePerPyeong: 7920, buildYear: '1996' },
  { dealDate: '20251103', dealYear: '2025', dealMonth: '11', dealDay: '3', buildingName: '반포자이', dong: '반포동', area: 149.95, floor: '25', price: 598000, pricePerPyeong: 13180, buildYear: '2009' },
  { dealDate: '20251101', dealYear: '2025', dealMonth: '11', dealDay: '1', buildingName: '래미안퍼스티지', dong: '반포동', area: 59.98, floor: '15', price: 278000, pricePerPyeong: 15320, buildYear: '2009' },
  { dealDate: '20251028', dealYear: '2025', dealMonth: '10', dealDay: '28', buildingName: '아크로리버파크', dong: '반포동', area: 59.95, floor: '28', price: 325000, pricePerPyeong: 17920, buildYear: '2016' },
  { dealDate: '20251025', dealYear: '2025', dealMonth: '10', dealDay: '25', buildingName: '래미안원베일리', dong: '반포동', area: 59.98, floor: '35', price: 318000, pricePerPyeong: 17530, buildYear: '2023' },
  { dealDate: '20251022', dealYear: '2025', dealMonth: '10', dealDay: '22', buildingName: '신반포자이', dong: '잠원동', area: 114.92, floor: '28', price: 445000, pricePerPyeong: 12800, buildYear: '2019' },
  { dealDate: '20251020', dealYear: '2025', dealMonth: '10', dealDay: '20', buildingName: '반포힐스테이트', dong: '반포동', area: 84.98, floor: '22', price: 358000, pricePerPyeong: 13920, buildYear: '2018' },
  { dealDate: '20251018', dealYear: '2025', dealMonth: '10', dealDay: '18', buildingName: '래미안서초에스티지', dong: '서초동', area: 59.95, floor: '12', price: 218000, pricePerPyeong: 12020, buildYear: '2021' },
  { dealDate: '20251015', dealYear: '2025', dealMonth: '10', dealDay: '15', buildingName: '서초그랑자이', dong: '서초동', area: 84.92, floor: '20', price: 295000, pricePerPyeong: 11480, buildYear: '2020' },
  { dealDate: '20251012', dealYear: '2025', dealMonth: '10', dealDay: '12', buildingName: '잠원한강아파트', dong: '잠원동', area: 164.82, floor: '8', price: 428000, pricePerPyeong: 8580, buildYear: '1981' },
  { dealDate: '20251010', dealYear: '2025', dealMonth: '10', dealDay: '10', buildingName: '방배롯데캐슬아르떼', dong: '방배동', area: 84.95, floor: '18', price: 175000, pricePerPyeong: 6810, buildYear: '2017' },
  { dealDate: '20251008', dealYear: '2025', dealMonth: '10', dealDay: '8', buildingName: '서초엘', dong: '서초동', area: 59.98, floor: '15', price: 148000, pricePerPyeong: 8150, buildYear: '2020' },
];

const API_KEY = process.env.DATA_GO_KR_API_KEY;

// API 엔드포인트 매핑
const API_ENDPOINTS: Record<string, string> = {
  아파트: 'http://openapi.molit.go.kr/OpenAPI_ToolInstall498/service/rest/RTMSOBJSvc/getRTMSDataSvcAptTradeDev',
  연립다세대: 'http://openapi.molit.go.kr:8081/OpenAPI_ToolInstallPackage/service/rest/RTMSOBJSvc/getRTMSDataSvcRHTrade',
  오피스텔: 'http://openapi.molit.go.kr:8081/OpenAPI_ToolInstallPackage/service/rest/RTMSOBJSvc/getRTMSDataSvcOffiTrade',
  상업업무용: 'http://openapi.molit.go.kr:8081/OpenAPI_ToolInstallPackage/service/rest/RTMSOBJSvc/getRTMSDataSvcNrgTrade',
  공장창고: 'http://openapi.molit.go.kr:8081/OpenAPI_ToolInstallPackage/service/rest/RTMSOBJSvc/getRTMSDataSvcInduTrade',
};

// 경매 물건종류 → API 타입 매핑
const PROPERTY_TYPE_MAP: Record<string, string> = {
  '아파트': '아파트',
  '다세대': '연립다세대',
  '연립': '연립다세대',
  '빌라': '연립다세대',
  '다가구': '연립다세대',
  '오피스텔': '오피스텔',
  '근린시설': '상업업무용',
  '상가': '상업업무용',
  '근린상가': '상업업무용',
  '공장': '공장창고',
  '창고': '공장창고',
};

// 통계 데이터 타입
export interface PriceStats {
  avgPrice: number;           // 평균 거래금액 (만원)
  avgPricePerPyeong: number;  // 평균 평당가 (만원)
  maxPrice: number;           // 최고가 (만원)
  minPrice: number;           // 최저가 (만원)
  totalCount: number;         // 총 거래건수
  recentTransactions: RealTransaction[];
}

/**
 * 경매 물건종류를 API 타입으로 변환
 */
export function mapPropertyTypeToApi(propertyType: string): string | null {
  // 직접 매핑 검색
  if (PROPERTY_TYPE_MAP[propertyType]) {
    return PROPERTY_TYPE_MAP[propertyType];
  }

  // 부분 매칭 검색
  for (const [key, value] of Object.entries(PROPERTY_TYPE_MAP)) {
    if (propertyType.includes(key)) {
      return value;
    }
  }

  return null;
}

/**
 * API 타입으로 엔드포인트 URL 반환
 */
function getApiEndpoint(apiType: string): string | null {
  return API_ENDPOINTS[apiType] || null;
}

/**
 * 계약년월 문자열 생성 (YYYYMM)
 */
function formatDealYmd(year: number, month: number): string {
  return `${year}${String(month).padStart(2, '0')}`;
}

/**
 * 최근 N개월의 년월 목록 생성
 */
function getRecentMonths(months: number): string[] {
  const result: string[] = [];
  const now = new Date();

  for (let i = 0; i < months; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    result.push(formatDealYmd(date.getFullYear(), date.getMonth() + 1));
  }

  return result;
}

/**
 * XML 응답에서 거래 데이터 파싱
 */
function parseTransactionXml(xml: string): RealTransaction[] {
  const transactions: RealTransaction[] = [];

  // item 태그 추출
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;

  while ((match = itemRegex.exec(xml)) !== null) {
    const itemXml = match[1];

    // 각 필드 추출
    const getValue = (tag: string): string => {
      const regex = new RegExp(`<${tag}>([^<]*)</${tag}>`);
      const m = itemXml.match(regex);
      return m ? m[1].trim() : '';
    };

    const area = parseFloat(getValue('전용면적') || getValue('excluUseAr') || '0');
    const price = parseInt(getValue('거래금액')?.replace(/,/g, '') || getValue('dealAmount')?.replace(/,/g, '') || '0', 10);
    const pyeong = area / 3.3058;
    const pricePerPyeong = pyeong > 0 ? Math.round(price / pyeong) : 0;

    const dealYear = getValue('년') || getValue('dealYear');
    const dealMonth = getValue('월') || getValue('dealMonth');
    const dealDay = getValue('일') || getValue('dealDay');

    transactions.push({
      dealDate: `${dealYear}${dealMonth.padStart(2, '0')}${dealDay.padStart(2, '0')}`,
      dealYear,
      dealMonth,
      dealDay,
      buildingName: getValue('아파트') || getValue('단지') || getValue('연립다세대') || getValue('offiNm') || '',
      dong: getValue('법정동') || getValue('umdNm') || '',
      area,
      floor: getValue('층') || getValue('floor') || '',
      price,
      pricePerPyeong,
      buildYear: getValue('건축년도') || getValue('buildYear') || '',
    });
  }

  return transactions;
}

/**
 * 실거래가 API 호출
 */
export async function getRealTransactionPrice(
  lawdCd: string,
  dealYmd: string,
  propertyType: string
): Promise<RealTransaction[]> {
  const apiType = mapPropertyTypeToApi(propertyType);
  if (!apiType) {
    console.warn(`지원하지 않는 물건종류: ${propertyType}`);
    return [];
  }

  const endpoint = getApiEndpoint(apiType);
  if (!endpoint) {
    console.warn(`API 엔드포인트 없음: ${apiType}`);
    return [];
  }

  if (!API_KEY) {
    console.error('DATA_GO_KR_API_KEY 환경변수가 설정되지 않았습니다.');
    return [];
  }

  const url = `${endpoint}?serviceKey=${encodeURIComponent(API_KEY)}&LAWD_CD=${lawdCd}&DEAL_YMD=${dealYmd}`;

  try {
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/xml',
      },
    });

    if (!response.ok) {
      console.error(`API 호출 실패: ${response.status}`);
      return [];
    }

    const xml = await response.text();

    // 에러 응답 체크
    if (xml.includes('<returnReasonCode>') && !xml.includes('<returnReasonCode>0</returnReasonCode>')) {
      const errorMatch = xml.match(/<returnAuthMsg>([^<]*)<\/returnAuthMsg>/);
      console.error(`API 에러: ${errorMatch?.[1] || 'Unknown error'}`);
      return [];
    }

    return parseTransactionXml(xml);
  } catch (error) {
    console.error('API 호출 오류:', error);
    return [];
  }
}

/**
 * 최근 N개월간 실거래가 조회
 */
export async function getRecentTransactions(
  sido: string,
  sigungu: string,
  propertyType: string,
  months: number = 6
): Promise<RealTransaction[]> {
  // Mock 데이터 사용
  if (USE_MOCK_DATA) {
    const isSeoul = sido === '서울특별시' || sido === '서울';
    const isYongin = sido === '경기도' || sido === '경기';
    const isYonginCheoin = sigungu === '용인시' || sigungu === '처인구' || sigungu === '용인시 처인구';

    // 지역별 Mock 데이터 매핑
    const seoulMockDataMap: Record<string, RealTransaction[]> = {
      '강남구': GANGNAM_MOCK_DATA,
      '송파구': SONGPA_MOCK_DATA,
      '서초구': SEOCHO_MOCK_DATA,
    };

    // 경기도 Mock 데이터 매핑
    const gyeonggiMockDataMap: Record<string, RealTransaction[]> = {
      '용인시': YONGIN_CHEOIN_MOCK_DATA,
      '처인구': YONGIN_CHEOIN_MOCK_DATA,
      '용인시 처인구': YONGIN_CHEOIN_MOCK_DATA,
    };

    // 기간에 따라 필터링하는 함수
    const filterByPeriod = (data: RealTransaction[]) => {
      const now = new Date();
      const cutoffDate = new Date(now.getFullYear(), now.getMonth() - months, 1);
      const cutoffStr = `${cutoffDate.getFullYear()}${String(cutoffDate.getMonth() + 1).padStart(2, '0')}01`;
      return data.filter(t => t.dealDate >= cutoffStr);
    };

    if (isSeoul && seoulMockDataMap[sigungu]) {
      return filterByPeriod(seoulMockDataMap[sigungu]);
    }

    if (isYongin && (gyeonggiMockDataMap[sigungu] || isYonginCheoin)) {
      return filterByPeriod(YONGIN_CHEOIN_MOCK_DATA);
    }

    // 다른 지역은 빈 배열 반환 (추후 확장)
    return [];
  }

  const lawdCd = getLawdCode(sido, sigungu);
  if (!lawdCd) {
    console.warn(`법정동 코드를 찾을 수 없음: ${sido} ${sigungu}`);
    return [];
  }

  const dealYmds = getRecentMonths(months);
  const allTransactions: RealTransaction[] = [];

  // 병렬 호출 (한 번에 3개월씩)
  for (let i = 0; i < dealYmds.length; i += 3) {
    const batch = dealYmds.slice(i, i + 3);
    const results = await Promise.all(
      batch.map(ymd => getRealTransactionPrice(lawdCd, ymd, propertyType))
    );
    results.forEach(transactions => allTransactions.push(...transactions));
  }

  // 거래일 기준 내림차순 정렬
  allTransactions.sort((a, b) => b.dealDate.localeCompare(a.dealDate));

  return allTransactions;
}

/**
 * 통계 계산
 */
export function calculateStats(transactions: RealTransaction[]): PriceStats {
  if (transactions.length === 0) {
    return {
      avgPrice: 0,
      avgPricePerPyeong: 0,
      maxPrice: 0,
      minPrice: 0,
      totalCount: 0,
      recentTransactions: [],
    };
  }

  const prices = transactions.map(t => t.price);
  const pricesPerPyeong = transactions.map(t => t.pricePerPyeong).filter(p => p > 0);

  const avgPrice = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length);
  const avgPricePerPyeong = pricesPerPyeong.length > 0
    ? Math.round(pricesPerPyeong.reduce((a, b) => a + b, 0) / pricesPerPyeong.length)
    : 0;

  return {
    avgPrice,
    avgPricePerPyeong,
    maxPrice: Math.max(...prices),
    minPrice: Math.min(...prices),
    totalCount: transactions.length,
    recentTransactions: transactions.slice(0, 10), // 최근 10건
  };
}

/**
 * 시/군/구 + 물건종류로 실거래가 통계 조회 (통합 함수)
 */
export async function getRealPriceStats(
  sido: string,
  sigungu: string,
  propertyType: string,
  months: number = 6
): Promise<PriceStats> {
  const transactions = await getRecentTransactions(sido, sigungu, propertyType, months);
  return calculateStats(transactions);
}

/**
 * 가격 포맷 (억/만원)
 */
export function formatPrice(priceInManwon: number): string {
  if (priceInManwon >= 10000) {
    const eok = Math.floor(priceInManwon / 10000);
    const man = priceInManwon % 10000;
    return man > 0 ? `${eok}억 ${man.toLocaleString()}만원` : `${eok}억`;
  }
  return `${priceInManwon.toLocaleString()}만원`;
}

/**
 * 면적을 평으로 변환
 */
export function sqmToPyeong(sqm: number): number {
  return Math.round(sqm / 3.3058 * 10) / 10;
}
