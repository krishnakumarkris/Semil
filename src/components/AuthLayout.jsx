import { Outlet, useLocation } from 'react-router-dom';
import { ArrowRightLeft, ShieldCheck, Wallet } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AuthLayout() {
  const location = useLocation();
  const { user } = useAuth();
  if (user) return <Navigate replace to="/dashboard" />;

  const register = location.pathname === '/register';
  const features = register
    ? [
        ['Quick Account Creation', 'Get started in just a few steps'],
        ['Secure Authentication', 'Protected with modern security'],
        ['Personal Wallet Access', 'One wallet, made for you'],
      ]
    : [
        ['Secure Account Access', 'Protected with trusted authentication'],
        ['Easy Money Transfers', 'Move money with confidence'],
        ['Complete Transaction Tracking', 'Stay in control of every rupee'],
      ];

  return (
    <main className="min-h-screen bg-slate-50 lg:grid lg:grid-cols-[46%_54%]">
      <section className="relative hidden overflow-hidden bg-forest px-12 py-10 text-white lg:flex lg:flex-col">
        <div className="absolute -right-28 -top-28 h-72 w-72 rounded-full border-[44px] border-white/5" />
        <Brand />
        <div className="my-auto max-w-lg">
          <h2 className="text-5xl font-semibold leading-[1.08] tracking-tight">
            {register ? 'Start your digital journey.' : 'Your money, simplified.'}
          </h2>
          <p className="mt-5 max-w-md text-lg leading-8 text-emerald-50/75">
            {register
              ? 'Create your WalletX account and experience a simpler way to manage your virtual money.'
              : 'Manage your virtual money, send funds securely, and keep track of every transaction in one place.'}
          </p>
          <div className="mt-10 space-y-4">
            {features.map(([title, subtitle]) => (
              <div key={title} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3.5">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-300">
                  {title.includes('Transfer') ? <ArrowRightLeft size={20} /> : title.includes('Secure') ? <ShieldCheck size={20} /> : <Wallet size={20} />}
                </span>
                <div>
                  <p className="font-semibold">{title}</p>
                  <p className="mt-0.5 text-sm text-emerald-50/60">{subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <p className="text-sm text-emerald-50/50">© 2026 WalletX</p>
      </section>
      <section className="flex min-h-screen items-center justify-center px-5 py-8 sm:px-8">
        <div className="w-full max-w-[470px]">
          <div className="mb-8 lg:hidden"><Brand dark /></div>
          <Outlet />
        </div>
      </section>
    </main>
  );
}

export function Brand({ dark = false }) {
  return (
    <div className="flex items-center gap-3">
      <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${dark ? 'bg-emerald-600 text-white' : 'bg-white text-emerald-700'}`}>
        <Wallet size={23} strokeWidth={2.4} />
      </span>
      <div>
        <p className={`text-xl font-bold leading-none ${dark ? 'text-slate-900' : 'text-white'}`}>WalletX</p>
        <p className={`mt-1 text-[10px] font-medium tracking-[0.16em] ${dark ? 'text-slate-400' : 'text-emerald-100/60'}`}>YOUR MONEY. YOUR CONTROL.</p>
      </div>
    </div>
  );
}
