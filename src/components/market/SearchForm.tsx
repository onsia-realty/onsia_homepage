'use client';

import { useState, useEffect } from 'react';
import { Search, MapPin, Building2, LucideIcon } from 'lucide-react';
import { getSidoList, getSigunguList } from '@/lib/lawd-codes';

interface PropertyType {
  value: string;
  label: string;
  icon: LucideIcon;
}

interface SearchFormProps {
  propertyTypes: PropertyType[];
  onSearch: (sido: string, sigungu: string, propertyType: string) => void;
  isLoading: boolean;
}

export default function SearchForm({ propertyTypes, onSearch, isLoading }: SearchFormProps) {
  const [sido, setSido] = useState('서울특별시');
  const [sigungu, setSigungu] = useState('');
  const [propertyType, setPropertyType] = useState('아파트');
  const [sidoList, setSidoList] = useState<string[]>([]);
  const [sigunguList, setSigunguList] = useState<string[]>([]);

  // 시/도 목록 로드
  useEffect(() => {
    const list = getSidoList();
    setSidoList(list);
  }, []);

  // 시/군/구 목록 로드
  useEffect(() => {
    if (sido) {
      const list = getSigunguList(sido);
      setSigunguList(list);
      if (list.length > 0 && !list.includes(sigungu)) {
        setSigungu(list[0]);
      }
    }
  }, [sido]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (sido && sigungu && propertyType) {
      onSearch(sido, sigungu, propertyType);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 지역 선택 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <MapPin className="w-4 h-4 inline mr-1" />
            시/도
          </label>
          <select
            value={sido}
            onChange={(e) => setSido(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {sidoList.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <MapPin className="w-4 h-4 inline mr-1" />
            시/군/구
          </label>
          <select
            value={sigungu}
            onChange={(e) => setSigungu(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {sigunguList.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 물건종류 선택 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          <Building2 className="w-4 h-4 inline mr-1" />
          물건종류
        </label>
        <div className="flex flex-wrap gap-2">
          {propertyTypes.map((type) => {
            const Icon = type.icon;
            return (
              <button
                key={type.value}
                type="button"
                onClick={() => setPropertyType(type.value)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                  propertyType === type.value
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                }`}
              >
                <Icon className="w-4 h-4" />
                {type.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 검색 버튼 */}
      <button
        type="submit"
        disabled={isLoading || !sido || !sigungu}
        className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
      >
        <Search className="w-5 h-5" />
        {isLoading ? '조회 중...' : '실거래가 조회'}
      </button>
    </form>
  );
}
