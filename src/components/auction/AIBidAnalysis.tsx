'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Brain, TrendingUp, TrendingDown, AlertTriangle,
  Target, Lightbulb, RefreshCw, Loader2,
  MapPin, Clock, Navigation, Building2
} from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';

interface AIBidAnalysisProps {
  // 물건 정보
  appraisalPrice: number;      // 감정가
  minimumPrice: number;        // 최저가
  minimumRate?: number;        // 최저가율 (%)
  bidCount: number;            // 유찰 횟수
  address: string;             // 주소
  itemType: string;            // 물건 종류
  landArea?: number;           // 토지면적
  buildingArea?: number;       // 건물면적

  // 법원 정보
  courtName: string;           // 법원명
  saleDate?: string;           // 매각기일
  saleTime?: string;           // 매각시간

  // 권리분석
  hasRisk?: boolean;           // 위험 물건 여부
  riskNote?: string;           // 위험 메모
  tenantCount?: number;        // 임차인 수
}

// 금액 포맷
function formatPrice(price: number): string {
  if (price >= 100000000) {
    const uk = Math.floor(price / 100000000);
    const man = Math.floor((price % 100000000) / 10000);
    return man > 0 ? `${uk}억 ${man.toLocaleString()}만원` : `${uk}억원`;
  }
  if (price >= 10000) {
    return `${Math.floor(price / 10000).toLocaleString()}만원`;
  }
  return `${price.toLocaleString()}원`;
}

// AI 분석 결과 타입
interface AnalysisResult {
  marketAnalysis: {
    trend: 'up' | 'down' | 'stable';
    description: string;
    estimatedMarketPrice: number;
    priceGap: number; // 시세 대비 차이 (%)
  };
  bidStrategy: {
    recommendedMin: number;
    recommendedMax: number;
    confidence: 'high' | 'medium' | 'low';
    reasoning: string;
  };
  riskFactors: string[];
  opportunities: string[];
  verdict: string;
}

// 간단한 AI 분석 로직 (실제로는 AI API 호출)
function analyzeAuction(props: AIBidAnalysisProps): AnalysisResult {
  const {
    appraisalPrice,
    minimumPrice,
    bidCount,
    itemType,
    hasRisk,
    tenantCount = 0,
  } = props;

  const minimumRate = (minimumPrice / appraisalPrice) * 100;

  // 예상 시세 계산 (감정가 기준 - 실제로는 실거래가 API 연동)
  // 일반적으로 감정가는 시세의 80-90% 수준
  const estimatedMarketPrice = Math.round(appraisalPrice * 1.1);
  const priceGap = Math.round(((estimatedMarketPrice - minimumPrice) / estimatedMarketPrice) * 100);

  // 입찰가 추천
  let recommendedMin = minimumPrice;
  let recommendedMax = Math.round(minimumPrice * 1.1);
  let confidence: 'high' | 'medium' | 'low' = 'medium';
  let reasoning = '';

  // 유찰 횟수에 따른 전략
  if (bidCount === 1) {
    reasoning = '첫 매각기일로 경쟁이 치열할 수 있습니다. 시세 대비 저렴하다면 적극 검토하세요.';
    recommendedMax = Math.round(minimumPrice * 1.15);
  } else if (bidCount === 2) {
    reasoning = '1회 유찰된 물건입니다. 20% 저렴해진 가격으로 투자 매력이 높아졌습니다.';
    confidence = 'high';
  } else if (bidCount >= 3) {
    reasoning = `${bidCount - 1}회 유찰로 최저가가 많이 낮아졌습니다. 유찰 사유를 꼭 확인하세요.`;
    confidence = hasRisk ? 'low' : 'high';
  }

  // 위험 요소
  const riskFactors: string[] = [];
  if (hasRisk) {
    riskFactors.push('⚠️ 권리분석상 주의가 필요한 물건입니다');
  }
  if (tenantCount > 0) {
    riskFactors.push(`👥 임차인 ${tenantCount}명 - 대항력/배당요구 확인 필요`);
  }
  if (minimumRate < 50) {
    riskFactors.push('📉 최저가율 50% 미만 - 다수 유찰 사유 파악 필요');
  }
  if (itemType === 'LAND' || itemType === 'FACTORY') {
    riskFactors.push('🏗️ 토지/공장 - 개발 규제 및 용도 확인 필요');
  }

  // 기회 요소
  const opportunities: string[] = [];
  if (priceGap > 30) {
    opportunities.push(`💰 시세 대비 약 ${priceGap}% 저렴한 가격`);
  }
  if (bidCount >= 2 && !hasRisk) {
    opportunities.push('✅ 권리관계 깨끗 + 유찰로 가격 매력 상승');
  }
  if (minimumRate >= 60 && minimumRate <= 80) {
    opportunities.push('📊 적정 최저가율로 낙찰 가능성 높음');
  }

  // 시세 트렌드 (간단 판단)
  let trend: 'up' | 'down' | 'stable' = 'stable';
  let trendDescription = '해당 지역 부동산 시세가 안정적입니다.';

  if (itemType === 'APARTMENT' || itemType === 'OFFICETEL') {
    trend = 'stable';
    trendDescription = '아파트/오피스텔 시장은 현재 안정세입니다. 실거래가 확인 후 입찰하세요.';
  } else if (itemType === 'LAND') {
    trend = 'up';
    trendDescription = '개발 가능 토지는 장기 투자 관점에서 검토하세요.';
  }

  // 최종 판단
  let verdict = '';
  if (priceGap > 30 && !hasRisk && tenantCount === 0) {
    verdict = '✨ 투자 매력도 높음 - 적극 검토 추천';
  } else if (priceGap > 20 && !hasRisk) {
    verdict = '👍 양호한 물건 - 권리분석 후 입찰 고려';
  } else if (hasRisk || tenantCount > 2) {
    verdict = '⚠️ 주의 필요 - 전문가 상담 권장';
  } else {
    verdict = '📋 보통 - 현장 확인 후 결정하세요';
  }

  return {
    marketAnalysis: {
      trend,
      description: trendDescription,
      estimatedMarketPrice,
      priceGap,
    },
    bidStrategy: {
      recommendedMin,
      recommendedMax,
      confidence,
      reasoning,
    },
    riskFactors,
    opportunities,
    verdict,
  };
}

