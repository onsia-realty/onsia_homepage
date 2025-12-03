'use client';

import { motion } from 'framer-motion';
import { Users, Award, Briefcase } from 'lucide-react';
import { GlassPanel } from './ui/GlassPanel';
import { FloatingCard } from './ui/FloatingCard';

export const TeamSection = () => {
  const companyStats = [
    { label: '설립년도', value: '2020', description: '혁신적인 시작' },
    { label: '팀 규모', value: '25명', description: '전문가들로 구성' },
    { label: '블록체인 특허', value: '7년차', description: '업계 최초 기술력' },
    { label: '부동산 앱 출시', value: '2026', description: '상반기 예정' }
  ];

  const teamValues = [
    {
      icon: Award,
      title: '전문성',
      description: '각 분야의 최고 전문가들이 모여 시너지를 창출합니다',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: Users,
      title: '협업',
      description: '다양한 배경의 인재들이 함께 혁신을 만들어갑니다',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: Briefcase,
      title: '실행력',
      description: '아이디어를 현실로 만드는 강력한 실행력을 보유했습니다',
      color: 'from-green-500 to-green-600'
    }
  ];

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
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-400/30 mb-8">
                <Users className="w-6 h-6 text-blue-300" />
                <span className="text-blue-200 font-semibold">Team & Leadership</span>
              </div>

              <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-300 bg-clip-text text-transparent mb-6">
                혁신을 이끄는
                <br />
                <span className="text-blue-300">전문가 팀</span>
              </h2>

              <p className="text-xl md:text-2xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
                부동산과 기술 분야의 최고 전문가들이 모여 미래를 만들어가고 있습니다.
              </p>
            </GlassPanel>
          </motion.div>

          {/* 회사 현황 */}
          <motion.div
            className="grid md:grid-cols-4 gap-8 mb-20"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {companyStats.map((stat, index) => (
              <FloatingCard
                key={index}
                delay={index * 0.2}
                intensity="subtle"
                className="text-center p-8"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                >
                  <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent mb-3">
                    {stat.value}
                  </div>
                  <h4 className="text-xl text-white font-semibold mb-2">{stat.label}</h4>
                  <p className="text-gray-400 text-sm">{stat.description}</p>
                </motion.div>
              </FloatingCard>
            ))}
          </motion.div>

          {/* 팀 가치 */}
          <motion.div
            className="grid md:grid-cols-3 gap-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {teamValues.map((value, index) => (
              <FloatingCard
                key={index}
                delay={index * 0.3}
                direction={index % 2 === 0 ? 'up' : 'down'}
                intensity="normal"
                className="p-8 text-center"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2, duration: 0.6 }}
                >
                  <div className={`w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r ${value.color} flex items-center justify-center glow shadow-2xl`}>
                    <value.icon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">{value.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{value.description}</p>
                </motion.div>
              </FloatingCard>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  );
};