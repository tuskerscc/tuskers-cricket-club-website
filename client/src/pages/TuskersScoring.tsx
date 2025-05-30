import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';

interface Player {
  id: number;
  name: string;
  position: string;
  battingStyle?: string;
  bowlingStyle?: string;
}

interface Team {
  id: number;
  name: string;
  shortName: string;
  homeGround?: string;
}

interface Batsman {
  name: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  isOut: boolean;
  dismissalType?: 'bowled' | 'caught' | 'lbw' | 'stumped' | 'run_out' | 'hit_wicket' | 'retired_out';
  fielder?: string;
  bowler?: string;
}

interface Bowler {
  name: string;
  overs: number;
  maidens: number;
  runs: number;
  wickets: number;
}

interface MatchState {
  team1: string;
  team2: string;
  battingTeam: 1 | 2;
  innings: 1 | 2;
  totalRuns: number;
  wickets: number;
  overs: number;
  balls: number;
  batsmen: [Batsman, Batsman];
  currentBowler: Bowler;
  bowlers: Bowler[];
  recentOvers: string[];
  dismissedBatsmen: Batsman[];
  showDismissalModal: boolean;
  showBowlerSelection: boolean;
  showInningsDeclaration: boolean;
  inningsBreakTimer: number;
  availablePlayers: string[];
  target?: number;
  format: 'T20' | 'ODI' | 'Test';
  maxOvers: number;
  striker: 0 | 1;
  venue: string;
  matchDate: string;
  selectedPlayers: Player[];
  tossWinner: string;
  tossChoice: 'bat' | 'bowl';
  isComplete?: boolean;
  showBatsmanModal?: boolean;
}

interface LoginForm {
  username: string;
  password: string;
}

