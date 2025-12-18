'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Calendar, Building2, Maximize2, Layers } from 'lucide-react';

interface Transaction {
  dealDate: string;
  dealYear: string;
  dealMonth: string;
  dealDay: string;
  buildingName: string;
  dong: string;
  area: number;
  floor: string;
  price: number;
  pricePerPyeong: number;
  buildYear: string;
  priceFormatted: string;
  pyeong: number;
  pricePerPyeongFormatted: string;
}

interface TransactionTableProps {
  transactions: Transaction[];
  totalCount: number;
}

export default function TransactionTable({ transactions, totalCount }: TransactionTableProps) {
  const [showAll, setShowAll] = useState(false);
  const displayTransactions = showAll ? transactions : transactions.slice(0, 20);

  if (transactions.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <p className="text-gray-500">해당 조건의 거래 내역이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            최근 거래 내역
          </h2>
          <span className="text-sm text-gray-500">
            총 {totalCount.toLocaleString()}건
          </span>
        </div>
      </div>

      {/* 모바일 카드 뷰 */}
      <div className="md:hidden divide-y divide-gray-200">
        {displayTransactions.map((t, idx) => (
          <div key={idx} className="p-4 hover:bg-gray-50">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-semibold text-gray-900">{t.buildingName || t.dong}</p>
                <p className="text-sm text-gray-500">{t.dong}</p>
              </div>
              <p className="text-lg font-bold text-blue-600">{t.priceFormatted}</p>
            </div>
            <div className="flex gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {t.dealYear}.{t.dealMonth}.{t.dealDay}
              </span>
              <span className="flex items-center gap-1">
                <Maximize2 className="w-4 h-4" />
                {t.area}㎡ ({t.pyeong}평)
              </span>
              <span className="flex items-center gap-1">
                <Layers className="w-4 h-4" />
                {t.floor}층
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              평당 {t.pricePerPyeongFormatted}
            </p>
          </div>
        ))}
      </div>

      {/* 데스크톱 테이블 뷰 */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                거래일
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                단지명/법정동
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                면적
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                층
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                거래금액
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                평당가
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {displayTransactions.map((t, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {t.dealYear}.{t.dealMonth}.{t.dealDay}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <p className="text-sm font-medium text-gray-900">{t.buildingName || '-'}</p>
                  <p className="text-sm text-gray-500">{t.dong}</p>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {t.area}㎡ ({t.pyeong}평)
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {t.floor}층
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-600 text-right">
                  {t.priceFormatted}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                  {t.pricePerPyeongFormatted}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 더보기 버튼 */}
      {transactions.length > 20 && (
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => setShowAll(!showAll)}
            className="w-full flex items-center justify-center gap-2 py-2 text-blue-600 hover:text-blue-800 font-medium"
          >
            {showAll ? (
              <>
                <ChevronUp className="w-5 h-5" />
                접기
              </>
            ) : (
              <>
                <ChevronDown className="w-5 h-5" />
                더보기 ({transactions.length - 20}건 더)
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
