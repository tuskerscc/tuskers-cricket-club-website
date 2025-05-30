<?php
require_once 'includes/functions.php';

$page_title = 'Team Statistics - TUSKERS CRICKET CLUB';
$team_stats = getTeamStats();

include 'includes/header.php';
?>

<!-- Page Header -->
<section class="bg-gradient-to-r from-royal-blue to-blue-700 py-20">
    <div class="container mx-auto px-4 text-center">
        <h1 class="text-5xl font-bold text-white mb-4">Team Statistics</h1>
        <p class="text-light-blue text-xl max-w-2xl mx-auto">
            Comprehensive performance metrics and achievements of TUSKERS CRICKET CLUB
        </p>
    </div>
</section>

<!-- Team Statistics -->
<section class="py-20 bg-gray-50">
    <div class="container mx-auto px-4">
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            <!-- Matches Won -->
            <div class="bg-white rounded-xl shadow-lg p-8 text-center">
                <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i class="fas fa-trophy text-2xl text-green-600"></i>
                </div>
                <h3 class="text-3xl font-bold text-royal-blue mb-2 counter"><?php echo $team_stats['matches_won']; ?></h3>
                <p class="text-gray-600 font-semibold">Matches Won</p>
            </div>

            <!-- Win Percentage -->
            <div class="bg-white rounded-xl shadow-lg p-8 text-center">
                <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i class="fas fa-percentage text-2xl text-royal-blue"></i>
                </div>
                <h3 class="text-3xl font-bold text-royal-blue mb-2 counter"><?php echo $team_stats['win_percentage']; ?>%</h3>
                <p class="text-gray-600 font-semibold">Win Percentage</p>
            </div>

            <!-- Total Runs -->
            <div class="bg-white rounded-xl shadow-lg p-8 text-center">
                <div class="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i class="fas fa-running text-2xl text-gold"></i>
                </div>
                <h3 class="text-3xl font-bold text-royal-blue mb-2 counter"><?php echo number_format($team_stats['total_runs']); ?></h3>
                <p class="text-gray-600 font-semibold">Total Runs Scored</p>
            </div>

            <!-- Wickets Taken -->
            <div class="bg-white rounded-xl shadow-lg p-8 text-center">
                <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i class="fas fa-bullseye text-2xl text-red-600"></i>
                </div>
                <h3 class="text-3xl font-bold text-royal-blue mb-2 counter"><?php echo $team_stats['wickets_taken']; ?></h3>
                <p class="text-gray-600 font-semibold">Wickets Taken</p>
            </div>

            <!-- Net Run Rate -->
            <div class="bg-white rounded-xl shadow-lg p-8 text-center">
                <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i class="fas fa-chart-line text-2xl text-purple-600"></i>
                </div>
                <h3 class="text-3xl font-bold <?php echo $team_stats['nrr'] >= 0 ? 'text-green-600' : 'text-red-600'; ?> mb-2">
                    <?php echo $team_stats['nrr']; ?>
                </h3>
                <p class="text-gray-600 font-semibold">Net Run Rate</p>
            </div>

            <!-- Total Matches -->
            <div class="bg-white rounded-xl shadow-lg p-8 text-center">
                <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i class="fas fa-calendar-check text-2xl text-gray-600"></i>
                </div>
                <h3 class="text-3xl font-bold text-royal-blue mb-2 counter"><?php echo $team_stats['total_matches']; ?></h3>
                <p class="text-gray-600 font-semibold">Total Matches Played</p>
            </div>
        </div>

        <!-- Detailed Statistics -->
        <div class="bg-white rounded-xl shadow-lg p-8">
            <h2 class="text-2xl font-bold text-royal-blue mb-6">Detailed Performance Metrics</h2>
            
            <div class="grid md:grid-cols-2 gap-8">
                <!-- Batting Statistics -->
                <div>
                    <h3 class="text-xl font-semibold text-gold mb-4 flex items-center">
                        <i class="fas fa-baseball-ball mr-2"></i>
                        Batting Performance
                    </h3>
                    <div class="space-y-4">
                        <div class="flex justify-between items-center py-2 border-b">
                            <span class="text-gray-600">Total Runs Scored</span>
                            <span class="font-semibold text-royal-blue"><?php echo number_format($team_stats['total_runs']); ?></span>
                        </div>
                        <div class="flex justify-between items-center py-2 border-b">
                            <span class="text-gray-600">Total Overs Faced</span>
                            <span class="font-semibold text-royal-blue"><?php echo $team_stats['total_overs']; ?></span>
                        </div>
                        <div class="flex justify-between items-center py-2 border-b">
                            <span class="text-gray-600">Average Run Rate</span>
                            <span class="font-semibold text-royal-blue">
                                <?php echo $team_stats['total_overs'] > 0 ? round($team_stats['total_runs'] / $team_stats['total_overs'], 2) : '0.00'; ?>
                            </span>
                        </div>
                    </div>
                </div>

                <!-- Bowling Statistics -->
                <div>
                    <h3 class="text-xl font-semibold text-gold mb-4 flex items-center">
                        <i class="fas fa-bowling-ball mr-2"></i>
                        Bowling Performance
                    </h3>
                    <div class="space-y-4">
                        <div class="flex justify-between items-center py-2 border-b">
                            <span class="text-gray-600">Wickets Taken</span>
                            <span class="font-semibold text-royal-blue"><?php echo $team_stats['wickets_taken']; ?></span>
                        </div>
                        <div class="flex justify-between items-center py-2 border-b">
                            <span class="text-gray-600">Runs Conceded</span>
                            <span class="font-semibold text-royal-blue"><?php echo number_format($team_stats['runs_against']); ?></span>
                        </div>
                        <div class="flex justify-between items-center py-2 border-b">
                            <span class="text-gray-600">Economy Rate</span>
                            <span class="font-semibold text-royal-blue">
                                <?php echo $team_stats['overs_against'] > 0 ? round($team_stats['runs_against'] / $team_stats['overs_against'], 2) : '0.00'; ?>
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Performance Chart Area -->
            <div class="mt-12">
                <h3 class="text-xl font-semibold text-royal-blue mb-6">Performance Overview</h3>
                <div class="grid md:grid-cols-2 gap-8">
                    <!-- Win/Loss Ratio -->
                    <div class="bg-gray-50 rounded-lg p-6">
                        <h4 class="font-semibold text-gray-800 mb-4">Match Results</h4>
                        <div class="space-y-3">
                            <?php 
                            $matches_lost = $team_stats['total_matches'] - $team_stats['matches_won'];
                            $win_width = $team_stats['total_matches'] > 0 ? ($team_stats['matches_won'] / $team_stats['total_matches']) * 100 : 0;
                            $loss_width = 100 - $win_width;
                            ?>
                            <div class="flex items-center justify-between">
                                <span class="text-sm text-gray-600">Wins</span>
                                <span class="text-sm font-semibold text-green-600"><?php echo $team_stats['matches_won']; ?></span>
                            </div>
                            <div class="w-full bg-gray-200 rounded-full h-3">
                                <div class="bg-green-500 h-3 rounded-full" style="width: <?php echo $win_width; ?>%"></div>
                            </div>
                            <div class="flex items-center justify-between">
                                <span class="text-sm text-gray-600">Losses</span>
                                <span class="text-sm font-semibold text-red-600"><?php echo $matches_lost; ?></span>
                            </div>
                            <div class="w-full bg-gray-200 rounded-full h-3">
                                <div class="bg-red-500 h-3 rounded-full" style="width: <?php echo $loss_width; ?>%"></div>
                            </div>
                        </div>
                    </div>

                    <!-- Key Performance Indicators -->
                    <div class="bg-gray-50 rounded-lg p-6">
                        <h4 class="font-semibold text-gray-800 mb-4">Key Performance Indicators</h4>
                        <div class="space-y-4">
                            <div class="flex justify-between items-center">
                                <span class="text-sm text-gray-600">Win Rate</span>
                                <span class="text-lg font-bold <?php echo $team_stats['win_percentage'] >= 50 ? 'text-green-600' : 'text-red-600'; ?>">
                                    <?php echo $team_stats['win_percentage']; ?>%
                                </span>
                            </div>
                            <div class="flex justify-between items-center">
                                <span class="text-sm text-gray-600">Net Run Rate</span>
                                <span class="text-lg font-bold <?php echo $team_stats['nrr'] >= 0 ? 'text-green-600' : 'text-red-600'; ?>">
                                    <?php echo $team_stats['nrr']; ?>
                                </span>
                            </div>
                            <div class="flex justify-between items-center">
                                <span class="text-sm text-gray-600">Avg Runs/Match</span>
                                <span class="text-lg font-bold text-royal-blue">
                                    <?php echo $team_stats['total_matches'] > 0 ? round($team_stats['total_runs'] / $team_stats['total_matches'], 1) : '0.0'; ?>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<?php include 'includes/footer.php'; ?>