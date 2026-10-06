/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Home, MapPin, Ticket, Route, Heart } from 'lucide-react';

export type TabKey = 'home' | 'map' | 'benefits' | 'courses' | 'favorites';

interface BottomNavProps {
  currentTab: TabKey;
  onSelectTab: (tab: TabKey) => void;
  favoritesCount: number;
}

export default function BottomNav({
  currentTab,
  onSelectTab,
  favoritesCount,
}: BottomNavProps) {
  const tabs = [
    { key: 'home' as TabKey, label: '홈', icon: Home },
    { key: 'map' as TabKey, label: '지도', icon: MapPin },
    { key: 'benefits' as TabKey, label: '제휴혜택', icon: Ticket, badge: '13' },
    { key: 'courses' as TabKey, label: '추천코스', icon: Route },
    {
      key: 'favorites' as TabKey,
      label: '즐겨찾기',
      icon: Heart,
      badge: favoritesCount > 0 ? String(favoritesCount) : undefined,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] pb-safe">
      <div className="max-w-md mx-auto grid grid-cols-5 h-16">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.key;

          return (
            <button
              key={tab.key}
              onClick={() => onSelectTab(tab.key)}
              className={`relative flex flex-col items-center justify-center py-1 transition-all ${
                isActive ? 'text-sky-600 font-bold' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform duration-150 ${
                    isActive ? 'scale-110 text-sky-600 stroke-[2.3]' : 'stroke-[1.8]'
                  }`}
                />
                {tab.badge && (
                  <span
                    className={`absolute -top-1.5 -right-2.5 px-1 min-w-[15px] h-[15px] text-[9px] font-extrabold rounded-full flex items-center justify-center ${
                      tab.key === 'benefits'
                        ? 'bg-amber-500 text-white'
                        : 'bg-rose-500 text-white'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className={`text-[11px] mt-1 tracking-tight ${isActive ? 'font-bold' : 'font-medium'}`}>
                {tab.label}
              </span>
              {isActive && (
                <span className="absolute bottom-1 w-5 h-0.5 bg-sky-600 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
