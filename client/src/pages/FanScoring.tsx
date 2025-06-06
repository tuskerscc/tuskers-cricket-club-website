import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'wouter';
import { ArrowLeft, Home, Plus, X, Clock } from 'lucide-react';

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
  format: '3-over' | '4-over' | '5-over' | 'T10' | 'T20' | 'ODI' | 'Custom';
  maxOvers: number;
  ballsPerOver: number;
  striker: 0 | 1;
  showDismissalModal: boolean;
  showBowlerModal: boolean;
  showBatsmanModal: boolean;
  showSecondInningsSetup: boolean;
  playersPerTeam: number;
  maxWickets: number;
  tossWinner: 1 | 2;
  tossDecision: 'bat' | 'bowl';
  isComplete: boolean;
  winningTeam?: string;
  winMargin?: string;
  playerOfMatch?: string;
  matchSummary?: {
    team1Score: string;
    team2Score: string;
    result: string;
    playerOfMatch: string;
    tossDetails: string;
  };
  showInningsBreak: boolean;
  inningsBreakDuration: number;
  inningsBreakTimer: number;
  inningsBreakStarted: boolean;
  firstInningsScore: string;
  firstInningsData?: {
    batsmen: Batsman[];
    dismissedBatsmen: Batsman[];
    bowlers: Bowler[];
    totalRuns: number;
    wickets: number;
    overs: number;
    balls: number;
  };
}

interface Tournament {
  id: string;
  name: string;
  type: 'knockout' | 'points';
  teams: string[];
  matches: TournamentMatch[];
  pointsTable?: PointsTableEntry[];
  currentStage: string;
}

interface TournamentMatch {
  id: string;
  team1: string;
  team2: string;
  stage: string;
  isComplete: boolean;
  result?: {
    winner: string;
    score1: string;
    score2: string;
    margin: string;
  };
}

interface PointsTableEntry {
  team: string;
  played: number;
  won: number;
  lost: number;
  tied: number;
  points: number;
  nrr: number;
  runsFor: number;
  runsConceded: number;
  oversPlayed: number;
}

