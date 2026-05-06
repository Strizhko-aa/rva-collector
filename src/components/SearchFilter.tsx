// src/components/SearchFilter.tsx
import { useState } from 'react';

export type SearchMode = 'standard' | 'custom';

interface SearchFilterProps {
  searchMode: SearchMode;
  setSearchMode: (mode: SearchMode) => void;
  filterNumber: string;
  setFilterNumber: (val: string) => void;
  filterRegion: string;
  setFilterRegion: (val: string) => void;
  filterCustom: string;
  setFilterCustom: (val: string) => void;
}

const SearchFilter = ({
  searchMode, setSearchMode,
  filterNumber, setFilterNumber,
  filterRegion, setFilterRegion,
  filterCustom, setFilterCustom,
}: SearchFilterProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const isFilterActive = filterNumber || filterRegion || filterCustom;

  return (
    <div className="fixed top-24 left-6 z-[70]">
      {/* Кнопка вызова (если поиск закрыт) */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-5 py-3 rounded-2xl shadow-xl border border-white dark:border-slate-700 hover:scale-105 active:scale-95 transition-all group"
        >
          <span className="text-xl group-hover:rotate-12 transition-transform">🔍</span>
          <span className="text-sm font-black text-gray-700 dark:text-slate-100 uppercase">Поиск</span>
          {isFilterActive && <span className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />}
        </button>
      )}

      {/* Сама плавающая карточка поиска */}
      <div className={`
        absolute top-0 left-0 w-[320px] bg-white/95 dark:bg-slate-950/95 backdrop-blur-2xl rounded-[2rem] shadow-2xl border border-white/50 dark:border-slate-700 p-6 transition-all duration-300 origin-top-left
        ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}
      `}>
        
        {/* Шапка внутри карточки */}
        <div className="flex items-center justify-between mb-6">
          <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">Параметры поиска</span>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors text-gray-400 dark:text-slate-300"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Переключатель */}
        <div className="flex bg-gray-100 dark:bg-slate-900/80 p-1 rounded-xl mb-6">
          <button 
            onClick={() => setSearchMode('standard')} 
            className={`flex-1 py-2 text-[10px] font-black uppercase rounded-lg transition-all ${
              searchMode === 'standard' ? 'bg-white dark:bg-slate-800 shadow-sm text-blue-600' : 'text-gray-400 dark:text-slate-500'
            }`}
          >Госзнак</button>
          <button 
            onClick={() => setSearchMode('custom')} 
            className={`flex-1 py-2 text-[10px] font-black uppercase rounded-lg transition-all ${
              searchMode === 'custom' ? 'bg-white dark:bg-slate-800 shadow-sm text-blue-600' : 'text-gray-400 dark:text-slate-500'
            }`}
          >Неформат</button>
        </div>

        {/* Поля */}
        <div className="space-y-4 mb-6">
          {searchMode === 'standard' ? (
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Номер"
                value={filterNumber}
                onChange={(e) => setFilterNumber(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-950 border-none rounded-xl text-sm font-bold text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <input
                type="number"
                placeholder="Рег"
                value={filterRegion}
                onChange={(e) => setFilterRegion(e.target.value)}
                className="w-24 px-3 py-3 bg-gray-50 dark:bg-slate-950 border-none rounded-xl text-sm font-bold text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          ) : (
            <input
              type="text"
              placeholder="Текст..."
              value={filterCustom}
              onChange={(e) => setFilterCustom(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-950 border-none rounded-xl text-sm font-bold text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          )}
        </div>

        {/* Кнопки */}
        <div className="flex items-center gap-2">
          <button 
            onClick={() => { setFilterNumber(''); setFilterRegion(''); setFilterCustom(''); }}
            className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${
              isFilterActive ? 'bg-red-50 dark:bg-red-900 text-red-500 dark:text-red-300' : 'bg-gray-50 dark:bg-slate-900 text-gray-300 dark:text-slate-500 pointer-events-none'
            }`}
          >
            Сброс
          </button>
          <button 
            onClick={() => setIsOpen(false)}
            className="flex-[2] py-3 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase shadow-lg shadow-blue-200 dark:shadow-blue-800"
          >
            Готово
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchFilter;