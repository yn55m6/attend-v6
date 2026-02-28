import type { Session } from '../types';

export const DAYS = ['일', '월', '화', '수', '목', '금', '토'];

export const SESSIONS: Session[] = [
  { code: 'MON_1', name: '월요 요가 A', day: '월', time: '10:00~11:00' },
  { code: 'MON_2', name: '월요 요가 B', day: '월', time: '11:10~12:10' },
  { code: 'TUE_1', name: '화요 댄스', day: '화', time: '14:00~15:30' },
  { code: 'WED_1', name: '수요 명상', day: '수', time: '10:00~11:00' },
  { code: 'THU_1', name: '목요 서예', day: '목', time: '13:00~15:00' },
  { code: 'FRI_1', name: '금요 노래교실', day: '금', time: '10:00~12:00' },
];