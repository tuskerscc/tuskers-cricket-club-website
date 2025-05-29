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

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Social Media Feed */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-[#eff6ff] to-blue-50 rounded-2xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-[#1e3a8a]">Social Media Feed</h3>
                <div className="flex space-x-2">
                  <button className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors">
                    <i className="fab fa-twitter"></i>
                  </button>
                  <button className="bg-pink-600 text-white p-2 rounded-lg hover:bg-pink-700 transition-colors">
                    <i className="fab fa-instagram"></i>
                  </button>
                  <button className="bg-blue-800 text-white p-2 rounded-lg hover:bg-blue-900 transition-colors">
                    <i className="fab fa-facebook"></i>
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                {socialPosts.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No social media posts available at the moment.</p>
                  </div>
                ) : (
                  socialPosts.map((post) => (
                    <div key={post.id} className="bg-white rounded-xl p-6 shadow-sm">
                      <div className="flex items-start space-x-4">
                        <img 
                          src={post.authorAvatar || "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiByeD0iOCIgZmlsbD0iIzFlM2E4YSIvPgo8dGV4dCB4PSIyNCIgeT0iMzAiIGZvbnQtZmFtaWx5PSJJbnRlciIgZm9udC13ZWlnaHQ9IjgwMCIgZm9udC1zaXplPSIxNCIgZmlsbD0iI2Y1OWUwYiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+VEM8L3RleHQ+Cjwvc3ZnPgo="} 
                          alt={post.author} 
                          className="w-12 h-12 rounded-full"
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="font-bold text-[#1e3a8a]">@{post.author}</span>
                            {post.platform === 'twitter' && <i className="fas fa-check-circle text-blue-500 text-sm"></i>}
                            <span className="text-gray-500 text-sm">
                              {new Date(post.postedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-gray-800 mb-3">{post.content}</p>
                          <div className="flex items-center space-x-6 text-gray-500">
                            <button className="flex items-center space-x-1 hover:text-red-500 transition-colors">
                              <i className="far fa-heart"></i>
                              <span>{post.likes}</span>
                            </button>
                            <button className="flex items-center space-x-1 hover:text-blue-500 transition-colors">
                              <i className="far fa-comment"></i>
                              <span>{post.comments}</span>
                            </button>
                            <button className="flex items-center space-x-1 hover:text-green-500 transition-colors">
                              <i className="fas fa-retweet"></i>
                              <span>{post.shares}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="text-center mt-6">
                <button className="text-[#1e3a8a] font-semibold hover:text-[#f59e0b] transition-colors">
                  View More Posts <i className="fas fa-arrow-right ml-1"></i>
                </button>
              </div>
            </div>
          </div>

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
                <h4 className="font-semibold text-[#1e40af] mb-3">In which year was Tuskers CC founded?</h4>
                <div className="space-y-2">
                  {['2018', '2019', '2020', '2021'].map((answer) => (
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
