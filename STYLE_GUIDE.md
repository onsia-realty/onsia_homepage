# ONSIA 홈페이지 UI/폰트 스타일 가이드

## 1. 반응형 브레이크포인트

| 브레이크포인트 | Tailwind | 화면 크기 | 용도 |
|---------------|----------|----------|------|
| Mobile | 기본 | ~767px | 모바일 |
| Tablet | `md:` | 768px~ | 태블릿 |
| Desktop | `lg:` | 1024px~ | 데스크톱 |
| Wide | `xl:` | 1280px~ | 와이드 |
| Ultra | `2xl:` | 1536px~ | 울트라와이드 |

---

## 2. 폰트 크기 시스템

### 제목 (Headings)

| 용도 | Mobile | Desktop | Tailwind 클래스 |
|------|--------|---------|----------------|
| Hero 메인 제목 | 32px | 48-60px | `text-3xl md:text-5xl lg:text-6xl` |
| 섹션 제목 (H2) | 24px | 36-48px | `text-2xl md:text-4xl lg:text-5xl` |
| 카드 제목 (H3) | 18px | 20-24px | `text-lg md:text-xl lg:text-2xl` |
| 소제목 (H4) | 16px | 18px | `text-base md:text-lg` |

### 본문 (Body)

| 용도 | 크기 | Tailwind 클래스 |
|------|------|----------------|
| 기본 본문 | 16px | `text-base` |
| 작은 본문 | 14px | `text-sm` |
| 캡션/라벨 | 12px | `text-xs` |
| 큰 본문 | 18px | `text-lg` |

### 자동 폰트 크기 (clamp 사용)

```css
/* 긴 텍스트가 한 줄에 맞게 자동 조절 */
style={{ fontSize: 'clamp(14px, 1.1vw, 18px)' }}

/* 제목용 자동 조절 */
style={{ fontSize: 'clamp(20px, 2.5vw, 36px)' }}
```

---

## 3. 컬러 시스템

### 기본 색상

| 용도 | 색상 | Tailwind |
|------|------|----------|
| 배경 (다크) | #0a0a0f | `bg-[#0a0a0f]` |
| 텍스트 (흰색) | #ffffff | `text-white` |
| 텍스트 (회색) | #9ca3af | `text-gray-400` |
| 텍스트 (연한회색) | #d1d5db | `text-gray-300` |

### 브랜드 색상

| 용도 | 색상 | Tailwind |
|------|------|----------|
| Primary (파랑) | #3b82f6 | `text-blue-500` |
| Primary Light | #60a5fa | `text-blue-400` |
| Secondary (시안) | #06b6d4 | `text-cyan-500` |
| Accent (퍼플) | #a855f7 | `text-purple-500` |

### 상태 색상

| 용도 | 색상 | Tailwind |
|------|------|----------|
| 성공 (녹색) | #22c55e | `text-green-500` |
| 경고 (노랑) | #eab308 | `text-yellow-500` |
| 에러 (빨강) | #ef4444 | `text-red-500` |
| 카카오 | #FEE500 | `bg-[#FEE500]` |

### 그라데이션

```jsx
// 메인 그라데이션 (제목용)
className="bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent"

// 버튼 그라데이션
className="bg-gradient-to-r from-blue-600 to-cyan-500"

// 카드 배경 그라데이션
className="bg-gradient-to-br from-blue-500/10 to-purple-500/10"
```

---

## 4. 레이아웃 규칙

### 컨테이너

```jsx
// 기본 컨테이너
className="container mx-auto px-6"

// 최대 너비 제한
className="max-w-7xl mx-auto px-6"
```

### 그리드 시스템

| 용도 | Mobile | Tablet | Desktop | Tailwind |
|------|--------|--------|---------|----------|
| 매물 카드 | 1열 | 2열 | 3-4열 | `grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4` |
| 정보 카드 | 2열 | 2열 | 4열 | `grid grid-cols-2 md:grid-cols-4` |
| 사이드바 | 1열 | 1열 | 2:1 | `grid lg:grid-cols-3` |

### 간격 (Spacing)

