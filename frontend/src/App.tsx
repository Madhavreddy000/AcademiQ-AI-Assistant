import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Navbar } from './components/common/Navbar';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ChatPage } from './pages/ChatPage';
import { DashboardPage } from './pages/DashboardPage';
import { ResourcesPage } from './pages/ResourcesPage';
import { DocumentViewerPage } from './pages/DocumentViewerPage';
import { SavedAnswersPage } from './pages/SavedAnswersPage';
import { ProfilePage } from './pages/ProfilePage';
import { FacultyUploadPage } from './pages/FacultyUploadPage';
import { useAuth } from './context/AuthContext';

export const App: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();

  // Hide global navbar on clean auth pages
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans">
      {!isAuthPage && <Navbar />}

      <div className="flex-1">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/documents" element={<DocumentViewerPage />} />
          <Route path="/saved" element={<SavedAnswersPage />} />
          <Route path="/profile" element={<ProfilePage />} />

          {/* Faculty Upload Route */}
          <Route path="/faculty/upload" element={<FacultyUploadPage />} />
          <Route path="/upload" element={<FacultyUploadPage />} />

          {/* Admin routes redirect to faculty upload */}
          <Route path="/admin" element={<Navigate to="/faculty/upload" replace />} />
          <Route path="/admin/*" element={<Navigate to="/faculty/upload" replace />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
};
