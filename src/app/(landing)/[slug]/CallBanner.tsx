'use client'

interface Props {
  phone: string
  agentName?: string
}

export default function CallBanner({ phone, agentName }: Props) {
  const label = agentName ? `${agentName} 직통번호` : '대표번호'

  return (
    <a href={`tel:${phone}`} className="call-banner block w-full">
      <div className="py-4 sm:py-5 px-4 text-center">
        <span className="text-white font-extrabold text-xl sm:text-2xl md:text-3xl tracking-wide block mb-1">
          {label}
        </span>
        <span className="call-banner-number font-black text-[15vw] sm:text-[12vw] md:text-[9vw] leading-none tracking-tight block">
          {phone}
        </span>
      </div>
      {/* Sparkle particles */}
      <div className="call-sparkles" aria-hidden="true">
        <span className="sparkle sparkle-1" />
        <span className="sparkle sparkle-2" />
        <span className="sparkle sparkle-3" />
        <span className="sparkle sparkle-4" />
        <span className="sparkle sparkle-5" />
      </div>
    </a>
  )
}
