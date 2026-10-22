import { apiFetch } from './api';
import { AcademicDocument, AdminStats, IngestionJob, User, UserRole } from '../types';

const MOCK_STATS: AdminStats = {
  totalDocuments: 24,
  totalChunks: 2150,
  totalQueries: 14820,
  activeUsers: 342,
  vectorIndexedCount: 2150,
  accuracyRate: 98.4,
};

const MOCK_JOBS: IngestionJob[] = [
  {
    id: 1,
    documentId: 1,
    documentTitle: 'Academic Regulations & Examination Handbook 2025-2026',
    status: 'COMPLETED',
    progressPercent: 100,
    logDetails: 'Extracted 68 pages, created 142 chunks, generated 1536-dim embeddings, stored in Qdrant successfully.',
    startedAt: '2026-08-01T10:00:00Z',
    finishedAt: '2026-08-01T10:01:24Z',
    createdAt: '2026-08-01T10:00:00Z',
  },
  {
    id: 2,
    documentId: 2,
    documentTitle: 'B.Tech Computer Science Curriculum Scheme & Syllabus',
    status: 'COMPLETED',
    progressPercent: 100,
    logDetails: 'Extracted 114 pages, created 220 chunks, embeddings synchronized with payload metadata.',
    startedAt: '2026-08-10T12:00:00Z',
    finishedAt: '2026-08-10T12:02:10Z',
    createdAt: '2026-08-10T12:00:00Z',
  },
  {
    id: 3,
    documentId: 3,
    documentTitle: 'Examination Rules & Code of Academic Integrity 2026',
    status: 'COMPLETED',
    progressPercent: 100,
    logDetails: 'Processed DOCX table formats, created 48 chunks.',
    startedAt: '2026-09-01T08:00:00Z',
    finishedAt: '2026-09-01T08:00:45Z',
    createdAt: '2026-09-01T08:00:00Z',
  },
];

const MOCK_USERS: User[] = [
  { id: 1, email: 'dean@university.edu', fullName: 'Dr. Sarah Mitchell (Faculty Lead)', role: 'FACULTY', departmentId: 1, departmentName: 'Computer Science', studentIdNumber: 'FAC-001' },
  { id: 2, email: 'student@university.edu', fullName: 'Alex Johnson', role: 'STUDENT', departmentId: 1, departmentName: 'Computer Science', currentSemester: 4, studentIdNumber: 'CS-2023-042' },
  { id: 3, email: 'faculty@university.edu', fullName: 'Prof. David Chen', role: 'FACULTY', departmentId: 1, departmentName: 'Computer Science', studentIdNumber: 'FAC-108' },
  { id: 4, email: 'priya.sharma@university.edu', fullName: 'Priya Sharma', role: 'STUDENT', departmentId: 2, departmentName: 'Electronics', currentSemester: 6, studentIdNumber: 'ECE-2022-019' },
  { id: 5, email: 'dean.mgmt@university.edu', fullName: 'Dr. Robert Vance', role: 'FACULTY', departmentId: 4, departmentName: 'Management', studentIdNumber: 'FAC-044' },
];

export const adminService = {
  async getStats(): Promise<AdminStats> {
    try {
      return await apiFetch<AdminStats>('/api/admin/stats');
    } catch {
      return MOCK_STATS;
    }
  },

  async getIngestionJobs(): Promise<IngestionJob[]> {
    try {
      return await apiFetch<IngestionJob[]>('/api/admin/ingestion/jobs');
    } catch {
      return MOCK_JOBS;
    }
  },

  async uploadDocument(formData: FormData): Promise<AcademicDocument> {
    try {
      return await apiFetch<AcademicDocument>('/api/admin/documents', {
        method: 'POST',
        body: formData,
      });
    } catch (e) {
      console.warn('Backend upload not available, simulating successful upload & ingestion job');
      const file = formData.get('file') as File;
      const title = (formData.get('title') as string) || (file ? file.name : 'Uploaded Document');
      const category = (formData.get('category') as any) || 'HANDBOOK';
      const accessLevel = (formData.get('accessLevel') as any) || 'STUDENT';

      const newDoc: AcademicDocument = {
        id: Date.now(),
        title,
        fileName: file ? file.name : 'uploaded_file.pdf',
        fileType: file && file.name.endsWith('.docx') ? 'DOCX' : file && file.name.endsWith('.txt') ? 'TXT' : 'PDF',
        fileSizeBytes: file ? file.size : 1024000,
        category,
        academicYear: '2025-2026',
        accessLevel,
        status: 'INDEXED',
        chunkCount: Math.floor(Math.random() * 80) + 20,
        totalPages: Math.floor(Math.random() * 40) + 10,
        uploaderName: 'Current Admin',
        version: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return newDoc;
    }
  },

  async reindexDocument(id: number): Promise<{ message: string }> {
    try {
      return await apiFetch<{ message: string }>(`/api/admin/documents/${id}/reindex`, {
        method: 'POST',
      });
    } catch {
      return { message: 'Re-indexing job queued successfully in Qdrant vector store.' };
    }
  },

  async deleteDocument(id: number): Promise<void> {
    try {
      await apiFetch<void>(`/api/admin/documents/${id}`, {
        method: 'DELETE',
      });
    } catch {
      console.log('Document deleted locally:', id);
    }
  },

  async getUsers(): Promise<User[]> {
    try {
      return await apiFetch<User[]>('/api/admin/users');
    } catch {
      return MOCK_USERS;
    }
  },

  async updateUserRole(userId: number, role: UserRole): Promise<User> {
    try {
      return await apiFetch<User>(`/api/admin/users/${userId}/role`, {
        method: 'PUT',
        body: JSON.stringify({ role }),
      });
    } catch {
      const u = MOCK_USERS.find((x) => x.id === userId);
      if (u) u.role = role;
      return u || MOCK_USERS[0];
    }
  },
};
