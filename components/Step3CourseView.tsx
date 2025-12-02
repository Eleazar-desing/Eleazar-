import React, { useState } from 'react';
import { CourseStructure, CourseModule, QuizQuestion } from '../types';
import { 
  BookOpen, 
  CheckCircle, 
  ChevronLeft, 
  BarChart2, 
  PlayCircle,
  Award,
  HelpCircle,
  Menu
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface Step3CourseViewProps {
  course: CourseStructure;
  onBackToVariations: () => void;
}

const Step3CourseView: React.FC<Step3CourseViewProps> = ({ course, onBackToVariations }) => {
  const [activeModuleIndex, setActiveModuleIndex] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const activeModule = course.modules[activeModuleIndex];

  // Helper to get chart component
  const renderChart = (module: CourseModule) => {
    if (!module.chartData || !module.chartData.data) return null;
    
    const { type, data, title } = module.chartData;
    const colors = [course.primaryColor, course.secondaryColor, course.accentColor, '#8884d8', '#82ca9d'];

    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 my-8">
        <h4 className="text-sm font-bold uppercase tracking-wide text-gray-500 mb-4">{title}</h4>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {type === 'pie' ? (
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill={course.primaryColor}
                  dataKey="value"
                  label
                >
                   {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            ) : (
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: 'transparent'}} />
                <Bar dataKey="value" fill={course.primaryColor} radius={[4, 4, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  const handleQuizOptionSelect = (qIndex: number, oIndex: number) => {
    if (quizSubmitted) return;
    setQuizAnswers(prev => ({ ...prev, [qIndex]: oIndex }));
  };

  const submitQuiz = () => {
    setQuizSubmitted(true);
  };

  const resetQuiz = () => {
    setQuizAnswers({});
    setQuizSubmitted(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-800">
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button 
              onClick={onBackToVariations}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
              title="Volver a variaciones"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-gray-900 truncate max-w-xs md:max-w-md">{course.title}</h1>
              <p className="text-xs text-gray-500 hidden md:block">{course.subtitle}</p>
            </div>
          </div>
          
          <button 
            className="md:hidden p-2 text-gray-600"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="hidden md:flex items-center space-x-2">
            <span className="text-xs font-medium px-2 py-1 bg-green-100 text-green-700 rounded-full">En Progreso</span>
          </div>
        </div>
      </header>

      <div className="flex flex-1 max-w-7xl mx-auto w-full relative">
        
        {/* Sidebar Navigation */}
        <aside className={`
          absolute md:relative z-20 w-64 bg-white border-r border-gray-200 h-[calc(100vh-64px)] overflow-y-auto transition-transform duration-300 ease-in-out
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}>
          <div className="p-6">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Contenido del Curso</h3>
            <nav className="space-y-1">
              {course.modules.map((module, idx) => (
                <button
                  key={module.id}
                  onClick={() => {
                    setActiveModuleIndex(idx);
                    setShowQuiz(false);
                    setMobileMenuOpen(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`w-full flex items-center px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                    activeModuleIndex === idx && !showQuiz
                      ? 'bg-gray-100 text-gray-900' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  style={activeModuleIndex === idx && !showQuiz ? { borderLeft: `3px solid ${course.primaryColor}` } : {}}
                >
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs mr-3 ${
                    activeModuleIndex === idx ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-500'
                  }`} style={activeModuleIndex === idx ? { backgroundColor: course.primaryColor } : {}}>
                    {idx + 1}
                  </span>
                  <span className="truncate text-left">{module.title}</span>
                </button>
              ))}
            </nav>

            {/* Final Assessment Link */}
            <div className="mt-8 pt-6 border-t border-gray-100">
               <button 
                 onClick={() => {
                    setShowQuiz(true);
                    setMobileMenuOpen(false);
                 }}
                 className={`w-full flex items-center px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                    showQuiz ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'
                 }`}
               >
                 <Award className="w-5 h-5 mr-3 text-yellow-500" />
                 Evaluación Final
               </button>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-6 md:p-12 overflow-y-auto h-[calc(100vh-64px)]">
          {showQuiz ? (
             <div className="max-w-3xl mx-auto animate-fade-in">
                <div className="text-center mb-10">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-100 mb-4">
                    <Award className="w-8 h-8 text-yellow-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">Evaluación de Conocimientos</h2>
                  <p className="text-gray-600 mt-2">Pon a prueba lo que has aprendido en los módulos anteriores.</p>
                </div>

                <div className="space-y-8">
                  {/* Aggregating quizzes from all modules for a 'Final Exam' feel */}
                  {course.modules.flatMap((m, mIdx) => 
                    (m.quiz || []).map((q, qIdx) => ({...q, globalId: `${mIdx}-${qIdx}`, moduleTitle: m.title}))
                  ).map((question, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                      <div className="flex items-start mb-4">
                        <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-gray-100 text-gray-600 rounded-full text-sm font-bold mr-3">
                          {idx + 1}
                        </span>
                        <div>
                          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{question.moduleTitle}</span>
                          <h3 className="text-lg font-medium text-gray-900 mt-1">{question.question}</h3>
                        </div>
                      </div>
                      
                      <div className="space-y-3 pl-11">
                        {question.options.map((option, optIdx) => {
                          const isSelected = quizAnswers[idx] === optIdx;
                          const isCorrect = question.correctAnswer === optIdx;
                          let btnClass = "border-gray-200 hover:bg-gray-50 text-gray-700";
                          
                          if (quizSubmitted) {
                            if (isCorrect) btnClass = "bg-green-50 border-green-200 text-green-700";
                            else if (isSelected && !isCorrect) btnClass = "bg-red-50 border-red-200 text-red-700";
                            else btnClass = "opacity-50 border-gray-100";
                          } else if (isSelected) {
                            btnClass = "border-indigo-500 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-500";
                          }

                          return (
                            <button
                              key={optIdx}
                              onClick={() => handleQuizOptionSelect(idx, optIdx)}
                              disabled={quizSubmitted}
                              className={`w-full text-left p-4 rounded-lg border-2 transition-all ${btnClass}`}
                            >
                              <div className="flex items-center justify-between">
                                <span>{option}</span>
                                {quizSubmitted && isCorrect && <CheckCircle className="w-5 h-5 text-green-600" />}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-10 flex justify-center pb-10">
                  {!quizSubmitted ? (
                    <button
                      onClick={submitQuiz}
                      className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg hover:shadow-indigo-200 transition-all transform hover:-translate-y-1"
                      style={{ backgroundColor: course.primaryColor }}
                    >
                      Enviar Respuestas
                    </button>
                  ) : (
                    <button
                      onClick={resetQuiz}
                      className="px-8 py-3 bg-white border-2 border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all"
                    >
                      Intentar de Nuevo
                    </button>
                  )}
                </div>
             </div>
          ) : (
            <div className="max-w-3xl mx-auto animate-fade-in">
              {/* Module Header */}
              <div className="mb-8">
                <span className="text-sm font-bold text-indigo-600 uppercase tracking-wide mb-2 block" style={{ color: course.primaryColor }}>
                  Módulo {activeModuleIndex + 1}
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{activeModule.title}</h2>
              </div>

              {/* Module Image */}
              <div className="w-full h-64 md:h-80 rounded-2xl overflow-hidden mb-10 shadow-lg bg-gray-100">
                <img 
                  src={`https://picsum.photos/seed/${activeModule.imageKeyword || activeModule.id}/1200/600`}
                  alt={activeModule.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Module Content */}
              <div className="prose prose-lg prose-indigo max-w-none text-gray-600 leading-relaxed">
                {/* Simple Markdown rendering simulation */}
                {activeModule.content.split('\n').map((paragraph, i) => {
                  if (paragraph.startsWith('### ')) return <h3 key={i} className="text-xl font-bold text-gray-800 mt-8 mb-4">{paragraph.replace('### ', '')}</h3>;
                  if (paragraph.startsWith('## ')) return <h2 key={i} className="text-2xl font-bold text-gray-900 mt-10 mb-4">{paragraph.replace('## ', '')}</h2>;
                  if (paragraph.startsWith('- ')) return <li key={i} className="ml-4 list-disc marker:text-indigo-500 pl-2 mb-2">{paragraph.replace('- ', '')}</li>;
                  if (paragraph.trim() === '') return <br key={i} />;
                  return <p key={i} className="mb-4">{paragraph}</p>;
                })}
              </div>

              {/* Interactive Elements */}
              {renderChart(activeModule)}

              {/* Module-Specific Quiz Teaser */}
              {activeModule.quiz && activeModule.quiz.length > 0 && (
                <div className="mt-12 p-6 bg-indigo-50 rounded-xl border border-indigo-100" style={{ backgroundColor: `${course.secondaryColor}20`, borderColor: `${course.secondaryColor}40` }}>
                  <div className="flex items-start">
                    <HelpCircle className="w-6 h-6 text-indigo-600 mt-1 mr-4" style={{ color: course.primaryColor }} />
                    <div>
                      <h4 className="text-lg font-bold text-gray-900 mb-2">Comprueba tu aprendizaje</h4>
                      <p className="text-gray-600 mb-4">¿Listo para un pequeño desafío sobre este módulo?</p>
                      <button 
                         onClick={() => setShowQuiz(true)}
                         className="text-sm font-bold text-indigo-600 hover:text-indigo-800 underline"
                         style={{ color: course.primaryColor }}
                      >
                        Ir a la evaluación final &rarr;
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Footer */}
              <div className="mt-12 flex justify-between items-center pt-8 border-t border-gray-200">
                 <button
                   disabled={activeModuleIndex === 0}
                   onClick={() => {
                     setActiveModuleIndex(prev => prev - 1);
                     window.scrollTo({ top: 0, behavior: 'smooth' });
                   }}
                   className={`flex items-center font-medium ${activeModuleIndex === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:text-gray-900'}`}
                 >
                   <ChevronLeft className="w-5 h-5 mr-1" /> Anterior
                 </button>

                 <button
                   disabled={activeModuleIndex === course.modules.length - 1}
                   onClick={() => {
                     setActiveModuleIndex(prev => prev + 1);
                     window.scrollTo({ top: 0, behavior: 'smooth' });
                   }}
                   className={`flex items-center px-6 py-3 rounded-full text-white font-bold shadow-md transition-transform hover:-translate-y-1 ${activeModuleIndex === course.modules.length - 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                   style={activeModuleIndex !== course.modules.length - 1 ? { backgroundColor: course.primaryColor } : {}}
                 >
                   Siguiente Módulo <PlayCircle className="w-5 h-5 ml-2" />
                 </button>
              </div>

            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Step3CourseView;
