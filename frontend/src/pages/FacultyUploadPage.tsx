import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { academicService } from '../services/academicService';
import { AcademicDocument, DocumentCategory, DepartmentCode, DEPARTMENTS, getYearLabel } from '../types';
import { 
  Upload, 
  FileText, 
  Trash2, 
  CheckCircle2, 
  Sparkles, 
  BookOpen, 
  Plus, 
  Layers, 
  GraduationCap,
  Eye,
  Clock,
  Filter
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const FacultyUploadPage: React.FC = () => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<AcademicDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form states
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<DocumentCategory>('COURSE_MATERIAL');
  const [departmentCode, setDepartmentCode] = useState<DepartmentCode | 'ALL'>('ALL');
  const [targetYear, setTargetYear] = useState<number>(0);
  const [targetSemester, setTargetSemester] = useState<number>(0);
  const [customText, setCustomText] = useState('');
  const [useTextInput, setUseTextInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadDocs();
  }, []);

  const loadDocs = async () => {
    setLoading(true);
    const docs = await academicService.getDocuments();
    setDocuments(docs);
    setLoading(false);
  };

  const handleSelectedFile = (selected: File) => {
    setFile(selected);
    if (!title) {
      const cleanName = selected.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      setTitle(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
    }

    // Auto-extract text or populate preview
    if (selected.name.endsWith('.txt')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCustomText((e.target?.result as string) || '');
      };
      reader.readAsText(selected);
    } else {
      // For PDF / DOCX, prepare structured template with file metadata
      const initialNotes = `Document: ${selected.name}\nDepartment: ${departmentCode}\nTarget Year: ${targetYear === 0 ? 'All Years' : targetYear + ' Year'}\n\nKey Concepts & Syllabus Outline:\n- Verified course materials and guidelines uploaded for student AI assistance.`;
      setCustomText(initialNotes);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    if (!file && !customText.trim()) {
      alert('Please select a document file or enter course text content.');
      return;
    }

    setUploading(true);

    try {
      const dummyFile = file || new File([customText], `${title.toLowerCase().replace(/\s+/g, '_')}.txt`, { type: 'text/plain' });

      const newDoc = await academicService.uploadFacultyDocument({
        title,
        category,
        departmentCode,
        targetYear: Number(targetYear),
        targetSemester: Number(targetSemester),
        file: dummyFile,
        textPreview: customText.trim() || undefined,
        uploaderName: user?.fullName || 'Prof. David Chen (Faculty)',
      });

      setDocuments([newDoc, ...documents]);
      setSuccessMessage(`Document "${newDoc.title}" published for ${departmentCode === 'ALL' ? 'All Departments' : departmentCode}! Students can now view this and ask the AI chatbot about it.`);

      // Reset form
      setFile(null);
      setTitle('');
      setCustomText('');
      setUseTextInput(false);
      if (fileInputRef.current) fileInputRef.current.value = '';

      setTimeout(() => setSuccessMessage(null), 6000);
    } catch (err: any) {
      alert('Upload failed: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this document from student access and AI search?')) return;
    await academicService.deleteFacultyDocument(id);
    setDocuments(documents.filter((d) => d.id !== id));
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-xs font-semibold text-indigo-700 dark:text-indigo-300 mb-2">
            <GraduationCap className="h-3.5 w-3.5 text-indigo-500" />
            <span>Faculty Content Management Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Upload & Publish Course Materials
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Upload syllabi, lecture notes, exam rules, and handbooks. Students can instantly view these materials and ask questions to the AI assistant.
          </p>
        </div>

        <Link
          to="/chat"
          className="self-start sm:self-auto flex items-center gap-2 px-4 py-2.5 rounded-xl bg-academic-600 hover:bg-academic-700 text-white font-semibold text-xs shadow-md transition-all active:scale-95"
        >
          <Sparkles className="h-4 w-4" />
          <span>Test in AI Chat</span>
        </Link>
      </div>

      {successMessage && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-700 dark:text-emerald-300 flex items-center gap-2 animate-fade-in shadow-sm">
          <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Simple Upload Form */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900 shadow-sm p-6 mb-8">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
          <Upload className="h-4 w-4 text-academic-500" />
          Add New Academic Material
        </h2>

        <form onSubmit={handleUploadSubmit} className="space-y-4">
          {/* File Picker or Drag Zone */}
          {!useTextInput ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-academic-500 dark:hover:border-academic-500 rounded-2xl p-6 text-center cursor-pointer transition-colors bg-slate-50/50 dark:bg-navy-950/50"
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => e.target.files?.[0] && handleSelectedFile(e.target.files[0])}
                accept=".pdf,.docx,.txt"
                className="hidden"
              />
              <FileText className="h-10 w-10 text-academic-500 mx-auto mb-2" />
              {file ? (
                <div>
                  <p className="text-xs font-bold text-academic-600 dark:text-academic-400">
                    {file.name}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {(file.size / 1024).toFixed(1)} KB • Click to choose different file
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Click to select file from your computer (PDF, DOCX, TXT)
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Upload course syllabi, unit notes, question banks, or regulations
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Paste Course Content / Syllabus Text Directly:
              </label>
              <textarea
                rows={5}
                required
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="Paste course outline, lecture notes, grading rules, or policies here..."
                className="w-full p-3 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-academic-500 font-mono"
              />
            </div>
          )}

          <div className="flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={() => setUseTextInput(!useTextInput)}
              className="text-academic-600 dark:text-academic-400 hover:underline font-medium"
            >
              {useTextInput ? '← Switch to File Upload' : '✍️ Or Paste Text / Notes Directly'}
            </button>
            <span className="text-[11px] text-slate-400">Max size: 25MB</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Material Title
              </label>
              <input
                type="text"
                required
                placeholder="e.g. AI401 Deep Neural Networks Lecture Notes"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-academic-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-academic-500"
              >
                <option value="COURSE_MATERIAL">Course Material / Lecture Notes</option>
                <option value="SYLLABUS">Course Syllabus & Curriculum</option>
                <option value="EXAM">Exam Guidelines & Question Scheme</option>
                <option value="REGULATION">Academic Regulation / Policy</option>
                <option value="HANDBOOK">General University Handbook</option>
              </select>
            </div>
          </div>

          {/* Department & Student Year/Semester Segregation */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Target Department
              </label>
              <select
                value={departmentCode}
                onChange={(e) => setDepartmentCode(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-academic-500 font-medium"
              >
                <option value="ALL">All Departments (University-Wide)</option>
                <option value="CSE">CSE (Computer Science & Eng)</option>
                <option value="AIML">AIML (AI & Machine Learning)</option>
                <option value="DS">DS (Data Science)</option>
                <option value="ECE">ECE (Electronics & Comm)</option>
                <option value="EEE">EEE (Electrical & Electronics)</option>
                <option value="MECH">MECH (Mechanical Eng)</option>
                <option value="CIVIL">CIVIL (Civil Engineering)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Target Student Year
              </label>
              <select
                value={targetYear}
                onChange={(e) => setTargetYear(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-academic-500"
              >
                <option value={0}>All Years (General)</option>
                <option value={1}>1st Year (Semesters 1 & 2)</option>
                <option value={2}>2nd Year (Semesters 3 & 4)</option>
                <option value={3}>3rd Year (Semesters 5 & 6)</option>
                <option value={4}>4th Year (Semesters 7 & 8)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Target Semester (Optional)
              </label>
              <select
                value={targetSemester}
                onChange={(e) => setTargetSemester(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-academic-500"
              >
                <option value={0}>All Semesters in Year</option>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                  <option key={s} value={s}>
                    Semester {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-3">
            <button
              type="submit"
              disabled={(!file && !customText.trim()) || !title.trim() || uploading}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-semibold text-xs shadow-md transition-all ${
                (file || customText.trim()) && title.trim() && !uploading
                  ? 'bg-academic-600 hover:bg-academic-700 active:scale-95'
                  : 'bg-slate-300 dark:bg-slate-800 cursor-not-allowed text-slate-500'
              }`}
            >
              {uploading ? (
                <span>Publishing to Knowledge Base...</span>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  <span>Publish to Students & AI Knowledge Base</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Published Documents List */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Published Course Documents ({documents.length})
            </h2>
            <p className="text-xs text-slate-500">
              Segregated by department and student year for instant AI retrieval and student study
            </p>
          </div>

          <Link
            to="/resources"
            className="text-xs font-semibold text-academic-600 dark:text-academic-400 hover:underline flex items-center gap-1"
          >
            <span>Student View</span>
            <span>&rarr;</span>
          </Link>
        </div>

        <div className="space-y-3">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-navy-950/60 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:border-academic-300 transition-colors"
            >
              <div className="flex items-start gap-3 min-w-0">
                <div className="h-9 w-9 rounded-xl bg-academic-100 dark:bg-academic-950 text-academic-600 flex items-center justify-center shrink-0">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-xs text-slate-900 dark:text-white truncate">
                    {doc.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 mt-1.5 text-[11px] text-slate-400">
                    <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                      {doc.departmentCode || 'ALL'}
                    </span>
                    {(doc.targetYear || 0) > 0 && (
                      <span className="px-2 py-0.5 rounded font-semibold text-[10px] bg-purple-50 dark:bg-purple-950/70 text-purple-600 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                        {getYearLabel(doc.targetYear || 0)}
                      </span>
                    )}
                    {(doc.targetSemester || 0) > 0 && (
                      <span className="px-2 py-0.5 rounded font-semibold text-[10px] bg-cyan-50 dark:bg-cyan-950/70 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800">
                        Sem {doc.targetSemester}
                      </span>
                    )}
                    <span className="font-mono text-slate-500">{doc.fileName}</span>
                    <span>•</span>
                    <span className="px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-800 text-[10px] text-slate-600 dark:text-slate-300 font-medium">
                      {doc.category}
                    </span>
                    <span>•</span>
                    <span>Uploaded by {doc.uploaderName || 'Faculty'}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                  <CheckCircle2 className="h-3 w-3" />
                  Active in AI RAG
                </span>

                <button
                  onClick={() => handleDelete(doc.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                  title="Delete from knowledge base"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
