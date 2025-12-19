/**
 * 당사자 정보 업데이트 스크립트
 * Supabase에 owner, debtor, creditor 컬럼이 없으면
 * 먼저 SQL Editor에서 add-party-columns.sql 실행 필요
 *
 * 실행: node scripts/update-party-info.mjs
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { config } from 'dotenv';

config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Prisma 데이터에서 당사자 정보 추출
const prismaData = JSON.parse(readFileSync('./prisma-auction-export.json', 'utf-8'));

console.log('═'.repeat(50));
console.log(' 당사자 정보 업데이트');
console.log('═'.repeat(50));

async function updatePartyInfo() {
  for (const item of prismaData) {
    console.log(`\n📍 ${item.caseNumber}`);
    console.log(`   소유자: ${item.owner || '-'}`);
    console.log(`   채무자: ${item.debtor || '-'}`);
    console.log(`   채권자: ${item.creditor || '-'}`);

    // case_number로 조회
    const { data: auction, error: findError } = await supabase
      .from('auctions')
      .select('id')
      .eq('case_number', item.caseNumber)
      .single();

    if (findError || !auction) {
      console.log(`   ❌ 물건 찾기 실패: ${findError?.message || '없음'}`);
      continue;
    }

    // 업데이트 시도
    const { error: updateError } = await supabase
      .from('auctions')
      .update({
        owner: item.owner || null,
        debtor: item.debtor || null,
        creditor: item.creditor || null,
      })
      .eq('id', auction.id);

    if (updateError) {
      if (updateError.message.includes('column')) {
        console.log(`   ⚠️ 컬럼이 없습니다. SQL 실행 필요:`);
        console.log(`      ALTER TABLE auctions ADD COLUMN owner VARCHAR(100);`);
        console.log(`      ALTER TABLE auctions ADD COLUMN debtor VARCHAR(100);`);
        console.log(`      ALTER TABLE auctions ADD COLUMN creditor VARCHAR(100);`);
        break;
      }
      console.log(`   ❌ 업데이트 실패: ${updateError.message}`);
    } else {
      console.log(`   ✅ 업데이트 완료`);
    }
  }

  console.log('\n✨ 완료!');
}

updatePartyInfo().catch(console.error);
