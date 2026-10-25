import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, DepartmentCode, DEPARTMENTS, getYearFromSemester } from '../types';

interface RegisterData extends Partial<User> {
  password: string;
  stream?: string;
  academicYear?: number;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (identifier: string, password: string, role?: UserRole) => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateUserProfile: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('academiq_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return null; }
    }
    return null;
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('academiq_token') || null;
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

  const login = async (identifier: string, password: string, role?: UserRole) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: identifier.trim(), password, role })
      });

      const data = await res.json();
      if (res.ok) {
        // Populate department details if available
        let deptCode: DepartmentCode | undefined = undefined;
        let deptName = data.user.departmentName;
        if (data.user.departmentId) {
          const dept = DEPARTMENTS[data.user.departmentId - 1] || DEPARTMENTS[0];
          deptCode = dept?.code;
          if (!deptName) deptName = dept?.fullName;
        }

        const authenticatedUser: User = {
          ...data.user,
          departmentCode: deptCode,
          departmentName: deptName,
          token: data.token
        };

        setUser(authenticatedUser);
        setToken(data.token);
        setIsLoading(false);
        return { success: true };
      } else {
        setIsLoading(false);
        return { success: false, error: data.message || 'Invalid Roll Number / Employee ID or password' };
      }
    } catch (e: any) {
      setIsLoading(false);
      return { success: false, error: e.message || 'Connection to server failed. Please ensure backend is active.' };
    }
  };

  const register = async (data: RegisterData) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const responseData = await res.json();
      if (res.ok) {
        let deptCode: DepartmentCode | undefined = undefined;
        let deptName = responseData.user.departmentName;
        if (responseData.user.departmentId) {
          const dept = DEPARTMENTS[responseData.user.departmentId - 1] || DEPARTMENTS[0];
          deptCode = dept?.code;
          if (!deptName) deptName = dept?.fullName;
        }

        const newUser: User = {
          ...responseData.user,
          departmentCode: deptCode,
          departmentName: deptName,
          token: responseData.token
        };

        setUser(newUser);
        setToken(responseData.token);
        setIsLoading(false);
        return { success: true };
      } else {
        setIsLoading(false);
        return { success: false, error: responseData.message || 'Registration failed. Check inputs.' };
      }
    } catch (e: any) {
      setIsLoading(false);
      return { success: false, error: e.message || 'Registration error. Server unreachable.' };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('academiq_user');
    localStorage.removeItem('academiq_token');
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
