/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ORIGINS } from '../data/originsData';
import { OriginId } from '../types/guide';
import { Compass, Sparkles, Navigation, Info } from 'lucide-react';
import { useState } from 'react';

interface HeaderProps {
  currentOrigin: OriginId;
  onSelectOrigin: (id: OriginId) => void;
}

export default function Header({ currentOrigin, onSelectOrigin }: HeaderProps) {
  const [showOriginInfo, setShowOriginInfo] = useState(false);
  const activeOriginData = ORIGINS[currentOrigin];

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 shadow-md">
      {/* Top Brand Bar */}
      <div className="max-w-4xl mx-auto px-4 pt-3.5 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-teal-400 flex items-center justify-center shadow-lg shadow-sky-500/30">
              <Compass className="w-5 h-5 text-slate-950 font-bold" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold tracking-tight text-base sm:text-lg bg-gradient-to-r from-sky-200 via-teal-200 to-white bg-clip-text text-transparent">
                  GITC CEBU
                </span>
                <span className="text-[11px] font-bold px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-400/30 tracking-wider">
                  LOCAL GUIDE
                </span>
              </div>
              <p className="text-[11px] text-slate-300 line-clamp-1 font-medium">
                캠퍼스와 숙소에서 시작하는 세부 생활·여행 가이드
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowOriginInfo(!showOriginInfo)}
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
            title="기준점 정보"
          >
            <Info className="w-4 h-4 text-sky-400" />
          </button>
        </div>

        {/* Origin Selector: Crucial 2 Fixed Reference Points */}
        <div className="mt-3 pt-2.5 border-t border-slate-800/80">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-semibold text-slate-400 flex items-center space-x-1">
              <Navigation className="w-3 h-3 text-sky-400 inline" />
              <span>현재 출발 기준점</span>
            </span>
            <span className="text-[10px] text-teal-300/90 font-medium">
              선택 기준점으로 거리·시간 실시간 계산
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 bg-slate-950/60 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => onSelectOrigin('gitc_campus')}
              className={`flex items-center justify-center space-x-1.5 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                currentOrigin === 'gitc_campus'
                  ? 'bg-gradient-to-r from-sky-600 to-sky-700 text-white shadow-md shadow-sky-900/50 ring-1 ring-sky-400'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <span className="text-sm">🎓</span>
              <span>GITC 캠퍼스</span>
            </button>

            <button
              onClick={() => onSelectOrigin('mangrove_residence')}
              className={`flex items-center justify-center space-x-1.5 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                currentOrigin === 'mangrove_residence'
                  ? 'bg-gradient-to-r from-teal-600 to-teal-700 text-white shadow-md shadow-teal-900/50 ring-1 ring-teal-400'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <span className="text-sm">🏠</span>
              <span>맹그로브 숙소</span>
            </button>
          </div>
        </div>

        {/* Expandable Origin Info Card */}
        {showOriginInfo && (
          <div className="mt-2.5 p-3 rounded-xl bg-slate-800/90 border border-slate-700 text-xs text-slate-300 space-y-1.5 animate-fadeIn">
            <div className="flex items-center justify-between font-bold text-white">
              <span>{activeOriginData.shortName} ({activeOriginData.nameEn})</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                Google Maps 검증 기준점
              </span>
            </div>
            <p className="text-[11px] text-slate-400">{activeOriginData.address}</p>
            <p className="text-[11px] text-slate-300">{activeOriginData.description}</p>
            <div className="pt-1 text-[10px] text-slate-400 flex items-center justify-between">
              <span>Place ID: {activeOriginData.googlePlaceId}</span>
              <a
                href={activeOriginData.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sky-400 underline hover:text-sky-300"
              >
                Google Maps에서 보기
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
