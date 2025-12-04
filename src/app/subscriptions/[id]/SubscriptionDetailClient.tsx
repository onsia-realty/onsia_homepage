'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Calendar, Building2, MapPin, Users, Phone, Globe,
  ArrowLeft, ExternalLink, Clock, CheckCircle, XCircle,
  Home, Briefcase, FileText
} from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { GlassCard } from '@/components/ui/GlassCard';
import { ParticlesBackground } from '@/components/ParticlesBackground';
import type { CheongyakProperty } from '@/lib/cheongyakApi';

interface SubscriptionWithStatus extends CheongyakProperty {
  status: string;
  statusText: string;
  dDay: number | null;
}

interface Props {
  subscription: SubscriptionWithStatus;
}

export default function SubscriptionDetailClient({ subscription }: Props) {
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
  };

  const formatMoveInDate = (ymStr: string | null) => {
    if (!ymStr || ymStr.length !== 6) return '-';
    const year = ymStr.substring(0, 4);
    const month = ymStr.substring(4, 6);
    return `${year}년 ${parseInt(month)}월`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'upcoming':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'closed':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'upcoming':
        return <Clock className="w-5 h-5 text-yellow-400" />;
      case 'closed':
        return <XCircle className="w-5 h-5 text-gray-400" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  // 청약홈 URL 생성
  const getSubscriptionUrl = (): string => {
    if (subscription.PBLANC_URL && subscription.PBLANC_URL.startsWith('http')) {
      return subscription.PBLANC_URL;
    }
    return `https://www.applyhome.co.kr/ai/aia/selectAPTLttotPblancDetail.do?houseManageNo=${subscription.HOUSE_MANAGE_NO}&pblancNo=${subscription.PBLANC_NO}`;
  };

  return (
    <>
      <Navigation />
      <main className="relative min-h-screen">
        <ParticlesBackground />

        {/* 상단 네비게이션 */}
        <section className="relative pt-20 pb-4">
          <div className="container mx-auto px-6">
            <Link
              href="/subscriptions"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              청약 목록으로 돌아가기
            </Link>
          </div>
        </section>

        {/* 헤더 섹션 */}
        <section className="relative pb-8">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <GlassCard className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                  <div>
                    {/* 상태 배지 */}
                    <div className="flex items-center gap-3 mb-4">
                      <span className={`px-4 py-2 rounded-full text-sm font-semibold border flex items-center gap-2 ${getStatusColor(subscription.status)}`}>
                        {getStatusIcon(subscription.status)}
                        {subscription.statusText}
                      </span>
                      {subscription.dDay !== null && (
                        <span className={`text-lg font-bold ${subscription.status === 'open' ? 'text-green-400' : 'text-yellow-400'}`}>
                          D{subscription.dDay > 0 ? `-${subscription.dDay}` : subscription.dDay === 0 ? '-Day' : `+${Math.abs(subscription.dDay)}`}
                        </span>
                      )}
                      <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-sm rounded-full">
                        {subscription.HOUSE_SECD_NM}
                      </span>
                      <span className="px-3 py-1 bg-purple-500/20 text-purple-400 text-sm rounded-full">
                        {subscription.HOUSE_DTL_SECD_NM}
                      </span>
                    </div>

                    {/* 단지명 */}
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
                      {subscription.HOUSE_NM}
                    </h1>

                    {/* 위치 */}
                    <div className="flex items-center gap-2 text-gray-300 mb-2">
                      <MapPin className="w-5 h-5 text-cyan-400" />
                      <span>{subscription.HSSPLY_ADRES}</span>
                    </div>

                    {/* 지역 */}
                    <div className="flex items-center gap-2 text-gray-400">
                      <Building2 className="w-4 h-4" />
                      <span>{subscription.SUBSCRPT_AREA_CODE_NM}</span>
                    </div>
                  </div>

                  {/* 청약홈 바로가기 버튼 */}
                  <div className="flex flex-col gap-3">
                    <a
                      href={getSubscriptionUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl hover:from-cyan-600 hover:to-blue-600 transition-all font-semibold flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/30"
                    >
                      <ExternalLink className="w-5 h-5" />
                      청약홈에서 신청하기
                    </a>
                    {subscription.HMPG_ADRES && (
                      <a
                        href={subscription.HMPG_ADRES}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-3 bg-white/10 border border-white/20 text-white rounded-xl hover:bg-white/20 transition-all font-semibold flex items-center justify-center gap-2"
                      >
                        <Globe className="w-5 h-5" />
                        분양 홈페이지
                      </a>
                    )}
                  </div>
                </div>

                {/* 핵심 정보 그리드 */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-white/10">
                  <div className="text-center p-4 bg-white/5 rounded-xl">
                    <Users className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
                    <p className="text-gray-400 text-sm mb-1">총 공급</p>
                    <p className="text-white text-xl font-bold">{subscription.TOT_SUPLY_HSHLDCO?.toLocaleString() || '-'}세대</p>
                  </div>
                  <div className="text-center p-4 bg-white/5 rounded-xl">
                    <Calendar className="w-6 h-6 text-green-400 mx-auto mb-2" />
                    <p className="text-gray-400 text-sm mb-1">청약 접수</p>
                    <p className="text-white text-lg font-bold">{formatDate(subscription.RCEPT_BGNDE)}</p>
                  </div>
                  <div className="text-center p-4 bg-white/5 rounded-xl">
                    <FileText className="w-6 h-6 text-orange-400 mx-auto mb-2" />
                    <p className="text-gray-400 text-sm mb-1">당첨 발표</p>
                    <p className="text-white text-lg font-bold">{formatDate(subscription.PRZWNER_PRESNATN_DE)}</p>
                  </div>
                  <div className="text-center p-4 bg-white/5 rounded-xl">
                    <Home className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                    <p className="text-gray-400 text-sm mb-1">입주 예정</p>
                    <p className="text-white text-lg font-bold">{formatMoveInDate(subscription.MVN_PREARNGE_YM)}</p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </section>

        {/* 상세 일정 */}
        <section className="relative pb-8">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <GlassCard className="p-6 md:p-8">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-cyan-400" />
                  청약 일정
                </h2>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* 공고 및 접수 일정 */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-300 border-b border-white/10 pb-2">접수 일정</h3>

                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-400">모집공고일</span>
                      <span className="text-white font-medium">{formatDate(subscription.RCRIT_PBLANC_DE)}</span>
                    </div>

                    {subscription.SPSPLY_RCEPT_BGNDE && (
                      <div className="flex justify-between items-center py-2 bg-purple-500/10 px-3 rounded-lg">
                        <span className="text-purple-400">특별공급</span>
                        <span className="text-white font-medium">
                          {formatDate(subscription.SPSPLY_RCEPT_BGNDE)} ~ {formatDate(subscription.SPSPLY_RCEPT_ENDDE)}
                        </span>
                      </div>
                    )}

                    {subscription.GNRL_RNK1_CRSPAREA_RCPTDE && (
                      <div className="flex justify-between items-center py-2 bg-green-500/10 px-3 rounded-lg">
                        <span className="text-green-400">1순위 (해당지역)</span>
                        <span className="text-white font-medium">{formatDate(subscription.GNRL_RNK1_CRSPAREA_RCPTDE)}</span>
                      </div>
                    )}

                    {subscription.GNRL_RNK2_CRSPAREA_RCPTDE && (
                      <div className="flex justify-between items-center py-2 bg-cyan-500/10 px-3 rounded-lg">
                        <span className="text-cyan-400">2순위</span>
                        <span className="text-white font-medium">{formatDate(subscription.GNRL_RNK2_CRSPAREA_RCPTDE)}</span>
                      </div>
                    )}

                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-400">청약접수 기간</span>
                      <span className="text-white font-medium">
                        {formatDate(subscription.RCEPT_BGNDE)} ~ {formatDate(subscription.RCEPT_ENDDE)}
                      </span>
                    </div>
                  </div>

                  {/* 발표 및 계약 일정 */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-300 border-b border-white/10 pb-2">발표 및 계약</h3>

                    <div className="flex justify-between items-center py-2 bg-orange-500/10 px-3 rounded-lg">
                      <span className="text-orange-400">당첨자 발표일</span>
                      <span className="text-white font-medium">{formatDate(subscription.PRZWNER_PRESNATN_DE)}</span>
                    </div>

                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-400">계약 기간</span>
                      <span className="text-white font-medium">
                        {formatDate(subscription.CNTRCT_CNCLS_BGNDE)} ~ {formatDate(subscription.CNTRCT_CNCLS_ENDDE)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-400">입주 예정</span>
                      <span className="text-white font-medium">{formatMoveInDate(subscription.MVN_PREARNGE_YM)}</span>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </section>

        {/* 사업자 정보 */}
        <section className="relative pb-20">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <GlassCard className="p-6 md:p-8">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-cyan-400" />
                  사업자 정보
                </h2>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-white/10">
                      <span className="text-gray-400">사업주체</span>
                      <span className="text-white font-medium">{subscription.BSNS_MBY_NM || '-'}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-white/10">
                      <span className="text-gray-400">시공사</span>
                      <span className="text-blue-400 font-medium">{subscription.CNSTRCT_ENTRPS_NM || '-'}</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {subscription.MDHS_TELNO && (
                      <div className="flex justify-between items-center py-2 border-b border-white/10">
                        <span className="text-gray-400 flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          문의전화
                        </span>
                        <a href={`tel:${subscription.MDHS_TELNO}`} className="text-cyan-400 font-medium hover:underline">
                          {subscription.MDHS_TELNO}
                        </a>
                      </div>
                    )}
                    {subscription.HMPG_ADRES && (
                      <div className="flex justify-between items-center py-2 border-b border-white/10">
                        <span className="text-gray-400 flex items-center gap-2">
                          <Globe className="w-4 h-4" />
                          홈페이지
                        </span>
                        <a
                          href={subscription.HMPG_ADRES}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-cyan-400 font-medium hover:underline truncate max-w-[200px]"
                        >
                          {subscription.HMPG_ADRES.replace(/^https?:\/\//, '')}
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* CTA 버튼 */}
                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href={getSubscriptionUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl hover:from-cyan-600 hover:to-blue-600 transition-all font-semibold flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/30 text-lg"
                  >
                    <ExternalLink className="w-5 h-5" />
                    청약홈에서 상세보기
                  </a>
                  <Link
                    href="/subscriptions"
                    className="px-8 py-4 bg-white/10 border border-white/20 text-white rounded-xl hover:bg-white/20 transition-all font-semibold flex items-center justify-center gap-2 text-lg"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    목록으로 돌아가기
                  </Link>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </section>
      </main>
    </>
  );
}
