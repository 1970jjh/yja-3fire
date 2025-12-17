import React, { useEffect } from 'react';
import { SCENARIO_INFO } from '../constants';
import { ArrowRight, Volume2, Siren, FileText, Activity } from 'lucide-react';

interface Props {
  onNext: () => void;
  onShowInfoCard: () => void;
  teamId?: number;
}

const ScenarioIntro: React.FC<Props> = ({ onNext, onShowInfoCard, teamId }) => {
  
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
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur border-t border-slate-200 z-30 flex justify-center">
        <div className="w-full max-w-lg">
            <button 
            onClick={onNext}
            className="w-full bg-blue-600 text-white text-lg font-bold py-4 rounded-xl shadow-lg shadow-blue-600/30 hover:bg-blue-700 hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
            >
            시뮬레이션 시작
            <ArrowRight className="w-5 h-5" />
            </button>
        </div>
      </div>
    </div>
  );
};

export default ScenarioIntro;