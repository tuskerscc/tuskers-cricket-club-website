<?php
require_once 'includes/functions.php';

$page_title = 'Gallery - TUSKERS CRICKET CLUB';
$gallery_items = getGalleryItems();

include 'includes/header.php';
?>

<!-- Page Header -->
<section class="bg-gradient-to-r from-royal-blue to-blue-700 py-20">
    <div class="container mx-auto px-4 text-center">
        <h1 class="text-5xl font-bold text-white mb-4">Gallery</h1>
        <p class="text-light-blue text-xl max-w-2xl mx-auto">
            Capturing memorable moments from matches, training sessions, and team events
        </p>
    </div>
</section>

<!-- Gallery Grid -->
<section class="py-20 bg-gray-50">
    <div class="container mx-auto px-4">
        <?php if (!empty($gallery_items)): ?>
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <?php foreach ($gallery_items as $item): ?>
            <div class="gallery-item bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div class="relative group">
                    <img src="<?php echo htmlspecialchars($item['image_url']); ?>" 
                         alt="<?php echo htmlspecialchars($item['title']); ?>" 
                         class="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300">
                    
                    <div class="gallery-overlay absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
                        <div class="text-white text-center transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                            <i class="fas fa-search-plus text-3xl mb-2"></i>
                            <p class="text-sm">View Full Size</p>
                        </div>
                    </div>
                </div>
                
                <div class="p-6">
                    <h3 class="text-xl font-bold text-royal-blue mb-2">
                        <?php echo htmlspecialchars($item['title']); ?>
                    </h3>
                    
                    <?php if ($item['description']): ?>
                    <p class="text-gray-600 mb-4">
                        <?php echo htmlspecialchars($item['description']); ?>
                    </p>
                    <?php endif; ?>
                    
                    <div class="flex justify-between items-center text-sm text-gray-500">
                        <span><?php echo formatDate($item['created_at']); ?></span>
                        <button onclick="openLightbox('<?php echo htmlspecialchars($item['image_url']); ?>', '<?php echo htmlspecialchars($item['title']); ?>')" 
                                class="text-royal-blue hover:text-gold transition-colors">
                            <i class="fas fa-expand-alt mr-1"></i>View
                        </button>
                    </div>
                </div>
            </div>
            <?php endforeach; ?>
        </div>
        
        <!-- Sample Gallery Items if no database items -->
        <?php else: ?>
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <!-- Sample Item 1 -->
            <div class="gallery-item bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div class="relative group">
                    <div class="w-full h-64 bg-royal-blue flex items-center justify-center">
                        <div class="text-center text-white">
                            <i class="fas fa-camera text-4xl mb-2"></i>
                            <p>Training Session</p>
                        </div>
                    </div>
                    
                    <div class="gallery-overlay absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
                        <div class="text-white text-center transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                            <i class="fas fa-search-plus text-3xl mb-2"></i>
                            <p class="text-sm">View Full Size</p>
                        </div>
                    </div>
                </div>
                
                <div class="p-6">
                    <h3 class="text-xl font-bold text-royal-blue mb-2">Training Session</h3>
                    <p class="text-gray-600 mb-4">Players during an intensive training session</p>
                    <div class="flex justify-between items-center text-sm text-gray-500">
                        <span>January 15, 2024</span>
                        <button class="text-royal-blue hover:text-gold transition-colors">
                            <i class="fas fa-expand-alt mr-1"></i>View
                        </button>
                    </div>
                </div>
            </div>

            <!-- Sample Item 2 -->
            <div class="gallery-item bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div class="relative group">
                    <div class="w-full h-64 bg-gold flex items-center justify-center">
                        <div class="text-center text-royal-blue">
                            <i class="fas fa-trophy text-4xl mb-2"></i>
                            <p>Victory Celebration</p>
                        </div>
                    </div>
                    
                    <div class="gallery-overlay absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
                        <div class="text-white text-center transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                            <i class="fas fa-search-plus text-3xl mb-2"></i>
                            <p class="text-sm">View Full Size</p>
                        </div>
                    </div>
                </div>
                
                <div class="p-6">
                    <h3 class="text-xl font-bold text-royal-blue mb-2">Victory Celebration</h3>
                    <p class="text-gray-600 mb-4">Team celebrating championship victory</p>
                    <div class="flex justify-between items-center text-sm text-gray-500">
                        <span>January 29, 2024</span>
                        <button class="text-royal-blue hover:text-gold transition-colors">
                            <i class="fas fa-expand-alt mr-1"></i>View
                        </button>
                    </div>
                </div>
            </div>

            <!-- Sample Item 3 -->
            <div class="gallery-item bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div class="relative group">
                    <div class="w-full h-64 bg-gray-600 flex items-center justify-center">
                        <div class="text-center text-white">
                            <i class="fas fa-users text-4xl mb-2"></i>
                            <p>Team Photo 2024</p>
                        </div>
                    </div>
                    
                    <div class="gallery-overlay absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
                        <div class="text-white text-center transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                            <i class="fas fa-search-plus text-3xl mb-2"></i>
                            <p class="text-sm">View Full Size</p>
                        </div>
                    </div>
                </div>
                
                <div class="p-6">
                    <h3 class="text-xl font-bold text-royal-blue mb-2">Team Photo 2024</h3>
                    <p class="text-gray-600 mb-4">Official team photograph for 2024 season</p>
                    <div class="flex justify-between items-center text-sm text-gray-500">
                        <span>February 1, 2024</span>
                        <button class="text-royal-blue hover:text-gold transition-colors">
                            <i class="fas fa-expand-alt mr-1"></i>View
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <?php endif; ?>
    </div>
