import { useQuery } from '@tanstack/react-query';
import type { Announcement } from '@shared/schema';

export default function HeroSection() {
  const { data: announcements = [] } = useQuery<Announcement[]>({
    queryKey: ['/api/announcements']
  });

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#1e3a8a] via-[#1e40af] to-[#1d4ed8]">
      {/* Background Image */}
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080')`
        }}
      ></div>
      
      <div className="relative container-responsive py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Hero Content */}
          <div className="text-white text-center lg:text-left">
            <h1 className="text-responsive-3xl font-bold mb-4 sm:mb-6 leading-tight">
              Welcome to<br />
              <span className="text-[#fcd34d]">Tuskers CC</span>
            </h1>
            <p className="text-responsive-base mb-6 sm:mb-8 text-gray-200 leading-relaxed max-w-lg mx-auto lg:mx-0">
              Passionate cricket, extraordinary talent, and unwavering dedication. 
              Join us as we continue our journey to excellence on and off the field.
            </p>
          </div>

          {/* Latest Announcements Widget */}
          <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-2xl padding-responsive shadow-2xl">
            <div className="text-center mb-4">
              <h3 className="text-responsive-lg font-bold text-[#1e3a8a]">📢 Latest Announcements</h3>
              <p className="text-gray-600 text-responsive-xs">Stay updated with our latest club news</p>
            </div>
            
            <div className="max-h-64 overflow-y-auto">
              {announcements.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-[#1e3a8a] bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">📢</span>
                  </div>
                  <p className="text-gray-600">No announcements at the moment.</p>
                  <p className="text-gray-500 text-sm mt-2">Check back later for updates!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {announcements.slice(0, 3).map((announcement, index) => (
                    <div 
                      key={announcement.id}
                      className={`cursor-pointer hover:bg-gray-50 p-3 rounded-lg transition-colors ${
                        index < announcements.slice(0, 3).length - 1 ? 'border-b border-gray-200' : ''
                      }`}
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
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-[#fcd34d] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="text-[#1e3a8a] text-sm">📢</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-[#1e3a8a] text-sm mb-1 leading-tight">
                            {announcement.title}
                          </h4>
                          <p className="text-gray-600 text-xs leading-relaxed line-clamp-2">
                            {announcement.content.length > 80 
                              ? `${announcement.content.substring(0, 80)}...` 
                              : announcement.content
                            }
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-gray-500">
                              {announcement.createdAt ? new Date(announcement.createdAt).toLocaleDateString() : 'Recently posted'}
                            </span>
                            <span className="text-xs text-[#1e3a8a] hover:text-[#fcd34d] transition-colors">
                              Read more →
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
