'use client';

import { motion } from 'framer-motion';
import { Shield, FileText, Calendar, CheckCircle, ArrowRight, Lightbulb } from 'lucide-react';
import { GlassPanel } from './ui/GlassPanel';
import { GlassCard } from './ui/GlassCard';
import { FloatingCard } from './ui/FloatingCard';

export const PatentShowcaseSection = () => {
  // 특허 데이터 (실제로는 DB에서 가져올 예정)
  const patents = [
    {
      title: '블록체인 기반 부동산 거래 시스템',
      number: 'KR10-2024-0001234',
      date: '2024년 1월 15일',
      description: '스마트 계약을 활용한 안전하고 투명한 부동산 거래 플랫폼으로, 중개인 없이도 신뢰할 수 있는 거래를 가능하게 합니다.',
      features: [
        '자동화된 스마트 계약 실행',
        '실시간 거래 상태 추적',
        '탈중앙화된 소유권 증명',
        '수수료 최소화'
      ],
      category: '블록체인',
      status: '등록완료'
    },
    {
      title: 'AI 부동산 가격 예측 알고리즘',
      number: 'KR10-2024-0002345',
      date: '2024년 2월 20일',
      description: '머신러닝과 딥러닝 기술을 활용하여 부동산 시세를 정확하게 예측하는 혁신적인 AI 시스템입니다.',
      features: [
        '실시간 시장 데이터 분석',
        '95% 이상 예측 정확도',
        '지역별 맞춤 분석',
        '트렌드 예측 기능'
      ],
      category: 'AI 기술',
      status: '등록완료'
    },
    {
      title: '분산 원장 기반 소유권 관리 시스템',
      number: 'KR10-2024-0003456',
      date: '2024년 3월 10일',
      description: '블록체인 기술을 활용하여 부동산 소유권을 안전하게 추적하고 관리하는 차세대 시스템입니다.',
      features: [
        '불변의 소유권 기록',
        '즉시 검증 가능한 이력',
        '국제 표준 호환',
        '사기 방지 시스템'
      ],
      category: '블록체인',
      status: '등록완료'
    }
  ];

  const achievements = [
    { label: '특허 출원', value: '15+', description: '현재 진행중인 특허 출원' },
    { label: '등록 특허', value: '3건', description: '정식 등록 완료된 특허' },
    { label: '국제 출원', value: '2건', description: 'PCT 국제 특허 출원' },
    { label: 'R&D 투자', value: '80%', description: '전체 예산 대비 연구개발 투자' }
  ];

  return (
    <section className="relative py-32 overflow-hidden">
      {/* 배경 그라디언트 */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/10 to-transparent" />
      
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
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-400/30 mb-8">
                <Lightbulb className="w-6 h-6 text-purple-300" />
                <span className="text-purple-200 font-semibold">특허 기술 포트폴리오</span>
              </div>

              <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-300 bg-clip-text text-transparent mb-6">
                혁신의 증거
                <br />
                <span className="text-purple-300">특허 기술들</span>
              </h2>

              <p className="text-xl md:text-2xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
                우리의 기술력을 인정받은 특허들로 부동산 산업의 디지털 전환을 이끌어갑니다.
                <br />
                각 특허는 실제 서비스에 적용되어 고객에게 가치를 제공하고 있습니다.
              </p>
            </GlassPanel>
          </motion.div>

          {/* 성과 지표 */}
          <motion.div
            className="grid md:grid-cols-4 gap-8 mb-20"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {achievements.map((achievement, index) => (
              <GlassCard
                key={index}
                className="text-center p-8"
                hover
                glow
                size="lg"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                >
                  <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent mb-3">
                    {achievement.value}
                  </div>
                  <h4 className="text-xl text-white font-semibold mb-2">{achievement.label}</h4>
                  <p className="text-gray-400 text-sm">{achievement.description}</p>
                </motion.div>
              </GlassCard>
            ))}
          </motion.div>

          {/* 특허 상세 카드들 */}
          <div className="space-y-12">
            {patents.map((patent, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.8 }}
              >
                <GlassPanel className="p-10" gradient borderGlow>
                  <div className={`grid lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''}`}>
                    
                    {/* 텍스트 콘텐츠 */}
                    <div className={index % 2 === 1 ? 'lg:col-start-2' : ''}>
                      <div className="flex items-center gap-3 mb-4">
                        <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                          patent.category === '블록체인' 
                            ? 'bg-purple-600/20 text-purple-300 border border-purple-400/30'
                            : 'bg-blue-600/20 text-blue-300 border border-blue-400/30'
                        }`}>
                          {patent.category}
                        </span>
                        <span className="px-4 py-2 rounded-full bg-green-600/20 text-green-300 border border-green-400/30 text-sm font-semibold flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          {patent.status}
                        </span>
                      </div>

                      <h3 className="text-3xl font-bold text-white mb-4">{patent.title}</h3>
                      
                      <div className="flex items-center gap-4 mb-6 text-gray-400">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          <span className="text-sm">{patent.number}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span className="text-sm">{patent.date}</span>
                        </div>
                      </div>

                      <p className="text-gray-300 mb-8 leading-relaxed text-lg">
                        {patent.description}
                      </p>

                      <div className="space-y-4">
                        <h4 className="text-xl font-semibold text-white flex items-center gap-2">
                          <Shield className="w-5 h-5 text-blue-300" />
                          핵심 특징
                        </h4>
                        <div className="grid gap-3">
                          {patent.features.map((feature, featureIndex) => (
                            <motion.div
                              key={featureIndex}
                              className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10"
                              initial={{ opacity: 0, x: -20 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              viewport={{ once: true }}
                              transition={{ delay: featureIndex * 0.1, duration: 0.5 }}
                            >
                              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-400 to-blue-400 flex-shrink-0" />
                              <span className="text-gray-300">{feature}</span>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      <button className="mt-8 group flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-400/30 text-purple-300 hover:bg-purple-600/30 transition-all duration-300">
                        <span className="font-semibold">상세 기술 문서</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>

                    {/* 시각적 요소 */}
                    <div className={`relative ${index % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
                      <FloatingCard
                        delay={0.5}
                        intensity="normal"
                        direction={index % 2 === 0 ? 'up' : 'down'}
                        className="p-8 relative overflow-hidden"
                      >
                        {/* 특허 번호 시각화 */}
                        <div className="text-center">
                          <div className={`w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-r ${
                            patent.category === '블록체인' 
                              ? 'from-purple-500 to-purple-600'
                              : 'from-blue-500 to-blue-600'
                          } flex items-center justify-center glow shadow-2xl`}>
                            <FileText className="w-16 h-16 text-white" />
                          </div>
                          <div className="text-2xl font-bold text-white mb-2">특허 등록</div>
                          <div className="text-purple-300 font-mono text-lg">{patent.number}</div>
                          <div className="text-gray-400 text-sm mt-2">{patent.date}</div>
                        </div>

                        {/* 장식적 요소들 */}
                        <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-purple-500/20 backdrop-blur-sm border border-purple-400/30" />
                        <div className="absolute bottom-4 left-4 w-6 h-6 rounded-full bg-blue-500/20 backdrop-blur-sm border border-blue-400/30" />
                      </FloatingCard>
                    </div>

                  </div>
                </GlassPanel>
              </motion.div>
            ))}
          </div>

          {/* CTA 섹션 */}
          <motion.div
            className="text-center mt-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <GlassPanel className="max-w-3xl mx-auto p-10" floating borderGlow>
              <h3 className="text-3xl font-bold text-white mb-6">
                더 많은 혁신이 준비되고 있습니다
              </h3>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                현재 15개 이상의 특허가 출원 중이며, 지속적인 연구개발을 통해
                <br />
                부동산 산업의 미래를 만들어가고 있습니다.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="group glass-hover px-8 py-4 rounded-full bg-gradient-to-r from-purple-600/80 to-blue-600/80 border border-purple-400/30 font-semibold text-white flex items-center justify-center gap-3 transition-all duration-300">
                  <span>기술 제휴 문의</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                
                <button className="glass-hover px-8 py-4 rounded-full border border-white/20 font-semibold text-white hover:bg-white/10 transition-all duration-300">
                  특허 포트폴리오 다운로드
                </button>
              </div>
            </GlassPanel>
          </motion.div>

        </div>
      </div>
    </section>
  );
};