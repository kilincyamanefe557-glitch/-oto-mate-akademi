export type Page = 'panel' | 'library' | 'fault-robot' | 'quiz' | 'simulation' | 'academy' | 'settings';

export interface ComponentItem {
  id: string;
  name: string;
  category: string;
  description: string;
  principle: string;
  usage: string;
  wiring: string;
  faults: string[];
  specs: Record<string, string>;
  aiNote: string;
  image?: string;
}

export interface FaultScenario {
  id: string;
  title: string;
  description: string;
  steps: FaultStep[];
}

export interface FaultStep {
  id: string;
  question: string;
  options: {
    label: string;
    nextStepId?: string;
    result?: FaultResult;
  }[];
}

export interface FaultResult {
  diagnosis: string;
  solution: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  estimatedTime: string;
  aiComment: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface Course {
  id: string;
  title: string;
  category: string;
  duration: string;
  level: 'Başlangıç' | 'Orta' | 'İleri';
  progress: number;
  aiNotes: string;
  thumbnail: string;
}
