<?php
/*
Template Name: Squad Page
*/
get_header(); ?>

<!-- Page Header -->
<section class="content-section" style="background: linear-gradient(135deg, var(--royal-blue) 0%, var(--dark-blue) 100%); padding: 5rem 0;">
    <div class="section-container">
        <div class="section-header">
            <h1 style="color: white; font-size: 3rem; margin-bottom: 1rem;">Our Squad</h1>
            <p style="color: var(--light-blue); font-size: 1.25rem; max-width: 48rem; margin: 0 auto;">
                Meet the talented cricketers who represent TUSKERS CRICKET CLUB with pride and excellence
            </p>
        </div>
    </div>
</section>

<!-- Squad Grid -->
<section class="content-section">
    <div class="section-container">
        <div class="card-grid">
            <?php
            $players = new WP_Query(array(
                'post_type' => 'player',
                'posts_per_page' => -1,
                'meta_key' => 'jersey_number',
                'orderby' => 'meta_value_num',
                'order' => 'ASC'
            ));

            if ($players->have_posts()) :
                while ($players->have_posts()) : $players->the_post(); 
                    $jersey_number = get_post_meta(get_the_ID(), 'jersey_number', true);
                    $role = get_post_meta(get_the_ID(), 'role', true);
                    $batting_style = get_post_meta(get_the_ID(), 'batting_style', true);
                    $bowling_style = get_post_meta(get_the_ID(), 'bowling_style', true);
                    $is_captain = get_post_meta(get_the_ID(), 'is_captain', true);
                    $is_vice_captain = get_post_meta(get_the_ID(), 'is_vice_captain', true);
                    $runs_scored = get_post_meta(get_the_ID(), 'runs_scored', true);
                    $wickets_taken = get_post_meta(get_the_ID(), 'wickets_taken', true);
                    ?>
                    <div class="card">
                        <div style="position: relative;">
                            <?php if (has_post_thumbnail()) : ?>
                                <img src="<?php the_post_thumbnail_url('player-thumbnail'); ?>" alt="<?php the_title(); ?>" class="card-image">
                            <?php else : ?>
                                <div class="card-image" style="background-color: var(--royal-blue); display: flex; align-items: center; justify-content: center;">
                                    <i class="fas fa-user" style="font-size: 3rem; color: var(--light-gold);"></i>
                                </div>
                            <?php endif; ?>
                            
                            <?php if ($jersey_number) : ?>
                                <div style="position: absolute; top: 1rem; right: 1rem; background-color: var(--gold); color: var(--royal-blue); width: 3rem; height: 3rem; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 1.125rem;">
                                    <?php echo $jersey_number; ?>
                                </div>
                            <?php endif; ?>
                            
                            <?php if ($is_captain) : ?>
                                <div style="position: absolute; top: 1rem; left: 1rem; background-color: #dc2626; color: white; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 600;">
                                    <i class="fas fa-star"></i> Captain
                                </div>
                            <?php elseif ($is_vice_captain) : ?>
                                <div style="position: absolute; top: 1rem; left: 1rem; background-color: #2563eb; color: white; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 600;">
                                    <i class="fas fa-star-half-alt"></i> Vice Captain
                                </div>
                            <?php endif; ?>
                        </div>

                        <div class="card-content">
                            <h3 class="card-title"><?php the_title(); ?></h3>
                            <?php if ($role) : ?>
                                <p style="color: var(--gold); font-weight: 600; margin-bottom: 0.75rem;"><?php echo $role; ?></p>
                            <?php endif; ?>
                            
                            <div style="margin-bottom: 1rem;">
                                <?php if ($batting_style) : ?>
                                    <div style="display: flex; align-items: center; font-size: 0.875rem; color: var(--gray-600); margin-bottom: 0.5rem;">
                                        <i class="fas fa-baseball-ball" style="width: 1rem; margin-right: 0.5rem; color: var(--royal-blue);"></i>
                                        <span>Bats: <?php echo $batting_style; ?></span>
                                    </div>
                                <?php endif; ?>
                                
                                <?php if ($bowling_style) : ?>
                                    <div style="display: flex; align-items: center; font-size: 0.875rem; color: var(--gray-600);">
                                        <i class="fas fa-running" style="width: 1rem; margin-right: 0.5rem; color: var(--royal-blue);"></i>
                                        <span>Bowls: <?php echo $bowling_style; ?></span>
                                    </div>
                                <?php endif; ?>
                            </div>

                            <?php if ($runs_scored || $wickets_taken) : ?>
                                <div style="border-top: 1px solid var(--gray-100); padding-top: 1rem;">
                                    <h4 style="font-size: 0.875rem; font-weight: 600; color: var(--royal-blue); margin-bottom: 0.5rem;">Career Stats</h4>
                                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; font-size: 0.875rem;">
                                        <?php if ($runs_scored) : ?>
                                            <div style="text-align: center;">
                                                <div style="font-weight: bold; color: var(--gold);"><?php echo number_format($runs_scored); ?></div>
                                                <div style="color: var(--gray-600);">Runs</div>
                                            </div>
                                        <?php endif; ?>
                                        
                                        <?php if ($wickets_taken) : ?>
                                            <div style="text-align: center;">
                                                <div style="font-weight: bold; color: var(--gold);"><?php echo $wickets_taken; ?></div>
                                                <div style="color: var(--gray-600);">Wickets</div>
                                            </div>
                                        <?php endif; ?>
                                    </div>
                                </div>
                            <?php endif; ?>
                        </div>
                    </div>
                <?php endwhile;
                wp_reset_postdata();
            else : ?>
                <!-- Sample content when no players exist -->
                <div style="text-align: center; padding: 5rem 0; grid-column: 1 / -1;">
                    <i class="fas fa-users" style="font-size: 4rem; color: var(--gray-400); margin-bottom: 1rem;"></i>
                    <h3 style="font-size: 1.5rem; font-weight: bold; color: var(--gray-600); margin-bottom: 0.5rem;">No Players Found</h3>
                    <p style="color: var(--gray-500);">Squad information will be updated soon.</p>
                    <?php if (current_user_can('edit_posts')) : ?>
                        <p style="margin-top: 1rem;">
                            <a href="<?php echo admin_url('post-new.php?post_type=player'); ?>" class="btn-primary">Add Players</a>
                        </p>
                    <?php endif; ?>
                </div>
            <?php endif; ?>
        </div>
    </div>
