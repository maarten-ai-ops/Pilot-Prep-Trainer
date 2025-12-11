
import React, { useState, useEffect, useCallback } from 'react';
import { AppView, Question, Difficulty, UserStats, SessionResult, SavedQuestion, StudyPlan } from './types';
import { generateQuestionBatch, extractTopics, getTermDefinitions } from './services/geminiService';
import { starterQuestions } from './data/starterQuestions'; 
import { QuizCard } from './components/QuizCard';
import { Timer } from './components/Timer';
import { Dashboard } from './components/Dashboard';
import { StudyGuide } from './components/StudyGuide';
import { SpeedMath } from './components/SpeedMath';
import { ReviewList } from './components/ReviewList';
import { Planner } from './components/Planner';
import { CapacityTrainer } from './components/CapacityTrainer';
import { Toast, ToastType } from './components/Toast';
import { Plane, BarChart2, BookOpen, Calculator, Upload, Check, GraduationCap, Zap, Archive, Moon, Sun, CloudSun, Wind, Calendar, Brain } from 'lucide-react';
import { pilotQuotes, loadingMessages } from './data/motivation';

const initialStats: UserStats = {
  totalQuestions: 0,
  correct: 0,
  topicBreakdown: {},
  difficultyStats: {
    [Difficulty.Easy]: { total: 0, correct: 0 },
    [Difficulty.Medium]: { total: 0, correct: 0 },
    [Difficulty.Hard]: { total: 0, correct: 0 },
  },
  history: [],
};

const initialPlan: StudyPlan = {
    examDate: null,
    targetQuestions: 2000,
    startDate: new Date().toISOString()
};

const DEFAULT_TOPICS = [
  "Analogieën",
  "Syllogismen",
  "Rekenvaardigheid",
  "Redactiesommen",
  "Cijferreeksen",
  "Verbaal Redeneren",
  "Stroomdiagrammen"
];

