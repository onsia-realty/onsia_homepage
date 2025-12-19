import { NextResponse } from 'next/server';
import { getAllSubscriptions, getSubscriptionStatus, type CheongyakProperty } from '@/lib/cheongyakApi';

// Mock 데이터 (외부 API 실패 시 폴백)
const MOCK_SUBSCRIPTIONS: CheongyakProperty[] = [
  {
    HOUSE_MANAGE_NO: '2025000524',
    PBLANC_NO: '2025000524',
    HOUSE_NM: '용인 푸르지오 원클러스터파크',
    HOUSE_SECD: '01',
    HOUSE_SECD_NM: '민영주택',
    HOUSE_DTL_SECD: '01',
    HOUSE_DTL_SECD_NM: '아파트',
    HSSPLY_ADRES: '경기도 용인시 처인구 양지면 양지리',
    HSSPLY_ZIP: '17058',
    TOT_SUPLY_HSHLDCO: 710,
    RCRIT_PBLANC_DE: '2025-12-10',
    RCEPT_BGNDE: '2025-12-17',
    RCEPT_ENDDE: '2025-12-19',
    SPSPLY_RCEPT_BGNDE: '2025-12-16',
    SPSPLY_RCEPT_ENDDE: '2025-12-16',
    GNRL_RNK1_CRSPAREA_RCPTDE: '2025-12-17',
    GNRL_RNK1_CRSPAREA_ENDDE: '2025-12-17',
    GNRL_RNK2_CRSPAREA_RCPTDE: '2025-12-18',
    GNRL_RNK2_CRSPAREA_ENDDE: '2025-12-18',
    PRZWNER_PRESNATN_DE: '2025-12-26',
    CNTRCT_CNCLS_BGNDE: '2026-01-02',
    CNTRCT_CNCLS_ENDDE: '2026-01-10',
    MVN_PREARNGE_YM: '2028-12',
    SUBSCRPT_AREA_CODE: '410',
    SUBSCRPT_AREA_CODE_NM: '경기',
    HMPG_ADRES: '',
    CNSTRCT_ENTRPS_NM: '대우건설',
    BSNS_MBY_NM: '대우건설',
    MDHS_TELNO: '1588-1234',
    PBLANC_URL: '',
  },
  {
    HOUSE_MANAGE_NO: '2025000525',
    PBLANC_NO: '2025000525',
    HOUSE_NM: '역삼센트럴자이',
    HOUSE_SECD: '01',
    HOUSE_SECD_NM: '민영주택',
    HOUSE_DTL_SECD: '01',
    HOUSE_DTL_SECD_NM: '아파트',
    HSSPLY_ADRES: '서울특별시 강남구 역삼동',
    HSSPLY_ZIP: '06232',
    TOT_SUPLY_HSHLDCO: 87,
    RCRIT_PBLANC_DE: '2025-12-08',
    RCEPT_BGNDE: '2025-12-15',
    RCEPT_ENDDE: '2025-12-18',
    SPSPLY_RCEPT_BGNDE: '2025-12-14',
    SPSPLY_RCEPT_ENDDE: '2025-12-14',
    GNRL_RNK1_CRSPAREA_RCPTDE: '2025-12-15',
    GNRL_RNK1_CRSPAREA_ENDDE: '2025-12-15',
    GNRL_RNK2_CRSPAREA_RCPTDE: '2025-12-16',
    GNRL_RNK2_CRSPAREA_ENDDE: '2025-12-16',
    PRZWNER_PRESNATN_DE: '2025-12-24',
    CNTRCT_CNCLS_BGNDE: '2025-12-30',
    CNTRCT_CNCLS_ENDDE: '2026-01-05',
    MVN_PREARNGE_YM: '2027-06',
    SUBSCRPT_AREA_CODE: '110',
    SUBSCRPT_AREA_CODE_NM: '서울',
    HMPG_ADRES: '',
    CNSTRCT_ENTRPS_NM: 'GS건설',
    BSNS_MBY_NM: 'GS건설',
    MDHS_TELNO: '1588-5678',
    PBLANC_URL: '',
  },
  {
    HOUSE_MANAGE_NO: '2025000526',
    PBLANC_NO: '2025000526',
    HOUSE_NM: '한화포레나 부산대연',
    HOUSE_SECD: '01',
    HOUSE_SECD_NM: '민영주택',
    HOUSE_DTL_SECD: '01',
    HOUSE_DTL_SECD_NM: '아파트',
    HSSPLY_ADRES: '부산광역시 남구 대연동',
    HSSPLY_ZIP: '48503',
    TOT_SUPLY_HSHLDCO: 104,
    RCRIT_PBLANC_DE: '2025-12-15',
    RCEPT_BGNDE: '2025-12-22',
    RCEPT_ENDDE: '2025-12-24',
    SPSPLY_RCEPT_BGNDE: '2025-12-21',
    SPSPLY_RCEPT_ENDDE: '2025-12-21',
    GNRL_RNK1_CRSPAREA_RCPTDE: '2025-12-22',
    GNRL_RNK1_CRSPAREA_ENDDE: '2025-12-22',
    GNRL_RNK2_CRSPAREA_RCPTDE: '2025-12-23',
    GNRL_RNK2_CRSPAREA_ENDDE: '2025-12-23',
    PRZWNER_PRESNATN_DE: '2025-12-31',
    CNTRCT_CNCLS_BGNDE: '2026-01-06',
    CNTRCT_CNCLS_ENDDE: '2026-01-12',
    MVN_PREARNGE_YM: '2028-03',
    SUBSCRPT_AREA_CODE: '260',
    SUBSCRPT_AREA_CODE_NM: '부산',
    HMPG_ADRES: '',
    CNSTRCT_ENTRPS_NM: '한화건설',
    BSNS_MBY_NM: '한화건설',
    MDHS_TELNO: '1588-3456',
    PBLANC_URL: '',
  },
  {
    HOUSE_MANAGE_NO: '2025000527',
    PBLANC_NO: '2025000527',
    HOUSE_NM: '검단신도시 AB22블록 제일풍경채',
    HOUSE_SECD: '01',
    HOUSE_SECD_NM: '민영주택',
    HOUSE_DTL_SECD: '01',
    HOUSE_DTL_SECD_NM: '아파트',
    HSSPLY_ADRES: '인천광역시 서구 검단동',
    HSSPLY_ZIP: '22701',
    TOT_SUPLY_HSHLDCO: 584,
    RCRIT_PBLANC_DE: '2025-12-16',
    RCEPT_BGNDE: '2025-12-23',
    RCEPT_ENDDE: '2025-12-26',
    SPSPLY_RCEPT_BGNDE: '2025-12-22',
    SPSPLY_RCEPT_ENDDE: '2025-12-22',
    GNRL_RNK1_CRSPAREA_RCPTDE: '2025-12-23',
    GNRL_RNK1_CRSPAREA_ENDDE: '2025-12-23',
    GNRL_RNK2_CRSPAREA_RCPTDE: '2025-12-24',
    GNRL_RNK2_CRSPAREA_ENDDE: '2025-12-24',
    PRZWNER_PRESNATN_DE: '2026-01-02',
    CNTRCT_CNCLS_BGNDE: '2026-01-08',
    CNTRCT_CNCLS_ENDDE: '2026-01-14',
    MVN_PREARNGE_YM: '2028-09',
    SUBSCRPT_AREA_CODE: '280',
    SUBSCRPT_AREA_CODE_NM: '인천',
    HMPG_ADRES: '',
    CNSTRCT_ENTRPS_NM: '제일건설',
    BSNS_MBY_NM: '제일건설',
    MDHS_TELNO: '1588-7890',
    PBLANC_URL: '',
  },
  {
    HOUSE_MANAGE_NO: '2025000528',
    PBLANC_NO: '2025000528',
    HOUSE_NM: '광명 철산자이 더헤리티지',
    HOUSE_SECD: '01',
    HOUSE_SECD_NM: '민영주택',
    HOUSE_DTL_SECD: '01',
    HOUSE_DTL_SECD_NM: '아파트',
    HSSPLY_ADRES: '경기도 광명시 철산동',
    HSSPLY_ZIP: '14281',
    TOT_SUPLY_HSHLDCO: 1240,
    RCRIT_PBLANC_DE: '2025-12-03',
    RCEPT_BGNDE: '2025-12-10',
    RCEPT_ENDDE: '2025-12-12',
    SPSPLY_RCEPT_BGNDE: '2025-12-09',
    SPSPLY_RCEPT_ENDDE: '2025-12-09',
    GNRL_RNK1_CRSPAREA_RCPTDE: '2025-12-10',
    GNRL_RNK1_CRSPAREA_ENDDE: '2025-12-10',
    GNRL_RNK2_CRSPAREA_RCPTDE: '2025-12-11',
    GNRL_RNK2_CRSPAREA_ENDDE: '2025-12-11',
    PRZWNER_PRESNATN_DE: '2025-12-18',
    CNTRCT_CNCLS_BGNDE: '2025-12-24',
    CNTRCT_CNCLS_ENDDE: '2025-12-30',
    MVN_PREARNGE_YM: '2028-04',
    SUBSCRPT_AREA_CODE: '410',
    SUBSCRPT_AREA_CODE_NM: '경기',
    HMPG_ADRES: '',
    CNSTRCT_ENTRPS_NM: 'GS건설',
    BSNS_MBY_NM: 'GS건설',
    MDHS_TELNO: '1588-2345',
    PBLANC_URL: '',
  },
  {
    HOUSE_MANAGE_NO: '2025000529',
    PBLANC_NO: '2025000529',
    HOUSE_NM: '세종 6-3생활권 더샵',
    HOUSE_SECD: '01',
    HOUSE_SECD_NM: '민영주택',
    HOUSE_DTL_SECD: '01',
    HOUSE_DTL_SECD_NM: '아파트',
    HSSPLY_ADRES: '세종특별자치시 6-3생활권',
    HSSPLY_ZIP: '30066',
    TOT_SUPLY_HSHLDCO: 1456,
    RCRIT_PBLANC_DE: '2025-12-19',
    RCEPT_BGNDE: '2025-12-26',
    RCEPT_ENDDE: '2025-12-30',
    SPSPLY_RCEPT_BGNDE: '2025-12-25',
    SPSPLY_RCEPT_ENDDE: '2025-12-25',
    GNRL_RNK1_CRSPAREA_RCPTDE: '2025-12-26',
    GNRL_RNK1_CRSPAREA_ENDDE: '2025-12-26',
    GNRL_RNK2_CRSPAREA_RCPTDE: '2025-12-27',
    GNRL_RNK2_CRSPAREA_ENDDE: '2025-12-27',
    PRZWNER_PRESNATN_DE: '2026-01-06',
    CNTRCT_CNCLS_BGNDE: '2026-01-12',
    CNTRCT_CNCLS_ENDDE: '2026-01-18',
    MVN_PREARNGE_YM: '2028-12',
    SUBSCRPT_AREA_CODE: '360',
    SUBSCRPT_AREA_CODE_NM: '세종',
    HMPG_ADRES: '',
    CNSTRCT_ENTRPS_NM: '포스코이앤씨',
    BSNS_MBY_NM: '포스코이앤씨',
    MDHS_TELNO: '1588-6789',
    PBLANC_URL: '',
  },
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const perPage = parseInt(searchParams.get('perPage') || '12');
    const region = searchParams.get('region') || undefined;
    const type = (searchParams.get('type') as 'all' | 'apt' | 'officetel' | 'remndr') || 'all';
    const status = searchParams.get('status') || undefined; // upcoming, open, closed

    let result = await getAllSubscriptions({ page, perPage: 100, region, type });

    // 외부 API가 빈 배열을 반환하면 Mock 데이터 사용
    if (result.data.length === 0) {
      console.log('외부 API 데이터 없음, Mock 데이터 사용');
      result = { data: MOCK_SUBSCRIPTIONS, totalCount: MOCK_SUBSCRIPTIONS.length };
    }

    // 상태 정보 추가 및 필터링
    let processedData = result.data.map((item: CheongyakProperty) => ({
      ...item,
      ...getSubscriptionStatus(item),
    }));

    // 상태 필터링
    if (status) {
      processedData = processedData.filter(item => item.status === status);
    }

    // 정렬: open(접수중) → upcoming(예정) → closed(마감), 같은 상태 내에서는 D-Day 빠른 순
    const statusPriority: Record<string, number> = { open: 0, upcoming: 1, closed: 2 };
    processedData.sort((a, b) => {
      const priorityDiff = statusPriority[a.status] - statusPriority[b.status];
      if (priorityDiff !== 0) return priorityDiff;
      // 같은 상태면 D-Day 빠른 순
      const dDayA = a.dDay ?? 999;
      const dDayB = b.dDay ?? 999;
      return dDayA - dDayB;
    });

    // 페이지네이션 적용
    const startIndex = (page - 1) * perPage;
    const paginatedData = processedData.slice(startIndex, startIndex + perPage);

    // 통계 계산
    const stats = {
      total: processedData.length,
      upcoming: processedData.filter(item => item.status === 'upcoming').length,
      open: processedData.filter(item => item.status === 'open').length,
      closed: processedData.filter(item => item.status === 'closed').length,
    };

    return NextResponse.json({
      data: paginatedData,
      stats,
      pagination: {
        page,
        perPage,
        total: status ? processedData.length : result.totalCount,
        totalPages: Math.ceil((status ? processedData.length : result.totalCount) / perPage),
      },
    });
  } catch (error) {
    console.error('청약 정보 조회 실패:', error);
    return NextResponse.json(
      { error: '청약 정보를 불러오는데 실패했습니다.' },
      { status: 500 }
    );
  }
}
