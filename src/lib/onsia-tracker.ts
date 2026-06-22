/**
 * onsia.city → tracker.onsia.city 슬림 클라이언트
 *
 * 부정클릭 트래커(D:/claude/부정클릭/tracker)의 /api/analytics/{session,click}만 호출.
 * 핑거프린트 + dwell/scroll/mouse 추적은 client-side에서 수행.
 *
 * 사용: FraudGate.tsx 컨텍스트에서 인스턴스 생성, onStateChange로 tier 구독.
 */

export type FraudTier = 'ok' | 'warn' | 'warn-high' | 'block'

export interface OnsiaTrackerConfig {
  endpoint: string    // 트래커 서버 base URL (예: https://tracker.onsia.city)
  siteId: string      // landingSite slug (예: 'yamok-grandhill')
  agentCode?: string  // ?a= URL 파라미터 — 있으면 fraud check 우회 (phone_click으로 다운그레이드)
  debug?: boolean
}

export interface ReportClickOpts {
  targetText?: string
  targetUrl?: string
  targetElement?: string
  clickX?: number
  clickY?: number
}

export interface ClickResponse {
  clickId: string | null
  isFraud: boolean
  riskScore: number
  action: 'allow' | 'warn' | 'block'
  reasons: string[]
}

export interface FraudState {
  tier: FraudTier
  riskScore: number
  reasons: string[]
}

type StateListener = (state: FraudState) => void

// agent 모드일 때 다운그레이드되는 타입 (서버 smartFraudCheck 제외)
const AGENT_DOWNGRADE_TYPE = 'phone_click'

export class OnsiaFraudTracker {
  private config: OnsiaTrackerConfig
  private sessionId: string | null = null
  private fingerprint: string | null = null
  private initialized = false
  private listeners: StateListener[] = []
  private state: FraudState = { tier: 'ok', riskScore: 0, reasons: [] }

  // 행동 추적
  private pageEnterTime = Date.now()
  private maxScrollDepth = 0
  private mouseMovements = 0
  private scrollEvents = 0
  private clicks = 0
  private scrollHandler?: () => void
  private mouseHandler?: () => void

  // 페이지뷰(체류시간) 추적
  private pageViewId: string | null = null
  private pvFinalized = false
  private visibilityHandler?: () => void
  private pagehideHandler?: () => void

  constructor(config: OnsiaTrackerConfig) {
    this.config = config
  }

  // ============================================
  // 초기화
  // ============================================

  async init(): Promise<void> {
    if (this.initialized || typeof window === 'undefined') return
    this.initialized = true

    try {
      this.fingerprint = await this.generateFingerprint()
      this.setupBehaviorTracking()
      await this.createSession()
    } catch (e) {
      this.log('init failed', e)
    }
  }

  destroy(): void {
    // SPA 언마운트/이동 시에도 체류시간 확정
    this.finalizePageView('navigate')
    if (this.scrollHandler) window.removeEventListener('scroll', this.scrollHandler)
    if (this.mouseHandler) document.removeEventListener('mousemove', this.mouseHandler)
    if (this.visibilityHandler) document.removeEventListener('visibilitychange', this.visibilityHandler)
    if (this.pagehideHandler) window.removeEventListener('pagehide', this.pagehideHandler)
    this.listeners = []
  }

  // ============================================
  // 외부 API
  // ============================================

  onStateChange(cb: StateListener): () => void {
    this.listeners.push(cb)
    cb(this.state) // 현재 상태 즉시 전달
    return () => {
      this.listeners = this.listeners.filter((l) => l !== cb)
    }
  }

  getState(): FraudState {
    return this.state
  }

