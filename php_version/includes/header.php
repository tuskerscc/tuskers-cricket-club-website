<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo isset($page_title) ? $page_title : 'TUSKERS CRICKET CLUB - Official Website'; ?></title>
    <meta name="description" content="Official website of TUSKERS CRICKET CLUB featuring live scores, player profiles, match center, and fan engagement with Royal Blue and Gold branding">
    
    <!-- Favicon -->
    <link rel="icon" type="image/png" href="/attached_assets/Tuskers CC Logo.png">
    <link rel="shortcut icon" type="image/png" href="/attached_assets/Tuskers CC Logo.png">
    
    <!-- FontAwesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        'royal-blue': '#1e3a8a',
                        'gold': '#f59e0b',
                        'light-gold': '#fcd34d',
                        'light-blue': '#bfdbfe'
                    }
                }
            }
        }
    </script>
    
    <!-- Custom CSS -->
    <link rel="stylesheet" href="assets/css/style.css">
    
    <!-- Cricket Widget Script -->
    <script src="https://cdorgapi.b-cdn.net/widgets/score.js"></script>
</head>
<body class="bg-gray-50">
    
    <!-- Header -->
    <header class="bg-royal-blue shadow-lg sticky top-0 z-50">
        <nav class="container mx-auto px-4">
            <div class="flex justify-between items-center py-4">
                <!-- Logo -->
                <div class="flex items-center space-x-3">
                    <div class="w-12 h-12 bg-gold rounded-lg flex items-center justify-center">
                        <span class="text-royal-blue font-bold text-lg">TC</span>
                    </div>
                    <div>
                        <h1 class="text-xl font-bold text-light-gold">TUSKERS CRICKET CLUB</h1>
                        <p class="text-light-blue text-sm">Excellence in Cricket</p>
                    </div>
                </div>

                <!-- Desktop Navigation -->
                <div class="hidden lg:flex space-x-8">
                    <a href="index.php" class="text-light-blue hover:text-light-gold transition-colors font-medium">Home</a>
                    <a href="squad.php" class="text-light-blue hover:text-light-gold transition-colors font-medium">Squad</a>
                    <a href="matches.php" class="text-light-blue hover:text-light-gold transition-colors font-medium">Match Center</a>
                    <a href="news.php" class="text-light-blue hover:text-light-gold transition-colors font-medium">News</a>
                    <a href="gallery.php" class="text-light-blue hover:text-light-gold transition-colors font-medium">Gallery</a>
                    <a href="stats.php" class="text-light-blue hover:text-light-gold transition-colors font-medium">Team Stats</a>
                    <a href="trivia.php" class="text-light-blue hover:text-light-gold transition-colors font-medium">Fan Zone</a>
                </div>

                <!-- Mobile Menu Button -->
                <button class="lg:hidden text-light-blue hover:text-light-gold" onclick="toggleMobileMenu()">
                    <i class="fas fa-bars text-xl"></i>
                </button>
            </div>

            <!-- Mobile Navigation -->
            <div id="mobileMenu" class="lg:hidden hidden pb-4">
                <div class="flex flex-col space-y-2">
                    <a href="index.php" class="text-light-blue hover:text-light-gold transition-colors py-2">Home</a>
                    <a href="squad.php" class="text-light-blue hover:text-light-gold transition-colors py-2">Squad</a>
                    <a href="matches.php" class="text-light-blue hover:text-light-gold transition-colors py-2">Match Center</a>
                    <a href="news.php" class="text-light-blue hover:text-light-gold transition-colors py-2">News</a>
                    <a href="gallery.php" class="text-light-blue hover:text-light-gold transition-colors py-2">Gallery</a>
                    <a href="stats.php" class="text-light-blue hover:text-light-gold transition-colors py-2">Team Stats</a>
                    <a href="trivia.php" class="text-light-blue hover:text-light-gold transition-colors py-2">Fan Zone</a>
                </div>
            </div>
        </nav>
    </header>

    <script>
        function toggleMobileMenu() {
            const menu = document.getElementById('mobileMenu');
            menu.classList.toggle('hidden');
        }
    </script>