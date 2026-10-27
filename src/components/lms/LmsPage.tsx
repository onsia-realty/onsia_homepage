'use client';

// 타겟 LMS 문자광고 서비스 페이지. 토큰·패턴은 OnsiaHome 그대로(.label/.head/.btn/.rv, sticky pin + 스크롤 진행도).
import { Fragment, useEffect, useRef } from 'react';
import s from './LmsPage.module.css';
import SiteHeader, { cormorant } from '@/components/onsia-home/SiteHeader';
import SiteFooter from '@/components/onsia-home/SiteFooter';

const STEPS = [
  ['매체사 수신동의 DB', '통신사·카드사·포인트사가 보유한 광고 수신 동의 고객. 매체사 평균 1,000만 명 이상.'],
  ['타겟 추출', '성별·연령·지역은 기본, 통신 이력·카드 결제·주택 유무까지 AI 빅데이터로 초개인화 타겟.'],
  ['메시지 설정', '현장 이미지·문안·URL을 매체별로 세팅하고 테스트 발송까지. 문구는 온시아가 현장에 맞게 작성합니다.'],
  ['발송 · 랜딩 · 리포트', '부킹 일시에 발송, 3영업일 내 리포트. 온시아 랜딩페이지와 방문 추적으로 클릭부터 상담까지 한 번에 봅니다.'],
];

const CHIPS = ['경기 남부 거주', '35~59세', '무주택 · 가구형태', '1년 내 분양 대표번호 수신 이력', '월 카드소비 80만원 이상'];
// 모수 감소 경로: 필터 진행도에 맞춰 인접 값 사이를 로그 보간
const AUDIENCE = [20_000_000, 3_200_000, 640_000, 120_000, 30_000];
// 12×8 점. rank = i*53 mod 96 (0~95 순열) → 필터가 진행될수록 rank 낮은 점부터 사라지고 KEEP 이상(8개)만 남음
const DOTS = Array.from({ length: 96 }, (_, i) => (i * 53) % 96);
const KEEP = 88;

// 스텝 03 예시 문자 2통: [매체 · 시각, 이미지, 제목, 본문]
const MSGS = [
  ['KT 제휴 · 오후 2:00', '/media/lms/msg-hwaseo.jpg', '(광고)[KT제휴] 화서역 호수공원 아너스빌', '수원 권선구 비규제 476세대\n선착순 동호지정 진행 중입니다.\n\n▶ 모델하우스 방문예약\nonsia.co.kr/화서역호수공원아너스빌\n\n무료수신거부 080-000-0000'],
  ['신한카드 제휴 · 오후 6:30', '/media/lms/msg-cheongna.jpg', '(광고)[신한카드] 청라 아크원 푸르지오', '청라국제업무단지 · 분양가상한제 868세대\n관심고객 등록 시 분양 일정을 먼저 안내해 드립니다.\n\n▶ 관심고객 등록\nonsia.co.kr/청라아크원푸르지오\n\n무료수신거부 080-000-0000'],
];

// [영문 라벨, 항목, 강조값]
const FLOW = [['Delivered', '문자 수신', '30,000'], ['Landing', '랜딩 클릭', 'CTR'], ['Leads', '상담 신청 · 부정클릭 필터', '']];

const DATA: [string, [string, string][]][] = [
  ['통신사', [['가입정보', '성별·연령·지역·가구형태'], ['통신정보', '소액결제·수신/발신 이력·웹/앱 사용이력·빈도·주기'], ['IPTV', '채널별 시청이력·사용TV 크기 및 거주 집 평수']]],
  ['카드사', [['가입정보', '성별·연령·지역·사용카드 종류'], ['결제정보', '구매 관심사·특정 업종/경쟁사 결제·월 카드 사용 금액/횟수'], ['가맹점', '단말기 설치 기반 소상공인']]],
  ['포인트사·기타', [['구매정보', '포인트 적립 상품·구매 금액·멤버십 등급'], ['모빌리티', '출발지·목적지·즐겨찾기·차량종류'], ['평가정보', '주택유무·신용점수·대출정보']]],
];

// [분류, [[파일명(/media/lms/logos/*.png), 매체명]]]
const MEDIA: [string, [string, string][]][] = [
  ['통신사', [['skt', 'SK텔레콤'], ['kt', 'KT'], ['lguplus', 'LG U+']]],
  ['카드사', [['kbcard', 'KB국민카드'], ['shinhancard', '신한카드'], ['lottecard', '롯데카드'], ['bccard', 'BC카드'], ['samsungcard', '삼성카드'], ['hanacard', '하나카드']]],
  ['포인트사', [['lpoint', 'L.POINT'], ['okcashbag', 'OK캐쉬백'], ['shinsegae', '신세계포인트'], ['cjone', 'CJ ONE']]],
  ['기타', [['tmap', 'TMAP'], ['nice', 'NICE평가정보'], ['zigbang', '직방'], ['hogangnono', '호갱노노'], ['kakaopay', '카카오페이']]],
];

