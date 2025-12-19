'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, BarChart3, ExternalLink, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface Stats {
  avgPrice: number;
  avgPricePerPyeong: number;
  maxPrice: number;
  minPrice: number;
  totalCount: number;
  avgPriceFormatted: string;
  avgPricePerPyeongFormatted: string;
  maxPriceFormatted: string;
  minPriceFormatted: string;
  recentTransactions?: Array<{
    dealYear: string;
    dealMonth: string;
    buildingName: string;
    area: number;
    priceFormatted: string;
  }>;
}

interface RealPriceSectionProps {
  sido: string;          // 예: "서울특별시"
  sigungu: string;       // 예: "관악구"
  propertyType: string;  // 예: "아파트", "다세대", "단독주택"
  appraisalPrice: number;  // 감정가 (원)
  minimumPrice: number;    // 최저가 (원)
  area?: number;           // 면적 (㎡)
}

export default function RealPriceSection({
  sido,
  sigungu,
  propertyType,
  appraisalPrice,
  minimumPrice,
  area,
}: RealPriceSectionProps) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      if (!sido || !sigungu) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `/api/real-price/stats?sido=${encodeURIComponent(sido)}&sigungu=${encodeURIComponent(sigungu)}&propertyType=${encodeURIComponent(propertyType)}&months=6`
        );
        const data = await response.json();

        if (data.success) {
          setStats(data.data.stats);
        } else {
          setError('시세 정보를 불러올 수 없습니다.');
        }
      } catch (err) {
        setError('시세 정보 조회 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchStats();
  }, [sido, sigungu, propertyType]);

  // 평당가 계산 (만원 단위)
  const pyeong = area ? area / 3.3058 : 0;
  const appraisalPerPyeong = pyeong > 0 ? Math.round(appraisalPrice / 10000 / pyeong) : 0;
  const minimumPerPyeong = pyeong > 0 ? Math.round(minimumPrice / 10000 / pyeong) : 0;

  // 시세 대비 비율 계산
  const getCompareRatio = (pricePerPyeong: number) => {
    if (!stats || stats.avgPricePerPyeong === 0) return null;
    return Math.round((pricePerPyeong / stats.avgPricePerPyeong - 1) * 100);
  };

  const appraisalRatio = getCompareRatio(appraisalPerPyeong);
  const minimumRatio = getCompareRatio(minimumPerPyeong);

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">시세 정보 조회 중...</span>
        </div>
      </div>
    );
  }

  // 에러 또는 데이터 없음
  if (error || !stats || stats.totalCount === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-bold text-gray-900">주변 시세 비교</h3>
        </div>
        <p className="text-gray-500 text-center py-4">
          {error || '해당 지역의 실거래가 정보가 없습니다.'}
        </p>
        <Link
          href={`/market?sido=${encodeURIComponent(sido)}&sigungu=${encodeURIComponent(sigungu)}`}
          className="block text-center text-blue-600 hover:underline text-sm"
        >
          시세 조회 페이지에서 확인하기 →
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-bold text-gray-900">주변 시세 비교</h3>
        </div>
        <Link
          href={`/market?sido=${encodeURIComponent(sido)}&sigungu=${encodeURIComponent(sigungu)}`}
          className="text-sm text-blue-600 hover:underline flex items-center gap-1"
        >
          상세보기 <ExternalLink className="w-3 h-3" />
        </Link>
      </div>

      {/* 주변 시세 평균 */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <p className="text-sm text-gray-600 mb-1">
          {sigungu} {propertyType} 평균 (최근 6개월, {stats.totalCount}건)
        </p>
        <p className="text-2xl font-bold text-gray-900">
          평당 {stats.avgPricePerPyeongFormatted}
        </p>
      </div>

      {/* 비교 바 차트 */}
      <div className="space-y-4 mb-6">
        {/* 감정가 */}
        {appraisalPerPyeong > 0 && (
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">감정가</span>
              <span className="font-medium">
                {appraisalPerPyeong.toLocaleString()}만원/평
                {appraisalRatio !== null && (
                  <span className={appraisalRatio > 0 ? 'text-red-500 ml-1' : 'text-green-500 ml-1'}>
                    ({appraisalRatio > 0 ? '+' : ''}{appraisalRatio}%)
                  </span>
                )}
              </span>
            </div>
            <div className="h-6 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-orange-400 rounded-full flex items-center justify-end pr-2"
                style={{
                  width: `${Math.min(100, (appraisalPerPyeong / stats.avgPricePerPyeong) * 50)}%`,
                }}
              />
            </div>
          </div>
        )}

        {/* 최저가 */}
        {minimumPerPyeong > 0 && (
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">최저매각가</span>
              <span className="font-medium">
                {minimumPerPyeong.toLocaleString()}만원/평
                {minimumRatio !== null && (
                  <span className={minimumRatio > 0 ? 'text-red-500 ml-1' : 'text-green-500 ml-1'}>
                    ({minimumRatio > 0 ? '+' : ''}{minimumRatio}%)
                  </span>
                )}
              </span>
            </div>
            <div className="h-6 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full flex items-center justify-end pr-2"
                style={{
                  width: `${Math.min(100, (minimumPerPyeong / stats.avgPricePerPyeong) * 50)}%`,
                }}
              />
            </div>
          </div>
        )}

        {/* 시세 평균 (기준선) */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">시세 평균</span>
            <span className="font-medium text-gray-900">
              {stats.avgPricePerPyeong.toLocaleString()}만원/평
            </span>
          </div>
          <div className="h-6 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gray-400 rounded-full"
              style={{ width: '50%' }}
            />
          </div>
        </div>
      </div>

      {/* 투자 판단 메시지 */}
      {minimumRatio !== null && (
        <div className={`rounded-lg p-4 ${minimumRatio < 0 ? 'bg-green-50' : 'bg-orange-50'}`}>
          {minimumRatio < -20 ? (
            <div className="flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-green-600" />
              <p className="text-green-700 font-medium">
                시세 대비 {Math.abs(minimumRatio)}% 저렴! 투자 가치 검토 필요
              </p>
            </div>
          ) : minimumRatio < 0 ? (
            <div className="flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-green-600" />
              <p className="text-green-700 font-medium">
                시세 대비 {Math.abs(minimumRatio)}% 저렴
              </p>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-orange-600" />
              <p className="text-orange-700 font-medium">
                시세 대비 {minimumRatio}% 높음 (신중한 검토 필요)
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
