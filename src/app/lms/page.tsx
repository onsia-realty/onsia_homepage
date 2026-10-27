import type { Metadata } from 'next';
import LmsPage from '@/components/lms/LmsPage';

const LMS_TITLE = '타겟 LMS 문자광고 | 온시아 ONSIA';
const LMS_DESC = '통신사·카드사·포인트사 광고 수신동의 1,000만 명 이상의 데이터에서 분양 현장의 잠재 고객만 골라 보내는 타겟 LMS 문자광고. 타겟 설계·문안·랜딩·리포트까지 온시아가 함께합니다.';

export const metadata: Metadata = {
  title: { absolute: LMS_TITLE },
  description: LMS_DESC,
  alternates: { canonical: 'https://www.onsia.co.kr/lms' },
  openGraph: { title: LMS_TITLE, description: LMS_DESC, url: 'https://www.onsia.co.kr/lms' },
  twitter: { title: LMS_TITLE, description: '분양 현장에 맞는 사람에게만, 문자 한 통. 온시아 타겟 LMS 문자광고.' },
};

export default function Lms() {
  return <LmsPage />;
}
