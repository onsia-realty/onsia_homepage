# 두인경매 크롤링 가이드

> 최종 업데이트: 2025-12-18

## 두인경매 사이트 정보

- **URL**: https://www.dooinauction.com
- **물건 상세**: `https://www.dooinauction.com/ca/caView.php?tid={물건ID}&free=1`
- **특징**: 대법원 경매 데이터를 정리해서 제공, 이미지/권리분석 포함

## 이미지 URL 패턴

### 물건 사진 (BA)
```
https://www.dooinauction.com/FILE/CA/BA/{법원코드}/{년도}/BA-{법원코드}-{사건번호전체}-{순번}.jpg
```

**예시:**
- `https://www.dooinauction.com/FILE/CA/BA/2110/2025/BA-2110-2025012345-001.jpg`
- `https://www.dooinauction.com/FILE/CA/BA/2510/2025/BA-2510-2025032633-002.jpg`

### 현황조사서 (BE)
```
https://www.dooinauction.com/FILE/CA/BE/{법원코드}/{년도}/BE-{법원코드}-{사건번호전체}-{순번}.jpg
```

**예시:**
- `https://www.dooinauction.com/FILE/CA/BE/2110/2025/BE-2110-2025012345-001.jpg`
- `https://www.dooinauction.com/FILE/CA/BE/2510/2025/BE-2510-2025032633-006.jpg`

### 파라미터 설명
| 파라미터 | 설명 | 예시 |
|---------|------|------|
| 법원코드 | 4자리 법원 코드 | 2110 (부산), 2510 (창원), 3110 (광주) |
| 년도 | 사건 년도 | 2025 |
| 사건번호전체 | 년도 + 사건번호 | 2025012345, 2025032633 |
| 순번 | 이미지 순번 (3자리) | 001, 002, 006 |

## 법원 코드 맵핑

```javascript
const COURT_CODES = {
  '서울중앙지방법원': '1110',
  '서울동부지방법원': '1111',
  '서울서부지방법원': '1112',
  '서울남부지방법원': '1113',
  '서울북부지방법원': '1114',
  '의정부지방법원': '1130',
  '인천지방법원': '1310',
  '수원지방법원': '1710',
  '부산지방법원': '2110',
  '울산지방법원': '2310',
  '창원지방법원': '2510',
  '대구지방법원': '2710',
  '광주지방법원': '3110',
  '전주지방법원': '3310',
  '제주지방법원': '3510',
  '대전지방법원': '3710',
  '청주지방법원': '3910',
};
```

## 데이터 구조 (Prisma 모델 기준)

### AuctionItem (경매 물건)
```typescript
{
  // 식별자
  caseNumber: "2025타경12345",      // 사건번호
  caseNumberFull: "20250210012345", // 사건번호 전체 (법원코드+년도+번호)
  courtCode: "2110",                // 법원코드
  courtName: "부산지방법원",
  pnu: "2635010100101230000",       // 필지고유번호 (19자리)

  // 기본정보
  address: "부산광역시 해운대구 우동 1495 센텀스카이비즈 제102동 제46층 제4603호",
  addressDetail: "102동 46층 4603호",
  city: "부산",
  district: "해운대구",
  itemType: "OFFICETEL",            // APARTMENT, VILLA, OFFICETEL, HOUSE, COMMERCIAL, LAND, FACTORY, BUILDING
  landArea: 35.26,                  // 대지면적 (㎡)
  buildingArea: 213.55,             // 건물면적 (㎡)
  floor: "46층",
  totalFloors: "지하4층~지상51층",
  buildingStructure: "철근콘크리트조",
  buildingUsage: "오피스텔",
  landUseZone: "일반상업지역",

  // 감정평가
  appraisalOrg: "대한감정원",
  appraisalDate: "2025-03-25",
  preservationDate: "2011-06-28",   // 보존등기일
  approvalDate: "2011-05-25",       // 사용승인일
  landAppraisalPrice: 834000000,    // 토지 감정가
  buildingAppraisalPrice: 1946000000, // 건물 감정가

  // 가격정보
  appraisalPrice: 2780000000,       // 감정가 합계
  minimumPrice: 1946000000,         // 최저가
  minimumRate: 70,                  // 최저가율 (%)
  deposit: 194600000,               // 보증금 (10%)

  // 일정
  saleDate: "2026-01-15T10:00:00",  // 매각기일
  saleTime: "10:00",
  bidCount: 1,                      // 입찰횟수 (회차)
  bidEndDate: "2025-08-15",         // 배당요구종기일

  // 권리분석
  referenceDate: "2020-05-10",      // 말소기준일
  hasRisk: false,                   // 위험물건 여부
  riskNote: null,

  // 당사자
  owner: "김*수",
  debtor: "김*수",
  creditor: "국민은행",

  // 상태
  status: "SCHEDULED",              // SCHEDULED, BIDDING, SUCCESSFUL, FAILED, WITHDRAWN, CANCELED
  featured: true,

  // 현황/위치 정보
  surroundings: "...",              // 주변환경
  transportation: "...",            // 교통 정보
  nearbyFacilities: "신세계백화점, 롯데백화점, 벡스코",
  heatingType: "개별난방 (도시가스)",
  facilities: '["승강기", "시스템에어컨", "주차장"]',
  locationNote: "...",
}
```

