import React, { useState } from 'react';
import { UserProfile, SessionConfig } from '../types';
import { Smartphone, LogIn, Users, Hash, ChevronLeft } from 'lucide-react';

interface Props {
  sessionConfig: SessionConfig;
  onJoin: (user: UserProfile) => void;
  onBack: () => void;
}

const StudentLogin: React.FC<Props> = ({ sessionConfig, onJoin, onBack }) => {
  const [name, setName] = useState("");
  const [teamId, setTeamId] = useState<number | null>(null);

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
             학습자 접속
           </h1>
           <p className="text-slate-400 text-sm">교육 세션에 참여하기 위해 정보를 입력하세요.</p>
        </div>

        <div className="p-8">
           {/* Session Info */}
           <div className="bg-blue-50 border border-blue-100 p-4 mb-8 rounded-xl flex flex-col items-center text-center">
              <span className="text-[10px] font-bold uppercase tracking-widest text-blue-500 mb-1">Current Session</span>
              <h2 className="text-lg font-bold text-slate-800">{sessionConfig.groupName}</h2>
           </div>

           <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="space-y-3">
                 <label className="block text-sm font-bold text-slate-700 flex items-center gap-2">
                    <Hash className="w-4 h-4 text-slate-400" />
                    소속 조 (Team) 선택
                 </label>
                 <div className="grid grid-cols-4 gap-2">
                    {Array.from({ length: sessionConfig.totalTeams }, (_, i) => i + 1).map((num) => (
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