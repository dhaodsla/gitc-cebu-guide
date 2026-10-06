/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { RecommendedCourse, PlaceItem, OriginId } from '../types/guide';
import { COURSES_DATA } from '../data/coursesData';
import { ORIGINS } from '../data/originsData';
import {
  Route,
  Clock,
  Sun,
  Baby,
  ChevronDown,
  ChevronUp,
  MapPin,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

interface CoursesViewProps {
  places: PlaceItem[];
  currentOrigin: OriginId;
  onSelectPlace: (place: PlaceItem) => void;
}

export default function CoursesView({
  places,
  currentOrigin,
  onSelectPlace,
}: CoursesViewProps) {
  const [expandedCourseId, setExpandedCourseId] = useState<string>(
    COURSES_DATA[0].id
  );

  const toggleCourse = (id: string) => {
    setExpandedCourseId((prev) => (prev === id ? '' : id));
  };

  const findPlace = (placeId: string) => {
    return places.find((p) => p.id === placeId);
  };

  const handleOpenCourseMap = (course: RecommendedCourse) => {
    // Builds multi-stop Google Maps URL
    const origin = ORIGINS[currentOrigin];
    const stopPlaces = course.stops
      .map((s) => findPlace(s.placeId))
      .filter((p): p is PlaceItem => Boolean(p));

    if (stopPlaces.length === 0) return;

    const originCoord = `${origin.latitude},${origin.longitude}`;
    const destCoord = `${stopPlaces[stopPlaces.length - 1].latitude},${
      stopPlaces[stopPlaces.length - 1].longitude
    }`;
    const waypoints = stopPlaces
      .slice(0, -1)
      .map((p) => `${p.latitude},${p.longitude}`)
      .join('|');

    let url = `https://www.google.com/maps/dir/?api=1&origin=${originCoord}&destination=${destCoord}`;
    if (waypoints) {
      url += `&waypoints=${waypoints}`;
    }
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-5 pb-24 max-w-4xl mx-auto px-4 pt-4">
      {/* Top Header */}
      <div>
        <div className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 text-xs font-bold mb-1.5">
          <Route className="w-3.5 h-3.5" />
          <span>GITC 추천 여행 코스</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          실패 없는 세부 맞춤 코스 5선
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          가족캠프와 학생들의 실제 이동 동선을 고려해 기획한 추천 여행 경로입니다.
        </p>
      </div>

      {/* Courses List */}
      <div className="space-y-4">
        {COURSES_DATA.map((course) => {
          const isExpanded = expandedCourseId === course.id;

          return (
            <div
              key={course.id}
              className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden transition-all duration-200"
            >
              {/* Header Card */}
              <div
                onClick={() => toggleCourse(course.id)}
                className="relative cursor-pointer group"
              >
                <div className="relative aspect-[21/9] sm:aspect-[24/9] w-full overflow-hidden bg-slate-100">
                  <img
                    src={course.coverImage}
                    alt={course.titleKo}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent" />

                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-900/80 text-sky-300 text-[11px] font-bold backdrop-blur-xs">
                    {course.theme}
                  </div>

                  <div className="absolute bottom-3 inset-x-4 text-white">
                    <h3 className="text-lg sm:text-xl font-black drop-shadow-md">
                      {course.titleKo}
                    </h3>
                    <p className="text-xs text-slate-200 line-clamp-1 drop-shadow-xs">
                      {course.subTitle}
                    </p>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 border-b border-slate-200/70 flex items-center justify-between text-xs text-slate-600">
                  <div className="flex items-center space-x-3">
                    <span className="flex items-center space-x-1 font-semibold text-slate-800">
                      <Clock className="w-3.5 h-3.5 text-sky-600" />
                      <span>{course.totalDuration}</span>
                    </span>
                    <span className="hidden sm:flex items-center space-x-1 text-slate-500">
                      <Sun className="w-3.5 h-3.5 text-amber-500" />
                      <span>{course.recommendedStartTime}</span>
                    </span>
                  </div>

                  <div className="flex items-center space-x-1 text-sky-600 font-bold">
                    <span>{isExpanded ? '코스 접기' : '코스 상세보기'}</span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </div>
              </div>

              {/* Expanded Course Content */}
              {isExpanded && (
                <div className="p-4 sm:p-5 space-y-4 animate-fadeIn">
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
                    {course.description}
                  </p>

                  {/* Summary badges */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-amber-50 text-amber-900 border border-amber-200/80 flex items-center space-x-2">
                      <Sun className="w-4 h-4 text-amber-600 shrink-0" />
                      <div>
                        <span className="font-bold block text-[11px]">추천 출발 시간</span>
                        <span>{course.recommendedStartTime}</span>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200/80 flex items-center space-x-2">
                      <Baby className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div>
                        <span className="font-bold block text-[11px]">아이동반 가이드</span>
                        <span>{course.kidsFriendlySummary}</span>
                      </div>
                    </div>
                  </div>

                  {/* Step by Step Timeline */}
                  <div className="pt-2">
                    <h4 className="text-xs font-extrabold uppercase text-slate-500 mb-3 tracking-wider">
                      코스 일정 및 장소
                    </h4>

                    <div className="space-y-3 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200">
                      {course.stops.map((stop, idx) => {
                        const place = findPlace(stop.placeId);

                        return (
                          <div
                            key={idx}
                            className="relative flex items-start space-x-3.5 group"
                          >
                            {/* Step Number Dot */}
                            <div className="w-7 h-7 rounded-full bg-sky-600 text-white font-extrabold text-xs flex items-center justify-center shrink-0 z-10 shadow-md shadow-sky-600/30">
                              {idx + 1}
                            </div>

                            {/* Step Card */}
                            <div
                              onClick={() => place && onSelectPlace(place)}
                              className="flex-1 bg-slate-50 hover:bg-sky-50/50 p-3 rounded-2xl border border-slate-200 hover:border-sky-200 transition-all cursor-pointer"
                            >
                              <div className="flex items-center justify-between mb-1">
                                <h5 className="font-extrabold text-slate-900 text-xs sm:text-sm group-hover:text-sky-600 transition-colors">
                                  {stop.stopNameKo}
                                </h5>
                                <span className="text-[10px] font-bold text-sky-700 bg-sky-100 px-1.5 py-0.5 rounded-md">
                                  {stop.recommendedDuration}
                                </span>
                              </div>
                              <p className="text-xs text-slate-600 leading-normal">
                                {stop.activityNote}
                              </p>
                              {place && (
                                <span className="inline-block mt-1.5 text-[11px] font-bold text-sky-600 underline">
                                  장소 정보 상세 보기 &rarr;
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Open in Google Maps Button */}
                  <div className="pt-2">
                    <button
                      onClick={() => handleOpenCourseMap(course)}
                      className="w-full py-3 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-md transition-all active:scale-[0.98]"
                    >
                      <MapPin className="w-4 h-4 text-sky-400" />
                      <span>지도에서 전체 코스 경로 보기</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
