// src/components/MainLayout.tsx
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 transition-colors duration-500"> {/* Мягкий фоновый цвет */}
      {/* Наш новый стильный хедер */}
      <Header />

      {/* Контент страниц */}
      <main className="mx-auto max-w-7xl px-4 pt-28 pb-10">
        <Outlet />
      </main>

      {/* Можно добавить простой футер */}
      <footer className="py-10 text-center text-gray-400 dark:text-slate-400 text-xs font-mono uppercase tracking-widest">
        &copy; 2026 RVA Hunter Crew • Born to Spot
      </footer>
    </div>
  );
};

export default MainLayout;