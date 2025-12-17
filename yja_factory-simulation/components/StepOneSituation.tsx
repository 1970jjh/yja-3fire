import React, { useState } from 'react';
import { Check, Info, Search } from 'lucide-react';

interface Props {
  onNext: (facts: string[]) => void;
}

const FACTS_POOL = [
  "8월 4일 오전 10:30분경 화재 발생",
  "생산팀 박계장 전치 4주 화상 입음",
  "화재로 인해 공장 가동 전면 중단됨",
  "납기일은 8월 12일로 일주일 남음",
  "최근 공장 주변에 야생 고양이가 자주 출몰함",
  "박계장은 평소 안전모를 잘 쓰지 않음 (의견)",
  "3공장 사고 시점에 남은 생산량은 4,000 unit",
  "소화기가 작동하지 않아 초기 진압 실패",
  "구내식당 메뉴가 맛이 없어서 불만이 많음",
];

const StepOneSituation: React.FC<Props> = ({ onNext }) => {
  const [selectedFacts, setSelectedFacts] = useState<string[]>([]);

  const toggleFact = (fact: string) => {
    if (selectedFacts.includes(fact)) {
      setSelectedFacts(prev => prev.filter(f => f !== fact));
    } else {
      setSelectedFacts(prev => [...prev, fact]);
    }
  };

  const handleNext = () => {
    if (selectedFacts.length < 3) {
      alert("최소 3개 이상의 핵심 사실(Fact)을 선택해주세요.");
      return;
    }
    onNext(selectedFacts);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Guide Banner */}
      <div className="bg-blue-50 p-5 rounded-xl border border-blue-100 flex gap-4 items-start shadow-sm">
        <div className="bg-blue-100 p-2 rounded-full shrink-0">
            <Search className="w-5 h-5 text-blue-600" />
        </div>
        <div>
            <h2 className="text-sm font-bold text-blue-900 uppercase tracking-wide mb-1">Step 1. Fact Finding</h2>
            <p className="text-sm text-blue-800 leading-relaxed">
                제시된 정보들 중 문제 해결에 꼭 필요한 <span className="font-bold underline decoration-blue-400 decoration-2">객관적 사실(Fact)</span>만을 선별하십시오.
            </p>
        </div>
      </div>

      <div className="space-y-3 pb-24">
        {FACTS_POOL.map((fact, index) => {
           const isSelected = selectedFacts.includes(fact);
           return (
            <div 
                key={index}
                onClick={() => toggleFact(fact)}
                className={`p-4 rounded-xl border transition-all flex items-center gap-4 cursor-pointer group ${
                isSelected
                    ? 'bg-slate-800 border-slate-800 text-white shadow-md transform scale-[1.01]' 
                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:shadow-sm'
                }`}
            >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border transition-colors ${
                    isSelected ? 'bg-blue-500 border-blue-500' : 'bg-slate-100 border-slate-300 group-hover:border-slate-400'
                }`}>
                    {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                </div>
                <span className={`text-sm font-medium leading-snug ${isSelected ? 'text-slate-100' : 'text-slate-700'}`}>
                {fact}
                </span>
            </div>
           )
        })}
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur border-t border-slate-200 md:absolute z-30 flex justify-center">
        <div className="w-full max-w-lg">
            <button 
            onClick={handleNext}
            disabled={selectedFacts.length < 1}
            className="w-full bg-blue-600 disabled:bg-slate-300 disabled:text-slate-500 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
            다음 단계 ({selectedFacts.length}개 선택됨)
            </button>
        </div>
      </div>
    </div>
  );
};

export default StepOneSituation;