<?php
require_once 'includes/functions.php';

$page_title = 'Fan Zone - TUSKERS CRICKET CLUB';

include 'includes/header.php';
?>

<!-- Page Header -->
<section class="bg-gradient-to-r from-royal-blue to-blue-700 py-20">
    <div class="container mx-auto px-4 text-center">
        <h1 class="text-5xl font-bold text-white mb-4">Fan Zone</h1>
        <p class="text-light-blue text-xl max-w-2xl mx-auto">
            Test your cricket knowledge, participate in polls, and engage with fellow TUSKERS fans
        </p>
    </div>
</section>

<!-- Cricket Trivia Section -->
<section class="py-20 bg-gray-50">
    <div class="container mx-auto px-4">
        <div class="text-center mb-16">
            <h2 class="text-4xl font-bold text-royal-blue mb-4">Cricket Trivia</h2>
            <p class="text-gray-600 text-lg">Challenge yourself with cricket questions and climb the leaderboard</p>
        </div>

        <div class="grid lg:grid-cols-2 gap-12">
            <!-- Trivia Quiz -->
            <div class="bg-white rounded-xl shadow-lg p-8">
                <h3 class="text-2xl font-bold text-royal-blue mb-6">Quick Quiz</h3>
                
                <div id="triviaQuestion" class="mb-6">
                    <div class="bg-gray-100 rounded-lg p-6 mb-4">
                        <h4 class="text-lg font-semibold text-gray-800 mb-4">Who holds the record for the highest individual score in Test cricket?</h4>
                        <div class="space-y-3">
                            <label class="flex items-center cursor-pointer">
                                <input type="radio" name="answer" value="a" class="mr-3">
                                <span>Brian Lara (400*)</span>
                            </label>
                            <label class="flex items-center cursor-pointer">
                                <input type="radio" name="answer" value="b" class="mr-3">
                                <span>Matthew Hayden (380)</span>
                            </label>
                            <label class="flex items-center cursor-pointer">
                                <input type="radio" name="answer" value="c" class="mr-3">
                                <span>Don Bradman (334)</span>
                            </label>
                            <label class="flex items-center cursor-pointer">
                                <input type="radio" name="answer" value="d" class="mr-3">
                                <span>Virender Sehwag (319)</span>
                            </label>
                        </div>
                    </div>
                    <button onclick="submitAnswer()" class="bg-royal-blue hover:bg-blue-800 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                        Submit Answer
                    </button>
                </div>

                <div id="triviaResult" class="hidden">
                    <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                        <strong>Correct!</strong> Brian Lara holds the record with 400 not out.
                    </div>
                    <button onclick="nextQuestion()" class="bg-gold hover:bg-light-gold text-royal-blue px-6 py-3 rounded-lg font-semibold transition-colors">
                        Next Question
                    </button>
                </div>
            </div>

            <!-- Leaderboard -->
            <div class="bg-white rounded-xl shadow-lg p-8">
                <h3 class="text-2xl font-bold text-royal-blue mb-6">Trivia Leaderboard</h3>
                
                <div class="space-y-4">
                    <div class="flex items-center justify-between p-4 bg-gold bg-opacity-20 rounded-lg">
                        <div class="flex items-center">
                            <div class="w-8 h-8 bg-gold text-royal-blue rounded-full flex items-center justify-center font-bold mr-3">
                                1
                            </div>
                            <span class="font-semibold">CricketFan123</span>
                        </div>
                        <span class="text-royal-blue font-bold">850 pts</span>
                    </div>
                    
                    <div class="flex items-center justify-between p-4 bg-gray-100 rounded-lg">
                        <div class="flex items-center">
                            <div class="w-8 h-8 bg-gray-400 text-white rounded-full flex items-center justify-center font-bold mr-3">
                                2
                            </div>
                            <span class="font-semibold">TuskersSupporter</span>
                        </div>
                        <span class="text-royal-blue font-bold">720 pts</span>
                    </div>
                    
                    <div class="flex items-center justify-between p-4 bg-gray-100 rounded-lg">
                        <div class="flex items-center">
                            <div class="w-8 h-8 bg-orange-400 text-white rounded-full flex items-center justify-center font-bold mr-3">
                                3
                            </div>
                            <span class="font-semibold">CricketExpert</span>
                        </div>
                        <span class="text-royal-blue font-bold">680 pts</span>
                    </div>
                </div>

                <div class="mt-6 pt-6 border-t">
                    <div class="text-center">
                        <input type="text" placeholder="Enter your name" class="w-full px-4 py-2 border border-gray-300 rounded-lg mb-3 focus:ring-2 focus:ring-royal-blue focus:border-transparent">
                        <button class="w-full bg-royal-blue hover:bg-blue-800 text-white py-2 rounded-lg font-semibold transition-colors">
                            Join Leaderboard
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- Cricket Polls Section -->
<section class="py-20 bg-white">
    <div class="container mx-auto px-4">
        <div class="text-center mb-16">
            <h2 class="text-4xl font-bold text-royal-blue mb-4">Cricket Polls</h2>
            <p class="text-gray-600 text-lg">Vote on current cricket topics and see what other fans think</p>
        </div>

        <div class="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <!-- Current Poll -->
            <div class="bg-white border-2 border-royal-blue rounded-xl p-8">
                <h3 class="text-xl font-bold text-royal-blue mb-6">Which team has the best bowling attack in current cricket?</h3>
                
                <div class="space-y-4 mb-6">
                    <label class="flex items-center justify-between cursor-pointer p-3 border rounded-lg hover:bg-gray-50">
                        <div class="flex items-center">
                            <input type="radio" name="poll" value="australia" class="mr-3">
                            <span>Australia</span>
                        </div>
                        <span class="text-sm text-gray-600">35%</span>
                    </label>
                    
                    <label class="flex items-center justify-between cursor-pointer p-3 border rounded-lg hover:bg-gray-50">
                        <div class="flex items-center">
                            <input type="radio" name="poll" value="india" class="mr-3">
                            <span>India</span>
                        </div>
                        <span class="text-sm text-gray-600">28%</span>
                    </label>
                    
                    <label class="flex items-center justify-between cursor-pointer p-3 border rounded-lg hover:bg-gray-50">
                        <div class="flex items-center">
                            <input type="radio" name="poll" value="england" class="mr-3">
                            <span>England</span>
                        </div>
                        <span class="text-sm text-gray-600">22%</span>
                    </label>
                    
                    <label class="flex items-center justify-between cursor-pointer p-3 border rounded-lg hover:bg-gray-50">
                        <div class="flex items-center">
                            <input type="radio" name="poll" value="pakistan" class="mr-3">
                            <span>Pakistan</span>
                        </div>
                        <span class="text-sm text-gray-600">15%</span>
                    </label>
                </div>
                
                <button onclick="submitPoll()" class="w-full bg-royal-blue hover:bg-blue-800 text-white py-3 rounded-lg font-semibold transition-colors">
                    Vote Now
                </button>
                
                <p class="text-center text-sm text-gray-600 mt-4">Total votes: 1,247</p>
            </div>

            <!-- Poll Results -->
            <div class="bg-gray-50 rounded-xl p-8">
                <h3 class="text-xl font-bold text-royal-blue mb-6">Previous Poll Results</h3>
                
                <div class="mb-4">
                    <h4 class="font-semibold mb-3">Who is the best current batsman?</h4>
                    
                    <div class="space-y-3">
                        <div>
                            <div class="flex justify-between mb-1">
                                <span class="text-sm">Virat Kohli</span>
                                <span class="text-sm font-semibold">42%</span>
                            </div>
                            <div class="w-full bg-gray-200 rounded-full h-2">
                                <div class="bg-royal-blue h-2 rounded-full" style="width: 42%"></div>
                            </div>
                        </div>
                        
                        <div>
                            <div class="flex justify-between mb-1">
                                <span class="text-sm">Steve Smith</span>
                                <span class="text-sm font-semibold">31%</span>
                            </div>
                            <div class="w-full bg-gray-200 rounded-full h-2">
                                <div class="bg-gold h-2 rounded-full" style="width: 31%"></div>
                            </div>
                        </div>
                        
                        <div>
                            <div class="flex justify-between mb-1">
                                <span class="text-sm">Joe Root</span>
                                <span class="text-sm font-semibold">27%</span>
                            </div>
                            <div class="w-full bg-gray-200 rounded-full h-2">
                                <div class="bg-gray-400 h-2 rounded-full" style="width: 27%"></div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <p class="text-sm text-gray-600">Poll ended: 2 days ago • 2,156 votes</p>
            </div>
        </div>
    </div>
</section>

<!-- Fan Engagement Section -->
<section class="py-20 bg-gray-50">
    <div class="container mx-auto px-4">
        <div class="text-center mb-16">
            <h2 class="text-4xl font-bold text-royal-blue mb-4">Fan Community</h2>
            <p class="text-gray-600 text-lg">Connect with fellow TUSKERS supporters and cricket enthusiasts</p>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
            <!-- Forum Link -->
            <div class="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow">
                <div class="w-16 h-16 bg-royal-blue rounded-full flex items-center justify-center mx-auto mb-4">
                    <i class="fas fa-comments text-2xl text-white"></i>
                </div>
                <h3 class="text-xl font-bold text-royal-blue mb-3">Community Forum</h3>
                <p class="text-gray-600 mb-6">Discuss matches, share opinions, and connect with other fans</p>
                <a href="forum.php" class="bg-royal-blue hover:bg-blue-800 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                    Join Discussion
                </a>
            </div>

            <!-- Events -->
            <div class="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow">
                <div class="w-16 h-16 bg-gold rounded-full flex items-center justify-center mx-auto mb-4">
                    <i class="fas fa-calendar-alt text-2xl text-royal-blue"></i>
                </div>
                <h3 class="text-xl font-bold text-royal-blue mb-3">Fan Events</h3>
                <p class="text-gray-600 mb-6">Join exciting events, meetups, and watch parties</p>
                <a href="events.php" class="bg-gold hover:bg-light-gold text-royal-blue px-6 py-3 rounded-lg font-semibold transition-colors">
                    View Events
                </a>
            </div>

            <!-- Gallery -->
            <div class="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow">
                <div class="w-16 h-16 bg-royal-blue rounded-full flex items-center justify-center mx-auto mb-4">
                    <i class="fas fa-images text-2xl text-white"></i>
                </div>
                <h3 class="text-xl font-bold text-royal-blue mb-3">Photo Gallery</h3>
                <p class="text-gray-600 mb-6">Browse photos from matches, events, and team moments</p>
                <a href="gallery.php" class="bg-royal-blue hover:bg-blue-800 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                    View Gallery
                </a>
            </div>
        </div>
    </div>
</section>

<script>
// Trivia functionality
function submitAnswer() {
    const selected = document.querySelector('input[name="answer"]:checked');
    if (!selected) {
        alert('Please select an answer');
        return;
    }
    
    document.getElementById('triviaQuestion').classList.add('hidden');
    document.getElementById('triviaResult').classList.remove('hidden');
}

function nextQuestion() {
    // Reload or fetch new question
    location.reload();
}

// Poll functionality
function submitPoll() {
    const selected = document.querySelector('input[name="poll"]:checked');
    if (!selected) {
        alert('Please select an option');
        return;
    }
    
    alert('Thank you for voting! Your vote has been recorded.');
}
</script>

<?php include 'includes/footer.php'; ?>