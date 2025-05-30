<?php
/**
 * TUSKERS CRICKET CLUB Theme Functions
 */

// Theme setup
function tuskers_theme_setup() {
    // Add theme support for various features
    add_theme_support('post-thumbnails');
    add_theme_support('title-tag');
    add_theme_support('custom-logo');
    add_theme_support('html5', array(
        'search-form',
        'comment-form',
        'comment-list',
        'gallery',
        'caption'
    ));

    // Register navigation menus
    register_nav_menus(array(
        'primary' => __('Primary Menu', 'tuskers'),
        'footer' => __('Footer Menu', 'tuskers')
    ));

    // Add image sizes
    add_image_size('player-thumbnail', 300, 400, true);
    add_image_size('news-featured', 600, 300, true);
}
add_action('after_setup_theme', 'tuskers_theme_setup');

// Enqueue styles and scripts
function tuskers_enqueue_assets() {
    // Main theme stylesheet
    wp_enqueue_style('tuskers-style', get_stylesheet_uri(), array(), '1.0.0');
    
    // Custom JavaScript
    wp_enqueue_script('tuskers-main', get_template_directory_uri() . '/assets/js/main.js', array(), '1.0.0', true);
    
    // Localize script for AJAX
    wp_localize_script('tuskers-main', 'tuskers_ajax', array(
        'ajax_url' => admin_url('admin-ajax.php'),
        'nonce' => wp_create_nonce('tuskers_nonce')
    ));
}
add_action('wp_enqueue_scripts', 'tuskers_enqueue_assets');

// Register custom post types
function tuskers_register_post_types() {
    // Players post type
    register_post_type('player', array(
        'labels' => array(
            'name' => 'Players',
            'singular_name' => 'Player',
            'add_new' => 'Add New Player',
            'add_new_item' => 'Add New Player',
            'edit_item' => 'Edit Player',
            'new_item' => 'New Player',
            'view_item' => 'View Player',
            'search_items' => 'Search Players',
            'not_found' => 'No players found',
            'not_found_in_trash' => 'No players found in Trash'
        ),
        'public' => true,
        'has_archive' => true,
        'menu_icon' => 'dashicons-groups',
        'supports' => array('title', 'editor', 'thumbnail', 'custom-fields'),
        'show_in_rest' => true
    ));

    // Team Statistics post type
    register_post_type('team_stats', array(
        'labels' => array(
            'name' => 'Team Statistics',
            'singular_name' => 'Team Stat',
            'add_new' => 'Add New Stat',
            'add_new_item' => 'Add New Team Stat',
            'edit_item' => 'Edit Team Stat',
            'new_item' => 'New Team Stat',
            'view_item' => 'View Team Stat',
            'search_items' => 'Search Team Stats',
            'not_found' => 'No stats found',
            'not_found_in_trash' => 'No stats found in Trash'
        ),
        'public' => true,
        'has_archive' => false,
        'menu_icon' => 'dashicons-chart-line',
        'supports' => array('title', 'custom-fields'),
        'show_in_rest' => true
    ));
}
add_action('init', 'tuskers_register_post_types');

// Add custom meta boxes
function tuskers_add_meta_boxes() {
    // Player meta box
    add_meta_box(
        'player_details',
        'Player Details',
        'tuskers_player_meta_callback',
        'player',
        'normal',
        'high'
    );

    // Post featured meta box
    add_meta_box(
        'post_featured',
        'Featured Post',
        'tuskers_featured_meta_callback',
        'post',
        'side',
        'default'
    );
}
add_action('add_meta_boxes', 'tuskers_add_meta_boxes');

