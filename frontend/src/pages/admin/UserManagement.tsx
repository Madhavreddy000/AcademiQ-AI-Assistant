import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { User, UserRole } from '../../types';
import { Users, Search, ShieldCheck, UserCheck, CheckCircle } from 'lucide-react';

export const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    const list = await adminService.getUsers();
    setUsers(list);
    setLoading(false);
  };

  const handleRoleChange = async (userId: number, newRole: UserRole) => {
    await adminService.updateUserRole(userId, newRole);
    setUsers(
      users.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );
  };

  const filteredUsers = users.filter(
    (u) =>
      u.fullName.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          User & Role Governance
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage identity, role-based access control (RBAC), and academic department affiliations.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900 shadow-sm p-6">
        {/* Search */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, student ID, or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-academic-500"
            />
          </div>
          <span className="text-xs text-slate-400 font-medium">
            Showing {filteredUsers.length} members
          </span>
        </div>

        {/* User Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500">
                <th className="py-2.5 font-semibold">User</th>
                <th className="py-2.5 font-semibold">Department</th>
                <th className="py-2.5 font-semibold">ID / Roll No.</th>
                <th className="py-2.5 font-semibold">Active Role</th>
                <th className="py-2.5 font-semibold text-right">Assign Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-3">
                    <p className="font-semibold text-slate-900 dark:text-white">{u.fullName}</p>
                    <p className="text-[11px] text-slate-400">{u.email}</p>
                  </td>
                  <td className="py-3 text-slate-600 dark:text-slate-300">
                    {u.departmentName || 'Computer Science'}
                  </td>
                  <td className="py-3 font-mono text-slate-500">
                    {u.studentIdNumber || '—'}
                  </td>
                  <td className="py-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                        u.role === 'FACULTY'
                          ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800'
                          : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                      }`}
                    >
                      {u.role === 'FACULTY' && <ShieldCheck className="h-3 w-3" />}
                      {u.role === 'STUDENT' && <UserCheck className="h-3 w-3" />}
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole)}
                      className="px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-navy-950 text-slate-800 dark:text-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-academic-500"
                    >
                      <option value="STUDENT">Student</option>
                      <option value="FACULTY">Faculty</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
