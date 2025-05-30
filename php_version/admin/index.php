<?php
require_once '../includes/functions.php';
requireLogin();

$page_title = 'Admin Dashboard - TUSKERS CRICKET CLUB';

// Get dashboard statistics
$players = getPlayers();
$articles = getArticles(5); // Get latest 5 articles
$team_stats = getTeamStats();
$gallery_items = getGalleryItems();

include '../includes/header.php';
?>

<!-- Admin Navigation -->
<div class="bg-white shadow-sm border-b">
    <div class="container mx-auto px-4">
        <div class="flex items-center justify-between py-4">
            <h1 class="text-2xl font-bold text-royal-blue">Admin Dashboard</h1>
            <div class="flex items-center space-x-4">
                <span class="text-gray-600">Welcome, <?php echo $_SESSION['username']; ?></span>
                <a href="logout.php" class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors">
                    <i class="fas fa-sign-out-alt mr-2"></i>Logout
                </a>
            </div>
        </div>
    </div>
</div>

<!-- Admin Menu -->
<div class="bg-gray-100 py-6">
    <div class="container mx-auto px-4">
        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <a href="players.php" class="bg-white rounded-lg p-6 shadow hover:shadow-lg transition-shadow text-center">
                <i class="fas fa-users text-royal-blue text-3xl mb-3"></i>
                <h3 class="font-semibold text-gray-800">Manage Players</h3>
                <p class="text-sm text-gray-600"><?php echo count($players); ?> players</p>
            </a>
            <a href="articles.php" class="bg-white rounded-lg p-6 shadow hover:shadow-lg transition-shadow text-center">
                <i class="fas fa-newspaper text-royal-blue text-3xl mb-3"></i>
                <h3 class="font-semibold text-gray-800">Manage Articles</h3>
                <p class="text-sm text-gray-600"><?php echo count($articles); ?> articles</p>
            </a>
            <a href="gallery.php" class="bg-white rounded-lg p-6 shadow hover:shadow-lg transition-shadow text-center">
                <i class="fas fa-images text-royal-blue text-3xl mb-3"></i>
                <h3 class="font-semibold text-gray-800">Manage Gallery</h3>
                <p class="text-sm text-gray-600"><?php echo count($gallery_items); ?> images</p>
            </a>
            <a href="match-performance.php" class="bg-white rounded-lg p-6 shadow hover:shadow-lg transition-shadow text-center">
                <i class="fas fa-chart-line text-royal-blue text-3xl mb-3"></i>
                <h3 class="font-semibold text-gray-800">Match Performance</h3>
                <p class="text-sm text-gray-600">Record stats</p>
            </a>
        </div>
    </div>
</div>

<!-- Dashboard Content -->
<section class="py-12">
    <div class="container mx-auto px-4">
        <!-- Statistics Overview -->
        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div class="bg-white rounded-xl shadow-lg p-6">
                <div class="flex items-center justify-between">
                    <div>
                        <h3 class="text-lg font-semibold text-gray-800">Total Players</h3>
                        <p class="text-3xl font-bold text-royal-blue"><?php echo count($players); ?></p>
                    </div>
                    <i class="fas fa-users text-4xl text-royal-blue opacity-20"></i>
                </div>
            </div>
            
            <div class="bg-white rounded-xl shadow-lg p-6">
                <div class="flex items-center justify-between">
                    <div>
                        <h3 class="text-lg font-semibold text-gray-800">Matches Won</h3>
                        <p class="text-3xl font-bold text-gold"><?php echo $team_stats['matches_won']; ?></p>
                    </div>
                    <i class="fas fa-trophy text-4xl text-gold opacity-20"></i>
                </div>
            </div>
            
            <div class="bg-white rounded-xl shadow-lg p-6">
                <div class="flex items-center justify-between">
                    <div>
                        <h3 class="text-lg font-semibold text-gray-800">Win Percentage</h3>
                        <p class="text-3xl font-bold text-royal-blue"><?php echo $team_stats['win_percentage']; ?>%</p>
                    </div>
                    <i class="fas fa-percentage text-4xl text-royal-blue opacity-20"></i>
                </div>
            </div>
            
            <div class="bg-white rounded-xl shadow-lg p-6">
                <div class="flex items-center justify-between">
                    <div>
                        <h3 class="text-lg font-semibold text-gray-800">Total Runs</h3>
                        <p class="text-3xl font-bold text-gold"><?php echo number_format($team_stats['total_runs']); ?></p>
                    </div>
                    <i class="fas fa-running text-4xl text-gold opacity-20"></i>
                </div>
            </div>
        </div>

        <div class="grid lg:grid-cols-2 gap-8">
            <!-- Recent Articles -->
            <div class="bg-white rounded-xl shadow-lg p-6">
                <div class="flex items-center justify-between mb-6">
                    <h2 class="text-xl font-bold text-royal-blue">Recent Articles</h2>
                    <a href="articles.php" class="text-gold hover:text-royal-blue">View All</a>
                </div>
                
                <?php if (!empty($articles)): ?>
                <div class="space-y-4">
                    <?php foreach (array_slice($articles, 0, 5) as $article): ?>
                    <div class="border-b pb-4 last:border-b-0">
                        <h3 class="font-semibold text-gray-800 mb-1"><?php echo htmlspecialchars($article['title']); ?></h3>
                        <p class="text-sm text-gray-600"><?php echo formatDate($article['created_at']); ?></p>
                    </div>
                    <?php endforeach; ?>
                </div>
                <?php else: ?>
                <p class="text-gray-500 text-center py-8">No articles found</p>
                <?php endif; ?>
            </div>

            <!-- Team Performance Summary -->
            <div class="bg-white rounded-xl shadow-lg p-6">
                <h2 class="text-xl font-bold text-royal-blue mb-6">Team Performance Summary</h2>
                
                <div class="space-y-4">
                    <div class="flex justify-between items-center">
                        <span class="text-gray-600">Total Matches</span>
                        <span class="font-semibold"><?php echo $team_stats['total_matches']; ?></span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-gray-600">Matches Won</span>
                        <span class="font-semibold text-green-600"><?php echo $team_stats['matches_won']; ?></span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-gray-600">Win Rate</span>
                        <span class="font-semibold"><?php echo $team_stats['win_percentage']; ?>%</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-gray-600">Total Runs Scored</span>
                        <span class="font-semibold"><?php echo number_format($team_stats['total_runs']); ?></span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-gray-600">Wickets Taken</span>
                        <span class="font-semibold"><?php echo $team_stats['wickets_taken']; ?></span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-gray-600">Net Run Rate</span>
                        <span class="font-semibold <?php echo $team_stats['nrr'] >= 0 ? 'text-green-600' : 'text-red-600'; ?>">
                            <?php echo $team_stats['nrr']; ?>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<?php include '../includes/footer.php'; ?>