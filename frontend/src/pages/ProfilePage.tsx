import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { UserRound, Mail, LogOut, CalendarDays } from 'lucide-react';

const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user?.name
    ? user.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
    : 'U';

  const joinDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, {
        month: 'long',
        year: 'numeric',
      })
    : null;

  return (
    <div className="max-w-[420px] mx-auto px-5 py-16 animate-fade-in">
      {/* Avatar */}
      <div className="flex flex-col items-center text-center mb-10">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-2xl font-bold text-white shadow-lg mb-5">
          {initials}
        </div>
        <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
          {user?.name || 'User'}
        </h1>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          {user?.email || ''}
        </p>
      </div>

      {/* Info Card */}
      <div className="card overflow-hidden shadow-sm mb-5">
        <div className="flex items-center gap-4 px-5 py-4 border-b border-theme">
          <div className="w-8 h-8 rounded-lg bg-surface-2 border border-theme flex items-center justify-center shrink-0">
            <UserRound className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-wider mb-0.5" style={{ color: 'var(--text-faint)' }}>Name</p>
            <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{user?.name || '—'}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 px-5 py-4 border-b border-theme">
          <div className="w-8 h-8 rounded-lg bg-surface-2 border border-theme flex items-center justify-center shrink-0">
            <Mail className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-wider mb-0.5" style={{ color: 'var(--text-faint)' }}>Email</p>
            <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{user?.email || '—'}</p>
          </div>
        </div>

        {joinDate && (
          <div className="flex items-center gap-4 px-5 py-4">
            <div className="w-8 h-8 rounded-lg bg-surface-2 border border-theme flex items-center justify-center shrink-0">
              <CalendarDays className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider mb-0.5" style={{ color: 'var(--text-faint)' }}>Joined</p>
              <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{joinDate}</p>
            </div>
          </div>
        )}
      </div>

      {/*  Logout */}
      <button
        onClick={handleLogout}
        className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl card text-rose-500 hover:bg-rose-500/5 hover:border-rose-500/20 transition-all text-sm font-medium"
      >
        <LogOut className="w-4 h-4" />
        Log out
      </button>
    </div>
  );
};

export default ProfilePage;
