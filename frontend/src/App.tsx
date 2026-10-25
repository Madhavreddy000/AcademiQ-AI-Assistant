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

// Protected Route Guard: requires authenticated session
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

// Faculty Route Guard: requires FACULTY or ADMIN role
const FacultyRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login?role=faculty" replace />;
  }
  if (user.role !== 'FACULTY' && user.role !== 'ADMIN') {
    return <Navigate to="/chat" replace />;
  }
  return <>{children}</>;
};

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
          <Route 
            path="/login" 
            element={user ? <Navigate to={user.role === 'FACULTY' ? '/faculty/upload' : '/chat'} replace /> : <LoginPage />} 
          />
          <Route 
            path="/register" 
            element={user ? <Navigate to={user.role === 'FACULTY' ? '/faculty/upload' : '/chat'} replace /> : <RegisterPage />} 
          />

          {/* Protected Student / General Routes */}
          <Route 
            path="/chat" 
            element={
              <ProtectedRoute>
                <ChatPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/resources" 
            element={
              <ProtectedRoute>
                <ResourcesPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/documents" 
            element={
              <ProtectedRoute>
                <DocumentViewerPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/saved" 
            element={
              <ProtectedRoute>
                <SavedAnswersPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } 
          />

          {/* Protected Faculty Only Routes */}
          <Route 
            path="/faculty/upload" 
            element={
              <FacultyRoute>
                <FacultyUploadPage />
              </FacultyRoute>
            } 
          />
          <Route 
            path="/upload" 
            element={
              <FacultyRoute>
                <FacultyUploadPage />
              </FacultyRoute>
            } 
          />

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
