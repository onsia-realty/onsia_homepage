# ONSIA 트러블슈팅 기록

## 2024-12 BigInt/DateTime superjson 형식 문제

### 증상
- 관리자 페이지(`/admin/properties`)에서 분양가가 "가격문의"로 표시
- 입주예정일이 "NaN.NaN"으로 표시
- DB에는 정상 데이터가 있음

### 원인
**Prisma가 BigInt와 DateTime을 superjson 형식으로 반환했는데, 프론트엔드가 처리 못함**

```
DB (PostgreSQL)
    ↓
basePrice: 840000000 (BigInt)
moveInDate: 2024-01-15 (DateTime)
    ↓
Prisma 조회
    ↓
API Response (문제 발생)
    ↓
{ "$type": "BigInt", "value": "840000000" }
{ "$type": "DateTime", "value": "2024-01-15T00:00:00.000Z" }
    ↓
프론트엔드 (처리 못함)
    ↓
parseInt("{ ... }") → NaN → "가격문의"
new Date("{ ... }") → Invalid → "NaN.NaN"
```

### 왜 superjson 형식이 발생하나?
JavaScript의 `JSON.stringify()`는 BigInt를 직접 처리 못함:
```javascript
// BigInt는 에러 발생
JSON.stringify({ price: 840000000n })  // → TypeError!

// 그래서 superjson 형식으로 감쌈
{ "$type": "BigInt", "value": "840000000" }
```

### 해결 방법

#### 1. API 쪽 수정 (`serializeBigInt` 함수)
파일: `/src/app/api/admin/properties/route.ts`, `/src/app/api/properties/route.ts`, `/src/app/api/properties/[id]/route.ts`

```typescript
function serializeBigInt(obj: unknown): unknown {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj === 'bigint') return obj.toString();
  if (obj instanceof Date) return obj.toISOString();
  if (Array.isArray(obj)) return obj.map(serializeBigInt);
  if (typeof obj === 'object') {
    const o = obj as Record<string, unknown>;
    // superjson 형식 처리: {"$type":"BigInt","value":"xxx"} -> "xxx"
    if ('$type' in o && 'value' in o) {
      if (o.$type === 'BigInt') return o.value;
      if (o.$type === 'DateTime') return o.value;
    }
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(o)) {
      result[key] = serializeBigInt(value);
    }
    return result;
  }
  return obj;
}
```

#### 2. 프론트엔드 수정 (값 추출 함수)
파일: `/src/app/admin/properties/page.tsx`

```typescript
// superjson 형식에서 값 추출
const extractValue = (val: unknown): string => {
  if (val === null || val === undefined) return '';
  if (typeof val === 'string') return val;
  if (typeof val === 'number') return val.toString();
  if (typeof val === 'object' && val !== null && '$type' in val && 'value' in val) {
    return (val as { value: string }).value;
  }
  return '';
};

// 가격 포맷팅 (extractValue 사용)
const formatPrice = (price: unknown) => {
  const priceStr = extractValue(price);
  if (!priceStr) return '가격문의';
  const numPrice = parseInt(priceStr);
  if (isNaN(numPrice)) return '가격문의';
  const eok = Math.floor(numPrice / 100000000);
  const man = Math.floor((numPrice % 100000000) / 10000);
  if (eok === 0 && man === 0) return '가격문의';
  if (man === 0) return `${eok}억`;
  return `${eok}억 ${man}만`;
};

// 날짜 포맷팅 (extractValue 사용)
const formatDate = (date: unknown) => {
  if (!date) return '-';
  const dateStr = extractValue(date);
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '-';
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}`;
};

// priceDisplay 우선, 없으면 basePrice로 표시
const getDisplayPrice = (property: Property) => {
  if (property.priceDisplay) {
    return property.priceDisplay;
  }
  return formatPrice(property.basePrice);
};
```

### 핵심 교훈
1. **DB 데이터가 정상이어도 API 응답 형식이 다를 수 있음**
2. **BigInt, DateTime은 JSON 직렬화 시 특별 처리 필요**
3. **API와 프론트엔드 양쪽에서 형식 처리 로직 추가해야 안전**
4. **curl로 실제 API 응답 확인하면 문제 파악 빠름**

### 디버깅 팁
```bash
# API 응답 직접 확인
curl -s "http://localhost:3000/api/admin/properties" | jq '.[0]'

# superjson 형식 확인
# basePrice가 문자열 "840000000"이면 정상
# {"$type":"BigInt","value":"840000000"} 형태면 처리 필요
```

---

## 관리자 로그인 정보
- ID: `realtors7`
- Password: `#duseorua12`

---

*최종 수정: 2024-12*
