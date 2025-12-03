'use client';

import { motion } from 'framer-motion';
import { Phone, MessageCircle } from 'lucide-react';

export const FloatingContact = () => {
  const phoneNumber = '1668-5257';
  const kakaoChannelUrl = 'https://open.kakao.com/o/sRJgAO4h';

  const handlePhoneClick = () => {
    // 모바일에서는 바로 전화, PC에서는 알림
    if (typeof window !== 'undefined') {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      if (isMobile) {
        window.location.href = `tel:${phoneNumber}`;
      } else {
        alert(`상담번호: ${phoneNumber}`);
      }
    }
  };

  const handleKakaoClick = () => {
    window.open(kakaoChannelUrl, '_blank');
  };

  return (
    <div className="fixed right-4 bottom-4 md:right-6 md:bottom-6 z-50 flex flex-col gap-3">
      {/* 카카오톡 버튼 */}
      <motion.button
        onClick={handleKakaoClick}
        className="group relative"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        {/* 글로우 효과 */}
        <div className="absolute -inset-1 bg-yellow-400 rounded-full blur opacity-40 group-hover:opacity-70 transition-opacity" />

        {/* 버튼 본체 */}
        <div className="relative w-14 h-14 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg shadow-yellow-500/30 hover:shadow-yellow-500/50 transition-all">
          {/* 카카오톡 아이콘 */}
          <svg
            className="w-8 h-8 text-yellow-900"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 3c-5.5 0-10 3.58-10 8 0 2.79 1.86 5.24 4.65 6.62-.21.79-.78 2.86-.9 3.3-.14.55.2.54.43.39.17-.11 2.78-1.84 3.92-2.59.6.08 1.22.13 1.9.13 5.5 0 10-3.58 10-8s-4.5-8-10-8z"/>
          </svg>
        </div>

        {/* 호버 라벨 */}
        <div className="absolute right-16 top-1/2 -translate-y-1/2 px-3 py-2 bg-gray-900/90 backdrop-blur-sm text-white text-sm font-medium rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          카카오톡 상담
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 w-2 h-2 bg-gray-900/90 rotate-45" />
        </div>
      </motion.button>

      {/* 전화 버튼 */}
      <motion.button
        onClick={handlePhoneClick}
        className="group relative"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        {/* 글로우 효과 */}
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full blur opacity-40 group-hover:opacity-70 transition-opacity" />

        {/* 버튼 본체 */}
        <div className="relative w-14 h-14 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all">
          <Phone className="w-6 h-6 text-white" />
        </div>

        {/* 호버 라벨 */}
        <div className="absolute right-16 top-1/2 -translate-y-1/2 px-3 py-2 bg-gray-900/90 backdrop-blur-sm text-white text-sm font-medium rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          전화 상담
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 w-2 h-2 bg-gray-900/90 rotate-45" />
        </div>

        {/* 펄스 애니메이션 (전화 버튼만) */}
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500 border-2 border-white"></span>
        </span>
      </motion.button>
    </div>
  );
};
