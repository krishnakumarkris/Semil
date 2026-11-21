import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Eye, EyeOff, LockKeyhole, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const next = {};
    if (!form.email) next.email = 'Please enter your email address.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Please enter a valid email address.';
    if (!form.password) next.password = 'Please enter your password.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await login({ email: form.email, password: form.password });
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-card sm:p-9">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">Welcome Back</h1>
      <p className="mt-2 text-sm text-slate-500">Sign in to access your digital wallet.</p>
      <form className="mt-8 space-y-5" onSubmit={submit} noValidate>
        <Field label="Email Address" error={errors.email}>
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            className="h-12 w-full rounded-xl border border-slate-200 pl-11 pr-4 text-sm outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10"
            type="email"
            placeholder="Enter your email address"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </Field>
        <Field label="Password" error={errors.password}>
          <LockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            className="h-12 w-full rounded-xl border border-slate-200 pl-11 pr-12 text-sm outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400" onClick={() => setShowPassword(!showPassword)} aria-label="Toggle password">
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </Field>
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-slate-600"><input type="checkbox" className="h-4 w-4 accent-emerald-600" /> Remember me</label>
          <button type="button" className="font-medium text-emerald-700" onClick={() => toast('Password reset is coming soon.')}>Forgot password?</button>
        </div>
        <button disabled={submitting} className="flex h-12 w-full items-center justify-center rounded-xl bg-emerald-600 font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60">
          {submitting ? <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" /> : 'Sign In'}
        </button>
      </form>
      <p className="mt-7 text-center text-sm text-slate-500">
        Don&apos;t have an account? <Link className="font-semibold text-emerald-700" to="/register">Create an account</Link>
      </p>
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">{label}</label>
      <div className="relative">{children}</div>
      {error && <p className="mt-1.5 text-xs font-medium text-red-600">{error}</p>}
    </div>
  );
}
