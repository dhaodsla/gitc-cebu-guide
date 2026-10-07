/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { PlaceItem, PhotoSource } from '../types/guide';
import { getCategoryPlaceholder } from './categoryPlaceholders';
import { PRE_RESOLVED_GOOGLE_PHOTOS } from '../data/googlePlacePhotos';

const STORAGE_CACHE_KEY = 'gitc_cebu_google_photos_v1';

// In-memory runtime cache initialized from pre-resolved real Google Maps photos
const memoryPhotoCache = new Map<string, string>();

// Initialize memory cache with pre-resolved Google Maps photos
Object.entries(PRE_RESOLVED_GOOGLE_PHOTOS).forEach(([placeId, url]) => {
  if (url && placeId) {
    memoryPhotoCache.set(placeId, url);
  }
});

// Load any persisted client cache from localStorage
if (typeof window !== 'undefined') {
  try {
    const raw = localStorage.getItem(STORAGE_CACHE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      Object.entries(parsed).forEach(([placeId, url]) => {
        if (typeof url === 'string') {
          memoryPhotoCache.set(placeId, url);
        }
      });
    }
  } catch {
    // Ignore localStorage read errors
  }
}

function persistCacheToStorage() {
  if (typeof window === 'undefined') return;
  try {
    const obj: Record<string, string> = {};
    memoryPhotoCache.forEach((v, k) => {
      obj[k] = v;
    });
    localStorage.setItem(STORAGE_CACHE_KEY, JSON.stringify(obj));
  } catch {
    // Ignore storage quota errors
  }
}

export interface ResolvedPhoto {
  url: string;
  source: PhotoSource;
  isPlaceholder: boolean;
}

/**
 * Synchronous photo resolution following the strict priority rules:
 * 1. customImage (admin/partner registered real image)
 * 2. Google Places API real place photo (via Place ID)
 * 3. category-placeholder (clean vector graphic placeholder, never fake AI)
 */
export function resolvePlacePhotoSync(place: PlaceItem): ResolvedPhoto {
  // 1st Priority: Admin/Partner custom image
  if (place.customImage && place.customImage.trim().length > 0) {
    return {
      url: place.customImage,
      source: 'custom',
      isPlaceholder: false,
    };
  }

  // 2nd Priority: Google Places real photo from cache
  if (place.googlePlaceId && memoryPhotoCache.has(place.googlePlaceId)) {
    const googleUrl = memoryPhotoCache.get(place.googlePlaceId)!;
    return {
      url: googleUrl,
      source: 'google',
      isPlaceholder: false,
    };
  }

  // 3rd Priority: Category placeholder
  return {
    url: getCategoryPlaceholder(place.category),
    source: 'category-placeholder',
    isPlaceholder: true,
  };
}

/**
 * React hook to get a place photo with asynchronous Google Places fallback
 * if not already in pre-resolved cache.
 */
export function usePlacePhoto(place: PlaceItem): {
  photoUrl: string;
  photoSource: PhotoSource;
  isPlaceholder: boolean;
  onImageError: () => void;
} {
  const [photoInfo, setPhotoInfo] = useState<ResolvedPhoto>(() => resolvePlacePhotoSync(place));
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
    const initial = resolvePlacePhotoSync(place);
    setPhotoInfo(initial);

    // If already has customImage or cached Google photo, no async fetch needed
    if (initial.source === 'custom' || initial.source === 'google') {
      return;
    }

    // Attempt client-side Google PlacesService fetch if googlePlaceId is available
    const win = typeof window !== 'undefined' ? (window as unknown as { google?: any }) : null;
    if (
      place.googlePlaceId &&
      win?.google?.maps?.places
    ) {
      try {
        const dummyDiv = document.createElement('div');
        const service = new win.google.maps.places.PlacesService(dummyDiv);

        service.getDetails(
          {
            placeId: place.googlePlaceId,
            fields: ['photos'],
          },
          (placeResult: any, status: any) => {
            if (
              status === win.google.maps.places.PlacesServiceStatus.OK &&
              placeResult?.photos &&
              placeResult.photos.length > 0
            ) {
              const photoUrl = placeResult.photos[0].getUrl({ maxWidth: 800, maxHeight: 600 });
              if (photoUrl) {
                memoryPhotoCache.set(place.googlePlaceId, photoUrl);
                persistCacheToStorage();
                setPhotoInfo({
                  url: photoUrl,
                  source: 'google',
                  isPlaceholder: false,
                });
              }
            }
          }
        );
      } catch {
        // Fallback remains category-placeholder
      }
    }
  }, [place.id, place.googlePlaceId, place.customImage, place.category]);

  const onImageError = () => {
    // Graceful error recovery: immediately switch to category placeholder
    setHasError(true);
    setPhotoInfo({
      url: getCategoryPlaceholder(place.category),
      source: 'category-placeholder',
      isPlaceholder: true,
    });
  };

  if (hasError) {
    return {
      photoUrl: getCategoryPlaceholder(place.category),
      photoSource: 'category-placeholder',
      isPlaceholder: true,
      onImageError: () => {},
    };
  }

  return {
    photoUrl: photoInfo.url,
    photoSource: photoInfo.source,
    isPlaceholder: photoInfo.isPlaceholder,
    onImageError,
  };
}
