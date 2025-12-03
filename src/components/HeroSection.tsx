'use client';

import { motion } from 'framer-motion';
import { Brain, Building, Sparkles, ArrowRight, TrendingUp, Shield, Calculator } from 'lucide-react';
import { GlassPanel } from './ui/GlassPanel';
import { GlassCard } from './ui/GlassCard';
import Image from 'next/image';
import Link from 'next/link';

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* 배경 그라디언트 오버레이 */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-green-900/20" />

      {/* 메인 컨텐츠 */}
      <div className="container mx-auto px-6 py-20 relative z-10">
        <div className="max-w-7xl mx-auto">

          {/* 메인 히어로 컨텐츠 - 이미지와 텍스트 레이아웃 */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">

            {/* 왼쪽: 텍스트 컨텐츠 */}
            <motion.div
              className="text-left"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* 상단 배지 */}
              <motion.div
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-blue-500/20 border border-blue-400/30 mb-8 backdrop-blur-sm"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <Sparkles className="w-5 h-5 text-blue-300" />
                <span className="text-blue-200 font-semibold text-sm">분양권 투자 전문 플랫폼</span>
              </motion.div>

              {/* 메인 타이틀 */}
              <motion.h1
                className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent block">분양권 계약의 새로운 기준</span>
                <span className="bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent block">블록체인으로 더 안전하게</span>
              </motion.h1>

              {/* 서브 타이틀 */}
              <motion.p
                className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
              >
전국 분양권 매물과 투자 분석 정보를 한곳에서 확인하세요.
                <br />
                블록체인 기술과 AI 분석으로 더 스마트한 분양권 투자를 시작하세요
              </motion.p>

              {/* CTA 버튼들 */}
              <motion.div
                className="flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.6 }}
              >
                <Link
                  href="/properties"
                  className="group glass-hover px-8 py-4 rounded-full bg-gradient-to-r from-blue-600/80 to-cyan-600/80 border border-blue-400/30 font-semibold text-white flex items-center gap-3 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/30"
                >
                  <span>분양권 매물 보기</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>

                <button className="glass-hover px-8 py-4 rounded-full border border-white/20 font-semibold text-white hover:bg-white/10 transition-all duration-300">
                  수익률 계산기
                </button>
              </motion.div>
            </motion.div>

            {/* 오른쪽: 메인 이미지 */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
            >
              <div className="relative">
                {/* 이미지 글로우 효과 */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-cyan-500/30 blur-3xl" />

                {/* 메인 이미지 */}
                <GlassPanel className="relative p-0 overflow-hidden" floating borderGlow>
                  <Image
                    src="/onsia__A_surreal_conceptual_art_image_of_a_human_hand_holding_841f2115-1407-4c82-aefd-1356b87169a1_1.png"
                    alt="블록체인 부동산 - 손 위의 디지털 하우스"
                    width={600}
                    height={400}
                    className="w-full h-auto object-cover rounded-lg"
                    priority
                  />

                  {/* 이미지 위 오버레이 정보 */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                      <span className="text-sm text-gray-200">블록체인 네트워크 실시간 연결</span>
                    </div>
                  </div>
                </GlassPanel>

                {/* 플로팅 요소들 */}
                <motion.div
                  className="absolute -top-4 -right-4 bg-blue-500/20 backdrop-blur-sm rounded-full p-3 border border-blue-400/30"
                  animate={{
                    y: [0, -10, 0],
                    rotate: [0, 5, 0]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Building className="w-6 h-6 text-blue-300" />
                </motion.div>

                <motion.div
                  className="absolute -bottom-4 -left-4 bg-cyan-500/20 backdrop-blur-sm rounded-full p-3 border border-cyan-400/30"
                  animate={{
                    y: [0, 10, 0],
                    rotate: [0, -5, 0]
                  }}
                  transition={{
                    duration: 3.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Brain className="w-6 h-6 text-cyan-300" />
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* 특징 카드들 */}
          <div className="grid md:grid-cols-3 gap-8">
            <GlassCard hover glow className="text-center p-8" size="lg">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.1, duration: 0.6 }}
              >
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">수익률 분석</h3>
                <p className="text-gray-300 leading-relaxed">
                  AI 기반 시장 분석으로
                  정확한 분양권 투자 수익률을 예측합니다
                </p>
              </motion.div>
            </GlassCard>

            <GlassCard hover glow className="text-center p-8" size="lg">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.3, duration: 0.6 }}
              >
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">안전한 거래</h3>
                <p className="text-gray-300 leading-relaxed">
                  블록체인 기반 투명한 거래로
                  분양권 투자의 신뢰성을 보장합니다
                </p>
              </motion.div>
            </GlassCard>

            <GlassCard hover glow className="text-center p-8" size="lg">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.5, duration: 0.6 }}
              >
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/30">
                  <Calculator className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">투자 계산기</h3>
                <p className="text-gray-300 leading-relaxed">
                  계약금, 중도금, 잔금까지
                  분양권 투자 수익을 정확히 계산합니다
                </p>
              </motion.div>
            </GlassCard>
          </div>

        </div>
      </div>
    </section>
  );
};