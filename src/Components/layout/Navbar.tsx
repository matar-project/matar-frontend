import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, LogIn, LogOut } from 'lucide-react';
import { useAuth } from '../../Hooks/auth/UseAuth';
import { getRoleRedirectPath } from '../../lib/roleRedirect';
import logoMark from '../../assets/logo-mark.png';

const navLinks = [
  { to: '/', label: 'الرئيسية' },
  { to: '/about', label: 'عن مشروع مطر' },
  { to: '/contact', label: 'تواصل معنا' },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    setOpen(false);
    await logout();
    navigate('/');
  };

  const dashboardPath = user ? getRoleRedirectPath(user.role) : '/login';
  const canRequestHelp = user?.role === 'visually_impired';
  const logoPath = isAuthenticated ? dashboardPath : '/';
  const visibleNavLinks = [
    ...(isAuthenticated ? navLinks.slice(1, 2) : navLinks.slice(0, 2)),
    ...navLinks.slice(2),
  ];

  return (
    <header className="bg-primary-600 shadow-md sticky top-0 z-50" role="banner">
      <nav
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16"
        aria-label="التنقل الرئيسي"
      >
        {/* Logo */}
        <Link to={logoPath} className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-md">
          <img
            src={logoMark}
            alt="مشروع مطر"
            className="h-11 w-11 rounded-lg bg-white p-1 object-contain shadow-sm"
          />
          <span className="text-white font-bold text-lg hidden sm:inline">مشروع مطر</span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-1" role="list">
          {visibleNavLinks.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'text-primary-100 hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* CTA buttons — desktop */}
        <div className="hidden md:flex items-center gap-2">
          {canRequestHelp && (
            <Link
              to="/vi/requests"
              className="px-4 py-2 bg-secondary-500 text-white text-sm font-medium rounded-lg hover:bg-secondary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary-600 transition-colors"
            >
              اطلب مساعدة
            </Link>
          )}

          {isAuthenticated ? (
            <>
              <Link
                to={dashboardPath}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white border border-white/40 rounded-lg hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white transition-colors"
              >
                {user?.name}
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-primary-100 hover:text-white hover:bg-white/10 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white transition-colors"
                aria-label="تسجيل الخروج"
              >
                <LogOut size={16} aria-hidden="true" />
                خروج
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white border border-white/40 rounded-lg hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white transition-colors"
            >
              <LogIn size={16} aria-hidden="true" />
              تسجيل الدخول
            </Link>
          )}
        </div>

        {/* Mobile actions */}
        <div className="flex md:hidden items-center gap-2">
          {!isAuthenticated && (
            <Link
              to="/login"
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-white border border-white/40 rounded-lg hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white transition-colors"
            >
              <LogIn size={16} aria-hidden="true" />
              تسجيل الدخول
            </Link>
          )}
          <button
            type="button"
            className="p-2 rounded-md text-primary-100 hover:text-white hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            aria-controls="mobile-menu"
            aria-expanded={open}
            aria-label={open ? 'إغلاق القائمة' : 'فتح القائمة'}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div id="mobile-menu" className="md:hidden border-t border-white/20 bg-primary-700">
          <ul className="px-4 py-3 space-y-1" role="list">
            {visibleNavLinks.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.to === '/'}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'text-primary-100 hover:bg-white/10 hover:text-white'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
            {canRequestHelp && (
              <li>
                <Link
                  to="/vi/requests"
                  onClick={() => setOpen(false)}
                  className="block px-3 py-2 mt-2 bg-secondary-500 text-white text-base font-medium rounded-lg text-center"
                >
                  اطلب مساعدة
                </Link>
              </li>
            )}
            {isAuthenticated && (
              <li>
                <div className="space-y-1 pt-1 border-t border-white/20 mt-2">
                  <Link
                    to={dashboardPath}
                    onClick={() => setOpen(false)}
                    className="block px-3 py-2 text-base font-medium text-primary-100 hover:bg-white/10 hover:text-white rounded-md"
                  >
                    لوحة التحكم ({user?.name})
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-3 py-2 text-base font-medium text-red-300 hover:bg-red-500/20 hover:text-red-100 rounded-md"
                  >
                    <LogOut size={16} aria-hidden="true" />
                    تسجيل الخروج
                  </button>
                </div>
              </li>
            )}
          </ul>
        </div>
      )}
    </header>
  );
}
