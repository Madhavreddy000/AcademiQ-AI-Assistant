export type UserRole = 'STUDENT' | 'FACULTY';

export type AIProvider = 'gemini' | 'openai' | 'groq' | 'local-rag';

export interface AISettings {
  provider: AIProvider;
  apiKey: string;
  model: string;
  temperature: number;
  topK: number;
}

export type DepartmentCode = 'CSE' | 'ECE' | 'EEE' | 'AIML' | 'DS' | 'MECH' | 'CIVIL';

export interface DepartmentInfo {
  code: DepartmentCode;
  name: string;
  fullName: string;
  icon?: string;
  color?: string;
}

export const DEPARTMENTS: DepartmentInfo[] = [
  { code: 'CSE', name: 'CSE', fullName: 'Computer Science & Engineering', color: 'indigo' },
  { code: 'ECE', name: 'ECE', fullName: 'Electronics & Communication Engineering', color: 'blue' },
  { code: 'EEE', name: 'EEE', fullName: 'Electrical & Electronics Engineering', color: 'amber' },
  { code: 'AIML', name: 'AIML', fullName: 'Artificial Intelligence & Machine Learning', color: 'purple' },
  { code: 'DS', name: 'DS', fullName: 'Data Science', color: 'cyan' },
  { code: 'MECH', name: 'MECH', fullName: 'Mechanical Engineering', color: 'orange' },
  { code: 'CIVIL', name: 'CIVIL', fullName: 'Civil Engineering', color: 'emerald' },
];

export const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8] as const;
export type SemesterNumber = typeof SEMESTERS[number];

export function getYearFromSemester(sem: number): number {
  if (sem <= 2) return 1;
  if (sem <= 4) return 2;
  if (sem <= 6) return 3;
  return 4;
}

export function getYearLabel(year: number): string {
  switch (year) {
    case 1: return '1st Year';
    case 2: return '2nd Year';
    case 3: return '3rd Year';
    case 4: return '4th Year';
    default: return 'All Years';
  }
}

export interface User {
  id: number;
  email: string;
  fullName: string;
  role: UserRole;
  departmentId?: number;
  departmentCode?: DepartmentCode;
  departmentName?: string;
  currentSemester?: number;
  academicYearNumber?: number;
  studentIdNumber?: string;
  avatarUrl?: string;
  token?: string;
}

export interface Department {
  id: number;
  code: string;
  name: string;
  description?: string;
}

export interface Course {
  id: number;
  departmentId: number;
  code: string;
  name: string;
  degreeLevel: string;
  totalSemesters: number;
  credits: number;
  description?: string;
}

export interface Subject {
  id: number;
  courseId: number;
  code: string;
  title: string;
  semester: number;
  credits: number;
  syllabusSummary?: string;
}

export type DocumentCategory = 'REGULATION' | 'SYLLABUS' | 'EXAM' | 'HANDBOOK' | 'COURSE_MATERIAL';
export type DocumentStatus = 'PENDING' | 'PROCESSING' | 'INDEXED' | 'FAILED';
export type AccessLevel = 'PUBLIC' | 'STUDENT' | 'FACULTY';

export interface AcademicDocument {
  id: number;
  title: string;
  fileName: string;
  fileType: 'PDF' | 'DOCX' | 'TXT';
  fileSizeBytes: number;
  category: DocumentCategory;
  departmentId?: number;
  departmentCode?: DepartmentCode | 'ALL';
  courseId?: number;
  semester?: number;
  targetYear?: number; // 0 for All, 1, 2, 3, 4
  targetSemester?: number; // 0 for All, 1 to 8
  academicYear: string;
  accessLevel: AccessLevel;
  status: DocumentStatus;
  errorMessage?: string;
  chunkCount: number;
  totalPages: number;
  uploadedBy?: number;
  uploaderName?: string;
  version: number;
  extractedText?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Citation {
  id: number;
  messageId: number;
  documentId?: number;
  documentTitle: string;
  pageNumber: number;
  snippet: string;
  relevanceScore: number;
}

export interface Feedback {
  id?: number;
  messageId: number;
  userId: number;
  rating: 'THUMBS_UP' | 'THUMBS_DOWN';
  comment?: string;
}

export interface Message {
  id: string | number;
  conversationId: number;
  sender: 'USER' | 'ASSISTANT' | 'SYSTEM';
  content: string;
  isRagGrounded: boolean;
  isUnverified?: boolean;
  modelUsed?: string;
  promptTokens?: number;
  completionTokens?: number;
  latencyMs?: number;
  createdAt: string;
  citations?: Citation[];
  feedback?: Feedback;
}

export interface Conversation {
  id: number;
  userId: number;
  title: string;
  pinned: boolean;
  academicContextDeptId?: number;
  academicContextCourseId?: number;
  createdAt: string;
  updatedAt: string;
  messages?: Message[];
}

export interface IngestionJob {
  id: number;
  documentId: number;
  documentTitle?: string;
  status: 'QUEUED' | 'EXTRACTING' | 'CHUNKING' | 'EMBEDDING' | 'COMPLETED' | 'FAILED';
  progressPercent: number;
  logDetails?: string;
  startedAt?: string;
  finishedAt?: string;
  createdAt: string;
}

export interface AdminStats {
  totalDocuments: number;
  totalChunks: number;
  totalQueries: number;
  activeUsers: number;
  vectorIndexedCount: number;
  accuracyRate: number;
}
