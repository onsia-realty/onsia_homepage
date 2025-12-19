import { NextRequest, NextResponse } from 'next/server';
import {
  getAPTHousingTypes,
  getAPTCompetition,
  getAPTSpecialSupply,
  getAPTWinningScore,
  HousingTypeInfo,
  CompetitionInfo,
} from '@/lib/cheongyakApi';
import { getCoordinatesFromKeyword, getDefaultCoordinatesForRegion } from '@/lib/geocoding';

// 주택형 정보 가공
function processHousingTypes(data: HousingTypeInfo[]) {
  return data.map(item => ({
    type: item.HOUSE_TY,
    modelNo: item.MODEL_NO,
    supplyArea: item.SUPLY_AR,
    totalHouseholds: item.SUPLY_HSHLDCO + (item.SPSPLY_HSHLDCO || 0),
    generalHouseholds: item.SUPLY_HSHLDCO,
    specialHouseholds: item.SPSPLY_HSHLDCO || 0,
    topPrice: item.LTTOT_TOP_AMOUNT ? Number(item.LTTOT_TOP_AMOUNT) : 0,
    // 평당가 계산 (분양가 / 평수)
    pricePerPyeong: item.LTTOT_TOP_AMOUNT && item.SUPLY_AR
      ? Math.round(Number(item.LTTOT_TOP_AMOUNT) / (Number(item.SUPLY_AR) / 3.3058))
      : 0,
  }));
}

// 경쟁률 정보 가공
function processCompetition(data: CompetitionInfo[]) {
  // 주택형별로 그룹화
  const grouped = data.reduce((acc, item) => {
    const key = item.HOUSE_TY;
    if (!acc[key]) {
      acc[key] = {
        type: item.HOUSE_TY,
        modelNo: item.MODEL_NO,
        supplyHouseholds: item.SUPLY_HSHLDCO,
        regions: [],
      };
    }
    acc[key].regions.push({
      region: item.RESIDE_SECD === '01' ? '해당지역' : '기타지역',
      regionCode: item.RESIDE_SECD,
      requestCount: Number(item.RCEPT_CNT) || 0,
      competitionRate: parseCompetitionRate(String(item.CMPET_RATE)),
      rank: item.SUBSCRPT_RANK_CODE,
    });
    return acc;
  }, {} as Record<string, {
    type: string;
    modelNo: string;
    supplyHouseholds: number;
    regions: {
      region: string;
      regionCode: string;
      requestCount: number;
      competitionRate: number | string;
      rank: number;
    }[];
  }>);

  return Object.values(grouped);
}

// 경쟁률 파싱 (미달 포함)
function parseCompetitionRate(rate: string): number | string {
  if (!rate) return 0;
  // (△3) 형태는 미달을 의미
  if (rate.includes('△')) {
    const match = rate.match(/△(\d+)/);
    return match ? `미달 ${match[1]}` : '미달';
  }
  return parseFloat(rate) || 0;
}

// 특별공급 정보 가공 (raw 데이터 그대로 반환)
function processSpecialSupply(data: unknown[]) {
  if (!data || data.length === 0) return [];

  // 타입별로 정리
  return data.map((item: Record<string, unknown>) => ({
    type: item.HOUSE_TY as string,
    totalSpecial: item.SPSPLY_HSHLDCO as number || 0,
    multichild: item.MNYCH_HSHLDCO as number || 0,        // 다자녀
    newlywed: item.NWWDS_NMTW_HSHLDCO as number || 0,     // 신혼부부
    firstLife: item.LFE_FRST_HSHLDCO as number || 0,      // 생애최초
    elderly: item.OLD_PARNTS_SUPORT_HSHLDCO as number || 0, // 노부모부양
    institution: item.INSTT_RECOMEND_HSHLDCO as number || 0, // 기관추천
    newborn: item.NWBB_NWBBSHR_HSHLDCO as number || 0,    // 신생아
    youth: item.YGMN_HSHLDCO as number || 0,              // 청년
    status: item.SUBSCRPT_RESULT_NM as string || '',
    // 지역별 접수현황
    applications: {
      localArea: {
        multichild: item.CRSPAREA_MNYCH_CNT as number || 0,
        newlywed: item.CRSPAREA_NWWDS_NMTW_CNT as number || 0,
        firstLife: item.CRSPAREA_LFE_FRST_CNT as number || 0,
        elderly: item.CRSPAREA_OPS_CNT as number || 0,
        newborn: item.CRSPAREA_NWBB_NWBBSHR_CNT as number || 0,
        youth: item.CRSPAREA_YGMN_CNT as number || 0,
      },
      metro: {
        multichild: item.CTPRVN_MNYCH_CNT as number || 0,
        newlywed: item.CTPRVN_NWWDS_NMTW_CNT as number || 0,
        firstLife: item.CTPRVN_LFE_FRST_CNT as number || 0,
        elderly: item.CTPRVN_OPS_CNT as number || 0,
        newborn: item.CTPRVN_NWBB_NWBBSHR_CNT as number || 0,
        youth: item.CTPRVN_YGMN_CNT as number || 0,
      },
      otherArea: {
        multichild: item.ETC_AREA_MNYCH_CNT as number || 0,
        newlywed: item.ETC_AREA_NWWDS_NMTW_CNT as number || 0,
        firstLife: item.ETC_AREA_LFE_FRST_CNT as number || 0,
        elderly: item.ETC_AREA_OPS_CNT as number || 0,
        newborn: item.ETC_AREA_NWBB_NWBBSHR_CNT as number || 0,
        youth: item.ETC_AREA_YGMN_CNT as number || 0,
      },
    },
  }));
}

// 당첨가점 정보 가공
function processWinningScore(data: unknown[]) {
  if (!data || data.length === 0) return [];

  return data.map((item: Record<string, unknown>) => ({
    type: item.HOUSE_TY as string,
    region: item.RESIDE_SECD_NM as string || '해당지역',
    minScore: item.LWET_PRZWIN_POINT as number || 0,
    maxScore: item.TOP_PRZWIN_POINT as number || 0,
    avgScore: item.AVG_PRZWIN_POINT as number || 0,
  }));
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // id를 houseManageNo와 pblancNo로 사용 (청약홈에서는 보통 동일)
  const houseManageNo = id;
  const pblancNo = id;

  try {
    // 병렬로 모든 API 호출
    const [housingTypesRes, competitionRes, specialSupplyRes, winningScoreRes] = await Promise.all([
      getAPTHousingTypes({ houseManageNo, pblancNo }).catch(e => {
        console.error('주택형별 API 오류:', e);
        return { data: [] };
      }),
      getAPTCompetition({ houseManageNo, pblancNo }).catch(e => {
        console.error('경쟁률 API 오류:', e);
        return { data: [] };
      }),
      getAPTSpecialSupply({ houseManageNo, pblancNo }).catch(e => {
        console.error('특별공급 API 오류:', e);
        return { data: [] };
      }),
      getAPTWinningScore({ houseManageNo, pblancNo }).catch(e => {
        console.error('당첨가점 API 오류:', e);
        return { data: [] };
      }),
    ]);

    // 데이터 가공
    const housingTypes = processHousingTypes(housingTypesRes.data || []);
    const competition = processCompetition(competitionRes.data || []);
    const specialSupply = processSpecialSupply(specialSupplyRes.data || []);
    const winningScore = processWinningScore(winningScoreRes.data || []);

    // 총 세대수 계산
    const totalHouseholds = housingTypes.reduce((sum, t) => sum + t.totalHouseholds, 0);
    const totalGeneral = housingTypes.reduce((sum, t) => sum + t.generalHouseholds, 0);
    const totalSpecial = housingTypes.reduce((sum, t) => sum + t.specialHouseholds, 0);

    // 평균 분양가 계산
    const avgPrice = housingTypes.length > 0
      ? Math.round(housingTypes.reduce((sum, t) => sum + t.topPrice, 0) / housingTypes.length)
      : 0;

    // 평균 평당가 계산
    const avgPricePerPyeong = housingTypes.length > 0
      ? Math.round(housingTypes.reduce((sum, t) => sum + t.pricePerPyeong, 0) / housingTypes.length)
      : 0;

    return NextResponse.json({
      success: true,
      data: {
        id,
        summary: {
          totalHouseholds,
          totalGeneral,
          totalSpecial,
          avgPrice,
          avgPricePerPyeong,
          typeCount: housingTypes.length,
        },
        housingTypes,
        competition,
        specialSupply,
        winningScore,
        rawData: {
          housingTypesCount: housingTypesRes.data?.length || 0,
          competitionCount: competitionRes.data?.length || 0,
          specialSupplyCount: specialSupplyRes.data?.length || 0,
          winningScoreCount: winningScoreRes.data?.length || 0,
        },
      },
    });
  } catch (error) {
    console.error('분양 상세 정보 조회 실패:', error);
    return NextResponse.json(
      { success: false, error: '분양 상세 정보를 가져오는데 실패했습니다.' },
      { status: 500 }
    );
  }
}