</section>

<!-- Upload Section for Fans -->
<section class="py-20 bg-white">
    <div class="container mx-auto px-4 text-center">
        <h2 class="text-4xl font-bold text-royal-blue mb-4">Share Your Photos</h2>
        <p class="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
            Captured a great moment at our matches? Share your photos with the TUSKERS community!
        </p>
        
        <div class="max-w-md mx-auto bg-gray-50 rounded-xl p-8">
            <form action="upload_photo.php" method="POST" enctype="multipart/form-data">
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Photo Title</label>
                    <input type="text" name="title" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-blue focus:border-transparent">
                </div>
                
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea name="description" rows="3" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-blue focus:border-transparent"></textarea>
                </div>
                
                <div class="mb-6">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Select Photo</label>
                    <input type="file" name="photo" accept="image/*" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-blue focus:border-transparent">
                </div>
                
                <button type="submit" class="w-full bg-royal-blue hover:bg-blue-800 text-white py-3 rounded-lg font-semibold transition-colors">
                    <i class="fas fa-upload mr-2"></i>Upload Photo
                </button>
            </form>
            
            <p class="text-xs text-gray-500 mt-4">
                Photos will be reviewed before appearing in the gallery.
            </p>
        </div>
    </div>
</section>

<!-- Lightbox Modal -->
<div id="lightbox" class="fixed inset-0 bg-black bg-opacity-90 z-50 hidden flex items-center justify-center">
    <div class="relative max-w-4xl max-h-full p-4">
        <button onclick="closeLightbox()" class="absolute top-4 right-4 text-white text-2xl hover:text-gold transition-colors z-10">
            <i class="fas fa-times"></i>
        </button>
        
        <img id="lightboxImage" src="" alt="" class="max-w-full max-h-full object-contain">
        
        <div class="absolute bottom-4 left-4 right-4 text-white">
            <h3 id="lightboxTitle" class="text-xl font-bold mb-2"></h3>
        </div>
    </div>
</div>

<script>
function openLightbox(imageUrl, title) {
    document.getElementById('lightboxImage').src = imageUrl;
    document.getElementById('lightboxTitle').textContent = title;
    document.getElementById('lightbox').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    document.getElementById('lightbox').classList.add('hidden');
    document.body.style.overflow = 'auto';
}

// Close lightbox on click outside image
document.getElementById('lightbox').addEventListener('click', function(e) {
    if (e.target === this) {
        closeLightbox();
    }
});

// Close lightbox on escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeLightbox();
    }
});
</script>

<?php include 'includes/footer.php'; ?>