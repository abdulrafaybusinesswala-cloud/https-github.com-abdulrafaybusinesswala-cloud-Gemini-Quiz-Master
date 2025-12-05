import React from 'react';
import { QuizState } from '../types';
import { Trophy, RefreshCw, Check, X, BookOpen } from 'lucide-react';

interface ResultScreenProps {
  state: QuizState;
  onRestart: () => void;
}

const ResultScreen: React.FC<ResultScreenProps> = ({ state, onRestart }) => {
  const percentage = Math.round((state.score / state.questions.length) * 100);
  
  let message = "";
  let colorClass = "";
  
  if (percentage === 100) {
    message = "Perfect Score! You're a genius!";
    colorClass = "text-yellow-600 bg-yellow-50 border-yellow-200";
  } else if (percentage >= 80) {
    message = "Great job! You know your stuff.";
    colorClass = "text-green-600 bg-green-50 border-green-200";
  } else if (percentage >= 60) {
    message = "Good effort! A little more study needed.";
    colorClass = "text-blue-600 bg-blue-50 border-blue-200";
  } else {
    message = "Keep learning! You'll get it next time.";
    colorClass = "text-gray-600 bg-gray-50 border-gray-200";
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-yellow-100 text-yellow-500 mb-6 shadow-sm">
          <Trophy size={40} />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Quiz Complete!</h2>
        <div className={`inline-block px-6 py-2 rounded-full border ${colorClass} font-medium text-sm mb-4`}>
          {message}
        </div>
        <p className="text-5xl font-extrabold text-indigo-900 mb-2">
          {state.score} <span className="text-2xl text-gray-400 font-normal">/ {state.questions.length}</span>
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-10">
        <div className="col-span-full">
           <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
             <BookOpen size={20} className="text-indigo-500"/> 
             Review Answers
           </h3>
        </div>
        
        {state.questions.map((q, idx) => {
          const userAnswer = state.answers.find(a => a.questionId === q.id);
          const isCorrect = userAnswer?.isCorrect;

          return (
            <div key={q.id} className={`p-5 rounded-xl border ${isCorrect ? 'border-green-200 bg-green-50/30' : 'border-red-200 bg-red-50/30'}`}>
              <div className="flex gap-3 mb-2">
                <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {idx + 1}
                </span>
                <p className="font-medium text-gray-900 text-sm">{q.text}</p>
              </div>
              
              <div className="ml-9 space-y-1 text-sm">
                <div className={`flex items-center gap-2 ${isCorrect ? 'text-green-700' : 'text-red-600 line-through opacity-75'}`}>
                   {isCorrect ? <Check size={14}/> : <X size={14}/>}
                   <span className="font-medium">Your Answer:</span> {userAnswer?.selected}
                </div>
                {!isCorrect && (
                  <div className="flex items-center gap-2 text-green-700">
                    <Check size={14} />
                    <span className="font-medium">Correct:</span> {q.correctAnswer}
                  </div>
                )}
                <div className="mt-2 text-xs text-gray-500 italic border-l-2 border-gray-300 pl-2">
                  {q.explanation}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-center pb-12">
        <button
          onClick={onRestart}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transform transition-all active:scale-95 flex items-center gap-2"
        >
          <RefreshCw size={20} />
          Play Another Quiz
        </button>
      </div>
    </div>
  );
};

export default ResultScreen;