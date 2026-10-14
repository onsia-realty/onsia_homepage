'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import h from '@/components/onsia-home/OnsiaHome.module.css';
import s from './sub.module.css';
import SiteHeader, { cormorant } from '@/components/onsia-home/SiteHeader';
import SiteFooter from '@/components/onsia-home/SiteFooter';

interface SubscriptionProperty {
  HOUSE_MANAGE_NO: string;
  PBLANC_NO: string;
  HOUSE_NM: string;
  HOUSE_SECD_NM: string;
  HOUSE_DTL_SECD_NM: string;
  HSSPLY_ADRES: string;
  TOT_SUPLY_HSHLDCO: number;
  RCRIT_PBLANC_DE: string;
  RCEPT_BGNDE: string;
  RCEPT_ENDDE: string;
  PRZWNER_PRESNATN_DE: string;
  SUBSCRPT_AREA_CODE_NM: string;
  CNSTRCT_ENTRPS_NM: string;
  PBLANC_URL: string;
  SPSPLY_RCEPT_BGNDE: string | null;
  GNRL_RNK1_CRSPAREA_RCPTDE: string | null;
  GNRL_RNK2_CRSPAREA_RCPTDE: string | null;
  status: 'upcoming' | 'open' | 'closed';
  statusText: string;
  dDay: number | null;
}

type Type = '' | 'apt' | 'officetel' | 'remndr';

interface Props {
  defaultType?: Exclude<Type, ''>;
  title?: string;
  description?: string;
}

