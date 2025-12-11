
import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, RefreshCw, Check, X, Trophy, Zap, Calculator } from 'lucide-react';

interface Problem {
  text: string;
  answer: string; // Stored as string to handle fractions easily
  explanation: string;
}

export const SpeedMath: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [problem, setProblem] = useState<Problem | null>(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [streak, setStreak] = useState(0);
  const [score, setScore] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Math generators
  const generateProblem = () => {
    const types = ['add', 'sub', 'mul', 'frac'];
    const type = types[Math.floor(Math.random() * types.length)];

    let p: Problem;

    switch (type) {
      case 'add': {
        const a = Math.floor(Math.random() * 90) + 10;
        const b = Math.floor(Math.random() * 90) + 10;
        p = {
          text: `${a} + ${b}`,
          answer: (a + b).toString(),
          explanation: `${a} + ${b} = ${a + b}`
        };
        break;
      }
      case 'sub': {
        const a = Math.floor(Math.random() * 100) + 20;
        const b = Math.floor(Math.random() * (a - 10)) + 5;
        p = {
          text: `${a} - ${b}`,
          answer: (a - b).toString(),
          explanation: `${a} - ${b} = ${a - b}`
        };
        break;
      }
      case 'mul': {
        // Tables 2 to 15
        const a = Math.floor(Math.random() * 14) + 2;
        const b = Math.floor(Math.random() * 10) + 2;
        p = {
          text: `${a} × ${b}`,
          answer: (a * b).toString(),
          explanation: `${a} × ${b} = ${a * b}`
        };
        break;
      }
      case 'frac': {
        const num1 = Math.floor(Math.random() * 3) + 1;
        const den1 = Math.floor(Math.random() * 3) + 2; // 2 to 4
        const num2 = Math.floor(Math.random() * 3) + 1;
        const den2 = Math.floor(Math.random() * 3) + 2;
        
        const subtype = Math.random() > 0.5 ? 'mul' : 'add_same';
        
        if (subtype === 'add_same') {
             const den = Math.floor(Math.random() * 5) + 3; // 3 to 7
             const n1 = Math.floor(Math.random() * (den - 1)) + 1;
             const n2 = Math.floor(Math.random() * (den - 1)) + 1;
             p = {
                 text: `${n1}/${den} + ${n2}/${den}`,
                 answer: `${n1+n2}/${den}`,
                 explanation: `${n1}/${den} + ${n2}/${den} = ${n1+n2}/${den}`
             };
        } else {
            // Multiplication
             p = {
                 text: `${num1}/${den1} × ${num2}/${den2}`,
                 answer: `${num1*num2}/${den1*den2}`,
                 explanation: `Teller × Teller, Noemer × Noemer: ${num1*num2}/${den1*den2}`
             };
        }
        break;
      }
      default:
        p = { text: "1+1", answer: "2", explanation: "2" };
    }
    setProblem(p);
    setFeedback(null);
    setUserAnswer("");
    // Focus input after render
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  useEffect(() => {
    generateProblem();
  }, []);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!problem || !userAnswer) return;

    // Normalizing answer (trim spaces)
    if (userAnswer.trim() === problem.answer) {
      setFeedback('correct');
      setStreak(s => s + 1);
      setScore(s => s + 1);
      setTimeout(generateProblem, 1000); // Auto next
    } else {
      setFeedback('incorrect');
      setStreak(0);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
        if (feedback === 'incorrect') {
            generateProblem();
        } else {
            handleSubmit();
        }
    }
  };

  return (
    <div className="max-w-md mx-auto animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8">
        <button onClick={onBack} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
        </button>
        <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Calculator className="w-6 h-6 text-purple-600 dark:text-purple-400" /> Snelrekenen
        </h2>
        <div className="w-9"></div> {/* Spacer */}
      </div>

      {/* Stats Bar */}
      <div className="flex justify-between mb-8 bg-white dark:bg-slate-850 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="text-center">
              <div className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold">Streak</div>
              <div className="flex items-center justify-center gap-1 text-orange-500 font-bold text-xl">
                  <Zap className="w-4 h-4 fill-current" /> {streak}
              </div>
          </div>
          <div className="text-center">
              <div className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold">Score</div>
              <div className="flex items-center justify-center gap-1 text-blue-600 dark:text-blue-400 font-bold text-xl">
                  <Trophy className="w-4 h-4" /> {score}
              </div>
          </div>
      </div>

      {/* Problem Card */}
      <div className="bg-white dark:bg-slate-850 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-8 text-center mb-6">
          <div className="text-5xl font-bold text-slate-800 dark:text-white mb-8 tracking-wider">
              {problem?.text}
          </div>

          <div className="relative">
            {/* Added bg-white and text-slate-900 explicit class for high visibility */}
            <input
                ref={inputRef}
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="?"
                className={`w-full text-center text-3xl font-bold py-4 rounded-xl border-2 outline-none transition-all shadow-inner ${
                    feedback === 'correct' ? 'border-green-500 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300' :
                    feedback === 'incorrect' ? 'border-red-500 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300' :
                    'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:border-purple-500 focus:ring-4 focus:ring-purple-100 dark:focus:ring-purple-900'
                }`}
                autoComplete="off"
            />
            
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
                {feedback === 'correct' && <Check className="w-8 h-8 text-green-500" />}
                {feedback === 'incorrect' && <X className="w-8 h-8 text-red-500" />}
            </div>
          </div>

          <div className="h-12 mt-4 flex items-center justify-center">
              {feedback === 'incorrect' && (
                  <div className="text-red-600 dark:text-red-400 animate-in fade-in slide-in-from-top-2">
                      <p className="font-bold">Helaas!</p>
                      <p className="text-sm">{problem?.explanation}</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Druk Enter voor volgende</p>
                  </div>
              )}
              {feedback === 'correct' && (
                  <div className="text-green-600 dark:text-green-400 font-bold animate-in zoom-in duration-200">
                      Goed zo!
                  </div>
              )}
          </div>
      </div>

      <button 
        onClick={() => { if (feedback) generateProblem(); else handleSubmit(); }}
        className={`w-full py-4 rounded-xl font-bold text-lg shadow-md transition-all ${
            feedback === 'incorrect' ? 'bg-slate-800 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 text-white' :
            'bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600 text-white'
        }`}
      >
          {feedback === 'incorrect' ? 'Volgende Vraag' : 'Controleer'}
      </button>

      <div className="mt-8 text-center text-xs text-slate-400 dark:text-slate-500">
          Tip: Gebruik breuken zoals 3/4. Vereenvoudigen is niet verplicht tenzij het helpt.
      </div>
    </div>
  );
};
