// YamokConsultSection 복제 — 상담 신청 + 실시간 접수 현황 2단 섹션 (모바일 세로 스택)
import TplConsultForm from './TplConsultForm'
import TplLiveRequests from './TplLiveRequests'

interface Props {
  pageId: string
  slug: string
  agentCode?: string
  agentName?: string
  liveRequests: boolean
}

export default function TplConsultSection({ pageId, slug, agentCode, agentName, liveRequests }: Props) {
  return (
    <div className={`max-w-[1200px] mx-auto grid ${liveRequests ? 'lg:grid-cols-2' : 'lg:max-w-[600px]'} gap-5 lg:gap-6 items-stretch`}>
      <TplConsultForm pageId={pageId} slug={slug} agentCode={agentCode} agentName={agentName} />
      {liveRequests && <TplLiveRequests pageId={pageId} />}
    </div>
  )
}
