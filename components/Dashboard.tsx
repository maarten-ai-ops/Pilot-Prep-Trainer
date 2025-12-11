
import React from 'react';
import { UserStats, SessionResult, AppView } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { Trophy, Clock, Target, AlertTriangle, Lightbulb, ArrowRight, Star, Award } from 'lucide-react';
import { pilotRanks } from '../data/motivation';

interface DashboardProps {
  stats: UserStats;
  onClose: () => void;
  onNavigateToStudy: (category: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ stats, onClose, onNavigateToStudy }) => {
  // Process data for charts
  const topicData = Object.entries(stats.topicBreakdown).map(([topic, data]) => {
    const typedData = data as { total: number; correct: number; timeSpent: number };
    return {
      name: topic.length > 15 ? topic.substring(0, 15) + '...' : topic,
      fullTopic: topic,
      accuracy: typedData.total > 0 ? Math.round((typedData.correct / typedData.total) * 100) : 0,
      total: typedData.total
    };
  }).sort((a, b) => b.accuracy - a.accuracy);

  const pieData = [
      { name: 'Juist', value: stats.correct, color: '#22c55e' },
      { name: 'Onjuist', value: stats.totalQuestions - stats.correct, color: '#ef4444' }
  ];

  const overallAccuracy = stats.totalQuestions > 0 ? Math.round((stats.correct / stats.totalQuestions) * 100) : 0;
  
  // Find weak areas (accuracy < 60%)
  const weakAreas = topicData.filter(d => d.accuracy < 60 && d.total > 0);

  // Recommendation Logic
  const getRecommendation = () => {
    if (weakAreas.length === 0) return null;
    
    // Sort weak areas by lowest accuracy
    const weakest = weakAreas.sort((a, b) => a.accuracy - b.accuracy)[0];
    const topic = weakest.fullTopic.toLowerCase();

    if (topic.includes('reken') || topic.includes('cijfer') || topic.includes('redactie')) {
      return {
        text: `Je nauwkeurigheid bij ${weakest.fullTopic} is ${weakest.accuracy}%. Bekijk de rekenregels en trucs.`,
        category: 'math_basics',
        label: 'Naar Rekentrucs'
      };
    } else if (topic.includes('syllogisme') || topic.includes('logica')) {
      return {
        text: `Syllogismen kunnen lastig zijn (${weakest.accuracy}%). Leer hoe je Venn-diagrammen tekent.`,
        category: 'logic_verbal',
        label: 'Naar Logica Uitleg'
      };
    } else {
      return {
        text: `Blijf oefenen met ${weakest.fullTopic}. Bekijk de algemene tips in de kennisbank.`,
        category: 'logic_verbal',
        label: 'Naar Kennisbank'
      };
    }
  };

  const recommendation = getRecommendation();

  // Rank Calculation
  const currentRank = pilotRanks.slice().reverse().find(r => stats.correct >= r.minCorrect) || pilotRanks[0];
  const nextRank = pilotRanks.find(r => r.minCorrect > stats.correct);
  const questionsNeeded = nextRank ? nextRank.minCorrect - stats.correct : 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
        <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Piloot Profiel</h2>
            <button onClick={onClose} className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400">
                Terug naar Menu
            </button>
        </div>

      {/* Rank Card */}
      <div className="bg-gradient-to-r from-blue-900 to-slate-900 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
            <Award className="w-32 h-32" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
            <div className="flex flex-col items-center">
                <div className="bg-slate-800 p-4 rounded-lg border-2 border-yellow-500 shadow-xl mb-2 min-w-[100px] flex flex-col items-center gap-2">
                     {/* Epaulettes Visualization */}
                     {Array.from({ length: currentRank.bars }).map((_, i) => (
                         <div key={i} className="w-16 h-2 bg-yellow-400 rounded-full shadow-sm"></div>
                     ))}
                </div>
                <span className="text-xs uppercase tracking-widest text-slate-400 font-bold">Rang</span>
            </div>
            <div className="text-center md:text-left flex-1">
                <h3 className="text-2xl font-bold text-yellow-400 mb-1">{currentRank.title}</h3>
                <p className="text-blue-100 mb-4">{currentRank.description}</p>
                
                {nextRank ? (
                    <div className="space-y-2">
                        <div className="flex justify-between text-xs text-blue-200">
                            <span>Huidige XP: {stats.correct}</span>
                            <span>Volgende rang: {nextRank.minCorrect} ({questionsNeeded} nodig)</span>
                        </div>
                        <div className="w-full bg-blue-950 rounded-full h-2">
                            <div 
                                className="bg-yellow-400 h-2 rounded-full transition-all duration-1000" 
                                style={{ width: `${Math.min(100, (stats.correct / nextRank.minCorrect) * 100)}%` }}
                            ></div>
                        </div>
                    </div>
                ) : (
                    <div className="text-green-400 font-bold flex items-center gap-2">
                        <Star className="w-5 h-5 fill-current" /> Maximale rang bereikt!
                    </div>
                )}
            </div>
        </div>
      </div>

      {/* Advice Section */}
      {recommendation && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="p-3 bg-amber-100 dark:bg-amber-900/50 rounded-full text-amber-600 dark:text-amber-400">
                <Lightbulb className="w-6 h-6" />
            </div>
            <div className="flex-1">
                <h3 className="font-bold text-amber-900 dark:text-amber-100">Persoonlijk Studieadvies</h3>
                <p className="text-amber-800 dark:text-amber-200 text-sm mt-1">{recommendation.text}</p>
            </div>
            <button 
                onClick={() => onNavigateToStudy(recommendation.category)}
                className="px-4 py-2 bg-white dark:bg-slate-800 border border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900/30 font-medium text-sm flex items-center gap-2"
            >
                {recommendation.label} <ArrowRight className="w-4 h-4" />
            </button>
        </div>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-850 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-2 mb-2 text-slate-500 dark:text-slate-400">
            <Trophy className="w-4 h-4" />
            <span className="text-xs font-medium uppercase">Nauwkeurigheid</span>
          </div>
          <div className="text-2xl font-bold text-slate-800 dark:text-white">{overallAccuracy}%</div>
        </div>
        <div className="bg-white dark:bg-slate-850 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-2 mb-2 text-slate-500 dark:text-slate-400">
            <Target className="w-4 h-4" />
            <span className="text-xs font-medium uppercase">Vragen</span>
          </div>
          <div className="text-2xl font-bold text-slate-800 dark:text-white">{stats.totalQuestions}</div>
        </div>
        <div className="bg-white dark:bg-slate-850 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-2 mb-2 text-slate-500 dark:text-slate-400">
            <Clock className="w-4 h-4" />
            <span className="text-xs font-medium uppercase">Sessies</span>
          </div>
          <div className="text-2xl font-bold text-slate-800 dark:text-white">{stats.history.length}</div>
        </div>
        <div className="bg-white dark:bg-slate-850 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-2 mb-2 text-slate-500 dark:text-slate-400">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-xs font-medium uppercase">Zwakke Punten</span>
          </div>
          <div className="text-2xl font-bold text-slate-800 dark:text-white">{weakAreas.length}</div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Topic Performance Chart */}
        <div className="bg-white dark:bg-slate-850 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-6">Nauwkeurigheid per Onderwerp</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topicData} layout="vertical" margin={{ left: 20 }}>
                <XAxis type="number" domain={[0, 100]} hide />
                <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 12, fill: '#64748b'}} />
                <Tooltip 
                    cursor={{fill: '#f1f5f9'}} 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="accuracy" radius={[0, 4, 4, 0]} barSize={20}>
                  {topicData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.accuracy > 75 ? '#22c55e' : entry.accuracy > 50 ? '#eab308' : '#ef4444'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Difficulty Breakdown */}
        <div className="bg-white dark:bg-slate-850 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-6">Totaal Overzicht</h3>
           <div className="h-64 flex items-center justify-center">
             <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie 
                        data={pieData} 
                        innerRadius={60} 
                        outerRadius={80} 
                        paddingAngle={5} 
                        dataKey="value"
                    >
                        {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}/>
                </PieChart>
             </ResponsiveContainer>
           </div>
           <div className="flex justify-center gap-6 text-sm dark:text-slate-300">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span>Juist</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span>Onjuist</span>
                </div>
           </div>
        </div>
      </div>

      {/* Recent History Table */}
      <div className="bg-white dark:bg-slate-850 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Recente Sessies</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left dark:text-slate-300">
            <thead className="text-xs text-slate-500 dark:text-slate-400 uppercase bg-slate-50 dark:bg-slate-800">
              <tr>
                <th className="px-4 py-3">Datum</th>
                <th className="px-4 py-3">Modus</th>
                <th className="px-4 py-3">Onderwerp</th>
                <th className="px-4 py-3 text-right">Score</th>
              </tr>
            </thead>
            <tbody>
              {stats.history.slice().reverse().slice(0, 5).map((session, idx) => (
                <tr key={idx} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="px-4 py-3">{new Date(session.date).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${session.mode === 'Math' ? 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300' : 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300'}`}>
                        {session.mode === 'Math' ? 'Rekenen' : 'Standaard'}
                    </span>
                  </td>
                  <td className="px-4 py-3">{session.topic}</td>
                  <td className="px-4 py-3 text-right font-medium">
                    {session.score}/{session.total}
                  </td>
                </tr>
              ))}
              {stats.history.length === 0 && (
                  <tr>
                      <td colSpan={4} className="text-center py-4 text-slate-400">Nog geen sessies.</td>
                  </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
