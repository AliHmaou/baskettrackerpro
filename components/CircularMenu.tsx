
import React, { useEffect, useState } from 'react';
import { 
  Trophy, 
  HelpingHand, 
  Hand, 
  Timer, 
  Hash,
  ChevronUp,
  Target,
  Shield,
  Eraser,
  Plus
} from 'lucide-react';
import { StatActionType, PlayerStats } from '../types';

interface CircularMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onAction: (action: StatActionType, value: number) => void;
  playerName: string;
  playerStats?: PlayerStats;
  lastActionFeedback?: { type: string, value: number } | null;
}

const MENU_ITEMS = [
  { id: StatActionType.ADD_2PT, label: '2 Pts', icon: Hash, color: 'bg-orange-500' },
  { id: StatActionType.ADD_3PT, label: '3 Pts', icon: Trophy, color: 'bg-yellow-500' },
  { id: StatActionType.ADD_FT, label: 'LF', icon: Target, color: 'bg-emerald-500' },
  { id: StatActionType.ADD_REB, label: 'Rebond', icon: ChevronUp, color: 'bg-blue-500' },
  { id: StatActionType.ADD_AST, label: 'Passe D.', icon: HelpingHand, color: 'bg-purple-500' },
  { id: StatActionType.ADD_STL, label: 'Interc.', icon: Hand, color: 'bg-red-500' },
  { id: StatActionType.ADD_BLK, label: 'Contre', icon: Shield, color: 'bg-indigo-500' },
  { id: StatActionType.ADD_MIN, label: 'Min', icon: Timer, color: 'bg-slate-500' },
];

