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
  recentOvers: string[];
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
  dismissedBatsmen?: Batsman[];
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
  const [selectedFormat, setSelectedFormat] = useState<'T20' | 'ODI' | 'Test'>('T20');
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [oppositionName, setOppositionName] = useState('');
  const [venue, setVenue] = useState('');
  const [matchDate, setMatchDate] = useState('');
  const [tossWinner, setTossWinner] = useState<'tuskers' | 'opposition' | ''>('');
  const [tossChoice, setTossChoice] = useState<'bat' | 'bowl' | ''>('');
  const [selectedTuskersPlayers, setSelectedTuskersPlayers] = useState<number[]>([]);
  const [oppositionPlayers, setOppositionPlayers] = useState<string[]>(['', '', '', '', '', '', '', '', '', '', '']);
  const { toast } = useToast();

  // Fetch teams and players from database
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

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    if (username === 'tuskers' && password === 'tuskers2024') {
      setIsAuthenticated(true);
      sessionStorage.setItem('tuskersScoring', 'authenticated');
      toast({ title: "Success", description: "Logged in successfully!" });
    } else {
      toast({ title: "Error", description: "Invalid credentials" });
    }
  };

  const getMaxOvers = (format: string) => {
    switch(format) {
      case 'T20': return 20;
      case 'ODI': return 50;
      case 'Test': return 90; // Approximate for Test cricket
      default: return 20;
    }
  };

  const initializeMatch = () => {
    if (!selectedTeam || !oppositionName || !venue || !matchDate || !tossWinner || !tossChoice) {
      const missingFields = [];
      if (!selectedTeam) missingFields.push('Team');
      if (!oppositionName) missingFields.push('Opposition Team');
      if (!venue) missingFields.push('Venue');
      if (!matchDate) missingFields.push('Match Date');
      if (!tossWinner) missingFields.push('Toss Winner');
      if (!tossChoice) missingFields.push('Toss Choice');
      
      toast({ 
        title: "Error", 
        description: `Please fill: ${missingFields.join(', ')}` 
      });
      return;
    }

    // Check if players are selected
    if (selectedTuskersPlayers.length !== 11) {
      toast({ title: "Error", description: "Please select exactly 11 Tuskers players from the team section" });
      return;
    }

    if (oppositionPlayers.length !== 11) {
      toast({ title: "Error", description: "Please add exactly 11 opposition players" });
      return;
    }

    // Start the match directly - navigate to scoring interface
    startMatchWithPlayers();
  };

  const startMatchWithPlayers = () => {
    if (selectedTuskersPlayers.length !== 11) {
      toast({ title: "Error", description: "Please select exactly 11 Tuskers players" });
      return;
    }

    const emptyOppositionPlayers = oppositionPlayers.filter(name => name.trim() === '');
    if (emptyOppositionPlayers.length > 0) {
      toast({ title: "Error", description: "Please enter all 11 opposition player names" });
      return;
    }

    const maxOvers = getMaxOvers(selectedFormat);
    
    // Determine which team bats first based on toss
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
      tossChoice: tossChoice,
      isComplete: false,
      dismissedBatsmen: [],
      showBatsmanModal: false
    });
    setShowSetup(false);
  };

  const switchStriker = (newState: MatchState) => {
    newState.striker = newState.striker === 0 ? 1 : 0;
  };

  const addNewBatsman = (newState: MatchState) => {
    const outBatsmanIndex = newState.batsmen.findIndex(b => b.isOut);
    if (outBatsmanIndex !== -1) {
      newState.batsmen[outBatsmanIndex] = {
        name: 'Select Batsman',
        runs: 0,
        balls: 0,
        fours: 0,
        sixes: 0,
        isOut: false
      };
      newState.striker = outBatsmanIndex as 0 | 1;
    }
  };

  const addRuns = (runs: number, ballFaced: boolean = true) => {
    if (!matchState) return;

    const newState = { ...matchState };
    newState.totalRuns += runs;
    
    if (ballFaced) {
      newState.balls++;
      newState.batsmen[newState.striker].balls++;
      newState.batsmen[newState.striker].runs += runs;
      
      if (runs === 4) newState.batsmen[newState.striker].fours++;
      if (runs === 6) newState.batsmen[newState.striker].sixes++;
      
      // Switch striker on odd runs
      if (runs % 2 === 1) {
        switchStriker(newState);
      }
    }
    
    newState.currentBowler.runs += runs;

    // Check for match completion in second innings (target reached)
    if (newState.innings === 2 && newState.target && newState.totalRuns >= newState.target) {
      const battingTeam = newState.battingTeam === 1 ? newState.team1 : newState.team2;
      const result = `${battingTeam} wins by ${10 - newState.wickets} wickets!`;
      
      newState.isComplete = true;
      toast({ 
        title: "Match Complete!", 
        description: result 
      });
      
      // Update bowler in bowlers array before completing
      const bowlerIndex = newState.bowlers.findIndex(b => b.name === newState.currentBowler.name);
      if (bowlerIndex !== -1) {
        newState.bowlers[bowlerIndex] = { ...newState.currentBowler };
      }
      
      setMatchState(newState);
      return;
    }
    
    // Handle over completion
    if (ballFaced && newState.balls === 6) {
      newState.overs++;
      newState.balls = 0;
      newState.currentBowler.overs++;
      switchStriker(newState); // Switch striker at end of over
      
      // Check if innings is complete (overs limit reached)
      const maxOvers = getMaxOvers(newState.format);
      if (newState.overs >= maxOvers) {
        if (newState.innings === 1) {
          // Start second innings
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
          newState.bowlers = [];
          newState.dismissedBatsmen = [];
          newState.showBatsmanModal = true;
        } else {
          // Match complete - second innings finished due to overs limit
          const battingTeam = newState.battingTeam === 1 ? newState.team1 : newState.team2;
          const bowlingTeam = newState.battingTeam === 1 ? newState.team2 : newState.team1;
          
          let result = "";
          if (newState.target && newState.totalRuns >= newState.target) {
            result = `${battingTeam} wins by ${10 - newState.wickets} wickets!`;
          } else {
            result = `${bowlingTeam} wins by ${(newState.target || 0) - newState.totalRuns - 1} runs!`;
          }
          
          newState.isComplete = true;
          toast({ 
            title: "Match Complete!", 
            description: result 
          });
        }
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
    newState.wickets++;
    newState.balls++;
    newState.currentBowler.wickets++;
    newState.batsmen[newState.striker].isOut = true;
    
    if (newState.balls === 6) {
      newState.overs++;
      newState.balls = 0;
      newState.currentBowler.overs++;
      switchStriker(newState);
    }
    
    // Add new batsman if wickets < 10
    if (newState.wickets < 10) {
      addNewBatsman(newState);
    }
    
    // Update bowler in bowlers array
    const bowlerIndex = newState.bowlers.findIndex(b => b.name === newState.currentBowler.name);
    if (bowlerIndex !== -1) {
      newState.bowlers[bowlerIndex] = { ...newState.currentBowler };
    }
    
    setMatchState(newState);
  };

  const addExtra = (type: 'wide' | 'noball' | 'bye' | 'legbye', runs: number = 1) => {
    if (!matchState) return;
    
    const newState = { ...matchState };
    newState.totalRuns += runs;
    
    if (type === 'wide' || type === 'noball') {
      newState.currentBowler.runs += runs;
      // No ball progression for wide/noball
    } else {
      newState.balls++;
      if (runs % 2 === 1) {
        switchStriker(newState);
      }
      if (newState.balls === 6) {
        newState.overs++;
        newState.balls = 0;
        newState.currentBowler.overs++;
        switchStriker(newState);
      }
    }
    
    // Update bowler in bowlers array
    const bowlerIndex = newState.bowlers.findIndex(b => b.name === newState.currentBowler.name);
    if (bowlerIndex !== -1) {
      newState.bowlers[bowlerIndex] = { ...newState.currentBowler };
    }
    
    setMatchState(newState);
  };

  const changeBowler = (newBowlerName: string) => {
    if (!matchState) return;
    
    const newState = { ...matchState };
    
    // Check if bowler already exists
    const existingBowler = newState.bowlers.find(b => b.name === newBowlerName);
    
    if (existingBowler) {
      newState.currentBowler = { ...existingBowler };
    } else {
      const newBowler = { name: newBowlerName, overs: 0, maidens: 0, runs: 0, wickets: 0 };
      newState.currentBowler = newBowler;
      newState.bowlers.push(newBowler);
    }
    
    setMatchState(newState);
  };

  const generateMatchReport = () => {
    if (!matchState) return;

    const reportContent = `
TUSKERS CC OFFICIAL MATCH REPORT
===============================

Match: ${matchState.team1} vs ${matchState.team2}
Format: ${matchState.format}
Venue: ${matchState.venue}
Date: ${matchState.matchDate}

SCORECARD:
${matchState.team1}: ${matchState.totalRuns}/${matchState.wickets} (${matchState.overs}.${matchState.balls} overs)

BATTING PERFORMANCE:
${matchState.batsmen.map((batsman, index) => 
  `${batsman.name}: ${batsman.runs}${batsman.isOut ? '' : '*'} (${batsman.balls}b, ${batsman.fours}×4, ${batsman.sixes}×6) SR: ${batsman.balls > 0 ? ((batsman.runs / batsman.balls) * 100).toFixed(1) : '0.0'}`
).join('\n')}

BOWLING FIGURES:
${matchState.bowlers.map(bowler => 
  `${bowler.name}: ${bowler.overs}-${bowler.maidens}-${bowler.runs}-${bowler.wickets}`
).join('\n')}

SQUAD DETAILS:
${matchState.selectedPlayers.map(player => 
  `${player.name} (${player.position})`
).join('\n')}

MATCH SUMMARY:
Total Runs: ${matchState.totalRuns}
Wickets Lost: ${matchState.wickets}
Overs Bowled: ${matchState.overs}.${matchState.balls}
Run Rate: ${matchState.overs > 0 ? (matchState.totalRuns / (matchState.overs + matchState.balls/6)).toFixed(2) : '0.00'}

Scored by: Tuskers CC Official Scoring System
Generated: ${new Date().toLocaleString()}
    `;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `TuskersCC_vs_${matchState.team2}_${matchState.format}_Official_Report.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({ title: "Official Report Downloaded", description: "Match report saved successfully!" });
  };

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center py-8">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#1e3a8a] mb-2">Tuskers CC</h1>
            <p className="text-gray-600">Official Scoring System</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Username</label>
              <input
                name="username"
                type="text"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter username"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <input
                name="password"
                type="password"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter password"
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-[#1e3a8a] text-white py-4 rounded-xl font-semibold text-lg hover:bg-blue-800 transition-colors"
            >
              Login to Official System
            </button>
          </form>
          
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Authorized Personnel Only</p>
            <p className="text-xs">Username: tuskers | Password: tuskers2024</p>
          </div>
        </div>
      </div>
    );
  }

  // Match Setup Screen
  if (showSetup) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-[#1e3a8a] mb-2">Official Match Setup</h1>
              <p className="text-gray-600">Configure match details and team selection</p>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Match Format</label>
                <select
                  value={selectedFormat}
                  onChange={(e) => setSelectedFormat(e.target.value as 'T20' | 'ODI' | 'Test')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="T20">T20 (20 overs)</option>
                  <option value="ODI">ODI (50 overs)</option>
                  <option value="Test">Test Match</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Your Team</label>
                <div className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-blue-50 border-blue-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        <span className="text-yellow-400 font-bold text-sm">TC</span>
                      </div>
                      <div>
                        <div className="font-semibold text-blue-900">
                          {selectedTeam?.name || 'Tuskers CC'}
                        </div>
                        <div className="text-sm text-blue-700">
                          Official Team Account
                        </div>
                      </div>
                    </div>
                    <div className="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full">
                      OFFICIAL
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Opposition Team</label>
                <input
                  type="text"
                  value={oppositionName}
                  onChange={(e) => setOppositionName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter opposition team name"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Venue</label>
                  <input
                    type="text"
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter match venue"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Match Date</label>
                  <input
                    type="date"
                    value={matchDate}
                    onChange={(e) => setMatchDate(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Toss Information */}
              <div className="bg-yellow-50 p-4 rounded-xl border-l-4 border-yellow-400">
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
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Toss Choice</label>
                    <select
                      value={tossChoice}
                      onChange={(e) => setTossChoice(e.target.value as 'bat' | 'bowl' | '')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={!tossWinner}
                    >
                      <option value="">Select Choice</option>
                      <option value="bat">Choose to Bat First</option>
                      <option value="bowl">Choose to Bowl First</option>
                    </select>
                  </div>
                </div>

                {tossWinner && tossChoice && (
                  <div className="mt-3 p-3 bg-yellow-100 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      <strong>{tossWinner === 'tuskers' ? selectedTeam?.name : oppositionName}</strong> won the toss and chose to <strong>{tossChoice === 'bat' ? 'bat first' : 'bowl first'}</strong>
                    </p>
                  </div>
                )}
              </div>

              {selectedTeam && (
                <div className="bg-blue-50 p-4 rounded-xl">
                  <h3 className="font-semibold text-blue-900 mb-4">Team Details & Player Selection</h3>
                  <p className="text-blue-800 mb-4">
                    {selectedTeam.name} ({selectedTeam.shortName})
                    {selectedTeam.homeGround && ` - Home: ${selectedTeam.homeGround}`}
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Tuskers Players */}
                    <div>
                      <h4 className="font-medium text-blue-800 mb-3">
                        {selectedTeam.name} Players ({selectedTuskersPlayers.length}/11)
                      </h4>
                      <div className="space-y-2 max-h-48 overflow-y-auto border rounded-lg p-3 bg-white">
                        {players.map(player => (
                          <label
                            key={player.id}
                            className={`flex items-center space-x-2 p-2 rounded cursor-pointer hover:bg-gray-50 ${
                              selectedTuskersPlayers.includes(player.id) ? 'bg-blue-50' : ''
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={selectedTuskersPlayers.includes(player.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  if (selectedTuskersPlayers.length < 11) {
                                    setSelectedTuskersPlayers([...selectedTuskersPlayers, player.id]);
                                  }
                                } else {
                                  setSelectedTuskersPlayers(selectedTuskersPlayers.filter(id => id !== player.id));
                                }
                              }}
                              disabled={!selectedTuskersPlayers.includes(player.id) && selectedTuskersPlayers.length >= 11}
                              className="w-4 h-4 text-blue-600"
                            />
                            <div className="flex-1">
                              <div className="font-medium text-sm">{player.name}</div>
                              <div className="text-xs text-gray-500">{player.position}</div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Opposition Players */}
                    <div>
                      <h4 className="font-medium text-blue-800 mb-3">
                        {oppositionName || 'Opposition'} Players ({oppositionPlayers.filter(p => p.trim()).length}/11)
                      </h4>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {oppositionPlayers.map((player, index) => (
                          <input
                            key={index}
                            type="text"
                            value={player}
                            onChange={(e) => {
                              const newPlayers = [...oppositionPlayers];
                              newPlayers[index] = e.target.value;
                              setOppositionPlayers(newPlayers);
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            placeholder={`Player ${index + 1} name`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <button
                onClick={initializeMatch}
                className="w-full bg-[#1e3a8a] text-white py-4 rounded-xl font-semibold text-lg hover:bg-blue-800 transition-colors"
              >
                Start Official {selectedFormat} Match
              </button>

              <button
                onClick={() => {
                  setIsAuthenticated(false);
                  sessionStorage.removeItem('tuskersScoring');
                }}
                className="w-full bg-gray-600 text-white py-2 rounded-xl font-semibold hover:bg-gray-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main Scoring Interface
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
          <h1 className="text-lg font-semibold">Official Scoresheet</h1>
          <div className="flex gap-2">
            <button 
              onClick={generateMatchReport}
              className="text-white hover:bg-blue-700 p-2 rounded text-sm"
            >
              📄 Report
            </button>
            <button
              onClick={() => {
                setIsAuthenticated(false);
                sessionStorage.removeItem('tuskersScoring');
              }}
              className="text-white hover:bg-blue-700 p-2 rounded text-sm"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="bg-white rounded-b-2xl shadow-lg">
          {/* Match Header */}
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
                      Need: {Math.max(0, matchState.target - matchState.totalRuns)} runs in {((getMaxOvers(matchState.format) - matchState.overs) * 6 - matchState.balls)} balls
                    </div>
                    <div className="text-red-600 font-semibold">
                      RRR: {(() => {
                        const ballsLeft = (getMaxOvers(matchState.format) - matchState.overs) * 6 - matchState.balls;
                        const runsNeeded = matchState.target - matchState.totalRuns;
                        const oversLeft = ballsLeft / 6;
                        return oversLeft > 0 ? (runsNeeded / oversLeft).toFixed(2) : '0.00';
                      })()}
                    </div>
                  </div>
                )}
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{matchState.totalRuns}/{matchState.wickets}</div>
                <div className="text-sm text-gray-600">Over {matchState.overs}.{matchState.balls} / {getMaxOvers(matchState.format)}</div>
                <div className="text-xs text-blue-600 font-semibold">{matchState.format} Format</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600">Official Scoring</div>
                <div className="text-xs text-green-600">CRR: {matchState.overs > 0 || matchState.balls > 0 ? (matchState.totalRuns / (matchState.overs + matchState.balls/6)).toFixed(2) : '0.00'}</div>
                <div className="text-xs text-gray-500">Innings {matchState.innings}</div>
              </div>
            </div>
          </div>

          {/* Batsmen Stats */}
          <div className="p-4 border-b bg-gray-50">
            <div className="text-sm text-gray-600 mb-2">
              {matchState.venue} • {matchState.matchDate} • {matchState.battingTeam === 1 ? matchState.team1 : matchState.team2} batting
            </div>
            
            <div className="space-y-2">
              <div className="text-xs font-semibold text-gray-500 grid grid-cols-8 gap-2">
                <span className="col-span-3">BATTER</span>
                <span className="text-center">R</span>
                <span className="text-center">B</span>
                <span className="text-center">4s</span>
                <span className="text-center">6s</span>
                <span className="text-center">SR</span>
              </div>
              
              {matchState.batsmen.map((batsman, index) => (
                <div key={index} className={`grid grid-cols-8 gap-2 py-2 border-b border-gray-200 ${index === matchState.striker ? 'bg-yellow-50' : ''}`}>
                  <div className="col-span-3 flex items-center gap-2">
                    <select
                      value={batsman.name}
                      onChange={(e) => {
                        const newState = {...matchState};
                        newState.batsmen[index].name = e.target.value;
                        setMatchState(newState);
                      }}
                      className="text-sm border rounded px-2 py-1 w-full"
                    >
                      <option value="Select Batsman">Select Batsman</option>
                      {matchState.selectedPlayers.map(player => (
                        <option key={player.id} value={player.name}>{player.name}</option>
                      ))}
                    </select>
                    {index === matchState.striker && <span className="text-xs bg-yellow-400 text-black px-1 rounded font-bold">*</span>}
                    {batsman.isOut && <span className="text-xs bg-red-100 text-red-800 px-1 rounded">OUT</span>}
                  </div>
                  <span className="text-center">{batsman.runs}</span>
                  <span className="text-center">{batsman.balls}</span>
                  <span className="text-center">{batsman.fours}</span>
                  <span className="text-center">{batsman.sixes}</span>
                  <span className="text-center">{batsman.balls > 0 ? ((batsman.runs / batsman.balls) * 100).toFixed(1) : '0.0'}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Current Bowler */}
          <div className="p-4 border-b">
            <div className="text-xs font-semibold text-gray-500 mb-2">CURRENT BOWLER</div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <input
                  type="text"
                  value={matchState.currentBowler.name}
                  onChange={(e) => changeBowler(e.target.value)}
                  className="text-sm border rounded px-2 py-1"
                  placeholder="Enter bowler name"
                />
                <span className="text-sm text-gray-600">
                  {matchState.currentBowler.overs}-{matchState.currentBowler.maidens}-{matchState.currentBowler.runs}-{matchState.currentBowler.wickets}
                </span>
              </div>
              <button 
                onClick={() => changeBowler(`Bowler ${matchState.bowlers.length + 1}`)}
                className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded"
              >
                New Bowler
              </button>
            </div>
          </div>

          {/* Recent Overs */}
          <div className="p-4 space-y-4">
            {[3, 2, 1].map(overNum => (
              <div key={overNum} className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm font-semibold">Over {overNum}</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5, 6].map(ball => (
                    <div key={ball} className="w-8 h-8 border border-gray-300 rounded-full flex items-center justify-center text-xs">
                      {ball <= matchState.balls && overNum === matchState.overs ? '1' : ''}
                    </div>
                  ))}
                </div>
                <button className="text-blue-600 text-sm">✎</button>
              </div>
            ))}
          </div>

          {/* Scoring Buttons */}
          <div className="p-4 bg-gray-50">
            {/* Run Buttons */}
            <div className="flex justify-center gap-3 mb-4">
              {[0, 1, 2, 3, 4, 6].map(runs => (
                <button
                  key={runs}
                  onClick={() => addRuns(runs)}
                  className={`w-12 h-12 rounded-full border-2 border-gray-400 font-semibold transition-colors
                    ${runs === 4 ? 'bg-green-500 text-white border-green-500' : 
                      runs === 6 ? 'bg-blue-500 text-white border-blue-500' : 
                      'bg-white hover:bg-gray-100'}`}
                >
                  {runs}
                </button>
              ))}
              <button className="px-4 py-2 rounded-full bg-gray-700 text-white font-semibold">5+</button>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-3 mb-4">
              <button 
                onClick={addWicket}
                className="px-4 py-2 rounded-full bg-red-500 text-white font-semibold"
              >
                WICKET
              </button>
              <button 
                onClick={() => addExtra('noball')}
                className="px-4 py-2 rounded-full bg-gray-700 text-white font-semibold"
              >
                NO BALL
              </button>
              <button 
                onClick={() => addExtra('wide')}
                className="px-4 py-2 rounded-full bg-gray-700 text-white font-semibold"
              >
                WIDE
              </button>
              <button 
                onClick={() => addExtra('bye')}
                className="px-4 py-2 rounded-full bg-gray-700 text-white font-semibold"
              >
                BYE
              </button>
            </div>

            {/* Match Controls */}
            <div className="flex justify-center gap-3">
              <button 
                onClick={generateMatchReport}
                className="px-6 py-2 rounded-full bg-green-600 text-white font-semibold"
              >
                📄 DOWNLOAD OFFICIAL REPORT
              </button>
              <button 
                onClick={() => setShowSetup(true)}
                className="px-6 py-2 rounded-full bg-blue-600 text-white font-semibold"
              >
                🔄 NEW MATCH
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Debug indicator */}
      {showPlayerSelection && <div className="fixed top-0 left-0 bg-red-500 text-white p-2 z-[9999]">Modal should be visible</div>}
      
      {/* Player Selection Modal */}
      {showPlayerSelection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-[#1e3a8a]">Select Team Players</h2>
                <button
                  onClick={() => setShowPlayerSelection(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Tuskers CC Players Selection */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-blue-900">
                    {selectedTeam?.name || 'Tuskers CC'} Players (Select 11)
                  </h3>
                  <div className="text-sm text-gray-600 mb-3">
                    Selected: {selectedTuskersPlayers.length}/11
                  </div>
                  
                  <div className="grid grid-cols-1 gap-2 max-h-80 overflow-y-auto border rounded-lg p-3">
                    {players.map(player => (
                      <label
                        key={player.id}
                        className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                          selectedTuskersPlayers.some(p => p.id === player.id)
                            ? 'bg-blue-50 border-blue-200'
                            : 'bg-gray-50 hover:bg-gray-100'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedTuskersPlayers.some(p => p.id === player.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              if (selectedTuskersPlayers.length < 11) {
                                setSelectedTuskersPlayers([...selectedTuskersPlayers, player]);
                              }
                            } else {
                              setSelectedTuskersPlayers(selectedTuskersPlayers.filter(p => p.id !== player.id));
                            }
                          }}
                          className="w-4 h-4 text-blue-600"
                        />
                        <div className="flex-1">
                          <div className="font-medium">{player.name}</div>
                          <div className="text-sm text-gray-500">
                            {player.position}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Opposition Players Entry */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-red-900">
                    {oppositionName} Players (Enter 11)
                  </h3>
                  
                  <div className="space-y-2 max-h-80 overflow-y-auto">
                    {oppositionPlayers.map((name, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-600 w-8">
                          {index + 1}.
                        </span>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => {
                            const newPlayers = [...oppositionPlayers];
                            newPlayers[index] = e.target.value;
                            setOppositionPlayers(newPlayers);
                          }}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder={`Player ${index + 1} name`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-4 mt-8 pt-6 border-t">
                <button
                  onClick={() => setShowPlayerSelection(false)}
                  className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={startMatchWithPlayers}
                  disabled={selectedTuskersPlayers.length !== 11 || oppositionPlayers.some(name => !name.trim())}
                  className="px-6 py-3 bg-[#1e3a8a] text-white rounded-xl font-semibold hover:bg-blue-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Start Official {selectedFormat} Match
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}