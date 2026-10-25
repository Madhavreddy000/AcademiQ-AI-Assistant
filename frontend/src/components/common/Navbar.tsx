import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { 
  Sun, 
  Moon, 
  UserCircle, 
  LogOut, 
  Sparkles, 
  BookOpen, 
  LayoutDashboard,
  Upload,
  Cpu,
  ChevronDown,
  GraduationCap,
  Briefcase
} from 'lucide-react';
import { AIModelModal } from './AIModelModal';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-navy-950/90 backdrop-blur-md">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6">
          
          {/* Brand with GGU Logo */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="bg-white dark:bg-navy-900 rounded-xl p-1.5 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-center group-hover:scale-105 transition-transform">
                <img 
                  src="/ggu-logo.png" 
                  alt="Godavari Global University Logo" 
                  className="h-8 sm:h-9 w-auto max-w-[130px] object-contain"
                />
              </div>
              <div className="hidden sm:block">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-base tracking-tight text-slate-900 dark:text-white">
                    AcademiQ
                  </span>
                  <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded-full bg-academic-100 text-academic-700 dark:bg-academic-950 dark:text-academic-300 border border-academic-200 dark:border-academic-800">
                    GGU AI
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 -mt-0.5 font-medium">
                  Godavari Global University
                </p>
              </div>
            </Link>
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            <Link
              to="/chat"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-academic-600 dark:hover:text-academic-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
            >
              <Sparkles className="h-4 w-4 text-academic-500" />
              AI Chat
            </Link>

            <Link
              to="/resources"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-academic-600 dark:hover:text-academic-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
            >
              <BookOpen className="h-4 w-4 text-emerald-500" />
              Course Materials
            </Link>

            <Link
              to="/dashboard"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-academic-600 dark:hover:text-academic-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
            >
              <LayoutDashboard className="h-4 w-4 text-indigo-500" />
              Dashboard
            </Link>

            {/* Faculty Upload Button */}
            {user?.role === 'FACULTY' && (
              <Link
                to="/faculty/upload"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 font-semibold hover:bg-indigo-100 transition-colors"
              >
                <Upload className="h-4 w-4" />
                Upload Course Data
              </Link>
            )}
          </nav>

          {/* Right Action Tools */}
          <div className="flex items-center gap-2.5">
            
            {/* Authenticated Role Status Badge (Read-only, no direct switch) */}
            {user && (
              <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-navy-900 border border-slate-200 dark:border-slate-800">
                {user.role === 'FACULTY' ? (
                  <span className="text-indigo-700 dark:text-indigo-300 flex items-center gap-1">
                    <Briefcase className="h-3.5 w-3.5" />
                    Faculty • {user.studentIdNumber || 'Verified'}
                  </span>
                ) : (
                  <span className="text-academic-700 dark:text-academic-300 flex items-center gap-1">
                    <GraduationCap className="h-3.5 w-3.5" />
                    Student • {user.studentIdNumber || 'Verified'}
                  </span>
                )}
              </div>
            )}

            {/* AI Model Configuration Button */}
            <button
              onClick={() => setAiModalOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-navy-900 hover:border-academic-400 text-xs text-slate-700 dark:text-slate-300 transition-colors"
              title="Configure AI Model Settings"
            >
              <Cpu className="h-3.5 w-3.5 text-academic-500" />
              <span className="hidden sm:inline">AI Settings</span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5 text-slate-700" />}
            </button>

            {/* Authenticated Profile or Login Buttons */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
                >
                  <div className={`h-8 w-8 rounded-full text-white flex items-center justify-center font-semibold text-xs border-2 ${
                    user.role === 'FACULTY' ? 'bg-indigo-600 border-indigo-400' : 'bg-academic-600 border-academic-400'
                  }`}>
                    {user.fullName ? user.fullName.charAt(0) : 'U'}
                  </div>
                  <div className="hidden lg:block text-left">
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight">
                      {user.fullName}
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">
                      {user.role} {user.studentIdNumber ? `• ${user.studentIdNumber}` : ''}
                    </p>
                  </div>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900 shadow-glass-dark p-2 text-sm z-50">
                    <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 mb-1">
                      <p className="font-semibold text-slate-900 dark:text-white">{user.fullName}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
                      <span className={`inline-block mt-1 text-[10px] font-medium px-2 py-0.5 rounded-full ${
                        user.role === 'FACULTY' 
                          ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
                          : 'bg-academic-100 dark:bg-academic-950 text-academic-700 dark:text-academic-300'
                      }`}>
                        {user.role} • {user.studentIdNumber || 'Verified'}
                      </span>
                    </div>

                    {user.role === 'FACULTY' && (
                      <Link
                        to="/faculty/upload"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 font-medium"
                      >
                        <Upload className="h-4 w-4" />
                        Faculty Upload Portal
                      </Link>
                    )}

                    <Link
                      to="/profile"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <UserCircle className="h-4 w-4" />
                      Academic Profile
                    </Link>

                    <button
                      onClick={() => {
                        setProfileOpen(false);
                        setAiModalOpen(true);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-left"
                    >
                      <Cpu className="h-4 w-4 text-academic-500" />
                      AI Model Settings
                    </button>

                    <div className="border-t border-slate-100 dark:border-slate-800 my-1"></div>

                    <button
                      onClick={() => {
                        setProfileOpen(false);
                        logout();
                        navigate('/login');
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login?role=student"
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900 hover:bg-slate-50 transition-colors shadow-sm"
                >
                  Student Login
                </Link>
                <Link
                  to="/login?role=faculty"
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-sm"
                >
                  Faculty Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* AI Model Settings Modal */}
      <AIModelModal isOpen={aiModalOpen} onClose={() => setAiModalOpen(false)} />
    </>
  );
};
