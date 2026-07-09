import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, ClipboardList, FlaskConical } from 'lucide-react';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/barang', label: 'Inventaris Barang', icon: Package },
  { to: '/peminjaman', label: 'Data Peminjaman', icon: ClipboardList },
];

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-white border-r border-slate-100 flex flex-col fixed h-full">
        <div className="h-16 flex items-center gap-2 px-6 border-b border-slate-100">
          <div className="w-9 h-9 rounded-xl bg-primary-600 flex items-center justify-center">
            <FlaskConical className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-bold text-slate-800 leading-tight">SIPINJAM</p>
            <p className="text-[11px] text-slate-400 leading-tight">Inventaris Lab</p>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                }`
              }
            >
              <Icon className="w-[18px] h-[18px]" />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="px-6 py-4 border-t border-slate-100 text-xs text-slate-400">
          Pemograman Web 2 · UAS 2026
        </div>
      </aside>
      <main className="flex-1 ml-64 p-8">{children}</main>
    </div>
  );
}
