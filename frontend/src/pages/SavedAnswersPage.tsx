import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Sparkles, ExternalLink, Trash2, Copy, Check, MessageSquare } from 'lucide-react';

export const SavedAnswersPage: React.FC = () => {
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const [savedAnswers, setSavedAnswers] = useState([
    {
      id: 1,
      topic: 'Semester Attendance Shortage & Condonation Rules',
      query: 'What is the attendance requirement for semester examinations in Computer Science?',
      snippet: 'Minimum 75% attendance is mandatory. Condonation permitted between 65% and 74% strictly on medical emergencies. Below 65% results in detention.',
      source: 'Academic Regulations & Examination Handbook 2025-2026',
      page: 14,
      date: 'Oct 15, 2026',
    },
    {
      id: 2,
      topic: 'Data Structures Unit 3 & Internal Marks Distribution',
      query: 'Can you summarize Unit 3 of Data Structures and tell me the internal marks distribution?',
      snippet: 'Unit 3 covers Graph Representations, BFS/DFS, Dijkstra, and Kruskal algorithms. Continuous Internal Evaluation (CIE) weightage is 40 Marks, and End-Semester Exam is 60 Marks.',
      source: 'B.Tech CS Curriculum Scheme 2025',
      page: 38,
      date: 'Oct 14, 2026',
    },
  ]);

  const handleCopy = (id: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = (id: number) => {
    setSavedAnswers(savedAnswers.filter((a) => a.id !== id));
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-xs font-semibold text-amber-700 dark:text-amber-300 mb-2">
            <Bookmark className="h-3.5 w-3.5 text-amber-500" />
            <span>Curated Knowledge</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Saved Academic Answers
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Access verified answers, official policy excerpts, and citations bookmarked for revision.
          </p>
        </div>

        <Link
          to="/chat"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-academic-600 hover:bg-academic-700 text-white font-semibold text-xs shadow-md transition-all"
        >
          <Sparkles className="h-4 w-4" />
          <span>Ask Assistant</span>
        </Link>
      </div>

      {savedAnswers.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900">
          <Bookmark className="h-10 w-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No saved answers yet</p>
          <p className="text-xs text-slate-400 mt-1">You can bookmark answers during chat sessions.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {savedAnswers.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900 shadow-sm"
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="font-semibold text-sm text-slate-900 dark:text-white">
                  {item.topic}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">{item.date}</span>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-3 italic">
                <MessageSquare className="h-3.5 w-3.5 text-academic-500" />
                <span>"{item.query}"</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-navy-950/70 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed mb-3">
                {item.snippet}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs text-slate-500 border-t border-slate-100 dark:border-slate-800/80">
                <span className="font-medium">
                  Verified Source: <strong className="text-slate-800 dark:text-slate-200">{item.source}</strong> (Page {item.page})
                </span>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleCopy(item.id, item.snippet)}
                    className="flex items-center gap-1 text-slate-600 dark:text-slate-400 hover:text-academic-600 transition-colors"
                  >
                    {copiedId === item.id ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copiedId === item.id ? 'Copied' : 'Copy'}</span>
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="flex items-center gap-1 text-slate-400 hover:text-rose-500 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
