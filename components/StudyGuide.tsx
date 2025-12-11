
import React, { useState } from 'react';
import { studyGuideData } from '../data/studyGuideData';
import { ChevronDown, ChevronRight, Calculator, BookOpen, Brain, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import { StudyCategory, StudySection } from '../types';
import { generateVennDiagram } from '../services/geminiService';

interface StudyGuideProps {
  onBack: () => void;
  initialCategory?: string;
}

export const StudyGuide: React.FC<StudyGuideProps> = ({ onBack, initialCategory }) => {
  const [activeCategory, setActiveCategory] = useState<string | null>(initialCategory || null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  
  // Image Generation State
  const [generatedSvg, setGeneratedSvg] = useState<string | null>(null);
  const [loadingImage, setLoadingImage] = useState(false);

  const toggleSection = (id: string) => {
    setExpandedSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Calculator': return <Calculator className="w-6 h-6" />;
      case 'BookOpen': return <BookOpen className="w-6 h-6" />;
      case 'Brain': return <Brain className="w-6 h-6" />;
      default: return <BookOpen className="w-6 h-6" />;
    }
  };

  const handleGenerateVenn = async () => {
      setLoadingImage(true);
      setGeneratedSvg(null);
      // Generate a Venn diagram for "Some A are B" as a generic helpful example
      const svg = await generateVennDiagram("Teken een Venn diagram waarbij Cirkel A en Cirkel B elkaar deels overlappen. Label ze A en B.");
      setGeneratedSvg(svg);
      setLoadingImage(false);
  };

  const renderContent = (content: string, sectionTitle: string) => {
    return content.split('\n').map((line, idx) => {
      const trimmed = line.trim();
      
      // Feature: Inject button for Venn Diagrams if mentioned in text
      if (trimmed.includes("Knop voor Voorbeeld")) {
          return (
              <div key={idx} className="my-4 p-4 border border-dashed border-blue-300 dark:border-blue-700 rounded-xl bg-blue-50 dark:bg-blue-900/10">
                  <p className="text-sm text-blue-800 dark:text-blue-300 mb-3 font-medium">
                      AI Tool: Genereer een visueel voorbeeld (Venn Diagram)
                  </p>
                  <button 
                    onClick={handleGenerateVenn}
                    disabled={loadingImage}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-all shadow-sm"
                  >
                      <ImageIcon className="w-4 h-4" />
                      {loadingImage ? "Aan het tekenen..." : "Genereer Venn Diagram"}
                  </button>

                  {generatedSvg && (
                      <div className="mt-4 animate-in fade-in">
                          <div 
                              className="bg-white p-2 rounded shadow-sm w-full max-w-sm"
                              dangerouslySetInnerHTML={{ __html: generatedSvg }}
                          />
                          <p className="text-xs text-slate-500 mt-2">Gegenereerd met Gemini Flash (SVG)</p>
                      </div>
                  )}
              </div>
          )
      }

      if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
        return <h4 key={idx} className="font-bold text-slate-800 dark:text-slate-100 mt-4 mb-2">{trimmed.replace(/\*\*/g, '')}</h4>;
      }
      if (trimmed.startsWith('* ')) {
        return <li key={idx} className="ml-4 list-disc text-slate-700 dark:text-slate-300">{trimmed.substring(2)}</li>;
      }
      if (trimmed === '') return <div key={idx} className="h-2"></div>;
      
      return <p key={idx} className="text-slate-700 dark:text-slate-300 leading-relaxed mb-1">{line}</p>;
    });
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-500 pb-12">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
        </button>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Kennisbank</h1>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {studyGuideData.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`p-6 rounded-xl border text-left transition-all shadow-sm ${
              activeCategory === cat.id 
                ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 dark:border-blue-400 ring-2 ring-blue-200 dark:ring-blue-900' 
                : 'bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-md'
            }`}
          >
            <div className={`mb-4 ${activeCategory === cat.id ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'}`}>
              {getIcon(cat.icon)}
            </div>
            <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-2">{cat.title}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">{cat.description}</p>
          </button>
        ))}
      </div>

      {activeCategory && (
        <div className="space-y-4">
          {studyGuideData.find(c => c.id === activeCategory)?.sections.map((section, idx) => {
            const sectionId = `${activeCategory}-${idx}`;
            const isExpanded = expandedSections[sectionId];

            return (
              <div key={sectionId} className="bg-white dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden transition-colors">
                <button 
                  onClick={() => toggleSection(sectionId)}
                  className="w-full flex justify-between items-center p-5 text-left hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">{section.title}</h3>
                  {isExpanded ? <ChevronDown className="w-5 h-5 text-slate-400" /> : <ChevronRight className="w-5 h-5 text-slate-400" />}
                </button>
                
                {isExpanded && (
                  <div className="p-6 pt-0 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                    <div className="prose prose-slate dark:prose-invert max-w-none text-sm">
                      {renderContent(section.content, section.title)}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {!activeCategory && (
        <div className="text-center py-12 text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-850 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
          <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-20" />
          <p>Selecteer een categorie hierboven om te beginnen met studeren.</p>
        </div>
      )}
    </div>
  );
};
