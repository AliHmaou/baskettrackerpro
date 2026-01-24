
import React, { useState } from 'react';
import { Plus, Play, Trash2, User, Info, MapPin, Calendar, Trophy, Users } from 'lucide-react';
import { Player, INITIAL_STATS, MatchInfo, INITIAL_MATCH_INFO } from '../types';

interface SetupScreenProps {
  onStartGame: (players: Player[], matchInfo: MatchInfo) => void;
}

export const SetupScreen: React.FC<SetupScreenProps> = ({ onStartGame }) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [matchInfo, setMatchInfo] = useState<MatchInfo>(INITIAL_MATCH_INFO);

  const addPlayer = () => {
    if (!newName.trim()) return;
    const newPlayer: Player = {
      id: Date.now().toString(),
      name: newName.trim(),
      number: newNumber.trim() || '0',
      stats: { ...INITIAL_STATS },
    };
    setPlayers([...players, newPlayer]);
    setNewName('');
    setNewNumber('');
  };

  const removePlayer = (id: string) => {
    setPlayers(players.filter(p => p.id !== id));
  };

  const updateMatchInfo = (key: keyof MatchInfo, value: string) => {
    setMatchInfo(prev => ({ ...prev, [key]: value }));
  };

  const handleQuickFill = () => {
    const demoPlayers = [
      { id: '1', name: 'Léo', number: '23', stats: { ...INITIAL_STATS } },
      { id: '2', name: 'Lucas', number: '8', stats: { ...INITIAL_STATS } },
      { id: '3', name: 'Gabriel', number: '30', stats: { ...INITIAL_STATS } },
      { id: '4', name: 'Arthur', number: '11', stats: { ...INITIAL_STATS } },
      { id: '5', name: 'Louis', number: '5', stats: { ...INITIAL_STATS } },
    ];
    setPlayers(prev => [...prev, ...demoPlayers]);
    setMatchInfo({
      teamName: 'Étoiles Sportives',
      championship: 'Championnat Régional U15',
      opponent: 'Dragons de Ville',
      date: new Date().toISOString().split('T')[0],
      time: '14:30',
      location: 'Gymnase Central',
    });
  }

  return (
    <div className="min-h-screen bg-slate-900 p-6 flex flex-col items-center justify-start text-white relative overflow-y-auto custom-scroll pb-40">
      {/* Background Accents */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-orange-600/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px]" />

      <div className="w-full max-w-md z-10 space-y-8 mt-4">
        <div className="text-center">
          <h1 className="text-4xl font-black tracking-tighter mb-2 bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent italic uppercase">
            BasketTracker <span className="text-white not-italic">Pro</span>
          </h1>
          <p className="text-slate-400 text-sm font-medium uppercase tracking-widest">Configuration du Match</p>
        </div>

        {/* Match Info Section */}
        <div className="glass-panel p-6 rounded-3xl space-y-4 border-white/5">
          <div className="flex items-center gap-2 mb-2 text-orange-500">
            <Info size={18} />
            <h2 className="text-xs font-black uppercase tracking-widest italic">Infos Match</h2>
          </div>
          
          <div className="grid grid-cols-1 gap-3">
             <div className="relative">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input
                type="text"
                placeholder="Votre Équipe"
                className="w-full bg-slate-800/50 border border-white/5 rounded-xl py-3 pl-10 pr-4 focus:ring-1 focus:ring-orange-500 text-sm outline-none"
                value={matchInfo.teamName}
                onChange={(e) => updateMatchInfo('teamName', e.target.value)}
              />
            </div>
            <div className="relative">
              <Trophy className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input
                type="text"
                placeholder="Championnat / Tournoi"
                className="w-full bg-slate-800/50 border border-white/5 rounded-xl py-3 pl-10 pr-4 focus:ring-1 focus:ring-orange-500 text-sm outline-none"
                value={matchInfo.championship}
                onChange={(e) => updateMatchInfo('championship', e.target.value)}
              />
            </div>
             <div className="relative">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input
                type="text"
                placeholder="Adversaire"
                className="w-full bg-slate-800/50 border border-red-500/20 rounded-xl py-3 pl-10 pr-4 focus:ring-1 focus:ring-red-500 text-sm outline-none"
                value={matchInfo.opponent}
                onChange={(e) => updateMatchInfo('opponent', e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
               <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input
                  type="date"
                  className="w-full bg-slate-800/50 border border-white/5 rounded-xl py-3 pl-10 pr-4 focus:ring-1 focus:ring-orange-500 text-xs outline-none"
                  value={matchInfo.date}
                  onChange={(e) => updateMatchInfo('date', e.target.value)}
                />
              </div>
               <div className="relative">
                <input
                  type="time"
                  className="w-full bg-slate-800/50 border border-white/5 rounded-xl py-3 px-4 focus:ring-1 focus:ring-orange-500 text-xs outline-none"
                  value={matchInfo.time}
                  onChange={(e) => updateMatchInfo('time', e.target.value)}
                />
              </div>
            </div>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input
                type="text"
                placeholder="Lieu / Gymnase"
                className="w-full bg-slate-800/50 border border-white/5 rounded-xl py-3 pl-10 pr-4 focus:ring-1 focus:ring-orange-500 text-sm outline-none"
                value={matchInfo.location}
                onChange={(e) => updateMatchInfo('location', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Roster Section */}
        <div className="glass-panel p-6 rounded-3xl border-white/5">
          <div className="flex items-center gap-2 mb-4 text-orange-500">
            <User size={18} />
            <h2 className="text-xs font-black uppercase tracking-widest italic">Effectif de l'Équipe</h2>
          </div>
          <div className="flex gap-2 mb-6">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Nom du joueur"
                className="w-full bg-slate-800/50 border border-white/5 rounded-xl py-3 px-4 focus:ring-1 focus:ring-orange-500 text-sm outline-none"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addPlayer()}
              />
            </div>
            <input
              type="text"
              placeholder="#"
              className="w-16 bg-slate-800/50 border border-white/5 rounded-xl py-3 px-2 text-center focus:ring-1 focus:ring-orange-500 text-sm font-mono outline-none"
              value={newNumber}
              onChange={(e) => setNewNumber(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addPlayer()}
            />
            <button
              onClick={addPlayer}
              className="bg-orange-600 hover:bg-orange-500 text-white p-3 rounded-xl transition-all flex items-center justify-center active:scale-90"
            >
              <Plus size={20} />
            </button>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto pr-1 custom-scroll">
            {players.length === 0 ? (
               <div className="text-center py-6 border border-dashed border-white/5 rounded-2xl">
                 <p className="text-slate-500 text-xs font-bold uppercase mb-2">Aucun joueur</p>
                 <button onClick={handleQuickFill} className="text-orange-500 text-[10px] font-black uppercase tracking-widest hover:underline">Charger Match Démo</button>
               </div>
            ) : (
              players.map((player) => (
                <div key={player.id} className="flex items-center justify-between bg-white/5 p-3 rounded-2xl border border-white/5 animate-in slide-in-from-left-2">
                  <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-xl bg-orange-600/20 text-orange-500 flex items-center justify-center text-xs font-black italic">
                       {player.name.charAt(0)}
                     </div>
                     <div>
                       <div className="font-black text-sm uppercase italic">{player.name}</div>
                       <div className="text-[10px] text-slate-500 font-bold">DOSSARD #{player.number}</div>
                     </div>
                  </div>
                  <button onClick={() => removePlayer(player.id)} className="text-slate-600 hover:text-red-500 transition-colors p-2">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <button
          onClick={() => players.length > 0 && onStartGame(players, matchInfo)}
          disabled={players.length === 0}
          className={`w-full py-5 rounded-2xl font-black text-sm uppercase tracking-[0.3em] italic flex items-center justify-center gap-3 transition-all active:scale-95 shadow-2xl
            ${players.length > 0 
              ? 'bg-white text-slate-900 shadow-orange-500/10' 
              : 'bg-slate-800 text-slate-600 cursor-not-allowed'}
          `}
        >
          <Play size={20} fill="currentColor" />
          Commencer le Match
        </button>
      </div>
    </div>
  );
};