</section>

<!-- Team Statistics -->
<section class="content-section" style="background: white;">
    <div class="section-container">
        <div class="section-header">
            <h2 class="section-title">Squad Statistics</h2>
            <p class="section-description">Current squad composition and key metrics</p>
        </div>

        <?php
        $total_players = $players->found_posts;
        $batsmen = 0;
        $bowlers = 0;
        $all_rounders = 0;
        $wicket_keepers = 0;

        // Count roles if we have players
        if ($players->have_posts()) {
            $players->rewind_posts();
            while ($players->have_posts()) {
                $players->the_post();
                $role = get_post_meta(get_the_ID(), 'role', true);
                if (stripos($role, 'batsman') !== false || stripos($role, 'bat') !== false) $batsmen++;
                if (stripos($role, 'bowler') !== false || stripos($role, 'bowl') !== false) $bowlers++;
                if (stripos($role, 'all') !== false) $all_rounders++;
                if (stripos($role, 'keeper') !== false) $wicket_keepers++;
            }
            wp_reset_postdata();
        }
        ?>

        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-number"><?php echo $total_players; ?></div>
                <div class="stat-label">Total Players</div>
            </div>
            <div class="stat-card">
                <div class="stat-number"><?php echo $batsmen; ?></div>
                <div class="stat-label">Batsmen</div>
            </div>
            <div class="stat-card">
                <div class="stat-number"><?php echo $bowlers; ?></div>
                <div class="stat-label">Bowlers</div>
            </div>
            <div class="stat-card">
                <div class="stat-number"><?php echo $all_rounders; ?></div>
                <div class="stat-label">All-Rounders</div>
            </div>
        </div>
    </div>
</section>

<?php get_footer(); ?>