// [매체, 타겟 조건, 설명]
const CASES = [
  ['통신사', '1년 내 분양 대표번호 송수신 이력', '최근 1년 사이 분양 현장 대표번호와 통화한 고객. 지금 집을 알아보는 사람에게 바로 닿습니다.'],
  ['카드사', '월 카드소비 80만원 이상', '소비 여력이 확인된 고객만 골라, 상품 가격대에 맞는 수요층에 보냅니다.'],
  ['통신사', '현장 반경 거주 + 부동산 앱 사용', '현장 인근에 살면서 부동산 앱을 쓰는 고객. 갈아타기·실거주 수요를 겨냥합니다.'],
];

const PROC = [
  ['집행신청', '가능 여부·모수·일정 확인'],
  ['타겟 추출', '현장 맞춤 조건 설계·모수 추출'],
  ['메시지 설정', '문안·테스트 발송'],
  ['발송·리포트', '3영업일 내 리포트'],
];

const QA = [
  ['타겟 문자광고, 불법 아닌가요?', '매체사에서 미리 광고 수신에 동의한 고객만 대상으로 하는 합법 광고입니다. (광고) 표기·무료수신거부를 포함해 정보통신망법 기준을 지켜 발송합니다.'],
  ['타겟을 어떻게 잡아야 할지 모르겠어요', '현장 입지·상품에 맞는 타겟 조건을 온시아가 설계해 드립니다.'],
  ['3~4일 안에 긴급 발송도 되나요?', '가능합니다. 다만 매체사·타겟 선택이 제한될 수 있어 빠른 문의를 권합니다.'],
  ['광고 문구도 써 주나요?', '네. 현장 정보와 이벤트만 주시면 문안과 랜딩까지 함께 준비합니다.'],
];

