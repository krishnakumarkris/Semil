import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowDownLeft, ArrowUpRight, Clock3, Plus, RefreshCw, Send, Wallet } from 'lucide-react';
import api from '../services/api';

const formatRupees = (paise) => `₹${(paise / 100).toLocaleString('en-IN', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})}`;

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState(null);
  const [balanceLoading, setBalanceLoading] = useState(true);

  useEffect(() => {
    api.get('/wallet/transactions')
      .then(({ data }) => setTransactions(data.transactions))
      .catch((error) => toast.error(error.response?.data?.message || error.message))
      .finally(() => setLoading(false));
    api.get('/wallet/me')
      .then(({ data }) => setBalance(data.wallet))
      .catch((error) => toast.error(error.response?.data?.message || error.message))
      .finally(() => setBalanceLoading(false));
  }, []);

  return (
    <main className="mx-auto max-w-6xl p-5 md:p-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600"><Clock3 size={22} /></span>
          <h1 className="mt-4 text-2xl font-bold text-slate-900">Transaction history</h1>
          <p className="mt-1 text-sm text-slate-500">Your latest wallet activity and transfers.</p>
        </div>
        <Link to="/send-money" className="inline-flex h-11 items-center gap-2 rounded-xl bg-emerald-600 px-4 text-sm font-semibold text-white transition hover:bg-emerald-700"><Send size={17} /> Send money</Link>
      </div>

      <section className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-emerald-100 bg-white p-5 shadow-card sm:px-6">
        <div className="flex items-center gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600"><Wallet size={22} /></span>
          <div>
            <p className="text-sm font-medium text-slate-500">Current wallet balance</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">
              {balanceLoading ? 'Loading…' : balance ? formatRupees(balance.balance) : '—'}
            </p>
          </div>
        </div>
        <Link to="/check-balance" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 transition hover:border-emerald-200 hover:text-emerald-700">
          <RefreshCw size={15} /> Check balance
        </Link>
      </section>

      <section className="mt-6 overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-card">
        {loading ? (
          <div className="flex min-h-48 items-center justify-center"><span className="h-7 w-7 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-600" /></div>
        ) : transactions.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-400"><Wallet size={24} /></span>
            <h2 className="mt-4 font-bold text-slate-900">No transactions yet</h2>
            <p className="mt-1 text-sm text-slate-500">Add money or send a transfer to see activity here.</p>
            <Link to="/dashboard" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700"><Plus size={16} /> Go to wallet</Link>
          </div>
        ) : (
          <>
            <div className="hidden grid-cols-[1.4fr_1.2fr_1fr_1fr] gap-4 border-b border-slate-100 bg-slate-50/70 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400 sm:grid">
              <span>Activity</span><span>Details</span><span>Date</span><span className="text-right">Amount</span>
            </div>
            <div className="divide-y divide-slate-100">
              {transactions.map((transaction) => {
                const incoming = transaction.type === 'RECEIVE';
                const outgoing = transaction.type === 'SEND';
                const Icon = incoming ? ArrowDownLeft : outgoing ? ArrowUpRight : Plus;
                const colorClass = incoming || transaction.type === 'ADD_MONEY'
                  ? 'bg-emerald-50 text-emerald-600'
                  : 'bg-amber-50 text-amber-600';
                const title = incoming ? 'Money received' : outgoing ? 'Money sent' : 'Money added';
                return (
                  <article key={transaction._id} className="grid gap-3 px-5 py-4 sm:grid-cols-[1.4fr_1.2fr_1fr_1fr] sm:items-center sm:gap-4 sm:px-6">
                    <div className="flex items-center gap-3">
                      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${colorClass}`}><Icon size={19} /></span>
                      <div><p className="text-sm font-semibold text-slate-800">{title}</p><p className="mt-0.5 text-xs text-slate-400">{transaction.status}</p></div>
                    </div>
                    <div className="pl-[52px] text-sm text-slate-500 sm:pl-0">
                      {transaction.counterpartyName
                        ? `${incoming ? 'From' : 'To'} ${transaction.counterpartyName}`
                        : transaction.description || 'Wallet top-up'}
                    </div>
                    <div className="pl-[52px] text-xs text-slate-500 sm:pl-0">
                      {new Date(transaction.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                    </div>
                    <p className={`pl-[52px] text-sm font-bold sm:pl-0 sm:text-right ${outgoing ? 'text-slate-800' : 'text-emerald-700'}`}>
                      {outgoing ? '−' : '+'}{formatRupees(transaction.amount)}
                    </p>
                  </article>
                );
              })}
            </div>
          </>
        )}
      </section>
    </main>
  );
}
