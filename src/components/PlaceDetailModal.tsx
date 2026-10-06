/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PlaceItem, OriginId } from '../types/guide';
import { getPlaceTravelInfo, getGoogleMapsDirectionsUrl } from '../utils/distance';
import GitcBadge from './GitcBadge';
import {
  X,
  Star,
  Heart,
  Navigation,
  Phone,
  Clock,
  Compass,
  MapPin,
  Utensils,
  BookOpen,
  Theater,
  AlertCircle,
  ExternalLink,
  Sparkles,
  Users,
} from 'lucide-react';

interface PlaceDetailModalProps {
  place: PlaceItem | null;
  currentOrigin: OriginId;
  isFavorite: boolean;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onClose: () => void;
}

export default function PlaceDetailModal({
  place,
  currentOrigin,
  isFavorite,
  onToggleFavorite,
  onClose,
}: PlaceDetailModalProps) {
  if (!place) return null;

  const { fromCampus, fromMangrove } = getPlaceTravelInfo(place.latitude, place.longitude);
  const directionsUrl = getGoogleMapsDirectionsUrl(
    currentOrigin,
    place.latitude,
    place.longitude,
    place.nameEn,
    place.googlePlaceId
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
      {/* Backdrop click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Dialog Body */}
      <div className="relative w-full sm:max-w-xl max-h-[90vh] sm:max-h-[85vh] bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden z-10 animate-slideUp">
        {/* Modal Header Bar with Close Button */}
        <div className="relative aspect-[16/9] w-full bg-slate-100 shrink-0 overflow-hidden">
          <img
            src={place.imageUrl}
            alt={place.nameKo}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/40" />

          {/* Close & Favorite Floating Buttons */}
          <div className="absolute top-3 inset-x-3 flex items-center justify-between">
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-900/80 text-white backdrop-blur-xs">
              {place.subCategory} · {place.area}
            </span>

            <div className="flex items-center space-x-2">
              <button
                onClick={(e) => onToggleFavorite(place.id, e)}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all backdrop-blur-md ${
                  isFavorite
                    ? 'bg-rose-500 text-white shadow-md'
                    : 'bg-white/90 hover:bg-white text-slate-800'
                }`}
                aria-label="즐겨찾기"
              >
                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-white' : ''}`} />
              </button>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-md transition-colors"
                aria-label="닫기"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Bottom Title inside Hero */}
          <div className="absolute bottom-3 inset-x-4 text-white">
            <div className="flex flex-wrap gap-1.5 mb-1">
              {place.badges.map((b) => (
                <GitcBadge key={b} badge={b} size="sm" />
              ))}
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight drop-shadow-md">
              {place.nameKo}
            </h2>
            <p className="text-xs text-slate-200 font-medium drop-shadow-xs">
              {place.nameEn}
            </p>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-slate-800">
          {/* Dual Origin Travel Info Box (GITC Requirement) */}
          <div className="bg-sky-50/80 rounded-2xl p-3.5 border border-sky-100/90 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-sky-950">
              <span className="flex items-center space-x-1.5">
                <Navigation className="w-4 h-4 text-sky-600 inline" />
                <span>GITC 기준점 이동 정보</span>
              </span>
              <span className="text-[11px] text-sky-700 font-medium">예상 차량 이동</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div
                className={`p-2.5 rounded-xl border transition-all ${
                  currentOrigin === 'gitc_campus'
                    ? 'bg-white border-sky-300 shadow-xs ring-1 ring-sky-300'
                    : 'bg-white/60 border-sky-100 text-slate-600'
                }`}
              >
                <div className="font-bold text-slate-900 flex items-center space-x-1">
                  <span>🎓 GITC 캠퍼스</span>
                  {currentOrigin === 'gitc_campus' && (
                    <span className="text-[9px] bg-sky-500 text-white px-1 rounded">선택됨</span>
                  )}
                </div>
                <div className="mt-1 text-slate-700 font-semibold">
                  {fromCampus.formatted}
                </div>
              </div>

              <div
                className={`p-2.5 rounded-xl border transition-all ${
                  currentOrigin === 'mangrove_residence'
                    ? 'bg-white border-teal-300 shadow-xs ring-1 ring-teal-300'
                    : 'bg-white/60 border-teal-100 text-slate-600'
                }`}
              >
                <div className="font-bold text-slate-900 flex items-center space-x-1">
                  <span>🏠 맹그로브 숙소</span>
                  {currentOrigin === 'mangrove_residence' && (
                    <span className="text-[9px] bg-teal-500 text-white px-1 rounded">선택됨</span>
                  )}
                </div>
                <div className="mt-1 text-slate-700 font-semibold">
                  {fromMangrove.formatted}
                </div>
              </div>
            </div>

            <p className="text-[10px] text-sky-800/80 flex items-center space-x-1">
              <AlertCircle className="w-3 h-3 text-sky-600 shrink-0 inline" />
              <span>교통상황(피크타임 트래픽)에 따라 이동시간이 달라질 수 있습니다.</span>
            </p>
          </div>

          {/* GITC Partner Benefit Banner (If Partner) */}
          {place.partnerBenefit && (
            <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-4 text-white shadow-md shadow-amber-500/20 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black tracking-wider uppercase bg-black/20 px-2 py-0.5 rounded-md">
                  🎟 GITC MEMBER BENEFIT
                </span>
                <span className="text-xs font-extrabold text-amber-100">
                  {place.partnerBenefit.discountValue}
                </span>
              </div>
              <div>
                <h4 className="text-base font-extrabold">{place.partnerBenefit.benefitText}</h4>
                <p className="text-xs text-amber-100 font-medium mt-1">
                  👉 {place.partnerBenefit.requirements}
                </p>
              </div>

              {place.partnerBenefit.additionalNotes && place.partnerBenefit.additionalNotes.length > 0 && (
                <ul className="text-xs text-amber-50 bg-black/15 p-2 rounded-xl space-y-0.5 list-disc list-inside">
                  {place.partnerBenefit.additionalNotes.map((note, idx) => (
                    <li key={idx}>{note}</li>
                  ))}
                </ul>
              )}

              <p className="text-[10px] text-amber-200/90 pt-1 border-t border-white/20">
                ※ 제휴 조건과 할인율은 매장 사정에 따라 변경될 수 있습니다. 방문 전 확인 권장.
              </p>
            </div>
          )}

          {/* Google Ratings & Quick Info Row */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-[11px] text-slate-500 block mb-0.5">Google 평점</span>
              {place.googleRating ? (
                <div className="font-extrabold text-slate-900 flex items-center justify-center space-x-0.5">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span>{place.googleRating.toFixed(1)}</span>
                  <span className="text-[10px] text-slate-400 font-normal">
                    ({place.googleReviewCount ? `${place.googleReviewCount.toLocaleString()}` : ''})
                  </span>
                </div>
              ) : (
                <span className="text-[11px] text-slate-400 font-medium">정보 확인 필요</span>
              )}
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-[11px] text-slate-500 block mb-0.5">가격대</span>
              <span className="font-extrabold text-slate-800">
                {place.priceLevel}
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-[11px] text-slate-500 block mb-0.5">아이 동반</span>
              <span className="font-extrabold text-emerald-700">
                {place.kidsFriendly.level === 3
                  ? '적극 추천'
                  : place.kidsFriendly.level === 2
                  ? '무난함'
                  : '주의 필요'}
              </span>
            </div>
          </div>

          {/* GITC Comment Box */}
          {place.gitcComment && (
            <div className="p-3.5 rounded-2xl bg-sky-50/50 border border-sky-100">
              <div className="text-xs font-bold text-sky-900 flex items-center space-x-1.5 mb-1">
                <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                <span>GITC 캠프 한줄평</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                "{place.gitcComment}"
              </p>
            </div>
          )}

          {/* Educational Point (History/Culture) */}
          {place.educationalPoint && (
            <div className="p-3.5 rounded-2xl bg-indigo-50/60 border border-indigo-100">
              <div className="text-xs font-bold text-indigo-900 flex items-center space-x-1.5 mb-1">
                <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                <span>학생 교육 포인트 (History & Culture)</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                {place.educationalPoint}
              </p>
            </div>
          )}

          {/* Local Experience Box (Local Pick) */}
          {place.localExperienceLevel && (
            <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/80">
              <div className="flex items-center justify-between text-xs font-bold text-amber-900 mb-1">
                <span className="flex items-center space-x-1">
                  <span>🇵🇭 로컬 문화 체험 정보</span>
                </span>
                <span className="text-amber-800">
                  로컬체험도 {'★'.repeat(place.localExperienceLevel.level)}
                  {'☆'.repeat(3 - place.localExperienceLevel.level)}
                </span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                {place.localExperienceLevel.note}
              </p>
              <p className="text-[11px] text-amber-800/80 mt-1.5 pt-1.5 border-t border-amber-200/50">
                ※ 현지 로컬 식당은 관광객 전용 레스토랑과 분위기와 환경이 다를 수 있으나, 세부 현지의 진짜 생활상을 생생하게 체감할 수 있습니다.
              </p>
            </div>
          )}

          {/* Show Details (Show & Performance) */}
          {place.showDetails && (
            <div className="p-3.5 rounded-2xl bg-purple-50/60 border border-purple-200/80 space-y-2">
              <div className="text-xs font-bold text-purple-950 flex items-center space-x-1.5">
                <Theater className="w-4 h-4 text-purple-700" />
                <span>공연 및 관람 정보</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-500 block text-[10px]">공연 요일</span>
                  <span className="font-semibold text-slate-800">{place.showDetails.showDays}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">시작 시간 및 소요</span>
                  <span className="font-semibold text-slate-800">{place.showDetails.showTime}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">성인 관람료</span>
                  <span className="font-bold text-purple-900">{place.showDetails.adultPrice}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">어린이 관람료</span>
                  <span className="font-bold text-purple-900">{place.showDetails.childPrice}</span>
                </div>
              </div>
              <p className="text-xs text-purple-900 bg-white/70 p-2 rounded-lg">
                💡 {place.showDetails.reservationTip}
              </p>
            </div>
          )}

          {/* Recommended Menu */}
          {place.recommendedMenu && place.recommendedMenu.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-900 mb-2 flex items-center space-x-1.5">
                <Utensils className="w-3.5 h-3.5 text-sky-600" />
                <span>추천 메뉴 및 대표 항목</span>
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {place.recommendedMenu.map((menu, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 text-xs font-medium border border-slate-200/60"
                  >
                    {menu}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Description & Highlights */}
          <div className="space-y-2">
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {place.description}
            </p>
            <div className="flex flex-wrap gap-1">
              {place.highlights.map((h, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px]"
                >
                  #{h}
                </span>
              ))}
            </div>
          </div>

          {/* Basic Info: Address, Hours, Phone */}
          <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200/80 space-y-2 text-xs text-slate-600">
            <div className="flex items-start space-x-2">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
              <span>{place.address}</span>
            </div>

            {place.openingHours && (
              <div className="flex items-center space-x-2">
                <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>영업시간: {place.openingHours}</span>
              </div>
            )}

            {place.phone && place.phone !== '정보 확인 필요' && (
              <div className="flex items-center space-x-2">
                <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>전화: {place.phone}</span>
              </div>
            )}
          </div>
        </div>

        {/* Modal Action Footer Buttons */}
        <div className="p-3.5 sm:p-4 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0">
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center space-x-1.5 py-3 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-sky-600/30 transition-all active:scale-[0.98]"
          >
            <Navigation className="w-4 h-4" />
            <span>Google Maps 길찾기</span>
          </a>

          {place.phone && place.phone !== '정보 확인 필요' && (
            <a
              href={`tel:${place.phone.replace(/[^0-9+]/g, '')}`}
              className="flex items-center justify-center p-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm border border-slate-200 transition-all"
              title="전화 걸기"
            >
              <Phone className="w-4 h-4" />
              <span className="hidden sm:inline ml-1.5">전화</span>
            </a>
          )}

          <button
            onClick={(e) => onToggleFavorite(place.id, e)}
            className={`flex items-center justify-center p-3 rounded-xl font-bold text-xs sm:text-sm border transition-all ${
              isFavorite
                ? 'bg-rose-50 text-rose-600 border-rose-200'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200'
            }`}
            title="즐겨찾기"
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
            <span className="hidden sm:inline ml-1.5">
              {isFavorite ? '저장됨' : '즐겨찾기'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
