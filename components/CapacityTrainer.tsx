
import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Brain, Compass, Play, RefreshCw, Check, X, Radio } from 'lucide-react';

interface CapacityTrainerProps {
  onBack: () => void;
}

type Mode = 'MENU' | 'MEMORY' | 'COMPASS';

// --- MEMORY GAME ---
interface MemoryData {
  callsign: string;
  altitude: number;
  heading: number;
  speed: number;
}

const MemoryGame: React.FC<{ onExit: () => void }> = ({ onExit }) => {
  const [phase, setPhase] = useState<'MEMORIZE' | 'RECALL' | 'FEEDBACK'>('MEMORIZE');
  const [data, setData] = useState<MemoryData | null>(null);
  const [inputs, setInputs] = useState({ altitude: '', heading: '', speed: '' });
  const [timeLeft, setTimeLeft] = useState(5);
  const [score, setScore] = useState(0);

  const generateData = () => {
    const callsigns = ['KLM', 'TRA', 'EZY', 'BAW', 'DLH'];
    const nums = Math.floor(Math.random() * 899) + 100;
    
    setData({
      callsign: `${callsigns[Math.floor(Math.random() * callsigns.length)]} ${nums}`,
      altitude: (Math.floor(Math.random() * 30) + 10) * 1000, // 10000 - 40000
      heading: Math.floor(Math.random() * 36) * 10, // 0 - 360 steps of 10
      speed: (Math.floor(Math.random() * 20) + 15) * 10, // 150 - 350
    });
    setInputs({ altitude: '', heading: '', speed: '' });
    setTimeLeft(5);
    setPhase('MEMORIZE');
  };

  useEffect(() => {
    generateData();
  }, []);

  useEffect(() => {
    if (phase === 'MEMORIZE' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
      return () => clearTimeout(timer);
    } else if (phase === 'MEMORIZE' && timeLeft === 0) {
      setPhase('RECALL');
    }
  }, [phase, timeLeft]);

  const handleSubmit = () => {
    if (!data) return;
    const altCorrect = Math.abs(parseInt(inputs.altitude) - data.altitude) === 0;
    const hdgCorrect = Math.abs(parseInt(inputs.heading) - data.heading) === 0;
    const spdCorrect = Math.abs(parseInt(inputs.speed) - data.speed) === 0;
    
    if (altCorrect && hdgCorrect && spdCorrect) setScore(s => s + 1);
    setPhase('FEEDBACK');
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
            <Radio className="w-5 h-5" /> Cockpit Memory
        </h3>
        <div className="text-sm font-bold bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full">
            Score: {score}
        </div>
      </div>

      <div className="bg-slate-900 rounded-xl p-8 shadow-xl border-4 border-slate-700 relative overflow-hidden min-h-[300px] flex flex-col items-center justify-center">
        {/* Screen Glare Effect */}
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-white/5 to-transparent pointer-events-none"></div>

        {phase === 'MEMORIZE' && data && (
          <div className="text-center space-y-6 animate-in fade-in zoom-in duration-300">
             <div className="text-orange-500 font-mono text-xl mb-4 border-b border-slate-700 pb-2">
                 INCOMING TRANSMISSION
             </div>
             <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-left font-mono text-lg">
                 <div className="text-slate-400 text-sm uppercase">Callsign</div>
                 <div className="text-green-400 font-bold">{data.callsign}</div>
                 
                 <div className="text-slate-400 text-sm uppercase">Altitude</div>
                 <div className="text-green-400 font-bold">{data.altitude} ft</div>
                 
                 <div className="text-slate-400 text-sm uppercase">Heading</div>
                 <div className="text-green-400 font-bold">{data.heading}°</div>
                 
                 <div className="text-slate-400 text-sm uppercase">Speed</div>
                 <div className="text-green-400 font-bold">{data.speed} kts</div>
             </div>
             <div className="mt-6 text-red-500 font-bold animate-pulse text-sm">
                 Closing in {timeLeft}s...
             </div>
          </div>
        )}

        {phase === 'RECALL' && (
           <div className="w-full space-y-4 animate-in fade-in">
              <div className="text-center text-slate-400 text-sm mb-4 font-mono">ENTER FLIGHT DATA</div>
              <div>
                  <label className="text-xs text-slate-500 uppercase font-bold">Altitude (ft)</label>
                  <input 
                    type="number" 
                    pattern="[0-9]*"
                    value={inputs.altitude}
                    onChange={e => setInputs({...inputs, altitude: e.target.value})}
                    className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-green-400 font-mono text-lg focus:ring-2 focus:ring-green-500 outline-none"
                    placeholder="e.g. 24000"
                    autoFocus
                  />
              </div>
              <div>
                  <label className="text-xs text-slate-500 uppercase font-bold">Heading (°)</label>
                  <input 
                    type="number" 
                    pattern="[0-9]*"
                    value={inputs.heading}
                    onChange={e => setInputs({...inputs, heading: e.target.value})}
                    className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-green-400 font-mono text-lg focus:ring-2 focus:ring-green-500 outline-none"
                    placeholder="e.g. 240"
                  />
              </div>
              <div>
                  <label className="text-xs text-slate-500 uppercase font-bold">Speed (kts)</label>
                  <input 
                    type="number" 
                    pattern="[0-9]*"
                    value={inputs.speed}
                    onChange={e => setInputs({...inputs, speed: e.target.value})}
                    className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-green-400 font-mono text-lg focus:ring-2 focus:ring-green-500 outline-none"
                    placeholder="e.g. 250"
                  />
              </div>
              <button 
                onClick={handleSubmit}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded mt-4"
              >
                  SUBMIT READBACK
              </button>
           </div>
        )}

        {phase === 'FEEDBACK' && data && (
            <div className="w-full text-center animate-in fade-in space-y-4">
                <div className="text-sm text-slate-400 font-mono mb-2">MISSION REPORT</div>
                
                <div className="grid grid-cols-3 gap-2 text-sm font-mono border-b border-slate-700 pb-2 mb-2">
                    <div className="text-slate-500">PARAM</div>
                    <div className="text-slate-500">ACTUAL</div>
                    <div className="text-slate-500">YOURS</div>
                </div>

                <div className="space-y-2 font-mono">
                    <div className="grid grid-cols-3 gap-2 items-center">
                        <div className="text-left text-slate-300 text-xs">ALTITUDE</div>
                        <div className="text-green-400">{data.altitude}</div>
                        <div className={parseInt(inputs.altitude) === data.altitude ? "text-green-400" : "text-red-400"}>{inputs.altitude || "---"}</div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 items-center">
                        <div className="text-left text-slate-300 text-xs">HEADING</div>
                        <div className="text-green-400">{data.heading}</div>
                        <div className={parseInt(inputs.heading) === data.heading ? "text-green-400" : "text-red-400"}>{inputs.heading || "---"}</div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 items-center">
                        <div className="text-left text-slate-300 text-xs">SPEED</div>
                        <div className="text-green-400">{data.speed}</div>
                        <div className={parseInt(inputs.speed) === data.speed ? "text-green-400" : "text-red-400"}>{inputs.speed || "---"}</div>
                    </div>
                </div>

                <button 
                    onClick={generateData}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded mt-6 flex items-center justify-center gap-2"
                >
                    <RefreshCw className="w-4 h-4" /> NEXT TRANSMISSION
                </button>
            </div>
        )}
      </div>
      <div className="mt-4 text-center">
           <button onClick={onExit} className="text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">Stoppen</button>
      </div>
    </div>
  )
};

