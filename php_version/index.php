<?php
require_once 'includes/functions.php';

$page_title = 'TUSKERS CRICKET CLUB - Official Website';

// Get featured content
$featured_articles = getFeaturedArticles();
$players = getPlayers();
$team_stats = getTeamStats();
$gallery_items = array_slice(getGalleryItems(), 0, 6); // Get first 6 gallery items

include 'includes/header.php';
?>

<!-- Hero Section -->
<section class="relative bg-gradient-to-br from-royal-blue via-blue-700 to-royal-blue min-h-screen flex items-center overflow-hidden">
    <div class="absolute inset-0 bg-black opacity-20"></div>
    
    <!-- Background Pattern -->
    <div class="absolute inset-0 opacity-10">
        <div class="absolute top-20 left-20 w-64 h-64 border-2 border-light-gold rounded-full"></div>
        <div class="absolute bottom-40 right-20 w-48 h-48 border border-light-gold rounded-full"></div>
        <div class="absolute top-1/2 left-1/4 w-32 h-32 border border-light-gold rounded-full"></div>
    </div>

    <div class="container mx-auto px-4 relative z-10">
        <div class="grid lg:grid-cols-2 gap-12 items-center">
            <!-- Content -->
            <div class="text-white space-y-8">
                <div class="space-y-4">
                    <h1 class="text-5xl md:text-7xl font-bold leading-tight">
                        <span class="text-light-gold">TUSKERS</span><br>
                        <span class="text-white">CRICKET</span><br>
                        <span class="text-light-gold">CLUB</span>
                    </h1>
                    <p class="text-xl md:text-2xl text-light-blue max-w-lg">
                        Where passion meets excellence. Join the journey of champions.
                    </p>
                </div>

                <div class="flex flex-col sm:flex-row gap-4">
                    <a href="squad.php" class="bg-gold hover:bg-light-gold text-royal-blue px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 transform hover:scale-105 text-center">
                        Meet Our Squad
                    </a>
                    <a href="matches.php" class="border-2 border-light-gold hover:bg-light-gold hover:text-royal-blue text-light-gold px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 text-center">
                        View Matches
                    </a>
                </div>

                <!-- Quick Stats -->
                <div class="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8">
                    <div class="text-center">
                        <div class="text-3xl font-bold text-light-gold"><?php echo $team_stats['matches_won']; ?></div>
                        <div class="text-light-blue">Matches Won</div>
                    </div>
                    <div class="text-center">
                        <div class="text-3xl font-bold text-light-gold"><?php echo $team_stats['win_percentage']; ?>%</div>
                        <div class="text-light-blue">Win Rate</div>
                    </div>
                    <div class="text-center">
                        <div class="text-3xl font-bold text-light-gold"><?php echo count($players); ?></div>
                        <div class="text-light-blue">Squad Size</div>
                    </div>
                    <div class="text-center">
                        <div class="text-3xl font-bold text-light-gold"><?php echo number_format($team_stats['total_runs']); ?></div>
                        <div class="text-light-blue">Total Runs</div>
                    </div>
                </div>
            </div>

            <!-- Live Cricket Widget -->
            <div class="flex justify-center lg:justify-end">
                <div class="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                    <h3 class="text-white text-xl font-bold mb-4 text-center">Live Cricket Scores</h3>
                    <div id="cricket-widget">
                        <script>
                            cricWaves.getWidget('score')({
                                app: "www.cricwaves.com",
                                mo: "f1_zd",
                                nt: "ban",
                                Width: '302px',
                                Height: '252px'
                            });
                        </script>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Scroll Indicator -->
    <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <i class="fas fa-chevron-down text-light-gold text-2xl"></i>
    </div>
</section>

