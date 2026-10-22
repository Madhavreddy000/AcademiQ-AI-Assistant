import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  User, 
  Mail, 
  GraduationCap, 
  Hash, 
  Sliders, 
  Database, 
  Cpu, 
  Save, 
  Check, 
  ShieldCheck,
  Moon,
  Sun
} from 'lucide-react';

import { DepartmentCode, DEPARTMENTS, getYearFromSemester, getYearLabel } from '../types';

export const ProfilePage: React.FC = () => {
  const { user, updateUserProfile } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [fullName, setFullName] = useState(user?.fullName || 'Alex Johnson');
  const [departmentCode, setDepartmentCode] = useState<DepartmentCode>(user?.departmentCode || 'CSE');
  const [semester, setSemester] = useState(user?.currentSemester?.toString() || '4');
  const [topK, setTopK] = useState(5);
  const [similarityThreshold, setSimilarityThreshold] = useState(0.72);
  const [temperature, setTemperature] = useState(0.2);
  const [llmProvider, setLlmProvider] = useState('spring-ai-hosted');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      fullName,
      departmentCode,
      currentSemester: Number(semester),
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Student Profile & Academic Settings
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Segregate your profile by department and active semester to receive targeted course materials and accurate RAG answers.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Card */}
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <User className="h-4 w-4 text-academic-500" />
              Academic Identity & Department
            </h2>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                {departmentCode}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                {getYearLabel(getYearFromSemester(Number(semester)))} (Sem {semester})
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Full Legal Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-academic-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                University Email Address
              </label>
              <input
                type="email"
                disabled
                value={user?.email || 'student@university.edu'}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/60 text-slate-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Academic Department
              </label>
              <select
                value={departmentCode}
                onChange={(e) => setDepartmentCode(e.target.value as DepartmentCode)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-academic-500 font-semibold"
              >
                {DEPARTMENTS.map((dept) => (
                  <option key={dept.code} value={dept.code}>
                    {dept.code} — {dept.fullName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Active Semester (1 to 8)
              </label>
              <select
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-academic-500 font-semibold"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                  <option key={s} value={s}>
                    Semester {s} • {getYearLabel(getYearFromSemester(s))}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* RAG Engine Parameters */}
        <div id="settings" className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Sliders className="h-4 w-4 text-indigo-500" />
              Retrieval-Augmented Generation (RAG) Calibration
            </h2>
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
              <Database className="h-3 w-3" /> Qdrant Vector DB Active
            </span>
          </div>

          <div className="space-y-5">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  Top-K Retrieved Chunks: <strong className="text-academic-600">{topK}</strong>
                </span>
                <span className="text-slate-400 text-[11px]">Recommended: 4 to 6</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={topK}
                onChange={(e) => setTopK(Number(e.target.value))}
                className="w-full accent-academic-600"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  Cosine Similarity Threshold: <strong className="text-academic-600">{similarityThreshold}</strong>
                </span>
                <span className="text-slate-400 text-[11px]">Recommended: 0.70</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="0.95"
                step="0.01"
                value={similarityThreshold}
                onChange={(e) => setSimilarityThreshold(Number(e.target.value))}
                className="w-full accent-academic-600"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  LLM Temperature (Creativity vs Strict Grounding): <strong className="text-academic-600">{temperature}</strong>
                </span>
                <span className="text-slate-400 text-[11px]">Recommended: 0.1 – 0.3 for regulatory accuracy</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="1.0"
                step="0.05"
                value={temperature}
                onChange={(e) => setTemperature(Number(e.target.value))}
                className="w-full accent-academic-600"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  LLM Provider Abstraction
                </label>
                <select
                  value={llmProvider}
                  onChange={(e) => setLlmProvider(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-academic-500"
                >
                  <option value="spring-ai-hosted">Spring AI: Hosted Model (OpenAI gpt-4o / 3.5)</option>
                  <option value="spring-ai-ollama">Spring AI: Local Ollama (llama3.1 / mistral)</option>
                  <option value="spring-ai-azure">Spring AI: Azure OpenAI Enterprise</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Theme Appearance
                </label>
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-navy-950 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <span>Active Theme: {theme === 'dark' ? 'Sleek Dark Mode' : 'Clean Light Mode'}</span>
                  {theme === 'dark' ? <Moon className="h-4 w-4 text-academic-400" /> : <Sun className="h-4 w-4 text-amber-500" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3">
          {savedSuccess && (
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 animate-fade-in">
              <Check className="h-4 w-4" /> Preferences saved!
            </span>
          )}
          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-academic-600 hover:bg-academic-700 text-white font-semibold text-xs shadow-md transition-all active:scale-[0.98]"
          >
            <Save className="h-4 w-4" />
            <span>Save Preferences</span>
          </button>
        </div>
      </form>
    </div>
  );
};
