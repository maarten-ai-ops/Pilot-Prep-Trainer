
import React, { useState, useEffect } from 'react';
import { StudyPlan, UserStats, SessionResult } from '../types';
import { Calendar, Save, Target, Clock, AlertTriangle, CheckCircle, ArrowLeft, Plane } from 'lucide-react';

interface PlannerProps {
  plan: StudyPlan;
  stats: UserStats;
  onSavePlan: (plan: StudyPlan) => void;
  onBack: () => void;
}

export const Planner: React.FC<PlannerProps> = ({ plan, stats, onSavePlan, onBack }) => {
  const [examDate, setExamDate] = useState(plan.examDate || "");
  const [targetQuestions, setTargetQuestions] = useState(plan.targetQuestions || 2000);
  const [isEditing, setIsEditing] = useState(!plan.examDate);

  // Calculations
  const today = new Date();
  const exam = new Date(examDate);
  const start = new Date(plan.startDate || new Date());
  
  // Time Diff
  const timeDiff = exam.getTime() - today.getTime();
  const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));
  
  // Progress
  const questionsDone = stats.totalQuestions;
  const questionsRemaining = Math.max(0, targetQuestions - questionsDone);
  const dailyGoal = daysLeft > 0 ? Math.ceil(questionsRemaining / daysLeft) : 0;
  
  const percentDone = Math.min(100, Math.round((questionsDone / targetQuestions) * 100));

  // Calendar Logic (Current Month)
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay(); // 0 = Sun

  // Get active days from history
  const activeDays = new Set(stats.history.map(h => new Date(h.date).toDateString()));

  const handleSave = () => {
    onSavePlan({
      examDate,
      targetQuestions,
      startDate: plan.startDate || new Date().toISOString()
    });
    setIsEditing(false);
  };

  const renderCalendar = () => {
    const blanks = Array.from({ length: firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1 }, (_, i) => i); // Adjust for Monday start
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    return (
      <div className="grid grid-cols-7 gap-1 text-center text-sm">
        {['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo'].map(d => (
          <div key={d} className="font-bold text-slate-400 py-2">{d}</div>
        ))}
        {blanks.map(b => <div key={`blank-${b}`} className="h-10"></div>)}
        {days.map(d => {
          const dateStr = new Date(currentYear, currentMonth, d).toDateString();
          const isActive = activeDays.has(dateStr);
          const isToday = d === today.getDate();
          
          return (
            <div 
              key={d} 
              className={`h-10 flex items-center justify-center rounded-lg transition-all ${
                isActive 
                  ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 font-bold border border-green-200 dark:border-green-800' 
                  : isToday 
                    ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-bold'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
              }`}
            >
              {d}
              {isActive && <div className="absolute w-1 h-1 bg-green-500 rounded-full mt-6"></div>}
            </div>
          );
        })}
      </div>
    );
  };

  if (isEditing) {
    return (
      <div className="max-w-2xl mx-auto animate-in fade-in duration-500">
         <div className="flex items-center gap-4 mb-8">
            <button onClick={() => plan.examDate ? setIsEditing(false) : onBack()} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            </button>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Vluchtplan Instellen</h1>
        </div>

        <div className="bg-white dark:bg-slate-850 p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
            <div className="mb-6">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                    Wanneer is je selectie / examen?
                </label>
                <input 
                    type="date" 
                    value={examDate}
                    onChange={(e) => setExamDate(e.target.value)}
                    className="w-full p-4 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <p className="text-xs text-slate-500 mt-2">Bijv: Maart 2026</p>
            </div>

            <div className="mb-8">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                    Hoeveel oefenvragen wil je maken?
                </label>
                <input 
                    type="number" 
                    value={targetQuestions}
                    onChange={(e) => setTargetQuestions(parseInt(e.target.value))}
                    className="w-full p-4 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <p className="text-xs text-slate-500 mt-2">Gemiddeld maken succesvolle kandidaten 1500-2500 vragen.</p>
            </div>

            <button 
                onClick={handleSave}
                disabled={!examDate}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
                <Save className="w-5 h-5" /> Sla Vluchtplan Op
            </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-500 pb-12">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            </button>
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Jouw Vluchtplan</h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Bestemming: {new Date(examDate).toLocaleDateString('nl-NL', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
        </div>
        <button 
            onClick={() => setIsEditing(true)}
            className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
        >
            Wijzig Plan
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Status Card */}
          <div className="md:col-span-2 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                <div className="absolute right-0 top-0 opacity-10 p-4">
                    <Plane className="w-32 h-32" />
                </div>
                
                <div className="relative z-10">
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <div className="text-blue-200 text-sm font-bold uppercase tracking-wider mb-1">Status</div>
                            <h2 className="text-3xl font-bold">
                                {daysLeft < 0 ? "Examen Datum Verstreken" : `${daysLeft} Dagen tot Examen`}
                            </h2>
                        </div>
                        <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                            <Clock className="w-6 h-6 text-white" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between text-sm mb-1 text-blue-100">
                                <span>Voortgang Doel ({questionsDone}/{targetQuestions})</span>
                                <span>{percentDone}%</span>
                            </div>
                            <div className="w-full bg-blue-950/50 rounded-full h-3">
                                <div 
                                    className="bg-green-400 h-3 rounded-full transition-all duration-1000" 
                                    style={{ width: `${percentDone}%` }}
                                ></div>
                            </div>
                        </div>

                        <div className="flex gap-4 mt-4">
                            <div className="bg-white/10 rounded-lg p-3 flex-1 backdrop-blur-sm">
                                <div className="text-xs text-blue-200 uppercase">Dagelijks Doel</div>
                                <div className="text-xl font-bold flex items-center gap-2">
                                    <Target className="w-4 h-4" /> {dailyGoal} <span className="text-xs font-normal opacity-70">vragen/dag</span>
                                </div>
                            </div>
                             <div className={`bg-white/10 rounded-lg p-3 flex-1 backdrop-blur-sm border ${questionsDone > (targetQuestions - (daysLeft * dailyGoal)) ? 'border-green-400/50' : 'border-orange-400/50'}`}>
                                <div className="text-xs text-blue-200 uppercase">Koers</div>
                                <div className="text-lg font-bold flex items-center gap-2">
                                    {questionsDone >= (targetQuestions / (timeDiff / (1000*3600*24)) * ((new Date().getTime() - new Date(plan.startDate).getTime())/(1000*3600*24))) ? (
                                        <><CheckCircle className="w-5 h-5 text-green-400" /> On Track</>
                                    ) : (
                                        <><AlertTriangle className="w-5 h-5 text-orange-400" /> Achter</>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
          </div>

          {/* Tips Card */}
          <div className="bg-white dark:bg-slate-850 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" /> Tips voor Succes
                </h3>
                <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                    <li className="flex gap-2">
                        <span className="font-bold text-blue-500">1.</span>
                        Probeer elke dag minimaal 15 minuten te pakken, ook op drukke dagen.
                    </li>
                    <li className="flex gap-2">
                        <span className="font-bold text-blue-500">2.</span>
                        Focus op je zwakke punten (rood in dashboard) in het weekend.
                    </li>
                    <li className="flex gap-2">
                        <span className="font-bold text-blue-500">3.</span>
                        Gebruik de 'Snelrekenen' modus als warming-up.
                    </li>
                </ul>
          </div>
      </div>

      {/* Calendar View */}
      <div className="bg-white dark:bg-slate-850 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg text-slate-800 dark:text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-slate-500" /> Trainingskalender
            </h3>
            <span className="text-xs text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                {today.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </span>
        </div>
        {renderCalendar()}
        <div className="mt-4 text-xs text-slate-400 text-center">
            Groene vakken zijn dagen waarop je getraind hebt. Probeer de ketting niet te breken!
        </div>
      </div>
    </div>
  );
};
