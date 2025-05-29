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
  const [selectedAmenity, setSelectedAmenity] = useState<VenueAmenity | null>(null);
  const [viewMode, setViewMode] = useState<'field' | 'stadium'>('field');
  const [showPlayerStats, setShowPlayerStats] = useState(true);
  const [showAmenities, setShowAmenities] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { data: players = [] } = useQuery<Player[]>({
    queryKey: ['/api/players']
  });

  // Mock player positions for field view (cricket field positions)
  const fieldPositions: PlayerPosition[] = players.slice(0, 11).map((player, index) => {
    const positions = [
      { x: 50, y: 85, fieldPosition: 'Wicket Keeper' }, // Behind stumps
      { x: 50, y: 45, fieldPosition: 'Bowler' }, // Bowling end
      { x: 30, y: 30, fieldPosition: 'Slip' },
      { x: 70, y: 30, fieldPosition: 'Gully' },
      { x: 20, y: 50, fieldPosition: 'Point' },
      { x: 80, y: 50, fieldPosition: 'Cover' },
      { x: 35, y: 65, fieldPosition: 'Mid Wicket' },
      { x: 65, y: 65, fieldPosition: 'Mid On' },
      { x: 25, y: 80, fieldPosition: 'Square Leg' },
      { x: 75, y: 80, fieldPosition: 'Mid Off' },
      { x: 50, y: 20, fieldPosition: 'Long Off' }
    ];

    return {
      id: player.id,
      player,
      position: positions[index] || { x: 50, y: 50 },
      fieldPosition: positions[index]?.fieldPosition || 'Field'
    };
  });

  // Stadium amenities
  const amenities: VenueAmenity[] = [
    {
      id: 1,
      name: 'Main Entrance',
      description: 'Primary entry point with ticket scanning',
      position: { x: 50, y: 95 },
      type: 'seating',
      icon: '🚪'
    },
    {
      id: 2,
      name: 'Food Court',
      description: 'Variety of local and international cuisine',
      position: { x: 15, y: 75 },
      type: 'food',
      icon: '🍕'
    },
    {
      id: 3,
      name: 'Premium Seating',
      description: 'VIP boxes with air conditioning',
      position: { x: 85, y: 40 },
      type: 'seating',
      icon: '🎟️'
    },
    {
      id: 4,
      name: 'Team Store',
      description: 'Official Tuskers CC merchandise',
      position: { x: 25, y: 15 },
      type: 'shop',
      icon: '🛍️'
    },
    {
      id: 5,
      name: 'Medical Center',
      description: '24/7 medical assistance available',
      position: { x: 75, y: 15 },
      type: 'medical',
      icon: '🏥'
    },
    {
      id: 6,
      name: 'Parking Area A',
      description: 'General parking for 500+ vehicles',
      position: { x: 10, y: 5 },
      type: 'parking',
      icon: '🅿️'
    },
    {
      id: 7,
      name: 'Restrooms',
      description: 'Clean facilities with family rooms',
      position: { x: 90, y: 75 },
      type: 'restroom',
      icon: '🚻'
    }
  ];

  const getAmenityColor = (type: string) => {
    const colors = {
      food: '#f59e0b',
      restroom: '#3b82f6',
      parking: '#6b7280',
      shop: '#8b5cf6',
      seating: '#10b981',
      medical: '#ef4444'
    };
    return colors[type as keyof typeof colors] || '#6b7280';
  };

  const renderField = () => (
    <div className="relative w-full h-96 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl overflow-hidden shadow-lg">
      {/* Cricket pitch */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-1 bg-yellow-200 rounded"></div>
      
      {/* Stumps */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 translate-y-12">
        <div className="w-1 h-3 bg-yellow-400 mx-auto"></div>
      </div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -translate-y-12">
        <div className="w-1 h-3 bg-yellow-400 mx-auto"></div>
      </div>

      {/* Boundary circle */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 border-2 border-white border-dashed rounded-full opacity-50"></div>

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

  const renderStadium = () => (
    <div className="relative w-full h-96 bg-gradient-to-br from-gray-300 to-gray-500 rounded-2xl overflow-hidden shadow-lg">
      {/* Stadium outline */}
      <div className="absolute inset-4 border-4 border-gray-600 rounded-full">
        {/* Field in center */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-green-500 rounded-full"></div>
      </div>

      {/* Amenities */}
      {showAmenities && amenities.map((amenity) => (
        <div
          key={amenity.id}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
          style={{
            left: `${amenity.position.x}%`,
            top: `${amenity.position.y}%`
          }}
          onClick={() => setSelectedAmenity(amenity)}
        >
          <div 
            className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform text-lg"
            style={{ backgroundColor: getAmenityColor(amenity.type) }}
          >
            {amenity.icon}
          </div>
          <div className="absolute top-12 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            {amenity.name}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <section className="py-16 bg-gradient-to-br from-[#eff6ff] to-white">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-[#1e3a8a] mb-4">AR Stadium Experience</h2>
          <p className="text-xl text-gray-600">Interactive map with player positions and venue amenities</p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <div className="flex bg-white rounded-lg p-1 shadow-md">
            <button
              className={`px-4 py-2 rounded-md font-semibold transition-colors ${
                viewMode === 'field'
                  ? 'bg-[#1e3a8a] text-white'
                  : 'text-[#1e3a8a] hover:bg-[#eff6ff]'
              }`}
              onClick={() => setViewMode('field')}
            >
              Field View
            </button>
            <button
              className={`px-4 py-2 rounded-md font-semibold transition-colors ${
                viewMode === 'stadium'
                  ? 'bg-[#1e3a8a] text-white'
                  : 'text-[#1e3a8a] hover:bg-[#eff6ff]'
              }`}
              onClick={() => setViewMode('stadium')}
            >
              Stadium View
            </button>
          </div>

          {viewMode === 'field' && (
            <button
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                showPlayerStats
                  ? 'bg-[#f59e0b] text-white'
                  : 'bg-white text-[#f59e0b] border border-[#f59e0b]'
              }`}
              onClick={() => setShowPlayerStats(!showPlayerStats)}
            >
              {showPlayerStats ? 'Hide' : 'Show'} Players
            </button>
          )}

          {viewMode === 'stadium' && (
            <button
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                showAmenities
                  ? 'bg-[#f59e0b] text-white'
                  : 'bg-white text-[#f59e0b] border border-[#f59e0b]'
              }`}
              onClick={() => setShowAmenities(!showAmenities)}
            >
              {showAmenities ? 'Hide' : 'Show'} Amenities
            </button>
          )}
        </div>

        {/* Map Container */}
        <div className="bg-white rounded-2xl p-6 shadow-xl">
          {viewMode === 'field' ? renderField() : renderStadium()}

          {/* Legend */}
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            {viewMode === 'field' && (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-[#1e3a8a] rounded-full border border-[#f59e0b]"></div>
                <span className="text-sm text-gray-600">Player Position</span>
              </div>
            )}
            {viewMode === 'stadium' && (
              <>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Food & Drinks</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Facilities</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Seating</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Shopping</span>
                </div>
              </>
            )}
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

        {/* Amenity Info Modal */}
        {selectedAmenity && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                    style={{ backgroundColor: getAmenityColor(selectedAmenity.type) }}
                  >
                    {selectedAmenity.icon}
                  </div>
                  <h3 className="text-xl font-bold text-[#1e3a8a]">{selectedAmenity.name}</h3>
                </div>
                <button
                  onClick={() => setSelectedAmenity(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
              
              <p className="text-gray-700 mb-4">{selectedAmenity.description}</p>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500 capitalize">{selectedAmenity.type}</span>
                <button className="bg-[#1e3a8a] text-white px-4 py-2 rounded-lg hover:bg-[#1e40af] transition-colors">
                  Get Directions
                </button>
              </div>
            </div>
          </div>
        )}

        {/* AR Features Info */}
        <div className="mt-12 grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-[#1e3a8a] rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-[#f59e0b] text-2xl">📱</span>
            </div>
            <h3 className="text-xl font-bold text-[#1e3a8a] mb-2">Interactive Map</h3>
            <p className="text-gray-600">Click on players and amenities to explore detailed information and stats</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-[#1e3a8a] rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-[#f59e0b] text-2xl">🏟️</span>
            </div>
            <h3 className="text-xl font-bold text-[#1e3a8a] mb-2">Stadium Guide</h3>
            <p className="text-gray-600">Navigate the venue with ease using our comprehensive amenity locations</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-[#1e3a8a] rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-[#f59e0b] text-2xl">⚡</span>
            </div>
            <h3 className="text-xl font-bold text-[#1e3a8a] mb-2">Real-time Updates</h3>
            <p className="text-gray-600">Live player positions and venue information updated throughout the match</p>
          </div>
        </div>
      </div>
    </section>
  );
}