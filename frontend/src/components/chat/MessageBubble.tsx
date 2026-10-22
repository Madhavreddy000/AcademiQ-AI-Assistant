import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Message, Citation } from '../../types';
import { CitationCard } from './CitationCard';
import { 
  ShieldCheck, 
  AlertTriangle, 
  ThumbsUp, 
  ThumbsDown, 
  Copy, 
  Check, 
  RotateCcw, 
  Bot, 
  User as UserIcon, 
  Layers,
  Sparkles
} from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
  isStreaming?: boolean;
  onRegenerate?: (messageId: string | number) => void;
  onFeedback?: (messageId: string | number, rating: 'THUMBS_UP' | 'THUMBS_DOWN', comment?: string) => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isStreaming = false,
  onRegenerate,
  onFeedback,
}) => {
  const isUser = message.sender === 'USER';
  const [copied, setCopied] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState<'THUMBS_UP' | 'THUMBS_DOWN' | null>(
    message.feedback?.rating || null
  );
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackComment, setFeedbackComment] = useState('');

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRating = (rating: 'THUMBS_UP' | 'THUMBS_DOWN') => {
    setFeedbackRating(rating);
    if (rating === 'THUMBS_DOWN') {
      setShowFeedbackModal(true);
    } else {
      onFeedback?.(message.id, rating);
    }
  };

  const handleFeedbackSubmit = () => {
    if (feedbackRating) {
      onFeedback?.(message.id, feedbackRating, feedbackComment);
      setShowFeedbackModal(false);
      setFeedbackComment('');
    }
  };

  if (isUser) {
    return (
      <div className="flex justify-end my-4 animate-fade-in">
        <div className="flex items-start gap-3 max-w-[85%] sm:max-w-[75%] flex-row-reverse">
          <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-slate-700 to-slate-900 dark:from-slate-600 dark:to-slate-800 flex items-center justify-center text-white shrink-0 shadow-sm">
            <UserIcon className="h-4 w-4" />
          </div>
          <div className="bg-academic-600 text-white rounded-2xl rounded-tr-sm px-4 py-3 shadow-md">
            <p className="text-sm font-normal leading-relaxed whitespace-pre-wrap">
              {message.content}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start my-4 animate-fade-in">
      <div className="flex items-start gap-3 max-w-[95%] sm:max-w-[88%] w-full">
        {/* Assistant Avatar */}
        <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-academic-600 via-academic-500 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-glow mt-1">
          <Bot className="h-4 w-4" />
        </div>

        {/* Message Container */}
        <div className="flex-1 bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-2xl rounded-tl-sm p-4 sm:p-5 shadow-glass dark:shadow-glass-dark">
          {/* Header Status Badges */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-2.5 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-xs text-slate-800 dark:text-slate-200">
                Academic Assistant
              </span>
              {message.isRagGrounded && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 text-emerald-700 dark:text-emerald-300 text-[10px] font-semibold tracking-wide">
                  <ShieldCheck className="h-3 w-3 text-emerald-500" />
                  Official Document Grounded
                </span>
              )}
              {message.isUnverified && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 text-[10px] font-semibold">
                  <AlertTriangle className="h-3 w-3 text-amber-500" />
                  General AI Context
                </span>
              )}
            </div>

            {/* Model & Latency Telemetry */}
            {message.modelUsed && (
              <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                <span>{message.modelUsed}</span>
                {message.latencyMs && <span>• {message.latencyMs}ms</span>}
              </div>
            )}
          </div>

          {/* Formatted Markdown Content */}
          <div className="prose-academic">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {message.content}
            </ReactMarkdown>
            {isStreaming && <span className="streaming-cursor text-academic-500" />}
          </div>

          {/* Source Citations Section */}
          {message.citations && message.citations.length > 0 && (
            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 mb-2.5">
                <Layers className="h-3.5 w-3.5 text-academic-500" />
                <span>Verified Source Citations ({message.citations.length})</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {message.citations.map((citation, idx) => (
                  <CitationCard key={citation.id || idx} citation={citation} index={idx} />
                ))}
              </div>
            </div>
          )}

          {/* Bottom Actions Bar */}
          {!isStreaming && (
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/60 text-xs text-slate-500">
              <div className="flex items-center gap-1 sm:gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 px-2 py-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="Copy answer to clipboard"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                  <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
                </button>

                {onRegenerate && (
                  <button
                    onClick={() => onRegenerate(message.id)}
                    className="flex items-center gap-1 px-2 py-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Regenerate this response"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Regenerate</span>
                  </button>
                )}
              </div>

              {/* Feedback Thumbs */}
              <div className="flex items-center gap-1">
                <span className="text-[11px] text-slate-400 mr-1 hidden sm:inline">Helpful?</span>
                <button
                  onClick={() => handleRating('THUMBS_UP')}
                  className={`p-1.5 rounded-md transition-colors ${
                    feedbackRating === 'THUMBS_UP'
                      ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400'
                  }`}
                  title="Accurate and helpful"
                >
                  <ThumbsUp className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => handleRating('THUMBS_DOWN')}
                  className={`p-1.5 rounded-md transition-colors ${
                    feedbackRating === 'THUMBS_DOWN'
                      ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400'
                  }`}
                  title="Inaccurate or incomplete"
                >
                  <ThumbsDown className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Negative Feedback Modal Dialog */}
          {showFeedbackModal && (
            <div className="mt-3 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-navy-950 text-xs">
              <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">
                Help improve official academic retrieval
              </p>
              <textarea
                placeholder="What was inaccurate or missing? (e.g. outdated syllabus clause, incorrect page citation...)"
                value={feedbackComment}
                onChange={(e) => setFeedbackComment(e.target.value)}
                rows={2}
                className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-academic-500"
              />
              <div className="flex justify-end gap-2 mt-2">
                <button
                  onClick={() => setShowFeedbackModal(false)}
                  className="px-2.5 py-1 rounded-md text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleFeedbackSubmit}
                  className="px-3 py-1 rounded-md bg-academic-600 text-white font-medium hover:bg-academic-700"
                >
                  Submit Feedback
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
