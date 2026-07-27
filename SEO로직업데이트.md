# SEO 로직 업데이트 (2026-07-26)

네이버 파워링크(클릭당 3,500원 + 부정클릭) 의존을 줄이고, 검색엔진이 자동으로 수집·노출하는 무료 유입 구조를 만들기 위한 작업 기록.

---

## 1. 전략: 랜딩 1장 → 콘텐츠 허브

랜딩페이지 하나로는 '야목역서희스타힐스' 브랜드 검색만 잡힌다. 브랜드명을 아직 모르는 사람(= 대다수)은 "화성 4억대 아파트", "삼성전자 출퇴근 아파트", "청약 가점 계산" 같은 걸 검색한다. 그 검색을 잡으려면 그 질문에 답하는 페이지가 각각 있어야 한다.

**역할 분리**

| | 야목역서희스타힐스.xyz | onsia.city/guide |
|---|---|---|
| 성격 | 상품·전환 페이지 | 검색 의도 해결형 정보 글 |
| 내용 | 공식 분양가·일정·도면·평면 원본 | 질문에 답하는 가이드 (수백 편 확장) |
| 목적 | 상담 신청 전환 | 자연검색 유입 → .xyz로 유도 |
| canonical | .xyz 루트 단일 | onsia.city self-canonical |

**왜 허브를 onsia.city에 뒀나**: 신규 punycode + .xyz 도메인은 검색엔진 권위 축적이 느리고, 분양이 끝나면 자산이 소멸한다. onsia.city에 쌓으면 루미엘 2차 등 다음 현장도 같은 허브를 공유한다.

**중복 콘텐츠 방지**: guide 글은 .xyz 본문을 통짜로 복사하지 않는다. 수치를 인용할 땐 항상 .xyz 해당 페이지로 링크해 출처를 표기한다.

**솔직한 기대치**: 구글은 이 구조로 롱테일 유입이 누적된다. 네이버는 통합검색에서 '웹사이트' 영역 비중이 작아 사이트 SEO만으로 파워링크를 대체하긴 어렵다. 서치어드바이저 수집요청 + RSS 제출로 최대화하되, 네이버 블로그 병행은 별도 채널로 검토할 것.

---

## 2. 구현 내역

### Phase 1 — 야목 랜딩(.xyz) 기술 SEO 수리

| 항목 | 변경 |
|---|---|
| h1 누락 | PC 뷰에 h1이 0개였음 → `PCLanding.tsx`에 `sr-only` h1 추가. 모바일은 subtitle 없어도 h1이 나오도록 수정(디자인 변화 없이) |
| hero LCP | hero `<img>`에 `fetchPriority="high"` `decoding="async"`, 서버에서 `react-dom`의 `preload()`로 `<head>` preload 주입 |
| 카테고리 16페이지 | JSON-LD 전무였음 → 서버 컴포넌트에서 BreadcrumbList 주입, `/faq`엔 FAQPage 추가. `CategoryPage.tsx`(client, 1000줄)는 무수정 |
| feed.xml | 하드코딩 스텁 2건 → `/rss.xml`로 308 redirect |
| rss.xml | 청약 링크가 `/subscriptions/`로 sitemap(`/subscription/`)과 불일치 → 통일. Prisma 호출을 try/catch로 격리(DB 장애 시 피드 전체 500 방지) |

**하지 않은 것과 이유**
- **next/image 전환 안 함**: Supabase 이미지 호스트가 remotePatterns에 미등록이고, 17개 랜딩 렌더 파이프라인 전체가 회귀 리스크에 들어간다. 속성 보강으로 LCP 이득의 대부분을 얻는다.
- **PC/모바일 DOM 2벌 유지**: 같은 콘텐츠가 CSS로 감춰진 채 2벌 출력된다. 구글은 mobile-first 인덱싱이라 h1·구조화데이터 수리로 SEO 요건은 충족되고, LCP 병목은 HTML이 아니라 hero 이미지다. 전환 페이지를 재작업할 만한 이득이 없다. 트래픽 안정화 후 별도 과제로.

### Phase 2 — MDX 콘텐츠 허브 신설

```
content/guide/
  _template.mdx              # frontmatter 견본 + 작성 규칙
  yamok/ area/ compare/ transport/ cheongyak/

src/lib/guide.ts             # 파싱·검증·related 로직
src/components/guide/
  mdx-components.tsx         # a / img / FactBox / LandingCTA
  GuideList.tsx              # 목록 3개 라우트 공유 조각
src/app/guide/
  page.tsx                   # 목록 (20편/페이지)
  page/[n]/page.tsx          # 페이지네이션
  topic/[cluster]/page.tsx   # 클러스터별 목록
  [slug]/page.tsx            # 글 상세
  [slug]/GuideJsonLd.tsx     # Article + BreadcrumbList + FAQPage
```

**기술 선택**
- `fs + gray-matter + next-mdx-remote/rsc` — Turbopack과 충돌 없음(RSC 렌더 시점 컴파일), 의존성 2개. contentlayer는 비유지보수라 제외.
- URL은 `/guide/[한글슬러그]` flat. 클러스터는 폴더·frontmatter로만 관리해서 나중에 재분류해도 URL이 안 바뀐다(리다이렉트 부채 없음).
- 전체 SSG + `dynamicParams=false`. 파일이 소스라 변경 = 배포.

**품질 게이트**: frontmatter 필수 필드 누락, cluster 폴더 불일치, coverImage 있는데 coverAlt 없음, slug 중복, 날짜 형식 오류 → **빌드 실패**(파일 경로 포함 에러). 500편 규모에서 조용히 깨지는 걸 막는 장치.

**AI 검색 대응**: 각 글에 `FactBox`(dl/dt/dd 시맨틱 수치 요약), 가시 FAQ 섹션(JSON-LD와 본문 일치), `sources` 출처 링크. AI Overview·Perplexity가 인용하기 쉬운 형태.

### Phase 3 — 인프라 배선

- `sitemap.ts`: onsia.city 모드에 `/guide` + topic 5개 + 글 전체 자동 등록. **.xyz 미니 sitemap 분기는 무수정**(오염 0 확인).
- `rss.xml`: 가이드 최신 50편을 `[가이드]` 카테고리로 피드 최상단에 추가.
- `next.config.ts`: `outputFileTracingIncludes`로 `content/guide/**`를 sitemap/rss 라우트 번들에 포함.
- `Navigation.tsx`: "분양가이드" 메뉴 추가(PC·모바일 공통). 랜딩(.xyz)은 자체 네비를 쓰므로 영향 없음.

---

## 3. 조용히 깨지는 함정 3가지

작업 중 실제로 밟았거나 밟을 뻔한 것들. 나중에 코드 고칠 때 주의.

1. **`generateStaticParams`는 slug를 encode하지 말 것.** encode해서 반환하면 요청 시 Next가 디코드한 param과 매칭이 안 돼서 **전 글이 404**가 된다. 빌드는 성공하므로 배포 후에야 발견된다.
2. **`MDXRemote`에 `options={{ blockJS: false }}` 필수.** next-mdx-remote v6가 기본으로 JSX 표현식 props(`items={[...]}`)를 보안 목적으로 제거한다. `FactBox`에 items가 `undefined`로 들어가 빌드가 죽는다.
3. **`outputFileTracingIncludes` 빠지면 프로덕션에서 글이 사라진다.** 로컬은 파일시스템이 있어서 멀쩡하고, Vercel에서만 sitemap/RSS의 가이드 항목이 통째로 비어버린다.

---

## 4. 글 쓰는 법

1. `content/guide/{클러스터}/{ascii-파일명}.mdx` 생성 (파일명은 ASCII, URL이 되는 `slug`는 한글)
2. `content/guide/_template.mdx`의 frontmatter 복사해서 채우기
3. 작성 규칙 (템플릿에도 명시):
   - 동일 클러스터 글 내부링크 2개 이상
   - .xyz 딥링크 1개 (분양가 글 → `/supply`, 입지 글 → `/location`)
   - 확정 수치는 `FactBox`로 묶기
   - 메인 키워드는 title 1회 + h2 중 1곳 + 본문 2~3회. **그 이상은 키워드 스터핑**
4. `git push` → Vercel 배포 → 발행 완료

**확정 사실 (지어내지 말 것)**: 야목역 서희스타힐스 = 경기도 화성시 비봉면 구포리 614-18, 586세대, 수인분당선 야목역 인근. 분양가는 입주자모집공고 전까지 미확정이므로 금액을 쓰지 말고 공식 홈페이지로 링크.

---

## 5. 남은 작업

### 콘텐츠 (30편 목표)
- yamok 12: 분양가 / 모델하우스 / 청약 자격·일정 / 전매제한 / 중도금 / 59A vs 84B / 계약 절차 / 옵션 / 입주 / 무순위 / 관심고객 혜택 / 단점까지 따진 솔직 분석
- transport 5: GTX-F / 수인분당선 출퇴근 실측 / 삼성전자 출퇴근 / 수원역 환승 / 비봉IC 자차
- area 6: 화성 4억대 / 병점 vs 비봉 / 생활권 인프라 / 학군 / 개발호재 / 분양 캘린더
- compare 4: 동탄 구축 vs 야목 신축 / 매교역 / 봉담 민간임대 / 오산·평택
- cheongyak 3: 가점 계산 / 특공 조건 / 비규제지역 장점

현재 3편 발행 (분양가 / GTX-F / 가점 계산).

**발행 케이던스**: 1~2주차에 30편 집중(토픽 클러스터는 임계질량이 있어야 작동) → 이후 주 3~5편. 새 글 발행 시 기존 글 1~2편에 링크를 역으로 추가한다.

### 검색엔진 등록 (배포 후 사람이 해야 하는 일)
1. **네이버 서치어드바이저**
   - onsia.city: sitemap.xml 재제출, rss.xml 제출, 신규 글은 "웹 페이지 수집" 개별 요청(일 50건 한도)
   - .xyz: sitemap 재제출 + 루트·/faq·/supply 수집 요청
2. **Google Search Console**
   - 양 도메인 sitemap 재제출
   - 색인 요청 순서: .xyz 루트 → /guide → 야목 클러스터 글 → 나머지
3. **4주 후**: GSC Performance에서 노출은 있는데 CTR이 낮은 글의 title/description 리라이트

> 배포는 git push만으로 production에 반영되지 않는다. Vercel 대시보드에서 promote 필요.
