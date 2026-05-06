import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';
import { AuthProvider } from './context/AuthContext';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import AddTrophyPage from './pages/AddTrophyPage';
import ProtectedRoute from './components/ProtectedRoute';
import TrophyDetailsPage from './pages/TrophyDetailsPage';

function App() {
  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-slate-900 dark:text-gray-100 transition-colors duration-300">
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              {/* ОТКРЫТЫЕ РОУТЫ */}
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
              <Route path="*" element={<NotFoundPage />} />

              {/* ЗАКРЫТЫЕ РОУТЫ (Группировка) */}
              <Route element={<ProtectedRoute />}>
                <Route index element={<HomePage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="add" element={<AddTrophyPage />} />
                <Route path="trophy/:id" element={<TrophyDetailsPage />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;