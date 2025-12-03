'use client';

import { motion } from 'framer-motion';
import { Award, Lock } from 'lucide-react';
import { GlassPanel } from './ui/GlassPanel';

export const BlockchainSection = () => {

  return (
    <section className="relative py-32 overflow-hidden">
      {/* 배경 그라디언트 */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-900/10 to-transparent" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          
          {/* 통합 섹션 */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <GlassPanel className="max-w-5xl mx-auto p-12" borderGlow>
              {/* 상단: 배지 + 아이콘 */}
              <div className="flex items-center justify-center gap-4 mb-8">
                <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-blue-600/20 to-green-600/20 border border-blue-400/30">
                  <Award className="w-6 h-6 text-blue-300" />
                  <span className="text-blue-200 font-semibold">특허 기술</span>
                </div>
                <div className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 flex items-center justify-center glow shadow-2xl">
                  <Lock className="w-7 h-7 text-white" />
                </div>
              </div>

              {/* 타이틀 */}
              <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
                <span className="bg-gradient-to-r from-white via-blue-200 to-green-300 bg-clip-text text-transparent">블록체인 부동산</span>
                {' '}
                <span className="text-green-300">거래 혁신</span>
              </h2>

              <h3 className="text-2xl md:text-3xl font-bold text-center text-blue-300 mb-8">
                혁신적인 기술로 만드는 안전한 부동산 거래
              </h3>

              <p className="text-lg text-gray-300 leading-relaxed text-center max-w-3xl mx-auto mb-10">
                특허받은 블록체인 기술로 부동산 거래의 새로운 패러다임을 제시합니다.
                안전하고 투명하며 효율적인 차세대 부동산 플랫폼을 경험하세요.
              </p>

              {/* 기술 리스트 - 가로 배치 */}
              <div className="grid md:grid-cols-3 gap-6">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="w-3 h-3 rounded-full bg-blue-400 mt-2 flex-shrink-0" />
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-1">스마트 컨트랙트</h4>
                    <p className="text-gray-400 text-sm">자동화된 계약 실행으로 투명성과 효율성 보장</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="w-3 h-3 rounded-full bg-green-400 mt-2 flex-shrink-0" />
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-1">분산 원장</h4>
                    <p className="text-gray-400 text-sm">거래 기록 분산 저장으로 데이터 무결성 확보</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="w-3 h-3 rounded-full bg-purple-400 mt-2 flex-shrink-0" />
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-1">토큰화</h4>
                    <p className="text-gray-400 text-sm">부동산 자산 토큰 분할로 소액 투자 가능</p>
                  </div>
                </div>
              </div>
            </GlassPanel>
          </motion.div>

        </div>
      </div>
    </section>
  );
};