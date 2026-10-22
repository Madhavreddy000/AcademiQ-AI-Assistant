import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  GraduationCap, 
  BookOpen, 
  Calendar, 
  Award, 
  FileText, 
  Sparkles, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  const enrolledSubjects = [
    { code: 'CS201', name: 'Data Structures & Algorithms', credits: 4, attendance: 88, status: 'Good' },
    { code: 'CS202', name: 'Operating Systems', credits: 4, attendance: 78, status: 'Satisfactory' },
    { code: 'CS301', name: 'Database Management Systems', credits: 4, attendance: 82, status: 'Good' },
    { code: 'CS302', name: 'Computer Networks', credits: 4, attendance: 72, status: 'Warning' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-academic-700 via-academic-600 to-indigo-700 p-6 sm:p-8 text-white shadow-lg mb-8">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-semibold mb-2">
              <GraduationCap className="h-3.5 w-3.5" />
              <span>{user?.departmentName || 'Computer Science & Engineering'} • Semester {user?.currentSemester || 4}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {user?.role === 'FACULTY' ? `Faculty Portal: ${user?.fullName}` : `Academic Dashboard: ${user?.fullName}`}
            </h1>
            <p className="text-xs sm:text-sm text-academic-100 mt-1 max-w-xl">
              {user?.role === 'FACULTY' ? (
                <>Faculty ID: <span className="font-mono font-bold">{user?.studentIdNumber || 'FAC-108'}</span> • Course Instructor & Material Publisher</>
              ) : (
                <>Student ID: <span className="font-mono font-bold">{user?.studentIdNumber || 'CS-2023-042'}</span> • Academic Year 2025–2026</>
              )}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {user?.role === 'FACULTY' && (
              <Link
                to="/faculty/upload"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur text-white font-semibold text-xs shadow-md transition-all active:scale-95"
              >
                <FileText className="h-4 w-4" />
                <span>Upload Materials</span>
              </Link>
            )}
            <Link
              to="/chat"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-academic-700 hover:bg-academic-50 font-semibold text-xs shadow-md transition-all hover:scale-105 active:scale-95"
            >
              <Sparkles className="h-4 w-4 text-academic-600" />
              <span>Ask Academic Assistant</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Grid: Attendance & Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold">Overall Attendance</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">80.0%</p>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 font-medium">
            Eligible for semester exams (≥ 75%)
          </p>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold">Cumulative CGPA</span>
            <Award className="h-4 w-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">8.64 / 10</p>
          <p className="text-[11px] text-slate-500 mt-1 font-medium">
            Grade Category: A (Very Good)
          </p>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold">Earned Credits</span>
            <BookOpen className="h-4 w-4 text-academic-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">68 / 160</p>
          <p className="text-[11px] text-slate-500 mt-1 font-medium">
            Degree completion on track (42%)
          </p>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold">Mid-Term Exams</span>
            <Calendar className="h-4 w-4 text-indigo-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">Nov 12</p>
          <p className="text-[11px] text-indigo-600 dark:text-indigo-400 mt-1 font-medium">
            27 days until commencement
          </p>
        </div>
      </div>

      {/* Enrolled Courses Table */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900 shadow-sm p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Registered Subjects (Semester 4)
            </h2>
            <p className="text-xs text-slate-500">
              Track attendance cut-offs and quick-query syllabus units
            </p>
          </div>
          <Link
            to="/resources?category=SYLLABUS"
            className="text-xs text-academic-600 dark:text-academic-400 font-semibold hover:underline flex items-center gap-1"
          >
            <span>View All Syllabi</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500">
                <th className="py-2.5 font-semibold">Course Code</th>
                <th className="py-2.5 font-semibold">Course Name</th>
                <th className="py-2.5 font-semibold">Credits</th>
                <th className="py-2.5 font-semibold">Attendance</th>
                <th className="py-2.5 font-semibold">Status</th>
                <th className="py-2.5 font-semibold text-right">RAG Assistance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {enrolledSubjects.map((sub) => (
                <tr key={sub.code} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-3 font-mono font-medium text-academic-600 dark:text-academic-400">
                    {sub.code}
                  </td>
                  <td className="py-3 font-medium text-slate-800 dark:text-slate-200">
                    {sub.name}
                  </td>
                  <td className="py-3 text-slate-500">{sub.credits} Credits</td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        {sub.attendance}%
                      </span>
                      <div className="w-16 h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            sub.attendance >= 75 ? 'bg-emerald-500' : 'bg-amber-500'
                          }`}
                          style={{ width: `${sub.attendance}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-3">
                    {sub.attendance >= 75 ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 border border-emerald-200 dark:border-emerald-800">
                        Eligible
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-600 border border-amber-200 dark:border-amber-800">
                        <AlertCircle className="h-2.5 w-2.5" />
                        Shortage Warning
                      </span>
                    )}
                  </td>
                  <td className="py-3 text-right">
                    <Link
                      to={`/chat`}
                      className="px-2.5 py-1 rounded-lg bg-academic-50 hover:bg-academic-100 dark:bg-academic-950/60 dark:hover:bg-academic-900 text-academic-700 dark:text-academic-300 font-medium text-[11px] transition-colors"
                    >
                      Summarize Syllabus &rarr;
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Official Handbook Quick Access */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900 flex items-start gap-3">
          <div className="h-10 w-10 rounded-xl bg-academic-100 dark:bg-academic-950 text-academic-600 flex items-center justify-center shrink-0">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-slate-900 dark:text-white">
              Academic Regulations & Exam Handbook
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              68-page verified regulatory guide covering grading, condonation, attendance, and hall ticket eligibility.
            </p>
            <div className="mt-3 flex items-center gap-3 text-xs">
              <Link to="/documents" className="font-semibold text-academic-600 dark:text-academic-400 hover:underline">
                Inspect Document Vectors &rarr;
              </Link>
            </div>
          </div>
        </div>

        <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900 flex items-start gap-3">
          <div className="h-10 w-10 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center shrink-0">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-slate-900 dark:text-white">
              B.Tech CS Curriculum Scheme 2025
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Complete unit-by-unit syllabus, textbook references, and course outcome mappings.
            </p>
            <div className="mt-3 flex items-center gap-3 text-xs">
              <Link to="/resources" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                View in Academic Library &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
