'use client';

import Link from 'next/link';
import { useState, useEffect, useMemo } from 'react';
import KakaoMap from '@/components/map/KakaoMap';
import type { CheongyakProperty } from '@/lib/cheongyakApi';
import h from '@/components/onsia-home/OnsiaHome.module.css';
import s from '../sub.module.css';
import SiteHeader, { cormorant } from '@/components/onsia-home/SiteHeader';
import SiteFooter from '@/components/onsia-home/SiteFooter';
import { applyHomeUrl, Thumb } from '../SubscriptionListClient';

interface SubscriptionWithStatus extends CheongyakProperty {
  status: string;
  statusText: string;
  dDay: number | null;
}

interface Props {
  subscription: SubscriptionWithStatus;
  coords: { lat: number; lng: number } | null;
}

/* ---------- API 응답 타입 (라우트와 1:1 일치) ---------- */

interface HousingType {
  type: string;
  modelNo: string;
  supplyArea: string;
  totalHouseholds: number;
  generalHouseholds: number;
  specialHouseholds: number;
  topPrice: number;
  pricePerPyeong: number;
}

interface CompetitionEntry {
  type: string;
  modelNo: string;
  supplyHouseholds: number;
  regions: { region: string; regionCode: string; requestCount: number; competitionRate: number | string; rank: number }[];
}

interface SpecialSupplyEntry {
  type: string;
  totalSpecial: number;
  multichild: number;
  newlywed: number;
  firstLife: number;
  elderly: number;
  institution: number;
  newborn: number;
  youth: number;
  status: string;
}

interface DetailData {
  summary: { totalHouseholds: number; totalGeneral: number; totalSpecial: number; avgPrice: number; avgPricePerPyeong: number; typeCount: number };
  housingTypes: HousingType[];
  competition: CompetitionEntry[];
  specialSupply: SpecialSupplyEntry[];
}

interface ImagesData {
  hasImages: boolean;
  categories: { category: string; label: string; images: { url: string; name: string }[] }[];
  pdfUrl: string | null;
  totalImages: number;
}

interface CompareComplex {
  name: string; dong: string; avgPrice: number; avgPricePerPyeong: number; avgArea: number;
  recentDate: string; count: number; buildYear: string; priceDiff: number; priceDiffPercent: number;
}

interface CompareData {
  complexes: CompareComplex[];
  summary: { avgPricePerPyeong: number; marketDiffPercent?: number; marketDiffText?: string };
}

/* ---------- 포맷 유틸 ---------- */

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return '-';
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
}

function formatMoveInDate(ymStr: string | null): string {
  if (!ymStr || ymStr.length !== 6) return '-';
  return `${ymStr.substring(0, 4)}년 ${parseInt(ymStr.substring(4, 6), 10)}월`;
}

// 만원 단위 → "N억 N만"
function formatPrice(price: number): string {
  if (!price) return '-';
  if (price >= 10000) {
    const uk = Math.floor(price / 10000), man = price % 10000;
    return man === 0 ? `${uk}억` : `${uk}억 ${man.toLocaleString()}만`;
  }
  return `${price.toLocaleString()}만`;
}

function formatPricePerPyeong(p: number): string {
  if (!p) return '-';
  return p >= 10000 ? `${(p / 10000).toFixed(1)}억` : `${p.toLocaleString()}만`;
}

const sqmToPyeong = (sqm: number) => (sqm / 3.3058).toFixed(0);

// 주택형 코드에서 전용면적 추출 (예: "084.8950A" → 84.90)
function extractArea(typeName: string): number {
  const m = typeName.match(/^(\d+)\.?(\d*)/);
  return m ? parseFloat(`${m[1]}.${m[2] || '0'}`) : 0;
}

const dday = (n: number | null) => n === null ? '' : n === 0 ? 'D-DAY' : n > 0 ? `D-${n}` : `D+${-n}`;

