import React, { useState, useMemo, useEffect } from 'react';
import { SetupScreen } from './components/SetupScreen';
import { CircularMenu } from './components/CircularMenu';
import { Player, StatActionType, PlayerStats, INITIAL_STATS, MatchInfo, INITIAL_MATCH_INFO } from './types';
import { 
  RefreshCw,
  Trophy,
  Plus,
  X,
  Copy,
  Check,
  Upload,
  Download,
  Search,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Calendar,
  Settings
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  ResponsiveContainer
} from 'recharts';

const LogoSVG = ({ className }: { className?: string }) => (
  <svg className={className} xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'>
    <circle cx='256' cy='256' r='250' fill='#0f172a'/>
    <path d='M256 506c-138 0-250-112-250-250S124 6 256 6s250 112 250 250-112 250-250 250zm0-480C129 26 26 129 26 256s103 230 230 230 230-103 230-230S383 26 256 26z' fill='#f97316'/>
    <path d='M256 26v460M26 256h460' stroke='#f97316' strokeWidth='20' strokeLinecap='round'/>
    <path d='M93 93c90 90 90 236 0 326M419 93c-90 90-90 236 0 326' fill='none' stroke='#f97316' strokeWidth='20' strokeLinecap='round'/>
  </svg>
);

const SplashScreen = ({ onComplete }: { onComplete: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[1000] bg-[#0f172a] flex flex-col items-center justify-center animate-out fade-out duration-700 delay-[2000ms]">
      <div className="relative">
        <div className="absolute inset-0 bg-orange-500/20 blur-[60px] animate-pulse rounded-full" />
        <LogoSVG className="w-32 h-32 relative animate-in zoom-in-50 duration-700 cubic-bezier(0.34, 1.56, 0.64, 1)" />
      </div>
      <div className="mt-8 text-center animate-in slide-in-from-bottom-4 duration-1000 delay-300">
        <h1 className="text-3xl font-black italic tracking-tighter text-white uppercase">BasketTracker <span className="text-orange-500">Pro</span></h1>
        <div className="mt-2 flex items-center justify-center gap-1.5">
           <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
           <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
           <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce" />
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);
  const [players, setPlayers] = useState<Player[]>([]);
  const [matchInfo, setMatchInfo] = useState<MatchInfo>(INITIAL_MATCH_INFO);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  
  const [opponentScore, setOpponentScore] = useState(0);
  const [quarter, setQuarter] = useState(1);
  const [lastUpdatedPlayerId, setLastUpdatedPlayerId] = useState<string | null>(null);
  const [updateFeedback, setUpdateFeedback] = useState<{ id: string, type: string, value: number } | null>(null);
  
  const [showExportModal, setShowExportModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showFullStatsTable, setShowFullStatsTable] = useState(false);
  const [importText, setImportText] = useState('');
  const [importError, setImportError] = useState('');
  const [copied, setCopied] = useState(false);

  const [showAddPlayerModal, setShowAddPlayerModal] = useState(false);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [newPlayerNumber, setNewPlayerNumber] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('basket-tracker-current-game');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.players && Array.isArray(parsed.players)) {
          setPlayers(parsed.players);
          setHasStarted(parsed.hasStarted);
          if (parsed.opponentScore !== undefined) setOpponentScore(parsed.opponentScore);
          if (parsed.quarter !== undefined) setQuarter(parsed.quarter);
          if (parsed.matchInfo) setMatchInfo(parsed.matchInfo);
        }
      } catch (e) { console.error(e); }
    }
  }, []);

  useEffect(() => {
    if (players.length > 0 || hasStarted) {
      localStorage.setItem('basket-tracker-current-game', JSON.stringify({ 
        players, 
        hasStarted, 
        opponentScore, 
        quarter,
        matchInfo
      }));
    }
  }, [players, hasStarted, opponentScore, quarter, matchInfo]);

  const handleStartGame = (roster: Player[], info: MatchInfo) => {
    setPlayers(roster);
    setMatchInfo(info);
    setHasStarted(true);
  };

  const handleAction = (action: StatActionType, value: number) => {
    if (!selectedPlayerId) return;

    setLastUpdatedPlayerId(selectedPlayerId);
    setUpdateFeedback({ id: selectedPlayerId, type: action, value });
    
    setTimeout(() => {
      setLastUpdatedPlayerId(null);
      setUpdateFeedback(null);
    }, 800);

    setPlayers(prevPlayers => prevPlayers.map(player => {
      if (player.id !== selectedPlayerId) return player;
      const newStats = { ...player.stats };

      switch (action) {
        case StatActionType.ADD_2PT: newStats.points += value; break;
        case StatActionType.ADD_3PT: 
          newStats.points += value; 
          newStats.threePointersMade += (value > 0 ? 1 : -1); 
          break;
        case StatActionType.ADD_FT:
          newStats.points += value;
          newStats.freeThrowsMade += (value > 0 ? 1 : -1);
          newStats.freeThrowsAttempted += (value > 0 ? 1 : -1);
          break;
        case StatActionType.ADD_REB: newStats.rebounds += value; break;
        case StatActionType.ADD_AST: newStats.assists += value; break;
        case StatActionType.ADD_STL: newStats.steals += value; break;
        case StatActionType.ADD_MIN: newStats.minutesPlayed += value; break;
        case StatActionType.ADD_BLK: newStats.blocks += value; break;
      }

      Object.keys(newStats).forEach(key => {
        const k = key as keyof PlayerStats;
        if (newStats[k] < 0) newStats[k] = 0;
      });

      return { ...player, stats: newStats, lastUpdated: Date.now() };
    }));
  };

  const resetMatchStatsOnly = () => {
    if (window.confirm("Voulez-vous réinitialiser toutes les statistiques du match ? L'effectif sera conservé.")) {
      setPlayers(prev => prev.map(p => ({ ...p, stats: { ...INITIAL_STATS }, lastUpdated: undefined })));
      setOpponentScore(0);
      setQuarter(1);
    }
  };

  const fullReset = () => {
    if (window.confirm("Voulez-vous réinitialiser COMPLÈTEMENT le match et l'effectif ?")) {
      setPlayers([]);
      setHasStarted(false);
      setOpponentScore(0);
      setQuarter(1);
      setMatchInfo(INITIAL_MATCH_INFO);
      localStorage.removeItem('basket-tracker-current-game');
    }
  };

  const handleAddPlayerDuringGame = () => {
    if (!newPlayerName.trim()) return;
    const newPlayer: Player = {
      id: Date.now().toString(),
      name: newPlayerName.trim(),
      number: newPlayerNumber.trim() || '0',
      stats: { ...INITIAL_STATS },
    };
    setPlayers(prev => [...prev, newPlayer]);
    setNewPlayerName('');
    setNewPlayerNumber('');
    setShowAddPlayerModal(false);
  };

  const generateMarkdownStats = () => {
    let md = `🏀 *Stats Match - ${matchInfo.teamName || 'Mon Équipe'} vs ${matchInfo.opponent || 'Adversaire'}*\n`;
    md += `📅 ${matchInfo.date} à ${matchInfo.time}\n`;
    md += `📍 ${matchInfo.location || 'Lieu inconnu'}\n`;
    md += `🏆 ${matchInfo.championship || 'Match amical'}\n\n`;
    md += `*SCORE FINAL: ${totalPoints} - ${opponentScore} (QT${quarter})*\n\n`;
    md += `| Joueur | Pts | Reb | Ast |\n`;
    md += `| :--- | :---: | :---: | :---: |\n`;
    players.forEach(p => {
      md += `| ${p.name} | ${p.stats.points} | ${p.stats.rebounds} | ${p.stats.assists} |\n`;
    });
    md += `\n<!-- JSON_DATA:${btoa(JSON.stringify({players, opponentScore, quarter, hasStarted: true, matchInfo}))} -->`;
    return md;
  };

  const handleImport = () => {
    try {
      setImportError('');
      let data: any = null;
      const match = importText.match(/<!-- JSON_DATA:(.*?) -->/);
      if (match && match[1]) {
        data = JSON.parse(atob(match[1]));
      } else {
        try { data = JSON.parse(importText); } catch(e) {}
      }
      if (data && (Array.isArray(data) || data.players)) {
        const finalPlayers = Array.isArray(data) ? data : data.players;
        setPlayers(finalPlayers);
        if (data.opponentScore !== undefined) setOpponentScore(data.opponentScore);
        if (data.quarter !== undefined) setQuarter(data.quarter);
        if (data.matchInfo) setMatchInfo(data.matchInfo);
        setHasStarted(true);
        setShowImportModal(false);
        setImportText('');
        return;
      }
      throw new Error();
    } catch (e) {
      setImportError("Format non reconnu. Assurez-vous d'avoir copié tout l'export.");
    }
  };

  const copyToClipboard = () => {
    const text = generateMarkdownStats();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatLastAction = (timestamp?: number) => {
    if (!timestamp) return null;
    const date = new Date(timestamp);
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const totalPoints = useMemo(() => players.reduce((acc, p) => acc + p.stats.points, 0), [players]);
  const selectedPlayer = useMemo(() => players.find(p => p.id === selectedPlayerId), [players, selectedPlayerId]);

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  if (!hasStarted) {
    return (
      <div className="relative h-screen bg-slate-900 overflow-hidden animate-in fade-in duration-700">
        <SetupScreen onStartGame={handleStartGame} />
        
        {/* Floating Import Trigger */}
        <div className="fixed bottom-32 left-1/2 -translate-x-1/2 z-20">
           <button 
             onClick={() => setShowImportModal(true)}
             className="flex items-center gap-3 text-slate-300 hover:text-white transition-all text-xs font-black uppercase tracking-widest bg-slate-800/90 backdrop-blur-xl px-10 py-4 rounded-full border border-white/10 shadow-2xl active:scale-95"
           >
             <Upload size={18} className="text-orange-500" />
             Restaurer un match
           </button>
        </div>

        {showImportModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4">
            <div className="glass-panel w-full max-w-lg rounded-3xl p-6 shadow-2xl border-orange-500/20">
               <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Importation Match</h3>
                  <button onClick={() => setShowImportModal(false)} className="text-slate-500 hover:text-white"><X size={28} /></button>
               </div>
               <textarea
                 autoFocus
                 className="w-full h-48 bg-slate-950/80 border border-white/10 rounded-2xl p-4 font-mono text-[10px] text-slate-400 focus:outline-none focus:ring-1 focus:ring-orange-500 mb-4 transition-all"
                 placeholder="Collez ici le texte d'exportation (incluant les données cachées)..."
                 value={importText}
                 onChange={(e) => setImportText(e.target.value)}
               />
               {importError && <p className="text-red-400 text-[10px] font-bold mb-4 bg-red-400/10 p-3 rounded-xl flex items-center gap-2">⚠️ {importError}</p>}
               <button onClick={handleImport} className="w-full py-5 rounded-2xl bg-orange-600 hover:bg-orange-500 text-white font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-orange-900/20 active:scale-95">Lancer la récupération</button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white relative pb-28 animate-in fade-in duration-500">
      <header className="glass-panel sticky top-0 z-30 px-4 py-2 flex items-center justify-between shadow-xl border-b border-white/5">
        <div className="flex items-center gap-3">
           <div className="flex flex-col items-center">
             <div className="text-[8px] text-slate-500 font-black uppercase">{matchInfo.teamName || 'Equipe'}</div>
             <div className="text-3xl font-black text-white font-mono leading-none">{totalPoints}</div>
           </div>
           <div className="flex flex-col items-center px-3 border-x border-white/10">
              <div className="text-[8px] text-orange-500 font-black uppercase mb-0.5">QT</div>
              <button 
                onClick={() => setQuarter(q => q >= 4 ? 1 : q + 1)}
                className="bg-slate-800 text-white font-black px-3 py-1 rounded-lg text-xs border border-white/10 active:scale-90"
              >
                {quarter}
              </button>
           </div>
           <div className="flex flex-col items-center">
              <div className="text-[8px] text-red-500/80 font-black uppercase">{matchInfo.opponent || 'Eux'}</div>
              <div className="flex items-center gap-1.5">
                <div className="text-3xl font-black text-slate-400 font-mono leading-none">{opponentScore}</div>
                <div className="flex flex-col">
                  <button onClick={() => setOpponentScore(s => s + 1)} className="p-0.5"><ChevronRight size={12} /></button>
                  <button onClick={() => setOpponentScore(s => Math.max(0, s - 1))} className="p-0.5 text-slate-600"><ChevronLeft size={12} /></button>
                </div>
              </div>
           </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowFullStatsTable(true)}
            className="bg-slate-800 p-2.5 rounded-xl text-orange-500 border border-white/10 shadow-lg active:scale-90"
          >
            <Search size={20} />
          </button>
          <button 
            onClick={() => setShowExportModal(true)}
            className="bg-slate-800 p-2.5 rounded-xl text-slate-400 border border-white/10 shadow-lg active:scale-90"
          >
            <Download size={20} />
          </button>
        </div>
      </header>

      {/* Mini Info Bar */}
      <div className="px-4 py-1.5 bg-slate-950/40 border-b border-white/5 flex items-center justify-between text-[8px] font-black uppercase tracking-[0.2em] text-slate-500">
         <div className="flex items-center gap-3">
           <span className="flex items-center gap-1"><MapPin size={8} /> {matchInfo.location || 'EXTÉRIEUR'}</span>
           <span className="flex items-center gap-1 text-orange-500/80"><Trophy size={8} /> {matchInfo.championship || 'AMICAL'}</span>
         </div>
         <span className="flex items-center gap-1"><Calendar size={8} /> {matchInfo.date}</span>
      </div>

      <main className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {players.map((player) => (
          <div 
            key={player.id}
            onClick={() => setSelectedPlayerId(player.id)}
            className={`relative transition-all duration-300 ${lastUpdatedPlayerId === player.id ? 'scale-[1.03] z-10' : ''}`}
          >
            <div className={`glass-panel rounded-2xl p-4 flex flex-col transition-all border-2 ${lastUpdatedPlayerId === player.id ? 'border-orange-500 bg-orange-500/10 shadow-[0_0_20px_rgba(249,115,22,0.4)]' : 'border-white/5 shadow-xl'}`}>
               <div className="flex items-center justify-between mb-3">
                 <div className="flex items-center gap-3">
                   <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${lastUpdatedPlayerId === player.id ? 'bg-orange-600 border-white' : 'bg-slate-800 border-white/10'}`}>
                      <span className={`text-sm font-black italic uppercase ${lastUpdatedPlayerId === player.id ? 'text-white' : 'text-slate-400'}`}>{player.name.charAt(0)}</span>
                   </div>
                   <div className="min-w-0">
                      <h3 className="font-black text-sm text-white truncate uppercase italic leading-none">{player.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[8px] text-slate-500 font-bold"># {player.number}</span>
                        {player.lastUpdated && (
                          <span className="text-[7px] text-slate-600 font-medium italic truncate">
                             • {formatLastAction(player.lastUpdated)}
                          </span>
                        )}
                      </div>
                   </div>
                 </div>
                 {updateFeedback?.id === player.id && (
                   <div className="absolute top-2 right-2 animate-bounce-up text-[10px] font-black text-orange-400 bg-orange-950/80 px-2 py-1 rounded-full border border-orange-500/50 z-20 pointer-events-none">
                     {updateFeedback.value > 0 ? '+' : ''}{updateFeedback.value} {updateFeedback.type.split('_')[1]}
                   </div>
                 )}
               </div>

               <div className="grid grid-cols-3 gap-1.5">
                 <div className={`bg-slate-950/40 rounded-xl py-2 flex flex-col items-center transition-all ${lastUpdatedPlayerId === player.id && updateFeedback?.type.includes('PT') ? 'bg-orange-900/40 ring-1 ring-orange-500/50' : ''}`}>
                   <div className="text-[6px] text-orange-500 font-black mb-0.5 uppercase">Points</div>
                   <div className={`text-lg font-black font-mono transition-transform duration-300 ${lastUpdatedPlayerId === player.id && updateFeedback?.type.includes('PT') ? 'scale-125 text-white' : 'text-orange-400'}`}>{player.stats.points}</div>
                 </div>
                 <div className={`bg-slate-950/40 rounded-xl py-2 flex flex-col items-center transition-all ${lastUpdatedPlayerId === player.id && updateFeedback?.type === 'ADD_REB' ? 'bg-blue-900/40 ring-1 ring-blue-500/50' : ''}`}>
                   <div className="text-[6px] text-blue-500 font-black mb-0.5 uppercase">Rebond</div>
                   <div className={`text-lg font-black font-mono transition-transform duration-300 ${lastUpdatedPlayerId === player.id && updateFeedback?.type === 'ADD_REB' ? 'scale-125 text-white' : 'text-blue-400'}`}>{player.stats.rebounds}</div>
                 </div>
                 <div className={`bg-slate-950/40 rounded-xl py-2 flex flex-col items-center transition-all ${lastUpdatedPlayerId === player.id && updateFeedback?.type === 'ADD_AST' ? 'bg-purple-900/40 ring-1 ring-purple-500/50' : ''}`}>
                   <div className="text-[6px] text-purple-500 font-black mb-0.5 uppercase">Assists</div>
                   <div className={`text-lg font-black font-mono transition-transform duration-300 ${lastUpdatedPlayerId === player.id && updateFeedback?.type === 'ADD_AST' ? 'scale-125 text-white' : 'text-purple-400'}`}>{player.stats.assists}</div>
                 </div>
               </div>
            </div>
          </div>
        ))}

        <div onClick={() => setShowAddPlayerModal(true)} className="border-2 border-dashed border-slate-700/50 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer min-h-[100px] hover:bg-slate-800/20 active:scale-95 transition-all">
          <Plus size={20} className="text-slate-500 mb-1" />
          <span className="text-[8px] font-black text-slate-500 uppercase italic">Ajouter Joueur</span>
        </div>
      </main>

      <div className="fixed bottom-6 left-6 z-40 flex items-center gap-3">
         <button 
           onClick={resetMatchStatsOnly} 
           title="Réinitialiser Stats Match (Garder Roster)"
           className="bg-slate-800/80 backdrop-blur hover:bg-orange-900/40 text-slate-500 hover:text-orange-400 p-4 rounded-full shadow-lg border border-white/5 active:scale-90"
         >
           <RefreshCw size={20} />
         </button>
         <button 
           onClick={fullReset} 
           title="Réinitialisation Totale"
           className="bg-slate-800/80 backdrop-blur hover:bg-red-900/40 text-slate-500 hover:text-red-400 p-4 rounded-full shadow-lg border border-white/5 active:scale-90"
         >
           <Settings size={20} />
         </button>
      </div>

      <CircularMenu 
        isOpen={!!selectedPlayerId} 
        playerName={selectedPlayer?.name || ''}
        playerStats={selectedPlayer?.stats}
        onClose={() => setSelectedPlayerId(null)}
        onAction={handleAction}
        lastActionFeedback={updateFeedback}
      />

      {showFullStatsTable && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/95 backdrop-blur-sm p-0 sm:p-4">
          <div className="bg-white text-slate-900 w-full sm:max-w-4xl sm:rounded-2xl shadow-2xl flex flex-col h-full sm:h-auto sm:max-h-[95vh] overflow-hidden">
            <div className="bg-slate-900 text-white p-4 flex justify-between items-center flex-shrink-0">
               <div className="flex items-center gap-2">
                 <div className="bg-orange-600 p-1.5 rounded-lg"><Trophy size={18} /></div>
                 <div className="min-w-0">
                    <h2 className="text-base font-black uppercase italic leading-none truncate">
                      {matchInfo.teamName || 'NOUS'} VS {matchInfo.opponent || 'EUX'}
                    </h2>
                    <div className="flex gap-2 text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                       <span>Score: {totalPoints}-{opponentScore}</span>
                       <span className="text-orange-500">QT {quarter}</span>
                    </div>
                 </div>
               </div>
               <button onClick={() => setShowFullStatsTable(false)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 text-white"><X size={20} /></button>
            </div>
            
            <div className="flex-1 overflow-auto bg-white">
               <table className="w-full text-left border-collapse min-w-0">
                 <thead className="sticky top-0 bg-slate-50 z-10 shadow-sm">
                   <tr className="border-b border-slate-900/10">
                     <th className="py-3 px-3 font-black text-[9px] uppercase text-slate-500 tracking-wider sticky left-0 bg-slate-50">Joueur</th>
                     <th className="px-1 py-3 font-black text-[9px] uppercase text-orange-600 text-center">Pts</th>
                     <th className="px-1 py-3 font-black text-[9px] uppercase text-blue-600 text-center">Reb</th>
                     <th className="px-1 py-3 font-black text-[9px] uppercase text-purple-600 text-center">Ast</th>
                     <th className="px-1 py-3 font-black text-[9px] uppercase text-red-600 text-center">Int</th>
                     <th className="px-1 py-3 font-black text-[9px] uppercase text-indigo-600 text-center">Ctr</th>
                     <th className="px-1 py-3 font-black text-[9px] uppercase text-emerald-600 text-center">LF</th>
                     <th className="px-1 py-3 font-black text-[9px] uppercase text-slate-400 text-center">Min</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                   {players.map(p => (
                     <tr key={p.id} className="active:bg-slate-50 transition-colors">
                       <td className="py-3 px-3 sticky left-0 bg-white shadow-[1px_0_4px_rgba(0,0,0,0.03)]">
                          <div className="font-black text-xs text-slate-900 uppercase italic truncate max-w-[80px]">{p.name}</div>
                          <div className="text-[7px] text-slate-400 font-bold">#{p.number}</div>
                       </td>
                       <td className="px-1 py-3 font-mono font-black text-lg text-orange-600 text-center">{p.stats.points}</td>
                       <td className="px-1 py-3 font-mono font-bold text-lg text-blue-600 text-center">{p.stats.rebounds}</td>
                       <td className="px-1 py-3 font-mono font-bold text-lg text-purple-600 text-center">{p.stats.assists}</td>
                       <td className="px-1 py-3 font-mono text-xs text-slate-500 text-center">{p.stats.steals}</td>
                       <td className="px-1 py-3 font-mono text-xs text-slate-500 text-center">{p.stats.blocks}</td>
                       <td className="px-1 py-3 font-mono text-xs text-slate-500 text-center">{p.stats.freeThrowsMade}</td>
                       <td className="px-1 py-3 font-mono text-xs text-slate-400 text-center">{p.stats.minutesPlayed}m</td>
                     </tr>
                   ))}
                 </tbody>
                 <tfoot className="sticky bottom-0 bg-slate-900 text-white shadow-[0_-2px_10px_rgba(0,0,0,0.1)]">
                   <tr>
                      <td className="py-3 px-3 font-black text-[10px] uppercase italic sticky left-0 bg-slate-900">Total</td>
                      <td className="px-1 py-3 font-mono font-black text-xl text-center text-orange-400">{totalPoints}</td>
                      <td className="px-1 py-3 font-mono font-black text-xl text-center text-blue-400">{players.reduce((a,b) => a + b.stats.rebounds, 0)}</td>
                      <td className="px-1 py-3 font-mono font-black text-xl text-center text-purple-400">{players.reduce((a,b) => a + b.stats.assists, 0)}</td>
                      <td colSpan={4} className="text-right pr-4 font-black text-[8px] tracking-widest opacity-40 uppercase">{matchInfo.teamName || 'BASKETTRACKER'}</td>
                   </tr>
                 </tfoot>
               </table>
            </div>

            <div className="p-4 flex gap-2 flex-shrink-0 bg-slate-50">
               <button onClick={copyToClipboard} className={`flex-1 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${copied ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-white active:scale-95 shadow-lg'}`}>
                 {copied ? <Check size={16} /> : <Copy size={16} />}
                 {copied ? 'Copié !' : 'Partager WhatsApp'}
               </button>
               <button onClick={() => setShowFullStatsTable(false)} className="flex-1 bg-slate-200 text-slate-700 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest active:scale-95">Fermer</button>
            </div>
          </div>
        </div>
      )}

      {showAddPlayerModal && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
          <div className="glass-panel w-full max-sm rounded-2xl p-6 border-orange-500/10" onClick={e => e.stopPropagation()}>
             <h3 className="text-lg font-black text-white uppercase italic mb-6 tracking-tighter">Nouveau Joueur</h3>
             <div className="space-y-4 mb-6">
                <input autoFocus type="text" placeholder="Nom" className="w-full bg-slate-800 border border-slate-700 rounded-xl py-4 px-4 font-bold text-white focus:ring-2 focus:ring-orange-500 transition-all outline-none" value={newPlayerName} onChange={(e) => setNewPlayerName(e.target.value)} />
                <input type="text" placeholder="Numéro #" className="w-full bg-slate-800 border border-slate-700 rounded-xl py-4 px-4 font-bold text-white transition-all outline-none" value={newPlayerNumber} onChange={(e) => setNewPlayerNumber(e.target.value)} />
             </div>
             <div className="flex gap-2">
               <button onClick={handleAddPlayerDuringGame} className="flex-1 bg-orange-600 text-white py-4 rounded-xl font-black uppercase text-xs tracking-widest active:scale-95 transition-all">Ajouter</button>
               <button onClick={() => setShowAddPlayerModal(false)} className="flex-1 bg-slate-700 text-slate-300 py-4 rounded-xl font-black uppercase text-xs tracking-widest active:scale-95 transition-all">Annuler</button>
             </div>
          </div>
        </div>
      )}

      {showExportModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/95 backdrop-blur-md p-4" onClick={() => setShowExportModal(false)}>
          <div className="glass-panel w-full max-w-lg rounded-3xl p-6 flex flex-col max-h-[85vh] border-orange-500/10 shadow-2xl" onClick={e => e.stopPropagation()}>
             <h3 className="text-lg font-black text-white uppercase italic mb-4 tracking-tighter">Exporter Match</h3>
             <div className="flex-1 overflow-auto bg-slate-950/80 rounded-2xl p-4 font-mono text-[9px] text-slate-500 whitespace-pre-wrap select-all border border-white/5 leading-relaxed">
                {generateMarkdownStats()}
             </div>
             <p className="text-[8px] text-slate-500 mt-3 font-bold uppercase tracking-widest text-center">Collez ce texte sur WhatsApp pour partager le résumé</p>
             <button onClick={copyToClipboard} className={`w-full mt-4 py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all shadow-xl active:scale-95 ${copied ? 'bg-emerald-600 text-white' : 'bg-orange-600 text-white shadow-orange-900/20'}`}>
                {copied ? 'Copié dans le presse-papier !' : 'Copier pour Partage'}
             </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes bounce-up {
          0% { transform: translateY(0) scale(0.5); opacity: 0; }
          30% { transform: translateY(-15px) scale(1.2); opacity: 1; }
          100% { transform: translateY(-40px) scale(1); opacity: 0; }
        }
        .animate-bounce-up {
          animation: bounce-up 0.8s cubic-bezier(0.17, 0.67, 0.83, 0.67) forwards;
        }
        .custom-scroll::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.1);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default App;