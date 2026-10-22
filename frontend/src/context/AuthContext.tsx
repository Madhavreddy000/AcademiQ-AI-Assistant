import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, DepartmentCode, DEPARTMENTS, getYearFromSemester } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: Partial<User> & { password: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  switchRole: (newRole: UserRole) => void;
  updateUserProfile: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Default demo user when first visiting or testing
const DEFAULT_DEMO_STUDENT: User = {
  id: 2,
  email: 'student@university.edu',
  fullName: 'Alex Johnson',
  role: 'STUDENT',
  departmentId: 1,
  departmentCode: 'CSE',
  departmentName: 'Computer Science & Engineering',
  currentSemester: 4,
  academicYearNumber: 2,
  studentIdNumber: 'CSE-2023-042',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&fit=crop&crop=faces',
  token: 'mock-jwt-token-student'
};

const DEFAULT_DEMO_FACULTY: User = {
  id: 3,
  email: 'faculty@university.edu',
  fullName: 'Prof. David Chen (Course Instructor)',
  role: 'FACULTY',
  departmentId: 1,
  departmentCode: 'CSE',
  departmentName: 'Computer Science & Engineering',
  studentIdNumber: 'FAC-108',
  avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&fit=crop&crop=faces',
  token: 'mock-jwt-token-faculty'
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('academiq_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return DEFAULT_DEMO_STUDENT; }
    }
    return DEFAULT_DEMO_STUDENT;
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('academiq_token') || 'mock-jwt-token-student';
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('academiq_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('academiq_user');
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('academiq_token', token);
    } else {
      localStorage.removeItem('academiq_token');
    }
  }, [token]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setToken(data.token);
        setIsLoading(false);
        return { success: true };
      }
    } catch (e) {
      // Fallback for offline/mock demo testing
      console.warn("Backend not reached, checking demo credentials", e);
    }

    // Demo fallback credentials
    if (email.includes('faculty') || email.includes('prof') || email.includes('admin')) {
      setUser(DEFAULT_DEMO_FACULTY);
      setToken('mock-jwt-token-faculty');
      setIsLoading(false);
      return { success: true };
    } else {
      setUser({
        ...DEFAULT_DEMO_STUDENT,
        email: email,
        fullName: email.split('@')[0].toUpperCase()
      });
      setToken('mock-jwt-token-student');
      setIsLoading(false);
      return { success: true };
    }
  };

  const register = async (data: Partial<User> & { password: string }) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (res.ok) {
        const responseData = await res.json();
        setUser(responseData.user);
        setToken(responseData.token);
        setIsLoading(false);
        return { success: true };
      }
    } catch (e) {
      console.warn("Registration API fallback", e);
    }

    const newUser: User = {
      id: Math.floor(Math.random() * 1000) + 10,
      email: data.email || 'student@university.edu',
      fullName: data.fullName || 'Alex Johnson',
      role: data.role || 'STUDENT',
      departmentId: data.departmentId || 1,
      currentSemester: data.currentSemester || 4,
      studentIdNumber: data.studentIdNumber || 'CS-2023-042',
      token: 'mock-jwt-token-' + Date.now()
    };
    setUser(newUser);
    setToken(newUser.token || 'mock-jwt-token');
    setIsLoading(false);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('academiq_user');
    localStorage.removeItem('academiq_token');
  };

  const switchRole = (newRole: UserRole) => {
    if (newRole === 'FACULTY') {
      setUser(DEFAULT_DEMO_FACULTY);
      setToken('mock-jwt-token-faculty');
    } else {
      setUser(DEFAULT_DEMO_STUDENT);
      setToken('mock-jwt-token-student');
    }
  };

  const updateUserProfile = (updates: Partial<User>) => {
    if (user) {
      let deptName = user.departmentName;
      if (updates.departmentCode) {
        const found = DEPARTMENTS.find((d) => d.code === updates.departmentCode);
        if (found) deptName = found.fullName;
      }
      const newSemester = updates.currentSemester !== undefined ? updates.currentSemester : user.currentSemester;
      const newYear = newSemester ? getYearFromSemester(newSemester) : user.academicYearNumber;

      const updatedUser: User = {
        ...user,
        ...updates,
        departmentName: deptName,
        currentSemester: newSemester,
        academicYearNumber: newYear,
      };
      setUser(updatedUser);
      localStorage.setItem('academiq_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        switchRole,
        updateUserProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