export default function SubscriptionDetailClient({ subscription, coords }: Props) {
  const id = subscription.HOUSE_MANAGE_NO;

  const [detail, setDetail] = useState<DetailData | null>(null);
  const [images, setImages] = useState<ImagesData | null>(null);
  const [compare, setCompare] = useState<CompareData | null>(null);
  const [imagesLoading, setImagesLoading] = useState(true);
  const [thumb, setThumb] = useState<string | null>(null); // 갤러리 없을 때 분양 홈페이지에서 해석한 대표 이미지
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);

  const applyUrl = applyHomeUrl(subscription);

  // 이미지 로드
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setImagesLoading(true);
      try {
        const res = await fetch(`/api/subscriptions/${id}/images`);
        const json = await res.json();
        if (!cancelled && json.success) setImages(json.data);
      } catch (e) {
        console.error('이미지 로드 실패:', e);
      } finally {
        if (!cancelled) setImagesLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [id]);

  // 상세(주택형/경쟁률/특별공급) → 그 평당가로 시세비교 순차 로드
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const detailRes = await fetch(`/api/subscriptions/${id}/detail`);
        const detailJson = await detailRes.json();
        let ppp = 0;
        if (!cancelled && detailJson.success && detailJson.data) {
          setDetail(detailJson.data);
          ppp = detailJson.data.summary?.avgPricePerPyeong || 0;
        }
        const address = subscription.HSSPLY_ADRES || '';
        if (address) {
          const compareRes = await fetch(`/api/subscriptions/${id}/compare?address=${encodeURIComponent(address)}&pricePerPyeong=${ppp}`);
          const compareJson = await compareRes.json();
          if (!cancelled && compareJson.success && compareJson.data) setCompare(compareJson.data);
        }
      } catch (e) {
        console.error('상세 데이터 로드 실패:', e);
      }
    })();
    return () => { cancelled = true; };
  }, [id, subscription.HSSPLY_ADRES]);

  // 특별공급 집계 (타입별 합산)
  const specialCategories = useMemo(() => {
    if (!detail?.specialSupply?.length) return [];
    const keys = [['multichild', '다자녀가구'], ['newlywed', '신혼부부'], ['firstLife', '생애최초'], ['elderly', '노부모부양'], ['institution', '기관추천'], ['newborn', '신생아'], ['youth', '청년']] as const;
    return keys
      .map(([k, label]) => ({ label, value: detail.specialSupply.reduce((a, x) => a + (x[k] || 0), 0) }))
      .filter(c => c.value > 0);
  }, [detail]);
  const specialTotal = specialCategories.reduce((a, c) => a + c.value, 0);

  const hasImages = !!images?.hasImages && images.categories.length > 0;

  // 갤러리가 비어 있으면 대표 이미지(사업개요/og:image) 조회
  useEffect(() => {
    if (imagesLoading || hasImages) return;
    let cancelled = false;
    fetch(`/api/subscriptions/thumbnails?ids=${id}`).then(r => r.json())
      .then(j => { if (!cancelled) setThumb(j.data?.[id] ?? null); })
      .catch(e => console.error('대표 이미지 로드 실패:', e));
    return () => { cancelled = true; };
  }, [id, imagesLoading, hasImages]);

  const heroImage =
    images?.categories.find(c => c.category === 'gallery')?.images[0]?.url ||
    images?.categories.find(c => c.category === 'location')?.images[0]?.url ||
    images?.categories.find(c => c.category === 'modelhouse')?.images[0]?.url ||
    null;

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) await navigator.share({ title: subscription.HOUSE_NM, url });
      else if (navigator.clipboard) await navigator.clipboard.writeText(url);
    } catch { /* 사용자 취소 등 무시 */ }
  };

  const rate = (r: number | string | undefined) => {
    if (r === undefined || r === null || r === 0) return <span className={s.short}>-</span>;
    const short = typeof r === 'string' && r.includes('미달');
    return <span className={short ? s.short : undefined}>{typeof r === 'number' ? `${r}:1` : r}</span>;
  };

  return (
    <div className={`${h.root} ${cormorant.variable}`}>
      <SiteHeader />
      <main className={s.page}>
        {/* 이미지 확대 */}
        {selectedImage && (
          <div className={s.modal} onClick={() => setSelectedImage(null)}>
            <button onClick={() => setSelectedImage(null)} aria-label="닫기">&times;</button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={selectedImage} alt="확대 이미지" onClick={e => e.stopPropagation()} />
          </div>
        )}

        {/* 헤더 */}
        <section className={`${s.sec} ${s.hero}`}>
          <div className={h.wrap}>
            <Link href="/subscriptions" className={s.back}>&larr; Back to list</Link>
            <div className={s.dhead}>
              <div>
                <div className={h.label}>{subscription.SUBSCRPT_AREA_CODE_NM} · {subscription.HOUSE_SECD_NM}{subscription.HOUSE_DTL_SECD_NM ? ` · ${subscription.HOUSE_DTL_SECD_NM}` : ''}</div>
                <h1>{subscription.HOUSE_NM}</h1>
                <div className={s.badges}>
                  <span className={`${s.dday}${subscription.status === 'closed' ? ` ${s.closed}` : ''}`}>{subscription.status === 'closed' ? 'CLOSED' : dday(subscription.dDay)}</span>
                  <span className={`${s.status}${subscription.status === 'open' ? ` ${s.open}` : ''}`} style={{ marginTop: 0 }}>{subscription.statusText}</span>
                </div>
                <p className={s.addr}>{subscription.HSSPLY_ADRES}</p>
              </div>
              <div className={s.ctas}>
                <a href={applyUrl} target="_blank" rel="noopener noreferrer" className={`${s.btn} ${s.gold}`}>청약홈 바로가기 ↗</a>
                {subscription.HMPG_ADRES && (
                  <a href={subscription.HMPG_ADRES} target="_blank" rel="noopener noreferrer" className={s.btn}>분양 홈페이지 ↗</a>
                )}
                <button type="button" onClick={() => setIsLiked(v => !v)} className={`${s.btn}${isLiked ? ` ${s.on}` : ''}`} aria-pressed={isLiked}>{isLiked ? '관심 등록됨' : '관심'}</button>
                <button type="button" onClick={handleShare} className={s.btn}>공유</button>
              </div>
            </div>

            <div className={s.kpi}>
              <div><span>Households</span><b>{(detail?.summary?.totalHouseholds || subscription.TOT_SUPLY_HSHLDCO)?.toLocaleString() || '-'}<small>세대</small></b></div>
              <div><span>Reception</span><b>{formatDate(subscription.RCEPT_BGNDE)}</b></div>
              <div><span>Announcement</span><b>{formatDate(subscription.PRZWNER_PRESNATN_DE)}</b></div>
              <div><span>Move-in</span><b>{formatMoveInDate(subscription.MVN_PREARNGE_YM)}</b></div>
            </div>

            {/* 갤러리 없을 때: 분양 홈페이지 대표 이미지 */}
            {!imagesLoading && !hasImages && thumb && (
              <div className={s.block}>
                <h2>단지 이미지</h2>
                <Thumb name={subscription.HOUSE_NM} url={thumb} className={s.heroThumb} />
                <p className={s.credit}>이미지 출처: {subscription.HMPG_ADRES ? <a href={subscription.HMPG_ADRES} target="_blank" rel="noopener noreferrer">분양 홈페이지 ↗</a> : '분양 홈페이지'}</p>
              </div>
            )}

            {/* 이미지 갤러리 */}
            {(imagesLoading || hasImages) && (
              <div className={s.block}>
                <h2>단지 이미지 {images?.totalImages ? <small>{images.totalImages} photos</small> : null}</h2>
                {imagesLoading ? <p className={s.loading}>Loading</p> : (
                  <>
                    {heroImage && (
                      <div className={s.heroImg} onClick={() => setSelectedImage(heroImage)}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={heroImage} alt="단지 대표 이미지" loading="lazy" />
                      </div>
                    )}
                    {images?.categories.map(cat => (
                      <div key={cat.category}>
                        <p className={s.catLabel}>{cat.label}<small>{cat.images.length}</small></p>
                        <div className={s.thumbs}>
                          {cat.images.map((img, i) => (
                            <button key={i} type="button" onClick={() => setSelectedImage(img.url)} aria-label={`${cat.label} ${i + 1} 확대`}>
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={img.url} alt={`${cat.label} ${i + 1}`} loading="lazy" />
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                    {images?.pdfUrl && (
                      <a href={images.pdfUrl} target="_blank" rel="noopener noreferrer" className={s.pdf}>
                        <span>모집공고문<small>PDF</small></span><span>&darr;</span>
                      </a>
                    )}
                  </>
                )}
              </div>
            )}

            {/* 지도 */}
            {coords && (
              <div className={s.block}>
                <h2>위치</h2>
                <div className={s.map}>
                  <KakaoMap
                    center={coords}
                    level={4}
                    markers={[{ id, lat: coords.lat, lng: coords.lng, type: 'apartment', title: subscription.HOUSE_NM, info: subscription.TOT_SUPLY_HSHLDCO ? `${subscription.TOT_SUPLY_HSHLDCO.toLocaleString()}세대` : undefined }]}
                    className="w-full h-full"
                  />
                </div>
                <p className={s.note} style={{ textAlign: 'left' }}>{subscription.HSSPLY_ADRES}</p>
              </div>
            )}

            {/* 주택형별 분양가 */}
            {detail?.housingTypes && detail.housingTypes.length > 0 && (
              <div className={s.block}>
                <h2>주택형별 분양가</h2>
                <div className={s.tableWrap}>
                  <table className={s.table}>
                    <thead><tr><th>Type</th><th>전용면적</th><th>공급면적</th><th>세대</th><th>분양최고가</th><th>평당가</th></tr></thead>
                    <tbody>
                      {detail.housingTypes.map((t, i) => {
                        const area = extractArea(t.type);
                        return (
                          <tr key={`${t.type}-${i}`}>
                            <td>{t.type}</td>
                            <td>{area > 0 ? `${area.toFixed(1)}㎡ (${sqmToPyeong(area)}평)` : '-'}</td>
                            <td>{t.supplyArea ? `${parseFloat(t.supplyArea).toFixed(1)}㎡` : '-'}</td>
                            <td>{t.totalHouseholds.toLocaleString()}<small>일반 {t.generalHouseholds} / 특별 {t.specialHouseholds}</small></td>
                            <td>{formatPrice(t.topPrice)}</td>
                            <td>{formatPricePerPyeong(t.pricePerPyeong)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                {detail.summary?.avgPricePerPyeong > 0 && <p className={s.note}>평균 평당가<b>{formatPricePerPyeong(detail.summary.avgPricePerPyeong)}</b></p>}
              </div>
            )}

            {/* 청약 경쟁률 */}
            {detail?.competition && detail.competition.length > 0 && (
              <div className={s.block}>
                <h2>청약 경쟁률</h2>
                <div className={s.tableWrap}>
                  <table className={s.table} style={{ minWidth: 420 }}>
                    <thead><tr><th>Type</th><th className={s.center}>해당지역</th><th className={s.center}>기타지역</th></tr></thead>
                    <tbody>
                      {detail.competition.map((c, i) => (
                        <tr key={i}>
                          <td>{c.type}</td>
                          <td className={s.center}>{rate(c.regions.find(r => r.region === '해당지역')?.competitionRate)}</td>
                          <td className={s.center}>{rate(c.regions.find(r => r.region === '기타지역')?.competitionRate)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 특별공급 */}
            {specialCategories.length > 0 && (
              <div className={s.block}>
                <h2>특별공급 <small>{specialTotal.toLocaleString()} 세대</small></h2>
                <div className={s.cells}>
                  {specialCategories.map(c => <div key={c.label}><span>{c.label}</span><b>{c.value.toLocaleString()}<small>세대</small></b></div>)}
                </div>
              </div>
            )}

            {/* 청약 일정 */}
            <div className={s.block}>
              <h2>청약 일정</h2>
              <div className={s.cols}>
                <div>
                  <h3>Reception</h3>
                  <ul className={s.list}>
                    <li><span>모집공고일</span><b>{formatDate(subscription.RCRIT_PBLANC_DE)}</b></li>
                    {subscription.SPSPLY_RCEPT_BGNDE && <li className={s.hi}><span>특별공급</span><b>{formatDate(subscription.SPSPLY_RCEPT_BGNDE)} – {formatDate(subscription.SPSPLY_RCEPT_ENDDE)}</b></li>}
                    {subscription.GNRL_RNK1_CRSPAREA_RCPTDE && <li className={s.hi}><span>1순위 (해당지역)</span><b>{formatDate(subscription.GNRL_RNK1_CRSPAREA_RCPTDE)}</b></li>}
                    {subscription.GNRL_RNK2_CRSPAREA_RCPTDE && <li className={s.hi}><span>2순위</span><b>{formatDate(subscription.GNRL_RNK2_CRSPAREA_RCPTDE)}</b></li>}
                    <li><span>청약접수 기간</span><b>{formatDate(subscription.RCEPT_BGNDE)} – {formatDate(subscription.RCEPT_ENDDE)}</b></li>
                  </ul>
                </div>
                <div>
                  <h3>Result &amp; Contract</h3>
                  <ul className={s.list}>
                    <li className={s.hi}><span>당첨자 발표일</span><b>{formatDate(subscription.PRZWNER_PRESNATN_DE)}</b></li>
                    <li><span>계약 기간</span><b>{formatDate(subscription.CNTRCT_CNCLS_BGNDE)} – {formatDate(subscription.CNTRCT_CNCLS_ENDDE)}</b></li>
                    <li><span>입주 예정</span><b>{formatMoveInDate(subscription.MVN_PREARNGE_YM)}</b></li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 주변 시세 비교 */}
            {compare?.complexes && compare.complexes.length > 0 && (
              <div className={s.block}>
                <h2>주변 시세 비교 <small>실거래가 기준</small></h2>
                <div className={s.cmp}>
                  <div><span>분양 평당가</span><b>{formatPricePerPyeong(detail?.summary?.avgPricePerPyeong || 0)}</b></div>
                  <div><span>주변 평균 시세</span><b>{formatPricePerPyeong(compare.summary.avgPricePerPyeong)}</b></div>
                </div>
                {compare.summary.marketDiffText && <p className={s.diff}>{compare.summary.marketDiffText}</p>}
                {compare.complexes.slice(0, 8).map((c, i) => (
                  <div key={i} className={s.cmpRow}>
                    <div><p>{c.name}</p><small>{c.dong} · {c.buildYear}년 · {c.count}건</small></div>
                    <div>
                      <b>{formatPricePerPyeong(c.avgPricePerPyeong)}</b>
                      {c.priceDiffPercent !== 0 && <em>분양가 대비 {c.priceDiffPercent > 0 ? '+' : ''}{c.priceDiffPercent}%</em>}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 사업자 정보 + CTA */}
            <div className={s.block}>
              <h2>사업자 정보</h2>
              <div className={s.cols}>
                <ul className={s.list}>
                  <li><span>사업주체</span><b>{subscription.BSNS_MBY_NM || '-'}</b></li>
                  <li><span>시공사</span><b>{subscription.CNSTRCT_ENTRPS_NM || '-'}</b></li>
                </ul>
                <ul className={s.list}>
                  {subscription.MDHS_TELNO && <li><span>문의전화</span><b><a href={`tel:${subscription.MDHS_TELNO}`}>{subscription.MDHS_TELNO}</a></b></li>}
                  {subscription.HMPG_ADRES && <li><span>홈페이지</span><b><a href={subscription.HMPG_ADRES} target="_blank" rel="noopener noreferrer">{subscription.HMPG_ADRES.replace(/^https?:\/\//, '')}</a></b></li>}
                </ul>
              </div>
              <div className={s.ctas} style={{ marginTop: 48 }}>
                <a href={applyUrl} target="_blank" rel="noopener noreferrer" className={`${s.btn} ${s.gold}`}>청약홈 바로가기 ↗</a>
                {subscription.MDHS_TELNO && <a href={`tel:${subscription.MDHS_TELNO}`} className={s.btn}>문의하기 {subscription.MDHS_TELNO}</a>}
                <Link href="/subscriptions" className={s.btn}>목록으로</Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
