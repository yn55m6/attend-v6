import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { SESSIONS, DAYS } from '../utils/constants';
import AttendanceModal from '../components/attendance/AttendanceModal';
import { AlertCircle, Clock } from 'lucide-react';

const QRScanPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [session, setSession] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const sessionCode = searchParams.get('session');
    if (!sessionCode) {
      setError('잘못된 접근입니다. QR 코드를 다시 스캔해 주세요.');
      return;
    }

    const foundSession = SESSIONS.find(s => s.code === sessionCode);
    if (!foundSession) {
      setError('존재하지 않는 수업 정보입니다.');
      return;
    }

    // 요일 및 시간 유효성 검사
    const now = new Date();
    const currentDay = DAYS[now.getDay()];
    const currentTime = now.getHours() * 100 + now.getMinutes();

    if (foundSession.day !== currentDay) {
      setError(`오늘은 ${foundSession.day}요일이 아닙니다. (현재: ${currentDay}요일)`);
      return;
    }

    const [start, end] = foundSession.time.split('~').map((t: string) => parseInt(t.replace(':', '')));
    // 출석 가능 시간: 시작 30분 전 ~ 종료 10분 후 (예시 로직)
    if (currentTime < start - 30 || currentTime > end + 10) {
      setError(`출석 가능 시간이 아닙니다. (수업 시간: ${foundSession.time})`);
      return;
    }

    setSession(foundSession);
    setShowModal(true);
  }, [searchParams]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-red-100 p-6 rounded-full mb-6">
          <AlertCircle className="w-16 h-12 text-red-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-4">출석 불가</h1>
        <p className="text-xl text-gray-600 mb-8 break-keep">{error}</p>
        <button 
          onClick={() => navigate('/')}
          className="bg-gray-800 text-white px-8 py-4 rounded-xl text-xl font-bold"
        >
          홈으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center">
      <div className="text-center">
        <Clock className="w-16 h-16 text-blue-400 animate-pulse mx-auto mb-4" />
        <p className="text-2xl font-bold text-blue-800">출석 정보를 확인 중입니다...</p>
      </div>
      {showModal && <AttendanceModal session={session} onClose={() => navigate('/')} />}
    </div>
  );
};

export default QRScanPage;