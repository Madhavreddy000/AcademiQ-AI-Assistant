import React, { useState } from 'react';
import { Sparkles, Key, Check, X, ExternalLink, Cpu, ShieldCheck } from 'lucide-react';

interface AIModelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIModelModal: React.FC<AIModelModalProps> = ({ isOpen, onClose }) => {
  const DEFAULT_KEY = (import.meta as any).env?.VITE_GEMINI_API_KEY || '';

  const [provider, setProvider] = useState<'gemini' | 'openai' | 'local'>(() => {
    return (localStorage.getItem('academiq_ai_provider') as any) || 'gemini';
  });

  const [geminiKey, setGeminiKey] = useState(() => {
    return localStorage.getItem('academiq_gemini_key') || DEFAULT_KEY;
  });

  const [openaiKey, setOpenaiKey] = useState(() => {
    return localStorage.getItem('academiq_openai_key') || '';
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('academiq_ai_provider', provider);
    if (geminiKey.trim()) {
      localStorage.setItem('academiq_gemini_key', geminiKey.trim());
      localStorage.setItem('academiq_ai_api_key', geminiKey.trim());
    } else {
      localStorage.removeItem('academiq_gemini_key');
    }

    if (openaiKey.trim()) {
      localStorage.setItem('academiq_openai_key', openaiKey.trim());
    } else {
      localStorage.removeItem('academiq_openai_key');
    }

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900 shadow-glass-dark p-6">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-2.5 mb-4">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-academic-600 to-indigo-600 flex items-center justify-center text-white shadow-glow">
            <Cpu className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              AI Model & RAG Provider Settings
            </h2>
            <p className="text-xs text-slate-500">
              Select or connect any AI model to answer student questions from uploaded materials
            </p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          {/* Provider Selection Cards */}
          <div className="space-y-2">
            <label
              onClick={() => setProvider('local')}
              className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                provider === 'local'
                  ? 'border-academic-500 bg-academic-50/50 dark:bg-academic-950/40 ring-1 ring-academic-500'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              <input
                type="radio"
                name="provider"
                checked={provider === 'local'}
                onChange={() => setProvider('local')}
                className="mt-0.5"
              />
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  Built-In Dynamic Academic RAG (No API Key Required)
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Directly interrogates and cites all documents, handbooks, and syllabi uploaded by faculty. Zero setup required.
                </p>
              </div>
            </label>

            <label
              onClick={() => setProvider('gemini')}
              className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                provider === 'gemini'
                  ? 'border-academic-500 bg-academic-50/50 dark:bg-academic-950/40 ring-1 ring-academic-500'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              <input
                type="radio"
                name="provider"
                checked={provider === 'gemini'}
                onChange={() => setProvider('gemini')}
                className="mt-0.5"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-slate-900 dark:text-white">
                    Google Gemini 1.5 Flash (Recommended for Live AI)
                  </p>
                  <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded">
                    Free Tier Available
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Fast, intelligent reasoning grounded in uploaded course documents.
                </p>
              </div>
            </label>

            <label
              onClick={() => setProvider('openai')}
              className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                provider === 'openai'
                  ? 'border-academic-500 bg-academic-50/50 dark:bg-academic-950/40 ring-1 ring-academic-500'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              <input
                type="radio"
                name="provider"
                checked={provider === 'openai'}
                onChange={() => setProvider('openai')}
                className="mt-0.5"
              />
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  OpenAI (GPT-4o-mini / GPT-4o)
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Uses your OpenAI API key with system grounded RAG context.
                </p>
              </div>
            </label>
          </div>

          {/* API Key Inputs */}
          {provider === 'gemini' && (
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Key className="h-3.5 w-3.5 text-academic-500" />
                  Google Gemini API Key
                </label>
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[10px] font-semibold text-academic-600 hover:underline flex items-center gap-0.5"
                >
                  Get Free Key <ExternalLink className="h-2.5 w-2.5" />
                </a>
              </div>
              <input
                type="password"
                placeholder="AIzaSy..."
                value={geminiKey}
                onChange={(e) => setGeminiKey(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900 text-slate-900 dark:text-slate-100 font-mono focus:outline-none focus:ring-1 focus:ring-academic-500"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Your key is stored securely in your local browser storage and never sent to third-party servers.
              </p>
            </div>
          )}

          {provider === 'openai' && (
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-1.5">
                <Key className="h-3.5 w-3.5 text-academic-500" />
                OpenAI API Key
              </label>
              <input
                type="password"
                placeholder="sk-..."
                value={openaiKey}
                onChange={(e) => setOpenaiKey(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900 text-slate-900 dark:text-slate-100 font-mono focus:outline-none focus:ring-1 focus:ring-academic-500"
              />
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            {savedSuccess ? (
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <Check className="h-3.5 w-3.5" /> AI model preference saved!
              </span>
            ) : (
              <span className="text-[11px] text-slate-400">
                Grounds all answers on Faculty uploads
              </span>
            )}

            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-academic-600 hover:bg-academic-700 text-white font-semibold text-xs shadow-md transition-all active:scale-95"
            >
              Save AI Configuration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
