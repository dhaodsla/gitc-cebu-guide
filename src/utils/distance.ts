/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ORIGINS } from '../data/originsData';
import { OriginId } from '../types/guide';

/**
 * Calculates haversine distance in kilometers
 */
export function getHaversineDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Computes realistic road distance and travel time in Cebu.
 * Factors in Mactan roads, bridge crossings (Marcelo Fernan & CCLEX), and Busay mountain elevation.
 */
export function estimateRoadTravel(
  originLat: number,
  originLng: number,
  destLat: number,
  destLng: number
): { distanceKm: number; durationMin: number; formatted: string } {
  const straightKm = getHaversineDistanceKm(originLat, originLng, destLat, destLng);
  
  // Is destination on Cebu mainland (across the channel, longitude < 123.95)?
  const isCebuMainland = destLng < 123.96;
  const isBusayMountain = destLat > 10.36 && destLng < 123.90;
  const isIslandHopping = destLat < 10.22 && destLng > 123.98; // Nalusuan, Caohagan, etc.

  let detourFactor = 1.35;
  let avgSpeedKmh = 25; // Typical Cebu / Mactan traffic speed

  if (isIslandHopping) {
    // Sea distance / boat ride from Maribago / Punta Engano port
    // Port drive (~10-15m) + boat ride (20-40m)
    const boatDistanceKm = Number((straightKm * 1.15).toFixed(1));
    const boatDurationMin = Math.max(25, Math.round(boatDistanceKm * 3.5));
    return {
      distanceKm: boatDistanceKm,
      durationMin: boatDurationMin,
      formatted: `약 ${boatDistanceKm}km · 보트 약 ${boatDurationMin}분`,
    };
  }

  if (isCebuMainland) {
    detourFactor = 1.55; // Bridge detours (Marcelo Fernan / CCLEX)
    avgSpeedKmh = 22; // City bottleneck traffic
  }

  if (isBusayMountain) {
    detourFactor = 1.65;
    avgSpeedKmh = 24; // Mountain road slope
  }

  // Very close destinations (< 1.5km) in Mactan
  if (straightKm < 1.5) {
    detourFactor = 1.25;
    avgSpeedKmh = 18; // Local barangay inner roads
  }

  const distanceKm = Number((straightKm * detourFactor).toFixed(1));
  let durationMin = Math.round((distanceKm / avgSpeedKmh) * 60);
  if (durationMin < 3) durationMin = 3;

  return {
    distanceKm,
    durationMin,
    formatted: `${distanceKm}km · 차량 약 ${durationMin}분`,
  };
}

/**
 * Returns travel info for both origins (Campus & Mangrove)
 */
export function getPlaceTravelInfo(destLat: number, destLng: number) {
  const campus = ORIGINS.gitc_campus;
  const mangrove = ORIGINS.mangrove_residence;

  const fromCampus = estimateRoadTravel(campus.latitude, campus.longitude, destLat, destLng);
  const fromMangrove = estimateRoadTravel(mangrove.latitude, mangrove.longitude, destLat, destLng);

  return {
    fromCampus,
    fromMangrove,
  };
}

/**
 * Returns travel info for specific chosen origin
 */
export function getTravelFromOrigin(originId: OriginId, destLat: number, destLng: number) {
  const origin = ORIGINS[originId];
  return estimateRoadTravel(origin.latitude, origin.longitude, destLat, destLng);
}

/**
 * Generates an official Google Maps navigation link from the selected origin to the destination
 */
export function getGoogleMapsDirectionsUrl(
  originId: OriginId,
  destLat: number,
  destLng: number,
  destName?: string,
  placeId?: string
): string {
  const origin = ORIGINS[originId];
  const originCoord = `${origin.latitude},${origin.longitude}`;
  const destCoord = `${destLat},${destLng}`;

  let url = `https://www.google.com/maps/dir/?api=1&origin=${originCoord}&destination=${destCoord}&travelmode=driving`;
  if (placeId) {
    url += `&destination_place_id=${placeId}`;
  }
  return url;
}
