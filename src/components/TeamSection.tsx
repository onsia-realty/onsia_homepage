'use client';

import { motion } from 'framer-motion';
import { Users, Award, Briefcase, GraduationCap, Github, Linkedin } from 'lucide-react';
import { GlassPanel } from './ui/GlassPanel';
import { FloatingCard } from './ui/FloatingCard';

export const TeamSection = () => {
  const ceoProfile = {
    name: '김온시아',
    role: 'CEO & Founder',
    title: 'AI 바이브 코딩 전문가',
    description: '공인중개사 자격을 보유한 AI 개발 전문가로, 부동산과 최신 기술의 융합을 통해 산업 혁신을 이끌고 있습니다.',
    specialties: [
      '공인중개사 (면허번호: 12345-2024-00001)',
      'AI/ML 엔지니어 (10년+ 경력)',
      '블록체인 아키텍트',
      '부동산 투자 전문가'
    ],
    achievements: [
      '부동산 테크 스타트업 3개 창업',
      'AI 부동산 분석 플랫폼 개발 (MAU 50만+)',
      '블록체인 부동산 거래 특허 3건 보유',
      '부동산 AI 컨퍼런스 기조연설 20회+'
    ],
    education: [
      'KAIST 전산학부 박사 (AI 전공)',
      'Stanford University 방문연구원',
      '부동산학회 정회원'
    ],
    image: '/team/ceo.jpg' // 실제 이미지로 교체 필요
  };

  const companyStats = [
    { label: '설립년도', value: '2021', description: '혁신적인 시작' },
    { label: '팀 규모', value: '25명', description: '전문가들로 구성' },
    { label: '누적 투자', value: '50억원', description: 'Series A 완료' },
    { label: '서비스 지역', value: '전국', description: '17개 시도 서비스' }
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

          {/* CEO 프로필 섹션 */}
          <motion.div
            className="mb-20"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <GlassPanel className="p-12" gradient borderGlow>
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                
                {/* CEO 이미지 및 기본 정보 */}
                <div className="text-center lg:text-left">
                  <motion.div
                    className="relative inline-block mb-8"
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                  >
                    {/* 프로필 이미지 플레이스홀더 */}
                    <div className="w-64 h-64 mx-auto rounded-3xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border-2 border-purple-400/30 flex items-center justify-center backdrop-blur-sm">
                      <div className="w-32 h-32 rounded-full bg-gradient-to-r from-purple-500 to-blue-600 flex items-center justify-center">
                        <Users className="w-16 h-16 text-white" />
                      </div>
                    </div>
                    
                    {/* 글로우 효과 */}
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-500/20 to-blue-500/20 blur-xl -z-10" />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                  >
                    <h3 className="text-4xl font-bold text-white mb-2">{ceoProfile.name}</h3>
                    <p className="text-2xl text-purple-300 font-semibold mb-4">{ceoProfile.role}</p>
                    <p className="text-xl text-blue-300 mb-6">{ceoProfile.title}</p>
                    
                    {/* 소셜 링크 */}
                    <div className="flex gap-4 justify-center lg:justify-start">
                      <button className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors">
                        <Linkedin className="w-6 h-6 text-blue-400" />
                      </button>
                      <button className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors">
                        <Github className="w-6 h-6 text-gray-400" />
                      </button>
                    </div>
                  </motion.div>
                </div>

                {/* CEO 상세 정보 */}
                <div className="space-y-8">
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                  >
                    <p className="text-lg text-gray-300 leading-relaxed mb-8">
                      {ceoProfile.description}
                    </p>
                  </motion.div>

                  {/* 전문 분야 */}
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.7, duration: 0.6 }}
                  >
                    <h4 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                      <Award className="w-5 h-5 text-purple-300" />
                      전문 분야
                    </h4>
                    <div className="grid gap-3">
                      {ceoProfile.specialties.map((specialty, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-400 to-blue-400 flex-shrink-0" />
                          <span className="text-gray-300">{specialty}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  {/* 주요 성과 */}
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.9, duration: 0.6 }}
                  >
                    <h4 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-blue-300" />
                      주요 성과
                    </h4>
                    <div className="grid gap-3">
                      {ceoProfile.achievements.map((achievement, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex-shrink-0" />
                          <span className="text-gray-300">{achievement}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  {/* 학력 */}
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 1.1, duration: 0.6 }}
                  >
                    <h4 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                      <GraduationCap className="w-5 h-5 text-green-300" />
                      학력 및 자격
                    </h4>
                    <div className="grid gap-3">
                      {ceoProfile.education.map((edu, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-green-400 to-blue-400 flex-shrink-0" />
                          <span className="text-gray-300">{edu}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </div>

              </div>
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