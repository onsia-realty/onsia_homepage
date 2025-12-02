'use client';

import { motion } from 'framer-motion';
import { Play, Calendar, Eye } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { cn } from '@/lib/utils';

interface VideoCardProps {
  title: string;
  description?: string;
  thumbnail: string;
  youtubeId: string;
  publishedAt: string;
  viewCount?: string;
  duration?: string;
  className?: string;
  onPlay?: (youtubeId: string) => void;
}

export const VideoCard = ({
  title,
  description,
  thumbnail,
  youtubeId,
  publishedAt,
  viewCount,
  duration,
  className,
  onPlay
}: VideoCardProps) => {
  const handlePlay = () => {
    if (onPlay) {
      onPlay(youtubeId);
    } else {
      window.open(`https://www.youtube.com/watch?v=${youtubeId}`, '_blank');
    }
  };

  return (
    <GlassCard 
      hover 
      className={cn('overflow-hidden cursor-pointer group', className)}
      onClick={handlePlay}
    >
      {/* 썸네일 컨테이너 */}
      <div className="relative aspect-video mb-4 rounded-xl overflow-hidden">
        {/* 썸네일 이미지 */}
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-full object-cover scale-150 transition-transform duration-300 group-hover:scale-[1.6]"
        />
        
        {/* 오버레이 그라디언트 */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* 재생 버튼 */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          whileHover={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center group-hover:bg-white/30 transition-all duration-300">
            <Play className="w-8 h-8 text-white fill-white ml-1" />
          </div>
        </motion.div>
        
        {/* 영상 길이 */}
        {duration && (
          <div className="absolute bottom-3 right-3 px-3 py-1 rounded-lg bg-black/80 backdrop-blur-sm text-white text-sm font-medium">
            {duration}
          </div>
        )}
      </div>

      {/* 컨텐츠 */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-blue-300 transition-colors">
          {title}
        </h3>
        
        {description && (
          <p className="text-gray-300 text-sm mb-4 line-clamp-3 leading-relaxed">
            {description}
          </p>
        )}

        {/* 메타 정보 */}
        <div className="flex items-center justify-between text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{publishedAt}</span>
          </div>
          
          {viewCount && (
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              <span>{viewCount}</span>
            </div>
          )}
        </div>
      </div>

      {/* 글로우 효과 */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 to-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </GlassCard>
  );
};