export const CircularMenu: React.FC<CircularMenuProps> = ({ 
  isOpen, 
  onClose, 
  onAction, 
  playerName, 
  playerStats,
  lastActionFeedback 
}) => {
  const [isSubtractMode, setIsSubtractMode] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => setAnimateIn(true));
    } else {
      setAnimateIn(false);
      setIsSubtractMode(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const radius = window.innerWidth < 640 ? 125 : 155; 
  const itemCount = MENU_ITEMS.length;
  const startAngle = -90; 

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose}>
      <div 
        className={`relative w-full max-w-[400px] aspect-square flex items-center justify-center transition-all duration-500 transform ${animateIn ? 'scale-100 opacity-100' : 'scale-75 opacity-0 rotate-6'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Hub de Stats Central */}
        <div className="absolute z-20 flex flex-col items-center justify-center w-44 h-44 sm:w-52 sm:h-52 rounded-full bg-slate-900 border-2 border-orange-500 shadow-[0_0_40px_rgba(249,115,22,0.3)] p-3 overflow-hidden">
          
          {/* Action Feedback Overlay inside Hub */}
          {lastActionFeedback && (
            <div className="absolute inset-0 z-30 flex items-center justify-center bg-slate-900/95 animate-in fade-in zoom-in duration-200">
               <div className="text-center animate-bounce-up-hub">
                  <div className={`text-2xl font-black italic ${lastActionFeedback.value > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {lastActionFeedback.value > 0 ? '+' : ''}{lastActionFeedback.value}
                  </div>
                  <div className="text-[8px] font-black text-white uppercase tracking-widest">
                    {lastActionFeedback.type.split('_')[1]}
                  </div>
               </div>
            </div>
          )}

          <div className="text-center w-full">
            <h3 className="text-xs font-black text-white truncate mb-1.5 uppercase italic border-b border-white/10 pb-1">{playerName}</h3>
            
            <div className="grid grid-cols-4 gap-1 mb-2">
               <div className="flex flex-col bg-white/5 p-1 rounded-lg">
                  <span className="text-[5px] text-slate-500 font-black uppercase leading-none">Pts</span>
                  <span className="text-[10px] font-black text-orange-400">{playerStats?.points || 0}</span>
               </div>
               <div className="flex flex-col bg-white/5 p-1 rounded-lg">
                  <span className="text-[5px] text-slate-500 font-black uppercase leading-none">Reb</span>
                  <span className="text-[10px] font-black text-blue-400">{playerStats?.rebounds || 0}</span>
               </div>
               <div className="flex flex-col bg-white/5 p-1 rounded-lg">
                  <span className="text-[5px] text-slate-500 font-black uppercase leading-none">Ast</span>
                  <span className="text-[10px] font-black text-purple-400">{playerStats?.assists || 0}</span>
               </div>
               <div className="flex flex-col bg-white/5 p-1 rounded-lg">
                  <span className="text-[5px] text-slate-500 font-black uppercase leading-none">Int</span>
                  <span className="text-[10px] font-black text-red-400">{playerStats?.steals || 0}</span>
               </div>
               <div className="flex flex-col bg-white/5 p-1 rounded-lg">
                  <span className="text-[5px] text-slate-500 font-black uppercase leading-none">Ctr</span>
                  <span className="text-[10px] font-black text-indigo-400">{playerStats?.blocks || 0}</span>
               </div>
               <div className="flex flex-col bg-white/5 p-1 rounded-lg">
                  <span className="text-[5px] text-slate-500 font-black uppercase leading-none">3P</span>
                  <span className="text-[10px] font-black text-yellow-400">{playerStats?.threePointersMade || 0}</span>
               </div>
               <div className="flex flex-col bg-white/5 p-1 rounded-lg">
                  <span className="text-[5px] text-slate-500 font-black uppercase leading-none">LF</span>
                  <span className="text-[10px] font-black text-emerald-400">{playerStats?.freeThrowsMade || 0}</span>
               </div>
               <div className="flex flex-col bg-white/5 p-1 rounded-lg">
                  <span className="text-[5px] text-slate-500 font-black uppercase leading-none">Min</span>
                  <span className="text-[10px] font-black text-slate-400">{playerStats?.minutesPlayed || 0}</span>
               </div>
            </div>
          </div>
          
          <button
            onClick={() => setIsSubtractMode(!isSubtractMode)}
            className={`w-full py-2 rounded-xl text-[10px] font-black flex items-center justify-center gap-2 transition-all border shadow-lg ${isSubtractMode ? 'bg-emerald-600 border-emerald-400 text-white' : 'bg-red-600 border-red-400 text-white'}`}
          >
            {isSubtractMode ? <Plus size={12} /> : <Eraser size={12} />}
            {isSubtractMode ? 'AJOUTER' : 'CORRIGER'}
          </button>
        </div>

        {/* Boutons Radiaux */}
        {MENU_ITEMS.map((item, index) => {
          const angleDeg = startAngle + (index * (360 / itemCount));
          const angleRad = (angleDeg * Math.PI) / 180;
          const x = Math.cos(angleRad) * radius;
          const y = Math.sin(angleRad) * radius;

          return (
            <button
              key={item.id}
              onClick={() => {
                 const multiplier = isSubtractMode ? -1 : 1;
                 let val = 1;
                 if (item.id === StatActionType.ADD_2PT) val = 2;
                 if (item.id === StatActionType.ADD_3PT) val = 3;
                 onAction(item.id as StatActionType, val * multiplier);
              }}
              className={`absolute w-14 h-14 sm:w-18 sm:h-18 rounded-2xl shadow-xl flex flex-col items-center justify-center text-white transition-all active:scale-90 border border-slate-900/50
                ${isSubtractMode ? 'bg-slate-700 ring-2 ring-red-500/50' : item.color}
                ${animateIn ? 'scale-100' : 'scale-0'}
              `}
              style={{
                transform: `translate(${x}px, ${y}px)`,
                transitionDelay: `${index * 15}ms`
              }}
            >
              <item.icon size={18} className="mb-0.5" />
              <span className="text-[7px] sm:text-[8px] font-black uppercase tracking-tighter leading-none">{isSubtractMode ? '- ' : '+ '}{item.label}</span>
              {isSubtractMode && <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[8px] font-black rounded-full w-5 h-5 flex items-center justify-center border-2 border-slate-900 shadow-lg">−</span>}
            </button>
          );
        })}
      </div>
      
      <div className="absolute bottom-8">
        <button onClick={onClose} className="bg-slate-800 text-white px-8 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10 shadow-lg active:scale-95 transition-all">
          Valider
        </button>
      </div>

      <style>{`
        @keyframes bounce-up-hub {
          0% { transform: scale(0.5); opacity: 0; }
          20% { transform: scale(1.2); opacity: 1; }
          80% { transform: scale(1); opacity: 1; }
          100% { transform: scale(0.8); opacity: 0; }
        }
        .animate-bounce-up-hub {
          animation: bounce-up-hub 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
};
