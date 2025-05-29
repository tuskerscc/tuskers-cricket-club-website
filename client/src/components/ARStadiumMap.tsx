import { useState, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { Player } from '@shared/schema';

interface PlayerPosition {
  id: number;
  player: Player;
  position: {
    x: number;
    y: number;
  };
  fieldPosition: string;
}

interface VenueAmenity {
  id: number;
  name: string;
  description: string;
  position: {
    x: number;
    y: number;
  };
  type: 'food' | 'restroom' | 'parking' | 'shop' | 'seating' | 'medical';
  icon: string;
}

export default function ARStadiumMap() {
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerPosition | null>(null);
  const [showPlayerStats, setShowPlayerStats] = useState(true);

  const { data: players = [] } = useQuery<Player[]>({
    queryKey: ['/api/players']
  });

  // Cricket field positions in traditional formation
  const fieldPositions: PlayerPosition[] = players.slice(0, 11).map((player, index) => {
    const positions = [
      { x: 50, y: 65, fieldPosition: 'Wicket-keeper' }, // Behind stumps
      { x: 30, y: 75, fieldPosition: 'Square leg' }, // Square leg
      { x: 65, y: 15, fieldPosition: 'Long on' }, // Long on
      { x: 25, y: 45, fieldPosition: 'Point' }, // Point
      { x: 75, y: 45, fieldPosition: 'Cover' }, // Cover
      { x: 50, y: 10, fieldPosition: 'Long off' }, // Long off
      { x: 50, y: 35, fieldPosition: 'Bowler' }, // Bowler
      { x: 85, y: 50, fieldPosition: 'Off-side sweeper' }, // Off-side sweeper
      { x: 15, y: 70, fieldPosition: 'Leg-side sweeper' }, // Leg-side sweeper
      { x: 85, y: 80, fieldPosition: 'Fine leg' }, // Fine leg
      { x: 15, y: 25, fieldPosition: 'Third man' } // Third man
    ];

    return {
      id: player.id,
      player,
      position: positions[index] || { x: 50, y: 50 },
      fieldPosition: positions[index]?.fieldPosition || 'Field'
    };
  });



  const renderField = () => (
    <div className="relative w-full h-96 bg-gradient-to-br from-green-400 to-green-600 rounded-full overflow-hidden shadow-lg mx-auto" style={{ aspectRatio: '1' }}>
      {/* Cricket pitch */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-1 bg-yellow-200 rounded"></div>
      
      {/* Stumps */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 translate-y-8">
        <div className="w-1 h-2 bg-yellow-400 mx-auto"></div>
      </div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -translate-y-8">
        <div className="w-1 h-2 bg-yellow-400 mx-auto"></div>
      </div>

      {/* Inner circle (30-yard circle) */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 border-2 border-white border-dashed rounded-full opacity-60"></div>

      {/* Player positions */}
      {showPlayerStats && fieldPositions.map((playerPos) => (
        <div
          key={playerPos.id}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
          style={{
            left: `${playerPos.position.x}%`,
            top: `${playerPos.position.y}%`
          }}
          onClick={() => setSelectedPlayer(playerPos)}
        >
          <div className="w-8 h-8 bg-[#1e3a8a] rounded-full border-2 border-[#f59e0b] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <span className="text-white text-xs font-bold">
              {playerPos.player.jerseyNumber}
            </span>
          </div>
          <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            {playerPos.player.name}
          </div>
        </div>
      ))}
    </div>
  );



  return (
    <section className="py-16 bg-gradient-to-br from-[#eff6ff] to-white">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-[#1e3a8a] mb-4">Interactive Field Map</h2>
          <p className="text-xl text-gray-600">Cricket field with interactive player positions</p>
        </div>

        {/* Controls */}
        <div className="flex justify-center mb-8">
          <button
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              showPlayerStats
                ? 'bg-[#f59e0b] text-white shadow-lg'
                : 'bg-white text-[#f59e0b] border-2 border-[#f59e0b] hover:bg-[#f59e0b] hover:text-white'
            }`}
            onClick={() => setShowPlayerStats(!showPlayerStats)}
          >
            {showPlayerStats ? 'Hide Players' : 'Show Players'}
          </button>
        </div>

        {/* Map Container */}
        <div className="bg-white rounded-2xl p-6 shadow-xl">
          {renderField()}

          {/* Legend */}
          <div className="mt-6 flex justify-center">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-[#1e3a8a] rounded-full border border-[#f59e0b]"></div>
              <span className="text-sm text-gray-600">Player Position</span>
            </div>
          </div>
        </div>

        {/* Player Stats Modal */}
        {selectedPlayer && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-96 overflow-y-auto">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-[#1e3a8a]">{selectedPlayer.player.name}</h3>
                <button
                  onClick={() => setSelectedPlayer(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Jersey Number:</span>
                  <span className="font-semibold">#{selectedPlayer.player.jerseyNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Role:</span>
                  <span className="font-semibold">{selectedPlayer.player.role}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Field Position:</span>
                  <span className="font-semibold">{selectedPlayer.fieldPosition}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Batting Style:</span>
                  <span className="font-semibold">{selectedPlayer.player.battingStyle}</span>
                </div>
                {selectedPlayer.player.bowlingStyle && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Bowling Style:</span>
                    <span className="font-semibold">{selectedPlayer.player.bowlingStyle}</span>
                  </div>
                )}
                <div className="pt-3 border-t">
                  <p className="text-gray-700 text-sm">{selectedPlayer.player.bio}</p>
                </div>
              </div>
            </div>
          </div>
        )}




      </div>
    </section>
  );
}