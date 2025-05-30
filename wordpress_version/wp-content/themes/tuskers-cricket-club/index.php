<?php get_header(); ?>

<!-- Hero Section -->
<section class="hero-section">
    <div class="hero-content">
        <div class="hero-text">
            <h1>
                <span class="club-name">TUSKERS</span><br>
                <span class="cricket-text">CRICKET</span><br>
                <span class="club-name">CLUB</span>
            </h1>
            <p class="hero-description">
                Where passion meets excellence. Join the journey of champions.
            </p>
            
            <div class="hero-buttons">
                <a href="<?php echo home_url('/squad'); ?>" class="btn-primary">Meet Our Squad</a>
                <a href="<?php echo home_url('/matches'); ?>" class="btn-secondary">View Matches</a>
            </div>

            <!-- Quick Stats -->
            <div class="stats-grid">
                <?php
                // Get team statistics from custom fields or database
                $matches_won = get_option('tuskers_matches_won', '12');
                $win_percentage = get_option('tuskers_win_percentage', '75');
                $squad_size = get_option('tuskers_squad_size', '15');
                $total_runs = get_option('tuskers_total_runs', '2847');
                ?>
                <div class="stat-card">
                    <div class="stat-number"><?php echo $matches_won; ?></div>
                    <div class="stat-label">Matches Won</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number"><?php echo $win_percentage; ?>%</div>
                    <div class="stat-label">Win Rate</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number"><?php echo $squad_size; ?></div>
                    <div class="stat-label">Squad Size</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number"><?php echo number_format($total_runs); ?></div>
                    <div class="stat-label">Total Runs</div>
                </div>
            </div>
        </div>

        <!-- Cricket Widget -->
        <div class="cricket-widget">
            <h3 class="widget-title">Live Cricket Scores</h3>
            <div id="cricket-widget-container">
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
</section>

<!-- Featured News Section -->
<section class="content-section" style="background: white;">
    <div class="section-container">
        <div class="section-header">
            <h2 class="section-title">Latest News</h2>
            <p class="section-description">Stay updated with the latest happenings from TUSKERS CRICKET CLUB</p>
        </div>

        <div class="card-grid">
            <?php
            // Get featured posts
            $featured_posts = new WP_Query(array(
                'posts_per_page' => 3,
                'meta_key' => 'featured_post',
                'meta_value' => 'yes',
                'post_status' => 'publish'
            ));

            if ($featured_posts->have_posts()) :
                while ($featured_posts->have_posts()) : $featured_posts->the_post(); ?>
                    <article class="card">
                        <?php if (has_post_thumbnail()) : ?>
                            <img src="<?php the_post_thumbnail_url('medium'); ?>" alt="<?php the_title(); ?>" class="card-image">
                        <?php endif; ?>
                        <div class="card-content">
                            <h3 class="card-title"><?php the_title(); ?></h3>
                            <p class="card-text"><?php echo wp_trim_words(get_the_excerpt(), 20); ?></p>
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <span style="font-size: 0.875rem; color: var(--gray-600);"><?php echo get_the_date(); ?></span>
                                <a href="<?php the_permalink(); ?>" style="color: var(--gold); font-weight: 600; text-decoration: none;">Read More</a>
                            </div>
                        </div>
                    </article>
                <?php endwhile;
                wp_reset_postdata();
            else : ?>
                <!-- Sample content when no posts exist -->
                <article class="card">
                    <div class="card-content">
                        <h3 class="card-title">TATA IPL 2025, Qualifier 1: RCB vs KKR Match Preview</h3>
                        <p class="card-text">The excitement builds as Royal Challengers Bangalore takes on Kolkata Knight Riders in the first qualifier...</p>
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <span style="font-size: 0.875rem; color: var(--gray-600);"><?php echo date('F j, Y'); ?></span>
                            <a href="#" style="color: var(--gold); font-weight: 600; text-decoration: none;">Read More</a>
                        </div>
                    </div>
                </article>
                <article class="card">
                    <div class="card-content">
                        <h3 class="card-title">TUSKERS CRICKET CLUB Wins Local Championship</h3>
                        <p class="card-text">In a thrilling final match, TUSKERS CRICKET CLUB secured victory in the local championship...</p>
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <span style="font-size: 0.875rem; color: var(--gray-600);"><?php echo date('F j, Y', strtotime('-3 days')); ?></span>
                            <a href="#" style="color: var(--gold); font-weight: 600; text-decoration: none;">Read More</a>
                        </div>
                    </div>
                </article>
                <article class="card">
                    <div class="card-content">
                        <h3 class="card-title">New Training Facilities Inaugurated</h3>
                        <p class="card-text">TUSKERS CRICKET CLUB proudly announces the inauguration of new state-of-the-art training facilities...</p>
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <span style="font-size: 0.875rem; color: var(--gray-600);"><?php echo date('F j, Y', strtotime('-1 week')); ?></span>
                            <a href="#" style="color: var(--gold); font-weight: 600; text-decoration: none;">Read More</a>
                        </div>
                    </div>
                </article>
            <?php endif; ?>
        </div>

        <div style="text-align: center; margin-top: 3rem;">
            <a href="<?php echo home_url('/news'); ?>" class="btn-primary">View All News</a>
        </div>
    </div>
