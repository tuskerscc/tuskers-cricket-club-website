import { useQuery } from '@tanstack/react-query';
import type { Lineup, Player } from '@shared/schema';

interface LineupWithPlayer extends Lineup {
  player: Player;
}

export default function StartingEleven() {
  // For demo purposes, using a mock match ID
  const matchId = 1;
  
  const { data: lineup = [], isLoading } = useQuery<LineupWithPlayer[]>({
    queryKey: [`/api/matches/${matchId}/lineup`]
  });

  if (isLoading) {
    return (
      <section id="starting11" className="py-16 bg-[#1e3a8a] text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Starting XI</h2>
            <p className="text-xl text-[#bfdbfe]">Loading lineup...</p>
          </div>
          <div className="relative max-w-4xl mx-auto">
            <div className="cricket-field rounded-full aspect-square p-8 animate-pulse bg-green-400"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="starting11" className="py-16 bg-[#1e3a8a] text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Starting XI</h2>
          <p className="text-xl text-[#bfdbfe]">Our lineup for the upcoming match vs Lightning Bolts</p>
          <div className="inline-flex items-center bg-[#f59e0b] text-[#1e3a8a] px-4 py-2 rounded-full font-semibold text-sm mt-4">
            <i className="fas fa-calendar mr-2"></i>
            Next Match: Dec 15, 2024
          </div>
        </div>

        {/* Cricket Field Formation */}
        <div className="relative max-w-4xl mx-auto">
          <div className="cricket-field rounded-full aspect-square p-8">
            {/* Pitch in center */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-2 bg-yellow-200 rounded"></div>
            
            {/* Sample player positions - in real app, these would be mapped from lineup data */}
            
            {/* Wicket Keeper */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-2 mx-auto shadow-lg">
                <img 
                  src="https://images.unsplash.com/photo-1552674605-db6ffd4facb5?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100" 
                  alt="Wicket Keeper" 
                  className="w-14 h-14 rounded-full object-cover object-top"
                />
              </div>
              <div className="bg-[#1e3a8a] bg-opacity-90 px-3 py-1 rounded-lg text-sm">
                <div className="font-bold text-[#fcd34d]">D. Kumar</div>
                <div className="text-xs text-[#bfdbfe]">WK</div>
              </div>
            </div>

            {/* Captain (Mid field) */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-2 mx-auto shadow-lg border-4 border-[#fcd34d]">
                <img 
                  src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100" 
                  alt="Captain" 
                  className="w-12 h-12 rounded-full object-cover object-top"
                />
              </div>
              <div className="bg-[#1e3a8a] bg-opacity-90 px-3 py-1 rounded-lg text-sm relative">
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                  <i className="fas fa-crown text-[#fcd34d] text-xs"></i>
                </div>
                <div className="font-bold text-[#fcd34d]">R. Sharma</div>
                <div className="text-xs text-[#bfdbfe]">C</div>
              </div>
            </div>

            {/* Bowlers */}
            <div className="absolute top-8 left-1/4 transform -translate-x-1/2 text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-2 mx-auto shadow-lg">
                <img 
                  src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100" 
                  alt="Fast Bowler" 
                  className="w-14 h-14 rounded-full object-cover object-top"
                />
              </div>
              <div className="bg-[#1e3a8a] bg-opacity-90 px-3 py-1 rounded-lg text-sm">
                <div className="font-bold text-[#fcd34d]">M. Ali</div>
                <div className="text-xs text-[#bfdbfe]">PACE</div>
              </div>
            </div>

            <div className="absolute top-8 right-1/4 transform translate-x-1/2 text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-2 mx-auto shadow-lg">
                <span className="text-[#1e3a8a] font-bold text-lg">SK</span>
              </div>
              <div className="bg-[#1e3a8a] bg-opacity-90 px-3 py-1 rounded-lg text-sm">
                <div className="font-bold text-[#fcd34d]">S. Khan</div>
                <div className="text-xs text-[#bfdbfe]">SPIN</div>
              </div>
            </div>

            {/* Fielders scattered around */}
            <div className="absolute top-1/4 left-8 text-center">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-1 mx-auto shadow-lg">
                <span className="text-[#1e3a8a] font-bold text-sm">JW</span>
              </div>
              <div className="bg-[#1e3a8a] bg-opacity-90 px-2 py-1 rounded text-xs">
                <div className="font-bold text-[#fcd34d]">J. Wilson</div>
              </div>
            </div>

            <div className="absolute top-1/4 right-8 text-center">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-1 mx-auto shadow-lg">
                <span className="text-[#1e3a8a] font-bold text-sm">AP</span>
              </div>
              <div className="bg-[#1e3a8a] bg-opacity-90 px-2 py-1 rounded text-xs">
                <div className="font-bold text-[#fcd34d]">A. Patel</div>
              </div>
            </div>

            <div className="absolute bottom-1/4 left-12 text-center">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-1 mx-auto shadow-lg">
                <span className="text-[#1e3a8a] font-bold text-sm">VS</span>
              </div>
              <div className="bg-[#1e3a8a] bg-opacity-90 px-2 py-1 rounded text-xs">
                <div className="font-bold text-[#fcd34d]">V. Singh</div>
              </div>
            </div>

            <div className="absolute bottom-1/4 right-12 text-center">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-1 mx-auto shadow-lg">
                <span className="text-[#1e3a8a] font-bold text-sm">NT</span>
              </div>
              <div className="bg-[#1e3a8a] bg-opacity-90 px-2 py-1 rounded text-xs">
                <div className="font-bold text-[#fcd34d]">N. Taylor</div>
              </div>
            </div>
          </div>

          {/* Formation Legend */}
          <div className="mt-8 grid md:grid-cols-3 gap-4 text-center">
            <div className="bg-[#1e40af] p-4 rounded-lg">
              <i className="fas fa-shield-alt text-[#fcd34d] text-2xl mb-2"></i>
              <h4 className="font-bold text-[#fcd34d]">Wicket Keeper</h4>
              <p className="text-sm text-[#bfdbfe]">Behind the stumps</p>
            </div>
            <div className="bg-[#1e40af] p-4 rounded-lg">
              <i className="fas fa-running text-[#fcd34d] text-2xl mb-2"></i>
              <h4 className="font-bold text-[#fcd34d]">Bowlers</h4>
              <p className="text-sm text-[#bfdbfe]">Pace & Spin attack</p>
            </div>
            <div className="bg-[#1e40af] p-4 rounded-lg">
              <i className="fas fa-users text-[#fcd34d] text-2xl mb-2"></i>
              <h4 className="font-bold text-[#fcd34d]">Fielders</h4>
              <p className="text-sm text-[#bfdbfe]">Strategic positions</p>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <button className="bg-[#f59e0b] text-[#1e3a8a] px-8 py-4 rounded-lg font-semibold text-lg hover:bg-[#fbbf24] transition-colors mr-4">
            Download Team Sheet
          </button>
          <button className="border-2 border-[#fcd34d] text-[#fcd34d] px-8 py-4 rounded-lg font-semibold text-lg hover:bg-[#fcd34d] hover:text-[#1e3a8a] transition-colors">
            Match Preview
          </button>
        </div>
      </div>
    </section>
  );
}
