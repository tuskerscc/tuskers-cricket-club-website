<?php
require_once 'includes/functions.php';

$page_title = 'Squad - TUSKERS CRICKET CLUB';
$players = getPlayers();

include 'includes/header.php';
?>

<!-- Page Header -->
<section class="bg-gradient-to-r from-royal-blue to-blue-700 py-20">
    <div class="container mx-auto px-4 text-center">
        <h1 class="text-5xl font-bold text-white mb-4">Our Squad</h1>
        <p class="text-light-blue text-xl max-w-2xl mx-auto">
            Meet the talented cricketers who represent TUSKERS CRICKET CLUB with pride and excellence
        </p>
    </div>
</section>

<!-- Squad Grid -->
<section class="py-20 bg-gray-50">
    <div class="container mx-auto px-4">
        <?php if (!empty($players)): ?>
        <div class="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <?php foreach ($players as $player): ?>
            <div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <!-- Player Photo -->
                <div class="relative">
                    <?php if ($player['photo']): ?>
                    <img src="<?php echo htmlspecialchars($player['photo']); ?>" alt="<?php echo htmlspecialchars($player['name']); ?>" class="w-full h-64 object-cover">
                    <?php else: ?>
                    <div class="w-full h-64 bg-royal-blue flex items-center justify-center">
                        <i class="fas fa-user text-light-gold text-6xl"></i>
                    </div>
                    <?php endif; ?>
                    
                    <!-- Jersey Number Badge -->
                    <?php if ($player['jersey_number']): ?>
                    <div class="absolute top-4 right-4 bg-gold text-royal-blue w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg">
                        <?php echo $player['jersey_number']; ?>
                    </div>
                    <?php endif; ?>
                    
                    <!-- Captain/Vice-Captain Badge -->
                    <?php if ($player['is_captain']): ?>
                    <div class="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        <i class="fas fa-star"></i> Captain
                    </div>
                    <?php elseif ($player['is_vice_captain']): ?>
                    <div class="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        <i class="fas fa-star-half-alt"></i> Vice Captain
                    </div>
                    <?php endif; ?>
                </div>

                <!-- Player Info -->
                <div class="p-6">
                    <h3 class="text-xl font-bold text-royal-blue mb-2"><?php echo htmlspecialchars($player['name']); ?></h3>
                    <p class="text-gold font-semibold mb-3"><?php echo htmlspecialchars($player['role']); ?></p>
                    
                    <!-- Playing Style -->
                    <div class="space-y-2 mb-4">
                        <?php if ($player['batting_style']): ?>
                        <div class="flex items-center text-sm text-gray-600">
                            <i class="fas fa-baseball-ball w-4 mr-2 text-royal-blue"></i>
                            <span>Bats: <?php echo htmlspecialchars($player['batting_style']); ?></span>
                        </div>
                        <?php endif; ?>
                        
                        <?php if ($player['bowling_style']): ?>
                        <div class="flex items-center text-sm text-gray-600">
                            <i class="fas fa-running w-4 mr-2 text-royal-blue"></i>
                            <span>Bowls: <?php echo htmlspecialchars($player['bowling_style']); ?></span>
                        </div>
                        <?php endif; ?>
                    </div>

                    <!-- Player Stats -->
                    <?php if (isset($player['runs_scored']) || isset($player['wickets_taken'])): ?>
                    <div class="border-t pt-4">
                        <h4 class="text-sm font-semibold text-royal-blue mb-2">Career Stats</h4>
                        <div class="grid grid-cols-2 gap-4 text-sm">
                            <?php if ($player['runs_scored']): ?>
                            <div class="text-center">
                                <div class="font-bold text-gold"><?php echo number_format($player['runs_scored']); ?></div>
                                <div class="text-gray-600">Runs</div>
                            </div>
                            <?php endif; ?>
                            
                            <?php if ($player['wickets_taken']): ?>
                            <div class="text-center">
                                <div class="font-bold text-gold"><?php echo $player['wickets_taken']; ?></div>
                                <div class="text-gray-600">Wickets</div>
                            </div>
                            <?php endif; ?>
                        </div>
                    </div>
                    <?php endif; ?>
                </div>
            </div>
            <?php endforeach; ?>
        </div>
        <?php else: ?>
        <div class="text-center py-20">
            <i class="fas fa-users text-6xl text-gray-400 mb-4"></i>
            <h3 class="text-2xl font-bold text-gray-600 mb-2">No Players Found</h3>
            <p class="text-gray-500">Squad information will be updated soon.</p>
        </div>
        <?php endif; ?>
    </div>
</section>

<!-- Team Statistics -->
<section class="py-20 bg-white">
    <div class="container mx-auto px-4">
        <div class="text-center mb-16">
            <h2 class="text-4xl font-bold text-royal-blue mb-4">Squad Statistics</h2>
            <p class="text-gray-600 text-lg">Current squad composition and key metrics</p>
        </div>

        <?php
        // Calculate squad statistics
        $total_players = count($players);
        $batsmen = count(array_filter($players, function($p) { return stripos($p['role'], 'batsman') !== false || stripos($p['role'], 'bat') !== false; }));
        $bowlers = count(array_filter($players, function($p) { return stripos($p['role'], 'bowler') !== false || stripos($p['role'], 'bowl') !== false; }));
        $all_rounders = count(array_filter($players, function($p) { return stripos($p['role'], 'all') !== false; }));
        $wicket_keepers = count(array_filter($players, function($p) { return stripos($p['role'], 'keeper') !== false; }));
        ?>

        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div class="text-center bg-gray-50 rounded-xl p-8">
                <div class="text-4xl font-bold text-royal-blue mb-2"><?php echo $total_players; ?></div>
                <div class="text-gray-600 font-semibold">Total Players</div>
            </div>
            <div class="text-center bg-gray-50 rounded-xl p-8">
                <div class="text-4xl font-bold text-gold mb-2"><?php echo $batsmen; ?></div>
                <div class="text-gray-600 font-semibold">Batsmen</div>
            </div>
            <div class="text-center bg-gray-50 rounded-xl p-8">
                <div class="text-4xl font-bold text-royal-blue mb-2"><?php echo $bowlers; ?></div>
                <div class="text-gray-600 font-semibold">Bowlers</div>
            </div>
            <div class="text-center bg-gray-50 rounded-xl p-8">
                <div class="text-4xl font-bold text-gold mb-2"><?php echo $all_rounders; ?></div>
                <div class="text-gray-600 font-semibold">All-Rounders</div>
            </div>
        </div>
    </div>
</section>

<?php include 'includes/footer.php'; ?>