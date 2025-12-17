import React, { useState, useEffect } from 'react';
import { SimulationState, INITIAL_POWER_DATA, SessionConfig, UserProfile } from './types';
import StudentLayout from './components/StudentLayout';
import AdminDashboard from './components/AdminDashboard';
import AdminLogin from './components/AdminLogin';
import AdminSessionManager from './components/AdminSessionManager';
import StudentLogin from './components/StudentLogin';
import { Smartphone, Monitor, User, Flame, Lock, LogOut, ChevronRight, ShieldAlert } from 'lucide-react';

const INITIAL_STATE: SimulationState = {
  currentStep: 'INTRO',
  user: null,
  teamName: '',
  timeLeft: 3600,
  collectedFacts: [],
  personalNotes: [], // Initialize empty notes
  gapAnalysis: { current: '', ideal: '' },
  powerCalculation: INITIAL_POWER_DATA,
  rootCauses: { human: '', machine: '', material: '', method: '' },
  solutions: { shortTerm: '', longTerm: '', prevention: '' },
  finalReport: null,
};

// Mock Session for initial load
const DEFAULT_SESSION: SessionConfig = {
    id: 'default',
    groupName: '데모 교육 세션',
    totalTeams: 6,
    createdAt: Date.now(),
    isReportEnabled: false,
};

type AppMode = 'SELECT_ROLE' | 'ADMIN_LOGIN' | 'ADMIN_SESSION_MANAGER' | 'ADMIN_DASHBOARD' | 'STUDENT_LOGIN' | 'STUDENT_GAME';

