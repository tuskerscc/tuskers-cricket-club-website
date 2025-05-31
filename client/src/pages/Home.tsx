import { useQuery } from '@tanstack/react-query';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import Squad from '@/components/Squad';
import ARStadiumMap from '@/components/ARStadiumMap';

import LatestUpdates from '@/components/LatestUpdates';
import FanZone from '@/components/FanZone';
import CricketTrivia from '@/components/CricketTrivia';
import Footer from '@/components/Footer';
import type { TeamStats } from '@/lib/types';

export default function Home() {
  const { data: stats } = useQuery<TeamStats>({
    queryKey: ['/api/stats/team']
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1e3a8a] to-[#1e40af]">
      <Header />
      
      <main>
        <HeroSection />
        

        

        
        {/* Quick Stats Section */}
        <section className="py-16 bg-gradient-to-br from-[#1e3a8a] to-[#1e40af]">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-8">
              {/* Stat Card 1 */}
              <div className="text-center p-8 bg-gradient-to-br from-[#fcd34d] to-[#f59e0b] rounded-2xl border border-[#fcd34d]/20">
                <div className="w-16 h-16 bg-[#1e3a8a] rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-trophy text-[#fcd34d] text-2xl"></i>
                </div>
                <h3 className="text-3xl font-bold text-white mb-2">
                  {stats?.matchesWon || 0}
                </h3>
                <p className="text-white/90 font-medium">Matches Won</p>
              </div>

              {/* Stat Card 2 */}
              <div className="text-center p-8 bg-gradient-to-br from-[#1e3a8a] to-[#1e40af] rounded-2xl border border-[#1e3a8a]/20">
                <div className="w-16 h-16 bg-[#fcd34d] rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-bullseye text-[#1e3a8a] text-2xl"></i>
                </div>
                <h3 className="text-3xl font-bold text-[#fcd34d] mb-2">
                  {stats?.totalRuns || 0}
                </h3>
                <p className="text-white/90 font-medium">Total Runs</p>
              </div>

              {/* Stat Card 3 */}
              <div className="text-center p-8 bg-gradient-to-br from-[#fcd34d] to-[#f59e0b] rounded-2xl border border-[#fcd34d]/20">
                <div className="w-16 h-16 bg-[#1e3a8a] rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-crosshairs text-[#fcd34d] text-2xl"></i>
                </div>
                <h3 className="text-3xl font-bold text-white mb-2">
                  {stats?.wicketsTaken || 0}
                </h3>
                <p className="text-white/90 font-medium">Wickets Taken</p>
              </div>

              {/* Stat Card 4 - Winning Rate */}
              <div className="text-center p-8 bg-gradient-to-br from-[#1e3a8a] to-[#1e40af] rounded-2xl border border-[#1e3a8a]/20">
                <div className="w-16 h-16 bg-[#fcd34d] rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-percentage text-[#1e3a8a] text-2xl"></i>
                </div>
                <h3 className="text-3xl font-bold text-[#fcd34d] mb-2">
                  {(stats as any)?.winningRate?.toFixed(1) || '0.0'}%
                </h3>
                <p className="text-white/90 font-medium">Win Rate</p>
              </div>

              {/* Stat Card 5 - NRR */}
              <div className="text-center p-8 bg-gradient-to-br from-[#fcd34d] to-[#f59e0b] rounded-2xl border border-[#fcd34d]/20">
                <div className="w-16 h-16 bg-[#1e3a8a] rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-chart-line text-[#fcd34d] text-2xl"></i>
                </div>
                <h3 className="text-3xl font-bold text-white mb-2">
                  {stats?.nrr !== undefined ? (stats.nrr >= 0 ? `+${stats.nrr.toFixed(3)}` : stats.nrr.toFixed(3)) : '+0.000'}
                </h3>
                <p className="text-white/90 font-medium">NRR</p>
              </div>
            </div>
          </div>
        </section>


        <Squad />
        <ARStadiumMap />
        <CricketTrivia />
        <LatestUpdates />
        <FanZone />
      </main>
      
      <Footer />
    </div>
  );
}
