import React, { useState } from 'react';
import { Search, Sparkles } from 'lucide-react';

interface Step1InputProps {
  onNext: (topic: string) => void;
  isLoading: boolean;
}

const Step1Input: React.FC<Step1InputProps> = ({ onNext, isLoading }) => {
  const [topic, setTopic] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim() && !isLoading) {
      onNext(topic);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-12 flex flex-col items-center">
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 w-full text-center">
        <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
          <Sparkles className="w-8 h-8 text-indigo-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">¿Sobre qué quieres enseñar hoy?</h1>
        <p className="text-gray-600 mb-8 text-lg">
          Dime un tema central y te ayudaré a desglosarlo en una estrategia de curso ganadora.
        </p>

        <form onSubmit={handleSubmit} className="relative w-full max-w-lg mx-auto">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Ej. Marketing Digital, Yoga para Principiantes, Finanzas..."
            className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all text-lg"
            disabled={isLoading}
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
          
          <button
            type="submit"
            disabled={!topic.trim() || isLoading}
            className={`mt-6 w-full py-4 rounded-xl text-white font-semibold text-lg transition-all transform ${
              !topic.trim() || isLoading
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 hover:scale-[1.02] shadow-lg hover:shadow-indigo-200'
            }`}
          >
            {isLoading ? 'Analizando...' : 'Comenzar Estrategia'}
          </button>
        </form>
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center text-sm text-gray-500">
        <div className="flex flex-col items-center">
          <span className="bg-white p-2 rounded-lg shadow-sm mb-2 font-bold text-indigo-600">1</span>
          <p>Generamos pilares temáticos</p>
        </div>
        <div className="flex flex-col items-center">
          <span className="bg-white p-2 rounded-lg shadow-sm mb-2 font-bold text-indigo-600">2</span>
          <p>Eliges tu enfoque favorito</p>
        </div>
        <div className="flex flex-col items-center">
          <span className="bg-white p-2 rounded-lg shadow-sm mb-2 font-bold text-indigo-600">3</span>
          <p>Obtienes un curso completo</p>
        </div>
      </div>
    </div>
  );
};

export default Step1Input;
