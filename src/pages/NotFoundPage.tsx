import { Link, useLocation } from "react-router-dom";

const NotFoundPage = () => {
  // Получаем объект location, который содержит информацию о текущем пути
  const location = useLocation();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center py-20 text-center text-gray-900 dark:text-slate-100">
      <h1 className="text-6xl font-bold text-gray-900 dark:text-slate-100 mb-4">404</h1>
      <p className="text-xl text-gray-600 dark:text-slate-400 mb-8">
        Упс! Страница <code className="bg-gray-100 dark:bg-slate-800 px-2 py-1 rounded text-red-500 font-mono">"{location.pathname}"</code> не найдена.
      </p>
      <Link 
        to="/" 
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Вернуться на главную
      </Link>
    </div>
  );
};

export default NotFoundPage;