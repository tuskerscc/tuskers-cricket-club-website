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
import type { Announcement } from '@shared/schema';

export default function Home() {
  const { data: stats } = useQuery<TeamStats>({
    queryKey: ['/api/stats/team']
  });

  const { data: announcements = [] } = useQuery<Announcement[]>({
    queryKey: ['/api/announcements']
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main>
        <HeroSection />
        

        
        {/* Announcements Section */}
        <section className="py-12 bg-gradient-to-r from-[#1e3a8a] to-blue-800">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="text-center text-white">
              <h2 className="text-3xl font-bold mb-4">📢 Latest Announcements</h2>
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-6 max-w-4xl mx-auto">
                {announcements.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-white text-opacity-90">No announcements at the moment.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {announcements.slice(0, 3).map((announcement, index) => (
                      <div 
                        key={announcement.id}
                        className={`${index < announcements.slice(0, 3).length - 1 ? 'border-b border-white border-opacity-20 pb-4' : ''}`}
                      >
                        <h3 className="text-xl font-semibold text-[#fcd34d] mb-2">{announcement.title}</h3>
                        <p className="text-white text-opacity-90">{announcement.content}</p>
                        <span className="text-sm text-white text-opacity-70">
                          Posted {announcement.createdAt ? new Date(announcement.createdAt).toLocaleDateString() : 'recently'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
        
        {/* Quick Stats Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
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
                  <i className="fas fa-chart-line text-white text-2xl"></i>
                </div>
                <h3 className="text-3xl font-bold text-[#1e3a8a] mb-2">
                  {stats?.nrr !== undefined ? (stats.nrr >= 0 ? `+${stats.nrr.toFixed(3)}` : stats.nrr.toFixed(3)) : '+0.000'}
                </h3>
                <p className="text-gray-600 font-medium">NRR</p>
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
