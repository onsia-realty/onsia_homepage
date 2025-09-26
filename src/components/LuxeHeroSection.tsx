'use client';

import { motion } from 'framer-motion';
import { ArrowRight, TrendingUp, Shield, Users, Award, ChevronDown } from 'lucide-react';
import { GlassCard } from './ui/GlassCard';
import Link from 'next/link';
import Image from 'next/image';

export const LuxeHeroSection = () => {
  return (
    <section className="relative min-h-screen">
      {/* 풀스크린 배경 이미지 */}
      <div className="absolute inset-0">
        {/* 대형 배경 이미지 */}
        <div className="absolute inset-0">
          <Image
            src="/onsia__A_breathtaking_hyperrealistic_panoramic_view_of_a_luxu_5303edef-e7d5-46d0-987f-c2966382b286_3.png"
            alt="Luxury Real Estate Background"
            fill
            className="object-cover"
            priority
            quality={100}
          />
        </div>

        {/* 그라데이션 오버레이 */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />

        {/* 패턴 오버레이 */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }} />
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="relative z-10 min-h-screen flex flex-col justify-between">
        {/* 상단 여백 (네비게이션 공간) */}
        <div className="h-24" />

        {/* 중앙 메인 콘텐츠 */}
        <div className="flex-1 flex items-center">
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* 좌측: 텍스트 콘텐츠 */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1 }}
              >
                {/* 프리미엄 배지 */}
                <motion.div
                  className="inline-block mb-6"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                >
                  <div className="px-6 py-3 backdrop-blur-xl bg-white/10 border border-white/20 rounded-full">
                    <span className="text-white/90 font-medium text-sm tracking-wide">
                      PREMIUM INVESTMENT PLATFORM
                    </span>
                  </div>
                </motion.div>

                {/* 메인 타이틀 */}
                <motion.h1
                  className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                >
                  <span className="block text-white mb-2">부동산 분양권 투자의</span>
                  <span className="block bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
                    새로운 기준
                  </span>
                </motion.h1>

                {/* 서브 텍스트 */}
                <motion.p
                  className="text-base md:text-lg text-white/80 mb-8 leading-relaxed font-light"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                >
                  서울·경기 핵심 분양권 매물을<br />
                  블록체인 보안과 AI 분석으로 검증,<br />
                  가장 유리한 계약 조건의<br />
                  프리미엄 분양권 투자 솔루션
                </motion.p>

                {/* CTA 버튼 그룹 */}
                <motion.div
                  className="flex flex-col sm:flex-row gap-3 mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                >
                  <Link
                    href="/properties"
                    className="group relative px-8 py-3 bg-white text-black rounded-full font-bold text-base overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-white/20"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-3">
                      매물 상담 신청
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Link>

                  <button className="px-8 py-3 backdrop-blur-xl bg-white/10 border-2 border-white/30 text-white rounded-full font-semibold text-base hover:bg-white/20 hover:border-white/50 transition-all duration-300">
                    투자 상담 신청
                  </button>
                </motion.div>

                {/* 미니 통계 */}
                <motion.div
                  className="grid grid-cols-3 gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1, duration: 0.6 }}
                >
                  <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-3">
                    <div className="text-2xl font-bold text-white mb-1">2,847</div>
                    <div className="text-white/60 text-sm">등록 매물</div>
                  </div>
                  <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-3">
                    <div className="text-2xl font-bold text-green-400 mb-1">1,236</div>
                    <div className="text-white/60 text-sm">상담 진행</div>
                  </div>
                  <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-3">
                    <div className="text-2xl font-bold text-blue-400 mb-1">92.8%</div>
                    <div className="text-white/60 text-sm">계약 성사율</div>
                  </div>
                </motion.div>
              </motion.div>

              {/* 우측: 글래스 카드 정보 박스 */}
              <motion.div
                className="relative"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.4 }}
              >
                <GlassCard className="backdrop-blur-2xl bg-white/10 border-white/20 p-8" hover glow>
                  <div className="space-y-6">
                    {/* 헤드라인 */}
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">
                        왜 ONSIA인가?
                      </h3>
                      <p className="text-white/70 leading-relaxed">
                        20년간 축적된 부동산 전문 지식과<br />
                        최첨단 기술의 결합으로<br />
                        안전하고 경쟁력 있는 분양권 투자 기회를 제공합니다.
                      </p>
                    </div>

                    {/* 특징 리스트 */}
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                          <TrendingUp className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="text-white font-semibold mb-1">AI 수익률 예측</h4>
                          <p className="text-white/60 text-sm">국토부 실거래가 데이터를 기반으로<br />시장 타이밍을 정밀 분석해<br />최적의 투자 수익률을 예측</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                          <Shield className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="text-white font-semibold mb-1">블록체인 보안</h4>
                          <p className="text-white/60 text-sm">모든 상담 및 거래 내역을<br />블록체인에 기록하여<br />완벽한 투명성과 안정성 보장</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center flex-shrink-0">
                          <Users className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="text-white font-semibold mb-1">전문가 컨설팅</h4>
                          <p className="text-white/60 text-sm">분양권 전문 공인중개사가<br />1:1 맞춤 전략 상담 제공</p>
                        </div>
                      </div>
                    </div>

                    {/* 수상 내역 */}
                    <div className="pt-4 border-t border-white/10">
                      <div className="flex items-center gap-2 mb-3">
                        <Award className="w-4 h-4 text-yellow-400" />
                        <span className="text-white/80 text-xs font-medium">2024 대한민국 부동산 대상 수상</span>
                      </div>
                      <div className="flex gap-3">
                        <div className="px-3 py-2 bg-white/5 rounded-lg">
                          <span className="text-white/60 text-xs">고객만족도</span>
                          <span className="text-white font-bold text-xs ml-2">98.5%</span>
                        </div>
                        <div className="px-3 py-2 bg-white/5 rounded-lg">
                          <span className="text-white/60 text-xs">재투자율</span>
                          <span className="text-white font-bold text-xs ml-2">87.3%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </GlassCard>

                {/* 플로팅 요소들 */}
                <motion.div
                  className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-3xl opacity-50"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0.3, 0.5],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                <motion.div
                  className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full blur-3xl opacity-40"
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.4, 0.2, 0.4],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </motion.div>
            </div>
          </div>
        </div>

        {/* 하단 스크롤 인디케이터 */}
        <motion.div
          className="pb-10 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="inline-block"
          >
            <ChevronDown className="w-8 h-8 text-white/50" />
          </motion.div>
        </motion.div>
      </div>

      {/* 럭셔리 통계 섹션 (Hero 하단) */}
      <div className="relative z-10 bg-black/50 backdrop-blur-xl border-t border-white/10">
        <div className="container mx-auto px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: '총 거래액', value: '1,847', unit: '억원', trend: '+23%' },
              { label: '성공 투자', value: '2,364', unit: '건', trend: '+18%' },
              { label: '평균 수익률', value: '19.2', unit: '%', trend: '+5.2%' },
              { label: '활성 투자자', value: '8,742', unit: '명', trend: '+142' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <div className="text-2xl md:text-3xl font-bold text-white mb-1">
                  {stat.value}
                  <span className="text-base md:text-lg text-white/60">{stat.unit}</span>
                </div>
                <div className="text-white/60 text-xs mb-1">{stat.label}</div>
                <div className="text-green-400 text-xs font-medium">{stat.trend}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};