function App() {
  const [view, setView] = useState<AppView>(AppView.HOME);
  const [topics, setTopics] = useState<string[]>(DEFAULT_TOPICS);
  const [selectedTopic, setSelectedTopic] = useState<string>("");
  const [isMathMode, setIsMathMode] = useState(false);
  
  // Quiz State
  const [questionQueue, setQuestionQueue] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [termDefinitions, setTermDefinitions] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("Laden...");
  const [userAnswer, setUserAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  
  // Session State
  const [sessionScore, setSessionScore] = useState(0);
  const [sessionTotal, setSessionTotal] = useState(0);
  
  // Stats & Data
  const [stats, setStats] = useState<UserStats>(initialStats);
  const [savedQuestions, setSavedQuestions] = useState<SavedQuestion[]>([]);
  const [studyPlan, setStudyPlan] = useState<StudyPlan>(initialPlan);
  
  // UI State
  const [customInputText, setCustomInputText] = useState("");
  const [isParsing, setIsParsing] = useState(false);
  const [toast, setToast] = useState<{msg: string, type: ToastType} | null>(null);
  const [studyCategory, setStudyCategory] = useState<string | undefined>(undefined);
  const [dailyQuote, setDailyQuote] = useState("");

  // Theme State
  const [darkMode, setDarkMode] = useState(false);

  // Initialize Theme based on system preference
  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
    }
  }, []);

  // Initialize Quote
  useEffect(() => {
      const randomQuote = pilotQuotes[Math.floor(Math.random() * pilotQuotes.length)];
      setDailyQuote(randomQuote);
  }, []);

  // Helper for notifications
  const showToast = (msg: string, type: ToastType = 'info') => {
    setToast({ msg, type });
  };

  // --- PERSISTENCE: LOAD ---
  useEffect(() => {
    try {
      const savedStats = localStorage.getItem('pilot_prep_stats');
      if (savedStats) setStats(JSON.parse(savedStats));
      
      const savedTopics = localStorage.getItem('pilot_prep_topics');
      if (savedTopics) setTopics(JSON.parse(savedTopics));

      const savedPlan = localStorage.getItem('pilot_prep_plan');
      if (savedPlan) setStudyPlan(JSON.parse(savedPlan));

      const savedQ = localStorage.getItem('pilot_prep_saved_questions');
      if (savedQ) {
          const parsed = JSON.parse(savedQ);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setSavedQuestions(parsed);
          } else {
            setSavedQuestions(starterQuestions);
            localStorage.setItem('pilot_prep_saved_questions', JSON.stringify(starterQuestions));
          }
      } else {
          setSavedQuestions(starterQuestions);
          localStorage.setItem('pilot_prep_saved_questions', JSON.stringify(starterQuestions));
      }

      // Restore Active Session
      const activeSession = localStorage.getItem('pilot_prep_active_session');
      if (activeSession) {
          const session = JSON.parse(activeSession);
          // Only restore if we were in a quiz or speed math mode
          if (session.view === AppView.QUIZ && session.questionQueue && session.questionQueue.length > 0) {
              setQuestionQueue(session.questionQueue);
              setCurrentQuestionIndex(session.currentQuestionIndex);
              setSessionScore(session.sessionScore);
              setSessionTotal(session.sessionTotal);
              setSelectedTopic(session.selectedTopic);
              setIsMathMode(session.isMathMode);
              setUserAnswer(session.userAnswer);
              setIsAnswered(session.isAnswered);
              setView(AppView.QUIZ);
              showToast("Je vorige sessie is hersteld!", 'success');
          } else if (session.view === AppView.SPEED_MATH) {
              setView(AppView.SPEED_MATH);
          } else if (session.view === AppView.CAPACITY) {
              setView(AppView.CAPACITY);
          }
      }
    } catch (e) {
      console.error("Error loading local storage:", e);
      showToast("Er was een fout bij het laden van je gegevens.", 'error');
    }
  }, []);

  // --- PERSISTENCE: SAVE LONG TERM ---
  useEffect(() => {
    localStorage.setItem('pilot_prep_stats', JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    localStorage.setItem('pilot_prep_saved_questions', JSON.stringify(savedQuestions));
  }, [savedQuestions]);

  useEffect(() => {
    localStorage.setItem('pilot_prep_plan', JSON.stringify(studyPlan));
  }, [studyPlan]);

  useEffect(() => {
    localStorage.setItem('pilot_prep_topics', JSON.stringify(topics));
  }, [topics]);

  // --- PERSISTENCE: SAVE ACTIVE SESSION (SHORT TERM) ---
  useEffect(() => {
    // We save the state of the active quiz so a refresh doesn't kill progress
    const sessionState = {
        view,
        questionQueue,
        currentQuestionIndex,
        sessionScore,
        sessionTotal,
        selectedTopic,
        isMathMode,
        userAnswer,
        isAnswered
    };
    
    // Only save if we are actually doing something worth saving
    if (view === AppView.QUIZ || view === AppView.SPEED_MATH || view === AppView.CAPACITY) {
        localStorage.setItem('pilot_prep_active_session', JSON.stringify(sessionState));
    } else if (view === AppView.HOME) {
        // If we go home, we consider the active session "paused" or "cleared" depending on logic.
        // But to keep it simple: if you go Home via the menu, we usually clear it in endSession.
        // This effect runs on view change, so we rely on endSession to removeItem.
    }
  }, [view, questionQueue, currentQuestionIndex, sessionScore, sessionTotal, selectedTopic, isMathMode, userAnswer, isAnswered]);

  const currentQuestion = questionQueue[currentQuestionIndex] || null;

  useEffect(() => {
    const fetchDefinitions = async () => {
      setTermDefinitions(null); 
      if (currentQuestion) {
        const defs = await getTermDefinitions(currentQuestion.question);
        setTermDefinitions(defs);
      }
    };
    fetchDefinitions();
  }, [currentQuestion]);

  const handleParseTopics = async () => {
      if (!customInputText.trim()) return;
      setIsParsing(true);
      
      try {
          const extracted = await extractTopics(customInputText);
          const newTopics = (extracted && extracted.length > 0) 
            ? extracted 
            : customInputText.split(/\n/).filter(line => line.length > 3 && line.length < 50).slice(0, 10);

          setTopics(prev => Array.from(new Set([...prev, ...newTopics])));
          setCustomInputText("");
          showToast(`Succesvol ${newTopics.length} onderwerpen toegevoegd!`, 'success');
      } catch (e) {
          showToast("Kon onderwerpen niet analyseren. Probeer het opnieuw.", 'error');
      } finally {
        setIsParsing(false);
      }
  };

  const startSession = async (topic: string, mathMode: boolean = false) => {
    setSelectedTopic(topic);
    setIsMathMode(mathMode);
    setSessionScore(0);
    setSessionTotal(0);
    
    // Pick random loading message
    setLoadingText(loadingMessages[Math.floor(Math.random() * loadingMessages.length)]);
    setIsLoading(true);
    setView(AppView.QUIZ);

    try {
      const difficulties = [Difficulty.Easy, Difficulty.Medium, Difficulty.Hard];
      const difficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
      
      const batch = await generateQuestionBatch(topic, difficulty, mathMode);
      setQuestionQueue(batch);
      setCurrentQuestionIndex(0);
      setIsAnswered(false);
      setUserAnswer(null);
    } catch (error) {
      console.error(error);
      showToast("Kon geen vragen genereren. Controleer je connectie of probeer later.", 'error');
      setView(AppView.HOME);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswer = (answer: string) => {
    if (isAnswered || !currentQuestion) return;
    
    setUserAnswer(answer);
    setIsAnswered(true);
    
    const isCorrect = answer === currentQuestion.correct_answer;
    
    const savedQ: SavedQuestion = {
        ...currentQuestion,
        id: Date.now().toString(),
        userAnswer: answer,
        timestamp: new Date().toISOString()
    };
    setSavedQuestions(prev => [savedQ, ...prev]);

    setSessionTotal(prev => prev + 1);
    if (isCorrect) setSessionScore(prev => prev + 1);

    setStats(prev => {
      const newStats = { ...prev };
      newStats.totalQuestions++;
      if (isCorrect) newStats.correct++;
      
      const topic = currentQuestion.topic;
      if (!newStats.topicBreakdown[topic]) {
        newStats.topicBreakdown[topic] = { total: 0, correct: 0, timeSpent: 0 };
      }
      newStats.topicBreakdown[topic].total++;
      if (isCorrect) newStats.topicBreakdown[topic].correct++;
      
      newStats.difficultyStats[currentQuestion.difficulty].total++;
      if (isCorrect) newStats.difficultyStats[currentQuestion.difficulty].correct++;
      
      return newStats;
    });
  };

  const handleNext = async () => {
    if (currentQuestionIndex < questionQueue.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setIsAnswered(false);
        setUserAnswer(null);
        setTermDefinitions(null);
    } else {
        endSession();
    }
  };

  const endSession = () => {
    // If we have data to save to history, do it
    if (questionQueue.length > 0 && sessionTotal > 0) {
        const result: SessionResult = {
            date: new Date().toISOString(),
            topic: selectedTopic,
            score: sessionScore,
            total: sessionTotal,
            averageTime: 0,
            mode: isMathMode ? 'Math' : 'Standard'
        };

        setStats(prev => ({
            ...prev,
            history: [...prev.history, result]
        }));
    }

    // CLEAR ACTIVE SESSION STORAGE
    localStorage.removeItem('pilot_prep_active_session');

    setView(AppView.HOME);
    setQuestionQueue([]);
    setSessionScore(0);
    setSessionTotal(0);
    // Refresh the quote
    setDailyQuote(pilotQuotes[Math.floor(Math.random() * pilotQuotes.length)]);
  };

  const getTimerDuration = () => {
    if (!currentQuestion) return 60;
    const topicLower = currentQuestion.topic.toLowerCase();
    if (topicLower.includes('redactie') || topicLower.includes('reken') || topicLower.includes('cijfer')) return 120; 
    switch(currentQuestion.difficulty) {
        case Difficulty.Easy: return 45;
        case Difficulty.Medium: return 60;
        case Difficulty.Hard: return 90;
        default: return 60;
    }
  };

  const openStudyGuide = (category?: string) => {
    setStudyCategory(category);
    setView(AppView.STUDY);
  }

  // --- PLANNER REMINDER LOGIC ---
  const getReminder = () => {
      if (!studyPlan.examDate) return null;
      const today = new Date().toDateString();
      const lastSession = stats.history.length > 0 ? new Date(stats.history[stats.history.length - 1].date).toDateString() : null;
      
      if (lastSession !== today) {
          return "Je hebt vandaag nog niet getraind! Blijf op schema voor je examen.";
      }
      return null;
  }
  const reminder = getReminder();

  const renderHome = () => (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
      <header className="mb-10 text-center relative">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-200 mb-4 transition-colors">
          <Plane className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2 transition-colors">Piloot Selectie Trainer</h1>
        <p className="text-slate-600 dark:text-slate-400">AI-gedreven voorbereiding op selectie- en capaciteitentests</p>
      </header>
      
      {/* Daily Flight Briefing Card */}
      <div className="mb-6 p-6 bg-gradient-to-r from-sky-100 to-blue-50 dark:from-slate-800 dark:to-slate-900 rounded-xl border border-sky-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
            <Wind className="w-24 h-24 text-blue-500" />
        </div>
        <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2 text-blue-700 dark:text-blue-300 font-bold uppercase text-xs tracking-wider">
                <CloudSun className="w-4 h-4" /> Flight Briefing
            </div>
            <p className="text-lg md:text-xl font-medium text-slate-800 dark:text-slate-100 italic">
                "{dailyQuote}"
            </p>
        </div>
      </div>

      {/* Reminder Notification */}
      {reminder && (
          <div className="mb-8 p-4 bg-orange-50 dark:bg-orange-900/20 border-l-4 border-orange-500 text-orange-800 dark:text-orange-200 text-sm flex items-center justify-between shadow-sm animate-pulse">
              <span>{reminder}</span>
              <button 
                onClick={() => startSession("Rekenvaardigheid", true)}
                className="px-3 py-1 bg-orange-100 dark:bg-orange-800 text-orange-700 dark:text-orange-200 rounded text-xs font-bold hover:bg-orange-200"
              >
                  Start Nu
              </button>
          </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <button 
            onClick={() => setView(AppView.DASHBOARD)}
            className="p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md transition-all text-left group flex flex-col items-center text-center md:items-start md:text-left"
        >
            <BarChart2 className="w-8 h-8 text-blue-500 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="font-bold text-lg text-slate-800 dark:text-white">Voortgang</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Scores en advies</p>
        </button>

         {/* PLANNER BUTTON */}
         <button 
            onClick={() => setView(AppView.PLANNER)}
            className="p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-md transition-all text-left group flex flex-col items-center text-center md:items-start md:text-left"
        >
            <Calendar className="w-8 h-8 text-indigo-500 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="font-bold text-lg text-slate-800 dark:text-white">Vluchtplan</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                {studyPlan.examDate 
                    ? `Nog ${Math.ceil((new Date(studyPlan.examDate).getTime() - new Date().getTime()) / (1000*3600*24))} dagen` 
                    : "Plan je examen"}
            </p>
        </button>

         {/* CAPACITY BUTTON (NEW) */}
         <button 
            onClick={() => setView(AppView.CAPACITY)}
            className="p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:border-teal-400 dark:hover:border-teal-500 hover:shadow-md transition-all text-left group flex flex-col items-center text-center md:items-start md:text-left"
        >
            <Brain className="w-8 h-8 text-teal-500 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="font-bold text-lg text-slate-800 dark:text-white">Capaciteit</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Geheugen & Ruimtelijke Oriëntatie
            </p>
        </button>
        
        <button 
            onClick={() => openStudyGuide()}
            className="p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:border-green-400 dark:hover:border-green-500 hover:shadow-md transition-all text-left group flex flex-col items-center text-center md:items-start md:text-left"
        >
            <GraduationCap className="w-8 h-8 text-green-500 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="font-bold text-lg text-slate-800 dark:text-white">Kennisbank</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Regels en trucs</p>
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-2 space-y-4">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Start AI Sessie
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                    onClick={() => startSession("Rekenvaardigheid", true)}
                    className="col-span-1 sm:col-span-2 px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all text-left font-bold flex items-center gap-2"
                >
                    <Calculator className="w-5 h-5" /> Start Rekentraining (Redactiesommen)
                </button>
                <button
                    onClick={() => setView(AppView.SPEED_MATH)}
                    className="px-6 py-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-left font-medium text-slate-700 dark:text-slate-200 hover:border-purple-500 dark:hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-slate-700 hover:text-purple-700 dark:hover:text-purple-300 transition-all shadow-sm flex items-center gap-2"
                >
                    <Zap className="w-4 h-4" /> Oefen Snelrekenen (Drill)
                </button>
                {topics.map((topic) => (
                    <button
                        key={topic}
                        onClick={() => startSession(topic)}
                        className="px-6 py-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-left font-medium text-slate-700 dark:text-slate-200 hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-blue-700 dark:hover:text-blue-300 transition-all shadow-sm"
                    >
                        {topic}
                    </button>
                ))}
            </div>
        </div>

        <div className="md:col-span-1">
             <div className="h-full p-6 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col">
                <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-3 flex items-center gap-2">
                    <Upload className="w-4 h-4" /> Eigen Onderwerp
                </h3>
                <textarea 
                    className="w-full flex-grow text-sm p-3 border rounded-md mb-2 bg-white dark:bg-slate-700 dark:text-white dark:border-slate-600 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 outline-none transition-shadow resize-none"
                    placeholder="Plak hier tekst of een lijst met onderwerpen..."
                    value={customInputText}
                    onChange={(e) => setCustomInputText(e.target.value)}
                />
                <button 
                    onClick={handleParseTopics}
                    disabled={isParsing || !customInputText.trim()}
                    className="w-full text-sm bg-slate-800 dark:bg-slate-900 text-white py-3 rounded hover:bg-slate-700 dark:hover:bg-slate-950 disabled:opacity-50 font-medium"
                >
                    {isParsing ? 'Analyseren...' : 'Onderwerpen Toevoegen'}
                </button>
             </div>
             
             {/* Archive Link */}
             <button 
                onClick={() => setView(AppView.REVIEW)}
                className="w-full mt-4 p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-2 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium text-sm hover:border-blue-300"
             >
                 <Archive className="w-4 h-4" /> Bekijk Opgeslagen Vragen
             </button>
        </div>
      </div>
    </div>
  );

  const renderQuiz = () => (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <button 
            onClick={endSession}
            className="text-sm text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 font-medium"
        >
            Sessie Stoppen
        </button>
        <div className="flex items-center gap-4">
            <span className="text-xs font-semibold text-blue-600 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/50 px-3 py-1 rounded-full">
                Vraag {currentQuestionIndex + 1} van {questionQueue.length}
            </span>
            <div className="text-sm font-bold text-slate-800 dark:text-white bg-white dark:bg-slate-800 px-4 py-2 rounded-full shadow-sm">
                Score: {sessionScore}/{sessionTotal}
            </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-64 space-y-4 bg-white dark:bg-slate-800 p-8 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
            <div className="w-12 h-12 border-4 border-blue-200 dark:border-blue-900 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin"></div>
            <div className="text-center">
                <p className="text-lg font-semibold text-slate-700 dark:text-slate-200 italic">"{loadingText}"</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Oefenset wordt voorbereid...</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-4">Powered by Gemini 3 Pro & Flash</p>
            </div>
        </div>
      ) : currentQuestion ? (
        <>
            <Timer 
                key={currentQuestionIndex}
                duration={getTimerDuration()} 
                onTimeExpire={() => {}} 
                isActive={!isAnswered}
                onTick={() => {}} 
            />
            <QuizCard 
                question={currentQuestion}
                onAnswer={handleAnswer}
                onNext={handleNext}
                isAnswered={isAnswered}
                userAnswer={userAnswer}
                isMathMode={isMathMode}
                termDefinitions={termDefinitions}
            />
        </>
      ) : (
          <div className="text-center py-12">
              <p className="dark:text-white">Er is iets misgegaan. <button onClick={endSession} className="text-blue-600 dark:text-blue-400 underline">Terug naar start</button></p>
          </div>
      )}
    </div>
  );

  return (
    <div className={`${darkMode ? 'dark' : ''}`}>
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-4 md:p-8 transition-colors duration-300">
            {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
            
            {/* Dark Mode Toggle */}
            <button 
                onClick={() => setDarkMode(!darkMode)}
                className="fixed top-4 right-4 z-50 p-2 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md hover:bg-slate-100 dark:hover:bg-slate-700 transition-all text-slate-600 dark:text-yellow-400"
                title={darkMode ? "Licht modus" : "Donker modus"}
            >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {view === AppView.HOME && renderHome()}
            {view === AppView.QUIZ && renderQuiz()}
            {view === AppView.DASHBOARD && (
            <Dashboard 
                stats={stats} 
                onClose={() => setView(AppView.HOME)} 
                onNavigateToStudy={(cat) => openStudyGuide(cat)}
            />
            )}
            {view === AppView.STUDY && (
            <StudyGuide 
                onBack={() => setView(AppView.HOME)} 
                initialCategory={studyCategory} 
            />
            )}
            {view === AppView.SPEED_MATH && (
                <SpeedMath onBack={() => setView(AppView.HOME)} />
            )}
            {view === AppView.REVIEW && (
                <ReviewList 
                    questions={savedQuestions} 
                    onBack={() => setView(AppView.HOME)}
                    onClear={() => setSavedQuestions([])}
                />
            )}
            {view === AppView.PLANNER && (
                <Planner 
                    plan={studyPlan}
                    stats={stats}
                    onSavePlan={setStudyPlan}
                    onBack={() => setView(AppView.HOME)}
                />
            )}
            {view === AppView.CAPACITY && (
                <CapacityTrainer onBack={() => setView(AppView.HOME)} />
            )}
        </div>
    </div>
  );
}

export default App;
