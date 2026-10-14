'use client';

// Shared site footer, extracted from OnsiaHome.
import s from './OnsiaHome.module.css';

export default function SiteFooter() {
  return (
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
        {/* 시안용 빈 링크: 실제 경로가 생기면 href만 바꾸면 됨 */}
        <div className={s.copy}><span>&copy; 2026 ONSIA. ALL RIGHTS RESERVED.</span><a href="#" onClick={e => e.preventDefault()}>Admin</a></div>
      </div>
    </footer>
  );
}
