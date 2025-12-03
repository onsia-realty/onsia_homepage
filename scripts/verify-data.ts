import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Prisma 반환값에서 BigInt 값 추출
function getBigIntValue(val: unknown): number | null {
  if (val === null || val === undefined) return null;
  // 객체 형태로 반환되는 경우 (edge runtime)
  if (typeof val === 'object' && val !== null && 'value' in val) {
    return Number((val as { value: string }).value);
  }
  // BigInt 형태로 반환되는 경우
  if (typeof val === 'bigint') {
    return Number(val);
  }
  // 숫자인 경우
  if (typeof val === 'number') {
    return val;
  }
  return null;
}

// Prisma 반환값에서 Date 값 추출
function getDateValue(val: unknown): Date | null {
  if (val === null || val === undefined) return null;
  // 객체 형태로 반환되는 경우 (edge runtime)
  if (typeof val === 'object' && val !== null && 'value' in val) {
    return new Date((val as { value: string }).value);
  }
  // Date 형태로 반환되는 경우
  if (val instanceof Date) {
    return val;
  }
  // 문자열인 경우
  if (typeof val === 'string') {
    return new Date(val);
  }
  return null;
}

async function verifyData() {
  const properties = await prisma.property.findMany({
    where: {
      title: {
        notIn: ['용인 경남아너스빌', '신광교 클라우드시티', '이천 부발역 에피트']
      }
    },
    orderBy: { title: 'asc' }
  });

  console.log('=== 17개 현장 데이터 검증 ===\n');

  for (let i = 0; i < properties.length; i++) {
    const p = properties[i];

    // BigInt 값 추출 및 변환
    const basePriceNum = getBigIntValue(p.basePrice);
    const pricePerPyeongNum = getBigIntValue(p.pricePerPyeong);
    const moveInDateVal = getDateValue(p.moveInDate);

    const basePrice = basePriceNum ? (basePriceNum / 100000000).toFixed(1) + '억' : '❌ 없음';
    const pricePerPyeong = pricePerPyeongNum ? (pricePerPyeongNum / 10000).toFixed(0) + '만원' : '❌ 없음';

    let moveIn = '❌ 없음';
    if (moveInDateVal && !isNaN(moveInDateVal.getTime())) {
      moveIn = `${moveInDateVal.getFullYear()}년 ${moveInDateVal.getMonth() + 1}월`;
    }

    console.log(`[${i + 1}] ${p.title}`);
    console.log(`    세대수: ${p.totalUnits || '❌'} | 분양가: ${basePrice} | 평당가: ${pricePerPyeong}`);
    console.log(`    입주예정: ${moveIn} | 시공사: ${p.constructor || '❌'}`);
    console.log(`    핵심특징: ${p.keyFeature || '❌'}`);
    console.log('');
  }

  // 통계
  const withBasePrice = properties.filter(p => getBigIntValue(p.basePrice) !== null).length;
  const withPricePerPyeong = properties.filter(p => getBigIntValue(p.pricePerPyeong) !== null).length;
  const withMoveInDate = properties.filter(p => getDateValue(p.moveInDate) !== null).length;
  const withTotalUnits = properties.filter(p => p.totalUnits !== null).length;
  const withConstructor = properties.filter(p => p.constructor !== null && p.constructor !== '').length;
  const withKeyFeature = properties.filter(p => p.keyFeature !== null && p.keyFeature !== '').length;
  const withDescription = properties.filter(p => p.description && p.description.length > 50).length;

  console.log('=== 데이터 완성도 통계 ===');
  console.log(`세대수: ${withTotalUnits}/17`);
  console.log(`분양가: ${withBasePrice}/17`);
  console.log(`평당가: ${withPricePerPyeong}/17`);
  console.log(`입주예정일: ${withMoveInDate}/17`);
  console.log(`시공사: ${withConstructor}/17`);
  console.log(`핵심특징: ${withKeyFeature}/17`);
  console.log(`상세설명: ${withDescription}/17`);
}

verifyData().catch(console.error).finally(() => prisma.$disconnect());
