export const DAYS = ['월', '화', '수', '목', '금', '토'];
export const TIMES = ['오전', '오후', '저녁'];

export interface Session {
  id: string;
  day: string;
  time: string;
  code: string; // QR Code value
  label: string;
}

// 요일별/시간대별 수업 목록 생성
// 월~금: 오전, 오후, 저녁
// 토: 오후만
// 일: 없음
export const SESSIONS: Session[] = [];

DAYS.forEach((day) => {
  if (day === '토') {
    const id = `${day}-오후`;
    SESSIONS.push({ id, day, time: '오후', code: id, label: `${day}요일 오후반` });
  } else {
    TIMES.forEach((time) => {
      const id = `${day}-${time}`;
      SESSIONS.push({ id, day, time, code: id, label: `${day}요일 ${time}반` });
    });
  }
});

export const ADMIN_PASSWORD_KEY = 'admin_password';