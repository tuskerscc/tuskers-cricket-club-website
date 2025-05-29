import { useQuery } from '@tanstack/react-query';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import MatchCenter from '@/components/MatchCenter';
import Squad from '@/components/Squad';
import StartingEleven from '@/components/StartingEleven';
import PlayerAnalytics from '@/components/PlayerAnalytics';
import LatestUpdates from '@/components/LatestUpdates';
import FanZone from '@/components/FanZone';
import Footer from '@/components/Footer';
import type { TeamStats } from '@/lib/types';

export default function Home() {
  const { data: stats } = useQuery<TeamStats>({
    queryKey: ['/api/stats/team']
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main>
        <HeroSection />
        
        {/* Quick Stats Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Stat Card 1 */}
              <div className="text-center p-8 bg-gradient-to-br from-[#eff6ff] to-blue-50 rounded-2xl">
                <div className="w-16 h-16 bg-[#1e3a8a] rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-trophy text-[#fcd34d] text-2xl"></i>
                </div>
                <h3 className="text-3xl font-bold text-[#1e3a8a] mb-2">
                  {stats?.matchesWon || 23}
                </h3>
                <p className="text-gray-600 font-medium">Matches Won</p>
              </div>

              {/* Stat Card 2 */}
              <div className="text-center p-8 bg-gradient-to-br from-[#fef3c7] to-yellow-50 rounded-2xl">
                <div className="w-16 h-16 bg-[#f59e0b] rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-bullseye text-white text-2xl"></i>
                </div>
                <h3 className="text-3xl font-bold text-[#1e3a8a] mb-2">
                  {stats?.totalRuns || 3247}
                </h3>
                <p className="text-gray-600 font-medium">Total Runs</p>
              </div>

              {/* Stat Card 3 */}
              <div className="text-center p-8 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-crosshairs text-white text-2xl"></i>
                </div>
                <h3 className="text-3xl font-bold text-[#1e3a8a] mb-2">
                  {stats?.wicketsTaken || 156}
                </h3>
                <p className="text-gray-600 font-medium">Wickets Taken</p>
              </div>

              {/* Stat Card 4 */}
              <div className="text-center p-8 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl">
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-users text-white text-2xl"></i>
                </div>
                <h3 className="text-3xl font-bold text-[#1e3a8a] mb-2">
                  {stats?.fanBase || '12K+'}
                </h3>
                <p className="text-gray-600 font-medium">Fan Base</p>
              </div>
            </div>
          </div>
        </section>

        <MatchCenter />
        <Squad />
        <StartingEleven />
        <PlayerAnalytics />
        <LatestUpdates />
        <FanZone />
      </main>
      
      <Footer />
    </div>
  );
}
