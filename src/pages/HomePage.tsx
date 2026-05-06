// src/pages/HomePage.tsx
import { useEffect, useState, useMemo } from 'react';
import { trophyService } from '../services/trophy.service';
import type { Trophy } from '../types';
import { Link } from 'react-router-dom';
import { getThumbnail, getAvatar } from '../utils/cloudinary';
import SearchFilter, { type SearchMode } from '../components/SearchFilter';

const HomePage = () => {
  const [trophies, setTrophies] = useState<Trophy[]>([]);
  const [loading, setLoading] = useState(true);

  // Состояния фильтров
  const [searchMode, setSearchMode] = useState<SearchMode>('standard');
  const [filterNumber, setFilterNumber] = useState('');
  const [filterRegion, setFilterRegion] = useState('');
  const [filterCustom, setFilterCustom] = useState('');

  useEffect(() => {
    const unsubscribe = trophyService.subscribeToFeed((data) => {
      setTrophies(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Логика фильтрации
  const filteredTrophies = useMemo(() => {
    return trophies.filter((t) => {
      if (searchMode === 'standard') {
        if (!filterNumber && !filterRegion) return true;
        if (t.isNotFormat) return false;

        const matchNumber = filterNumber ? String(t.number).includes(filterNumber) : true;
        const matchRegion = filterRegion ? String(t.region).includes(filterRegion) : true;
        return matchNumber && matchRegion;
      } else {
        if (!filterCustom) return true;
        if (!t.isNotFormat) return false;
        
        return t.numberNotFormat?.toLowerCase().includes(filterCustom.toLowerCase());
      }
    });
  }, [trophies, filterNumber, filterRegion, filterCustom, searchMode]);

  if (loading) return <div className="text-center p-20 text-gray-400 dark:text-slate-500">Загрузка ленты...</div>;

  return (
    <div className="space-y-8">
      
      <SearchFilter 
        searchMode={searchMode}
        setSearchMode={setSearchMode}
        filterNumber={filterNumber}
        setFilterNumber={setFilterNumber}
        filterRegion={filterRegion}
        setFilterRegion={setFilterRegion}
        filterCustom={filterCustom}
        setFilterCustom={setFilterCustom}
      />

      {/* Лента */}
      {filteredTrophies.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrophies.map((trophy) => (
             <Link to={`/trophy/${trophy.id}`} key={trophy.id} className="group">
                 <div className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 dark:border-slate-700 flex flex-col h-full">
                     <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-slate-700">
                         <img src={getThumbnail(trophy.mainImageUrl, 500, 375)} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" alt="" loading="lazy" />
                         <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                     </div>
                     <div className="p-5 flex items-center justify-between bg-white dark:bg-slate-800 border-t border-gray-50 dark:border-slate-700/50">
                        <div className="flex-1">
                          {!trophy.isNotFormat ? (
                            <div className="inline-flex items-center border-[2.5px] border-gray-800 dark:border-slate-300 rounded-lg px-2 py-0.5 font-mono transform group-hover:scale-105 transition-transform bg-white dark:bg-transparent">
                              <span className="text-2xl font-black text-gray-800 dark:text-slate-200">{trophy.number}</span>
                              <span className="ml-2 pl-2 border-l border-gray-800 dark:border-slate-300 text-sm font-bold text-gray-800 dark:text-slate-200">{trophy.region}</span>
                            </div>
                          ) : (
                            <div className="text-sm font-mono font-black text-blue-600 dark:text-blue-400 truncate max-w-[120px]">
                              {trophy.numberNotFormat}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2 pl-3">
                          <div className="text-right hidden sm:block">
                            <p className="text-[10px] font-bold text-gray-800 dark:text-slate-200 leading-none truncate max-w-[80px]">
                              {trophy.observations[0].authorName || 'Охотник'}
                            </p>
                            <p className="text-[8px] text-gray-400 dark:text-slate-500 font-mono">#{trophy.observations[0].authorId.slice(-4)}</p>
                          </div>
                          <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-white dark:border-slate-800 shadow-sm ring-1 ring-gray-100 dark:ring-slate-700 flex-shrink-0">
                            {trophy.observations[0].authorPhoto ? (
                              <img src={getAvatar(trophy.observations[0].authorPhoto, 50)} className="w-full h-full object-cover" alt="" />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
                                {trophy.observations[0].authorName?.[0]?.toUpperCase() || 'О'}
                              </div>
                            )}
                          </div>
                        </div>
                     </div>
                 </div>
             </Link>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center">
          <div className="text-4xl mb-4">🔍</div>
          <p className="text-gray-400 dark:text-slate-500">По таким параметрам ничего не найдено</p>
        </div>
      )}
    </div>
  );
};

export default HomePage;