// Player meta box callback
function tuskers_player_meta_callback($post) {
    wp_nonce_field('tuskers_player_meta_nonce', 'player_meta_nonce');
    
    $jersey_number = get_post_meta($post->ID, 'jersey_number', true);
    $role = get_post_meta($post->ID, 'role', true);
    $batting_style = get_post_meta($post->ID, 'batting_style', true);
    $bowling_style = get_post_meta($post->ID, 'bowling_style', true);
    $is_captain = get_post_meta($post->ID, 'is_captain', true);
    $is_vice_captain = get_post_meta($post->ID, 'is_vice_captain', true);
    $runs_scored = get_post_meta($post->ID, 'runs_scored', true);
    $wickets_taken = get_post_meta($post->ID, 'wickets_taken', true);
    
    ?>
    <table class="form-table">
        <tr>
            <th><label for="jersey_number">Jersey Number</label></th>
            <td><input type="number" id="jersey_number" name="jersey_number" value="<?php echo esc_attr($jersey_number); ?>" /></td>
        </tr>
        <tr>
            <th><label for="role">Role</label></th>
            <td>
                <select id="role" name="role">
                    <option value="">Select Role</option>
                    <option value="Batsman" <?php selected($role, 'Batsman'); ?>>Batsman</option>
                    <option value="Bowler" <?php selected($role, 'Bowler'); ?>>Bowler</option>
                    <option value="All Rounder" <?php selected($role, 'All Rounder'); ?>>All Rounder</option>
                    <option value="Wicket Keeper" <?php selected($role, 'Wicket Keeper'); ?>>Wicket Keeper</option>
                    <option value="Wicket Keeper Batsman" <?php selected($role, 'Wicket Keeper Batsman'); ?>>Wicket Keeper Batsman</option>
                </select>
            </td>
        </tr>
        <tr>
            <th><label for="batting_style">Batting Style</label></th>
            <td>
                <select id="batting_style" name="batting_style">
                    <option value="">Select Style</option>
                    <option value="Right-handed" <?php selected($batting_style, 'Right-handed'); ?>>Right-handed</option>
                    <option value="Left-handed" <?php selected($batting_style, 'Left-handed'); ?>>Left-handed</option>
                </select>
            </td>
        </tr>
        <tr>
            <th><label for="bowling_style">Bowling Style</label></th>
            <td>
                <select id="bowling_style" name="bowling_style">
                    <option value="">Select Style</option>
                    <option value="Right-arm fast" <?php selected($bowling_style, 'Right-arm fast'); ?>>Right-arm fast</option>
                    <option value="Left-arm fast" <?php selected($bowling_style, 'Left-arm fast'); ?>>Left-arm fast</option>
                    <option value="Right-arm medium" <?php selected($bowling_style, 'Right-arm medium'); ?>>Right-arm medium</option>
                    <option value="Left-arm medium" <?php selected($bowling_style, 'Left-arm medium'); ?>>Left-arm medium</option>
                    <option value="Right-arm off-spin" <?php selected($bowling_style, 'Right-arm off-spin'); ?>>Right-arm off-spin</option>
                    <option value="Left-arm orthodox" <?php selected($bowling_style, 'Left-arm orthodox'); ?>>Left-arm orthodox</option>
                    <option value="Right-arm leg-spin" <?php selected($bowling_style, 'Right-arm leg-spin'); ?>>Right-arm leg-spin</option>
                    <option value="Left-arm chinaman" <?php selected($bowling_style, 'Left-arm chinaman'); ?>>Left-arm chinaman</option>
                </select>
            </td>
        </tr>
        <tr>
            <th><label for="is_captain">Captain</label></th>
            <td><input type="checkbox" id="is_captain" name="is_captain" value="1" <?php checked($is_captain, '1'); ?> /></td>
        </tr>
        <tr>
            <th><label for="is_vice_captain">Vice Captain</label></th>
            <td><input type="checkbox" id="is_vice_captain" name="is_vice_captain" value="1" <?php checked($is_vice_captain, '1'); ?> /></td>
        </tr>
        <tr>
            <th><label for="runs_scored">Runs Scored</label></th>
            <td><input type="number" id="runs_scored" name="runs_scored" value="<?php echo esc_attr($runs_scored); ?>" /></td>
        </tr>
        <tr>
            <th><label for="wickets_taken">Wickets Taken</label></th>
            <td><input type="number" id="wickets_taken" name="wickets_taken" value="<?php echo esc_attr($wickets_taken); ?>" /></td>
        </tr>
    </table>
    <?php
}

// Featured post meta box callback
function tuskers_featured_meta_callback($post) {
    wp_nonce_field('tuskers_featured_meta_nonce', 'featured_meta_nonce');
    
    $featured = get_post_meta($post->ID, 'featured_post', true);
    
    ?>
    <label for="featured_post">
        <input type="checkbox" id="featured_post" name="featured_post" value="yes" <?php checked($featured, 'yes'); ?> />
        Feature this post on homepage
    </label>
    <?php
}

// Save meta box data
function tuskers_save_meta_boxes($post_id) {
    // Player meta
    if (isset($_POST['player_meta_nonce']) && wp_verify_nonce($_POST['player_meta_nonce'], 'tuskers_player_meta_nonce')) {
        if (isset($_POST['jersey_number'])) {
            update_post_meta($post_id, 'jersey_number', sanitize_text_field($_POST['jersey_number']));
        }
        if (isset($_POST['role'])) {
            update_post_meta($post_id, 'role', sanitize_text_field($_POST['role']));
        }
        if (isset($_POST['batting_style'])) {
            update_post_meta($post_id, 'batting_style', sanitize_text_field($_POST['batting_style']));
        }
        if (isset($_POST['bowling_style'])) {
            update_post_meta($post_id, 'bowling_style', sanitize_text_field($_POST['bowling_style']));
        }
        update_post_meta($post_id, 'is_captain', isset($_POST['is_captain']) ? '1' : '0');
        update_post_meta($post_id, 'is_vice_captain', isset($_POST['is_vice_captain']) ? '1' : '0');
        if (isset($_POST['runs_scored'])) {
            update_post_meta($post_id, 'runs_scored', sanitize_text_field($_POST['runs_scored']));
        }
        if (isset($_POST['wickets_taken'])) {
            update_post_meta($post_id, 'wickets_taken', sanitize_text_field($_POST['wickets_taken']));
        }
    }

    // Featured post meta
    if (isset($_POST['featured_meta_nonce']) && wp_verify_nonce($_POST['featured_meta_nonce'], 'tuskers_featured_meta_nonce')) {
        update_post_meta($post_id, 'featured_post', isset($_POST['featured_post']) ? 'yes' : 'no');
    }
}
add_action('save_post', 'tuskers_save_meta_boxes');

