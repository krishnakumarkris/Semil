import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  CalendarDays, CheckCircle2, Copy, Fingerprint, Mail, Phone,
  RefreshCw, ShieldCheck, UserRound, Wallet,
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const formatDate = (value) => value
  ? new Date(value).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
  : '—';

export default function Profile() {
  const { user } = useAuth();
  const [wallet, setWallet] = useState(null);
  const [walletLoading, setWalletLoading] = useState(true);
  const [walletError, setWalletError] = useState('');

  const loadWallet = async () => {
    setWalletLoading(true);
    setWalletError('');
    try {
      const { data } = await api.get('/wallet/me');
      setWallet(data.wallet);
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      setWalletError(message);
      toast.error(message);
    } finally {
      setWalletLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    api.get('/wallet/me')
      .then(({ data }) => {
        if (active) setWallet(data.wallet);
      })
      .catch((error) => {
        if (!active) return;
        const message = error.response?.data?.message || error.message;
        setWalletError(message);
        toast.error(message);
      })
      .finally(() => {
        if (active) setWalletLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const initials = (user?.fullName || 'WalletX')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');

  const copyUserId = async () => {
    try {
      await navigator.clipboard.writeText(user?.id || '');
      toast.success('Account ID copied.');
    } catch {
      toast.error('Unable to copy the account ID.');
    }
  };

  return (
    <main className="mx-auto max-w-6xl p-5 md:p-8">
      <div className="mb-6">
        <p className="text-sm font-semibold text-emerald-700">Account</p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900 md:text-3xl">Your profile</h1>
        <p className="mt-1 text-sm text-slate-500">Your personal details and WalletX account information.</p>
      </div>

      <section className="relative overflow-hidden rounded-3xl bg-forest p-6 text-white shadow-card sm:p-8">
        <div className="absolute -right-20 -top-32 h-72 w-72 rounded-full border-[48px] border-white/[0.06]" />
        <div className="relative flex flex-wrap items-center gap-5">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl border border-white/15 bg-white/10 text-2xl font-bold tracking-wide">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="truncate text-2xl font-bold">{user?.fullName || 'WalletX user'}</h2>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-semibold text-emerald-100">
                <CheckCircle2 size={14} /> Active account
              </span>
            </div>
            <p className="mt-1 flex items-center gap-2 text-sm text-emerald-50/70"><Mail size={15} />{user?.email || '—'}</p>
            <p className="mt-3 text-xs text-emerald-50/55">WalletX member since {formatDate(user?.createdAt)}</p>
          </div>
          <Link to="/check-balance" className="rounded-xl border border-white/20 px-4 py-2.5 text-sm font-semibold transition hover:bg-white/10">
            Check balance
          </Link>
        </div>
      </section>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-card sm:p-7">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700"><UserRound size={19} /></span>
            <div>
              <h2 className="font-bold text-slate-900">Personal information</h2>
              <p className="text-xs text-slate-500">Details associated with your account</p>
            </div>
          </div>
          <div className="mt-6 space-y-5">
            <ProfileDetail icon={<UserRound size={17} />} label="Full name" value={user?.fullName} />
            <ProfileDetail icon={<Mail size={17} />} label="Email address" value={user?.email} />
            <ProfileDetail icon={<Phone size={17} />} label="Phone number" value={user?.phoneNumber || 'Not provided'} />
          </div>
        </section>

        <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-card sm:p-7">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-700"><Wallet size={19} /></span>
            <div>
              <h2 className="font-bold text-slate-900">Wallet information</h2>
              <p className="text-xs text-slate-500">Your personal WalletX wallet</p>
            </div>
          </div>
          {walletError && (
            <div role="alert" className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
              <p>{walletError}</p>
              <button onClick={loadWallet} className="mt-2 inline-flex items-center gap-1.5 font-semibold"><RefreshCw size={14} /> Try again</button>
            </div>
          )}
          <div className="mt-6 space-y-5">
            <ProfileDetail icon={<Wallet size={17} />} label="Current balance" value={walletLoading ? 'Loading…' : wallet ? `₹${(wallet.balance / 100).toFixed(2)}` : 'Unavailable'} />
            <ProfileDetail icon={<Fingerprint size={17} />} label="Wallet ID" value={wallet?.id || (walletLoading ? 'Loading…' : 'Unavailable')} mono />
            <ProfileDetail icon={<span className="text-xs font-bold">₹</span>} label="Currency" value={wallet?.currency || (walletLoading ? 'Loading…' : 'Unavailable')} />
            <ProfileDetail icon={<CalendarDays size={17} />} label="Account created" value={formatDate(user?.createdAt)} />
          </div>
        </section>

        <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-card sm:p-7 lg:col-span-2">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-700"><ShieldCheck size={19} /></span>
            <div>
              <h2 className="font-bold text-slate-900">Account security</h2>
              <p className="text-xs text-slate-500">Your WalletX sign-in and account identifiers</p>
            </div>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Sign-in session</p>
              <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-slate-800"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Secure and active</p>
              <p className="mt-1 text-xs leading-5 text-slate-500">WalletX protects your session with an HTTP-only authentication cookie.</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Account ID</p>
                  <p className="mt-2 break-all font-mono text-xs font-semibold text-slate-800">{user?.id || '—'}</p>
                </div>
                <button onClick={copyUserId} disabled={!user?.id} aria-label="Copy account ID" className="rounded-lg p-2 text-slate-500 transition hover:bg-white hover:text-emerald-700 disabled:opacity-40"><Copy size={17} /></button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function ProfileDetail({ icon, label, value, mono = false }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 text-slate-400">{icon}</span>
      <div className="min-w-0">
        <p className="text-xs font-medium text-slate-400">{label}</p>
        <p className={`mt-1 break-all text-sm font-semibold text-slate-800 ${mono ? 'font-mono text-xs' : ''}`}>{value || '—'}</p>
      </div>
    </div>
  );
}
