import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  PenLine,
  GalleryHorizontal,
  Clock3,
  Star,
  UserRound,
  LogOut,
} from 'lucide-react';

const navItems = [
  { to: '/',           label: 'Generate',  icon: Sparkles,          hint: '✨' },
  { to: '/rewrite',   label: 'Rewrite',   icon: PenLine,            hint: '✏️' },
  { to: '/carousel',  label: 'Carousel',  icon: GalleryHorizontal,  hint: '🎠' },
  { to: '/history',   label: 'History',   icon: Clock3,             hint: '📚' },
  { to: '/favorites', label: 'Favorites', icon: Star,               hint: '⭐' },
];

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    setTimeout(() => {
      logout();
      navigate('/login');
    }, 300);
  };

  const initials = user?.name
    ? user.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
    : 'U';

  return (
    <aside className="w-[220px] flex flex-col justify-between shrink-0 h-screen sticky top-0 border-r border-border bg-surface">
      {/* ── Brand ── */}
      <div>
        <div className="h-[60px] flex items-center gap-2.5 px-5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand to-accent flex items-center justify-center shadow-glow shrink-0">
            <span className="text-white font-bold text-xs">P</span>
          </div>
          <div className="leading-none">
            <span className="font-bold text-sm tracking-tight text-zinc-100">PostGen</span>
            <span className="font-bold text-sm tracking-tight text-brand ml-1">AI</span>
          </div>
        </div>

        {/* ── Navigation ── */}
        <nav className="px-3 pt-1 flex flex-col gap-0.5">
          <p className="px-3 text-[10px] font-semibold uppercase tracking-widest text-zinc-600 mb-2 mt-1">
            Create
          </p>
          {navItems.slice(0, 3).map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `nav-item ${isActive ? 'nav-item-active' : ''}`
              }
            >
              <Icon className="w-4 h-4 shrink-0 opacity-80" />
              <span>{label}</span>
            </NavLink>
          ))}

          <p className="px-3 text-[10px] font-semibold uppercase tracking-widest text-zinc-600 mb-2 mt-4">
            Library
          </p>
          {navItems.slice(3).map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `nav-item ${isActive ? 'nav-item-active' : ''}`
              }
            >
              <Icon className="w-4 h-4 shrink-0 opacity-80" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* ── Profile / Logout ── */}
      <div className="px-3 pb-4 flex flex-col gap-1">
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `nav-item ${isActive ? 'nav-item-active' : ''}`
          }
        >
          <UserRound className="w-4 h-4 shrink-0 opacity-80" />
          <span>Profile</span>
        </NavLink>

        <div className="border-t border-border mt-2 pt-3 px-1">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand/60 to-accent/60 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-zinc-200 truncate">{user?.name || 'User'}</p>
              <p className="text-[10px] text-zinc-600 truncate">{user?.email || ''}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="nav-item w-full text-zinc-600 hover:text-rose-400 hover:bg-rose-500/5"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Log out</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
