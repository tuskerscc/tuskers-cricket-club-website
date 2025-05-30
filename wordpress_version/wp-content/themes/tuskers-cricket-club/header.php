<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php wp_title('|', true, 'right'); ?><?php bloginfo('name'); ?></title>
    
    <!-- Favicon -->
    <link rel="icon" type="image/png" href="<?php echo get_template_directory_uri(); ?>/assets/images/tuskers-logo.png">
    
    <!-- FontAwesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    
    <!-- Cricket Widget Script -->
    <script src="https://cdorgapi.b-cdn.net/widgets/score.js"></script>
    
    <?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>

<header class="site-header">
    <div class="header-container">
        <!-- Logo -->
        <div class="site-logo">
            <div class="logo-icon">TC</div>
            <div>
                <a href="<?php echo home_url(); ?>" class="site-title">TUSKERS CRICKET CLUB</a>
                <div class="site-tagline">Excellence in Cricket</div>
            </div>
        </div>

        <!-- Navigation -->
        <nav class="main-navigation">
            <?php
            wp_nav_menu(array(
                'theme_location' => 'primary',
                'menu_class' => 'primary-menu',
                'fallback_cb' => 'tuskers_default_menu'
            ));
            ?>
        </nav>

        <!-- Mobile Menu Button -->
        <button class="mobile-menu-toggle" onclick="toggleMobileMenu()" style="display: none; background: none; border: none; color: var(--light-blue); font-size: 1.25rem;">
            <i class="fas fa-bars"></i>
        </button>
    </div>
</header>

<?php
// Default menu fallback
function tuskers_default_menu() {
    echo '<ul class="primary-menu">';
    echo '<li><a href="' . home_url() . '">Home</a></li>';
    echo '<li><a href="' . home_url('/squad') . '">Squad</a></li>';
    echo '<li><a href="' . home_url('/news') . '">News</a></li>';
    echo '<li><a href="' . home_url('/gallery') . '">Gallery</a></li>';
    echo '<li><a href="' . home_url('/stats') . '">Team Stats</a></li>';
    echo '<li><a href="' . home_url('/fan-zone') . '">Fan Zone</a></li>';
    echo '</ul>';
}
?>