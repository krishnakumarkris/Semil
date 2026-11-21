import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Eye, EyeOff, LockKeyhole, Mail, Phone, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: '', email: '', phoneNumber: '', password: '', confirmPassword: '', terms: false });
  const [errors, setErrors] = useState({});
  const [visible, setVisible] = useState({ password: false, confirm: false });
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const next = {};
    if (form.fullName.trim().length < 2) next.fullName = 'Full name must contain at least 2 characters.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Please enter a valid email address.';
    if (form.phoneNumber && !/^[+()\d\s-]{7,15}$/.test(form.phoneNumber)) next.phoneNumber = 'Please enter a valid phone number.';
    if (form.password.length < 8) next.password = 'Password must contain at least 8 characters.';
    else if (!/[A-Z]/.test(form.password) || !/[a-z]/.test(form.password) || !/[0-9]/.test(form.password)) next.password = 'Include uppercase, lowercase, and a number.';
    if (form.confirmPassword !== form.password) next.confirmPassword = 'Passwords do not match.';
    if (!form.terms) next.terms = 'You must accept the terms and conditions.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await register({
        fullName: form.fullName,
        email: form.email,
        phoneNumber: form.phoneNumber,
        password: form.password,
      });
      toast.success('Your WalletX account is ready.');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const set = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-card sm:p-7">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">Create Your Account</h1>
      <p className="mt-2 text-sm text-slate-500">Join WalletX and manage your money digitally.</p>
      <form className="mt-6 space-y-4" onSubmit={submit} noValidate>
        <Input label="Full Name" error={errors.fullName} icon={<User size={18} />} placeholder="Enter your full name" value={form.fullName} onChange={(v) => set('fullName', v)} />
        <Input label="Email Address" error={errors.email} icon={<Mail size={18} />} type="email" placeholder="Enter your email" value={form.email} onChange={(v) => set('email', v)} />
        <Input label="Phone Number (optional)" error={errors.phoneNumber} icon={<Phone size={18} />} type="tel" placeholder="Enter your phone number" value={form.phoneNumber} onChange={(v) => set('phoneNumber', v)} />
        <PasswordInput label="Password" error={errors.password} placeholder="Create a password" value={form.password} visible={visible.password} onToggle={() => setVisible({ ...visible, password: !visible.password })} onChange={(v) => set('password', v)} />
        <PasswordInput label="Confirm Password" error={errors.confirmPassword} placeholder="Confirm your password" value={form.confirmPassword} visible={visible.confirm} onToggle={() => setVisible({ ...visible, confirm: !visible.confirm })} onChange={(v) => set('confirmPassword', v)} />
        <div>
          <label className="flex items-start gap-2 text-sm text-slate-600">
            <input type="checkbox" className="mt-0.5 h-4 w-4 accent-emerald-600" checked={form.terms} onChange={(e) => set('terms', e.target.checked)} />
            <span>I agree to the Terms and Conditions and Privacy Policy.</span>
          </label>
          {errors.terms && <p className="mt-1 text-xs font-medium text-red-600">{errors.terms}</p>}
        </div>
        <button disabled={submitting} className="flex h-12 w-full items-center justify-center rounded-xl bg-emerald-600 font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60">
          {submitting ? <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" /> : 'Create Account'}
        </button>
      </form>
      <p className="mt-5 text-center text-sm text-slate-500">
        Already have an account? <Link className="font-semibold text-emerald-700" to="/login">Sign In</Link>
      </p>
    </div>
  );
}

function Input({ label, error, icon, ...props }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-slate-700">{label}</label>
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">{icon}</span>
        <input {...props} onChange={(e) => props.onChange(e.target.value)} className="h-11 w-full rounded-xl border border-slate-200 pl-11 pr-4 text-sm outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10" />
      </div>
      {error && <p className="mt-1 text-xs font-medium text-red-600">{error}</p>}
    </div>
  );
}

function PasswordInput({ label, error, placeholder, value, visible, onToggle, onChange }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-slate-700">{label}</label>
      <div className="relative">
        <LockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input type={visible ? 'text' : 'password'} placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} className="h-11 w-full rounded-xl border border-slate-200 pl-11 pr-12 text-sm outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10" />
        <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400" onClick={onToggle}>
          {visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {error && <p className="mt-1 text-xs font-medium text-red-600">{error}</p>}
    </div>
  );
}
