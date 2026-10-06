/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { PlaceItem, CategoryKey, OriginId, GitcBadge as BadgeType } from '../types/guide';
import { ORIGINS } from '../data/originsData';
import { getTravelFromOrigin } from '../utils/distance';
import PlaceCard from '../components/PlaceCard';
import {
  Search,
  Sparkles,
  Ticket,
  UtensilsCrossed,
  Coffee,
  Landmark,
  Palmtree,
  Baby,
  Theater,
  ShoppingBag,
  Sparkle,
  ShieldAlert,
  SlidersHorizontal,
  ArrowUpDown,
  X,
  Compass,
} from 'lucide-react';

interface HomeViewProps {
  places: PlaceItem[];
  currentOrigin: OriginId;
  favorites: string[];
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onSelectPlace: (place: PlaceItem) => void;
  onNavigateToBenefits: () => void;
  onNavigateToEmergency: () => void;
}

type DistanceFilter = 'all' | '10min' | '20min' | '30min' | 'far';
type SortOption = 'distance' | 'rating' | 'reviews' | 'gitc_pick';

export default function HomeView({
  places,
  currentOrigin,
  favorites,
  onToggleFavorite,
  onSelectPlace,
  onNavigateToBenefits,
  onNavigateToEmergency,
}: HomeViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey>('all');
  const [distanceFilter, setDistanceFilter] = useState<DistanceFilter>('all');
  const [sortOption, setSortOption] = useState<SortOption>('distance');
  const [onlyPartner, setOnlyPartner] = useState(false);
  const [onlyKidsFriendly, setOnlyKidsFriendly] = useState(false);

  const originInfo = ORIGINS[currentOrigin];

  // Quick Shortcuts categories list
  const categoryShortcuts = [
    { key: 'all' as CategoryKey, label: '전체', icon: Compass },
    { key: 'partner' as CategoryKey, label: '🎟 GITC 제휴', isSpecial: 'partner' },
    { key: 'food' as CategoryKey, label: '🍽 맛집', icon: UtensilsCrossed },
    { key: 'local_food' as CategoryKey, label: '🇵🇭 로컬맛집', icon: Sparkles },
    { key: 'cafe' as CategoryKey, label: '☕ 카페', icon: Coffee },
    { key: 'history' as CategoryKey, label: '🏛 역사·문화', icon: Landmark },
    { key: 'sightseeing' as CategoryKey, label: '🌴 관광·포토', icon: Palmtree },
    { key: 'kids' as CategoryKey, label: '🎡 아이와 함께', icon: Baby },
    { key: 'show' as CategoryKey, label: '🎭 공연·쇼', icon: Theater },
    { key: 'shopping' as CategoryKey, label: '🛍 쇼핑·마트', icon: ShoppingBag },
    { key: 'massage' as CategoryKey, label: '💆 마사지·뷰티', icon: Sparkle },
    { key: 'emergency' as CategoryKey, label: '🚑 병원·생활', icon: ShieldAlert, isSpecial: 'emergency' },
  ];

  // Filter and sort items
  const filteredPlaces = useMemo(() => {
    return places
      .filter((place) => {
        if (!place.active) return false;

        // Search query filter (Korean name, English name, category, recommended menu, area, tags)
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchName =
            place.nameKo.toLowerCase().includes(q) || place.nameEn.toLowerCase().includes(q);
          const matchSub = place.subCategory.toLowerCase().includes(q);
          const matchArea = place.area.toLowerCase().includes(q);
          const matchComment = place.gitcComment?.toLowerCase().includes(q);
          const matchMenu = place.recommendedMenu?.some((m) => m.toLowerCase().includes(q));
          const matchHighlights = place.highlights?.some((h) => h.toLowerCase().includes(q));

          if (
            !matchName &&
            !matchSub &&
            !matchArea &&
            !matchComment &&
            !matchMenu &&
            !matchHighlights
          ) {
            return false;
          }
        }

        // Category filter
        if (selectedCategory !== 'all') {
          if (selectedCategory === 'partner') {
            if (!place.badges.includes('GITC_PARTNER')) return false;
          } else if (selectedCategory === 'local_food') {
            if (place.category !== 'local_food' && !place.badges.includes('LOCAL_PICK')) return false;
          } else if (place.category !== selectedCategory) {
            return false;
          }
        }

        // Only partner toggle
        if (onlyPartner && !place.badges.includes('GITC_PARTNER')) {
          return false;
        }

        // Only kids friendly
        if (onlyKidsFriendly && place.kidsFriendly.level < 3) {
          return false;
        }

        // Distance filter based on currently selected origin
        if (distanceFilter !== 'all') {
          const travel = getTravelFromOrigin(currentOrigin, place.latitude, place.longitude);
          const mins = travel.durationMin;

          if (distanceFilter === '10min' && mins > 10) return false;
          if (distanceFilter === '20min' && (mins <= 10 || mins > 20)) return false;
          if (distanceFilter === '30min' && (mins <= 20 || mins > 30)) return false;
          if (distanceFilter === 'far' && mins <= 30) return false;
        }

        return true;
      })
      .sort((a, b) => {
        const travelA = getTravelFromOrigin(currentOrigin, a.latitude, a.longitude);
        const travelB = getTravelFromOrigin(currentOrigin, b.latitude, b.longitude);

        switch (sortOption) {
          case 'distance':
            return travelA.durationMin - travelB.durationMin;
          case 'rating':
            return (b.googleRating || 0) - (a.googleRating || 0);
          case 'reviews':
            return (b.googleReviewCount || 0) - (a.googleReviewCount || 0);
          case 'gitc_pick':
            const aIsPick = a.badges.includes('GITC_PICK') ? 1 : 0;
            const bIsPick = b.badges.includes('GITC_PICK') ? 1 : 0;
            if (aIsPick !== bIsPick) return bIsPick - aIsPick;
            return travelA.durationMin - travelB.durationMin;
          default:
            return 0;
        }
      });
  }, [
    places,
    searchQuery,
    selectedCategory,
    distanceFilter,
    sortOption,
    onlyPartner,
    onlyKidsFriendly,
    currentOrigin,
  ]);

  return (
    <div className="space-y-5 pb-20">
      {/* Hero Greeting Section */}
      <section className="bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white px-4 pt-4 pb-6 rounded-b-3xl shadow-lg">
        <div className="max-w-4xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-bold border border-sky-400/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>GITC 회원 및 가족 전용</span>
          </div>

          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              오늘 세부에서 어디 갈까요?
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 font-normal mt-1">
              {originInfo.shortName} 기준으로 가까운 추천 장소를 안내해 드립니다.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative pt-1">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="맛집, 관광지, 카페, 메뉴를 검색해보세요"
                className="w-full bg-white text-slate-900 placeholder-slate-400 text-xs sm:text-sm rounded-2xl pl-10 pr-9 py-3 border-none ring-2 ring-sky-400/30 focus:ring-sky-500 shadow-md font-medium"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 p-1 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-4xl mx-auto px-4 space-y-5">
        {/* Category Shortcuts Grid */}
        <section className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              주요 바로가기
            </h2>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
                setDistanceFilter('all');
                setOnlyPartner(false);
              }}
              className="text-[11px] text-sky-600 hover:underline font-semibold"
            >
              초기화
            </button>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
            {categoryShortcuts.map((cat) => {
              const isSelected = selectedCategory === cat.key;
              const Icon = cat.icon || Sparkles;

              if (cat.isSpecial === 'partner') {
                return (
                  <button
                    key={cat.key}
                    onClick={() => {
                      setSelectedCategory('partner');
                      onNavigateToBenefits();
                    }}
                    className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-300 text-amber-900 hover:shadow-md transition-all active:scale-95 col-span-2 sm:col-span-1"
                  >
                    <span className="text-xl">🎟</span>
                    <span className="text-[11px] font-extrabold mt-1">GITC 제휴</span>
                    <span className="text-[9px] text-amber-700 font-bold">13곳 할인</span>
                  </button>
                );
              }

              if (cat.isSpecial === 'emergency') {
                return (
                  <button
                    key={cat.key}
                    onClick={() => {
                      setSelectedCategory('emergency');
                      onNavigateToEmergency();
                    }}
                    className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 hover:shadow-md transition-all active:scale-95 col-span-2 sm:col-span-1"
                  >
                    <span className="text-xl">🚑</span>
                    <span className="text-[11px] font-extrabold mt-1">병원·생활</span>
                    <span className="text-[9px] text-rose-600 font-bold">24시 응급</span>
                  </button>
                );
              }

              return (
                <button
                  key={cat.key}
                  onClick={() => setSelectedCategory(cat.key)}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border transition-all active:scale-95 ${
                    isSelected
                      ? 'bg-sky-600 text-white border-sky-600 shadow-md shadow-sky-600/30'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-sky-300 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-sky-600'}`} />
                  <span className="text-[11px] font-bold mt-1 tracking-tight text-center truncate w-full">
                    {cat.label}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Section: "현재 출발지에서 가까운 곳" */}
        <section className="space-y-3 pt-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-base font-extrabold text-slate-900">
                  {originInfo.shortName}에서 가까운 곳
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 font-bold">
                  {filteredPlaces.length}곳
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                선택한 기준점 위치에서 이동시간 순으로 추천합니다.
              </p>
            </div>

            {/* Quick Filter Toggles */}
            <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
              <button
                onClick={() => setOnlyPartner(!onlyPartner)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all shrink-0 ${
                  onlyPartner
                    ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                🎟 GITC 제휴만
              </button>

              <button
                onClick={() => setOnlyKidsFriendly(!onlyKidsFriendly)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all shrink-0 ${
                  onlyKidsFriendly
                    ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                👨‍👩‍👧 아이동반 추천
              </button>
            </div>
          </div>

          {/* Distance Filter Tabs */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 no-scrollbar">
            {(
              [
                { key: 'all', label: '전체 거리' },
                { key: '10min', label: '⚡ 10분 이내' },
                { key: '20min', label: '🚗 20분 이내' },
                { key: '30min', label: '⏱ 30분 이내' },
                { key: 'far', label: '🏞 장거리/투어' },
              ] as const
            ).map((filter) => (
              <button
                key={filter.key}
                onClick={() => setDistanceFilter(filter.key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  distanceFilter === filter.key
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Sorting Options Bar */}
          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <span className="text-[11px]">
              정렬 기준:
            </span>
            <div className="flex items-center space-x-1">
              {(
                [
                  { key: 'distance', label: '가까운 순' },
                  { key: 'rating', label: '평점순' },
                  { key: 'reviews', label: '리뷰순' },
                  { key: 'gitc_pick', label: 'GITC 추천순' },
                ] as const
              ).map((s) => (
                <button
                  key={s.key}
                  onClick={() => setSortOption(s.key)}
                  className={`px-2 py-0.5 rounded-md text-[11px] font-semibold transition-colors ${
                    sortOption === s.key
                      ? 'bg-sky-100 text-sky-800 font-bold'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Places Grid */}
          {filteredPlaces.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 pt-1">
              {filteredPlaces.map((place) => (
                <PlaceCard
                  key={place.id}
                  place={place}
                  currentOrigin={currentOrigin}
                  isFavorite={favorites.includes(place.id)}
                  onToggleFavorite={onToggleFavorite}
                  onClick={onSelectPlace}
                />
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 space-y-2">
              <Compass className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-sm font-bold text-slate-700">
                조건에 맞는 장소가 없습니다.
              </p>
              <p className="text-xs text-slate-400">
                필터나 검색어를 변경해 보세요.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                  setDistanceFilter('all');
                  setOnlyPartner(false);
                  setOnlyKidsFriendly(false);
                }}
                className="mt-2 px-3 py-1.5 rounded-xl bg-sky-50 text-sky-700 text-xs font-bold hover:bg-sky-100"
              >
                필터 전체 해제
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
