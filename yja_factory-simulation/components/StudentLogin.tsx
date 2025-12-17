import React, { useState } from 'react';
import { UserProfile, SessionConfig } from '../types';
import { Smartphone, LogIn, Users, Hash, ChevronLeft, ChevronRight, Calendar, Box } from 'lucide-react';

interface Props {
  sessions: SessionConfig[];
  currentSession: SessionConfig | null;
  onSelectSession: (session: SessionConfig) => void;
  onJoin: (user: UserProfile) => void;
  onBack: () => void;
}

const StudentLogin: React.FC<Props> = ({ sessions, currentSession, onSelectSession, onJoin, onBack }) => {
  const [name, setName] = useState("");
  const [teamId, setTeamId] = useState<number | null>(null);
  const [step, setStep] = useState<'SELECT_SESSION' | 'ENTER_INFO'>(currentSession ? 'ENTER_INFO' : 'SELECT_SESSION');

  const handleSessionSelect = (session: SessionConfig) => {
    onSelectSession(session);
    setStep('ENTER_INFO');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("이름을 입력해주세요.");
      return;
    }
    if (!teamId) {
      alert("자신의 소속 조를 선택해주세요.");
      return;
    }
    onJoin({ name, teamId });
  };

  // Step 1: 세션 선택 화면
  if (step === 'SELECT_SESSION') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">

          {/* Header */}
          <div className="bg-slate-900 p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600 rounded-full mix-blend-overlay filter blur-3xl opacity-20 -mr-10 -mt-10"></div>
            <button
              onClick={onBack}
              className="absolute top-4 left-4 text-slate-400 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
              <Smartphone className="w-6 h-6 text-blue-400" />
              교육 세션 선택
            </h1>
            <p className="text-slate-400 text-sm">참여할 교육 세션을 선택하세요.</p>
          </div>

          <div className="p-6">
            {sessions.length === 0 ? (
              <div className="py-12 text-center">
                <Box className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                <p className="font-bold text-slate-600">열린 세션이 없습니다</p>
                <p className="text-sm text-slate-400 mt-1">관리자가 세션을 생성할 때까지 기다려주세요.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {sessions.map((session) => (
                  <button
                    key={session.id}
                    onClick={() => handleSessionSelect(session)}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all text-left group"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                          {session.groupName}
                        </h3>
                        <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {session.totalTeams}개 조
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(session.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Step 2: 정보 입력 화면
  if (!currentSession) {
    setStep('SELECT_SESSION');
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">

        {/* Header */}
        <div className="bg-slate-900 p-8 text-white relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600 rounded-full mix-blend-overlay filter blur-3xl opacity-20 -mr-10 -mt-10"></div>
           <button
             onClick={() => setStep('SELECT_SESSION')}
             className="absolute top-4 left-4 text-slate-400 hover:text-white transition-colors"
           >
             <ChevronLeft className="w-6 h-6" />
           </button>
           <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
             <Smartphone className="w-6 h-6 text-blue-400" />
             학습자 접속
           </h1>
           <p className="text-slate-400 text-sm">교육 세션에 참여하기 위해 정보를 입력하세요.</p>
        </div>

        <div className="p-8">
           {/* Session Info */}
           <div className="bg-blue-50 border border-blue-100 p-4 mb-8 rounded-xl flex flex-col items-center text-center">
              <span className="text-[10px] font-bold uppercase tracking-widest text-blue-500 mb-1">Current Session</span>
              <h2 className="text-lg font-bold text-slate-800">{currentSession.groupName}</h2>
           </div>

           <form onSubmit={handleSubmit} className="space-y-6">

              <div className="space-y-3">
                 <label className="block text-sm font-bold text-slate-700 flex items-center gap-2">
                    <Hash className="w-4 h-4 text-slate-400" />
                    소속 조 (Team) 선택
                 </label>
                 <div className="grid grid-cols-4 gap-2">
                    {Array.from({ length: currentSession.totalTeams }, (_, i) => i + 1).map((num) => (
                        <button
                            key={num}
                            type="button"
                            onClick={() => setTeamId(num)}
                            className={`py-2.5 text-sm font-semibold rounded-lg transition-all border ${
                                teamId === num
                                ? 'bg-slate-800 text-white border-slate-800 shadow-md transform scale-105'
                                : 'bg-white text-slate-500 border-slate-200 hover:border-slate-400 hover:bg-slate-50'
                            }`}
                        >
                            {num}조
                        </button>
                    ))}
                 </div>
              </div>

              <div className="space-y-3">
                 <label className="block text-sm font-bold text-slate-700 flex items-center gap-2">
                    <Users className="w-4 h-4 text-slate-400" />
                    성명 (Name)
                 </label>
                 <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none transition-all font-medium text-slate-800"
                    placeholder="성명을 입력하세요"
                 />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 hover:bg-blue-700 hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 mt-4"
              >
                입장하기
                <LogIn className="w-4 h-4" />
              </button>
           </form>
        </div>
      </div>
    </div>
  );
};

export default StudentLogin;