// 법원 주소 데이터 (실제로는 DB나 API에서)
const COURT_ADDRESSES: Record<string, { address: string; phone: string }> = {
  '서울중앙지방법원': { address: '서울특별시 서초구 법원로 4', phone: '02-530-1114' },
  '서울동부지방법원': { address: '서울특별시 송파구 법원로 101', phone: '02-2192-1114' },
  '서울서부지방법원': { address: '서울특별시 마포구 마포대로 174', phone: '02-3271-1114' },
  '서울남부지방법원': { address: '서울특별시 양천구 신월로 386', phone: '02-2192-1114' },
  '서울북부지방법원': { address: '서울특별시 도봉구 마들로 749', phone: '02-950-1114' },
  '수원지방법원': { address: '경기도 수원시 영통구 법조로 20', phone: '031-210-1114' },
  '인천지방법원': { address: '인천광역시 미추홀구 축항대로 224', phone: '032-860-1114' },
  '부산지방법원': { address: '부산광역시 연제구 법원로 31', phone: '051-590-1114' },
  '대구지방법원': { address: '대구광역시 수성구 동대구로 364', phone: '053-757-1114' },
  '대전지방법원': { address: '대전광역시 서구 둔산로 155', phone: '042-480-1114' },
  '광주지방법원': { address: '광주광역시 동구 준법로 7-12', phone: '062-239-1114' },
  '울산지방법원': { address: '울산광역시 남구 법원로 55', phone: '052-216-1114' },
  '창원지방법원': { address: '경상남도 창원시 성산구 창이대로 681', phone: '055-239-1114' },
  '전주지방법원': { address: '전라북도 전주시 덕진구 기린대로 566', phone: '063-259-1114' },
  '청주지방법원': { address: '충청북도 청주시 서원구 산남로 62', phone: '043-299-1114' },
  '춘천지방법원': { address: '강원특별자치도 춘천시 공지로 287', phone: '033-240-1114' },
  '제주지방법원': { address: '제주특별자치도 제주시 문연로 10', phone: '064-720-1114' },
};

