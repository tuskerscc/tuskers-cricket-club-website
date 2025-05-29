import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import type { Player, Match, Article, Team, Venue, Competition } from '@shared/schema';
import { insertPlayerSchema, insertMatchSchema, insertArticleSchema } from '@shared/schema';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('players');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: players = [] } = useQuery<Player[]>({
    queryKey: ['/api/players']
  });

  const { data: matches = [] } = useQuery<(Match & { homeTeam: Team; awayTeam: Team; venue: Venue; competition: Competition })[]>({
    queryKey: ['/api/matches']
  });

  const { data: articles = [] } = useQuery<Article[]>({
    queryKey: ['/api/articles']
  });

  const { data: teams = [] } = useQuery<Team[]>({
    queryKey: ['/api/teams']
  });

  // Player form
  const playerForm = useForm({
    resolver: zodResolver(insertPlayerSchema),
    defaultValues: {
      name: '',
      role: '',
      battingStyle: '',
      bowlingStyle: '',
      jerseyNumber: 1,
      isCaptain: false,
      isViceCaptain: false,
      photo: ''
    }
  });

  // Article form
  const articleForm = useForm({
    resolver: zodResolver(insertArticleSchema),
    defaultValues: {
      title: '',
      slug: '',
      content: '',
      excerpt: '',
      featuredImage: '',
      isFeatured: false,
      published: true
    }
  });

  const addPlayerMutation = useMutation({
    mutationFn: (data: any) => apiRequest('/api/players', { method: 'POST', body: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/players'] });
      playerForm.reset();
      toast({ title: "Success", description: "Player added successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to add player", variant: "destructive" });
    }
  });

  const addArticleMutation = useMutation({
    mutationFn: (data: any) => apiRequest('/api/articles', { method: 'POST', body: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/articles'] });
      articleForm.reset();
      toast({ title: "Success", description: "Article added successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to add article", variant: "destructive" });
    }
  });

  const deletePlayerMutation = useMutation({
    mutationFn: (id: number) => apiRequest(`/api/players/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/players'] });
      toast({ title: "Success", description: "Player deleted successfully" });
    }
  });

  const deleteArticleMutation = useMutation({
    mutationFn: (id: number) => apiRequest(`/api/articles/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/articles'] });
      toast({ title: "Success", description: "Article deleted successfully" });
    }
  });

  const onPlayerSubmit = (data: any) => {
    addPlayerMutation.mutate(data);
  };

  const onArticleSubmit = (data: any) => {
    addArticleMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h1 className="text-3xl font-bold text-[#1e3a8a] mb-2">Tuskers CC Admin Panel</h1>
          <p className="text-gray-600">Manage your cricket club's data and content</p>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {[
                { id: 'players', name: 'Players', icon: '👤' },
                { id: 'matches', name: 'Matches', icon: '🏏' },
                { id: 'articles', name: 'Articles', icon: '📰' },
                { id: 'analytics', name: 'Analytics', icon: '📊' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-[#1e3a8a] text-[#1e3a8a]'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Players Tab */}
        {activeTab === 'players' && (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Add Player Form */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-[#1e3a8a] mb-4">Add New Player</h2>
              <form onSubmit={playerForm.handleSubmit(onPlayerSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    {...playerForm.register('name')}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
                    placeholder="Player Name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select
                    {...playerForm.register('role')}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
                  >
                    <option value="">Select Role</option>
                    <option value="Batsman">Batsman</option>
                    <option value="Bowler">Bowler</option>
                    <option value="All-rounder">All-rounder</option>
                    <option value="Wicket-keeper">Wicket-keeper</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Batting Style</label>
                    <select
                      {...playerForm.register('battingStyle')}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
                    >
                      <option value="">Select Style</option>
                      <option value="Right-hand bat">Right-hand bat</option>
                      <option value="Left-hand bat">Left-hand bat</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Jersey Number</label>
                    <input
                      type="number"
                      {...playerForm.register('jerseyNumber', { valueAsNumber: true })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
                      min="1"
                      max="99"
                    />
                  </div>
                </div>

                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      {...playerForm.register('isCaptain')}
                      className="mr-2 h-4 w-4 text-[#1e3a8a] focus:ring-[#1e3a8a] border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">Captain</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      {...playerForm.register('isViceCaptain')}
                      className="mr-2 h-4 w-4 text-[#1e3a8a] focus:ring-[#1e3a8a] border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">Vice Captain</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={addPlayerMutation.isPending}
                  className="w-full bg-[#1e3a8a] text-white py-2 px-4 rounded-lg font-semibold hover:bg-[#1e40af] transition-colors disabled:opacity-50"
                >
                  {addPlayerMutation.isPending ? 'Adding...' : 'Add Player'}
                </button>
              </form>
            </div>

            {/* Players List */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-[#1e3a8a] mb-4">Current Players ({players.length})</h2>
              <div className="max-h-96 overflow-y-auto space-y-3">
                {players.map((player) => (
                  <div key={player.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div>
                      <div className="font-semibold">{player.name}</div>
                      <div className="text-sm text-gray-600">
                        #{player.jerseyNumber} • {player.role}
                        {player.isCaptain && ' • Captain'}
                        {player.isViceCaptain && ' • Vice Captain'}
                      </div>
                    </div>
                    <button
                      onClick={() => deletePlayerMutation.mutate(player.id)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Articles Tab */}
        {activeTab === 'articles' && (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Add Article Form */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-[#1e3a8a] mb-4">Add New Article</h2>
              <form onSubmit={articleForm.handleSubmit(onArticleSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    {...articleForm.register('title')}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
                    placeholder="Article Title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                  <input
                    {...articleForm.register('slug')}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
                    placeholder="article-slug"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
                  <textarea
                    {...articleForm.register('excerpt')}
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
                    placeholder="Brief description..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                  <textarea
                    {...articleForm.register('content')}
                    rows={6}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
                    placeholder="Article content..."
                  />
                </div>

                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      {...articleForm.register('isFeatured')}
                      className="mr-2 h-4 w-4 text-[#1e3a8a] focus:ring-[#1e3a8a] border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">Featured Article</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={addArticleMutation.isPending}
                  className="w-full bg-[#1e3a8a] text-white py-2 px-4 rounded-lg font-semibold hover:bg-[#1e40af] transition-colors disabled:opacity-50"
                >
                  {addArticleMutation.isPending ? 'Publishing...' : 'Publish Article'}
                </button>
              </form>
            </div>

            {/* Articles List */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-[#1e3a8a] mb-4">Published Articles ({articles.length})</h2>
              <div className="max-h-96 overflow-y-auto space-y-3">
                {articles.map((article) => (
                  <div key={article.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div>
                      <div className="font-semibold">{article.title}</div>
                      <div className="text-sm text-gray-600">
                        {article.isFeatured && '⭐ Featured • '}
                        {new Date(article.publishedAt).toLocaleDateString()}
                      </div>
                    </div>
                    <button
                      onClick={() => deleteArticleMutation.mutate(article.id)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-[#1e3a8a] mb-2">Total Players</h3>
              <div className="text-3xl font-bold text-gray-900">{players.length}</div>
              <p className="text-sm text-gray-600">Active squad members</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-[#1e3a8a] mb-2">Total Matches</h3>
              <div className="text-3xl font-bold text-gray-900">{matches.length}</div>
              <p className="text-sm text-gray-600">Scheduled fixtures</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-[#1e3a8a] mb-2">Published Articles</h3>
              <div className="text-3xl font-bold text-gray-900">{articles.length}</div>
              <p className="text-sm text-gray-600">News and updates</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-[#1e3a8a] mb-2">Teams</h3>
              <div className="text-3xl font-bold text-gray-900">{teams.length}</div>
              <p className="text-sm text-gray-600">Registered teams</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}