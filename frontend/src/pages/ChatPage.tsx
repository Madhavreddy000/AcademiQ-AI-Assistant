import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Conversation, Message, Citation, AcademicDocument, getYearLabel } from '../types';
import { chatService } from '../services/chatService';
import { academicService } from '../services/academicService';
import { Sidebar } from '../components/common/Sidebar';
import { MessageBubble } from '../components/chat/MessageBubble';
import { ChatInput } from '../components/chat/ChatInput';
import { QuickActionCards } from '../components/chat/QuickActionCards';
import { 
  Sparkles, 
  GraduationCap, 
  CheckCircle2, 
  Layers,
  FileCheck2,
  BookOpen
} from 'lucide-react';

export const ChatPage: React.FC = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<number | undefined>(undefined);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [attachedFileText, setAttachedFileText] = useState<string>('');
  const [availableDocs, setAvailableDocs] = useState<AcademicDocument[]>([]);
  const [selectedDocId, setSelectedDocId] = useState<number | undefined>(undefined);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const abortControllerRef = useRef<AbortController | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load conversations and available academic documents on mount
  useEffect(() => {
    loadConversations();
    loadDocuments();
  }, []);

  // Parse docId from URL query parameter if present
  useEffect(() => {
    const urlDocId = searchParams.get('docId');
    if (urlDocId) {
      const parsed = parseInt(urlDocId, 10);
      if (!isNaN(parsed)) {
        setSelectedDocId(parsed);
      }
    }
  }, [searchParams]);

  const loadDocuments = async () => {
    try {
      const docs = await academicService.getDocuments();
      setAvailableDocs(docs);
    } catch (e) {
      console.error('Failed to load documents for chat focus', e);
    }
  };

  const loadConversations = async () => {
    try {
      const convos = await chatService.getConversations();
      setConversations(convos);
      if (convos.length > 0 && !activeConversationId) {
        selectConversation(convos[0].id);
      }
    } catch (e) {
      console.error('Failed to load conversations', e);
    }
  };

  const selectConversation = async (id: number) => {
    setActiveConversationId(id);
    setLoadingHistory(true);
    try {
      const convo = await chatService.getConversation(id);
      setActiveConversation(convo);
      setMessages(convo.messages || []);
    } catch (e) {
      console.error('Failed to get conversation', e);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleNewConversation = async () => {
    try {
      const newConvo = await chatService.createConversation('New Academic Query');
      setConversations([newConvo, ...conversations]);
      setActiveConversationId(newConvo.id);
      setActiveConversation(newConvo);
      setMessages([]);
    } catch (e) {
      console.error('Failed to create new conversation', e);
    }
  };

  const handleDeleteConversation = async (id: number) => {
    try {
      await chatService.deleteConversation(id);
      const remaining = conversations.filter((c) => c.id !== id);
      setConversations(remaining);
      if (activeConversationId === id) {
        if (remaining.length > 0) {
          selectConversation(remaining[0].id);
        } else {
          setActiveConversationId(undefined);
          setActiveConversation(null);
          setMessages([]);
        }
      }
    } catch (e) {
      console.error('Failed to delete conversation', e);
    }
  };

  // Handle file selection and extract text for AI analysis
  const handleFileChange = (file: File | null) => {
    setSelectedFile(file);
    if (!file) {
      setAttachedFileText('');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const rawText = e.target?.result;
      if (typeof rawText === 'string') {
        if (file.name.endsWith('.pdf')) {
          // Clean printable text from PDF stream
          const cleaned = rawText
            .replace(/[^\x20-\x7E\t\r\n]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
          setAttachedFileText(cleaned || `[File Content Extracted from: ${file.name}]`);
        } else {
          setAttachedFileText(rawText);
        }
      }
    };
    reader.readAsText(file);
  };

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isStreaming]);

  // Send message
  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() && !selectedFile && !selectedDocId) return;

    let convoId = activeConversationId;
    if (!convoId) {
      const titlePrompt = query || (selectedFile ? selectedFile.name : 'Document Query');
      const newConvo = await chatService.createConversation(
        titlePrompt.slice(0, 35) + (titlePrompt.length > 35 ? '...' : '')
      );
      setConversations([newConvo, ...conversations]);
      setActiveConversationId(newConvo.id);
      setActiveConversation(newConvo);
      convoId = newConvo.id;
    }

    const focusedDoc = availableDocs.find((d) => d.id === selectedDocId);

    // 1. Add user message
    let displayContent = query || `Please analyze this document in detail and summarize the key units and regulations.`;
    if (selectedFile) {
      displayContent += `\n\n📄 **Attached Document:** \`${selectedFile.name}\` (${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)`;
    }
    if (focusedDoc) {
      displayContent += `\n\n🎯 **Focused Course Document:** \`${focusedDoc.title}\` (${focusedDoc.departmentCode || 'ALL'} • Sem ${focusedDoc.targetSemester || focusedDoc.semester || 'All'})`;
    }

    const userMessage: Message = {
      id: 'usr-' + Date.now(),
      conversationId: convoId,
      sender: 'USER',
      content: displayContent,
      isRagGrounded: false,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    const currentAttachedText = attachedFileText;
    const currentAttachedFileName = selectedFile?.name;
    const currentSelectedDocId = selectedDocId;

    setSelectedFile(null);
    setAttachedFileText('');
    setIsStreaming(true);

    // 2. Prepare streaming assistant placeholder
    const assistantMessageId = 'ast-' + Date.now();
    const assistantMessage: Message = {
      id: assistantMessageId,
      conversationId: convoId,
      sender: 'ASSISTANT',
      content: '',
      isRagGrounded: true,
      modelUsed: 'Google-Gemini-Live-RAG',
      latencyMs: 650,
      createdAt: new Date().toISOString(),
      citations: [],
    };

    setMessages((prev) => [...prev, assistantMessage]);

    // Setup abort controller
    const controller = new AbortController();
    abortControllerRef.current = controller;

    // 3. Initiate SSE / Gemini Streaming
    await chatService.streamMessage({
      conversationId: convoId,
      content: query || 'Analyze and summarize this document.',
      attachedFileText: currentAttachedText,
      attachedFileName: currentAttachedFileName,
      selectedDocId: currentSelectedDocId,
      departmentCode: user?.departmentCode,
      semester: user?.currentSemester,
      abortSignal: controller.signal,
      onChunk: (chunk) => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? { ...msg, content: msg.content + chunk }
              : msg
          )
        );
      },
      onCitations: (citations) => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? { ...msg, citations: citations, isRagGrounded: citations.length > 0 }
              : msg
          )
        );
      },
      onComplete: (fullText, citations) => {
        setIsStreaming(false);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? { ...msg, content: fullText, citations: citations }
              : msg
          )
        );
      },
      onError: (err) => {
        console.error('Stream error', err);
        setIsStreaming(false);
      },
    });
  };

  const handleStopGenerating = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsStreaming(false);
    }
  };

  const handleRegenerate = (messageId: string | number) => {
    const idx = messages.findIndex((m) => m.id === messageId);
    if (idx > 0 && messages[idx - 1].sender === 'USER') {
      const userText = messages[idx - 1].content;
      handleSendMessage(userText);
    }
  };

  const handleFeedback = (
    messageId: string | number,
    rating: 'THUMBS_UP' | 'THUMBS_DOWN',
    comment?: string
  ) => {
    chatService.submitFeedback(messageId, rating, comment);
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, feedback: { messageId: Number(messageId), userId: user?.id || 1, rating, comment } } : msg
      )
    );
  };

  const activeFocusedDoc = availableDocs.find((d) => d.id === selectedDocId);

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-slate-50 dark:bg-navy-950 overflow-hidden">
      {/* Sidebar with conversation history */}
      <Sidebar
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={selectConversation}
        onNewConversation={handleNewConversation}
        onDeleteConversation={handleDeleteConversation}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
      />

      {/* Main Chat Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Chat Scroll View */}
        <div className="flex-1 overflow-y-auto px-4 py-6 scroll-smooth">
          {messages.length === 0 ? (
            /* Welcome Hero View when conversation is empty */
            <div className="max-w-4xl mx-auto pt-4 pb-12 text-center animate-fade-in">
              <div className="inline-flex h-14 w-14 rounded-2xl bg-gradient-to-tr from-academic-600 via-academic-500 to-indigo-600 items-center justify-center text-white shadow-glow mb-3">
                <GraduationCap className="h-8 w-8" />
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Academic AI Assistant
              </h1>

              {/* Department & Student Profile Segregation Card */}
              <div className="mt-2 inline-flex flex-wrap items-center justify-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 shadow-xs text-xs">
                <span className="font-bold text-slate-900 dark:text-white">
                  Student: {user?.fullName || 'Alex Johnson'}
                </span>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <span className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 font-extrabold text-[11px]">
                  {user?.departmentCode || 'CSE'} Department
                </span>
                <span className="px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 font-semibold text-[11px]">
                  {getYearLabel(user?.academicYearNumber || 2)} • Semester {user?.currentSemester || 4}
                </span>
              </div>

              <p className="mt-3 text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
                Ask any question regarding your branch's syllabus, lecture notes, grading schemes, or attach a PDF / DOC document to analyze.
              </p>

              {/* Active Grounding Indicators */}
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  <span>Google Gemini Live Streaming Active</span>
                </div>

                {activeFocusedDoc && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-[11px] font-semibold text-purple-700 dark:text-purple-300">
                    <BookOpen className="h-3.5 w-3.5 text-purple-500" />
                    <span>Focusing: {activeFocusedDoc.title}</span>
                  </div>
                )}
              </div>

              {/* 1-Click Quick Action Cards */}
              <QuickActionCards onSelectPrompt={(p) => handleSendMessage(p)} />
            </div>
          ) : (
            /* Message List */
            <div className="max-w-4xl mx-auto space-y-4">
              {messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  isStreaming={isStreaming && message.id === messages[messages.length - 1].id}
                  onRegenerate={handleRegenerate}
                  onFeedback={handleFeedback}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Floating Chat Input Box */}
        <div className="bg-gradient-to-t from-slate-50 dark:from-navy-950 via-slate-50/90 dark:via-navy-950/90 to-transparent pt-4">
          <ChatInput
            input={input}
            setInput={setInput}
            onSubmit={() => handleSendMessage()}
            isStreaming={isStreaming}
            onStop={handleStopGenerating}
            selectedFile={selectedFile}
            setSelectedFile={handleFileChange}
            availableDocs={availableDocs}
            selectedDocId={selectedDocId}
            onSelectDocId={setSelectedDocId}
            departmentCode={user?.departmentCode}
            semester={user?.currentSemester}
          />
        </div>
      </main>
    </div>
  );
};

