import { useQuery } from '@tanstack/react-query';
import { useRoute, Link } from 'wouter';
import type { Article } from '@shared/schema';

export default function Article() {
  const [match, params] = useRoute('/news/:slug');
  const slug = params?.slug;

  const { data: article, isLoading } = useQuery<Article>({
    queryKey: [`/api/articles/slug/${slug}`],
    enabled: !!slug
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="h-64 bg-gray-200 rounded mb-6"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h1 className="text-4xl font-bold text-[#1e3a8a] mb-4">Article Not Found</h1>
          <p className="text-gray-600 mb-8">The article you're looking for doesn't exist.</p>
          <Link href="/news">
            <button className="bg-[#1e3a8a] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#1e40af] transition-colors">
              Back to News
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Back Navigation */}
        <div className="mb-8">
          <Link href="/news">
            <button className="flex items-center text-[#1e3a8a] hover:text-[#1e40af] transition-colors">
              <i className="fas fa-arrow-left mr-2"></i>
              Back to News
            </button>
          </Link>
        </div>

        {/* Article Content */}
        <article className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Featured Image */}
          {article.featuredImage && (
            <div className="w-full h-64 md:h-96">
              <img
                src={article.featuredImage}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-8">
            {/* Category and Featured Badge */}
            <div className="flex items-center gap-3 mb-6">
              <span className="bg-[#1e3a8a] text-white px-4 py-2 rounded-full text-sm font-semibold capitalize">
                {article.category}
              </span>
              {article.isFeatured && (
                <span className="bg-[#f59e0b] text-white px-4 py-2 rounded-full text-sm font-semibold">
                  Featured
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-4xl font-bold text-[#1e3a8a] mb-6 leading-tight">
              {article.title}
            </h1>

            {/* Meta Information */}
            <div className="flex items-center justify-between text-gray-600 mb-8 pb-6 border-b">
              <div className="flex items-center gap-4">
                <span>By {article.author}</span>
                <span>•</span>
                <span>{article.publishedAt ? new Date(article.publishedAt).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                }) : 'Not published'}</span>
              </div>
            </div>

            {/* Excerpt */}
            {article.excerpt && (
              <div className="bg-blue-50 border-l-4 border-[#1e3a8a] p-6 mb-8">
                <p className="text-lg text-gray-700 italic leading-relaxed">
                  {article.excerpt}
                </p>
              </div>
            )}

            {/* Content */}
            <div className="prose prose-lg max-w-none">
              <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                {article.content}
              </div>
            </div>

            {/* Share Section */}
            <div className="mt-12 pt-8 border-t">
              <h3 className="text-lg font-semibold text-[#1e3a8a] mb-4">Share this article</h3>
              <div className="flex gap-3">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  <i className="fab fa-facebook mr-2"></i>Facebook
                </button>
                <button className="bg-blue-400 text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition-colors">
                  <i className="fab fa-twitter mr-2"></i>Twitter
                </button>
                <button className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors">
                  <i className="fab fa-linkedin mr-2"></i>LinkedIn
                </button>
              </div>
            </div>
          </div>
        </article>

        {/* Back to News Button */}
        <div className="text-center mt-12">
          <Link href="/news">
            <button className="bg-[#1e3a8a] text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-[#1e40af] transition-colors">
              Back to All News
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}