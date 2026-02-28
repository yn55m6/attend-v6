import React, { useState, useEffect } from 'react';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { Log } from '../../types';
import { X, Calendar } from 'lucide-react';

interface Props {
  memberId: string;
  onClose: () => void;
}

const MemberDetailModal: React.FC<Props> = ({ memberId, onClose }) => {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      const q = query(
        collection(db, 'logs'),
        where('memberId', '==', memberId),
        orderBy('date', 'desc')
      );
      const snapshot = await getDocs(q);
      setLogs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Log[]);
      setLoading(false);
    };
    fetchLogs();
  }, [memberId]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden flex flex-col max-h-[80vh]">
        <div className="p-6 border-b flex justify-between items-center bg-gray-50">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Calendar className="text-blue-600" /> 출석 이력
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full">
            <X size={28} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <p className="text-center text-gray-500">불러오는 중...</p>
          ) : logs.length === 0 ? (
            <p className="text-center text-gray-500 py-10">출석 기록이 없습니다.</p>
          ) : (
            <div className="space-y-4">
              {logs.map(log => (
                <div key={log.id} className="border-l-4 border-blue-500 pl-4 py-2">
                  <div className="text-xl font-bold text-gray-800">{log.date}</div>
                  <div className="text-gray-600">
                    {log.sessionName} ({log.day} {log.time})
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MemberDetailModal;