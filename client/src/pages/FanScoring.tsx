import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface Batsman {
  name: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  isOut: boolean;
  dismissalType?: string;
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
  dismissedBatsmen: Batsman[];
  recentOvers: string[];
  currentOver: string[];
  target?: number;
  format: '5-over' | 'T10' | 'T20' | 'ODI';
  maxOvers: number;
  striker: 0 | 1;
  showDismissalModal: boolean;
  showBowlerModal: boolean;
  showBatsmanModal: boolean;
  playersPerTeam: number;
  maxWickets: number;
}

export default function FanScoring() {
  const [matchState, setMatchState] = useState<MatchState | null>(null);
  const [showSetup, setShowSetup] = useState(true);
  const [showPlayerSetup, setShowPlayerSetup] = useState(false);
  const [team1Name, setTeam1Name] = useState('');
  const [team2Name, setTeam2Name] = useState('');
  const [selectedFormat, setSelectedFormat] = useState<'5-over' | 'T10' | 'T20' | 'ODI'>('T20');
  const [playersPerTeam, setPlayersPerTeam] = useState(11);
  const [batsman1Name, setBatsman1Name] = useState('');
  const [batsman2Name, setBatsman2Name] = useState('');
  const [bowlerName, setBowlerName] = useState('');
  const [dismissalType, setDismissalType] = useState('');
  const [fielderName, setFielderName] = useState('');
  const [newBatsmanName, setNewBatsmanName] = useState('');
  const [newBowlerName, setNewBowlerName] = useState('');
  const { toast } = useToast();

  const getMaxOvers = (format: '5-over' | 'T10' | 'T20' | 'ODI') => {
    switch (format) {
      case '5-over': return 5;
      case 'T10': return 10;
      case 'T20': return 20;
      case 'ODI': return 50;
      default: return 20;
    }
  };

  const initializeMatch = () => {
    if (!team1Name || !team2Name) {
      toast({ title: "Error", description: "Please enter both team names" });
      return;
    }
    setShowPlayerSetup(true);
    setShowSetup(false);
  };

  const startMatch = () => {
    if (!batsman1Name || !batsman2Name || !bowlerName) {
      toast({ title: "Error", description: "Please enter batsman and bowler names" });
      return;
    }

    const maxOvers = getMaxOvers(selectedFormat);
    
    setMatchState({
      team1: team1Name,
      team2: team2Name,
      battingTeam: 1,
      innings: 1,
      totalRuns: 0,
      wickets: 0,
      overs: 0,
      balls: 0,
      batsmen: [
        { name: batsman1Name, runs: 0, balls: 0, fours: 0, sixes: 0, isOut: false },
        { name: batsman2Name, runs: 0, balls: 0, fours: 0, sixes: 0, isOut: false }
      ],
      currentBowler: { name: bowlerName, overs: 0, maidens: 0, runs: 0, wickets: 0 },
      bowlers: [{ name: bowlerName, overs: 0, maidens: 0, runs: 0, wickets: 0 }],
      dismissedBatsmen: [],
      recentOvers: [],
      currentOver: [],
      format: selectedFormat,
      maxOvers: maxOvers,
      striker: 0,
      showDismissalModal: false,
      showBowlerModal: false,
      showBatsmanModal: false,
      playersPerTeam: playersPerTeam,
      maxWickets: playersPerTeam - 1
    });
    setShowPlayerSetup(false);
  };

  const switchStriker = (newState: MatchState) => {
    newState.striker = newState.striker === 0 ? 1 : 0;
  };

  const addNewBatsman = (newState: MatchState) => {
    const currentTeam = newState.battingTeam === 1 ? newState.team1 : newState.team2;
    const newBatsman: Batsman = {
      name: newBatsmanName || `${currentTeam} Batsman ${newState.wickets + 3}`,
      runs: 0,
      balls: 0,
      fours: 0,
      sixes: 0,
      isOut: false
    };
    newState.batsmen[newState.striker] = newBatsman;
  };

  const addRuns = (runs: number) => {
    if (!matchState) return;
    
    const newState = { ...matchState };
    newState.totalRuns += runs;
    newState.batsmen[newState.striker].runs += runs;
    newState.batsmen[newState.striker].balls++;
    newState.balls++;
    newState.currentBowler.runs += runs;
    
    if (runs === 4) {
      newState.batsmen[newState.striker].fours++;
      newState.currentOver.push('4');
    } else if (runs === 6) {
      newState.batsmen[newState.striker].sixes++;
      newState.currentOver.push('6');
    } else {
      newState.currentOver.push(runs.toString());
    }
    
    // Switch striker for odd runs
    if (runs % 2 === 1) {
      switchStriker(newState);
    }
    
    // Handle over completion
    if (newState.balls === 6) {
      newState.overs++;
      newState.balls = 0;
      newState.currentBowler.overs++;
      newState.recentOvers.unshift(newState.currentOver.join(' '));
      newState.currentOver = [];
      switchStriker(newState);
      
      // Check if innings is complete (overs limit reached)
      if (newState.overs >= newState.maxOvers) {
        if (newState.innings === 1) {
          // Start second innings automatically
          newState.innings = 2;
          newState.battingTeam = newState.battingTeam === 1 ? 2 : 1;
          newState.target = newState.totalRuns + 1;
          const nextTeam = newState.battingTeam === 1 ? newState.team1 : newState.team2;
          const prevTeam = newState.battingTeam === 1 ? newState.team2 : newState.team1;
          
          toast({ 
            title: "Innings Complete!", 
            description: `${prevTeam} finished at ${newState.totalRuns}/${newState.wickets}. ${nextTeam} needs ${newState.target} to win.` 
          });
          
          // Reset for second innings
          newState.totalRuns = 0;
          newState.wickets = 0;
          newState.overs = 0;
          newState.balls = 0;
          newState.batsmen = [
            { name: `${nextTeam} Batsman 1`, runs: 0, balls: 0, fours: 0, sixes: 0, isOut: false },
            { name: `${nextTeam} Batsman 2`, runs: 0, balls: 0, fours: 0, sixes: 0, isOut: false }
          ];
          newState.currentOver = [];
          newState.recentOvers = [];
          newState.bowlers = [];
          newState.dismissedBatsmen = [];
          newState.showBatsmanModal = true;
        } else {
          // Match complete - second innings finished
          const team1Score = newState.battingTeam === 1 ? newState.totalRuns : (newState.target ? newState.target - 1 : 0);
          const team2Score = newState.battingTeam === 2 ? newState.totalRuns : (newState.target ? newState.target - 1 : 0);
          
          let result = "";
          if (newState.battingTeam === 2) {
            if (newState.totalRuns >= newState.target!) {
              result = `${newState.team2} wins by ${newState.maxWickets - newState.wickets} wickets!`;
            } else {
              result = `${newState.team1} wins by ${newState.target! - newState.totalRuns - 1} runs!`;
            }
          }
          
          toast({ 
            title: "Match Complete!", 
            description: result || `Final: ${newState.team1} ${team1Score} vs ${newState.team2} ${team2Score}` 
          });
        }
      } else {
        // Continue with next over - need new bowler
        newState.showBowlerModal = true;
      }
    }
    
    // Update bowler in bowlers array
    const bowlerIndex = newState.bowlers.findIndex(b => b.name === newState.currentBowler.name);
    if (bowlerIndex !== -1) {
      newState.bowlers[bowlerIndex] = { ...newState.currentBowler };
    }
    
    setMatchState(newState);
  };

  const addWicket = () => {
    if (!matchState) return;
    
    const newState = { ...matchState };
    newState.showDismissalModal = true;
    setMatchState(newState);
  };

  const handleDismissal = () => {
    if (!matchState) return;
    
    const newState = { ...matchState };
    const dismissedBatsman = { ...newState.batsmen[newState.striker] };
    dismissedBatsman.isOut = true;
    dismissedBatsman.dismissalType = dismissalType + (fielderName ? ` (${fielderName})` : '');
    
    // Add to dismissed batsmen
    newState.dismissedBatsmen.push(dismissedBatsman);
    
    newState.wickets++;
    newState.balls++;
    newState.currentBowler.wickets++;
    newState.currentOver.push('W');
    
    if (newState.balls === 6) {
      newState.overs++;
      newState.balls = 0;
      newState.currentBowler.overs++;
      newState.recentOvers.unshift(newState.currentOver.join(' '));
      newState.currentOver = [];
      switchStriker(newState);
      
      // Check if innings is complete (overs limit reached)
      if (newState.overs >= newState.maxOvers) {
        if (newState.innings === 1) {
          // Start second innings automatically
          newState.innings = 2;
          newState.battingTeam = newState.battingTeam === 1 ? 2 : 1;
          newState.target = newState.totalRuns + 1;
          const nextTeam = newState.battingTeam === 1 ? newState.team1 : newState.team2;
          const prevTeam = newState.battingTeam === 1 ? newState.team2 : newState.team1;
          
          toast({ 
            title: "Innings Complete!", 
            description: `${prevTeam} finished at ${newState.totalRuns}/${newState.wickets}. ${nextTeam} needs ${newState.target} to win.` 
          });
          
          // Reset for second innings
          newState.totalRuns = 0;
          newState.wickets = 0;
          newState.overs = 0;
          newState.balls = 0;
          newState.batsmen = [
            { name: `${nextTeam} Batsman 1`, runs: 0, balls: 0, fours: 0, sixes: 0, isOut: false },
            { name: `${nextTeam} Batsman 2`, runs: 0, balls: 0, fours: 0, sixes: 0, isOut: false }
          ];
          newState.currentOver = [];
          newState.recentOvers = [];
          newState.bowlers = [];
          newState.dismissedBatsmen = [];
          newState.showBatsmanModal = true;
        } else {
          // Match complete
          toast({ 
            title: "Match Complete!", 
            description: `Final Score: ${newState.team1} vs ${newState.team2}` 
          });
        }
      } else {
        newState.showBowlerModal = true;
      }
    }
    
    // Show batsman selection modal if wickets < maxWickets
    if (newState.wickets < newState.maxWickets) {
      newState.showBatsmanModal = true;
    }
    
    // Update bowler in bowlers array
    const bowlerIndex = newState.bowlers.findIndex(b => b.name === newState.currentBowler.name);
    if (bowlerIndex !== -1) {
      newState.bowlers[bowlerIndex] = { ...newState.currentBowler };
    }
    
    newState.showDismissalModal = false;
    setMatchState(newState);
    setDismissalType('');
    setFielderName('');
  };

  const addExtra = (type: 'wide' | 'noball' | 'bye' | 'legbye', runs: number = 1) => {
    if (!matchState) return;
    
    const newState = { ...matchState };
    newState.totalRuns += runs;
    newState.currentBowler.runs += runs;
    
    if (type === 'wide' || type === 'noball') {
      // Don't increment balls for wides and no-balls
      newState.currentOver.push(`${type.charAt(0).toUpperCase()}${runs > 1 ? runs : ''}`);
    } else {
      newState.balls++;
      newState.batsmen[newState.striker].balls++;
      newState.currentOver.push(`${type === 'bye' ? 'b' : 'lb'}${runs > 1 ? runs : ''}`);
    }
    
    // Switch striker for odd runs
    if (runs % 2 === 1) {
      switchStriker(newState);
    }
    
    // Handle over completion (only for byes and leg-byes)
    if ((type === 'bye' || type === 'legbye') && newState.balls === 6) {
      newState.overs++;
      newState.balls = 0;
      newState.currentBowler.overs++;
      newState.recentOvers.unshift(newState.currentOver.join(' '));
      newState.currentOver = [];
      switchStriker(newState);
      
      // Check if innings is complete (overs limit reached)
      if (newState.overs >= newState.maxOvers) {
        if (newState.innings === 1) {
          // Start second innings automatically
          newState.innings = 2;
          newState.battingTeam = newState.battingTeam === 1 ? 2 : 1;
          newState.target = newState.totalRuns + 1;
          const nextTeam = newState.battingTeam === 1 ? newState.team1 : newState.team2;
          const prevTeam = newState.battingTeam === 1 ? newState.team2 : newState.team1;
          
          toast({ 
            title: "Innings Complete!", 
            description: `${prevTeam} finished at ${newState.totalRuns}/${newState.wickets}. ${nextTeam} needs ${newState.target} to win.` 
          });
          
          // Reset for second innings
          newState.totalRuns = 0;
          newState.wickets = 0;
          newState.overs = 0;
          newState.balls = 0;
          newState.batsmen = [
            { name: `${nextTeam} Batsman 1`, runs: 0, balls: 0, fours: 0, sixes: 0, isOut: false },
            { name: `${nextTeam} Batsman 2`, runs: 0, balls: 0, fours: 0, sixes: 0, isOut: false }
          ];
          newState.currentOver = [];
          newState.recentOvers = [];
          newState.bowlers = [];
          newState.dismissedBatsmen = [];
          newState.showBatsmanModal = true;
        } else {
          // Match complete
          toast({ 
            title: "Match Complete!", 
            description: `Final Score: ${newState.team1} vs ${newState.team2}` 
          });
        }
      } else {
        newState.showBowlerModal = true;
      }
    }
    
    // Update bowler in bowlers array
    const bowlerIndex = newState.bowlers.findIndex(b => b.name === newState.currentBowler.name);
    if (bowlerIndex !== -1) {
      newState.bowlers[bowlerIndex] = { ...newState.currentBowler };
    }
    
    setMatchState(newState);
  };

  const handleNewBatsman = () => {
    if (!matchState || !newBatsmanName) return;
    
    const newState = { ...matchState };
    addNewBatsman(newState);
    newState.showBatsmanModal = false;
    setMatchState(newState);
    setNewBatsmanName('');
  };

  const getBowlerLimit = (totalOvers: number) => {
    if (totalOvers === 5) {
      return 1; // 5-over: 1 over per bowler maximum
    } else if (totalOvers === 10) {
      return 2; // T10: 2 overs per bowler maximum
    } else if (totalOvers > 10) {
      return Math.floor(totalOvers / 5); // More than 10 overs: divide by 5
    }
    return totalOvers; // No limit for other short formats
  };

  const canBowlerContinue = (bowlerName: string, totalOvers: number, bowlers: Bowler[]) => {
    const bowler = bowlers.find(b => b.name === bowlerName);
    if (!bowler) return true;
    
    const limit = getBowlerLimit(totalOvers);
    return bowler.overs < limit;
  };

  const getAvailableBowlers = () => {
    if (!matchState) return [];
    
    const limit = getBowlerLimit(matchState.maxOvers);
    const availableBowlers = matchState.bowlers.filter(bowler => 
      bowler.overs < limit
    );
    
    return availableBowlers;
  };

  const handleNewBowler = () => {
    if (!matchState || !newBowlerName) return;
    
    const newState = { ...matchState };
    
    // Check if this bowler already exists
    const existingBowler = newState.bowlers.find(b => b.name === newBowlerName);
    
    if (existingBowler) {
      // Use existing bowler if they can still bowl
      if (canBowlerContinue(newBowlerName, newState.maxOvers, newState.bowlers)) {
        newState.currentBowler = existingBowler;
      } else {
        toast({ 
          title: "Bowling Limit Reached", 
          description: `${newBowlerName} has reached the maximum overs limit of ${getBowlerLimit(newState.maxOvers)} overs.` 
        });
        return;
      }
    } else {
      // Create new bowler
      const newBowler = { name: newBowlerName, overs: 0, maidens: 0, runs: 0, wickets: 0 };
      newState.currentBowler = newBowler;
      newState.bowlers.push(newBowler);
    }
    
    newState.showBowlerModal = false;
    setMatchState(newState);
    setNewBowlerName('');
  };

  if (showPlayerSetup) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#1e3a8a] mb-2">Select Players</h1>
            <p className="text-gray-600">{team1Name} vs {team2Name}</p>
            <p className="text-sm text-gray-500">{selectedFormat} • {playersPerTeam} players</p>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Opening Batsman 1</label>
              <input
                type="text"
                value={batsman1Name}
                onChange={(e) => setBatsman1Name(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter batsman name"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Opening Batsman 2</label>
              <input
                type="text"
                value={batsman2Name}
                onChange={(e) => setBatsman2Name(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter batsman name"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Opening Bowler</label>
              <input
                type="text"
                value={bowlerName}
                onChange={(e) => setBowlerName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter bowler name"
              />
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowPlayerSetup(false);
                  setShowSetup(true);
                }}
                className="flex-1 bg-gray-600 text-white py-4 rounded-xl font-semibold text-lg hover:bg-gray-700 transition-colors"
              >
                Back
              </button>
              <button
                onClick={startMatch}
                className="flex-1 bg-[#1e3a8a] text-white py-4 rounded-xl font-semibold text-lg hover:bg-blue-800 transition-colors"
              >
                Start Match
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showSetup) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
        <div className="container mx-auto px-4 max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-[#1e3a8a] mb-2">Fan Cricket Scoring</h1>
              <p className="text-gray-600">Set up your match and start scoring!</p>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Team 1</label>
                <input
                  type="text"
                  value={team1Name}
                  onChange={(e) => setTeam1Name(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter team name"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Team 2</label>
                <input
                  type="text"
                  value={team2Name}
                  onChange={(e) => setTeam2Name(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter team name"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Match Format</label>
                <select
                  value={selectedFormat}
                  onChange={(e) => setSelectedFormat(e.target.value as '5-over' | 'T10' | 'T20' | 'ODI')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="5-over">5 Overs</option>
                  <option value="T10">T10</option>
                  <option value="T20">T20</option>
                  <option value="ODI">ODI</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Players per Team</label>
                <select
                  value={playersPerTeam}
                  onChange={(e) => setPlayersPerTeam(Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={6}>6 Players (5 Wickets)</option>
                  <option value={7}>7 Players (6 Wickets)</option>
                  <option value={8}>8 Players (7 Wickets)</option>
                  <option value={9}>9 Players (8 Wickets)</option>
                  <option value={10}>10 Players (9 Wickets)</option>
                  <option value={11}>11 Players (10 Wickets)</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Maximum wickets: {playersPerTeam - 1}
                </p>
              </div>
              
              <button
                onClick={initializeMatch}
                className="w-full bg-[#1e3a8a] text-white py-4 rounded-xl font-semibold text-lg hover:bg-blue-800 transition-colors"
              >
                Start {selectedFormat} Match
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!matchState) return null;

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-blue-600 text-white p-4 rounded-t-2xl flex justify-between items-center">
          <button 
            onClick={() => setShowSetup(true)}
            className="text-white hover:bg-blue-700 p-2 rounded"
          >
            ← Back
          </button>
          <h1 className="text-lg font-semibold">Scoresheet</h1>
          <div className="flex gap-2">
            <button className="text-white hover:bg-blue-700 p-2 rounded">↻</button>
            <button className="text-white hover:bg-blue-700 p-2 rounded">⋮</button>
          </div>
        </div>

        <div className="bg-white rounded-b-2xl shadow-lg">
          {/* Match Header */}
          <div className="bg-gray-50 p-4 border-b">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {matchState.team1.substring(0, 2).toUpperCase()}
                </div>
                <span className="font-semibold">{matchState.team1}</span>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{matchState.totalRuns}/{matchState.wickets}</div>
                <div className="text-sm text-gray-600">Over {matchState.overs}.{matchState.balls} / {matchState.maxOvers}</div>
                <div className="text-xs text-blue-600 font-semibold">{matchState.format} Format • {matchState.playersPerTeam} players</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600">Ball by Ball</div>
                <div className="text-xs text-green-600">RR: {matchState.overs > 0 ? (matchState.totalRuns / (matchState.overs + matchState.balls/6)).toFixed(2) : '0.00'}</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4">
            {/* Left Panel - Main Scoring */}
            <div className="lg:col-span-2 space-y-4">
              {/* Batsmen Stats */}
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
              </div>

              {/* Bowling Stats */}
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
              </div>

              {/* Scoring Buttons */}
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
                
                <div className="text-sm font-semibold text-gray-700 mb-2">Extras</div>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => addExtra('wide')}
                    className="p-3 bg-yellow-200 text-yellow-800 rounded-xl font-semibold hover:bg-yellow-300"
                  >
                    Wide
                  </button>
                  <button
                    onClick={() => addExtra('noball')}
                    className="p-3 bg-orange-200 text-orange-800 rounded-xl font-semibold hover:bg-orange-300"
                  >
                    No Ball
                  </button>
                  <button
                    onClick={() => addExtra('bye')}
                    className="p-3 bg-purple-200 text-purple-800 rounded-xl font-semibold hover:bg-purple-300"
                  >
                    Bye
                  </button>
                  <button
                    onClick={() => addExtra('legbye')}
                    className="p-3 bg-pink-200 text-pink-800 rounded-xl font-semibold hover:bg-pink-300"
                  >
                    Leg Bye
                  </button>
                </div>
                
                <div className="space-y-3">
                  <button
                    onClick={addWicket}
                    className="w-full p-4 bg-red-600 text-white rounded-xl font-bold text-lg hover:bg-red-700 transition-colors"
                  >
                    WICKET
                  </button>
                  
                  {matchState.maxOvers > 20 && (
                    <button
                      onClick={() => {
                        if (confirm(`Declare ${matchState.battingTeam === 1 ? matchState.team1 : matchState.team2} innings at ${matchState.totalRuns}/${matchState.wickets}?`)) {
                          const newState = { ...matchState };
                          newState.innings = 2;
                          newState.battingTeam = newState.battingTeam === 1 ? 2 : 1;
                          newState.target = newState.totalRuns + 1;
                          // Reset for second innings
                          newState.totalRuns = 0;
                          newState.wickets = 0;
                          newState.overs = 0;
                          newState.balls = 0;
                          newState.batsmen = [
                            { name: `${newState.battingTeam === 1 ? newState.team2 : newState.team1} Batsman 1`, runs: 0, balls: 0, fours: 0, sixes: 0, isOut: false },
                            { name: `${newState.battingTeam === 1 ? newState.team2 : newState.team1} Batsman 2`, runs: 0, balls: 0, fours: 0, sixes: 0, isOut: false }
                          ];
                          newState.currentOver = [];
                          newState.showBatsmanModal = true;
                          setMatchState(newState);
                        }
                      }}
                      className="w-full p-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors"
                    >
                      DECLARE INNINGS
                    </button>
                  )}
                </div>
              </div>

              {/* Current Over */}
              <div className="p-4 border-t bg-gray-50">
                <div className="text-sm font-semibold text-gray-700 mb-2">This Over</div>
                <div className="flex gap-2 flex-wrap">
                  {matchState.currentOver.map((ball, index) => (
                    <span
                      key={index}
                      className={`px-2 py-1 rounded text-sm font-semibold ${
                        ball === '4' ? 'bg-green-100 text-green-800' :
                        ball === '6' ? 'bg-blue-100 text-blue-800' :
                        ball === 'W' ? 'bg-red-100 text-red-800' :
                        ball.includes('W') ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {ball}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Panel - Dismissed Batsmen & Bowlers */}
            <div className="space-y-4">
              {/* Dismissed Batsmen */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Dismissed Batsmen</h3>
                {matchState.dismissedBatsmen.length === 0 ? (
                  <p className="text-xs text-gray-500">No dismissals yet</p>
                ) : (
                  <div className="space-y-2">
                    {matchState.dismissedBatsmen.map((batsman, index) => (
                      <div key={index} className="text-xs border-b border-gray-200 pb-2">
                        <div className="font-medium">{batsman.name}</div>
                        <div className="text-gray-600">{batsman.runs}({batsman.balls}) - {batsman.dismissalType}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* All Bowlers */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Bowlers</h3>
                {matchState.maxOvers > 10 && (
                  <div className="text-xs text-blue-600 mb-2">
                    Limit: {getBowlerLimit(matchState.maxOvers)} overs per bowler
                  </div>
                )}
                <div className="space-y-2">
                  {matchState.bowlers.map((bowler, index) => {
                    const isCurrentBowler = bowler.name === matchState.currentBowler.name;
                    const canContinue = canBowlerContinue(bowler.name, matchState.maxOvers, matchState.bowlers);
                    
                    return (
                      <div key={index} className={`text-xs border-b border-gray-200 pb-2 ${isCurrentBowler ? 'bg-yellow-50 p-2 rounded' : ''}`}>
                        <div className="flex justify-between items-center">
                          <div className="font-medium flex items-center gap-2">
                            {bowler.name}
                            {isCurrentBowler && <span className="text-xs bg-yellow-400 text-yellow-800 px-1 rounded">*</span>}
                          </div>
                          {matchState.maxOvers > 10 && (
                            <div className={`text-xs px-1 rounded ${canContinue ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {bowler.overs}/{getBowlerLimit(matchState.maxOvers)}
                            </div>
                          )}
                        </div>
                        <div className="text-gray-600">{bowler.overs}-{bowler.maidens}-{bowler.runs}-{bowler.wickets}</div>
                        {!canContinue && matchState.maxOvers > 10 && (
                          <div className="text-xs text-red-600 mt-1">Limit reached</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recent Overs */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Recent Overs</h3>
                {matchState.recentOvers.length === 0 ? (
                  <p className="text-xs text-gray-500">No completed overs</p>
                ) : (
                  <div className="space-y-1">
                    {matchState.recentOvers.slice(0, 5).map((over, index) => (
                      <div key={index} className="text-xs">
                        <span className="font-medium">Over {matchState.overs - index}:</span> {over}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Dismissal Modal */}
        {matchState.showDismissalModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Select Dismissal Type</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Dismissal Type</label>
                  <select
                    value={dismissalType}
                    onChange={(e) => setDismissalType(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="">Select dismissal type</option>
                    <option value="bowled">Bowled</option>
                    <option value="caught">Caught</option>
                    <option value="lbw">LBW</option>
                    <option value="stumped">Stumped</option>
                    <option value="runout">Run Out</option>
                    <option value="hitwicket">Hit Wicket</option>
                    {matchState.maxOvers > 20 && <option value="retiredout">Retired Out</option>}
                  </select>
                </div>

                {(dismissalType === 'caught' || dismissalType === 'runout' || dismissalType === 'stumped') && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {dismissalType === 'caught' ? 'Caught by:' : dismissalType === 'runout' ? 'Run out by:' : 'Stumped by:'}
                    </label>
                    <input
                      type="text"
                      value={fielderName}
                      onChange={(e) => setFielderName(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="Enter fielder name"
                    />
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={handleDismissal}
                    disabled={!dismissalType}
                    className="flex-1 bg-red-600 text-white py-2 rounded-lg font-semibold disabled:bg-gray-300"
                  >
                    Confirm Wicket
                  </button>
                  <button
                    onClick={() => {
                      const newState = {...matchState};
                      newState.showDismissalModal = false;
                      setMatchState(newState);
                      setDismissalType('');
                      setFielderName('');
                    }}
                    className="flex-1 bg-gray-600 text-white py-2 rounded-lg font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* New Bowler Modal */}
        {matchState.showBowlerModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-lg mx-4">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Select New Bowler</h3>
              
              <div className="space-y-4">
                {/* Bowling Restrictions Info */}
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Bowling Limit:</strong> {matchState.maxOvers === 5 ? 
                      `Each bowler can bowl maximum 1 over` : 
                      matchState.maxOvers === 10 ? 
                      `Each bowler can bowl maximum 2 overs` :
                      matchState.maxOvers > 10 ? 
                      `Each bowler can bowl maximum ${getBowlerLimit(matchState.maxOvers)} overs` : 
                      'No bowling restrictions for this format'}
                  </p>
                </div>

                {/* Available Bowlers */}
                {getAvailableBowlers().length > 0 && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Available Bowlers</label>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {getAvailableBowlers().map((bowler, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setNewBowlerName(bowler.name);
                          }}
                          className="w-full text-left p-2 border rounded-lg hover:bg-gray-50 flex justify-between items-center"
                        >
                          <span className="font-medium">{bowler.name}</span>
                          <span className="text-sm text-gray-600">
                            {bowler.overs}/{getBowlerLimit(matchState.maxOvers)} overs
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {getAvailableBowlers().length > 0 ? 'Or Enter New Bowler Name' : 'Bowler Name'}
                  </label>
                  <input
                    type="text"
                    value={newBowlerName}
                    onChange={(e) => setNewBowlerName(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="Enter bowler name"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleNewBowler}
                    disabled={!newBowlerName}
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-semibold disabled:bg-gray-300"
                  >
                    Start Bowling
                  </button>
                  <button
                    onClick={() => {
                      const newState = {...matchState};
                      newState.showBowlerModal = false;
                      setMatchState(newState);
                      setNewBowlerName('');
                    }}
                    className="flex-1 bg-gray-600 text-white py-2 rounded-lg font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* New Batsman Modal */}
        {matchState.showBatsmanModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
              <h3 className="text-xl font-bold text-gray-800 mb-4">New Batsman</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Batsman Name</label>
                  <input
                    type="text"
                    value={newBatsmanName}
                    onChange={(e) => setNewBatsmanName(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="Enter batsman name"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleNewBatsman}
                    disabled={!newBatsmanName}
                    className="flex-1 bg-green-600 text-white py-2 rounded-lg font-semibold disabled:bg-gray-300"
                  >
                    Start Batting
                  </button>
                  <button
                    onClick={() => {
                      const newState = {...matchState};
                      newState.showBatsmanModal = false;
                      setMatchState(newState);
                      setNewBatsmanName('');
                    }}
                    className="flex-1 bg-gray-600 text-white py-2 rounded-lg font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}