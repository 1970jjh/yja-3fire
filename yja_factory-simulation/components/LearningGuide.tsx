import React from 'react';
import { STEP_GUIDES } from '../constants';
import { SimulationStep } from '../types';
import { Lightbulb, Target, ArrowRight, BookOpen } from 'lucide-react';

interface Props {
  step: SimulationStep;
  onClose: () => void;
}

const LearningGuide: React.FC<Props> = ({ step, onClose }) => {
  const guide = STEP_GUIDES[step];

  if (!guide) return null;

  return (
    <div className="absolute inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-100">
        
        {/* Header */}
        <div className="bg-slate-900 p-6 text-white relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="flex items-center gap-2 mb-3">
             <div className="bg-white/20 p-1 rounded text-white backdrop-blur-md">
                <BookOpen className="w-3.5 h-3.5" />
             </div>
             <span className="text-xs font-bold uppercase tracking-wider opacity-80">
                Learning Guide
             </span>
          </div>
          <h2 className="text-2xl font-bold mb-1">{guide.title}</h2>
          <p className="text-slate-300 text-sm font-medium">{guide.concept}</p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div className="flex gap-4">
            <div className="bg-red-50 p-2.5 rounded-xl h-fit shrink-0 text-red-500">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Goal</h3>
              <p className="text-sm font-medium text-slate-700 leading-relaxed">{guide.goal}</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="bg-amber-50 p-2.5 rounded-xl h-fit shrink-0 text-amber-500">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Description</h3>
              <p className="text-sm font-medium text-slate-700 leading-relaxed">{guide.description}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100">
          <button 
            onClick={onClose}
            className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
          >
            미션 시작
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LearningGuide;