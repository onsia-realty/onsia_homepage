'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Menu, X, Home, Info, FileText, Play, Mail, Building2, Calendar, Gavel, TrendingUp, LogIn, LogOut, User } from 'lucide-react';
import { GlassCard } from './ui/GlassCard';
import { useSession, signOut } from 'next-auth/react';

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { data: session, status } = useSession();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: '분양', href: '/subscription', icon: Calendar },
    { name: '분양권', href: '/properties', icon: Building2 },
    { name: '경매', href: '/auctions', icon: Gavel },
    { name: 'AI 부동산시세', href: '/market', icon: TrendingUp },
    { name: '회사소개', href: '/about', icon: Info },
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

                {/* 로그인/사용자 메뉴 */}
                {status === 'loading' ? (
                  <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse" />
                ) : session?.user ? (
                  <div className="relative">
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                    >
                      {session.user.image ? (
                        <img
                          src={session.user.image}
                          alt={session.user.name || '사용자'}
                          className="w-7 h-7 rounded-full"
                        />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                          <User className="w-4 h-4 text-white" />
                        </div>
                      )}
                      <span className="text-sm font-medium text-white">
                        {session.user.name || '사용자'}
                      </span>
                    </button>

                    {userMenuOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setUserMenuOpen(false)}
                        />
                        <div className="absolute right-0 mt-2 w-48 bg-gray-900/95 backdrop-blur-md rounded-lg shadow-xl border border-white/10 z-20">
                          <div className="p-3 border-b border-white/10">
                            <p className="text-sm font-medium text-white">{session.user.name}</p>
                            <p className="text-xs text-gray-400">{session.user.email}</p>
                          </div>
                          <Link
                            href="/mypage"
                            onClick={() => setUserMenuOpen(false)}
                            className="w-full flex items-center gap-2 px-4 py-3 text-sm text-gray-300 hover:bg-white/10 transition-colors"
                          >
                            <User className="w-4 h-4" />
                            마이페이지
                          </Link>
                          <button
                            onClick={() => signOut({ callbackUrl: '/auth/signin' })}
                            className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-400 hover:bg-white/10 transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            로그아웃
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <Link
                    href="/auth/signin"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium hover:opacity-90 transition-opacity"
                  >
                    <LogIn className="w-4 h-4" />
                    로그인
                  </Link>
                )}
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

              {/* 모바일 로그인/사용자 메뉴 */}
              <div className="border-t border-white/10 pt-4 mt-4">
                {session?.user ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                      {session.user.image ? (
                        <img
                          src={session.user.image}
                          alt={session.user.name || '사용자'}
                          className="w-10 h-10 rounded-full"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium text-white">{session.user.name}</p>
                        <p className="text-xs text-gray-400">{session.user.email}</p>
                      </div>
                    </div>
                    <Link
                      href="/mypage"
                      onClick={() => setIsOpen(false)}
                      className="w-full flex items-center justify-center gap-2 p-4 rounded-xl text-gray-300 hover:bg-white/10 transition-all duration-200"
                    >
                      <User className="w-5 h-5" />
                      <span className="font-medium">마이페이지</span>
                    </Link>
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        signOut({ callbackUrl: '/auth/signin' });
                      }}
                      className="w-full flex items-center justify-center gap-2 p-4 rounded-xl text-red-400 hover:bg-white/10 transition-all duration-200"
                    >
                      <LogOut className="w-5 h-5" />
                      <span className="font-medium">로그아웃</span>
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/auth/signin"
                    className="flex items-center justify-center gap-2 p-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    <LogIn className="w-5 h-5" />
                    <span>로그인</span>
                  </Link>
                )}
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </motion.div>

      {/* 스페이서 (네비게이션 높이만큼) */}
      <div className="h-24" />
    </>
  );
};
