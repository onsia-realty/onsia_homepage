'use client';

import { TrendingUp, TrendingDown, BarChart3, Home } from 'lucide-react';

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
}

interface StatsCardProps {
  sido: string;
  sigungu: string;
  propertyType: string;
  stats: Stats;
}

export default function StatsCard({ sido, sigungu, propertyType, stats }: StatsCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-2 mb-6">
        <BarChart3 className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-bold text-gray-900">
          {sigungu} {propertyType} 시세 현황
        </h2>
        <span className="text-sm text-gray-500">(최근 6개월)</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* 평균 매매가 */}
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Home className="w-4 h-4 text-blue-600" />
            <span className="text-sm text-gray-600">평균 매매가</span>
          </div>
          <p className="text-2xl font-bold text-blue-600">
            {stats.avgPriceFormatted}
          </p>
        </div>

        {/* 평균 평당가 */}
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-sm text-gray-600">평균 평당가</span>
          </div>
          <p className="text-2xl font-bold text-green-600">
            {stats.avgPricePerPyeongFormatted}
          </p>
        </div>

        {/* 최고가 */}
        <div className="bg-orange-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-orange-600" />
            <span className="text-sm text-gray-600">최고가</span>
          </div>
          <p className="text-2xl font-bold text-orange-600">
            {stats.maxPriceFormatted}
          </p>
        </div>

        {/* 거래량 */}
        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-4 h-4 text-purple-600" />
            <span className="text-sm text-gray-600">거래량</span>
          </div>
          <p className="text-2xl font-bold text-purple-600">
            {stats.totalCount.toLocaleString()}건
          </p>
        </div>
      </div>

      {/* 가격 범위 바 */}
      <div className="mt-6 bg-gray-100 rounded-lg p-4">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>최저가: {stats.minPriceFormatted}</span>
          <span>최고가: {stats.maxPriceFormatted}</span>
        </div>
        <div className="h-3 bg-gradient-to-r from-green-400 via-yellow-400 to-red-400 rounded-full relative">
          {/* 평균 위치 표시 */}
          {stats.maxPrice > stats.minPrice && (
            <div
              className="absolute top-0 w-1 h-3 bg-blue-800 rounded-full"
              style={{
                left: `${((stats.avgPrice - stats.minPrice) / (stats.maxPrice - stats.minPrice)) * 100}%`,
              }}
              title={`평균: ${stats.avgPriceFormatted}`}
            />
          )}
        </div>
        <p className="text-center text-sm text-gray-500 mt-2">
          평균 {stats.avgPriceFormatted}
        </p>
      </div>
    </div>
  );
}
