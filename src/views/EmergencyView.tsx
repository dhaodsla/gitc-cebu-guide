/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { PlaceItem, OriginId } from '../types/guide';
import { ORIGINS } from '../data/originsData';
import { getTravelFromOrigin } from '../utils/distance';
import {
  ShieldAlert,
  Phone,
  Hospital,
  Pill,
  Shield,
  Building2,
  DollarSign,
  ShoppingCart,
  AlertCircle,
  Clock,
  ExternalLink,
  ChevronRight,
  Plane,
} from 'lucide-react';

interface EmergencyViewProps {
  places: PlaceItem[];
  currentOrigin: OriginId;
  onSelectPlace: (place: PlaceItem) => void;
  onBackToHome: () => void;
}

export default function EmergencyView({
  places,
  currentOrigin,
  onSelectPlace,
  onBackToHome,
}: EmergencyViewProps) {
  const [selectedSubCat, setSelectedSubCat] = useState<string>('all');
  const originInfo = ORIGINS[currentOrigin];

  // Verified official contact numbers
  const emergencyDirectHotlines = [
    {
      title: '주세부 대한민국 분관 (사건사고 24시)',
      number: '+63 917 808 3907',
      tel: '+639178083907',
      desc: '여권 분실, 긴급 체류 및 재외국민 긴급 사건사고',
      tag: '한국어 지원',
    },
    {
      title: '영사콜센터 (서울 본부 24시간)',
      number: '+82 2 3210 0404',
      tel: '+82232100404',
      desc: '해외 위난 및 긴급 영사 조력 연중무휴 24시간',
      tag: '연중무휴',
    },
    {
      title: '막탄 닥터스 병원 응급실 (ER)',
      number: '+63 32 236 0000',
      tel: '+63322360000',
      desc: '막탄 내 24시간 응급 진료 및 소아과',
      tag: '24시간',
    },
    {
      title: '청화 병원 막탄 분원 응급실 (ER)',
      number: '+63 32 233 8000',
      tel: '+63322338000',
      desc: '최신 시설 외국인 진료 종합병원',
      tag: '24시간',
    },
    {
      title: '라푸라푸 경찰서 (Tourist Police)',
      number: '+63 32 340 0252',
      tel: '+63323400252',
      desc: '분실물 폴리스 리포트 발급 및 치안',
      tag: '긴급 출동',
    },
  ];

  // Places with emergency metadata
  const emergencyPlaces = places.filter(
    (p) => p.category === 'emergency' || p.category === 'shopping'
  );

  const filterTabs = [
    { key: 'all', label: '전체' },
    { key: 'hospital', label: '🏥 종합병원/응급실' },
    { key: 'pharmacy', label: '💊 24시 약국' },
    { key: 'consulate', label: '🇰🇷 한국 영사관' },
    { key: 'police', label: '👮 경찰서' },
    { key: 'market', label: '🛒 생활마트' },
  ];

  const filteredPlaces = emergencyPlaces.filter((p) => {
    if (selectedSubCat === 'all') return true;
    if (selectedSubCat === 'hospital') return p.emergencyCategory === 'hospital';
    if (selectedSubCat === 'pharmacy') return p.emergencyCategory === 'pharmacy';
    if (selectedSubCat === 'consulate') return p.emergencyCategory === 'consulate';
    if (selectedSubCat === 'police') return p.emergencyCategory === 'police';
    if (selectedSubCat === 'market') return p.emergencyCategory === 'market';
    return true;
  });

  return (
    <div className="space-y-5 pb-24 max-w-4xl mx-auto px-4 pt-4">
      {/* Header */}
      <div>
        <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-xs font-bold mb-1">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>긴급 연락망 & 안전 생활 가이드</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          응급의료 & 비상 연락망
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          학생과 가족의 안전을 위한 검증된 공식 연락처와 병원 정보입니다.
        </p>
      </div>

      {/* 24-Hour Verified Hotlines Card */}
      <section className="bg-slate-900 text-white rounded-3xl p-4 sm:p-5 shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-rose-400 flex items-center space-x-1.5">
            <Phone className="w-4 h-4 animate-pulse" />
            <span>즉시 통화 가능한 공식 핫라인</span>
          </h2>
          <span className="text-[11px] text-slate-400">버튼 터치 시 자동 연결</span>
        </div>

        <div className="space-y-2">
          {emergencyDirectHotlines.map((h, idx) => (
            <div
              key={idx}
              className="bg-slate-800/80 hover:bg-slate-800 p-3 rounded-2xl border border-slate-700/80 flex items-center justify-between transition-colors"
            >
              <div className="space-y-0.5 pr-2">
                <div className="flex items-center space-x-1.5">
                  <span className="font-extrabold text-xs sm:text-sm text-white">
                    {h.title}
                  </span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30">
                    {h.tag}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">{h.desc}</p>
                <p className="text-xs font-mono font-bold text-sky-400">{h.number}</p>
              </div>

              <a
                href={`tel:${h.tel}`}
                className="py-2 px-3.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shrink-0 flex items-center space-x-1 shadow-md shadow-rose-600/30 transition-all active:scale-95"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>통화</span>
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Essential Camp Tips Callout */}
      <section className="bg-amber-50 rounded-2xl p-4 border border-amber-200/90 text-xs text-slate-700 space-y-2">
        <div className="font-extrabold text-amber-950 flex items-center space-x-1.5">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>캠프 참가자 필수 안전 수칙</span>
        </div>
        <ul className="space-y-1 text-slate-700 pl-4 list-disc">
          <li>
            <strong>음용수:</strong> 수돗물은 절대 마시지 마시고 반드시 밀봉된 브랜드 생수(Wilkins, Nature Spring 등)를 구매하여 마시세요.
          </li>
          <li>
            <strong>병원 진료 시:</strong> 여행자 보험 청구를 위해 반드시 <u>Medical Certificate(진단서)</u>와 <u>Official Receipt(공식 영수증)</u> 원본을 수령하세요.
          </li>
          <li>
            <strong>여권 분실 시:</strong> 라푸라푸 경찰서에서 분실 확인서(Police Report) 발급 후 세부 영사관에서 단수 여권을 발급받아야 합니다.
          </li>
        </ul>
      </section>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 no-scrollbar">
        {filterTabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setSelectedSubCat(t.key)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedSubCat === t.key
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Emergency Facilities List */}
      <div className="space-y-3">
        {filteredPlaces.map((place) => {
          const travel = getTravelFromOrigin(currentOrigin, place.latitude, place.longitude);

          return (
            <div
              key={place.id}
              onClick={() => onSelectPlace(place)}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all p-4 cursor-pointer flex flex-col sm:flex-row gap-3.5 group active:scale-[0.99]"
            >
              <div className="relative w-full sm:w-28 aspect-[16/10] sm:aspect-square rounded-xl overflow-hidden shrink-0 bg-slate-100">
                <img
                  src={place.imageUrl}
                  alt={place.nameKo}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                {place.isEmergency24hr && (
                  <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-rose-600 text-white text-[9px] font-black">
                    24H 응급
                  </span>
                )}
              </div>

              <div className="flex-1 flex flex-col justify-between space-y-1.5">
                <div>
                  <div className="flex items-center space-x-1.5 mb-0.5">
                    <span className="text-[11px] font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">
                      {place.subCategory}
                    </span>
                    <span className="text-[10px] text-slate-400">{place.area}</span>
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-base group-hover:text-sky-600 transition-colors">
                    {place.nameKo}
                  </h3>
                  <p className="text-xs text-slate-500">{place.nameEn}</p>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                    {place.description}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                  <span className="text-slate-500 font-medium">
                    {originInfo.icon} {originInfo.nameKo}에서 {travel.formatted}
                  </span>
                  <span className="text-sky-600 font-bold flex items-center">
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
