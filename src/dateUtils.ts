/**
 * 주어진 날짜가 해당 월의 몇 번째 주인지 계산합니다.
 * (일요일 시작 기준)
 */
export const getWeekOfMonth = (date: Date): number => {
  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const firstDayOfWeek = firstDayOfMonth.getDay(); // 0 (Sun) - 6 (Sat)
  const offsetDate = date.getDate() + firstDayOfWeek - 1;
  return Math.floor(offsetDate / 7) + 1;
};

/**
 * 날짜를 YYYY-MM-DD 형식의 문자열로 변환합니다.
 */
export const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getDayName = (date: Date): string => {
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  return days[date.getDay()];
};