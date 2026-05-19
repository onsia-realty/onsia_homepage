'use client'

import { ReactNode, useCallback, useEffect, useRef, useState } from 'react'
import { OnsiaFraudTracker, type FraudState } from '@/lib/onsia-tracker'
import {
  FraudGateContext,
  FRAUD_NOOP_VALUE,
  type FraudGateContextValue,
} from './FraudGateContext'
import FraudWarningHost from './FraudWarningHost'

interface FraudGateProps {
  siteId: string
  agentCode?: string
  children: ReactNode
}

// 기본 트래커 도메인 (env 누락 시 fallback)
const DEFAULT_TRACKER_URL = 'https://tracker-two-brown.vercel.app'

export default function FraudGate({ siteId, agentCode, children }: FraudGateProps) {
  // 명시적으로 "false" 또는 "0"인 경우만 비활성. 그 외엔 트래커 동작.
  const rawEnabled = (process.env.NEXT_PUBLIC_FRAUD_GATE_ENABLED || '').trim().toLowerCase()
  const enabled = rawEnabled !== 'false' && rawEnabled !== '0' && rawEnabled !== 'off'
  const endpoint = (process.env.NEXT_PUBLIC_FRAUD_TRACKER_URL || '').trim() || DEFAULT_TRACKER_URL

  if (!enabled) {
    return (
      <FraudGateContext.Provider value={FRAUD_NOOP_VALUE}>{children}</FraudGateContext.Provider>
    )
  }

  return (
    <ActiveFraudGate siteId={siteId} agentCode={agentCode} endpoint={endpoint}>
      {children}
    </ActiveFraudGate>
  )
}

function ActiveFraudGate({
  siteId,
  agentCode,
  endpoint,
  children,
}: FraudGateProps & { endpoint: string }) {
  const trackerRef = useRef<OnsiaFraudTracker | null>(null)
  const [state, setState] = useState<FraudState>({ tier: 'ok', riskScore: 0, reasons: [] })

  useEffect(() => {
    const tracker = new OnsiaFraudTracker({
      endpoint,
      siteId,
      agentCode,
      debug: process.env.NODE_ENV !== 'production',
    })
    trackerRef.current = tracker

    const unsubscribe = tracker.onStateChange(setState)
    tracker.init()

    return () => {
      unsubscribe()
      tracker.destroy()
      trackerRef.current = null
    }
  }, [endpoint, siteId, agentCode])

  const reportClick = useCallback<FraudGateContextValue['reportClick']>(async (eventType, opts) => {
    const tracker = trackerRef.current
    if (!tracker) return { allow: true, tier: 'ok' }
    await tracker.reportClick(eventType, opts)
    const t = tracker.getState().tier
    return { allow: t !== 'block', tier: t }
  }, [])

  const value: FraudGateContextValue = {
    tier: state.tier,
    riskScore: state.riskScore,
    reasons: state.reasons,
    enabled: true,
    reportClick,
  }

  return (
    <FraudGateContext.Provider value={value}>
      {children}
      <FraudWarningHost />
    </FraudGateContext.Provider>
  )
}
