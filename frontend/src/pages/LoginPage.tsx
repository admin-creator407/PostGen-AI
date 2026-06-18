import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginUser } from '../api/auth';
import Toast, { ToastMessage } from '../components/Toast';
import { ArrowRight } from 'lucide-react';

const LoginPage: React.FC = () => {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors]     = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [toasts, setToasts]     = useState<ToastMessage[]>([]);

  const { login } = useAuth();
  const navigate  = useNavigate();

  const addToast = (message: string, type: 'success' | 'error') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
  };
  const removeToast = (id: string) =>
    setToasts((prev) => prev.filter((t) => t.id !== id));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!email)                            e.email    = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(email)) e.email  = 'Enter a valid email';
    if (!password)                          e.password = 'Password is required';
    else if (password.length < 6)           e.password = 'At least 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    try {
      const response = await loginUser({ email, password });
      login(response);
      addToast('Welcome back!', 'success');
      setTimeout(() => navigate('/'), 900);
    } catch (err: any) {
      addToast(err.response?.data?.message || 'Login failed. Check your credentials.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-page flex">
      {/* ── Left panel (decorative) ── */}
      <div className="hidden lg:flex flex-col justify-between w-[420px] shrink-0 bg-surface border-r border-theme p-12">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shadow-md">
            <span className="text-white font-bold text-sm">P</span>
          </div>
          <span className="font-bold text-sm tracking-tight" style={{ color: 'var(--text-primary)' }}>
            PostGen <span className="text-indigo-500">AI</span>
          </span>
        </div>

        <div>
          <blockquote className="text-xl font-medium leading-relaxed mb-6" style={{ color: 'var(--text-primary)' }}>
            "I went from spending 30 minutes on each LinkedIn post to under 2 minutes. PostGen AI is a game changer."
          </blockquote>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500/60 to-violet-500/60 flex items-center justify-center text-xs font-bold text-white">
              JS
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Jamie S.</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Product Manager at Vercel</p>
            </div>
          </div>
        </div>

        <p className="text-xs" style={{ color: 'var(--text-faint)' }}>© 2025 PostGen AI. All rights reserved.</p>
      </div>

      {/* Form*/}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm animate-slide-up">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-10 lg:hidden">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center">
              <span className="text-white font-bold text-xs">P</span>
            </div>
            <span className="font-bold text-sm tracking-tight" style={{ color: 'var(--text-primary)' }}>
              PostGen <span className="text-indigo-500">AI</span>
            </span>
          </div>

          <h2 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Welcome back</h2>
          <p className="text-sm mb-8" style={{ color: 'var(--text-muted)' }}>
            Sign in to continue creating great LinkedIn content.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>
                Email
              </label>
              <input
                id="email"
                type="email"
                className={`input-base h-11 ${errors.email ? 'input-error' : ''}`}
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                autoComplete="email"
              />
              {errors.email && (
                <p className="text-xs text-rose-500 mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>
                Password
              </label>
              <input
                id="password"
                type="password"
                className={`input-base h-11 ${errors.password ? 'input-error' : ''}`}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                autoComplete="current-password"
              />
              {errors.password && (
                <p className="text-xs text-rose-500 mt-1">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary w-full h-11 text-sm mt-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4 ml-auto" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm mt-6" style={{ color: 'var(--text-muted)' }}>
            Don't have an account?{' '}
            <Link to="/register" className="text-indigo-500 hover:text-indigo-600 font-medium transition-colors">
              Create one free
            </Link>
          </p>
        </div>
      </div>

      <Toast toasts={toasts} onClose={removeToast} />
    </div>
  );
};

export default LoginPage;
