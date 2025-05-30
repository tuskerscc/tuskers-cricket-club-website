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
            <div className="text-center text-white mb-8">
              <h2 className="text-3xl font-bold mb-2">📢 Latest Announcements</h2>
              <p className="text-blue-100">Stay updated with our latest club news and updates</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {announcements.length === 0 ? (
                <div className="col-span-full">
                  <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-8 text-center">
                    <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">📢</span>
                    </div>
                    <p className="text-white text-opacity-90 text-lg">No announcements at the moment.</p>
                    <p className="text-white text-opacity-70 text-sm mt-2">Check back later for updates!</p>
                  </div>
                </div>
              ) : (
                announcements.slice(0, 3).map((announcement) => (
                  <div 
                    key={announcement.id}
                    className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-6 hover:bg-opacity-20 transition-all duration-300 cursor-pointer group"
                    onClick={() => {
                      // Create modal for full announcement view
                      const modal = document.createElement('div');
                      modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
                      modal.innerHTML = `
                        <div class="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                          <div class="flex justify-between items-start mb-4">
                            <h2 class="text-2xl font-bold text-[#1e3a8a]">${announcement.title}</h2>
                            <button class="text-gray-500 hover:text-gray-700 text-2xl font-bold" onclick="this.closest('.fixed').remove()">&times;</button>
                          </div>
                          <div class="text-gray-600 mb-4">
                            Posted ${announcement.createdAt ? new Date(announcement.createdAt).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            }) : 'recently'}
                          </div>
                          <div class="text-gray-800 leading-relaxed whitespace-pre-wrap">${announcement.content}</div>
                        </div>
                      `;
                      modal.onclick = (e) => {
                        if (e.target === modal) modal.remove();
                      };
                      document.body.appendChild(modal);
                    }}
                  >
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-[#fcd34d] rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-[#1e3a8a] text-xl font-bold">📢</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-[#fcd34d] transition-colors">
                          {announcement.title}
                        </h3>
                        <p className="text-white text-opacity-90 text-sm leading-relaxed line-clamp-3">
                          {announcement.content.length > 120 
                            ? `${announcement.content.substring(0, 120)}...` 
                            : announcement.content
                          }
                        </p>
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-xs text-white text-opacity-70">
                            {announcement.createdAt ? new Date(announcement.createdAt).toLocaleDateString() : 'Recently posted'}
                          </span>
                          <span className="text-xs text-[#fcd34d] group-hover:text-white transition-colors">
                            Click to read more →
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            {announcements.length > 3 && (
              <div className="text-center mt-8">
                <button className="bg-[#fcd34d] text-[#1e3a8a] px-6 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition-colors">
                  View All Announcements
                </button>
              </div>
            )}
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