const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const smooth = (x: number) => { x = clamp(x); return x * x * (3 - 2 * x); };
const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function LmsPage() {
  const root = useRef<HTMLDivElement>(null);
  const story = useRef<HTMLElement>(null);
  const cnt = useRef<HTMLElement>(null);
  const dots = useRef<HTMLDivElement>(null);
  const chips = useRef<HTMLDivElement>(null);
  const thread = useRef<HTMLDivElement>(null);
  const flow = useRef<HTMLDivElement>(null);
  const ind = useRef<HTMLDivElement>(null);
  const ibar = useRef<HTMLElement>(null);

  // scroll story: 진행도 p(0→1)를 4스텝으로 나눠 스타일 직접 변경 (React state 없음)
  useEffect(() => {
    const st = story.current!;
    const steps = Array.from(st.querySelectorAll<HTMLElement>(`.${s.step}`)), N = steps.length;
    const ds = Array.from(dots.current!.children) as HTMLElement[];
    const cs = Array.from(chips.current!.children) as HTMLElement[];
    const fs = Array.from(flow.current!.children) as HTMLElement[];
    const nums = Array.from(ind.current!.querySelectorAll('span'));
    const th = thread.current!, list = th.firstElementChild as HTMLElement, ms = Array.from(list.children) as HTMLElement[];
    let shift = -1; // 두 번째 문자가 보이도록 스레드를 올릴 거리 (resize 시 재계산)
    // 스텝 내부 연출 (l = 해당 스텝 안에서의 진행도 0→1)
    const draw = [
      () => {},
      (l: number) => {
        const f = clamp((l - 0.08) / 0.72), c = f * CHIPS.length;
        cs.forEach((el, j) => el.classList.toggle(s.on, c > j + 0.2));
        const x = f * (AUDIENCE.length - 1), k = Math.min(AUDIENCE.length - 2, Math.floor(x));
        const v = AUDIENCE[k] * Math.pow(AUDIENCE[k + 1] / AUDIENCE[k], x - k);
        cnt.current!.textContent = (Math.round(v / 1000) * 1000).toLocaleString('ko-KR');
        ds.forEach((d, i) => { d.style.opacity = DOTS[i] >= KEEP ? '1' : String(smooth((DOTS[i] / 96 - f * 0.97) / 0.05 + 1)); });
      },
      (l: number) => {
        // 1통 도착(0.08~0.3) → 스레드 위로 → 2통 도착(0.46~0.68)
        if (shift < 0) shift = Math.max(0, list.scrollHeight - th.clientHeight);
        const a = [smooth((l - 0.08) / 0.22), smooth((l - 0.46) / 0.22)];
        ms.forEach((m, k) => {
          m.style.opacity = String(a[k]);
          m.style.transform = `translateY(${((1 - a[k]) * 24).toFixed(1)}px) scale(${(0.94 + a[k] * 0.06).toFixed(3)})`;
          m.classList.toggle(s.on, a[k] > 0.98);
        });
        list.style.transform = `translateY(${(-shift * smooth((l - 0.4) / 0.24)).toFixed(1)}px)`;
      },
      (l: number) => fs.forEach((el, k) => el.classList.toggle(s.on, l > 0.12 + k * 0.22)),
    ];
    if (reduced()) { draw.forEach(d => d(1)); return; } // 고정 없이 4스텝을 세로로: 각 스텝 완료 상태

    let tick = false, shown = -1;
    const paint = (p: number) => {
      if (Math.abs(p - shown) < 1e-4) return; shown = p;
      steps.forEach((el, i) => {
        const l = p * N - i;
        const op = Math.min(i ? smooth(l / 0.12) : 1, i < N - 1 ? smooth((1 - l) / 0.12) : 1);
        el.style.opacity = String(op);
        el.style.transform = `translateY(${((0.5 - clamp(l)) * 3).toFixed(2)}vh)`;
        if (op > 0) draw[i](clamp(l));
      });
      const cur = Math.min(N - 1, Math.floor(p * N));
      nums.forEach((el, i) => el.classList.toggle(s.on, i === cur));
      ibar.current!.style.transform = `scaleX(${p})`;
    };
    const onResize = () => { shift = -1; shown = -1; read(); };
    const read = () => {
      tick = false;
      const r = st.getBoundingClientRect();
      paint(clamp(-r.top / (r.height - innerHeight)));
    };
    const onScroll = () => { if (!tick) { tick = true; requestAnimationFrame(read); } };
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onResize);
    read();
    return () => { removeEventListener('scroll', onScroll); removeEventListener('resize', onResize); };
  }, []);

  // scroll reveal (60ms stagger within each section)
  useEffect(() => {
    const r = root.current!;
    r.querySelectorAll<HTMLElement>(`.${s.sec}`).forEach(sec => sec.querySelectorAll<HTMLElement>(`.${s.rv}`).forEach((el, i) => { el.style.transitionDelay = i * 60 + 'ms'; }));
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add(s.in); io.unobserve(e.target);
    }), { threshold: .12, rootMargin: '0px 0px -6% 0px' });
    r.querySelectorAll(`.${s.rv}`).forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  const dotGrid = (ref?: typeof dots) => (
    <div ref={ref} className={s.dots} aria-hidden="true">
      {DOTS.map((r, i) => <i key={i} className={ref && r >= KEEP ? s.keep : undefined}></i>)}
    </div>
  );

  // 스텝별 우측 비주얼
  const VIS = [
    <video key="db" className={s.film} src="/media/home/lms.mp4" poster="/media/home/lms_poster.jpg" autoPlay muted loop playsInline aria-hidden="true"></video>,
    <Fragment key="target">
      <div className={s.cnt}><b ref={cnt}>20,000,000</b><small>Target Audience</small></div>
      {dotGrid(dots)}
      <div ref={chips} className={s.chips}>{CHIPS.map(c => <span key={c}>{c}</span>)}</div>
    </Fragment>,
    <div key="msg" className={s.phoneWrap} aria-hidden="true">
      <div className={s.phone}>
        <div className={s.screen}>
          <div className={s.sbar}><span>9:41</span><i className={s.island}></i><span>5G</span></div>
          <div className={s.who}><b>ONSIA</b><small>LMS · MMS</small></div>
          <div ref={thread} className={s.thread}>
            <div className={s.msgs}>
              {MSGS.map(([meta, img, title, body]) => (
                <div key={title} className={s.msg}>
                  <span className={s.meta}>{meta}</span>
                  <div className={s.bubble}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img} alt="" loading="lazy" />
                    <div><b>{title}</b>{body}</div>
                  </div>
                  <span className={s.ok}>수신동의 고객 발송</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>,
    <div key="send" ref={flow} className={s.flow}>
      {FLOW.map(([en, t, v]) => <div key={en}><small>{en}</small><b>{t}{v && <em>{v}</em>}</b></div>)}
    </div>,
  ];

  return (
    <div ref={root} className={`${s.root} ${cormorant.variable}`}>
      <SiteHeader />

      {/* 1. HERO */}
      <section className={s.hero}>
        <div className={s.wrap}>
          <div className={`${s.label} ${s.rv}`}>Target LMS</div>
          <h1 className={s.rv}>분양 현장에 맞는 사람에게만,<br />문자 한 통</h1>
          <p className={s.rv}>통신사·카드사·포인트사에서 광고 수신에 동의한 1,000만 명 이상의 데이터 중, 우리 현장의 잠재 고객만 골라 LMS를 보냅니다.</p>
          <div className={`${s.btns} ${s.rv}`}><a href="tel:1668-5257" className={s.btn}>도입 문의 1668-5257</a></div>
        </div>
      </section>

      {/* 2. SCROLL STORY — 500vh 안에 100dvh 스테이지 고정, 4스텝 전환 */}
      <section ref={story} className={s.story} aria-label="타겟 LMS 발송 과정">
        <div className={s.stage}>
          {STEPS.map(([t, d], i) => (
            <div key={t} className={s.step}>
              <div className={s.txt}>
                <div className={s.sn}><small>Step</small>{String(i + 1).padStart(2, '0')}</div>
                <h3>{t}</h3>
                <p>{d}</p>
              </div>
              <div className={s.vis}>{VIS[i]}</div>
            </div>
          ))}
          <div ref={ind} className={s.ind} aria-hidden="true">
            {STEPS.map((_, i) => <span key={i} className={i ? undefined : s.on}>{String(i + 1).padStart(2, '0')}</span>)}
            <i><b ref={ibar}></b></i>
          </div>
        </div>
      </section>

      {/* 3. TARGETING DATA */}
      <section className={s.sec}>
        <div className={s.wrap}>
          <div className={s.head}>
            <div className={s.rv}><div className={s.label}>Targeting Data</div><h2>성별·연령을 넘어,<br />생활 데이터로 고릅니다</h2></div>
          </div>
          <div className={s.data}>
            {DATA.map(([h, items], i) => (
              <div key={h} className={s.rv}>
                <span className={s.num}>{String(i + 1).padStart(2, '0')}</span>
                <h3>{h}</h3>
                <dl>{items.map(([dt, dd]) => <div key={dt}><dt>{dt}</dt><dd>{dd}</dd></div>)}</dl>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. MEDIA — 분류별 로고 (원본 그대로 흰 카드 위, "파트너" 표현 대신 집행 가능 매체) */}
      <section className={s.sec}>
        <div className={s.wrap}>
          <div className={s.head}>
            <div className={s.rv}><div className={s.label}>Media</div><h2>통신 3사부터<br />카드·포인트·부동산 앱까지</h2></div>
          </div>
          {MEDIA.map(([group, items]) => (
            <div key={group} className={`${s.mediaRow} ${s.rv}`}>
              <h3>{group}</h3>
              <ul className={s.media}>
                {items.map(([f, n]) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <li key={f}><img src={`/media/lms/logos/${f}.png`} alt={n} loading="lazy" /></li>
                ))}
              </ul>
            </div>
          ))}
          <p className={`${s.note} ${s.rv}`}>매체별 보유 회원·단가·최소 발송 건수는 상담 시 안내합니다.<br />각 로고의 상표권은 해당 회사에 있으며, 매체 집행은 공식 대행 경로를 통해 진행됩니다.</p>
        </div>
      </section>

      {/* 5. CASES */}
      <section className={s.sec}>
        <div className={s.wrap}>
          <div className={s.head}>
            <div className={s.rv}><div className={s.label}>Cases</div><h2>분양 집행 예시</h2></div>
          </div>
          <div className={s.cases}>
            {CASES.map(([m, t, d], i) => (
              <div key={t} className={s.rv}>
                <small>Case {String(i + 1).padStart(2, '0')} &middot; {m}</small>
                <h3>{t}</h3>
                <p>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. PROCESS */}
      <section className={s.sec}>
        <div className={s.wrap}>
          <div className={s.head}>
            <div className={s.rv}><div className={s.label}>Process</div><h2>진행 절차</h2></div>
          </div>
          <ol className={s.proc}>
            {PROC.map(([t, d], i) => (
              <li key={t} className={s.rv}><b>{String(i + 1).padStart(2, '0')}</b><h3>{t}</h3><p>{d}</p></li>
            ))}
          </ol>
          <p className={`${s.note} ${s.rv}`}>평균 약 1주 소요(영업일 기준)</p>
        </div>
      </section>

      {/* 7. Q&A */}
      <section className={s.sec}>
        <div className={s.wrap}>
          <div className={s.head}>
            <div className={s.rv}><div className={s.label}>Q&amp;A</div><h2>자주 묻는 질문</h2></div>
          </div>
          <div className={`${s.qa} ${s.rv}`}>
            {QA.map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}
          </div>
        </div>
      </section>

      {/* 8. CONTACT */}
      <section className={`${s.sec} ${s.cta}`} id="contact">
        <div className={s.wrap}>
          <div className={`${s.label} ${s.rv}`}>Contact</div>
          <h2 className={s.rv}>다음 분양,<br />타겟부터 다르게</h2>
          <div className={`${s.btns} ${s.rv}`}>
            <a href="tel:1668-5257" className={s.btn}>현장 마케팅 문의</a>
            <a href="tel:1555-1245" className={s.btn}>제휴 문의</a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
