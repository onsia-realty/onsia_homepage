'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface GlassPanelProps extends Omit<HTMLMotionProps<'div'>, 'initial' | 'animate' | 'transition'> {
  children: ReactNode;
  floating?: boolean;
  gradient?: boolean;
  borderGlow?: boolean;
}

export const GlassPanel = ({
  children,
  className,
  floating = false,
  gradient = true,
  borderGlow = false,
  ...props
}: GlassPanelProps) => {
  return (
    <motion.div
      className={cn(
        'relative overflow-hidden',
        floating && 'float-animation',
        className
      )}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      {...props}
    >
      
      {/* 글라스 효과 */}
      <div className={cn(
        'relative glass',
        borderGlow && 'ring-1 ring-blue-400/30'
      )}>
        {/* 내부 글로우 */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50 rounded-2xl" />
        
        {/* 컨텐츠 */}
        <div className="relative z-10">
          {children}
        </div>
      </div>
      
      {/* 보더 글로우 */}
      {borderGlow && (
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400/20 to-green-400/20 blur-sm -z-10" />
      )}
    </motion.div>
  );
};