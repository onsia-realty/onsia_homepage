-- 당사자 정보 컬럼 추가
-- Supabase SQL Editor에서 실행

-- 소유자, 채무자, 채권자 컬럼 추가
ALTER TABLE auctions ADD COLUMN IF NOT EXISTS owner VARCHAR(100);
ALTER TABLE auctions ADD COLUMN IF NOT EXISTS debtor VARCHAR(100);
ALTER TABLE auctions ADD COLUMN IF NOT EXISTS creditor VARCHAR(100);

-- 확인
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'auctions'
AND column_name IN ('owner', 'debtor', 'creditor');
