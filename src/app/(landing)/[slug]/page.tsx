import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getLandingPageBySlug, getLandingPages, getAgentByCode, type LandingPage as LandingPageType } from '@/lib/supabase-landing'
import InquiryForm from './InquiryForm'
import BottomBar from './BottomBar'
import CallBanner from './CallBanner'
import PopupModal from './PopupModal'

interface Props {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const page = await getLandingPageBySlug(slug)

  if (!page) return { title: '페이지를 찾을 수 없습니다' }

  return {
    title: page.seo_title || `${page.project_name} - 분양 안내`,
    description: page.seo_description || `${page.project_name} ${page.location || ''} 분양 정보`,
    keywords: page.seo_keywords || undefined,
    openGraph: {
      title: page.seo_title || page.project_name,
      description: page.seo_description || `${page.project_name} 분양 안내`,
      images: page.og_image ? [page.og_image] : page.hero_image ? [page.hero_image] : [],
    },
  }
}

export async function generateStaticParams() {
  const pages = await getLandingPages()
  return pages.map((page) => ({ slug: page.slug }))
}

export const revalidate = 3600

export default async function LandingPage({ params, searchParams }: Props) {
  const { slug } = await params
  const { agent: agentCode } = await searchParams
  const page = await getLandingPageBySlug(slug)

  if (!page) notFound()

  // Agent 조회 (URL ?agent=xxx)
  const agentCodeStr = typeof agentCode === 'string' ? agentCode : undefined
  const agent = agentCodeStr ? await getAgentByCode(page.id, agentCodeStr) : null

  // 유효 전화번호/카톡 결정 (agent 우선, 없으면 대표)
  const effectivePhone = agent?.phone || page.phone_number
  const effectiveKakao = agent?.kakao_url || page.kakao_chat_url

  const primaryColor = page.primary_color || '#1E3A5F'
  const accentColor = page.accent_color || '#C9A96E'

  return (
    <div
      className={`min-h-screen bg-white ${page.show_bottom_bar ? 'pb-14' : ''}`}
      style={{ '--primary': primaryColor, '--accent': accentColor } as React.CSSProperties}
    >
      {/* Hero Section */}
      {page.hero_image ? (
        <section className="relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={page.hero_image}
            alt={page.project_name}
            className="w-full block"
          />
          {page.subtitle && (
            <div className="absolute inset-0 flex items-end justify-center pb-6 sm:pb-8 md:pb-12 bg-gradient-to-t from-black/70 via-black/20 to-transparent">
              <div className="text-center text-white px-4">
                <h1 className="text-xl sm:text-3xl md:text-5xl font-bold mb-1 md:mb-2 drop-shadow-lg">{page.project_name}</h1>
                <p className="text-sm sm:text-lg md:text-2xl font-medium drop-shadow-md opacity-90">{page.subtitle}</p>
              </div>
            </div>
          )}
        </section>
      ) : (
        <section
          className="py-12 sm:py-16 md:py-20 px-4 text-center text-white"
          style={{ background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}dd)` }}
        >
          {page.logo_image && (
            <div className="mb-4 md:mb-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={page.logo_image} alt="로고" className="mx-auto h-10 md:h-16" />
            </div>
          )}
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-2 md:mb-3">{page.project_name}</h1>
          {page.subtitle && <p className="text-base sm:text-xl md:text-2xl opacity-90">{page.subtitle}</p>}
        </section>
      )}

      {/* Call Banner */}
      {effectivePhone && (
        <CallBanner
          phone={effectivePhone}
          agentName={agent?.name}
        />
      )}

      {/* YouTube Video */}
      {page.youtube_id && (
        <section className="bg-black">
          <div className="max-w-4xl mx-auto">
            <div className="relative pb-[56.25%] h-0">
              <iframe
                src={`https://www.youtube.com/embed/${page.youtube_id}?rel=0`}
                title="홍보 영상"
                className="absolute top-0 left-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </section>
      )}

      {/* Top Inquiry Form */}
      <section id="inquiry-top" className="py-8 sm:py-10 px-4" style={{ backgroundColor: primaryColor }}>
        <div className="max-w-lg mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-center text-white mb-4 sm:mb-6">관심고객 등록</h2>
          <InquiryForm pageId={page.id} slug={slug} accentColor={accentColor} agentCode={agentCodeStr} agentName={agent?.name} />
        </div>
      </section>

      {/* Custom Sections (optional) */}
      {page.sections && page.sections.length > 0 && page.sections.map((section, i) => (
        <section key={section.id || i} className={`py-8 sm:py-12 px-4 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
          <div className="max-w-4xl mx-auto">
            {section.title && (
              <h2 className="text-xl sm:text-2xl font-bold text-center mb-4 sm:mb-6" style={{ color: primaryColor }}>
                {section.title}
              </h2>
            )}
            {section.content && (
              <div
                className="prose prose-sm sm:prose-lg max-w-none text-gray-700 text-center"
                dangerouslySetInnerHTML={{ __html: section.content }}
              />
            )}
            {section.images && section.images.length > 0 && (
              <div className="mt-4 sm:mt-6 space-y-4 sm:space-y-6">
                {section.images.map((img, j) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={j}
                    src={img}
                    alt={`${section.title || page.project_name} ${j + 1}`}
                    className="w-full block rounded-lg"
                    loading="lazy"
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      ))}

      {/* Full-width Gallery Images (seamless vertical stack) */}
      {page.gallery && page.gallery.length > 0 && (
        <section className="gallery-seamless" style={{ backgroundColor: primaryColor, fontSize: 0, lineHeight: 0 }}>
          {page.gallery.map((img, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={i}
              src={img}
              alt={`${page.project_name} ${i + 1}`}
              className="w-full block"
              loading="lazy"
            />
          ))}
        </section>
      )}

      {/* Bottom Inquiry Form */}
      <section id="inquiry-bottom" className="py-8 sm:py-10 px-4" style={{ backgroundColor: primaryColor }}>
        <div className="max-w-lg mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-center text-white mb-4 sm:mb-6">관심고객 등록</h2>
          <InquiryForm pageId={page.id} slug={slug} accentColor={accentColor} agentCode={agentCodeStr} agentName={agent?.name} />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 sm:py-8 px-4 bg-gray-900 text-gray-400 text-center text-xs sm:text-sm leading-relaxed">
        {page.business_info && (
          <div className="mb-3 sm:mb-4">
            {page.business_info.company_name && (
              <p className="font-medium text-gray-300">{page.business_info.company_name}</p>
            )}
          </div>
        )}
        <p className="text-gray-500 max-w-2xl mx-auto text-xs sm:text-sm">
          {page.business_info?.disclaimer ||
            '본 홍보물의 내용은 소비자의 이해를 돕기 위해 제작된 것으로, 개발·분양사의 사정에 따라 변경될 수 있으며 법적 효력이 없습니다. 계약 시에는 반드시 모집공고문과 계약서를 기준으로 확인하시기 바랍니다.'}
        </p>
        <a
          href="https://www.applyhome.co.kr/ai/aia/selectOtherLttotPblancListView.do"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 sm:mt-3 inline-block text-gray-500 hover:text-gray-300 underline text-xs sm:text-sm"
        >
          청약홈 바로가기
        </a>
        <p className="mt-2 sm:mt-3 text-gray-600 text-xs">&copy; {new Date().getFullYear()} ONSIA. All rights reserved.</p>
      </footer>

      {/* Fixed Bottom Bar */}
      {page.show_bottom_bar && (
        <BottomBar phoneNumber={effectivePhone || null} kakaoUrl={effectiveKakao || null} />
      )}

      {/* Popup Modal */}
      {slug === 'urbanhomes' && (
        <PopupModal
          imageUrl="https://static.wixstatic.com/media/a5ff46_031e0795c8dc484ebfb8e3b4a1ee9541~mv2.jpg/v1/fill/w_460,h_624,al_c,lg_1,q_80,enc_avif,quality_auto/1_%ED%8C%9D%EC%97%85%EC%B0%BD.jpg"
          linkUrl="https://www.applyhome.co.kr/ai/aia/selectOtherLttotPblancListView.do"
          alt="청약홈 안내"
        />
      )}
    </div>
  )
}
