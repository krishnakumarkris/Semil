import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { AlertCircle, ArrowLeft, ArrowRight, CheckCircle2, Mail, Search, Send, ShieldCheck, UserRound, Wallet } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function SendMoney() {
  const { user } = useAuth();
  const [email, setEmail] = useState('');
  const [recipient, setRecipient] = useState(null);
  const [amount, setAmount] = useState('');
  const [checking, setChecking] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [completed, setCompleted] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [balance, setBalance] = useState(null);
  const [insufficientFunds, setInsufficientFunds] = useState(false);

  const enteredAmount = Number(amount);
  const amountExceedsBalance = balance !== null &&
    /^\d+(?:\.\d{1,2})?$/.test(amount) &&
    enteredAmount > balance / 100;

  useEffect(() => {
    api.get('/wallet/me')
      .then(({ data }) => setBalance(data.wallet.balance))
      .catch((error) => toast.error(error.response?.data?.message || error.message));
  }, []);

  const verifyRecipient = async () => {
    setRecipient(null);
    setCompleted(null);
    setErrorMessage('');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setChecking(true);
    try {
      const { data } = await api.post('/wallet/recipients/lookup', { email: email.trim() });
      setRecipient(data.recipient);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || error.message);
    } finally {
      setChecking(false);
    }
  };

  const send = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    setInsufficientFunds(false);
    if (!recipient || recipient.email !== email.trim().toLowerCase()) {
      setErrorMessage('Verify the recipient email before continuing.');
      return;
    }
    if (!/^\d+(?:\.\d{1,2})?$/.test(amount) || Number(amount) <= 0) {
      setErrorMessage('Enter an amount greater than ₹0 with at most two decimal places.');
      return;
    }

    setSubmitting(true);
    try {
      const { data } = await api.post('/wallet/send-money', { email: recipient.email, amount });
      setCompleted(data);
      setAmount('');
      toast.success('Money sent successfully.');
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      setErrorMessage(message);
      setInsufficientFunds(/insufficient funds/i.test(message));
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    setEmail('');
    setRecipient(null);
    setAmount('');
    setCompleted(null);
    setErrorMessage('');
  };

  return (
    <main className="mx-auto max-w-6xl p-5 md:p-8">
      <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-emerald-700">
        <ArrowLeft size={17} /> Back to dashboard
      </Link>
      <div className="mt-5 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-card sm:p-8">
          {completed ? (
            <div className="py-5 text-center">
              <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600"><CheckCircle2 size={34} /></span>
              <h1 className="mt-5 text-2xl font-bold text-slate-900">Transfer complete</h1>
              <p className="mt-2 text-sm text-slate-500">Your money has been sent to {completed.recipient.fullName}.</p>
              <p className="mt-5 text-4xl font-bold text-slate-900">₹{(completed.transfer.amount / 100).toFixed(2)}</p>
              <p className="mt-2 text-xs text-slate-400">Transfer ID: {completed.transfer.id}</p>
              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                <button onClick={reset} className="h-12 rounded-xl border border-slate-200 font-semibold text-slate-700 hover:bg-slate-50">Send to someone else</button>
                <Link to="/transactions" className="flex h-12 items-center justify-center rounded-xl bg-emerald-600 font-semibold text-white hover:bg-emerald-700">View history</Link>
              </div>
            </div>
          ) : (
            <>
              <div>
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600"><Send size={23} /></span>
                <h1 className="mt-5 text-2xl font-bold text-slate-900">Send money</h1>
                <p className="mt-1 text-sm text-slate-500">Send funds securely to another WalletX user.</p>
              </div>
              <div className="mt-7">
                <label htmlFor="recipient-email" className="mb-2 block text-sm font-semibold text-slate-700">Recipient email address</label>
                <div className="flex gap-2">
                  <div className="relative min-w-0 flex-1">
                    <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      id="recipient-email"
                      type="email"
                      autoComplete="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(event) => {
                        setEmail(event.target.value);
                        setRecipient(null);
                        setCompleted(null);
                        setErrorMessage('');
                      }}
                      className="h-12 w-full rounded-xl border border-slate-200 pl-11 pr-3 text-sm outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10"
                    />
                  </div>
                  <button disabled={checking || !email.trim()} onClick={verifyRecipient} className="flex h-12 shrink-0 items-center gap-2 rounded-xl border border-emerald-200 px-4 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50 disabled:opacity-50">
                    {checking ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-200 border-t-emerald-700" /> : <Search size={17} />}
                    <span className="hidden sm:inline">Verify</span>
                  </button>
                </div>
                {recipient && (
                  <div className="mt-4 flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-emerald-700"><UserRound size={20} /></span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-slate-900">{recipient.fullName}</p>
                      <p className="truncate text-xs text-slate-500">{recipient.email}</p>
                    </div>
                    <CheckCircle2 size={19} className="shrink-0 text-emerald-600" />
                  </div>
                )}
              </div>

              <form onSubmit={send} className="mt-6">
                <label htmlFor="send-amount" className="mb-2 block text-sm font-semibold text-slate-700">Amount to send</label>
                <div className="flex h-14 items-center rounded-xl border border-slate-200 px-4 focus-within:border-emerald-600 focus-within:ring-4 focus-within:ring-emerald-600/10">
                  <span className="text-xl font-semibold text-slate-400">₹</span>
                  <input id="send-amount" inputMode="decimal" placeholder="0.00" value={amount} onChange={(event) => { setAmount(event.target.value); setInsufficientFunds(false); setErrorMessage(''); }} className="min-w-0 flex-1 border-0 px-3 text-xl font-bold text-slate-900 outline-none" />
                  <span className="text-xs font-semibold text-slate-400">INR</span>
                </div>
                {(amountExceedsBalance || insufficientFunds) ? (
                  <div role="alert" className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-3">
                    <p className="flex items-center gap-2 text-sm font-medium text-amber-800"><AlertCircle size={17} />Insufficient balance for this amount.</p>
                    <Link to="/check-balance" className="rounded-lg bg-white px-3 py-2 text-sm font-semibold text-emerald-700 shadow-sm hover:bg-emerald-50">Check balance</Link>
                  </div>
                ) : errorMessage && <p role="alert" className="mt-3 rounded-xl bg-red-50 px-3 py-2.5 text-sm font-medium text-red-700">{errorMessage}</p>}
                <div className="mt-5 flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-3 text-xs leading-relaxed text-slate-500">
                  <ShieldCheck size={17} className="shrink-0 text-emerald-600" />
                  Transfers are final once confirmed. We check your available balance before completing the transfer.
                </div>
                <button disabled={submitting || checking || !recipient || amountExceedsBalance} className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50">
                  {submitting ? <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" /> : <>Send money <ArrowRight size={18} /></>}
                </button>
              </form>
            </>
          )}
        </section>

        <aside className="h-fit rounded-3xl bg-forest p-6 text-white shadow-card sm:p-7">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10"><Wallet size={21} /></span>
            <div><p className="text-xs font-medium text-emerald-50/60">Sending from</p><p className="mt-0.5 font-semibold">{user?.fullName}</p></div>
          </div>
          <div className="my-6 h-px bg-white/10" />
          <div className="flex items-center justify-between text-sm">
            <span className="text-emerald-50/60">Available balance</span>
            <strong>{balance === null ? 'Loading…' : `₹${(balance / 100).toFixed(2)}`}</strong>
          </div>
          <div className="my-6 h-px bg-white/10" />
          <p className="text-sm font-semibold">How it works</p>
          <ol className="mt-4 space-y-4">
            {[
              'Enter the registered email of the WalletX user.',
              'Verify their account and confirm the recipient name.',
              'Enter an amount; it can’t exceed your available balance.',
            ].map((text, index) => (
              <li key={text} className="flex gap-3 text-sm leading-6 text-emerald-50/70">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-bold text-white">{index + 1}</span>{text}
              </li>
            ))}
          </ol>
          <p className="mt-6 rounded-xl bg-white/[0.07] px-4 py-3 text-xs leading-5 text-emerald-50/65">
            Every transfer is recorded in both users’ transaction histories. A recipient balance may not exceed ₹2,00,000.
          </p>
        </aside>
      </div>
    </main>
  );
}
