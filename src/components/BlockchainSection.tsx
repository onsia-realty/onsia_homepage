'use client';

import { motion } from 'framer-motion';
import { Award, Lock } from 'lucide-react';
import { GlassPanel } from './ui/GlassPanel';
import { GlassCard } from './ui/GlassCard';

export const BlockchainSection = () => {

  return (
    <section className="relative py-32 overflow-hidden">
      {/* 배경 그라디언트 */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-900/10 to-transparent" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          
          {/* 섹션 헤더 */}
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <GlassPanel className="max-w-4xl mx-auto p-12" borderGlow>
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-blue-600/20 to-green-600/20 border border-blue-400/30 mb-8">
                <Award className="w-6 h-6 text-blue-300" />
                <span className="text-blue-200 font-semibold">특허 기술</span>
              </div>

              <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-white via-blue-200 to-green-300 bg-clip-text text-transparent mb-6">
                블록체인 부동산
                <br />
                <span className="text-green-300">거래 혁신</span>
              </h2>

              <p className="text-xl md:text-2xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
                특허받은 블록체인 기술로 부동산 거래의 새로운 패러다임을 제시합니다.
                <br />
                안전하고 투명하며 효율적인 차세대 부동산 플랫폼을 경험하세요.
              </p>
            </GlassPanel>
          </motion.div>


          {/* 기술 상세 설명 */}
          <motion.div
            className="grid lg:grid-cols-2 gap-12 items-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            {/* 왼쪽: 설명 */}
            <GlassPanel className="p-10" gradient borderGlow>
              <h3 className="text-3xl font-bold text-white mb-8">
                혁신적인 기술로 만드는
                <br />
                <span className="text-blue-300">안전한 부동산 거래</span>
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-3 h-3 rounded-full bg-blue-400 mt-2 flex-shrink-0" />
                  <div>
                    <h4 className="text-xl font-semibold text-white mb-2">스마트 컨트랙트</h4>
                    <p className="text-gray-300">자동화된 계약 실행으로 중개 과정의 투명성과 효율성을 보장합니다.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-3 h-3 rounded-full bg-green-400 mt-2 flex-shrink-0" />
                  <div>
                    <h4 className="text-xl font-semibold text-white mb-2">분산 원장</h4>
                    <p className="text-gray-300">모든 거래 기록을 분산 저장하여 데이터 무결성과 보안을 확보합니다.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-3 h-3 rounded-full bg-purple-400 mt-2 flex-shrink-0" />
                  <div>
                    <h4 className="text-xl font-semibold text-white mb-2">토큰화</h4>
                    <p className="text-gray-300">부동산 자산을 토큰으로 분할하여 소액 투자와 유동성을 제공합니다.</p>
                  </div>
                </div>
              </div>
            </GlassPanel>

            {/* 오른쪽: 시각적 요소 */}
            <div className="relative">
              <motion.div
                className="relative"
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                {/* 메인 카드 */}
                <GlassCard className="p-8 relative z-10" hover glow size="lg">
                  <div className="text-center">
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 flex items-center justify-center glow shadow-2xl">
                      <Lock className="w-12 h-12 text-white" />
                    </div>
                    <h4 className="text-2xl font-bold text-white mb-4">블록체인 보안</h4>
                    <p className="text-gray-300">최첨단 암호화 기술로 보호되는 안전한 거래 환경</p>
                  </div>
                </GlassCard>

                {/* 플로팅 엘리먼트들 */}
                <motion.div
                  className="absolute -top-8 -right-8 w-16 h-16 rounded-full bg-blue-500/20 backdrop-blur-sm border border-blue-400/30"
                  animate={{ 
                    y: [-10, 10, -10],
                    rotate: [0, 360]
                  }}
                  transition={{ 
                    y: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
                    rotate: { duration: 20, repeat: Infinity, ease: 'linear' }
                  }}
                />
                
                <motion.div
                  className="absolute -bottom-6 -left-6 w-12 h-12 rounded-full bg-green-500/20 backdrop-blur-sm border border-green-400/30"
                  animate={{ 
                    y: [10, -10, 10],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity, 
                    ease: 'easeInOut',
                    delay: 1
                  }}
                />
              </motion.div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};