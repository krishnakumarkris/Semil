import { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  Clock3, LayoutDashboard, LogOut, Menu, Wallet,
  Send, UserRound, X,
} from 'lucide-react';
import { Brand } from './AuthLayout';
import { useAuth } from '../context/AuthContext';

const navigation = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/check-balance', label: 'Check Balance', icon: Wallet },
  { to: '/send-money', label: 'Send Money', icon: Send },
  { to: '/transactions', label: 'Transactions', icon: Clock3 },
  { to: '/profile', label: 'Profile', icon: UserRound },
];

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const signOut = async () => {
    try {
      await logout();
      toast.success('Logged out successfully.');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to log out.');
    }
  };

  const sidebar = (
    <aside className="flex h-full w-64 flex-col bg-forest px-5 py-6 text-white">
      <Brand />
      <nav className="mt-10 space-y-1">
        {navigation.map(({ to, label, icon: Icon }) => {
          const active = label === 'Dashboard'
            ? location.pathname === '/dashboard'
            : location.pathname === to;
          return (
            <NavLink
              key={label}
              to={to}
              onClick={() => setMenuOpen(false)}
              className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${active ? 'bg-white/12 text-white' : 'text-emerald-50/65 hover:bg-white/10 hover:text-white'}`}
            >
              <Icon size={19} /><span>{label}</span>
            </NavLink>
          );
        })}
      </nav>
      <button onClick={signOut} className="mt-auto flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-emerald-100/70 transition hover:bg-white/10 hover:text-white">
        <LogOut size={19} /> Logout
      </button>
    </aside>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="fixed inset-y-0 left-0 z-40 hidden lg:block">{sidebar}</div>
      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button aria-label="Close menu" className="absolute inset-0 bg-slate-950/40" onClick={() => setMenuOpen(false)} />
          <div className="relative h-full">{sidebar}<button className="absolute right-3 top-3 text-white" onClick={() => setMenuOpen(false)}><X /></button></div>
        </div>
      )}
      <div className="lg:pl-64">
        <header className="flex h-16 items-center justify-between border-b border-slate-100 bg-white px-5 md:px-8">
          <button aria-label="Open menu" className="lg:hidden" onClick={() => setMenuOpen(true)}><Menu /></button>
          <p className="ml-auto text-sm font-medium text-slate-600">Hello, {user?.fullName?.split(' ')[0]}</p>
        </header>
        <Outlet />
      </div>
    </div>
  );
}
