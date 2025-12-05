import React, { useState } from 'react';
import { Sparkles, Brain, Zap } from 'lucide-react';

interface WelcomeScreenProps {
  onStart: (topic: string) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  const [topic, setTopic] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStart(topic.trim() || 'General Knowledge');
  };

  const suggestions = ['Space Exploration', 'Ancient History', 'Movie Trivia', 'JavaScript', 'World Capitals'];

  return (
    <div className="w-full max-w-2xl mx-auto p-6 animate-fade-in">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 text-indigo-600 mb-4 shadow-sm">
          <Brain size={32} />
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">
          Gemini Quiz Master
        </h1>
        <p className="text-lg text-gray-600">
          Challenge yourself with AI-generated questions on any topic imaginable.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-2">
              What do you want to learn about today?
            </label>
            <div className="relative">
              <input
                id="topic"
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Quantum Physics, 90s Pop Music..."
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow outline-none text-lg"
              />
              <Sparkles className="absolute right-3 top-3.5 text-gray-400" size={20} />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="text-xs text-gray-500 font-medium uppercase tracking-wider py-1">Popular:</span>
            {suggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setTopic(s)}
                className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full transition-colors"
              >
                {s}
              </button>
            ))}
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-md hover:shadow-lg transform transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <Zap size={20} />
            Generate Quiz
          </button>
        </form>
      </div>
    </div>
  );
};

export default WelcomeScreen;