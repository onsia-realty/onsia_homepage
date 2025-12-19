/**
 * 경매 상세 데이터 확인
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const auctionId = '265b2e58-43c2-42be-9646-a6c1c3c8288b';

async function check() {
  console.log('📊 경매 상세 데이터 확인\n');

  // 1. 경매 기본 정보
  const { data: auction, error } = await supabase
    .from('auctions')
    .select('*')
    .eq('id', auctionId)
    .single();

  if (error) {
    console.log('❌ 에러:', error.message);
    return;
  }

  console.log('=== 경매 기본 정보 ===');
  console.log('사건번호:', auction.case_number);
  console.log('주소:', auction.address);
  console.log('note:', auction.note?.substring(0, 200));
  console.log('');

  // 2. 권리분석
  const { data: analysis } = await supabase
    .from('auction_analysis')
    .select('*')
    .eq('auction_id', auctionId);

  console.log('=== 권리분석 (auction_analysis) ===');
  console.log('데이터:', analysis);
  console.log('');

  // 3. 등기내역
  const { data: rights } = await supabase
    .from('auction_rights')
    .select('*')
    .eq('auction_id', auctionId);

  console.log('=== 등기내역 (auction_rights) ===');
  console.log('건수:', rights?.length);
  if (rights?.length > 0) {
    console.log('말소기준등기:', rights.filter(r => r.is_reference));
  }
}

check().catch(console.error);
