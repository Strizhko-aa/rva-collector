// src/pages/AddTrophyPage.tsx
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import exifr from 'exifr';
import LocationPicker from '../components/LocationPicker'; 
import { createTrophyUseCase } from '../use-cases/createTrophy.use-case';
import ProgressButton from '../components/progressButton';

const VORONEZH_COORDS = { lat: 51.6608, lng: 39.2003 };

const PhotoZoomModal = ({ url, onClose }: { url: string; onClose: () => void }) => (
  <div 
    className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in"
    onClick={onClose}
  >
    <div className="relative max-w-7xl max-h-screen">
      <img src={url} className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl" alt="Zoom" />
      <button 
        onClick={(e) => { e.stopPropagation(); onClose(); }} 
        className="absolute top-4 right-4 bg-white/20 text-white p-3 rounded-full hover:bg-white/40 transition-colors"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
    </div>
  </div>
);

const AddTrophyPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [capturedAt, setCapturedAt] = useState<number | null>(null);

  const [useLocation, setUseLocation] = useState(true);
  const [location, setLocation] = useState<{lat: number, lng: number}>(VORONEZH_COORDS);
  const [zoomedPhoto, setZoomedPhoto] = useState<string | null>(null);

  const [isNotFormat, setIsNotFormat] = useState(false);
  const [number, setNumber] = useState('');
  const [region, setRegion] = useState('');
  const [numberNotFormat, setNumberNotFormat] = useState('');

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    return () => previews.forEach(url => URL.revokeObjectURL(url));
  }, [previews]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setImageFiles(filesArray);
      previews.forEach(url => URL.revokeObjectURL(url));
      const newPreviews = filesArray.map(file => URL.createObjectURL(file));
      setPreviews(newPreviews);

      try {
        // --- ВОЗВРАЩАЕМ ДАТУ СЪЕМКИ ---
        const metadata = await exifr.parse(filesArray[0]);
        if (metadata?.DateTimeOriginal) {
          const photoDate = new Date(metadata.DateTimeOriginal).getTime();
          setCapturedAt(photoDate);
          console.log("Дата из EXIF сохранена:", new Date(photoDate).toLocaleString());
        }

        // --- GPS ---
        const gps = await exifr.gps(filesArray[0]);
        if (gps?.latitude && gps?.longitude) {
          setLocation({ lat: gps.latitude, lng: gps.longitude });
          setUseLocation(true);
        }
      } catch (err) { 
        console.error("EXIF Error:", err); 
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || imageFiles.length === 0) return alert('Добавьте фото!');
    
    setLoading(true);
    setProgress(0); // Сброс перед началом

    try {
      await createTrophyUseCase({
        number, region, numberNotFormat, isNotFormat,
        imageFiles, userId: user.uid,
        location: useLocation ? location : null,
        capturedAt, // Теперь передается честная дата из стейта,
        onProgress: (p) => setProgress(p) // Ловим прогресс здесь
      });
      navigate('/');
    } catch (err) { 
      alert("Ошибка создания"); 
      console.error(err); 
    } finally { 
      setLoading(false); 
      setProgress(0);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-10">
      <h1 className="text-3xl font-black text-gray-800 uppercase italic tracking-tighter">Новый трофей</h1>
      
      <form onSubmit={handleSubmit} className="space-y-10">

        {/* 1. БЛОК ФОТО (Твой порядок) */}
        <div className="space-y-4">
          <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-2">
            Фотографии (кликом можно зазумить)
          </label>
          <label htmlFor="file-upload" className={`group relative flex flex-col items-center justify-center w-full rounded-3xl border-2 border-dashed transition-all cursor-pointer ${previews.length > 0 ? 'border-gray-200 bg-gray-50 h-32' : 'border-gray-300 bg-white h-48 hover:border-blue-400 hover:bg-blue-50/50'}`}>
            <input id="file-upload" type="file" multiple accept="image/*" onChange={handleFileChange} className="sr-only" />
            
            {previews.length === 0 && (
              <div className="flex flex-col items-center text-center px-4">
                <svg className="w-10 h-10 mb-3 text-gray-400 group-hover:text-blue-500 transition-colors" aria-hidden="true" fill="none" viewBox="0 0 20 16"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5.016 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/></svg>
                <p className="text-sm text-gray-700 font-bold">Нажми для выбора</p>
                <p className="text-xs text-gray-400 mt-1">PNG, JPG (с телефона для метаданных)</p>
              </div>
            )}
            
            {previews.length > 0 && (
              <div className="flex items-center gap-3 text-blue-600 font-bold text-sm">
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                 Выбрано {previews.length} фото {capturedAt && "• Дата найдена"}
              </div>
            )}
          </label>
        </div>

        {/* ГАЛЕРЕЯ */}
        {previews.length > 0 && (
          <div className="grid grid-cols-4 gap-3 p-3 bg-gray-50 rounded-2xl border border-gray-100">
            {previews.map((url, index) => (
              <div key={index} className="relative aspect-square rounded-xl overflow-hidden cursor-zoom-in group/photo" onClick={() => setZoomedPhoto(url)}>
                <img src={url} className="w-full h-full object-cover transition-transform duration-500 group-hover/photo:scale-110" alt="" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover/photo:opacity-100 transition-opacity">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"/></svg>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* 2. БЛОК НОМЕРА */}
        <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 space-y-5 transition-all duration-300">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🔢</span>
              <h2 className="text-xl font-bold text-gray-800">Госзнак</h2>
            </div>
            
            <label className="relative inline-flex items-center cursor-pointer group">
              <input 
                type="checkbox" 
                checked={isNotFormat}
                onChange={(e) => setIsNotFormat(e.target.checked)}
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              <span className="ml-3 text-xs font-bold text-gray-500 group-hover:text-gray-700 transition-colors whitespace-nowrap">Неформат</span>
            </label>
          </div>

          {!isNotFormat ? (
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-400 uppercase">№</span>
                <input placeholder="777" className="w-full pl-10 pr-4 py-3 bg-gray-50 border-none rounded-2xl text-lg font-bold focus:ring-2 focus:ring-blue-500 outline-none" type="number" value={number} onChange={(e) => setNumber(e.target.value)} required={!isNotFormat} />
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-400 uppercase">Reg</span>
                <input placeholder="77" className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl text-lg font-bold focus:ring-2 focus:ring-blue-500 outline-none" type="number" value={region} onChange={(e) => setRegion(e.target.value)} required={!isNotFormat} />
              </div>
            </div>
          ) : (
            <div className="relative animate-in slide-in-from-top-2 duration-300">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-400 uppercase">A-Z</span>
              <input placeholder="Введите номер целиком" className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl text-lg font-bold focus:ring-2 focus:ring-blue-500 outline-none" type="text" value={numberNotFormat} onChange={(e) => setNumberNotFormat(e.target.value)} required={isNotFormat} />
            </div>
          )}
        </div>

        {/* 3. БЛОК ЛОКАЦИИ */}
        <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 space-y-6">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-3">
              <span className="text-3xl">📍</span>
              <h3 className="text-xl font-bold text-gray-800">Локация</h3>
            </div>
            
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={useLocation}
                onChange={() => setUseLocation(!useLocation)}
              />
              <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {useLocation && (
             <LocationPicker location={location} onChange={setLocation} />
          )}
        </div>

        {/* <button type="submit" disabled={loading} className={`w-full py-5 rounded-2xl text-lg font-black uppercase shadow-lg active:scale-95 transition-all ${loading ? 'bg-gray-300 text-gray-500 shadow-none' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200'}`}>
          {loading ? 'Загрузка...' : 'Отправить'}
        </button> */}
        <ProgressButton isLoading={loading} progress={progress}>
          {loading ? 'Загрузка...' : 'Отправить'}
        </ProgressButton>
      </form>

      {zoomedPhoto && (
        <PhotoZoomModal url={zoomedPhoto} onClose={() => setZoomedPhoto(null)} />
      )}
    </div>
  );
};

export default AddTrophyPage;