import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import type { Player } from '@shared/schema';

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
  recentOvers: string[];
  target?: number;
}

export default function TuskersScoring() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [matchState, setMatchState] = useState<MatchState | null>(null);
  const [showSetup, setShowSetup] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [team1Name, setTeam1Name] = useState('Tuskers CC');
  const [team2Name, setTeam2Name] = useState('');
  const { toast } = useToast();

  const { data: players = [] } = useQuery<Player[]>({
    queryKey: ['/api/players'],
    enabled: isAuthenticated
  });

  const handleLogin = async () => {
    if (username === 'tuskers' && password === 'tuskers2024') {
      setIsAuthenticated(true);
      sessionStorage.setItem('tuskersScoring', 'true');
      toast({ title: "Login Successful", description: "Welcome to Tuskers CC Scoring System" });
    } else {
      toast({ 
        title: "Login Failed", 
        description: "Invalid credentials. Use tuskers/tuskers2024",
        variant: "destructive" 
      });
    }
  };

  const initializeMatch = () => {
    if (!team2Name) {
      toast({ title: "Error", description: "Please enter opposition team name" });
      return;
    }

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
        { name: 'Select Batsman', runs: 0, balls: 0, fours: 0, sixes: 0, isOut: false },
        { name: 'Select Batsman', runs: 0, balls: 0, fours: 0, sixes: 0, isOut: false }
      ],
      currentBowler: { name: 'Select Bowler', overs: 0, maidens: 0, runs: 0, wickets: 0 },
      recentOvers: []
    });
    setShowSetup(false);
  };

  const addRuns = (runs: number, ballFaced: boolean = true) => {
    if (!matchState) return;

    const newState = { ...matchState };
    newState.totalRuns += runs;
    
    if (ballFaced) {
      newState.balls++;
      newState.batsmen[0].balls++;
      newState.batsmen[0].runs += runs;
      
      if (runs === 4) newState.batsmen[0].fours++;
      if (runs === 6) newState.batsmen[0].sixes++;
      
      if (newState.balls === 6) {
        newState.overs++;
        newState.balls = 0;
        newState.currentBowler.overs++;
      }
    }
    
    newState.currentBowler.runs += runs;
    setMatchState(newState);
  };

  const addWicket = () => {
    if (!matchState) return;
    
    const newState = { ...matchState };
    newState.wickets++;
    newState.balls++;
    newState.currentBowler.wickets++;
    newState.batsmen[0].isOut = true;
    
    if (newState.balls === 6) {
      newState.overs++;
      newState.balls = 0;
      newState.currentBowler.overs++;
    }
    
    setMatchState(newState);
  };

  const addExtra = (type: 'wide' | 'noball' | 'bye' | 'legbye', runs: number = 1) => {
    if (!matchState) return;
    
    const newState = { ...matchState };
    newState.totalRuns += runs;
    
    if (type === 'wide' || type === 'noball') {
      newState.currentBowler.runs += runs;
    } else {
      newState.balls++;
      if (newState.balls === 6) {
        newState.overs++;
        newState.balls = 0;
        newState.currentBowler.overs++;
      }
    }
    
    setMatchState(newState);
  };

  useEffect(() => {
    const stored = sessionStorage.getItem('tuskersScoring');
    if (stored) setIsAuthenticated(true);
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1e3a8a] to-blue-800 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="bg-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-2xl font-bold text-[#1e3a8a]">TC</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Tuskers CC</h1>
            <p className="text-blue-200">Official Scoring System</p>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <h2 className="text-2xl font-bold text-[#1e3a8a] mb-6 text-center">Scorer Login</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
                  placeholder="Enter scorer username"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
                  placeholder="Enter password"
                />
              </div>

              <button
                onClick={handleLogin}
                className="w-full bg-[#1e3a8a] text-white py-3 px-4 rounded-lg font-semibold hover:bg-[#1e40af] transition-colors"
              >
                Access Scoring System
              </button>
            </div>

            <div className="mt-6 text-center text-sm text-gray-600">
              <p>Credentials: tuskers / tuskers2024</p>
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
              <div className="bg-[#1e3a8a] rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-white">TC</span>
              </div>
              <h1 className="text-3xl font-bold text-[#1e3a8a] mb-2">Official Scorecard</h1>
              <p className="text-gray-600">Setup your match</p>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Team 1 (Home)</label>
                <input
                  type="text"
                  value={team1Name}
                  onChange={(e) => setTeam1Name(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                  readOnly
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Team 2 (Opposition)</label>
                <input
                  type="text"
                  value={team2Name}
                  onChange={(e) => setTeam2Name(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter opposition team name"
                />
              </div>
              
              <button
                onClick={initializeMatch}
                className="w-full bg-[#1e3a8a] text-white py-4 rounded-xl font-semibold text-lg hover:bg-blue-800 transition-colors"
              >
                Start Official Match
              </button>

              <button
                onClick={() => {
                  setIsAuthenticated(false);
                  sessionStorage.removeItem('tuskersScoring');
                }}
                className="w-full bg-gray-500 text-white py-2 rounded-xl font-semibold hover:bg-gray-600 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!matchState) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-[#1e3a8a]">Tuskers CC Official Scoring</h1>
            <p className="text-xl text-gray-600">Professional match scoring with player data</p>
          </div>
          <button
            onClick={() => {
              setIsAuthenticated(false);
              sessionStorage.removeItem('tuskersScoring');
            }}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-lg">
            <button
              onClick={() => setActiveTab('setup')}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                activeTab === 'setup' ? 'bg-[#1e3a8a] text-white' : 'text-[#1e3a8a] hover:bg-blue-50'
              }`}
            >
              Match Setup
            </button>
            <button
              onClick={() => setActiveTab('live')}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                activeTab === 'live' ? 'bg-[#1e3a8a] text-white' : 'text-[#1e3a8a] hover:bg-blue-50'
              }`}
              disabled={!currentMatch}
            >
              Live Scoring
            </button>
            <button
              onClick={() => setActiveTab('summary')}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                activeTab === 'summary' ? 'bg-[#1e3a8a] text-white' : 'text-[#1e3a8a] hover:bg-blue-50'
              }`}
              disabled={!currentMatch}
            >
              Match Summary
            </button>
          </div>
        </div>

        {/* Match Setup Tab */}
        {activeTab === 'setup' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-[#1e3a8a] mb-6">Setup Official Match</h2>
              
              <form onSubmit={handleMatchSubmit(handleMatchSetup)} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Match Name</label>
                  <input
                    {...registerMatch('matchName', { required: true })}
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
                    placeholder="e.g., Tuskers CC vs Lightning Bolts - League Final"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Team 1 (Tuskers CC)</label>
                    <input
                      {...registerMatch('team1')}
                      type="text"
                      value="Tuskers CC"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                      readOnly
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Team 2 (Opposition)</label>
                    <input
                      {...registerMatch('team2', { required: true })}
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
                      placeholder="Enter opposition team name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Venue</label>
                  <input
                    {...registerMatch('venue', { required: true })}
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
                    placeholder="Enter match venue"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Match Date</label>
                    <input
                      {...registerMatch('matchDate', { required: true })}
                      type="date"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Overs per Innings</label>
                    <select
                      {...registerMatch('overs', { required: true })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
                    >
                      <option value="">Select overs</option>
                      <option value={20}>T20 (20 overs)</option>
                      <option value={50}>ODI (50 overs)</option>
                      <option value={90}>Test Match</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#1e3a8a] text-white py-3 px-4 rounded-lg font-semibold hover:bg-[#1e40af] transition-colors"
                >
                  Setup Match & Proceed to Scoring
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Live Scoring Tab */}
        {activeTab === 'live' && currentMatch && (
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-[#1e3a8a]">{currentMatch.matchName}</h2>
                  <p className="text-gray-600">{currentMatch.venue} • {currentMatch.matchDate}</p>
                </div>
                <div className="flex gap-4">
                  {!isLive ? (
                    <button
                      onClick={handleStartLive}
                      className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                    >
                      Start Live Scoring
                    </button>
                  ) : (
                    <button
                      onClick={handleEndMatch}
                      className="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                    >
                      End Match
                    </button>
                  )}
                </div>
              </div>

              {isLive && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-2 animate-pulse"></div>
                    <span className="font-bold text-red-800">LIVE MATCH IN PROGRESS</span>
                  </div>
                </div>
              )}

              {/* Current Score Display */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-[#1e3a8a] mb-2">Tuskers CC</h3>
                  <div className="text-3xl font-bold text-[#1e3a8a]">156/3</div>
                  <div className="text-gray-600">28.4 overs</div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-gray-700 mb-2">{currentMatch.team2}</h3>
                  <div className="text-3xl font-bold text-gray-700">Yet to bat</div>
                  <div className="text-gray-600">0 overs</div>
                </div>
              </div>

              {/* Player Performance Entry */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-[#1e3a8a]">Player Performances</h3>
                  <button
                    onClick={addPlayerPerformance}
                    className="bg-[#1e3a8a] text-white px-4 py-2 rounded-lg hover:bg-[#1e40af] transition-colors"
                  >
                    Add Player
                  </button>
                </div>

                <div className="space-y-4">
                  {playerPerformances.map((performance, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Player</label>
                          <select
                            value={performance.playerId}
                            onChange={(e) => {
                              const player = players.find(p => p.id === parseInt(e.target.value));
                              updatePlayerPerformance(index, 'playerId', parseInt(e.target.value));
                              updatePlayerPerformance(index, 'playerName', player?.name || '');
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                          >
                            <option value={0}>Select Player</option>
                            {players.map(player => (
                              <option key={player.id} value={player.id}>{player.name}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Runs</label>
                          <input
                            type="number"
                            value={performance.runs}
                            onChange={(e) => updatePlayerPerformance(index, 'runs', parseInt(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Balls</label>
                          <input
                            type="number"
                            value={performance.balls}
                            onChange={(e) => updatePlayerPerformance(index, 'balls', parseInt(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">4s</label>
                          <input
                            type="number"
                            value={performance.fours}
                            onChange={(e) => updatePlayerPerformance(index, 'fours', parseInt(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">6s</label>
                          <input
                            type="number"
                            value={performance.sixes}
                            onChange={(e) => updatePlayerPerformance(index, 'sixes', parseInt(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Wickets</label>
                          <input
                            type="number"
                            value={performance.wickets}
                            onChange={(e) => updatePlayerPerformance(index, 'wickets', parseInt(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Overs</label>
                          <input
                            type="number"
                            step="0.1"
                            value={performance.overs}
                            onChange={(e) => updatePlayerPerformance(index, 'overs', parseFloat(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Runs Given</label>
                          <input
                            type="number"
                            value={performance.runsGiven}
                            onChange={(e) => updatePlayerPerformance(index, 'runsGiven', parseInt(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Live Score Widget for Homepage */}
            {isLive && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-xl font-bold text-[#1e3a8a] mb-4">Live Score Widget (For Homepage)</h3>
                <div className="bg-gradient-to-r from-[#1e3a8a] to-blue-600 text-white rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-bold">{currentMatch.matchName}</h4>
                    <div className="flex items-center bg-red-500 px-3 py-1 rounded-full text-sm">
                      <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
                      LIVE
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="text-lg font-semibold">Tuskers CC</div>
                      <div className="text-2xl font-bold">156/3 (28.4)</div>
                    </div>
                    <div>
                      <div className="text-lg font-semibold">{currentMatch.team2}</div>
                      <div className="text-xl">Yet to bat</div>
                    </div>
                  </div>

                  <div className="text-center">
                    <a 
                      href="/scoring/tuskers" 
                      className="bg-white text-[#1e3a8a] px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                    >
                      View Full Scorecard
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Match Summary Tab */}
        {activeTab === 'summary' && currentMatch && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-[#1e3a8a] mb-6">Match Summary</h2>
              
              <div className="space-y-6">
                <div className="bg-green-50 border-l-4 border-green-500 p-4">
                  <h3 className="font-bold text-green-800">Match Result</h3>
                  <p className="text-green-700">Tuskers CC won by 47 runs</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-bold text-[#1e3a8a] mb-3">Tuskers CC - 245/6 (50 overs)</h4>
                    <div className="space-y-2">
                      {playerPerformances.filter(p => p.runs > 0).map((player, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>{player.playerName}</span>
                          <span>{player.runs} ({player.balls})</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-gray-700 mb-3">{currentMatch.team2} - 198/9 (48.2 overs)</h4>
                    <div className="space-y-2">
                      {playerPerformances.filter(p => p.wickets > 0).map((player, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>{player.playerName}</span>
                          <span>{player.wickets}/{player.runsGiven} ({player.overs})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => window.print()}
                  className="w-full bg-[#1e3a8a] text-white py-3 px-4 rounded-lg font-semibold hover:bg-[#1e40af] transition-colors"
                >
                  <i className="fas fa-print mr-2"></i>
                  Print Official Scorecard
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}