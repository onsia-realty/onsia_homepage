'use client';

// Ported from public/preview/main.html (approved mockup). Markup/CSS/behaviour kept 1:1.
import { useEffect, useRef, useState } from 'react';
import { Cormorant_Garamond } from 'next/font/google';
import s from './OnsiaHome.module.css';

const cormorant = Cormorant_Garamond({
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
  ['#contact', 'Contact'],
] as const;

const HERO_SCENES = [
  { label: <>Real Estate &times; Technology</>, h1: <>부동산의 가치를,<br />기술로 증명합니다</> },
  { label: <>ONSIA HQ</>, h1: <>부동산을 가장 잘 아는<br />IT 기업</> },
  { label: <>AI &middot; Data</>, h1: <>데이터로 고객을 찾고,<br />AI로 이야기를 만듭니다</> },
  { label: <>High-end Residence</>, h1: <>하이엔드의 기준을<br />현장에서 증명합니다</> },
  { label: <>Contact</>, h1: <>다음 현장의 성공을<br />함께 설계합니다</> },
];

const BIZ = [
  ['AI 영상 · AI 쇼츠 제작', '현장의 입지와 상품을 AI 영상과 숏폼으로 빠르게, 감각 있게 풀어냅니다.'],
  ['AI 홍보 · 온라인 마케팅', '검색·SNS·퍼포먼스 광고를 데이터로 설계해 실제 상담으로 이어지게 합니다.'],
  ['홈페이지 · 랜딩페이지 제작', '현장 전용 홈페이지와 랜딩페이지를 제작하고, 유입부터 문의까지 직접 관리합니다.'],
  ['분양현장 수주 · 대행', '1군 브랜드 주거와 하이엔드 현장에 전문 인력을 투입하고, 분양 운영 전반을 총괄합니다.'],
  ['공인중개사 사무소 운영', '등록된 중개사무소를 통해 상담과 거래까지 책임 있게 연결합니다.'],
];

const SHORTS = ['한강을 마주한 저녁', '압구정, 새로운 기준', '숲과 강 사이의 집', '여의도 스카이라인'];
const DRIFT = ['.04', '.08', '.04', '.08'];

const NUMS: [number, string, string][] = [
  [120, '+', '진행 현장'],
  [1500, '+', '제작 콘텐츠'],
  [30000, '+', '누적 상담 DB'],
  [15, '년', '업력'],
];

const RESIDENCES = [
  ['상지카일룸 밤섬', '서울 마포구'],
  ['에테르노 압구정', '서울 강남구'],
  ['르엘 어퍼하우스', '서울 성동구'],
  ['더파크사이드 서울', '서울 용산구'],
  ['라브르27', '서울 강남구 삼성동'],
  ['브라이튼 여의도', '서울 영등포구'],
  ['세레노 삼성', '서울 강남구'],
  ['코르디아 서울 드래곤시티', '서울 용산구'],
];

const NEWS = ['뉴스 제목이 들어갈 자리입니다', '보도자료 제목이 들어갈 자리입니다', '공지사항 제목이 들어갈 자리입니다'];

const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const smooth = (x: number) => { x = clamp(x); return x * x * (3 - 2 * x); };
const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function OnsiaHome() {
  const root = useRef<HTMLDivElement>(null);
  const header = useRef<HTMLElement>(null);
  const hero = useRef<HTMLElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  const vid = useRef<HTMLVideoElement>(null);
  const copies = useRef<HTMLDivElement>(null);
  const hnum = useRef<HTMLElement>(null);
  const hprog = useRef<HTMLElement>(null);
  const cue = useRef<HTMLDivElement>(null);
  const grid = useRef<HTMLDivElement>(null);
  const creative = useRef<HTMLElement>(null);
  const slider = useRef<HTMLDivElement>(null);
  const cur = useRef<HTMLElement>(null);
  const bar = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);

  // smooth anchor scrolling (mockup: html{scroll-behavior:smooth})
  useEffect(() => {
    const el = document.documentElement;
    el.style.scrollBehavior = 'smooth';
    return () => { el.style.scrollBehavior = ''; };
  }, []);

  // header solid after hero
  useEffect(() => {
    const onScroll = () => header.current!.classList.toggle(s.solid, scrollY > hero.current!.offsetHeight - 88);
    addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => removeEventListener('scroll', onScroll);
  }, []);

  // mobile menu: lock body scroll
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  // hero scrub (scroll-world scrub-engine core: blob src, lerped currentTime, coalesced seeks)
  useEffect(() => {
    const reduce = reduced();
    const heroEl = hero.current!, v = vid.current!, pinEl = pin.current!;
    const hc = Array.from(copies.current!.children) as HTMLElement[], N = hc.length;
    const mobile = () => matchMedia('(hover: none) and (pointer: coarse)').matches || innerWidth <= 860;
    let target = 0, c = 0, ready = false, tick = false, raf = 0, url = '', alive = true;
    const read = () => {
      tick = false;
      const p = reduce ? 0 : clamp(scrollY / (heroEl.offsetHeight - innerHeight)); target = p;
      hc.forEach((el, i) => {
        const l = p * N - i, before = l < 0, after = l > 1; let op: number;
        if (i === 0) op = after ? 0 : smooth(1 - l / 0.7);
        else if (i === N - 1) op = before ? 0 : smooth(l / 0.4);
        else op = (before || after) ? 0 : smooth(1 - Math.abs(l - 0.5) / 0.45);
        el.style.opacity = String(op);
        el.style.transform = reduce ? 'none' : `translateY(${((0.5 - clamp(l)) * 3).toFixed(2)}vh)`;
        el.style.pointerEvents = op > .5 ? 'auto' : 'none';
      });
      hnum.current!.textContent = String(Math.min(N, Math.floor(p * N) + 1)).padStart(2, '0');
      hprog.current!.style.transform = `scaleY(${p})`;
      cue.current!.style.opacity = String(clamp(1 - scrollY / (0.5 * innerHeight)));
    };
    const loop = () => {
      if (ready && !v.seeking) {
        c += (target - c) * 0.08; const t = clamp(c, 0, .999) * (v.duration || 1);
        if (Math.abs(v.currentTime - t) > (mobile() ? 0.02 : 0.008)) { try { v.currentTime = t; } catch { /* not seekable yet */ } }
      }
      raf = requestAnimationFrame(loop);
    };
    const onScroll = () => { if (!tick) { tick = true; requestAnimationFrame(read); } };
    // iOS: a never-played muted video won't paint seeked frames — prime on first gesture
    const prime = () => { if (!mobile()) return; const p = v.play(); if (p && p.then) p.then(() => v.pause()).catch(() => {}); };
    const onMeta = () => { ready = true; read(); };
    const onSeeked = () => pinEl.classList.add(s.hasClip);
    if (!reduce) {
      fetch('/media/home/hero.mp4').then(r => r.ok ? r.blob() : Promise.reject(new Error(String(r.status)))).then(b => {
        if (!alive) return;
        url = URL.createObjectURL(b); v.src = url;
        v.addEventListener('loadedmetadata', onMeta);
        v.addEventListener('seeked', onSeeked, { once: true });
      }).catch(e => console.warn('hero.mp4 load failed', e));
      addEventListener('pointerdown', prime, { once: true, passive: true });
      addEventListener('touchstart', prime, { once: true, passive: true });
      addEventListener('scroll', onScroll, { passive: true });
      addEventListener('resize', read);
      raf = requestAnimationFrame(loop);
    }
    read();
    return () => {
      alive = false; cancelAnimationFrame(raf);
      removeEventListener('pointerdown', prime); removeEventListener('touchstart', prime);
      removeEventListener('scroll', onScroll); removeEventListener('resize', read);
      v.removeEventListener('loadedmetadata', onMeta); v.removeEventListener('seeked', onSeeked);
      if (url) { v.removeAttribute('src'); URL.revokeObjectURL(url); }
    };
  }, []);

  // scroll reveal (60ms stagger within each section) + counters
  useEffect(() => {
    const reduce = reduced();
    const count = (el: HTMLElement) => {
      const to = +el.dataset.to!;
      if (reduce) { el.textContent = to.toLocaleString('ko-KR'); return; }
      const t0 = performance.now(), d = 2200;
      const step = (t: number) => { const p = Math.min((t - t0) / d, 1); el.textContent = Math.round(to * (1 - Math.pow(1 - p, 4))).toLocaleString('ko-KR'); if (p < 1) requestAnimationFrame(step); };
      requestAnimationFrame(step);
    };
    const r = root.current!;
    r.querySelectorAll<HTMLElement>(`.${s.sec}`).forEach(sec => sec.querySelectorAll<HTMLElement>(`.${s.rv}`).forEach((el, i) => { el.style.transitionDelay = i * 60 + 'ms'; }));
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add(s.in); e.target.querySelectorAll<HTMLElement>('[data-to]').forEach(count); io.unobserve(e.target);
    }), { threshold: .12, rootMargin: '0px 0px -6% 0px' });
    r.querySelectorAll(`.${s.rv}`).forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  // subtle parallax drift on AI cards (desktop only)
  useEffect(() => {
    if (reduced()) return;
    const sec = creative.current!, drift = Array.from(sec.querySelectorAll<HTMLElement>('[data-drift]'));
    let tick = false;
    const run = () => {
      tick = false;
      if (innerWidth < 601) { drift.forEach(d => { (d.firstElementChild as HTMLElement).style.transform = ''; }); return; }
      const rc = sec.getBoundingClientRect(), c = rc.top + rc.height / 2 - innerHeight / 2;
      drift.forEach(d => { (d.firstElementChild as HTMLElement).style.transform = `translateY(${(-c * +d.dataset.drift!).toFixed(1)}px)`; });
    };
    const onScroll = () => { if (!tick) { tick = true; requestAnimationFrame(run); } };
    addEventListener('scroll', onScroll, { passive: true }); run();
    return () => removeEventListener('scroll', onScroll);
  }, []);

  // residences slider
  const slides = () => Array.from(slider.current!.children) as HTMLElement[];
  const idx = () => {
    const sl = slider.current!, ss = slides(), pad = ss[0].offsetLeft;
    let b = 0, m = Infinity;
    ss.forEach((el, i) => { const d = Math.abs(el.offsetLeft - pad - sl.scrollLeft); if (d < m) { m = d; b = i; } });
    return sl.scrollLeft + sl.clientWidth >= sl.scrollWidth - 2 ? ss.length - 1 : b;
  };
  const upd = () => {
    const i = idx(); cur.current!.textContent = String(i + 1).padStart(2, '0');
    bar.current!.style.width = ((i + 1) / RESIDENCES.length * 100) + '%';
  };
  const go = (d: number) => {
    const ss = slides(), i = Math.max(0, Math.min(ss.length - 1, idx() + d));
    slider.current!.scrollTo({ left: ss[i].offsetLeft - ss[0].offsetLeft, behavior: reduced() ? 'auto' : 'smooth' });
  };

  // business cards: hover → play loop (desktop); in-view → play (touch). reduced-motion → still image only
  useEffect(() => {
    const reduce = reduced(), touch = matchMedia('(hover: none)').matches;
    const play = (c: Element) => { const v = c.querySelector('video'); if (!v || reduce) return; v.play().then(() => c.classList.add(s.playing)).catch(() => {}); };
    const stop = (c: Element) => { const v = c.querySelector('video'); c.classList.remove(s.playing); if (v) v.pause(); };
    const cells = Array.from(grid.current!.querySelectorAll(`.${s.hasMedia}`));
    const ios: IntersectionObserver[] = [], offs: (() => void)[] = [];
    cells.forEach(c => {
      if (touch) {
        const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && e.intersectionRatio > .6 ? play(c) : stop(c)), { threshold: [0, .6] });
        io.observe(c); ios.push(io);
      } else {
        const on = () => play(c), off = () => stop(c);
        c.addEventListener('mouseenter', on); c.addEventListener('mouseleave', off);
        offs.push(() => { c.removeEventListener('mouseenter', on); c.removeEventListener('mouseleave', off); });
      }
    });
    return () => { ios.forEach(io => io.disconnect()); offs.forEach(f => f()); };
  }, []);

  return (
    <div
      ref={root}
      className={`${s.root} ${cormorant.variable}`}
      // 시안용 빈 링크(href="#")는 맨 위로 튀지 않게 막음 — 실제 페이지 경로가 생기면 href만 바꾸면 됨
      onClick={e => { if ((e.target as Element).closest('a[href="#"]')) e.preventDefault(); }}
    >
      <header ref={header} className={`${s.header}${open ? ` ${s.open}` : ''}`}>
        <div className={s.wrap}>
          <a href="#" className={s.logo} aria-label="ONSIA">ONSIA</a>
          <button className={s.burger} aria-label="메뉴 열기" aria-expanded={open} onClick={() => setOpen(o => !o)}><span></span><span></span></button>
          <nav className={s.nav}>
            <ul>
              {NAV.map(([href, t]) => <li key={href}><a href={href} onClick={() => setOpen(false)}>{t}</a></li>)}
            </ul>
          </nav>
        </div>
      </header>

      {/* 1. HERO — 스크롤 스크럽 플라이스루 (/media/home/hero.mp4, 5 scenes) */}
      <section ref={hero} className={`${s.sec} ${s.hero}`} id="hero">
        <div ref={pin} className={s.heroPin}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className={s.heroPoster} src="/media/home/hero_poster.jpg" alt="" aria-hidden="true" />
          <video ref={vid} className={s.heroVideo} muted playsInline preload="auto" aria-hidden="true"></video>
          <div className={s.heroShade} aria-hidden="true"></div>
          <div ref={copies} className={s.heroCopy}>
            {HERO_SCENES.map((sc, i) => (
              <div key={i} className={s.hc}>
                <div className={s.label}>{sc.label}</div>
                <h1>{sc.h1}</h1>
                {i === HERO_SCENES.length - 1 && (
                  <div className={s.btns}><a href="#contact" className={s.btn}>현장 마케팅 문의</a><a href="#contact" className={s.btn}>제휴 문의</a></div>
                )}
              </div>
            ))}
          </div>
          <div className={s.heroRail} aria-hidden="true"><span className={s.heroNum}><em ref={hnum}>01</em><small>/ 05</small></span><i className={s.heroProg}><b ref={hprog}></b></i></div>
          <div ref={cue} className={s.scroll}>SCROLL<i></i></div>
        </div>
      </section>

      {/* 2. MANIFESTO */}
      <section className={s.sec} id="about">
        <div className={s.wrap}>
          <div className={`${s.label} ${s.rv}`}>About ONSIA</div>
          <p className={`${s.manifesto} ${s.rv}`}>
            <span className={s.lead}>부동산은 실전 경험과 노하우가 생명입니다.</span>
            ONSIA는 <em>부동산을 가장 잘 아는 IT 기업</em>으로서<br />
            데이터로 고객을 찾고, AI로 이야기를 만들고,<br />
            현장에서 직접 결과로 증명합니다.
          </p>
        </div>
      </section>

      {/* 3. BUSINESS */}
      <section className={s.sec} id="business">
        <div className={s.wrap}>
          <div className={s.head}>
            <div className={s.rv}><div className={s.label}>Business</div><h2>기획부터 분양까지,<br />한 팀이 끝까지 책임집니다</h2></div>
            <a href="#" className={`${s.more} ${s.rv}`}>View Business</a>
          </div>
          <div ref={grid} className={s.grid}>
            {BIZ.map(([h, p], i) => {
              const n = String(i + 1).padStart(2, '0');
              return (
                <a key={n} href="#" className={`${s.cell} ${s.hasMedia} ${s.rv}`}>
                  <div className={s.media}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`/media/home/biz/biz_${n}.jpg`} alt="" loading="lazy" />
                    <video src={`/media/home/biz/biz_${n}.mp4`} muted loop playsInline preload="none"></video>
                  </div>
                  <span className={s.num}>{n}</span><i className={s.go}>&rarr;</i><h3>{h}</h3><p>{p}</p>
                </a>
              );
            })}
            <a href="#contact" className={`${s.cell} ${s.ctaCell} ${s.hasMedia} ${s.rv}`}>
              <div className={s.media}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/media/home/biz/biz_06.jpg" alt="" loading="lazy" />
                <video src="/media/home/biz/biz_06.mp4" muted loop playsInline preload="none"></video>
              </div>
              <i className={s.go}>&rarr;</i><span>Inquiry</span><h3>사업 문의하기</h3><p>대표전화 1555-1245 · 현장 마케팅 · 제휴 문의</p>
            </a>
          </div>
        </div>
      </section>

      {/* 4. AI CREATIVE */}
      <section ref={creative} className={s.sec} id="creative">
        <div className={s.wrap}>
          <div className={s.head}>
            <div className={s.rv}><div className={s.label}>AI Creative</div><h2>한 편의 영상이<br />현장의 첫인상이 됩니다</h2></div>
            <a href="#" className={`${s.more} ${s.rv}`}>View All</a>
          </div>
          <div className={s.shorts}>
            {/* 각 .frame 은 추후 <video autoplay muted loop playsinline> 로 교체 */}
            {SHORTS.map((t, i) => (
              <a key={t} href="#" className={`${s.short} ${s.rv}`} data-drift={DRIFT[i]}><div className={s.frame}><i className={s.play}></i></div><div className={s.cap}><small>AI Shorts</small><h4>{t}</h4></div></a>
            ))}
          </div>
          <p className={`${s.note} ${s.rv}`}>* 시안용 자리표시입니다. 실제 페이지에서는 제작 영상이 자동 재생됩니다.</p>
        </div>
      </section>

      {/* 5. NUMBERS */}
      <section className={s.sec}>
        <div className={s.wrap}>
          <div className={`${s.label} ${s.rv}`}>ONSIA in Numbers</div>
          {/* TODO 실제 수치로 교체 */}
          <div className={s.nums}>
            {NUMS.map(([to, sup, t]) => (
              <div key={t} className={s.rv}><b><span data-to={to}>0</span><sup>{sup}</sup></b><span>{t}</span></div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. PREMIUM RESIDENCES */}
      <section className={s.sec} id="residences">
        <div className={s.wrap}>
          <div className={s.head}>
            <div className={s.rv}><div className={s.label}>Premium Residences</div><h2>ONSIA가 함께한<br />하이엔드 레지던스</h2></div>
            <a href="#" className={`${s.more} ${s.rv}`}>View Portfolios</a>
          </div>
        </div>
        <div ref={slider} className={`${s.slider} ${s.rv}`} onScroll={upd}>
          {/* 이미지 확보 후 .slide::before 대신 background-image 로 교체 */}
          {RESIDENCES.map(([h, p]) => <article key={h} className={s.slide}><h3>{h}</h3><p>{p}</p></article>)}
        </div>
        <div className={s.wrap}>
          <div className={`${s.ctrl} ${s.rv}`}>
            <span className={s.counter}><em ref={cur}>01</em><small>/ 08</small></span>
            <span className={s.bar}><i ref={bar}></i></span>
            <div className={s.arrows}>
              <button aria-label="이전" onClick={() => go(-1)}>&larr;</button>
              <button aria-label="다음" onClick={() => go(1)}>&rarr;</button>
            </div>
          </div>
        </div>
      </section>

      {/* 7. TECHNOLOGY */}
      <section className={`${s.sec} ${s.tech}`}>
        <div className={s.wrap}>
          <div className={`${s.label} ${s.rv}`}>Technology</div><br />
          <div className={`${s.patent} ${s.rv}`}>PATENT</div>
          <p className={s.rv}>블록체인 기반 부동산 거래 정보 검증 기술 특허 보유</p>
        </div>
      </section>

      {/* 8. PR CENTER */}
      <section className={s.sec} id="pr">
        <div className={s.wrap}>
          <div className={s.head}>
            <div className={s.rv}><div className={s.label}>PR Center</div><h2>ONSIA 소식</h2></div>
            <a href="#" className={`${s.more} ${s.rv}`}>View More</a>
          </div>
          <ul className={s.news}>
            {NEWS.map(t => <li key={t} className={s.rv}><a href="#"><time>2026.00.00</time><h4>{t}</h4></a></li>)}
          </ul>
        </div>
      </section>

      {/* 9. CONTACT */}
      <section className={`${s.sec} ${s.cta}`} id="contact">
        <div className={s.wrap}>
          <div className={`${s.label} ${s.rv}`}>Contact</div>
          <h2 className={s.rv}>다음 현장의 성공을<br />함께 설계합니다</h2>
          <div className={`${s.btns} ${s.rv}`}>
            <a href="#" className={s.btn}>현장 마케팅 문의</a>
            <a href="#" className={s.btn}>제휴 문의</a>
          </div>
        </div>
      </section>

      <footer className={s.footer}>
        <div className={s.wrap}>
          <div className={s.foot}>
            <div>
              <span className={s.logo}>ONSIA</span>
              <p className={s.tag}>부동산을 가장 잘 아는 IT 기업</p>
            </div>
            <dl>
              <div><dt>상호</dt><dd>온시아 주식회사</dd></div>
              <div><dt>대표</dt><dd>연대겸</dd></div>
              <div><dt>사업자등록번호</dt><dd>243-88-01749</dd></div>
              <div><dt>주소</dt><dd>서울특별시 송파구 중대로 197</dd></div>
              <div><dt>대표전화</dt><dd>1555-1245</dd></div>
            </dl>
          </div>
          <div className={s.copy}><span>&copy; 2026 ONSIA. ALL RIGHTS RESERVED.</span><a href="#">Admin</a></div>
        </div>
      </footer>
    </div>
  );
}
