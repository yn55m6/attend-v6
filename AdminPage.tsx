import React, { useState } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../services/firebase';
import QRCodeGeneratorModal from '../components/admin/QRCodeGeneratorModal';
import BulkInsertModal from '../components/admin/BulkInsertModal';
import { QrCode, FileSpreadsheet, Trash2, ShieldAlert } from 'lucide-react';

const AdminPage: React.FC = () => {
  const [showQRModal, setShowQRModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);

  const handleResetData = async () => {
    const confirmText = prompt('모든 회원 및 출석 데이터를 삭제하시겠습니까?\n삭제를 원하시면 "초기화"라고 입력해주세요.');
    if (confirmText !== '초기화') {
      alert('입력 문구가 일치하지 않아 취소되었습니다.');
      return;
    }

    try {
      // Firestore는 컬렉션 전체 삭제 API를 제공하지 않으므로 문서를 하나씩 삭제해야 함
      const collections = ['members', 'logs'];
      for (const colName of collections) {
        const snapshot = await getDocs(collection(db, colName));
        const deletePromises = snapshot.docs.map(d => deleteDoc(doc(db, colName, d.id)));
        await Promise.all(deletePromises);
      }
      alert('모든 데이터가 초기화되었습니다.');
      window.location.reload();
    } catch (err) {
      alert('초기화 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="pb-24 p-4 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">관리자 도구</h1>

      <div className="grid gap-4">
        <button 
          onClick={() => setShowQRModal(true)}
          className="bg-white p-6 rounded-2xl shadow-md border-2 border-blue-50 flex items-center gap-4 hover:bg-blue-50 transition-colors text-left"
        >
          <div className="bg-blue-100 p-4 rounded-full text-blue-600">
            <QrCode size={32} />
          </div>
          <div>
            <div className="text-xl font-bold">QR 코드 생성 및 인쇄</div>
            <div className="text-gray-500">수업별 출석용 QR 코드를 확인하고 인쇄합니다.</div>
          </div>
        </button>

        <button 
          onClick={() => setShowBulkModal(true)}
          className="bg-white p-6 rounded-2xl shadow-md border-2 border-green-50 flex items-center gap-4 hover:bg-green-50 transition-colors text-left"
        >
          <div className="bg-green-100 p-4 rounded-full text-green-600">
            <FileSpreadsheet size={32} />
          </div>
          <div>
            <div className="text-xl font-bold">종이 명부 일괄 입력</div>
            <div className="text-gray-500">수기 명단 텍스트를 복사하여 일괄 등록합니다.</div>
          </div>
        </button>

        <div className="mt-12 p-6 bg-red-50 rounded-3xl border-2 border-red-100">
          <div className="flex items-center gap-2 text-red-600 mb-4">
            <ShieldAlert />
            <span className="font-bold text-lg">위험 구역</span>
          </div>
          <button 
            onClick={handleResetData}
            className="w-full bg-white text-red-600 border-2 border-red-200 py-4 rounded-xl text-xl font-bold flex items-center justify-center gap-2 hover:bg-red-600 hover:text-white transition-all"
          >
            <Trash2 /> 전체 데이터 초기화
          </button>
          <p className="text-red-400 text-sm mt-3 text-center">이 작업은 되돌릴 수 없습니다. 신중하게 결정해 주세요.</p>
        </div>
      </div>

      {showQRModal && <QRCodeGeneratorModal onClose={() => setShowQRModal(false)} />}
      {showBulkModal && <BulkInsertModal onClose={() => setShowBulkModal(false)} />}
    </div>
  );
};

export default AdminPage;