// src/components/Header.tsx
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAvatar } from '../utils/cloudinary';
import { useTheme } from '../context/ThemeContext';

// src/components/Header.tsx
const Header = () => {
  const { user } = useAuth();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="absolute top-0 left-0 right-0 z-50">
      <div className="mx-auto max-w-7xl px-4 pt-4">
        {/* Навбар: меняем прозрачность и цвета для темной темы */}
        <nav className="flex items-center justify-between rounded-[2rem] border border-white/50 bg-white/25 px-6 py-2.5 shadow-xl backdrop-blur-xl transition-all dark:border-white/10 dark:bg-slate-900/40" 
             style={{ backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}>
          
          {/* LOGO: dark:text-white */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-blue-200 shadow-lg group-hover:rotate-12 transition-transform">
              <span className="text-xl font-black">R</span>
            </div>
            <span className="hidden text-xl font-black tracking-tighter text-gray-800 dark:text-white sm:block">
              RVA<span className="text-blue-600">HUNTER</span>
            </span>
          </Link>

          {/* NAV LINKS: dark:text-gray-300 */}
          <div className="flex items-center gap-1 sm:gap-2">
            <Link 
              to="/" 
              className={`rounded-2xl px-4 py-2 text-sm font-bold transition-all ${
                isActive('/') 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-gray-500 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-white/10'
              }`}
            >
              Лента
            </Link>
            <Link 
              to="/add" 
              className={`rounded-2xl px-4 py-2 text-sm font-bold transition-all ${
                isActive('/add') 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-gray-500 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-white/10'
              }`}
            >
              Добавить
            </Link>
          </div>

          {/* Кнопка темы: dark стили */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button 
              className="flex items-center gap-3 bg-white/90 dark:bg-slate-800 dark:border-gray-700 backdrop-blur-md px-5 py-3 rounded-2xl shadow-xl border border-white hover:scale-105 active:scale-95 transition-all" 
              onClick={toggleTheme}
            >
              { theme === 'light' ? "🌞" : "🌜" }
            </button>
          </div>

          {/* USER PROFILE: dark:bg-slate-800 */}
          <Link to="/profile" className="group relative flex-shrink-0">
            <div className="h-10 w-10 overflow-hidden rounded-full border-2 border-white/80 bg-white/20 dark:bg-slate-800 shadow-sm transition-all group-hover:ring-2 group-hover:ring-blue-400">
              {user?.photoURL ? (
                <img src={getAvatar(user.photoURL, 80)} className="h-full w-full object-cover" alt="Profile" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gray-400 dark:bg-gray-600 text-white text-xs font-bold">
                  {user?.email?.[0].toUpperCase()}
                </div>
              )}
            </div>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;