-- 004: 관심고객 동의 증빙 (불법스팸 과징금 대응 — 기획안 §4-6)
-- 개인정보 수집·이용 / 제3자 제공 / 광고성 정보 수신(야간 별도) 동의 여부 + 동의 시점·문구 버전·접속 정보
-- 모두 ADD COLUMN IF NOT EXISTS (additive) — 운영 중 적용 안전

ALTER TABLE landing.inquiries
  ADD COLUMN IF NOT EXISTS consent_privacy BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS consent_third_party BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS consent_marketing BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS consent_marketing_night BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS consented_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS consent_version TEXT,
  ADD COLUMN IF NOT EXISTS ip TEXT,
  ADD COLUMN IF NOT EXISTS user_agent TEXT,
  ADD COLUMN IF NOT EXISTS page_url TEXT;

COMMENT ON COLUMN landing.inquiries.consent_privacy IS '[필수] 개인정보 수집·이용 동의';
COMMENT ON COLUMN landing.inquiries.consent_third_party IS '[필수] 개인정보 제3자 제공 동의 (해당 현장 분양사무소·대행사)';
COMMENT ON COLUMN landing.inquiries.consent_marketing IS '[선택] 광고성 정보 수신 동의 (문자·전화). false면 상담 회신 외 광고 발송 금지';
COMMENT ON COLUMN landing.inquiries.consent_marketing_night IS '[선택] 야간(21~08시) 광고 수신 동의';
COMMENT ON COLUMN landing.inquiries.consented_at IS '동의 시각 (수신동의 2년 재확인 기준)';
COMMENT ON COLUMN landing.inquiries.consent_version IS '동의 문구 버전 (예: 2026-10-17)';
COMMENT ON COLUMN landing.inquiries.ip IS '제출 시 클라이언트 IP (x-forwarded-for)';
COMMENT ON COLUMN landing.inquiries.user_agent IS '제출 시 User-Agent';
COMMENT ON COLUMN landing.inquiries.page_url IS '제출 페이지 URL (referer)';
