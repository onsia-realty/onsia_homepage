'use client';

import { motion } from 'framer-motion';
import { Shield, FileText, CheckCircle, ArrowRight, Lightbulb } from 'lucide-react';
import { GlassPanel } from './ui/GlassPanel';
import { GlassCard } from './ui/GlassCard';
import { FloatingCard } from './ui/FloatingCard';
import Image from 'next/image';

export const PatentShowcaseSection = () => {
  // 핵심 기술 데이터
  const coreTechnologies = [
    {
      title: '블록체인 기반 부동산 거래 시스템',
      category: '등록 특허',
      status: '등록완료',
      description: '허위매물과 허위고객을 원천 차단하는 블록체인 기술. 전자서명을 기반으로 신뢰할 수 있는 거래 환경을 구축합니다.',
      features: [
        '블록체인 등록 및 거래로 허위매물 차단',
        '전자서명 기반 스마트 계약',
        '에스크로 & 신탁 안전거래',
        '계약 → 등기 → 신고 원스톱 처리'
      ],
      gradient: 'from-purple-500 to-blue-500',
      image: '/onsia_realty_Futuristic_blockchain_network_visualization_for__ab4c0799-8d47-4243-98e8-b0c39badd0e8_3.png'
    },
    {
      title: '분양권 전문 투자 플랫폼',
      category: '핵심 서비스',
      status: '운영중',
      description: '전국 분양권 매물을 한곳에서 비교하고 투자할 수 있는 전문 플랫폼. 수도권부터 지방까지, 검증된 분양권 정보를 제공합니다.',
      features: [
        '실시간 프리미엄 가격 정보',
        '단지별 상세 분석 자료',
        '투자 수익률 시뮬레이션',
        '전문 상담사 1:1 매칭'
      ],
      gradient: 'from-cyan-500 to-blue-500',
      image: '/onsia_realty_Modern_apartment_complex_with_digital_investment_1312c465-5791-4b86-918e-38384c25cd17_0.png'
    },
    {
      title: '청약홈 연동 정보 서비스',
      category: '공신력 데이터',
      status: '연동완료',
      description: '국토교통부 청약홈의 공식 데이터를 연동하여 가장 신뢰할 수 있는 분양 정보를 제공합니다. 국민이 가장 신뢰하는 청약 정보 소스입니다.',
      features: [
        '청약 일정 및 경쟁률 실시간 연동',
        '당첨자 발표 및 계약 일정 안내',
        '분양가 및 평형별 상세 정보',
        '입지 분석 및 주변 시세 비교'
      ],
      gradient: 'from-green-500 to-emerald-500',
      image: '/Gemini_Generated_Image_cqblo7cqblo7cqbl.png'
    }
  ];

  const achievements = [
    { label: '등록 특허', value: '1건', description: '블록체인 부동산 거래 시스템' },
    { label: '특허 출원', value: '3건', description: '현재 심사 진행중' },
    { label: '국제 출원', value: '준비중', description: 'PCT 국제 특허 출원 예정' },
    { label: '청약홈 연동', value: '100%', description: '공신력 있는 공식 데이터' }
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
                <span className="text-purple-200 font-semibold">핵심 기술 & 서비스</span>
              </div>

              <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-300 bg-clip-text text-transparent mb-6">
                기술로 만드는
                <br />
                <span className="text-cyan-300">신뢰할 수 있는 분양권 거래</span>
              </h2>

              <p className="text-xl md:text-2xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
                블록체인 특허 기술과 청약홈 공식 데이터를 기반으로
                <br />
                대한민국에서 가장 투명한 분양권 투자 플랫폼을 만들어갑니다.
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

          {/* 핵심 기술 카드들 */}
          <div className="space-y-12">
            {coreTechnologies.map((tech, index) => (
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
                          tech.category === '등록 특허'
                            ? 'bg-purple-600/20 text-purple-300 border border-purple-400/30'
                            : tech.category === '핵심 서비스'
                            ? 'bg-cyan-600/20 text-cyan-300 border border-cyan-400/30'
                            : 'bg-green-600/20 text-green-300 border border-green-400/30'
                        }`}>
                          {tech.category}
                        </span>
                        <span className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 ${
                          tech.status === '등록완료'
                            ? 'bg-purple-600/20 text-purple-300 border border-purple-400/30'
                            : tech.status === '운영중'
                            ? 'bg-cyan-600/20 text-cyan-300 border border-cyan-400/30'
                            : 'bg-green-600/20 text-green-300 border border-green-400/30'
                        }`}>
                          <CheckCircle className="w-4 h-4" />
                          {tech.status}
                        </span>
                      </div>

                      <h3 className="text-3xl font-bold text-white mb-4">{tech.title}</h3>

                      <p className="text-gray-300 mb-8 leading-relaxed text-lg">
                        {tech.description}
                      </p>

                      <div className="space-y-4">
                        <h4 className="text-xl font-semibold text-white flex items-center gap-2">
                          <Shield className="w-5 h-5 text-blue-300" />
                          핵심 특징
                        </h4>
                        <div className="grid gap-3">
                          {tech.features.map((feature, featureIndex) => (
                            <motion.div
                              key={featureIndex}
                              className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10"
                              initial={{ opacity: 0, x: -20 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              viewport={{ once: true }}
                              transition={{ delay: featureIndex * 0.1, duration: 0.5 }}
                            >
                              <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${tech.gradient} flex-shrink-0`} />
                              <span className="text-gray-300">{feature}</span>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* 시각적 요소 - 이미지 */}
                    <div className={`relative ${index % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
                      <FloatingCard
                        delay={0.5}
                        intensity="normal"
                        direction={index % 2 === 0 ? 'up' : 'down'}
                        className="relative overflow-hidden"
                      >
                        <div className="relative aspect-square w-full">
                          <Image
                            src={tech.image}
                            alt={tech.title}
                            fill
                            className="object-cover rounded-2xl"
                          />
                          {/* 그라데이션 오버레이 */}
                          <div className={`absolute inset-0 bg-gradient-to-t ${tech.gradient} opacity-20 rounded-2xl`} />
                        </div>
                      </FloatingCard>
                    </div>

                  </div>
                </GlassPanel>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};