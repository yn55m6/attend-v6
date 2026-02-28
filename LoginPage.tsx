import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Lock } from 'lucide-react';

const LoginPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const success = await login(password);
    if (success) {
      navigate(from, { replace: true });
    } else {
      setError('비밀번호가 일치하지 않습니다.');
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-blue-100 p-4 rounded-full mb-4">
            <Lock className="w-12 h-12 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">관리자 로그인</h1>
          <p className="text-gray-500 mt-2 text-center">서비스 이용을 위해 비밀번호를 입력해주세요.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호 입력"
              className="w-full px-6 py-4 text-2xl border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors text-center"
              autoFocus
            />
            {error && <p className="text-red-500 text-center mt-2 font-medium">{error}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl text-xl shadow-lg active:transform active:scale-95 transition-all"
          >
            로그인
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;