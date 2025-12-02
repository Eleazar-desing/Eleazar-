import React from 'react';
import { ChevronRight, ArrowLeft } from 'lucide-react';

interface Item {
  id: string;
  title: string;
  description: string;
}

interface Step2SelectionProps {
  title: string;
  subtitle: string;
  items: Item[];
  onSelect: (item: Item) => void;
  onBack?: () => void;
  isLoading: boolean;
  colorTheme?: string; // Optional custom color for the step
}

const Step2Selection: React.FC<Step2SelectionProps> = ({ 
  title, 
  subtitle, 
  items, 
  onSelect, 
  onBack,
  isLoading,
  colorTheme = "indigo"
}) => {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8">
      {onBack && (
        <button 
          onClick={onBack}
          className="flex items-center text-gray-500 hover:text-gray-800 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </button>
      )}

      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">{title}</h2>
        <p className="text-gray-600 text-lg">{subtitle}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => !isLoading && onSelect(item)}
            disabled={isLoading}
            className={`group text-left p-6 rounded-xl border-2 border-transparent bg-white shadow-sm hover:shadow-md transition-all duration-200 relative overflow-hidden ${
              isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:border-indigo-500 cursor-pointer'
            }`}
          >
            <div className={`absolute top-0 left-0 w-1 h-full bg-${colorTheme}-500 opacity-0 group-hover:opacity-100 transition-opacity`}></div>
            <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-indigo-600 transition-colors">
              {item.title}
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              {item.description}
            </p>
            <div className="mt-4 flex items-center text-indigo-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
              Seleccionar <ChevronRight className="w-4 h-4 ml-1" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Step2Selection;
