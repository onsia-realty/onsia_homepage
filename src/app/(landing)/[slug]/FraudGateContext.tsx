'use client'

import { createContext, useContext } from 'react'
import type { FraudTier, ReportClickOpts } from '@/lib/onsia-tracker'

export type FraudClickEventType =
  | 'cta_click'
  | 'ad_click'
  | 'phone_click'
  | 'inquiry_submit'
  | 'external_link'

export interface FraudGateContextValue {
  tier: FraudTier
  riskScore: number
  reasons: string[]
  enabled: boolean
  reportClick: (
    eventType: FraudClickEventType,
    opts?: ReportClickOpts
  ) => Promise<{ allow: boolean; tier: FraudTier }>
}

export const FRAUD_NOOP_VALUE: FraudGateContextValue = {
  tier: 'ok',
  riskScore: 0,
  reasons: [],
  enabled: false,
  reportClick: async () => ({ allow: true, tier: 'ok' }),
}

export const FraudGateContext = createContext<FraudGateContextValue>(FRAUD_NOOP_VALUE)

export function useFraudGate(): FraudGateContextValue {
  return useContext(FraudGateContext)
}
