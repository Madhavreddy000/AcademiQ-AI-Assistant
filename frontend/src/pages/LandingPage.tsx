import React from 'react';
import { Link } from 'react-router-dom';
import { 
  GraduationCap, 
  Sparkles, 
  ShieldCheck, 
  FileText, 
  BookOpen, 
  ArrowRight, 
  Database, 
  Lock, 
  Cpu, 
  Briefcase,
  UserPlus,
  LogIn
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LandingPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-slate-100 selection:bg-academic-500 selection:text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 px-4 sm:px-6 lg:px-8">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-academic-500/15 dark:bg-academic-500/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[300px] bg-indigo-500/15 dark:bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center">
          
          {/* GGU Logo Badge */}
          <div className="mb-5 flex justify-center">
            <div className="p-3 bg-white dark:bg-navy-900 rounded-2xl shadow-md border border-slate-200/80 dark:border-slate-800">
              <img 
                src="/ggu-logo.png" 
                alt="Godavari Global University Logo" 
                className="h-16 sm:h-20 w-auto max-w-[280px] object-contain mx-auto" 
              />
            </div>
          </div>

          {/* Top pill badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-academic-200 dark:border-academic-800 bg-white/80 dark:bg-navy-900/80 shadow-sm mb-4 text-xs font-semibold text-academic-700 dark:text-academic-300 backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5 text-academic-500" />
            <span>Godavari Global University • AcademiQ AI RAG Platform</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            Grounded Academic AI for{' '}
            <span className="bg-gradient-to-r from-academic-600 via-indigo-600 to-academic-400 bg-clip-text text-transparent dark:from-academic-400 dark:to-indigo-300">
              Students & Faculty
            </span>
          </h1>

          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Welcome to the official university portal. Access verified exam policies, B.Tech & M.Tech syllabus modules, attendance condonation criteria, and faculty course management.
          </p>

          {/* Direct Portal Entry Cards: Student and Faculty Login/Register */}
          {user ? (
            <div className="mt-8 flex justify-center">
              <Link
                to="/chat"
                className="flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-academic-600 to-indigo-600 hover:from-academic-700 hover:to-indigo-700 text-white font-semibold text-sm shadow-glow transition-all hover:scale-105"
              >
                <Sparkles className="h-4 w-4" />
                <span>Continue as {user.fullName} ({user.role})</span>
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
          ) : (
            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl mx-auto text-left">
              
              {/* Student Portal Card */}
              <div className="p-6 rounded-2xl bg-white/95 dark:bg-navy-900/95 border border-slate-200/90 dark:border-slate-800 shadow-md backdrop-blur-md hover:border-academic-400 transition-all">
                <div className="flex items-center gap-3.5 mb-3">
                  <div className="h-11 w-11 rounded-xl bg-academic-100 dark:bg-academic-950 text-academic-600 dark:text-academic-400 flex items-center justify-center shrink-0">
                    <GraduationCap className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white">
                      Student Portal
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Login with Roll Number & Password
                    </p>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-5">
                  Ask questions about course syllabi, attendance requirements, grading scales, and official academic policies.
                </p>

                <div className="grid grid-cols-2 gap-2.5">
                  <Link
                    to="/login?role=student"
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-academic-600 hover:bg-academic-700 text-white font-semibold text-xs shadow-sm transition-colors"
                  >
                    <LogIn className="h-3.5 w-3.5" />
                    <span>Student Login</span>
                  </Link>

                  <Link
                    to="/register?role=student"
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-academic-300 dark:border-academic-800 text-academic-700 dark:text-academic-300 hover:bg-academic-50 dark:hover:bg-academic-950/40 font-semibold text-xs transition-colors"
                  >
                    <UserPlus className="h-3.5 w-3.5" />
                    <span>New Student</span>
                  </Link>
                </div>
              </div>

              {/* Faculty Portal Card */}
              <div className="p-6 rounded-2xl bg-white/95 dark:bg-navy-900/95 border border-slate-200/90 dark:border-slate-800 shadow-md backdrop-blur-md hover:border-indigo-400 transition-all">
                <div className="flex items-center gap-3.5 mb-3">
                  <div className="h-11 w-11 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                    <Briefcase className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white">
                      Faculty Portal
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Login with Faculty Employee ID (Emp ID)
                    </p>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-5">
                  Upload syllabus documents, lecture notes, and department handbooks to the verified AI knowledge base.
                </p>

                <div className="grid grid-cols-2 gap-2.5">
                  <Link
                    to="/login?role=faculty"
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-sm transition-colors"
                  >
                    <LogIn className="h-3.5 w-3.5" />
                    <span>Faculty Login</span>
                  </Link>

                  <Link
                    to="/register?role=faculty"
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-indigo-300 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 font-semibold text-xs transition-colors"
                  >
                    <UserPlus className="h-3.5 w-3.5" />
                    <span>New Faculty</span>
                  </Link>
                </div>
              </div>

            </div>
          )}

          {/* Additional Link: Browse Syllabus & Handbooks */}
          <div className="mt-8">
            <Link
              to="/resources"
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-academic-600 dark:hover:text-academic-400 underline decoration-slate-300 hover:decoration-academic-500 transition-colors"
            >
              <BookOpen className="h-4 w-4 text-emerald-500" />
              <span>Browse Public University Handbooks & Syllabus Modules</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Trust badges */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-500" /> Grounded in Official GGU Handbooks
            </span>
            <span className="flex items-center gap-1.5">
              <FileText className="h-4 w-4 text-academic-500" /> Exact Page & Policy Citations
            </span>
            <span className="flex items-center gap-1.5">
              <Lock className="h-4 w-4 text-indigo-500" /> Role-Based Access Isolation
            </span>
          </div>
        </div>

        {/* Live Interactive Preview Mockup */}
        <div className="relative max-w-4xl mx-auto mt-14 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-navy-900/90 shadow-glass-dark p-4 sm:p-6 backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-rose-500" />
              <div className="h-3 w-3 rounded-full bg-amber-500" />
              <div className="h-3 w-3 rounded-full bg-emerald-500" />
              <span className="text-xs font-mono text-slate-400 ml-2">ggu://academiq/rag-session</span>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              GGU Vector RAG Active
            </span>
          </div>

          <div className="space-y-4 text-left">
            {/* User message */}
            <div className="flex justify-end">
              <div className="bg-academic-600 text-white rounded-xl px-4 py-2.5 text-xs sm:text-sm max-w-[80%] shadow-sm">
                What is the minimum attendance required to appear for semester exams in B.Tech Computer Science?
              </div>
            </div>

            {/* Assistant grounded answer */}
            <div className="flex items-start gap-3">
              <div className="h-7 w-7 rounded-lg bg-academic-600 text-white flex items-center justify-center shrink-0">
                <GraduationCap className="h-4 w-4" />
              </div>
              <div className="bg-slate-50 dark:bg-navy-950/60 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-xs sm:text-sm text-slate-800 dark:text-slate-200 max-w-[88%]">
                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold text-[11px] mb-2">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Official GGU Regulations Grounded Answer
                </div>
                <p className="mb-2">
                  According to <strong>Section 4 of the Godavari Global University Academic Regulations Handbook</strong>:
                </p>
                <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300 text-xs">
                  <li><strong>Standard Requirement</strong>: A student must maintain a minimum of <strong>75% overall attendance</strong> across lectures and laboratory sessions.</li>
                  <li><strong>Medical Condonation</strong>: Shortages between <strong>65% and 74%</strong> may be condoned by the Dean upon submission of verified medical documentation.</li>
                  <li><strong>Course Detention</strong>: Overall attendance below <strong>65%</strong> leads to immediate detention without permission to sit for final examinations.</li>
                </ul>

                {/* Citation pill */}
                <div className="mt-3 pt-2.5 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px]">
                  <span className="font-medium text-slate-500">
                    Source: <span className="text-academic-600 dark:text-academic-400 font-semibold">GGU Academic Regulations Handbook</span> (Section 4)
                  </span>
                  <span className="text-emerald-600 font-bold">96% Verified Confidence</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Architecture Cards */}
      <section className="py-16 border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-navy-900/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Enterprise University AI Platform
            </h2>
            <p className="mt-2 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-sm">
              Architected with Spring Boot, MySQL 8, and React 18 for Godavari Global University students and faculty.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900/80 shadow-sm">
              <div className="h-10 w-10 rounded-xl bg-academic-100 dark:bg-academic-950 text-academic-600 dark:text-academic-400 flex items-center justify-center mb-4">
                <Database className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-base mb-2">Grounded University Knowledge</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Indexed syllabus, department rules, grading scales, and regulations partitioned by department, stream, and semester.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900/80 shadow-sm">
              <div className="h-10 w-10 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
                <Cpu className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-base mb-2">Real-Time Academic Assistant</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Get immediate, structured explanations for attendance, exam preparation, and data structure topics with source page references.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900/80 shadow-sm">
              <div className="h-10 w-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-base mb-2">Role-Based Access Governance</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Distinct portals and credential verification for Student Roll Numbers and Faculty Employee IDs with isolated course management privileges.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-6 px-4 text-center text-xs text-slate-500">
        <p>© 2026 Godavari Global University • AcademiQ Academic AI Assistant</p>
      </footer>
    </div>
  );
};
