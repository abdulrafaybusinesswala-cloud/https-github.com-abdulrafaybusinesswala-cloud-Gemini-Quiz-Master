export interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface QuizState {
  questions: Question[];
  currentQuestionIndex: number;
  score: number;
  answers: { questionId: number; selected: string; isCorrect: boolean }[];
  isFinished: boolean;
}

export enum AppStatus {
  WELCOME = 'WELCOME',
  LOADING = 'LOADING',
  PLAYING = 'PLAYING',
  ERROR = 'ERROR',
  RESULTS = 'RESULTS',
}
