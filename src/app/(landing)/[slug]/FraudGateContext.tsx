'use client'

import { createContext, useContext } from 'react'
import type { ReportClickOpts } from '@/lib/onsia-tracker'

export type FraudClickEventType =
  | 'cta_click'
  | 'ad_click'
  | 'phone_click'
  | 'inquiry_submit'
  | 'external_link'

export interface FraudGateContextValue {
  enabled: boolean
  reportClick: (eventType: FraudClickEventType, opts?: ReportClickOpts) => Promise<void>
}

export const FRAUD_NOOP_VALUE: FraudGateContextValue = {
  enabled: false,
  reportClick: async () => {},
}

export const FraudGateContext = createContext<FraudGateContextValue>(FRAUD_NOOP_VALUE)

export function useFraudGate(): FraudGateContextValue {
  return useContext(FraudGateContext)
}
