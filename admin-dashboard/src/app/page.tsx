'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Users, UserCheck, CalendarCheck, CalendarX, 
  IndianRupee, Activity, Clock
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, LineChart, Line 
} from 'recharts';

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [revenue, setRevenue] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsRes, revRes] = await Promise.all([
          axios.get('http://localhost:3000/api/admin/stats'),
          axios.get('http://localhost:3000/api/admin/revenue')
        ]);
        setStats(statsRes.data);
        setRevenue(revRes.data.reverse()); // Show oldest to newest
      } catch (err) {
        console.error('Error fetching admin data', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <div className="animate-pulse">Loading dashboard...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard Overview</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Customers" value={stats?.totalUsers || 0} icon={Users} color="bg-blue-500" />
        <StatCard title="Total Providers" value={stats?.totalProviders || 0} icon={UserCheck} color="bg-indigo-500" />
        <StatCard title="Pending Verifications" value={stats?.pendingVerifications || 0} icon={Clock} color="bg-amber-500" />
        <StatCard title="Total Bookings" value={stats?.totalBookings || 0} icon={CalendarCheck} color="bg-emerald-500" />
        
        <StatCard title="Active Jobs" value={stats?.activeBookings || 0} icon={Activity} color="bg-violet-500" />
        <StatCard title="Cancelled Jobs" value={stats?.cancelledBookings || 0} icon={CalendarX} color="bg-rose-500" />
        <StatCard title="Today's Revenue" value={`₹${stats?.todayRevenue || 0}`} icon={IndianRupee} color="bg-teal-500" />
        <StatCard title="Total Commission" value={`₹${stats?.totalPlatformCommission || 0}`} icon={IndianRupee} color="bg-fuchsia-500" />
      </div>

      {/* Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <h2 className="text-lg font-bold mb-6">Revenue Growth</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenue}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} tickFormatter={(val) => `₹${val}`} />
                <Tooltip 
                  formatter={(value) => [`₹${value}`, 'Revenue']}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Line type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={3} dot={{ r: 4, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <h2 className="text-lg font-bold mb-6">Bookings Trend</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenue}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="bookings" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color }: any) {
  return (
    <div className="bg-white p-6 rounded-2xl border shadow-sm flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl ${color} text-white flex items-center justify-center shadow-lg shadow-black/5`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-sm text-slate-500 font-medium mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
      </div>
    </div>
  );
}
