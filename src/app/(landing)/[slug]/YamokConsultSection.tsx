// 야목역 서희스타힐스 그랜드힐 — 상담 신청 + 실시간 접수 현황 2단 섹션
// 왼쪽=간편 상담 신청 폼 / 오른쪽=실시간 접수 현황 티커. 모바일에선 세로 스택(폼 → 티커).
import YamokConsultForm from './YamokConsultForm'
import YamokLiveRequests from './YamokLiveRequests'

interface Props {
  pageId: string
  slug: string
}

export default function YamokConsultSection({ pageId, slug }: Props) {
  return (
    <div className="max-w-[1200px] mx-auto grid lg:grid-cols-2 gap-5 lg:gap-6 items-stretch">
      {/* 왼쪽: 접수(상담 신청) 폼 */}
      <YamokConsultForm pageId={pageId} slug={slug} />
      {/* 오른쪽: 실시간 접수 현황 */}
      <YamokLiveRequests pageId={pageId} />
    </div>
  )
}
