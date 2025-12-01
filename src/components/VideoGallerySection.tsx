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
  const fallbackVideos = [
    {
      id: '1',
      youtubeId: 'dQw4w9WgXcQ',
      title: 'AI가 분석하는 2024 부동산 시장 전망',
      description: '최신 AI 기술을 활용하여 부동산 시장의 미래를 예측해보고, 투자자들이 알아야 할 핵심 포인트들을 설명합니다.',
      thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
      publishedAt: '2024-03-15',
      viewCount: 125000,
      duration: '15:42',
      category: '시장분석',
      tags: ['AI', '부동산', '투자']
    },
    {
      id: '2',
      youtubeId: 'dQw4w9WgXcQ',
      title: '블록체인 부동산 투자의 모든 것',
      description: '블록체인 기술이 어떻게 부동산 투자를 혁신하고 있는지, 그리고 우리의 특허 기술이 제공하는 차별화된 가치를 소개합니다.',
      thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
      publishedAt: '2024-03-10',
      viewCount: 87000,
      duration: '12:33',
      category: '블록체인',
      tags: ['블록체인', '투자', '기술']
    },
    {
      id: '3',
      youtubeId: 'dQw4w9WgXcQ',
      title: '스마트 계약으로 안전한 부동산 거래하기',
      description: '스마트 계약의 원리부터 실제 적용 사례까지, 안전하고 투명한 부동산 거래의 새로운 패러다임을 제시합니다.',
      thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
      publishedAt: '2024-03-05',
      viewCount: 152000,
      duration: '18:25',
      category: '스마트계약',
      tags: ['스마트계약', '거래', '안전']
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

              <p className="text-xl md:text-2xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
                최신 AI 기술과 부동산 전문 지식을 바탕으로 제작된 교육 영상들을 만나보세요.
                <br />
                복잡한 부동산 시장을 쉽고 명확하게 분석해드립니다.
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

              <GlassCard className="px-6 py-3" hover>
                <a
                  href="/videos"
                  className="text-blue-300 font-semibold hover:text-blue-200 transition-colors"
                >
                  전체보기 →
                </a>
              </GlassCard>
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