  async reportClick(
    eventType: 'cta_click' | 'ad_click' | 'phone_click' | 'inquiry_submit' | 'external_link',
    opts: ReportClickOpts = {}
  ): Promise<ClickResponse | null> {
    if (!this.sessionId || !this.fingerprint) {
      // init 안 끝났거나 차단됨 — 부정클릭 아님으로 통과
      return null
    }

    this.clicks += 1

    // agent 모드면 fraud check 우회 (직원 본인 명함 정상 사용)
    const actualType = this.config.agentCode ? AGENT_DOWNGRADE_TYPE : eventType

    const utm = this.getUTMParams()
    const dwellMs = Date.now() - this.pageEnterTime

    try {
      const res = await fetch(`${this.config.endpoint}/api/analytics/click`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: this.sessionId,
          landingSiteSlug: this.config.siteId,
          eventType: actualType,
          targetUrl: opts.targetUrl,
          targetElement: opts.targetElement,
          targetText: opts.targetText,
          clickX: opts.clickX,
          clickY: opts.clickY,
          viewportWidth: window.innerWidth,
          viewportHeight: window.innerHeight,
          adSource: utm.utm_source,
          adCampaign: utm.utm_campaign,
          adGroup: utm.utm_content,
          adKeyword: utm.utm_term,
          pageUrl: window.location.href,
          dwellTimeBeforeClick: Math.round(dwellMs / 1000),
          scrollDepthBeforeClick: this.maxScrollDepth,
          mouseMovementsBeforeClick: this.mouseMovements,
        }),
        keepalive: true,
      })

      if (!res.ok) {
        this.log('reportClick non-ok', res.status)
        return null
      }

      const data = (await res.json()) as ClickResponse
      this.applyClickResponse(data)
      return data
    } catch (e) {
      this.log('reportClick failed', e)
      return null
    }
  }

  // ============================================
  // 내부: 세션 생성
  // ============================================

  private async createSession(): Promise<void> {
    if (!this.fingerprint) return

    const ua = navigator.userAgent
    const utm = this.getUTMParams()
    const referrer = document.referrer
    let referrerDomain: string | undefined
    try {
      if (referrer) referrerDomain = new URL(referrer).hostname
    } catch {}

    try {
      const res = await fetch(`${this.config.endpoint}/api/analytics/session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fingerprint: this.fingerprint,
          deviceType: detectDeviceType(ua),
          browser: detectBrowser(ua),
          browserVersion: '',
          os: detectOS(ua),
          osVersion: '',
          screenWidth: screen.width,
          screenHeight: screen.height,
          userAgent: ua,
          referrer: referrer || undefined,
          referrerDomain,
          utmSource: utm.utm_source || undefined,
          utmMedium: utm.utm_medium || undefined,
          utmCampaign: utm.utm_campaign || undefined,
          utmContent: utm.utm_content || undefined,
          utmTerm: utm.utm_term || undefined,
          landingSiteSlug: this.config.siteId,
        }),
      })

      if (res.status === 403) {
        // 블랙리스트 — 즉시 3단계 진입
        this.setState({ tier: 'block', riskScore: 100, reasons: ['이미 차단된 사용자입니다.'] })
        return
      }

      if (!res.ok) {
        this.log('session non-ok', res.status)
        return
      }

      const data = (await res.json()) as { sessionId: string; isBlocked: boolean }
      this.sessionId = data.sessionId
      if (data.isBlocked) {
        this.setState({ tier: 'block', riskScore: 100, reasons: ['차단된 세션입니다.'] })
        return
      }
      // 세션 정상 → 페이지뷰 기록 시작 (체류시간 측정의 진입점)
      await this.createPageView()
    } catch (e) {
      this.log('createSession failed', e)
    }
  }

  // ============================================
  // 내부: 페이지뷰(체류시간) 기록
  // ============================================

  private async createPageView(): Promise<void> {
    if (!this.sessionId) return
    try {
      const res = await fetch(`${this.config.endpoint}/api/analytics/pageview`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: this.sessionId,
          landingSiteSlug: this.config.siteId,
          path: window.location.pathname,
          fullUrl: window.location.href,
          title: document.title,
        }),
      })
      if (!res.ok) {
        this.log('pageview POST non-ok', res.status)
        return
      }
      const data = (await res.json()) as { pageViewId: string | null }
      this.pageViewId = data.pageViewId
    } catch (e) {
      this.log('createPageView failed', e)
    }
  }

  // 이탈 시 1회만 체류시간/스크롤 확정 (세션 totalDwellTime 중복 가산 방지)
  private finalizePageView(exitType: 'hidden' | 'unload' | 'navigate'): void {
    if (this.pvFinalized || !this.pageViewId) return
    this.pvFinalized = true

    const dwellTime = Math.round((Date.now() - this.pageEnterTime) / 1000)
    try {
      fetch(`${this.config.endpoint}/api/analytics/pageview`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pageViewId: this.pageViewId,
          dwellTime,
          scrollDepth: this.maxScrollDepth,
          scrollEvents: this.scrollEvents,
          mouseMovements: this.mouseMovements,
          clicks: this.clicks,
          exitType,
        }),
        keepalive: true,
      }).catch((e) => this.log('finalizePageView failed', e))
    } catch (e) {
      this.log('finalizePageView failed', e)
    }
  }

  // ============================================
  // 내부: 클릭 응답 → tier 매핑
  // ============================================

  private applyClickResponse(data: ClickResponse): void {
    let tier: FraudTier = 'ok'
    if (data.action === 'block' || data.riskScore >= 100) tier = 'block'
    else if (data.riskScore >= 80) tier = 'warn-high'
    else if (data.riskScore >= 50) tier = 'warn'

    if (tier !== this.state.tier || data.riskScore !== this.state.riskScore) {
      this.setState({ tier, riskScore: data.riskScore, reasons: data.reasons || [] })
    }
  }

  private setState(next: FraudState): void {
    this.state = next
    this.listeners.forEach((l) => {
      try {
        l(next)
      } catch (e) {
        this.log('listener error', e)
      }
    })
  }

  // ============================================
  // 내부: 행동 추적
  // ============================================

  private setupBehaviorTracking(): void {
    this.scrollHandler = throttle(() => {
      this.scrollEvents += 1
      const scrollTop = window.scrollY || document.documentElement.scrollTop
      const docHeight =
        Math.max(document.body.scrollHeight, document.documentElement.scrollHeight) -
        window.innerHeight
      const depth = docHeight > 0 ? Math.round((scrollTop / docHeight) * 100) : 0
      if (depth > this.maxScrollDepth) this.maxScrollDepth = depth
    }, 200)

    this.mouseHandler = throttle(() => {
      this.mouseMovements += 1
    }, 100)

    window.addEventListener('scroll', this.scrollHandler, { passive: true })
    document.addEventListener('mousemove', this.mouseHandler, { passive: true })

    // 이탈 감지 — 모바일은 beforeunload가 불안정해 visibilitychange/pagehide 사용
    this.visibilityHandler = () => {
      if (document.visibilityState === 'hidden') this.finalizePageView('hidden')
    }
    this.pagehideHandler = () => this.finalizePageView('unload')
    document.addEventListener('visibilitychange', this.visibilityHandler)
    window.addEventListener('pagehide', this.pagehideHandler)
  }

  // ============================================
  // 내부: 핑거프린팅
  // ============================================

  private async generateFingerprint(): Promise<string> {
    const components = {
      canvas: await this.getCanvasFingerprint(),
      webgl: this.getWebGLFingerprint(),
      audio: await this.getAudioFingerprint(),
      screen: `${screen.width}x${screen.height}x${screen.colorDepth}x${window.devicePixelRatio}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language,
      platform: navigator.platform,
      hardwareConcurrency: navigator.hardwareConcurrency || 0,
      deviceMemory: (navigator as unknown as { deviceMemory?: number }).deviceMemory || 0,
      userAgent: navigator.userAgent,
      touchSupport: 'ontouchstart' in window,
    }
    const hash = await sha256(JSON.stringify(components))
    return 'fp_' + hash.substring(0, 32)
  }

  private async getCanvasFingerprint(): Promise<string> {
    try {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) return 'no-canvas'
      canvas.width = 200
      canvas.height = 50
      ctx.textBaseline = 'top'
      ctx.font = '14px Arial'
      ctx.fillStyle = '#f60'
      ctx.fillRect(125, 1, 62, 20)
      ctx.fillStyle = '#069'
      ctx.fillText('ONSIA Tracker 🏠', 2, 15)
      ctx.fillStyle = 'rgba(102, 204, 0, 0.7)'
      ctx.fillText('fingerprint', 4, 17)
      return await sha256(canvas.toDataURL())
    } catch {
      return 'canvas-error'
    }
  }

  private getWebGLFingerprint(): string {
    try {
      const canvas = document.createElement('canvas')
      const gl = (canvas.getContext('webgl') ||
        canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null
      if (!gl) return 'no-webgl'
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info')
      if (!debugInfo) return 'no-debug-info'
      const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL)
      const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
      return `${vendor}|${renderer}`
    } catch {
      return 'webgl-error'
    }
  }

  private async getAudioFingerprint(): Promise<string> {
    try {
      const AC =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
      if (!AC) return 'no-audio'
      const context = new AC()
      const oscillator = context.createOscillator()
      const analyser = context.createAnalyser()
      const gain = context.createGain()
      gain.gain.value = 0
      oscillator.type = 'triangle'
      oscillator.connect(analyser)
      analyser.connect(gain)
      gain.connect(context.destination)
      oscillator.start(0)
      const buffer = new Float32Array(analyser.frequencyBinCount)
      analyser.getFloatFrequencyData(buffer)
      oscillator.disconnect()
      context.close()
      return await sha256(buffer.slice(0, 30).toString())
    } catch {
      return 'audio-error'
    }
  }

  // ============================================
  // 유틸
  // ============================================

  private getUTMParams(): Record<string, string> {
    const p = new URLSearchParams(window.location.search)
    return {
      utm_source: p.get('utm_source') || '',
      utm_medium: p.get('utm_medium') || '',
      utm_campaign: p.get('utm_campaign') || '',
      utm_content: p.get('utm_content') || '',
      utm_term: p.get('utm_term') || '',
    }
  }

  private log(...args: unknown[]): void {
    if (this.config.debug) console.log('[OnsiaFraudTracker]', ...args)
  }
}

