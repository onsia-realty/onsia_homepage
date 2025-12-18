# 경매 기능 개발 진행 상황

> 최종 업데이트: 2025-12-18 (크롤러 구현 완료)

## 완료된 작업

### 1. Supabase 스키마 설계 ✅
- 파일: `docs/supabase-auction-schema.sql`
- 테이블:
  - `auctions` - 경매 물건 기본 정보
  - `auction_schedules` - 기일 내역
  - `auction_rights` - 권리 분석
  - `auction_analysis` - AI 분석 결과
  - `court_codes` - 법원 코드

### 2. Supabase 클라이언트 설정 ✅
- 파일: `src/lib/supabase.ts`
- 기능:
  - 클라이언트 생성 (anon key, service role key)
  - 타입 정의 (Auction, AuctionSchedule, AuctionRight, AuctionAnalysis)
  - 헬퍼 함수: `getAuctions()`, `getAuctionByCase()`, `getAuctionById()`, `getAuctionStats()`

### 3. 테스트 파일 ✅
- `test-supabase.mjs` - Supabase API 테스트 (통과)
- `test-db.ts` - Prisma DB 테스트
- `test-crawler.mjs` - 크롤러 테스트

### 4. 경매 페이지 UI ✅
- `src/app/auctions/page.tsx` - 경매 목록 페이지
- `src/app/auctions/[id]/page.tsx` - 경매 상세 페이지
- `src/app/auctions/[id]/AuctionDetailClient.tsx` - 상세 클라이언트 컴포넌트
- `src/components/auction/` - 경매 관련 컴포넌트들

### 5. API Routes ✅
- `src/app/api/auctions/` - 경매 API
- `src/app/api/auctions-supabase/` - Supabase 경매 API
- `src/app/api/court/` - 법원 API
- `src/app/api/crawler/` - 크롤러 API ⭐ NEW

### 6. 크롤러 구현 ✅ (구조 완성)
- `src/lib/crawler/court-crawler-service.ts` - 크롤러 핵심 로직
  - `crawlCaseDetail()` - 사건 상세 크롤링
  - `crawlPropertyList()` - 물건 목록 크롤링
  - `crawlSchedule()` - 기일 내역 크롤링
  - `crawlRights()` - 권리분석 크롤링
  - `crawlTenants()` - 임차인 정보 크롤링
  - `crawlImages()` - 이미지 URL 추출
  - `crawlAuction()` - 전체 크롤링 (병렬 실행)
- `src/lib/crawler/auction-saver.ts` - Supabase 저장 로직
  - `saveAuctionData()` - 크롤링 데이터 저장
  - `crawlAndSave()` - 크롤링 + 저장 통합
- `src/lib/crawler/index.ts` - 모듈 export

## 주의 사항 ⚠️

### 대법원 사이트 URL 문제
- 현재 대법원 사이트 URL 형식이 변경되었거나 세션이 필요할 수 있음
- 404 에러 발생 → URL 파라미터 조정 필요
- 해결 방법:
  1. 실제 브라우저에서 대법원 사이트 접속 후 Network 탭에서 URL 확인
  2. 필요시 Playwright로 브라우저 기반 크롤링으로 전환

## 다음 작업 예정

### 1. 크롤러 URL 수정
- 대법원 사이트 실제 URL 형식 확인
- 파라미터 조정 또는 Playwright 크롤링 전환

### 2. 경매 페이지 Supabase 연동 확인
- 현재 페이지들이 실제 Supabase 데이터 사용하는지 확인
- API 연동 테스트

### 3. 관리자 크롤링 UI
- 관리자 페이지에서 크롤링 실행 버튼
- 크롤링 상태 모니터링

## 환경 변수

```env
NEXT_PUBLIC_SUPABASE_URL=https://hwbozwggvlvqnqylunin.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=(설정 필요)
CRAWLER_API_KEY=dev-crawler-key  # 크롤러 API 인증용
```

## 크롤러 API 사용법

### GET - 크롤링 미리보기 (저장 안함)
```bash
curl "http://localhost:3000/api/crawler?courtCode=1710&caseNumber=2024타경85191"
```

### POST - 크롤링 + 저장
```bash
curl -X POST "http://localhost:3000/api/crawler" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer dev-crawler-key" \
  -d '{"courtCode": "1710", "caseNumber": "2024타경85191"}'
```

### 일괄 크롤링
```bash
curl -X POST "http://localhost:3000/api/crawler" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer dev-crawler-key" \
  -d '{
    "caseNumbers": [
      {"courtCode": "1710", "caseNumber": "2024타경85191"},
      {"courtCode": "1110", "caseNumber": "2024타경12345"}
    ]
  }'
```

## 파일 구조

```
src/
├── app/
│   ├── auctions/
│   │   ├── page.tsx              # 경매 목록
│   │   └── [id]/
│   │       ├── page.tsx          # 경매 상세
│   │       └── AuctionDetailClient.tsx
│   ├── admin/auctions/           # 관리자 경매 페이지
│   └── api/
│       ├── auctions/             # 경매 API
│       ├── auctions-supabase/    # Supabase API
│       ├── court/                # 법원 API
│       └── crawler/              # 크롤러 API ⭐
├── components/auction/           # 경매 컴포넌트
└── lib/
    ├── supabase.ts              # Supabase 클라이언트
    ├── court-auction.ts         # 법원 코드/파싱
    ├── court-crawler.ts         # 크롤러 URL 생성
    └── crawler/                 # 크롤러 모듈 ⭐
        ├── index.ts
        ├── court-crawler-service.ts  # 크롤링 로직
        └── auction-saver.ts          # 저장 로직

docs/
├── supabase-auction-schema.sql  # DB 스키마
├── court-auction-api.md         # API 문서
├── court-auction-crawling-guide.md
├── test-auction-data.sql        # 테스트 데이터
└── auction-progress.md          # 이 파일

test-supabase.mjs                # Supabase 테스트
test-db.ts                       # Prisma 테스트
test-crawler.mjs                 # 크롤러 테스트 ⭐
```

## Supabase 테스트 결과 (2025-12-18)

```
🔍 Supabase API 테스트 시작...

✅ auctions 조회 성공!
   - 총 5건 조회됨
   - 첫 번째 물건: 2024타경85191 - 경기도 용인시 수지구 성복2로 126...
✅ court_codes 조회 성공!
   - 총 5건 조회됨 (전체 18개 중)
✅ 2024타경85191 조회 성공!
   - 법원: 수원지방법원
   - 물건종류: 아파트
   - 감정가: 965,000,000원
   - 최저가: 675,500,000원
   - 상태: ACTIVE

✨ API 테스트 완료!
```

## 참고 링크

- Supabase Dashboard: https://supabase.com/dashboard/project/hwbozwggvlvqnqylunin
- 대법원 경매정보: https://www.courtauction.go.kr
