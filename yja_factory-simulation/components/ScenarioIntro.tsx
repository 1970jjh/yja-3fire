import React, { useEffect, useState, useRef } from 'react';
import { SCENARIO_INFO } from '../constants';
import { ArrowRight, Volume2, Siren, FileText, Activity, Edit3, Printer, Download, CheckCircle } from 'lucide-react';

interface ReportFormData {
  title: string;
  members: string;
  situation: string;
  definition: string;
  cause: string;
  solution: string;
  prevention: string;
  schedule: string;
}

interface Props {
  onNext: () => void;
  onShowInfoCard: () => void;
  teamId?: number;
}

const ScenarioIntro: React.FC<Props> = ({ onNext, onShowInfoCard, teamId }) => {
  const [showReport, setShowReport] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);
  const reportSectionRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState<ReportFormData>({
    title: `${teamId ? `${teamId}조` : ''} 화재사고 분석 보고서`,
    members: '',
    situation: '',
    definition: '',
    cause: '',
    solution: '',
    prevention: '',
    schedule: ''
  });

  const handleInputChange = (field: keyof ReportFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.members) {
      alert("보고서 제목과 팀원 이름을 입력해주세요.");
      return;
    }
    setIsPreview(true);
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
      link.download = `${teamId ? `${teamId}조` : 'Team'}_FinalReport.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error("Report generation failed", err);
      alert("이미지 저장 중 오류가 발생했습니다.");
    }
  };

  const handleShowReport = () => {
    setShowReport(true);
    setTimeout(() => {
      reportSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };
  
  // Audio effect remains same
  useEffect(() => {
    let ctx: AudioContext | null = null;
    let osc: OscillatorNode | null = null;
    let lfo: OscillatorNode | null = null;
    let gain: GainNode | null = null;
    let timer: ReturnType<typeof setTimeout>;

    const playSiren = () => {
      try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContext) return;
        ctx = new AudioContext();
        osc = ctx.createOscillator();
        lfo = ctx.createOscillator();
        gain = ctx.createGain();
        const lfoGain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.value = 600;
        lfo.type = 'sine';
        lfo.frequency.value = 1.5;
        lfoGain.gain.value = 200;
        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);
        osc.connect(gain);
        gain.connect(ctx.destination);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.5);
        osc.start();
        lfo.start();
        timer = setTimeout(() => {
          if (gain && ctx) {
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
            setTimeout(() => { osc?.stop(); lfo?.stop(); ctx?.close(); }, 500);
          }
        }, 5000);
      } catch (e) { console.error("Audio play failed:", e); }
    };
    playSiren();
    return () => { clearTimeout(timer); if (ctx && ctx.state !== 'closed') { try { osc?.stop(); lfo?.stop(); ctx.close(); } catch(e) {} } };
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      
      {/* Realistic News Alert Banner */}
      <div className="rounded-xl overflow-hidden shadow-xl border border-red-900/20 bg-white">
          <div className="bg-gradient-to-r from-red-700 to-red-900 text-white p-4 flex items-center justify-between relative overflow-hidden">
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
             <div className="flex items-center gap-3 relative z-10">
                 <div className="bg-red-600 p-2 rounded-lg animate-pulse">
                    <Siren className="w-6 h-6 text-white" />
                 </div>
                 <div>
                    <div className="text-[10px] font-bold bg-white/20 inline-block px-1.5 rounded mb-0.5 tracking-wider">BREAKING NEWS</div>
                    <h1 className="text-xl font-bold leading-none">제3공장 화재 발생</h1>
                 </div>
             </div>
             <Activity className="w-8 h-8 opacity-20" />
          </div>
          
          {/* Video Feed Frame */}
          <div className="relative bg-black aspect-video">
            <video 
                src="https://raw.githubusercontent.com/1970jjh/image-upload/main/fire.mp4" 
                autoPlay 
                loop 
                muted 
                playsInline
                className="w-full h-full object-cover opacity-90"
            />
            {/* Camera Interface Overlay */}
            <div className="absolute top-3 left-3 flex gap-2">
                <div className="bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 animate-pulse">
                     <div className="w-1.5 h-1.5 bg-white rounded-full"></div> REC
                </div>
                <div className="bg-black/50 text-white text-[10px] font-mono px-1.5 py-0.5 rounded backdrop-blur-sm">
                     CAM_03_FACTORY_FLOOR
                </div>
            </div>
            <div className="absolute bottom-3 right-3 text-white/80 font-mono text-xs">
                 {SCENARIO_INFO.date}
            </div>
          </div>
      </div>

      {/* Incident Report Card */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
            <FileText className="w-5 h-5 text-slate-500" />
            사고 개요 (Incident Report)
          </h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-1">
              <span className="text-slate-500">발생 일시</span>
              <span className="font-semibold text-slate-900">{SCENARIO_INFO.date}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">발생 장소</span>
              <span className="font-semibold text-slate-900">{SCENARIO_INFO.location}</span>
            </div>
            
            <div className="mt-4 bg-red-50 text-red-800 p-4 rounded-lg border border-red-100 flex items-start gap-3">
              <div className="bg-red-100 p-1 rounded-full shrink-0">
                  <Activity className="w-4 h-4 text-red-600" />
              </div>
              <div>
                  <span className="text-xs font-bold text-red-500 uppercase block mb-0.5">DAMAGE ASSESSMENT</span>
                  <span className="font-bold text-base">생산팀 박계장 인명 사고 (전치 4주)</span>
              </div>
            </div>
            <div className="bg-slate-100 text-slate-600 p-4 rounded-lg border border-slate-200 flex items-start gap-3">
               <div className="bg-slate-200 p-1 rounded-full shrink-0">
                  <FileText className="w-4 h-4 text-slate-500" />
               </div>
               <div>
                  <span className="text-xs font-bold text-slate-400 uppercase block mb-0.5">HIDDEN ISSUE</span>
                  <span className="font-medium text-slate-500">추가적인 잠재 위험 요인이 발견됨...</span>
               </div>
            </div>
          </div>
      </div>

      {/* Team Info Button */}
      <button 
           onClick={onShowInfoCard}
           className="w-full bg-slate-800 text-white p-4 rounded-xl font-bold text-sm flex items-center justify-center gap-3 hover:bg-slate-900 transition-all shadow-md active:scale-[0.99]"
        >
            <FileText className="w-5 h-5 text-yellow-400" />
            {teamId ? `${teamId}조` : '나의'} 수집 정보 확인 (Secret)
      </button>

      {/* Corporate Memo */}
      <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-blue-600"></div>
        <h2 className="text-sm font-bold text-slate-400 mb-2 uppercase tracking-wide">CEO's Message</h2>
        <p className="font-serif text-slate-800 text-lg italic leading-relaxed mb-4">
            "이번 사고는 우리 회사의 안전 불감증을 보여주는 뼈아픈 사례입니다. 
            단순 수습을 넘어, 근본적인 원인을 찾아 1시간 내로 보고하십시오."
        </p>
        
        <div className="flex flex-wrap gap-2 text-[10px] font-bold text-white">
            <span className="bg-slate-400 px-2 py-1 rounded">현상파악</span>
            <span className="bg-slate-400 px-2 py-1 rounded">문제정의</span>
            <span className="bg-slate-400 px-2 py-1 rounded">원인분석</span>
            <span className="bg-blue-600 px-2 py-1 rounded">해결방안</span>
        </div>
      </div>

      {/* Action Button */}
      <div className="p-4 flex justify-center">
        <div className="w-full max-w-lg">
            <button
            onClick={handleShowReport}
            className="w-full bg-blue-600 text-white text-lg font-bold py-4 rounded-xl shadow-lg shadow-blue-600/30 hover:bg-blue-700 hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
            >
            최종 보고서 작성
            <ArrowRight className="w-5 h-5" />
            </button>
        </div>
      </div>

      {/* Report Section */}
      {showReport && (
        <div ref={reportSectionRef} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {!isPreview ? (
            // Form Input
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
                <div className="flex items-center gap-2 mb-1">
                  <Edit3 className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-bold text-slate-800">최종 보고서 작성</h2>
                </div>
                <p className="text-sm text-slate-500">임원 보고용 최종 결과물을 정리하십시오.</p>
              </div>

              <InputGroup label="1. 보고서 제목" subLabel="Subject">
                <input className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all font-semibold" value={formData.title} onChange={e => handleInputChange('title', e.target.value)} placeholder="제목 입력" />
              </InputGroup>
              <InputGroup label="2. 팀원" subLabel="Members">
                <input className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" value={formData.members} onChange={e => handleInputChange('members', e.target.value)} placeholder="참여자 성명" />
              </InputGroup>
              <InputGroup label="3. 현상 파악 (Fact)" subLabel="Situation">
                <textarea className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all h-24 resize-none" value={formData.situation} onChange={e => handleInputChange('situation', e.target.value)} placeholder="사고 당시 상황을 기술하세요" />
              </InputGroup>
              <InputGroup label="4. 문제 정의 (Gap)" subLabel="Problem Definition">
                <textarea className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all h-24 resize-none" value={formData.definition} onChange={e => handleInputChange('definition', e.target.value)} placeholder="이상(Ideal)과 현실(Real)의 차이를 기술하세요" />
              </InputGroup>
              <InputGroup label="5. 원인 분석 (Root Cause)" subLabel="5 Whys Analysis">
                <textarea className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all h-24 resize-none" value={formData.cause} onChange={e => handleInputChange('cause', e.target.value)} placeholder="근본 원인을 분석하세요" />
              </InputGroup>
              <InputGroup label="6. 해결 방안 (Solution)" subLabel="Action Plan">
                <textarea className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all h-24 resize-none" value={formData.solution} onChange={e => handleInputChange('solution', e.target.value)} placeholder="단기 해결 방안을 제시하세요" />
              </InputGroup>
              <InputGroup label="7. 재발 방지 (Prevention)" subLabel="Long-term Strategy">
                <textarea className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all h-24 resize-none" value={formData.prevention} onChange={e => handleInputChange('prevention', e.target.value)} placeholder="장기적 재발 방지 대책을 기술하세요" />
              </InputGroup>
              <InputGroup label="8. 일정 계획 (Schedule)" subLabel="Timeline">
                <textarea className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all h-24 resize-none" value={formData.schedule} onChange={e => handleInputChange('schedule', e.target.value)} placeholder="실행 일정을 기술하세요" />
              </InputGroup>

              <button
                onClick={handleSubmit}
                className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
              >
                <Printer className="w-5 h-5" />
                보고서 생성 (Generate)
              </button>
            </div>
          ) : (
            // Document Preview & Download
            <div className="space-y-6">
              <div className="bg-slate-900 text-white p-4 rounded-xl shadow-lg flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-bold">Report Preview</h2>
                  <p className="text-xs text-slate-400">내용 확인 후 이미지를 저장하여 제출하세요.</p>
                </div>
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>

              {/* A4 Paper Style Container */}
              <div className="overflow-x-auto pb-4">
                <div ref={reportRef} className="bg-white w-full max-w-[210mm] min-h-[297mm] mx-auto p-8 md:p-12 shadow-2xl border border-slate-100 relative">

                  {/* Document Header */}
                  <div className="border-b-2 border-slate-800 pb-6 mb-8 flex flex-col md:flex-row justify-between md:items-end gap-4">
                    <div>
                      <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">{formData.title}</h1>
                      <p className="text-sm text-slate-500 font-medium">제3공장 화재사고 문제해결 시뮬레이션 결과보고</p>
                    </div>
                    <div className="md:text-right">
                      <div className="text-2xl font-bold text-slate-200">CONFIDENTIAL</div>
                      <div className="text-sm font-bold text-slate-900 mt-1">Team {teamId}</div>
                      <div className="text-xs text-slate-500">{formData.members}</div>
                    </div>
                  </div>

                  {/* Document Body */}
                  <div className="space-y-8">

                    {/* Section 1: Situation & Gap */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 border-b border-slate-200 pb-1">Current Situation</h3>
                        <p className="text-sm text-slate-800 leading-relaxed font-medium whitespace-pre-wrap">{formData.situation || '-'}</p>
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-red-400 uppercase tracking-wider mb-2 border-b border-red-100 pb-1">Problem Definition (Gap)</h3>
                        <p className="text-sm text-slate-800 leading-relaxed font-medium whitespace-pre-wrap">{formData.definition || '-'}</p>
                      </div>
                    </div>

                    {/* Section 2: Root Cause */}
                    <div className="bg-slate-50 p-6 rounded-lg border border-slate-100">
                      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                        Root Cause Analysis
                      </h3>
                      <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{formData.cause || '-'}</p>
                    </div>

                    {/* Section 3: Solutions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h3 className="text-xs font-bold text-blue-500 uppercase tracking-wider mb-2 border-b border-blue-100 pb-1">Action Plan (Short-term)</h3>
                        <p className="text-sm text-slate-800 leading-relaxed font-medium whitespace-pre-wrap">{formData.solution || '-'}</p>
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-green-500 uppercase tracking-wider mb-2 border-b border-green-100 pb-1">Prevention (Long-term)</h3>
                        <p className="text-sm text-slate-800 leading-relaxed font-medium whitespace-pre-wrap">{formData.prevention || '-'}</p>
                      </div>
                    </div>

                    {/* Section 4: Schedule */}
                    <div className="border-t border-slate-200 pt-6">
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Implementation Schedule</h3>
                      <div className="bg-white border border-slate-200 p-4 rounded text-sm font-mono text-slate-600 whitespace-pre-wrap">
                        {formData.schedule || '-'}
                      </div>
                    </div>

                  </div>

                  {/* Footer */}
                  <div className="absolute bottom-10 left-8 right-8 md:left-12 md:right-12 border-t border-slate-100 pt-4 flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>YJA SYSTEMS INCIDENT RESPONSE SIMULATION</span>
                    <span>PAGE 1 OF 1</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setIsPreview(false)}
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
          )}
        </div>
      )}
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

export default ScenarioIntro;