'use client'

import { useFraudGate } from './FraudGateContext'
import FraudWarningBanner from './FraudWarningBanner'
import FraudWarningModal from './FraudWarningModal'
import FraudBlockPage from './FraudBlockPage'

export default function FraudWarningHost() {
  const { tier, reasons, enabled } = useFraudGate()

  if (!enabled) return null

  if (tier === 'block') return <FraudBlockPage reasons={reasons} />
  if (tier === 'warn-high') return <FraudWarningModal reasons={reasons} />
  if (tier === 'warn') return <FraudWarningBanner reasons={reasons} />
  return null
}
