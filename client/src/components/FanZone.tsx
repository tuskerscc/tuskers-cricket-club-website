import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { SocialPost, Poll, GalleryItem } from '@shared/schema';

export default function FanZone() {
  const [selectedPollOption, setSelectedPollOption] = useState<string>('');
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<string>('');

  const { data: socialPosts = [] } = useQuery<SocialPost[]>({
    queryKey: ['/api/social-posts']
  });

  const { data: polls = [] } = useQuery<Poll[]>({
    queryKey: ['/api/polls']
  });

  const { data: galleryItems = [] } = useQuery<GalleryItem[]>({
    queryKey: ['/api/gallery']
  });

  const activePoll = polls[0];
  const recentGallery = galleryItems.slice(0, 4);

  const handlePollVote = async (option: string) => {
    if (!activePoll) return;
    
    setSelectedPollOption(option);
    
    try {
      const response = await fetch(`/api/polls/${activePoll.id}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ option }),
      });
      
      if (response.ok) {
        // Refresh poll data
        // In a real app, you'd invalidate the query here
        alert('Thank you for voting!');
      }
    } catch (error) {
      console.error('Failed to vote:', error);
    }
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
            {/* Poll Widget */}
            {activePoll && (
              <div className="bg-gradient-to-br from-[#fef3c7] to-yellow-50 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-[#1e3a8a] mb-4">Fan Poll</h3>
                <div className="mb-4">
                  <h4 className="font-semibold text-[#1e40af] mb-3">{activePoll.question}</h4>
                  <div className="space-y-3">
                    {Array.isArray(activePoll.options) && activePoll.options.map((option: string, index: number) => {
                      const votes = (activePoll.votes as Record<string, number>)?.[option] || 0;
                      const totalVotes = Object.values((activePoll.votes as Record<string, number>) || {}).reduce((sum, v) => sum + v, 0);
                      const percentage = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
                      
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
                              <span className="text-[#1e3a8a] font-bold">{percentage}%</span>
                            </div>
                            <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-[#1e3a8a] rounded-full transition-all duration-300" 
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                  <p className="text-sm text-gray-600 mt-3">
                    {Object.values((activePoll.votes as Record<string, number>) || {}).reduce((sum, v) => sum + v, 0)} votes • 
                    {activePoll.endsAt ? ` Poll ends ${new Date(activePoll.endsAt).toLocaleDateString()}` : ' Active poll'}
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

            {/* Quiz Widget */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-[#1e3a8a] mb-4">Cricket Quiz</h3>
              <div className="mb-4">
                <h4 className="font-semibold text-[#1e40af] mb-3">Who holds the record for most runs in a single Cricket World Cup?</h4>
                <div className="space-y-2">
                  {['Sachin Tendulkar', 'Rohit Sharma', 'Martin Guptill', 'David Warner'].map((answer) => (
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
          </div>
        </div>
      </div>
    </section>
  );
}
