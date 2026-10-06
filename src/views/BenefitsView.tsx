/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { PlaceItem, OriginId } from '../types/guide';
import { ORIGINS } from '../data/originsData';
import { getTravelFromOrigin } from '../utils/distance';
import {
  Ticket,
  Sparkles,
  AlertTriangle,
  BadgePercent,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  Tag,
  Car,
} from 'lucide-react';

interface BenefitsViewProps {
  places: PlaceItem[];
  currentOrigin: OriginId;
  onSelectPlace: (place: PlaceItem) => void;
}

export default function BenefitsView({
  places,
  currentOrigin,
  onSelectPlace,
}: BenefitsViewProps) {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const originInfo = ORIGINS[currentOrigin];

  // All partner places
  const partnerPlaces = places.filter(
    (p) => p.badges.includes('GITC_PARTNER') && p.partnerBenefit
  );

  const categories = [
    { key: 'all', label: '전체 (13)' },
    { key: 'massage', label: '💆 마사지·뷰티 (2)' },
    { key: 'food', label: '🍽 레스토랑·씨푸드 (6)' },
    { key: 'cafe', label: '☕ 카페·베이커리 (3)' },
    { key: 'show', label: '🎭 공연·쇼 (1)' },
  ];

  const filteredPartners = partnerPlaces.filter((p) => {
    if (filterCategory === 'all') return true;
    if (filterCategory === 'massage') return p.category === 'massage';
    if (filterCategory === 'food') return p.category === 'food';
    if (filterCategory === 'cafe') return p.category === 'cafe';
    if (filterCategory === 'show') return p.category === 'show';
    return true;
  });

  return (
    <div className="space-y-5 pb-24 max-w-4xl mx-auto px-4 pt-4">
      {/* Top Banner Card */}
      <section className="bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 text-white rounded-3xl p-5 shadow-xl shadow-amber-500/20 space-y-3">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-black/20 text-amber-100 text-xs font-black tracking-wider uppercase backdrop-blur-xs">
            <Ticket className="w-3.5 h-3.5" />
            <span>GITC MEMBER BENEFIT</span>
          </div>
          <span className="text-xs bg-white text-amber-900 font-extrabold px-2.5 py-0.5 rounded-full shadow-xs">
            총 13개 공식 제휴처
          </span>
        </div>

        <div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight">
            GITC 학생과 가족을 위한
            <br />
            세부 현지 특별 제휴 혜택
          </h1>
          <p className="text-xs sm:text-sm text-amber-100 mt-2 font-medium bg-black/15 p-2.5 rounded-xl border border-white/20">
            👉 “결제 전 <strong>GITC 목걸이 또는 명찰</strong>을 보여주세요.”
          </p>
        </div>

        <div className="pt-2 border-t border-white/20 text-[11px] text-amber-100/90 flex items-start space-x-1.5 leading-relaxed">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-200" />
          <span>
            ※ 제휴 조건과 할인율은 매장 사정에 따라 변경될 수 있습니다. 방문 전 최신 혜택을 확인해 주세요.
          </span>
        </div>
      </section>

      {/* Category Pills */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((c) => (
          <button
            key={c.key}
            onClick={() => setFilterCategory(c.key)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              filterCategory === c.key
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Partner Places Cards List */}
      <div className="space-y-3">
        {filteredPartners.map((place, idx) => {
          const benefit = place.partnerBenefit!;
          const travel = getTravelFromOrigin(currentOrigin, place.latitude, place.longitude);

          return (
            <div
              key={place.id}
              onClick={() => onSelectPlace(place)}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all p-4 cursor-pointer flex flex-col sm:flex-row gap-3.5 active:scale-[0.99] group"
            >
              {/* Image thumbnail */}
              <div className="relative w-full sm:w-36 aspect-[16/10] sm:aspect-square rounded-xl overflow-hidden shrink-0 bg-slate-100">
                <img
                  src={place.imageUrl}
                  alt={place.nameKo}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-amber-500 text-white text-[10px] font-black shadow-xs">
                  {benefit.discountValue}
                </div>
              </div>

              {/* Main Content Info */}
              <div className="flex-1 flex flex-col justify-between space-y-2">
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-1.5 mb-0.5">
                        <span className="text-[11px] font-bold text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded">
                          {place.subCategory}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {place.area}
                        </span>
                      </div>
                      <h3 className="font-extrabold text-slate-900 text-base sm:text-lg group-hover:text-amber-600 transition-colors">
                        {place.nameKo}
                      </h3>
                      <p className="text-xs text-slate-500">{place.nameEn}</p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="inline-block px-2.5 py-1 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 font-extrabold text-xs">
                        {benefit.discountValue}
                      </span>
                    </div>
                  </div>

                  {/* Benefit details */}
                  <div className="mt-2 bg-amber-50/70 p-2.5 rounded-xl border border-amber-100/90 text-xs space-y-1">
                    <p className="font-bold text-amber-950 flex items-center space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 inline shrink-0" />
                      <span>{benefit.benefitText}</span>
                    </p>
                    <p className="text-[11px] text-slate-600">
                      방법: {benefit.requirements}
                    </p>
                    {benefit.additionalNotes && benefit.additionalNotes.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {benefit.additionalNotes.map((note, nIdx) => (
                          <span
                            key={nIdx}
                            className="px-1.5 py-0.5 rounded bg-white text-[10px] text-amber-800 font-medium border border-amber-200"
                          >
                            ✓ {note}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer travel and action */}
                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                  <span className="text-slate-500 font-medium">
                    {originInfo.icon} {originInfo.nameKo}에서 {travel.formatted}
                  </span>
                  <span className="text-amber-600 font-bold flex items-center group-hover:translate-x-0.5 transition-transform">
                    <span>상세보기</span>
                    <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
