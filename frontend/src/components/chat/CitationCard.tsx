import React, { useState } from 'react';
import { Citation } from '../../types';
import { FileText, ExternalLink, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';

interface CitationCardProps {
  citation: Citation;
  index: number;
}

export const CitationCard: React.FC<CitationCardProps> = ({ citation, index }) => {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(citation.snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const matchPercent = Math.round((citation.relevanceScore || 0.85) * 100);

  return (
    <div className="border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-navy-900/60 rounded-xl overflow-hidden text-xs shadow-sm transition-all hover:border-academic-300 dark:hover:border-academic-700">
      {/* Header Summary */}
      <div
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between p-2.5 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 select-none"
      >
        <div className="flex items-center gap-2 min-w-0">
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-academic-100 dark:bg-academic-950 font-semibold text-[11px] text-academic-700 dark:text-academic-300 border border-academic-200 dark:border-academic-800">
            [{index + 1}]
          </span>
          <FileText className="h-4 w-4 text-slate-400 shrink-0" />
          <span className="font-medium text-slate-800 dark:text-slate-200 truncate max-w-[200px] sm:max-w-[260px]">
            {citation.documentTitle}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-medium text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
            Page {citation.pageNumber}
          </span>
          <span className="px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            {matchPercent}%
          </span>
          {expanded ? (
            <ChevronUp className="h-3.5 w-3.5 text-slate-400" />
          ) : (
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          )}
        </div>
      </div>

      {/* Expanded Excerpt Snippet */}
      {expanded && (
        <div className="px-3 pb-3 pt-1 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-navy-950/40">
          <p className="font-mono text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed italic bg-white dark:bg-navy-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
            "{citation.snippet}"
          </p>
          <div className="flex items-center justify-between mt-2 pt-1 text-[11px] text-slate-500">
            <span>Official University Document Source</span>
            <div className="flex items-center gap-3">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 hover:text-academic-600 dark:hover:text-academic-400 transition-colors"
              >
                {copied ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                <span>{copied ? 'Copied' : 'Copy Excerpt'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
