'use client'

export interface RelatedProjectItem {
  slug: string
  project_name: string
}

interface Props {
  projects: RelatedProjectItem[]
  variant?: 'mobile' | 'pc'
}

export default function RelatedProjects({ projects, variant = 'mobile' }: Props) {
  if (!projects || projects.length === 0) return null

  if (variant === 'pc') {
    return (
      <section className="bg-[#fafafa] border-t border-gray-200 py-10 px-8">
        <div className="max-w-[1000px] mx-auto">
          <h3 className="text-center text-[15px] font-bold text-gray-700 mb-5 tracking-wide">
            온시아(ONSIA) 추천 분양 단지
          </h3>
          <ul className="flex flex-wrap items-center justify-center gap-x-7 gap-y-2 text-[13px]">
            {projects.map((p) => (
              <li key={p.slug}>
                <a
                  href={`/${p.slug}`}
                  className="text-gray-600 hover:text-gray-900 hover:underline transition-colors"
                  title={`${p.project_name} 분양정보 바로가기`}
                >
                  {p.project_name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-gray-800 border-t border-gray-700 py-6 px-4">
      <div className="max-w-2xl mx-auto">
        <h3 className="text-center text-[13px] font-semibold text-gray-300 mb-3 tracking-wide">
          온시아(ONSIA) 추천 분양 단지
        </h3>
        <ul className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs">
          {projects.map((p) => (
            <li key={p.slug}>
              <a
                href={`/${p.slug}`}
                className="text-gray-400 hover:text-white hover:underline transition-colors"
                title={`${p.project_name} 분양정보 바로가기`}
              >
                {p.project_name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
