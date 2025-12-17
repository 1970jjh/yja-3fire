import React, { useState } from 'react';
import { Lock, ArrowLeft, Key, ShieldCheck } from 'lucide-react';

interface Props {
  onLoginSuccess: () => void;
  onBack: () => void;
}

const AdminLogin: React.FC<Props> = ({ onLoginSuccess, onBack }) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  // Updated password per request
  const ADMIN_PASSWORD = "6749467";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      onLoginSuccess();
    } else {
      setError(true);
      setPassword("");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-900">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden relative">
        
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-orange-500"></div>

        <div className="p-8 pb-0">
             <button 
                onClick={onBack}
                className="text-slate-400 hover:text-slate-800 transition-colors flex items-center gap-1 text-sm font-medium mb-6"
             >
                <ArrowLeft className="w-4 h-4" />
                Back
             </button>
             <div className="flex items-center gap-3 mb-2">
                 <div className="bg-slate-100 p-2 rounded-lg">
                    <ShieldCheck className="w-6 h-6 text-slate-800" />
                 </div>
                 <h2 className="text-2xl font-bold text-slate-800">Admin Access</h2>
             </div>
             <p className="text-slate-500 text-sm">강사 및 운영자 전용 관리자 페이지입니다.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 pt-6 space-y-6">
          <div className="space-y-3">
            <label className="block text-sm font-bold text-slate-700">Password</label>
            <div className="relative">
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => { setError(false); setPassword(e.target.value); }}
                  className="w-full pl-10 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-800 transition-all font-mono text-lg tracking-widest"
                  placeholder="••••••••"
                  autoFocus
                />
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            </div>
            {error && (
                <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-100 animate-pulse">
                    <Lock className="w-4 h-4" />
                    <span className="font-medium">접근 거부: 비밀번호가 일치하지 않습니다.</span>
                </div>
            )}
          </div>

          <button 
            type="submit"
            className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl shadow-lg hover:bg-slate-800 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
          >
            로그인
          </button>
        </form>
        
        <div className="bg-slate-50 p-4 border-t border-slate-100 text-center">
            <p className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">
                Authorized Personnel Only
            </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;