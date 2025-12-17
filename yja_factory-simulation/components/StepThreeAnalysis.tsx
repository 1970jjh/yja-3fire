import React, { useState, useEffect } from 'react';
import { INITIAL_POWER_DATA, MAX_POWER_LIMIT, PowerData } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from 'recharts';
import { HelpCircle, Zap, Activity, GitCommit } from 'lucide-react';

interface Props {
  onNext: (causes: any) => void;
}

const StepThreeAnalysis: React.FC<Props> = ({ onNext }) => {
  const [powerData, setPowerData] = useState<PowerData[]>(INITIAL_POWER_DATA);
  const [totalWattage, setTotalWattage] = useState(0);
  const [selectedCause1, setCause1] = useState("");
  const [selectedCause2, setCause2] = useState("");

  useEffect(() => {
    const total = powerData.reduce((acc, item) => acc + (item.active ? item.count * item.watts : 0), 0);
    setTotalWattage(total);
  }, [powerData]);

  const toggleMachine = (index: number) => {
    const newData = [...powerData];
    newData[index].active = !newData[index].active;
    setPowerData(newData);
  };

  const chartData = [
    { name: 'Total', watts: totalWattage },
  ];

  const handleNext = () => {
    if (totalWattage <= MAX_POWER_LIMIT) {
        alert("전력 시뮬레이션에서 '과부하' 상태를 재현해야 합니다. 어떤 기기들이 켜져 있었나요?");
        return;
    }
    if(!selectedCause1 || !selectedCause2) {
        alert("모든 심층 분석 항목을 선택해주세요.");
        return;
    }
    onNext({ powerData });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
      {/* 1. Technical Analysis */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
             <div className="flex items-center gap-2">
                 <div className="bg-yellow-100 p-1.5 rounded-lg text-yellow-600">
                    <Zap className="w-4 h-4" />
                 </div>
                 <h3 className="font-bold text-slate-800 text-sm">Direct Cause: Power Overload</h3>
             </div>
             <span className="text-[10px] font-bold text-slate-400 bg-white px-2 py-1 rounded border border-slate-200">
                 LIMIT: 16,000W
             </span>
        </div>
        
        <div className="p-6">
            <p className="text-sm text-slate-600 mb-6 bg-slate-50 p-3 rounded-lg border border-slate-200">
                <span className="font-bold text-slate-800">MISSION:</span> 3공장 전력 사용량을 재현하여 과부하 원인을 찾으세요.
            </p>

            {/* Responsive Chart */}
            <div className="h-28 mb-8 relative">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart layout="vertical" data={chartData}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                <XAxis type="number" domain={[0, 20000]} hide />
                <YAxis dataKey="name" type="category" width={1} />
                <Tooltip 
                    cursor={{fill: 'transparent'}} 
                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px', fontWeight: 'bold'}}
                />
                <ReferenceLine x={MAX_POWER_LIMIT} stroke="#ef4444" strokeWidth={2} strokeDasharray="4 4" label={{ value: 'MAX LIMIT', position: 'insideTopRight', fill: '#ef4444', fontSize: 10, fontWeight: 'bold' }} />
                <Bar dataKey="watts" fill={totalWattage > MAX_POWER_LIMIT ? "#ef4444" : "#22c55e"} barSize={24} radius={[0, 4, 4, 0]} />
                </BarChart>
            </ResponsiveContainer>
            <div className="absolute top-1/2 left-4 -translate-y-1/2">
                <span className={`text-lg font-bold px-3 py-1 rounded-lg border ${totalWattage > MAX_POWER_LIMIT ? 'bg-red-50 text-red-600 border-red-100' : 'bg-green-50 text-green-600 border-green-100'}`}>
                    {totalWattage.toLocaleString()}W
                </span>
            </div>
            {totalWattage > MAX_POWER_LIMIT && (
                <div className="absolute right-0 -top-8 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-full animate-pulse flex items-center gap-1 shadow-md">
                    <Activity className="w-3 h-3" /> CRITICAL OVERLOAD
                </div>
            )}
            </div>

            {/* Machine Toggles */}
            <div className="space-y-2">
            {powerData.map((item, idx) => (
                <label 
                    key={idx} 
                    className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer select-none transition-all group ${
                        item.active 
                        ? 'bg-slate-800 border-slate-800 shadow-md' 
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                >
                <div className="flex flex-col">
                    <span className={`font-bold text-sm ${item.active ? 'text-white' : 'text-slate-700'}`}>{item.device}</span>
                    <span className={`text-xs font-medium ${item.active ? 'text-slate-400' : 'text-slate-500'}`}>{item.count} EA × {item.watts.toLocaleString()}W</span>
                </div>
                <div className={`w-10 h-5 rounded-full relative transition-colors ${item.active ? 'bg-blue-500' : 'bg-slate-200'}`}>
                    <div className={`absolute top-1 left-1 w-3 h-3 rounded-full bg-white transition-transform ${item.active ? 'translate-x-5' : ''}`}></div>
                </div>
                <input type="checkbox" checked={item.active} onChange={() => toggleMachine(idx)} className="hidden" />
                </label>
            ))}
            </div>
        </div>
      </div>

      {/* 2. Logic Tree Analysis */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
         <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
             <div className="flex items-center gap-2">
                 <div className="bg-purple-100 p-1.5 rounded-lg text-purple-600">
                    <GitCommit className="w-4 h-4" />
                 </div>
                 <h3 className="font-bold text-slate-800 text-sm">Root Cause: 5 Whys</h3>
             </div>
        </div>
         
         <div className="p-6 space-y-6">
            <div className="relative pl-6 border-l-2 border-slate-200">
                <div className="absolute -left-[9px] top-0 bg-white border-2 border-slate-200 w-4 h-4 rounded-full"></div>
                <h4 className="text-sm font-bold text-slate-800 mb-2 flex items-center gap-2">
                    <span className="text-blue-600">Q1.</span> 인명피해는 왜 커졌는가?
                </h4>
                <p className="text-xs text-slate-500 mb-3">박계장은 왜 제때 대피하지 못했는가?</p>
                <select 
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-700"
                    value={selectedCause1}
                    onChange={(e) => setCause1(e.target.value)}
                >
                    <option value="">원인을 선택하세요...</option>
                    <option>대피 방송 시스템 고장</option>
                    <option value="correct">비상구 앞 자재 적재로 탈출 지연</option>
                    <option>안전화 미착용으로 인한 부상</option>
                </select>
            </div>

            <div className="relative pl-6 border-l-2 border-slate-200">
                <div className="absolute -left-[9px] top-0 bg-white border-2 border-slate-200 w-4 h-4 rounded-full"></div>
                <h4 className="text-sm font-bold text-slate-800 mb-2 flex items-center gap-2">
                    <span className="text-blue-600">Q2.</span> 초기진압은 왜 실패했는가?
                </h4>
                <p className="text-xs text-slate-500 mb-3">왜 작은 불이 큰 화재로 번졌는가?</p>
                <select 
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-700"
                    value={selectedCause2}
                    onChange={(e) => setCause2(e.target.value)}
                >
                    <option value="">원인을 선택하세요...</option>
                    <option>소방차 진입로 부족</option>
                    <option value="correct">소화기 노후화로 인한 작동 불량</option>
                    <option>스프링클러 오작동</option>
                </select>
            </div>
         </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur border-t border-slate-200 md:absolute z-30 flex justify-center">
        <div className="w-full max-w-lg">
            <button 
            onClick={handleNext}
            className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-slate-800 transition-all"
            >
            원인 분석 완료 (Complete Analysis)
            </button>
        </div>
      </div>
    </div>
  );
};

export default StepThreeAnalysis;