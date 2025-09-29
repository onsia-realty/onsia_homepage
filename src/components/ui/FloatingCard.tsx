'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface FloatingCardProps extends Omit<HTMLMotionProps<'div'>, 'animate' | 'initial' | 'transition' | 'whileHover'> {
  children: ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  intensity?: 'subtle' | 'normal' | 'strong';
}

export const FloatingCard = ({
  children,
  className,
  delay = 0,
  direction = 'up',
  intensity = 'normal',
  ...props
}: FloatingCardProps) => {
  const intensityValues = {
    subtle: { distance: 5, duration: 4 },
    normal: { distance: 10, duration: 6 },
    strong: { distance: 15, duration: 8 }
  };

  const { distance, duration } = intensityValues[intensity];

  const getAnimation = () => {
    const baseTransform = {
      up: { y: [-distance, distance, -distance] },
      down: { y: [distance, -distance, distance] },
      left: { x: [-distance, distance, -distance] },
      right: { x: [distance, -distance, distance] }
    };

    return {
      ...baseTransform[direction],
      rotate: [-0.5, 0.5, -0.5]
    };
  };

  return (
    <motion.div
      className={cn('glass glass-hover', className)}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        ...getAnimation()
      }}
      transition={{
        opacity: { duration: 0.6, delay },
        scale: { duration: 0.6, delay },
        y: direction === 'up' || direction === 'down' ? {
          duration,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: delay + 0.6
        } : undefined,
        x: direction === 'left' || direction === 'right' ? {
          duration,
          repeat: Infinity,
          ease: 'easeInOut', 
          delay: delay + 0.6
        } : undefined,
        rotate: {
          duration,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: delay + 0.6
        }
      }}
      whileHover={{ 
        scale: 1.05,
        rotateY: 5,
        transition: { duration: 0.2 }
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
};