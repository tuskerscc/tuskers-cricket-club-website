import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import type { Player, PlayerStats } from '@shared/schema';

interface PlayerWithStats extends Player {
  stats?: PlayerStats;
}

export default function PlayerAnalytics() {
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerWithStats | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'batting' | 'bowling' | 'fielding'>('overview');

  const { data: players = [] } = useQuery<PlayerWithStats[]>({
    queryKey: ['/api/players']
  });

  const playersWithStats = players.filter(player => player.stats);

  // Performance metrics for charts
  const getPlayerPerformanceData = (player: PlayerWithStats) => {
    if (!player.stats) return null;

    const batting = [
      { name: 'Matches', value: player.stats.matches || 0 },
      { name: 'Runs', value: player.stats.runsScored || 0 },
      { name: 'Fours', value: player.stats.fours || 0 },
      { name: 'Sixes', value: player.stats.sixes || 0 }
    ];

    const bowling = [
      { name: 'Wickets', value: player.stats.wicketsTaken || 0 },
      { name: 'Balls Bowled', value: player.stats.ballsBowled || 0 },
      { name: 'Runs Conceded', value: player.stats.runsConceded || 0 },
      { name: 'Economy', value: player.stats.ballsBowled ? ((player.stats.runsConceded || 0) / ((player.stats.ballsBowled || 1) / 6)).toFixed(2) : 0 }
    ];

    const fielding = [
      { name: 'Catches', value: player.stats.catches || 0 },
      { name: 'Runouts', value: player.stats.runOuts || 0 },
      { name: 'Stumpings', value: player.stats.stumpings || 0 }
    ];

    return { batting, bowling, fielding };
  };

  // Calculate derived statistics
  const calculateBattingAverage = (runs: number, matches: number) => {
    return matches > 0 ? (runs / matches).toFixed(1) : '0.0';
  };

  const calculateStrikeRate = (runs: number, ballsFaced: number) => {
    return ballsFaced > 0 ? ((runs / ballsFaced) * 100).toFixed(1) : '0.0';
  };

  const calculateEconomyRate = (runsConceded: number, ballsBowled: number) => {
    return ballsBowled > 0 ? ((runsConceded / ballsBowled) * 6).toFixed(2) : '0.00';
  };

  // Team performance overview
  const teamStatsData = playersWithStats.map(player => ({
    name: player.name.split(' ')[0], // First name only for chart
    runs: player.stats?.runsScored || 0,
    wickets: player.stats?.wicketsTaken || 0,
    average: parseFloat(calculateBattingAverage(player.stats?.runsScored || 0, player.stats?.matches || 0)),
    strikeRate: parseFloat(calculateStrikeRate(player.stats?.runsScored || 0, player.stats?.ballsFaced || 0))
  }));

  // Player role distribution based on performance
  const getPlayerRole = (player: PlayerWithStats) => {
    const runs = player.stats?.runsScored || 0;
    const wickets = player.stats?.wicketsTaken || 0;
    
    if (runs > 500 && wickets > 10) return 'All-rounder';
    if (runs > 300) return 'Batsman';
    if (wickets > 15) return 'Bowler';
    if (player.stats?.catches && player.stats.catches > 5) return 'Wicket-keeper';
    return 'All-rounder';
  };

  const roleDistribution = players.reduce((acc, player) => {
    const role = getPlayerRole(player);
    acc[role] = (acc[role] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const roleData = Object.entries(roleDistribution).map(([role, count]) => ({
    name: role,
    value: count
  }));

  const COLORS = ['#1e3a8a', '#f59e0b', '#dc2626', '#059669', '#7c3aed'];

  return (
    <section id="analytics" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-[#1e3a8a] mb-4">Player Analytics</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Advanced performance insights and statistical analysis of our talented squad
          </p>
        </div>

        {/* Team Overview Charts */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Team Performance Chart */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-2xl font-bold text-[#1e3a8a] mb-6">Team Performance Overview</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={teamStatsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="runs" fill="#1e3a8a" name="Runs Scored" />
                <Bar dataKey="wickets" fill="#f59e0b" name="Wickets Taken" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Player Roles Distribution */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-2xl font-bold text-[#1e3a8a] mb-6">Squad Composition</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={roleData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {roleData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Player Selection */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h3 className="text-2xl font-bold text-[#1e3a8a] mb-6">Individual Player Analysis</h3>
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
            {playersWithStats.map((player) => (
              <button
                key={player.id}
                onClick={() => setSelectedPlayer(player)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedPlayer?.id === player.id
                    ? 'border-[#1e3a8a] bg-[#eff6ff]'
                    : 'border-gray-200 hover:border-[#bfdbfe] bg-white'
                }`}
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-[#1e3a8a] rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-2">
                    {player.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <h4 className="font-semibold text-[#1e3a8a]">{player.name}</h4>
                  <p className="text-sm text-gray-600">#{player.jerseyNumber}</p>
                  <p className="text-xs text-gray-500">{getPlayerRole(player)}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Individual Player Analytics */}
        {selectedPlayer && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-[#1e3a8a]">{selectedPlayer.name} Analytics</h3>
                <p className="text-gray-600">{getPlayerRole(selectedPlayer)} • Jersey #{selectedPlayer.jerseyNumber}</p>
              </div>
              <div className="flex bg-gray-100 rounded-lg p-1">
                {['overview', 'batting', 'bowling', 'fielding'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`px-4 py-2 rounded-md capitalize transition-colors ${
                      activeTab === tab
                        ? 'bg-[#1e3a8a] text-white'
                        : 'text-gray-600 hover:text-[#1e3a8a]'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Player Stats Display */}
            {selectedPlayer.stats && (
              <div className="grid lg:grid-cols-2 gap-8">
                {activeTab === 'overview' && (
                  <>
                    <div>
                      <h4 className="text-lg font-semibold text-[#1e3a8a] mb-4">Career Overview</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <span className="font-medium">Matches Played</span>
                          <span className="text-[#1e3a8a] font-bold">{selectedPlayer.stats.matchesPlayed || 0}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <span className="font-medium">Total Runs</span>
                          <span className="text-[#1e3a8a] font-bold">{selectedPlayer.stats.runsScored || 0}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <span className="font-medium">Wickets Taken</span>
                          <span className="text-[#1e3a8a] font-bold">{selectedPlayer.stats.wicketsTaken || 0}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <span className="font-medium">Batting Average</span>
                          <span className="text-[#1e3a8a] font-bold">{selectedPlayer.stats.battingAverage || 0}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-[#1e3a8a] mb-4">Performance Radar</h4>
                      <ResponsiveContainer width="100%" height={250}>
                        <RadarChart data={[
                          { subject: 'Batting Avg', A: Math.min(selectedPlayer.stats.battingAverage || 0, 100) },
                          { subject: 'Strike Rate', A: Math.min((selectedPlayer.stats.strikeRate || 0) / 2, 100) },
                          { subject: 'Bowling Avg', A: Math.max(100 - (selectedPlayer.stats.bowlingAverage || 100), 0) },
                          { subject: 'Economy', A: Math.max(100 - ((selectedPlayer.stats.economyRate || 10) * 10), 0) },
                          { subject: 'Fielding', A: Math.min(((selectedPlayer.stats.catches || 0) + (selectedPlayer.stats.runOuts || 0)) * 10, 100) }
                        ]}>
                          <PolarGrid />
                          <PolarAngleAxis dataKey="subject" />
                          <PolarRadiusAxis domain={[0, 100]} />
                          <Radar name="Performance" dataKey="A" stroke="#1e3a8a" fill="#1e3a8a" fillOpacity={0.3} />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </>
                )}

                {activeTab === 'batting' && (
                  <>
                    <div>
                      <h4 className="text-lg font-semibold text-[#1e3a8a] mb-4">Batting Statistics</h4>
                      <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={getPlayerPerformanceData(selectedPlayer)?.batting || []}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="value" fill="#1e3a8a" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-[#1e3a8a] mb-4">Batting Metrics</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <span className="font-medium">Highest Score</span>
                          <span className="text-[#1e3a8a] font-bold">{selectedPlayer.stats.highestScore || 0}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <span className="font-medium">Strike Rate</span>
                          <span className="text-[#1e3a8a] font-bold">{selectedPlayer.stats.strikeRate || 0}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <span className="font-medium">Centuries</span>
                          <span className="text-[#1e3a8a] font-bold">{selectedPlayer.stats.centuries || 0}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <span className="font-medium">Half Centuries</span>
                          <span className="text-[#1e3a8a] font-bold">{selectedPlayer.stats.halfCenturies || 0}</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {activeTab === 'bowling' && (
                  <>
                    <div>
                      <h4 className="text-lg font-semibold text-[#1e3a8a] mb-4">Bowling Statistics</h4>
                      <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={getPlayerPerformanceData(selectedPlayer)?.bowling || []}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="value" fill="#f59e0b" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-[#1e3a8a] mb-4">Bowling Metrics</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <span className="font-medium">Best Bowling</span>
                          <span className="text-[#1e3a8a] font-bold">{selectedPlayer.stats.bestBowling || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <span className="font-medium">Bowling Average</span>
                          <span className="text-[#1e3a8a] font-bold">{selectedPlayer.stats.bowlingAverage || 0}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <span className="font-medium">Economy Rate</span>
                          <span className="text-[#1e3a8a] font-bold">{selectedPlayer.stats.economyRate || 0}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <span className="font-medium">Overs Bowled</span>
                          <span className="text-[#1e3a8a] font-bold">{selectedPlayer.stats.oversBowled || 0}</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {activeTab === 'fielding' && (
                  <>
                    <div>
                      <h4 className="text-lg font-semibold text-[#1e3a8a] mb-4">Fielding Statistics</h4>
                      <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={getPlayerPerformanceData(selectedPlayer)?.fielding || []}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="value" fill="#059669" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-[#1e3a8a] mb-4">Fielding Metrics</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <span className="font-medium">Catches</span>
                          <span className="text-[#1e3a8a] font-bold">{selectedPlayer.stats.catches || 0}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <span className="font-medium">Run Outs</span>
                          <span className="text-[#1e3a8a] font-bold">{selectedPlayer.stats.runOuts || 0}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <span className="font-medium">Stumpings</span>
                          <span className="text-[#1e3a8a] font-bold">{selectedPlayer.stats.stumpings || 0}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <span className="font-medium">Total Dismissals</span>
                          <span className="text-[#1e3a8a] font-bold">
                            {(selectedPlayer.stats.catches || 0) + (selectedPlayer.stats.runOuts || 0) + (selectedPlayer.stats.stumpings || 0)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}