'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Building2, LayoutDashboard, Home, LogOut,
  Menu, X, Users, MessageSquare, Settings
} from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const loggedIn = localStorage.getItem('admin_logged_in') === 'true';
    setIsLoggedIn(loggedIn);

    // 로그인 페이지가 아니고 로그인 안됐으면 리다이렉트
    if (pathname !== '/admin' && !loggedIn) {
      router.push('/admin');
    }
  }, [pathname, router]);

  const handleLogout = () => {
    localStorage.removeItem('admin_logged_in');
    router.push('/admin');
  };

  // 로그인 페이지면 레이아웃 없이 렌더링
  if (pathname === '/admin') {
    return <>{children}</>;
  }

  // SSR 중에는 렌더링 안함
  if (!mounted || !isLoggedIn) {
    return null;
  }

  const menuItems = [
    { href: '/admin/properties', icon: Building2, label: '매물 관리' },
    { href: '/admin/inquiries', icon: MessageSquare, label: '문의 관리' },
    { href: '/admin/developers', icon: Users, label: '건설사 관리' },
    { href: '/admin/settings', icon: Settings, label: '설정' },
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      {/* 모바일 사이드바 오버레이 */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* 사이드바 */}
      <aside className={`fixed top-0 left-0 z-50 h-full w-64 bg-gray-800 border-r border-gray-700 transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6">
          {/* 로고 */}
          <div className="flex items-center justify-between mb-8">
            <Link href="/admin/properties" className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Building2 className="w-6 h-6 text-blue-400" />
              </div>
              <span className="text-xl font-bold text-white">ONSIA</span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* 메뉴 */}
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? 'bg-blue-500/20 text-blue-400'
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* 하단 메뉴 */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-700">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-white/5 hover:text-white rounded-lg transition-all mb-2"
          >
            <Home className="w-5 h-5" />
            <span className="font-medium">홈페이지 보기</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-all w-full"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">로그아웃</span>
          </button>
        </div>
      </aside>

      {/* 메인 콘텐츠 */}
      <div className="lg:pl-64">
        {/* 헤더 */}
        <header className="sticky top-0 z-30 bg-gray-900/80 backdrop-blur-xl border-b border-gray-800">
          <div className="flex items-center justify-between px-6 py-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-400 hover:text-white"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-400">관리자</span>
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                A
              </div>
            </div>
          </div>
        </header>

        {/* 페이지 콘텐츠 */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
