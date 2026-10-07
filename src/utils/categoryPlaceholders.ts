/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CategoryKey } from '../types/guide';

/**
 * Generates an SVG Data URI placeholder for a given category.
 * Design principle: Clean, premium graphic/icon placeholder that clearly represents
 * the category and NEVER looks like a fake or AI-generated photo.
 */
function createSvgPlaceholder(config: {
  bgGradientStart: string;
  bgGradientEnd: string;
  accentColor: string;
  iconSvg: string;
  categoryLabelKo: string;
  categoryLabelEn: string;
  subText: string;
}): string {
  const { bgGradientStart, bgGradientEnd, accentColor, iconSvg, categoryLabelKo, categoryLabelEn, subText } = config;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="100%" height="100%">
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${bgGradientStart}"/>
        <stop offset="100%" stop-color="${bgGradientEnd}"/>
      </linearGradient>
      <linearGradient id="badgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${accentColor}" stop-opacity="0.25"/>
        <stop offset="100%" stop-color="${accentColor}" stop-opacity="0.08"/>
      </linearGradient>
      <pattern id="gridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" stroke-width="1"/>
      </pattern>
    </defs>

    <!-- Background -->
    <rect width="800" height="500" fill="url(#bgGrad)"/>
    <rect width="800" height="500" fill="url(#gridPattern)"/>

    <!-- Subtle Radial Glow behind Icon -->
    <circle cx="400" cy="200" r="140" fill="${accentColor}" opacity="0.12"/>

    <!-- Center Icon Container -->
    <g transform="translate(340, 140)">
      <rect width="120" height="120" rx="32" fill="url(#badgeGrad)" stroke="${accentColor}" stroke-opacity="0.4" stroke-width="2"/>
      <g transform="translate(32, 32)" stroke="${accentColor}" fill="none" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        ${iconSvg}
      </g>
    </g>

    <!-- Text Group -->
    <text x="400" y="310" text-anchor="middle" fill="#FFFFFF" font-family="-apple-system, BlinkMacSystemFont, 'Pretendard', sans-serif" font-size="24" font-weight="800" letter-spacing="-0.5">
      ${categoryLabelKo}
    </text>

    <text x="400" y="338" text-anchor="middle" fill="${accentColor}" font-family="-apple-system, BlinkMacSystemFont, 'Plus Jakarta Sans', sans-serif" font-size="13" font-weight="700" letter-spacing="1.5">
      ${categoryLabelEn.toUpperCase()}
    </text>

    <g transform="translate(400, 385)">
      <rect x="-130" y="-16" width="260" height="32" rx="16" fill="rgba(15, 23, 42, 0.5)" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
      <circle cx="-105" cy="0" r="3" fill="${accentColor}"/>
      <text x="-92" y="4" fill="#94A3B8" font-family="-apple-system, BlinkMacSystemFont, 'Pretendard', sans-serif" font-size="12" font-weight="500">
        ${subText}
      </text>
    </g>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

// Icons in SVG paths (Lucide style)
const ICONS = {
  food: `<path d="M18 2v6a3 3 0 0 1-3 3 3 3 0 0 1-3-3V2"/><path d="M15 2v16"/><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><circle cx="8" cy="7" r="4"/><path d="M8 11v7"/>`,
  cafe: `<path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" x2="6" y1="2" y2="4"/><line x1="10" x2="10" y1="2" y2="4"/><line x1="14" x2="14" y1="2" y2="4"/>`,
  history: `<path d="M3 21h18"/><path d="M4 18V9"/><path d="M20 18V9"/><path d="M12 2 2 7h20Z"/><path d="M9 18V9"/><path d="M15 18V9"/>`,
  sightseeing: `<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="4"/>`,
  shopping: `<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>`,
  massage: `<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><circle cx="12" cy="11" r="3"/>`,
  show: `<path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M13 5v2"/><path d="M13 17v2"/><path d="M13 11v2"/>`,
  emergency: `<rect width="18" height="18" x="3" y="3" rx="4"/><path d="M12 8v8"/><path d="M8 12h8"/>`,
  kids: `<circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" x2="9.01" y1="9" y2="9"/><line x1="15" x2="15.01" y1="9" y2="9"/>`,
  partner: `<path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"/>`,
};

export const CATEGORY_PLACEHOLDERS: Record<string, string> = {
  food: createSvgPlaceholder({
    bgGradientStart: '#0f172a',
    bgGradientEnd: '#1e293b',
    accentColor: '#f97316',
    iconSvg: ICONS.food,
    categoryLabelKo: '세부 맛집 & 로컬푸드',
    categoryLabelEn: 'Food & Dining Guide',
    subText: '공식 장소 사진 준비 중',
  }),
  local_food: createSvgPlaceholder({
    bgGradientStart: '#0f172a',
    bgGradientEnd: '#1e293b',
    accentColor: '#f59e0b',
    iconSvg: ICONS.food,
    categoryLabelKo: '세부 현지 로컬푸드',
    categoryLabelEn: 'Local Food Experience',
    subText: '공식 장소 사진 준비 중',
  }),
  cafe: createSvgPlaceholder({
    bgGradientStart: '#18181b',
    bgGradientEnd: '#27272a',
    accentColor: '#d97706',
    iconSvg: ICONS.cafe,
    categoryLabelKo: '세부 엄선 카페 & 베이커리',
    categoryLabelEn: 'Cafe & Bakery Guide',
    subText: '공식 장소 사진 준비 중',
  }),
  history: createSvgPlaceholder({
    bgGradientStart: '#09152a',
    bgGradientEnd: '#0f244a',
    accentColor: '#38bdf8',
    iconSvg: ICONS.history,
    categoryLabelKo: '세부 역사 & 문화유적지',
    categoryLabelEn: 'Heritage & Culture',
    subText: '공식 장소 사진 준비 중',
  }),
  sightseeing: createSvgPlaceholder({
    bgGradientStart: '#042f2e',
    bgGradientEnd: '#0f172a',
    accentColor: '#2dd4bf',
    iconSvg: ICONS.sightseeing,
    categoryLabelKo: '세부 관광 & 포토 명소',
    categoryLabelEn: 'Attractions & Sightseeing',
    subText: '공식 장소 사진 준비 중',
  }),
  shopping: createSvgPlaceholder({
    bgGradientStart: '#1e1b4b',
    bgGradientEnd: '#0f172a',
    accentColor: '#a855f7',
    iconSvg: ICONS.shopping,
    categoryLabelKo: '쇼핑몰 & 로컬 마켓',
    categoryLabelEn: 'Shopping & Markets',
    subText: '공식 장소 사진 준비 중',
  }),
  massage: createSvgPlaceholder({
    bgGradientStart: '#022c22',
    bgGradientEnd: '#0f172a',
    accentColor: '#10b981',
    iconSvg: ICONS.massage,
    categoryLabelKo: '마사지 & 스파 웰니스',
    categoryLabelEn: 'Spa & Wellness',
    subText: '공식 장소 사진 준비 중',
  }),
  show: createSvgPlaceholder({
    bgGradientStart: '#311042',
    bgGradientEnd: '#0f172a',
    accentColor: '#ec4899',
    iconSvg: ICONS.show,
    categoryLabelKo: '공연 & 문화체험',
    categoryLabelEn: 'Shows & Culture',
    subText: '공식 장소 사진 준비 중',
  }),
  emergency: createSvgPlaceholder({
    bgGradientStart: '#2a0a10',
    bgGradientEnd: '#0f172a',
    accentColor: '#ef4444',
    iconSvg: ICONS.emergency,
    categoryLabelKo: '병원 & 24시간 생활편의',
    categoryLabelEn: 'Medical & Living Info',
    subText: '공식 장소 사진 준비 중',
  }),
  kids: createSvgPlaceholder({
    bgGradientStart: '#0c2340',
    bgGradientEnd: '#0f172a',
    accentColor: '#38bdf8',
    iconSvg: ICONS.kids,
    categoryLabelKo: '가족 & 어린이 추천 명소',
    categoryLabelEn: 'Family Friendly Pick',
    subText: '공식 장소 사진 준비 중',
  }),
  partner: createSvgPlaceholder({
    bgGradientStart: '#0f244a',
    bgGradientEnd: '#0284c7',
    accentColor: '#fbbf24',
    iconSvg: ICONS.partner,
    categoryLabelKo: 'GITC 공식 제휴처',
    categoryLabelEn: 'GITC Official Partner',
    subText: 'GITC 참가자 전용 혜택',
  }),
};

/**
 * Returns a clean, non-AI graphic placeholder for any category.
 */
export function getCategoryPlaceholder(category?: CategoryKey | string): string {
  if (!category) return CATEGORY_PLACEHOLDERS.sightseeing;
  return CATEGORY_PLACEHOLDERS[category] || CATEGORY_PLACEHOLDERS.sightseeing;
}
