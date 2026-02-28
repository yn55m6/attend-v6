import React, { useState, useMemo } from 'react';
import { useLogs } from '../hooks/useLogs';
import { getWeekOfMonth, getLastSixMonths, getMonthYear } from '../utils/dateUtils';
import TrendChart from '../components/reports/TrendChart';
import { BarChart3, Trophy, CalendarDays, Users } from 'lucide-react';

const ReportsPage: React.FC = () => {
  const { logs, loading } = useLogs();
  const [selectedMonth, setSelectedMonth] = useState(getMonthYear(new Date()));

  // 1. 그래프 데이터 계산 (최근 6개월)
  const trendData = useMemo(() => {
    const months = getLastSixMonths();
    const counts = months.map(m => {
      const monthlyLogs = logs.filter(log => log.date.startsWith(m));
      return new Set(monthlyLogs.map(l => l.memberId)).size;
    });
    return { labels: months.map(m => m.split('-')[1] + '월'), data: counts };
  }, [logs]);

  // 2. 현재 선택된 월의 통계
  const monthlyStats = useMemo(() => {
    const filteredLogs = logs.filter(log => log.date.startsWith(selectedMonth));
    
    // 랭킹 계산
    const rankMap: Record<string, number> = {};
    filteredLogs.forEach(log => {
      rankMap[log.memberName] = (rankMap[log.memberName] || 0) + 1;
    });
    const ranking = Object.entries(rankMap)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10);

    // 주차별 매트릭스 데이터
    const memberWeekly: Record<string, Set<number>> = {};
    filteredLogs.forEach(log => {
      if (!memberWeekly[log.memberName]) memberWeekly[log.memberName] = new Set();
      memberWeekly[log.memberName].add(getWeekOfMonth(log.date));
    });

    return {
      totalUnique: new Set(filteredLogs.map(l => l.memberId)).size,
      ranking,
      memberWeekly: Object.entries(memberWeekly).sort(([a], [b]) => a.localeCompare(b))
    };
  }, [logs, selectedMonth]);

  if (loading) return <div className="p-10 text-center text-gray-500">데이터 분석 중...</div>;

  return (
    <div className="pb-24 p-4 max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold">출석 리포트</h1>

      {/* 추이 그래프 섹션 */}
      <section className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <BarChart3 className="text-blue-500" /> 최근 6개월 출석 추이
        </h2>
        <TrendChart labels={trendData.labels} data={trendData.data} />
      </section>

      {/* 월별 상세 통계 */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <CalendarDays className="text-green-600" /> 월간 상세 현황
        </h2>
        <input 
          type="month" 
          value={selectedMonth}
          onChange={e => setSelectedMonth(e.target.value)}
          className="p-2 border-2 rounded-xl outline-none focus:border-blue-500 font-bold"
        />
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* 요약 카드 */}
        <div className="bg-blue-600 text-white p-6 rounded-3xl shadow-lg flex flex-col items-center justify-center">
          <Users size={40} className="mb-2 opacity-80" />
          <div className="text-lg font-medium">총 출석 인원</div>
          <div className="text-4xl font-black">{monthlyStats.totalUnique}명</div>
        </div>

        {/* 랭킹 섹션 */}
        <div className="md:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Trophy className="text-yellow-500" size={20} /> 출석 왕 (TOP 10)
          </h3>
          <div className="flex flex-wrap gap-2">
            {monthlyStats.ranking.map(([name, count], i) => (
              <div key={name} className="bg-gray-50 px-4 py-2 rounded-2xl border border-gray-100 flex items-center gap-2">
                <span className="font-bold text-blue-600">{i + 1}</span>
                <span className="font-bold">{name}</span>
                <span className="text-gray-400 text-sm">{count}회</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 주차별 상세 테이블 */}
      <section className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b bg-gray-50">
          <h3 className="font-bold text-lg">개인별 주차 출석 현황</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 uppercase text-sm">
                <th className="p-4 font-bold">이름</th>
                {[1, 2, 3, 4, 5].map(w => (
                  <th key={w} className="p-4 text-center">{w}주차</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {monthlyStats.memberWeekly.map(([name, weeks]) => (
                <tr key={name} className="hover:bg-blue-50/30 transition-colors">
                  <td className="p-4 font-bold text-gray-800">{name}</td>
                  {[1, 2, 3, 4, 5].map(w => (
                    <td key={w} className="p-4 text-center">
                      {weeks.has(w) ? (
                        <div className="inline-flex items-center justify-center w-8 h-8 bg-green-100 text-green-600 rounded-full font-bold">
                          V
                        </div>
                      ) : (
                        <span className="text-gray-200">-</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {monthlyStats.memberWeekly.length === 0 && (
          <div className="p-10 text-center text-gray-400">해당 월의 출석 기록이 없습니다.</div>
        )}
      </section>
    </div>
  );
};

export default ReportsPage;