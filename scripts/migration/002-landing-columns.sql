-- 002: Landing page schema update for 분양 landing pages
-- Add columns for YouTube embed, KakaoTalk chat, bottom bar, business info

ALTER TABLE landing.pages
  ADD COLUMN IF NOT EXISTS youtube_id TEXT,
  ADD COLUMN IF NOT EXISTS kakao_chat_url TEXT,
  ADD COLUMN IF NOT EXISTS show_bottom_bar BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS business_info JSONB DEFAULT NULL;

-- Add comment for documentation
COMMENT ON COLUMN landing.pages.youtube_id IS 'YouTube video ID for embed';
COMMENT ON COLUMN landing.pages.kakao_chat_url IS 'KakaoTalk open chat URL';
COMMENT ON COLUMN landing.pages.show_bottom_bar IS 'Show fixed bottom navigation bar';
COMMENT ON COLUMN landing.pages.business_info IS 'Business info JSON: {company_name, registration_number, ceo, address, disclaimer}';
