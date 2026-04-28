import React, { useState, useEffect } from 'react';
import { Search, Trash2, Users, Shield, Wheat, ChevronLeft, ChevronRight } from 'lucide-react';
import { adminAPI } from '../../services/api';

export default function UserManagement() {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await adminAPI.getUsers(page, search, roleFilter);
      setUsers(data.users); setTotalPages(data.pages); setTotal(data.total);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, [page, search, roleFilter]);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete user "${name}" and all their data?`)) return;
    try { await adminAPI.deleteUser(id); fetchUsers(); } catch {}
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div><h2 className="text-2xl font-bold text-stone-800">User Management</h2><p className="text-stone-500 text-sm">{total} total users</p></div>
        <div className="flex gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
            <input type="text" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 focus:ring-2 focus:ring-emerald-500 outline-none text-sm" placeholder="Search..." />
          </div>
          <select value={roleFilter} onChange={e => { setRoleFilter(e.target.value); setPage(1); }}
            className="px-3 py-2.5 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-emerald-500 outline-none">
            <option value="">All Roles</option><option value="farmer">Farmer</option><option value="admin">Admin</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="bg-stone-50 border-b border-stone-100">
              <th className="text-left px-6 py-3 text-xs font-bold text-stone-500 uppercase">User</th>
              <th className="text-left px-6 py-3 text-xs font-bold text-stone-500 uppercase">Email</th>
              <th className="text-left px-6 py-3 text-xs font-bold text-stone-500 uppercase">Role</th>
              <th className="text-left px-6 py-3 text-xs font-bold text-stone-500 uppercase">Joined</th>
              <th className="text-right px-6 py-3 text-xs font-bold text-stone-500 uppercase">Action</th>
            </tr></thead>
            <tbody className="divide-y divide-stone-100">
              {loading ? [1,2,3].map(i => (
                <tr key={i}><td colSpan={5} className="px-6 py-4"><div className="h-4 bg-stone-100 rounded animate-pulse w-full" /></td></tr>
              )) : users.map(u => (
                <tr key={u._id} className="hover:bg-stone-50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-stone-800">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${u.role === 'admin' ? 'bg-red-500' : 'bg-emerald-500'}`}>
                        {u.name?.charAt(0).toUpperCase()}
                      </div>
                      {u.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-stone-500">{u.email}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${u.role === 'admin' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                      {u.role === 'admin' ? <Shield className="h-3 w-3" /> : <Wheat className="h-3 w-3" />} {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-stone-400 text-xs">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleDelete(u._id, u.name)}
                      className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Delete">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1}
            className="p-2 rounded-lg border border-stone-200 hover:bg-stone-100 disabled:opacity-40"><ChevronLeft className="h-4 w-4" /></button>
          <span className="text-sm text-stone-600 px-3">Page {page} of {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page === totalPages}
            className="p-2 rounded-lg border border-stone-200 hover:bg-stone-100 disabled:opacity-40"><ChevronRight className="h-4 w-4" /></button>
        </div>
      )}
    </div>
  );
}
