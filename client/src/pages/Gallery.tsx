import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import type { GalleryItem } from '@shared/schema';

export default function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
  
  const { data: galleryItems = [], isLoading } = useQuery<GalleryItem[]>({
    queryKey: ['/api/gallery']
  });

  const filteredItems = galleryItems.filter(item => {
    if (selectedCategory === 'all') return true;
    return item.category === selectedCategory;
  });

  const categories = ['all', ...Array.from(new Set(galleryItems.map(item => item.category)))];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-[#1e3a8a] mb-4">Match Gallery</h1>
            <p className="text-xl text-gray-600">Capturing memorable moments from Tuskers CC</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-lg overflow-hidden animate-pulse">
                <div className="w-full h-64 bg-gray-200"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#1e3a8a] mb-4">Match Gallery</h1>
          <p className="text-xl text-gray-600">Capturing memorable moments from Tuskers CC</p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors capitalize ${
                selectedCategory === category
                  ? 'bg-[#1e3a8a] text-white'
                  : 'bg-white text-[#1e3a8a] border border-[#1e3a8a] hover:bg-[#eff6ff]'
              }`}
            >
              {category === 'all' ? 'All Photos' : category}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
              onClick={() => setSelectedImage(item)}
            >
              <div className="relative">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-[#1e3a8a] text-white px-3 py-1 rounded-full text-sm font-semibold capitalize">
                    {item.category}
                  </span>
                </div>
              </div>

              <div className="p-4">
                <h3 className="text-lg font-bold text-[#1e3a8a] mb-2 line-clamp-1">
                  {item.title}
                </h3>
                {item.description && (
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {item.description}
                  </p>
                )}
                <div className="mt-3 text-xs text-gray-500">
                  {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Date not available'}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No photos found in this category.</p>
          </div>
        )}

        {/* Back to Home */}
        <div className="text-center mt-12">
          <a
            href="/"
            className="inline-block bg-white text-[#1e3a8a] border-2 border-[#1e3a8a] px-8 py-4 rounded-lg font-semibold text-lg hover:bg-[#eff6ff] transition-colors"
          >
            Back to Home
          </a>
        </div>

        {/* Image Modal */}
        {selectedImage && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" onClick={() => setSelectedImage(null)}>
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
              <div className="relative">
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-75 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <img
                  src={selectedImage.imageUrl}
                  alt={selectedImage.title}
                  className="w-full h-96 object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-[#1e3a8a]">{selectedImage.title}</h2>
                  <span className="bg-[#1e3a8a] text-white px-3 py-1 rounded-full text-sm font-semibold capitalize">
                    {selectedImage.category}
                  </span>
                </div>
                {selectedImage.description && (
                  <p className="text-gray-600 mb-4">{selectedImage.description}</p>
                )}
                <div className="text-sm text-gray-500">
                  {selectedImage.createdAt ? new Date(selectedImage.createdAt).toLocaleDateString() : 'Date not available'}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}