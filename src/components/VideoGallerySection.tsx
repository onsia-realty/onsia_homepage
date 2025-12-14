'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PlayCircle, Loader2 } from 'lucide-react';
import { VideoCard } from './ui/VideoCard';
import { GlassPanel } from './ui/GlassPanel';
import { GlassCard } from './ui/GlassCard';

interface Video {
  id: string;
  youtubeId: string;
  title: string;
  description: string | null;
  thumbnail: string;
  publishedAt: string;
  viewCount: number | null;
  duration: string | null;
  category: string | null;
  tags: string[];
}

export const VideoGallerySection = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 폴백 영상 데이터 (API 실패 시 또는 영상이 없을 때)
  // TODO: 실제 유튜브 영상 ID로 교체 필요 (현재는 플레이스홀더)
  const fallbackVideos = [
    {
      id: '1',
      youtubeId: 'placeholder_1',
      title: '2025 분양권 시장 완전 분석 - 손피거래 트렌드와 투자전략',
      description: '뜨거워진 분양권 시장의 현황을 분석합니다. 손피거래 성행 현상과 청약 경쟁률 급등 원인, 그리고 투자자가 주의해야 할 점을 설명합니다.',
      thumbnail: '/onsia__A_breathtaking_hyperrealistic_panoramic_view_of_a_luxu_5303edef-e7d5-46d0-987f-c2966382b286_0.png',
      publishedAt: '2025-11-28',
      viewCount: 185000,
      duration: '18:32',
      category: '분양권분석',
      tags: ['분양권', '손피거래', '투자전략']
    },
    {
      id: '2',
      youtubeId: 'placeholder_2',
      title: '서울 재개발 핫플레이스 - 노량진·영등포 고밀개발 분석',
      description: '한강벨트 부촌으로 떠오르는 노량진 재개발과 용적률 400% 영등포 고밀개발. 어디가 유망할지 전문가 시각으로 분석합니다.',
      thumbnail: '/onsia__An_aerial_view_architectural_rendering_of_a_modern_res_c75a69a4-6eda-4436-91b0-57b3db618551_3.png',
      publishedAt: '2025-11-25',
      viewCount: 142000,
      duration: '22:15',
      category: '재개발',
      tags: ['재개발', '노량진', '영등포', '서울']
    },
    {
      id: '3',
      youtubeId: 'placeholder_3',
      title: '지방 미분양 2만가구 시대 - 위기인가 기회인가?',
      description: '역대 최대 수준의 지방 미분양 사태. 투자자 관점에서 봐야 할 지역별 차별화 전략과 저가 매수 타이밍을 분석합니다.',
      thumbnail: '/onsia__Ultra_realistic_aerial_view_of_a_modern_apartment_comp_99d7adb1-a514-407d-92f4-d2d3198e319e_0.png',
      publishedAt: '2025-11-20',
      viewCount: 98000,
      duration: '15:48',
      category: '시장분석',
      tags: ['미분양', '지방', '투자기회']
    }
  ];

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch('/api/videos?limit=6');
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();

        if (data.videos && data.videos.length > 0) {
          setVideos(data.videos);
        } else {
          // DB에 영상이 없으면 폴백 사용
          setVideos(fallbackVideos);
        }
      } catch (err) {
        console.error('Video fetch error:', err);
        setError('영상을 불러오는 중 오류가 발생했습니다.');
        setVideos(fallbackVideos);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
  };

  const formatViewCount = (count: number | null) => {
    if (!count) return '-';
    if (count >= 10000) return `${(count / 10000).toFixed(1)}만`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}천`;
    return count.toString();
  };

  const displayVideos = videos.length > 0 ? videos.slice(0, 3) : fallbackVideos;

  return (
    <section className="relative py-32 overflow-hidden">
      {/* 배경 그라디언트 */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-900/10 to-transparent" />

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
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-green-600/20 to-blue-600/20 border border-green-400/30 mb-8">
                <PlayCircle className="w-6 h-6 text-green-300" />
                <span className="text-green-200 font-semibold">AI 영상 갤러리</span>
              </div>

              <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-white via-green-200 to-blue-300 bg-clip-text text-transparent mb-6">
                전문가의 인사이트
                <br />
                <span className="text-green-300">AI 부동산 영상</span>
              </h2>

              <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-4xl mx-auto">
                최신 AI 기술과 부동산 전문 지식을 바탕으로 제작된 교육 영상들을 만나보세요.<br className="hidden md:block" />복잡한 부동산 시장을 쉽고 명확하게 분석해드립니다.
              </p>
            </GlassPanel>
          </motion.div>


          {/* 추천 영상 그리드 */}
          <motion.div
            className="mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center justify-between mb-12">
              <h3 className="text-3xl font-bold text-white">
                추천 영상
                <span className="text-green-300 ml-3">Featured Videos</span>
              </h3>

{/* TODO: /videos 페이지 완성 후 활성화
              <GlassCard className="px-6 py-3" hover>
                <a
                  href="/videos"
                  className="text-blue-300 font-semibold hover:text-blue-200 transition-colors"
                >
                  전체보기 →
                </a>
              </GlassCard>
*/}
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 text-green-400 animate-spin" />
                <span className="ml-3 text-gray-400">영상을 불러오는 중...</span>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {displayVideos.map((video, index) => (
                  <motion.div
                    key={video.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2, duration: 0.6 }}
                  >
                    <VideoCard
                      title={video.title}
                      description={video.description || ''}
                      thumbnail={video.thumbnail}
                      youtubeId={video.youtubeId}
                      publishedAt={formatDate(video.publishedAt)}
                      viewCount={formatViewCount(video.viewCount)}
                      duration={video.duration || ''}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* 채널 구독 CTA */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <GlassPanel className="max-w-3xl mx-auto p-10" floating borderGlow>
              <h3 className="text-3xl font-bold text-white mb-6">
                더 많은 전문 콘텐츠를 만나보세요
              </h3>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                유튜브 채널을 구독하시고 부동산과 AI에 대한
                최신 정보와 전문가 인사이트를 받아보세요.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group glass-hover px-8 py-4 rounded-full bg-gradient-to-r from-red-600/80 to-red-500/80 border border-red-400/30 font-semibold text-white flex items-center justify-center gap-3 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/30"
                >
                  <PlayCircle className="w-6 h-6" />
                  <span>유튜브 채널 구독</span>
                </a>

                <button className="glass-hover px-8 py-4 rounded-full border border-white/20 font-semibold text-white hover:bg-white/10 transition-all duration-300">
                  알림 설정하기
                </button>
              </div>
            </GlassPanel>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
