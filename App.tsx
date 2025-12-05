import React, { useState } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import WelcomeScreen from './components/WelcomeScreen';
import QuizScreen from './components/QuizScreen';
import ResultScreen from './components/ResultScreen';
import { generateQuizQuestions } from './services/geminiService';
import { AppStatus, QuizState } from './types';

function App() {
  const [status, setStatus] = useState<AppStatus>(AppStatus.WELCOME);
  const [loadingTopic, setLoadingTopic] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  
  const [quizState, setQuizState] = useState<QuizState>({
    questions: [],
    currentQuestionIndex: 0,
    score: 0,
    answers: [],
    isFinished: false,
  });

  const handleStartQuiz = async (topic: string) => {
    setStatus(AppStatus.LOADING);
    setLoadingTopic(topic);
    setErrorMsg('');

    try {
      const questions = await generateQuizQuestions(topic);
      setQuizState({
        questions,
        currentQuestionIndex: 0,
        score: 0,
        answers: [],
        isFinished: false,
      });
      setStatus(AppStatus.PLAYING);
    } catch (error) {
      console.error(error);
      setErrorMsg("We couldn't generate the quiz. Please check your API key and try again.");
      setStatus(AppStatus.ERROR);
    }
  };

  const handleAnswer = (selected: string) => {
    const currentQuestion = quizState.questions[quizState.currentQuestionIndex];
    const isCorrect = selected === currentQuestion.correctAnswer;

    setQuizState(prev => ({
      ...prev,
      score: isCorrect ? prev.score + 1 : prev.score,
      answers: [
        ...prev.answers,
        {
          questionId: currentQuestion.id,
          selected,
          isCorrect
        }
      ]
    }));
  };

  const handleNext = () => {
    if (quizState.currentQuestionIndex < quizState.questions.length - 1) {
      setQuizState(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1
      }));
    } else {
      setStatus(AppStatus.RESULTS);
    }
  };

  const handleRestart = () => {
    setStatus(AppStatus.WELCOME);
    setQuizState({
      questions: [],
      currentQuestionIndex: 0,
      score: 0,
      answers: [],
      isFinished: false,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col">
      <header className="p-4 bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="font-bold text-xl text-indigo-900 tracking-tight flex items-center gap-2">
            <span className="text-2xl">🧠</span> Gemini Quiz
          </div>
          {status === AppStatus.PLAYING && (
             <div className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
               Score: {quizState.score}
             </div>
          )}
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center p-4">
        {status === AppStatus.WELCOME && (
          <WelcomeScreen onStart={handleStartQuiz} />
        )}

        {status === AppStatus.LOADING && (
          <div className="text-center animate-fade-in">
            <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800">Generating Questions...</h2>
            <p className="text-gray-500 mt-2">Crafting a unique quiz about <span className="font-medium text-indigo-600">"{loadingTopic}"</span></p>
          </div>
        )}

        {status === AppStatus.ERROR && (
          <div className="text-center max-w-md bg-white p-8 rounded-2xl shadow-xl border border-red-100">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
               <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 mb-2">Oops! Something went wrong</h2>
            <p className="text-gray-600 mb-6">{errorMsg}</p>
            <button
              onClick={() => setStatus(AppStatus.WELCOME)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {status === AppStatus.PLAYING && (
          <QuizScreen
            question={quizState.questions[quizState.currentQuestionIndex]}
            currentQuestionIndex={quizState.currentQuestionIndex}
            totalQuestions={quizState.questions.length}
            onAnswer={handleAnswer}
            onNext={handleNext}
          />
        )}

        {status === AppStatus.RESULTS && (
          <ResultScreen state={quizState} onRestart={handleRestart} />
        )}
      </main>

      <footer className="py-6 text-center text-gray-400 text-sm">
        Powered by Google Gemini 2.5 Flash
      </footer>
    </div>
  );
}

export default App;