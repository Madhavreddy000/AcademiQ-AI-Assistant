import React, { useRef, useEffect, useState } from 'react';
import { Send, Square, Paperclip, Sparkles, X, FileText, ChevronDown, Check, BookOpen, Layers } from 'lucide-react';
import { AcademicDocument } from '../../types';

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  onSubmit: () => void;
  isStreaming: boolean;
  onStop: () => void;
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
  availableDocs?: AcademicDocument[];
  selectedDocId?: number;
  onSelectDocId?: (id: number | undefined) => void;
  placeholder?: string;
  departmentCode?: string;
  semester?: number;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  input,
  setInput,
  onSubmit,
  isStreaming,
  onStop,
  selectedFile,
  setSelectedFile,
  availableDocs = [],
  selectedDocId,
  onSelectDocId,
  placeholder = 'Ask any question about university policies, syllabus, examinations...',
  departmentCode,
  semester,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showDocPicker, setShowDocPicker] = useState(false);

  const selectedDoc = availableDocs.find((d) => d.id === selectedDocId);

  // Auto-resize textarea height up to 180px
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isStreaming && (input.trim() || selectedFile || selectedDocId)) {
        onSubmit();
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Max 25MB check
      if (file.size > 25 * 1024 * 1024) {
        alert('File size exceeds maximum permitted limit of 25MB.');
        return;
      }
      setSelectedFile(file);
    }
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto px-4 pb-4">
      {/* Active Document / Attached File Chips */}
      <div className="mb-2 flex flex-wrap items-center gap-2">
        {/* Selected Faculty Document Pill */}
        {selectedDoc && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-xs text-purple-800 dark:text-purple-200 shadow-xs animate-fade-in">
            <BookOpen className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400 shrink-0" />
            <span className="font-semibold truncate max-w-xs">
              Focused on: {selectedDoc.title}
            </span>
            <span className="px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-900 text-[10px] font-bold">
              {selectedDoc.departmentCode || 'ALL'}
            </span>
            {onSelectDocId && (
              <button
                type="button"
                onClick={() => onSelectDocId(undefined)}
                className="p-0.5 hover:text-rose-500 rounded transition-colors"
                title="Clear document focus"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        )}

        {/* Attached Uploaded File Pill */}
        {selectedFile && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-academic-50 dark:bg-academic-950/60 border border-academic-200 dark:border-academic-800 text-xs text-academic-700 dark:text-academic-300 shadow-xs animate-fade-in">
            <Paperclip className="h-3.5 w-3.5 shrink-0 text-academic-600" />
            <span className="font-semibold truncate max-w-xs">{selectedFile.name}</span>
            <span className="text-[10px] text-slate-500">
              ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Ready for AI RAG)
            </span>
            <button
              type="button"
              onClick={() => setSelectedFile(null)}
              className="p-0.5 hover:text-rose-500 rounded transition-colors"
              title="Remove attachment"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Main Input Box */}
      <div className="relative flex items-end gap-2 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900 shadow-glass dark:shadow-glass-dark focus-within:border-academic-500 dark:focus-within:border-academic-500 focus-within:ring-2 focus-within:ring-academic-500/20 transition-all">
        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".pdf,.docx,.txt"
          className="hidden"
        />

        {/* Attachment Button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-2.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Upload & attach document to analyze (PDF, DOCX, TXT)"
        >
          <Paperclip className="h-4 w-4" />
        </button>

        {/* Document Focus Selector Trigger */}
        {availableDocs.length > 0 && onSelectDocId && (
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowDocPicker(!showDocPicker)}
              className={`p-2.5 rounded-xl text-xs flex items-center gap-1 transition-colors ${
                selectedDocId
                  ? 'bg-purple-100 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 font-bold'
                  : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title="Select a specific faculty course document or syllabus to query"
            >
              <Layers className="h-4 w-4" />
              <ChevronDown className="h-3 w-3" />
            </button>

            {/* Doc Picker Dropdown */}
            {showDocPicker && (
              <div className="absolute bottom-12 left-0 w-80 max-h-72 overflow-y-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900 shadow-xl p-2 z-50 animate-fade-in space-y-1">
                <div className="px-2 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span>Focus Course Document</span>
                  <button
                    onClick={() => setShowDocPicker(false)}
                    className="hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onSelectDocId(undefined);
                    setShowDocPicker(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                    !selectedDocId
                      ? 'bg-academic-50 dark:bg-academic-950 text-academic-700 dark:text-academic-300 font-semibold'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span>Auto-Search All Documents ({departmentCode || 'All Branches'})</span>
                  {!selectedDocId && <Check className="h-3.5 w-3.5 text-academic-600" />}
                </button>

                {availableDocs.map((doc) => {
                  const isSelected = selectedDocId === doc.id;
                  return (
                    <button
                      key={doc.id}
                      type="button"
                      onClick={() => {
                        onSelectDocId(doc.id);
                        setShowDocPicker(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-start justify-between gap-2 transition-colors ${
                        isSelected
                          ? 'bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-semibold'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="truncate flex-1">
                        <div className="font-medium truncate">{doc.title}</div>
                        <div className="text-[10px] text-slate-400">
                          {doc.departmentCode || 'ALL'} • {doc.category}
                        </div>
                      </div>
                      {isSelected && <Check className="h-3.5 w-3.5 text-purple-600 shrink-0 mt-0.5" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Text Area */}
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={1}
          className="flex-1 max-h-[180px] py-2 bg-transparent text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 resize-none focus:outline-none"
        />

        {/* Action Button: Send or Stop */}
        {isStreaming ? (
          <button
            type="button"
            onClick={onStop}
            className="p-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-sm transition-transform active:scale-95"
            title="Stop generating"
          >
            <Square className="h-4 w-4 fill-white" />
          </button>
        ) : (
          <button
            type="button"
            disabled={!input.trim() && !selectedFile && !selectedDocId}
            onClick={onSubmit}
            className={`p-2.5 rounded-xl transition-all ${
              input.trim() || selectedFile || selectedDocId
                ? 'bg-gradient-to-r from-academic-600 to-indigo-600 hover:from-academic-700 hover:to-indigo-700 text-white shadow-md shadow-academic-500/20 hover:scale-105 active:scale-95'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
            }`}
            title="Send query (Enter)"
          >
            <Send className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="flex items-center justify-between px-2 pt-2 text-[11px] text-slate-400">
        <span>Press <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-mono border border-slate-200 dark:border-slate-700">Enter</kbd> to send, <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-mono border border-slate-200 dark:border-slate-700">Shift + Enter</kbd> for new line</span>
        <span className="flex items-center gap-1 font-semibold text-slate-500 dark:text-slate-400">
          <Sparkles className="h-3 w-3 text-academic-500" />
          <span>
            {departmentCode ? `${departmentCode} Dept • Sem ${semester || 4}` : 'Grounded Academic RAG'}
          </span>
        </span>
      </div>
    </div>
  );
};

