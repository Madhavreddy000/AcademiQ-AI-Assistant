import React from 'react';
import { Link } from 'react-router-dom';
import { 
  GraduationCap, 
  Sparkles, 
  ShieldCheck, 
  FileText, 
  BookOpen, 
  Search, 
  ArrowRight, 
  CheckCircle2, 
  Database,
  Lock,
  Cpu
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LandingPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-slate-100 selection:bg-academic-500 selection:text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-28 px-4 sm:px-6 lg:px-8">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-academic-500/15 dark:bg-academic-500/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[300px] bg-indigo-500/15 dark:bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center">
          {/* Top pill badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-academic-200 dark:border-academic-800 bg-white/80 dark:bg-navy-900/80 shadow-sm mb-6 text-xs font-semibold text-academic-700 dark:text-academic-300 backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5 text-academic-500" />
            <span>Official University RAG AI Assistant 2.0</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            Grounded Academic Intelligence for{' '}
            <span className="bg-gradient-to-r from-academic-600 via-indigo-600 to-academic-400 bg-clip-text text-transparent dark:from-academic-400 dark:to-indigo-300">
              Students & Faculty
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Instant, verified answers to academic regulations, examination rules, syllabus details, and course prerequisites—backed by exact citations from official university documents.
          </p>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/chat"
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-academic-600 to-indigo-600 hover:from-academic-700 hover:to-indigo-700 text-white font-semibold text-sm shadow-glow transition-all hover:scale-105 active:scale-95"
            >
              <Sparkles className="h-4 w-4" />
              <span>Launch AI Assistant</span>
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>

            <Link
              to="/resources"
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-navy-900/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-sm shadow-sm transition-all"
            >
              <BookOpen className="h-4 w-4 text-emerald-500" />
              <span>Browse Handbooks & Syllabus</span>
            </Link>
          </div>

          {/* Trust badges */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-500" /> 100% Grounded in Official Documents
            </span>
            <span className="flex items-center gap-1.5">
              <FileText className="h-4 w-4 text-academic-500" /> Exact Page & Section Citations
            </span>
            <span className="flex items-center gap-1.5">
              <Lock className="h-4 w-4 text-indigo-500" /> Role-Based Access Isolation
            </span>
          </div>
        </div>

        {/* Live Interactive Preview Mockup */}
        <div className="relative max-w-4xl mx-auto mt-16 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-navy-900/90 shadow-glass-dark p-4 sm:p-6 backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-rose-500" />
              <div className="h-3 w-3 rounded-full bg-amber-500" />
              <div className="h-3 w-3 rounded-full bg-emerald-500" />
              <span className="text-xs font-mono text-slate-400 ml-2">academiq://chat/session-42</span>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              Qdrant Vector RAG Active
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
                  Official Document Grounded Answer
                </div>
                <p className="mb-2">
                  According to <strong>Section 4.2 of the Academic Regulations Handbook 2025-2026</strong>:
                </p>
                <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300 text-xs">
                  <li><strong>Standard Requirement</strong>: A minimum of <strong>75% attendance</strong> is mandatory in all theory and laboratory sessions.</li>
                  <li><strong>Medical Condonation</strong>: Permitted down to <strong>65%</strong> with valid hospital certificate approved by the Dean of Academics.</li>
                  <li><strong>Detention</strong>: Attendance below 65% results in course detention with no exam permission.</li>
                </ul>

                {/* Citation pill */}
                <div className="mt-3 pt-2.5 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px]">
                  <span className="font-medium text-slate-500">
                    Source: <span className="text-academic-600 dark:text-academic-400 font-semibold">Academic Regulations Handbook 2025-26</span> (Page 14)
                  </span>
                  <span className="text-emerald-600 font-bold">94% Confidence</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Architecture Cards */}
      <section className="py-20 border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-navy-900/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Enterprise RAG Architecture
            </h2>
            <p className="mt-3 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-sm">
              Engineered with Spring AI, MySQL 8, Qdrant Vector Store, and React 18 for zero-hallucination academic support.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900/80 shadow-sm">
              <div className="h-10 w-10 rounded-xl bg-academic-100 dark:bg-academic-950 text-academic-600 dark:text-academic-400 flex items-center justify-center mb-4">
                <Database className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-base mb-2">Qdrant Vector Database</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Document chunks stored with HNSW vector indexing and rich metadata payloads: departmentId, courseId, semester, and access levels.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900/80 shadow-sm">
              <div className="h-10 w-10 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
                <Cpu className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-base mb-2">Spring AI RAG Pipeline</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Async document parsing (PDF/DOCX/TXT), recursive token chunking, cosine similarity retrieval, and prompt injection defense.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900/80 shadow-sm">
              <div className="h-10 w-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-base mb-2">Role-Based Security</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                JWT stateless authentication with strict RBAC ensuring students never retrieve confidential faculty or administrative records.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-8 px-4 text-center text-xs text-slate-500">
        <p>© 2026 University Academic AI Assistant. Designed for accuracy, compliance, and student success.</p>
      </footer>
    </div>
  );
};
