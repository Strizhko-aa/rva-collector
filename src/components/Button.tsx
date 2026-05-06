interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary'; // Опциональный пропс с конкретными значениями
}

// Мы типизируем объект аргументов функции
export const Button = ({ label, onClick, variant = 'primary' }: ButtonProps) => {
  return (
    <button 
      onClick={onClick}
      className={`px-4 py-2 rounded ${variant === 'primary' ? 'bg-blue-500 dark:bg-blue-500 text-white' : 'bg-gray-500 dark:bg-slate-600 text-white'}`}
    >
      {label}
    </button>
  );
};