import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useCountdown } from '@/hooks/useCountdown';
import type { MatchWithDetails } from '@/lib/types';

export default function MatchCenter() {
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed' | 'home'>('all');
  
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
  const matchDate = nextMatch?.matchDate || new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString();
  const countdown = useCountdown(new Date(matchDate));

  const filteredMatches = matches.filter(match => {
    if (filter === 'all') return true;
    if (filter === 'upcoming') return new Date(match.matchDate) > new Date();
    if (filter === 'completed') return new Date(match.matchDate) < new Date();
    if (filter === 'home') return match.homeTeam.name === 'Tuskers CC';
    return false;
  });

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
              filter === 'all' 
                ? 'bg-[#1e3a8a] text-white' 
                : 'bg-white text-[#1e3a8a] border border-[#1e3a8a] hover:bg-[#eff6ff]'
            }`}
            onClick={() => setFilter('all')}
          >
            All Matches
          </button>
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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Upcoming Match Card */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-l-4 border-[#f59e0b]">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="bg-[#fef3c7] text-[#d97706] px-3 py-1 rounded-full text-sm font-semibold">UPCOMING</span>
                <span className="text-sm text-gray-500">Premier League</span>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-[#1e3a8a] rounded-lg flex items-center justify-center">
                      <span className="text-[#f59e0b] font-bold text-sm">TC</span>
                    </div>
                    <span className="font-bold text-[#1e3a8a]">Tuskers CC</span>
                  </div>
                  <span className="text-gray-400 font-bold text-lg">VS</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">LGT</span>
                    </div>
                    <span className="font-bold text-gray-900">Lightning Bolts</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100">
                <div className="flex justify-between items-center text-sm">
                  <div>
                    <i className="fas fa-calendar text-gray-400 mr-2"></i>
                    <span className="text-gray-700">Dec 15, 2024</span>
                  </div>
                  <div>
                    <i className="fas fa-clock text-gray-400 mr-2"></i>
                    <span className="text-gray-700">2:30 PM</span>
                  </div>
                </div>
                <div className="mt-2">
                  <i className="fas fa-map-marker-alt text-gray-400 mr-2"></i>
                  <span className="text-gray-700">Tuskers Cricket Ground</span>
                </div>
              </div>

              {/* Countdown Timer */}
              <div className="mt-4 bg-[#eff6ff] p-4 rounded-lg">
                <div className="text-center">
                  <div className="text-sm text-[#1d4ed8] mb-2">Match starts in</div>
                  <div className="flex justify-center space-x-4 text-[#1e3a8a] font-bold">
                    <div className="text-center">
                      <div className="text-xl">{String(countdown.days).padStart(2, '0')}</div>
                      <div className="text-xs">Days</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl">{String(countdown.hours).padStart(2, '0')}</div>
                      <div className="text-xs">Hours</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl">{String(countdown.minutes).padStart(2, '0')}</div>
                      <div className="text-xs">Mins</div>
                    </div>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => handleAddToCalendar(nextMatch)}
                className="w-full mt-4 bg-[#1e3a8a] text-white py-3 rounded-lg font-semibold hover:bg-[#1e40af] transition-colors"
              >
                <i className="fas fa-calendar-plus mr-2"></i>
                Add to Calendar
              </button>
            </div>
          </div>

          {/* Sample Match Cards */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-l-4 border-green-500">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">WON</span>
                <span className="text-sm text-gray-500">Champions Cup</span>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-[#1e3a8a] rounded-lg flex items-center justify-center">
                      <span className="text-[#f59e0b] font-bold text-sm">TC</span>
                    </div>
                    <div>
                      <span className="font-bold text-[#1e3a8a]">Tuskers CC</span>
                      <div className="text-sm text-gray-600">245/6 (50 overs)</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <i className="fas fa-check text-white text-sm"></i>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">THU</span>
                    </div>
                    <div>
                      <span className="font-bold text-gray-900">Thunder Hawks</span>
                      <div className="text-sm text-gray-600">187/9 (45.2 overs)</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100">
                <div className="bg-green-50 p-3 rounded-lg">
                  <div className="text-center text-green-800 font-semibold">
                    <i className="fas fa-trophy text-[#f59e0b] mr-2"></i>
                    Won by 58 runs
                  </div>
                  <div className="text-center text-sm text-green-700 mt-1">
                    Player of the Match: R. Sharma (89* off 76)
                  </div>
                </div>
              </div>

              <button 
                onClick={() => handleViewMatchReport(1)}
                className="w-full mt-4 bg-[#1e3a8a] text-white py-3 rounded-lg font-semibold hover:bg-[#1e40af] transition-colors"
              >
                View Match Report
              </button>
            </div>
          </div>

          {/* Live Match Card */}
          {liveMatches.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-l-4 border-red-500 relative">
              <div className="absolute top-0 right-0 bg-red-500 text-white px-3 py-1 text-xs font-bold">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse"></div>
                  LIVE
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">IN PROGRESS</span>
                  <span className="text-sm text-gray-500">Elite Trophy</span>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-[#1e3a8a] rounded-lg flex items-center justify-center">
                        <span className="text-[#f59e0b] font-bold text-sm">TC</span>
                      </div>
                      <div>
                        <span className="font-bold text-[#1e3a8a]">Tuskers CC</span>
                        <div className="text-sm text-gray-600">156/3 (28.4 overs)</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                        <i className="fas fa-play text-white text-sm"></i>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">SKY</span>
                      </div>
                      <div>
                        <span className="font-bold text-gray-900">Sky Eagles</span>
                        <div className="text-sm text-gray-600">234/8 (50 overs)</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100">
                  <div className="bg-red-50 p-3 rounded-lg">
                    <div className="text-center text-red-800 font-semibold">
                      Need 79 runs in 128 balls
                    </div>
                    <div className="text-center text-sm text-red-700 mt-1">
                      CRR: 5.43 | RRR: 3.71
                    </div>
                  </div>
                </div>

                <button className="w-full mt-4 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors">
                  Watch Live Commentary
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Display filtered matches */}
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

        <div className="text-center mt-12">
          <button 
            onClick={handleViewAllFixtures}
            className="bg-[#1e3a8a] text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-[#1e40af] transition-colors"
          >
            View All Fixtures
          </button>
        </div>
      </div>
    </section>
  );
}