export default function TuskersScoring() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [matchState, setMatchState] = useState<MatchState | null>(null);
  const [showSetup, setShowSetup] = useState(true);
  const [loginForm, setLoginForm] = useState<LoginForm>({ username: '', password: '' });
  const [selectedFormat, setSelectedFormat] = useState<'T20' | 'ODI' | 'Test'>('T20');
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [oppositionName, setOppositionName] = useState('');
  const [venue, setVenue] = useState('');
  const [matchDate, setMatchDate] = useState(new Date().toISOString().split('T')[0]);
  const [tossWinner, setTossWinner] = useState<'tuskers' | 'opposition' | ''>('');
  const [tossChoice, setTossChoice] = useState<'bat' | 'bowl' | ''>('');
  const [selectedTuskersPlayers, setSelectedTuskersPlayers] = useState<number[]>([]);
  const [oppositionPlayers, setOppositionPlayers] = useState<string[]>(['', '', '', '', '', '', '', '', '', '', '', '', '', '', '']);
  const [tuskersRoles, setTuskersRoles] = useState<{[key: number]: 'captain' | 'wicket_keeper' | 'reserve' | 'playing'}>({});
  const [oppositionRoles, setOppositionRoles] = useState<{[key: number]: 'captain' | 'wicket_keeper' | 'reserve' | 'playing'}>({});
  const [dismissalData, setDismissalData] = useState({ type: '', fielder: '', bowler: '' });
  const [newBatsmanName, setNewBatsmanName] = useState('');
  const [newBowlerName, setNewBowlerName] = useState('');
  const [inningsBreakDuration, setInningsBreakDuration] = useState(3);

  const { toast } = useToast();

  const { data: teams = [] } = useQuery<Team[]>({
    queryKey: ['/api/teams'],
    enabled: isAuthenticated
  });

  const { data: players = [] } = useQuery<Player[]>({
    queryKey: ['/api/players'],
    enabled: isAuthenticated
  });

  // Check authentication on mount
  useEffect(() => {
    const auth = sessionStorage.getItem('tuskersScoring');
    if (auth === 'authenticated') {
      setIsAuthenticated(true);
    }
  }, []);

  // Auto-select Tuskers CC team when teams are loaded
  useEffect(() => {
    if (teams.length > 0 && !selectedTeam) {
      const tuskersTeam = teams.find(team => 
        team.name.toLowerCase().includes('tuskers') || 
        team.shortName.toLowerCase().includes('tuskers') ||
        team.name.toLowerCase().includes('tuskers cc')
      );
      if (tuskersTeam) {
        setSelectedTeam(tuskersTeam);
      }
    }
  }, [teams, selectedTeam]);

  // Innings break timer effect
  useEffect(() => {
    if (matchState && matchState.inningsBreakTimer > 0) {
      const timer = setTimeout(() => {
        setMatchState(prev => prev ? { ...prev, inningsBreakTimer: prev.inningsBreakTimer - 1 } : null);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (matchState && matchState.inningsBreakTimer === 0 && matchState.showInningsDeclaration) {
      setMatchState(prev => prev ? { ...prev, showInningsDeclaration: false, showBatsmanModal: true } : null);
    }
  }, [matchState?.inningsBreakTimer]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginForm.username === 'tuskers' && loginForm.password === 'tuskers2024') {
      setIsAuthenticated(true);
      sessionStorage.setItem('tuskersScoring', 'authenticated');
      toast({ title: "Success", description: "Login successful!" });
    } else {
      toast({ title: "Error", description: "Invalid credentials" });
    }
  };

  const getMaxOvers = (format: string) => {
    switch(format) {
      case 'T20': return 20;
      case 'ODI': return 50;
      case 'Test': return 90;
      default: return 20;
    }
  };

  const getBowlerMaxOvers = (format: string) => {
    switch(format) {
      case 'T20': return 4;
      case 'ODI': return 10;
      case 'Test': return 999;
      default: return 4;
    }
  };

  const canBowlerBowl = (bowlerName: string, format: string) => {
    if (!matchState) return true;
    
    const maxOvers = getBowlerMaxOvers(format);
    const bowler = matchState.bowlers.find(b => b.name === bowlerName);
    const currentBowlerOvers = bowler ? bowler.overs : 0;
    
    return currentBowlerOvers < maxOvers;
  };

  const getRequiredReserveCount = (totalPlayers: number) => {
    if (totalPlayers === 15) return 4;
    if (totalPlayers === 14) return 3;
    if (totalPlayers === 13) return 2;
    if (totalPlayers === 12) return 1;
    return 0; // For 9-11 players, no reserves required
  };

  const startMatchWithPlayers = () => {
    if (selectedTuskersPlayers.length < 9 || selectedTuskersPlayers.length > 15) {
      toast({ title: "Error", description: "Please select between 9-15 Tuskers players" });
      return;
    }

    const oppositionPlayerCount = oppositionPlayers.filter(name => name.trim() !== '').length;
    if (oppositionPlayerCount < 9 || oppositionPlayerCount > 15) {
      toast({ title: "Error", description: "Please enter between 9-15 opposition player names" });
      return;
    }

    // Validate role assignments for Tuskers
    const tuskersRoleValues = Object.values(tuskersRoles);
    const captainCount = tuskersRoleValues.filter(role => role === 'captain').length;
    const wicketKeeperCount = tuskersRoleValues.filter(role => role === 'wicket_keeper').length;
    const reserveCount = tuskersRoleValues.filter(role => role === 'reserve').length;
    const playingCount = tuskersRoleValues.filter(role => role === 'playing').length;
    const requiredReserves = getRequiredReserveCount(selectedTuskersPlayers.length);
    const requiredPlaying = selectedTuskersPlayers.length - requiredReserves - 2; // -2 for captain and keeper

    if (captainCount !== 1) {
      toast({ title: "Error", description: "Please select exactly 1 captain" });
      return;
    }
    if (wicketKeeperCount !== 1) {
      toast({ title: "Error", description: "Please select exactly 1 wicket keeper" });
      return;
    }
    if (reserveCount !== requiredReserves) {
      toast({ title: "Error", description: `Please select exactly ${requiredReserves} reserve players for ${selectedTuskersPlayers.length} total players` });
      return;
    }
    if (playingCount !== requiredPlaying) {
      toast({ title: "Error", description: `Please select exactly ${requiredPlaying} playing members (excluding captain and wicket keeper)` });
      return;
    }

    const maxOvers = getMaxOvers(selectedFormat);
    
    const tuskersName = selectedTeam!.name;
    const shouldTuskersBatFirst = (tossWinner === 'tuskers' && tossChoice === 'bat') || 
                                  (tossWinner === 'opposition' && tossChoice === 'bowl');
    
    setMatchState({
      team1: shouldTuskersBatFirst ? tuskersName : oppositionName,
      team2: shouldTuskersBatFirst ? oppositionName : tuskersName,
      battingTeam: 1,
      innings: 1,
      totalRuns: 0,
      wickets: 0,
      overs: 0,
      balls: 0,
      batsmen: [
        { name: 'Select Batsman', runs: 0, balls: 0, fours: 0, sixes: 0, isOut: false },
        { name: 'Select Batsman', runs: 0, balls: 0, fours: 0, sixes: 0, isOut: false }
      ],
      currentBowler: { name: 'Select Bowler', overs: 0, maidens: 0, runs: 0, wickets: 0 },
      bowlers: [],
      recentOvers: [],
      format: selectedFormat,
      maxOvers: maxOvers,
      striker: 0,
      venue: venue,
      matchDate: matchDate,
      selectedPlayers: players.filter(player => selectedTuskersPlayers.includes(player.id)),
      tossWinner: tossWinner === 'tuskers' ? tuskersName : oppositionName,
      tossChoice: tossChoice as 'bat' | 'bowl',
      isComplete: false,
      dismissedBatsmen: [],
      showBatsmanModal: false,
      showDismissalModal: false,
      showBowlerSelection: false,
      showInningsDeclaration: false,
      inningsBreakTimer: 0,
      availablePlayers: shouldTuskersBatFirst ? oppositionPlayers.filter(name => name.trim() !== '') : players.filter(player => selectedTuskersPlayers.includes(player.id)).map(p => p.name)
    });
    setShowSetup(false);
  };

  const handleDismissal = (type: string) => {
    if (!matchState) return;
    
    setDismissalData({ type, fielder: '', bowler: matchState.currentBowler.name });
    setMatchState(prev => prev ? { ...prev, showDismissalModal: true } : null);
  };

  const confirmDismissal = () => {
    if (!matchState) return;

    const newState = { ...matchState };
    const strikerIndex = newState.striker;
    
    newState.batsmen[strikerIndex] = {
      ...newState.batsmen[strikerIndex],
      isOut: true,
      dismissalType: dismissalData.type as any,
      fielder: dismissalData.fielder || undefined,
      bowler: dismissalData.bowler || undefined
    };

    if (dismissalData.type !== 'run_out') {
      const bowlerIndex = newState.bowlers.findIndex(b => b.name === newState.currentBowler.name);
      if (bowlerIndex !== -1) {
        newState.bowlers[bowlerIndex].wickets += 1;
      }
      newState.currentBowler.wickets += 1;
    }

    newState.wickets += 1;
    newState.showDismissalModal = false;
    newState.showBatsmanModal = true;

    setMatchState(newState);
    setDismissalData({ type: '', fielder: '', bowler: '' });
  };

  const addNewBatsmanToMatch = () => {
    if (!matchState || !newBatsmanName.trim()) return;

    const newState = { ...matchState };
    const dismissedBatsmanIndex = newState.striker;
    const dismissedBatsman = newState.batsmen[dismissedBatsmanIndex];
    
    newState.dismissedBatsmen.push(dismissedBatsman);
    
    newState.batsmen[dismissedBatsmanIndex] = {
      name: newBatsmanName,
      runs: 0,
      balls: 0,
      fours: 0,
      sixes: 0,
      isOut: false
    };
    
    newState.showBatsmanModal = false;
    
    setMatchState(newState);
    setNewBatsmanName('');
  };

  const changeBowler = () => {
    setMatchState(prev => prev ? { ...prev, showBowlerSelection: true } : null);
  };

  const confirmBowlerChange = () => {
    if (!matchState || !newBowlerName.trim()) return;

    if (!canBowlerBowl(newBowlerName, matchState.format)) {
      const maxOvers = getBowlerMaxOvers(matchState.format);
      toast({ 
        title: "Bowling Restriction", 
        description: `${newBowlerName} has already bowled the maximum ${maxOvers} overs allowed in ${matchState.format}` 
      });
      return;
    }

    const newState = { ...matchState };
    
    if (!newState.bowlers.find(b => b.name === newState.currentBowler.name)) {
      newState.bowlers.push({ ...newState.currentBowler });
    } else {
      const bowlerIndex = newState.bowlers.findIndex(b => b.name === newState.currentBowler.name);
      newState.bowlers[bowlerIndex] = { ...newState.currentBowler };
    }

    const existingBowler = newState.bowlers.find(b => b.name === newBowlerName);
    newState.currentBowler = existingBowler ? 
      { ...existingBowler } : 
      { name: newBowlerName, overs: 0, maidens: 0, runs: 0, wickets: 0 };

    newState.showBowlerSelection = false;
    
    setMatchState(newState);
    setNewBowlerName('');
  };

  const declareInnings = () => {
    if (!matchState) return;
    
    setMatchState(prev => prev ? { 
      ...prev, 
      showInningsDeclaration: true, 
      inningsBreakTimer: inningsBreakDuration * 60 
    } : null);
  };

  const startSecondInnings = () => {
    if (!matchState) return;

    const newState = { ...matchState };
    newState.target = newState.totalRuns + 1;
    newState.innings = 2;
    newState.battingTeam = newState.battingTeam === 1 ? 2 : 1;
    newState.totalRuns = 0;
    newState.wickets = 0;
    newState.overs = 0;
    newState.balls = 0;
    newState.batsmen = [
      { name: 'Select Batsman', runs: 0, balls: 0, fours: 0, sixes: 0, isOut: false },
      { name: 'Select Batsman', runs: 0, balls: 0, fours: 0, sixes: 0, isOut: false }
    ];
    newState.currentBowler = { name: 'Select Bowler', overs: 0, maidens: 0, runs: 0, wickets: 0 };
    newState.bowlers = [];
    newState.recentOvers = [];
    newState.dismissedBatsmen = [];
    newState.striker = 0;
    newState.showInningsDeclaration = false;
    newState.showBatsmanModal = true;
    
    newState.availablePlayers = newState.battingTeam === 1 ? 
      oppositionPlayers.filter(name => name.trim() !== '') : 
      players.filter(player => selectedTuskersPlayers.includes(player.id)).map(p => p.name);

    setMatchState(newState);
  };

  const addRuns = (runs: number) => {
    if (!matchState) return;

    const newState = { ...matchState };
    const strikerIndex = newState.striker;
    
    newState.batsmen[strikerIndex].runs += runs;
    newState.batsmen[strikerIndex].balls += 1;
    
    if (runs === 4) newState.batsmen[strikerIndex].fours += 1;
    if (runs === 6) newState.batsmen[strikerIndex].sixes += 1;
    
    newState.totalRuns += runs;
    newState.currentBowler.runs += runs;
    
    newState.balls += 1;
    if (newState.balls === 6) {
      newState.overs += 1;
      newState.balls = 0;
      newState.currentBowler.overs += 1;
      
      newState.striker = newState.striker === 0 ? 1 : 0;
      
      if (!canBowlerBowl(newState.currentBowler.name, newState.format)) {
        newState.showBowlerSelection = true;
      }
    }
    
    if (runs % 2 === 1) {
      newState.striker = newState.striker === 0 ? 1 : 0;
    }
    
    if (newState.overs >= newState.maxOvers || newState.wickets >= 10) {
      if (newState.innings === 1 && newState.format !== 'Test') {
        declareInnings();
        return;
      } else if (newState.innings === 2 || newState.format === 'Test') {
        newState.isComplete = true;
      }
    }
    
    if (newState.innings === 2 && newState.target && newState.totalRuns >= newState.target) {
      newState.isComplete = true;
    }
    
    setMatchState(newState);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-blue-900 mb-2">Tuskers CC</h1>
            <p className="text-gray-600">Official Scoring System</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
              <input
                type="text"
                value={loginForm.username}
                onChange={(e) => setLoginForm(prev => ({ ...prev, username: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter username"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter password"
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              Login to Scoring System
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (showSetup) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <h1 className="text-3xl font-bold text-blue-900 mb-6">Tuskers CC - Match Setup</h1>
            
            <div className="bg-blue-50 p-4 rounded-xl border-l-4 border-blue-400 mb-6">
              <h3 className="font-semibold text-blue-800 mb-4">Match Format</h3>
              <div className="grid grid-cols-3 gap-4">
                {(['T20', 'ODI', 'Test'] as const).map((format) => (
                  <button
                    key={format}
                    onClick={() => setSelectedFormat(format)}
                    className={`p-3 rounded-xl font-semibold transition-colors ${
                      selectedFormat === format
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-blue-600 border border-blue-200 hover:bg-blue-50'
                    }`}
                  >
                    {format}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-xl border-l-4 border-green-400 mb-6">
              <h3 className="font-semibold text-green-800 mb-4">Team Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Your Team</label>
                  <input
                    type="text"
                    value={selectedTeam?.name || 'Tuskers CC'}
                    disabled
                    className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-xl text-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Opposition Team</label>
                  <input
                    type="text"
                    value={oppositionName}
                    onChange={(e) => setOppositionName(e.target.value)}
                    placeholder="Enter opposition team name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Venue</label>
                  <input
                    type="text"
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                    placeholder="Enter match venue"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Match Date</label>
                  <input
                    type="date"
                    value={matchDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setMatchDate(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-xl border-l-4 border-yellow-400 mb-6">
              <h3 className="font-semibold text-yellow-800 mb-4">Toss Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Toss Winner</label>
                  <select
                    value={tossWinner}
                    onChange={(e) => setTossWinner(e.target.value as 'tuskers' | 'opposition' | '')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Toss Winner</option>
                    <option value="tuskers">{selectedTeam?.name || 'Your Team'}</option>
                    <option value="opposition">{oppositionName || 'Opposition Team'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Elected to</label>
                  <select
                    value={tossChoice}
                    onChange={(e) => setTossChoice(e.target.value as 'bat' | 'bowl' | '')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={!tossWinner}
                  >
                    <option value="">Select Choice</option>
                    <option value="bat">Bat First</option>
                    <option value="bowl">Bowl First</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 p-4 rounded-xl border-l-4 border-purple-400 mb-6">
              <h3 className="font-semibold text-purple-800 mb-4">Player Selection</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Tuskers CC Players */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Select Tuskers CC Players (9-15 players)</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    {selectedTuskersPlayers.length > 0 ? (
                      `${selectedTuskersPlayers.length - getRequiredReserveCount(selectedTuskersPlayers.length) - 2} playing + 1 captain + 1 keeper + ${getRequiredReserveCount(selectedTuskersPlayers.length)} reserves`
                    ) : (
                      "Select players to see role breakdown"
                    )}
                  </p>
                  
                  <div className="max-h-80 overflow-y-auto bg-gray-50 p-3 rounded-lg">
                    {players.map((player) => (
                      <div key={player.id} className="flex items-center justify-between p-2 hover:bg-white rounded mb-2">
                        <label className="flex items-center space-x-2 cursor-pointer flex-1">
                          <input
                            type="checkbox"
                            checked={selectedTuskersPlayers.includes(player.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                if (selectedTuskersPlayers.length < 15) {
                                  setSelectedTuskersPlayers(prev => [...prev, player.id]);
                                  setTuskersRoles(prev => ({ ...prev, [player.id]: 'playing' }));
                                }
                              } else {
                                setSelectedTuskersPlayers(prev => prev.filter(id => id !== player.id));
                                setTuskersRoles(prev => {
                                  const newRoles = { ...prev };
                                  delete newRoles[player.id];
                                  return newRoles;
                                });
                              }
                            }}
                            className="text-purple-600"
                          />
                          <span className="text-sm text-gray-700">{player.name}</span>
                        </label>
                        
                        {selectedTuskersPlayers.includes(player.id) && (
                          <select
                            value={tuskersRoles[player.id] || 'playing'}
                            onChange={(e) => setTuskersRoles(prev => ({ 
                              ...prev, 
                              [player.id]: e.target.value as 'captain' | 'wicket_keeper' | 'reserve' | 'playing'
                            }))}
                            className="text-xs border rounded px-2 py-1 ml-2"
                          >
                            <option value="playing">Playing</option>
                            <option value="captain">Captain</option>
                            <option value="wicket_keeper">Wicket Keeper</option>
                            <option value="reserve">Reserve</option>
                          </select>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-2 text-sm text-gray-600">
                    <p>Selected: {selectedTuskersPlayers.length}/15 (min: 9)</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                        Captain: {Object.values(tuskersRoles).filter(r => r === 'captain').length}
                      </span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                        Keeper: {Object.values(tuskersRoles).filter(r => r === 'wicket_keeper').length}
                      </span>
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">
                        Playing: {Object.values(tuskersRoles).filter(r => r === 'playing').length}
                      </span>
                      <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs">
                        Reserve: {Object.values(tuskersRoles).filter(r => r === 'reserve').length}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Opposition Players */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Opposition Players (9-15 players)</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    {oppositionPlayers.filter(p => p.trim()).length > 0 ? (
                      `${oppositionPlayers.filter(p => p.trim()).length - getRequiredReserveCount(oppositionPlayers.filter(p => p.trim()).length) - 2} playing + 1 captain + 1 keeper + ${getRequiredReserveCount(oppositionPlayers.filter(p => p.trim()).length)} reserves`
                    ) : (
                      "Enter player names to see role breakdown"
                    )}
                  </p>
                  
                  <div className="max-h-80 overflow-y-auto bg-gray-50 p-3 rounded-lg">
                    {oppositionPlayers.map((player, index) => (
                      <div key={index} className="flex items-center gap-2 mb-2">
                        <input
                          type="text"
                          value={player}
                          onChange={(e) => {
                            const newPlayers = [...oppositionPlayers];
                            newPlayers[index] = e.target.value;
                            setOppositionPlayers(newPlayers);
                          }}
                          placeholder={`Player ${index + 1} name`}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                        />
                        
                        {player.trim() && (
                          <select
                            value={oppositionRoles[index] || 'playing'}
                            onChange={(e) => setOppositionRoles(prev => ({ 
                              ...prev, 
                              [index]: e.target.value as 'captain' | 'wicket_keeper' | 'reserve' | 'playing'
                            }))}
                            className="text-xs border rounded px-2 py-1"
                          >
                            <option value="playing">Playing</option>
                            <option value="captain">Captain</option>
                            <option value="wicket_keeper">Wicket Keeper</option>
                            <option value="reserve">Reserve</option>
                          </select>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-2 text-sm text-gray-600">
                    <p>Entered: {oppositionPlayers.filter(p => p.trim()).length}/15 (min: 9)</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                        Captain: {Object.values(oppositionRoles).filter(r => r === 'captain').length}
                      </span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                        Keeper: {Object.values(oppositionRoles).filter(r => r === 'wicket_keeper').length}
                      </span>
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">
                        Playing: {Object.values(oppositionRoles).filter(r => r === 'playing').length}
                      </span>
                      <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs">
                        Reserve: {Object.values(oppositionRoles).filter(r => r === 'reserve').length}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={startMatchWithPlayers}
              disabled={
                !selectedTeam || 
                !oppositionName || 
                !venue || 
                !matchDate || 
                !tossWinner || 
                !tossChoice || 
                selectedTuskersPlayers.length < 9 || 
                selectedTuskersPlayers.length > 15 ||
                oppositionPlayers.filter(p => p.trim()).length < 9 ||
                oppositionPlayers.filter(p => p.trim()).length > 15
              }
              className="w-full bg-blue-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Start Match
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!matchState) return null;

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-blue-600 text-white p-4 rounded-t-2xl flex justify-between items-center">
          <button 
            onClick={() => setShowSetup(true)}
            className="flex items-center gap-2 text-white hover:bg-blue-700 px-3 py-2 rounded-lg transition-colors"
          >
            <span>← Back to Setup</span>
          </button>
          <h1 className="text-lg font-semibold">Tuskers CC Official Scoring</h1>
          <div className="flex gap-2">
            <button className="text-white hover:bg-blue-700 p-2 rounded">⚙</button>
          </div>
        </div>

        <div className="bg-white rounded-b-2xl shadow-lg">
          <div className="bg-gray-50 p-4 border-b">
            <div className="flex justify-between items-center">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {(matchState.battingTeam === 1 ? matchState.team1 : matchState.team2).substring(0, 2).toUpperCase()}
                  </div>
                  <span className="font-semibold">{matchState.battingTeam === 1 ? matchState.team1 : matchState.team2} batting</span>
                </div>
                {matchState.innings === 2 && matchState.target && (
                  <div className="text-sm space-y-1">
                    <div className="text-blue-600 font-semibold">
                      Target: {matchState.target}
                    </div>
                    <div className="text-orange-600 font-semibold">
                      Need: {Math.max(0, matchState.target - matchState.totalRuns)} runs in {((matchState.maxOvers - matchState.overs) * 6 - matchState.balls)} balls
                    </div>
                  </div>
                )}
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{matchState.totalRuns}/{matchState.wickets}</div>
                <div className="text-sm text-gray-600">Over {matchState.overs}.{matchState.balls} / {matchState.maxOvers}</div>
                <div className="text-xs text-blue-600 font-semibold">{matchState.format} Format • {matchState.venue}</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600">Official Scoring</div>
                <div className="text-xs text-green-600">CRR: {matchState.overs > 0 || matchState.balls > 0 ? (matchState.totalRuns / (matchState.overs + matchState.balls/6)).toFixed(2) : '0.00'}</div>
                <div className="text-xs text-gray-500">Innings {matchState.innings}</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4">
            <div className="lg:col-span-2 space-y-4">
              <div className="p-4 border-b bg-gray-50">
                <div className="text-sm text-gray-600 mb-2">{matchState.battingTeam === 1 ? matchState.team1 : matchState.team2} batting</div>
                
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-gray-500 grid grid-cols-7 gap-2">
                    <span className="col-span-2">BATTER</span>
                    <span className="text-center">R</span>
                    <span className="text-center">B</span>
                    <span className="text-center">4s</span>
                    <span className="text-center">6s</span>
                    <span className="text-center">SR</span>
                  </div>
                  
                  {matchState.batsmen.map((batsman, index) => (
                    <div key={index} className={`grid grid-cols-7 gap-2 py-2 border-b border-gray-200 ${index === matchState.striker ? 'bg-yellow-50' : ''}`}>
                      <div className="col-span-2 flex items-center gap-2">
                        <span className="font-medium">{batsman.name}</span>
                        {index === matchState.striker && <span className="text-xs bg-yellow-400 text-yellow-800 px-1 rounded">*</span>}
                      </div>
                      <div className="text-center">{batsman.runs}</div>
                      <div className="text-center">{batsman.balls}</div>
                      <div className="text-center">{batsman.fours}</div>
                      <div className="text-center">{batsman.sixes}</div>
                      <div className="text-center">{batsman.balls > 0 ? ((batsman.runs / batsman.balls) * 100).toFixed(1) : '0.0'}</div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={() => setMatchState(prev => prev ? { ...prev, showBatsmanModal: true } : null)}
                    className="text-blue-600 hover:text-blue-800 text-sm underline"
                  >
                    Change Batsman
                  </button>
                </div>
              </div>

              <div className="p-4 border-b bg-gray-50">
                <div className="text-sm text-gray-600 mb-2">Current Bowler</div>
                <div className="grid grid-cols-5 gap-2 text-xs font-semibold text-gray-500 mb-2">
                  <span>BOWLER</span>
                  <span className="text-center">O</span>
                  <span className="text-center">M</span>
                  <span className="text-center">R</span>
                  <span className="text-center">W</span>
                </div>
                <div className="grid grid-cols-5 gap-2 py-2">
                  <span className="font-medium">{matchState.currentBowler.name}</span>
                  <div className="text-center">{matchState.currentBowler.overs}.{matchState.balls}</div>
                  <div className="text-center">{matchState.currentBowler.maidens}</div>
                  <div className="text-center">{matchState.currentBowler.runs}</div>
                  <div className="text-center">{matchState.currentBowler.wickets}</div>
                </div>
                
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={changeBowler}
                    className="text-blue-600 hover:text-blue-800 text-sm underline"
                  >
                    Change Bowler
                  </button>
                  {matchState.format !== 'Test' && (
                    <span className="text-xs text-gray-500">
                      (Max: {getBowlerMaxOvers(matchState.format)} overs)
                    </span>
                  )}
                </div>
              </div>

              <div className="p-4 space-y-4">
                <div className="text-sm font-semibold text-gray-700 mb-2">Score Runs</div>
                <div className="grid grid-cols-4 gap-3">
                  {[0, 1, 2, 3, 4, 6].map(runs => (
                    <button
                      key={runs}
                      onClick={() => addRuns(runs)}
                      className={`p-4 rounded-xl font-bold text-lg transition-all ${
                        runs === 4 ? 'bg-green-500 text-white hover:bg-green-600' :
                        runs === 6 ? 'bg-blue-500 text-white hover:bg-blue-600' :
                        'bg-gray-200 text-gray-800 hover:bg-gray-300'
                      }`}
                    >
                      {runs}
                    </button>
                  ))}
                </div>
                
                <div className="space-y-3">
                  <button
                    onClick={() => handleDismissal('bowled')}
                    className="w-full p-4 bg-red-600 text-white rounded-xl font-bold text-lg hover:bg-red-700 transition-colors"
                  >
                    WICKET
                  </button>
                  
                  <div className="grid grid-cols-3 gap-2">
                    {['caught', 'lbw', 'stumped', 'run_out', 'hit_wicket', 'retired_out'].map((type) => (
                      <button
                        key={type}
                        onClick={() => handleDismissal(type)}
                        className="py-2 px-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-xs"
                      >
                        {type.replace('_', ' ').toUpperCase()}
                      </button>
                    ))}
                  </div>
                  
                  {(matchState.format === 'ODI' || matchState.format === 'Test') && matchState.innings === 1 && (
                    <div className="pt-4 border-t">
                      <div className="flex items-center gap-4">
                        <button
                          onClick={declareInnings}
                          className="bg-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-purple-700 transition-colors"
                        >
                          DECLARE INNINGS
                        </button>
                        <div className="flex items-center gap-2">
                          <label className="text-sm">Break Duration:</label>
                          <select
                            value={inningsBreakDuration}
                            onChange={(e) => setInningsBreakDuration(Number(e.target.value))}
                            className="border rounded px-2 py-1 text-sm"
                          >
                            <option value={1}>1 min</option>
                            <option value={3}>3 min</option>
                            <option value={5}>5 min</option>
                            <option value={10}>10 min</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Dismissed Batsmen</h3>
                <div className="space-y-2">
                  {matchState.dismissedBatsmen.map((batsman, index) => (
                    <div key={index} className="p-2 bg-red-50 rounded text-sm">
                      <div className="font-semibold">{batsman.name}</div>
                      <div className="text-gray-600">
                        {batsman.runs} ({batsman.balls})
                      </div>
                      <div className="text-red-600 text-xs">
                        {batsman.dismissalType?.replace('_', ' ')}
                        {batsman.bowler && ` b ${batsman.bowler}`}
                        {batsman.fielder && ` c ${batsman.fielder}`}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Bowlers</h3>
                <div className="space-y-2">
                  {matchState.bowlers.map((bowler, index) => (
                    <div key={index} className="p-2 bg-blue-50 rounded text-sm">
                      <div className="font-semibold">{bowler.name}</div>
                      <div className="text-gray-600">
                        {bowler.overs}-{bowler.maidens}-{bowler.runs}-{bowler.wickets}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {matchState.showDismissalModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">Dismissal Details</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Dismissal Type</label>
                  <input
                    type="text"
                    value={dismissalData.type.replace('_', ' ').toUpperCase()}
                    disabled
                    className="w-full p-2 border rounded bg-gray-100"
                  />
                </div>
                
                {(dismissalData.type === 'caught' || dismissalData.type === 'run_out') && (
                  <div>
                    <label className="block text-sm font-medium mb-1">Fielder</label>
                    <select
                      value={dismissalData.fielder}
                      onChange={(e) => setDismissalData(prev => ({ ...prev, fielder: e.target.value }))}
                      className="w-full p-2 border rounded"
                    >
                      <option value="">Select Fielder</option>
                      {matchState.availablePlayers.map((player, index) => (
                        <option key={index} value={player}>{player}</option>
                      ))}
                    </select>
                  </div>
                )}
                
                {dismissalData.type === 'stumped' && (
                  <div>
                    <label className="block text-sm font-medium mb-1">Wicket Keeper</label>
                    <input
                      type="text"
                      value={dismissalData.fielder}
                      onChange={(e) => setDismissalData(prev => ({ ...prev, fielder: e.target.value }))}
                      placeholder="Wicket keeper name"
                      className="w-full p-2 border rounded"
                    />
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium mb-1">Bowler</label>
                  <input
                    type="text"
                    value={dismissalData.bowler}
                    onChange={(e) => setDismissalData(prev => ({ ...prev, bowler: e.target.value }))}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={confirmDismissal}
                  className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
                >
                  Confirm
                </button>
                <button
                  onClick={() => setMatchState(prev => prev ? { ...prev, showDismissalModal: false } : null)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {matchState.showBatsmanModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">Select New Batsman</h3>
              
              <select
                value={newBatsmanName}
                onChange={(e) => setNewBatsmanName(e.target.value)}
                className="w-full p-3 border rounded-lg mb-4"
              >
                <option value="">Select Batsman</option>
                {matchState.availablePlayers.map((player, index) => (
                  <option key={index} value={player}>{player}</option>
                ))}
              </select>
              
              <div className="flex gap-3">
                <button
                  onClick={addNewBatsmanToMatch}
                  disabled={!newBatsmanName}
                  className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-300"
                >
                  Confirm
                </button>
                <button
                  onClick={() => setMatchState(prev => prev ? { ...prev, showBatsmanModal: false } : null)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {matchState.showBowlerSelection && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">Select New Bowler</h3>
              
              <select
                value={newBowlerName}
                onChange={(e) => setNewBowlerName(e.target.value)}
                className="w-full p-3 border rounded-lg mb-4"
              >
                <option value="">Select Bowler</option>
                {matchState.availablePlayers.filter(player => 
                  canBowlerBowl(player, matchState.format)
                ).map((player, index) => (
                  <option key={index} value={player}>{player}</option>
                ))}
              </select>
              
              <div className="flex gap-3">
                <button
                  onClick={confirmBowlerChange}
                  disabled={!newBowlerName}
                  className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-300"
                >
                  Confirm
                </button>
                <button
                  onClick={() => setMatchState(prev => prev ? { ...prev, showBowlerSelection: false } : null)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {matchState.showInningsDeclaration && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md text-center">
              <h3 className="text-xl font-semibold mb-4">Innings Break</h3>
              <div className="text-4xl font-bold text-blue-600 mb-4">
                {Math.floor(matchState.inningsBreakTimer / 60)}:{(matchState.inningsBreakTimer % 60).toString().padStart(2, '0')}
              </div>
              <p className="text-gray-600 mb-6">
                {matchState.innings === 1 ? 'First innings complete' : 'Match complete'}
              </p>
              {matchState.inningsBreakTimer === 0 && (
                <button
                  onClick={startSecondInnings}
                  className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600"
                >
                  Start Second Innings
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}