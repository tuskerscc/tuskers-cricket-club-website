import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { 
  MessageSquare, 
  Users, 
  Calendar, 
  TrendingUp, 
  Pin, 
  Lock, 
  Eye,
  Clock,
  Plus,
  Search,
  Filter,
  Heart,
  Share2,
  MessageCircle,
  ThumbsUp
} from 'lucide-react';
import type { ForumCategory, ForumTopic, UserProfile } from '@shared/schema';

interface ForumCategoryWithStats extends ForumCategory {
  topicCount: number;
  postCount: number;
  lastTopic?: {
    title: string;
    slug: string;
    user: string;
    createdAt: string;
  };
}

interface ForumTopicWithDetails extends ForumTopic {
  category: ForumCategory;
  user: UserProfile;
  lastReplyUser?: UserProfile;
}

export default function Forum() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const { data: categories = [], isLoading: categoriesLoading } = useQuery<ForumCategoryWithStats[]>({
    queryKey: ['/api/forum/categories'],
  });

  const { data: recentTopics = [], isLoading: topicsLoading } = useQuery<ForumTopicWithDetails[]>({
    queryKey: ['/api/forum/topics/recent'],
  });

  const { data: popularTopics = [] } = useQuery<ForumTopicWithDetails[]>({
    queryKey: ['/api/forum/topics/popular'],
  });

  const { data: onlineUsers = [] } = useQuery<UserProfile[]>({
    queryKey: ['/api/forum/users/online'],
  });

  const { data: forumStats } = useQuery({
    queryKey: ['/api/forum/stats'],
  });

  const filteredTopics = recentTopics.filter(topic => {
    const matchesSearch = topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         topic.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || topic.categoryId.toString() === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-[#1e3a8a] mb-2">TUSKERS CRICKET CLUB Community Forum</h1>
              <p className="text-gray-600">Connect with fellow cricket enthusiasts and TUSKERS CRICKET CLUB supporters</p>
            </div>
            
            <div className="flex gap-3">
              <Link href="/forum/create-topic">
                <button className="bg-[#1e3a8a] text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition-colors flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  New Topic
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            
            {/* Search and Filter */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search topics..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Categories</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id.toString()}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Recent Topics */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 border-b">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[#1e3a8a]" />
                  Recent Discussions
                </h2>
              </div>
              
              {topicsLoading ? (
                <div className="p-6">
                  <div className="animate-pulse space-y-4">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="h-16 bg-gray-200 rounded"></div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="divide-y">
                  {filteredTopics.map(topic => (
                    <Link key={topic.id} href={`/forum/topic/${topic.slug}`}>
                      <div className="p-6 hover:bg-gray-50 transition-colors cursor-pointer">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4 flex-1">
                            <div className="flex items-center gap-2">
                              {topic.isSticky && <Pin className="w-4 h-4 text-yellow-500" />}
                              {topic.isLocked && <Lock className="w-4 h-4 text-gray-400" />}
                            </div>
                            
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 mb-1 hover:text-[#1e3a8a]">
                                {topic.title}
                              </h3>
                              <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                                <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                                  {topic.category.name}
                                </span>
                                <span>by {topic.user.displayName || 'Anonymous'}</span>
                                <span>{topic.createdAt ? new Date(topic.createdAt).toLocaleDateString() : 'Unknown'}</span>
                              </div>
                              <p className="text-gray-600 text-sm line-clamp-2">
                                {topic.content.substring(0, 150)}...
                              </p>
                            </div>
                          </div>
                          
                          <div className="text-right ml-4">
                            <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                              <div className="flex items-center gap-1">
                                <MessageSquare className="w-4 h-4" />
                                {topic.replyCount}
                              </div>
                              <div className="flex items-center gap-1">
                                <Eye className="w-4 h-4" />
                                {topic.viewCount}
                              </div>
                            </div>
                            
                            {/* Interactive Buttons */}
                            <div className="flex items-center gap-2 mb-2">
                              <button 
                                className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors text-xs"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                }}
                              >
                                <Heart className="w-3 h-3" />
                                <span>Like</span>
                              </button>
                              
                              <button 
                                className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors text-xs"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                }}
                              >
                                <MessageCircle className="w-3 h-3" />
                                <span>Reply</span>
                              </button>
                              
                              <button 
                                className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-green-50 hover:text-green-600 transition-colors text-xs"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  if (navigator.share) {
                                    navigator.share({
                                      title: topic.title,
                                      text: topic.content.substring(0, 100) + '...',
                                      url: window.location.origin + `/forum/topic/${topic.slug}`
                                    });
                                  } else {
                                    navigator.clipboard.writeText(window.location.origin + `/forum/topic/${topic.slug}`);
                                  }
                                }}
                              >
                                <Share2 className="w-3 h-3" />
                                <span>Share</span>
                              </button>
                            </div>
                            
                            {topic.lastReplyAt && (
                              <div className="text-xs text-gray-400">
                                Last reply {topic.lastReplyAt ? new Date(topic.lastReplyAt).toLocaleDateString() : 'Never'}
                                {topic.lastReplyUser && (
                                  <div>by {topic.lastReplyUser.displayName}</div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Forum Categories */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 border-b">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-[#1e3a8a]" />
                  Forum Categories
                </h2>
              </div>
              
              {categoriesLoading ? (
                <div className="p-6">
                  <div className="animate-pulse space-y-4">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-20 bg-gray-200 rounded"></div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="divide-y">
                  {categories.map(category => (
                    <div 
                      key={category.id} 
                      className="p-6 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 cursor-pointer border-l-4 border-transparent hover:border-amber-400"
                      onClick={() => setSelectedCategory(category.id.toString())}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div 
                            className="w-16 h-16 rounded-xl flex items-center justify-center text-white text-2xl shadow-lg transform hover:scale-105 transition-transform"
                            style={{ backgroundColor: category.color || '#1e3a8a' }}
                          >
                            {category.icon || category.name.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-[#1e3a8a] mb-2 text-lg hover:text-amber-600 transition-colors">
                              {category.name}
                            </h3>
                            <p className="text-gray-700 text-sm mb-3 leading-relaxed">
                              {category.description}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <div className="flex items-center gap-1">
                                <MessageSquare className="w-3 h-3" />
                                {(category as any).topicCount || 0} topics
                              </div>
                              <div className="flex items-center gap-1">
                                <Users className="w-3 h-3" />
                                {(category as any).postCount || 0} posts
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <div className="bg-gradient-to-br from-blue-100 to-indigo-100 px-3 py-2 rounded-lg">
                            <div className="text-[#1e3a8a] font-semibold text-sm">Latest Activity</div>
                            <div className="text-gray-600 text-xs mt-1">
                              {(category as any).lastTopic ? (
                                <>
                                  <div className="truncate max-w-32">{(category as any).lastTopic.title}</div>
                                  <div>by {(category as any).lastTopic.user}</div>
                                </>
                              ) : (
                                <div>No posts yet</div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Topics */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 border-b">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[#1e3a8a]" />
                  Recent Discussions
                </h2>
              </div>
              
              {topicsLoading ? (
                <div className="p-6">
                  <div className="animate-pulse space-y-4">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="h-16 bg-gray-200 rounded"></div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="divide-y">
                  {filteredTopics.map(topic => (
                    <Link key={topic.id} href={`/forum/topic/${topic.slug}`}>
                      <div className="p-6 hover:bg-gray-50 transition-colors cursor-pointer">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4 flex-1">
                            <div className="flex items-center gap-2">
                              {topic.isSticky && <Pin className="w-4 h-4 text-yellow-500" />}
                              {topic.isLocked && <Lock className="w-4 h-4 text-gray-400" />}
                            </div>
                            
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 mb-1 hover:text-[#1e3a8a]">
                                {topic.title}
                              </h3>
                              <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                                <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                                  {topic.category.name}
                                </span>
                                <span>by {topic.user.displayName || 'Anonymous'}</span>
                                <span>{new Date(topic.createdAt).toLocaleDateString()}</span>
                              </div>
                              <p className="text-gray-600 text-sm line-clamp-2">
                                {topic.content.substring(0, 150)}...
                              </p>
                            </div>
                          </div>
                          
                          <div className="text-right ml-4">
                            <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                              <div className="flex items-center gap-1">
                                <MessageSquare className="w-4 h-4" />
                                {topic.replyCount}
                              </div>
                              <div className="flex items-center gap-1">
                                <Eye className="w-4 h-4" />
                                {topic.viewCount}
                              </div>
                            </div>
                            
                            {/* Interactive Buttons */}
                            <div className="flex items-center gap-2 mb-2">
                              <button 
                                className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors text-xs"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  // Handle like functionality
                                }}
                              >
                                <Heart className="w-3 h-3" />
                                <span>Like</span>
                              </button>
                              
                              <button 
                                className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors text-xs"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  // Handle comment functionality
                                }}
                              >
                                <MessageCircle className="w-3 h-3" />
                                <span>Reply</span>
                              </button>
                              
                              <button 
                                className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-green-50 hover:text-green-600 transition-colors text-xs"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  // Handle share functionality
                                  if (navigator.share) {
                                    navigator.share({
                                      title: topic.title,
                                      text: topic.content.substring(0, 100) + '...',
                                      url: window.location.origin + `/forum/topic/${topic.slug}`
                                    });
                                  } else {
                                    navigator.clipboard.writeText(window.location.origin + `/forum/topic/${topic.slug}`);
                                  }
                                }}
                              >
                                <Share2 className="w-3 h-3" />
                                <span>Share</span>
                              </button>
                            </div>
                            
                            {topic.lastReplyAt && (
                              <div className="text-xs text-gray-400">
                                Last reply {topic.lastReplyAt ? new Date(topic.lastReplyAt).toLocaleDateString() : 'Never'}
                                {topic.lastReplyUser && (
                                  <div>by {topic.lastReplyUser.displayName}</div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                  
                  {filteredTopics.length === 0 && (
                    <div className="p-8 text-center text-gray-500">
                      <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>No topics found. Be the first to start a discussion!</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Forum Stats */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#1e3a8a]" />
                Forum Stats
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Topics</span>
                  <span className="font-semibold">{forumStats?.totalTopics || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Posts</span>
                  <span className="font-semibold">{forumStats?.totalPosts || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Members</span>
                  <span className="font-semibold">{forumStats?.totalMembers || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Online Now</span>
                  <span className="font-semibold text-green-600">{onlineUsers.length}</span>
                </div>
              </div>
            </div>

            {/* Popular Topics */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#1e3a8a]" />
                Trending Topics
              </h3>
              <div className="space-y-3">
                {popularTopics.slice(0, 5).map(topic => (
                  <Link key={topic.id} href={`/forum/topic/${topic.slug}`}>
                    <div className="block hover:bg-gray-50 p-2 -m-2 rounded transition-colors">
                      <h4 className="font-medium text-sm text-gray-900 mb-1 line-clamp-2">
                        {topic.title}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Eye className="w-3 h-3" />
                        {topic.viewCount}
                        <MessageSquare className="w-3 h-3 ml-2" />
                        {topic.replyCount}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Online Users */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-[#1e3a8a]" />
                Online Members ({onlineUsers.length})
              </h3>
              <div className="space-y-2">
                {onlineUsers.slice(0, 10).map(user => (
                  <div key={user.id} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">{user.displayName || 'Anonymous'}</span>
                  </div>
                ))}
                {onlineUsers.length > 10 && (
                  <div className="text-sm text-gray-500 mt-2">
                    +{onlineUsers.length - 10} more online
                  </div>
                )}
              </div>
            </div>


          </div>
        </div>

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