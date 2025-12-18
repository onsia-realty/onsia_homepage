'use client';

import {
  ExternalLink, FileText, Map, ClipboardList, Calendar
} from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { generateCourtLinks } from '@/lib/court-auction';

interface ExternalLinksProps {
  pnu: string | null;
  caseNumber: string;
  courtCode: string | null;
  courtName?: string | null;
  address?: string;
}

interface LinkItem {
  name: string;
  url: string;
  description?: string;
  icon?: typeof FileText;
  isCourtLink?: boolean; // 대법원 링크 표시용
}

interface LinkCategory {
  title: string;
  icon: typeof ExternalLink;
  color: string;
  links: LinkItem[];
  columns?: number;
}

function generateLinkCategories(
  pnu: string | null,
  caseNumber: string,
  courtCode: string | null,
  courtName: string | null,
  address?: string
): LinkCategory[] {
  const encodedAddress = encodeURIComponent(address || '');

  // 대법원 링크 생성
  const courtLinks = generateCourtLinks(courtCode, courtName, caseNumber);

  // 관련자료 보기 - 대법원 직접 링크 (2열)
  const relatedDocs: LinkItem[] = [
    { name: '사건내역', url: courtLinks.caseDetail, description: '대법원 사건 기본정보', icon: FileText, isCourtLink: true },
    { name: '기일내역', url: courtLinks.schedule, description: '매각기일 및 결과', icon: Calendar, isCourtLink: true },
    { name: '건물등기', url: 'https://www.iros.go.kr/', description: '인터넷등기소' },
    { name: '국토부실거래', url: 'https://rt.molit.go.kr/', description: '실거래가 공개시스템' },
  ];

  if (pnu) {
    relatedDocs.push(
      { name: '토지이용계획', url: `https://www.eum.go.kr/web/ar/lu/luLandDet.jsp?pnu=${pnu}`, description: '토지이음' },
      { name: '도시계획', url: `https://www.eum.go.kr/web/cp/cv/cvUpisDet.jsp?pnu=${pnu}`, description: '도시계획 열람' }
    );
  }

  // 대법원 서류 (4열 - 한 줄)
  const courtDocs: LinkItem[] = [
    { name: '문건/송달', url: courtLinks.documents, description: '송달 및 문건 내역', isCourtLink: true },
    { name: '현황조사서', url: courtLinks.survey, description: '물건 현황조사 보고서', isCourtLink: true },
    { name: '감정평가서', url: courtLinks.appraisal, description: '감정평가 내역', isCourtLink: true },
    { name: '매물명세서', url: courtLinks.saleStatement, description: '매각물건명세서', isCourtLink: true },
  ];

  // 지도자료 보기 (핵심만 노출)
  const mapLinks: LinkItem[] = [
    { name: '네이버지도', url: `https://map.naver.com/v5/search/${encodedAddress}`, description: '위치 확인' },
    { name: '카카오맵', url: `https://map.kakao.com/?q=${encodedAddress}`, description: '위치 확인' },
    { name: '네이버부동산', url: `https://land.naver.com/search/search.naver?query=${encodedAddress}`, description: '시세 확인' },
    { name: '호갱노노', url: `https://hogangnono.com/apt/search?q=${encodedAddress}`, description: '아파트 시세' },
  ];

  return [
    {
      title: '관련자료 보기',
      icon: FileText,
      color: 'text-blue-400',
      links: relatedDocs,
      columns: 2,
    },
    {
      title: '대법원 서류',
      icon: ClipboardList,
      color: 'text-blue-400',
      links: courtDocs,
      columns: 4,
    },
    {
      title: '지도/시세 보기',
      icon: Map,
      color: 'text-green-400',
      links: mapLinks,
      columns: 2,
    },
  ];
}

function LinkCategorySection({ category }: { category: LinkCategory }) {
  const Icon = category.icon;
  const columns = category.columns || 2;

  // 컬럼 수에 따른 그리드 클래스
  const gridClass = columns === 4 ? 'grid-cols-4' : 'grid-cols-2';

  return (
    <div className="border-b border-white/10 last:border-b-0">
      {/* 카테고리 헤더 */}
      <div className="flex items-center gap-2 px-3 py-2 bg-white/5">
        <Icon className={`w-4 h-4 ${category.color}`} />
        <span className="text-white font-medium text-sm">{category.title}</span>
      </div>

      {/* 링크 목록 */}
      <div className={`grid ${gridClass} gap-1 p-2`}>
        {category.links.map((link, index) => {
          const LinkIcon = link.icon;

          return (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              title={link.description}
              className={`group flex items-center justify-center gap-1 px-2 py-2 text-sm rounded transition-colors ${
                link.isCourtLink
                  ? 'text-blue-300 hover:text-white hover:bg-blue-500/30'
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              {LinkIcon && <LinkIcon className="w-4 h-4 flex-shrink-0" />}
              <span>{link.name}</span>
            </a>
          );
        })}
      </div>
    </div>
  );
}

export function ExternalLinks({ pnu, caseNumber, courtCode, courtName, address }: ExternalLinksProps) {
  const categories = generateLinkCategories(pnu, caseNumber, courtCode, courtName || null, address);

  return (
    <GlassCard className="overflow-hidden">
      <div className="p-3 border-b border-white/10 bg-white/5">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <ExternalLink className="w-4 h-4 text-blue-400" />
          외부 링크
        </h3>
        <p className="text-xs text-gray-400 mt-1">
          대법원 경매정보 및 참고자료
        </p>
      </div>

      <div>
        {categories.map((category) => (
          <LinkCategorySection
            key={category.title}
            category={category}
          />
        ))}
      </div>

      {!pnu && (
        <div className="p-3 bg-yellow-500/10 border-t border-yellow-500/20">
          <p className="text-xs text-yellow-400">
            * PNU(필지고유번호)가 등록되면 토지이용계획 등 추가 링크 이용 가능
          </p>
        </div>
      )}
    </GlassCard>
  );
}
