import React, { useState, useEffect, useRef } from 'react';
import { adminService } from '../../services/adminService';
import { academicService } from '../../services/academicService';
import { AcademicDocument, DocumentCategory, AccessLevel } from '../../types';
import { 
  Upload, 
  FileText, 
  Trash2, 
  RotateCw, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Layers, 
  ShieldCheck,
  Search,
  Plus
} from 'lucide-react';

export const DocumentManagement: React.FC = () => {
  const [documents, setDocuments] = useState<AcademicDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  // Form states
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<DocumentCategory>('HANDBOOK');
  const [accessLevel, setAccessLevel] = useState<AccessLevel>('STUDENT');
  const [academicYear, setAcademicYear] = useState('2025-2026');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    setLoading(true);
    const docs = await academicService.getDocuments();
    setDocuments(docs);
    setLoading(false);
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleSelectedFile = (selected: File) => {
    setFile(selected);
    if (!title) {
      const cleanName = selected.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      setTitle(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('category', category);
    formData.append('accessLevel', accessLevel);
    formData.append('academicYear', academicYear);

    try {
      const newDoc = await adminService.uploadDocument(formData);
      setDocuments([newDoc, ...documents]);
      setUploadSuccess(`"${newDoc.title}" uploaded & indexed successfully with ${newDoc.chunkCount} vector chunks!`);
      // Reset form
      setFile(null);
      setTitle('');
      if (fileInputRef.current) fileInputRef.current.value = '';
      setTimeout(() => setUploadSuccess(null), 5000);
    } catch (err: any) {
      alert('Upload failed: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleReindex = async (id: number) => {
    try {
      const res = await adminService.reindexDocument(id);
      alert(res.message);
      loadDocuments();
    } catch (e: any) {
      alert('Reindex error: ' + e.message);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to remove this document and delete its vector embeddings?')) return;
    await adminService.deleteDocument(id);
    setDocuments(documents.filter((d) => d.id !== id));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Document Ingestion & Vector Management
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Upload official academic documents (PDF, DOCX, TXT) to split into chunks, generate embeddings, and index into Qdrant.
        </p>
      </div>

      {uploadSuccess && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-700 dark:text-emerald-300 flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
          <span>{uploadSuccess}</span>
        </div>
      )}

      {/* Upload Form Box */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900 shadow-sm p-6 mb-8">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
          <Upload className="h-4 w-4 text-academic-500" />
          Upload Official Document
        </h2>

        <form onSubmit={handleUploadSubmit} className="space-y-4">
          {/* Drag & Drop Zone */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleFileDrop}
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
            <FileText className="h-10 w-10 text-slate-400 mx-auto mb-2" />
            {file ? (
              <div>
                <p className="text-xs font-bold text-academic-600 dark:text-academic-400">
                  {file.name}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB • Ready for Ingestion
                </p>
              </div>
            ) : (
              <div>
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Click to browse or drag and drop official document
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Supported: PDF, DOCX, TXT (Maximum 25MB)
                </p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Document Title
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Examination Guidelines 2026"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-academic-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-academic-500"
              >
                <option value="REGULATION">Academic Regulation</option>
                <option value="SYLLABUS">Course Syllabus</option>
                <option value="EXAM">Examination Manual</option>
                <option value="HANDBOOK">University Handbook</option>
                <option value="COURSE_MATERIAL">Course Material</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Access Authorization
              </label>
              <select
                value={accessLevel}
                onChange={(e) => setAccessLevel(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-academic-500"
              >
                <option value="PUBLIC">Public (All Users)</option>
                <option value="STUDENT">Students & Faculty</option>
                <option value="FACULTY">Faculty Only</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={!file || !title || uploading}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-semibold text-xs shadow-md transition-all ${
                file && title && !uploading
                  ? 'bg-academic-600 hover:bg-academic-700 active:scale-95'
                  : 'bg-slate-300 dark:bg-slate-800 cursor-not-allowed text-slate-500'
              }`}
            >
              {uploading ? (
                <span>Extracting, Chunking & Vectorizing...</span>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  <span>Start Async Ingestion</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Uploaded Documents List */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900 shadow-sm p-6">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 flex items-center justify-between">
          <span>Managed Documents ({documents.length})</span>
          <button
            onClick={loadDocuments}
            className="text-xs text-academic-600 dark:text-academic-400 font-semibold hover:underline flex items-center gap-1"
          >
            <RotateCw className="h-3 w-3" /> Refresh
          </button>
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500">
                <th className="py-2.5 font-semibold">Title & File</th>
                <th className="py-2.5 font-semibold">Category</th>
                <th className="py-2.5 font-semibold">Access</th>
                <th className="py-2.5 font-semibold">Pages / Chunks</th>
                <th className="py-2.5 font-semibold">Status</th>
                <th className="py-2.5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {documents.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-3 font-medium">
                    <p className="text-slate-900 dark:text-white font-semibold">{doc.title}</p>
                    <p className="text-[11px] font-mono text-slate-400">{doc.fileName}</p>
                  </td>
                  <td className="py-3 text-slate-600 dark:text-slate-300">{doc.category}</td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-medium text-slate-600 dark:text-slate-400">
                      {doc.accessLevel}
                    </span>
                  </td>
                  <td className="py-3 text-slate-600 dark:text-slate-300">
                    {doc.totalPages} pgs • {doc.chunkCount} chunks
                  </td>
                  <td className="py-3">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 text-[10px] font-semibold border border-emerald-200 dark:border-emerald-800">
                      <CheckCircle2 className="h-3 w-3" />
                      {doc.status}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleReindex(doc.id)}
                        className="p-1 text-slate-400 hover:text-academic-600 rounded"
                        title="Reindex Document Chunks"
                      >
                        <RotateCw className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(doc.id)}
                        className="p-1 text-slate-400 hover:text-rose-500 rounded"
                        title="Delete Document"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