export default function FanScoring() {
  const [matchState, setMatchState] = useState<MatchState | null>(null);
  const [showSetup, setShowSetup] = useState(true);
  const [showPlayerSetup, setShowPlayerSetup] = useState(false);
  const [team1Name, setTeam1Name] = useState('');
  const [team2Name, setTeam2Name] = useState('');
  const [selectedFormat, setSelectedFormat] = useState<'3-over' | '4-over' | '5-over' | 'T10' | 'T20' | 'ODI' | 'Custom'>('T20');
  const [customOvers, setCustomOvers] = useState(20);
  const [ballsPerOver, setBallsPerOver] = useState(6);
  const [playersPerTeam, setPlayersPerTeam] = useState(11);
  const [tossWinner, setTossWinner] = useState<1 | 2>(1);
  const [tossDecision, setTossDecision] = useState<'bat' | 'bowl'>('bat');
  const [batsman1Name, setBatsman1Name] = useState('');
  const [batsman2Name, setBatsman2Name] = useState('');
  const [bowlerName, setBowlerName] = useState('');
  const [secondInningsOpener1, setSecondInningsOpener1] = useState('');
  const [secondInningsOpener2, setSecondInningsOpener2] = useState('');
  const [secondInningsBowler, setSecondInningsBowler] = useState('');
  const [dismissalType, setDismissalType] = useState('');
  const [fielderName, setFielderName] = useState('');
  const [newBatsmanName, setNewBatsmanName] = useState('');
  const [newBowlerName, setNewBowlerName] = useState('');
  const [showMatchSummary, setShowMatchSummary] = useState(false);
  const [matchResult, setMatchResult] = useState<string>('');
  const [playerOfMatch, setPlayerOfMatch] = useState<string>('');
  const [showTournament, setShowTournament] = useState(false);
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [tournamentTeams, setTournamentTeams] = useState<string[]>([]);
  const [tournamentName, setTournamentName] = useState('');
  const [tournamentType, setTournamentType] = useState<'knockout' | 'points'>('knockout');
  const [teamsCount, setTeamsCount] = useState(4);
  const { toast } = useToast();

  // Timer for innings break
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (matchState?.showInningsBreak && matchState?.inningsBreakStarted && matchState?.inningsBreakTimer > 0) {
      interval = setInterval(() => {
        setMatchState(prev => {
          if (!prev) return prev;
          const newTimer = prev.inningsBreakTimer - 1;
          if (newTimer <= 0) {
            // Timer finished, show player setup for second innings
            return { ...prev, showInningsBreak: false, inningsBreakTimer: 0, inningsBreakStarted: false };
          }
          return { ...prev, inningsBreakTimer: newTimer };
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [matchState?.showInningsBreak, matchState?.inningsBreakStarted, matchState?.inningsBreakTimer]);

  const getMaxOvers = (format: '3-over' | '4-over' | '5-over' | 'T10' | 'T20' | 'ODI' | 'Custom') => {
    switch (format) {
      case '3-over': return 3;
      case '4-over': return 4;
      case '5-over': return 5;
      case 'T10': return 10;
      case 'T20': return 20;
      case 'ODI': return 50;
      case 'Custom': return customOvers;
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
    const isSecondInnings = matchState?.innings === 2;
    const requiredFields = isSecondInnings ? 
      (!batsman1Name || !bowlerName) : 
      (!batsman1Name || !batsman2Name || !bowlerName);
    
    if (requiredFields) {
      toast({ title: "Error", description: "Please enter all required player names" });
      return;
    }

    const maxOvers = getMaxOvers(selectedFormat);
    
    // Determine batting team based on toss decision
    const firstBattingTeam = tossDecision === 'bat' ? tossWinner : (tossWinner === 1 ? 2 : 1);
    
    setMatchState({
      team1: team1Name,
      team2: team2Name,
      battingTeam: firstBattingTeam,
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
      showSecondInningsSetup: false,
      playersPerTeam: playersPerTeam,
      maxWickets: playersPerTeam - 1,
      tossWinner: tossWinner,
      tossDecision: tossDecision,
      isComplete: false,
      ballsPerOver: ballsPerOver,
      showInningsBreak: false,
      inningsBreakDuration: 0,
      inningsBreakTimer: 0,
      inningsBreakStarted: false,
      firstInningsScore: ''
    });
    setShowPlayerSetup(false);
  };

  const switchStriker = (newState: MatchState) => {
    newState.striker = newState.striker === 0 ? 1 : 0;
  };

  const completeMatch = (winningTeam: string, margin: string) => {
    if (!matchState) return;
    
    // Auto-detect Man of the Match
    const autoDetectedPlayer = calculateManOfTheMatch();
    
    const summary = {
      team1Score: matchState.firstInningsData ? 
        `${matchState.firstInningsData.totalRuns}/${matchState.firstInningsData.wickets} (${matchState.firstInningsData.overs}.${matchState.firstInningsData.balls} overs)` :
        `${matchState.totalRuns}/${matchState.wickets} (${matchState.overs}.${matchState.balls} overs)`,
      team2Score: matchState.innings === 2 ? 
        `${matchState.totalRuns}/${matchState.wickets} (${matchState.overs}.${matchState.balls} overs)` :
        `Target ${matchState.target || 'N/A'}`,
      result: `${winningTeam} won by ${margin}`,
      playerOfMatch: autoDetectedPlayer,
      tossDetails: `${matchState.tossWinner === 1 ? matchState.team1 : matchState.team2} won the toss and chose to ${matchState.tossDecision}`
    };
    
    // Set the auto-detected player
    setPlayerOfMatch(autoDetectedPlayer);
    
    setMatchState(prev => prev ? { ...prev, isComplete: true, winningTeam, winMargin: margin, matchSummary: summary } : null);
    setShowMatchSummary(true);
  };

  const exportMatchReport = () => {
    if (!matchState || !matchState.matchSummary) return;
    
    const report = `
CRICKET MATCH REPORT
====================

Match: ${matchState.team1} vs ${matchState.team2}
Format: ${matchState.format}
Date: ${new Date().toLocaleDateString()}

TOSS
----
${matchState.matchSummary.tossDetails}

RESULT
------
${matchState.matchSummary.result}

SCORES
------
${matchState.matchSummary.team1Score}
${matchState.matchSummary.team2Score}

PLAYER OF THE MATCH
-------------------
${matchState.matchSummary.playerOfMatch}

BATTING SUMMARY
---------------
${matchState.dismissedBatsmen.map(b => `${b.name}: ${b.runs} (${b.balls}) [${b.fours}x4, ${b.sixes}x6] - ${b.dismissalType || 'Out'}`).join('\n')}

BOWLING SUMMARY
---------------
${matchState.bowlers.map(b => `${b.name}: ${b.overs}.0-${b.maidens}-${b.runs}-${b.wickets}`).join('\n')}

Generated by Tuskers CC Fan Scoring System
    `;
    
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${matchState.team1}_vs_${matchState.team2}_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const createTournament = () => {
    if (!tournamentName || tournamentTeams.length !== teamsCount) {
      toast({ title: "Error", description: `Please enter tournament name and all ${teamsCount} team names` });
      return;
    }
    
    const matches: TournamentMatch[] = [];
    let matchId = 1;
    
    if (tournamentType === 'knockout') {
      // Generate knockout matches
      for (let i = 0; i < tournamentTeams.length; i += 2) {
        if (i + 1 < tournamentTeams.length) {
          matches.push({
            id: `match_${matchId++}`,
            team1: tournamentTeams[i],
            team2: tournamentTeams[i + 1],
            stage: 'Round 1',
            isComplete: false
          });
        }
      }
    } else {
      // Generate round-robin matches
      for (let i = 0; i < tournamentTeams.length; i++) {
        for (let j = i + 1; j < tournamentTeams.length; j++) {
          matches.push({
            id: `match_${matchId++}`,
            team1: tournamentTeams[i],
            team2: tournamentTeams[j],
            stage: 'Group Stage',
            isComplete: false
          });
        }
      }
    }
    
    const newTournament: Tournament = {
      id: `tournament_${Date.now()}`,
      name: tournamentName,
      type: tournamentType,
      teams: [...tournamentTeams],
      matches,
      currentStage: tournamentType === 'knockout' ? 'Round 1' : 'Group Stage',
      pointsTable: tournamentType === 'points' ? tournamentTeams.map(team => ({
        team,
        played: 0,
        won: 0,
        lost: 0,
        tied: 0,
        points: 0,
        nrr: 0,
        runsFor: 0,
        runsConceded: 0,
        oversPlayed: 0
      })) : undefined
    };
    
    setTournament(newTournament);
    setShowTournament(false);
    toast({ title: "Tournament Created!", description: `${tournamentName} tournament with ${teamsCount} teams` });
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

  const selectInningsBreakDuration = (minutes: number) => {
    if (!matchState) return;
    
    setMatchState(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        inningsBreakDuration: minutes,
        inningsBreakTimer: minutes * 60, // Convert to seconds
        inningsBreakStarted: true
      };
    });
  };

  const startSecondInnings = () => {
    if (!matchState) return;
    
    setMatchState(prev => {
      if (!prev) return prev;
      
      const nextTeam = prev.battingTeam === 1 ? prev.team2 : prev.team1;
      
      return {
        ...prev,
        innings: 2,
        battingTeam: prev.battingTeam === 1 ? 2 : 1,
        totalRuns: 0,
        wickets: 0,
        overs: 0,
        balls: 0,
        batsmen: [
          { name: `${nextTeam} Batsman 1`, runs: 0, balls: 0, fours: 0, sixes: 0, isOut: false },
          { name: `${nextTeam} Batsman 2`, runs: 0, balls: 0, fours: 0, sixes: 0, isOut: false }
        ],
        currentBowler: { name: '', overs: 0, maidens: 0, runs: 0, wickets: 0 },
        bowlers: [],
        dismissedBatsmen: [],
        currentOver: [],
        recentOvers: [],
        striker: 0,
        showInningsBreak: false,
        showBatsmanModal: true
      };
    });
    
    setNewBatsmanName('');
    setBatsman1Name('');
    setBowlerName('');
  };

  const downloadMatchReport = () => {
    if (!matchState?.matchSummary) return;
    
    const firstInningsTeam = matchState.tossDecision === 'bat' ? 
      (matchState.tossWinner === 1 ? matchState.team1 : matchState.team2) :
      (matchState.tossWinner === 1 ? matchState.team2 : matchState.team1);
    
    const secondInningsTeam = matchState.tossDecision === 'bat' ? 
      (matchState.tossWinner === 1 ? matchState.team2 : matchState.team1) :
      (matchState.tossWinner === 1 ? matchState.team1 : matchState.team2);
    
    const reportContent = `
TUSKERS CC - MATCH REPORT
========================

Match Result: ${matchState.matchSummary.result}
Date: ${new Date().toLocaleDateString()}
Format: ${matchState.format.toUpperCase()} (${matchState.maxOvers} overs per side)

TOSS DETAILS:
------------
${matchState.matchSummary.tossDetails}

FINAL SCORES:
------------
${matchState.team1}: ${matchState.matchSummary.team1Score}
${matchState.team2}: ${matchState.matchSummary.team2Score}

FIRST INNINGS - ${firstInningsTeam}:
==================================
${matchState.firstInningsScore}

Current Batsmen:
${matchState.firstInningsData ? 
  [...matchState.firstInningsData.batsmen, ...matchState.firstInningsData.dismissedBatsmen]
    .filter(b => b.runs > 0 || b.balls > 0)
    .map(batsman => 
      `${batsman.name}: ${batsman.runs}${batsman.isOut ? '' : '*'} (${batsman.balls} balls, ${batsman.fours} fours, ${batsman.sixes} sixes)${batsman.isOut && batsman.dismissalType ? ' - ' + batsman.dismissalType : ''}`
    ).join('\n') : 
  'No batting data available'
}

Bowling Figures:
${matchState.firstInningsData ? 
  matchState.firstInningsData.bowlers.map(bowler => 
    `${bowler.name}: ${bowler.overs}.${Math.floor((bowler.overs % 1) * matchState.ballsPerOver)} overs, ${bowler.maidens} maidens, ${bowler.runs} runs, ${bowler.wickets} wickets`
  ).join('\n') : 
  'No bowling data available'
}

${matchState.innings === 2 ? `
SECOND INNINGS - ${secondInningsTeam}:
=====================================
Target: ${(matchState.target || 0)} runs

Current Batsmen:
${matchState.batsmen.map(batsman => 
  `${batsman.name}: ${batsman.runs}* (${batsman.balls} balls, ${batsman.fours} fours, ${batsman.sixes} sixes)`
).join('\n')}

Current Bowling:
${matchState.currentBowler.name}: ${matchState.currentBowler.overs}.${matchState.balls} overs, ${matchState.currentBowler.runs} runs, ${matchState.currentBowler.wickets} wickets

Runs Required: ${matchState.target ? Math.max(0, matchState.target - matchState.totalRuns) : 0} from ${(matchState.maxOvers - matchState.overs) * matchState.ballsPerOver - matchState.balls} balls
` : ''}

MAN OF THE MATCH:
================
${playerOfMatch || 'Not specified'}
The man of the match title is usually awarded to the player whose contribution is seen as the most critical in winning the game.

MATCH SUMMARY:
=============
Players per Team: ${matchState.playersPerTeam}
Balls per Over: ${matchState.ballsPerOver}
Match Duration: ${matchState.innings === 2 ? 'Two Innings' : 'One Innings'}

Generated by Tuskers CC Fan Scoring System
    `;
    
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `TuskersCC_Match_Report_${matchState.team1}_vs_${matchState.team2}_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Report Downloaded!",
      description: "Match report has been saved to your device."
    });
  };

  const addRuns = (runs: number) => {
    if (!matchState) return;
    
    const newState = { ...matchState };
    
    // In second innings, check if adding these runs would exceed target
    if (newState.innings === 2 && newState.totalRuns + runs >= newState.target!) {
      // Only add the exact runs needed to reach target
      const runsNeeded = newState.target! - newState.totalRuns;
      newState.totalRuns = newState.target!;
      newState.batsmen[newState.striker].runs += runsNeeded;
      newState.batsmen[newState.striker].balls++;
      newState.balls++;
      newState.currentBowler.runs += runsNeeded;
      
      if (runsNeeded === 4) {
        newState.batsmen[newState.striker].fours++;
        newState.currentOver.push('4');
      } else if (runsNeeded === 6) {
        newState.batsmen[newState.striker].sixes++;
        newState.currentOver.push('6');
      } else {
        newState.currentOver.push(runsNeeded.toString());
      }
      
      // Complete the match immediately
      const battingTeam = newState.battingTeam === 1 ? newState.team1 : newState.team2;
      const bowlingTeam = newState.battingTeam === 1 ? newState.team2 : newState.team1;
      const wicketsRemaining = newState.maxWickets - newState.wickets;
      
      newState.isComplete = true;
      newState.winningTeam = battingTeam;
      newState.winMargin = `${wicketsRemaining} wickets`;
      
      // Generate match summary
      newState.matchSummary = {
        team1Score: newState.battingTeam === 1 ? 
          `${newState.totalRuns}/${newState.wickets} (${newState.overs}.${newState.balls} overs)` :
          newState.firstInningsScore?.split(': ')[1] || '',
        team2Score: newState.battingTeam === 2 ? 
          `${newState.totalRuns}/${newState.wickets} (${newState.overs}.${newState.balls} overs)` :
          newState.firstInningsScore?.split(': ')[1] || '',
        result: `${battingTeam} wins by ${wicketsRemaining} wickets`,
        playerOfMatch: newState.batsmen.reduce((prev, current) => 
          prev.runs > current.runs ? prev : current
        ).name,
        tossDetails: `${newState.tossWinner === 1 ? newState.team1 : newState.team2} won the toss and chose to ${newState.tossDecision}`
      };
      
      // Update bowler in bowlers array before completing
      const bowlerIndex = newState.bowlers.findIndex(b => b.name === newState.currentBowler.name);
      if (bowlerIndex !== -1) {
        newState.bowlers[bowlerIndex] = { ...newState.currentBowler };
      }
      
      toast({ 
        title: "Match Complete!", 
        description: `${battingTeam} wins by ${wicketsRemaining} wickets!` 
      });
      
      setMatchState(newState);
      setShowMatchSummary(true);
      return;
    }
    
    // Normal run scoring for first innings or when target not reached
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
    if (newState.balls === newState.ballsPerOver) {
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
          newState.showSecondInningsSetup = true;
        } else {
          // Second innings complete due to overs limit
          const battingTeam = newState.battingTeam === 1 ? newState.team1 : newState.team2;
          const bowlingTeam = newState.battingTeam === 1 ? newState.team2 : newState.team1;
          
          if (newState.totalRuns >= newState.target!) {
            const wicketsRemaining = newState.maxWickets - newState.wickets;
            completeMatch(battingTeam, `${wicketsRemaining} wickets`);
          } else {
            const runsShort = newState.target! - newState.totalRuns - 1;
            completeMatch(bowlingTeam, `${runsShort} runs`);
          }
          return;
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
    
    if (newState.balls === newState.ballsPerOver) {
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
          newState.showSecondInningsSetup = true;
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
    
    // Check if team is all out
    if (newState.wickets >= newState.maxWickets) {
      // Team is all out - end innings
      if (newState.innings === 1) {
        // Start second innings automatically
        newState.innings = 2;
        newState.battingTeam = newState.battingTeam === 1 ? 2 : 1;
        newState.target = newState.totalRuns + 1;
        const nextTeam = newState.battingTeam === 1 ? newState.team1 : newState.team2;
        const prevTeam = newState.battingTeam === 1 ? newState.team2 : newState.team1;
        
        toast({ 
          title: "All Out!", 
          description: `${prevTeam} all out for ${newState.totalRuns}. ${nextTeam} needs ${newState.target} to win.` 
        });
        
        // Save first innings data before clearing
        saveFirstInningsData(newState);
        
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
        newState.showSecondInningsSetup = true;
      } else {
        // Match complete - second team all out
        const winningTeam = newState.battingTeam === 1 ? newState.team2 : newState.team1;
        const losingTeam = newState.battingTeam === 1 ? newState.team1 : newState.team2;
        const margin = `${(newState.target || 0) - newState.totalRuns - 1} runs`;
        
        newState.isComplete = true;
        newState.winningTeam = winningTeam;
        newState.winMargin = margin;
        
        toast({ 
          title: "Match Complete!", 
          description: `${losingTeam} all out for ${newState.totalRuns}. ${winningTeam} wins by ${margin}!` 
        });
        
        setTimeout(() => {
          completeMatch(winningTeam, margin);
        }, 2000);
      }
    } else {
      // Show batsman selection modal if more wickets available
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
      // Wide balls and no-balls: Don't increment balls, don't give runs to batsman, don't rotate strike
      newState.currentOver.push(`${type.charAt(0).toUpperCase()}${runs > 1 ? runs : ''}`);
      // No striker rotation for wides and no-balls regardless of runs
    } else {
      // Byes and leg-byes: increment balls, don't give runs to batsman, but can rotate strike
      newState.balls++;
      newState.batsmen[newState.striker].balls++;
      newState.currentOver.push(`${type === 'bye' ? 'b' : 'lb'}${runs > 1 ? runs : ''}`);
      
      // Switch striker for odd runs (only for byes and leg-byes)
      if (runs % 2 === 1) {
        switchStriker(newState);
      }
    }
    
    // Handle over completion (only for byes and leg-byes)
    if ((type === 'bye' || type === 'legbye') && newState.balls === newState.ballsPerOver) {
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
          newState.showSecondInningsSetup = true;
        } else {
          // Second innings complete due to overs limit (addExtra function)
          const battingTeam = newState.battingTeam === 1 ? newState.team1 : newState.team2;
          const bowlingTeam = newState.battingTeam === 1 ? newState.team2 : newState.team1;
          
          if (newState.totalRuns >= newState.target!) {
            const wicketsRemaining = newState.maxWickets - newState.wickets;
            completeMatch(battingTeam, `${wicketsRemaining} wickets`);
          } else {
            const runsShort = newState.target! - newState.totalRuns - 1;
            completeMatch(bowlingTeam, `${runsShort} runs`);
          }
          return;
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

  const handleSecondInningsSetup = () => {
    if (!matchState || !secondInningsOpener1 || !secondInningsOpener2 || !secondInningsBowler) {
      toast({ title: "Error", description: "Please enter both opener names and bowler name" });
      return;
    }
    
    const newState = { ...matchState };
    newState.batsmen = [
      { name: secondInningsOpener1, runs: 0, balls: 0, fours: 0, sixes: 0, isOut: false },
      { name: secondInningsOpener2, runs: 0, balls: 0, fours: 0, sixes: 0, isOut: false }
    ];
    newState.currentBowler = { name: secondInningsBowler, overs: 0, maidens: 0, runs: 0, wickets: 0 };
    newState.bowlers = [{ name: secondInningsBowler, overs: 0, maidens: 0, runs: 0, wickets: 0 }];
    newState.showSecondInningsSetup = false;
    newState.striker = 0;
    
    setMatchState(newState);
    setSecondInningsOpener1('');
    setSecondInningsOpener2('');
    setSecondInningsBowler('');
  };

  const saveFirstInningsData = (state: MatchState) => {
    // Store first innings data before clearing it
    state.firstInningsData = {
      batsmen: [...state.batsmen],
      dismissedBatsmen: [...state.dismissedBatsmen],
      bowlers: [...state.bowlers],
      totalRuns: state.totalRuns,
      wickets: state.wickets,
      overs: state.overs,
      balls: state.balls
    };
  };

  const calculateManOfTheMatch = (): string => {
    if (!matchState) return '';
    
    const allPlayers: { name: string; score: number; role: string }[] = [];
    
    // First innings players
    if (matchState.firstInningsData) {
      // Batting performances
      [...matchState.firstInningsData.batsmen, ...matchState.firstInningsData.dismissedBatsmen].forEach(batsman => {
        if (batsman.runs > 0 || batsman.balls > 0) {
          const strikeRate = batsman.balls > 0 ? (batsman.runs / batsman.balls) * 100 : 0;
          const boundaries = batsman.fours + batsman.sixes;
          let score = batsman.runs * 1.5; // Base runs
          if (strikeRate > 150) score += 10; // High strike rate bonus
          if (batsman.runs >= 50) score += 20; // Half century bonus
          if (batsman.runs >= 100) score += 30; // Century bonus
          score += boundaries * 2; // Boundary bonus
          
          allPlayers.push({ name: batsman.name, score, role: 'Batsman' });
        }
      });
      
      // Bowling performances
      matchState.firstInningsData.bowlers.forEach(bowler => {
        if (bowler.overs > 0) {
          let score = bowler.wickets * 15; // Base wickets
          const economy = bowler.overs > 0 ? bowler.runs / bowler.overs : 999;
          if (economy < 4) score += 15; // Good economy bonus
          if (economy < 2) score += 10; // Excellent economy bonus
          if (bowler.wickets >= 3) score += 15; // 3+ wickets bonus
          if (bowler.wickets >= 5) score += 25; // 5+ wickets bonus
          score += bowler.maidens * 5; // Maiden bonus
          
          allPlayers.push({ name: bowler.name, score, role: 'Bowler' });
        }
      });
    }
    
    // Second innings players (current)
    if (matchState.innings === 2) {
      // Current batting
      [...matchState.batsmen, ...matchState.dismissedBatsmen].forEach(batsman => {
        if (batsman.runs > 0 || batsman.balls > 0) {
          const strikeRate = batsman.balls > 0 ? (batsman.runs / batsman.balls) * 100 : 0;
          const boundaries = batsman.fours + batsman.sixes;
          let score = batsman.runs * 1.5;
          if (strikeRate > 150) score += 10;
          if (batsman.runs >= 50) score += 20;
          if (batsman.runs >= 100) score += 30;
          score += boundaries * 2;
          
          // Winning contribution bonus
          if (matchState.isComplete && matchState.totalRuns >= (matchState.target || 0)) {
            score += 10; // Winning team bonus
          }
          
          allPlayers.push({ name: batsman.name, score, role: 'Batsman' });
        }
      });
      
      // Current bowling
      matchState.bowlers.forEach(bowler => {
        if (bowler.overs > 0) {
          let score = bowler.wickets * 15;
          const economy = bowler.overs > 0 ? bowler.runs / bowler.overs : 999;
          if (economy < 4) score += 15;
          if (economy < 2) score += 10;
          if (bowler.wickets >= 3) score += 15;
          if (bowler.wickets >= 5) score += 25;
          score += bowler.maidens * 5;
          
          allPlayers.push({ name: bowler.name, score, role: 'Bowler' });
        }
      });
    }
    
    // Find highest scoring player
    if (allPlayers.length === 0) return '';
    
    allPlayers.sort((a, b) => b.score - a.score);
    return allPlayers[0].name;
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
            {!matchState || matchState?.innings === 1 ? (
              <>
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
              </>
            ) : (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">New Batsman</label>
                <input
                  type="text"
                  value={batsman1Name}
                  onChange={(e) => setBatsman1Name(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter new batsman name"
                />
                <p className="text-sm text-gray-500 mt-2">One batsman will continue from the previous innings</p>
              </div>
            )}

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
            <div className="flex justify-between items-center mb-8">
              <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-[#1e3a8a] transition-colors">
                <i className="fas fa-home text-lg"></i>
                <span className="font-medium">Home</span>
              </Link>
              <div className="text-center flex-1">
                <h1 className="text-3xl font-bold text-[#1e3a8a] mb-2">Fan Cricket Scoring</h1>
                <p className="text-gray-600">Set up your match and start scoring!</p>
              </div>
              <div className="w-16"></div> {/* Spacer for center alignment */}
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
                  onChange={(e) => setSelectedFormat(e.target.value as any)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="3-over">3 Overs</option>
                  <option value="4-over">4 Overs</option>
                  <option value="5-over">5 Overs</option>
                  <option value="T10">T10</option>
                  <option value="T20">T20</option>
                  <option value="ODI">ODI</option>
                  <option value="Custom">Custom</option>
                </select>
              </div>

              {selectedFormat === 'Custom' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Number of Overs</label>
                    <input
                      type="number"
                      value={customOvers}
                      onChange={(e) => setCustomOvers(Number(e.target.value))}
                      min="1"
                      max="50"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter overs (1-50)"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Balls per Over</label>
                    <select
                      value={ballsPerOver}
                      onChange={(e) => setBallsPerOver(Number(e.target.value))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value={4}>4 Balls</option>
                      <option value={5}>5 Balls</option>
                      <option value={6}>6 Balls</option>
                      <option value={8}>8 Balls</option>
                    </select>
                  </div>
                </div>
              )}

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

              {/* Toss Selection */}
              <div className="space-y-4 p-4 bg-gray-50 rounded-xl">
                <h3 className="font-semibold text-gray-700">Toss Details</h3>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Toss Winner</label>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setTossWinner(1)}
                      className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                        tossWinner === 1 
                          ? 'bg-[#1e3a8a] text-white' 
                          : 'bg-white text-gray-700 border border-gray-300'
                      }`}
                    >
                      {team1Name || 'Team 1'}
                    </button>
                    <button
                      onClick={() => setTossWinner(2)}
                      className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                        tossWinner === 2 
                          ? 'bg-[#1e3a8a] text-white' 
                          : 'bg-white text-gray-700 border border-gray-300'
                      }`}
                    >
                      {team2Name || 'Team 2'}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Toss Decision</label>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setTossDecision('bat')}
                      className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                        tossDecision === 'bat' 
                          ? 'bg-[#1e3a8a] text-white' 
                          : 'bg-white text-gray-700 border border-gray-300'
                      }`}
                    >
                      Bat First
                    </button>
                    <button
                      onClick={() => setTossDecision('bowl')}
                      className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                        tossDecision === 'bowl' 
                          ? 'bg-[#1e3a8a] text-white' 
                          : 'bg-white text-gray-700 border border-gray-300'
                      }`}
                    >
                      Bowl First
                    </button>
                  </div>
                </div>
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
            className="flex items-center gap-2 text-white hover:bg-blue-700 px-3 py-2 rounded-lg transition-colors"
          >
            <i className="fas fa-home text-sm"></i>
            <span>Back to Home</span>
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
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
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
                      Need: {Math.max(0, matchState.target - matchState.totalRuns)} runs in {((matchState.maxOvers - matchState.overs) * matchState.ballsPerOver - matchState.balls)} balls
                    </div>
                    <div className="text-red-600 font-semibold">
                      RRR: {(() => {
                        const ballsLeft = (matchState.maxOvers - matchState.overs) * matchState.ballsPerOver - matchState.balls;
                        const runsNeeded = matchState.target - matchState.totalRuns;
                        const oversLeft = ballsLeft / matchState.ballsPerOver;
                        return oversLeft > 0 ? (runsNeeded / oversLeft).toFixed(2) : '0.00';
                      })()}
                    </div>
                  </div>
                )}
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{matchState.totalRuns}/{matchState.wickets}</div>
                <div className="text-sm text-gray-600">Over {matchState.overs}.{matchState.balls} / {matchState.maxOvers}</div>
                <div className="text-xs text-blue-600 font-semibold">{matchState.format} Format • {matchState.playersPerTeam} players</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600">Ball by Ball</div>
                <div className="text-xs text-green-600">CRR: {matchState.overs > 0 || matchState.balls > 0 ? (matchState.totalRuns / (matchState.overs + matchState.balls/matchState.ballsPerOver)).toFixed(2) : '0.00'}</div>
                <div className="text-xs text-gray-500">Innings {matchState.innings}</div>
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
                          newState.showSecondInningsSetup = true;
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

        {/* Second Innings Setup Modal */}
        {matchState?.showSecondInningsSetup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Second Innings Setup</h3>
              <p className="text-sm text-gray-600 mb-6">Enter opponent openers and bowler names</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Opener 1</label>
                  <input
                    type="text"
                    value={secondInningsOpener1}
                    onChange={(e) => setSecondInningsOpener1(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="Enter first opener name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Opener 2</label>
                  <input
                    type="text"
                    value={secondInningsOpener2}
                    onChange={(e) => setSecondInningsOpener2(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="Enter second opener name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Opening Bowler</label>
                  <input
                    type="text"
                    value={secondInningsBowler}
                    onChange={(e) => setSecondInningsBowler(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="Enter bowler name"
                  />
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={handleSecondInningsSetup}
                    disabled={!secondInningsOpener1 || !secondInningsOpener2 || !secondInningsBowler}
                    className="flex-1 bg-green-600 text-white py-2 rounded-lg font-semibold disabled:bg-gray-300"
                  >
                    Start Second Innings
                  </button>
                  <button
                    onClick={() => {
                      const newState = {...matchState};
                      newState.showSecondInningsSetup = false;
                      setMatchState(newState);
                      setSecondInningsOpener1('');
                      setSecondInningsOpener2('');
                      setSecondInningsBowler('');
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

        {/* Tournament Setup Modal */}
        {showTournament && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Create Tournament</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Tournament Name</label>
                  <input
                    type="text"
                    value={tournamentName}
                    onChange={(e) => setTournamentName(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="Enter tournament name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Tournament Type</label>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setTournamentType('knockout')}
                      className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                        tournamentType === 'knockout' 
                          ? 'bg-[#1e3a8a] text-white' 
                          : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      Knockout
                    </button>
                    <button
                      onClick={() => setTournamentType('points')}
                      className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                        tournamentType === 'points' 
                          ? 'bg-[#1e3a8a] text-white' 
                          : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      Points Table
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Number of Teams</label>
                  <select
                    value={teamsCount}
                    onChange={(e) => {
                      const count = Number(e.target.value);
                      setTeamsCount(count);
                      setTournamentTeams(Array(count).fill(''));
                    }}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value={4}>4 Teams</option>
                    <option value={6}>6 Teams</option>
                    <option value={8}>8 Teams</option>
                    <option value={10}>10 Teams</option>
                    <option value={12}>12 Teams</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Team Names</label>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {Array(teamsCount).fill(0).map((_, index) => (
                      <input
                        key={index}
                        type="text"
                        value={tournamentTeams[index] || ''}
                        onChange={(e) => {
                          const newTeams = [...tournamentTeams];
                          newTeams[index] = e.target.value;
                          setTournamentTeams(newTeams);
                        }}
                        className="w-full px-3 py-2 border rounded-lg"
                        placeholder={`Team ${index + 1} name`}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={createTournament}
                    className="flex-1 bg-green-600 text-white py-2 rounded-lg font-semibold"
                  >
                    Create Tournament
                  </button>
                  <button
                    onClick={() => setShowTournament(false)}
                    className="flex-1 bg-gray-600 text-white py-2 rounded-lg font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Match Summary Modal */}
        {showMatchSummary && matchState?.matchSummary && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Match Summary</h3>
              
              <div className="space-y-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Result</h4>
                  <p className="text-blue-700">{matchState.matchSummary.result}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-2">Scores</h4>
                    <p className="text-gray-700">{matchState.matchSummary.team1Score}</p>
                    <p className="text-gray-700">{matchState.matchSummary.team2Score}</p>
                  </div>

                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-yellow-800 mb-2">Man of the Match</h4>
                    <p className="text-sm text-yellow-700 mb-3">The man of the match title is usually awarded to the player whose contribution is seen as the most critical in winning the game.</p>
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={playerOfMatch}
                        onChange={(e) => setPlayerOfMatch(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg"
                        placeholder="Enter player name"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Toss Details</h4>
                  <p className="text-green-700">{matchState.matchSummary.tossDetails}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-purple-800 mb-2">Batting Summary</h4>
                    <div className="space-y-1 text-sm">
                      {matchState.dismissedBatsmen.map((batsman, index) => (
                        <p key={index} className="text-purple-700">
                          {batsman.name}: {batsman.runs}({batsman.balls}) [{batsman.fours}x4, {batsman.sixes}x6]
                        </p>
                      ))}
                    </div>
                  </div>

                  <div className="bg-orange-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-orange-800 mb-2">Bowling Summary</h4>
                    <div className="space-y-1 text-sm">
                      {matchState.bowlers.map((bowler, index) => (
                        <p key={index} className="text-orange-700">
                          {bowler.name}: {bowler.overs}.0-{bowler.maidens}-{bowler.runs}-{bowler.wickets}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={downloadMatchReport}
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-semibold"
                  >
                    Download Report
                  </button>
                  <button
                    onClick={() => setShowMatchSummary(false)}
                    className="flex-1 bg-gray-600 text-white py-2 rounded-lg font-semibold"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Innings Break Screen */}
        {matchState?.showInningsBreak && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">First Innings Complete!</h2>
                <p className="text-gray-600 mb-4">{matchState.firstInningsScore}</p>
                
                {!matchState.inningsBreakStarted ? (
                  <div>
                    <p className="text-lg font-semibold text-gray-700 mb-4">Select Innings Break Duration</p>
                    <div className="grid grid-cols-3 gap-3 mb-6">
                      {[5, 10, 15, 20, 25, 30].map(minutes => (
                        <button
                          key={minutes}
                          onClick={() => selectInningsBreakDuration(minutes)}
                          className="py-3 px-4 bg-blue-100 text-blue-800 rounded-lg font-semibold hover:bg-blue-200 transition-colors"
                        >
                          {minutes}m
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div>
                    {matchState.inningsBreakTimer > 0 ? (
                      <div>
                        <p className="text-lg font-semibold text-gray-700 mb-4">Innings Break</p>
                        <div className="text-4xl font-bold text-blue-600 mb-4">
                          {Math.floor(matchState.inningsBreakTimer / 60)}:{(matchState.inningsBreakTimer % 60).toString().padStart(2, '0')}
                        </div>
                        <p className="text-gray-600 mb-6">Break Duration: {matchState.inningsBreakDuration} minutes</p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-lg font-semibold text-green-600 mb-4">Break Time Complete!</p>
                        <button
                          onClick={startSecondInnings}
                          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                        >
                          Start Second Innings
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tournament Display */}
        {tournament && (
          <div className="fixed top-4 right-4 bg-white rounded-xl shadow-lg p-4 w-80 max-h-96 overflow-y-auto z-40">
            <h3 className="font-bold text-gray-800 mb-3">{tournament.name}</h3>
            <p className="text-sm text-gray-600 mb-3">
              {tournament.type === 'knockout' ? 'Knockout Tournament' : 'Points Tournament'} • {tournament.teams.length} Teams
            </p>

            {tournament.type === 'points' && tournament.pointsTable && (
              <div className="mb-4">
                <h4 className="font-semibold text-gray-700 mb-2">Points Table</h4>
                <div className="text-xs">
                  <div className="grid grid-cols-8 gap-1 font-semibold text-gray-600 mb-1">
                    <span>Team</span>
                    <span>P</span>
                    <span>W</span>
                    <span>L</span>
                    <span>T</span>
                    <span>Pts</span>
                    <span>NRR</span>
                  </div>
                  {tournament.pointsTable
                    .sort((a, b) => b.points - a.points || b.nrr - a.nrr)
                    .map((entry, index) => (
                    <div key={entry.team} className="grid grid-cols-8 gap-1 py-1 border-b">
                      <span className="truncate">{entry.team}</span>
                      <span>{entry.played}</span>
                      <span>{entry.won}</span>
                      <span>{entry.lost}</span>
                      <span>{entry.tied}</span>
                      <span>{entry.points}</span>
                      <span>{entry.nrr.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-4">
              <h4 className="font-semibold text-gray-700 mb-2">Fixtures</h4>
              <div className="space-y-2 text-sm">
                {tournament.matches
                  .filter(match => !match.isComplete)
                  .slice(0, 3)
                  .map(match => (
                  <div key={match.id} className="bg-gray-50 p-2 rounded">
                    <p className="font-medium">{match.team1} vs {match.team2}</p>
                    <p className="text-xs text-gray-600">{match.stage}</p>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setTournament(null)}
              className="w-full bg-red-600 text-white py-1 rounded text-sm"
            >
              Close Tournament
            </button>
          </div>
        )}
      </div>

      {/* Main Action Buttons */}
      <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-30">
        {!matchState && (
          <button
            onClick={() => setShowTournament(true)}
            className="bg-purple-600 text-white px-4 py-2 rounded-full font-semibold shadow-lg hover:bg-purple-700 transition-colors"
          >
            Create Tournament
          </button>
        )}
        
        {matchState && matchState.isComplete && (
          <button
            onClick={() => setShowMatchSummary(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-full font-semibold shadow-lg hover:bg-green-700 transition-colors"
          >
            View Summary
          </button>
        )}
      </div>
    </div>
  );
}