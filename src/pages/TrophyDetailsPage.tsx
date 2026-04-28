// src/pages/TrophyDetailsPage.tsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTrophyDetailsUseCase, type TrophyDetailsDTO } from '../use-cases/getTrophyDetails.use-case';
import TrophyMapView from '../components/TrophyMapView';
import { getAvatar, getThumbnail } from '../utils/cloudinary';

const TrophyDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [trophy, setTrophy] = useState<TrophyDetailsDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [activePhoto, setActivePhoto] = useState(0);

  useEffect(() => {
    const loadTrophy = async () => {
      if (!id) return;
      const data = await getTrophyDetailsUseCase(id);
      if (data) {
        setTrophy(data);
      } else {
        navigate('/');
      }
      setLoading(false);
    };
    loadTrophy();
  }, [id, navigate]);

  if (loading) return <div className="text-center p-20 text-gray-400">Считывание данных...</div>;
  if (!trophy) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Кнопка Назад */}
      <button 
        onClick={() => navigate(-1)} 
        className="text-gray-400 hover:text-blue-600 flex items-center gap-2 transition-colors"
      >
        ← Назад к ленте
      </button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* ЛЕВАЯ КОЛОНКА: Профиль автора, Номер и Галерея */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-50 space-y-6 self-start sticky top-24">
             
             {/* БЛОК АВТОРА (Новое) */}
             <div className="flex items-center gap-4 pb-2">
                <div className="w-14 h-14 rounded-full overflow-hidden border-4 border-white shadow-md flex-shrink-0 bg-gray-100">
                  {trophy.authorPhoto ? (
                    <img src={getAvatar(trophy.authorPhoto, 120)} className="w-full h-full object-cover" alt={trophy.authorName} />
                  ) : (
                    <div className="w-full h-full bg-blue-500 flex items-center justify-center text-white text-xl font-bold">
                      {trophy.authorName?.[0] || 'О'}
                    </div>
                  )}
                </div>
                <div className="overflow-hidden">
                  <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest leading-none mb-1">Охотник</p>
                  <p className="text-lg font-bold text-gray-800 truncate">{trophy.authorName || 'Аноним'}</p>
                </div>
             </div>

             {/* Номерной знак */}
             <div className="py-4 border-y border-gray-100 flex justify-center">
                {!trophy.isNotFormat ? (
                  <div className="inline-flex items-center border-4 border-gray-800 rounded-lg px-3 py-1 font-mono bg-white shadow-sm">
                    <span className="text-4xl font-black text-gray-800">{trophy.number}</span>
                    <span className="ml-2 pl-2 border-l-2 border-gray-800 text-xl font-bold text-gray-800">{trophy.region}</span>
                  </div>
                ) : (
                  <div className="text-2xl font-mono font-black text-blue-600 break-words text-center">
                    {trophy.numberNotFormat}
                  </div>
                )}
             </div>

             {/* Метаданные */}
             <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Дата поимки:</span>
                  <span className="font-medium text-right text-gray-700">{trophy.formattedDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">ID Охотника:</span>
                  <span className="font-mono text-[10px] text-blue-500">#{trophy.userId.slice(-12)}</span>
                </div>
                {trophy.hasLocation && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Координаты:</span>
                    <span className="font-mono text-[10px] text-gray-600">
                      {trophy.location!.lat.toFixed(4)}, {trophy.location!.lng.toFixed(4)}
                    </span>
                  </div>
                )}
             </div>
             
             {/* Миниатюры галереи */}
             <div className="pt-4 border-t border-gray-100 space-y-3">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Фотографии ({trophy.photos.length})</p>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {trophy.photos.map((p, i) => (
                    <button 
                      key={i} 
                      onClick={() => setActivePhoto(i)} 
                      className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                        activePhoto === i ? 'border-blue-500 scale-95 shadow-inner' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={getThumbnail(p.url, 100, 100)} className="w-full h-full object-cover" alt={`Снимок ${i + 1}`} />
                    </button>
                  ))}
                </div>
             </div>
          </div>
        </div>

        {/* ПРАВАЯ КОЛОНКА: Главное Фото и Карта */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Главное фото */}
          <div 
            className="group relative aspect-video rounded-[2rem] overflow-hidden bg-gray-100 shadow-xl flex items-center justify-center cursor-zoom-in border border-gray-100" 
            onClick={() => window.open(trophy.photos[activePhoto].url, '_blank')}
          >
            <img 
              src={getThumbnail(trophy.photos[activePhoto].url, 1200, 800)} 
              className="max-w-full max-h-full object-contain transition-transform duration-500 group-hover:scale-[1.02]" 
              alt="Основное фото трофея"
            />
            <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-md text-white text-[10px] px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
              Открыть оригинал ↗
            </div>
          </div>

          {/* Большая, интерактивная Яндекс Карта */}
          {trophy.hasLocation && trophy.location ? (
            <div className="bg-white p-2 rounded-[2rem] shadow-lg border border-gray-50 h-[50vh] overflow-hidden">
              <TrophyMapView location={trophy.location} />
            </div>
          ) : (
            <div className="text-center p-12 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200 text-gray-400">
                <div className="text-3xl mb-2">📍</div>
                Координаты для этого трофея не были указаны.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrophyDetailsPage;