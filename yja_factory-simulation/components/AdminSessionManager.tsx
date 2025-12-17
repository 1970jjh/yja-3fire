import React, { useState } from 'react';
import { SessionConfig } from '../types';
import { Plus, Trash2, MonitorPlay, Users, LogOut, Box, RotateCcw, Calendar, Server } from 'lucide-react';

interface Props {
  sessions: SessionConfig[];
  onCreateSession: (session: SessionConfig) => void;
  onDeleteSession: (id: string) => void;
  onSelectSession: (session: SessionConfig) => void;
  onLogout: () => void;
  onModeSwitch: () => void;
}

const AdminSessionManager: React.FC<Props> = ({ sessions, onCreateSession, onDeleteSession, onSelectSession, onLogout, onModeSwitch }) => {
  const [newGroupName, setNewGroupName] = useState("");
  const [newTeamCount, setNewTeamCount] = useState(6);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;

    const newSession: SessionConfig = {
      id: Date.now().toString(),
      groupName: newGroupName,
      totalTeams: newTeamCount,
      createdAt: Date.now(),
      isReportEnabled: false
    };

    onCreateSession(newSession);
    setNewGroupName("");
    setNewTeamCount(6);
  };

  const handleDeleteClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Prevent card click
    e.preventDefault();  // Double safety
    if (window.confirm('정말 이 세션을 삭제하시겠습니까? 데이터는 복구되지 않습니다.')) {
        onDeleteSession(id);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 flex flex-col items-center">
      <div className="w-full max-w-5xl space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end border-b border-slate-200 pb-6 gap-4">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Session Manager</h1>
                <p className="text-slate-500 mt-1">교육 그룹 관리 및 모니터링 시작</p>
            </div>
            <div className="flex gap-3">
                <button 
                    onClick={onModeSwitch}
                    className="bg-white text-slate-600 px-4 py-2.5 font-semibold border border-slate-300 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors flex items-center gap-2 shadow-sm"
                >
                    <RotateCcw className="w-4 h-4" />
                    모드 전환
                </button>
                <button 
                    onClick={onLogout}
                    className="bg-slate-800 text-white px-4 py-2.5 font-semibold rounded-lg hover:bg-slate-900 transition-colors flex items-center gap-2 shadow-md"
                >
                    <LogOut className="w-4 h-4" />
                    로그아웃
                </button>
            </div>
        </div>

        {/* Create New Session Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center gap-2">
                <div className="bg-blue-100 p-1.5 rounded text-blue-600">
                    <Plus className="w-4 h-4" />
                </div>
                <h2 className="font-bold text-slate-800">새로운 교육 그룹 생성</h2>
            </div>
            <form onSubmit={handleCreate} className="p-6 flex flex-col md:flex-row gap-6 items-end">
                <div className="flex-1 w-full space-y-2">
                    <label className="block font-semibold text-sm text-slate-700">그룹명 (Group Name)</label>
                    <input 
                        type="text" 
                        value={newGroupName}
                        onChange={(e) => setNewGroupName(e.target.value)}
                        placeholder="예: 2024 신입사원 입문교육 A차수"
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all placeholder-slate-400"
                        required
                    />
                </div>
                <div className="w-full md:w-64 space-y-2">
                    <div className="flex justify-between">
                        <label className="block font-semibold text-sm text-slate-700">팀 수 (Total Teams)</label>
                        <span className="text-blue-600 font-bold text-sm">{newTeamCount}개 조</span>
                    </div>
                    <input 
                        type="range" 
                        min="1" 
                        max="12" 
                        value={newTeamCount}
                        onChange={(e) => setNewTeamCount(Number(e.target.value))}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                        <span>1</span>
                        <span>12</span>
                    </div>
                </div>
                <button 
                    type="submit"
                    className="w-full md:w-auto bg-blue-600 text-white px-8 py-3.5 font-bold rounded-xl shadow-lg shadow-blue-600/20 hover:bg-blue-700 hover:-translate-y-0.5 transition-all whitespace-nowrap"
                >
                    생성하기
                </button>
            </form>
        </div>

        {/* Session List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sessions.map((session) => (
                <div key={session.id} className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between group hover:border-blue-300 hover:shadow-lg transition-all duration-300 cursor-pointer relative" onClick={() => onSelectSession(session)}>
                    <div className="mb-6">
                        <div className="flex justify-between items-start mb-4">
                            <span className="bg-slate-100 text-slate-500 text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(session.createdAt).toLocaleDateString()}
                            </span>
                            
                            <button 
                                onClick={(e) => handleDeleteClick(e, session.id)}
                                className="text-slate-300 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all z-20"
                                title="세션 삭제"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 leading-tight mb-2 pr-8">{session.groupName}</h3>
                        <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                            <Users className="w-4 h-4" />
                            <span>참여 팀: {session.totalTeams}개 조</span>
                        </div>
                    </div>
                    
                    <div 
                        className="w-full py-3 bg-slate-50 text-slate-600 font-bold rounded-xl border border-slate-200 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 flex items-center justify-center gap-2 transition-all"
                    >
                        <MonitorPlay className="w-4 h-4" />
                        모니터링 시작
                    </div>
                </div>
            ))}
            
            {sessions.length === 0 && (
                <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-300 rounded-2xl text-slate-400 bg-slate-50/50">
                    <Box className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="font-bold">생성된 세션이 없습니다.</p>
                    <p className="text-sm">새로운 교육 그룹을 생성하여 시작하세요.</p>
                </div>
            )}
        </div>

      </div>
    </div>
  );
};

export default AdminSessionManager;