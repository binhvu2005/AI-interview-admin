import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage.tsx';
import QuestionsPage from './pages/QuestionsPage.tsx';
import UsersPage from './pages/UsersPage.tsx';
import TalentPoolPage from './pages/TalentPoolPage.tsx';
import SystemDataPage from './pages/SystemDataPage.tsx';
import LoginPage from './pages/LoginPage.tsx';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/questions" element={<QuestionsPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/talent-pool" element={<TalentPoolPage />} />
        <Route path="/system-data" element={<SystemDataPage />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
