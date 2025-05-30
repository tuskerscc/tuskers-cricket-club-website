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
  const [selectedPlayers, setSelectedPlayers] = useState<number[]>([]);
  const [playerPerformances, setPlayerPerformances] = useState<{[key: number]: {
    batting: { runs: number; balls: number; fours: number; sixes: number };
    bowling: { wickets: number; runs: number; overs: number };
    fielding: { catches: number; stumpings: number; runOuts: number };
  }}>({});
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

  const { data: stats } = useQuery<{
    matchesWon: number;
    totalMatches: number;
    totalRuns: number;
    wicketsTaken: number;
    nrr: number;
  }>({
    queryKey: ['/api/stats/team']
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
      type: 'general',
      priority: 'medium'
    }
  });

  // Team statistics form
  const statsForm = useForm({
    defaultValues: {
      matchesWon: 0,
      totalMatches: 0,
      totalRuns: 0,
      wicketsTaken: 0,
      totalOvers: 0,
      runsAgainst: 0,
      oversAgainst: 0
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

  // Match recording form
  const matchForm = useForm({
    defaultValues: {
      opponent: '',
      venue: '',
      date: '',
      result: 'Won'
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

  // Announcement mutations
  const addAnnouncementMutation = useMutation({
    mutationFn: (data: any) => apiRequest('POST', '/api/announcements', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/announcements'] });
      announcementForm.reset();
      toast({ title: "Success", description: "Announcement created successfully" });
    },
    onError: (error) => {
      console.error('Add announcement error:', error);
      toast({ title: "Error", description: "Failed to create announcement", variant: "destructive" });
    }
  });

  // Player statistics mutation
  const updatePlayerStatsMutation = useMutation({
    mutationFn: ({ playerId, data }: { playerId: number; data: any }) => 
      apiRequest('PUT', `/api/players/${playerId}/stats`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/players'] });
      setEditingPlayer(null);
      toast({ title: "Success", description: "Player statistics updated successfully" });
    },
    onError: (error) => {
      console.error('Update player stats error:', error);
      toast({ title: "Error", description: "Failed to update player statistics", variant: "destructive" });
    }
  });

  // Team statistics mutations
  const updateStatsMutation = useMutation({
    mutationFn: (data: any) => apiRequest('PUT', '/api/stats/team', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/stats/team'] });
      toast({ title: "Success", description: "Team statistics updated successfully" });
    },
    onError: (error) => {
      console.error('Update stats error:', error);
      toast({ title: "Error", description: "Failed to update team statistics", variant: "destructive" });
    }
  });

  // Match recording mutation
  const recordMatchMutation = useMutation({
    mutationFn: (data: any) => apiRequest('POST', '/api/record-match-performance', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/stats/team'] });
      queryClient.invalidateQueries({ queryKey: ['/api/players'] });
      matchForm.reset();
      setSelectedPlayers([]);
      setPlayerPerformances({});
      toast({ title: "Success", description: "Match recorded and player performances updated successfully" });
    },
    onError: (error) => {
      console.error('Record match error:', error);
      toast({ title: "Error", description: "Failed to record match performance", variant: "destructive" });
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

  const onMatchSubmit = (data: any) => {
    // Validate that playing 11 is selected
    if (selectedPlayers.length !== 11) {
      toast({
        title: "Error",
        description: "Please select exactly 11 players for the match",
        variant: "destructive",
      });
      return;
    }

    // Convert player performances to the format expected by the backend
    const playerPerformanceArray = selectedPlayers.map(playerId => ({
      playerId,
      runsScored: playerPerformances[playerId]?.batting?.runs || 0,
      ballsFaced: playerPerformances[playerId]?.batting?.balls || 0,
      fours: playerPerformances[playerId]?.batting?.fours || 0,
      sixes: playerPerformances[playerId]?.batting?.sixes || 0,
      wicketsTaken: playerPerformances[playerId]?.bowling?.wickets || 0,
      runsConceded: playerPerformances[playerId]?.bowling?.runs || 0,
      ballsBowled: Math.round((playerPerformances[playerId]?.bowling?.overs || 0) * 6),
      catches: playerPerformances[playerId]?.fielding?.catches || 0,
      stumpings: playerPerformances[playerId]?.fielding?.stumpings || 0,
      runOuts: playerPerformances[playerId]?.fielding?.runOuts || 0,
    }));

    const matchData = {
      ...data,
      selectedPlayers,
      playerPerformances: playerPerformanceArray
    };
    
    recordMatchMutation.mutate(matchData);
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

  const onAnnouncementSubmit = (data: any) => {
    addAnnouncementMutation.mutate(data);
  };

  const onStatsSubmit = (data: any) => {
    const statsData = {
      matchResult: data.matchResult, // 'won' or 'lost'
      totalRuns: parseInt(data.totalRuns),
      wicketsTaken: parseInt(data.wicketsTaken),
      totalOvers: parseFloat(data.totalOvers),
      runsAgainst: parseInt(data.runsAgainst),
      oversAgainst: parseFloat(data.oversAgainst)
    };
    updateStatsMutation.mutate(statsData);
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
                { id: 'matchperformance', name: 'Match Performance', icon: '⚾' },
                { id: 'articles', name: 'Articles', icon: '📰' },
                { id: 'gallery', name: 'Gallery', icon: '🖼️' },
                { id: 'announcements', name: 'Announcements', icon: '📢' },
                { id: 'statistics', name: 'Team Stats', icon: '📈' }
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

        {/* Match Performance Tab */}
        {activeTab === 'matchperformance' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-[#1e3a8a]">Match Performance Entry</h2>
                <p className="text-gray-600 mt-1">
                  Record match results and update team statistics
                </p>
              </div>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <p className="text-blue-800">
                <strong>Instructions:</strong> Enter match details manually, select your playing 11, 
                and record individual player performances. Performance fields are optional - 
                only fill in the statistics that are relevant for each player.
              </p>
            </div>

            {/* Match Details Form */}
            <form onSubmit={matchForm.handleSubmit(onMatchSubmit)} className="grid gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Opponent Team</label>
                  <input
                    {...matchForm.register('opponent')}
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
                    placeholder="Enter opponent team name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Venue</label>
                  <input
                    {...matchForm.register('venue')}
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
                    placeholder="Enter venue name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Match Date</label>
                  <input
                    {...matchForm.register('date')}
                    type="date"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Match Result</label>
                  <select 
                    {...matchForm.register('result')}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
                  >
                    <option value="Won">Won</option>
                    <option value="Lost">Lost</option>
                    <option value="Draw">Draw</option>
                  </select>
                </div>
              </div>

              {/* Playing 11 Selection */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-[#1e3a8a] mb-4">Select Playing 11</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
                  {players.map((player) => (
                    <label key={player.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-blue-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedPlayers.includes(player.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            if (selectedPlayers.length < 11) {
                              setSelectedPlayers([...selectedPlayers, player.id]);
                            }
                          } else {
                            setSelectedPlayers(selectedPlayers.filter(id => id !== player.id));
                          }
                        }}
                        disabled={!selectedPlayers.includes(player.id) && selectedPlayers.length >= 11}
                        className="h-4 w-4 text-[#1e3a8a] focus:ring-[#1e3a8a] border-gray-300 rounded"
                      />
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-[#1e3a8a] text-white rounded-full flex items-center justify-center text-xs font-bold">
                          {player.jerseyNumber || player.name.charAt(0)}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{player.name}</div>
                          <div className="text-xs text-gray-500">{player.role}</div>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
                <div className="text-sm text-gray-600 mb-4">
                  Selected: {selectedPlayers.length}/11 players
                </div>

                {/* Player Performance Entry */}
                {selectedPlayers.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="text-md font-semibold text-[#1e3a8a]">Player Performance Entry</h4>
                    {selectedPlayers.map((playerId) => {
                      const player = players.find(p => p.id === playerId);
                      if (!player) return null;

                      return (
                        <div key={playerId} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center space-x-3 mb-4">
                            <div className="w-10 h-10 bg-[#1e3a8a] text-white rounded-full flex items-center justify-center font-bold">
                              {player.jerseyNumber || player.name.charAt(0)}
                            </div>
                            <div>
                              <h5 className="font-semibold text-gray-900">{player.name}</h5>
                              <p className="text-sm text-gray-600">{player.role}</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Batting Stats */}
                            <div>
                              <h6 className="text-sm font-medium text-gray-700 mb-2">Batting</h6>
                              <div className="space-y-2">
                                <input
                                  type="number"
                                  min="0"
                                  placeholder="Runs"
                                  value={playerPerformances[playerId]?.batting?.runs || ''}
                                  onChange={(e) => {
                                    const value = parseInt(e.target.value) || 0;
                                    setPlayerPerformances(prev => ({
                                      ...prev,
                                      [playerId]: {
                                        ...prev[playerId],
                                        batting: { ...prev[playerId]?.batting, runs: value }
                                      }
                                    }));
                                  }}
                                  className="w-full text-sm border border-gray-300 rounded px-2 py-1"
                                />
                                <input
                                  type="number"
                                  min="0"
                                  placeholder="Balls Faced"
                                  value={playerPerformances[playerId]?.batting?.balls || ''}
                                  onChange={(e) => {
                                    const value = parseInt(e.target.value) || 0;
                                    setPlayerPerformances(prev => ({
                                      ...prev,
                                      [playerId]: {
                                        ...prev[playerId],
                                        batting: { ...prev[playerId]?.batting, balls: value }
                                      }
                                    }));
                                  }}
                                  className="w-full text-sm border border-gray-300 rounded px-2 py-1"
                                />
                                <div className="grid grid-cols-2 gap-1">
                                  <input
                                    type="number"
                                    min="0"
                                    placeholder="4s"
                                    value={playerPerformances[playerId]?.batting?.fours || ''}
                                    onChange={(e) => {
                                      const value = parseInt(e.target.value) || 0;
                                      setPlayerPerformances(prev => ({
                                        ...prev,
                                        [playerId]: {
                                          ...prev[playerId],
                                          batting: { ...prev[playerId]?.batting, fours: value }
                                        }
                                      }));
                                    }}
                                    className="w-full text-sm border border-gray-300 rounded px-2 py-1"
                                  />
                                  <input
                                    type="number"
                                    min="0"
                                    placeholder="6s"
                                    value={playerPerformances[playerId]?.batting?.sixes || ''}
                                    onChange={(e) => {
                                      const value = parseInt(e.target.value) || 0;
                                      setPlayerPerformances(prev => ({
                                        ...prev,
                                        [playerId]: {
                                          ...prev[playerId],
                                          batting: { ...prev[playerId]?.batting, sixes: value }
                                        }
                                      }));
                                    }}
                                    className="w-full text-sm border border-gray-300 rounded px-2 py-1"
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Bowling Stats */}
                            <div>
                              <h6 className="text-sm font-medium text-gray-700 mb-2">Bowling</h6>
                              <div className="space-y-2">
                                <input
                                  type="number"
                                  min="0"
                                  placeholder="Wickets"
                                  value={playerPerformances[playerId]?.bowling?.wickets || ''}
                                  onChange={(e) => {
                                    const value = parseInt(e.target.value) || 0;
                                    setPlayerPerformances(prev => ({
                                      ...prev,
                                      [playerId]: {
                                        ...prev[playerId],
                                        bowling: { ...prev[playerId]?.bowling, wickets: value }
                                      }
                                    }));
                                  }}
                                  className="w-full text-sm border border-gray-300 rounded px-2 py-1"
                                />
                                <input
                                  type="number"
                                  min="0"
                                  placeholder="Runs Conceded"
                                  value={playerPerformances[playerId]?.bowling?.runs || ''}
                                  onChange={(e) => {
                                    const value = parseInt(e.target.value) || 0;
                                    setPlayerPerformances(prev => ({
                                      ...prev,
                                      [playerId]: {
                                        ...prev[playerId],
                                        bowling: { ...prev[playerId]?.bowling, runs: value }
                                      }
                                    }));
                                  }}
                                  className="w-full text-sm border border-gray-300 rounded px-2 py-1"
                                />
                                <input
                                  type="number"
                                  step="0.1"
                                  min="0"
                                  placeholder="Overs Bowled"
                                  value={playerPerformances[playerId]?.bowling?.overs || ''}
                                  onChange={(e) => {
                                    const value = parseFloat(e.target.value) || 0;
                                    setPlayerPerformances(prev => ({
                                      ...prev,
                                      [playerId]: {
                                        ...prev[playerId],
                                        bowling: { ...prev[playerId]?.bowling, overs: value }
                                      }
                                    }));
                                  }}
                                  className="w-full text-sm border border-gray-300 rounded px-2 py-1"
                                />
                              </div>
                            </div>

                            {/* Fielding Stats */}
                            <div>
                              <h6 className="text-sm font-medium text-gray-700 mb-2">Fielding</h6>
                              <div className="space-y-2">
                                <input
                                  type="number"
                                  min="0"
                                  placeholder="Catches"
                                  value={playerPerformances[playerId]?.fielding?.catches || ''}
                                  onChange={(e) => {
                                    const value = parseInt(e.target.value) || 0;
                                    setPlayerPerformances(prev => ({
                                      ...prev,
                                      [playerId]: {
                                        ...prev[playerId],
                                        fielding: { ...prev[playerId]?.fielding, catches: value }
                                      }
                                    }));
                                  }}
                                  className="w-full text-sm border border-gray-300 rounded px-2 py-1"
                                />
                                <input
                                  type="number"
                                  min="0"
                                  placeholder="Stumpings"
                                  value={playerPerformances[playerId]?.fielding?.stumpings || ''}
                                  onChange={(e) => {
                                    const value = parseInt(e.target.value) || 0;
                                    setPlayerPerformances(prev => ({
                                      ...prev,
                                      [playerId]: {
                                        ...prev[playerId],
                                        fielding: { ...prev[playerId]?.fielding, stumpings: value }
                                      }
                                    }));
                                  }}
                                  className="w-full text-sm border border-gray-300 rounded px-2 py-1"
                                />
                                <input
                                  type="number"
                                  min="0"
                                  placeholder="Run Outs"
                                  value={playerPerformances[playerId]?.fielding?.runOuts || ''}
                                  onChange={(e) => {
                                    const value = parseInt(e.target.value) || 0;
                                    setPlayerPerformances(prev => ({
                                      ...prev,
                                      [playerId]: {
                                        ...prev[playerId],
                                        fielding: { ...prev[playerId]?.fielding, runOuts: value }
                                      }
                                    }));
                                  }}
                                  className="w-full text-sm border border-gray-300 rounded px-2 py-1"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={recordMatchMutation.isPending}
                className="w-full bg-[#1e3a8a] text-white py-3 px-4 rounded-lg font-semibold hover:bg-[#1e40af] transition-colors disabled:opacity-50"
              >
                {recordMatchMutation.isPending ? 'Recording Match...' : 'Record Match & Update Player Performance'}
              </button>
            </form>
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

        {/* Player Statistics Tab */}
        {activeTab === 'playerstats' && (
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-[#1e3a8a] mb-6">Player Statistics Management</h2>
              
              {/* Players Statistics Grid */}
              <div className="grid gap-6">
                {players.map((player) => (
                  <div key={player.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-[#1e3a8a] text-white rounded-full flex items-center justify-center font-bold">
                          {player.jerseyNumber || player.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{player.name}</h3>
                          <p className="text-sm text-gray-600">{player.role}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setEditingPlayer(editingPlayer === player.id ? null : player.id)}
                        className="bg-[#1e3a8a] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#1e40af] transition-colors"
                      >
                        {editingPlayer === player.id ? 'Cancel' : 'Edit Stats'}
                      </button>
                    </div>

                    {/* Current Statistics Display */}
                    {player.stats ? (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="bg-blue-50 rounded-lg p-3 text-center">
                          <div className="text-lg font-bold text-blue-600">{player.stats.runsScored || 0}</div>
                          <div className="text-xs text-gray-600">Runs Scored</div>
                        </div>
                        <div className="bg-green-50 rounded-lg p-3 text-center">
                          <div className="text-lg font-bold text-green-600">{player.stats.wicketsTaken || 0}</div>
                          <div className="text-xs text-gray-600">Wickets</div>
                        </div>
                        <div className="bg-yellow-50 rounded-lg p-3 text-center">
                          <div className="text-lg font-bold text-yellow-600">{player.stats.catches || 0}</div>
                          <div className="text-xs text-gray-600">Catches</div>
                        </div>
                        <div className="bg-purple-50 rounded-lg p-3 text-center">
                          <div className="text-lg font-bold text-purple-600">{player.stats.matches || 0}</div>
                          <div className="text-xs text-gray-600">Matches</div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-gray-50 rounded-lg p-4 text-center text-gray-500 mb-4">
                        No statistics recorded yet
                      </div>
                    )}

                    {/* Edit Statistics Form */}
                    {editingPlayer === player.id && (
                      <form onSubmit={(e) => {
                        e.preventDefault();
                        const formData = new FormData(e.target as HTMLFormElement);
                        const data = {
                          playerId: player.id,
                          matches: parseInt(formData.get('matches') as string) || 0,
                          runsScored: parseInt(formData.get('runsScored') as string) || 0,
                          ballsFaced: parseInt(formData.get('ballsFaced') as string) || 0,
                          fours: parseInt(formData.get('fours') as string) || 0,
                          sixes: parseInt(formData.get('sixes') as string) || 0,
                          wicketsTaken: parseInt(formData.get('wicketsTaken') as string) || 0,
                          ballsBowled: parseInt(formData.get('ballsBowled') as string) || 0,
                          runsConceded: parseInt(formData.get('runsConceded') as string) || 0,
                          catches: parseInt(formData.get('catches') as string) || 0,
                          stumpings: parseInt(formData.get('stumpings') as string) || 0,
                          runOuts: parseInt(formData.get('runOuts') as string) || 0
                        };
                        updatePlayerStatsMutation.mutate({ playerId: player.id, data });
                      }} className="border-t pt-4 mt-4">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Matches</label>
                            <input
                              name="matches"
                              type="number"
                              defaultValue={player.stats?.matches || ''}
                              className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                              placeholder="0"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Runs Scored</label>
                            <input
                              name="runsScored"
                              type="number"
                              defaultValue={player.stats?.runsScored || ''}
                              className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                              placeholder="0"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Balls Faced</label>
                            <input
                              name="ballsFaced"
                              type="number"
                              defaultValue={player.stats?.ballsFaced || ''}
                              className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                              placeholder="0"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Fours</label>
                            <input
                              name="fours"
                              type="number"
                              defaultValue={player.stats?.fours || ''}
                              className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                              placeholder="0"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Sixes</label>
                            <input
                              name="sixes"
                              type="number"
                              defaultValue={player.stats?.sixes || ''}
                              className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                              placeholder="0"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Wickets Taken</label>
                            <input
                              name="wicketsTaken"
                              type="number"
                              defaultValue={player.stats?.wicketsTaken || ''}
                              className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                              placeholder="0"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Balls Bowled</label>
                            <input
                              name="ballsBowled"
                              type="number"
                              defaultValue={player.stats?.ballsBowled || ''}
                              className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                              placeholder="0"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Runs Conceded</label>
                            <input
                              name="runsConceded"
                              type="number"
                              defaultValue={player.stats?.runsConceded || ''}
                              className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                              placeholder="0"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Catches</label>
                            <input
                              name="catches"
                              type="number"
                              defaultValue={player.stats?.catches || ''}
                              className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                              placeholder="0"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Stumpings</label>
                            <input
                              name="stumpings"
                              type="number"
                              defaultValue={player.stats?.stumpings || ''}
                              className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                              placeholder="0"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Run Outs</label>
                            <input
                              name="runOuts"
                              type="number"
                              defaultValue={player.stats?.runOuts || ''}
                              className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                              placeholder="0"
                            />
                          </div>
                        </div>
                        <div className="flex space-x-2 mt-4">
                          <button
                            type="submit"
                            disabled={updatePlayerStatsMutation.isPending}
                            className="bg-[#1e3a8a] text-white px-4 py-2 rounded text-sm hover:bg-[#1e40af] transition-colors disabled:opacity-50"
                          >
                            {updatePlayerStatsMutation.isPending ? 'Saving...' : 'Save Statistics'}
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingPlayer(null)}
                            className="bg-gray-500 text-white px-4 py-2 rounded text-sm hover:bg-gray-600 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                ))}
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

        {/* Announcements Tab */}
        {activeTab === 'announcements' && (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Create Announcement Form */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-[#1e3a8a] mb-4">Create New Announcement</h2>
              <form onSubmit={announcementForm.handleSubmit(onAnnouncementSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    {...announcementForm.register('title', { required: 'Title is required' })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
                    placeholder="Enter announcement title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                  <textarea
                    {...announcementForm.register('content', { required: 'Content is required' })}
                    rows={4}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
                    placeholder="Enter announcement content"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <select
                      {...announcementForm.register('type')}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
                    >
                      <option value="general">General</option>
                      <option value="match">Match</option>
                      <option value="achievement">Achievement</option>
                      <option value="training">Training</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                    <select
                      {...announcementForm.register('priority')}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={addAnnouncementMutation.isPending}
                  className="w-full bg-[#1e3a8a] text-white py-2 px-4 rounded-lg font-semibold hover:bg-[#1e40af] transition-colors disabled:opacity-50"
                >
                  {addAnnouncementMutation.isPending ? 'Creating...' : 'Create Announcement'}
                </button>
              </form>
            </div>

            {/* Announcements List */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-[#1e3a8a] mb-4">Recent Announcements ({announcements.length})</h2>
              <div className="max-h-96 overflow-y-auto space-y-3">
                {announcements.map((announcement) => (
                  <div key={announcement.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">{announcement.title}</h4>
                      <div className="flex gap-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          announcement.priority === 'high' ? 'bg-red-100 text-red-800' :
                          announcement.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {announcement.priority}
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {announcement.type}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">{announcement.content}</p>
                    <p className="text-xs text-gray-500">
                      Posted {announcement.createdAt ? new Date(announcement.createdAt).toLocaleDateString() : 'recently'}
                    </p>
                  </div>
                ))}
                {announcements.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <div className="text-4xl mb-2">📢</div>
                    <p>No announcements yet. Create your first announcement!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Team Statistics Tab */}
        {activeTab === 'statistics' && (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Update Statistics Form */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-[#1e3a8a] mb-4">Update Team Statistics</h2>
              <form onSubmit={statsForm.handleSubmit(onStatsSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Match Result</label>
                    <select
                      {...statsForm.register('matchResult', { required: true })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
                    >
                      <option value="">Select Result</option>
                      <option value="won">Won</option>
                      <option value="lost">Lost</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Total Matches</label>
                    <input
                      type="number"
                      {...statsForm.register('totalMatches', { required: true, min: 0 })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
                      placeholder="20"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Total Runs Scored</label>
                    <input
                      type="number"
                      {...statsForm.register('totalRuns', { required: true, min: 0 })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
                      placeholder="2850"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Wickets Taken</label>
                    <input
                      type="number"
                      {...statsForm.register('wicketsTaken', { required: true, min: 0 })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
                      placeholder="125"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Total Overs Faced</label>
                    <input
                      type="number"
                      step="0.1"
                      {...statsForm.register('totalOvers', { required: true, min: 0 })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
                      placeholder="320.0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Runs Conceded</label>
                    <input
                      type="number"
                      {...statsForm.register('runsAgainst', { required: true, min: 0 })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
                      placeholder="2650"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Overs Bowled</label>
                  <input
                    type="number"
                    step="0.1"
                    {...statsForm.register('oversAgainst', { required: true, min: 0 })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
                    placeholder="300.0"
                  />
                </div>

                <button
                  type="submit"
                  disabled={updateStatsMutation.isPending}
                  className="w-full bg-[#1e3a8a] text-white py-2 px-4 rounded-lg font-semibold hover:bg-[#1e40af] transition-colors disabled:opacity-50"
                >
                  {updateStatsMutation.isPending ? 'Updating...' : 'Update Statistics'}
                </button>
              </form>
            </div>

            {/* Current Statistics Display */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-[#1e3a8a] mb-4">Current Team Statistics</h2>
              {stats && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-[#1e3a8a] mb-1">{stats.matchesWon}</div>
                    <div className="text-sm text-gray-600">Matches Won</div>
                  </div>
                  
                  <div className="bg-orange-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-orange-600 mb-1">
                      {stats.totalMatches ? Math.round((stats.matchesWon / stats.totalMatches) * 100) : 0}%
                    </div>
                    <div className="text-sm text-gray-600">Win %</div>
                  </div>
                  
                  <div className="bg-yellow-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-yellow-600 mb-1">{stats.totalRuns}</div>
                    <div className="text-sm text-gray-600">Total Runs</div>
                  </div>
                  
                  <div className="bg-green-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-600 mb-1">{stats.wicketsTaken}</div>
                    <div className="text-sm text-gray-600">Wickets Taken</div>
                  </div>
                  
                  <div className="bg-purple-50 rounded-lg p-4 text-center col-span-2">
                    <div className="text-2xl font-bold text-purple-600 mb-1">
                      {stats.nrr >= 0 ? '+' : ''}{stats.nrr?.toFixed(3) || '0.000'}
                    </div>
                    <div className="text-sm text-gray-600">Net Run Rate (NRR)</div>
                  </div>
                </div>
              )}
              
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">NRR Calculation Formula:</h3>
                <p className="text-sm text-gray-600">
                  NRR = (Total runs scored ÷ Total overs faced) - (Total runs conceded ÷ Total overs bowled)
                </p>
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