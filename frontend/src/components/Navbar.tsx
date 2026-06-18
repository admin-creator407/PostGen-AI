import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  Sparkles,
  PenLine,
  GalleryHorizontal,
  Clock3,
  Star,
  Sun,
  Moon,
  LogOut,
  UserRound,
  ChevronDown,
} from 'lucide-react';

const NAV_LINKS = [
  { to: '/',          label: 'Generate',  icon: Sparkles,         end: true },
  { to: '/rewrite',   label: 'Rewrite',   icon: PenLine,          end: false },
  { to: '/carousel',  label: 'Carousel',  icon: GalleryHorizontal,end: false },
  { to: '/history',   label: 'History',   icon: Clock3,           end: false },
  { to: '/favorites', label: 'Favorites', icon: Star,             end: false },
];

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // cosing the dropdown
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    setMenuOpen(false);
    logout();
    navigate('/login');
  };

  const initials = user?.name
    ? user.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
    : 'U';

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 h-[56px] flex items-center"
      style={{
        background: 'var(--nav-bg)',
        borderBottom: '1px solid var(--nav-border)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      }}
    >
      <div className="w-full max-w-[1200px] mx-auto px-5 flex items-center gap-4">

        {/* ── Brand ── */}
        <NavLink to="/" className="flex items-center gap-2 mr-4 shrink-0 group" end>
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand to-accent flex items-center justify-center shadow-[0_2px_8px_rgba(99,102,241,0.35)] group-hover:shadow-[0_4px_14px_rgba(99,102,241,0.45)] transition-shadow">
            <span className="text-white font-bold text-xs">P</span>
          </div>
          <span className="font-bold text-[14px] tracking-tight hidden sm:block" style={{ color: 'var(--text-primary)' }}>
            PostGen <span className="text-brand">AI</span>
          </span>
        </NavLink>

        {/* Nav links */}
        <nav className="flex items-center gap-0.5 flex-1 overflow-x-auto no-scrollbar">
          {NAV_LINKS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `nav-link ${isActive ? 'nav-link-active font-semibold' : ''}`
              }
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/*Right controls*/}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="btn btn-ghost w-8 h-8 rounded-lg p-0 flex items-center justify-center"
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
            )}
          </button>

          {/* Avatar dropdown */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="flex items-center gap-1.5 pl-1 pr-2 py-1 rounded-lg hover:bg-surface transition-colors"
            >
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white"
                style={{
                  background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                }}
              >
                {initials}
              </div>
              <ChevronDown
                className="w-3.5 h-3.5 transition-transform"
                style={{
                  color: 'var(--text-faint)',
                  transform: menuOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                }}
              />
            </button>

            {/* Dropdown menu */}
            {menuOpen && (
              <div
                className="absolute right-0 top-full mt-2 w-52 rounded-xl border overflow-hidden shadow-xl animate-scale-in"
                style={{
                  background: 'var(--surface)',
                  borderColor: 'var(--border-strong)',
                  boxShadow: isDark
                    ? '0 8px 30px rgba(0,0,0,0.5)'
                    : '0 8px 30px rgba(0,0,0,0.12)',
                }}
              >
                {/* User info */}
                <div
                  className="px-4 py-3 border-b"
                  style={{ borderColor: 'var(--border)' }}
                >
                  <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                    {user?.name || 'User'}
                  </p>
                  <p className="text-xs truncate mt-0.5" style={{ color: 'var(--text-faint)' }}>
                    {user?.email || ''}
                  </p>
                </div>

                {/* Menu items */}
                <div className="p-1.5">
                  <button
                    onClick={() => { setMenuOpen(false); navigate('/profile'); }}
                    className="btn btn-ghost w-full justify-start gap-2.5 px-3 py-2 rounded-lg text-sm font-medium"
                  >
                    <UserRound className="w-4 h-4" />
                    Profile
                  </button>
                  <div className="h-px my-1" style={{ background: 'var(--border)' }} />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Log out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
