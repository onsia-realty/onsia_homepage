'use client';

import { motion } from 'framer-motion';
import { Award, Zap, Target, Users } from 'lucide-react';
import { GlassPanel } from './ui/GlassPanel';
import { FloatingCard } from './ui/FloatingCard';

export const AboutHeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* 배경 그라디언트 */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-blue-900/20" />
      
      <div className="container mx-auto px-6 py-20 relative z-10">
        <div className="max-w-6xl mx-auto">
          
          {/* 메인 타이틀 */}
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <GlassPanel className="max-w-5xl mx-auto p-12" floating borderGlow>
              {/* 배지 */}
              <motion.div
                className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-400/30 mb-8"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <Award className="w-6 h-6 text-purple-300" />
                <span className="text-purple-200 font-semibold">About ONSIA</span>
              </motion.div>

              {/* 메인 타이틀 */}
              <motion.h1
                className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-300 bg-clip-text text-transparent mb-8 leading-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                혁신적인 기술로
                <br />
                <span className="text-purple-300">부동산 미래를 그리다</span>
              </motion.h1>

              {/* 서브 타이틀 */}
              <motion.p
                className="text-xl md:text-2xl text-gray-300 leading-relaxed max-w-4xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
              >
                온시아는 AI와 블록체인 기술을 융합하여 부동산 산업의 새로운 패러다임을 제시하는
                <br />
                <strong className="text-blue-300">스마트 테크 기업</strong>입니다.
              </motion.p>
            </GlassPanel>
          </motion.div>

          {/* 핵심 가치 카드들 */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FloatingCard
              delay={0.2}
              direction="up"
              intensity="subtle"
              className="p-8 text-center"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9, duration: 0.6 }}
              >
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center glow shadow-2xl">
                  <Award className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">혁신</h3>
                <p className="text-gray-300 leading-relaxed">
                  특허받은 블록체인 기술로 부동산 거래의 새로운 기준을 제시합니다
                </p>
              </motion.div>
            </FloatingCard>

            <FloatingCard
              delay={0.4}
              direction="down"
              intensity="subtle"
              className="p-8 text-center"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.1, duration: 0.6 }}
              >
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center glow shadow-2xl">
                  <Zap className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">효율성</h3>
                <p className="text-gray-300 leading-relaxed">
                  AI 기술을 활용한 자동화로 거래 시간과 비용을 획기적으로 줄입니다
                </p>
              </motion.div>
            </FloatingCard>

            <FloatingCard
              delay={0.6}
              direction="up"
              intensity="subtle"
              className="p-8 text-center"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.3, duration: 0.6 }}
              >
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center glow shadow-2xl">
                  <Target className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">정확성</h3>
                <p className="text-gray-300 leading-relaxed">
                  정밀한 데이터 분석과 AI 예측으로 신뢰할 수 있는 정보를 제공합니다
                </p>
              </motion.div>
            </FloatingCard>

            <FloatingCard
              delay={0.8}
              direction="down"
              intensity="subtle"
              className="p-8 text-center"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.5, duration: 0.6 }}
              >
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center glow shadow-2xl">
                  <Users className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">신뢰</h3>
                <p className="text-gray-300 leading-relaxed">
                  투명한 블록체인 기록으로 모든 거래에 대한 신뢰를 보장합니다
                </p>
              </motion.div>
            </FloatingCard>
          </div>

        </div>
      </div>
    </section>
  );
};