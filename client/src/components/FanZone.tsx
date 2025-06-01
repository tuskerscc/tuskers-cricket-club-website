import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { SocialPost, Poll, GalleryItem } from '@shared/schema';
import GalleryHeartButton from './GalleryHeartButton';

interface CricketPoll {
  question: string;
  options: string[];
  context: string;
  isLive: boolean;
}

interface CricketQuiz {
  question: string;
  options: string[];
  correct: string;
  context: string;
}

export default function FanZone() {
  const [selectedPollOption, setSelectedPollOption] = useState<string>('');
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<string>('');

  const { data: cricketPoll } = useQuery<CricketPoll>({
    queryKey: ['/api/cricket/live-poll'],
    refetchInterval: 300000 // Refetch every 5 minutes for new questions
  });

  const { data: cricketQuiz } = useQuery<CricketQuiz>({
    queryKey: ['/api/cricket/live-quiz'],
    refetchInterval: 600000 // Refetch every 10 minutes for new questions
  });

  const { data: galleryItems = [] } = useQuery<GalleryItem[]>({
    queryKey: ['/api/gallery']
  });
  const recentGallery = galleryItems.slice(0, 4);

  const handlePollVote = async (option: string) => {
    setSelectedPollOption(option);
    alert('Thank you for voting on the live cricket poll!');
  };

  const handleNextQuestion = () => {
    setSelectedQuizAnswer('');
    // Trigger a refetch for new quiz question
    window.location.reload();
  };

  const handleViewGallery = () => {
    window.location.href = '/gallery';
  };

  return (
    <section id="fanzone" className="py-16 bg-gradient-to-br from-[#1e3a8a] to-[#1e40af]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-[#fcd34d] mb-4">Fan Zone</h2>
          <p className="text-xl text-white/80">Join the TUSKERS CRICKET CLUB community and engage with fellow cricket enthusiasts</p>
        </div>

        {/* Poll and Quiz Side by Side */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Cricket Poll */}
          <div>
            {/* Cricket Historical Poll Widget */}
            {cricketPoll && (
              <div className="bg-gradient-to-br from-[#fef3c7] to-yellow-50 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-[#1e3a8a]">Cricket Poll</h3>
                  <div className="flex items-center bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    <i className="fas fa-history mr-1"></i>
                    CRICKET TRIVIA
                  </div>
                </div>
                <div className="mb-4">
                  <h4 className="font-semibold text-[#1e40af] mb-3">{cricketPoll.question}</h4>
                  <div className="bg-blue-50 p-3 rounded-lg mb-3">
                    <p className="text-sm text-blue-800">
                      <i className="fas fa-info-circle mr-1"></i>
                      {cricketPoll.context}
                    </p>
                  </div>
                  <div className="space-y-3">
                    {cricketPoll.options.map((option: string, index: number) => {
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
                    Based on cricket history and records • New questions every 5 minutes
                  </p>
                </div>
              </div>
            )}

          </div>

          {/* Cricket Quiz */}
          <div>
            {/* Cricket Historical Quiz Widget */}
            {cricketQuiz && (
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-[#1e3a8a]">Cricket Quiz</h3>
                  <div className="flex items-center bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    <i className="fas fa-trophy mr-1"></i>
                    CRICKET KNOWLEDGE
                  </div>
                </div>
                <div className="mb-4">
                  <h4 className="font-semibold text-[#1e40af] mb-3">{cricketQuiz.question}</h4>
                  <div className="bg-green-50 p-3 rounded-lg mb-3">
                    <p className="text-sm text-green-800">
                      <i className="fas fa-info-circle mr-1"></i>
                      {cricketQuiz.context}
                    </p>
                  </div>
                  <div className="space-y-2">
                    {cricketQuiz.options.map((answer: string) => (
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
                        {selectedQuizAnswer === answer && answer === cricketQuiz.correct && (
                          <i className="fas fa-check text-green-600 ml-2"></i>
                        )}
                      </button>
                    ))}
                  </div>
                  {selectedQuizAnswer && (
                    <div className={`mt-3 p-3 rounded-lg ${
                      selectedQuizAnswer === cricketQuiz.correct 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {selectedQuizAnswer === cricketQuiz.correct 
                        ? 'Correct! Well done!' 
                        : `Incorrect. The correct answer is: ${cricketQuiz.correct}`
                      }
                    </div>
                  )}
                </div>
                <button 
                  onClick={handleNextQuestion}
                  className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  Next Question
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Gallery at the end */}
        <div className="bg-gradient-to-br from-[#eff6ff] to-purple-50 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-[#1e3a8a] mb-4">Gallery</h3>
          {recentGallery.length > 0 ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
                {recentGallery.map((item) => (
                  <div key={item.id} className="relative group">
                    <div className="w-full h-48 bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center shadow-lg">
                      <img 
                        src={item.imageUrl} 
                        alt={item.title} 
                        className="max-w-full max-h-full object-contain cursor-pointer hover:opacity-80 transition-opacity rounded-xl"
                      />
                    </div>
                    <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm rounded-lg p-1">
                      <GalleryHeartButton 
                        galleryItemId={item.id} 
                        initialLikesCount={item.likesCount || 0}
                      />
                    </div>
                    <div className="absolute bottom-2 left-2 right-8 bg-black/50 text-white px-2 py-1 rounded text-xs truncate">
                      {item.title}
                    </div>
                  </div>
                ))}
              </div>
              <button 
                onClick={handleViewGallery}
                className="w-full bg-[#1e3a8a] text-white py-3 rounded-lg font-semibold hover:bg-[#1e40af] transition-colors"
              >
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
      </div>
    </section>
  );
}
