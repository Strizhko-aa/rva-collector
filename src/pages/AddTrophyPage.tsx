import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import exifr from 'exifr';
import LocationPicker from '../components/LocationPicker';
import { createTrophyUseCase } from '../use-cases/createTrophy.use-case';

const VORONEZH_COORDS = { lat: 51.6608, lng: 39.2003 };

const AddTrophyPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [capturedAt, setCapturedAt] = useState<number | null>(null);

  const [useLocation, setUseLocation] = useState(true);
  const [location, setLocation] = useState<{lat: number, lng: number}>(VORONEZH_COORDS);
  

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setImageFiles(filesArray);

      const newPreviews = filesArray.map(file => URL.createObjectURL(file));
      setPreviews(newPreviews);

      // --- МАГИЯ EXIF ---
      try {
        // Берем первое фото как источник метаданных для всего трофея
        const metadata = await exifr.parse(filesArray[0], {
          pick: ['DateTimeOriginal', 'latitude', 'longitude'] // не понятно почему нету
        });

        const lanlat = await exifr.gps(filesArray[0]);
        console.log("GPS из exifr.gps:", lanlat);

        if (metadata) {
          console.log("Метаданные найдены:", metadata);
          
          // Если в фото есть координаты, мы можем их сохранить
          // metadata.latitude и metadata.longitude
          
          // Если есть дата съемки — можно обновить createdAt
          if (metadata.DateTimeOriginal) {
            const photoDate = new Date(metadata.DateTimeOriginal).getTime();
            // Можно добавить состояние setCapturedAt(photoDate)
            console.log("Дата из фото:", new Date(photoDate).toLocaleString());
            setCapturedAt(photoDate);
          }
          if (lanlat?.latitude && lanlat?.longitude) {
            setLocation({
              lat: lanlat.latitude,
              lng: lanlat.longitude
            });
            setUseLocation(true);
          }
        }
      } catch (err) {
        console.error("Не удалось прочитать EXIF:", err);
      }
    }
  };

  // Состояние для формы
  const [isNotFormat, setIsNotFormat] = useState(false);
  const [number, setNumber] = useState<string>(''); // Храним строкой для удобства ввода
  const [region, setRegion] = useState<string>('');
  const [numberNotFormat, setNumberNotFormat] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || imageFiles.length === 0) return;

    setLoading(true);
    try {
      await createTrophyUseCase({
        number,
        region,
        numberNotFormat,
        isNotFormat,
        imageFiles,
        userId: user.uid,
        location: useLocation ? location : null,
        capturedAt
      });
      
      navigate('/');
    } catch (err) {
      console.error("Use Case Error:", err);
      alert("Ошибка при создании");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-sm">
      <h1 className="text-2xl font-bold mb-6">Добавить трофей</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Чекбокс переключения формата */}
        <label className="flex items-center space-x-3 cursor-pointer p-2 bg-gray-50 rounded-lg">
          <input 
            type="checkbox"
            checked={isNotFormat}
            onChange={(e) => setIsNotFormat(e.target.checked)}
            className="w-5 h-5 text-blue-600"
          />
          <span className="text-sm font-medium">Номер другого формата</span>
        </label>

        {!isNotFormat ? (
          /* Стандартные поля (v-if="!isNotFormat") */
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <label className="block text-xs text-gray-500 mb-1 uppercase font-bold">Номер</label>
              <input 
                type="number"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                placeholder="777"
                className="w-full p-3 border rounded-lg outline-none focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1 uppercase font-bold">Регион</label>
              <input 
                type="number"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                placeholder="77"
                className="w-full p-3 border rounded-lg outline-none focus:border-blue-500"
                required
              />
            </div>
          </div>
        ) : (
          /* Поле для нестандартного номера (v-else) */
          <div>
            <label className="block text-xs text-gray-500 mb-1 uppercase font-bold">Текст номера</label>
            <input 
              type="text"
              value={numberNotFormat}
              onChange={(e) => setNumberNotFormat(e.target.value)}
              placeholder="Введите номер целиком"
              className="w-full p-3 border rounded-lg outline-none focus:border-blue-500"
              required
            />
          </div>
        )}

        {/* --- НОВЫЙ БЛОК ВЫБОРА ФОТО --- */}
        <div className="space-y-3">
          <label className="block text-xs text-gray-500 mb-1 uppercase font-bold tracking-wider">
            Фотографии машины
          </label>

          {/* Визуальная зона выбора */}
          <label 
            htmlFor="file-upload" 
            className={`group relative flex flex-col items-center justify-center w-full rounded-2xl border-2 border-dashed transition-all cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 ${
              previews.length > 0 
                ? 'border-gray-200 bg-gray-50 h-32' // Если фото уже есть, делаем зону компактнее
                : 'border-gray-300 bg-white h-48'   // Если пусто — зона большая
            }`}
          >
            {/* Реальный скрытый инпут */}
            <input 
              id="file-upload"
              type="file" 
              multiple 
              accept="image/*" 
              onChange={handleFileChange} 
              className="sr-only" // Скрываем, но оставляем доступным для клика через label
            />

            {/* Контент зоны выбора (показываем, только если пусто) */}
            {previews.length === 0 && (
              <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                {/* Иконка (SVG) */}
                <svg className="w-10 h-10 mb-3 text-gray-400 group-hover:text-blue-500 transition-colors" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5.016 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                </svg>
                <p className="mb-2 text-sm text-gray-700">
                  <span className="font-bold">Нажми для выбора</span> или перетащи
                </p>
                <p className="text-xs text-gray-400">
                  PNG, JPG (оригиналы с телефона для GPS)
                </p>
              </div>
            )}

            {/* Контент, если фото уже выбраны (мини-заглушка с кнопкой) */}
            {previews.length > 0 && (
              <div className="flex items-center gap-3 text-blue-600">
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                 </svg>
                 <span className="text-sm font-bold">Выбрано {previews.length} фото</span>
                 <span className="text-xs text-gray-400 group-hover:text-blue-500">(Нажми, чтобы изменить)</span>
              </div>
            )}
          </label>
        </div>

        {/* Сетка превью (твоя старая, немного подправленная) */}
        {previews.length > 0 && (
          <div className="grid grid-cols-4 gap-2 mb-4 p-2 bg-gray-50 rounded-2xl border border-gray-100">
            {previews.map((url, index) => (
              <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 shadow-inner">
                <img 
                  src={url} 
                  className="w-full h-full object-cover" 
                  alt={`Превью ${index + 1}`} 
                />
                {/* Кнопочка очистки (если захочешь добавить потом логику) */}
                {/* <button className="absolute top-1 right-1 bg-black/50 text-white rounded-full w-5 h-5 text-xs">×</button> */}
              </div>
            ))}
          </div>
        )}

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-gray-800">Местоположение</h3>
            <p className="text-xs text-gray-500">Укажите, где был найден трофей</p>
          </div>
          
          {/* Простой Свитч */}
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer" 
              checked={useLocation}
              onChange={() => setUseLocation(!useLocation)}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {useLocation && (
          <div className="space-y-2">
            <LocationPicker 
              location={location} 
              onChange={(newPos) => setLocation(newPos)} 
            />
            <p className="text-[10px] text-gray-400 font-mono text-center">
              {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
            </p>
          </div>
        )}
      </div>

        <button 
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 disabled:bg-gray-300 transition-colors"
        >
          {loading ? 'Загрузка...' : 'Сохранить'}
        </button>
      </form>
    </div>
  );
};

export default AddTrophyPage;