export function AIBidAnalysis(props: AIBidAnalysisProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(() => analyzeAuction(props));

  const { courtName, saleDate, saleTime } = props;
  const courtInfo = COURT_ADDRESSES[courtName] || null;

  const handleRefresh = () => {
    setIsAnalyzing(true);
    // 실제로는 AI API 호출
    setTimeout(() => {
      setAnalysis(analyzeAuction(props));
      setIsAnalyzing(false);
    }, 1000);
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'short',
    });
  };

  return (
    <div className="space-y-4">
      {/* AI 입찰 분석 */}
      <GlassCard className="overflow-hidden">
        <div className="p-4 border-b border-white/10 bg-gradient-to-r from-purple-500/20 to-blue-500/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-400" />
              <h3 className="text-lg font-bold text-white">AI 입찰 분석</h3>
            </div>
            <button
              onClick={handleRefresh}
              disabled={isAnalyzing}
              className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50"
              title="다시 분석"
            >
              {isAnalyzing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            AI가 분석한 입찰 전략과 주의사항
          </p>
        </div>

        {analysis && (
          <div className="p-4 space-y-4">
            {/* 최종 판단 */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-white/5 rounded-lg border border-white/10"
            >
              <p className="text-lg font-medium text-white">{analysis.verdict}</p>
            </motion.div>

            {/* 시세 분석 */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-white/5 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  {analysis.marketAnalysis.trend === 'up' ? (
                    <TrendingUp className="w-4 h-4 text-green-400" />
                  ) : analysis.marketAnalysis.trend === 'down' ? (
                    <TrendingDown className="w-4 h-4 text-red-400" />
                  ) : (
                    <TrendingUp className="w-4 h-4 text-yellow-400" />
                  )}
                  <span className="text-xs text-gray-400">예상 시세</span>
                </div>
                <p className="text-white font-bold">
                  {formatPrice(analysis.marketAnalysis.estimatedMarketPrice)}
                </p>
                <p className="text-xs text-green-400 mt-1">
                  최저가 대비 +{analysis.marketAnalysis.priceGap}%
                </p>
              </div>

              <div className="p-3 bg-white/5 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Target className="w-4 h-4 text-blue-400" />
                  <span className="text-xs text-gray-400">추천 입찰가</span>
                </div>
                <p className="text-white font-bold">
                  {formatPrice(analysis.bidStrategy.recommendedMin)}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  ~ {formatPrice(analysis.bidStrategy.recommendedMax)}
                </p>
              </div>
            </div>

            {/* 입찰 전략 */}
            <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-medium text-blue-400">입찰 전략</span>
              </div>
              <p className="text-sm text-gray-300">{analysis.bidStrategy.reasoning}</p>
            </div>

            {/* 기회 요소 */}
            {analysis.opportunities.length > 0 && (
              <div>
                <p className="text-sm font-medium text-green-400 mb-2">✅ 기회 요소</p>
                <ul className="space-y-1">
                  {analysis.opportunities.map((opp, i) => (
                    <li key={i} className="text-sm text-gray-300">{opp}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* 위험 요소 */}
            {analysis.riskFactors.length > 0 && (
              <div>
                <p className="text-sm font-medium text-yellow-400 mb-2">⚠️ 주의사항</p>
                <ul className="space-y-1">
                  {analysis.riskFactors.map((risk, i) => (
                    <li key={i} className="text-sm text-gray-300">{risk}</li>
                  ))}
                </ul>
              </div>
            )}

            <p className="text-xs text-gray-500 pt-2 border-t border-white/10">
              * AI 분석은 참고용이며, 실제 투자 결정은 전문가 상담과 현장 확인 후 진행하세요.
            </p>
          </div>
        )}
      </GlassCard>

      {/* 법원 정보 */}
      <GlassCard className="overflow-hidden">
        <div className="p-4 border-b border-white/10 bg-white/5">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-orange-400" />
            <h3 className="text-lg font-bold text-white">법원 정보</h3>
          </div>
        </div>

        <div className="p-4 space-y-3">
          {/* 매각기일 */}
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm text-gray-400">매각기일</p>
              <p className="text-white font-medium">
                {formatDate(saleDate)} {saleTime || '10:00'}
              </p>
            </div>
          </div>

          {/* 법원 위치 */}
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-gray-400">{courtName}</p>
              {courtInfo ? (
                <>
                  <p className="text-white">{courtInfo.address}</p>
                  <p className="text-sm text-gray-400 mt-1">📞 {courtInfo.phone}</p>
                </>
              ) : (
                <p className="text-gray-400">주소 정보 없음</p>
              )}
            </div>
          </div>

          {/* 길찾기 버튼 */}
          {courtInfo && (
            <div className="flex gap-2 pt-2">
              <a
                href={`https://map.naver.com/v5/search/${encodeURIComponent(courtInfo.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg transition-colors text-sm"
              >
                <Navigation className="w-4 h-4" />
                네이버 길찾기
              </a>
              <a
                href={`https://map.kakao.com/?q=${encodeURIComponent(courtInfo.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 rounded-lg transition-colors text-sm"
              >
                <Navigation className="w-4 h-4" />
                카카오 길찾기
              </a>
            </div>
          )}
        </div>
      </GlassCard>
    </div>
  );
}
