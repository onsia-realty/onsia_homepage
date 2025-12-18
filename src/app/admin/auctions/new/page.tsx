'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ChevronLeft, Save, Plus, Trash2, Gavel, MapPin, DollarSign,
  Calendar, Shield, Users, Image as ImageIcon
} from 'lucide-react';

interface Register {
  registerType: string;
  registerNo: string;
  receiptDate: string;
  purpose: string;
  rightHolder: string;
  claimAmount: string;
  isReference: boolean;
  willExpire: boolean;
  note: string;
}

interface Tenant {
  tenantName: string;
  hasPriority: boolean;
  occupiedPart: string;
  moveInDate: string;
  fixedDate: string;
  hasBidRequest: boolean;
  deposit: string;
  monthlyRent: string;
  note: string;
}

interface AuctionImage {
  imageType: string;
  url: string;
  alt: string;
}

const courtCodes = [
  { code: '1101', name: '서울중앙지방법원' },
  { code: '1102', name: '서울동부지방법원' },
  { code: '1103', name: '서울서부지방법원' },
  { code: '1104', name: '서울남부지방법원' },
  { code: '1105', name: '서울북부지방법원' },
  { code: '2110', name: '대구지방법원' },
  { code: '2210', name: '부산지방법원' },
  { code: '2310', name: '울산지방법원' },
  { code: '2410', name: '창원지방법원' },
  { code: '3110', name: '광주지방법원' },
  { code: '3210', name: '전주지방법원' },
  { code: '3310', name: '제주지방법원' },
  { code: '4110', name: '대전지방법원' },
  { code: '4210', name: '청주지방법원' },
  { code: '5110', name: '수원지방법원' },
  { code: '5210', name: '춘천지방법원' },
  { code: '5310', name: '인천지방법원' },
];

const itemTypes = [
  { value: 'APARTMENT', label: '아파트' },
  { value: 'VILLA', label: '빌라' },
  { value: 'OFFICETEL', label: '오피스텔' },
  { value: 'HOUSE', label: '단독주택' },
  { value: 'COMMERCIAL', label: '상가' },
  { value: 'LAND', label: '토지' },
  { value: 'FACTORY', label: '공장' },
  { value: 'BUILDING', label: '건물' },
  { value: 'OTHER', label: '기타' },
];

const statuses = [
  { value: 'SCHEDULED', label: '매각예정' },
  { value: 'BIDDING', label: '입찰중' },
  { value: 'SUCCESSFUL', label: '낙찰' },
  { value: 'FAILED', label: '유찰' },
  { value: 'WITHDRAWN', label: '취하' },
  { value: 'CANCELED', label: '취소' },
];

const cities = [
  '서울', '경기', '인천', '부산', '대구', '광주', '대전', '울산', '세종',
  '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주'
];

