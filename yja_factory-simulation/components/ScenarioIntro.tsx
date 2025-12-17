import React, { useEffect, useState, useRef } from 'react';
import { SCENARIO_INFO } from '../constants';
import { ArrowRight, Siren, FileText, Activity, Edit3, Printer, Download, CheckCircle, Users, Eye, AlertTriangle, Search, Lightbulb, Shield, Calendar, Flame, Target, TrendingUp, Loader2, FileImage, FileDown } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { analyzeReportWithGemini, AnalyzedReport } from '../services/geminiService';

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

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

const ScenarioIntro: React.FC<Props> = ({ onNext, onShowInfoCard, teamId }) => {
  const [showReport, setShowReport] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzedData, setAnalyzedData] = useState<AnalyzedReport | null>(null);
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

  const handleSubmit = async () => {
    if (!formData.title || !formData.members) {
      alert("보고서 제목과 팀원 이름을 입력해주세요.");
      return;
    }

    setIsAnalyzing(true);
    try {
      const analysis = await analyzeReportWithGemini(formData);
      setAnalyzedData(analysis);
      setIsPreview(true);
    } catch (error) {
      console.error('분석 실패:', error);
      alert('보고서 분석 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDownloadImage = async () => {
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
        useCORS: true,
        logging: false
      });
      const link = document.createElement('a');
      link.download = `${teamId ? `${teamId}조` : 'Team'}_최종보고서.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error("Image generation failed", err);
      alert("이미지 저장 중 오류가 발생했습니다.");
    }
  };

  const handleDownloadPDF = async () => {
    if (!reportRef.current) return;
    try {
      // @ts-ignore
      const html2canvas = window.html2canvas;
      const { jsPDF } = await import('jspdf');

      if (!html2canvas) {
        alert("라이브러리를 불러오는 중입니다. 잠시 후 다시 시도해주세요.");
        return;
      }

      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true,
        logging: false
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 0;

      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save(`${teamId ? `${teamId}조` : 'Team'}_최종보고서.pdf`);
    } catch (err) {
      console.error("PDF generation failed", err);
      alert("PDF 저장 중 오류가 발생했습니다.");
    }
  };

  const handleShowReport = () => {
    setShowReport(true);
    setTimeout(() => {
      reportSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Audio effect
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

  // 파이차트 데이터 변환
  const pieData = analyzedData?.situationChart ?
    analyzedData.situationChart.labels.map((label, idx) => ({
      name: label,
      value: analyzedData.situationChart.values[idx]
    })) : [];

  // 바차트 데이터 변환
  const barData = analyzedData?.solutionPriority ?
    analyzedData.solutionPriority.items.map((item, idx) => ({
      name: item.length > 8 ? item.substring(0, 8) + '...' : item,
      긴급도: analyzedData.solutionPriority.urgency[idx],
      영향도: analyzedData.solutionPriority.impact[idx]
    })) : [];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">

      {/* News Alert Banner */}
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

        <div className="relative bg-black aspect-video">
          <video
            src="https://raw.githubusercontent.com/1970jjh/image-upload/main/fire.mp4"
            autoPlay loop muted playsInline
            className="w-full h-full object-cover opacity-90"
          />
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
                <p className="text-sm text-slate-500">임원 보고용 최종 결과물을 정리하십시오. AI가 분석하여 인포그래픽으로 변환합니다.</p>
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
                disabled={isAnalyzing}
                className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    AI 분석 중...
                  </>
                ) : (
                  <>
                    <Printer className="w-5 h-5" />
                    보고서 생성 (AI 분석)
                  </>
                )}
              </button>
            </div>
          ) : (
            // Infographic Report Preview
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-4 rounded-xl shadow-lg flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-bold flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    인포그래픽 보고서
                  </h2>
                  <p className="text-xs text-slate-400">AI가 분석한 결과입니다. 이미지 또는 PDF로 저장하세요.</p>
                </div>
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>

              {/* 3:4 비율 인포그래픽 보고서 */}
              <div className="overflow-x-auto pb-4">
                <div
                  ref={reportRef}
                  className="bg-white mx-auto shadow-2xl"
                  style={{ width: '600px', minHeight: '800px', padding: '24px' }}
                >
                  {/* Header */}
                  <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white p-4 rounded-lg mb-4">
                    <div className="text-center">
                      <h1 className="text-xl font-bold mb-1">{formData.title}</h1>
                      <p className="text-blue-200 text-xs">발표자: {formData.members} | 일시: {new Date().toLocaleDateString('ko-KR')}</p>
                    </div>
                  </div>

                  {/* Grid Layout - 3 columns */}
                  <div className="grid grid-cols-3 gap-3">

                    {/* Row 1: 현황 분석 (파이차트) */}
                    <div className="col-span-1 bg-slate-50 rounded-lg p-3 border border-slate-200">
                      <h3 className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-1">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                        I. 사고 원인 분석
                      </h3>
                      <div className="h-28">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={pieData}
                              cx="50%"
                              cy="50%"
                              innerRadius={20}
                              outerRadius={40}
                              dataKey="value"
                              label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                              labelLine={false}
                            >
                              {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="mt-1 space-y-0.5">
                        {pieData.slice(0, 3).map((item, idx) => (
                          <div key={idx} className="flex items-center gap-1 text-[9px]">
                            <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: COLORS[idx] }}></div>
                            <span className="text-slate-600 truncate">{item.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 문제점 목록 */}
                    <div className="col-span-2 bg-red-50 rounded-lg p-3 border border-red-100">
                      <h3 className="text-xs font-bold text-red-700 mb-2 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        II. 문제점 및 리스크
                      </h3>
                      <div className="space-y-1.5">
                        {analyzedData?.problems.map((problem, idx) => (
                          <div key={idx} className="flex items-start gap-2 bg-white p-2 rounded border border-red-100">
                            <span className="bg-red-500 text-white text-[8px] px-1.5 py-0.5 rounded font-bold shrink-0">{idx + 1}</span>
                            <span className="text-[10px] text-slate-700 leading-tight">{problem}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Row 2: 5 Whys 분석 */}
                    <div className="col-span-3 bg-slate-900 text-white rounded-lg p-3">
                      <h3 className="text-xs font-bold mb-2 flex items-center gap-1">
                        <Search className="w-3 h-3 text-red-400" />
                        III. 근본 원인 분석 (5 Whys)
                      </h3>
                      <div className="flex items-center justify-between gap-1">
                        {analyzedData?.rootCauses && Object.entries(analyzedData.rootCauses).map(([key, value], idx) => (
                          <React.Fragment key={key}>
                            <div className="flex-1 bg-white/10 rounded p-1.5 text-center">
                              <div className="text-[8px] text-red-300 font-bold mb-0.5">WHY {idx + 1}</div>
                              <div className="text-[8px] leading-tight line-clamp-2">{value.split('→')[1]?.trim() || value}</div>
                            </div>
                            {idx < 4 && <div className="text-slate-500 text-xs">→</div>}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>

                    {/* Row 3: 해결방안 우선순위 */}
                    <div className="col-span-2 bg-blue-50 rounded-lg p-3 border border-blue-100">
                      <h3 className="text-xs font-bold text-blue-700 mb-2 flex items-center gap-1">
                        <Lightbulb className="w-3 h-3" />
                        IV. 해결 방안 우선순위
                      </h3>
                      <div className="h-24">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={barData} layout="vertical">
                            <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 8 }} />
                            <YAxis type="category" dataKey="name" tick={{ fontSize: 8 }} width={60} />
                            <Tooltip contentStyle={{ fontSize: 10 }} />
                            <Bar dataKey="긴급도" fill="#EF4444" barSize={8} />
                            <Bar dataKey="영향도" fill="#3B82F6" barSize={8} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="flex justify-center gap-4 mt-1">
                        <span className="text-[8px] flex items-center gap-1"><span className="w-2 h-2 bg-red-500 rounded"></span>긴급도</span>
                        <span className="text-[8px] flex items-center gap-1"><span className="w-2 h-2 bg-blue-500 rounded"></span>영향도</span>
                      </div>
                    </div>

                    {/* 기대효과 */}
                    <div className="col-span-1 bg-green-50 rounded-lg p-3 border border-green-100">
                      <h3 className="text-xs font-bold text-green-700 mb-2 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        V. 기대 효과
                      </h3>
                      <div className="space-y-1.5">
                        {analyzedData?.expectedResults.map((result, idx) => (
                          <div key={idx} className="flex items-center gap-1.5 text-[9px] text-slate-700">
                            <CheckCircle className="w-3 h-3 text-green-500 shrink-0" />
                            <span className="leading-tight">{result}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Row 4: 실행 일정 */}
                    <div className="col-span-3 bg-purple-50 rounded-lg p-3 border border-purple-100">
                      <h3 className="text-xs font-bold text-purple-700 mb-2 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        VI. 실행 계획 (Timeline)
                      </h3>
                      <div className="relative">
                        <div className="absolute top-3 left-0 right-0 h-1 bg-purple-200 rounded"></div>
                        <div className="flex justify-between relative z-10">
                          {analyzedData?.timeline.map((item, idx) => (
                            <div key={idx} className="flex flex-col items-center" style={{ width: `${100 / (analyzedData?.timeline.length || 1)}%` }}>
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-[9px] font-bold ${
                                idx === 0 ? 'bg-red-500' : idx === 1 ? 'bg-yellow-500' : 'bg-green-500'
                              }`}>
                                {idx + 1}
                              </div>
                              <div className="mt-1 text-center">
                                <div className="text-[9px] font-bold text-slate-800">{item.task}</div>
                                <div className="text-[8px] text-slate-500">{item.start} ~ {item.end}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Footer */}
                  <div className="mt-4 pt-3 border-t border-slate-200 flex justify-between items-center text-[8px] text-slate-400">
                    <div className="flex items-center gap-1">
                      <Flame className="w-3 h-3 text-orange-400" />
                      <span>YJA SYSTEMS | 제3공장 화재사고 대응 보고서</span>
                    </div>
                    <span>Team {teamId} | Confidential</span>
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
                  onClick={handleDownloadImage}
                  className="flex-1 bg-green-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-green-700 transition-all flex items-center justify-center gap-2"
                >
                  <FileImage className="w-5 h-5" />
                  이미지 저장
                </button>
                <button
                  onClick={handleDownloadPDF}
                  className="flex-1 bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                >
                  <FileDown className="w-5 h-5" />
                  PDF 저장
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
