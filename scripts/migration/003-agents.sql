-- ============================================
-- 003-agents.sql
-- Agent(직원) 시스템 테이블 + inquiries 확장
-- ============================================

-- 1. landing.agents 테이블 생성
CREATE TABLE IF NOT EXISTS landing.agents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page_id UUID NOT NULL REFERENCES landing.pages(id) ON DELETE CASCADE,
  code TEXT NOT NULL,            -- URL 파라미터용 코드 (예: kim, park)
  name TEXT NOT NULL,            -- 표시 이름 (예: 김팀장)
  phone TEXT NOT NULL,           -- 직통 전화번호
  kakao_url TEXT,                -- 개인 카카오톡 상담 URL
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(page_id, code)
);

-- 2. inquiries에 agent_code 컬럼 추가
ALTER TABLE landing.inquiries
  ADD COLUMN IF NOT EXISTS agent_code TEXT;

-- 3. 인덱스
CREATE INDEX IF NOT EXISTS idx_agents_page_code
  ON landing.agents(page_id, code);

CREATE INDEX IF NOT EXISTS idx_inquiries_agent_code
  ON landing.inquiries(agent_code);

-- 4. RLS 정책
ALTER TABLE landing.agents ENABLE ROW LEVEL SECURITY;

-- 공개 읽기 (활성 agent만)
CREATE POLICY "agents_public_read" ON landing.agents
  FOR SELECT USING (is_active = true);

-- 서비스 키로 전체 CRUD
CREATE POLICY "agents_service_all" ON landing.agents
  FOR ALL USING (
    current_setting('role', true) = 'service_role'
  );

-- ============================================
-- 테스트 데이터 (어반홈스)
-- 실행 전 urbanhomes page_id 확인 필요
-- ============================================
-- INSERT INTO landing.agents (page_id, code, name, phone, kakao_url)
-- SELECT id, 'test1', '테스트팀장', '010-1234-5678', 'https://open.kakao.com/test1'
-- FROM landing.pages WHERE slug = 'urbanhomes';
--
-- INSERT INTO landing.agents (page_id, code, name, phone, kakao_url)
-- SELECT id, 'test2', '테스트과장', '010-9876-5432', NULL
-- FROM landing.pages WHERE slug = 'urbanhomes';
