import React, { useState, useMemo } from 'react';
import { INFO_CARD_IMAGES } from '../constants';
import { X, FileSearch, ZoomIn, Grid, PenTool, Trash2, Plus, MessageSquare } from 'lucide-react';

interface Props {
  teamId: number;
  totalTeams: number;
  onClose: () => void;
  notes: string[];
  onAddNote: (note: string) => void;
  onDeleteNote: (index: number) => void;
}

const InfoCardModal: React.FC<Props> = ({ teamId, totalTeams, onClose, notes, onAddNote, onDeleteNote }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [newNote, setNewNote] = useState("");

  const teamImages = useMemo(() => {
    const totalImages = INFO_CARD_IMAGES.length;
    const baseCount = Math.floor(totalImages / totalTeams);
    const remainder = totalImages % totalTeams;
    let startIndex = 0;
    for (let i = 1; i < teamId; i++) {
        const countForPrevTeam = baseCount + (i <= remainder ? 1 : 0);
        startIndex += countForPrevTeam;
    }
    const myCount = baseCount + (teamId <= remainder ? 1 : 0);
    const endIndex = startIndex + myCount;
    return INFO_CARD_IMAGES.slice(startIndex, endIndex);
  }, [teamId, totalTeams]);

  const getLabel = (url: string) => {
    try {
        const filename = url.split('/').pop() || '';
        return filename.split('.')[0];
    } catch (e) {
        return '';
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newNote.trim()) {
        onAddNote(newNote.trim());
        setNewNote("");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
       <div className="bg-white w-full max-w-5xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
          
          {/* Header */}
          <div className="bg-white p-5 flex justify-between items-center border-b border-slate-100">
             <div className="flex items-center gap-3">
                <div className="bg-blue-50 text-blue-600 p-2 rounded-lg">
                    <FileSearch className="w-5 h-5" />
                </div>
                <div>
                    <h2 className="font-bold text-lg text-slate-800 leading-tight">Team {teamId} Intelligence</h2>
                    <span className="text-xs font-medium text-slate-500">Collected Evidence & Notes</span>
                </div>
             </div>
             <button onClick={onClose} className="text-slate-400 hover:text-slate-800 hover:bg-slate-100 p-2 rounded-full transition-all">
                <X className="w-6 h-6" />
             </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-hidden flex flex-col md:flex-row bg-slate-50">
             
             {/* Left: Images Grid */}
             <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                 <div className="flex items-center gap-2 mb-4 text-slate-700">
                    <Grid className="w-4 h-4" />
                    <span className="font-bold text-sm uppercase tracking-wide">Evidence Gallery</span>
                 </div>

                 {teamImages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-slate-200 rounded-xl text-slate-400">
                        <FileSearch className="w-10 h-10 mb-2 opacity-50" />
                        <p className="font-medium text-sm">No evidence found.</p>
                    </div>
                 ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                        {teamImages.map((src, idx) => {
                            const label = getLabel(src);
                            return (
                                <div 
                                    key={idx}
                                    onClick={() => setSelectedImage(src)}
                                    className="aspect-[3/4] group relative cursor-pointer rounded-lg overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition-all bg-white"
                                >
                                    <img 
                                        src={src} 
                                        alt={`Evidence ${label}`} 
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <p className="text-white text-[10px] font-mono truncate">{label}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                 )}
             </div>

             {/* Right: Notes Panel */}
             <div className="w-full md:w-80 bg-white border-t md:border-t-0 md:border-l border-slate-200 flex flex-col">
                <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                    <div className="flex items-center gap-2 text-slate-700">
                        <MessageSquare className="w-4 h-4" />
                        <span className="font-bold text-sm uppercase tracking-wide">Private Notes</span>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {notes.length === 0 ? (
                        <div className="text-center py-8 text-slate-400 text-sm">
                            <PenTool className="w-8 h-8 mx-auto mb-2 opacity-20" />
                            <p>기록된 노트가 없습니다.</p>
                        </div>
                    ) : (
                        notes.map((note, idx) => (
                            <div key={idx} className="bg-yellow-50 border border-yellow-100 p-3 rounded-lg text-sm text-slate-700 shadow-sm group relative">
                                <p className="pr-6 font-medium leading-relaxed">{note}</p>
                                <button 
                                    onClick={() => onDeleteNote(idx)}
                                    className="absolute top-2 right-2 text-yellow-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        ))
                    )}
                </div>

                <div className="p-4 border-t border-slate-100 bg-white">
                    <form onSubmit={handleAddSubmit} className="relative">
                        <input 
                            type="text" 
                            value={newNote}
                            onChange={(e) => setNewNote(e.target.value)}
                            placeholder="메모 작성..." 
                            className="w-full pl-4 pr-10 py-3 bg-slate-100 border-none rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm font-medium"
                        />
                        <button 
                            type="submit"
                            disabled={!newNote.trim()}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    </form>
                </div>
             </div>
          </div>
          
          <div className="bg-slate-900 text-slate-400 p-2 text-center text-[10px] font-mono border-t border-slate-800">
             CONFIDENTIAL // TEAM {teamId} EYES ONLY
          </div>
       </div>

       {/* Lightbox */}
       {selectedImage && (
           <div 
             className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center p-4 animate-in fade-in duration-200 backdrop-blur-md"
             onClick={() => setSelectedImage(null)}
           >
               <button 
                  className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
                  onClick={() => setSelectedImage(null)}
               >
                   <X className="w-10 h-10" />
               </button>
               
               <div className="max-w-4xl w-full max-h-[90vh] flex flex-col items-center">
                   <img 
                      src={selectedImage} 
                      alt="Full view" 
                      className="max-w-full max-h-[85vh] object-contain rounded-sm shadow-2xl"
                      onClick={(e) => e.stopPropagation()} 
                   />
                   <div className="mt-4 text-white/80 font-mono text-sm bg-black/50 px-4 py-1 rounded-full backdrop-blur">
                       EVIDENCE_ID: {getLabel(selectedImage)}
                   </div>
               </div>
           </div>
       )}
    </div>
  );
};

export default InfoCardModal;