import React, { useState, useRef } from 'react';
import { SimulationState, FinalReportData } from '../types';
import { Lock, FileText, Download, CheckCircle, Edit3, Printer } from 'lucide-react';

interface Props {
  data: SimulationState;
  onRestart: () => void;
  isReportEnabled: boolean;
  onUpdateReport: (report: FinalReportData) => void;
}

const StepFiveReport: React.FC<Props> = ({ data, onRestart, isReportEnabled, onUpdateReport }) => {
  const [isEditing, setIsEditing] = useState(true);
  const reportRef = useRef<HTMLDivElement>(null);
  
  // Initialize form with previous step data
  const [formData, setFormData] = useState<FinalReportData>({
    title: `${data.teamName} 화재사고 분석 보고서`,
    members: data.user?.name || '',
    contents: '1. 개요\n2. 현상 파악\n3. 원인 분석\n4. 해결 방안',
    situation: data.gapAnalysis.current,
    definition: data.gapAnalysis.ideal, // Using ideal as part of definition context or just user input
    cause: '전력 과부하, 소화기 미작동, 관리 소홀', // simplified default or map from rootCauses
    solution: data.solutions.shortTerm,
    prevention: data.solutions.prevention,
    schedule: '즉시: 소화기 교체\n1주 내: 안전 교육\n1달 내: 설비 증설'
  });

  const handleInputChange = (field: keyof FinalReportData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.members) {
        alert("보고서 제목과 팀원 이름을 입력해주세요.");
        return;
    }
    onUpdateReport(formData);
    setIsEditing(false);
  };

  const handleDownload = async () => {
    if (!reportRef.current) return;
    
    try {
        // @ts-ignore
        const html2canvas = window.html2canvas;
        if (!html2canvas) {
            alert("이미지 생성 라이브러리를 불러오는 중입니다. 잠시 후 다시 시도해주세요.");
            return;
        }

        const canvas = await html2canvas(reportRef.current, {
            scale: 2,
            backgroundColor: "#ffffff",
            useCORS: true
        });

        const link = document.createElement('a');
        link.download = `${data.teamName}_FinalReport.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    } catch (err) {
        console.error("Report generation failed", err);
        alert("이미지 저장 중 오류가 발생했습니다.");
    }
  };

  // State 1: Locked
  if (!isReportEnabled) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center p-6 animate-in fade-in">
         <div className="bg-slate-100 p-6 rounded-full border border-slate-200 mb-6 shadow-inner">
            <Lock className="w-12 h-12 text-slate-400" />
         </div>
         <h2 className="text-xl font-bold text-slate-800 mb-2">보고서 제출 대기</h2>
         <p className="text-slate-500 text-sm mb-8">관리자가 제출 기능을 활성화할 때까지 잠시만 기다려주세요.</p>
         <div className="animate-pulse text-xs font-mono text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            WAITING FOR SIGNAL...
         </div>
      </div>
    );
  }

  // State 2: Form Input
  if (isEditing) {
      return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
            <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
                <div className="flex items-center gap-2 mb-1">
                    <Edit3 className="w-5 h-5 text-blue-600" />
                    <h2 className="text-lg font-bold text-slate-800">최종 보고서 작성</h2>
                </div>
                <p className="text-sm text-slate-500">임원 보고용 최종 결과물을 정리하십시오.</p>
            </div>

            <div className="space-y-4">
                <InputGroup label="1. 보고서 제목" subLabel="Subject">
                    <input className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all font-semibold" value={formData.title} onChange={e => handleInputChange('title', e.target.value)} placeholder="제목 입력" />
                </InputGroup>
                <InputGroup label="2. 팀원" subLabel="Members">
                    <input className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" value={formData.members} onChange={e => handleInputChange('members', e.target.value)} placeholder="참여자 성명" />
                </InputGroup>
                <InputGroup label="3. 현상 파악 (Fact)" subLabel="Situation">
                    <textarea className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all h-24 resize-none" value={formData.situation} onChange={e => handleInputChange('situation', e.target.value)} />
                </InputGroup>
                <InputGroup label="4. 문제 정의 (Gap)" subLabel="Problem Definition">
                    <textarea className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all h-24 resize-none" value={formData.definition} onChange={e => handleInputChange('definition', e.target.value)} />
                </InputGroup>
                <InputGroup label="5. 원인 분석 (Root Cause)" subLabel="5 Whys Analysis">
                    <textarea className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all h-24 resize-none" value={formData.cause} onChange={e => handleInputChange('cause', e.target.value)} />
                </InputGroup>
                <InputGroup label="6. 해결 방안 (Solution)" subLabel="Action Plan">
                    <textarea className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all h-24 resize-none" value={formData.solution} onChange={e => handleInputChange('solution', e.target.value)} />
                </InputGroup>
                <InputGroup label="7. 재발 방지 (Prevention)" subLabel="Long-term Strategy">
                    <textarea className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all h-24 resize-none" value={formData.prevention} onChange={e => handleInputChange('prevention', e.target.value)} />
                </InputGroup>
                <InputGroup label="8. 일정 계획 (Schedule)" subLabel="Timeline">
                    <textarea className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all h-24 resize-none" value={formData.schedule} onChange={e => handleInputChange('schedule', e.target.value)} />
                </InputGroup>
            </div>

            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur border-t border-slate-200 z-30 flex justify-center">
                 <div className="w-full max-w-lg">
                    <button 
                    onClick={handleSubmit}
                    className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                    >
                    <Printer className="w-5 h-5" />
                    보고서 생성 (Generate)
                    </button>
                 </div>
            </div>
        </div>
      );
  }

  // State 3: Document Preview & Download
  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-24">
        <div className="bg-slate-900 text-white p-4 rounded-xl shadow-lg flex justify-between items-center">
            <div>
                <h2 className="text-lg font-bold">Report Preview</h2>
                <p className="text-xs text-slate-400">내용 확인 후 이미지를 저장하여 제출하세요.</p>
            </div>
            <CheckCircle className="w-6 h-6 text-green-400" />
        </div>

        {/* A4 Paper Style Container */}
        <div className="overflow-x-auto pb-4">
            <div ref={reportRef} className="bg-white w-[210mm] min-h-[297mm] mx-auto p-12 shadow-2xl border border-slate-100 relative">
                
                {/* Document Header */}
                <div className="border-b-2 border-slate-800 pb-6 mb-8 flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 mb-2">{formData.title}</h1>
                        <p className="text-sm text-slate-500 font-medium">제3공장 화재사고 문제해결 시뮬레이션 결과보고</p>
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-bold text-slate-200">CONFIDENTIAL</div>
                        <div className="text-sm font-bold text-slate-900 mt-1">Team {data.user?.teamId}</div>
                        <div className="text-xs text-slate-500">{formData.members}</div>
                    </div>
                </div>

                {/* Document Body */}
                <div className="space-y-8">
                    
                    {/* Section 1: Situation & Gap */}
                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 border-b border-slate-200 pb-1">Current Situation</h3>
                            <p className="text-sm text-slate-800 leading-relaxed font-medium whitespace-pre-wrap">{formData.situation}</p>
                        </div>
                        <div>
                            <h3 className="text-xs font-bold text-red-400 uppercase tracking-wider mb-2 border-b border-red-100 pb-1">Problem Definition (Gap)</h3>
                            <p className="text-sm text-slate-800 leading-relaxed font-medium whitespace-pre-wrap">{formData.definition}</p>
                        </div>
                    </div>

                    {/* Section 2: Root Cause */}
                    <div className="bg-slate-50 p-6 rounded-lg border border-slate-100">
                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                            Root Cause Analysis
                        </h3>
                        <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{formData.cause}</p>
                    </div>

                    {/* Section 3: Solutions */}
                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-xs font-bold text-blue-500 uppercase tracking-wider mb-2 border-b border-blue-100 pb-1">Action Plan (Short-term)</h3>
                            <p className="text-sm text-slate-800 leading-relaxed font-medium whitespace-pre-wrap">{formData.solution}</p>
                        </div>
                        <div>
                            <h3 className="text-xs font-bold text-green-500 uppercase tracking-wider mb-2 border-b border-green-100 pb-1">Prevention (Long-term)</h3>
                            <p className="text-sm text-slate-800 leading-relaxed font-medium whitespace-pre-wrap">{formData.prevention}</p>
                        </div>
                    </div>

                    {/* Section 4: Schedule */}
                    <div className="border-t border-slate-200 pt-6">
                         <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Implementation Schedule</h3>
                         <div className="bg-white border border-slate-200 p-4 rounded text-sm font-mono text-slate-600 whitespace-pre-wrap">
                             {formData.schedule}
                         </div>
                    </div>

                </div>

                {/* Footer */}
                <div className="absolute bottom-10 left-12 right-12 border-t border-slate-100 pt-4 flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>YJA SYSTEMS INCIDENT RESPONSE SIMULATION</span>
                    <span>PAGE 1 OF 1</span>
                </div>
            </div>
        </div>

        {/* Action Buttons */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur border-t border-slate-200 z-30 flex justify-center gap-4">
            <div className="w-full max-w-lg flex gap-3">
                <button 
                    onClick={() => setIsEditing(true)}
                    className="flex-1 bg-white border border-slate-300 text-slate-700 font-bold py-4 rounded-xl hover:bg-slate-50 transition-all"
                >
                    수정하기
                </button>
                <button 
                    onClick={handleDownload}
                    className="flex-[2] bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                >
                    <Download className="w-5 h-5" />
                    이미지 저장 (Download)
                </button>
            </div>
        </div>
    </div>
  );
};

const InputGroup: React.FC<{label: string, subLabel: string, children: React.ReactNode}> = ({label, subLabel, children}) => (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="mb-2">
            <span className="block font-bold text-slate-800 text-sm">{label}</span>
            <span className="text-xs text-slate-400 font-medium">{subLabel}</span>
        </div>
        {children}
    </div>
);

export default StepFiveReport;