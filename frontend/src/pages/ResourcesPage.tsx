import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AcademicDocument, DEPARTMENTS, DepartmentCode, getYearLabel, SEMESTERS } from '../types';
import { academicService } from '../services/academicService';
import { 
  BookOpen, 
  Search, 
  FileText, 
  Sparkles, 
  Layers, 
  ShieldCheck,
  GraduationCap,
  Calendar,
  Filter,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';

export const ResourcesPage: React.FC = () => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<AcademicDocument[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedDept, setSelectedDept] = useState<DepartmentCode | 'ALL'>('ALL');
  const [selectedYear, setSelectedYear] = useState<number>(0);
  const [selectedSem, setSelectedSem] = useState<number>(0);
  const [matchMyProfile, setMatchMyProfile] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDocuments();
  }, [selectedCategory, selectedDept, selectedYear, selectedSem, search, matchMyProfile]);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const deptCode: DepartmentCode | undefined = matchMyProfile && user?.departmentCode 
        ? user.departmentCode 
        : (selectedDept === 'ALL' ? undefined : selectedDept);
      const sem = matchMyProfile && user?.currentSemester ? user.currentSemester : (selectedSem === 0 ? undefined : selectedSem);
      const year = matchMyProfile && user?.academicYearNumber ? user.academicYearNumber : (selectedYear === 0 ? undefined : selectedYear);

      const docs = await academicService.getDocuments({
        category: selectedCategory === 'ALL' ? undefined : selectedCategory,
        departmentCode: deptCode,
        targetYear: year,
        semester: sem,
        search: search.trim() || undefined,
      });
      setDocuments(docs);
    } catch (e) {
      console.error('Failed to load academic documents', e);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: 'ALL', label: 'All Types' },
    { id: 'COURSE_MATERIAL', label: 'Course Materials' },
    { id: 'SYLLABUS', label: 'Syllabus & Schemes' },
    { id: 'REGULATION', label: 'Regulations' },
    { id: 'EXAM', label: 'Exam Manuals' },
    { id: 'HANDBOOK', label: 'Handbooks & Guides' },
  ];

  const handleAskAIAboutDoc = (doc: AcademicDocument) => {
    navigate(`/chat?docId=${doc.id}&docName=${encodeURIComponent(doc.title)}`);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-700 dark:text-emerald-300 mb-2">
            <BookOpen className="h-3.5 w-3.5 text-emerald-500" />
            <span>Official University Document Repository</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Department & Semester Course Data
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Access curated lecture notes, syllabus schemes, and exam materials segregated by department (CSE, ECE, EEE, AIML, DS, MECH, CIVIL) and 8 semesters.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {user?.role === 'FACULTY' && (
            <Link
              to="/faculty/upload"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md transition-all active:scale-95"
            >
              <Layers className="h-4 w-4" />
              <span>Upload Faculty Data</span>
            </Link>
          )}
          <Link
            to="/chat"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-academic-600 to-indigo-600 hover:from-academic-700 hover:to-indigo-700 text-white font-semibold text-xs shadow-md transition-all hover:scale-105 active:scale-95"
          >
            <Sparkles className="h-4 w-4" />
            <span>Ask Chatbot</span>
          </Link>
        </div>
      </div>

      {/* Student Profile Quick Filter Banner */}
      {user && (
        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-academic-50 via-indigo-50 to-purple-50 dark:from-academic-950/30 dark:via-indigo-950/20 dark:to-purple-950/20 border border-academic-100 dark:border-academic-900/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-academic-600/10 text-academic-600 dark:bg-academic-400/10 dark:text-academic-400 flex items-center justify-center font-bold">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Your Profile: {user.departmentCode || 'CSE'} Department</span>
                <span className="px-2 py-0.5 rounded-full bg-academic-100 dark:bg-academic-900 text-academic-700 dark:text-academic-300 text-[10px]">
                  Sem {user.currentSemester || 4} • {getYearLabel(user.academicYearNumber || 2)}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Filter documents customized exclusively for your department and current academic year.
              </p>
            </div>
          </div>

          <button
            onClick={() => setMatchMyProfile(!matchMyProfile)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-sm ${
              matchMyProfile
                ? 'bg-academic-600 text-white shadow-academic-500/25 ring-2 ring-academic-500'
                : 'bg-white dark:bg-navy-900 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <CheckCircle2 className={`h-4 w-4 ${matchMyProfile ? 'text-white' : 'text-slate-400'}`} />
            <span>{matchMyProfile ? 'Filtered to My Profile' : 'Match My Department'}</span>
          </button>
        </div>
      )}

      {/* Main Filter Section */}
      <div className="bg-white dark:bg-navy-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 mb-6 shadow-xs space-y-4">
        {/* Row 1: Search + Category */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search lectures, course codes, topics (e.g., CS201, AI, VLSI, CAD, DSP)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-academic-500 shadow-sm"
            />
          </div>

          {/* Categories */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  selectedCategory === c.id
                    ? 'bg-academic-600 text-white shadow-sm'
                    : 'bg-slate-50 dark:bg-navy-950 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Row 2: Department Segregation Pills */}
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
            <Filter className="h-3.5 w-3.5 text-academic-500" />
            <span>Department:</span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => {
                setSelectedDept('ALL');
                setMatchMyProfile(false);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                !matchMyProfile && selectedDept === 'ALL'
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                  : 'bg-slate-100 dark:bg-navy-950 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              All Departments
            </button>
            {DEPARTMENTS.map((dept) => {
              const isSelected = !matchMyProfile && selectedDept === dept.code;
              return (
                <button
                  key={dept.code}
                  onClick={() => {
                    setSelectedDept(dept.code);
                    setMatchMyProfile(false);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-academic-600 text-white shadow-md ring-2 ring-academic-400/50'
                      : 'bg-slate-100 dark:bg-navy-950 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-800'
                  }`}
                >
                  {dept.code}
                </button>
              );
            })}
          </div>
        </div>

        {/* Row 3: Year & Semester Filters */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center gap-6">
          {/* Year Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-indigo-500" />
              <span>Year:</span>
            </span>
            <div className="flex items-center gap-1">
              {[0, 1, 2, 3, 4].map((yr) => (
                <button
                  key={yr}
                  onClick={() => {
                    setSelectedYear(yr);
                    setMatchMyProfile(false);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                    !matchMyProfile && selectedYear === yr
                      ? 'bg-indigo-600 text-white font-bold shadow-xs'
                      : 'bg-slate-100 dark:bg-navy-950 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  {yr === 0 ? 'All Years' : `${yr}${yr === 1 ? 'st' : yr === 2 ? 'nd' : yr === 3 ? 'rd' : 'th'} Yr`}
                </button>
              ))}
            </div>
          </div>

          {/* Semester Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1">
              <Layers className="h-3.5 w-3.5 text-purple-500" />
              <span>Semester:</span>
            </span>
            <div className="flex items-center gap-1 flex-wrap">
              <button
                onClick={() => {
                  setSelectedSem(0);
                  setMatchMyProfile(false);
                }}
                className={`px-2 py-1 rounded-lg text-xs font-medium transition-all ${
                  !matchMyProfile && selectedSem === 0
                    ? 'bg-purple-600 text-white font-bold shadow-xs'
                    : 'bg-slate-100 dark:bg-navy-950 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                All
              </button>
              {SEMESTERS.map((sem) => (
                <button
                  key={sem}
                  onClick={() => {
                    setSelectedSem(sem);
                    setMatchMyProfile(false);
                  }}
                  className={`px-2 py-1 rounded-lg text-xs font-medium transition-all ${
                    !matchMyProfile && selectedSem === sem
                      ? 'bg-purple-600 text-white font-bold shadow-xs'
                      : 'bg-slate-100 dark:bg-navy-950 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  S{sem}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Documents Grid */}
      {loading ? (
        <div className="py-20 text-center text-slate-400 text-xs animate-pulse">
          Retrieving academic documents and curriculum files...
        </div>
      ) : documents.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900">
          <FileText className="h-10 w-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">No documents found matching filters</h3>
          <p className="text-xs text-slate-400 mt-1">Try switching department, year, or clearing your search term.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {documents.map((doc) => {
            const dept = DEPARTMENTS.find(d => d.code === doc.departmentCode);
            return (
              <div
                key={doc.id}
                className="flex flex-col justify-between p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900 hover:border-academic-400 dark:hover:border-academic-600 shadow-sm transition-all hover:shadow-md group"
              >
                <div>
                  {/* Badges Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {/* Department Badge */}
                      <span className="px-2.5 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 text-[11px] font-bold uppercase tracking-wider border border-indigo-200 dark:border-indigo-800">
                        {doc.departmentCode || 'ALL DEPTS'}
                      </span>

                      {/* Year & Semester Badge */}
                      {doc.targetYear && doc.targetYear > 0 ? (
                        <span className="px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-[10px] font-bold border border-purple-200 dark:border-purple-800">
                          {getYearLabel(doc.targetYear)}
                        </span>
                      ) : null}

                      {doc.targetSemester && doc.targetSemester > 0 ? (
                        <span className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-[10px] font-bold border border-blue-200 dark:border-blue-800">
                          Sem {doc.targetSemester}
                        </span>
                      ) : null}

                      {/* File Type */}
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-bold">
                        {doc.fileType}
                      </span>
                    </div>

                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      Indexed
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white leading-snug group-hover:text-academic-600 dark:group-hover:text-academic-400 transition-colors">
                    {doc.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 font-mono">
                    {doc.fileName} • {(doc.fileSizeBytes / (1024 * 1024)).toFixed(1)} MB
                  </p>

                  {/* Metadata Pill Grid */}
                  <div className="flex flex-wrap items-center gap-3 mt-4 text-[11px] text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <FileText className="h-3.5 w-3.5 text-slate-400" />
                      {doc.totalPages} Pages
                    </span>
                    <span className="flex items-center gap-1">
                      <Layers className="h-3.5 w-3.5 text-academic-500" />
                      {doc.chunkCount} RAG Chunks
                    </span>
                    <span>Category: {doc.category}</span>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                  <Link
                    to={`/documents?id=${doc.id}`}
                    className="text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-academic-600 dark:hover:text-academic-400 flex items-center gap-1 transition-colors"
                  >
                    <span>Inspect Chunks</span>
                    <ExternalLink className="h-3 w-3" />
                  </Link>

                  <button
                    onClick={() => handleAskAIAboutDoc(doc)}
                    className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-academic-600 to-indigo-600 hover:from-academic-700 hover:to-indigo-700 text-white font-medium text-xs flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Ask AI About This Doc</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