</section>

<!-- Squad Highlights -->
<section class="content-section" style="background: var(--gray-50);">
    <div class="section-container">
        <div class="section-header">
            <h2 class="section-title">Our Squad</h2>
            <p class="section-description">Meet the talented cricketers who represent TUSKERS CRICKET CLUB</p>
        </div>

        <div class="card-grid">
            <?php
            // Get players from custom post type
            $players = new WP_Query(array(
                'post_type' => 'player',
                'posts_per_page' => 8,
                'meta_key' => 'jersey_number',
                'orderby' => 'meta_value_num',
                'order' => 'ASC'
            ));

            if ($players->have_posts()) :
                while ($players->have_posts()) : $players->the_post(); 
                    $jersey_number = get_post_meta(get_the_ID(), 'jersey_number', true);
                    $role = get_post_meta(get_the_ID(), 'role', true);
                    $is_captain = get_post_meta(get_the_ID(), 'is_captain', true);
                    $is_vice_captain = get_post_meta(get_the_ID(), 'is_vice_captain', true);
                    ?>
                    <div class="card">
                        <?php if (has_post_thumbnail()) : ?>
                            <img src="<?php the_post_thumbnail_url('medium'); ?>" alt="<?php the_title(); ?>" class="card-image">
                        <?php else : ?>
                            <div class="card-image" style="background-color: var(--royal-blue); display: flex; align-items: center; justify-content: center;">
                                <i class="fas fa-user" style="font-size: 2.5rem; color: var(--light-gold);"></i>
                            </div>
                        <?php endif; ?>
                        <div class="card-content">
                            <h3 class="card-title"><?php the_title(); ?></h3>
                            <?php if ($role) : ?>
                                <p style="color: var(--gold); font-weight: 600; margin-bottom: 0.25rem;"><?php echo $role; ?></p>
                            <?php endif; ?>
                            <?php if ($jersey_number) : ?>
                                <p style="color: var(--gray-600); font-size: 0.875rem;">Jersey #<?php echo $jersey_number; ?></p>
                            <?php endif; ?>
                            <?php if ($is_captain) : ?>
                                <span style="background-color: #dc2626; color: white; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 600;">Captain</span>
                            <?php elseif ($is_vice_captain) : ?>
                                <span style="background-color: #2563eb; color: white; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 600;">Vice Captain</span>
                            <?php endif; ?>
                        </div>
                    </div>
                <?php endwhile;
                wp_reset_postdata();
            else : ?>
                <!-- Sample players when no custom posts exist -->
                <div class="card">
                    <div class="card-image" style="background-color: var(--royal-blue); display: flex; align-items: center; justify-content: center;">
                        <i class="fas fa-user" style="font-size: 2.5rem; color: var(--light-gold);"></i>
                    </div>
                    <div class="card-content">
                        <h3 class="card-title">Dinuka</h3>
                        <p style="color: var(--gold); font-weight: 600; margin-bottom: 0.25rem;">Captain & All Rounder</p>
                        <p style="color: var(--gray-600); font-size: 0.875rem;">Jersey #5</p>
                    </div>
                </div>
                <div class="card">
                    <div class="card-image" style="background-color: var(--royal-blue); display: flex; align-items: center; justify-content: center;">
                        <i class="fas fa-user" style="font-size: 2.5rem; color: var(--light-gold);"></i>
                    </div>
                    <div class="card-content">
                        <h3 class="card-title">Denuka</h3>
                        <p style="color: var(--gold); font-weight: 600; margin-bottom: 0.25rem;">Vice Captain & Batsman</p>
                        <p style="color: var(--gray-600); font-size: 0.875rem;">Jersey #8</p>
                    </div>
                </div>
                <div class="card">
                    <div class="card-image" style="background-color: var(--royal-blue); display: flex; align-items: center; justify-content: center;">
                        <i class="fas fa-user" style="font-size: 2.5rem; color: var(--light-gold);"></i>
                    </div>
                    <div class="card-content">
                        <h3 class="card-title">Abilashan</h3>
                        <p style="color: var(--gold); font-weight: 600; margin-bottom: 0.25rem;">Wicket Keeper Batsman</p>
                        <p style="color: var(--gray-600); font-size: 0.875rem;">Jersey #1</p>
                    </div>
                </div>
                <div class="card">
                    <div class="card-image" style="background-color: var(--royal-blue); display: flex; align-items: center; justify-content: center;">
                        <i class="fas fa-user" style="font-size: 2.5rem; color: var(--light-gold);"></i>
                    </div>
                    <div class="card-content">
                        <h3 class="card-title">Amalan</h3>
                        <p style="color: var(--gold); font-weight: 600; margin-bottom: 0.25rem;">All Rounder</p>
                        <p style="color: var(--gray-600); font-size: 0.875rem;">Jersey #2</p>
                    </div>
                </div>
            <?php endif; ?>
        </div>

        <div style="text-align: center; margin-top: 3rem;">
            <a href="<?php echo home_url('/squad'); ?>" class="btn-secondary">View Full Squad</a>
        </div>
    </div>
</section>

<?php get_footer(); ?>