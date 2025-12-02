'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Save, ArrowLeft, Building2, MapPin, Calendar, TrendingUp,
  Users, Car, Home, Loader2, Star, Play, FileText
} from 'lucide-react';
import { ImageUploader } from '@/components/admin/ImageUploader';

interface Developer {
  id: string;
  name: string;
}

export default function NewPropertyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [images, setImages] = useState<string[]>([]);

  // 폼 데이터
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    address: '',
    district: '',
    city: '',
    zipCode: '',
    totalUnits: '',
    availableUnits: '',
    buildingType: 'APARTMENT',
    completionDate: '',
    moveInDate: '',
    basePrice: '',
    pricePerPyeong: '',
    contractDeposit: '',
    rightsFee: '',
    profitRate: '',
    investmentGrade: '',
    constructor: '',
    keyFeature: '',
    totalBuildingCount: '',
    parkingSpaces: '',
    facilities: '',
    status: 'AVAILABLE',
    featured: false,
    isPremium: false,
    pdfUrl: '',
    youtubeVideoId: '',
    locationDesc: '',
    pyeongTypes: '',
    developerId: '',
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));

    // 제목 변경 시 slug 자동 생성
    if (name === 'title') {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9가-힣]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      setFormData(prev => ({ ...prev, slug }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 가격 데이터 변환 (억/만 → 원)
      const priceToWon = (value: string) => {
        if (!value) return 0;
        const num = parseFloat(value);
        return Math.round(num * 100000000); // 억 단위로 입력받음
      };

      const payload = {
        ...formData,
        totalUnits: parseInt(formData.totalUnits) || 0,
        availableUnits: parseInt(formData.availableUnits) || 0,
        basePrice: priceToWon(formData.basePrice),
        pricePerPyeong: formData.pricePerPyeong ? parseInt(formData.pricePerPyeong) * 10000 : null,
        contractDeposit: priceToWon(formData.contractDeposit),
        rightsFee: formData.rightsFee ? priceToWon(formData.rightsFee) : null,
        profitRate: formData.profitRate ? parseFloat(formData.profitRate) : null,
        totalBuildingCount: formData.totalBuildingCount ? parseInt(formData.totalBuildingCount) : null,
        parkingSpaces: formData.parkingSpaces ? parseInt(formData.parkingSpaces) : null,
        facilities: formData.facilities ? JSON.stringify(formData.facilities.split(',').map(f => f.trim())) : '[]',
        pyeongTypes: formData.pyeongTypes ? JSON.stringify(formData.pyeongTypes.split(',').map(p => p.trim())) : null,
        interimPayments: '{"payments":[]}',
        images: images.map((url, index) => ({ url, order: index })),
      };

      const response = await fetch('/api/admin/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        router.push('/admin/properties');
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
    <div className="max-w-4xl mx-auto">
      {/* 헤더 */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => router.back()}
          className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white">새 매물 등록</h1>
          <p className="text-gray-400 mt-1">분양권 매물 정보를 입력하세요</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 기본 정보 */}
        <div className="bg-gray-800/50 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-400" />
            기본 정보
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                매물명 <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="예: 광교 클라우드시티 A블록"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                매물 설명 <span className="text-red-400">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                placeholder="매물에 대한 상세 설명을 입력하세요"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                건물 유형 <span className="text-red-400">*</span>
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
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                시행사 <span className="text-red-400">*</span>
              </label>
              <div className="flex gap-2">
                <select
                  name="developerId"
                  value={formData.developerId}
                  onChange={handleChange}
                  className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  required
                >
                  <option value="">선택하세요</option>
                  {developers.map(dev => (
                    <option key={dev.id} value={dev.id}>{dev.name}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => {
                    const name = prompt('새 시행사 이름을 입력하세요:');
                    if (name && name.trim()) {
                      fetch('/api/developers', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ name: name.trim() }),
                      })
                        .then(res => res.json())
                        .then(newDev => {
                          setDevelopers([...developers, newDev]);
                          setFormData(prev => ({ ...prev, developerId: newDev.id }));
                        })
                        .catch(() => alert('시행사 추가에 실패했습니다.'));
                    }
                  }}
                  className="px-4 py-3 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg hover:bg-blue-500/30 transition-colors whitespace-nowrap"
                >
                  + 추가
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                시공사
              </label>
              <input
                type="text"
                name="constructor"
                value={formData.constructor}
                onChange={handleChange}
                placeholder="예: 삼성물산, 현대건설"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                특장점
              </label>
              <input
                type="text"
                name="keyFeature"
                value={formData.keyFeature}
                onChange={handleChange}
                placeholder="예: 역세권, 학군 우수"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* 위치 정보 */}
        <div className="bg-gray-800/50 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-green-400" />
            위치 정보
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                시/도 <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="예: 경기도"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                시/군/구 <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="district"
                value={formData.district}
                onChange={handleChange}
                placeholder="예: 수원시 영통구"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                상세 주소 <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="예: 광교중앙로 123"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                위치 설명 (교통, 학군 등)
              </label>
              <textarea
                name="locationDesc"
                value={formData.locationDesc}
                onChange={handleChange}
                rows={2}
                placeholder="예: 광교중앙역 도보 5분, 광교호수공원 인접, 용인 삼성전자 배후수요"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none"
              />
            </div>
          </div>
        </div>

        {/* 가격 정보 */}
        <div className="bg-gray-800/50 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-cyan-400" />
            가격 정보
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                분양가 (억) <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                name="basePrice"
                value={formData.basePrice}
                onChange={handleChange}
                placeholder="예: 5.5"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                평단가 (만원)
              </label>
              <input
                type="number"
                name="pricePerPyeong"
                value={formData.pricePerPyeong}
                onChange={handleChange}
                placeholder="예: 2500"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                계약금 (억) <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                name="contractDeposit"
                value={formData.contractDeposit}
                onChange={handleChange}
                placeholder="예: 0.5"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                권리금 (억)
              </label>
              <input
                type="number"
                step="0.01"
                name="rightsFee"
                value={formData.rightsFee}
                onChange={handleChange}
                placeholder="예: 0.3"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                예상 수익률 (%)
              </label>
              <input
                type="number"
                step="0.1"
                name="profitRate"
                value={formData.profitRate}
                onChange={handleChange}
                placeholder="예: 15.5"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                투자등급
              </label>
              <select
                name="investmentGrade"
                value={formData.investmentGrade}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
              >
                <option value="">선택하세요</option>
                <option value="S">S등급</option>
                <option value="A">A등급</option>
                <option value="B">B등급</option>
                <option value="C">C등급</option>
              </select>
            </div>
          </div>
        </div>

        {/* 단지 정보 */}
        <div className="bg-gray-800/50 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Home className="w-5 h-5 text-purple-400" />
            단지 정보
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                총 세대수 <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                name="totalUnits"
                value={formData.totalUnits}
                onChange={handleChange}
                placeholder="예: 1500"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                잔여 세대
              </label>
              <input
                type="number"
                name="availableUnits"
                value={formData.availableUnits}
                onChange={handleChange}
                placeholder="예: 50"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                총 동수
              </label>
              <input
                type="number"
                name="totalBuildingCount"
                value={formData.totalBuildingCount}
                onChange={handleChange}
                placeholder="예: 12"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                주차대수
              </label>
              <input
                type="number"
                name="parkingSpaces"
                value={formData.parkingSpaces}
                onChange={handleChange}
                placeholder="예: 2000"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                평형 구성 (쉼표로 구분)
              </label>
              <input
                type="text"
                name="pyeongTypes"
                value={formData.pyeongTypes}
                onChange={handleChange}
                placeholder="예: 59A, 84B, 114C"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                단지 시설 (쉼표로 구분)
              </label>
              <input
                type="text"
                name="facilities"
                value={formData.facilities}
                onChange={handleChange}
                placeholder="예: 피트니스, 독서실, 커뮤니티센터"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* 일정 */}
        <div className="bg-gray-800/50 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-orange-400" />
            일정
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                준공예정일 <span className="text-red-400">*</span>
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
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                입주예정일
              </label>
              <input
                type="date"
                name="moveInDate"
                value={formData.moveInDate}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* 미디어 */}
        <div className="bg-gray-800/50 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Play className="w-5 h-5 text-red-400" />
            미디어
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                유튜브 영상 ID
              </label>
              <input
                type="text"
                name="youtubeVideoId"
                value={formData.youtubeVideoId}
                onChange={handleChange}
                placeholder="예: dQw4w9WgXcQ"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                유튜브 URL에서 v= 뒤의 코드만 입력
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                교육자료 PDF URL
              </label>
              <input
                type="url"
                name="pdfUrl"
                value={formData.pdfUrl}
                onChange={handleChange}
                placeholder="https://..."
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* 이미지 업로더 */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              매물 이미지
            </label>
            <ImageUploader
              images={images}
              onChange={setImages}
              maxImages={10}
            />
          </div>
        </div>

        {/* 상태 및 옵션 */}
        <div className="bg-gray-800/50 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-400" />
            상태 및 옵션
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                분양 상태
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
              >
                <option value="AVAILABLE">분양중</option>
                <option value="COMING_SOON">분양예정</option>
                <option value="SOLD_OUT">완판</option>
                <option value="SUSPENDED">중단</option>
              </select>
            </div>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="w-5 h-5 rounded bg-gray-700 border-gray-600 text-blue-500 focus:ring-blue-500"
                />
                <span className="text-gray-300">추천 매물</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="isPremium"
                  checked={formData.isPremium}
                  onChange={handleChange}
                  className="w-5 h-5 rounded bg-gray-700 border-gray-600 text-yellow-500 focus:ring-yellow-500"
                />
                <span className="text-gray-300">프리미엄</span>
              </label>
            </div>
          </div>
        </div>

        {/* 제출 버튼 */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600 transition-colors"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                등록 중...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                매물 등록
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
