import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebase';
import { useNavigate, Link } from 'react-router-dom';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {  
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('/'); 
    } catch (err: any) {
      setError('Неверный логин или пароль');
      console.error('Ошибка регистрации:', err);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-slate-100 transition-colors duration-300">
      <h2 className="text-2xl font-bold mb-6 text-center">Регистрация</h2>
      <form onSubmit={handleRegister} className="space-y-4">
        <input 
          type="email" 
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-950 rounded-2xl text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none transition-colors duration-200"
        />
        <input 
          type="password" 
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-950 rounded-2xl text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none transition-colors duration-200"
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button className="w-full bg-blue-600 text-white py-2 rounded">Зарегистрироваться</button>
      </form>
      
      <p className="mt-4 text-center text-sm">
        Уже есть аккаунт? <Link to="/login" className="text-blue-600 dark:text-blue-400 underline">Войти</Link>
      </p>
    </div>
  );
};

export default RegisterPage;