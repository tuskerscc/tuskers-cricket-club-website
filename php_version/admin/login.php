<?php
require_once '../includes/functions.php';

$error_message = '';

if ($_POST) {
    $username = sanitizeInput($_POST['username'] ?? '');
    $password = $_POST['password'] ?? '';
    
    if (login($username, $password)) {
        header('Location: index.php');
        exit();
    } else {
        $error_message = 'Invalid username or password';
    }
}

$page_title = 'Admin Login - TUSKERS CRICKET CLUB';
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo $page_title; ?></title>
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
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body class="bg-gradient-to-br from-royal-blue via-blue-700 to-royal-blue min-h-screen flex items-center justify-center">

<div class="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
    <div class="text-center mb-8">
        <div class="w-16 h-16 bg-gold rounded-lg flex items-center justify-center mx-auto mb-4">
            <span class="text-royal-blue font-bold text-2xl">TC</span>
        </div>
        <h1 class="text-2xl font-bold text-royal-blue">Admin Login</h1>
        <p class="text-gray-600">TUSKERS CRICKET CLUB</p>
    </div>

    <?php if ($error_message): ?>
    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
        <i class="fas fa-exclamation-triangle mr-2"></i>
        <?php echo htmlspecialchars($error_message); ?>
    </div>
    <?php endif; ?>

    <form method="POST" class="space-y-6">
        <div>
            <label for="username" class="block text-sm font-medium text-gray-700 mb-2">Username</label>
            <div class="relative">
                <input 
                    type="text" 
                    id="username" 
                    name="username" 
                    required 
                    class="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-blue focus:border-transparent"
                    placeholder="Enter your username"
                    value="<?php echo htmlspecialchars($_POST['username'] ?? ''); ?>"
                >
                <i class="fas fa-user absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>
        </div>

        <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <div class="relative">
                <input 
                    type="password" 
                    id="password" 
                    name="password" 
                    required 
                    class="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-blue focus:border-transparent"
                    placeholder="Enter your password"
                >
                <i class="fas fa-lock absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>
        </div>

        <button 
            type="submit" 
            class="w-full bg-royal-blue hover:bg-blue-800 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
        >
            <i class="fas fa-sign-in-alt mr-2"></i>
            Login
        </button>
    </form>

    <div class="mt-8 text-center">
        <a href="../index.php" class="text-royal-blue hover:text-gold transition-colors">
            <i class="fas fa-arrow-left mr-2"></i>
            Back to Website
        </a>
    </div>
</div>

</body>
</html>