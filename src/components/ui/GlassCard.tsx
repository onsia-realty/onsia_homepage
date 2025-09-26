'use client';

import { motion } from 'framer-motion';
import { ReactNode, HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  hover?: boolean;
  glow?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'elevated' | 'minimal';
}

export const GlassCard = ({
  children,
  className,
  hover = true,
  glow = false,
  size = 'md',
  variant = 'default',
  ...props
}: GlassCardProps) => {
  const sizeClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10'
  };

  const variantClasses = {
    default: 'glass',
    elevated: 'glass shadow-2xl shadow-blue-500/20',
    minimal: 'bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm'
  };

  return (
    <motion.div
      className={cn(
        variantClasses[variant],
        sizeClasses[size],
        hover && 'glass-hover cursor-pointer',
        glow && 'glow pulse-glow',
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={hover ? { scale: 1.02 } : undefined}
      {...props}
    >
      {children}
    </motion.div>
  );
};