import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface TriviaQuestion {
  id: number;
  question: string;
  options: string[];
  correct: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  points: number;
}

interface LeaderboardEntry {
  id: number;
  playerName: string;
  score: number;
  questionsAnswered: number;
  accuracy: number;
  date: string;
  rank: number;
}

interface GameSession {
  currentQuestion: number;
  score: number;
  streak: number;
  timeRemaining: number;
  questions: TriviaQuestion[];
  answers: Record<number, string>;
}

export default function CricketTrivia() {
  const [gameMode, setGameMode] = useState<'menu' | 'playing' | 'results'>('menu');
  const [playerName, setPlayerName] = useState('');
  const [gameSession, setGameSession] = useState<GameSession | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);

  const queryClient = useQueryClient();

  // Fetch daily leaderboard
  const { data: leaderboard = [] } = useQuery<LeaderboardEntry[]>({
    queryKey: ['/api/trivia/leaderboard'],
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  // Fetch trivia questions
  const { data: questions = [] } = useQuery<TriviaQuestion[]>({
    queryKey: ['/api/trivia/questions']
  });

  // Submit score mutation
  const submitScoreMutation = useMutation({
    mutationFn: async (data: { playerName: string; score: number; questionsAnswered: number; accuracy: number }) => {
      const response = await fetch('/api/trivia/submit-score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit score');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/trivia/leaderboard'] });
    }
  });

  // Timer effect
  useEffect(() => {
    if (gameMode === 'playing' && gameSession && timeLeft > 0 && !showAnswer) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
    if (timeLeft === 0 && !showAnswer) {
      handleTimeUp();
    }
  }, [timeLeft, gameMode, showAnswer]);

  const startGame = () => {
    if (!playerName.trim()) {
      alert('Please enter your name to start playing!');
      return;
    }

    const shuffledQuestions = [...questions]
      .sort(() => Math.random() - 0.5)
      .slice(0, 10); // 10 questions per game

    setGameSession({
      currentQuestion: 0,
      score: 0,
      streak: 0,
      timeRemaining: 300, // 5 minutes total
      questions: shuffledQuestions,
      answers: {}
    });
    setGameMode('playing');
    setTimeLeft(30);
    setSelectedAnswer('');
    setShowAnswer(false);
  };

  const handleAnswerSelect = (answer: string) => {
    if (showAnswer) return;
    setSelectedAnswer(answer);
  };

  const handleSubmitAnswer = () => {
    if (!gameSession || !selectedAnswer) return;

    const currentQ = gameSession.questions[gameSession.currentQuestion];
    const isCorrect = selectedAnswer === currentQ.correct;
    
    let newScore = gameSession.score;
    let newStreak = gameSession.streak;

    if (isCorrect) {
      // Scoring system: base points + streak bonus + time bonus
      const timeBonus = Math.floor(timeLeft / 5); // Bonus points for speed
      const streakBonus = newStreak * 2;
      newScore += currentQ.points + timeBonus + streakBonus;
      newStreak += 1;
    } else {
      newStreak = 0;
    }

    setGameSession({
      ...gameSession,
      score: newScore,
      streak: newStreak,
      answers: {
        ...gameSession.answers,
        [gameSession.currentQuestion]: selectedAnswer
      }
    });

    setShowAnswer(true);
    setTimeout(() => {
      nextQuestion();
    }, 2000);
  };

  const handleTimeUp = () => {
    if (!gameSession) return;
    
    setGameSession({
      ...gameSession,
      streak: 0,
      answers: {
        ...gameSession.answers,
        [gameSession.currentQuestion]: ''
      }
    });
    
    setShowAnswer(true);
    setTimeout(() => {
      nextQuestion();
    }, 2000);
  };

  const nextQuestion = () => {
    if (!gameSession) return;

    if (gameSession.currentQuestion < gameSession.questions.length - 1) {
      setGameSession({
        ...gameSession,
        currentQuestion: gameSession.currentQuestion + 1
      });
      setSelectedAnswer('');
      setShowAnswer(false);
      setTimeLeft(30);
    } else {
      endGame();
    }
  };

  const endGame = () => {
    if (!gameSession) return;

    const questionsAnswered = gameSession.questions.length;
    const correctAnswers = Object.entries(gameSession.answers).filter(
      ([index, answer]) => answer === gameSession.questions[parseInt(index)].correct
    ).length;
    const accuracy = (correctAnswers / questionsAnswered) * 100;

    // Submit score to leaderboard
    submitScoreMutation.mutate({
      playerName,
      score: gameSession.score,
      questionsAnswered,
      accuracy
    });

    setGameMode('results');
  };

  const resetGame = () => {
    setGameMode('menu');
    setGameSession(null);
    setPlayerName('');
    setSelectedAnswer('');
    setShowAnswer(false);
    setTimeLeft(30);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (gameMode === 'menu') {
    return (
      <section id="trivia" className="py-16 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#1e3a8a] mb-4">🏏 Cricket Trivia Challenge</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Test your cricket knowledge and compete with fans worldwide!
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto items-start justify-center">
            {/* Game Start */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-[#1e3a8a] rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-play text-white text-3xl"></i>
                </div>
                <h3 className="text-2xl font-bold text-[#1e3a8a] mb-2">Start New Game</h3>
                <p className="text-gray-600">Answer 10 cricket questions and earn points!</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                  <input
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
                    maxLength={20}
                  />
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2">Game Rules:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• 10 questions, 30 seconds each</li>
                    <li>• Points for correct answers + speed bonus</li>
                    <li>• Streak multiplier for consecutive correct answers</li>
                    <li>• Compete for daily leaderboard position</li>
                  </ul>
                </div>

                <button
                  onClick={startGame}
                  disabled={!playerName.trim()}
                  className="w-full bg-[#1e3a8a] text-white py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Start Trivia Challenge
                </button>
              </div>
            </div>

            {/* Daily Leaderboard */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-[#f59e0b] rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-trophy text-white text-3xl"></i>
                </div>
                <h3 className="text-2xl font-bold text-[#1e3a8a] mb-2">Daily Leaderboard</h3>
                <p className="text-gray-600">Top cricket trivia masters today</p>
              </div>

              <div className="space-y-3">
                {leaderboard.length > 0 ? (
                  leaderboard.slice(0, 10).map((entry, index) => (
                    <div
                      key={entry.id}
                      className={`flex items-center justify-between p-3 rounded-lg ${
                        index < 3 ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200' : 'bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          index === 0 ? 'bg-yellow-400 text-yellow-900' :
                          index === 1 ? 'bg-gray-400 text-gray-900' :
                          index === 2 ? 'bg-orange-400 text-orange-900' :
                          'bg-gray-200 text-gray-700'
                        }`}>
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">{entry.playerName}</p>
                          <p className="text-xs text-gray-500">
                            {entry.questionsAnswered} questions • {entry.accuracy.toFixed(1)}% accuracy
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-[#1e3a8a]">{entry.score.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">points</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <i className="fas fa-clock text-3xl mb-2"></i>
                    <p>Be the first to play today!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (gameMode === 'playing' && gameSession) {
    const currentQ = gameSession.questions[gameSession.currentQuestion];
    const progress = ((gameSession.currentQuestion + 1) / gameSession.questions.length) * 100;

    return (
      <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="max-w-4xl mx-auto">
            {/* Game Header */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <h3 className="text-xl font-bold text-[#1e3a8a]">Cricket Trivia</h3>
                  <div className="text-sm text-gray-600">
                    Question {gameSession.currentQuestion + 1} of {gameSession.questions.length}
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Score</p>
                    <p className="text-xl font-bold text-[#1e3a8a]">{gameSession.score.toLocaleString()}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Streak</p>
                    <p className="text-xl font-bold text-green-600">{gameSession.streak}</p>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div 
                  className="bg-[#1e3a8a] h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>

              {/* Timer */}
              <div className="flex items-center justify-center">
                <div className={`text-center p-3 rounded-lg ${timeLeft <= 10 ? 'bg-red-100' : 'bg-blue-100'}`}>
                  <p className="text-sm text-gray-600">Time Remaining</p>
                  <p className={`text-2xl font-bold ${timeLeft <= 10 ? 'text-red-600' : 'text-[#1e3a8a]'}`}>
                    {timeLeft}s
                  </p>
                </div>
              </div>
            </div>

            {/* Question Card */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getDifficultyColor(currentQ.difficulty)}`}>
                    {currentQ.difficulty.toUpperCase()} • {currentQ.points} pts
                  </span>
                  <span className="text-sm text-gray-500">{currentQ.category}</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-6">{currentQ.question}</h3>
              </div>

              <div className="grid gap-4 mb-6">
                {currentQ.options.map((option, index) => {
                  let buttonClass = "w-full p-4 text-left border-2 rounded-lg transition-all ";
                  
                  if (showAnswer) {
                    if (option === currentQ.correct) {
                      buttonClass += "border-green-500 bg-green-50 text-green-800";
                    } else if (option === selectedAnswer && option !== currentQ.correct) {
                      buttonClass += "border-red-500 bg-red-50 text-red-800";
                    } else {
                      buttonClass += "border-gray-200 bg-gray-50 text-gray-600";
                    }
                  } else {
                    if (selectedAnswer === option) {
                      buttonClass += "border-[#1e3a8a] bg-[#eff6ff] text-[#1e3a8a]";
                    } else {
                      buttonClass += "border-gray-200 hover:border-[#1e3a8a] hover:bg-blue-50";
                    }
                  }

                  return (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(option)}
                      disabled={showAnswer}
                      className={buttonClass}
                    >
                      <div className="flex items-center">
                        <span className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                          {String.fromCharCode(65 + index)}
                        </span>
                        {option}
                      </div>
                    </button>
                  );
                })}
              </div>

              {!showAnswer && (
                <button
                  onClick={handleSubmitAnswer}
                  disabled={!selectedAnswer}
                  className="w-full bg-[#1e3a8a] text-white py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit Answer
                </button>
              )}

              {showAnswer && (
                <div className="text-center">
                  <div className={`inline-flex items-center px-4 py-2 rounded-lg ${
                    selectedAnswer === currentQ.correct ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    <i className={`fas ${selectedAnswer === currentQ.correct ? 'fa-check' : 'fa-times'} mr-2`}></i>
                    {selectedAnswer === currentQ.correct ? 'Correct!' : 'Incorrect!'}
                  </div>
                  <p className="text-gray-600 mt-2">Next question in a moment...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (gameMode === 'results' && gameSession) {
    const questionsAnswered = gameSession.questions.length;
    const correctAnswers = Object.entries(gameSession.answers).filter(
      ([index, answer]) => answer === gameSession.questions[parseInt(index)].correct
    ).length;
    const accuracy = (correctAnswers / questionsAnswered) * 100;

    return (
      <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <div className="mb-6">
                <div className="w-24 h-24 bg-[#1e3a8a] rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-trophy text-white text-4xl"></i>
                </div>
                <h2 className="text-3xl font-bold text-[#1e3a8a] mb-2">Game Complete!</h2>
                <p className="text-gray-600">Great job, {playerName}!</p>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="text-2xl font-bold text-[#1e3a8a]">{gameSession.score.toLocaleString()}</h3>
                  <p className="text-gray-600">Total Score</p>
                </div>
                <div className="bg-green-50 p-6 rounded-lg">
                  <h3 className="text-2xl font-bold text-green-600">{correctAnswers}/{questionsAnswered}</h3>
                  <p className="text-gray-600">Correct Answers</p>
                </div>
                <div className="bg-yellow-50 p-6 rounded-lg">
                  <h3 className="text-2xl font-bold text-yellow-600">{accuracy.toFixed(1)}%</h3>
                  <p className="text-gray-600">Accuracy</p>
                </div>
              </div>

              <div className="space-y-4">
                <button
                  onClick={startGame}
                  className="w-full bg-[#1e3a8a] text-white py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors"
                >
                  Play Again
                </button>
                <button
                  onClick={resetGame}
                  className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  Back to Menu
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return null;
}