// --- COMPASS GAME ---
const CompassGame: React.FC<{ onExit: () => void }> = ({ onExit }) => {
    const [currentHeading, setCurrentHeading] = useState(0);
    const [turn, setTurn] = useState({ dir: 'LEFT', amount: 0 });
    const [input, setInput] = useState('');
    const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
    const [score, setScore] = useState(0);

    const generate = () => {
        const start = Math.floor(Math.random() * 36) * 10; // 0-350
        const amount = (Math.floor(Math.random() * 18) + 1) * 10; // 10-180
        const dir = Math.random() > 0.5 ? 'LEFT' : 'RIGHT';
        
        setCurrentHeading(start);
        setTurn({ dir, amount });
        setInput('');
        setFeedback(null);
    };

    useEffect(() => { generate() }, []);

    const checkAnswer = (e?: React.FormEvent) => {
        e?.preventDefault();
        let correct = 0;
        if (turn.dir === 'RIGHT') {
            correct = (currentHeading + turn.amount) % 360;
        } else {
            correct = (currentHeading - turn.amount);
            if (correct < 0) correct += 360;
        }
        
        // Allow 360 as 0
        const userVal = parseInt(input);
        
        if (userVal === correct || (userVal === 360 && correct === 0) || (userVal === 0 && correct === 360)) {
            setFeedback('correct');
            setScore(s => s + 1);
            setTimeout(generate, 1000);
        } else {
            setFeedback('incorrect');
            setInput(''); // Clear for retry
        }
    };

    return (
        <div className="max-w-md mx-auto text-center">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                    <Compass className="w-5 h-5" /> Compass Math
                </h3>
                <div className="text-sm font-bold bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 px-3 py-1 rounded-full">
                    Score: {score}
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-8 mb-6">
                <div className="mb-8">
                    <div className="text-sm text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Huidige Koers</div>
                    <div className="text-4xl font-black text-slate-800 dark:text-white mb-6">
                        {currentHeading.toString().padStart(3, '0')}°
                    </div>
                    
                    <div className="flex items-center justify-center gap-4 text-xl font-bold p-4 bg-slate-100 dark:bg-slate-900 rounded-lg">
                        {turn.dir === 'LEFT' ? <ArrowLeft className="w-8 h-8 text-blue-500" /> : null}
                        <span className={turn.dir === 'LEFT' ? 'text-blue-500' : 'text-orange-500'}>
                             {turn.dir === 'LEFT' ? 'LEFT' : 'RIGHT'} {turn.amount}°
                        </span>
                        {turn.dir === 'RIGHT' ? <ArrowLeft className="w-8 h-8 text-orange-500 rotate-180" /> : null}
                    </div>
                </div>

                <form onSubmit={checkAnswer} className="relative max-w-[200px] mx-auto">
                    <input 
                        type="number" 
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        className={`w-full text-center text-3xl font-bold py-3 rounded-xl border-2 outline-none transition-all ${
                            feedback === 'correct' ? 'border-green-500 bg-green-50 text-green-700' :
                            feedback === 'incorrect' ? 'border-red-500 bg-red-50 text-red-700 animate-shake' :
                            'border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 dark:text-white focus:border-purple-500'
                        }`}
                        placeholder="???"
                        autoFocus
                    />
                    <div className="absolute right-0 top-0 h-full flex items-center pr-3 pointer-events-none">
                        {feedback === 'correct' && <Check className="w-6 h-6 text-green-500" />}
                        {feedback === 'incorrect' && <X className="w-6 h-6 text-red-500" />}
                    </div>
                </form>
            </div>

            <button onClick={onExit} className="text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">Stoppen</button>
        </div>
    );
};

