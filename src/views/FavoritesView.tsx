/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PlaceItem, OriginId } from '../types/guide';
import PlaceCard from '../components/PlaceCard';
import { Heart, Compass, Trash2 } from 'lucide-react';

interface FavoritesViewProps {
  places: PlaceItem[];
  currentOrigin: OriginId;
  favorites: string[];
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onSelectPlace: (place: PlaceItem) => void;
  onExploreHome: () => void;
}

export default function FavoritesView({
  places,
  currentOrigin,
  favorites,
  onToggleFavorite,
  onSelectPlace,
  onExploreHome,
}: FavoritesViewProps) {
  const favoritePlaces = places.filter((p) => favorites.includes(p.id));

  return (
    <div className="space-y-5 pb-24 max-w-4xl mx-auto px-4 pt-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-xs font-bold mb-1">
            <Heart className="w-3.5 h-3.5 fill-rose-600 text-rose-600" />
            <span>나의 저장 목록</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            즐겨찾는 장소 ({favoritePlaces.length})
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            가고 싶은 맛집과 관광지를 하트로 모아두세요.
          </p>
        </div>
      </div>

      {favoritePlaces.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
          {favoritePlaces.map((place) => (
            <PlaceCard
              key={place.id}
              place={place}
              currentOrigin={currentOrigin}
              isFavorite={true}
              onToggleFavorite={onToggleFavorite}
              onClick={onSelectPlace}
            />
          ))}
        </div>
      ) : (
        <div className="py-16 px-6 text-center bg-white rounded-3xl border border-slate-200/90 shadow-xs space-y-3">
          <div className="w-14 h-14 rounded-full bg-rose-50 text-rose-500 mx-auto flex items-center justify-center">
            <Heart className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-800">
            아직 저장된 장소가 없습니다
          </h3>
          <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
            마음에 드는 식당이나 카페, 관광지의 하트(❤️) 버튼을 누르면 여기에 저장됩니다.
          </p>
          <button
            onClick={onExploreHome}
            className="mt-2 px-5 py-2.5 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md shadow-sky-600/30 transition-all active:scale-95"
          >
            추천 장소 둘러보기
          </button>
        </div>
      )}
    </div>
  );
}
