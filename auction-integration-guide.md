# 🏠 경매 데이터 연동 개발 가이드

> 작성일: 2024-12-16  
> 목적: 기존 홈페이지에 법원경매 데이터 연동 기능 추가

---

## 📋 목차

1. [개요](#1-개요)
2. [데이터 소스 분석](#2-데이터-소스-분석)
3. [무료로 구현 가능한 기능](#3-무료로-구현-가능한-기능)
4. [유료 API 옵션](#4-유료-api-옵션)
5. [대법원 크롤링 가이드](#5-대법원-크롤링-가이드)
6. [권리분석 로직](#6-권리분석-로직)
7. [외부 API 연동](#7-외부-api-연동)
8. [DB 스키마 설계](#8-db-스키마-설계)
9. [개발 우선순위](#9-개발-우선순위)

---

## 1. 개요

### 1.1 목표
- 법원경매 물건 정보를 자체 플랫폼에 통합
- 두인경매 수준의 상세 정보 제공
- 최소 비용으로 MVP 구현

### 1.2 핵심 발견사항
```
✅ 권리분석(말소기준일, 대항력, 소멸여부)은 대법원 매각물건명세서에 이미 포함
✅ 두인경매 = 대법원 직접 크롤링 + 자체 DB + UI 정제
✅ 외부 B2B API(누리옥션, 옥션원) 구매 없이 구현 가능
```

### 1.3 데이터 흐름
```
대법원 courtauction.go.kr
        ↓ (크롤링)
    자체 DB 저장
        ↓
    권리분석 정제
        ↓
  + 국토부 실거래가 API
  + 건축물대장 API  
  + 네이버부동산 크롤링
        ↓
    최종 서비스
```

---

## 2. 데이터 소스 분석

### 2.1 두인경매 소스 분석 결과

#### 핵심 변수
```javascript
var PK = {
  'tid': '2418842',                    // 내부 물건 ID
  'pnu': '2711013900101000000',        // 19자리 필지고유번호 (핵심!)
  'recapPk': '27110-100171590',        // 총괄표제부 PK
  'titlePk': '27110-100171593',        // 표제부 PK (건축물대장)
};
```

#### 이미지 URL 패턴
```
/FILE/CA/{타입}/{법원코드}/{연도}/{파일명}

타입:
- BA = 물건사진
- BC = 현황조사서 이미지
- BD = 감정평가서 이미지

예시:
/FILE/CA/BA/2110/2025/T_BA-2110-2025008255-001.jpg
         │   │    │         │
         │   │    │         └─ 사건번호(008255) + 순번
         │   │    └─ 연도
         │   └─ 법원코드 (2110=대구지방법원)
         └─ 타입 (BA=사진)

T_ 접두어 = 썸네일, 없으면 원본
```

#### fileView 함수 (대법원 문서 연동)
```javascript
fileView(tid, type, docId)

// 타입별 문서
'B'   = 사진
'AA'  = 사건내역
'AB'  = 기일내역
'AC'  = 문건/송달
'AD'  = 현황조사서
'AE'  = 부동산표시
'AF'  = 감정평가서
'AG'  = 매각물건명세서 ⭐ (권리분석 핵심)
'DB'  = 건물등기
'EA'  = 세대열람
'EJ'  = 외국인체류
```

### 2.2 대법원에서 제공하는 권리분석 정보

**매각물건명세서에 포함된 정보:**
| 항목 | 설명 | 비고 |
|------|------|------|
| 말소기준일 | 최선순위 설정일자 | 권리분석 기준점 |
| 매각으로 소멸되지 않는 권리 | 인수되는 권리 목록 | 낙찰자 부담 |
| 임차인 현황 | 점유자, 전입일, 확정일자, 보증금 | 대항력 판단 근거 |
| 배당요구 여부 | 배당신청 현황 | 배당순위 계산 |

**HTML 예시 (두인경매에서 추출):**
```html
<!-- 말소기준일 -->
<span class='spanBox'>말소기준일(소액) : 2018-03-20</span>

<!-- 등기내역 - 말소기준등기 표시 -->
<tr class='bg_red'>
  <td>2018.03.20 을(4)</td>
  <td class='bg_red'>근저당권설정</td>
  <td>교보생명보험(주)</td>
  <td>330,200,000</td>
  <td>말소기준등기</td>
  <td class='center'>소멸</td>
</tr>

<!-- 임차인 대항력 -->
<td width='6%' class='center'>없음</td>  <!-- 대항력 -->
<td><span class='clr_blue'>배당금 없음</span></td>
```

---

## 3. 무료로 구현 가능한 기능

### 3.1 대법원 크롤링 (100% 무료)
```
✅ 물건 기본정보 (소재지, 감정가, 최저가, 매각일정)
✅ 입찰 진행내역 (회차별 유찰/낙찰 기록)
✅ 물건사진, 현황조사서, 감정평가서
✅ 매각물건명세서 (권리분석 포함)
✅ 등기내역 (말소기준등기, 소멸여부)
✅ 임차인 현황 (대항력, 배당요구)
```

### 3.2 국토부 실거래가 API (무료)
```
API: 국토교통부 실거래가 공개시스템
URL: https://rt.molit.go.kr/
인증: 공공데이터포털 API 키 (무료)
제공: 아파트/단독/연립 매매/전세 실거래가
```

### 3.3 건축물대장 API (무료)
```
API: 국토교통부 건축물대장정보 서비스
URL: https://www.data.go.kr/dataset/3044980
제공: 총괄표제부, 표제부, 층별개요, 전유부
```

### 3.4 네이버부동산 단지정보 (크롤링)
```
URL: https://new.land.naver.com/complexes/{단지ID}
제공: 세대수, 주차대수, 난방방식, 용적률, 편의시설, 학군
```

### 3.5 PNU 기반 외부 링크 연동
```javascript
// PNU = 19자리 필지고유번호
const pnu = '2711013900101000000';

// 토지이용계획
`https://www.eum.go.kr/web/ar/lu/luLandDet.jsp?pnu=${pnu}`

// 도시계획
`https://www.eum.go.kr/web/cp/cv/cvUpisDet.jsp?pnu=${pnu}`

// 씨리얼
`https://seereal.lh.or.kr/...?pnu=${pnu}`

// 밸류맵
`https://www.valueupmap.com/properties/auctions/${pnu}`
```

---

## 4. 유료 API 옵션

> 직접 크롤링이 어렵거나 빠른 구축이 필요한 경우

### 4.1 Hyphen 경매다
```
URL: https://hyphen.im
가격: 
  - TR슬림: 월 100,000원 (선불, 종량제)
  - TR시그니처: 월 300,000원+ (후불, 계약)
제공: 법원코드, 위치검색, 사건검색, 상세정보(권리분석 포함)
특징: 가장 접근성 좋음, 비즈머니 충전 방식
```

### 4.2 CODEF
```
URL: https://codef.io
가격: 건당 과금 (기본료 없음), 3개월 무료체험
제공: 경매 이벤트 정보
특징: 다양한 금융 API 함께 이용 가능
```

### 4.3 옥션원 (굿옥션)
```
연락처: 080-625-7700
가격: B2B 협의 (추정 월 300-500만원)
특징: 두인경매가 과거 사용, 데이터 품질 검증됨
```

### 4.4 누리옥션
```
가격: B2B 협의 (비공개)
특징: 마이옥션 등에 데이터 공급, 이미지 서버 별도
```

---

## 5. 대법원 크롤링 가이드

### 5.1 기술 스택
```
- Python + Playwright (권장) 또는 Selenium
- iframe 구조로 인해 일반 requests 불가
- 로그인 불필요 (공개 정보)
```

### 5.2 크롤링 대상 URL
```
# 메인
https://www.courtauction.go.kr/

# 물건 검색 (새 버전)
https://www.courtauction.go.kr/pgj/index.on?w2xPath=/pgj/ui/pgj100/PGJ159M00.xml

# 물건 상세 (레거시 - 주석처리됨)
https://www.courtauction.go.kr/RetrieveRealEstDetailInqSaList.laf
  ?jiwonNm={법원명(URL인코딩)}
  &saNo={사건번호}
  &maemulSer={물건순번}
```

### 5.3 법원코드 매핑
```python
COURT_CODES = {
    '2110': '대구지방법원',
    '1101': '서울중앙지방법원',
    '1102': '서울동부지방법원',
    '1103': '서울서부지방법원',
    '1104': '서울남부지방법원',
    '1105': '서울북부지방법원',
    # ... 전체 목록 필요
}
```

### 5.4 사건번호 형식
```
표시형식: 2025타경8255
DB저장:   20250130008255
          ││││││└────── 사건번호 (6자리, 0패딩)
          ││││└──────── 사건종류 (30=타경)
          ││└─┴──────── 접수년도 (01=2025)
          └└──────────── ? (추가 확인 필요)
```

### 5.5 크롤링 주의사항
```
⚠️ 과도한 요청 시 IP 차단 가능
⚠️ robots.txt 확인 필요
⚠️ 이미지/PDF는 저작권 이슈 검토
💡 일 1회 배치 크롤링 권장 (새벽 시간대)
💡 변경된 물건만 업데이트하는 증분 크롤링 구현
```

---

## 6. 권리분석 로직

### 6.1 말소기준권리 판단
```
말소기준권리가 될 수 있는 것:
1. 근저당권
2. 저당권
3. 가압류
4. 압류
5. 담보가등기
6. 전세권 (배당요구 시)
7. 경매개시결정등기

→ 위 권리 중 가장 먼저 설정된 것 = 말소기준권리
→ 말소기준일 = 말소기준권리의 설정일
```

### 6.2 임차인 대항력 판단
```python
def check_priority(tenant_move_in_date, reference_date):
    """
    대항력 유무 판단
    - 전입일이 말소기준일보다 빠르면: 대항력 있음
    - 전입일이 말소기준일과 같거나 늦으면: 대항력 없음
    """
    if tenant_move_in_date < reference_date:
        return "있음"
    else:
        return "없음"
```

### 6.3 소액임차인 최우선변제 (지역별)
```python
# 2023년 기준 (법 개정 시 업데이트 필요)
SMALL_TENANT_LIMITS = {
    '서울': {'보증금한도': 165000000, '최우선변제': 55000000},
    '과밀억제권역': {'보증금한도': 145000000, '최우선변제': 48000000},
    '광역시': {'보증금한도': 130000000, '최우선변제': 43000000},
    '기타': {'보증금한도': 110000000, '최우선변제': 37000000},
}
```

### 6.4 중요: 대법원 데이터 활용
```
💡 복잡한 권리분석 로직을 직접 구현하지 않아도 됨!
💡 매각물건명세서에 이미 계산된 결과가 있음:
   - "말소기준등기" 표시
   - "매각으로 소멸되지 않는 권리" 목록
   - 임차인별 대항력 유무

→ 크롤링해서 그대로 표시하면 됨
```

---

## 7. 외부 API 연동

### 7.1 국토부 실거래가 API
```python
import requests

# 공공데이터포털 API 키 필요
API_KEY = 'YOUR_API_KEY'

def get_real_price(sigungu_code, deal_ymd):
    """아파트 실거래가 조회"""
    url = 'http://openapi.molit.go.kr/OpenAPI_ToolInstall498/service/rest/RTMSOBJSvc/getRTMSDataSvcAptTradeDev'
    params = {
        'serviceKey': API_KEY,
        'LAWD_CD': sigungu_code,  # 시군구코드 5자리
        'DEAL_YMD': deal_ymd,     # 계약월 (YYYYMM)
    }
    response = requests.get(url, params=params)
    return response.json()
```

### 7.2 건축물대장 API
```python
def get_building_info(sigungu_code, bjdong_code, bun, ji):
    """건축물대장 기본개요 조회"""
    url = 'http://apis.data.go.kr/1613000/BldRgstService_v2/getBrBasisOulnInfo'
    params = {
        'serviceKey': API_KEY,
        'sigunguCd': sigungu_code,
        'bjdongCd': bjdong_code,
        'bun': bun,
        'ji': ji,
    }
    response = requests.get(url, params=params)
    return response.json()
```

### 7.3 네이버부동산 단지정보 (크롤링)
```python
import requests

def get_naver_complex(complex_id):
    """네이버부동산 단지 기본정보"""
    url = f'https://new.land.naver.com/api/complexes/{complex_id}'
    headers = {
        'User-Agent': 'Mozilla/5.0',
        'Referer': 'https://new.land.naver.com/'
    }
    response = requests.get(url, headers=headers)
    return response.json()
```

---

## 8. DB 스키마 설계

### 8.1 물건 테이블 (auction_items)
```sql
CREATE TABLE auction_items (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    
    -- 식별자
    case_number VARCHAR(20) NOT NULL,      -- '2025타경8255'
    case_number_full VARCHAR(20),          -- '20250130008255'
    court_code VARCHAR(10),                -- '2110'
    court_name VARCHAR(50),                -- '대구지방법원'
    pnu VARCHAR(19),                       -- 필지고유번호
    
    -- 기본정보
    address TEXT,                          -- 소재지
    item_type VARCHAR(20),                 -- 물건종류 (아파트/단독/토지...)
    land_area DECIMAL(15,2),               -- 대지면적 (㎡)
    building_area DECIMAL(15,2),           -- 건물면적 (㎡)
    
    -- 가격정보
    appraisal_price BIGINT,                -- 감정가
    minimum_price BIGINT,                  -- 최저가
    minimum_rate INT,                      -- 최저가율 (%)
    deposit BIGINT,                        -- 보증금 (10%)
    
    -- 일정
    sale_date DATE,                        -- 매각기일
    sale_time TIME,                        -- 매각시간
    bid_count INT DEFAULT 0,               -- 입찰횟수
    
    -- 권리분석
    reference_date DATE,                   -- 말소기준일
    bid_end_date DATE,                     -- 배당요구종기일
    
    -- 당사자
    owner VARCHAR(100),                    -- 소유자
    debtor VARCHAR(100),                   -- 채무자
    creditor VARCHAR(100),                 -- 채권자
    
    -- 상태
    status VARCHAR(20),                    -- 진행/유찰/낙찰/취하
    
    -- 메타
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_case_number (case_number),
    INDEX idx_court_code (court_code),
    INDEX idx_sale_date (sale_date),
    INDEX idx_pnu (pnu)
);
```

### 8.2 입찰내역 테이블 (auction_bids)
```sql
CREATE TABLE auction_bids (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    item_id BIGINT NOT NULL,
    
    round INT,                             -- 회차
    bid_date DATE,                         -- 입찰일
    minimum_price BIGINT,                  -- 최저가
    result VARCHAR(20),                    -- 유찰/낙찰/취하
    winning_price BIGINT,                  -- 낙찰가 (낙찰 시)
    bidder_count INT,                      -- 입찰자수
    
    FOREIGN KEY (item_id) REFERENCES auction_items(id)
);
```

### 8.3 등기내역 테이블 (auction_registers)
```sql
CREATE TABLE auction_registers (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    item_id BIGINT NOT NULL,
    
    register_type VARCHAR(10),             -- 갑/을
    register_no VARCHAR(20),               -- 순위번호
    receipt_date DATE,                     -- 접수일
    purpose VARCHAR(100),                  -- 등기목적
    right_holder VARCHAR(100),             -- 권리자
    claim_amount BIGINT,                   -- 채권금액
    is_reference BOOLEAN DEFAULT FALSE,    -- 말소기준등기 여부
    will_expire BOOLEAN DEFAULT TRUE,      -- 소멸여부
    note TEXT,                             -- 비고
    
    FOREIGN KEY (item_id) REFERENCES auction_items(id)
);
```

### 8.4 임차인 테이블 (auction_tenants)
```sql
CREATE TABLE auction_tenants (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    item_id BIGINT NOT NULL,
    
    tenant_name VARCHAR(100),              -- 임차인명
    has_priority BOOLEAN,                  -- 대항력 유무
    occupied_part VARCHAR(100),            -- 점유부분
    move_in_date DATE,                     -- 전입일
    fixed_date DATE,                       -- 확정일자
    has_bid_request BOOLEAN,               -- 배당요구 여부
    deposit BIGINT,                        -- 보증금
    monthly_rent BIGINT,                   -- 차임
    analysis TEXT,                         -- 분석결과
    note TEXT,                             -- 비고
    
    FOREIGN KEY (item_id) REFERENCES auction_items(id)
);
```

### 8.5 이미지 테이블 (auction_images)
```sql
CREATE TABLE auction_images (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    item_id BIGINT NOT NULL,
    
    image_type VARCHAR(10),                -- BA/BC/BD
    image_url VARCHAR(500),                -- 저장된 URL
    original_url VARCHAR(500),             -- 원본 URL
    sort_order INT,                        -- 정렬순서
    
    FOREIGN KEY (item_id) REFERENCES auction_items(id)
);
```

---

## 9. 개발 우선순위

### Phase 1: MVP (2-3주)
```
□ 대법원 크롤러 개발 (Playwright)
  - 물건 목록 수집
  - 상세정보 파싱
  - 이미지 다운로드
  
□ DB 구축 및 데이터 저장

□ 기본 상세페이지 UI
  - 물건정보
  - 입찰일정
  - 등기내역
  - 임차인현황
```

### Phase 2: 기능 확장 (2주)
```
□ 국토부 실거래가 API 연동
□ 건축물대장 API 연동
□ 네이버부동산 단지정보 연동
□ 검색/필터 기능
```

### Phase 3: 고도화 (2주)
```
□ 관심물건 기능
□ 알림 기능 (카카오톡/이메일)
□ 입찰표 작성 도구
□ 예상배당표 계산기
□ 인근 매각사례 분석
```

---

## 📎 참고 링크

- 대법원 경매정보: https://www.courtauction.go.kr/
- 국토부 실거래가: https://rt.molit.go.kr/
- 공공데이터포털: https://www.data.go.kr/
- 세움터 (건축물대장): https://cloud.eais.go.kr/
- 인터넷등기소: https://www.iros.go.kr/

---

## ⚠️ 법적 고려사항

1. **크롤링 관련**
   - robots.txt 준수
   - 과도한 요청 자제
   - 상업적 이용 시 법적 검토 필요

2. **저작권**
   - 감정평가서, 현황조사서 등 문서 재배포 시 주의
   - 이미지 무단 사용 주의

3. **개인정보**
   - 소유자, 채무자, 임차인 이름 노출 주의
   - 마스킹 처리 고려

---

*이 문서는 개발 가이드 목적으로 작성되었습니다.*
