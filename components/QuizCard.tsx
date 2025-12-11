
import React, { useState } from 'react';
import { Question, Difficulty } from '../types';
import { CheckCircle, XCircle, HelpCircle, ArrowRight, Book, ShieldCheck, ListOrdered, PenTool, Image as ImageIcon, ThumbsUp } from 'lucide-react';
import { explainMore, getStepBreakdown, verifyQuestionAnswer, generateVennDiagram } from '../services/geminiService';
import { successMessages } from '../data/motivation';

interface QuizCardProps {
  question: Question;
  onAnswer: (answer: string) => void;
  onNext: () => void;
  isAnswered: boolean;
  userAnswer: string | null;
  isMathMode: boolean;
  termDefinitions: string | null;
}

export const QuizCard: React.FC<QuizCardProps> = ({
  question,
  onAnswer,
  onNext,
  isAnswered,
  userAnswer,
  isMathMode,
  termDefinitions,
}) => {
  const [extendedExplanation, setExtendedExplanation] = useState<string | null>(null);
  const [loadingExplanation, setLoadingExplanation] = useState(false);
  
  const [steps, setSteps] = useState<{step: string, hint: string}[] | null>(null);
  const [loadingSteps, setLoadingSteps] = useState(false);
  const [visibleStepIndex, setVisibleStepIndex] = useState(-1);

  const [verificationResult, setVerificationResult] = useState<string | null>(null);
  const [loadingVerify, setLoadingVerify] = useState(false);

  const [scratchpad, setScratchpad] = useState("");
  const [showScratchpad, setShowScratchpad] = useState(false);

  // Venn Diagram State (SVG String)
  const [vennSvg, setVennSvg] = useState<string | null>(null);
  const [loadingVenn, setLoadingVenn] = useState(false);
  
  // Dynamic Success Message
  const [successMsg, setSuccessMsg] = useState("");

  // Reset local state when question changes
  React.useEffect(() => {
    setExtendedExplanation(null);
    setSteps(null);
    setVisibleStepIndex(-1);
    setVerificationResult(null);
    setScratchpad("");
    setShowScratchpad(false);
    setVennSvg(null);
    setLoadingVenn(false);
    // Pick random success message
    setSuccessMsg(successMessages[Math.floor(Math.random() * successMessages.length)]);
  }, [question]);

  const handleExplainMore = async () => {
    setLoadingExplanation(true);
    const text = await explainMore(question);
    setExtendedExplanation(text);
    setLoadingExplanation(false);
  };

  const handleSteps = async () => {
    if (steps) return; // Already loaded
    setLoadingSteps(true);
    const data = await getStepBreakdown(question);
    setSteps(data);
    setVisibleStepIndex(0); // Show first step
    setLoadingSteps(false);
  };

  const handleVerify = async () => {
    setLoadingVerify(true);
    const result = await verifyQuestionAnswer(question);
    setVerificationResult(result);
    setLoadingVerify(false);
  };

  const handleGenerateVenn = async () => {
    if (vennSvg) return; 
    setLoadingVenn(true);
    // We pass the question text (statements) to the generator
    const svg = await generateVennDiagram(question.question);
    setVennSvg(svg);
    setLoadingVenn(false);
  };

  const getOptionClass = (optionLabel: string) => {
    const baseClass = "p-4 border-2 rounded-lg cursor-pointer transition-all flex items-center";
    
    if (!isAnswered) {
      return `${baseClass} border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-slate-50 dark:hover:bg-slate-800`;
    }

    if (optionLabel === question.correct_answer) {
      return `${baseClass} border-green-500 bg-green-50 dark:bg-green-900/20 dark:border-green-600`;
    }

    if (optionLabel === userAnswer && userAnswer !== question.correct_answer) {
      return `${baseClass} border-red-500 bg-red-50 dark:bg-red-900/20 dark:border-red-600`;
    }

    return `${baseClass} border-slate-200 dark:border-slate-700 opacity-50 dark:opacity-40`;
  };

  const difficultyLabel = {
      [Difficulty.Easy]: 'Makkelijk',
      [Difficulty.Medium]: 'Gemiddeld',
      [Difficulty.Hard]: 'Moeilijk'
  }[question.difficulty] || question.difficulty;

  const isSyllogism = question.topic.toLowerCase().includes('syllogisme');

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-slate-850 rounded-xl shadow-lg overflow-hidden border border-slate-100 dark:border-slate-700 transition-colors">
      {/* Header */}
      <div className="bg-slate-50 dark:bg-slate-900 px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
        <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          {question.topic}
        </span>
        <div className="flex gap-2">
            {isMathMode && (
                <span className="bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-xs px-2 py-1 rounded-full font-bold">
                    REKENEN
                </span>
            )}
            <span className={`text-xs px-2 py-1 rounded-full font-bold ${
            question.difficulty === Difficulty.Easy ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400' :
            question.difficulty === Difficulty.Medium ? 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-400' :
            'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400'
            }`}>
            {difficultyLabel}
            </span>
        </div>
      </div>

      {/* content */}
      <div className="p-6">
        <h3 className="text-lg md:text-xl font-medium text-slate-800 dark:text-slate-100 mb-6 leading-relaxed">
          {question.question}
        </h3>
        
        {/* Term Definitions (Begrippenlijst) */}
        {termDefinitions && !isAnswered && (
             <div className="mb-6 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800 text-sm text-slate-700 dark:text-slate-300 animate-in fade-in">
                 <div className="flex items-center gap-2 mb-1 font-semibold text-blue-800 dark:text-blue-300">
                    <Book className="w-4 h-4" /> Begrippenlijst
                 </div>
                 <div className="whitespace-pre-wrap pl-6 text-xs md:text-sm">
                     {termDefinitions}
                 </div>
             </div>
        )}

        {/* Action Buttons: Steps, Venn, Scratchpad */}
        {!isAnswered && (
            <div className="flex flex-wrap gap-4 mb-6">
                {!steps && (
                    <button 
                        onClick={handleSteps}
                        className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center gap-2 font-medium"
                    >
                        <ListOrdered className="w-4 h-4" />
                        {loadingSteps ? "Stappen laden..." : "Help met Stappen"}
                    </button>
                )}
                
                {isSyllogism && (
                    <button 
                        onClick={handleGenerateVenn}
                        disabled={loadingVenn}
                        className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 flex items-center gap-2 font-medium"
                    >
                        <ImageIcon className="w-4 h-4" />
                        {loadingVenn ? "Diagram tekenen..." : "Teken Venn Diagram"}
                    </button>
                )}

                <button 
                    onClick={() => setShowScratchpad(!showScratchpad)}
                    className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-2 font-medium ml-auto"
                >
                    <PenTool className="w-4 h-4" />
                    {showScratchpad ? "Verberg Kladblok" : "Kladblok"}
                </button>
            </div>
        )}

        {/* Venn Diagram Display */}
        {vennSvg && !isAnswered && (
            <div className="mb-6 p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 flex flex-col items-center animate-in fade-in">
                <h4 className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-2 w-full text-left">AI Visualisatie van Stellingen</h4>
                <div 
                    className="bg-white p-2 rounded shadow-sm w-full max-w-sm"
                    dangerouslySetInnerHTML={{ __html: vennSvg }}
                />
                <p className="text-xs text-slate-400 mt-2 italic">Gegenereerd met Gemini Flash (SVG)</p>
            </div>
        )}

        {/* Scratchpad Area */}
        {showScratchpad && !isAnswered && (
            <div className="mb-6 animate-in slide-in-from-top-2">
                <label className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase mb-1 block">Jouw Berekening / Gedachten</label>
                <textarea
                    value={scratchpad}
                    onChange={(e) => setScratchpad(e.target.value)}
                    className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg text-sm font-mono text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 h-32 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 outline-none resize-y"
                    placeholder={`1. Noteer de gegevens...\n2. Bepaal de formule...\n3. Reken uit...`}
                />
            </div>
        )}

        {/* Steps Display */}
        {steps && (
            <div className="mb-6 space-y-3">
                {steps.map((step, idx) => (
                    <div key={idx} className={`border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden transition-all ${idx > visibleStepIndex ? 'opacity-50' : 'opacity-100'}`}>
                        {idx <= visibleStepIndex ? (
                            <div className="bg-slate-50 dark:bg-slate-800 p-3">
                                <div className="font-semibold text-slate-700 dark:text-slate-200 text-sm mb-1">Stap {idx + 1}: {step.step}</div>
                                {idx < visibleStepIndex && (
                                    <div className="text-green-700 dark:text-green-400 text-sm italic pl-4 border-l-2 border-green-300 dark:border-green-700">
                                        Resultaat: {step.hint}
                                    </div>
                                )}
                                {idx === visibleStepIndex && (
                                    <button 
                                        onClick={() => setVisibleStepIndex(i => i + 1)}
                                        className="mt-2 text-xs bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-2 py-1 rounded hover:bg-blue-200 dark:hover:bg-blue-900"
                                    >
                                        Toon uitkomst van deze stap
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="bg-slate-100 dark:bg-slate-900 p-2 text-slate-400 dark:text-slate-600 text-xs text-center">
                                Stap {idx + 1} (Nog vergrendeld)
                            </div>
                        )}
                    </div>
                ))}
            </div>
        )}

        <div className="space-y-3">
          {question.options.map((opt) => {
             const label = opt.charAt(0); 
             return (
                <div
                key={opt}
                onClick={() => !isAnswered && onAnswer(label)}
                className={getOptionClass(label)}
                >
                <span className="font-bold text-slate-600 dark:text-slate-300 w-8">{label}</span>
                <span className="text-slate-700 dark:text-slate-200">{opt.substring(2).trim() || opt}</span>
                {isAnswered && label === question.correct_answer && (
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 ml-auto" />
                )}
                {isAnswered && label === userAnswer && userAnswer !== question.correct_answer && (
                    <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 ml-auto" />
                )}
                </div>
            );
          })}
        </div>

        {isAnswered && (
          <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className={`p-4 rounded-lg mb-4 ${
              userAnswer === question.correct_answer 
                ? 'bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800' 
                : 'bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800'
            }`}>
              <div className="font-semibold mb-1 flex items-center gap-2">
                 {userAnswer === question.correct_answer ? (
                    <>
                        <ThumbsUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                        <span className="text-green-800 dark:text-green-300">{successMsg}</span>
                    </>
                 ) : (
                    <span className="text-red-800 dark:text-red-300">Helaas fout. Het antwoord is {question.correct_answer}.</span>
                 )}
              </div>
              <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed mt-2">
                {question.explanation}
              </p>
            </div>
            
            {/* Show Scratchpad content after answering for review */}
            {scratchpad && (
                <div className="mb-4 p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-500 dark:text-slate-400 font-mono whitespace-pre-wrap">
                    <div className="font-bold mb-1">Jouw aantekeningen:</div>
                    {scratchpad}
                </div>
            )}
            
            {/* Show Venn Diagram also after answer if generated */}
            {vennSvg && (
                <div className="mb-4 p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 flex flex-col items-center">
                    <h4 className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-2 w-full text-left">Gegenereerd Venn Diagram</h4>
                    <div 
                        className="bg-white p-2 rounded shadow-sm w-full max-w-sm"
                        dangerouslySetInnerHTML={{ __html: vennSvg }}
                    />
                </div>
            )}

            <div className="flex flex-wrap gap-3 mb-4">
              <button
                onClick={handleExplainMore}
                disabled={loadingExplanation}
                className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors text-sm font-medium border border-blue-200 dark:border-blue-800"
              >
                <HelpCircle className="w-4 h-4" />
                {loadingExplanation ? 'Gemini raadplegen...' : 'Meer Uitleg'}
              </button>
              
              <button
                onClick={handleVerify}
                disabled={loadingVerify}
                className="flex items-center gap-2 px-4 py-2 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-300 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors text-sm font-medium border border-purple-200 dark:border-purple-800"
              >
                <ShieldCheck className="w-4 h-4" />
                {loadingVerify ? 'Controleren...' : 'Extra Controle'}
              </button>

              <button
                onClick={onNext}
                className="ml-auto flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg transition-colors shadow-sm font-medium"
              >
                Volgende Vraag
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {extendedExplanation && (
               <div className="mt-4 p-4 bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800 rounded-lg text-slate-700 dark:text-slate-300 text-sm whitespace-pre-wrap animate-in fade-in">
                  <h4 className="font-bold text-blue-800 dark:text-blue-300 mb-2">Uitgebreide Uitleg:</h4>
                  {extendedExplanation}
               </div>
            )}
            
            {verificationResult && (
               <div className="mt-4 p-4 bg-purple-50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-800 rounded-lg text-slate-700 dark:text-slate-300 text-sm whitespace-pre-wrap animate-in fade-in">
                  <h4 className="font-bold text-purple-800 dark:text-purple-300 mb-2 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4"/> AI Verificatie:
                  </h4>
                  {verificationResult}
               </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
