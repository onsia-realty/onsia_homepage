'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Save, ArrowLeft, Zap, Building2, MapPin, TrendingUp,
  Calendar, Loader2, Plus, Image as ImageIcon
} from 'lucide-react';
import { ImageUploader } from '@/components/admin/ImageUploader';

interface Developer {
  id: string;
  name: string;
}

export default function QuickAddPropertyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [continueAfterSave, setContinueAfterSave] = useState(true);

  // 필수 필드만 (7개 + α)
  const [formData, setFormData] = useState({
    title: '',           // 1. 현장명
    city: '',           // 2. 시/도
    district: '',       // 2. 시/군/구
    address: '',        // 2. 상세주소
    basePrice: '',      // 3. 분양가
    contractDeposit: '', // 4. 계약금
    completionDate: '', // 5. 준공예정일
    totalUnits: '',     // 6. 총 세대수
    buildingType: 'OFFICETEL', // 7. 건물유형
    // 권장 필드 (선택)
    constructor: '',    // 시공사
    keyFeature: '',     // 특장점
    developerId: '',    // 시행사
  });

  useEffect(() => {
    fetchDevelopers();
  }, []);

  const fetchDevelopers = async () => {
    try {
      const response = await fetch('/api/developers');
      if (response.ok) {
        const data = await response.json();
        setDevelopers(data);
      }
    } catch (error) {
      console.error('Failed to fetch developers:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 가격 변환 (억 → 원)
      const priceToWon = (value: string) => {
        if (!value) return 0;
        const num = parseFloat(value);
        return Math.round(num * 100000000);
      };

      // slug 생성
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9가-힣]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '') + '-' + Date.now();

      const payload = {
        title: formData.title,
        slug,
        description: `${formData.city} ${formData.district}에 위치한 ${formData.title}입니다.`,
        city: formData.city,
        district: formData.district,
        address: formData.address,
        basePrice: priceToWon(formData.basePrice),
        contractDeposit: priceToWon(formData.contractDeposit),
        completionDate: formData.completionDate,
        moveInDate: formData.completionDate, // 기본값: 준공일과 동일
        totalUnits: parseInt(formData.totalUnits) || 0,
        availableUnits: parseInt(formData.totalUnits) || 0, // 기본값: 총 세대수
        buildingType: formData.buildingType,
        constructor: formData.constructor || null,
        keyFeature: formData.keyFeature || null,
        developerId: formData.developerId || null,
        status: 'AVAILABLE',
        featured: false,
        isPremium: false,
        interimPayments: '{"payments":[]}',
        images: images.map((url, index) => ({ url, order: index })),
      };

      const response = await fetch('/api/admin/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const result = await response.json();

        if (continueAfterSave) {
          // 폼 초기화하고 계속 등록
          setFormData({
            title: '',
            city: formData.city, // 지역은 유지
            district: '',
            address: '',
            basePrice: '',
            contractDeposit: '',
            completionDate: '',
            totalUnits: '',
            buildingType: formData.buildingType, // 건물유형 유지
            constructor: '',
            keyFeature: '',
            developerId: formData.developerId, // 시행사 유지
          });
          setImages([]);
          alert(`"${result.title}" 등록 완료! 다음 매물을 입력하세요.`);
        } else {
          router.push('/admin/properties');
        }
      } else {
        const error = await response.json();
        alert(error.message || '매물 등록에 실패했습니다.');
      }
    } catch (error) {
      console.error('Failed to create property:', error);
      alert('매물 등록 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* 헤더 */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => router.back()}
          className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Zap className="w-6 h-6 text-yellow-400" />
            빠른 매물 등록
          </h1>
          <p className="text-gray-400 mt-1">필수 정보만 입력하고 빠르게 등록</p>
        </div>
      </div>

      {/* 진행률 표시 */}
      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-6">
        <p className="text-yellow-400 text-sm">
          💡 <strong>빠른 등록 팁:</strong> 필수 7개 항목만 입력하면 바로 등록됩니다.
          나머지는 나중에 수정 페이지에서 추가하세요.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 필수 정보 */}
        <div className="bg-gray-800/50 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-400" />
            필수 정보 <span className="text-red-400 text-sm">(7개)</span>
          </h2>

          <div className="space-y-4">
            {/* 1. 현장명 */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                1. 현장명 <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="예: 백운호수 푸르지오 숲속의 아침"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                required
                autoFocus
              />
            </div>

            {/* 2. 위치 */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                2. 위치 <span className="text-red-400">*</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="시/도"
                  className="px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  required
                />
                <input
                  type="text"
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  placeholder="시/군/구"
                  className="px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  required
                />
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="상세주소"
                  className="px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
            </div>

            {/* 3-4. 가격 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  3. 분양가 (억) <span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="basePrice"
                  value={formData.basePrice}
                  onChange={handleChange}
                  placeholder="예: 16"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  4. 계약금 (억) <span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="contractDeposit"
                  value={formData.contractDeposit}
                  onChange={handleChange}
                  placeholder="예: 0.8"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
            </div>

            {/* 5. 준공예정일 */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                5. 준공예정일 <span className="text-red-400">*</span>
              </label>
              <input
                type="date"
                name="completionDate"
                value={formData.completionDate}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            {/* 6-7. 세대수, 건물유형 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  6. 총 세대수 <span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  name="totalUnits"
                  value={formData.totalUnits}
                  onChange={handleChange}
                  placeholder="예: 842"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  7. 건물 유형 <span className="text-red-400">*</span>
                </label>
                <select
                  name="buildingType"
                  value={formData.buildingType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="APARTMENT">아파트</option>
                  <option value="OFFICETEL">오피스텔</option>
                  <option value="VILLA">빌라</option>
                  <option value="TOWNHOUSE">타운하우스</option>
                  <option value="COMMERCIAL">상가/지식산업센터</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* 권장 정보 (선택) */}
        <div className="bg-gray-800/30 rounded-xl p-6 border border-dashed border-gray-700">
          <h2 className="text-lg font-semibold text-gray-400 mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5" />
            추가 정보 <span className="text-gray-500 text-sm">(선택)</span>
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">시행사</label>
              <select
                name="developerId"
                value={formData.developerId}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white focus:outline-none focus:border-blue-500"
              >
                <option value="">선택 안함</option>
                {developers.map(dev => (
                  <option key={dev.id} value={dev.id}>{dev.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">시공사</label>
              <input
                type="text"
                name="constructor"
                value={formData.constructor}
                onChange={handleChange}
                placeholder="예: 대우건설(푸르지오)"
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-400 mb-2">특장점</label>
              <input
                type="text"
                name="keyFeature"
                value={formData.keyFeature}
                onChange={handleChange}
                placeholder="예: 백운호수 숲세권, GTX-C 예정"
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* 이미지 업로드 */}
        <div className="bg-gray-800/30 rounded-xl p-6 border border-dashed border-gray-700">
          <h2 className="text-lg font-semibold text-gray-400 mb-4 flex items-center gap-2">
            <ImageIcon className="w-5 h-5" />
            썸네일 이미지 <span className="text-gray-500 text-sm">(선택)</span>
          </h2>
          <ImageUploader
            images={images}
            onChange={setImages}
            maxImages={3}
          />
        </div>

        {/* 제출 영역 */}
        <div className="flex items-center justify-between gap-4 bg-gray-800/50 rounded-xl p-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={continueAfterSave}
              onChange={(e) => setContinueAfterSave(e.target.checked)}
              className="w-5 h-5 rounded bg-gray-700 border-gray-600 text-yellow-500 focus:ring-yellow-500"
            />
            <span className="text-gray-300 text-sm">저장 후 계속 등록</span>
          </label>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  등록 중...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  빠른 등록
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
