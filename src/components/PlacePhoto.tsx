/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PlaceItem } from '../types/guide';
import { usePlacePhoto } from '../utils/placePhotos';
import { getCategoryPlaceholder } from '../utils/categoryPlaceholders';

interface PlacePhotoProps {
  place: PlaceItem;
  alt?: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  showSourceBadge?: boolean;
}

export default function PlacePhoto({
  place,
  alt,
  className = 'w-full h-full object-cover',
  loading = 'lazy',
  showSourceBadge = false,
}: PlacePhotoProps) {
  const { photoUrl, photoSource, isPlaceholder, onImageError } = usePlacePhoto(place);

  const handleImgError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const placeholder = getCategoryPlaceholder(place.category);
    if (e.currentTarget.src !== placeholder) {
      e.currentTarget.src = placeholder;
    }
    onImageError();
  };

  return (
    <div className="relative w-full h-full overflow-hidden bg-slate-900">
      <img
        src={photoUrl}
        alt={alt || place.nameKo}
        loading={loading}
        className={`${className} transition-opacity duration-300`}
        onError={handleImgError}
      />

      {/* Optional subtle source indicator */}
      {showSourceBadge && !isPlaceholder && photoSource === 'google' && (
        <div className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-[10px] font-medium text-slate-300 pointer-events-none">
          Google Maps
        </div>
      )}
    </div>
  );
}
