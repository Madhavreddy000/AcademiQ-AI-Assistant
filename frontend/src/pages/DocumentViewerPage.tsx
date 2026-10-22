import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { AcademicDocument } from '../types';
import { academicService } from '../services/academicService';
import { 
  FileText, 
  Layers, 
  Search, 
  BookOpen, 
  Sparkles, 
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Hash
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';

interface MockChunk {
  id: number;
  pageNumber: number;
  chunkIndex: number;
  tokenCount: number;
  text: string;
}

export const DocumentViewerPage: React.FC = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const docIdParam = searchParams.get('id');
  const [documents, setDocuments] = useState<AcademicDocument[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<AcademicDocument | null>(null);
  const [chunkFilter, setChunkFilter] = useState('');

  // Sample chunks for inspection
  const sampleChunks: MockChunk[] = [
    {
      id: 1,
      pageNumber: 14,
      chunkIndex: 28,
      tokenCount: 245,
      text: 'Section 4.2 Attendance Criteria: Every registered student shall be deemed eligible to appear for the End Semester Examination if they have attended not less than 75% of the total classes held in each course, encompassing lectures, tutorials, and laboratory practicals.',
    },
    {
      id: 2,
      pageNumber: 15,
      chunkIndex: 29,
      tokenCount: 198,
      text: 'Section 4.3 Condonation of Attendance Shortage: The Dean (Academic Affairs) may condone a shortage of attendance between 65% and 74% strictly upon submission of verified medical proof issued by a recognized medical practitioner within 7 days of absence.',
    },
    {
      id: 3,
      pageNumber: 22,
      chunkIndex: 44,
      tokenCount: 310,
      text: 'Section 7.1 Absolute Letter Grading: The university calculates performance using a 10-point scale: O (Outstanding, 90-100%), A+ (Excellent, 80-89%), A (Very Good, 70-79%), B+ (Good, 60-69%), B (Above Average, 55-59%), C (Average, 50-54%), P (Pass, 40-49%), and F (Fail, <40%).',
    },
    {
      id: 4,
      pageNumber: 38,
      chunkIndex: 72,
      tokenCount: 280,
      text: 'CS201 Data Structures & Algorithms - Unit 3 Graph Theory: Representation of graphs using adjacency matrices and lists. Traversal strategies: Breadth First Search (BFS) and Depth First Search (DFS). Shortest path algorithms: Dijkstra and Bellman-Ford. Minimum spanning trees: Prim and Kruskal algorithms.',
    },
    {
      id: 5,
      pageNumber: 42,
      chunkIndex: 85,
      tokenCount: 220,
      text: 'Section 5.4 Examination Hall Code of Conduct: Possession of any unapproved paper, notes, programmable calculation devices, mobile telephones, or smart wearable devices within the examination hall constitutes an offense of academic malpractice punishable by cancellation of exam performance.',
    },
  ];

  useEffect(() => {
    loadDocs();
  }, []);

  const loadDocs = async () => {
    const docs = await academicService.getDocuments();
    setDocuments(docs);
    if (docIdParam) {
      const match = docs.find((d) => d.id === Number(docIdParam));
      if (match) setSelectedDoc(match);
      else if (docs.length > 0) setSelectedDoc(docs[0]);
    } else if (docs.length > 0) {
      setSelectedDoc(docs[0]);
    }
  };

  // Generate chunks from extracted text if available, otherwise sample
  const displayedChunks: MockChunk[] = React.useMemo(() => {
    if (!selectedDoc) return [];
    if (selectedDoc.extractedText) {
      const paragraphs = selectedDoc.extractedText
        .split(/\n\s*\n/)
        .map((p) => p.trim())
        .filter((p) => p.length > 20);

      if (paragraphs.length > 0) {
        return paragraphs.map((para, idx) => ({
          id: idx + 1,
          pageNumber: Math.floor(idx / 3) + 1,
          chunkIndex: idx + 1,
          tokenCount: Math.round(para.split(/\s+/).length * 1.3),
          text: para,
        }));
      }
    }
    return sampleChunks;
  }, [selectedDoc]);

  const filteredChunks = displayedChunks.filter((c) =>
    c.text.toLowerCase().includes(chunkFilter.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Document Vector Viewer & Course Materials
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Browse course syllabi, lecture notes, regulations, and view extracted semantic chunks used by the AI chatbot.
          </p>
        </div>

        {user?.role === 'FACULTY' ? (
          <Link
            to="/faculty/upload"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs shadow-sm transition-all"
          >
            <Layers className="h-4 w-4" />
            <span>Upload New Material</span>
          </Link>
        ) : (
          <Link
            to="/chat"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-academic-600 hover:bg-academic-700 text-white font-medium text-xs shadow-sm transition-all"
          >
            <Sparkles className="h-4 w-4" />
            <span>Ask Chatbot About These</span>
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Document Selector */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Indexed Documents ({documents.length})
          </p>
          {documents.map((doc) => (
            <div
              key={doc.id}
              onClick={() => setSelectedDoc(doc)}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                selectedDoc?.id === doc.id
                  ? 'bg-academic-50 dark:bg-academic-950/60 border-academic-300 dark:border-academic-700 shadow-sm'
                  : 'bg-white dark:bg-navy-900 border-slate-200 dark:border-slate-800 hover:border-academic-200'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] font-semibold text-slate-400 mb-1">
                <span>{doc.fileType} • {doc.category}</span>
                <span className="text-emerald-600 dark:text-emerald-400">Indexed</span>
              </div>
              <h3 className="font-semibold text-xs text-slate-900 dark:text-white leading-snug">
                {doc.title}
              </h3>
              <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-500">
                <span>{doc.totalPages} Pages</span>
                <span>•</span>
                <span>{doc.chunkCount} Chunks</span>
              </div>
            </div>
          ))}
        </div>

        {/* Right: Active Document Chunks Breakdown */}
        <div className="lg:col-span-2 space-y-4">
          {selectedDoc && (
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">
                    {selectedDoc.title}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5 font-mono">
                    {selectedDoc.fileName} • {selectedDoc.totalPages} Pages • {selectedDoc.chunkCount} Vectors
                  </p>
                </div>

                <Link
                  to="/chat"
                  className="self-start sm:self-auto px-3 py-1.5 rounded-xl bg-academic-600 hover:bg-academic-700 text-white font-medium text-xs flex items-center gap-1.5 shadow-sm"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Ask in Chat</span>
                </Link>
              </div>

              {/* Chunk Search Filter */}
              <div className="relative my-3">
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter extracted chunk excerpts..."
                  value={chunkFilter}
                  onChange={(e) => setChunkFilter(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-academic-500"
                />
              </div>

              {/* Chunks List */}
              <div className="space-y-3 mt-4">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Indexed Chunks in Vector Store (Qdrant)
                </p>

                {filteredChunks.map((chunk) => (
                  <div
                    key={chunk.id}
                    className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-navy-950/60"
                  >
                    <div className="flex items-center justify-between text-[11px] mb-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-academic-100 dark:bg-academic-950 text-academic-700 dark:text-academic-300 font-semibold">
                          Page {chunk.pageNumber}
                        </span>
                        <span className="text-slate-400">
                          Chunk #{chunk.chunkIndex}
                        </span>
                      </div>
                      <span className="font-mono text-slate-400">
                        {chunk.tokenCount} tokens
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-sans bg-white dark:bg-navy-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                      {chunk.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
