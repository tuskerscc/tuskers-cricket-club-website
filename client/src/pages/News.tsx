import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import type { Article } from '@shared/schema';

export default function News() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  const { data: articles = [], isLoading } = useQuery<Article[]>({
    queryKey: ['/api/articles']
  });

  const filteredArticles = articles.filter(article => {
    if (selectedCategory === 'all') return true;
    return article.category === selectedCategory;
  });

  const categories = ['all', ...Array.from(new Set(articles.map(article => article.category)))];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-[#1e3a8a] mb-4">Latest News</h1>
            <p className="text-xl text-gray-600">Stay updated with Tuskers CC news and updates</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-lg overflow-hidden animate-pulse">
                <div className="w-full h-48 bg-gray-200"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-200 rounded mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
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
          <h1 className="text-4xl font-bold text-[#1e3a8a] mb-4">Latest News</h1>
          <p className="text-xl text-gray-600">Stay updated with Tuskers CC news and updates</p>
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
              {category === 'all' ? 'All News' : category}
            </button>
          ))}
        </div>

        {/* Articles Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.map((article) => (
            <article
              key={article.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative">
                <img
                  src={article.featuredImage || 'https://via.placeholder.com/400x240/1e3a8a/white?text=News'}
                  alt={article.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-[#1e3a8a] text-white px-3 py-1 rounded-full text-sm font-semibold capitalize">
                    {article.category}
                  </span>
                </div>
                {article.isFeatured && (
                  <div className="absolute top-4 right-4">
                    <span className="bg-[#f59e0b] text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Featured
                    </span>
                  </div>
                )}
              </div>

              <div className="p-6">
                <h2 className="text-xl font-bold text-[#1e3a8a] mb-3 line-clamp-2">
                  {article.title}
                </h2>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {article.excerpt}
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : 'Not published'}</span>
                  <span>By {article.author}</span>
                </div>

                <div className="mt-4">
                  <button className="w-full bg-[#1e3a8a] text-white py-2 rounded-lg font-semibold hover:bg-[#1e40af] transition-colors">
                    Read More
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {filteredArticles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No articles found in this category.</p>
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
      </div>
    </div>
  );
}