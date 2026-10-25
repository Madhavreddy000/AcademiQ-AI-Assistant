import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  User, 
  Lock, 
  GraduationCap, 
  Briefcase, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle2, 
  XCircle, 
  Eye, 
  EyeOff, 
  AlertCircle,
  Building2,
  Layers,
  Calendar
} from 'lucide-react';
import { UserRole, DEPARTMENTS, STREAMS, getYearFromSemester } from '../types';

export const RegisterPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialRole = (searchParams.get('role')?.toUpperCase() === 'FACULTY' ? 'FACULTY' : 'STUDENT') as UserRole;

  const [activeTab, setActiveTab] = useState<UserRole>(initialRole);

  // Common & Student Fields
  const [fullName, setFullName] = useState('');
  const [studentIdNumber, setStudentIdNumber] = useState(''); // Roll No or Emp ID
  const [stream, setStream] = useState('B.Tech');
  const [departmentCode, setDepartmentCode] = useState('CSE');
  const [academicYear, setAcademicYear] = useState<number>(1);
  const [semester, setSemester] = useState<number>(1);
  
  // Password validation & verification
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const roleParam = searchParams.get('role')?.toUpperCase();
    if (roleParam === 'FACULTY' || roleParam === 'STUDENT') {
      setActiveTab(roleParam as UserRole);
    }
  }, [searchParams]);

  // When academic year changes, set default semester for that year
  const handleYearChange = (year: number) => {
    setAcademicYear(year);
    // 1st year: 1 or 2, 2nd year: 3 or 4, etc.
    const defaultSem = (year - 1) * 2 + 1;
    setSemester(defaultSem);
  };

  const handleTabChange = (role: UserRole) => {
    setActiveTab(role);
    setSearchParams({ role: role.toLowerCase() });
    setError(null);
  };

  // Password Strength & Verification Checks
  const isLengthValid = password.length >= 6;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^a-zA-Z0-9]/.test(password);
  const passwordsMatch = password.length > 0 && confirmPassword.length > 0 && password === confirmPassword;
  const passwordsMismatch = confirmPassword.length > 0 && password !== confirmPassword;

  const getPasswordStrength = () => {
    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 8) score++;
    if (hasLetter && hasNumber) score++;
    if (hasSpecial) score++;
    return score;
  };

  const strengthScore = getPasswordStrength();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (activeTab === 'STUDENT') {
      if (!fullName.trim()) {
        setError('Please enter student full name');
        return;
      }
      if (!studentIdNumber.trim()) {
        setError('Please enter student roll number');
        return;
      }
    } else {
      if (!studentIdNumber.trim()) {
        setError('Please enter faculty employee ID');
        return;
      }
      if (!fullName.trim()) {
        setError('Please enter faculty full name');
        return;
      }
    }

    if (!isLengthValid) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify your password.');
      return;
    }

    setLoading(true);

    const deptIndex = DEPARTMENTS.findIndex((d) => d.code === departmentCode);
    const departmentId = deptIndex >= 0 ? deptIndex + 1 : 1;

    const result = await register({
      fullName: fullName.trim(),
      studentIdNumber: studentIdNumber.trim(),
      stream: activeTab === 'STUDENT' ? stream : undefined,
      departmentId: departmentId,
      departmentCode: departmentCode as any,
      currentSemester: activeTab === 'STUDENT' ? Number(semester) : undefined,
      academicYear: activeTab === 'STUDENT' ? Number(academicYear) : undefined,
      role: activeTab,
      password: password,
    });

    setLoading(false);

    if (result.success) {
      if (activeTab === 'FACULTY') {
        navigate('/faculty/upload');
      } else {
        navigate('/chat');
      }
    } else {
      setError(result.error || 'Registration failed. Please check inputs.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 sm:p-6 bg-gradient-to-b from-slate-50 via-slate-100 to-indigo-50/30 dark:from-navy-950 dark:via-navy-900 dark:to-navy-950 py-10">
      <div className="w-full max-w-xl">
        
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
              Create University Account
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Godavari Global University • Verified AcademiQ Registration
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
              <span>Student Registration</span>
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
              <span>Faculty Registration</span>
            </button>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2 animate-fadeIn">
              <AlertCircle className="h-4 w-4 text-rose-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Registration Issue</p>
                <p>{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Student Registration Form */}
            {activeTab === 'STUDENT' && (
              <>
                {/* 1. Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Student Full Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-academic-500"
                    />
                  </div>
                </div>

                {/* 2. Roll No & Stream Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Roll Number <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <GraduationCap className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. 22CSE045"
                        value={studentIdNumber}
                        onChange={(e) => setStudentIdNumber(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-academic-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Stream / Degree <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Layers className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <select
                        value={stream}
                        onChange={(e) => setStream(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-academic-500"
                      >
                        {STREAMS.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* 3. Department */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Department <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <select
                      value={departmentCode}
                      onChange={(e) => setDepartmentCode(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-academic-500"
                    >
                      {DEPARTMENTS.map((d) => (
                        <option key={d.code} value={d.code}>
                          {d.code} — {d.fullName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 4. Year and Semester Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Academic Year <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <select
                        value={academicYear}
                        onChange={(e) => handleYearChange(Number(e.target.value))}
                        className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-academic-500"
                      >
                        <option value={1}>1st Year</option>
                        <option value={2}>2nd Year</option>
                        <option value={3}>3rd Year</option>
                        <option value={4}>4th Year</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Semester <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={semester}
                      onChange={(e) => setSemester(Number(e.target.value))}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-academic-500"
                    >
                      {/* Filter semesters based on chosen academic year */}
                      {[ (academicYear - 1) * 2 + 1, (academicYear - 1) * 2 + 2 ].map((semNum) => (
                        <option key={semNum} value={semNum}>
                          Semester {semNum}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </>
            )}

            {/* Faculty Registration Form */}
            {activeTab === 'FACULTY' && (
              <>
                {/* 1. Employee ID */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Faculty Employee ID (Emp ID) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. EMP-5021 or FAC-108"
                      value={studentIdNumber}
                      onChange={(e) => setStudentIdNumber(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                {/* 2. Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Faculty Full Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Prof. David Chen / Dr. Ananya Rao"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                {/* 3. Department */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Academic Department <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <select
                      value={departmentCode}
                      onChange={(e) => setDepartmentCode(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {DEPARTMENTS.map((d) => (
                        <option key={d.code} value={d.code}>
                          {d.code} — {d.fullName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </>
            )}

            {/* Password Validation & Verification Section */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              
              {/* Create Password */}
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Create Password <span className="text-rose-500">*</span>
                  </label>
                  {password.length > 0 && (
                    <span className={`text-[10px] font-semibold ${
                      strengthScore <= 1 ? 'text-rose-500' : strengthScore === 2 ? 'text-amber-500' : 'text-emerald-500'
                    }`}>
                      {strengthScore <= 1 ? 'Weak' : strengthScore === 2 ? 'Fair' : 'Strong Password'}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter at least 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-10 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-academic-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                {/* Password strength progress bar */}
                {password.length > 0 && (
                  <div className="w-full h-1 bg-slate-100 dark:bg-navy-800 rounded-full mt-1.5 overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 ${
                        strengthScore <= 1 ? 'w-1/3 bg-rose-500' : strengthScore === 2 ? 'w-2/3 bg-amber-500' : 'w-full bg-emerald-500'
                      }`}
                    />
                  </div>
                )}
              </div>

              {/* Verify Password (Confirm Password) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Verify Password <span className="text-rose-500">*</span>
                  </label>
                  {confirmPassword.length > 0 && (
                    <span className="flex items-center gap-1 text-[11px]">
                      {passwordsMatch ? (
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-0.5">
                          <CheckCircle2 className="h-3 w-3" /> Passwords Match
                        </span>
                      ) : (
                        <span className="text-rose-500 font-semibold flex items-center gap-0.5">
                          <XCircle className="h-3 w-3" /> Passwords Don't Match
                        </span>
                      )}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    placeholder="Re-enter your password to verify"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full pl-9 pr-10 py-2 text-sm rounded-xl border bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 ${
                      passwordsMismatch 
                        ? 'border-rose-400 focus:ring-rose-400' 
                        : passwordsMatch 
                        ? 'border-emerald-400 focus:ring-emerald-400' 
                        : 'border-slate-200 dark:border-slate-800 focus:ring-academic-500'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || (confirmPassword.length > 0 && !passwordsMatch)}
              className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-white text-sm font-semibold shadow-md transition-all mt-4 ${
                activeTab === 'STUDENT'
                  ? 'bg-academic-600 hover:bg-academic-700'
                  : 'bg-indigo-600 hover:bg-indigo-700'
              } disabled:opacity-60 disabled:cursor-not-allowed`}
            >
              {loading ? (
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Complete {activeTab === 'STUDENT' ? 'Student' : 'Faculty'} Registration</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Link back to login */}
          <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-600 dark:text-slate-400">
            Already have an account?{' '}
            <Link
              to={`/login?role=${activeTab.toLowerCase()}`}
              className="font-semibold text-academic-600 dark:text-academic-400 hover:underline"
            >
              Sign In Here
            </Link>
          </div>

        </div>

        {/* Footer info */}
        <p className="text-center text-[11px] text-slate-400 dark:text-slate-500 mt-6">
          © Godavari Global University • AcademiQ Assistant Registration
        </p>
      </div>
    </div>
  );
};
