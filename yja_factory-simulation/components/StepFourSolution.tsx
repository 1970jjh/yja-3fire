import React, { useState } from 'react';
import { Lightbulb, ShieldCheck, ClipboardList } from 'lucide-react';

interface Props {
  onNext: (solutions: any) => void;
}

const StepFourSolution: React.FC<Props> = ({ onNext }) => {
  const [shortTerm, setShortTerm] = useState("");
  const [prevention, setPrevention] = useState("");

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
      
      {/* Guide Banner */}
      <div className="bg-slate-100 p-5 rounded-xl border border-slate-200 flex gap-4 items-start shadow-sm">
        <div className="bg-white p-2 rounded-full shrink-0 border border-slate-200">
            <ClipboardList className="w-5 h-5 text-slate-600" />
        </div>
        <div>
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide mb-1">Step 4. Action Plan</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
                <span className="font-bold text-blue-600">단기 대책</span>(문제 해결)과 <span className="font-bold text-indigo-600">재발 방지</span>(근본 대책)를 구분하여 구체적으로 수립하십시오.
            </p>
        </div>
      </div>

      {/* Short Term */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 focus-within:ring-2 focus-within:ring-yellow-100 transition-all">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
             <div className="bg-yellow-100 p-1.5 rounded-lg text-yellow-600">
                <Lightbulb className="w-4 h-4" />
             </div>
             <h3 className="font-bold text-slate-800 text-sm">Short-term Solution (납기)</h3>
          </div>
          <span className="text-[10px] font-bold bg-yellow-50 text-yellow-700 px-2 py-1 rounded-full border border-yellow-200 uppercase tracking-wider">URGENT</span>
        </div>
        
        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 mb-4">
             <span className="text-xs font-bold text-slate-400 block mb-1">REFERENCE DATA</span>
             <p className="text-xs font-mono text-slate-600">
                1공장(400) + 4공장(600) = 1,000 unit/day 생산 가능
             </p>
        </div>

        <textarea 
          value={shortTerm}
          onChange={(e) => setShortTerm(e.target.value)}
          className="w-full h-32 p-4 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all resize-none placeholder-slate-400"
          placeholder="납기일 준수를 위한 구체적 계획을 작성하세요."
        />
      </div>

      {/* Long Term */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
         <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
             <div className="bg-indigo-100 p-1.5 rounded-lg text-indigo-600">
                <ShieldCheck className="w-4 h-4" />
             </div>
             <h3 className="font-bold text-slate-800 text-sm">Prevention Strategy (재발방지)</h3>
          </div>
          <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full border border-indigo-200 uppercase tracking-wider">CRITICAL</span>
        </div>
        
        <p className="text-xs text-slate-500 mb-4 pl-1">전력 과부하 및 인명 사고의 근본적인 재발 방지 대책은 무엇입니까?</p>
        
        <textarea 
          value={prevention}
          onChange={(e) => setPrevention(e.target.value)}
          className="w-full h-32 p-4 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all resize-none placeholder-slate-400"
          placeholder="시설 보완 및 안전 규정 강화 계획을 작성하세요."
        />
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur border-t border-slate-200 md:absolute z-30 flex justify-center">
        <div className="w-full max-w-lg">
            <button 
            onClick={() => onNext({ shortTerm, prevention })}
            className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-slate-800 transition-all uppercase tracking-wide"
            >
            최종 보고서 작성 (Final Report)
            </button>
        </div>
      </div>
    </div>
  );
};

export default StepFourSolution;