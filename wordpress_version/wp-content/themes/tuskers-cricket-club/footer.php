    <footer class="site-footer">
        <div class="footer-container">
            <div class="footer-content">
                <!-- Club Info -->
                <div class="footer-section">
                    <div class="site-logo" style="margin-bottom: 1.5rem;">
                        <div class="logo-icon">TC</div>
                        <div>
                            <h3 style="color: var(--light-gold); font-size: 1.25rem; font-weight: bold;">TUSKERS CRICKET CLUB</h3>
                        </div>
                    </div>
                    <p style="color: var(--light-blue); margin-bottom: 1rem; line-height: 1.6;">
                        Passionate cricket, extraordinary talent, and unwavering dedication. Join us on our journey to excellence.
                    </p>
                    <div style="display: flex; gap: 1rem;">
                        <a href="#" style="color: var(--light-blue); font-size: 1.25rem;"><i class="fab fa-facebook"></i></a>
                        <a href="#" style="color: var(--light-blue); font-size: 1.25rem;"><i class="fab fa-twitter"></i></a>
                        <a href="#" style="color: var(--light-blue); font-size: 1.25rem;"><i class="fab fa-instagram"></i></a>
                        <a href="#" style="color: var(--light-blue); font-size: 1.25rem;"><i class="fab fa-youtube"></i></a>
                    </div>
                </div>

                <!-- Quick Links -->
                <div class="footer-section">
                    <h4>Quick Links</h4>
                    <ul>
                        <li><a href="<?php echo home_url(); ?>">Home</a></li>
                        <li><a href="<?php echo home_url('/squad'); ?>">Squad</a></li>
                        <li><a href="<?php echo home_url('/news'); ?>">News</a></li>
                        <li><a href="<?php echo home_url('/gallery'); ?>">Gallery</a></li>
                        <li><a href="<?php echo home_url('/stats'); ?>">Team Stats</a></li>
                        <li><a href="<?php echo home_url('/fan-zone'); ?>">Fan Zone</a></li>
                    </ul>
                </div>

                <!-- Fan Zone -->
                <div class="footer-section">
                    <h4>Fan Zone</h4>
                    <ul>
                        <li><a href="<?php echo home_url('/gallery'); ?>">Gallery</a></li>
                        <li><a href="<?php echo home_url('/fan-zone'); ?>">Cricket Trivia</a></li>
                        <li><a href="<?php echo home_url('/forum'); ?>">Community Forum</a></li>
                        <li><a href="<?php echo home_url('/events'); ?>">Events</a></li>
                    </ul>
                </div>

                <!-- Newsletter -->
                <div class="footer-section">
                    <h4>Stay Updated</h4>
                    <p style="color: var(--light-blue); margin-bottom: 1rem;">Get the latest news and updates from TUSKERS CRICKET CLUB</p>
                    <form id="newsletter-form" style="display: flex;">
                        <input 
                            type="email" 
                            name="email"
                            placeholder="Your email" 
                            required
                            style="flex: 1; padding: 0.75rem; background-color: var(--dark-blue); color: white; border: 1px solid var(--light-blue); border-radius: 0.5rem 0 0 0.5rem; outline: none;"
                        />
                        <button type="submit" style="padding: 0.75rem 1rem; background-color: var(--gold); color: var(--royal-blue); font-weight: bold; border: none; border-radius: 0 0.5rem 0.5rem 0; cursor: pointer;">
                            Subscribe
                        </button>
                    </form>
                </div>
            </div>

            <!-- Bottom Bar -->
            <div class="footer-bottom">
                <div class="copyright">
                    © <?php echo date('Y'); ?> TUSKERS CRICKET CLUB. All rights reserved.
                </div>
                <div class="footer-links">
                    <a href="#">Privacy Policy</a>
                    <a href="#">Terms of Service</a>
                    <a href="#">Cookie Policy</a>
                </div>
            </div>
        </div>
    </footer>

    <!-- Back to Top Button -->
    <button id="backToTop" onclick="scrollToTop()" style="display: none; position: fixed; bottom: 2rem; right: 2rem; background-color: var(--royal-blue); color: white; border: none; border-radius: 50%; width: 3rem; height: 3rem; font-size: 1.25rem; cursor: pointer; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); z-index: 40;">
        <i class="fas fa-chevron-up"></i>
    </button>

    <script>
    // Newsletter subscription
    document.getElementById('newsletter-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const email = this.querySelector('input[name="email"]').value;
        
        fetch('<?php echo admin_url('admin-ajax.php'); ?>', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: 'action=newsletter_subscribe&email=' + encodeURIComponent(email)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Successfully subscribed to newsletter!');
                this.querySelector('input[name="email"]').value = '';
            } else {
                alert(data.data || 'Subscription failed');
            }
        })
        .catch(error => {
            alert('An error occurred. Please try again.');
        });
    });

    // Back to top functionality
    window.addEventListener('scroll', function() {
        const backToTop = document.getElementById('backToTop');
        if (window.pageYOffset > 300) {
            backToTop.style.display = 'block';
        } else {
            backToTop.style.display = 'none';
        }
    });

    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    // Mobile menu toggle
    function toggleMobileMenu() {
        const nav = document.querySelector('.main-navigation');
        nav.style.display = nav.style.display === 'block' ? 'none' : 'block';
    }

    // Responsive navigation
    function checkScreenSize() {
        const nav = document.querySelector('.main-navigation');
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        
        if (window.innerWidth <= 768) {
            nav.style.display = 'none';
            mobileToggle.style.display = 'block';
        } else {
            nav.style.display = 'block';
            mobileToggle.style.display = 'none';
        }
    }

    window.addEventListener('resize', checkScreenSize);
    window.addEventListener('load', checkScreenSize);
    </script>

    <?php wp_footer(); ?>
</body>
</html>