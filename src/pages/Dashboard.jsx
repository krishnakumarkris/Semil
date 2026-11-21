import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
  ArrowDownLeft, ArrowUpRight, Plus, Wallet,
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import AddMoneyModal from '../components/AddMoneyModal';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [wallet, setWallet] = useState(null);
  const [walletLoading, setWalletLoading] = useState(true);
  const [addMoneyOpen, setAddMoneyOpen] = useState(false);

  useEffect(() => {
    api.get('/wallet/me')
      .then(({ data }) => setWallet(data.wallet))
      .catch((error) => toast.error(error.response?.data?.message || error.message))
      .finally(() => setWalletLoading(false));
  }, []);

  return (
    <>
        <main className="mx-auto max-w-6xl p-5 md:p-8">
          <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">Welcome back, {user?.fullName}!</h1>
          <p className="mt-1 text-sm text-slate-500">Here is your WalletX account overview.</p>

          <div className="mt-7 grid gap-5 xl:grid-cols-[1.35fr_1fr]">
            <section className="relative min-h-56 overflow-hidden rounded-3xl bg-emerald-600 p-7 text-white shadow-xl shadow-emerald-900/10">
              <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full border-[34px] border-white/10" />
              <div className="relative flex h-full flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div><p className="text-sm font-medium text-emerald-50/70">Available Balance</p><p className="mt-2 text-4xl font-bold">₹{walletLoading ? '—' : ((wallet?.balance || 0) / 100).toFixed(2)}</p></div>
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15"><Wallet size={24} /></span>
                </div>
                <div className="mt-10 flex items-center gap-3 text-sm">
                  <span className="rounded-full bg-white/15 px-3 py-1.5">Currency: {wallet?.currency || 'INR'}</span>
                  <span className="flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5"><span className="h-2 w-2 rounded-full bg-emerald-200" /> Active</span>
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-card">
              <h2 className="font-bold text-slate-900">Quick actions</h2>
              <div className="mt-5 grid grid-cols-3 gap-3">
                <Action icon={<Plus size={20} />} label="Add Money" onClick={() => setAddMoneyOpen(true)} />
                <Action icon={<ArrowUpRight size={20} />} label="Send Money" onClick={() => navigate('/send-money')} />
                <Action icon={<ArrowDownLeft size={20} />} label="History" onClick={() => navigate('/transactions')} />
              </div>
              <p className="mt-5 rounded-xl bg-slate-50 px-4 py-3 text-xs text-slate-500">Your wallet activity is available in transaction history.</p>
            </section>
          </div>

        </main>
      <AddMoneyModal
        open={addMoneyOpen}
        onClose={() => setAddMoneyOpen(false)}
        wallet={wallet}
        onAdded={setWallet}
      />
    </>
  );
}

function Action({ icon, label, onClick }) {
  return (
    <button onClick={onClick || (() => toast('This feature is coming soon.'))} className="flex min-h-24 flex-col items-center justify-center gap-2 rounded-2xl border border-slate-100 bg-slate-50 px-2 text-center text-xs font-semibold text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">{icon}</span>{label}
    </button>
  );
}

