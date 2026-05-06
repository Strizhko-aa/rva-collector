// src/pages/TrophyDetailsPage.tsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTrophyDetailsUseCase, type TrophyDetailsDTO } from '../use-cases/getTrophyDetails.use-case';
import TrophyMapView from '../components/TrophyMapView';
import type { Observation } from '../types'; // Импортируем тип наблюдения

const TrophyDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [trophy, setTrophy] = useState<TrophyDetailsDTO | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Состояние теперь хранит ВЕСЬ объект наблюдения
  const [activeObservation, setActiveObservation] = useState<Observation | null>(null);

  useEffect(() => {
    const loadTrophy = async () => {
      if (!id) return;
      try {
        const data = await getTrophyDetailsUseCase(id);
        if (data) {
          setTrophy(data);
          // Устанавливаем первое наблюдение как активное по умолчанию
          if (data.observations && data.observations.length > 0) {
            setActiveObservation(data.observations[0]);
          }
        } else {
          navigate('/');
        }
      } catch (error) {
        console.error("Ошибка при загрузке:", error);
      } finally {
        setLoading(false);
      }
    };
    loadTrophy();
  }, [id, navigate]);

  if (loading) return <div className="text-center p-20 text-gray-400 dark:text-slate-500">Считывание истории трофея...</div>;
  if (!trophy || !activeObservation) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <button 
        onClick={() => navigate(-1)} 
        className="text-gray-400 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-300 flex items-center gap-2 transition-colors font-bold"
      >
        ← Назад к ленте
      </button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* ЛЕВАЯ КОЛОНКА: Номер и История поимок */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700 space-y-6">
             
             {/* Номерной знак */}
             <div className="py-4 border-b border-gray-100 flex justify-center">
                {!trophy.isNotFormat ? (
                  <div className="inline-flex items-center border-4 border-gray-800 rounded-lg px-3 py-1 font-mono bg-white dark:bg-slate-900">
                    <span className="text-4xl font-black text-gray-800 dark:text-slate-200">{trophy.number}</span>
                    <span className="ml-2 pl-2 border-l-2 border-gray-800 dark:border-slate-500 text-xl font-bold text-gray-800 dark:text-slate-200">{trophy.region}</span>
                  </div>
                ) : (
                  <div className="text-2xl font-mono font-black text-blue-600 text-center uppercase tracking-tighter">
                    {trophy.numberNotFormat}
                  </div>
                )}
             </div>

             {/* Список наблюдений */}
             <div className="space-y-3">
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">История поимок ({trophy.observations.length})</p>
                <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                  {trophy.observations.map((obs, i) => {
                    const isActive = activeObservation.url === obs.url;
                    return (
                      <div 
                        key={i} 
                        onClick={() => setActiveObservation(obs)} 
                        className={`p-3 rounded-2xl cursor-pointer transition-all border-2 ${
                          activeObservation.url === obs.url ? 'bg-blue-50 dark:bg-slate-900/70 border-blue-200 dark:border-blue-300/40' : 'border-transparent'
                        }`}
                      >
                        <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-gray-200">
                          <img src={obs.url} className="w-full h-full object-cover" alt="" />
                        </div>
                        <div className="overflow-hidden">
                          <p className={`text-sm font-bold truncate ${isActive ? 'text-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-slate-200'}`}>
                            {obs.authorName}
                          </p>
                          <p className="text-[10px] text-gray-400 dark:text-slate-500 font-medium">
                            {new Date(obs.capturedAt).toLocaleDateString()} {obs.lat ? '📍' : ''}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
             </div>
          </div>
        </div>

        {/* ПРАВАЯ КОЛОНКА: Фото и Карта */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Главное фото активного наблюдения */}
          <div className="relative aspect-video rounded-[2.5rem] overflow-hidden bg-gray-900 shadow-2xl border border-gray-100 dark:border-slate-700 group">
            <img 
              src={activeObservation.url} 
              className="w-full h-full object-contain" 
              alt="Trophy active observation"
            />
            {/* Overlay с данными конкретного фото */}
            <div className="absolute bottom-6 left-6 bg-black/40 backdrop-blur-md text-white p-4 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
               <p className="text-xs font-black uppercase opacity-60">Зафиксировал</p>
               <p className="font-bold text-lg">{activeObservation.authorName}</p>
               <p className="text-xs opacity-80">{new Date(activeObservation.capturedAt).toLocaleString()}</p>
            </div>
          </div>

          {/* Карта со всеми точками */}
          <div className="bg-white dark:bg-slate-800 p-2 rounded-[2.5rem] shadow-lg border border-gray-100 dark:border-slate-700 h-[45vh] overflow-hidden">
            <TrophyMapView 
              observations={trophy.observations} 
              // Если у активного наблюдения есть гео — передаем его для FlyTo
              focusedLocation={activeObservation.lat && activeObservation.lng 
                ? { lat: activeObservation.lat, lng: activeObservation.lng } 
                : null
              } />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrophyDetailsPage;