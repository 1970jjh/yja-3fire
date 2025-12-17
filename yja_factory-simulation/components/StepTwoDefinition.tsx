import React, { useState } from 'react';
import { ArrowDown, Target, AlertTriangle } from 'lucide-react';

interface Props {
  onNext: (gap: { current: string; ideal: string }) => void;
}

const StepTwoDefinition: React.FC<Props> = ({ onNext }) => {
  const [current, setCurrent] = useState("");
  const [ideal, setIdeal] = useState("");

  const handleNext = () => {
    if (!current || !ideal) {
      alert("내용을 모두 입력해주세요.");
      return;
    }
    onNext({ current, ideal });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Guide Banner */}
      <div className="bg-slate-100 p-5 rounded-xl border border-slate-200 flex gap-4 items-start shadow-sm">
        <div className="bg-white p-2 rounded-full shrink-0 border border-slate-200">
            <Target className="w-5 h-5 text-slate-600" />
        </div>
        <div>
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide mb-1">Step 2. Gap Analysis</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
                <span className="font-bold text-red-500">현재 상태(As-Is)</span>와 <span className="font-bold text-green-600">목표 상태(To-Be)</span>의 차이를 정의하여 문제의 본질을 파악하십시오.
            </p>
        </div>
      </div>

      <div className="space-y-2 pb-24">
        {/* Current State */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden group focus-within:ring-2 focus-within:ring-red-100 focus-within:border-red-200 transition-all">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-red-400"></div>
          <label className="flex items-center gap-2 text-slate-800 font-bold mb-3 text-sm uppercase">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            As-Is (Current State)
          </label>
          <textarea 
            className="w-full h-28 p-4 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all resize-none placeholder-slate-400"
            placeholder="예: 화재로 인명사고 발생 및 공장 가동 중단..."
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
          />
        </div>

        <div className="flex justify-center -my-3 relative z-10">
          <div className="bg-slate-100 text-slate-400 p-2 rounded-full border border-slate-200 shadow-sm">
             <ArrowDown className="w-5 h-5" />
          </div>
        </div>

        {/* Ideal State */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden group focus-within:ring-2 focus-within:ring-green-100 focus-within:border-green-200 transition-all">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-green-500"></div>
          <label className="flex items-center gap-2 text-slate-800 font-bold mb-3 text-sm uppercase">
            <Target className="w-4 h-4 text-green-600" />
            To-Be (Ideal State)
          </label>
          <textarea 
            className="w-full h-28 p-4 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-all resize-none placeholder-slate-400"
            placeholder="예: 안전한 작업 환경 복구 및 납기 내 생산 완료..."
            value={ideal}
            onChange={(e) => setIdeal(e.target.value)}
          />
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur border-t border-slate-200 md:absolute z-30 flex justify-center">
        <div className="w-full max-w-lg">
            <button 
            onClick={handleNext}
            className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-slate-800 transition-all"
            >
            문제 정의 완료 (Confirm Gap)
            </button>
        </div>
      </div>
    </div>
  );
};

export default StepTwoDefinition;