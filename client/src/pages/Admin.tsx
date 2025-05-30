import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import type { Player, Match, Article, Team, Venue, Competition, GalleryItem } from '@shared/schema';
import { insertPlayerSchema, insertMatchSchema, insertArticleSchema, insertGallerySchema } from '@shared/schema';

import AdminProtected from '@/components/AdminProtected';

// Player Stats Form Component
function PlayerStatsForm({ playerId, stats, onClose }: { 
  playerId: number; 
  stats?: any; 
  onClose: () => void; 
}) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const updateStatsMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest(`/api/players/${playerId}/stats`, 'PUT', data);
    },
    onSuccess: () => {
      toast({ title: "Statistics updated successfully" });
      queryClient.invalidateQueries({ queryKey: ['/api/players'] });
      onClose();
    },
    onError: () => {
      toast({ title: "Failed to update statistics", variant: "destructive" });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      runsScored: formData.get('runsScored') ? parseInt(formData.get('runsScored') as string) : null,
      ballsFaced: formData.get('ballsFaced') ? parseInt(formData.get('ballsFaced') as string) : null,
      fours: formData.get('fours') ? parseInt(formData.get('fours') as string) : null,
      sixes: formData.get('sixes') ? parseInt(formData.get('sixes') as string) : null,
      wicketsTaken: formData.get('wicketsTaken') ? parseInt(formData.get('wicketsTaken') as string) : null,
      ballsBowled: formData.get('ballsBowled') ? parseInt(formData.get('ballsBowled') as string) : null,
      runsConceded: formData.get('runsConceded') ? parseInt(formData.get('runsConceded') as string) : null,
      catches: formData.get('catches') ? parseInt(formData.get('catches') as string) : null,
      stumpings: formData.get('stumpings') ? parseInt(formData.get('stumpings') as string) : null,
      runOuts: formData.get('runOuts') ? parseInt(formData.get('runOuts') as string) : null,
    };
    updateStatsMutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 p-4 bg-gray-50 rounded-lg space-y-4">
      <h5 className="font-medium text-gray-900 mb-3">Edit Player Statistics</h5>
      
      {/* Batting Stats */}
      <div>
        <h6 className="text-sm font-medium text-gray-700 mb-2">Batting</h6>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-600">Runs</label>
            <input
              name="runsScored"
              type="number"
              defaultValue={stats?.runsScored || ''}
              placeholder="Enter runs (optional)"
              className="w-full text-sm border border-gray-300 rounded px-2 py-1"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600">Balls Faced</label>
            <input
              name="ballsFaced"
              type="number"
              defaultValue={stats?.ballsFaced || ''}
              placeholder="Enter balls (optional)"
              className="w-full text-sm border border-gray-300 rounded px-2 py-1"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600">4s</label>
            <input
              name="fours"
              type="number"
              defaultValue={stats?.fours || ''}
              placeholder="Enter 4s (optional)"
              className="w-full text-sm border border-gray-300 rounded px-2 py-1"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600">6s</label>
            <input
              name="sixes"
              type="number"
              defaultValue={stats?.sixes || ''}
              placeholder="Enter 6s (optional)"
              className="w-full text-sm border border-gray-300 rounded px-2 py-1"
            />
          </div>
        </div>
      </div>

      {/* Bowling Stats */}
      <div>
        <h6 className="text-sm font-medium text-gray-700 mb-2">Bowling</h6>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-600">Wickets</label>
            <input
              name="wicketsTaken"
              type="number"
              defaultValue={stats?.wicketsTaken || ''}
              placeholder="Enter wickets (optional)"
              className="w-full text-sm border border-gray-300 rounded px-2 py-1"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600">Balls Bowled</label>
            <input
              name="ballsBowled"
              type="number"
              defaultValue={stats?.ballsBowled || ''}
              placeholder="Enter balls (optional)"
              className="w-full text-sm border border-gray-300 rounded px-2 py-1"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600">Runs Conceded</label>
            <input
              name="runsConceded"
              type="number"
              defaultValue={stats?.runsConceded || ''}
              placeholder="Enter runs (optional)"
              className="w-full text-sm border border-gray-300 rounded px-2 py-1"
            />
          </div>
        </div>
      </div>

      {/* Fielding Stats */}
      <div>
        <h6 className="text-sm font-medium text-gray-700 mb-2">Fielding</h6>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs text-gray-600">Catches</label>
            <input
              name="catches"
              type="number"
              defaultValue={stats?.catches || ''}
              placeholder="Enter catches (optional)"
              className="w-full text-sm border border-gray-300 rounded px-2 py-1"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600">Stumpings</label>
            <input
              name="stumpings"
              type="number"
              defaultValue={stats?.stumpings || ''}
              placeholder="Enter stumpings (optional)"
              className="w-full text-sm border border-gray-300 rounded px-2 py-1"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600">Run Outs</label>
            <input
              name="runOuts"
              type="number"
              defaultValue={stats?.runOuts || ''}
              placeholder="Enter run outs (optional)"
              className="w-full text-sm border border-gray-300 rounded px-2 py-1"
            />
          </div>
        </div>
      </div>

      <div className="flex space-x-2 pt-2">
        <button
          type="submit"
          disabled={updateStatsMutation.isPending}
          className="bg-[#1e3a8a] text-white px-3 py-1 rounded text-sm hover:bg-[#1e40af] transition-colors disabled:opacity-50"
        >
          {updateStatsMutation.isPending ? 'Saving...' : 'Save Changes'}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function AdminContent() {
  const [activeTab, setActiveTab] = useState('players');
  const [editingPlayer, setEditingPlayer] = useState<number | null>(null);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: players = [] } = useQuery<(Player & { stats?: any })[]>({
    queryKey: ['/api/players']
  });

  const { data: announcements = [] } = useQuery<any[]>({
    queryKey: ['/api/announcements']
  });

  const { data: articles = [] } = useQuery<Article[]>({
    queryKey: ['/api/articles']
  });

  const { data: teams = [] } = useQuery<Team[]>({
    queryKey: ['/api/teams']
  });

  const { data: galleryItems = [] } = useQuery<GalleryItem[]>({
    queryKey: ['/api/gallery']
  });

  // Player form
  const playerForm = useForm({
    defaultValues: {
      name: '',
      role: '',
      battingStyle: '',
      bowlingStyle: '',
      bio: '',
      jerseyNumber: 1,
      isCaptain: false,
      isViceCaptain: false,
      photo: ''
    }
  });

  // Gallery form
  const galleryForm = useForm({
    defaultValues: {
      title: '',
      description: '',
      category: 'match',
      imageUrl: '',
      matchId: null
    }
  });

  // Announcement form
  const announcementForm = useForm({
    defaultValues: {
      title: '',
      content: '',
      category: '',
      priority: ''
    }
  });

  // Article form
  const articleForm = useForm({
    defaultValues: {
      title: '',
      slug: '',
      content: '',
      excerpt: '',
      featuredImage: '',
      author: 'Admin',
      category: 'news',
      isFeatured: false,
      isPublished: true
    }
  });

  const addPlayerMutation = useMutation({
    mutationFn: (data: any) => apiRequest('POST', '/api/players', data),
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
    mutationFn: (data: any) => apiRequest('POST', '/api/articles', data),
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
    mutationFn: (id: number) => apiRequest('DELETE', `/api/players/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/players'] });
      toast({ title: "Success", description: "Player deleted successfully" });
    },
    onError: (error) => {
      console.error('Delete player error:', error);
      toast({ title: "Error", description: "Failed to delete player", variant: "destructive" });
    }
  });

  const deleteArticleMutation = useMutation({
    mutationFn: (id: number) => apiRequest('DELETE', `/api/articles/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/articles'] });
      queryClient.invalidateQueries({ queryKey: ['/api/articles/featured'] });
      toast({ title: "Success", description: "Article deleted successfully" });
    },
    onError: (error) => {
      console.error('Delete article error:', error);
      toast({ title: "Error", description: "Failed to delete article", variant: "destructive" });
    }
  });

  const updateArticleMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => apiRequest('PATCH', `/api/articles/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/articles'] });
      queryClient.invalidateQueries({ queryKey: ['/api/articles/featured'] });
      setEditingArticle(null);
      toast({ title: "Success", description: "Article updated successfully" });
    },
    onError: (error) => {
      console.error('Update article error:', error);
      toast({ title: "Error", description: "Failed to update article", variant: "destructive" });
    }
  });

  const deleteAllPlayersMutation = useMutation({
    mutationFn: () => apiRequest('DELETE', '/api/players/all'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/players'] });
      toast({ title: "Success", description: "All players deleted successfully" });
    },
    onError: (error) => {
      console.error('Delete all players error:', error);
      toast({ title: "Error", description: "Failed to delete all players", variant: "destructive" });
    }
  });

  // Gallery mutations
  const addGalleryItemMutation = useMutation({
    mutationFn: (data: any) => apiRequest('POST', '/api/gallery', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/gallery'] });
      galleryForm.reset();
      toast({ title: "Success", description: "Gallery item added successfully" });
    },
    onError: (error) => {
      console.error('Add gallery item error:', error);
      toast({ title: "Error", description: "Failed to add gallery item", variant: "destructive" });
    }
  });

  const deleteGalleryItemMutation = useMutation({
    mutationFn: (id: number) => apiRequest('DELETE', `/api/gallery/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/gallery'] });
      toast({ title: "Success", description: "Gallery item deleted successfully" });
    },
    onError: (error) => {
      console.error('Delete gallery item error:', error);
      toast({ title: "Error", description: "Failed to delete gallery item", variant: "destructive" });
    }
  });

  const onPlayerSubmit = (data: any) => {
    // Handle file upload
    const formData = { ...data };
    
    // If a photo file is selected, convert to base64 or URL
    if (data.photo && data.photo[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        formData.photo = e.target?.result as string;
        addPlayerMutation.mutate(formData);
      };
      reader.readAsDataURL(data.photo[0]);
    } else {
      formData.photo = '';
      addPlayerMutation.mutate(formData);
    }
  };

  const onGallerySubmit = (data: any) => {
    // Handle image upload
    const formData = { ...data };
    
    // If an image file is selected, convert to base64 or URL
    if (data.imageUrl && data.imageUrl[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        formData.imageUrl = e.target?.result as string;
        addGalleryItemMutation.mutate(formData);
      };
      reader.readAsDataURL(data.imageUrl[0]);
    } else {
      addGalleryItemMutation.mutate(formData);
    }
  };

  // Effect to populate form when editing an article
  useEffect(() => {
    if (editingArticle) {
      articleForm.reset({
        title: editingArticle.title,
        slug: editingArticle.slug,
        content: editingArticle.content,
        excerpt: editingArticle.excerpt || '',
        featuredImage: editingArticle.featuredImage || '',
        author: editingArticle.author || 'Admin',
        category: editingArticle.category || 'news',
        isFeatured: editingArticle.isFeatured || false,
        isPublished: editingArticle.isPublished || false
      });
    } else {
      articleForm.reset({
        title: '',
        slug: '',
        content: '',
        excerpt: '',
        featuredImage: '',
        author: 'Admin',
        category: 'news',
        isFeatured: false,
        isPublished: true
      });
    }
  }, [editingArticle, articleForm]);

  const onArticleSubmit = (data: any) => {
    // Handle file upload
    const formData = { ...data };
    
    // If a featured image file is selected, convert to base64
    if (data.featuredImage && data.featuredImage[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        formData.featuredImage = e.target?.result as string;
        if (editingArticle) {
          updateArticleMutation.mutate({ id: editingArticle.id, data: formData });
        } else {
          addArticleMutation.mutate(formData);
        }
      };
      reader.readAsDataURL(data.featuredImage[0]);
    } else {
      if (editingArticle) {
        // Keep existing image if no new image is uploaded
        formData.featuredImage = editingArticle.featuredImage || '';
        updateArticleMutation.mutate({ id: editingArticle.id, data: formData });
      } else {
        formData.featuredImage = '';
        addArticleMutation.mutate(formData);
      }
    }
  };

  return (
    <div className="py-8">
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
                { id: 'articles', name: 'Articles', icon: '📰' },
                { id: 'gallery', name: 'Gallery', icon: '🖼️' },
                { id: 'announcements', name: 'Announcements', icon: '📢' },
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Player Photo</label>
                  <input
                    type="file"
                    accept="image/*"
                    {...playerForm.register('photo')}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  <p className="text-xs text-gray-500 mt-1">Upload player photo (JPG, PNG, WebP)</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                  <textarea
                    {...playerForm.register('bio')}
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
                    placeholder="Player biography..."
                  />
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
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-[#1e3a8a]">Current Players ({players.length})</h2>
                {players.length > 0 && (
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to delete ALL players? This action cannot be undone.')) {
                        deleteAllPlayersMutation.mutate();
                      }
                    }}
                    disabled={deleteAllPlayersMutation.isPending}
                    className="bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    {deleteAllPlayersMutation.isPending ? 'Deleting...' : 'Delete All Players'}
                  </button>
                )}
              </div>
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
            {/* Add/Edit Article Form */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-[#1e3a8a]">
                  {editingArticle ? 'Edit Article' : 'Add New Article'}
                </h2>
                {editingArticle && (
                  <button
                    onClick={() => setEditingArticle(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    Cancel
                  </button>
                )}
              </div>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Featured Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    {...articleForm.register('featuredImage')}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  <p className="text-xs text-gray-500 mt-1">Upload article featured image (JPG, PNG, WebP)</p>
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
                  disabled={addArticleMutation.isPending || updateArticleMutation.isPending}
                  className="w-full bg-[#1e3a8a] text-white py-2 px-4 rounded-lg font-semibold hover:bg-[#1e40af] transition-colors disabled:opacity-50"
                >
                  {editingArticle 
                    ? (updateArticleMutation.isPending ? 'Updating...' : 'Update Article')
                    : (addArticleMutation.isPending ? 'Publishing...' : 'Publish Article')
                  }
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
                        {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : 'No date'}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setEditingArticle(article)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteArticleMutation.mutate(article.id)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Matches Tab */}
        {activeTab === 'matches' && (
          <div className="space-y-8">
            {/* Matches & Player Stats Header */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-[#1e3a8a] mb-4">Matches & Player Statistics</h2>
              <p className="text-gray-600">Manage match details and update player performance statistics</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Player Statistics Management */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-bold text-[#1e3a8a] mb-4">Player Statistics</h3>
                <div className="space-y-4">
                  {players.map((player) => (
                    <div key={player.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900">{player.name}</h4>
                          <p className="text-sm text-gray-600">#{player.jerseyNumber} • {player.role}</p>
                        </div>
                        <button
                          onClick={() => setEditingPlayer(editingPlayer === player.id ? null : player.id)}
                          className="bg-[#1e3a8a] text-white px-3 py-1 rounded text-sm hover:bg-[#1e40af] transition-colors"
                        >
                          {editingPlayer === player.id ? 'Cancel' : 'Edit Stats'}
                        </button>
                      </div>

                      {player.stats && (
                        <div className="grid grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
                          <div>
                            <span className="block font-medium">Batting</span>
                            <span>{player.stats.runsScored || 0} runs</span>
                          </div>
                          <div>
                            <span className="block font-medium">Bowling</span>
                            <span>{player.stats.wicketsTaken || 0} wickets</span>
                          </div>
                          <div>
                            <span className="block font-medium">Fielding</span>
                            <span>{player.stats.catches || 0} catches</span>
                          </div>
                        </div>
                      )}

                      {editingPlayer === player.id && (
                        <PlayerStatsForm 
                          playerId={player.id} 
                          stats={player.stats}
                          onClose={() => setEditingPlayer(null)}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Match Management */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-bold text-[#1e3a8a] mb-4">Match Management</h3>
                <div className="space-y-4">
                  {matches.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No matches scheduled</p>
                  ) : (
                    matches.map((match) => (
                      <div key={match.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-900">
                            {match.homeTeam.name} vs {match.awayTeam.name}
                          </h4>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            match.status === 'completed' ? 'bg-green-100 text-green-800' :
                            match.status === 'live' ? 'bg-red-100 text-red-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {match.status}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600">
                          <p>{match.venue.name}</p>
                          <p>{new Date(match.matchDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Gallery Tab */}
        {activeTab === 'gallery' && (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Add Gallery Item Form */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-[#1e3a8a] mb-4">Add New Gallery Item</h2>
              <form onSubmit={galleryForm.handleSubmit(onGallerySubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    {...galleryForm.register('title')}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
                    placeholder="Image Title"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    {...galleryForm.register('description')}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
                    placeholder="Brief description of the image"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    {...galleryForm.register('category')}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
                  >
                    <option value="match">Match</option>
                    <option value="training">Training</option>
                    <option value="celebration">Celebration</option>
                    <option value="team">Team</option>
                    <option value="ground">Ground</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                  <input
                    {...galleryForm.register('imageUrl')}
                    type="file"
                    accept="image/*"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
                  />
                  <p className="text-sm text-gray-500 mt-1">Upload an image file (JPG, PNG, etc.)</p>
                </div>

                <button
                  type="submit"
                  disabled={addGalleryItemMutation.isPending}
                  className="w-full bg-[#1e3a8a] text-white py-2 px-4 rounded-lg hover:bg-blue-800 transition-colors disabled:opacity-50"
                >
                  {addGalleryItemMutation.isPending ? 'Adding...' : 'Add Gallery Item'}
                </button>
              </form>
            </div>

            {/* Gallery Items List */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-[#1e3a8a] mb-4">Gallery Items ({galleryItems.length})</h2>
              <div className="max-h-96 overflow-y-auto space-y-4">
                {galleryItems.map((item) => (
                  <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start space-x-4">
                      {item.imageUrl && (
                        <img 
                          src={item.imageUrl} 
                          alt={item.title}
                          className="w-20 h-20 object-cover rounded-lg"
                          onError={(e) => {
                            e.currentTarget.src = 'https://via.placeholder.com/80x80?text=Image';
                          }}
                        />
                      )}
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">{item.title}</div>
                        <div className="text-sm text-gray-600 mt-1">{item.description}</div>
                        <div className="flex items-center space-x-2 mt-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {item.category}
                          </span>
                          {item.createdAt && (
                            <span className="text-xs text-gray-500">
                              {new Date(item.createdAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => deleteGalleryItemMutation.mutate(item.id)}
                        disabled={deleteGalleryItemMutation.isPending}
                        className="text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
                {galleryItems.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <div className="text-4xl mb-2">📷</div>
                    <p>No gallery items yet. Add your first image above!</p>
                  </div>
                )}
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

export default function Admin() {
  return (
    <AdminProtected>
      <AdminContent />
    </AdminProtected>
  );
}