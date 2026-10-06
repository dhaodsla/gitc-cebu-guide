/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type OriginId = 'gitc_campus' | 'mangrove_residence';

export interface OriginLocation {
  id: OriginId;
  nameKo: string;
  nameEn: string;
  shortName: string;
  icon: string;
  latitude: number;
  longitude: number;
  googlePlaceId: string;
  address: string;
  googleMapsUrl: string;
  description: string;
}

export type CategoryKey =
  | 'all'
  | 'partner'
  | 'food'
  | 'cafe'
  | 'history'
  | 'sightseeing'
  | 'kids'
  | 'show'
  | 'shopping'
  | 'massage'
  | 'emergency'
  | 'local_food';

export type GitcBadge =
  | 'GITC_PICK'
  | 'GITC_PARTNER'
  | 'LOCAL_PICK'
  | 'KOREAN_FAVORITE'
  | 'FAMILY_PICK'
  | 'MICHELIN';

export type KidsAgeRecommendation = '유아 추천' | '초등 추천' | '중학생 추천' | '전연령';

export interface PartnerBenefit {
  partnerNameKo: string;
  partnerNameEn: string;
  discountType: 'percentage' | 'fixed_price' | 'voucher' | 'service';
  discountValue: string; // e.g. "20% 할인", "10% 할인", "5% 할인", "1,500페소"
  benefitText: string;
  requirements: string; // "결제 전 GITC 목걸이 또는 명찰 제시"
  additionalNotes?: string[]; // e.g. ["무료 픽드랍", "10회 이용 시 1,000페소 할인"]
  validFrom?: string;
  validUntil?: string;
  lastVerified: string;
}

export interface ShowDetails {
  showTitle: string;
  venueName: string;
  showDays: string; // e.g. "월~토 (일요일 휴무)"
  showTime: string; // e.g. "19:00 (1회 공연)"
  duration: string; // e.g. "약 70분"
  adultPrice: string; // e.g. "GITC 특별가 1,500페소 (정상가 2,500페소)"
  childPrice: string; // e.g. "GITC 특별가 700페소 (12세 미만)"
  requiresReservation: boolean;
  reservationTip: string;
}

export interface PlaceItem {
  id: string;
  nameKo: string;
  nameEn: string;
  googlePlaceId: string;
  placeVerificationStatus: 'verified' | 'needs_review';
  category: CategoryKey;
  subCategory: string;
  area: '막탄(뉴타운/마리바고)' | '막탄(공항/푼타잉가뇨)' | '코르도바' | '세부시티' | '만다우에' | '부사이(산악)' | '해상(아일랜드)';
  latitude: number;
  longitude: number;
  address: string;
  description: string;
  gitcComment: string;
  recommendedFor: string[];
  priceLevel: '₱' | '₱₱' | '₱₱₱' | '₱₱₱₱' | '정보 확인 필요';
  kidsFriendly: {
    level: 1 | 2 | 3; // 1~3 stars
    ageGroups?: KidsAgeRecommendation[];
    note?: string;
  };
  localExperienceLevel?: {
    level: 1 | 2 | 3; // 1~3 stars
    note: string;
  };
  educationalPoint?: string; // 역사 문화 교육 포인트
  recommendedMenu?: string[];
  highlights: string[];
  badges: GitcBadge[];
  imageUrl: string;
  
  // Real Google Maps / Places attributes
  googleRating?: number; // Real rating if verified, undefined if needs review
  googleReviewCount?: number;
  openingHours?: string;
  website?: string;
  phone?: string;
  
  // GITC Partner details
  partnerBenefit?: PartnerBenefit;
  
  // Special show attributes
  showDetails?: ShowDetails;

  // Emergency metadata
  isEmergency24hr?: boolean;
  emergencyCategory?: 'hospital' | 'pharmacy' | 'police' | 'consulate' | 'money' | 'market';

  lastVerified: string;
  active: boolean;
}

export interface CourseStop {
  placeId: string;
  stopNameKo: string;
  stopNameEn: string;
  recommendedDuration: string;
  activityNote: string;
}

export interface RecommendedCourse {
  id: string;
  titleKo: string;
  subTitle: string;
  description: string;
  totalDuration: string;
  recommendedStartTime: string;
  kidsFriendlySummary: string;
  theme: string;
  stops: CourseStop[];
  coverImage: string;
}
