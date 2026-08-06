'use client'

import { ReactNode, useCallback, useEffect, useRef } from 'react'
import { OnsiaFraudTracker } from '@/lib/onsia-tracker'
import {
  FraudGateContext,
  FRAUD_NOOP_VALUE,
  type FraudGateContextValue,
} from './FraudGateContext'

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

  useEffect(() => {
    const tracker = new OnsiaFraudTracker({
      endpoint,
      siteId,
      agentCode,
      debug: process.env.NODE_ENV !== 'production',
    })
    trackerRef.current = tracker

    tracker.init()

    return () => {
      tracker.destroy()
      trackerRef.current = null
    }
  }, [endpoint, siteId, agentCode])

  const reportClick = useCallback<FraudGateContextValue['reportClick']>(async (eventType, opts) => {
    const tracker = trackerRef.current
    if (!tracker) return
    await tracker.reportClick(eventType, opts)
  }, [])

  const value: FraudGateContextValue = {
    enabled: true,
    reportClick,
  }

  return <FraudGateContext.Provider value={value}>{children}</FraudGateContext.Provider>
}
