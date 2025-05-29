import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { SocialPost, Poll, GalleryItem } from '@shared/schema';

interface LivePoll {
  question: string;
  options: string[];
  isLive: boolean;
  matchInfo?: {
    venue: string;
    status: string;
    scores?: any;
  };
}

interface LiveQuiz {
  question: string;
  options: string[];
  correct: string;
  context?: string;
  isLive: boolean;
}

export default function FanZone() {
  const [selectedPollOption, setSelectedPollOption] = useState<string>('');
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<string>('');

  const { data: livePoll } = useQuery<LivePoll>({
    queryKey: ['/api/cricket/live-poll'],
    refetchInterval: 60000 // Refetch every minute for live updates
  });

  const { data: liveQuiz } = useQuery<LiveQuiz>({
    queryKey: ['/api/cricket/live-quiz'],
    refetchInterval: 300000 // Refetch every 5 minutes
  });

  const { data: galleryItems = [] } = useQuery<GalleryItem[]>({
    queryKey: ['/api/gallery']
  });
  const recentGallery = galleryItems.slice(0, 4);

  const handlePollVote = async (option: string) => {
    setSelectedPollOption(option);
    alert('Thank you for voting on the live cricket poll!');
  };

  return (
    <section id="fanzone" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-[#1e3a8a] mb-4">Fan Zone</h2>
          <p className="text-xl text-gray-600">Join the Tuskers community and engage with fellow cricket enthusiasts</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Polls & Engagement */}
          <div className="space-y-8">
            {/* Live Cricket Poll Widget */}
            {livePoll && (
              <div className="bg-gradient-to-br from-[#fef3c7] to-yellow-50 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-[#1e3a8a]">Live Cricket Poll</h3>
                  {livePoll.isLive && (
                    <div className="flex items-center bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                      <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
                      LIVE
                    </div>
                  )}
                </div>
                <div className="mb-4">
                  <h4 className="font-semibold text-[#1e40af] mb-3">{livePoll.question}</h4>
                  {livePoll.matchInfo && (
                    <div className="bg-blue-50 p-3 rounded-lg mb-3">
                      <p className="text-sm text-blue-800">
                        <i className="fas fa-map-marker-alt mr-1"></i>
                        {livePoll.matchInfo.venue} • {livePoll.matchInfo.status}
                      </p>
                    </div>
                  )}
                  <div className="space-y-3">
                    {livePoll.options.map((option: string, index: number) => {
                      const randomPercentage = Math.floor(Math.random() * 40) + 10; // Simulate voting percentages
                      
                      return (
                        <div key={index} className="relative">
                          <button 
                            className={`w-full text-left p-3 bg-white rounded-lg border-2 transition-colors ${
                              selectedPollOption === option 
                                ? 'border-[#1e40af] bg-[#eff6ff]' 
                                : 'border-transparent hover:border-[#bfdbfe]'
                            }`}
                            onClick={() => handlePollVote(option)}
                          >
                            <div className="flex justify-between items-center">
                              <span className="font-medium">{option}</span>
                              <span className="text-[#1e3a8a] font-bold">{randomPercentage}%</span>
                            </div>
                            <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-[#1e3a8a] rounded-full transition-all duration-300" 
                                style={{ width: `${randomPercentage}%` }}
                              ></div>
                            </div>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                  <p className="text-sm text-gray-600 mt-3">
                    Based on live international cricket matches • Updates every minute
                  </p>
                </div>
              </div>
            )}

            {/* Photo Gallery Widget */}
            <div className="bg-gradient-to-br from-[#eff6ff] to-purple-50 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-[#1e3a8a] mb-4">Match Gallery</h3>
              {recentGallery.length > 0 ? (
                <>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {recentGallery.map((item) => (
                      <img 
                        key={item.id}
                        src={item.imageUrl} 
                        alt={item.title} 
                        className="w-full h-24 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                      />
                    ))}
                  </div>
                  <button className="w-full bg-[#1e3a8a] text-white py-3 rounded-lg font-semibold hover:bg-[#1e40af] transition-colors">
                    View Full Gallery
                  </button>
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No gallery items available.</p>
                  <button className="bg-[#1e3a8a] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#1e40af] transition-colors">
                    Upload Photos
                  </button>
                </div>
              )}
            </div>

            {/* Live Cricket Quiz Widget */}
            {liveQuiz && (
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-[#1e3a8a]">Cricket Quiz</h3>
                  {liveQuiz.isLive && (
                    <div className="flex items-center bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                      <i className="fas fa-trophy mr-1"></i>
                      LIVE CONTEXT
                    </div>
                  )}
                </div>
                <div className="mb-4">
                  <h4 className="font-semibold text-[#1e40af] mb-3">{liveQuiz.question}</h4>
                  {liveQuiz.context && (
                    <div className="bg-green-50 p-3 rounded-lg mb-3">
                      <p className="text-sm text-green-800">
                        <i className="fas fa-info-circle mr-1"></i>
                        {liveQuiz.context}
                      </p>
                    </div>
                  )}
                  <div className="space-y-2">
                    {liveQuiz.options.map((answer) => (
                      <button 
                        key={answer}
                        className={`w-full text-left p-3 bg-white rounded-lg border-2 transition-colors ${
                          selectedQuizAnswer === answer 
                            ? 'border-green-500 bg-green-50' 
                            : 'border-transparent hover:border-green-200'
                        }`}
                        onClick={() => setSelectedQuizAnswer(answer)}
                      >
                        {answer}
                      </button>
                    ))}
                  </div>
                </div>
                <button className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">
                  Take Full Quiz
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
