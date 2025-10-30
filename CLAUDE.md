# ONSIA 분양권 투자 플랫폼 - 프로젝트 가이드

## 📋 프로젝트 개요

**프로젝트명**: ONSIA 분양권 투자 플랫폼
**목적**: 분양권 투자 매물 정보 제공 및 관리 시스템
**프로젝트 경로**: `D:\claude\홈페이지\onsia_homepage`

### 핵심 기능
- 분양권 매물 정보 조회 및 상세 페이지
- 매물 검색 및 필터링
- 사용자 문의 시스템
- 관리자 페이지 (매물 관리)

## 🛠️ 기술 스택

### Frontend
- **Next.js 15.5.2** - React 프레임워크 (App Router 사용)
- **React 19.1.0** - UI 라이브러리
- **Tailwind CSS 4** - 스타일링
- **Framer Motion 12** - 애니메이션
- **Lucide React** - 아이콘

### Backend & Database
- **Prisma 6.15.0** - ORM
- **SQLite** - 데이터베이스 (개발용)
- **NextAuth.js 4.24.11** - 인증 시스템

### Development Tools
- **TypeScript 5** - 타입 안정성
- **ESLint** - 코드 품질
- **Turbopack** - 빌드 최적화

## 📂 프로젝트 구조

```
onsia_homepage/
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── about/        # 회사 소개
│   │   ├── api/          # API 라우트
│   │   ├── properties/   # 매물 페이지
│   │   ├── globals.css   # 전역 스타일
│   │   ├── layout.tsx    # 루트 레이아웃
│   │   └── page.tsx      # 홈페이지
│   ├── components/       # 재사용 컴포넌트
│   └── lib/              # 유틸리티 함수
├── prisma/
│   ├── schema.prisma     # 데이터베이스 스키마
│   ├── seed.ts           # 시드 데이터
│   ├── migrations/       # DB 마이그레이션
│   └── dev.db            # SQLite 데이터베이스
├── public/               # 정적 파일
└── .env                  # 환경 변수
```

## 🗄️ 데이터베이스 스키마

### 핵심 모델

#### User (사용자)
- `id`: 고유 ID
- `email`: 이메일 (unique)
- `name`: 이름
- `role`: 권한 (ADMIN | USER)
- 관계: properties, inquiries, posts

#### Property (매물)
- 기본 정보: title, description, location, address
- 가격 정보: price, pricePerPyeong, premium, downPayment
- 단지 정보: households, buildings, parking, facilities
- 투자 정보: expectedReturn, investmentGrade, riskLevel
- 상태: status (AVAILABLE | SOLD | PENDING)
- 관계: images, developer, inquiries

#### PropertyImage (매물 이미지)
- url, alt, order
- 관계: property

#### Developer (건설사)
- name, description, established, website
- 관계: properties

#### PropertyInquiry (매물 문의)
- name, email, phone, message
- 관계: property, user

## 🚀 개발 가이드

### 환경 설정

```bash
# 의존성 설치
npm install

# Prisma 설정
npx prisma generate
npx prisma migrate dev

# 개발 서버 실행
npm run dev
```

### 주요 명령어

```bash
npm run dev          # 개발 서버 (Turbopack)
npm run build        # 프로덕션 빌드
npm run start        # 프로덕션 서버
npm run lint         # 린트 검사

# Prisma 관련
npm run db:seed      # 시드 데이터 삽입
npm run db:reset     # DB 초기화
npm run db:push      # 스키마 푸시
npx prisma studio    # Prisma Studio (GUI)
```

### 개발 워크플로우

1. **기능 개발**
   - App Router 사용 (`src/app/` 디렉토리)
   - 서버 컴포넌트 우선 사용
   - 필요시 'use client' 지시어 추가

2. **데이터베이스 변경**
   ```bash
   # schema.prisma 수정 후
   npx prisma migrate dev --name 변경사항_설명
   npx prisma generate
   ```

3. **스타일링**
   - Tailwind CSS 유틸리티 클래스 사용
   - 반응형 디자인 필수 (mobile-first)

4. **상태 관리**
   - Server Components: 직접 DB 조회
   - Client Components: fetch/SWR 사용

## 📝 코딩 규칙

### 파일 네이밍
- 컴포넌트: PascalCase (`PropertyCard.tsx`)
- 유틸리티: camelCase (`formatPrice.ts`)
- 페이지: Next.js 규칙 (`page.tsx`, `layout.tsx`)

