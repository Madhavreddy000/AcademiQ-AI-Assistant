import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Conversation } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { 
  Plus, 
  MessageSquare, 
  Pin, 
  Trash2, 
  Search, 
  BookOpen, 
  Bookmark, 
  Settings, 
  FileText,
  ChevronLeft,
  ChevronRight,
  Upload
} from 'lucide-react';

interface SidebarProps {
  conversations: Conversation[];
  activeConversationId?: number;
  onSelectConversation: (id: number) => void;
  onNewConversation: () => void;
  onDeleteConversation: (id: number) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  isCollapsed = false,
  onToggleCollapse,
}) => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const location = useLocation();

  const filtered = conversations.filter((c) =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pinnedConversations = filtered.filter((c) => c.pinned);
  const recentConversations = filtered.filter((c) => !c.pinned);

  return (
    <aside
      className={`relative flex flex-col h-[calc(100vh-4rem)] border-r border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-navy-900/60 backdrop-blur-md transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-72'
      }`}
    >
      {/* Collapse Toggle Button */}
      {onToggleCollapse && (
        <button
          onClick={onToggleCollapse}
          className="absolute -right-3 top-6 z-20 flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-navy-800 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white shadow-sm"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
        </button>
      )}

      {/* Top Action: New Chat */}
      <div className="p-3">
        <button
          onClick={onNewConversation}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-gradient-to-r from-academic-600 to-indigo-600 hover:from-academic-700 hover:to-indigo-700 text-white font-medium text-sm shadow-md transition-all hover:shadow-glow active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" />
          {!isCollapsed && <span>New Academic Query</span>}
        </button>

        {/* Search Conversations Input */}
        {!isCollapsed && (
          <div className="relative mt-2.5">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search chat history..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-navy-950/50 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-academic-500"
            />
          </div>
        )}
      </div>

      {/* Scrollable Conversation List */}
      <div className="flex-1 overflow-y-auto px-2 py-1 space-y-4">
        {/* Pinned Section */}
        {pinnedConversations.length > 0 && !isCollapsed && (
          <div>
            <div className="flex items-center gap-1 px-2 mb-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              <Pin className="h-3 w-3 text-academic-500" />
              <span>Pinned Topics</span>
            </div>
            <div className="space-y-0.5">
              {pinnedConversations.map((convo) => (
                <div
                  key={convo.id}
                  className={`group relative flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                    activeConversationId === convo.id
                      ? 'bg-academic-50 dark:bg-academic-950/60 text-academic-700 dark:text-academic-300 border border-academic-200 dark:border-academic-800'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                  onClick={() => onSelectConversation(convo.id)}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <MessageSquare className="h-3.5 w-3.5 shrink-0 text-academic-500" />
                    <span className="truncate">{convo.title}</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteConversation(convo.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-500 rounded transition-opacity"
                    title="Delete chat"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Conversations */}
        <div>
          {!isCollapsed && (
            <div className="px-2 mb-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Recent Queries
            </div>
          )}
          <div className="space-y-0.5">
            {recentConversations.length === 0 ? (
              !isCollapsed && (
                <p className="px-2 py-3 text-xs text-slate-400 text-center italic">
                  No conversations found
                </p>
              )
            ) : (
              recentConversations.map((convo) => (
                <div
                  key={convo.id}
                  className={`group relative flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                    activeConversationId === convo.id
                      ? 'bg-academic-50 dark:bg-academic-950/60 text-academic-700 dark:text-academic-300 border border-academic-200 dark:border-academic-800'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                  onClick={() => onSelectConversation(convo.id)}
                  title={convo.title}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <MessageSquare className="h-3.5 w-3.5 shrink-0 text-slate-400 group-hover:text-academic-500" />
                    {!isCollapsed && <span className="truncate">{convo.title}</span>}
                  </div>
                  {!isCollapsed && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteConversation(convo.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-500 rounded transition-opacity"
                      title="Delete chat"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Bottom Academic Utility Links */}
      <div className="p-2 border-t border-slate-200 dark:border-slate-800 space-y-0.5">
        {user?.role === 'FACULTY' && (
          <Link
            to="/faculty/upload"
            className={`flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-medium transition-colors ${
              location.pathname === '/faculty/upload'
                ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold'
                : 'text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30'
            }`}
            title="Upload Course Materials"
          >
            <Upload className="h-4 w-4 text-indigo-500 shrink-0" />
            {!isCollapsed && <span>Upload Course Data</span>}
          </Link>
        )}

        <Link
          to="/resources"
          className={`flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-medium transition-colors ${
            location.pathname === '/resources'
              ? 'bg-slate-100 dark:bg-slate-800 text-academic-600 dark:text-academic-400'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
          title="Academic Resources Library"
        >
          <BookOpen className="h-4 w-4 text-emerald-500 shrink-0" />
          {!isCollapsed && <span>Course Materials</span>}
        </Link>

        <Link
          to="/documents"
          className={`flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-medium transition-colors ${
            location.pathname === '/documents'
              ? 'bg-slate-100 dark:bg-slate-800 text-academic-600 dark:text-academic-400'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
          title="Document Viewer & Search"
        >
          <FileText className="h-4 w-4 text-indigo-500 shrink-0" />
          {!isCollapsed && <span>Document Viewer</span>}
        </Link>

        <Link
          to="/saved"
          className={`flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-medium transition-colors ${
            location.pathname === '/saved'
              ? 'bg-slate-100 dark:bg-slate-800 text-academic-600 dark:text-academic-400'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
          title="Saved Answers"
        >
          <Bookmark className="h-4 w-4 text-amber-500 shrink-0" />
          {!isCollapsed && <span>Saved Answers</span>}
        </Link>

        <Link
          to="/profile#settings"
          className={`flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-medium transition-colors ${
            location.pathname.includes('/profile')
              ? 'bg-slate-100 dark:bg-slate-800 text-academic-600 dark:text-academic-400'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
          title="Assistant Settings"
        >
          <Settings className="h-4 w-4 text-slate-400 shrink-0" />
          {!isCollapsed && <span>Assistant Settings</span>}
        </Link>
      </div>
    </aside>
  );
};