// Newsletter subscription AJAX handler
function tuskers_newsletter_subscribe() {
    check_ajax_referer('tuskers_nonce', 'nonce');
    
    $email = sanitize_email($_POST['email']);
    
    if (!is_email($email)) {
        wp_die(json_encode(array('success' => false, 'data' => 'Invalid email address')));
    }
    
    // Save to database or send to external service
    $subscribers = get_option('tuskers_newsletter_subscribers', array());
    
    if (in_array($email, $subscribers)) {
        wp_die(json_encode(array('success' => false, 'data' => 'Email already subscribed')));
    }
    
    $subscribers[] = $email;
    update_option('tuskers_newsletter_subscribers', $subscribers);
    
    // Send notification email
    $to = 'tuskerscckandy@gmail.com';
    $subject = 'New Newsletter Subscription - TUSKERS CRICKET CLUB';
    $message = "A new subscriber has joined the TUSKERS CRICKET CLUB newsletter.\n\n";
    $message .= "Email: " . $email . "\n";
    $message .= "Subscription Date: " . date('Y-m-d H:i:s') . "\n\n";
    $message .= "Best regards,\nTUSKERS CRICKET CLUB Website";
    
    wp_mail($to, $subject, $message);
    
    wp_die(json_encode(array('success' => true, 'data' => 'Successfully subscribed!')));
}
add_action('wp_ajax_newsletter_subscribe', 'tuskers_newsletter_subscribe');
add_action('wp_ajax_nopriv_newsletter_subscribe', 'tuskers_newsletter_subscribe');

// Add admin menu for team statistics
function tuskers_admin_menu() {
    add_menu_page(
        'Team Statistics',
        'Team Stats',
        'manage_options',
        'tuskers-stats',
        'tuskers_stats_page',
        'dashicons-chart-line',
        6
    );
    
    add_submenu_page(
        'tuskers-stats',
        'Newsletter Subscribers',
        'Newsletter',
        'manage_options',
        'tuskers-newsletter',
        'tuskers_newsletter_page'
    );
}
add_action('admin_menu', 'tuskers_admin_menu');

// Team statistics admin page
function tuskers_stats_page() {
    if (isset($_POST['update_stats'])) {
        update_option('tuskers_matches_won', sanitize_text_field($_POST['matches_won']));
        update_option('tuskers_win_percentage', sanitize_text_field($_POST['win_percentage']));
        update_option('tuskers_squad_size', sanitize_text_field($_POST['squad_size']));
        update_option('tuskers_total_runs', sanitize_text_field($_POST['total_runs']));
        echo '<div class="notice notice-success"><p>Statistics updated successfully!</p></div>';
    }
    
    $matches_won = get_option('tuskers_matches_won', '12');
    $win_percentage = get_option('tuskers_win_percentage', '75');
    $squad_size = get_option('tuskers_squad_size', '15');
    $total_runs = get_option('tuskers_total_runs', '2847');
    ?>
    <div class="wrap">
        <h1>Team Statistics</h1>
        <form method="post">
            <table class="form-table">
                <tr>
                    <th scope="row">Matches Won</th>
                    <td><input type="number" name="matches_won" value="<?php echo esc_attr($matches_won); ?>" /></td>
                </tr>
                <tr>
                    <th scope="row">Win Percentage</th>
                    <td><input type="number" name="win_percentage" value="<?php echo esc_attr($win_percentage); ?>" />%</td>
                </tr>
                <tr>
                    <th scope="row">Squad Size</th>
                    <td><input type="number" name="squad_size" value="<?php echo esc_attr($squad_size); ?>" /></td>
                </tr>
                <tr>
                    <th scope="row">Total Runs</th>
                    <td><input type="number" name="total_runs" value="<?php echo esc_attr($total_runs); ?>" /></td>
                </tr>
            </table>
            <?php submit_button('Update Statistics', 'primary', 'update_stats'); ?>
        </form>
    </div>
    <?php
}

// Newsletter subscribers admin page
function tuskers_newsletter_page() {
    $subscribers = get_option('tuskers_newsletter_subscribers', array());
    ?>
    <div class="wrap">
        <h1>Newsletter Subscribers</h1>
        <?php if (!empty($subscribers)) : ?>
            <table class="wp-list-table widefat fixed striped">
                <thead>
                    <tr>
                        <th>Email Address</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($subscribers as $email) : ?>
                    <tr>
                        <td><?php echo esc_html($email); ?></td>
                        <td>
                            <a href="mailto:<?php echo esc_attr($email); ?>" class="button">Send Email</a>
                        </td>
                    </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
            <p><strong>Total Subscribers:</strong> <?php echo count($subscribers); ?></p>
        <?php else : ?>
            <p>No subscribers yet.</p>
        <?php endif; ?>
    </div>
    <?php
}

// Custom body classes
function tuskers_body_classes($classes) {
    if (is_front_page()) {
        $classes[] = 'homepage';
    }
    return $classes;
}
add_filter('body_class', 'tuskers_body_classes');
?>