const ITEMS_PER_PAGE = 12;
const REGIONS = ['서울', '경기', '인천', '부산', '대구', '광주', '대전', '울산', '세종', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주'];
const TABS: [Type, string][] = [['', '전체'], ['apt', 'APT'], ['officetel', '오피스텔'], ['remndr', '무순위·잔여']];
const EVENTS: [keyof SubscriptionProperty, string][] = [
  ['RCRIT_PBLANC_DE', '공고'], ['SPSPLY_RCEPT_BGNDE', '특별공급'], ['GNRL_RNK1_CRSPAREA_RCPTDE', '1순위'],
  ['GNRL_RNK2_CRSPAREA_RCPTDE', '2순위'], ['PRZWNER_PRESNATN_DE', '당첨발표'],
];

// 청약홈 링크: 공공데이터의 공고상세URL(PBLANC_URL) 우선, 없으면 청약홈 메인
export const applyHomeUrl = (sub: { PBLANC_URL?: string }) =>
  sub.PBLANC_URL?.startsWith('http') ? sub.PBLANC_URL : 'https://www.applyhome.co.kr';

const ymd = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const fmt = (v: string | null, full = false) => {
  if (!v) return '-';
  const d = new Date(v);
  if (isNaN(d.getTime())) return '-';
  const md = `${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
  return full ? `${d.getFullYear()}.${md}` : md;
};
const dday = (n: number | null) => n === null ? '' : n === 0 ? 'D-DAY' : n > 0 ? `D-${n}` : `D+${-n}`;

// 원격 이미지는 동일 출처 프록시로 (핫링크 차단·mixed content 회피)
export const proxied = (url: string) => `/api/img?u=${encodeURIComponent(url)}`;

/** 단지 대표 이미지(없으면 단지명 첫 글자 플레이스홀더). 16:10 고정 박스라 레이아웃 시프트 없음 */
export function Thumb({ name, url, children, className }: { name: string; url: string | null | undefined; children?: React.ReactNode; className?: string }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className={`${s.thumb}${className ? ` ${className}` : ''}`}>
      <span className={s.ph} aria-hidden="true"><b>{name.trim().charAt(0)}</b><small>ONSIA</small></span>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {url && <img src={proxied(url)} alt={`${name} 대표 이미지`} loading="lazy" decoding="async" className={loaded ? s.shown : ''} onLoad={() => setLoaded(true)} />}
      {children}
    </div>
  );
}

/** 렌더된 단지들의 썸네일을 배치로 조회 (캐시 미스는 서버가 소량씩 해석) */
function useThumbs(ids: string[]) {
  const [thumbs, setThumbs] = useState<Record<string, string | null>>({});
  const key = ids.join(',');
  useEffect(() => {
    let alive = true;
    const todo = key ? key.split(',').filter(id => !(id in thumbs)) : [];
    if (!todo.length) return;
    (async () => {
      for (let i = 0; i < todo.length; i += 40) {
        try {
          const r = await fetch(`/api/subscriptions/thumbnails?ids=${todo.slice(i, i + 40).join(',')}`).then(r => r.json());
          if (alive && r.data) setThumbs(t => ({ ...t, ...r.data }));
        } catch (e) { console.error('썸네일 조회 실패:', e); }
      }
    })();
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return thumbs;
}

function Card({ sub, thumb }: { sub: SubscriptionProperty; thumb: string | null | undefined }) {
  return (
    <article className={`${s.card}${sub.status === 'open' ? ` ${s.open}` : ''}`}>
      <Thumb name={sub.HOUSE_NM} url={thumb}>
        <span className={`${s.dday}${sub.status === 'closed' ? ` ${s.closed}` : ''}`}>{sub.status === 'closed' ? 'CLOSED' : dday(sub.dDay)}</span>
      </Thumb>
      <div className={s.top}>
        <span className={s.tag}>{sub.SUBSCRPT_AREA_CODE_NM} · {sub.HOUSE_SECD_NM}</span>
      </div>
      <span className={`${s.status}${sub.status === 'open' ? ` ${s.open}` : ''}`}>{sub.statusText}</span>
      <h3>{sub.HOUSE_NM}</h3>
      <p className={s.where}>{sub.HSSPLY_ADRES}</p>
      <dl className={s.rows}>
        <div><dt>접수 기간</dt><dd className={s.num}>{fmt(sub.RCEPT_BGNDE)} – {fmt(sub.RCEPT_ENDDE)}</dd></div>
        <div><dt>당첨발표</dt><dd className={s.num}>{fmt(sub.PRZWNER_PRESNATN_DE, true)}</dd></div>
        <div><dt>세대수</dt><dd className={s.num}>{sub.TOT_SUPLY_HSHLDCO?.toLocaleString() || '-'}</dd></div>
        <div><dt>시공사</dt><dd>{sub.CNSTRCT_ENTRPS_NM || '-'}</dd></div>
      </dl>
      <div className={s.acts}>
        <Link href={`/subscriptions/${sub.HOUSE_MANAGE_NO}`}>상세보기</Link>
        <a href={applyHomeUrl(sub)} target="_blank" rel="noopener noreferrer" className={s.ext}>청약홈 바로가기 ↗</a>
      </div>
    </article>
  );
}

export default function SubscriptionListClient({ defaultType, title = '청약 일정', description = '청약홈 공공데이터로 전국 아파트 청약 일정을 매일 업데이트합니다.' }: Props) {
  const [all, setAll] = useState<SubscriptionProperty[]>([]);
  const [list, setList] = useState<SubscriptionProperty[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [region, setRegion] = useState('');
  const [type, setType] = useState<Type>(defaultType ?? '');
  const [month, setMonth] = useState(() => { const d = new Date(); d.setDate(1); return d; });
  const [selDate, setSelDate] = useState<Date | null>(null);

  // 상단 섹션 + 캘린더용: 현재 유형의 전체 목록 (API 상한 100건/유형)
  useEffect(() => {
    const p = new URLSearchParams({ page: '1', perPage: '300' });
    if (defaultType) p.set('type', defaultType);
    fetch(`/api/subscriptions?${p}`).then(r => r.json()).then(d => setAll(d.data ?? [])).catch(e => console.error('청약 전체 조회 실패:', e));
  }, [defaultType]);

  // 목록(페이지네이션 + 필터)
  useEffect(() => {
    let alive = true;
    setLoading(true);
    const p = new URLSearchParams({ page: String(page), perPage: String(ITEMS_PER_PAGE) });
    if (region) p.set('region', region);
    if (type) p.set('type', type);
    fetch(`/api/subscriptions?${p}`).then(r => r.json()).then(d => {
      if (!alive) return;
      setList(d.data ?? []); setTotal(d.stats?.total ?? 0); setTotalPages(d.pagination?.totalPages ?? 1);
    }).catch(e => { console.error('청약 목록 조회 실패:', e); if (alive) setList([]); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [page, region, type]);

  const today = ymd(new Date());
  const weekEnd = ymd(new Date(Date.now() + 7 * 864e5));
  const openNow = useMemo(() => all.filter(x => x.status === 'open'), [all]);
  const thisWeek = useMemo(() => all.filter(x => x.status === 'upcoming' && x.RCEPT_BGNDE > today && x.RCEPT_BGNDE <= weekEnd), [all, today, weekEnd]);
  const thumbs = useThumbs(useMemo(() => [...new Set([...openNow, ...thisWeek, ...list].map(x => x.HOUSE_MANAGE_NO))], [openNow, thisWeek, list]));

  // 날짜별 이벤트 맵
  const events = useMemo(() => {
    const m = new Map<string, { sub: SubscriptionProperty; labels: string[] }[]>();
    all.forEach(sub => EVENTS.forEach(([k, label]) => {
      const d = sub[k] as string | null;
      if (!d) return;
      const arr = m.get(d) ?? [];
      const hit = arr.find(e => e.sub.HOUSE_MANAGE_NO === sub.HOUSE_MANAGE_NO);
      if (hit) hit.labels.push(label); else arr.push({ sub, labels: [label] });
      m.set(d, arr);
    }));
    return m;
  }, [all]);

  const q = search.trim().toLowerCase();
  const shown = q ? list.filter(x => x.HOUSE_NM.toLowerCase().includes(q) || x.HSSPLY_ADRES.toLowerCase().includes(q)) : list;

  // 캘린더 셀
  const y = month.getFullYear(), mo = month.getMonth();
  const first = new Date(y, mo, 1).getDay(), days = new Date(y, mo + 1, 0).getDate();
  const selKey = selDate ? ymd(selDate) : '';
  const selEvents = selKey ? events.get(selKey) ?? [] : [];
  const pages = Array.from({ length: Math.min(5, totalPages) }, (_, i) =>
    totalPages <= 5 ? i + 1 : page <= 3 ? i + 1 : page >= totalPages - 2 ? totalPages - 4 + i : page - 2 + i);

  return (
    <div className={`${h.root} ${cormorant.variable}`}>
      <SiteHeader />
      <main className={s.page}>
        {/* 1. hero */}
        <section className={`${s.sec} ${s.hero}`}>
          <div className={h.wrap}>
            <div className={h.label}>Subscription</div>
            <h1>{title}</h1>
            <p>{description}</p>
          </div>
        </section>

        {/* 2. 오늘 접수 중 */}
        <section className={s.sec}>
          <div className={h.wrap}>
            <div className={s.head}>
              <div><div className={h.label}>Open Today</div><h2>오늘 접수 중</h2></div>
              <span className={s.count}>{String(openNow.length).padStart(2, '0')}<small>UNITS</small></span>
            </div>
            {openNow.length ? <div className={`${s.cards} ${s.cards4}`}>{openNow.map(x => <Card key={x.HOUSE_MANAGE_NO} sub={x} thumb={thumbs[x.HOUSE_MANAGE_NO]} />)}</div>
              : <p className={s.empty}>오늘 접수 중인 청약이 없습니다.</p>}
          </div>
        </section>

        {/* 3. 이번 주 접수 예정 */}
        <section className={s.sec}>
          <div className={h.wrap}>
            <div className={s.head}>
              <div><div className={h.label}>This Week</div><h2>이번 주 접수 예정</h2></div>
              <span className={s.count}>{String(thisWeek.length).padStart(2, '0')}<small>UNITS</small></span>
            </div>
            {thisWeek.length ? <div className={`${s.cards} ${s.cards4}`}>{thisWeek.map(x => <Card key={x.HOUSE_MANAGE_NO} sub={x} thumb={thumbs[x.HOUSE_MANAGE_NO]} />)}</div>
              : <p className={s.empty}>이번 주 접수 예정인 청약이 없습니다.</p>}
          </div>
        </section>

        {/* 4. calendar */}
        <section className={s.sec}>
          <div className={h.wrap}>
            <div className={s.head}>
              <div><div className={h.label}>Calendar</div><h2>청약 캘린더</h2></div>
            </div>
            <div className={s.calHead}>
              <b>{y}<em>.{String(mo + 1).padStart(2, '0')}</em></b>
              <div className={s.calNav}>
                <button aria-label="이전 달" onClick={() => { setMonth(new Date(y, mo - 1, 1)); setSelDate(null); }}>&larr;</button>
                <button aria-label="다음 달" onClick={() => { setMonth(new Date(y, mo + 1, 1)); setSelDate(null); }}>&rarr;</button>
              </div>
            </div>
            <div className={s.cal}>
              {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(d => <div key={d} className={s.dow}>{d}</div>)}
              {Array.from({ length: first }, (_, i) => <div key={`e${i}`} />)}
              {Array.from({ length: days }, (_, i) => {
                const d = new Date(y, mo, i + 1), key = ymd(d), ev = events.get(key);
                const cls = [s.day, ev && s.has, key === today && s.today, key === selKey && s.sel].filter(Boolean).join(' ');
                return (
                  <button key={key} className={cls} onClick={() => ev && setSelDate(key === selKey ? null : d)} disabled={!ev} aria-label={`${key} 청약 일정 ${ev?.length ?? 0}건`}>
                    {i + 1}
                    {ev && <i>{ev.slice(0, 3).map((_, j) => <b key={j} />)}</i>}
                    {key === today && <small>TODAY</small>}
                  </button>
                );
              })}
            </div>
            {selDate && (
              <div className={s.selDay}>
                <h4><span>{selKey.replace(/-/g, '.')} · {selEvents.length}건</span><button onClick={() => setSelDate(null)}>닫기</button></h4>
                <ul>
                  {selEvents.map(({ sub, labels }) => (
                    <li key={sub.HOUSE_MANAGE_NO}>
                      <div style={{ display: 'block' }}><span>{labels.join(' · ')} · {sub.SUBSCRPT_AREA_CODE_NM}</span><b>{sub.HOUSE_NM}</b></div>
                      <div>
                        <Link href={`/subscriptions/${sub.HOUSE_MANAGE_NO}`}>상세보기 →</Link>
                        <a href={applyHomeUrl(sub)} target="_blank" rel="noopener noreferrer">청약홈 ↗</a>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>

        {/* 5. 전체 목록 */}
        <section className={s.sec}>
          <div className={h.wrap}>
            <div className={s.head}>
              <div><div className={h.label}>All Listings</div><h2>전체 청약 목록</h2></div>
              <span className={s.count}>{total.toLocaleString()}<small>TOTAL</small></span>
            </div>
            <nav className={s.tabs} aria-label="유형">
              {TABS.map(([t, label]) => (
                <Link key={t} href={t ? `/subscriptions/${t}` : '/subscriptions'} className={(defaultType ?? '') === t ? s.on : ''}>{label}</Link>
              ))}
            </nav>
            <div className={s.filters}>
              <input type="search" placeholder="단지명 또는 주소 검색" value={search} onChange={e => setSearch(e.target.value)} aria-label="검색" />
              <select value={region} onChange={e => { setRegion(e.target.value); setPage(1); }} aria-label="지역">
                <option value="">전체 지역</option>
                {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
              <select value={type} onChange={e => { setType(e.target.value as Type); setPage(1); }} aria-label="유형">
                <option value="">전체 유형</option>
                <option value="apt">아파트</option>
                <option value="officetel">오피스텔</option>
                <option value="remndr">무순위/잔여</option>
              </select>
            </div>
            <p className={s.summary}>총 <b>{total.toLocaleString()}</b>건 중 <b>{shown.length}</b>건 표시</p>
            {loading ? <p className={s.loading}>Loading</p>
              : shown.length ? <div className={s.cards}>{shown.map(x => <Card key={x.HOUSE_MANAGE_NO} sub={x} thumb={thumbs[x.HOUSE_MANAGE_NO]} />)}</div>
              : <p className={s.empty}>검색 조건에 맞는 청약이 없습니다.</p>}
            {!loading && totalPages > 1 && (
              <div className={s.pager}>
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} aria-label="이전">&larr;</button>
                {pages.map(n => <button key={n} className={n === page ? s.on : ''} onClick={() => setPage(n)}>{n}</button>)}
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} aria-label="다음">&rarr;</button>
              </div>
            )}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
