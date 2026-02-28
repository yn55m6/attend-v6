import React, { useState } from 'react';
import { useMembers } from '../hooks/useMembers';
import { Search, UserPlus, Trash2, ChevronRight } from 'lucide-react';
import MemberDetailModal from '../components/members/MemberDetailModal';

const MembersPage: React.FC = () => {
  const { members, loading, addMember, deleteMember } = useMembers();
  const [searchTerm, setSearch] = useState('');
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);

  const filteredMembers = members.filter(m => 
    m.name.includes(searchTerm) || m.phone.includes(searchTerm)
  );

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    try {
      await addMember(newName, newPhone);
      setNewName('');
      setNewPhone('');
      alert('회원이 등록되었습니다.');
    } catch (err) {
      alert('등록 중 오류가 발생했습니다.');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`${name} 회원을 삭제하시겠습니까?`)) return;
    try {
      await deleteMember(id);
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="pb-24 p-4 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">회원 관리</h1>

      {/* 회원 등록 폼 */}
      <form onSubmit={handleAddMember} className="bg-white p-6 rounded-2xl shadow-md mb-8 border-2 border-blue-100">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <input
            className="text-xl p-4 border-2 rounded-xl focus:border-blue-500 outline-none"
            placeholder="이름 (필수)"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            required
          />
          <input
            className="text-xl p-4 border-2 rounded-xl focus:border-blue-500 outline-none"
            placeholder="전화번호 뒷자리"
            value={newPhone}
            onChange={e => setNewPhone(e.target.value)}
          />
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-xl text-xl font-bold flex items-center justify-center gap-2">
          <UserPlus /> 회원 추가하기
        </button>
      </form>

      {/* 검색창 */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          className="w-full pl-12 pr-4 py-4 text-xl border-2 rounded-2xl outline-none focus:border-blue-500"
          placeholder="이름 또는 전화번호 검색"
          value={searchTerm}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* 회원 목록 */}
      <div className="space-y-3">
        {loading ? (
          <p className="text-center py-10 text-gray-500">로딩 중...</p>
        ) : (
          filteredMembers.map(member => (
            <div key={member.id} className="bg-white p-4 rounded-2xl shadow-sm flex items-center justify-between border border-gray-100">
              <div 
                className="flex-1 cursor-pointer"
                onClick={() => setSelectedMemberId(member.id)}
              >
                <div className="text-2xl font-bold text-gray-800">{member.name}</div>
                <div className="text-gray-500">{member.phone || '번호 없음'}</div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handleDelete(member.id, member.name)}
                  className="p-3 text-red-400 hover:bg-red-50 rounded-full transition-colors"
                >
                  <Trash2 size={24} />
                </button>
                <ChevronRight className="text-gray-300" />
              </div>
            </div>
          ))
        )}
      </div>

      {selectedMemberId && (
        <MemberDetailModal 
          memberId={selectedMemberId} 
          onClose={() => setSelectedMemberId(null)} 
        />
      )}
    </div>
  );
};

export default MembersPage;