| 용도 | 크기 | Tailwind |
|------|------|----------|
| 섹션 간격 | 80px | `py-20` |
| 카드 내부 | 24px | `p-6` |
| 카드 간격 | 24-32px | `gap-6` or `gap-8` |
| 요소 간격 (작음) | 8-12px | `gap-2` or `gap-3` |
| 요소 간격 (중간) | 16px | `gap-4` |

---

## 5. 컴포넌트 스타일

### Glass Card (유리 효과 카드)

```jsx
className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl"
```

### 버튼 스타일

```jsx
// Primary 버튼
className="px-6 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-bold"

// Secondary 버튼
className="px-6 py-4 bg-white/10 text-white rounded-xl border border-white/20"

// 카카오 버튼
className="bg-[#FEE500] text-[#3C1E1E] hover:bg-[#FDD835]"
```

### 입력 필드

```jsx
className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
```

### 배지 (Badge)

```jsx
// 추천매물
className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-bold rounded-full"

// 태그
className="px-3 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full"
```

---

## 6. 텍스트 줄바꿈 방지

### 한 줄 고정 (말줄임)

```jsx
className="line-clamp-1"
// 또는
className="truncate"
```

### 여러 줄 제한

```jsx
className="line-clamp-2"  // 2줄
className="line-clamp-3"  // 3줄
```

### 자동 폰트 크기 조절 (PC 한 줄 맞춤)

```jsx
// 제목이 길어도 한 줄에 맞춤
<h3
  className="font-bold text-white line-clamp-1"
  style={{ fontSize: 'clamp(14px, 1.1vw, 18px)' }}
  title={property.title}  // 전체 텍스트 툴팁
>
  {property.title}
</h3>
```

---

## 7. 애니메이션

### Framer Motion 기본

```jsx
// 페이드 인 + 슬라이드 업
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.6 }}

// 스크롤 시 등장
whileInView={{ opacity: 1, y: 0 }}
viewport={{ once: true }}

// 호버 스케일
whileHover={{ scale: 1.02 }}
whileTap={{ scale: 0.98 }}
```

### Tailwind 애니메이션

```jsx
// 펄스
className="animate-pulse"

// 바운스
className="animate-bounce"

// 스핀
className="animate-spin"

// 핑 (알림 점)
className="animate-ping"
```

---

## 8. 반응형 텍스트 예시

### 섹션 제목

```jsx
<h2 className="text-2xl md:text-3xl lg:text-4xl font-bold">
  <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent">
    엄선된 분양권 선택 기회
  </span>
</h2>
```

### 카드 제목 (자동 크기)

```jsx
<h3
  className="font-bold text-white group-hover:text-blue-300 transition-colors line-clamp-1"
  style={{ fontSize: 'clamp(14px, 1.1vw, 18px)' }}
>
  {title}
</h3>
```

### 가격 표시

```jsx
<span className="text-xl md:text-2xl font-black text-cyan-400">
  {formatPrice(price)}
</span>
```

---

## 9. 네비게이션 메뉴

### PC (가로 한 줄)

```jsx
<div className="flex items-center gap-6">
  {menuItems.map(item => (
    <Link
      key={item.href}
      href={item.href}
      className="text-gray-300 hover:text-white transition-colors whitespace-nowrap"
    >
      {item.label}
    </Link>
  ))}
</div>
```

### 모바일 (햄버거 메뉴)

```jsx
// 768px 미만에서 햄버거 메뉴 표시
className="hidden md:flex"  // PC 메뉴
className="md:hidden"       // 모바일 메뉴 버튼
```

---

## 10. 이미지 처리

### Next.js Image 컴포넌트

```jsx
<Image
  src={imageUrl}
  alt={altText}
  fill
  className="object-cover"
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>
```

### 이미지 오버레이

```jsx
// 하단 그라데이션
<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

// 전체 어둡게
<div className="absolute inset-0 bg-black/40" />
```

---

## 11. 체크리스트

### 새 페이지/컴포넌트 개발 시

- [ ] 모바일 (< 768px) 테스트
- [ ] 태블릿 (768px ~ 1023px) 테스트
- [ ] 데스크톱 (1024px+) 테스트
- [ ] 긴 텍스트 줄바꿈/말줄임 처리
- [ ] 다크 테마 색상 확인
- [ ] 호버/포커스 상태 확인
- [ ] 로딩 상태 처리
- [ ] 에러 상태 처리

---

*최종 수정일: 2025-12-03*
