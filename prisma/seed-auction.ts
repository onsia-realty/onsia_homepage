import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('경매 샘플 데이터 삽입 시작...');

  // 기존 데이터 삭제 (선택)
  await prisma.auctionImage.deleteMany();
  await prisma.auctionTenant.deleteMany();
  await prisma.auctionRegister.deleteMany();
  await prisma.auctionBid.deleteMany();
  await prisma.auctionItem.deleteMany();

  // 샘플 경매 물건 생성
  const auction = await prisma.auctionItem.create({
    data: {
      caseNumber: '2025타경32633',
      caseNumberFull: '20250130032633',
      courtCode: '3110',
      courtName: '광주지방법원',
      pnu: '2914013100100010000',
      
      address: '광주광역시 서구 마륵동 1 상무자이아파트 제104동 제1층 제103호',
      addressDetail: '104동 1층 103호',
      city: '광주',
      district: '서구',
      
      itemType: 'APARTMENT',
      landArea: 138.7214,
      buildingArea: 210.8392,
      floor: '1층',
      totalFloors: '지하2층~지상25층',
      buildingStructure: '철근콘크리트조',
      buildingUsage: '아파트',
      landUseZone: '제2종일반주거지역',

      // 감정평가 정보
      appraisalOrg: '대한감정원',
      appraisalDate: new Date('2025-05-15'),
      preservationDate: new Date('2011-06-28'),
      approvalDate: new Date('2011-05-25'),
      landAppraisalPrice: BigInt(284000000),
      buildingAppraisalPrice: BigInt(800000000),

      appraisalPrice: BigInt(1084000000),
      minimumPrice: BigInt(758800000),
      minimumRate: 70,
      deposit: BigInt(75880000),

      saleDate: new Date('2025-12-30T10:00:00'),
      saleTime: '10:00',
      bidCount: 2,
      bidEndDate: new Date('2025-07-21'),
      
      referenceDate: new Date('2019-02-08'),
      hasRisk: false,
      riskNote: null,
      
      owner: '조*정',
      debtor: '조*정',
      creditor: '남광주 농협',

      // 현황/위치 정보
      surroundings: '광주광역시 서구 마륵동 상무지구 소재 "상무자이아파트" 단지 내 위치하며, 주변은 주상혼용지역으로서 고층 아파트, 근린생활시설, 학교, 공원 등이 형성된 지역으로서 주거환경 양호함.',
      transportation: '인근에 시내버스정류장이 소재하며 일반적인 대중교통상황은 보통임. 본건까지 차량접근 가능함.',
      nearbyFacilities: '상무지구 중심상권, 광주시청, 대형마트, 학교(초중고)',
      heatingType: '개별난방 (도시가스)',
      facilities: '["승강기", "주차장", "경비실", "CCTV", "놀이터"]',
      locationNote: '단지 인근으로 도로망 정비되어 있으며, 주차장시설 양호함.',

      status: 'SCHEDULED',
      featured: true,
      
      // 입찰 내역
      bids: {
        create: [
          {
            round: 1,
            bidDate: new Date('2025-11-18'),
            minimumPrice: BigInt(1084000000),
            result: 'FAILED',
            bidderCount: 0,
          },
          {
            round: 2,
            bidDate: new Date('2025-12-30'),
            minimumPrice: BigInt(758800000),
            result: 'FAILED', // 아직 진행 전
            bidderCount: null,
          },
        ],
      },
      
      // 등기 내역
      registers: {
        create: [
          {
            registerType: '갑',
            registerNo: '10',
            receiptDate: new Date('2019-02-08'),
            purpose: '소유권이전',
            rightHolder: '조*정',
            claimAmount: null,
            isReference: false,
            willExpire: false,
            note: '매매 / 거래가액: 950,000,000원',
          },
          {
            registerType: '을',
            registerNo: '9',
            receiptDate: new Date('2019-02-08'),
            purpose: '근저당권설정',
            rightHolder: '한국자산관리공사',
            claimAmount: BigInt(656323720),
            isReference: true, // 말소기준등기
            willExpire: true,
            note: '말소기준등기',
          },
          {
            registerType: '을',
            registerNo: '12',
            receiptDate: new Date('2022-07-18'),
            purpose: '근저당권설정',
            rightHolder: '남광주농협',
            claimAmount: BigInt(192000000),
            isReference: false,
            willExpire: true,
          },
          {
            registerType: '을',
            registerNo: '13',
            receiptDate: new Date('2023-03-02'),
            purpose: '근저당권설정',
            rightHolder: '(주)디지비캐피탈',
            claimAmount: BigInt(120000000),
            isReference: false,
            willExpire: true,
          },
          {
            registerType: '갑',
            registerNo: '15',
            receiptDate: new Date('2025-02-07'),
            purpose: '가압류',
            rightHolder: '서울보증보험(주)',
            claimAmount: BigInt(8345400),
            isReference: false,
            willExpire: true,
          },
          {
            registerType: '갑',
            registerNo: '16',
            receiptDate: new Date('2025-02-25'),
            purpose: '가압류',
            rightHolder: '신한은행',
            claimAmount: BigInt(25075258),
            isReference: false,
            willExpire: true,
          },
          {
            registerType: '을',
            registerNo: '14',
            receiptDate: new Date('2025-03-20'),
            purpose: '근저당권설정',
            rightHolder: '김*호',
            claimAmount: BigInt(50000000),
            isReference: false,
            willExpire: true,
          },
          {
            registerType: '갑',
            registerNo: '17',
            receiptDate: new Date('2025-04-23'),
            purpose: '임의경매',
            rightHolder: '남광주 농협',
            claimAmount: BigInt(161095959),
            isReference: false,
            willExpire: true,
            note: '2025타경32633',
          },
          {
            registerType: '갑',
            registerNo: '18',
            receiptDate: new Date('2025-06-18'),
            purpose: '가압류',
            rightHolder: '에스비아이저축은행',
            claimAmount: BigInt(23087046),
            isReference: false,
            willExpire: true,
          },
          {
            registerType: '갑',
            registerNo: '19',
            receiptDate: new Date('2025-07-09'),
            purpose: '압류',
            rightHolder: '서광주세무서장',
            claimAmount: null,
            isReference: false,
            willExpire: true,
          },
        ],
      },
      
      // 이미지
      images: {
        create: [
          {
            imageType: 'PHOTO',
            url: 'https://www.dooinauction.com/FILE/CA/BA/2510/2025/BA-2510-2025032633-001.jpg',
            alt: '물건 외관',
            order: 1,
          },
          {
            imageType: 'PHOTO',
            url: 'https://www.dooinauction.com/FILE/CA/BA/2510/2025/BA-2510-2025032633-002.jpg',
            alt: '물건 내부',
            order: 2,
          },
          {
            imageType: 'PHOTO',
            url: 'https://www.dooinauction.com/FILE/CA/BE/2510/2025/BE-2510-2025032633-006.jpg',
            alt: '대표 이미지',
            order: 0,
          },
        ],
      },
    },
  });

  console.log(`생성된 경매 물건: ${auction.caseNumber} (ID: ${auction.id})`);

  // 두 번째 샘플: 센텀시티 오피스텔
  const auction2 = await prisma.auctionItem.create({
    data: {
      caseNumber: '2025타경12345',
      caseNumberFull: '20250210012345',
      courtCode: '2110',
      courtName: '부산지방법원',
      pnu: '2635010100101230000',

      address: '부산광역시 해운대구 우동 1495 센텀스카이비즈 제102동 제46층 제4603호',
      addressDetail: '102동 46층 4603호',
      city: '부산',
      district: '해운대구',

      itemType: 'OFFICETEL',
      landArea: 35.26,
      buildingArea: 213.55,
      floor: '46층',
      totalFloors: '지하4층~지상51층',
      buildingStructure: '철근콘크리트조',
      buildingUsage: '오피스텔',
      landUseZone: '일반상업지역',

      // 감정평가 정보
      appraisalOrg: '대한감정원',
      appraisalDate: new Date('2025-03-25'),
      preservationDate: new Date('2011-06-28'),
      approvalDate: new Date('2011-05-25'),
      landAppraisalPrice: BigInt(834000000),
      buildingAppraisalPrice: BigInt(1946000000),

      appraisalPrice: BigInt(2780000000),
      minimumPrice: BigInt(1946000000),
      minimumRate: 70,
      deposit: BigInt(194600000),

      saleDate: new Date('2026-01-15T10:00:00'),
      saleTime: '10:00',
      bidCount: 1,
      bidEndDate: new Date('2025-08-15'),

      referenceDate: new Date('2020-05-10'),
      hasRisk: false,
      riskNote: null,

      owner: '김*수',
      debtor: '김*수',
      creditor: '국민은행',

      // 현황/위치 정보
      surroundings: '부산광역시 해운대구 우동 소재 지하철2호선 "센텀시티역" 남측 인근에 위치하며, 주변은 센텀시티내 성숙중인 주상혼용지대로서 고층 아파트, 오피스텔, 각종 근린생활시설, 백화점(신세계·롯데) 등으로 형성된 지역으로서 제반 주위환경은 양호함.',
      transportation: '본건까지 차량접근 가능하며, 인근에 시내버스정류장 및 지하철 "센텀시티역"이 소재하는 바 일반적인 대중교통상황은 보통임.',
      nearbyFacilities: '신세계백화점, 롯데백화점, 벡스코, 센텀시티역(2호선)',
      heatingType: '개별난방 (도시가스)',
      facilities: '["승강기", "시스템에어컨", "소방설비", "스프링클러", "주차장", "경비시스템"]',
      locationNote: '인접지 및 인접도로와 등고 평탄한 가장형의 토지로서 현황 업무시설(오피스텔) 및 근린생활시설 건부지로 이용중임. 단지 인근으로 가로망 정비되어 있으며, 주차장시설 양호함.',

      status: 'SCHEDULED',
      featured: true,

      // 입찰 내역
      bids: {
        create: [
          {
            round: 1,
            bidDate: new Date('2026-01-15'),
            minimumPrice: BigInt(1946000000),
            result: 'POSTPONED',
            bidderCount: null,
          },
        ],
      },

      // 등기 내역
      registers: {
        create: [
          {
            registerType: '갑',
            registerNo: '5',
            receiptDate: new Date('2011-06-28'),
            purpose: '소유권이전',
            rightHolder: '김*수',
            claimAmount: null,
            isReference: false,
            willExpire: false,
            note: '매매',
          },
          {
            registerType: '을',
            registerNo: '3',
            receiptDate: new Date('2020-05-10'),
            purpose: '근저당권설정',
            rightHolder: '국민은행',
            claimAmount: BigInt(2400000000),
            isReference: true,
            willExpire: true,
            note: '말소기준등기',
          },
          {
            registerType: '갑',
            registerNo: '8',
            receiptDate: new Date('2025-01-15'),
            purpose: '임의경매',
            rightHolder: '국민은행',
            claimAmount: BigInt(1850000000),
            isReference: false,
            willExpire: true,
            note: '2025타경12345',
          },
        ],
      },

      // 이미지
      images: {
        create: [
          {
            imageType: 'PHOTO',
            url: 'https://www.dooinauction.com/FILE/CA/BA/2110/2025/BA-2110-2025012345-001.jpg',
            alt: '건물 외관',
            order: 0,
          },
          {
            imageType: 'PHOTO',
            url: 'https://www.dooinauction.com/FILE/CA/BA/2110/2025/BA-2110-2025012345-002.jpg',
            alt: '로비',
            order: 1,
          },
          {
            imageType: 'SURVEY',
            url: 'https://www.dooinauction.com/FILE/CA/BE/2110/2025/BE-2110-2025012345-001.jpg',
            alt: '평면도',
            order: 2,
          },
        ],
      },
    },
  });

  console.log(`생성된 경매 물건: ${auction2.caseNumber} (ID: ${auction2.id})`);
  console.log('경매 샘플 데이터 삽입 완료!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
