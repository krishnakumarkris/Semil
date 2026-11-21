import { useEffect, useState } from 'react';
import { CheckCircle2, CreditCard, IndianRupee, ShieldCheck, X } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';

const presets = [500, 1000, 2000, 5000];

export default function AddMoneyModal({ open, onClose, wallet, onAdded }) {
  const [amount, setAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (!open) {
      setAmount('');
      setSuccess(null);
      setSubmitting(false);
    }
  }, [open]);

  if (!open) return null;

  const numericAmount = Number(amount);
  const currentBalance = wallet?.balance || 0;
  const remainingLimit = Math.max(0, 20000000 - currentBalance) / 100;
  const isValid = amount !== '' && Number.isFinite(numericAmount) && numericAmount > 0 &&
    numericAmount <= 200000 && numericAmount <= remainingLimit &&
    /^\d+(?:\.\d{1,2})?$/.test(amount);

  const submit = async (event) => {
    event.preventDefault();
    if (!isValid) return;
    setSubmitting(true);
    try {
      const { data } = await api.post('/wallet/add-money', { amount: numericAmount });
      setSuccess(data);
      onAdded(data.wallet);
      toast.success(`₹${numericAmount.toFixed(2)} added successfully.`);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <button aria-label="Close add money" className="absolute inset-0 bg-slate-950/45 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-3xl bg-white shadow-2xl">
        {success ? (
          <div className="p-7 text-center">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <CheckCircle2 size={34} />
            </span>
            <h2 className="mt-5 text-2xl font-bold text-slate-900">Money added</h2>
            <p className="mt-2 text-sm text-slate-500">
              ₹{(success.transaction.amount / 100).toFixed(2)} was added to your WalletX balance.
            </p>
            <div className="mt-5 rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-400">New balance</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">₹{(success.wallet.balance / 100).toFixed(2)}</p>
            </div>
            <button onClick={onClose} className="mt-5 h-12 w-full rounded-xl bg-emerald-600 font-semibold text-white transition hover:bg-emerald-700">Done</button>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Add Money</h2>
                <p className="mt-1 text-sm text-slate-500">Add simulated funds to your wallet</p>
              </div>
              <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"><X size={20} /></button>
            </div>
            <form onSubmit={submit} className="p-6">
              <div className="rounded-2xl bg-emerald-50 px-4 py-3">
                <div className="flex justify-between text-sm"><span className="text-slate-500">Current balance</span><strong className="text-slate-900">₹{(currentBalance / 100).toFixed(2)}</strong></div>
                <div className="mt-1 flex justify-between text-xs"><span className="text-slate-400">Available to add</span><span className="font-medium text-emerald-700">₹{remainingLimit.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span></div>
              </div>

              <label className="mt-5 block text-sm font-semibold text-slate-700">Enter amount</label>
              <div className="mt-2 flex h-14 items-center rounded-xl border border-slate-200 px-4 focus-within:border-emerald-600 focus-within:ring-4 focus-within:ring-emerald-600/10">
                <IndianRupee size={20} className="text-slate-400" />
                <input
                  autoFocus
                  inputMode="decimal"
                  placeholder="0.00"
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                  className="min-w-0 flex-1 border-0 px-2 text-xl font-bold text-slate-900 outline-none"
                />
                <span className="text-xs font-semibold text-slate-400">INR</span>
              </div>

              <div className="mt-3 grid grid-cols-4 gap-2">
                {presets.map((preset) => (
                  <button key={preset} type="button" onClick={() => setAmount(String(preset))} className="rounded-lg border border-slate-200 py-2 text-sm font-semibold text-slate-600 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700">
                    ₹{preset.toLocaleString('en-IN')}
                  </button>
                ))}
              </div>

              {amount && !isValid && (
                <p className="mt-3 text-xs font-medium text-red-600">
                  {numericAmount > remainingLimit
                    ? `Maximum balance limit is ₹2,00,000. You can add up to ₹${remainingLimit.toFixed(2)}.`
                    : numericAmount > 200000
                      ? 'A maximum of ₹2,00,000 can be added at one time.'
                      : 'Enter an amount greater than ₹0 with at most two decimal places.'}
                </p>
              )}

              <div className="mt-5 flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2.5 text-xs text-slate-500">
                <ShieldCheck size={16} className="text-emerald-600" />
                Secure simulated wallet credit
              </div>
              <button disabled={submitting || !isValid} className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50">
                {submitting ? <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" /> : <><CreditCard size={18} /> Add Money</>}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
