import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingScreenProps {
  message: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
      <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
      <h3 className="text-xl font-semibold text-gray-800 text-center px-4">{message}</h3>
      <p className="text-gray-500 mt-2 text-sm text-center max-w-md px-4">
        Estoy consultando fuentes y estructurando la mejor información para ti...
      </p>
    </div>
  );
};

export default LoadingScreen;
