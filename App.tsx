import React, { useState } from 'react';
import { AppStep, PillarTopic, LessonVariation, CourseStructure } from './types';
import * as GeminiService from './services/gemini';
import Step1Input from './components/Step1Input';
import Step2Selection from './components/Step2Selection';
import Step3CourseView from './components/Step3CourseView';
import LoadingScreen from './components/LoadingScreen';
import { BookOpen } from 'lucide-react';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>('INPUT');
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');

  // Data State
  const [mainTopic, setMainTopic] = useState('');
  const [pillars, setPillars] = useState<PillarTopic[]>([]);
  const [selectedPillar, setSelectedPillar] = useState<PillarTopic | null>(null);
  const [variations, setVariations] = useState<LessonVariation[]>([]);
  const [courseData, setCourseData] = useState<CourseStructure | null>(null);

  // Handlers
  const handleTopicSubmit = async (topic: string) => {
    setMainTopic(topic);
    setLoading(true);
    setLoadingMessage(`Analizando tendencias sobre "${topic}"...`);
    
    try {
      const result = await GeminiService.generatePillars(topic);
      setPillars(result);
      setStep('PILLARS');
    } catch (error) {
      alert("Hubo un error al conectar con el mentor IA. Por favor intenta de nuevo.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePillarSelect = async (pillar: PillarTopic) => {
    setSelectedPillar(pillar);
    setLoading(true);
    setLoadingMessage(`Diseñando ángulos educativos para "${pillar.title}"...`);

    try {
      const result = await GeminiService.generateVariations(pillar.title);
      setVariations(result);
      setStep('VARIATIONS');
    } catch (error) {
      alert("Error generando variaciones.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleVariationSelect = async (variation: LessonVariation) => {
    setLoading(true);
    setLoadingMessage(`Construyendo el curso "${variation.title}"... Esto puede tardar unos segundos.`);

    try {
      const result = await GeminiService.generateCourse(variation.title);
      setCourseData(result);
      setStep('COURSE');
    } catch (error) {
      alert("Error generando el curso. Intenta con otra variación.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToPillars = () => {
    setStep('PILLARS');
    setVariations([]);
  };

  const handleBackToVariations = () => {
    setStep('VARIATIONS');
    setCourseData(null);
  };

  const resetApp = () => {
    setStep('INPUT');
    setMainTopic('');
    setPillars([]);
    setVariations([]);
    setCourseData(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Global Header (Only show if not in Course View to avoid clutter, or minimal) */}
      {step !== 'COURSE' && (
        <header className="bg-white border-b border-gray-100 py-4 px-6 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={resetApp}>
              <div className="bg-indigo-600 p-2 rounded-lg">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 tracking-tight">CursoAPP</span>
            </div>
            {step !== 'INPUT' && (
              <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {mainTopic}
              </span>
            )}
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className="flex-grow flex flex-col">
        {loading ? (
          <LoadingScreen message={loadingMessage} />
        ) : (
          <>
            {step === 'INPUT' && (
              <Step1Input onNext={handleTopicSubmit} isLoading={loading} />
            )}

            {step === 'PILLARS' && (
              <Step2Selection
                title="Estrategia de Pilares"
                subtitle={`Hemos detectado estos 10 enfoques potenciales para "${mainTopic}". Elige el que mejor resuene con tu audiencia.`}
                items={pillars}
                onSelect={(item) => handlePillarSelect(item as PillarTopic)}
                onBack={resetApp}
                isLoading={loading}
                colorTheme="indigo"
              />
            )}

            {step === 'VARIATIONS' && (
              <Step2Selection
                title="Variaciones de Lección"
                subtitle={`Para el pilar "${selectedPillar?.title}", aquí tienes 10 ángulos específicos para estructurar tu curso.`}
                items={variations}
                onSelect={(item) => handleVariationSelect(item as LessonVariation)}
                onBack={handleBackToPillars}
                isLoading={loading}
                colorTheme="purple"
              />
            )}

            {step === 'COURSE' && courseData && (
              <Step3CourseView 
                course={courseData} 
                onBackToVariations={handleBackToVariations} 
              />
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default App;
