import React from 'react';
import { SESSIONS, DAYS } from '../utils/constants';
import { Calendar, Clock, CheckCircle } from 'lucide-react';

const HomePage: React.FC = () => {
  const now = new Date();
  const todayName = DAYS[now.getDay()];
  const todayDate = now.toLocaleDateString('ko-KR', { 
    year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' 
  });

  const todaySessions = SESSIONS.filter(s => s.day === todayName);

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      <header className="text-center py-4">
        <h1 className="text-2xl font-bold text-gray-500 mb-2">오늘의 현황</h1>
        <div className="text-3xl font-black text-blue-600">{todayDate}</div>
      </header>

      <section className="space-y-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Calendar className="text-blue-500" /> 오늘 진행되는 수업
        </h2>
        
        {todaySessions.length > 0 ? (
          todaySessions.map(session => (
            <div key={session.code} className="bg-white p-6 rounded-3xl shadow-sm border-2 border-blue-50 flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-800">{session.name}</div>
                <div className="text-gray-500 flex items-center gap-1 mt-1 text-lg">
                  <Clock size={18} /> {session.time}
                </div>
              </div>
              <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                <CheckCircle size={28} />
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-gray-400 bg-gray-100 rounded-3xl border-2 border-dashed">
            오늘은 예정된 수업이 없습니다.
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;