import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { PlayerWithStats } from '@/lib/types';

export default function Squad() {
  const [category, setCategory] = useState<'all' | 'batsmen' | 'bowlers' | 'allrounders' | 'wicketkeeper'>('all');
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerWithStats | null>(null);

  const { data: players = [], isLoading } = useQuery<PlayerWithStats[]>({
    queryKey: ['/api/players']
  });

  const filteredPlayers = players.filter(player => {
    if (category === 'all') return true;
    if (category === 'batsmen') return player.role.toLowerCase().includes('batsman');
    if (category === 'bowlers') return player.role.toLowerCase().includes('bowler');
    if (category === 'allrounders') return player.role.toLowerCase().includes('all-rounder');
    if (category === 'wicketkeeper') return player.role.toLowerCase().includes('wicket-keeper');
    return false;
  }).slice(0, 25); // Limit to 25 players

  if (isLoading) {
    return (
      <section id="squad" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#1e3a8a] mb-4">Our Squad</h2>
            <p className="text-xl text-gray-600">Meet the talented players who make Tuskers CC a champion team</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-gray-50 rounded-2xl overflow-hidden shadow-lg animate-pulse">
                <div className="w-full h-64 bg-gray-200"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-200 rounded mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="squad" className="py-16 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-[#1e3a8a] mb-4">Our Squad</h2>
          <p className="text-xl text-gray-600">Meet the talented players who make Tuskers CC a champion team</p>
        </div>

        {/* Squad Categories */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <button 
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              category === 'all' 
                ? 'bg-[#1e3a8a] text-white' 
                : 'bg-white text-[#1e3a8a] border border-[#1e3a8a] hover:bg-[#eff6ff]'
            }`}
            onClick={() => setCategory('all')}
          >
            All Players
          </button>
          <button 
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              category === 'batsmen' 
                ? 'bg-[#1e3a8a] text-white' 
                : 'bg-white text-[#1e3a8a] border border-[#1e3a8a] hover:bg-[#eff6ff]'
            }`}
            onClick={() => setCategory('batsmen')}
          >
            Batsmen
          </button>
          <button 
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              category === 'bowlers' 
                ? 'bg-[#1e3a8a] text-white' 
                : 'bg-white text-[#1e3a8a] border border-[#1e3a8a] hover:bg-[#eff6ff]'
            }`}
            onClick={() => setCategory('bowlers')}
          >
            Bowlers
          </button>
          <button 
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              category === 'allrounders' 
                ? 'bg-[#1e3a8a] text-white' 
                : 'bg-white text-[#1e3a8a] border border-[#1e3a8a] hover:bg-[#eff6ff]'
            }`}
            onClick={() => setCategory('allrounders')}
          >
            All-rounders
          </button>
          <button 
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              category === 'wicketkeeper' 
                ? 'bg-[#1e3a8a] text-white' 
                : 'bg-white text-[#1e3a8a] border border-[#1e3a8a] hover:bg-[#eff6ff]'
            }`}
            onClick={() => setCategory('wicketkeeper')}
          >
            Wicket-keepers
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredPlayers.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg">No players found in this category.</p>
            </div>
          ) : (
            filteredPlayers.map((player) => (
              <div 
                key={player.id} 
                className="group bg-gradient-to-br from-[#eff6ff] to-blue-50 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 relative"
              >
                {player.isCaptain && (
                  <div className="absolute top-4 right-4 bg-[#f59e0b] text-[#1e3a8a] px-3 py-1 rounded-full text-xs font-bold z-10">
                    <i className="fas fa-crown mr-1"></i>
                    CAPTAIN
                  </div>
                )}
                {player.isViceCaptain && (
                  <div className="absolute top-4 right-4 bg-[#1e40af] text-white px-3 py-1 rounded-full text-xs font-bold z-10">
                    VICE-CAPTAIN
                  </div>
                )}
                
                <img 
                  src={player.photo || 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500'} 
                  alt={player.name} 
                  className="w-full h-64 object-cover object-top"
                />
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-bold text-[#1e3a8a]">{player.name}</h3>
                    {player.jerseyNumber && (
                      <span className="bg-[#1e3a8a] text-white px-3 py-1 rounded-full text-sm font-bold">
                        #{player.jerseyNumber}
                      </span>
                    )}
                  </div>
                  <p className="text-[#d97706] font-semibold mb-4">
                    {player.role} • {player.battingStyle || player.bowlingStyle || 'Right-handed'}
                  </p>
                  
                  {player.stats && (
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Matches:</span>
                        <span className="font-semibold text-[#1e3a8a]">{player.stats.matches}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Runs:</span>
                        <span className="font-semibold text-[#1e3a8a]">{player.stats.runsScored}</span>
                      </div>
                      {player.stats.wicketsTaken > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Wickets:</span>
                          <span className="font-semibold text-[#1e3a8a]">{player.stats.wicketsTaken}</span>
                        </div>
                      )}
                      {player.stats.catches > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Catches:</span>
                          <span className="font-semibold text-[#1e3a8a]">{player.stats.catches}</span>
                        </div>
                      )}
                    </div>
                  )}

                  <button 
                    onClick={() => setSelectedPlayer(player)}
                    className="w-full mt-4 bg-[#1e3a8a] text-white py-3 rounded-lg font-semibold hover:bg-[#1e40af] transition-colors group-hover:bg-[#f59e0b] group-hover:text-[#1e3a8a]"
                  >
                    View Full Profile
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="text-center mt-12">
          <button className="bg-[#1e3a8a] text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-[#1e40af] transition-colors mr-4">
            View Complete Squad
          </button>
          <button className="border-2 border-[#1e3a8a] text-[#1e3a8a] px-8 py-4 rounded-lg font-semibold text-lg hover:bg-[#eff6ff] transition-colors">
            Player Statistics
          </button>
        </div>

        {/* Player Detail Modal */}
        {selectedPlayer && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="relative">
                {/* Close Button */}
                <button
                  onClick={() => setSelectedPlayer(null)}
                  className="absolute top-4 right-4 bg-gray-200 hover:bg-gray-300 rounded-full w-8 h-8 flex items-center justify-center z-10"
                >
                  ✕
                </button>

                {/* Player Header */}
                <div className="bg-gradient-to-br from-[#1e3a8a] to-blue-800 text-white p-6 rounded-t-2xl">
                  <div className="flex items-center space-x-4">
                    <img 
                      src={selectedPlayer.photo || 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200'} 
                      alt={selectedPlayer.name} 
                      className="w-20 h-20 rounded-full object-cover border-4 border-white"
                    />
                    <div>
                      <h2 className="text-2xl font-bold">{selectedPlayer.name}</h2>
                      <p className="text-blue-200">{selectedPlayer.role}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="bg-[#fcd34d] text-[#1e3a8a] px-3 py-1 rounded-full text-sm font-bold">
                          #{selectedPlayer.jerseyNumber}
                        </span>
                        {selectedPlayer.isCaptain && (
                          <span className="bg-[#f59e0b] text-[#1e3a8a] px-3 py-1 rounded-full text-sm font-bold">
                            CAPTAIN
                          </span>
                        )}
                        {selectedPlayer.isViceCaptain && (
                          <span className="bg-[#1e40af] text-white px-3 py-1 rounded-full text-sm font-bold">
                            VICE-CAPTAIN
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Player Details */}
                <div className="p-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Basic Info */}
                    <div>
                      <h3 className="text-lg font-bold text-[#1e3a8a] mb-4">Player Information</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Batting Style:</span>
                          <span className="font-semibold">{selectedPlayer.battingStyle || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Bowling Style:</span>
                          <span className="font-semibold">{selectedPlayer.bowlingStyle || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Jersey Number:</span>
                          <span className="font-semibold">#{selectedPlayer.jerseyNumber}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Role:</span>
                          <span className="font-semibold">{selectedPlayer.role}</span>
                        </div>
                      </div>
                    </div>

                    {/* Performance Stats */}
                    <div>
                      <h3 className="text-lg font-bold text-[#1e3a8a] mb-4">Performance Stats</h3>
                      {selectedPlayer.stats ? (
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Matches:</span>
                            <span className="font-semibold">{selectedPlayer.stats.matchesPlayed || 0}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Runs Scored:</span>
                            <span className="font-semibold">{selectedPlayer.stats.runsScored || 0}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Wickets Taken:</span>
                            <span className="font-semibold">{selectedPlayer.stats.wicketsTaken || 0}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Catches:</span>
                            <span className="font-semibold">{selectedPlayer.stats.catches || 0}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Average:</span>
                            <span className="font-semibold">{selectedPlayer.stats.average || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Strike Rate:</span>
                            <span className="font-semibold">{selectedPlayer.stats.strikeRate || 'N/A'}</span>
                          </div>
                        </div>
                      ) : (
                        <p className="text-gray-500">No performance data available</p>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-4 mt-8">
                    <button 
                      onClick={() => setSelectedPlayer(null)}
                      className="flex-1 bg-[#1e3a8a] text-white py-3 rounded-lg font-semibold hover:bg-[#1e40af] transition-colors"
                    >
                      Close Profile
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
