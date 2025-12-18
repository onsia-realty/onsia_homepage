# 대법원 법원경매정보 API 패턴

## 개요

대법원 법원경매정보 시스템 (courtauction.go.kr)의 URL 패턴 및 크롤링 가이드

## 기본 URL

```
https://www.courtauction.go.kr
```

## 법원 코드 (spt/jiwonCd)

| 코드 | 법원명 |
|------|--------|
| 1110 | 서울중앙지방법원 |
| 1111 | 서울동부지방법원 |
| 1112 | 서울서부지방법원 |
| 1113 | 서울남부지방법원 |
| 1114 | 서울북부지방법원 |
| 1130 | 의정부지방법원 |
| 1310 | 인천지방법원 |
| 1510 | 춘천지방법원 |
| 1710 | 수원지방법원 |
| 1711 | 성남지원 |
| 1712 | 여주지원 |
| 1713 | 평택지원 |
| 1714 | 안산지원 |
| 1715 | 안양지원 |
| 2110 | 부산지방법원 |
| 2111 | 부산동부지원 |
| 2112 | 부산서부지원 |
| 2310 | 울산지방법원 |
| 2510 | 창원지방법원 |
| 2710 | 대구지방법원 |
| 3110 | 광주지방법원 |
| 3310 | 전주지방법원 |
| 3510 | 제주지방법원 |
| 3710 | 대전지방법원 |
| 3910 | 청주지방법원 |

## 주요 API 엔드포인트

### 1. 물건 검색

```
/RetrieveRealEstSrchList.laf
```

**파라미터:**
- `jiwonNm`: 법원명 (예: 수원지방법원)
- `realVowel`: 물건종류 (A:아파트, B:빌라, C:상가, D:오피스텔...)
- `lclsUtilCd`: 용도 (0001:주거용, 0002:상업용...)
- `termStartDt`: 검색시작일 (YYYYMMDD)
- `termEndDt`: 검색종료일 (YYYYMMDD)

### 2. 물건 상세 조회

```
/RetrieveRealEstDetailInqSaList.laf
```

**파라미터:**
- `jiwonCd`: 법원코드 (예: 1710)
- `saession`: 사건구분 (3: 타경)
- `srnoChamCdNm`: 사건종류 (경)
- `dession`: 사건년도 (2024)
- `saession3`: 사건번호 (85191)

### 3. 사건 기본내역

```
/RetrieveRealEstCaramInf.laf
```

**파라미터:**
- `jiwonCd`: 법원코드
- `saession`: 사건구분
- `saession2`: 세션2
- `saession3`: 사건번호

### 4. 기일내역 조회

```
/RetrieveSaleSchdInqSaleList.laf
```

### 5. 문건/송달 조회

```
/RetrieveSendOfcDcmtInqList.laf
```

### 6. 감정평가서 조회

```
/RetrieveRealEstApslJdgmInqList.laf
```

### 7. 매각물건명세서

```
/RetrieveRealEstSaleStmtInqList.laf
```

## 두인경매 파일 타입 코드 (tp)

| 코드 | 자료 유형 |
|------|-----------|
| AA | 사건내역 |
| AB | 기일내역 |
| AC | 문건/송달 |
| AD | 현황조사서 |
| AE | 부동산표시 |
| AF | 감정평가서 |
| AG | 매물명세서 |
| AH | 건물등기 |
| AI | 세대열람 |

## 사건번호 파싱

사건번호 형식: `2024타경85191`

```typescript
function parseCaseNumber(caseNumber: string) {
  // 2024타경85191 -> { year: 2024, type: '타경', number: 85191 }
  const match = caseNumber.match(/(\d{4})(\D+)(\d+)/);
  if (!match) return null;

  return {
    year: match[1],      // 2024
    type: match[2],      // 타경
    number: match[3],    // 85191
    saession: match[2] === '타경' ? 3 : 2, // 타경=3, 경=2
  };
}
```

## 대법원 직접 링크 생성

### 사건 상세 페이지

```typescript
function getCourtAuctionDetailUrl(courtCode: string, caseNumber: string) {
  const parsed = parseCaseNumber(caseNumber);
  if (!parsed) return null;

  return `https://www.courtauction.go.kr/RetrieveRealEstDetailInqSaList.laf?jiwonCd=${courtCode}&saession=${parsed.saession}&srnoChamCdNm=${parsed.type.charAt(0)}&dession=${parsed.year}&saession3=${parsed.number}`;
}
```

### 물건 목록 검색

```typescript
function getCourtAuctionSearchUrl(courtName: string, itemType?: string) {
  const params = new URLSearchParams({
    jiwonNm: courtName,
    ...(itemType && { realVowel: itemType }),
  });

  return `https://www.courtauction.go.kr/RetrieveRealEstSrchList.laf?${params}`;
}
```

## 크롤링 시 주의사항

1. **세션 관리**: 대법원 사이트는 세션 기반, 쿠키 유지 필요
2. **속도 제한**: 과도한 요청 시 IP 차단 가능, 딜레이 필요 (1-2초)
3. **로봇 차단**: User-Agent 설정 및 헤더 관리 필요
4. **점검 시간**: 야간/주말 시스템 점검 빈번
5. **데이터 캐싱**: 동일 데이터 반복 요청 방지를 위한 캐싱 권장

## 크롤링 전략

### 1단계: 마이옥션 크롤링 (권장)
- 이미 정리된 데이터 제공
- 임차인/등기부/배당표 무료
- 인증 필요 (계정: realtors7)

### 2단계: 두인경매 크롤링 (사진용)
- 사진 50장+ 제공
- 핵심 데이터는 유료

### 3단계: 대법원 직접 크롤링 (원본)
- 가장 정확한 원본 데이터
- 크롤링 난이도 높음
- 실시간 데이터 필요시 사용

## 참고 사이트

- 대법원 경매정보: https://www.courtauction.go.kr
- 마이옥션: https://www.my-auction.co.kr
- 두인경매: https://www.dooinauction.com
- 지지옥션: https://www.ggi.co.kr
- 굿옥션: https://www.goodauction.com