export const CapacityTrainer: React.FC<CapacityTrainerProps> = ({ onBack }) => {
  const [mode, setMode] = useState<Mode>('MENU');

  if (mode === 'MEMORY') return <MemoryGame onExit={() => setMode('MENU')} />;
  if (mode === 'COMPASS') return <CompassGame onExit={() => setMode('MENU')} />;

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-500 pb-12">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
        </button>
        <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Capaciteitentraining</h1>
            <p className="text-slate-500 dark:text-slate-400">Train je werkgeheugen en ruimtelijk inzicht.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
          <button 
            onClick={() => setMode('MEMORY')}
            className="group relative overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 text-left shadow-lg border border-slate-700 hover:border-blue-500 transition-all"
          >
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
                  <Brain className="w-32 h-32 text-white" />
              </div>
              <div className="relative z-10">
                  <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-blue-900/50">
                      <Radio className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Cockpit Memory</h3>
                  <p className="text-slate-400 mb-6">Onthoud ATC instructies (Callsign, Altitude, Heading) en doe een readback.</p>
                  <div className="inline-flex items-center gap-2 text-blue-400 font-bold group-hover:text-blue-300">
                      Start Training <Play className="w-4 h-4 fill-current" />
                  </div>
              </div>
          </button>

          <button 
            onClick={() => setMode('COMPASS')}
            className="group relative overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 text-left shadow-lg border border-slate-700 hover:border-purple-500 transition-all"
          >
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
                  <Compass className="w-32 h-32 text-white" />
              </div>
              <div className="relative z-10">
                  <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-purple-900/50">
                      <Compass className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Compass & Turns</h3>
                  <p className="text-slate-400 mb-6">Bereken vliegensvlug nieuwe koersen. Cruciaal voor intercepties en holding entries.</p>
                  <div className="inline-flex items-center gap-2 text-purple-400 font-bold group-hover:text-purple-300">
                      Start Training <Play className="w-4 h-4 fill-current" />
                  </div>
              </div>
          </button>
      </div>

      <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border border-blue-200 dark:border-blue-800">
          <h4 className="font-bold text-blue-900 dark:text-blue-300 mb-2">Waarom dit trainen?</h4>
          <p className="text-sm text-slate-700 dark:text-slate-300">
              Pilootselecties (zoals DLR, POQ, COMPASS test) testen of je "restcapaciteit" hebt. Kun je nog nadenken terwijl je vliegt? Door deze basisvaardigheden te automatiseren, houd je hersencapaciteit over voor het vliegen zelf.
          </p>
      </div>
    </div>
  );
};
