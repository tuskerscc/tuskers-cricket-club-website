import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';

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

export default function LiveScoreWidget() {
  const { data: liveScore } = useQuery<LiveScoreData>({
    queryKey: ['/api/scoring/live'],
    refetchInterval: 10000 // Refresh every 10 seconds during live matches
  });

  if (!liveScore?.isLive) {
    return null; // Don't show widget if no live match
  }

  return (
    <div className="bg-gradient-to-r from-[#1e3a8a] to-blue-600 text-white rounded-2xl shadow-lg overflow-hidden mb-8">
      <div className="p-6">
        {/* Live Badge */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">{liveScore.matchName}</h3>
          <div className="flex items-center bg-red-500 px-3 py-1 rounded-full text-sm font-bold">
            <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
            LIVE
          </div>
        </div>

        <p className="text-blue-100 mb-6">{liveScore.venue}</p>

        {/* Current Score */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white/10 rounded-lg p-4">
            <div className="text-lg font-semibold mb-1">Tuskers CC</div>
            <div className="text-2xl font-bold">{liveScore.tuskersScore}</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <div className="text-lg font-semibold mb-1">Opposition</div>
            <div className="text-xl">{liveScore.oppositionScore}</div>
          </div>
        </div>

        {/* Current Batsmen */}
        {liveScore.currentBatsmen && liveScore.currentBatsmen.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-semibold mb-3 text-blue-100">Current Batsmen</h4>
            <div className="grid grid-cols-2 gap-4">
              {liveScore.currentBatsmen.map((batsman, index) => (
                <div key={index} className="bg-white/10 rounded-lg p-3">
                  <div className="font-semibold">{batsman.name}</div>
                  <div className="text-sm text-blue-100">
                    {batsman.runs}* ({batsman.balls})
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Overs */}
        {liveScore.recentOvers && liveScore.recentOvers.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-semibold mb-3 text-blue-100">Recent Overs</h4>
            <div className="flex space-x-2">
              {liveScore.recentOvers.map((ball, index) => (
                <div
                  key={index}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    ball === '4' || ball === '6'
                      ? 'bg-green-500 text-white'
                      : ball === 'W'
                      ? 'bg-red-500 text-white'
                      : 'bg-white/20 text-white'
                  }`}
                >
                  {ball}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/scoring/tuskers"
            className="flex-1 bg-white text-[#1e3a8a] py-3 px-6 rounded-lg font-semibold text-center hover:bg-gray-100 transition-colors"
          >
            <i className="fas fa-chart-line mr-2"></i>
            View Full Scorecard
          </Link>
          <button
            onClick={() => window.location.reload()}
            className="flex-1 bg-white/20 border border-white/30 text-white py-3 px-6 rounded-lg font-semibold hover:bg-white/30 transition-colors"
          >
            <i className="fas fa-sync-alt mr-2"></i>
            Refresh
          </button>
        </div>
      </div>

      {/* Commentary Strip */}
      <div className="bg-black/20 px-6 py-3">
        <div className="text-sm text-blue-100">
          <i className="fas fa-microphone mr-2"></i>
          <span className="font-semibold">Live Commentary:</span> Tuskers CC building a solid partnership. Current run rate: 5.4
        </div>
      </div>
    </div>
  );
}