### 코드 스타일
- TypeScript 타입 명시
- async/await 사용 (Promise 체이닝 X)
- 에러 처리 필수
- 주석은 필요시에만 (자명한 코드 작성)

### 컴포넌트 패턴
```typescript
// Server Component (기본)
export default async function PropertyPage({ params }: Props) {
  const property = await getProperty(params.id);
  return <PropertyDetail property={property} />;
}

// Client Component (인터랙션 필요시)
'use client';
export default function PropertyForm() {
  const [data, setData] = useState({});
  // ...
}
```

## 🔐 인증 시스템

### NextAuth 설정
- Provider: Credentials (이메일/비밀번호)
- Session Strategy: JWT
- 보호된 라우트: `/admin/*`

### 권한 관리
- `ADMIN`: 관리자 (매물 등록/수정/삭제)
- `USER`: 일반 사용자 (조회, 문의)

## 📊 API 라우트

### 매물 관련
- `GET /api/properties` - 매물 목록 조회
- `GET /api/properties/:id` - 매물 상세 조회
- `POST /api/properties` - 매물 등록 (관리자)
- `PUT /api/properties/:id` - 매물 수정 (관리자)
- `DELETE /api/properties/:id` - 매물 삭제 (관리자)

### 문의 관련
- `POST /api/inquiries` - 문의 등록
- `GET /api/inquiries` - 문의 목록 (관리자)

## 🎨 UI/UX 가이드라인

### 디자인 원칙
- 모바일 우선 반응형
- 직관적인 네비게이션
- 빠른 로딩 속도
- 접근성 준수 (a11y)

### 색상 체계
- Primary: Tailwind 기본 색상 사용
- 매물 상태별 색상 구분
  - AVAILABLE: 초록색
  - SOLD: 회색
  - PENDING: 주황색

## 🔄 작업 히스토리

### 최근 작업 내용
1. ✅ Next.js 15 + React 19 프로젝트 초기 설정
2. ✅ Prisma 스키마 설계 (Property, User, Developer 등)
3. ✅ 시드 데이터 생성
4. ✅ 매물 상세 페이지 UI 개선
5. ✅ 추천 매물 필터 수정
6. ✅ .gitignore 업데이트 및 데이터베이스 포함

### 진행 예정 작업
1. ⏳ 관리자 페이지 구축
   - NextAuth 인증 설정
   - 관리자 레이아웃
   - 매물 목록/등록/수정 페이지
   - 이미지 업로드 시스템

2. ⏳ 프론트엔드 DB 연동
   - mockData 제거
   - API 연동

3. ⏳ 추가 기능
   - 검색 최적화
   - 필터링 고도화
   - 문의 시스템 완성

## 📚 참고 문서

### 프로젝트 문서
- `관리자.md`: 관리자 페이지 구축 가이드
- `README.md`: Next.js 기본 가이드

### 외부 문서
- [Next.js 15 문서](https://nextjs.org/docs)
- [Prisma 문서](https://www.prisma.io/docs)
- [NextAuth.js 문서](https://next-auth.js.org)
- [Tailwind CSS 문서](https://tailwindcss.com/docs)

## 🐛 트러블슈팅

### 자주 발생하는 문제

1. **Prisma Client 에러**
   ```bash
   npx prisma generate
   ```

2. **포트 충돌 (3000)**
   ```bash
   # 포트 변경
   npm run dev -- -p 3001
   ```

3. **타입 에러**
   - `prisma/schema.prisma` 수정 후 재생성 필요
   - TypeScript 서버 재시작

## 🔗 관련 링크

- **프로젝트 저장소**: (Git 저장소 URL 추가 예정)
- **배포 URL**: (배포 후 추가)
- **Prisma Studio**: `npx prisma studio` (http://localhost:5555)

---

## 📌 중요 사항

### 개발 시 주의사항
1. **데이터베이스 변경 시** 항상 마이그레이션 생성
2. **환경 변수** .env 파일 절대 커밋 금지
3. **타입 안정성** any 타입 사용 지양
4. **컴포넌트 재사용** 중복 코드 최소화
5. **에러 처리** try-catch 블록 사용

### 배포 전 체크리스트
- [ ] 모든 타입 에러 해결
- [ ] ESLint 경고 해결
- [ ] 프로덕션 빌드 성공 확인
- [ ] 환경 변수 설정
- [ ] 데이터베이스 마이그레이션
- [ ] 성능 최적화 (이미지, 코드 스플리팅)

---

*최종 수정일: 2025-10-08*
