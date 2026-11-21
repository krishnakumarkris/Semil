import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowDownLeft, ArrowLeft, ArrowUpRight, RefreshCw, ShieldCheck, Wallet } from 'lucide-react';
import api from '../services/api';

const ACCOUNT_LIMIT_PAISE = 20000000;

export default function CheckBalance() {
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const loadBalance = useCallback(async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const { data } = await api.get('/wallet/me');
      setWallet(data.wallet);
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      setErrorMessage(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    api.get('/wallet/me')
      .then(({ data }) => {
        if (active) setWallet(data.wallet);
      })
      .catch((error) => {
        if (!active) return;
        const message = error.response?.data?.message || error.message;
        setErrorMessage(message);
        toast.error(message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const balance = wallet?.balance ?? null;
  const availableCapacity = balance === null ? null : Math.max(0, ACCOUNT_LIMIT_PAISE - balance);

  return (
    <main className="mx-auto max-w-6xl p-5 md:p-8">
      <Link to="/send-money" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-emerald-700">
        <ArrowLeft size={17} /> Back to send money
      </Link>
      <div className="mt-5 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="overflow-hidden rounded-3xl bg-forest text-white shadow-card">
          <div className="relative p-7 sm:p-9">
            <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full border-[42px] border-white/[0.06]" />
            <div className="relative">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10"><Wallet size={23} /></span>
              <div className="mt-8 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-emerald-50/65">Available wallet balance</p>
                  <p className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
                    {loading && balance === null ? 'Loading…' : balance === null ? '—' : `₹${(balance / 100).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                  </p>
                </div>
                <button onClick={loadBalance} disabled={loading} aria-label="Refresh balance" className="flex h-10 items-center gap-2 rounded-xl bg-white/10 px-3 text-sm font-semibold transition hover:bg-white/15 disabled:opacity-60">
                  <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Refresh
                </button>
              </div>
              {errorMessage && (
                <div role="alert" className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-red-500/15 px-4 py-3 text-sm text-red-50">
                  <span>{errorMessage}</span>
                  <button onClick={loadBalance} className="font-semibold underline underline-offset-2">Try again</button>
                </div>
              )}
              <div className="mt-8 flex items-center gap-2 text-xs text-emerald-50/65">
                <ShieldCheck size={16} /> Balance fetched securely from your WalletX account
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-card sm:p-7">
          <h1 className="text-xl font-bold text-slate-900">Balance details</h1>
          <p className="mt-1 text-sm text-slate-500">Your latest account balance and wallet limit.</p>
          <div className="mt-6 space-y-4">
            <Detail icon={<Wallet size={18} />} label="Wallet balance" value={balance === null ? '—' : `₹${(balance / 100).toFixed(2)}`} />
            <Detail icon={<ArrowDownLeft size={18} />} label="Maximum wallet balance" value="₹2,00,000.00" />
            <Detail icon={<ArrowUpRight size={18} />} label="Remaining capacity" value={availableCapacity === null ? '—' : `₹${(availableCapacity / 100).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} />
          </div>
          <Link to="/send-money" className="mt-7 flex h-12 items-center justify-center rounded-xl bg-emerald-600 font-semibold text-white transition hover:bg-emerald-700">Return to Send Money</Link>
        </section>
      </div>
    </main>
  );
}

function Detail({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-emerald-600 shadow-sm">{icon}</span>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-slate-500">{label}</p>
        <p className="mt-0.5 text-sm font-bold text-slate-800">{value}</p>
      </div>
    </div>
  );
}
