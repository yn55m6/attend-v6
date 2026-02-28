import React, { useState } from 'react';
import { collection, writeBatch, doc, query, where, getDocs, serverTimestamp } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { SESSIONS } from '../../utils/constants';
import { useMembers } from '../../hooks/useMembers';
import { X, FileText, Loader2 } from 'lucide-react';

interface Props {
  onClose: () => void;
}

const BulkInsertModal: React.FC<Props> = ({ onClose }) => {
  const [text, setText] = useState('');
  const [selectedSession, setSelectedSession] = useState(SESSIONS[0].code);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { members } = useMembers();

  const handleBulkInsert = async () => {
    if (!text.trim()) return;
    setIsSubmitting(true);

    try {
      const lines = text.split('\n').filter(line => line.trim());
      const batch = writeBatch(db);
      const today = new Date().toISOString().split('T')[0];
      const session = SESSIONS.find(s => s.code === selectedSession)!;

      let successCount = 0;

      for (const line of lines) {
        const parts = line.trim().split(/\s+/);
        const name = parts[0];
        const phone = parts[1] || '';

        // 1. 회원 찾기 또는 생성 예약
        let member = members.find(m => m.name === name);
        let memberId = member?.id;

        if (!member) {
          const newMemberRef = doc(collection(db, 'members'));
          batch.set(newMemberRef, {
            name,
            phone,
            createdAt: new Date().toISOString()
          });
          memberId = newMemberRef.id;
        }

        // 2. 중복 출석 확인 (Batch 내에서는 조회가 안되므로 사전 필터링은 생략하거나 별도 로직 필요)
        // 여기서는 단순화를 위해 로그 생성만 Batch에 추가
        const logRef = doc(collection(db, 'logs'));
        batch.set(logRef, {
          memberId,
          memberName: name,
          date: today,
          sessionCode: session.code,
          sessionName: session.name,
          day: session.day,
          time: session.time,
          timestamp: serverTimestamp()
        });
        successCount++;
      }

      await batch.commit();
      alert(`${successCount}명의 출석 처리가 완료되었습니다.`);
      onClose();
    } catch (err) {
      console.error(err);
      alert('일괄 처리 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <FileText className="text-green-600" /> 일괄 출석 입력
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full"><X /></button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">대상 수업 선택</label>
            <select 
              className="w-full p-3 border-2 rounded-xl outline-none focus:border-green-500"
              value={selectedSession}
              onChange={e => setSelectedSession(e.target.value)}
            >
              {SESSIONS.map(s => <option key={s.code} value={s.code}>{s.name} ({s.day})</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">명단 입력 (이름 전화번호뒷자리)</label>
            <textarea
              className="w-full h-48 p-4 border-2 rounded-xl outline-none focus:border-green-500 font-mono"
              placeholder="김철수 1234&#10;이영희&#10;박민수 5678"
              value={text}
              onChange={e => setText(e.target.value)}
            />
          </div>

          <button
            onClick={handleBulkInsert}
            disabled={isSubmitting}
            className="w-full bg-green-600 text-white py-4 rounded-xl text-xl font-bold flex items-center justify-center gap-2 disabled:bg-gray-400"
          >
            {isSubmitting ? <Loader2 className="animate-spin" /> : '일괄 등록 실행'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkInsertModal;