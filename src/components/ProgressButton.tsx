// src/components/ProgressButton.tsx
import React from 'react';

interface Props {
  isLoading: boolean;
  progress: number;
  children: React.ReactNode;
  disabled?: boolean;
}

const ProgressButton: React.FC<Props> = ({ isLoading, progress, children, disabled }) => {
  return (
    <button
      type="submit"
      disabled={disabled || isLoading}
      className="relative w-full py-5 rounded-2xl text-lg font-black uppercase overflow-hidden transition-all active:scale-95 bg-gray-200 shadow-lg shadow-blue-100 group"
    >
      {/* Статический фон (синий, когда кнопка готова) */}
      <div className={`absolute inset-0 transition-colors duration-500 ${isLoading ? 'bg-gray-300' : 'bg-blue-600'}`} />

      {/* Шкала прогресса с полосками */}
      {isLoading && (
        <div 
          className="absolute inset-y-0 left-0 bg-blue-500 transition-all duration-300 ease-out"
          style={{ 
            width: `${progress}%`,
            // Эффект движущихся полосок через CSS gradient
            backgroundImage: `linear-gradient(45deg, rgba(255,255,255,0.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.15) 75%, transparent 75%, transparent)`,
            backgroundSize: '40px 40px',
            animation: 'stripe-move 1s linear infinite'
          }}
        />
      )}

      {/* Текст кнопки */}
      <span className="relative z-10 text-white drop-shadow-md flex items-center justify-center gap-3">
        {isLoading ? (
          <>
            <span>{progress < 95 ? 'Загрузка...' : 'Сохранение...'}</span>
            <span className="text-xs font-mono bg-black/20 px-2 py-0.5 rounded-full">{Math.round(progress)}%</span>
          </>
        ) : children}
      </span>

      <style>{`
        @keyframes stripe-move {
          from { background-position: 0 0; }
          to { background-position: 40px 0; }
        }
      `}</style>
    </button>
  );
};

export default ProgressButton;