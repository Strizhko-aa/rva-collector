import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  // Пока Firebase проверяет токен (loading: true), не делаем редирект
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-slate-950">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Если загрузка завершена и юзера нет — на выход
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Если юзер есть — показываем контент (Outlet)
  return <Outlet />;
};

export default ProtectedRoute;