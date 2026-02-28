import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LayoutWrapper from './components/layout/LayoutWrapper';

// 임시 페이지 컴포넌트
const Home = () => <div className="text-center py-10 text-gray-500">출석 체크 페이지 (준비 중)</div>;
const Members = () => <div className="text-center py-10 text-gray-500">회원 관리 페이지 (준비 중)</div>;
const Reports = () => <div className="text-center py-10 text-gray-500">리포트 페이지 (준비 중)</div>;

function App() {
  return (
    <Router>
      <LayoutWrapper>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/members" element={<Members />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </LayoutWrapper>
    </Router>
  );
}

export default App;