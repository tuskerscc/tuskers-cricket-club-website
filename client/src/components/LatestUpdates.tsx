import { useQuery } from '@tanstack/react-query';
import type { Article } from '@shared/schema';

export default function LatestUpdates() {
  const { data: articles = [], isLoading } = useQuery<Article[]>({
    queryKey: ['/api/articles']
  });

  const { data: featuredArticles = [] } = useQuery<Article[]>({
    queryKey: ['/api/articles/featured']
  });

  const featuredArticle = featuredArticles[0];
  const regularArticles = articles.slice(0, 6);

  if (isLoading) {
    return (
      <section id="news" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#1e3a8a] mb-4">Latest Updates</h2>
            <p className="text-xl text-gray-600">Stay informed with the latest news, match reports, and team updates</p>
          </div>
          <div className="animate-pulse">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-12 grid lg:grid-cols-2 gap-0">
              <div className="w-full h-64 lg:h-96 bg-gray-200"></div>
              <div className="p-8 lg:p-12">
                <div className="h-6 bg-gray-200 rounded mb-6"></div>
                <div className="h-8 bg-gray-200 rounded mb-4"></div>
                <div className="h-20 bg-gray-200 rounded mb-6"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="news" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-[#1e3a8a] mb-4">Latest Updates</h2>
          <p className="text-xl text-gray-600">Stay informed with the latest news, match reports, and team updates</p>
        </div>

        {/* Featured Article */}
        {featuredArticle && (
          <div className="mb-12">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="grid lg:grid-cols-2 gap-0">
                <img 
                  src={featuredArticle.featuredImage || 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600'} 
                  alt={featuredArticle.title} 
                  className="w-full h-full object-cover lg:min-h-[400px]"
                />
                <div className="p-8 lg:p-12 flex flex-col justify-center">
                  <div className="flex items-center space-x-4 mb-6">
                    <span className="bg-[#fef3c7] text-[#d97706] px-4 py-2 rounded-full text-sm font-semibold">
                      {featuredArticle.category.toUpperCase()}
                    </span>
                    <span className="text-gray-500 text-sm">
                      {featuredArticle.publishedAt ? new Date(featuredArticle.publishedAt).toLocaleDateString() : 'Recently'}
                    </span>
                  </div>
                  <h3 className="text-3xl font-bold text-[#1e3a8a] mb-4 leading-tight">
                    {featuredArticle.title}
                  </h3>
                  <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                    {featuredArticle.excerpt}
                  </p>
                  <div className="flex items-center space-x-4">
                    <button className="bg-[#1e3a8a] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#1e40af] transition-colors">
                      Read Full Story
                    </button>
                    <div className="flex space-x-3">
                      <button className="text-gray-400 hover:text-[#1e3a8a] transition-colors">
                        <i className="fab fa-facebook text-xl"></i>
                      </button>
                      <button className="text-gray-400 hover:text-[#1e3a8a] transition-colors">
                        <i className="fab fa-twitter text-xl"></i>
                      </button>
                      <button className="text-gray-400 hover:text-[#1e3a8a] transition-colors">
                        <i className="fas fa-share text-xl"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* News Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {regularArticles.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg">No articles available at the moment.</p>
            </div>
          ) : (
            regularArticles.map((article) => (
              <article 
                key={article.id} 
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <img 
                  src={article.featuredImage || 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400'} 
                  alt={article.title} 
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      article.category === 'training' ? 'bg-[#eff6ff] text-[#1e40af]' :
                      article.category === 'transfers' ? 'bg-green-100 text-green-800' :
                      article.category === 'facilities' ? 'bg-purple-100 text-purple-800' :
                      article.category === 'academy' ? 'bg-orange-100 text-orange-800' :
                      article.category === 'community' ? 'bg-blue-100 text-blue-800' :
                      'bg-[#fef3c7] text-[#d97706]'
                    }`}>
                      {article.category.toUpperCase()}
                    </span>
                    <span className="text-gray-500 text-sm">
                      {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : 'Recently'}
                    </span>
                  </div>
                  <h4 className="text-xl font-bold text-[#1e3a8a] mb-3 line-clamp-2">
                    {article.title}
                  </h4>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-gray-600 text-xs font-medium">
                          {article.author.charAt(0)}
                        </span>
                      </div>
                      <span className="text-sm text-gray-700 font-medium">{article.author}</span>
                    </div>
                    <button className="text-[#1e3a8a] font-semibold hover:text-[#f59e0b] transition-colors">
                      Read More <i className="fas fa-arrow-right ml-1"></i>
                    </button>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>

        <div className="text-center mt-12">
          <a 
            href="/news" 
            className="inline-block bg-[#1e3a8a] text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-[#1e40af] transition-colors"
          >
            View All News
          </a>
        </div>
      </div>
    </section>
  );
}
