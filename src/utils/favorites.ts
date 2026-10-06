/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';

const STORAGE_KEY = 'gitc_cebu_guide_favorites_v1';

export function getFavorites(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveFavorites(favs: string[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favs));
    window.dispatchEvent(new Event('favorites-updated'));
  } catch (e) {
    console.error('Failed to save favorites to localStorage', e);
  }
}

export function toggleFavorite(placeId: string): boolean {
  const current = getFavorites();
  const exists = current.includes(placeId);
  const next = exists ? current.filter((id) => id !== placeId) : [...current, placeId];
  saveFavorites(next);
  return !exists;
}

export function useFavorites() {
  const [favorites, setFavoritesState] = useState<string[]>(() => getFavorites());

  useEffect(() => {
    const handler = () => {
      setFavoritesState(getFavorites());
    };
    window.addEventListener('favorites-updated', handler);
    window.addEventListener('storage', handler);
    return () => {
      window.removeEventListener('favorites-updated', handler);
      window.removeEventListener('storage', handler);
    };
  }, []);

  const toggle = (placeId: string) => {
    const isNowFav = toggleFavorite(placeId);
    setFavoritesState(getFavorites());
    return isNowFav;
  };

  const isFavorite = (placeId: string) => favorites.includes(placeId);

  return { favorites, toggle, isFavorite };
}
