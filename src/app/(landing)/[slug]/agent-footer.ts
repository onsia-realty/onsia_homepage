/**
 * 직원(agent) 페이지 전용 푸터 사업주체 표기
 *
 * 배경: agent 페이지는 명함 OG를 깔끔하게 하려고 푸터의 사업정보를 통째로 숨긴다.
 * 그런데 네이버/카카오 광고 심사는 시행사·시공사·분양대행사 표기를 요구하므로,
 * 광고를 집행하는 직원의 페이지에만 소속 대행사 기준으로 푸터를 되살린다.
 *
 * 소속 대행사가 직원마다 달라 slug:code 단위로 관리한다. (키가 없으면 기존대로 숨김)
 */
export interface AgentFooterInfo {
  /** 회사명 아래 한 줄씩 노출되는 사업주체 정보 */
  lines: string[]
  /** 광고 심사용 고지사항 (DB business_info.disclaimer 대신 사용) */
  disclaimer: string
}

const YAMOK_DISCLAIMER =
  '※ 본 홈페이지에 사용된 CG, 사진, 일러스트 등은 소비자의 이해를 돕기 위한 것으로 실제와 차이가 있을 수 있습니다.\n' +
  '※ 본 홈페이지에 표기된 사항은 인허가 및 건축허가 변경 승인에 따라 변경될 수 있으며, 제작과정에서 오탈자 혹은 수치표기 오류가 있을 수 있으므로 자세한 사항은 상기 번호로 문의하시기 바랍니다.'

export const AGENT_FOOTERS: Record<string, AgentFooterInfo> = {
  'yamok-grandhill:ys': {
    lines: [
      '시행 비봉지역주택조합　|　시공 서희건설',
      '분양대행 사람과사람　|　사업자등록번호 696-02-02496　|　대표 조도화',
      '경기도 수원시 권선구 서둔동 361-1　|　분양문의 010-3878-3119',
    ],
    disclaimer: YAMOK_DISCLAIMER,
  },
}

export function getAgentFooter(slug: string, agentCode?: string): AgentFooterInfo | undefined {
  return agentCode ? AGENT_FOOTERS[`${slug}:${agentCode}`] : undefined
}
