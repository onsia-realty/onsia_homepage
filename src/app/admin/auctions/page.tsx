'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Plus, Search, Edit, Trash2, Eye, Gavel, AlertTriangle,
  ChevronLeft, ChevronRight
} from 'lucide-react';

interface AuctionItem {
  id: string;
  caseNumber: string;
  courtName: string | null;
  address: string;
  itemType: string;
  appraisalPrice: string;
  minimumPrice: string;
  saleDate: string | null;
  bidCount: number;
  status: string;
  hasRisk: boolean;
  viewCount: number;
  createdAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const statusLabels: Record<string, string> = {
  SCHEDULED: '매각예정',
  BIDDING: '입찰중',
  SUCCESSFUL: '낙찰',
  FAILED: '유찰',
  WITHDRAWN: '취하',
  CANCELED: '취소',
};

const itemTypeLabels: Record<string, string> = {
  APARTMENT: '아파트',
  VILLA: '빌라',
  OFFICETEL: '오피스텔',
  HOUSE: '단독주택',
  COMMERCIAL: '상가',
  LAND: '토지',
  FACTORY: '공장',
  BUILDING: '건물',
  OTHER: '기타',
};

function formatPrice(price: string | number): string {
  const num = typeof price === 'string' ? parseInt(price) : price;
  if (num >= 100000000) {
    const uk = Math.floor(num / 100000000);
    const man = Math.floor((num % 100000000) / 10000);
    return man > 0 ? `${uk}억 ${man.toLocaleString()}만` : `${uk}억`;
  }
  return `${Math.floor(num / 10000).toLocaleString()}만`;
}

export default function AdminAuctionsPage() {
  const router = useRouter();
  const [items, setItems] = useState<AuctionItem[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchAuctions = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', page.toString());
      params.set('limit', '10');
      if (search) params.set('search', search);

      const response = await fetch(`/api/auctions?${params.toString()}`);
      const data = await response.json();

      setItems(data.items || []);
      setPagination(data.pagination || null);
    } catch (error) {
      console.error('Failed to fetch auctions:', error);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchAuctions();
  }, [fetchAuctions]);

  const handleDelete = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
      const response = await fetch(`/api/auctions/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchAuctions();
      } else {
        alert('삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Gavel className="w-7 h-7 text-blue-600" />
            경매 물건 관리
          </h1>
          <p className="text-gray-600 mt-1">
            총 {pagination?.total || 0}개의 물건
          </p>
        </div>
        <Link
          href="/admin/auctions/new"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          새 물건 등록
        </Link>
      </div>

      {/* 검색 */}
      <div className="bg-white rounded-lg shadow p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setPage(1);
            fetchAuctions();
          }}
          className="flex gap-4"
        >
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="사건번호, 주소로 검색"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            검색
          </button>
        </form>
      </div>

      {/* 테이블 */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">로딩 중...</div>
        ) : items.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            등록된 경매 물건이 없습니다.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    사건번호
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    주소
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    종류
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    최저가
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    매각일
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    상태
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    조회
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    관리
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {item.hasRisk && (
                          <AlertTriangle className="w-4 h-4 text-red-500" />
                        )}
                        <span className="font-medium text-gray-900">
                          {item.caseNumber}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {item.courtName}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-gray-900 line-clamp-1 max-w-xs">
                        {item.address}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="text-gray-600">
                        {itemTypeLabels[item.itemType] || item.itemType}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="font-medium text-green-600">
                        {formatPrice(item.minimumPrice)}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-gray-600">
                      {item.saleDate
                        ? new Date(item.saleDate).toLocaleDateString('ko-KR')
                        : '-'}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        item.status === 'SCHEDULED' ? 'bg-blue-100 text-blue-800' :
                        item.status === 'SUCCESSFUL' ? 'bg-green-100 text-green-800' :
                        item.status === 'FAILED' ? 'bg-orange-100 text-orange-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {statusLabels[item.status] || item.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-gray-600">
                      {item.viewCount}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/auctions/${item.id}`}
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                          title="보기"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/admin/auctions/${item.id}/edit`}
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                          title="수정"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                          title="삭제"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 페이지네이션 */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t">
            <div className="text-sm text-gray-500">
              {pagination.total}개 중 {(page - 1) * pagination.limit + 1}-
              {Math.min(page * pagination.limit, pagination.total)}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-sm text-gray-600">
                {page} / {pagination.totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                disabled={page === pagination.totalPages}
                className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
