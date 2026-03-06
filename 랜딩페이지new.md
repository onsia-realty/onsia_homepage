# ONSIA 분양 랜딩페이지 시스템 설계

## 개요
`onsia.city` 도메인 하위 경로로 분양 현장별 랜딩페이지를 운영하는 시스템.
코드 1개 + DB 데이터로 무한 확장 가능.

## 도메인 전략

| 도메인 | 용도 |
|--------|------|
| `booin.co.kr` | 구인구직 플랫폼 (부동산인) |
| `onsia.city` | 분양 랜딩페이지 + 부동산 AI 플랫폼 |

### URL 구조
```
onsia.city/                        ← 메인 (현재)
onsia.city/landing/abanhomes       ← 아반홈즈 랜딩
onsia.city/landing/hillstate-gn    ← 힐스테이트 강남
onsia.city/landing/prugio-sejong   ← 푸르지오 세종
onsia.city/landing/...             ← 무한 확장
```

## 기술 구조

### 핵심: 동적 라우트 1개
```
src/app/landing/[slug]/page.tsx    ← 파일 1개로 모든 랜딩페이지 처리
```

### 동작 원리
1. 사용자가 `onsia.city/landing/abanhomes` 접속
2. `[slug]` = `abanhomes` → DB에서 해당 현장 데이터 조회
3. 데이터로 페이지 렌더링 (SSG/ISR)
4. 코드 스플리팅으로 해당 페이지 JS만 로드 (다른 랜딩 코드 로드 안 됨)

### 용량/성능 영향
- 사용자 로딩 속도: 영향 없음 (페이지별 코드 스플리팅)
- 빌드 시간: 50페이지 기준 +1~2분
- Vercel 배포: 무료 플랜 한도 충분
- Git 저장소: 코드는 텍스트라 거의 안 커짐

## DB 스키마 (Supabase)

### `landing_pages` 테이블
```sql
CREATE TABLE landing_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,              -- URL 슬러그 (abanhomes, hillstate-gn)

  -- 기본 정보
  project_name TEXT NOT NULL,             -- 현장명 (아반홈즈)
  company_name TEXT,                      -- 시행/시공사
  location TEXT,                          -- 위치 (서울시 강남구)
  property_type TEXT,                     -- 유형 (아파트, 오피스텔, 상가, 지산)

  -- 분양 정보
  total_units INTEGER,                    -- 총 세대수
  price_range TEXT,                       -- 분양가 범위
  move_in_date TEXT,                      -- 입주 예정일
  sale_status TEXT DEFAULT 'ongoing',     -- 분양 상태 (ongoing, completed, upcoming)

  -- 콘텐츠
  hero_title TEXT,                        -- 히어로 타이틀
  hero_subtitle TEXT,                     -- 히어로 서브타이틀
  hero_image_url TEXT,                    -- 히어로 배경 이미지
  description TEXT,                       -- 상세 설명
  features JSONB DEFAULT '[]',            -- 특장점 리스트
  gallery JSONB DEFAULT '[]',             -- 갤러리 이미지 URL 배열
  floor_plans JSONB DEFAULT '[]',         -- 평면도 이미지 배열

  -- 연락처
  contact_phone TEXT,                     -- 대표 전화번호
  contact_kakao TEXT,                     -- 카카오톡 채널

  -- SEO
  meta_title TEXT,                        -- 페이지 타이틀 (없으면 project_name 사용)
  meta_description TEXT,                  -- 메타 설명
  meta_keywords TEXT[],                   -- 키워드 배열
  og_image_url TEXT,                      -- OG 이미지

  -- 상태
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 인덱스
CREATE INDEX idx_landing_slug ON landing_pages(slug);
CREATE INDEX idx_landing_active ON landing_pages(is_active);
```

## SEO 전략

### 자동 생성 메타데이터
- `generateMetadata()` 함수에서 DB 데이터로 동적 생성
- 페이지별 title, description, keywords, OG 이미지
- JSON-LD: RealEstateListing 스키마

### 사이트맵 자동 포함
- `sitemap.ts`에서 `landing_pages` 테이블 조회 → 자동 사이트맵 생성

### SEO 선순환 효과
- 랜딩페이지 추가될수록 `onsia.city` 도메인 콘텐츠 풍부해짐
- 도메인 전체 검색 순위 상승
- `booin.co.kr` ↔ `onsia.city` 상호 백링크로 양쪽 SEO 강화

## 상호 연동 (booin.co.kr ↔ onsia.city)

### booin.co.kr → onsia.city
- 분양 채용공고에 "이 현장 분양정보 보기" 링크
- 뉴스 기사에 관련 분양 현장 링크

### onsia.city → booin.co.kr
- 랜딩페이지에 "이 현장 상담사 채용중" 링크
- 하단에 "부동산인에서 구인구직 확인" 배너

## 운영 워크플로우

### 새 현장 추가 (코드 수정 없음)
1. Supabase `landing_pages` 테이블에 데이터 추가
2. 이미지 업로드 (Supabase Storage)
3. `onsia.city/landing/새슬러그` 즉시 접속 가능
4. 사이트맵 자동 갱신 → 구글/네이버 자동 색인

### 디자인 수정 (전체 일괄 반영)
1. `src/app/landing/[slug]/page.tsx` 수정
2. 배포 → 모든 랜딩페이지 일괄 반영

## 확장 가능성

### Phase 1: 기본 랜딩
- 정적 정보 표시 (현장 소개, 갤러리, 연락처)

### Phase 2: 기능 추가
- 방문 예약 폼
- 관심고객 등록
- 조회수/전환율 통계 대시보드

### Phase 3: 유료 서비스
- 프리미엄 디자인 템플릿
- 고객별 커스텀 도메인 연결 (Vercel 커스텀 도메인)
- 마케팅 분석 리포트

---

*작성일: 2026-03-07*
