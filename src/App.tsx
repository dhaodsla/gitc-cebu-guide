/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { PlaceItem, OriginId } from './types/guide';
import { PLACES_DATA } from './data/placesData';
import { useFavorites } from './utils/favorites';
import Header from './components/Header';
import BottomNav, { TabKey } from './components/BottomNav';
import QuotaBanner from './components/QuotaBanner';
import PlaceDetailModal from './components/PlaceDetailModal';
import HomeView from './views/HomeView';
import MapView from './views/MapView';
import BenefitsView from './views/BenefitsView';
import CoursesView from './views/CoursesView';
import FavoritesView from './views/FavoritesView';
import EmergencyView from './views/EmergencyView';

export default function App() {
  const [currentOrigin, setCurrentOrigin] = useState<OriginId>('gitc_campus');
  const [currentTab, setCurrentTab] = useState<TabKey>('home');
  const [activePlace, setActivePlace] = useState<PlaceItem | null>(null);
  const [isEmergencySubView, setIsEmergencySubView] = useState(false);

  const { favorites, toggle, isFavorite } = useFavorites();

  const apiKey =
    import.meta.env.VITE_GOOGLE_MAPS_API_KEY ||
    'AIzaSyAGCA4kjm2jIGJ_IpoGaQcf9_OUB0olh6g';

  const handleTabChange = (tab: TabKey) => {
    setIsEmergencySubView(false);
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectPlace = (place: PlaceItem) => {
    setActivePlace(place);
  };

  const handleToggleFavorite = (placeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    toggle(placeId);
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans antialiased selection:bg-sky-500 selection:text-white">
      {/* Google Maps Demo Quota Warning Banner */}
      <QuotaBanner />

      {/* Persistent App Header with Origin Switcher */}
      <Header
        currentOrigin={currentOrigin}
        onSelectOrigin={(id) => setCurrentOrigin(id)}
      />

      {/* Main View Container */}
      <main className="flex-1 w-full max-w-4xl mx-auto">
        {isEmergencySubView ? (
          <EmergencyView
            places={PLACES_DATA}
            currentOrigin={currentOrigin}
            onSelectPlace={handleSelectPlace}
            onBackToHome={() => setIsEmergencySubView(false)}
          />
        ) : (
          <>
            {currentTab === 'home' && (
              <HomeView
                places={PLACES_DATA}
                currentOrigin={currentOrigin}
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
                onSelectPlace={handleSelectPlace}
                onNavigateToBenefits={() => handleTabChange('benefits')}
                onNavigateToEmergency={() => setIsEmergencySubView(true)}
              />
            )}

            {currentTab === 'map' && (
              <MapView
                places={PLACES_DATA}
                currentOrigin={currentOrigin}
                onSelectOrigin={setCurrentOrigin}
                onSelectPlace={handleSelectPlace}
                apiKey={apiKey}
              />
            )}

            {currentTab === 'benefits' && (
              <BenefitsView
                places={PLACES_DATA}
                currentOrigin={currentOrigin}
                onSelectPlace={handleSelectPlace}
              />
            )}

            {currentTab === 'courses' && (
              <CoursesView
                places={PLACES_DATA}
                currentOrigin={currentOrigin}
                onSelectPlace={handleSelectPlace}
              />
            )}

            {currentTab === 'favorites' && (
              <FavoritesView
                places={PLACES_DATA}
                currentOrigin={currentOrigin}
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
                onSelectPlace={handleSelectPlace}
                onExploreHome={() => handleTabChange('home')}
              />
            )}
          </>
        )}
      </main>

      {/* Fixed Mobile Bottom Navigation */}
      <BottomNav
        currentTab={currentTab}
        onSelectTab={handleTabChange}
        favoritesCount={favorites.length}
      />

      {/* Place Detail Dialog / Modal */}
      <PlaceDetailModal
        place={activePlace}
        currentOrigin={currentOrigin}
        isFavorite={activePlace ? isFavorite(activePlace.id) : false}
        onToggleFavorite={handleToggleFavorite}
        onClose={() => setActivePlace(null)}
      />
    </div>
  );
}
