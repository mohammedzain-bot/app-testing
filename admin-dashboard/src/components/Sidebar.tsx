'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, CalendarDays, Settings, LogOut, Wrench } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Users', href: '/users', icon: Users },
    { name: 'Bookings', href: '/bookings', icon: CalendarDays },
    { name: 'Services', href: '/services', icon: Wrench },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-white border-r h-screen fixed left-0 top-0 flex-col z-50">
        <div className="p-6 flex items-center gap-3 border-b">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white text-xl shadow-lg shadow-indigo-200">
            🛠️
          </div>
          <div>
            <h1 className="font-bold text-xl text-slate-800">ServeNow</h1>
            <p className="text-xs text-slate-500 font-medium">Admin Panel</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-indigo-600' : 'text-slate-400'} />
                {link.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t">
          <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 w-full transition-colors">
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Top Header (Just for branding) */}
      <div className="md:hidden bg-white border-b p-4 flex items-center justify-between sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-sm shadow-md">
            🛠️
          </div>
          <h1 className="font-bold text-lg text-slate-800">ServeNow</h1>
        </div>
        <div className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded font-bold">Admin</div>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t flex items-center justify-around z-50 pb-safe">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex flex-col items-center justify-center w-full py-3 transition-colors ${
                isActive ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Icon size={20} className={isActive ? 'text-indigo-600' : 'text-slate-400'} />
              <span className={`text-[10px] mt-1 font-medium ${isActive ? 'text-indigo-600' : 'text-slate-500'}`}>
                {link.name}
              </span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
