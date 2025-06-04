import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight, Star, Users } from 'lucide-react';
import type { PlayerWithStats } from '@/lib/types';

export default function Squad() {
  const [category, setCategory] = useState<'all' | 'batsmen' | 'bowlers' | 'allrounders' | 'wicketkeeper'>('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(4);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const sliderRef = useRef<HTMLDivElement>(null);

  const { data: players = [], isLoading } = useQuery<PlayerWithStats[]>({
    queryKey: ['/api/players']
  });

  const filteredPlayers = players.filter(player => {
    if (category === 'all') return true;
    if (category === 'batsmen') return player.role.toLowerCase().includes('batsman');
    if (category === 'bowlers') return player.role.toLowerCase().includes('bowler');
    if (category === 'allrounders') return player.role.toLowerCase().includes('all-rounder');
    if (category === 'wicketkeeper') return player.role.toLowerCase().includes('wicket-keeper');
    return false;
  });

  // Responsive items per view
  useEffect(() => {
    const updateItemsPerView = () => {
      const width = window.innerWidth;
      if (width < 640) setItemsPerView(1);
      else if (width < 768) setItemsPerView(2);
      else if (width < 1024) setItemsPerView(3);
      else setItemsPerView(4);
    };

    updateItemsPerView();
    window.addEventListener('resize', updateItemsPerView);
    return () => window.removeEventListener('resize', updateItemsPerView);
  }, []);

  // Auto-scroll functionality
  useEffect(() => {
    if (!isAutoScrolling || filteredPlayers.length <= itemsPerView) return;
    
    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => {
        const maxIndex = Math.max(0, filteredPlayers.length - itemsPerView);
        return prevIndex >= maxIndex ? 0 : prevIndex + 1;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [filteredPlayers.length, isAutoScrolling, itemsPerView]);

  // Navigation functions
  const goToSlide = (index: number) => {
    const maxIndex = Math.max(0, filteredPlayers.length - itemsPerView);
    setCurrentIndex(Math.min(Math.max(0, index), maxIndex));
    setIsAutoScrolling(false);
    setTimeout(() => setIsAutoScrolling(true), 6000);
  };

  const nextSlide = () => {
    const maxIndex = Math.max(0, filteredPlayers.length - itemsPerView);
    const newIndex = currentIndex >= maxIndex ? 0 : currentIndex + 1;
    goToSlide(newIndex);
  };

  const prevSlide = () => {
    const maxIndex = Math.max(0, filteredPlayers.length - itemsPerView);
    const newIndex = currentIndex <= 0 ? maxIndex : currentIndex - 1;
    goToSlide(newIndex);
  };

  if (isLoading) {
    return (
      <section id="squad" className="py-8 md:py-16 bg-gradient-to-br from-[#1e3a8a] to-[#1e40af]">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-4xl font-bold text-[#fcd34d] mb-2">SQUAD</h2>
              <div className="flex items-center gap-2 text-sm text-white/80">
                <Users className="w-4 h-4" />
                
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 animate-pulse">
                <div className="w-full h-48 bg-gray-200"></div>
                <div className="p-4 text-center">
                  <div className="h-5 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-20 mx-auto"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const maxIndex = Math.max(0, filteredPlayers.length - itemsPerView);
  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < maxIndex;

  return (
    <section id="squad" className="py-8 md:py-16 bg-gradient-to-br from-[#1e3a8a] to-[#1e40af]">
      <div className="container-responsive">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div>
            <h2 className="text-responsive-2xl font-bold text-[#fcd34d] mb-2">SQUAD</h2>
            <div className="flex items-center gap-2 text-responsive-xs text-white/80">
              <Users className="w-4 h-4" />
              <span>Men's Team</span>
            </div>
          </div>
          
          {/* Navigation Controls */}
          <div className="flex items-center gap-4">
            {filteredPlayers.length > itemsPerView && (
              <div className="flex gap-2">
                <button
                  onClick={prevSlide}
                  disabled={!canGoPrev}
                  className={`p-2 rounded-full border transition-all duration-200 ${
                    canGoPrev 
                      ? 'border-[#1e3a8a] text-[#1e3a8a] hover:bg-[#1e3a8a] hover:text-white' 
                      : 'border-gray-300 text-gray-300 cursor-not-allowed'
                  }`}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextSlide}
                  disabled={!canGoNext}
                  className={`p-2 rounded-full border transition-all duration-200 ${
                    canGoNext 
                      ? 'border-[#1e3a8a] text-[#1e3a8a] hover:bg-[#1e3a8a] hover:text-white' 
                      : 'border-gray-300 text-gray-300 cursor-not-allowed'
                  }`}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <button 
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
              category === 'all' 
                ? 'bg-[#1e3a8a] text-white shadow-md' 
                : 'bg-white text-[#1e3a8a] border border-gray-200 hover:bg-gray-50'
            }`}
            onClick={() => {
              setCategory('all');
              setCurrentIndex(0);
            }}
          >
            All Players
          </button>
          <button 
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
              category === 'batsmen' 
                ? 'bg-[#1e3a8a] text-white shadow-md' 
                : 'bg-white text-[#1e3a8a] border border-gray-200 hover:bg-gray-50'
            }`}
            onClick={() => {
              setCategory('batsmen');
              setCurrentIndex(0);
            }}
          >
            Batsmen
          </button>
          <button 
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
              category === 'bowlers' 
                ? 'bg-[#1e3a8a] text-white shadow-md' 
                : 'bg-white text-[#1e3a8a] border border-gray-200 hover:bg-gray-50'
            }`}
            onClick={() => {
              setCategory('bowlers');
              setCurrentIndex(0);
            }}
          >
            Bowlers
          </button>
          <button 
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
              category === 'allrounders' 
                ? 'bg-[#1e3a8a] text-white shadow-md' 
                : 'bg-white text-[#1e3a8a] border border-gray-200 hover:bg-gray-50'
            }`}
            onClick={() => {
              setCategory('allrounders');
              setCurrentIndex(0);
            }}
          >
            All-Rounders
          </button>
          <button 
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
              category === 'wicketkeeper' 
                ? 'bg-[#1e3a8a] text-white shadow-md' 
                : 'bg-white text-[#1e3a8a] border border-gray-200 hover:bg-gray-50'
            }`}
            onClick={() => {
              setCategory('wicketkeeper');
              setCurrentIndex(0);
            }}
          >
            Wicket-Keepers
          </button>
        </div>

        {/* Players Grid/Slider */}
        <div className="relative overflow-hidden">
          <div 
            ref={sliderRef}
            className="flex transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
            }}
          >
            {filteredPlayers.map((player) => (
              <div
                key={player.id}
                className="flex-shrink-0 px-3"
                style={{ width: `${100 / itemsPerView}%` }}
              >
                <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 transform hover:-translate-y-1">
                  {/* Player Image */}
                  <div className="relative">
                    <div className="w-full h-48 bg-gradient-to-br from-[#1e3a8a] to-[#3b82f6] flex items-center justify-center">
                      {player.photo ? (
                        <img 
                          src={player.photo} 
                          alt={player.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-white text-6xl font-bold">
                          {player.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    
                    {/* Captain Badge */}
                    {player.name.toLowerCase().includes('captain') && (
                      <div className="absolute top-3 right-3 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        CAPTAIN
                      </div>
                    )}
                    
                    {/* Jersey Number */}
                    <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm text-[#1e3a8a] px-2 py-1 rounded-full text-sm font-bold">
                      #{player.jerseyNumber || player.id}
                    </div>
                  </div>

                  {/* Player Info */}
                  <div className="p-4 text-center">
                    <h3 className="font-bold text-gray-900 text-lg mb-1 line-clamp-1">
                      {player.name.toUpperCase()}
                    </h3>
                    <p className="text-[#1e3a8a] font-semibold text-sm">
                      {player.role.toUpperCase()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination Dots */}
        {filteredPlayers.length > itemsPerView && (
          <div className="flex justify-center mt-8 gap-2">
            {Array.from({ length: maxIndex + 1 }, (_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentIndex 
                    ? 'bg-[#1e3a8a] scale-110' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        )}

        {/* Player Count */}
        <div className="text-center mt-6">
          <p className="text-gray-600">
            Showing {Math.min(itemsPerView, filteredPlayers.length)} of {filteredPlayers.length} players
          </p>
        </div>
      </div>
    </section>
  );
}