export default function NewAuctionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // 기본 정보
  const [caseNumber, setCaseNumber] = useState('');
  const [courtCode, setCourtCode] = useState('');
  const [address, setAddress] = useState('');
  const [addressDetail, setAddressDetail] = useState('');
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  const [itemType, setItemType] = useState('APARTMENT');
  const [landArea, setLandArea] = useState('');
  const [buildingArea, setBuildingArea] = useState('');
  const [floor, setFloor] = useState('');

  // 가격 정보
  const [appraisalPrice, setAppraisalPrice] = useState('');
  const [minimumPrice, setMinimumPrice] = useState('');
  const [minimumRate, setMinimumRate] = useState('');
  const [deposit, setDeposit] = useState('');

  // 일정
  const [saleDate, setSaleDate] = useState('');
  const [saleTime, setSaleTime] = useState('');
  const [bidCount, setBidCount] = useState('1');
  const [bidEndDate, setBidEndDate] = useState('');

  // 권리분석
  const [referenceDate, setReferenceDate] = useState('');
  const [hasRisk, setHasRisk] = useState(false);
  const [riskNote, setRiskNote] = useState('');

  // 당사자
  const [owner, setOwner] = useState('');
  const [debtor, setDebtor] = useState('');
  const [creditor, setCreditor] = useState('');

  // 상태
  const [status, setStatus] = useState('SCHEDULED');
  const [featured, setFeatured] = useState(false);

  // 등기 내역
  const [registers, setRegisters] = useState<Register[]>([]);

  // 임차인
  const [tenants, setTenants] = useState<Tenant[]>([]);

  // 이미지
  const [images, setImages] = useState<AuctionImage[]>([]);

  const addRegister = () => {
    setRegisters([
      ...registers,
      {
        registerType: '을',
        registerNo: '',
        receiptDate: '',
        purpose: '',
        rightHolder: '',
        claimAmount: '',
        isReference: false,
        willExpire: true,
        note: '',
      },
    ]);
  };

  const removeRegister = (index: number) => {
    setRegisters(registers.filter((_, i) => i !== index));
  };

  const updateRegister = (index: number, field: keyof Register, value: string | boolean) => {
    const updated = [...registers];
    (updated[index] as Record<string, unknown>)[field] = value;
    setRegisters(updated);
  };

  const addTenant = () => {
    setTenants([
      ...tenants,
      {
        tenantName: '',
        hasPriority: false,
        occupiedPart: '',
        moveInDate: '',
        fixedDate: '',
        hasBidRequest: false,
        deposit: '',
        monthlyRent: '',
        note: '',
      },
    ]);
  };

  const removeTenant = (index: number) => {
    setTenants(tenants.filter((_, i) => i !== index));
  };

  const updateTenant = (index: number, field: keyof Tenant, value: string | boolean) => {
    const updated = [...tenants];
    (updated[index] as Record<string, unknown>)[field] = value;
    setTenants(updated);
  };

  const addImage = () => {
    setImages([
      ...images,
      { imageType: 'PHOTO', url: '', alt: '' },
    ]);
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const updateImage = (index: number, field: keyof AuctionImage, value: string) => {
    const updated = [...images];
    updated[index][field] = value;
    setImages(updated);
  };

  // 최저가율 자동 계산
  const calculateMinimumRate = () => {
    if (appraisalPrice && minimumPrice) {
      const rate = Math.round((parseInt(minimumPrice) / parseInt(appraisalPrice)) * 100);
      setMinimumRate(rate.toString());
    }
  };

  // 보증금 자동 계산 (10%)
  const calculateDeposit = () => {
    if (minimumPrice) {
      const dep = Math.round(parseInt(minimumPrice) * 0.1);
      setDeposit(dep.toString());
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const court = courtCodes.find(c => c.code === courtCode);

      const data = {
        caseNumber,
        courtCode,
        courtName: court?.name || '',
        address,
        addressDetail,
        city,
        district,
        itemType,
        landArea: landArea || null,
        buildingArea: buildingArea || null,
        floor: floor || null,
        appraisalPrice,
        minimumPrice,
        minimumRate: minimumRate || null,
        deposit: deposit || null,
        saleDate: saleDate || null,
        saleTime: saleTime || null,
        bidCount: parseInt(bidCount) || 1,
        bidEndDate: bidEndDate || null,
        referenceDate: referenceDate || null,
        hasRisk,
        riskNote: riskNote || null,
        owner: owner || null,
        debtor: debtor || null,
        creditor: creditor || null,
        status,
        featured,
        registers: registers.filter(r => r.purpose),
        tenants: tenants.filter(t => t.deposit),
        images: images.filter(img => img.url),
      };

      const response = await fetch('/api/auctions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        router.push('/admin/auctions');
      } else {
        const error = await response.json();
        alert(error.error || '등록에 실패했습니다.');
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert('등록 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* 헤더 */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/admin/auctions"
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">새 경매 물건 등록</h1>
          <p className="text-gray-600">경매 물건 정보를 입력하세요.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 기본 정보 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Gavel className="w-5 h-5 text-blue-600" />
            기본 정보
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                사건번호 *
              </label>
              <input
                type="text"
                value={caseNumber}
                onChange={(e) => setCaseNumber(e.target.value)}
                placeholder="2025타경1234"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                담당법원 *
              </label>
              <select
                value={courtCode}
                onChange={(e) => setCourtCode(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">선택하세요</option>
                {courtCodes.map((court) => (
                  <option key={court.code} value={court.code}>
                    {court.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                주소 *
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="서울특별시 강남구 테헤란로 123"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                시/도 *
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">선택하세요</option>
                {cities.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                구/군 *
              </label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                placeholder="강남구"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                물건종류 *
              </label>
              <select
                value={itemType}
                onChange={(e) => setItemType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {itemTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                층수
              </label>
              <input
                type="text"
                value={floor}
                onChange={(e) => setFloor(e.target.value)}
                placeholder="5층"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                건물면적 (m&sup2;)
              </label>
              <input
                type="number"
                step="0.01"
                value={buildingArea}
                onChange={(e) => setBuildingArea(e.target.value)}
                placeholder="84.52"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                대지면적 (m&sup2;)
              </label>
              <input
                type="number"
                step="0.01"
                value={landArea}
                onChange={(e) => setLandArea(e.target.value)}
                placeholder="52.30"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* 가격 정보 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            가격 정보
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                감정가 (원) *
              </label>
              <input
                type="number"
                value={appraisalPrice}
                onChange={(e) => setAppraisalPrice(e.target.value)}
                onBlur={calculateMinimumRate}
                placeholder="500000000"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                최저가 (원) *
              </label>
              <input
                type="number"
                value={minimumPrice}
                onChange={(e) => setMinimumPrice(e.target.value)}
                onBlur={() => { calculateMinimumRate(); calculateDeposit(); }}
                placeholder="400000000"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                최저가율 (%)
              </label>
              <input
                type="number"
                value={minimumRate}
                onChange={(e) => setMinimumRate(e.target.value)}
                placeholder="80"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                입찰보증금 (원)
              </label>
              <input
                type="number"
                value={deposit}
                onChange={(e) => setDeposit(e.target.value)}
                placeholder="40000000"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* 일정 정보 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-600" />
            일정 정보
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                매각기일
              </label>
              <input
                type="date"
                value={saleDate}
                onChange={(e) => setSaleDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                매각시간
              </label>
              <input
                type="time"
                value={saleTime}
                onChange={(e) => setSaleTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                입찰회차
              </label>
              <input
                type="number"
                min="1"
                value={bidCount}
                onChange={(e) => setBidCount(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                배당요구종기
              </label>
              <input
                type="date"
                value={bidEndDate}
                onChange={(e) => setBidEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                상태
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {statuses.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="featured"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="featured" className="text-sm text-gray-700">
                추천 물건으로 표시
              </label>
            </div>
          </div>
        </div>

        {/* 권리분석 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-red-600" />
            권리분석
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                말소기준일
              </label>
              <input
                type="date"
                value={referenceDate}
                onChange={(e) => setReferenceDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="hasRisk"
                  checked={hasRisk}
                  onChange={(e) => setHasRisk(e.target.checked)}
                  className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                />
                <label htmlFor="hasRisk" className="text-sm text-gray-700">
                  위험 물건
                </label>
              </div>
            </div>
            {hasRisk && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  위험 사유
                </label>
                <input
                  type="text"
                  value={riskNote}
                  onChange={(e) => setRiskNote(e.target.value)}
                  placeholder="인수해야 할 권리가 있습니다."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}
          </div>

          {/* 등기 내역 */}
          <div className="border-t pt-4 mt-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-700">등기 내역</h3>
              <button
                type="button"
                onClick={addRegister}
                className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                추가
              </button>
            </div>

            {registers.length === 0 ? (
              <p className="text-sm text-gray-500 py-4 text-center">
                등록된 등기 내역이 없습니다.
              </p>
            ) : (
              <div className="space-y-4">
                {registers.map((reg, index) => (
                  <div key={index} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-sm font-medium text-gray-700">
                        등기 #{index + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeRegister(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <select
                        value={reg.registerType}
                        onChange={(e) => updateRegister(index, 'registerType', e.target.value)}
                        className="px-2 py-1.5 text-sm border border-gray-300 rounded"
                      >
                        <option value="갑">갑구</option>
                        <option value="을">을구</option>
                      </select>
                      <input
                        type="text"
                        placeholder="순위번호"
                        value={reg.registerNo}
                        onChange={(e) => updateRegister(index, 'registerNo', e.target.value)}
                        className="px-2 py-1.5 text-sm border border-gray-300 rounded"
                      />
                      <input
                        type="date"
                        value={reg.receiptDate}
                        onChange={(e) => updateRegister(index, 'receiptDate', e.target.value)}
                        className="px-2 py-1.5 text-sm border border-gray-300 rounded"
                      />
                      <input
                        type="text"
                        placeholder="등기목적"
                        value={reg.purpose}
                        onChange={(e) => updateRegister(index, 'purpose', e.target.value)}
                        className="px-2 py-1.5 text-sm border border-gray-300 rounded"
                      />
                      <input
                        type="text"
                        placeholder="권리자"
                        value={reg.rightHolder}
                        onChange={(e) => updateRegister(index, 'rightHolder', e.target.value)}
                        className="px-2 py-1.5 text-sm border border-gray-300 rounded"
                      />
                      <input
                        type="number"
                        placeholder="채권금액"
                        value={reg.claimAmount}
                        onChange={(e) => updateRegister(index, 'claimAmount', e.target.value)}
                        className="px-2 py-1.5 text-sm border border-gray-300 rounded"
                      />
                      <label className="flex items-center gap-1 text-sm">
                        <input
                          type="checkbox"
                          checked={reg.isReference}
                          onChange={(e) => updateRegister(index, 'isReference', e.target.checked)}
                        />
                        말소기준
                      </label>
                      <label className="flex items-center gap-1 text-sm">
                        <input
                          type="checkbox"
                          checked={reg.willExpire}
                          onChange={(e) => updateRegister(index, 'willExpire', e.target.checked)}
                        />
                        소멸
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 임차인 현황 */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-orange-600" />
              임차인 현황
            </h2>
            <button
              type="button"
              onClick={addTenant}
              className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              추가
            </button>
          </div>

          {tenants.length === 0 ? (
            <p className="text-sm text-gray-500 py-4 text-center">
              등록된 임차인이 없습니다.
            </p>
          ) : (
            <div className="space-y-4">
              {tenants.map((tenant, index) => (
                <div key={index} className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-sm font-medium text-gray-700">
                      임차인 #{index + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeTenant(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <input
                      type="text"
                      placeholder="임차인명"
                      value={tenant.tenantName}
                      onChange={(e) => updateTenant(index, 'tenantName', e.target.value)}
                      className="px-2 py-1.5 text-sm border border-gray-300 rounded"
                    />
                    <input
                      type="text"
                      placeholder="점유부분"
                      value={tenant.occupiedPart}
                      onChange={(e) => updateTenant(index, 'occupiedPart', e.target.value)}
                      className="px-2 py-1.5 text-sm border border-gray-300 rounded"
                    />
                    <input
                      type="date"
                      placeholder="전입일"
                      value={tenant.moveInDate}
                      onChange={(e) => updateTenant(index, 'moveInDate', e.target.value)}
                      className="px-2 py-1.5 text-sm border border-gray-300 rounded"
                    />
                    <input
                      type="date"
                      placeholder="확정일자"
                      value={tenant.fixedDate}
                      onChange={(e) => updateTenant(index, 'fixedDate', e.target.value)}
                      className="px-2 py-1.5 text-sm border border-gray-300 rounded"
                    />
                    <input
                      type="number"
                      placeholder="보증금"
                      value={tenant.deposit}
                      onChange={(e) => updateTenant(index, 'deposit', e.target.value)}
                      className="px-2 py-1.5 text-sm border border-gray-300 rounded"
                    />
                    <input
                      type="number"
                      placeholder="월차임"
                      value={tenant.monthlyRent}
                      onChange={(e) => updateTenant(index, 'monthlyRent', e.target.value)}
                      className="px-2 py-1.5 text-sm border border-gray-300 rounded"
                    />
                    <label className="flex items-center gap-1 text-sm">
                      <input
                        type="checkbox"
                        checked={tenant.hasPriority}
                        onChange={(e) => updateTenant(index, 'hasPriority', e.target.checked)}
                      />
                      대항력
                    </label>
                    <label className="flex items-center gap-1 text-sm">
                      <input
                        type="checkbox"
                        checked={tenant.hasBidRequest}
                        onChange={(e) => updateTenant(index, 'hasBidRequest', e.target.checked)}
                      />
                      배당요구
                    </label>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 이미지 */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-cyan-600" />
              이미지
            </h2>
            <button
              type="button"
              onClick={addImage}
              className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              추가
            </button>
          </div>

          {images.length === 0 ? (
            <p className="text-sm text-gray-500 py-4 text-center">
              등록된 이미지가 없습니다.
            </p>
          ) : (
            <div className="space-y-3">
              {images.map((img, index) => (
                <div key={index} className="flex items-center gap-3">
                  <select
                    value={img.imageType}
                    onChange={(e) => updateImage(index, 'imageType', e.target.value)}
                    className="px-2 py-1.5 text-sm border border-gray-300 rounded"
                  >
                    <option value="PHOTO">물건사진</option>
                    <option value="SURVEY">현황조사서</option>
                    <option value="APPRAISAL">감정평가서</option>
                    <option value="REGISTER">등기부</option>
                    <option value="OTHER">기타</option>
                  </select>
                  <input
                    type="url"
                    placeholder="이미지 URL"
                    value={img.url}
                    onChange={(e) => updateImage(index, 'url', e.target.value)}
                    className="flex-1 px-2 py-1.5 text-sm border border-gray-300 rounded"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 제출 버튼 */}
        <div className="flex justify-end gap-4">
          <Link
            href="/admin/auctions"
            className="px-6 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            취소
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <Save className="w-5 h-5" />
            {loading ? '저장 중...' : '저장'}
          </button>
        </div>
      </form>
    </div>
  );
}
