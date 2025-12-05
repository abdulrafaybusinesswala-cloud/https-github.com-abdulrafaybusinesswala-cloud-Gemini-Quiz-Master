import React, { useState } from 'react';
import { Question } from '../types';
import { CheckCircle, XCircle, ArrowRight, HelpCircle } from 'lucide-react';

interface QuizScreenProps {
  question: Question;
  currentQuestionIndex: number;
  totalQuestions: number;
  onAnswer: (selected: string) => void;
  onNext: () => void;
}

const QuizScreen: React.FC<QuizScreenProps> = ({
  question,
  currentQuestionIndex,
  totalQuestions,
  onAnswer,
  onNext
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  const handleOptionClick = (option: string) => {
    if (isRevealed) return;
    setSelectedOption(option);
    setIsRevealed(true);
    onAnswer(option);
  };

  const handleNextClick = () => {
    setSelectedOption(null);
    setIsRevealed(false);
    onNext();
  };

  const getOptionStyles = (option: string) => {
    const baseStyles = "w-full p-4 rounded-xl border-2 text-left transition-all duration-200 flex items-center justify-between group";
    
    if (!isRevealed) {
      return `${baseStyles} border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 text-gray-700`;
    }

    if (option === question.correctAnswer) {
      return `${baseStyles} border-green-500 bg-green-50 text-green-700 font-medium`;
    }

    if (option === selectedOption && option !== question.correctAnswer) {
      return `${baseStyles} border-red-500 bg-red-50 text-red-700`;
    }

    return `${baseStyles} border-gray-100 text-gray-400 opacity-60`;
  };

  const progressPercentage = ((currentQuestionIndex) / totalQuestions) * 100;

  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm font-medium text-gray-500 mb-2">
          <span>Question {currentQuestionIndex + 1} of {totalQuestions}</span>
          <span>{Math.round(progressPercentage)}% completed</span>
        </div>
        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-indigo-600 transition-all duration-500 ease-out"
            style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 leading-snug">
            {question.text}
          </h2>

          <div className="space-y-3">
            {question.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleOptionClick(option)}
                disabled={isRevealed}
                className={getOptionStyles(option)}
              >
                <span className="flex items-center gap-3">
                  <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold border ${
                    isRevealed && option === question.correctAnswer ? 'border-green-500 bg-green-100 text-green-700' : 
                    isRevealed && option === selectedOption ? 'border-red-500 bg-red-100 text-red-700' :
                    'border-gray-300 text-gray-500 group-hover:border-indigo-400 group-hover:text-indigo-600'
                  }`}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span>{option}</span>
                </span>
                
                {isRevealed && option === question.correctAnswer && (
                  <CheckCircle className="text-green-500 w-6 h-6" />
                )}
                {isRevealed && selectedOption === option && option !== question.correctAnswer && (
                  <XCircle className="text-red-500 w-6 h-6" />
                )}
              </button>
            ))}
          </div>
        </div>
        
        {/* Explanation Footer */}
        {isRevealed && (
          <div className="bg-gray-50 p-6 border-t border-gray-100 animate-fade-in-up">
            <div className="flex gap-3 mb-4">
              <HelpCircle className="text-indigo-500 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <h4 className="font-semibold text-gray-900">Explanation</h4>
                <p className="text-gray-600 mt-1 text-sm leading-relaxed">
                  {question.explanation}
                </p>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleNextClick}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-sm"
              >
                {currentQuestionIndex === totalQuestions - 1 ? 'Finish Quiz' : 'Next Question'}
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizScreen;