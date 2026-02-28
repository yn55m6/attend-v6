import React from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { SESSIONS } from '../../utils/constants';
import { X, Printer } from 'lucide-react';

interface Props {
  onClose: () => void;
}

const QRCodeGeneratorModal: React.FC<Props> = ({ onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  const baseUrl = window.location.origin;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 no-print">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b flex justify-between items-center bg-gray-50">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Printer className="text-blue-600" /> QR 코드 인쇄하기
          </h2>
          <div className="flex gap-2">
            <button 
              onClick={handlePrint}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors"
            >
              인쇄 실행
            </button>
            <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full">
              <X size={28} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 bg-gray-100">
          <div className="grid grid-cols-2 gap-6 print:block">
            {SESSIONS.map((session) => (
              <div 
                key={session.code} 
                className="bg-white p-6 rounded-2xl shadow-sm flex flex-col items-center text-center border border-gray-200 print:shadow-none print:border-none print:mb-20"
              >
                <h3 className="text-xl font-bold mb-1">{session.name}</h3>
                <p className="text-gray-500 mb-4">{session.day} {session.time}</p>
                <div className="p-4 border-4 border-blue-50 rounded-2xl">
                  <QRCodeCanvas 
                    value={`${baseUrl}/scan?session=${session.code}`}
                    size={180}
                    level="H"
                    includeMargin={true}
                  />
                </div>
                <p className="mt-4 text-sm text-gray-400">스마트폰으로 스캔하여 출석체크 하세요</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRCodeGeneratorModal;