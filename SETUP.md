# 🏠 집에서 개발 환경 구성하기

이 문서는 집에서 노트북과 동일한 개발 환경을 구성하는 방법을 안내합니다.

## 📋 사전 요구사항

### 1. Node.js 설치
- **버전**: Node.js v22.19.0 이상 권장 (최소 v18 이상)
- **다운로드**: https://nodejs.org/
- **설치 확인**:
  ```bash
  node --version  # v22.19.0
  npm --version   # 10.9.3
  ```

### 2. Git 설치
- **다운로드**: https://git-scm.com/
- **설치 확인**:
  ```bash
  git --version
  ```

### 3. 코드 에디터
- **추천**: Visual Studio Code
- **다운로드**: https://code.visualstudio.com/

## 🚀 환경 구성 단계

### 1단계: 저장소 클론

```bash
# 프로젝트를 저장할 디렉토리로 이동
cd ~/Projects  # 또는 원하는 경로

# GitHub에서 클론
git clone https://github.com/onsia-realty/onsia_homepage.git

# 프로젝트 디렉토리로 이동
cd onsia_homepage
```

### 2단계: 의존성 설치

```bash
# npm 패키지 설치
npm install
```

이 과정에서 다음 항목들이 설치됩니다:
- Next.js 15.5.2
- React 19.1.0
- Prisma 6.15.0
- Tailwind CSS 4
- 기타 모든 필요한 패키지

### 3단계: 환경 변수 설정

```bash
# .env.example 파일을 .env로 복사
cp .env.example .env

# .env 파일 편집 (VSCode 사용 예시)
code .env
```

`.env` 파일을 열고 다음 값을 설정:

```env
# Database (SQLite - 자동 생성됨)
DATABASE_URL="file:./dev.db"

# NextAuth.js Secret 생성
# Git Bash나 터미널에서:
# openssl rand -base64 32
NEXTAUTH_SECRET="여기에_생성된_시크릿_키_입력"
NEXTAUTH_URL="http://localhost:3000"
```

### 4단계: 데이터베이스 설정

```bash
# Prisma 클라이언트 생성
npx prisma generate

# 데이터베이스 마이그레이션 실행 (SQLite DB 파일 생성)
npx prisma migrate dev

# 시드 데이터 삽입 (샘플 매물 데이터)
npm run db:seed
```

이 과정에서 `prisma/dev.db` 파일이 자동으로 생성됩니다.

### 5단계: 개발 서버 실행

```bash
# 개발 서버 시작 (Turbopack 사용)
npm run dev
```

브라우저에서 http://localhost:3000 으로 접속하면 됩니다.

## ✅ 확인 사항

### 정상 작동 확인

1. **서버 실행 확인**
   ```bash
   npm run dev
   ```
   터미널에 다음과 같은 메시지가 표시되어야 함:
   ```
   ▲ Next.js 15.5.2
   - Local:        http://localhost:3000
   ✓ Ready in 2.3s
   ```

2. **데이터베이스 확인**
   ```bash
   # Prisma Studio 실행 (GUI 툴)
   npx prisma studio
   ```
   브라우저에서 http://localhost:5555 으로 접속하여 데이터 확인

3. **페이지 접속 확인**
   - 홈페이지: http://localhost:3000
   - 매물 목록: http://localhost:3000/properties
   - 회사 소개: http://localhost:3000/about

## 🔧 문제 해결

### Port 3000이 이미 사용 중인 경우
```bash
# 다른 포트로 실행
npm run dev -- -p 3001
```

### Prisma 클라이언트 에러
```bash
# Prisma 재생성
npx prisma generate
```

### node_modules 문제
```bash
# 의존성 재설치
rm -rf node_modules package-lock.json
npm install
```

### 데이터베이스 초기화 필요 시
```bash
# 데이터베이스 완전 초기화 (주의: 모든 데이터 삭제됨)
npm run db:reset
```

## 📁 프로젝트 구조

```
onsia_homepage/
├── src/
│   ├── app/              # Next.js 페이지 (App Router)
│   │   ├── properties/   # 매물 관련 페이지
│   │   ├── about/        # 회사 소개
│   │   └── api/          # API 라우트
│   ├── components/       # 재사용 컴포넌트
│   └── lib/              # 유틸리티 함수
├── prisma/
│   ├── schema.prisma     # 데이터베이스 스키마
│   ├── seed.ts           # 시드 데이터
│   ├── migrations/       # DB 마이그레이션
│   └── dev.db            # SQLite 데이터베이스 (생성됨)
├── public/               # 정적 파일
├── .env                  # 환경 변수 (생성 필요)
├── .env.example          # 환경 변수 템플릿
└── package.json          # 프로젝트 설정
```

## 🔄 Git 워크플로우

### 변경사항 확인
```bash
git status
git diff
```

### 변경사항 커밋
```bash
git add .
git commit -m "변경 내용 설명"
```

### GitHub에 푸시
```bash
git push origin master
```

### 최신 변경사항 가져오기
```bash
git pull origin master
```

## 📚 추가 리소스

- **프로젝트 가이드**: `CLAUDE.md` 파일 참조
- **관리자 페이지 개발**: `관리자.md` 파일 참조
- **Next.js 문서**: https://nextjs.org/docs
- **Prisma 문서**: https://www.prisma.io/docs
- **Tailwind CSS 문서**: https://tailwindcss.com/docs

## 💡 개발 팁

1. **자동 새로고침**: 코드 변경 시 브라우저가 자동으로 새로고침됩니다.
2. **Turbopack**: Next.js 15의 새로운 번들러로 빠른 개발 경험을 제공합니다.
3. **TypeScript**: 모든 파일에 타입을 명시하여 안전한 코드를 작성하세요.
4. **Prisma Studio**: 데이터베이스를 GUI로 관리할 수 있습니다.

## 🆘 도움이 필요한 경우

문제가 발생하면:
1. 에러 메시지를 확인
2. `CLAUDE.md` 파일의 "트러블슈팅" 섹션 참조
3. 터미널 출력을 캡처하여 팀원과 공유

---

**준비 완료!** 이제 집에서도 노트북과 동일한 환경에서 개발할 수 있습니다. 🎉