export default function App() {
  const [appMode, setAppMode] = useState<AppMode>('SELECT_ROLE');
  const [currentSession, setCurrentSession] = useState<SessionConfig>(DEFAULT_SESSION);
  const [gameState, setGameState] = useState<SimulationState>(INITIAL_STATE);
  
  const [isAdmin, setIsAdmin] = useState(false);
  
  const [sessions, setSessions] = useState<SessionConfig[]>(() => {
      const saved = localStorage.getItem('firesim_sessions');
      return saved ? JSON.parse(saved) : [DEFAULT_SESSION];
  });

  useEffect(() => {
    localStorage.setItem('firesim_sessions', JSON.stringify(sessions));
  }, [sessions]);

  // --- Handlers ---

  const handleAdminLoginSuccess = () => {
    setIsAdmin(true);
    setAppMode('ADMIN_SESSION_MANAGER');
  };

  const handleSessionSelect = (session: SessionConfig) => {
    setCurrentSession(session);
    setAppMode('ADMIN_DASHBOARD');
  };

  const handleCreateSession = (newSession: SessionConfig) => {
    setSessions(prev => [...prev, newSession]);
  };

  const handleDeleteSession = (id: string) => {
    setSessions(prev => {
        const updated = prev.filter(s => s.id !== id);
        return updated;
    });
  };

  const handleToggleReport = (enabled: boolean) => {
    // Update local current session state
    const updatedSession = { ...currentSession, isReportEnabled: enabled };
    setCurrentSession(updatedSession);
    
    // Update in storage list as well
    setSessions(prev => prev.map(s => s.id === currentSession.id ? updatedSession : s));
  };

  const handleStudentJoin = (user: UserProfile) => {
    setGameState(prev => ({
        ...prev,
        user: user,
        teamName: `${user.teamId}조`
    }));
    setAppMode('STUDENT_GAME');
  };

  // Switch Mode (Maintains Admin Login)
  const handleModeSwitch = () => {
    setGameState(INITIAL_STATE);
    setAppMode('SELECT_ROLE');
  };

  // Full Logout (Clears Admin Login)
  const handleFullLogout = () => {
    setIsAdmin(false);
    setGameState(INITIAL_STATE);
    setAppMode('SELECT_ROLE');
  };

  // --- Renders ---

  if (appMode === 'SELECT_ROLE') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 bg-white rounded-3xl shadow-2xl overflow-hidden min-h-[500px]">
          
          {/* Left: Branding */}
          <div className="bg-gradient-to-br from-red-700 to-red-900 p-10 text-white flex flex-col justify-between relative overflow-hidden">
             {/* Abstract Background Decoration */}
             <div className="absolute -top-20 -left-20 w-60 h-60 bg-red-600 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse"></div>
             <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-orange-600 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse delay-75"></div>

             <div className="relative z-10">
                <div className="flex items-center gap-2 mb-6 opacity-90">
                    <ShieldAlert className="w-6 h-6" />
                    <span className="font-semibold tracking-wider text-sm uppercase">Incident Response Simulation</span>
                </div>
                <h1 className="text-4xl font-bold mb-4 leading-tight">
                    제3공장 화재사고<br/>문제해결 시뮬레이션
                </h1>
                <p className="text-red-100 font-medium">
                    Critical Thinking & Problem Solving<br/>for Crisis Management
                </p>
             </div>
             
             <div className="relative z-10 text-xs text-red-200/60 font-mono mt-12">
                VER 3.0.1 | YJA SYSTEMS
             </div>
          </div>

          {/* Right: Actions */}
          <div className="p-10 flex flex-col justify-center bg-white relative">
             {isAdmin && (
                <div className="absolute top-4 right-4 bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 border border-slate-200">
                    <Lock className="w-3 h-3" />
                    Admin Active
                </div>
             )}

             <h2 className="text-2xl font-bold text-slate-800 mb-8">접속 권한 선택</h2>
            
             <div className="space-y-4">
                <button 
                  onClick={() => setAppMode('STUDENT_LOGIN')}
                  className="w-full group flex items-center justify-between p-5 rounded-2xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 transition-all duration-300 shadow-sm hover:shadow-md text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-100 text-blue-600 p-3 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <Smartphone className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="block font-bold text-slate-800 text-lg">학습자 입장</span>
                      <span className="text-sm text-slate-500 group-hover:text-blue-600">교육생 및 팀원 전용</span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                </button>

                <button 
                  onClick={() => {
                    if (isAdmin) {
                      setAppMode('ADMIN_SESSION_MANAGER');
                    } else {
                      setAppMode('ADMIN_LOGIN');
                    }
                  }}
                  className="w-full group flex items-center justify-between p-5 rounded-2xl border border-slate-200 hover:border-slate-800 hover:bg-slate-50 transition-all duration-300 shadow-sm hover:shadow-md text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-slate-100 text-slate-600 p-3 rounded-xl group-hover:bg-slate-800 group-hover:text-white transition-colors">
                      <Monitor className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="block font-bold text-slate-800 text-lg">관리자 모드</span>
                      <span className="text-sm text-slate-500 group-hover:text-slate-800">
                         {isAdmin ? '세션 관리 화면으로 이동' : '강사 및 운영자 전용'}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-slate-800 group-hover:translate-x-1 transition-all" />
                </button>
             </div>

             {isAdmin && (
                <button 
                    onClick={handleFullLogout}
                    className="mt-8 text-center text-sm font-medium text-slate-400 hover:text-red-500 flex items-center justify-center gap-2 transition-colors"
                >
                    <LogOut className="w-4 h-4" />
                    로그아웃 (Secure Logout)
                </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (appMode === 'ADMIN_LOGIN') {
      return <AdminLogin onLoginSuccess={handleAdminLoginSuccess} onBack={handleModeSwitch} />;
  }
  if (appMode === 'ADMIN_SESSION_MANAGER') {
      return (
        <AdminSessionManager 
            sessions={sessions}
            onCreateSession={handleCreateSession}
            onDeleteSession={handleDeleteSession}
            onSelectSession={handleSessionSelect}
            onLogout={handleFullLogout} 
            onModeSwitch={handleModeSwitch}
        />
      );
  }
  if (appMode === 'ADMIN_DASHBOARD') {
      return (
        <AdminDashboard 
            currentSession={currentSession}
            onToggleReport={handleToggleReport}
            onLogout={handleFullLogout} 
            onModeSwitch={handleModeSwitch} 
        />
      );
  }

  if (appMode === 'STUDENT_LOGIN') {
      return (
        <StudentLogin 
            sessionConfig={currentSession} 
            onJoin={handleStudentJoin} 
            onBack={handleModeSwitch} 
        />
      );
  }

  return (
    <StudentLayout 
      gameState={gameState} 
      setGameState={setGameState} 
      totalTeams={currentSession.totalTeams}
      onLogout={handleModeSwitch}
      isAdmin={isAdmin}
      isReportEnabled={currentSession.isReportEnabled}
    />
  );
}