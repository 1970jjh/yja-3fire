import React, { useState, useEffect } from 'react';
import { SimulationState, SimulationStep } from '../types';
import { STEPS } from '../constants';
import ScenarioIntro from './ScenarioIntro';
import StepOneSituation from './StepOneSituation';
import StepTwoDefinition from './StepTwoDefinition';
import StepThreeAnalysis from './StepThreeAnalysis';
import StepFourSolution from './StepFourSolution';
import StepFiveReport from './StepFiveReport';
import LearningGuide from './LearningGuide';
import InfoCardModal from './InfoCardModal';
import { ChevronLeft, Clock, RotateCcw, FileText, Menu, Home } from 'lucide-react';

interface Props {
  gameState: SimulationState;
  setGameState: React.Dispatch<React.SetStateAction<SimulationState>>;
  totalTeams: number;
  onLogout: () => void;
  isAdmin?: boolean;
  isReportEnabled: boolean;
}

const StudentLayout: React.FC<Props> = ({ gameState, setGameState, totalTeams, onLogout, isAdmin = false, isReportEnabled }) => {
  const [showGuide, setShowGuide] = useState(false);
  const [showInfoCard, setShowInfoCard] = useState(false);
  
  const currentStepIndex = STEPS.findIndex(s => s.id === gameState.currentStep);
  const totalSteps = STEPS.length - 1; 
  const progress = Math.max(0, (currentStepIndex / totalSteps) * 100);

  useEffect(() => {
    if (gameState.currentStep !== 'INTRO' && gameState.currentStep !== 'REPORT' && gameState.currentStep !== 'FEEDBACK') {
      setShowGuide(true);
    } else {
      setShowGuide(false);
    }
  }, [gameState.currentStep]);

  const advanceStep = (nextStep: SimulationStep, dataUpdates?: Partial<SimulationState>) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setGameState(prev => ({
      ...prev,
      currentStep: nextStep,
      ...dataUpdates
    }));
  };

  const handleAddNote = (note: string) => {
    setGameState(prev => ({
        ...prev,
        personalNotes: [...(prev.personalNotes || []), note]
    }));
  };

  const handleDeleteNote = (index: number) => {
    setGameState(prev => ({
        ...prev,
        personalNotes: prev.personalNotes.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="min-h-screen flex flex-col max-w-lg mx-auto relative bg-slate-50 shadow-2xl overflow-hidden">
      
      {showGuide && (
        <LearningGuide 
          step={gameState.currentStep} 
          onClose={() => setShowGuide(false)} 
        />
      )}

      {showInfoCard && gameState.user && (
        <InfoCardModal 
          teamId={gameState.user.teamId}
          totalTeams={totalTeams}
          onClose={() => setShowInfoCard(false)}
          notes={gameState.personalNotes || []}
          onAddNote={handleAddNote}
          onDeleteNote={handleDeleteNote}
        />
      )}

      {/* Modern Top Bar */}
      <header className="bg-white/90 backdrop-blur-md px-4 py-3 sticky top-0 z-20 flex items-center justify-between border-b border-slate-200">
        <div className="flex items-center gap-3">
            {gameState.currentStep !== 'INTRO' && (
                <button 
                  onClick={() => {
                    if(confirm('초기 화면으로 돌아가시겠습니까? (진행상황은 저장되지 않습니다)')) {
                       onLogout();
                    }
                  }}
                  className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-all"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>
            )}
            <div>
              <span className="font-bold text-slate-800 text-sm uppercase tracking-wide block">
                  {gameState.currentStep === 'INTRO' ? 'FireSim' : STEPS[currentStepIndex].label}
              </span>
              {gameState.user && (
                  <span className="text-[11px] font-medium text-slate-400 block">
                      Team {gameState.user.teamId} <span className="mx-1">|</span> {gameState.user.name}
                  </span>
              )}
            </div>
        </div>
        <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-red-600 bg-red-50 px-3 py-1 rounded-full text-xs font-bold border border-red-100">
                <Clock className="w-3.5 h-3.5" />
                <span>59:21</span>
            </div>
            
            {isAdmin && (
                <button 
                    onClick={onLogout} 
                    className="text-slate-400 hover:text-slate-700 transition-colors p-1"
                    title="관리자 모드 전환"
                >
                    <RotateCcw className="w-5 h-5" />
                </button>
            )}
        </div>
      </header>

      {/* Sleek Progress Bar */}
      {gameState.currentStep !== 'INTRO' && (
          <div className="h-1 bg-slate-200 w-full">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-700 ease-out shadow-[0_0_10px_rgba(79,70,229,0.5)]"
                style={{ width: `${progress}%` }}
              />
          </div>
      )}

      {/* Content Area */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden p-5 pb-32 bg-slate-50">
        {gameState.currentStep === 'INTRO' && (
            <ScenarioIntro 
                onNext={() => advanceStep('SITUATION')} 
                onShowInfoCard={() => setShowInfoCard(true)}
                teamId={gameState.user?.teamId}
            />
        )}
        {gameState.currentStep === 'SITUATION' && (
            <StepOneSituation 
                onNext={(facts) => advanceStep('DEFINITION', { collectedFacts: facts })} 
            />
        )}
        {gameState.currentStep === 'DEFINITION' && (
            <StepTwoDefinition 
                onNext={(gap) => advanceStep('ANALYSIS', { gapAnalysis: gap })}
            />
        )}
        {gameState.currentStep === 'ANALYSIS' && (
            <StepThreeAnalysis 
                onNext={(data) => advanceStep('SOLUTION', { powerCalculation: data.powerData })}
            />
        )}
        {gameState.currentStep === 'SOLUTION' && (
            <StepFourSolution 
                onNext={(sol) => advanceStep('REPORT', { solutions: sol })}
            />
        )}
        {gameState.currentStep === 'REPORT' && (
            <StepFiveReport 
                data={gameState}
                onRestart={onLogout}
                isReportEnabled={isReportEnabled}
                onUpdateReport={(reportData) => setGameState(prev => ({...prev, finalReport: reportData}))}
            />
        )}
      </main>

      {/* Floating Info Button - Clean modern pill */}
      {gameState.currentStep !== 'INTRO' && gameState.currentStep !== 'REPORT' && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
            <button 
            onClick={() => setShowInfoCard(true)}
            className="bg-slate-800 text-white px-6 py-3 rounded-full font-bold text-sm flex items-center gap-2 hover:bg-slate-900 transition-all hover:scale-105 shadow-lg hover:shadow-xl active:scale-95 border border-slate-700"
            >
                <FileText className="w-4 h-4 text-yellow-400" />
                {gameState.user?.teamId}조 정보 (Secret)
            </button>
          </div>
      )}
    </div>
  );
};

export default StudentLayout;