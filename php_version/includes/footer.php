    <!-- Footer -->
    <footer class="bg-royal-blue text-white py-16">
        <div class="container mx-auto px-4">
            <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                <!-- Club Info -->
                <div>
                    <div class="flex items-center space-x-3 mb-6">
                        <div class="w-12 h-12 bg-gold rounded-lg flex items-center justify-center">
                            <span class="text-royal-blue font-bold text-lg">TC</span>
                        </div>
                        <div>
                            <h3 class="text-xl font-bold text-light-gold">TUSKERS CRICKET CLUB</h3>
                        </div>
                    </div>
                    <p class="text-light-blue mb-4 leading-relaxed">
                        Passionate cricket, extraordinary talent, and unwavering dedication. Join us on our journey to excellence.
                    </p>
                    <div class="flex space-x-4">
                        <a href="#" class="text-light-blue hover:text-light-gold transition-colors">
                            <i class="fab fa-facebook text-xl"></i>
                        </a>
                        <a href="#" class="text-light-blue hover:text-light-gold transition-colors">
                            <i class="fab fa-twitter text-xl"></i>
                        </a>
                        <a href="#" class="text-light-blue hover:text-light-gold transition-colors">
                            <i class="fab fa-instagram text-xl"></i>
                        </a>
                        <a href="#" class="text-light-blue hover:text-light-gold transition-colors">
                            <i class="fab fa-youtube text-xl"></i>
                        </a>
                    </div>
                </div>

                <!-- Quick Links -->
                <div>
                    <h4 class="text-lg font-bold text-light-gold mb-4">Quick Links</h4>
                    <ul class="space-y-3">
                        <li><a href="index.php" class="text-light-blue hover:text-white transition-colors">Home</a></li>
                        <li><a href="matches.php" class="text-light-blue hover:text-white transition-colors">Match Center</a></li>
                        <li><a href="squad.php" class="text-light-blue hover:text-white transition-colors">Squad</a></li>
                        <li><a href="news.php" class="text-light-blue hover:text-white transition-colors">Latest Updates</a></li>
                        <li><a href="stats.php" class="text-light-blue hover:text-white transition-colors">Team Stats</a></li>
                        <li><a href="trivia.php" class="text-light-blue hover:text-white transition-colors">Fan Zone</a></li>
                    </ul>
                </div>

                <!-- Fan Zone -->
                <div>
                    <h4 class="text-lg font-bold text-light-gold mb-4">Fan Zone</h4>
                    <ul class="space-y-3">
                        <li><a href="gallery.php" class="text-light-blue hover:text-white transition-colors">Gallery</a></li>
                        <li><a href="trivia.php" class="text-light-blue hover:text-white transition-colors">Cricket Trivia</a></li>
                        <li><a href="forum.php" class="text-light-blue hover:text-white transition-colors">Community Forum</a></li>
                        <li><a href="events.php" class="text-light-blue hover:text-white transition-colors">Events</a></li>
                    </ul>
                </div>

                <!-- Newsletter -->
                <div>
                    <h4 class="text-lg font-bold text-light-gold mb-4">Stay Updated</h4>
                    <p class="text-light-blue mb-4">Get the latest news and updates from TUSKERS CRICKET CLUB</p>
                    <form action="subscribe.php" method="POST" class="flex">
                        <input 
                            type="email" 
                            name="email"
                            placeholder="Your email" 
                            required
                            class="flex-1 px-3 py-2 bg-blue-800 text-white placeholder-light-blue rounded-l-lg border border-blue-600 focus:outline-none focus:border-light-gold"
                        />
                        <button type="submit" class="px-4 py-2 bg-gold text-royal-blue font-semibold rounded-r-lg hover:bg-light-gold transition-colors">
                            Subscribe
                        </button>
                    </form>
                </div>
            </div>

            <!-- Bottom Bar -->
            <div class="border-t border-blue-700 pt-8">
                <div class="flex flex-col md:flex-row justify-between items-center">
                    <p class="text-light-blue mb-4 md:mb-0">
                        © 2024 TUSKERS CRICKET CLUB. All rights reserved.
                    </p>
                    <div class="flex space-x-6">
                        <a href="#" class="text-light-blue hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" class="text-light-blue hover:text-white transition-colors">Terms of Service</a>
                        <a href="#" class="text-light-blue hover:text-white transition-colors">Cookie Policy</a>
                    </div>
                </div>
            </div>
        </div>
    </footer>

    <!-- Custom JavaScript -->
    <script src="assets/js/main.js"></script>
</body>
</html>