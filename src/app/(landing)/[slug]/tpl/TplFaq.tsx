// 자주 묻는 질문 — 네이티브 <details> 아코디언 (JS 0). 내용은 config.faq (JSON-LD FAQPage와 동일 소스).
import type { TplSiteConfig } from '@/landing-sites/types'

const GOLD = '#C9A96E'

interface Props {
  faq: TplSiteConfig['faq']
  pc?: boolean
  id?: string
}

export default function TplFaq({ faq, pc = false, id }: Props) {
  if (!faq.length) return null
  return (
    <section id={id} className={pc ? 'py-16 px-8 bg-white' : 'py-8 sm:py-10 px-4 bg-white'}>
      <div className={pc ? 'max-w-[900px] mx-auto' : 'max-w-lg mx-auto'}>
        <h2 className="text-center text-[12px] sm:text-[13px] font-bold tracking-[0.25em] mb-1.5" style={{ color: GOLD }}>
          FAQ
        </h2>
        <p className={`text-center font-extrabold text-gray-900 ${pc ? 'text-3xl mb-8' : 'text-xl sm:text-2xl mb-5'}`}>자주 묻는 질문</p>
        <div className="divide-y divide-gray-200 border-y border-gray-200">
          {faq.map((f, i) => (
            <details key={i} className="group">
              <summary className={`flex items-start gap-3 cursor-pointer list-none ${pc ? 'py-5 text-[17px]' : 'py-4 text-[15px]'} font-bold text-gray-900`}>
                <span className="flex-shrink-0 font-black" style={{ color: GOLD }}>Q.</span>
                <span className="flex-1">{f.q}</span>
                <svg className="flex-shrink-0 w-5 h-5 mt-0.5 text-gray-400 transition-transform group-open:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </summary>
              <p className={`pb-5 pl-8 text-gray-600 leading-relaxed ${pc ? 'text-[15px]' : 'text-[14px]'}`}>{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
