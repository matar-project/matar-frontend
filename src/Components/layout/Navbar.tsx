import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, LogIn, LogOut } from 'lucide-react';
import { useAuth } from '../../Hooks/auth/UseAuth';
import { getRoleRedirectPath } from '../../lib/roleRedirect';
import logo from '../../assets/logo.png';

const navLinks = [
  { to: '/', label: 'الرئيسية' },
  { to: '/about', label: 'عن مطر' },
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
    <header className="bg-white shadow-sm sticky top-0 z-50" role="banner">
      <nav
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16"
        aria-label="التنقل الرئيسي"
      >
        {/* Logo */}
        <Link to={logoPath} className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 rounded-md">
          <img src={logo} alt="مشروع مطر" className="h-10 w-auto" />
          <span className="text-primary-700 font-bold text-lg hidden sm:inline">مشروع مطر</span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-1" role="list">
          {visibleNavLinks.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 ${
                    isActive
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
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
              className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 transition-colors"
            >
              اطلب مساعدة
            </Link>
          )}

          {isAuthenticated ? (
            <>
              <Link
                to={dashboardPath}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 transition-colors"
              >
                {user?.name}
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 transition-colors"
                aria-label="تسجيل الخروج"
              >
                <LogOut size={16} aria-hidden="true" />
                خروج
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 transition-colors"
            >
              <LogIn size={16} aria-hidden="true" />
              تسجيل الدخول
            </Link>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600"
          aria-controls="mobile-menu"
          aria-expanded={open}
          aria-label={open ? 'إغلاق القائمة' : 'فتح القائمة'}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div id="mobile-menu" className="md:hidden border-t border-gray-200 bg-white">
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
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-600 hover:bg-gray-100'
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
                  className="block px-3 py-2 mt-2 bg-primary-600 text-white text-base font-medium rounded-lg text-center"
                >
                  اطلب مساعدة
                </Link>
              </li>
            )}
            <li>
              {isAuthenticated ? (
                <div className="space-y-1 pt-1 border-t border-gray-100 mt-2">
                  <Link
                    to={dashboardPath}
                    onClick={() => setOpen(false)}
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                  >
                    لوحة التحكم ({user?.name})
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50 rounded-md"
                  >
                    <LogOut size={16} aria-hidden="true" />
                    تسجيل الخروج
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 mt-1 text-base font-medium text-gray-700 border border-gray-300 rounded-lg"
                >
                  <LogIn size={16} aria-hidden="true" />
                  تسجيل الدخول
                </Link>
              )}
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
