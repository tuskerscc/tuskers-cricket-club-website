import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useCountdown } from '@/hooks/useCountdown';
import type { MatchWithDetails } from '@/lib/types';

export default function MatchCenter() {
  const [filter, setFilter] = useState<'upcoming' | 'completed' | 'home'>('upcoming');
  
  const handleViewMatchReport = (matchId: number) => {
    alert(`Match report for match #${matchId} would be displayed here. This feature requires backend implementation.`);
  };

  const handleAddToCalendar = (match: any) => {
    const startDate = new Date(match.matchDate || Date.now() + 7 * 24 * 60 * 60 * 1000);
    const endDate = new Date(startDate.getTime() + 4 * 60 * 60 * 1000);
    
    const title = encodeURIComponent('Tuskers CC vs Lightning Bolts');
    const start = startDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const end = endDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const location = encodeURIComponent('Premier Cricket Ground');
    
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&location=${location}&details=${encodeURIComponent('Cricket match between Tuskers CC and Lightning Bolts')}`;
    
    window.open(googleCalendarUrl, '_blank');
  };

  const handleViewAllFixtures = () => {
    alert('Complete fixtures calendar would be displayed here. This feature requires additional implementation.');
  };

  const handleWatchHighlights = () => {
    alert('Match highlights video would be played here. This feature requires video content integration.');
  };

  const { data: matches = [], isLoading } = useQuery<MatchWithDetails[]>({
    queryKey: ['/api/matches']
  });

  const { data: upcomingMatches = [] } = useQuery<MatchWithDetails[]>({
    queryKey: ['/api/matches/upcoming']
  });

  const { data: liveMatches = [] } = useQuery<MatchWithDetails[]>({
    queryKey: ['/api/matches/live']
  });

  const nextMatch = upcomingMatches[0];

  const filteredMatches = useMemo(() => {
    return matches.filter(match => {
      const matchDate = new Date(match.matchDate);
      const now = new Date();
      
      if (filter === 'upcoming') {
        return matchDate > now;
      }
      if (filter === 'completed') {
        return matchDate < now;
      }
      if (filter === 'home') {
        return match.homeTeam.name.toLowerCase().includes('tuskers');
      }
      return false;
    });
  }, [matches, filter]);

  if (isLoading) {
    return (
      <section id="matches" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#1e3a8a] mb-4">Match Center</h2>
            <p className="text-xl text-gray-600">Stay updated with our latest fixtures and results</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded mb-4"></div>
                <div className="h-16 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="matches" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-[#1e3a8a] mb-4">Match Center</h2>
          <p className="text-xl text-gray-600">Stay updated with our latest fixtures and results</p>
        </div>

        {/* Match Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <button 
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              filter === 'upcoming' 
                ? 'bg-[#1e3a8a] text-white' 
                : 'bg-white text-[#1e3a8a] border border-[#1e3a8a] hover:bg-[#eff6ff]'
            }`}
            onClick={() => setFilter('upcoming')}
          >
            Upcoming
          </button>
          <button 
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              filter === 'completed' 
                ? 'bg-[#1e3a8a] text-white' 
                : 'bg-white text-[#1e3a8a] border border-[#1e3a8a] hover:bg-[#eff6ff]'
            }`}
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
          <button 
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              filter === 'home' 
                ? 'bg-[#1e3a8a] text-white' 
                : 'bg-white text-[#1e3a8a] border border-[#1e3a8a] hover:bg-[#eff6ff]'
            }`}
            onClick={() => setFilter('home')}
          >
            Home
          </button>
        </div>

        {/* Display filtered matches */}
        {filteredMatches.length > 3 ? (
          // Table format for more than 3 matches
          <div className="mt-8 bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto max-h-96 overflow-y-auto">
              <table className="w-full">
                <thead className="bg-[#1e3a8a] text-white sticky top-0 z-10">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold">Status</th>
                    <th className="px-6 py-4 text-left font-semibold">Match</th>
                    <th className="px-6 py-4 text-left font-semibold">Date</th>
                    <th className="px-6 py-4 text-left font-semibold">Venue</th>
                    <th className="px-6 py-4 text-left font-semibold">Competition</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMatches.map((match, index) => (
                    <tr key={match.id} className={`border-b border-gray-100 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-blue-50 transition-colors`}>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          new Date(match.matchDate) > new Date() 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {new Date(match.matchDate) > new Date() ? 'UPCOMING' : 'COMPLETED'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-[#1e3a8a]">{match.homeTeam.name}</span>
                          <span className="text-gray-400">vs</span>
                          <span className="font-semibold">{match.awayTeam.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {new Date(match.matchDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {match.venue.name}
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {match.competition.name}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          // Card format for 3 or fewer matches
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
            {filteredMatches.map((match) => (
              <div key={match.id} className="bg-white rounded-2xl shadow-lg overflow-hidden border-l-4 border-[#1e3a8a]">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      new Date(match.matchDate) > new Date() 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {new Date(match.matchDate) > new Date() ? 'UPCOMING' : 'COMPLETED'}
                    </span>
                    <span className="text-sm text-gray-500">{match.competition.name}</span>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-[#1e3a8a] rounded-lg flex items-center justify-center">
                          <span className="text-[#f59e0b] font-bold text-sm">
                            {match.homeTeam.name.substring(0, 2).toUpperCase()}
                          </span>
                        </div>
                        <span className="font-bold text-[#1e3a8a]">{match.homeTeam.name}</span>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <span className="text-gray-400 font-bold text-lg">VS</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-sm">
                            {match.awayTeam.name.substring(0, 2).toUpperCase()}
                          </span>
                        </div>
                        <span className="font-bold text-gray-900">{match.awayTeam.name}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <div className="flex justify-between items-center text-sm">
                      <div>
                        <i className="fas fa-calendar text-gray-400 mr-2"></i>
                        <span className="text-gray-700">
                          {new Date(match.matchDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div>
                        <i className="fas fa-map-marker-alt text-gray-400 mr-2"></i>
                        <span className="text-gray-700">{match.venue.name}</span>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => handleViewMatchReport(match.id)}
                    className="w-full mt-4 bg-[#1e3a8a] text-white py-3 rounded-lg font-semibold hover:bg-[#1e40af] transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
