<?php
require_once 'includes/functions.php';

$page_title = 'News & Updates - TUSKERS CRICKET CLUB';

// Get article if ID is provided
$article_id = isset($_GET['id']) ? (int)$_GET['id'] : null;
$current_article = null;

if ($article_id) {
    $current_article = getArticle($article_id);
    if ($current_article) {
        $page_title = htmlspecialchars($current_article['title']) . ' - TUSKERS CRICKET CLUB';
    }
}

// Get all articles for listing
$articles = getArticles();

include 'includes/header.php';
?>

<?php if ($current_article): ?>
<!-- Single Article View -->
<section class="py-20">
    <div class="container mx-auto px-4 max-w-4xl">
        <nav class="mb-8">
            <a href="news.php" class="text-royal-blue hover:text-gold transition-colors">
                <i class="fas fa-arrow-left mr-2"></i>Back to News
            </a>
        </nav>

        <article class="bg-white rounded-xl shadow-lg overflow-hidden">
            <?php if ($current_article['image_url']): ?>
            <img src="<?php echo htmlspecialchars($current_article['image_url']); ?>" 
                 alt="<?php echo htmlspecialchars($current_article['title']); ?>" 
                 class="w-full h-64 md:h-96 object-cover">
            <?php endif; ?>
            
            <div class="p-8">
                <h1 class="text-4xl font-bold text-royal-blue mb-4">
                    <?php echo htmlspecialchars($current_article['title']); ?>
                </h1>
                
                <div class="flex items-center text-gray-600 mb-6">
                    <i class="fas fa-calendar mr-2"></i>
                    <span><?php echo formatDateTime($current_article['created_at']); ?></span>
                    <?php if ($current_article['is_featured']): ?>
                    <span class="ml-4 bg-gold text-royal-blue px-3 py-1 rounded-full text-sm font-semibold">
                        Featured
                    </span>
                    <?php endif; ?>
                </div>
                
                <div class="prose prose-lg max-w-none">
                    <?php echo nl2br(htmlspecialchars($current_article['content'])); ?>
                </div>
                
                <div class="mt-8 pt-8 border-t">
                    <div class="flex items-center justify-between">
                        <div class="flex space-x-4">
                            <button onclick="shareContent('<?php echo htmlspecialchars($current_article['title']); ?>', window.location.href)" 
                                    class="text-royal-blue hover:text-gold transition-colors">
                                <i class="fas fa-share-alt mr-2"></i>Share
                            </button>
                            <button onclick="printPage()" class="text-royal-blue hover:text-gold transition-colors">
                                <i class="fas fa-print mr-2"></i>Print
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </article>
    </div>
</section>

<?php else: ?>
<!-- Articles Listing -->
<section class="bg-gradient-to-r from-royal-blue to-blue-700 py-20">
    <div class="container mx-auto px-4 text-center">
        <h1 class="text-5xl font-bold text-white mb-4">News & Updates</h1>
        <p class="text-light-blue text-xl max-w-2xl mx-auto">
            Stay informed with the latest news, match reports, and updates from TUSKERS CRICKET CLUB
        </p>
    </div>
</section>

<section class="py-20 bg-gray-50">
    <div class="container mx-auto px-4">
        <?php if (!empty($articles)): ?>
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <?php foreach ($articles as $article): ?>
            <article class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <?php if ($article['image_url']): ?>
                <img src="<?php echo htmlspecialchars($article['image_url']); ?>" 
                     alt="<?php echo htmlspecialchars($article['title']); ?>" 
                     class="w-full h-48 object-cover">
                <?php endif; ?>
                
                <div class="p-6">
                    <?php if ($article['is_featured']): ?>
                    <div class="mb-3">
                        <span class="bg-gold text-royal-blue px-3 py-1 rounded-full text-sm font-semibold">
                            Featured
                        </span>
                    </div>
                    <?php endif; ?>
                    
                    <h3 class="text-xl font-bold text-royal-blue mb-3 line-clamp-2">
                        <?php echo htmlspecialchars($article['title']); ?>
                    </h3>
                    
                    <p class="text-gray-600 mb-4 line-clamp-3">
                        <?php echo htmlspecialchars(substr($article['content'], 0, 150)) . '...'; ?>
                    </p>
                    
                    <div class="flex justify-between items-center">
                        <span class="text-sm text-gray-500">
                            <?php echo formatDate($article['created_at']); ?>
                        </span>
                        <a href="news.php?id=<?php echo $article['id']; ?>" 
                           class="text-gold hover:text-royal-blue font-semibold transition-colors">
                            Read More <i class="fas fa-arrow-right ml-1"></i>
                        </a>
                    </div>
                </div>
            </article>
            <?php endforeach; ?>
        </div>
        <?php else: ?>
        <div class="text-center py-20">
            <i class="fas fa-newspaper text-6xl text-gray-400 mb-4"></i>
            <h3 class="text-2xl font-bold text-gray-600 mb-2">No Articles Found</h3>
            <p class="text-gray-500">News and updates will be posted here soon.</p>
        </div>
        <?php endif; ?>
    </div>
</section>
<?php endif; ?>

<?php include 'includes/footer.php'; ?>