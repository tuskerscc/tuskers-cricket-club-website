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
  recentOvers: string[];
  target?: number;
}

export default function FanScoring() {
  const [matchState, setMatchState] = useState<MatchState | null>(null);
  const [showSetup, setShowSetup] = useState(true);
  const { toast } = useToast();
  
  const [team1Name, setTeam1Name] = useState('');
  const [team2Name, setTeam2Name] = useState('');

  const initializeMatch = () => {
    if (!team1Name || !team2Name) {
      toast({ title: "Error", description: "Please enter both team names" });
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
        { name: 'Batsman 1', runs: 0, balls: 0, fours: 0, sixes: 0, isOut: false },
        { name: 'Batsman 2', runs: 0, balls: 0, fours: 0, sixes: 0, isOut: false }
      ],
      currentBowler: { name: 'Bowler 1', overs: 0, maidens: 0, runs: 0, wickets: 0 },
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
                Start Match
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
                <div className="text-sm text-gray-600">Over {matchState.overs}.{matchState.balls}</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600">Ball by Ball</div>
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
                <div key={index} className="grid grid-cols-7 gap-2 py-2 border-b border-gray-200">
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
                    {index === 0 && <span className="text-xs bg-yellow-100 px-1 rounded">*</span>}
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
                <button className="text-blue-600 text-sm">⊕</button>
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
            <div className="flex justify-center gap-3">
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
              <button className="px-4 py-2 rounded-full bg-blue-600 text-white font-semibold">→</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}