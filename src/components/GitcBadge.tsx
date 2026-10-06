/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GitcBadge as BadgeType } from '../types/guide';

interface GitcBadgeProps {
  badge: BadgeType;
  size?: 'sm' | 'md';
}

export default function GitcBadge({ badge, size = 'sm' }: GitcBadgeProps) {
  const isSmall = size === 'sm';
  const paddingClass = isSmall ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-1 text-xs';

  switch (badge) {
    case 'GITC_PARTNER':
      return (
        <span
          className={`inline-flex items-center font-extrabold rounded-md bg-amber-500/15 text-amber-700 border border-amber-300 shadow-xs tracking-tight ${paddingClass}`}
        >
          <span className="mr-0.5">🎟</span> GITC PARTNER
        </span>
      );
    case 'GITC_PICK':
      return (
        <span
          className={`inline-flex items-center font-extrabold rounded-md bg-sky-500/15 text-sky-800 border border-sky-300 shadow-xs tracking-tight ${paddingClass}`}
        >
          <span className="mr-0.5">⭐</span> GITC PICK
        </span>
      );
    case 'LOCAL_PICK':
      return (
        <span
          className={`inline-flex items-center font-extrabold rounded-md bg-emerald-500/15 text-emerald-800 border border-emerald-300 shadow-xs tracking-tight ${paddingClass}`}
        >
          <span className="mr-0.5">🇵🇭</span> LOCAL PICK
        </span>
      );
    case 'KOREAN_FAVORITE':
      return (
        <span
          className={`inline-flex items-center font-extrabold rounded-md bg-indigo-500/15 text-indigo-800 border border-indigo-300 shadow-xs tracking-tight ${paddingClass}`}
        >
          <span className="mr-0.5">🇰🇷</span> KOREAN FAVORITE
        </span>
      );
    case 'FAMILY_PICK':
      return (
        <span
          className={`inline-flex items-center font-extrabold rounded-md bg-rose-500/15 text-rose-800 border border-rose-300 shadow-xs tracking-tight ${paddingClass}`}
        >
          <span className="mr-0.5">👨‍👩‍👧</span> FAMILY PICK
        </span>
      );
    case 'MICHELIN':
      return (
        <span
          className={`inline-flex items-center font-extrabold rounded-md bg-red-600/15 text-red-800 border border-red-300 shadow-xs tracking-tight ${paddingClass}`}
        >
          <span className="mr-0.5">🏅</span> MICHELIN
        </span>
      );
    default:
      return null;
  }
}
