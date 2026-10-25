import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, ArrowRight, Eye, EyeOff, GraduationCap, Briefcase, AlertCircle, ArrowLeft } from 'lucide-react';
import { UserRole } from '../types';

export const LoginPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialRole = (searchParams.get('role')?.toUpperCase() === 'FACULTY' ? 'FACULTY' : 'STUDENT') as UserRole;
  
  const [activeTab, setActiveTab] = useState<UserRole>(initialRole);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const roleParam = searchParams.get('role')?.toUpperCase();
    if (roleParam === 'FACULTY' || roleParam === 'STUDENT') {
      setActiveTab(roleParam as UserRole);
    }
  }, [searchParams]);

  const handleTabChange = (role: UserRole) => {
    setActiveTab(role);
    setSearchParams({ role: role.toLowerCase() });
    setError(null);
    setIdentifier('');
    setPassword('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!identifier.trim()) {
      setError(activeTab === 'STUDENT' ? 'Please enter your Student Roll Number' : 'Please enter your Faculty Employee ID');
      return;
    }

    if (!password) {
      setError('Please enter your password');
      return;
    }

    setLoading(true);
    const result = await login(identifier.trim(), password, activeTab);
    setLoading(false);

    if (result.success) {
      if (activeTab === 'FACULTY') {
        navigate('/faculty/upload');
      } else {
        navigate('/chat');
      }
    } else {
      setError(result.error || 'Authentication failed. Please verify your credentials.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 sm:p-6 bg-gradient-to-b from-slate-50 via-slate-100 to-indigo-50/30 dark:from-navy-950 dark:via-navy-900 dark:to-navy-950">
      <div className="w-full max-w-md">
        
        {/* Back to Home Link */}
        <div className="mb-3">
          <Link 
            to="/" 
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Home
          </Link>
        </div>

        {/* Godavari Global University Brand Header with Logo */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-block group transition-transform hover:scale-105 duration-200">
            <div className="bg-white dark:bg-navy-900 rounded-2xl p-3 shadow-md border border-slate-200/80 dark:border-slate-800 inline-block">
              <img 
                src="/ggu-logo.png" 
                alt="Godavari Global University Logo" 
                className="h-14 sm:h-16 w-auto max-w-[240px] object-contain mx-auto"
              />
            </div>
          </Link>
          <div className="mt-3">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              AcademiQ Portal Login
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Godavari Global University • Verified Academic AI Assistant
            </p>
          </div>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-navy-900/95 backdrop-blur-md shadow-xl p-6 sm:p-8">
          
          {/* Role Segmented Tabs: Student vs Faculty */}
          <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-navy-950 rounded-xl mb-6 border border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => handleTabChange('STUDENT')}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'STUDENT'
                  ? 'bg-white dark:bg-academic-600 text-academic-700 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <GraduationCap className="h-4 w-4" />
              <span>Student Portal</span>
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('FACULTY')}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'FACULTY'
                  ? 'bg-white dark:bg-indigo-600 text-indigo-700 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Briefcase className="h-4 w-4" />
              <span>Faculty Portal</span>
            </button>
          </div>

          {/* Error Message Banner */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2 animate-fadeIn">
              <AlertCircle className="h-4 w-4 text-rose-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Authentication Error</p>
                <p>{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Student Roll No or Faculty Emp ID */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                {activeTab === 'STUDENT' ? 'Student Roll Number' : 'Faculty Employee ID (Emp ID)'}
              </label>
              <div className="relative">
                {activeTab === 'STUDENT' ? (
                  <GraduationCap className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                ) : (
                  <Briefcase className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                )}
                <input
                  type="text"
                  required
                  placeholder={activeTab === 'STUDENT' ? 'e.g. 22CSE045 or CS-2023-042' : 'e.g. FAC-108 or EMP-5021'}
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-academic-500 transition-colors"
                />
              </div>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                {activeTab === 'STUDENT' ? 'Enter your official university student roll number' : 'Enter your faculty/department employee identifier'}
              </p>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <span className="text-[11px] text-slate-400">
                  Min 6 characters
                </span>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter your account password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-academic-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-white text-sm font-semibold shadow-md transition-all ${
                activeTab === 'STUDENT'
                  ? 'bg-academic-600 hover:bg-academic-700'
                  : 'bg-indigo-600 hover:bg-indigo-700'
              } disabled:opacity-60 disabled:cursor-not-allowed`}
            >
              {loading ? (
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In to {activeTab === 'STUDENT' ? 'Student Portal' : 'Faculty Portal'}</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Registration Link */}
          <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-600 dark:text-slate-400">
            {activeTab === 'STUDENT' ? (
              <p>
                Don't have a student account?{' '}
                <Link
                  to="/register?role=student"
                  className="font-semibold text-academic-600 dark:text-academic-400 hover:underline"
                >
                  Register Student Account
                </Link>
              </p>
            ) : (
              <p>
                New faculty member?{' '}
                <Link
                  to="/register?role=faculty"
                  className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Register Faculty Emp ID
                </Link>
              </p>
            )}
          </div>

        </div>

        {/* Footer info */}
        <p className="text-center text-[11px] text-slate-400 dark:text-slate-500 mt-6">
          © Godavari Global University • AcademiQ AI RAG System
        </p>
      </div>
    </div>
  );
};
