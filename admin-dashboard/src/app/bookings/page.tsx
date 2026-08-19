'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { IndianRupee } from 'lucide-react';

export default function BookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchBookings() {
    try {
      const res = await axios.get('https://servenow-backend-16sw.onrender.com/api/admin/bookings');
      setBookings(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchBookings();
  }, []);

  if (loading) return <div className="animate-pulse">Loading bookings...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">All Bookings</h1>

      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b text-slate-500 font-medium">
            <tr>
              <th className="px-6 py-4">ID / Date</th>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Provider</th>
              <th className="px-6 py-4">Amount / Comm.</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y text-slate-700">
            {bookings.map((b) => (
              <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-mono text-xs text-slate-400 mb-1">#{b.id.slice(0, 8)}</div>
                  <div className="font-medium text-slate-900">{new Date(b.scheduledAt).toLocaleString()}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium">{b.customer?.name || 'Unknown'}</div>
                  <div className="text-xs text-slate-500">{b.customer?.phone || '-'}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-indigo-700">{b.provider?.name || 'Unassigned'}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1 font-semibold text-slate-900">
                    <IndianRupee size={14} /> {b.totalAmount}
                  </div>
                  <div className="text-xs text-emerald-600 mt-0.5">Comm: ₹{b.commission}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                    b.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700' :
                    b.status === 'CANCELLED' ? 'bg-rose-100 text-rose-700' :
                    b.status === 'REQUESTED' ? 'bg-amber-100 text-amber-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {b.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {bookings.length === 0 && (
          <div className="p-8 text-center text-slate-500">No bookings found.</div>
        )}
      </div>
    </div>
  );
}
