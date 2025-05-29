import { useQuery } from '@tanstack/react-query';
import type { MatchWithDetails } from '@/lib/types';

interface LiveScoreData {
  isLive: boolean;
  matchName: string;
  venue: string;
  status: string;
  tuskersScore: string;
  oppositionScore: string;
  currentBatsmen: Array<{
    name: string;
    runs: number;
    balls: number;
  }>;
  recentOvers: string[];
}

export default function LiveMatchWidget() {
  const { data: liveMatches, isLoading: matchesLoading } = useQuery<MatchWithDetails[]>({
    queryKey: ['/api/matches/live']
  });

  const { data: liveScore } = useQuery<LiveScoreData>({
    queryKey: ['/api/scoring/live'],
    refetchInterval: 10000
  });

  const liveMatch = liveMatches?.[0];

  if (matchesLoading) {
    return (
      <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-6"></div>
          <div className="space-y-4">
            <div className="h-16 bg-gray-200 rounded"></div>
            <div className="h-16 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  // Show live score data if available, otherwise show "No Live Matches"
  if (liveScore?.isLive) {
    return (
      <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-[#1e3a8a]">Live Match</h3>
          <div className="flex items-center bg-[#f59e0b] text-white px-3 py-1 rounded-full text-sm font-bold">
            <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
            LIVE
          </div>
        </div>
        
        <div className="mb-4">
          <h4 className="text-lg font-semibold text-[#1e3a8a] mb-2">{liveScore.matchName}</h4>
          <p className="text-gray-600 text-sm">{liveScore.venue}</p>
        </div>
        
        <div className="space-y-4">
          {/* Team Scores */}
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-[#eff6ff] rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-[#1e3a8a] rounded-lg flex items-center justify-center">
                  <span className="text-[#f59e0b] font-bold text-sm">TC</span>
                </div>
                <div>
                  <span className="font-bold text-[#1e3a8a]">Tuskers CC</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-[#1e3a8a]">
                  {liveScore.tuskersScore}
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">OPP</span>
                </div>
                <div>
                  <span className="font-bold text-gray-900">Opposition</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-gray-900">
                  {liveScore.oppositionScore}
                </div>
              </div>
            </div>
          </div>

          {/* Current Batsmen */}
          {liveScore.currentBatsmen && liveScore.currentBatsmen.length > 0 && (
            <div className="bg-[#fef3c7] p-4 rounded-lg">
              <h5 className="font-semibold text-[#1e3a8a] mb-2">Current Batsmen</h5>
              <div className="space-y-1">
                {liveScore.currentBatsmen.map((batsman, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>{batsman.name}</span>
                    <span>{batsman.runs}* ({batsman.balls})</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button className="w-full bg-[#1e3a8a] text-white py-3 rounded-lg font-semibold hover:bg-[#1e40af] transition-colors">
            View Full Scorecard
          </button>
        </div>
      </div>
    );
  }

  if (!liveMatch) {
    return (
      <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-[#1e3a8a] mb-4">No Live Matches</h3>
          <p className="text-gray-600">Check back for live match updates</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-[#1e3a8a]">Live Match</h3>
        <div className="flex items-center bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
          <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
          LIVE
        </div>
      </div>
      
      <div className="space-y-4">
        {/* Team Scores */}
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-[#eff6ff] rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#1e3a8a] rounded-lg flex items-center justify-center">
                <span className="text-[#f59e0b] font-bold text-sm">TC</span>
              </div>
              <div>
                <span className="font-bold text-[#1e3a8a]">{liveMatch.homeTeam.name}</span>
                <div className="text-sm text-gray-600">
                  {liveMatch.homeTeamScore || 'Yet to bat'}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-[#1e3a8a]">
                {liveMatch.homeTeamScore || '-'}
              </div>
              <div className="text-sm text-gray-600">
                {liveMatch.homeTeamOvers || '50 overs'}
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {liveMatch.awayTeam.shortName}
                </span>
              </div>
              <div>
                <span className="font-bold text-gray-900">{liveMatch.awayTeam.name}</span>
                <div className="text-sm text-gray-600">
                  {liveMatch.awayTeamScore || 'Yet to bat'}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">
                {liveMatch.awayTeamScore || '-'}
              </div>
              <div className="text-sm text-gray-600">
                {liveMatch.awayTeamOvers || '50 overs'}
              </div>
            </div>
          </div>
        </div>

        {/* Match Info */}
        {liveMatch.liveData && (
          <div className="bg-[#fef3c7] p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-[#1e3a8a]">
                Match Status
              </span>
              <span className="text-sm text-gray-600">Live Updates</span>
            </div>
            <div className="text-sm text-gray-700">
              {liveMatch.result || 'Match in progress...'}
            </div>
          </div>
        )}

        <button className="w-full bg-[#1e3a8a] text-white py-3 rounded-lg font-semibold hover:bg-[#1e40af] transition-colors">
          View Full Scorecard
        </button>
      </div>
    </div>
  );
}
