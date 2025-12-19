/**
 * 이미지 데이터 확인 스크립트
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config();

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function check() {
  console.log('📷 이미지가 있는 경매 물건 조회...\n');

  const { data, error } = await supabase
    .from('auctions')
    .select('id, case_number, address, images, property_type')
    .not('images', 'eq', '[]')
    .order('created_at', { ascending: false });

  if (error) {
    console.log('❌ 에러:', error.message);
    return;
  }

  console.log(`총 ${data.length}개 물건에 이미지 있음:\n`);

  data.forEach((item, i) => {
    console.log(`${i+1}. ${item.case_number} (${item.property_type})`);
    console.log(`   주소: ${item.address?.substring(0, 50)}...`);

    if (item.images && Array.isArray(item.images)) {
      console.log(`   이미지: ${item.images.length}개`);
      item.images.forEach((img, j) => {
        console.log(`     ${j+1}. ${img.url?.substring(0, 80)}...`);
        console.log(`        alt: ${img.alt}, type: ${img.type}`);
      });
    }
    console.log('');
  });
}

check().catch(console.error);
