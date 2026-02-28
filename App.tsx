import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Layout
import Header from './components/layout/Header';
import BottomNav from './components/layout/BottomNav';

// Pages
import HomePage from './pages/HomePage';
import MembersPage from './pages/MembersPage';
import ReportsPage from './pages/ReportsPage';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';
import QRScanPage from './pages/QRScanPage';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
          <Routes>
            {/* 인증이 필요 없는 페이지 (QR 스캔) */}
            <Route path="/scan" element={<QRScanPage />} />
            <Route path="/login" element={<LoginPage />} />

            {/* 관리자 레이아웃이 적용된 페이지 */}
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <div className="flex flex-col min-h-screen">
                    <Header />
                    <main className="flex-1 overflow-y-auto">
                      <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/members" element={<MembersPage />} />
                        <Route path="/reports" element={<ReportsPage />} />
                        <Route path="/admin" element={<AdminPage />} />
                      </Routes>
                    </main>
                    <BottomNav />
                  </div>
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;