'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Plus, Search, Edit, Trash2, Eye, Copy,
  Building2, MapPin, Calendar, TrendingUp, Filter, Zap
} from 'lucide-react';

interface Property {
  id: string;
  title: string;
  city: string;
  district: string;
  basePrice: string;
  priceDisplay: string | null;
  moveInDate: string;
  status: string;
  featured: boolean;
  isPremium: boolean;
  developer: { name: string };
  images: Array<{ url: string }>;
}

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await fetch('/api/admin/properties');
      const data = await response.json();
      // 배열인지 확인
      if (Array.isArray(data)) {
        setProperties(data);
      } else {
        console.log('Data is not an array, using empty array');
        setProperties([]);
      }
    } catch (error) {
      console.error('Failed to fetch properties:', error);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('정말 이 매물을 삭제하시겠습니까?')) return;

    try {
      const response = await fetch(`/api/properties/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setProperties(properties.filter(p => p.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete property:', error);
    }
  };

  // 매물 복제
  const handleDuplicate = async (id: string) => {
    if (!confirm('이 매물을 복제하시겠습니까?')) return;

    try {
      const response = await fetch(`/api/admin/properties/${id}/duplicate`, {
        method: 'POST',
      });
      const data = await response.json();

      if (response.ok) {
        alert(`"${data.property.title}" 매물이 복제되었습니다.`);
        fetchProperties(); // 목록 새로고침
      } else {
        alert(data.error || '복제에 실패했습니다.');
      }
    } catch (error) {
      console.error('Failed to duplicate property:', error);
      alert('매물 복제 중 오류가 발생했습니다.');
    }
  };

  // superjson 형식에서 값 추출
  const extractValue = (val: unknown): string => {
    if (val === null || val === undefined) return '';
    if (typeof val === 'string') return val;
    if (typeof val === 'number') return val.toString();
    if (typeof val === 'object' && val !== null && '$type' in val && 'value' in val) {
      return (val as { value: string }).value;
    }
    return '';
  };

  const formatPrice = (price: unknown) => {
    const priceStr = extractValue(price);
    if (!priceStr) return '가격문의';
    const numPrice = parseInt(priceStr);
    if (isNaN(numPrice)) return '가격문의';
    const eok = Math.floor(numPrice / 100000000);
    const man = Math.floor((numPrice % 100000000) / 10000);
    if (eok === 0 && man === 0) return '가격문의';
    if (man === 0) return `${eok}억`;
    return `${eok}억 ${man}만`;
  };

  // priceDisplay 우선, 없으면 basePrice로 표시
  const getDisplayPrice = (property: Property) => {
    if (property.priceDisplay) {
      return property.priceDisplay;
    }
    return formatPrice(property.basePrice);
  };

  const formatDate = (date: unknown) => {
    if (!date) return '-';
    const dateStr = extractValue(date);
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '-';
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}`;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'AVAILABLE':
        return <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">분양중</span>;
      case 'SOLD':
        return <span className="px-2 py-1 bg-gray-500/20 text-gray-400 text-xs rounded-full">완판</span>;
      case 'PENDING':
        return <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">대기</span>;
      default:
        return null;
    }
  };

  const filteredProperties = properties.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.city.includes(searchQuery) ||
                          p.district.includes(searchQuery);
    const matchesStatus = filterStatus === 'all' || p.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      {/* 헤더 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">매물 관리</h1>
          <p className="text-gray-400 mt-1">총 {properties.length}개의 매물</p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/properties/quick-add"
            className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 font-semibold rounded-lg hover:bg-yellow-500/30 transition-all"
          >
            <Zap className="w-5 h-5" />
            빠른 등록
          </Link>
          <Link
            href="/admin/properties/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all"
          >
            <Plus className="w-5 h-5" />
            새 매물 등록
          </Link>
        </div>
      </div>

      {/* 검색 및 필터 */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="매물명, 지역으로 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
          >
            <option value="all">전체 상태</option>
            <option value="AVAILABLE">분양중</option>
            <option value="PENDING">대기</option>
            <option value="SOLD">완판</option>
          </select>
        </div>
      </div>

      {/* 매물 목록 */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-400">매물 목록을 불러오는 중...</p>
        </div>
      ) : filteredProperties.length === 0 ? (
        <div className="text-center py-12 bg-gray-800/50 rounded-xl">
          <Building2 className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">등록된 매물이 없습니다.</p>
          <Link
            href="/admin/properties/new"
            className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
          >
            <Plus className="w-4 h-4" />
            첫 매물 등록하기
          </Link>
        </div>
      ) : (
        <div className="bg-gray-800/50 rounded-xl overflow-hidden">
          {/* 테이블 헤더 */}
          <div className="hidden md:grid grid-cols-12 gap-4 p-4 border-b border-gray-700 text-sm text-gray-400">
            <div className="col-span-4">매물 정보</div>
            <div className="col-span-2">위치</div>
            <div className="col-span-2">분양가</div>
            <div className="col-span-2">입주예정</div>
            <div className="col-span-1">상태</div>
            <div className="col-span-1">관리</div>
          </div>

          {/* 매물 목록 */}
          {filteredProperties.map((property, index) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 border-b border-gray-700/50 hover:bg-white/5 transition-colors"
            >
              {/* 매물 정보 */}
              <div className="col-span-4 flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-700 flex-shrink-0">
                  {property.images?.[0]?.url ? (
                    <Image
                      src={property.images[0].url}
                      alt={property.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-gray-500" />
                    </div>
                  )}
                  {property.isPremium && (
                    <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-yellow-500 text-black text-[10px] font-bold rounded">
                      P
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-white font-medium line-clamp-1">{property.title}</h3>
                  <p className="text-gray-400 text-sm">{property.developer?.name}</p>
                  {property.featured && (
                    <span className="inline-block mt-1 px-2 py-0.5 bg-orange-500/20 text-orange-400 text-xs rounded">
                      추천
                    </span>
                  )}
                </div>
              </div>

              {/* 위치 */}
              <div className="col-span-2 flex items-center">
                <div className="flex items-center gap-2 text-gray-300">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span>{property.city} {property.district}</span>
                </div>
              </div>

              {/* 분양가 */}
              <div className="col-span-2 flex items-center">
                <div className="flex items-center gap-2 text-cyan-400 font-medium">
                  <TrendingUp className="w-4 h-4" />
                  {getDisplayPrice(property)}
                </div>
              </div>

              {/* 입주예정 */}
              <div className="col-span-2 flex items-center">
                <div className="flex items-center gap-2 text-gray-300">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  {formatDate(property.moveInDate)}
                </div>
              </div>

              {/* 상태 */}
              <div className="col-span-1 flex items-center">
                {getStatusBadge(property.status)}
              </div>

              {/* 관리 버튼 */}
              <div className="col-span-1 flex items-center gap-1">
                <Link
                  href={`/properties/${property.id}`}
                  target="_blank"
                  className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                  title="보기"
                >
                  <Eye className="w-4 h-4" />
                </Link>
                <Link
                  href={`/admin/properties/${property.id}/edit`}
                  className="p-1.5 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                  title="수정"
                >
                  <Edit className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => handleDuplicate(property.id)}
                  className="p-1.5 text-gray-400 hover:text-green-400 hover:bg-green-500/10 rounded-lg transition-colors"
                  title="복제"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(property.id)}
                  className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  title="삭제"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
