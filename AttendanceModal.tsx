import React, { useState } from 'react';
import { useMembers } from '../../hooks/useMembers';
import { useAttendance } from '../../hooks/useAttendance';
import { useSound } from '../../hooks/useSound';
import { X, CheckCircle2, Search } from 'lucide-react';

interface Props {
  session: any;
  onClose: () => void;
}

const AttendanceModal: React.FC<Props> = ({ session, onClose }) => {
  const [name, setName] = useState('');
  const { members } = useMembers();
  const { checkAndSubmitAttendance } = useAttendance();
  const { playSuccess, playError } = useSound();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredMembers = name.trim() 
    ? members.filter(m => m.name.includes(name)).slice(0, 5)
    : [];

  const handleSubmit = async (targetName: string) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    try {
      const { isNewMember } = await checkAndSubmitAttendance(targetName, session);
      playSuccess();
      alert(`${targetName}님, 출석이 완료되었습니다!${isNewMember ? '\n(신규 회원으로 등록되었습니다.)' : ''}`);
      onClose();
    } catch (err: any) {
      playError();
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden">
        <div className="p-8 bg-blue-600 text-white text-center relative">
          <button onClick={onClose} className="absolute right-6 top-6 text-white/80 hover:text-white">
            <X size={32} />
          </button>
          <h2 className="text-3xl font-bold mb-2">{session.name}</h2>
          <p className="text-blue-100 text-xl">{session.day} {session.time}</p>
        </div>

        <div className="p-8">
          <div className="relative mb-6">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={28} />
            <input
              className="w-full pl-14 pr-6 py-5 text-2xl border-4 border-gray-100 rounded-2xl focus:border-blue-500 outline-none transition-all"
              placeholder="이름을 입력하세요"
              value={name}
              onChange={e => setName(e.target.value)}
              autoFocus
            />
          </div>

          <div className="space-y-3 max-h-64 overflow-y-auto mb-6">
            {filteredMembers.map(m => (
              <button
                key={m.id}
                onClick={() => handleSubmit(m.name)}
                className="w-full flex items-center justify-between p-5 bg-gray-50 hover:bg-blue-50 rounded-2xl border-2 border-transparent hover:border-blue-200 transition-all"
              >
                <span className="text-2xl font-bold text-gray-800">{m.name}</span>
                <CheckCircle2 className="text-blue-500" size={28} />
              </button>
            ))}
          </div>

          {name.trim() && !members.some(m => m.name === name) && (
            <div className="bg-orange-50 p-6 rounded-2xl border-2 border-orange-100 mb-6">
              <p className="text-orange-800 text-lg font-medium mb-3 text-center">
                명단에 없는 이름입니다. <br/>이 이름으로 새로 등록하고 출석할까요?
              </p>
              <button
                onClick={() => handleSubmit(name)}
                className="w-full bg-orange-500 text-white py-4 rounded-xl text-xl font-bold shadow-lg"
              >
                "{name}" 신규 등록 및 출석
              </button>
            </div>
          )}
          
          <p className="text-center text-gray-400 text-lg">
            본인의 이름을 검색하여 선택해 주세요.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AttendanceModal;