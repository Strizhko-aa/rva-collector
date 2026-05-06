import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateProfileUseCase } from '../use-cases/updateProfile.use-case';
// import { adminService } from '../services/admin.service';

const ProfilePage = () => {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  // const [syncing, setSyncing] = useState(false);
  // const [syncMessage, setSyncMessage] = useState('');

  // const handleSync = async () => {
  //   if (!user) return;
  //   setSyncing(true);
  //   setSyncMessage('');
    
  //   try {
  //     const displayName = user.displayName || user.email?.split('@')[0] || 'Охотник';
  //     const count = await adminService.syncUserTrophies(user.uid, user.photoURL, displayName);
  //     setSyncMessage(`Успешно! Обновлено трофеев: ${count}`);
  //   } catch (err) {
  //     console.error(err);
  //     setSyncMessage('Ошибка при синхронизации');
  //   } finally {
  //     setSyncing(false);
  //   }
  // };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setUploading(true);
      try {
        await updateProfileUseCase(e.target.files[0]);
        // После этого AuthContext должен обновиться автоматически, 
        // так как Firebase отслеживает состояние юзера
      } catch (err) {
        console.error(err)
        alert("Ошибка при смене аватара");
      } finally {
        setUploading(false);
      }
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 text-center bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 rounded-3xl shadow-xl border border-gray-100 dark:border-slate-700 transition-colors duration-300">
      <div className="relative inline-block group">
        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-200 dark:bg-slate-700">
          {user?.photoURL ? (
            <img src={user.photoURL} className="w-full h-full object-cover" alt="Avatar" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl bg-blue-100 text-blue-500 font-bold">
              {user?.email?.[0].toUpperCase()}
            </div>
          )}
        </div>
        
        <label className="absolute inset-0 flex items-center justify-center bg-black/40 text-white rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
          <input type="file" className="hidden" onChange={handleAvatarChange} disabled={uploading} />
          <span className="text-xs font-bold">{uploading ? '...' : 'ИЗМЕНИТЬ'}</span>
        </label>
      </div>
      
      <h2 className="mt-4 text-xl font-bold">{user?.email}</h2>

      {/* --- ADMIN SECTION --- */}
      {/* <div className="mt-12 p-6 border-2 border-dashed border-gray-200 rounded-3xl bg-gray-50/50">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xl">🛠️</span>
          <h3 className="font-bold text-gray-700">Инструменты разработчика</h3>
        </div>
        
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-bold text-gray-800">Синхронизация контента</p>
              <p className="text-xs text-gray-500">Обновит ваше фото и имя во всех ваших трофеях</p>
            </div>
            <button 
              onClick={handleSync}
              disabled={syncing}
              className={`px-6 py-2 rounded-xl font-bold text-sm transition-all ${
                syncing 
                ? 'bg-gray-100 text-gray-400' 
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md active:scale-95'
              }`}
            >
              {syncing ? 'Синхронизация...' : 'Запустить'}
            </button>
          </div>

          {syncMessage && (
            <p className="text-center text-xs font-medium text-blue-600 animate-pulse">
              {syncMessage}
            </p>
          )}
        </div>
      </div> */}
    </div>
  );
};

export default ProfilePage;