/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PlaceItem, OriginId } from '../types/guide';
import { ORIGINS } from '../data/originsData';
import { getTravelFromOrigin } from '../utils/distance';
import GitcBadge from './GitcBadge';
import PlacePhoto from './PlacePhoto';
import { Star, Heart, Navigation, Users, Clock, Sparkles } from 'lucide-react';

interface PlaceCardProps {
  place: PlaceItem;
  currentOrigin: OriginId;
  isFavorite: boolean;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onClick: (place: PlaceItem) => void;
}

export default function PlaceCard({
  place,
  currentOrigin,
  isFavorite,
  onToggleFavorite,
  onClick,
}: PlaceCardProps) {
  const originInfo = ORIGINS[currentOrigin];
  const travel = getTravelFromOrigin(currentOrigin, place.latitude, place.longitude);

  return (
    <div
      onClick={() => onClick(place)}
      className="group bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden cursor-pointer flex flex-col active:scale-[0.99]"
    >
      {/* Card Image Banner */}
      <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full bg-slate-900 overflow-hidden">
        <PlacePhoto
          place={place}
          alt={place.nameKo}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          showSourceBadge={false}
        />

        {/* Top Floating Badges */}
        <div className="absolute top-2.5 left-2.5 flex items-center space-x-1.5 z-10">
          <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-900/80 text-white backdrop-blur-xs">
            {place.subCategory}
          </span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-black/50 text-slate-200 backdrop-blur-xs">
            {place.area}
          </span>
        </div>

        {/* Favorite Heart Button */}
        <button
          onClick={(e) => onToggleFavorite(place.id, e)}
          className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-all backdrop-blur-xs z-10 ${
            isFavorite
              ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30'
              : 'bg-white/80 hover:bg-white text-slate-700'
          }`}
          aria-label="즐겨찾기 토글"
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-white' : ''}`} />
        </button>

        {/* Partner Benefit Overlay Ribbon */}
        {place.partnerBenefit && (
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-white px-3 py-1 text-xs font-bold flex items-center justify-between shadow-xs">
            <span className="flex items-center space-x-1">
              <span>🎟 GITC 제휴:</span>
              <span className="underline decoration-white/70">{place.partnerBenefit.discountValue}</span>
            </span>
            <span className="text-[10px] font-normal text-amber-100 opacity-90">명찰 제시</span>
          </div>
        )}
      </div>

      {/* Card Content Body */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between space-y-2.5">
        <div>
          {/* Badge List */}
          <div className="flex flex-wrap items-center gap-1 mb-1.5">
            {place.badges.map((badge) => (
              <GitcBadge key={badge} badge={badge} size="sm" />
            ))}
          </div>

          {/* Place Title (Korean & English Official) */}
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base sm:text-lg tracking-tight group-hover:text-sky-600 transition-colors">
                {place.nameKo}
              </h3>
              <p className="text-xs text-slate-500 font-medium line-clamp-1">
                {place.nameEn}
              </p>
            </div>
          </div>
        </div>

        {/* Dynamic Distance from Active Origin */}
        <div className="flex items-center justify-between text-xs py-1.5 px-2.5 rounded-lg bg-sky-50 border border-sky-100 text-sky-900 font-medium">
          <div className="flex items-center space-x-1.5 truncate">
            <span className="text-xs">{originInfo.icon}</span>
            <span className="truncate">
              {currentOrigin === 'gitc_campus' ? '캠퍼스' : '맹그로브'}에서 {travel.formatted}
            </span>
          </div>
          <span className="text-[11px] text-sky-700/80 font-bold shrink-0 ml-1">
            {place.priceLevel !== '정보 확인 필요' ? place.priceLevel : ''}
          </span>
        </div>

        {/* GITC Comment One-liner */}
        {place.gitcComment && (
          <p className="text-xs text-slate-600 line-clamp-2 bg-slate-50 p-2 rounded-lg border border-slate-100 italic">
            "{place.gitcComment}"
          </p>
        )}

        {/* Card Footer: Rating & Kids Suitability */}
        <div className="pt-1 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100">
          <div className="flex items-center space-x-1">
            {place.googleRating ? (
              <>
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span className="font-bold text-slate-800">{place.googleRating.toFixed(1)}</span>
                <span className="text-[11px] text-slate-400">
                  ({place.googleReviewCount ? `${place.googleReviewCount.toLocaleString()}개` : '리뷰'})
                </span>
              </>
            ) : (
              <span className="text-[11px] text-slate-400">Google 정보 확인 필요</span>
            )}
          </div>

          <div className="flex items-center space-x-1.5 text-[11px]">
            {place.kidsFriendly.level === 3 && (
              <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
                아이 동반 추천
              </span>
            )}
            {place.localExperienceLevel && (
              <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 font-semibold border border-amber-200">
                로컬 ★{place.localExperienceLevel.level}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
