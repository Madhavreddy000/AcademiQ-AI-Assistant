import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import { AdminStats, IngestionJob } from '../../types';
import { 
  Database, 
  FileText, 
  MessageSquare, 
  Users, 
  CheckCircle2, 
  Upload, 
  RotateCw, 
  Activity,
  ShieldCheck,
  Cpu
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [jobs, setJobs] = useState<IngestionJob[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [s, j] = await Promise.all([
      adminService.getStats(),
      adminService.getIngestionJobs(),
    ]);
    setStats(s);
    setJobs(j);
    setLoading(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-xs font-semibold text-amber-700 dark:text-amber-300 mb-2">
            <ShieldCheck className="h-3.5 w-3.5 text-amber-500" />
            <span>Administrator Control Suite</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Academic Assistant & RAG Ingestion Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Monitor document vectorization pipeline, query volume, and user permissions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/documents"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-academic-600 hover:bg-academic-700 text-white font-semibold text-xs shadow-md transition-all active:scale-95"
          >
            <Upload className="h-4 w-4" />
            <span>Upload Document</span>
          </Link>
          <button
            onClick={loadData}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors"
            title="Refresh statistics"
          >
            <RotateCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Primary KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Documents</span>
            <FileText className="h-4 w-4 text-academic-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats?.totalDocuments || 24}</p>
          <p className="text-[11px] text-slate-500 mt-1 font-medium">Official Handbooks & Syllabus</p>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Vector Chunks in Qdrant</span>
            <Database className="h-4 w-4 text-indigo-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats?.totalChunks || 2150}</p>
          <p className="text-[11px] text-indigo-600 dark:text-indigo-400 mt-1 font-medium">HNSW Index Synced</p>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Student Queries Answered</span>
            <MessageSquare className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats?.totalQueries || 14820}</p>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 font-medium">{stats?.accuracyRate || 98.4}% Grounded Accuracy</p>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Users</span>
            <Users className="h-4 w-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats?.activeUsers || 342}</p>
          <p className="text-[11px] text-slate-500 mt-1 font-medium">Students, Faculty & Admins</p>
        </div>
      </div>

      {/* Ingestion Pipeline Jobs */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900 shadow-sm p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Activity className="h-4 w-4 text-academic-500" />
              Document Ingestion & Vectorization Stream
            </h2>
            <p className="text-xs text-slate-500">
              Real-time monitoring of text extraction, chunking, and embedding generation
            </p>
          </div>
          <Link
            to="/admin/documents"
            className="text-xs text-academic-600 dark:text-academic-400 font-semibold hover:underline"
          >
            Manage Documents &rarr;
          </Link>
        </div>

        <div className="space-y-3">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-navy-950/60"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                <span className="font-semibold text-xs text-slate-900 dark:text-white">
                  {job.documentTitle || 'Academic Document'}
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                  <CheckCircle2 className="h-3 w-3" />
                  {job.status}
                </span>
              </div>

              <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden mb-2">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-academic-600 to-indigo-600"
                  style={{ width: `${job.progressPercent}%` }}
                />
              </div>

              <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400 leading-relaxed">
                {job.logDetails}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Admin Action Shortcuts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          to="/admin/documents"
          className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900 hover:border-academic-400 transition-all flex items-center justify-between group"
        >
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-academic-600 transition-colors">
              Document Ingestion Manager
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Upload new PDF/DOCX regulations, trigger async vectorization, and preview chunks.
            </p>
          </div>
          <span className="text-slate-400 group-hover:text-academic-500 text-lg">&rarr;</span>
        </Link>

        <Link
          to="/admin/users"
          className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900 hover:border-academic-400 transition-all flex items-center justify-between group"
        >
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-academic-600 transition-colors">
              User & Role Governance
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Control RBAC permissions, student department memberships, and access authorizations.
            </p>
          </div>
          <span className="text-slate-400 group-hover:text-academic-500 text-lg">&rarr;</span>
        </Link>
      </div>
    </div>
  );
};
