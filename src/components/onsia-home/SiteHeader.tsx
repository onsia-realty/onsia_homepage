'use client';

// Shared site header (ONSIA wordmark + nav + mobile burger), extracted from OnsiaHome.
// Pass `hero` to make it transparent over the hero and solid after; without it, it is always solid.
import { useEffect, useState, type RefObject } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Cormorant_Garamond } from 'next/font/google';
import s from './OnsiaHome.module.css';

export const cormorant = Cormorant_Garamond({
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-en',
  display: 'swap',
});

const NAV = [
  ['#about', 'About'],
  ['#business', 'Business'],
  ['#creative', 'Creative'],
  ['#residences', 'Residences'],
  ['#pr', 'PR Center'],
  ['/lms', '타겟 LMS'],
  ['/subscriptions', '청약 일정'],
  ['#contact', 'Contact'],
] as const;

export default function SiteHeader({ hero }: { hero?: RefObject<HTMLElement | null> }) {
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(!hero);
  const home = usePathname() === '/';

  // header solid after hero
  useEffect(() => {
    if (!hero) return;
    const onScroll = () => setSolid(scrollY > (hero.current?.offsetHeight ?? 0) - 88);
    addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => removeEventListener('scroll', onScroll);
  }, [hero]);

  // mobile menu: lock body scroll
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <header className={`${s.header}${solid ? ` ${s.solid}` : ''}${open ? ` ${s.open}` : ''}`}>
      <div className={s.wrap}>
        <Link href="/" className={s.logo} aria-label="ONSIA">ONSIA</Link>
        <button className={s.burger} aria-label="메뉴 열기" aria-expanded={open} onClick={() => setOpen(o => !o)}><span></span><span></span></button>
        <nav className={s.nav}>
          <ul>
            {NAV.map(([href, t]) => (
              <li key={href}>
                {href.startsWith('#')
                  ? <a href={home ? href : `/${href}`} onClick={() => setOpen(false)}>{t}</a>
                  : <Link href={href} onClick={() => setOpen(false)}>{t}</Link>}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
