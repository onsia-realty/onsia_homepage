# ONSIA 분양권 투자 플랫폼

분양권 투자 매물 정보를 제공하는 웹 플랫폼입니다.

## 🚀 빠른 시작

### 처음 환경 구성하는 경우
**집에서 개발 환경을 처음 구성하는 경우** `SETUP.md` 파일을 참조하세요.
- 상세한 환경 구성 가이드
- 문제 해결 방법
- Git 워크플로우

### 이미 환경이 구성된 경우

```bash
# 의존성 설치
npm install

# 환경 변수 설정 (.env 파일 생성)
cp .env.example .env
# .env 파일을 열어 필요한 값 설정

# 데이터베이스 설정
npx prisma generate
npx prisma migrate dev
npm run db:seed

# 개발 서버 실행
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 으로 접속하세요.

## 📋 주요 기능

- 분양권 매물 정보 조회 및 상세 페이지
- 매물 검색 및 필터링
- 사용자 문의 시스템
- 관리자 페이지 (매물 관리)

## 🛠️ 기술 스택

- **Next.js 15.5.2** - React 프레임워크
- **React 19.1.0** - UI 라이브러리
- **Prisma 6.15.0** - ORM
- **SQLite** - 데이터베이스
- **Tailwind CSS 4** - 스타일링
- **TypeScript 5** - 타입 안정성

## 📚 문서

- **SETUP.md** - 초기 환경 구성 가이드
- **CLAUDE.md** - 프로젝트 전체 가이드 (구조, 개발 규칙, API 등)
- **관리자.md** - 관리자 페이지 개발 가이드

## 🔧 주요 명령어

```bash
npm run dev          # 개발 서버 실행 (Turbopack)
npm run build        # 프로덕션 빌드
npm run start        # 프로덕션 서버
npm run lint         # 린트 검사

# 데이터베이스 관련
npm run db:seed      # 시드 데이터 삽입
npm run db:reset     # DB 초기화 (주의: 데이터 삭제)
npm run db:push      # 스키마 푸시
npx prisma studio    # Prisma Studio (GUI 툴)
```

## 📁 프로젝트 구조

```
onsia_homepage/
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── properties/   # 매물 페이지
│   │   ├── about/        # 회사 소개
│   │   └── api/          # API 라우트
│   ├── components/       # 재사용 컴포넌트
│   └── lib/              # 유틸리티 함수
├── prisma/
│   ├── schema.prisma     # 데이터베이스 스키마
│   ├── seed.ts           # 시드 데이터
│   └── dev.db            # SQLite DB (자동 생성)
└── public/               # 정적 파일
```

## 🔐 환경 변수

`.env.example` 파일을 참조하여 `.env` 파일을 생성하세요.

필수 환경 변수:
- `DATABASE_URL` - 데이터베이스 연결 URL (SQLite)
- `NEXTAUTH_SECRET` - NextAuth.js 시크릿 키
- `NEXTAUTH_URL` - 애플리케이션 URL

## 🐛 문제 해결

상세한 문제 해결 방법은 `SETUP.md` 파일의 "문제 해결" 섹션을 참조하세요.

## 📄 라이선스

Private Project

## 🔗 관련 링크

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
