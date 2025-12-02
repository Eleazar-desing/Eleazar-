export interface PillarTopic {
  id: string;
  title: string;
  description: string;
}

export interface LessonVariation {
  id: string;
  title: string;
  description: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number; // Index of the correct option
}

export interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: any;
}

export interface CourseModule {
  id: string;
  title: string;
  content: string; // Markdown or text
  imageKeyword: string;
  chartData?: {
    title: string;
    data: ChartDataPoint[];
    type: 'bar' | 'pie' | 'line';
  };
  quiz?: QuizQuestion[];
}

export interface CourseStructure {
  title: string;
  subtitle: string;
  primaryColor: string; // Hex code
  secondaryColor: string; // Hex code
  accentColor: string; // Hex code
  modules: CourseModule[];
}

export type AppStep = 'INPUT' | 'PILLARS' | 'VARIATIONS' | 'COURSE';