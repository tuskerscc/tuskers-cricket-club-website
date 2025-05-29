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
  recentOvers: string[];
  currentOver: string[];
  target?: number;
  format: '5-over' | 'T10' | 'T20' | 'ODI';
  maxOvers: number;
  striker: 0 | 1;
  showDismissalModal: boolean;
  showBowlerModal: boolean;
  showBatsmanModal: boolean;
}

export default function FanScoring() {
  const [matchState, setMatchState] = useState<MatchState | null>(null);
  const [showSetup, setShowSetup] = useState(true);
  const { toast } = useToast();
  
  const [team1Name, setTeam1Name] = useState('');
  const [team2Name, setTeam2Name] = useState('');
  const [selectedFormat, setSelectedFormat] = useState<'5-over' | 'T10' | 'T20' | 'ODI'>('T20');
  const [dismissalType, setDismissalType] = useState('');
  const [fielderName, setFielderName] = useState('');
  const [newBowlerName, setNewBowlerName] = useState('');
  const [newBatsmanName, setNewBatsmanName] = useState('');

  const getMaxOvers = (format: string) => {
    switch(format) {
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
        { name: 'Batsman 1', runs: 0, balls: 0, fours: 0, sixes: 0, isOut: false },
        { name: 'Batsman 2', runs: 0, balls: 0, fours: 0, sixes: 0, isOut: false }
      ],
      currentBowler: { name: 'Bowler 1', overs: 0, maidens: 0, runs: 0, wickets: 0 },
      bowlers: [{ name: 'Bowler 1', overs: 0, maidens: 0, runs: 0, wickets: 0 }],
      recentOvers: [],
      currentOver: [],
      format: selectedFormat,
      maxOvers: maxOvers,
      striker: 0,
      showDismissalModal: false,
      showBowlerModal: false,
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
        name: `Batsman ${newState.wickets + 2}`,
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
      newState.currentOver.push(runs.toString());
      
      if (runs === 4) newState.batsmen[newState.striker].fours++;
      if (runs === 6) newState.batsmen[newState.striker].sixes++;
      
      // Switch striker on odd runs
      if (runs % 2 === 1) {
        switchStriker(newState);
      }
      
      // End of over
      if (newState.balls === 6) {
        newState.overs++;
        newState.balls = 0;
        newState.currentBowler.overs++;
        newState.recentOvers.unshift(newState.currentOver.join(' '));
        newState.currentOver = [];
        switchStriker(newState); // Switch striker at end of over
        
        // Show bowler selection modal for new over
        newState.showBowlerModal = true;
      }
    }
    
    newState.currentBowler.runs += runs;
    
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
    newState.wickets++;
    newState.balls++;
    newState.currentBowler.wickets++;
    newState.batsmen[newState.striker].isOut = true;
    newState.batsmen[newState.striker].dismissalType = dismissalType;
    newState.currentOver.push('W');
    
    if (newState.balls === 6) {
      newState.overs++;
      newState.balls = 0;
      newState.currentBowler.overs++;
      newState.recentOvers.unshift(newState.currentOver.join(' '));
      newState.currentOver = [];
      switchStriker(newState);
      newState.showBowlerModal = true;
    }
    
    // Show batsman selection modal if wickets < 10
    if (newState.wickets < 10) {
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

  const handleNewBowler = () => {
    if (!matchState || !newBowlerName) return;
    
    const newState = { ...matchState };
    changeBowler(newBowlerName);
    newState.showBowlerModal = false;
    setMatchState(newState);
    setNewBowlerName('');
  };

  const handleNewBatsman = () => {
    if (!matchState || !newBatsmanName) return;
    
    const newState = { ...matchState };
    const outBatsmanIndex = newState.batsmen.findIndex(b => b.isOut);
    if (outBatsmanIndex !== -1) {
      newState.batsmen[outBatsmanIndex] = {
        name: newBatsmanName,
        runs: 0,
        balls: 0,
        fours: 0,
        sixes: 0,
        isOut: false
      };
      newState.striker = outBatsmanIndex as 0 | 1;
    }
    newState.showBatsmanModal = false;
    setMatchState(newState);
    setNewBatsmanName('');
  };

  const generateMatchReport = () => {
    if (!matchState) return;

    const reportContent = `
CRICKET MATCH REPORT
===================

Match: ${matchState.team1} vs ${matchState.team2}
Format: ${matchState.format}
Date: ${new Date().toLocaleDateString()}

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

MATCH SUMMARY:
Total Runs: ${matchState.totalRuns}
Wickets Lost: ${matchState.wickets}
Overs Bowled: ${matchState.overs}.${matchState.balls}
Run Rate: ${matchState.overs > 0 ? (matchState.totalRuns / (matchState.overs + matchState.balls/6)).toFixed(2) : '0.00'}

Generated by Tuskers CC Fan Scoring System
    `;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${matchState.team1}_vs_${matchState.team2}_${matchState.format}_report.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({ title: "Report Downloaded", description: "Match report saved successfully!" });
  };

  if (showSetup) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
        <div className="container mx-auto px-4 max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-[#1e3a8a] mb-2">Cricket Scorecard</h1>
              <p className="text-gray-600">Setup your match</p>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Match Format</label>
                <select
                  value={selectedFormat}
                  onChange={(e) => setSelectedFormat(e.target.value as '5-over' | 'T10' | 'T20' | 'ODI')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="5-over">5 Overs</option>
                  <option value="T10">T10 (10 overs)</option>
                  <option value="T20">T20 (20 overs)</option>
                  <option value="ODI">ODI (50 overs)</option>
                </select>
              </div>

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
                <div className="text-xs text-blue-600 font-semibold">{matchState.format} Format</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600">Ball by Ball</div>
                <div className="text-xs text-green-600">RR: {matchState.overs > 0 ? (matchState.totalRuns / (matchState.overs + matchState.balls/6)).toFixed(2) : '0.00'}</div>
              </div>
            </div>
          </div>

          {/* Batsmen Stats */}
          <div className="p-4 border-b bg-gray-50">
            <div className="text-sm text-gray-600 mb-2">{matchState.battingTeam === 1 ? matchState.team1 : matchState.team2} won the toss and elected to bat</div>
            
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
                    <input
                      type="text"
                      value={batsman.name}
                      onChange={(e) => {
                        const newState = {...matchState};
                        newState.batsmen[index].name = e.target.value;
                        setMatchState(newState);
                      }}
                      className="text-sm border rounded px-2 py-1 w-full"
                    />
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

          {/* Current Over Progress */}
          <div className="p-4 border-b">
            <div className="text-xs font-semibold text-gray-500 mb-2">CURRENT OVER ({matchState.overs + 1})</div>
            <div className="flex gap-1 mb-4">
              {matchState.currentOver.map((ball, index) => (
                <div key={index} className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                  ball === 'W' ? 'bg-red-500 text-white border-red-500' : 
                  ball === '4' ? 'bg-green-500 text-white border-green-500' : 
                  ball === '6' ? 'bg-blue-500 text-white border-blue-500' : 
                  'bg-gray-100 border-gray-300'
                }`}>
                  {ball}
                </div>
              ))}
              {Array.from({length: 6 - matchState.currentOver.length}).map((_, index) => (
                <div key={`empty-${index}`} className="w-8 h-8 border border-gray-300 rounded-full"></div>
              ))}
            </div>
          </div>

          {/* Recent Overs */}
          <div className="p-4 space-y-3">
            <div className="text-xs font-semibold text-gray-500 mb-2">RECENT OVERS</div>
            {matchState.recentOvers.slice(0, 3).map((over, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm font-semibold">Over {matchState.overs - index}</span>
                <div className="flex gap-1">
                  {over.split(' ').map((ball, ballIndex) => (
                    <div key={ballIndex} className={`w-6 h-6 rounded text-xs flex items-center justify-center ${
                      ball === 'W' ? 'bg-red-100 text-red-800' : 
                      ball === '4' ? 'bg-green-100 text-green-800' : 
                      ball === '6' ? 'bg-blue-100 text-blue-800' : 
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {ball}
                    </div>
                  ))}
                </div>
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
                📄 DOWNLOAD REPORT
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

        {/* Dismissal Modal */}
        {matchState.showDismissalModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
              <h3 className="text-xl font-bold text-red-600 mb-4">Wicket!</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">How was {matchState.batsmen[matchState.striker].name} dismissed?</label>
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
            <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
              <h3 className="text-xl font-bold text-blue-600 mb-4">Over Complete!</h3>
              <div className="space-y-4">
                <p className="text-gray-600">Select bowler for the new over:</p>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Bowler Name</label>
                  <input
                    type="text"
                    value={newBowlerName}
                    onChange={(e) => setNewBowlerName(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="Enter bowler name"
                  />
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-2">Or select from previous bowlers:</p>
                  <div className="space-y-1">
                    {matchState.bowlers.map((bowler, index) => (
                      <button
                        key={index}
                        onClick={() => setNewBowlerName(bowler.name)}
                        className="w-full text-left px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded"
                      >
                        {bowler.name} ({bowler.overs}-{bowler.maidens}-{bowler.runs}-{bowler.wickets})
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleNewBowler}
                  disabled={!newBowlerName}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold disabled:bg-gray-300"
                >
                  Start New Over
                </button>
              </div>
            </div>
          </div>
        )}

        {/* New Batsman Modal */}
        {matchState.showBatsmanModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
              <h3 className="text-xl font-bold text-green-600 mb-4">New Batsman</h3>
              <div className="space-y-4">
                <p className="text-gray-600">Enter the name of the new batsman:</p>
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

                <button
                  onClick={handleNewBatsman}
                  disabled={!newBatsmanName}
                  className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold disabled:bg-gray-300"
                >
                  Add Batsman
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}