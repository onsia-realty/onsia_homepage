'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Menu, X, Home, Info, FileText, Play, Mail, Building2, Calendar } from 'lucide-react';
import { GlassCard } from './ui/GlassCard';

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: '청약홈매물', href: '/subscriptions', icon: Calendar },
    { name: '분양권매물', href: '/properties', icon: Building2 },
    { name: '회사소개', href: '/about', icon: Info },
    // TODO: 페이지 완성 후 활성화
    // { name: '부동산뉴스', href: '/news', icon: FileText },
    // { name: '영상', href: '/videos', icon: Play },
    // { name: '문의', href: '/contact', icon: Mail },
  ];

  return (
    <>
      {/* 메인 네비게이션 */}
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'py-2' : 'py-4'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto px-6">
          <GlassCard 
            className={`transition-all duration-300 ${
              scrolled ? 'px-6 py-3' : 'px-8 py-4'
            }`} 
            hover={false}
            variant="minimal"
          >
            <div className="flex items-center justify-between">
              {/* 로고 */}
              <Link href="/" className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center glow">
                  <span className="text-white font-bold text-lg">O</span>
                </div>
                <div className="hidden sm:block">
                  <div className="text-xl font-bold text-white">ONSIA</div>
                  <div className="text-xs text-blue-300">온시아 공인중개사</div>
                </div>
              </Link>

              {/* 데스크톱 메뉴 */}
              <div className="hidden md:flex items-center space-x-8">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center gap-2 font-medium"
                  >
                    <item.icon className="w-4 h-4" />
                    {item.name}
                  </Link>
                ))}
              </div>


              {/* 모바일 메뉴 버튼 */}
              <button
                className="md:hidden w-10 h-10 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center"
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? (
                  <X className="w-5 h-5 text-white" />
                ) : (
                  <Menu className="w-5 h-5 text-white" />
                )}
              </button>
            </div>
          </GlassCard>
        </div>
      </motion.nav>

      {/* 모바일 메뉴 */}
      <motion.div
        className={`fixed inset-0 z-40 md:hidden ${isOpen ? 'block' : 'hidden'}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* 배경 오버레이 */}
        <div 
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
        
        {/* 메뉴 패널 */}
        <motion.div
          className="absolute top-20 left-6 right-6"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: isOpen ? 1 : 0.95, opacity: isOpen ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <GlassCard className="p-6" variant="elevated">
            <div className="space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-4 p-4 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </motion.div>

      {/* 스페이서 (네비게이션 높이만큼) */}
      <div className="h-24" />
    </>
  );
};