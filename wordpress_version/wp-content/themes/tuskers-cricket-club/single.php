<?php get_header(); ?>

<section class="content-section">
    <div class="section-container">
        <?php if (have_posts()) : while (have_posts()) : the_post(); ?>
            <article class="post-content">
                <nav style="margin-bottom: 2rem;">
                    <a href="<?php echo home_url('/news'); ?>" style="color: var(--royal-blue); text-decoration: none; transition: color 0.3s ease;">
                        <i class="fas fa-arrow-left" style="margin-right: 0.5rem;"></i>Back to News
                    </a>
                </nav>

                <div class="card" style="max-width: none;">
                    <?php if (has_post_thumbnail()) : ?>
                        <img src="<?php the_post_thumbnail_url('large'); ?>" alt="<?php the_title(); ?>" style="width: 100%; height: 16rem; object-fit: cover; border-radius: 0.75rem 0.75rem 0 0;">
                    <?php endif; ?>
                    
                    <div style="padding: 2rem;">
                        <h1 class="post-title"><?php the_title(); ?></h1>
                        
                        <div class="post-meta">
                            <i class="fas fa-calendar" style="margin-right: 0.5rem;"></i>
                            <span><?php echo get_the_date('F j, Y g:i A'); ?></span>
                            <?php if (get_post_meta(get_the_ID(), 'featured_post', true) === 'yes') : ?>
                                <span style="margin-left: 1rem; background-color: var(--gold); color: var(--royal-blue); padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.875rem; font-weight: 600;">
                                    Featured
                                </span>
                            <?php endif; ?>
                        </div>
                        
                        <div style="line-height: 1.8; font-size: 1.125rem;">
                            <?php the_content(); ?>
                        </div>
                        
                        <div style="margin-top: 2rem; padding-top: 2rem; border-top: 1px solid var(--gray-100);">
                            <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
                                <div style="display: flex; gap: 1rem;">
                                    <button onclick="shareContent('<?php echo esc_js(get_the_title()); ?>', '<?php echo esc_js(get_permalink()); ?>')" 
                                            style="background: none; border: none; color: var(--royal-blue); cursor: pointer; transition: color 0.3s ease;">
                                        <i class="fas fa-share-alt" style="margin-right: 0.5rem;"></i>Share
                                    </button>
                                    <button onclick="window.print()" style="background: none; border: none; color: var(--royal-blue); cursor: pointer; transition: color 0.3s ease;">
                                        <i class="fas fa-print" style="margin-right: 0.5rem;"></i>Print
                                    </button>
                                </div>
                                
                                <div style="color: var(--gray-600); font-size: 0.875rem;">
                                    <?php if (get_the_author()) : ?>
                                        By <?php the_author(); ?>
                                    <?php endif; ?>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </article>
        <?php endwhile; endif; ?>

        <!-- Related Posts -->
        <?php
        $related_posts = new WP_Query(array(
            'posts_per_page' => 3,
            'post__not_in' => array(get_the_ID()),
            'orderby' => 'rand'
        ));
        
        if ($related_posts->have_posts()) : ?>
            <section style="margin-top: 4rem;">
                <h2 style="font-size: 2rem; font-weight: bold; color: var(--royal-blue); margin-bottom: 2rem; text-align: center;">Related News</h2>
                
                <div class="card-grid">
                    <?php while ($related_posts->have_posts()) : $related_posts->the_post(); ?>
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
                    <?php endwhile; ?>
                </div>
            </section>
        <?php 
        wp_reset_postdata();
        endif; ?>
    </div>
</section>

<script>
function shareContent(title, url) {
    if (navigator.share) {
        navigator.share({
            title: title,
            url: url
        }).catch(console.error);
    } else {
        navigator.clipboard.writeText(url).then(() => {
            alert('Link copied to clipboard!');
        }).catch(() => {
            alert('Unable to copy link');
        });
    }
}
</script>

<?php get_footer(); ?>