'use client';

import { usePathname } from 'next/navigation';
import AnalyticsTracker from './AnalyticsTracker';

/** 경로 → siteSlug 매핑 */
const SLUG_MAP: Record<string, string> = {
  urbanhomes: 'urbanhomes',
  'yongin-honorsville': 'yongin-honorsville',
};

function getSiteSlug(pathname: string): string {
  // /urbanhomes, /urbanhomes/premium 등 → 'urbanhomes'
  const firstSegment = pathname.split('/').filter(Boolean)[0] || '';
  return SLUG_MAP[firstSegment] || 'onsia-main';
}

interface DynamicTrackerProps {
  apiEndpoint: string;
}

export default function DynamicTracker({ apiEndpoint }: DynamicTrackerProps) {
  const pathname = usePathname();
  const siteSlug = getSiteSlug(pathname);

  return (
    <AnalyticsTracker
      config={{
        apiEndpoint,
        siteSlug,
        trackClicks: true,
        trackScroll: true,
        trackMouse: true,
      }}
    />
  );
}