### AuctionImage (이미지)
```typescript
{
  imageType: "PHOTO",    // PHOTO, SURVEY, APPRAISAL, REGISTER, OTHER
  url: "https://www.dooinauction.com/FILE/CA/BA/2110/2025/BA-2110-2025012345-001.jpg",
  alt: "건물 외관",
  order: 0,
}
```

### AuctionBid (입찰 내역)
```typescript
{
  round: 1,              // 회차
  bidDate: "2026-01-15",
  minimumPrice: 1946000000,
  result: "POSTPONED",   // FAILED, SUCCESSFUL, WITHDRAWN, POSTPONED
  winningPrice: null,
  bidderCount: null,
}
```

### AuctionRegister (등기 내역)
```typescript
{
  registerType: "을",    // 갑/을
  registerNo: "3",       // 순위번호
  receiptDate: "2020-05-10",
  purpose: "근저당권설정",
  rightHolder: "국민은행",
  claimAmount: 2400000000,
  isReference: true,     // 말소기준등기 여부
  willExpire: true,      // 소멸여부
  note: "말소기준등기",
}
```

### AuctionTenant (임차인)
```typescript
{
  tenantName: "홍*동",
  hasPriority: true,     // 대항력 유무
  occupiedPart: "전체",
  moveInDate: "2020-01-15",
  fixedDate: "2020-01-20",
  hasBidRequest: true,   // 배당요구 여부
  deposit: 100000000,
  monthlyRent: 0,
  analysis: "선순위 임차인, 배당 예상",
}
```

## 이미지 URL 생성 함수

```typescript
function generateDooinImageUrl(
  courtCode: string,
  caseNumberFull: string,
  imageType: 'BA' | 'BE',  // BA: 물건사진, BE: 현황조사서
  order: number
): string {
  const year = caseNumberFull.substring(0, 4);
  const orderStr = String(order).padStart(3, '0');
  return `https://www.dooinauction.com/FILE/CA/${imageType}/${courtCode}/${year}/${imageType}-${courtCode}-${caseNumberFull}-${orderStr}.jpg`;
}

// 사용 예시
const photoUrl = generateDooinImageUrl('2110', '2025012345', 'BA', 1);
// => https://www.dooinauction.com/FILE/CA/BA/2110/2025/BA-2110-2025012345-001.jpg
```

## 샘플 데이터 (Prisma DB)

### 물건 1: 부산 센텀스카이비즈 오피스텔
- **사건번호**: 2025타경12345
- **법원**: 부산지방법원 (2110)
- **주소**: 부산광역시 해운대구 우동 1495 센텀스카이비즈 제102동 제46층 제4603호
- **물건종류**: 오피스텔
- **감정가**: 27억 8천만원
- **최저가**: 19억 4,600만원 (70%)
- **이미지**: 3개 (물건사진 2개, 현황조사서 1개)

### 물건 2: 광주 상무자이아파트
- **사건번호**: 2025타경32633
- **법원**: 광주지방법원 (3110)
- **주소**: 광주광역시 서구 마륵동 1 상무자이아파트 제104동 제1층 제103호
- **물건종류**: 아파트
- **감정가**: 10억 8,400만원
- **최저가**: 7억 5,880만원 (70%)
- **이미지**: 3개

## Prisma → Supabase 마이그레이션

1. `prisma-auction-export.json` 파일 생성됨
2. Supabase `auctions` 테이블에 데이터 삽입
3. 이미지 URL 배열로 저장

```sql
-- Supabase에서 이미지 조회
SELECT case_number, images FROM auctions WHERE images IS NOT NULL;
```

## 참고 링크

- 두인경매: https://www.dooinauction.com
- 대법원 경매: https://www.courtauction.go.kr
- Prisma 데이터 export: `prisma-auction-export.json`