// ============================================
// Stand-alone helpers
// ============================================

async function sha256(str: string): Promise<string> {
  const data = new TextEncoder().encode(str)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

function throttle<T extends (...args: unknown[]) => void>(fn: T, ms: number): () => void {
  let last = 0
  return () => {
    const now = Date.now()
    if (now - last < ms) return
    last = now
    fn()
  }
}

function detectDeviceType(ua: string): 'mobile' | 'tablet' | 'desktop' {
  if (/iPad|Tablet/i.test(ua)) return 'tablet'
  if (/Mobi|Android|iPhone|iPod/i.test(ua)) return 'mobile'
  return 'desktop'
}

function detectBrowser(ua: string): string {
  if (/Edg\//i.test(ua)) return 'Edge'
  if (/Chrome/i.test(ua) && !/Edg/i.test(ua)) return 'Chrome'
  if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) return 'Safari'
  if (/Firefox/i.test(ua)) return 'Firefox'
  if (/Whale/i.test(ua)) return 'Whale'
  if (/NAVER/i.test(ua)) return 'NaverApp'
  if (/KAKAOTALK/i.test(ua)) return 'KakaoTalk'
  return 'Other'
}

function detectOS(ua: string): string {
  if (/Windows/i.test(ua)) return 'Windows'
  if (/Mac OS X/i.test(ua) && !/iPhone|iPad/i.test(ua)) return 'macOS'
  if (/Android/i.test(ua)) return 'Android'
  if (/iPhone|iPad|iPod/i.test(ua)) return 'iOS'
  if (/Linux/i.test(ua)) return 'Linux'
  return 'Other'
}
