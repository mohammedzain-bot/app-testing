'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { ShieldCheck, ShieldAlert } from 'lucide-react';

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchUsers() {
    try {
      const res = await axios.get('https://servenow-backend-16sw.onrender.com/api/admin/users');
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  async function toggleVerification(profileId: string, currentStatus: boolean) {
    if (!confirm(`Are you sure you want to ${currentStatus ? 'revoke verification' : 'verify'} this provider?`)) return;
    
    try {
      await axios.put(`https://servenow-backend-16sw.onrender.com/api/admin/providers/${profileId}/verify`, {
        isVerified: !currentStatus
      });
      fetchUsers(); // Refresh list
    } catch (err) {
      alert('Failed to update provider status.');
    }
  }

  if (loading) return <div className="animate-pulse">Loading users...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Users & Providers</h1>

      <div className="bg-white rounded-2xl border shadow-sm overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap md:whitespace-normal">
          <thead className="bg-slate-50 border-b text-slate-500 font-medium">
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Contact</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Joined</th>
              <th className="px-6 py-4 text-right">Actions / Status</th>
            </tr>
          </thead>
          <tbody className="divide-y text-slate-700">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-900">
                  {u.name || 'Anonymous User'}
                </td>
                <td className="px-6 py-4">
                  <div className="text-xs text-slate-500">{u.email || '-'}</div>
                  <div className="text-xs">{u.phone || '-'}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                    u.role === 'PROVIDER' ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-500">
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right">
                  {u.role === 'PROVIDER' && u.providerProfile ? (
                    <button
                      onClick={() => toggleVerification(u.providerProfile.id, u.providerProfile.isVerified)}
                      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        u.providerProfile.isVerified 
                          ? 'bg-emerald-50 text-emerald-700 hover:bg-red-50 hover:text-red-700'
                          : 'bg-amber-50 text-amber-700 hover:bg-emerald-50 hover:text-emerald-700'
                      }`}
                    >
                      {u.providerProfile.isVerified ? (
                        <><ShieldCheck size={14} /> Verified</>
                      ) : (
                        <><ShieldAlert size={14} /> Unverified (Verify)</>
                      )}
                    </button>
                  ) : (
                    <span className="text-slate-400 text-xs">-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {users.length === 0 && (
          <div className="p-8 text-center text-slate-500">No users found.</div>
        )}
      </div>
    </div>
  );
}
