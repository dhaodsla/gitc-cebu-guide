/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { OriginLocation } from '../types/guide';

export const ORIGINS: Record<'gitc_campus' | 'mangrove_residence', OriginLocation> = {
  gitc_campus: {
    id: 'gitc_campus',
    nameKo: 'GITC 캠퍼스',
    nameEn: 'GITC Cebu Academy',
    shortName: '🎓 GITC 캠퍼스',
    icon: '🎓',
    latitude: 10.300557,
    longitude: 124.0078988,
    googlePlaceId: 'ChIJ329eZeaXqTMRTToj57KFpxw',
    address: 'Sitio Dapdap Casanta Soong, Lapu-Lapu, 6015 Cebu, Philippines',
    googleMapsUrl: 'https://maps.app.goo.gl/Ao4GBmovrRxS47nq9?g_st=ic',
    description: 'GITC Cebu 어학원 본교 캠퍼스. 수업 강의실 및 메인 캠프 액티비티 출발지점입니다.',
  },
  mangrove_residence: {
    id: 'mangrove_residence',
    nameKo: '맹그로브 숙소',
    nameEn: 'Mangrove Place and Residences',
    shortName: '🏠 맹그로브 숙소',
    icon: '🏠',
    latitude: 10.3107823,
    longitude: 124.0100584,
    googlePlaceId: 'ChIJH6CuLe6XqTMRFa-fWa-KtnE',
    address: 'Mangrove Place Mactan, M.L. Quezon National Highway, Lapu-Lapu, 6015 Cebu, Philippines',
    googleMapsUrl: 'https://maps.google.com/?cid=12797686036136599317',
    description: 'GITC 가족캠프 및 학생 공식 레지던스 숙소. LG Garden Walk 및 막탄 뉴타운 인근에 위치합니다.',
  },
};
