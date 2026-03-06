'use client'

interface Props {
  phoneNumber: string | null
  kakaoUrl: string | null
}

export default function BottomBar({ phoneNumber, kakaoUrl }: Props) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.1)]">
      <div className="flex items-center h-14 max-w-lg mx-auto px-2 gap-2">
        {phoneNumber && (
          <a
            href={`tel:${phoneNumber}`}
            className="flex-1 flex items-center justify-center gap-1.5 h-10 text-sm font-bold text-white bg-blue-600 rounded-lg active:opacity-80"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
            </svg>
            전화상담
          </a>
        )}
        {kakaoUrl && (
          <a
            href={kakaoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 h-10 text-sm font-bold text-gray-900 bg-[#FEE500] rounded-lg active:opacity-80"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3C6.48 3 2 6.58 2 10.94c0 2.82 1.87 5.3 4.69 6.69-.17.6-.62 2.17-.71 2.51-.11.4.15.39.31.28.13-.08 2.05-1.38 2.88-1.94.91.14 1.85.21 2.83.21 5.52 0 10-3.58 10-7.94S17.52 3 12 3z" />
            </svg>
            카톡문의
          </a>
        )}
        <a
          href="#inquiry-bottom"
          onClick={(e) => {
            e.preventDefault()
            document.getElementById('inquiry-bottom')?.scrollIntoView({ behavior: 'smooth' })
          }}
          className="flex-1 flex items-center justify-center gap-1.5 h-10 text-sm font-bold text-white bg-green-600 rounded-lg active:opacity-80"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11zM7 11h5v5H7v-5z" />
          </svg>
          방문예약
        </a>
      </div>
    </div>
  )
}
