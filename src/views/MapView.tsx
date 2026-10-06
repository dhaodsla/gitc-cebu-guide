/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, useRef, useCallback } from 'react';
import { PlaceItem, OriginId, CategoryKey } from '../types/guide';
import { ORIGINS } from '../data/originsData';
import { getTravelFromOrigin } from '../utils/distance';
import GitcBadge from '../components/GitcBadge';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  useMap,
} from '@vis.gl/react-google-maps';
import {
  Star,
  Navigation,
  ExternalLink,
  ChevronRight,
  Filter,
  Ticket,
  Compass,
} from 'lucide-react';

interface MapViewProps {
  places: PlaceItem[];
  currentOrigin: OriginId;
  onSelectOrigin: (id: OriginId) => void;
  onSelectPlace: (place: PlaceItem) => void;
  apiKey: string;
}

export default function MapView({
  places,
  currentOrigin,
  onSelectOrigin,
  onSelectPlace,
  apiKey,
}: MapViewProps) {
  const [selectedPlace, setSelectedPlace] = useState<PlaceItem | null>(null);
  const [mapCategory, setMapCategory] = useState<string>('all');
  const [onlyPartner, setOnlyPartner] = useState(false);

  const activeOriginData = ORIGINS[currentOrigin];

  // Default center focused on Mactan / GITC & Mangrove area
  const defaultCenter = useMemo(
    () => ({
      lat: 10.3056,
      lng: 124.012,
    }),
    []
  );

  // Filters for map
  const mapFilters = [
    { key: 'all', label: '전체' },
    { key: 'gitc_pick', label: '⭐ GITC 추천' },
    { key: 'partner', label: '🎟 GITC 제휴' },
    { key: 'local_food', label: '🇵🇭 현지맛집' },
    { key: 'food', label: '🍽 맛집' },
    { key: 'cafe', label: '☕ 카페' },
    { key: 'shopping', label: '🛍 쇼핑' },
    { key: 'sightseeing', label: '🌴 관광' },
    { key: 'history', label: '🏛 역사문화' },
    { key: 'kids', label: '🎡 아이체험' },
    { key: 'show', label: '🎭 공연' },
    { key: 'massage', label: '💆 마사지' },
    { key: 'emergency', label: '🚑 병원' },
  ];

  const visiblePlaces = useMemo(() => {
    return places.filter((p) => {
      if (!p.active) return false;
      if (onlyPartner && !p.badges.includes('GITC_PARTNER')) return false;

      if (mapCategory === 'all') return true;
      if (mapCategory === 'partner') return p.badges.includes('GITC_PARTNER');
      if (mapCategory === 'gitc_pick') return p.badges.includes('GITC_PICK');
      if (mapCategory === 'local_food') {
        return p.category === 'local_food' || p.badges.includes('LOCAL_PICK');
      }
      return p.category === mapCategory;
    });
  }, [places, mapCategory, onlyPartner]);

  return (
    <div className="relative w-full h-[calc(100vh-125px)] bg-slate-100 flex flex-col overflow-hidden pb-16">
      {/* Top Floating Map Controls Bar */}
      <div className="absolute top-2.5 inset-x-2.5 z-20 space-y-2 pointer-events-none">
        {/* Origin Switcher on Map */}
        <div className="flex items-center justify-between bg-white/95 backdrop-blur-md px-3 py-2 rounded-2xl shadow-lg border border-slate-200 pointer-events-auto">
          <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-800">
            <Navigation className="w-3.5 h-3.5 text-sky-600 shrink-0" />
            <span className="hidden sm:inline">출발지:</span>
          </div>

          <div className="flex items-center space-x-1">
            <button
              onClick={() => onSelectOrigin('gitc_campus')}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
                currentOrigin === 'gitc_campus'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              🎓 GITC 캠퍼스
            </button>
            <button
              onClick={() => onSelectOrigin('mangrove_residence')}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
                currentOrigin === 'mangrove_residence'
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              🏠 맹그로브 숙소
            </button>
          </div>
        </div>

        {/* Category Pills & Partner Filter */}
        <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar pointer-events-auto py-1">
          <button
            onClick={() => setOnlyPartner(!onlyPartner)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-md whitespace-nowrap transition-all border ${
              onlyPartner
                ? 'bg-amber-500 text-white border-amber-600 ring-2 ring-amber-300'
                : 'bg-white text-amber-800 border-amber-300 hover:bg-amber-50'
            }`}
          >
            🎟 GITC 제휴만 보기
          </button>

          {mapFilters.map((f) => (
            <button
              key={f.key}
              onClick={() => setMapCategory(f.key)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-md whitespace-nowrap transition-all ${
                mapCategory === f.key
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Google Map Canvas (CF2 explicit height) */}
      <div className="flex-1 w-full h-full relative">
        <APIProvider apiKey={apiKey}>
          <Map
            defaultCenter={defaultCenter}
            defaultZoom={13}
            mapId="DEMO_MAP_ID"
            internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
            gestureHandling="greedy"
            disableDefaultUI={false}
            className="w-full h-full"
            style={{ width: '100%', height: '100%' }}
          >
            {/* FIXED REFERENCE POINT 1: GITC Cebu Academy */}
            <AdvancedMarker
              position={{
                lat: ORIGINS.gitc_campus.latitude,
                lng: ORIGINS.gitc_campus.longitude,
              }}
              title="GITC 캠퍼스 본원"
              zIndex={100}
            >
              <div className="flex flex-col items-center cursor-pointer group animate-bounce-short">
                <div className="px-2 py-0.5 rounded-md bg-sky-700 text-white text-[11px] font-black shadow-lg border border-sky-400 whitespace-nowrap">
                  🎓 GITC 캠퍼스
                </div>
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-sky-600 to-sky-400 border-2 border-white shadow-xl flex items-center justify-center text-lg">
                  🎓
                </div>
                <div className="w-1.5 h-2 bg-sky-700 rounded-b-full shadow-xs" />
              </div>
            </AdvancedMarker>

            {/* FIXED REFERENCE POINT 2: Mangrove Place and Residences */}
            <AdvancedMarker
              position={{
                lat: ORIGINS.mangrove_residence.latitude,
                lng: ORIGINS.mangrove_residence.longitude,
              }}
              title="맹그로브 숙소"
              zIndex={100}
            >
              <div className="flex flex-col items-center cursor-pointer group animate-bounce-short">
                <div className="px-2 py-0.5 rounded-md bg-teal-700 text-white text-[11px] font-black shadow-lg border border-teal-400 whitespace-nowrap">
                  🏠 맹그로브 숙소
                </div>
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-teal-600 to-teal-400 border-2 border-white shadow-xl flex items-center justify-center text-lg">
                  🏠
                </div>
                <div className="w-1.5 h-2 bg-teal-700 rounded-b-full shadow-xs" />
              </div>
            </AdvancedMarker>

            {/* Regular Place Markers */}
            {visiblePlaces.map((place) => {
              const isSelected = selectedPlace?.id === place.id;
              const isPartner = place.badges.includes('GITC_PARTNER');

              return (
                <AdvancedMarker
                  key={place.id}
                  position={{ lat: place.latitude, lng: place.longitude }}
                  title={place.nameKo}
                  onClick={() => setSelectedPlace(place)}
                  zIndex={isSelected ? 80 : isPartner ? 50 : 20}
                >
                  <div className="flex flex-col items-center cursor-pointer group">
                    {/* Small tag on hover or selection */}
                    {(isSelected || isPartner) && (
                      <div
                        className={`px-1.5 py-0.5 rounded text-[10px] font-extrabold shadow-md mb-0.5 whitespace-nowrap ${
                          isPartner
                            ? 'bg-amber-500 text-white border border-amber-300'
                            : 'bg-slate-900 text-white'
                        }`}
                      >
                        {isPartner ? '🎟 ' : ''}
                        {place.nameKo}
                      </div>
                    )}

                    {/* Marker Pin */}
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center border-2 border-white shadow-lg transition-transform ${
                        isSelected
                          ? 'scale-125 bg-rose-600 ring-4 ring-rose-400/50'
                          : isPartner
                          ? 'bg-amber-500 hover:scale-110'
                          : 'bg-sky-600 hover:scale-110'
                      }`}
                    >
                      <span className="text-xs">
                        {isPartner
                          ? '🎟'
                          : place.category === 'food' || place.category === 'local_food'
                          ? '🍽'
                          : place.category === 'cafe'
                          ? '☕'
                          : place.category === 'history'
                          ? '🏛'
                          : place.category === 'emergency'
                          ? '🚑'
                          : place.category === 'massage'
                          ? '💆'
                          : '📍'}
                      </span>
                    </div>
                  </div>
                </AdvancedMarker>
              );
            })}
          </Map>
        </APIProvider>
      </div>

      {/* Floating Selected Place Bottom Card */}
      {selectedPlace && (
        <div className="absolute bottom-20 inset-x-3 z-30 animate-slideUp">
          <div className="bg-white/98 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200 p-3.5 flex items-center space-x-3.5">
            {/* Thumbnail */}
            <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-slate-100">
              <img
                src={selectedPlace.imageUrl}
                alt={selectedPlace.nameKo}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80';
                }}
              />
              {selectedPlace.badges.includes('GITC_PARTNER') && (
                <div className="absolute top-0 inset-x-0 bg-amber-500 text-white text-[9px] font-extrabold text-center py-0.5">
                  🎟 제휴
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center space-x-1.5">
                <span className="text-[11px] font-bold text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded">
                  {selectedPlace.subCategory}
                </span>
                {selectedPlace.googleRating && (
                  <span className="text-[11px] font-bold text-amber-600 flex items-center space-x-0.5">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400 inline" />
                    <span>{selectedPlace.googleRating.toFixed(1)}</span>
                  </span>
                )}
              </div>

              <h4 className="font-extrabold text-slate-900 text-sm truncate">
                {selectedPlace.nameKo}
              </h4>
              <p className="text-[11px] text-slate-500 truncate">{selectedPlace.nameEn}</p>

              {/* Travel time from current origin */}
              <div className="text-[11px] font-semibold text-slate-700 flex items-center space-x-1">
                <span>{activeOriginData.icon}</span>
                <span className="text-sky-700">
                  {getTravelFromOrigin(currentOrigin, selectedPlace.latitude, selectedPlace.longitude).formatted}
                </span>
              </div>
            </div>

            {/* Action Detail Button */}
            <button
              onClick={() => onSelectPlace(selectedPlace)}
              className="p-3 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold text-xs shrink-0 flex items-center space-x-1 shadow-md shadow-sky-600/30"
            >
              <span>상세보기</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
