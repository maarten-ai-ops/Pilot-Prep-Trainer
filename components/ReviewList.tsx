
import React, { useState } from 'react';
import { SavedQuestion } from '../types';
import { ArrowLeft, CheckCircle, XCircle, Trash2, Calendar } from 'lucide-react';

interface ReviewListProps {
  questions: SavedQuestion[];
  onBack: () => void;
  onClear: () => void;
}

export const ReviewList: React.FC<ReviewListProps> = ({ questions, onBack, onClear }) => {
  const [filter, setFilter] = useState<'all' | 'incorrect'>('all');

  const filtered = filter === 'all' 
    ? questions 
    : questions.filter(q => q.userAnswer !== q.correct_answer);

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-500 pb-12">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            </button>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Opgeslagen Vragen</h1>
        </div>
        <button onClick={onClear} className="text-sm text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 flex items-center gap-1">
            <Trash2 className="w-4 h-4" /> Wis Alles
        </button>
      </div>

      <div className="flex gap-2 mb-6">
          <button 
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === 'all' ? 'bg-slate-800 dark:bg-slate-700 text-white' : 'bg-white dark:bg-slate-850 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'}`}
          >
              Alles ({questions.length})
          </button>
          <button 
            onClick={() => setFilter('incorrect')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === 'incorrect' ? 'bg-red-600 text-white' : 'bg-white dark:bg-slate-850 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'}`}
          >
              Alleen Fouten
          </button>
      </div>

      <div className="space-y-6">
        {filtered.length === 0 ? (
            <div className="text-center py-12 text-slate-400 dark:text-slate-500">
                Geen vragen gevonden in deze categorie.
            </div>
        ) : (
            filtered.map((q, idx) => (
                <div key={idx} className="bg-white dark:bg-slate-850 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                        <span className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                            {q.topic}
                        </span>
                        <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
                            <Calendar className="w-3 h-3" />
                            {new Date(q.timestamp).toLocaleDateString()}
                        </div>
                    </div>
                    
                    <h3 className="font-medium text-lg text-slate-800 dark:text-slate-200 mb-4">{q.question}</h3>

                    <div className="mb-4 space-y-2">
                        {q.options.map(opt => {
                            const label = opt.charAt(0);
                            const isCorrect = label === q.correct_answer;
                            const isUserSelection = label === q.userAnswer;
                            
                            let style = "bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-400";
                            if (isCorrect) style = "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-400 font-medium";
                            else if (isUserSelection) style = "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-400";

                            return (
                                <div key={opt} className={`p-3 rounded border text-sm flex items-center justify-between ${style}`}>
                                    <span>{opt}</span>
                                    {isCorrect && <CheckCircle className="w-4 h-4" />}
                                    {isUserSelection && !isCorrect && <XCircle className="w-4 h-4" />}
                                </div>
                            )
                        })}
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-sm text-slate-700 dark:text-slate-300">
                        <span className="font-bold text-blue-800 dark:text-blue-300">Uitleg:</span> {q.explanation}
                    </div>
                </div>
            ))
        )}
      </div>
    </div>
  );
};