<!-- Featured News Section -->
<?php if (!empty($featured_articles)): ?>
<section class="py-20 bg-white">
    <div class="container mx-auto px-4">
        <div class="text-center mb-16">
            <h2 class="text-4xl font-bold text-royal-blue mb-4">Latest News</h2>
            <p class="text-gray-600 text-lg max-w-2xl mx-auto">Stay updated with the latest happenings from TUSKERS CRICKET CLUB</p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <?php foreach ($featured_articles as $article): ?>
            <article class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <?php if ($article['image_url']): ?>
                <img src="<?php echo htmlspecialchars($article['image_url']); ?>" alt="<?php echo htmlspecialchars($article['title']); ?>" class="w-full h-48 object-cover">
                <?php endif; ?>
                <div class="p-6">
                    <h3 class="text-xl font-bold text-royal-blue mb-3 line-clamp-2">
                        <?php echo htmlspecialchars($article['title']); ?>
                    </h3>
                    <p class="text-gray-600 mb-4 line-clamp-3">
                        <?php echo htmlspecialchars(substr($article['content'], 0, 150)) . '...'; ?>
                    </p>
                    <div class="flex justify-between items-center">
                        <span class="text-sm text-gray-500"><?php echo formatDate($article['created_at']); ?></span>
                        <a href="news.php?id=<?php echo $article['id']; ?>" class="text-gold hover:text-royal-blue font-semibold">Read More</a>
                    </div>
                </div>
            </article>
            <?php endforeach; ?>
        </div>

        <div class="text-center mt-12">
            <a href="news.php" class="bg-royal-blue hover:bg-blue-800 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
                View All News
            </a>
        </div>
    </div>
</section>
<?php endif; ?>

<!-- Squad Highlights -->
<section class="py-20 bg-gray-50">
    <div class="container mx-auto px-4">
        <div class="text-center mb-16">
            <h2 class="text-4xl font-bold text-royal-blue mb-4">Our Squad</h2>
            <p class="text-gray-600 text-lg max-w-2xl mx-auto">Meet the talented cricketers who represent TUSKERS CRICKET CLUB</p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <?php 
            $featured_players = array_slice($players, 0, 8); // Show first 8 players
            foreach ($featured_players as $player): 
            ?>
            <div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <?php if ($player['photo']): ?>
                <img src="<?php echo htmlspecialchars($player['photo']); ?>" alt="<?php echo htmlspecialchars($player['name']); ?>" class="w-full h-48 object-cover">
                <?php else: ?>
                <div class="w-full h-48 bg-royal-blue flex items-center justify-center">
                    <i class="fas fa-user text-light-gold text-4xl"></i>
                </div>
                <?php endif; ?>
                <div class="p-6">
                    <h3 class="text-lg font-bold text-royal-blue mb-2"><?php echo htmlspecialchars($player['name']); ?></h3>
                    <p class="text-gold font-semibold mb-1"><?php echo htmlspecialchars($player['role']); ?></p>
                    <?php if ($player['jersey_number']): ?>
                    <p class="text-gray-600 text-sm">Jersey #<?php echo $player['jersey_number']; ?></p>
                    <?php endif; ?>
                </div>
            </div>
            <?php endforeach; ?>
        </div>

        <div class="text-center mt-12">
            <a href="squad.php" class="bg-gold hover:bg-light-gold text-royal-blue px-8 py-3 rounded-lg font-semibold transition-colors">
                View Full Squad
            </a>
        </div>
    </div>
</section>

<!-- Gallery Preview -->
<?php if (!empty($gallery_items)): ?>
<section class="py-20 bg-white">
    <div class="container mx-auto px-4">
        <div class="text-center mb-16">
            <h2 class="text-4xl font-bold text-royal-blue mb-4">Gallery</h2>
            <p class="text-gray-600 text-lg max-w-2xl mx-auto">Capturing memorable moments from matches and team events</p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <?php foreach ($gallery_items as $item): ?>
            <div class="relative group overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                <img src="<?php echo htmlspecialchars($item['image_url']); ?>" alt="<?php echo htmlspecialchars($item['title']); ?>" class="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300">
                <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-end">
                    <div class="p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <h3 class="text-lg font-bold"><?php echo htmlspecialchars($item['title']); ?></h3>
                        <?php if ($item['description']): ?>
                        <p class="text-sm opacity-90"><?php echo htmlspecialchars($item['description']); ?></p>
                        <?php endif; ?>
                    </div>
                </div>
            </div>
            <?php endforeach; ?>
        </div>

        <div class="text-center mt-12">
            <a href="gallery.php" class="bg-royal-blue hover:bg-blue-800 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
                View Full Gallery
            </a>
        </div>
    </div>
</section>
<?php endif; ?>

<?php include 'includes/footer.php'; ?>