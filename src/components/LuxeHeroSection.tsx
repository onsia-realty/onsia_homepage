'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Award, ChevronDown } from 'lucide-react';
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
                      분양권 매물 보기
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Link>

                  <Link
                    href="/subscriptions"
                    className="px-8 py-3 backdrop-blur-xl bg-white/10 border-2 border-white/30 text-white rounded-full font-semibold text-base hover:bg-white/20 hover:border-white/50 transition-all duration-300 text-center"
                  >
                    청약홈 매물 보기
                  </Link>
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
                        전국 분양권, 한눈에 비교하고<br />
                        똑똑하게 투자하세요.
                      </p>
                    </div>

                    {/* 특징 리스트 */}
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0 text-lg">
                          📍
                        </div>
                        <div>
                          <h4 className="text-white font-semibold mb-1">전국 분양권 매물 한곳에</h4>
                          <p className="text-white/60 text-sm">수도권부터 지방까지, 검증된 분양권 매물<br />실시간 가격·잔여세대·프리미엄 정보 제공</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0 text-lg">
                          📚
                        </div>
                        <div>
                          <h4 className="text-white font-semibold mb-1">투자 판단을 돕는 자료</h4>
                          <p className="text-white/60 text-sm">단지별 홍보자료, 입지분석, 교육영상<br />복잡한 분양권, 쉽게 이해하고 결정하세요</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center flex-shrink-0 text-lg">
                          🏠
                        </div>
                        <div>
                          <h4 className="text-white font-semibold mb-1">청약부터 전매까지 원스톱 <span className="text-xs text-cyan-400">(Coming Soon)</span></h4>
                          <p className="text-white/60 text-sm">청약홈 연동으로 청약 일정·경쟁률 확인<br />청약 → 당첨 → 전매까지 한 플랫폼에서</p>
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

    </section>
  );
};