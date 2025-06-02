import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit2, Save, X, Users, FileText, Image, Trophy, MessageSquare, Activity, BarChart3, Plus, CheckCircle, XCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";

interface Player {
  id: number;
  name: string;
  jerseyNumber: number | null;
  role: string;
  battingStyle: string | null;
  bowlingStyle: string | null;
  photo: string | null;
  bio: string | null;
  isCaptain: boolean | null;
  isViceCaptain: boolean | null;
  isActive: boolean | null;
}

interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  featuredImage: string | null;
  content: string;
  tags: string | null;
  isFeatured: boolean | null;
}

interface GalleryItem {
  id: number;
  title: string;
  description: string | null;
  category: string;
  imageUrl: string;
  tags: string | null;
}

interface Announcement {
  id: number;
  title: string;
  content: string;
  type: string;
  priority: string;
  tags: string | null;
}

interface MatchPerformance {
  id: number;
  opponentTeam: string;
  venue: string;
  matchDate: Date;
  result: string;
  playerStats: PlayerStats[];
}

interface PlayerStats {
  playerId: number;
  runsScored: number | null;
  ballsFaced: number | null;
  oversBowled: string | null;
  wicketsTaken: number | null;
  runsConceded: number | null;
  maidens: number | null;
  noBalls: number | null;
  wides: number | null;
  catches: number | null;
}

function ComprehensiveAdminContent() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingItem, setEditingItem] = useState<any>(null);
  const [selectedPlayers, setSelectedPlayers] = useState<number[]>([]);
  const [playerSearchQuery, setPlayerSearchQuery] = useState('');
  const [playerStatusFilter, setPlayerStatusFilter] = useState<'all' | 'active' | 'retired'>('all');

  // Form instances
  const playerForm = useForm();
  const articleForm = useForm({
    defaultValues: {
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      featuredImage: '',
      author: 'Admin',
      category: 'News',
      isFeatured: false,
      isPublished: true
    }
  });
  const galleryForm = useForm();
  const announcementForm = useForm();
  const matchForm = useForm();
  const pollForm = useForm();

  // Poll state
  const [newPollOptions, setNewPollOptions] = useState(['', '', '', '']);

  // Queries
  const { data: userRole = 'admin' } = useQuery<string>({ 
    queryKey: ['/api/admin/role'],
    retry: false,
    select: (data: any) => data?.role || 'admin'
  });
  const { data: players = [] } = useQuery<Player[]>({ queryKey: ['/api/players'] });
  
  // Filter players based on search and status
  const filteredPlayers = players.filter(player => {
    const matchesSearch = player.name.toLowerCase().includes(playerSearchQuery.toLowerCase());
    const isPlayerActive = (player as any).isActive !== false;
    const matchesStatus = playerStatusFilter === 'all' || 
      (playerStatusFilter === 'active' && isPlayerActive) ||
      (playerStatusFilter === 'retired' && !isPlayerActive);
    return matchesSearch && matchesStatus;
  });
  const { data: articles = [] } = useQuery<Article[]>({ queryKey: ['/api/articles'] });
  const { data: gallery = [] } = useQuery<GalleryItem[]>({ queryKey: ['/api/gallery'] });
  const { data: announcements = [] } = useQuery<Announcement[]>({ queryKey: ['/api/announcements'] });
  const { data: teamStats = {} } = useQuery<any>({ queryKey: ['/api/stats/team'] });
  const { data: polls = [] } = useQuery<any[]>({ queryKey: ['/api/polls'] });
  const { data: currentPoll = null } = useQuery<any>({ queryKey: ['/api/polls/current'] });

  // Check if role already exists - now allowing unlimited players of all roles
  const checkRoleAvailability = (role: string) => {
    // All roles are now unlimited
    return true;
  };

  // Mutations
  const createPlayerMutation = useMutation({
    mutationFn: (data: any) => {
      if (!checkRoleAvailability(data.role)) {
        throw new Error(`Cannot add more ${data.role}s. Maximum limit reached.`);
      }
      return apiRequest('POST', '/api/players', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/players'] });
      playerForm.reset();
      toast({ title: "Success", description: "Player added successfully" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Error", 
        description: error.message || "Failed to add player", 
        variant: "destructive" 
      });
    }
  });

  const updatePlayerMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => 
      apiRequest('PUT', `/api/players/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/players'] });
      setEditingItem(null);
      toast({ title: "Success", description: "Player updated successfully" });
    }
  });

  const deletePlayerMutation = useMutation({
    mutationFn: (id: number) => apiRequest('DELETE', `/api/players/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/players'] });
      toast({ title: "Success", description: "Player deleted successfully" });
    }
  });

  // Poll mutations
  const createPollMutation = useMutation({
    mutationFn: (data: any) => apiRequest('POST', '/api/polls', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/polls'] });
      queryClient.invalidateQueries({ queryKey: ['/api/polls/current'] });
      pollForm.reset();
      setNewPollOptions(['', '', '', '']);
      toast({ title: "Success", description: "Poll created successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create poll", variant: "destructive" });
    }
  });

  const updatePollVisibilityMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) => 
      apiRequest('PUT', `/api/polls/${id}/visibility`, { isActive }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/polls'] });
      queryClient.invalidateQueries({ queryKey: ['/api/polls/current'] });
      toast({ title: "Success", description: "Poll visibility updated" });
    }
  });

  const deletePollMutation = useMutation({
    mutationFn: (id: number) => apiRequest('DELETE', `/api/polls/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/polls'] });
      queryClient.invalidateQueries({ queryKey: ['/api/polls/current'] });
      toast({ title: "Success", description: "Poll deleted successfully" });
    }
  });

  const createArticleMutation = useMutation({
    mutationFn: (data: any) => apiRequest('POST', '/api/articles', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/articles'] });
      articleForm.reset({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        featuredImage: '',
        author: 'Admin',
        category: 'News',
        isFeatured: false,
        isPublished: true
      });
      toast({ title: "Success", description: "Article created successfully" });
    },
    onError: (error: any) => {
      console.error('Article creation error:', error);
      toast({ title: "Error", description: error.message || "Failed to create article", variant: "destructive" });
    }
  });

  const updateArticleMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => 
      apiRequest('PUT', `/api/articles/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/articles'] });
      setEditingItem(null);
      toast({ title: "Success", description: "Article updated successfully" });
    }
  });

  const deleteArticleMutation = useMutation({
    mutationFn: (id: number) => apiRequest('DELETE', `/api/articles/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/articles'] });
      toast({ title: "Success", description: "Article deleted successfully" });
    }
  });

  const createGalleryMutation = useMutation({
    mutationFn: (data: any) => apiRequest('POST', '/api/gallery', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/gallery'] });
      galleryForm.reset();
      toast({ title: "Success", description: "Gallery item added successfully" });
    }
  });

  const updateGalleryMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => 
      apiRequest('PUT', `/api/gallery/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/gallery'] });
      setEditingItem(null);
      toast({ title: "Success", description: "Gallery item updated successfully" });
    }
  });

  const deleteGalleryMutation = useMutation({
    mutationFn: (id: number) => apiRequest('DELETE', `/api/gallery/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/gallery'] });
      toast({ title: "Success", description: "Gallery item deleted successfully" });
    }
  });

  const createAnnouncementMutation = useMutation({
    mutationFn: (data: any) => apiRequest('POST', '/api/announcements', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/announcements'] });
      announcementForm.reset();
      toast({ title: "Success", description: "Announcement created successfully" });
    }
  });

  const updateAnnouncementMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => 
      apiRequest('PUT', `/api/announcements/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/announcements'] });
      setEditingItem(null);
      toast({ title: "Success", description: "Announcement updated successfully" });
    }
  });

  const deleteAnnouncementMutation = useMutation({
    mutationFn: (id: number) => apiRequest('DELETE', `/api/announcements/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/announcements'] });
      toast({ title: "Success", description: "Announcement deleted successfully" });
    }
  });

  const createMatchPerformanceMutation = useMutation({
    mutationFn: (data: any) => apiRequest('POST', '/api/match-performances', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/match-performances'] });
      queryClient.invalidateQueries({ queryKey: ['/api/stats/team'] });
      matchForm.reset();
      setSelectedPlayers([]);
      toast({ title: "Success", description: "Match performance recorded successfully" });
    }
  });

  const handleFileUpload = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });
  };

  const handlePlayerToggle = (playerId: number) => {
    setSelectedPlayers(prev => 
      prev.includes(playerId)
        ? prev.filter(id => id !== playerId)
        : prev.length < 11 ? [...prev, playerId] : prev
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1e3a8a] to-[#3b82f6] p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">TUSKERS CRICKET CLUB</h1>
          <p className="text-xl text-blue-100">Comprehensive Admin Panel</p>
        </div>

        <Tabs defaultValue={userRole === 'content_writer' ? 'articles' : 'players'} className="w-full">
          <TabsList className={`grid w-full mb-6 ${userRole === 'content_writer' ? 'grid-cols-4' : 'grid-cols-7'}`}>
            {userRole === 'admin' && (
              <>
                <TabsTrigger value="players" className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Players
                </TabsTrigger>
                <TabsTrigger value="matches" className="flex items-center gap-2">
                  <Trophy className="w-4 h-4" />
                  Match Performance
                </TabsTrigger>
                <TabsTrigger value="stats" className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Team Stats
                </TabsTrigger>
              </>
            )}
            <TabsTrigger value="articles" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Articles
            </TabsTrigger>
            <TabsTrigger value="gallery" className="flex items-center gap-2">
              <Image className="w-4 h-4" />
              Gallery
            </TabsTrigger>
            <TabsTrigger value="announcements" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Announcements
            </TabsTrigger>
            <TabsTrigger value="polls" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Polls
            </TabsTrigger>
          </TabsList>

          {/* Players Tab - Admin Only */}
          {userRole === 'admin' && (
            <TabsContent value="players" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-[#1e3a8a]">Add New Player</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={playerForm.handleSubmit((data) => createPlayerMutation.mutate(data))} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Player Name *</Label>
                      <Input {...playerForm.register("name", { required: true })} placeholder="Enter player name" />
                    </div>
                    <div>
                      <Label htmlFor="jerseyNumber">Jersey Number</Label>
                      <Input {...playerForm.register("jerseyNumber", { valueAsNumber: true })} type="number" min="1" max="99" />
                    </div>
                    <div>
                      <Label htmlFor="role">Role *</Label>
                      <Select onValueChange={(value) => playerForm.setValue("role", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Batsman">Batsman</SelectItem>
                          <SelectItem value="Bowler">Bowler</SelectItem>
                          <SelectItem value="All Rounder">All Rounder</SelectItem>
                          <SelectItem value="Wicket Keeper Batsman">Wicket Keeper Batsman</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="battingStyle">Batting Style *</Label>
                      <Select onValueChange={(value) => playerForm.setValue("battingStyle", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select batting style" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Right Handed">Right Handed</SelectItem>
                          <SelectItem value="Left Handed">Left Handed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {(playerForm.watch("role") === "Bowler" || playerForm.watch("role") === "All Rounder" || playerForm.watch("role") === "Batsman" || playerForm.watch("role") === "Wicket Keeper Batsman") && (
                      <div>
                        <Label htmlFor="bowlingStyle">
                          Bowling Style {(playerForm.watch("role") === "Bowler" || playerForm.watch("role") === "All Rounder") && "*"}
                          {(playerForm.watch("role") === "Batsman" || playerForm.watch("role") === "Wicket Keeper Batsman") && " (Optional)"}
                        </Label>
                        <Select onValueChange={(value) => playerForm.setValue("bowlingStyle", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select bowling style" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Fast Bowling">Fast Bowling</SelectItem>
                            <SelectItem value="Fast-Medium Bowling">Fast-Medium Bowling</SelectItem>
                            <SelectItem value="Medium-Fast Bowling">Medium-Fast Bowling</SelectItem>
                            <SelectItem value="Medium Pace Bowling">Medium Pace Bowling</SelectItem>
                            <SelectItem value="Off-Spin">Off-Spin (Right-arm finger spin)</SelectItem>
                            <SelectItem value="Leg-Spin">Leg-Spin (Right-arm wrist spin)</SelectItem>
                            <SelectItem value="Left-Arm Orthodox Spin">Left-Arm Orthodox Spin</SelectItem>
                            <SelectItem value="Left-Arm Unorthodox">Left-Arm Unorthodox / Chinaman</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    <div>
                      <Label htmlFor="photo">Photo</Label>
                      <Input 
                        type="file" 
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const photoData = await handleFileUpload(file);
                            playerForm.setValue("photo", photoData);
                          }
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="bio">Biography (Optional)</Label>
                    <Textarea {...playerForm.register("bio")} placeholder="Player biography..." rows={3} />
                  </div>
                  <div className="flex gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        checked={playerForm.watch("isCaptain") || false}
                        onCheckedChange={(checked) => playerForm.setValue("isCaptain", !!checked)}
                      />
                      <Label>Captain</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        checked={playerForm.watch("isViceCaptain") || false}
                        onCheckedChange={(checked) => playerForm.setValue("isViceCaptain", !!checked)}
                      />
                      <Label>Vice Captain</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        checked={playerForm.watch("isActive") !== false}
                        onCheckedChange={(checked) => playerForm.setValue("isActive", !!checked)}
                      />
                      <Label>Active Player</Label>
                    </div>
                  </div>
                  <Button type="submit" disabled={createPlayerMutation.isPending}>
                    {createPlayerMutation.isPending ? "Adding..." : "Add Player"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-[#1e3a8a]">Players List ({filteredPlayers.length})</CardTitle>
                <div className="flex gap-4 mt-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Search players by name..."
                      value={playerSearchQuery}
                      onChange={(e) => setPlayerSearchQuery(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <div className="w-40">
                    <Select value={playerStatusFilter} onValueChange={(value: 'all' | 'active' | 'retired') => setPlayerStatusFilter(value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Filter status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Players</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="retired">Retired</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredPlayers.map((player) => (
                    <Card key={player.id} className="border">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{player.name}</CardTitle>
                            <p className="text-sm text-gray-600">#{player.jerseyNumber} • {player.role}</p>
                          </div>
                          <div className="flex gap-1">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm" onClick={() => setEditingItem(player)}>
                                  <Edit2 className="w-4 h-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Edit Player</DialogTitle>
                                </DialogHeader>
                                {editingItem && (
                                  <div className="space-y-4">
                                    <div>
                                      <Label>Player Name</Label>
                                      <Input 
                                        value={editingItem.name} 
                                        placeholder="Player name"
                                        onChange={(e) => setEditingItem({...editingItem, name: e.target.value})}
                                      />
                                    </div>
                                    <div>
                                      <Label>Jersey Number</Label>
                                      <Input 
                                        type="number"
                                        value={editingItem.jerseyNumber || ''}
                                        placeholder="Jersey number"
                                        onChange={(e) => setEditingItem({...editingItem, jerseyNumber: parseInt(e.target.value)})}
                                      />
                                    </div>
                                    <div>
                                      <Label>Role</Label>
                                      <Select onValueChange={(value) => setEditingItem({...editingItem, role: value})}>
                                        <SelectTrigger>
                                          <SelectValue placeholder={editingItem.role || "Select role"} />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="Batsman">Batsman</SelectItem>
                                          <SelectItem value="Bowler">Bowler</SelectItem>
                                          <SelectItem value="All Rounder">All Rounder</SelectItem>
                                          <SelectItem value="Wicket Keeper Batsman">Wicket Keeper Batsman</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div>
                                      <Label>Batting Style</Label>
                                      <Select onValueChange={(value) => setEditingItem({...editingItem, battingStyle: value})}>
                                        <SelectTrigger>
                                          <SelectValue placeholder={editingItem.battingStyle || "Select style"} />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="Right Handed">Right Handed</SelectItem>
                                          <SelectItem value="Left Handed">Left Handed</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div>
                                      <Label>Bowling Style {(editingItem.role === "Bowler" || editingItem.role === "All Rounder") && "*"}
                                        {(editingItem.role === "Batsman" || editingItem.role === "Wicket Keeper Batsman") && " (Optional)"}
                                      </Label>
                                      <Select onValueChange={(value) => setEditingItem({...editingItem, bowlingStyle: value})}>
                                        <SelectTrigger>
                                          <SelectValue placeholder={editingItem.bowlingStyle || "Select bowling style"} />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="Fast Bowling">Fast Bowling</SelectItem>
                                          <SelectItem value="Fast-Medium Bowling">Fast-Medium Bowling</SelectItem>
                                          <SelectItem value="Medium-Fast Bowling">Medium-Fast Bowling</SelectItem>
                                          <SelectItem value="Medium Pace Bowling">Medium Pace Bowling</SelectItem>
                                          <SelectItem value="Slow-Medium Bowling">Slow-Medium Bowling</SelectItem>
                                          <SelectItem value="Spin Bowling">Spin Bowling</SelectItem>
                                          <SelectItem value="Off Spin">Off Spin</SelectItem>
                                          <SelectItem value="Leg Spin">Leg Spin</SelectItem>
                                          <SelectItem value="Left Arm Orthodox">Left Arm Orthodox</SelectItem>
                                          <SelectItem value="Left Arm Chinaman">Left Arm Chinaman</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div>
                                      <Label>Player Photo</Label>
                                      <Input 
                                        type="file" 
                                        accept="image/*"
                                        onChange={async (e) => {
                                          const file = e.target.files?.[0];
                                          if (file) {
                                            const photoData = await handleFileUpload(file);
                                            setEditingItem({...editingItem, photo: photoData});
                                          }
                                        }}
                                      />
                                      {editingItem.photo && (
                                        <img src={editingItem.photo} alt="Player" className="mt-2 w-20 h-20 object-cover rounded" />
                                      )}
                                    </div>
                                    <div>
                                      <Label>Biography (Optional)</Label>
                                      <Textarea 
                                        value={editingItem.bio || ''}
                                        placeholder="Player biography..." 
                                        rows={3}
                                        onChange={(e) => setEditingItem({...editingItem, bio: e.target.value})}
                                      />
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <Checkbox 
                                        checked={editingItem.isCaptain || false}
                                        onCheckedChange={(checked) => setEditingItem({...editingItem, isCaptain: checked as boolean})}
                                      />
                                      <Label>Captain</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <Checkbox 
                                        checked={editingItem.isViceCaptain || false}
                                        onCheckedChange={(checked) => setEditingItem({...editingItem, isViceCaptain: checked as boolean})}
                                      />
                                      <Label>Vice Captain</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <Checkbox 
                                        checked={editingItem.isActive !== false}
                                        onCheckedChange={(checked) => setEditingItem({...editingItem, isActive: checked as boolean})}
                                      />
                                      <Label>Active Player</Label>
                                    </div>
                                    <Button 
                                      onClick={() => {
                                        updatePlayerMutation.mutate({
                                          id: editingItem.id,
                                          data: editingItem
                                        });
                                      }}
                                      disabled={updatePlayerMutation.isPending}
                                    >
                                      {updatePlayerMutation.isPending ? "Updating..." : "Update Player"}
                                    </Button>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => deletePlayerMutation.mutate(player.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-1 text-sm">
                          <p><strong>Batting:</strong> {player.battingStyle}</p>
                          {player.bowlingStyle && <p><strong>Bowling:</strong> {player.bowlingStyle}</p>}
                          {player.isCaptain && <Badge>Captain</Badge>}
                          {player.isViceCaptain && <Badge variant="outline">Vice Captain</Badge>}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          )}

          {/* Articles Tab */}
          <TabsContent value="articles" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-[#1e3a8a]">Create New Article</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={articleForm.handleSubmit((data) => {
                  console.log('Form data:', data);
                  console.log('Form errors:', articleForm.formState.errors);
                  
                  // Validate required fields
                  if (!data.title || !data.content || !data.author || !data.category) {
                    toast({ title: "Error", description: "Please fill in all required fields", variant: "destructive" });
                    return;
                  }
                  
                  // Auto-generate slug if not provided
                  const slug = data.slug || data.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
                  createArticleMutation.mutate({...data, slug});
                })} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title">Title *</Label>
                      <Input {...articleForm.register("title", { required: true })} placeholder="Article title" />
                    </div>
                    <div>
                      <Label htmlFor="slug">Slug *</Label>
                      <Input {...articleForm.register("slug", { required: true })} placeholder="article-slug" />
                    </div>
                    <div>
                      <Label htmlFor="excerpt">Excerpt</Label>
                      <Textarea {...articleForm.register("excerpt")} placeholder="Brief description..." rows={2} />
                    </div>
                    <div>
                      <Label htmlFor="featuredImage">Featured Image</Label>
                      <Input 
                        type="file" 
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const imageData = await handleFileUpload(file);
                            articleForm.setValue("featuredImage", imageData);
                          }
                        }}
                      />
                    </div>
                    <div>
                      <Label htmlFor="author">Author *</Label>
                      <Select onValueChange={(value) => articleForm.setValue("author", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select author" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Admin">Admin</SelectItem>
                          <SelectItem value="Content Writer">Content Writer</SelectItem>
                          <SelectItem value="Others">Others</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        checked={articleForm.watch("isFeatured") || false}
                        onCheckedChange={(checked) => articleForm.setValue("isFeatured", !!checked)}
                      />
                      <Label>Featured Article</Label>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="content">Content *</Label>
                    <Textarea {...articleForm.register("content", { required: true })} placeholder="Article content..." rows={6} />
                  </div>

                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select onValueChange={(value) => articleForm.setValue("category", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="IPL">IPL</SelectItem>
                        <SelectItem value="ICC">ICC</SelectItem>
                        <SelectItem value="Match Report">Match Report</SelectItem>
                        <SelectItem value="News">News</SelectItem>
                        <SelectItem value="Player Profile">Player Profile</SelectItem>
                        <SelectItem value="Training">Training</SelectItem>
                        <SelectItem value="Events">Events</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit" disabled={createArticleMutation.isPending}>
                    {createArticleMutation.isPending ? "Creating..." : "Create Article"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-[#1e3a8a]">Articles List ({articles.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {articles.map((article) => (
                    <Card key={article.id} className="border">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{article.title}</CardTitle>
                          <div className="flex gap-1">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setEditingItem({ type: 'article', item: article })}
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => deleteArticleMutation.mutate(article.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600">{article.excerpt}</p>
                        {article.isFeatured && <Badge className="mt-2">Featured</Badge>}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Gallery Tab */}
          <TabsContent value="gallery" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-[#1e3a8a]">Add Gallery Item</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={galleryForm.handleSubmit((data) => createGalleryMutation.mutate(data))} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title">Title *</Label>
                      <Input {...galleryForm.register("title", { required: true })} placeholder="Image title" />
                    </div>
                    <div>
                      <Label htmlFor="category">Category *</Label>
                      <Select onValueChange={(value) => galleryForm.setValue("category", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Match">Match</SelectItem>
                          <SelectItem value="Training">Training</SelectItem>
                          <SelectItem value="Celebration">Celebration</SelectItem>
                          <SelectItem value="Team">Team</SelectItem>
                          <SelectItem value="Ground">Ground</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="image">Image *</Label>
                      <Input 
                        type="file" 
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const imageData = await handleFileUpload(file);
                            galleryForm.setValue("imageUrl", imageData);
                          }
                        }}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="tags">Tags</Label>
                      <Input {...galleryForm.register("tags")} placeholder="tag1, tag2, tag3" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea {...galleryForm.register("description")} placeholder="Image description..." rows={3} />
                  </div>
                  <Button type="submit" disabled={createGalleryMutation.isPending}>
                    {createGalleryMutation.isPending ? "Adding..." : "Add to Gallery"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-[#1e3a8a]">Gallery Items ({gallery.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {gallery.map((item) => (
                    <Card key={item.id} className="border">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-base">{item.title}</CardTitle>
                          <div className="flex gap-1">
                            <Button variant="outline" size="sm">
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => deleteGalleryMutation.mutate(item.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {item.imageUrl && (
                          <img src={item.imageUrl} alt={item.title} className="w-full h-32 object-cover rounded mb-2" />
                        )}
                        <p className="text-sm text-gray-600">{item.description}</p>
                        <Badge variant="secondary" className="mt-2">{item.category}</Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Announcements Tab */}
          <TabsContent value="announcements" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-[#1e3a8a]">Create Announcement</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={announcementForm.handleSubmit((data) => createAnnouncementMutation.mutate(data))} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title">Title *</Label>
                      <Input {...announcementForm.register("title", { required: true })} placeholder="Announcement title" />
                    </div>
                    <div>
                      <Label htmlFor="type">Type *</Label>
                      <Select onValueChange={(value) => announcementForm.setValue("type", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="General">General</SelectItem>
                          <SelectItem value="Match">Match</SelectItem>
                          <SelectItem value="Training">Training</SelectItem>
                          <SelectItem value="Celebration">Celebration</SelectItem>
                          <SelectItem value="Achievement">Achievement</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="priority">Priority *</Label>
                      <Select onValueChange={(value) => announcementForm.setValue("priority", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="High">High</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="Low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="tags">Tags</Label>
                      <Input {...announcementForm.register("tags")} placeholder="tag1, tag2, tag3" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="content">Content *</Label>
                    <Textarea {...announcementForm.register("content", { required: true })} placeholder="Announcement content..." rows={4} />
                  </div>
                  <Button type="submit" disabled={createAnnouncementMutation.isPending}>
                    {createAnnouncementMutation.isPending ? "Creating..." : "Create Announcement"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-[#1e3a8a]">Announcements ({announcements.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {announcements.map((announcement) => (
                    <Card key={announcement.id} className="border">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{announcement.title}</CardTitle>
                            <div className="flex gap-2 mt-1">
                              <Badge variant="outline">{announcement.type}</Badge>
                              <Badge variant={announcement.priority === 'High' ? 'destructive' : 
                                            announcement.priority === 'Medium' ? 'default' : 'secondary'}>
                                {announcement.priority}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Button variant="outline" size="sm">
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => deleteAnnouncementMutation.mutate(announcement.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700">{announcement.content}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Match Performance Tab */}
          <TabsContent value="matches" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-[#1e3a8a]">Record Match Performance</CardTitle>
                <p className="text-sm text-gray-600">
                  Enter match details manually, select your playing 11, and record individual player performances. 
                  Performance fields are optional - only fill in the statistics that are relevant for each player.
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={matchForm.handleSubmit((data) => {
                  const matchData = {
                    ...data,
                    selectedPlayers,
                    playerStats: selectedPlayers.map(playerId => ({
                      playerId,
                      ...data[`player_${playerId}`]
                    }))
                  };
                  createMatchPerformanceMutation.mutate(matchData);
                })} className="space-y-6">
                  {/* Match Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="opponentTeam">Opponent Team *</Label>
                      <Input {...matchForm.register("opponentTeam", { required: true })} placeholder="Enter opponent team name" />
                    </div>
                    <div>
                      <Label htmlFor="venue">Venue *</Label>
                      <Input {...matchForm.register("venue", { required: true })} placeholder="Enter venue name" />
                    </div>
                    <div>
                      <Label htmlFor="matchDate">Match Date *</Label>
                      <Input 
                        {...matchForm.register("matchDate", { required: true })} 
                        type="date" 
                        defaultValue={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div>
                      <Label htmlFor="matchResult">Match Result *</Label>
                      <Select onValueChange={(value) => matchForm.setValue("matchResult", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select result" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Won">Won</SelectItem>
                          <SelectItem value="Lost">Lost</SelectItem>
                          <SelectItem value="Draw">Draw</SelectItem>
                          <SelectItem value="No Result">No Result</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Team Totals Section */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-3 text-blue-900">Team Totals</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Tuskers CC Totals */}
                      <div>
                        <h5 className="font-medium mb-2 text-green-700">Tuskers CC</h5>
                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <Label>Total Score</Label>
                            <Input 
                              {...matchForm.register("tuskersScore", { valueAsNumber: true })}
                              type="number" 
                              min="0"
                              placeholder="245"
                            />
                          </div>
                          <div>
                            <Label>Overs Faced</Label>
                            <Input 
                              {...matchForm.register("tuskersOvers")}
                              placeholder="50.0"
                            />
                          </div>
                          <div>
                            <Label>Wickets Lost</Label>
                            <Input 
                              {...matchForm.register("tuskersWickets", { valueAsNumber: true })}
                              type="number" 
                              min="0"
                              max="10"
                              placeholder="6"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Opponent Totals */}
                      <div>
                        <h5 className="font-medium mb-2 text-red-700">Opponent</h5>
                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <Label>Total Score</Label>
                            <Input 
                              {...matchForm.register("opponentScore", { valueAsNumber: true })}
                              type="number" 
                              min="0"
                              placeholder="187"
                            />
                          </div>
                          <div>
                            <Label>Overs Bowled</Label>
                            <Input 
                              {...matchForm.register("opponentOvers")}
                              placeholder="48.3"
                            />
                          </div>
                          <div>
                            <Label>Wickets Taken</Label>
                            <Input 
                              {...matchForm.register("opponentWickets", { valueAsNumber: true })}
                              type="number" 
                              min="0"
                              max="10"
                              placeholder="10"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Select Playing 11 */}
                  <div>
                    <Label className="text-lg font-semibold">Select Playing 11 ({selectedPlayers.length}/11)</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mt-2">
                      {players.map((player) => (
                        <div key={player.id} className="flex items-center space-x-2">
                          <Checkbox
                            checked={selectedPlayers.includes(player.id)}
                            onCheckedChange={() => handlePlayerToggle(player.id)}
                            disabled={!selectedPlayers.includes(player.id) && selectedPlayers.length >= 11}
                          />
                          <Label className="text-sm">{player.name}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Player Statistics */}
                  {selectedPlayers.length > 0 && (
                    <div>
                      <Label className="text-lg font-semibold">Player Statistics</Label>
                      <div className="space-y-4 mt-4">
                        {selectedPlayers.map((playerId) => {
                          const player = players.find(p => p.id === playerId);
                          if (!player) return null;

                          return (
                            <Card key={playerId} className="p-4">
                              <h4 className="font-semibold mb-3">{player.name} - {player.role}</h4>
                              
                              {/* Batting Stats */}
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                <div>
                                  <Label>Runs Scored</Label>
                                  <Input 
                                    {...matchForm.register(`player_${playerId}.runsScored`, { valueAsNumber: true })}
                                    type="number" 
                                    min="0"
                                    placeholder="0"
                                  />
                                </div>
                                <div>
                                  <Label>Balls Faced</Label>
                                  <Input 
                                    {...matchForm.register(`player_${playerId}.ballsFaced`, { valueAsNumber: true })}
                                    type="number" 
                                    min="0"
                                    placeholder="0"
                                  />
                                </div>
                                <div>
                                  <Label>Dismissal Type</Label>
                                  <Select onValueChange={(value) => matchForm.setValue(`player_${playerId}.dismissalType`, value)}>
                                    <SelectTrigger>
                                      <SelectValue placeholder="How Out?" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="Not Out">Not Out</SelectItem>
                                      <SelectItem value="Bowled">Bowled</SelectItem>
                                      <SelectItem value="Caught">Caught</SelectItem>
                                      <SelectItem value="LBW">LBW</SelectItem>
                                      <SelectItem value="Run Out">Run Out</SelectItem>
                                      <SelectItem value="Stumped">Stumped</SelectItem>
                                      <SelectItem value="Hit Wicket">Hit Wicket</SelectItem>
                                      <SelectItem value="Retired Hurt">Retired Hurt</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Label>Catches</Label>
                                  <Input 
                                    {...matchForm.register(`player_${playerId}.catches`, { valueAsNumber: true })}
                                    type="number" 
                                    min="0"
                                    placeholder="0"
                                  />
                                </div>
                                {player.role === "Wicket Keeper" && (
                                  <div>
                                    <Label>Stumpings</Label>
                                    <Input 
                                      {...matchForm.register(`player_${playerId}.stumpings`, { valueAsNumber: true })}
                                      type="number" 
                                      min="0"
                                      placeholder="0"
                                    />
                                  </div>
                                )}
                                <div>
                                  <Label>Run Outs</Label>
                                  <Input 
                                    {...matchForm.register(`player_${playerId}.runOuts`, { valueAsNumber: true })}
                                    type="number" 
                                    min="0"
                                    placeholder="0"
                                  />
                                </div>
                              </div>

                              {/* Bowling Stats - Only for Bowlers and All Rounders */}
                              {(player.role === "Bowler" || player.role === "All Rounder") && (
                                <div>
                                  <h5 className="font-medium mb-2">Bowling Statistics</h5>
                                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                    <div>
                                      <Label>Overs Bowled</Label>
                                      <Input 
                                        {...matchForm.register(`player_${playerId}.oversBowled`)}
                                        placeholder="6.0"
                                      />
                                    </div>
                                    <div>
                                      <Label>Wickets</Label>
                                      <Input 
                                        {...matchForm.register(`player_${playerId}.wicketsTaken`, { valueAsNumber: true })}
                                        type="number" 
                                        min="0"
                                        placeholder="0"
                                      />
                                    </div>
                                    <div>
                                      <Label>Runs Conceded</Label>
                                      <Input 
                                        {...matchForm.register(`player_${playerId}.runsConceded`, { valueAsNumber: true })}
                                        type="number" 
                                        min="0"
                                        placeholder="0"
                                      />
                                    </div>
                                    <div>
                                      <Label>Maidens</Label>
                                      <Input 
                                        {...matchForm.register(`player_${playerId}.maidens`, { valueAsNumber: true })}
                                        type="number" 
                                        min="0"
                                        placeholder="0"
                                      />
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4 mt-2">
                                    <div>
                                      <Label>No Balls</Label>
                                      <Input 
                                        {...matchForm.register(`player_${playerId}.noBalls`, { valueAsNumber: true })}
                                        type="number" 
                                        min="0"
                                        placeholder="0"
                                      />
                                    </div>
                                    <div>
                                      <Label>Wides</Label>
                                      <Input 
                                        {...matchForm.register(`player_${playerId}.wides`, { valueAsNumber: true })}
                                        type="number" 
                                        min="0"
                                        placeholder="0"
                                      />
                                    </div>
                                  </div>
                                </div>
                              )}
                            </Card>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <Button 
                    type="submit" 
                    disabled={createMatchPerformanceMutation.isPending || selectedPlayers.length === 0}
                    className="w-full"
                  >
                    {createMatchPerformanceMutation.isPending ? "Recording..." : "Record Match Performance"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Team Stats Tab */}
          <TabsContent value="stats" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-[#1e3a8a]">Team Statistics</CardTitle>
                <p className="text-sm text-gray-600">Automatically calculated from match performances</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-green-800">Matches Won</h3>
                    <p className="text-2xl font-bold text-green-600">{teamStats.matchesWon || 0}</p>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-red-800">Matches Lost</h3>
                    <p className="text-2xl font-bold text-red-600">{teamStats.matchesLost || 0}</p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-yellow-800">Draws</h3>
                    <p className="text-2xl font-bold text-yellow-600">{teamStats.draws || 0}</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-800">Total Matches</h3>
                    <p className="text-2xl font-bold text-blue-600">{teamStats.totalMatches || 0}</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-purple-800">Total Runs</h3>
                    <p className="text-2xl font-bold text-purple-600">{teamStats.totalRuns || 0}</p>
                  </div>
                  <div className="bg-indigo-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-indigo-800">Wickets Taken</h3>
                    <p className="text-2xl font-bold text-indigo-600">{teamStats.wicketsTaken || 0}</p>
                  </div>
                  <div className="bg-pink-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-pink-800">Runs Conceded</h3>
                    <p className="text-2xl font-bold text-pink-600">{teamStats.runsConceded || 0}</p>
                  </div>
                  <div className="bg-teal-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-teal-800">Overs Bowled</h3>
                    <p className="text-2xl font-bold text-teal-600">{teamStats.oversBowled || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Polls Tab */}
          <TabsContent value="polls" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-[#1e3a8a]">Poll Visibility Control</CardTitle>
                <p className="text-sm text-gray-600">Control which polls appear on the homepage for fan interaction</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Chat-style interface for poll control */}
                  <div className="bg-gray-50 rounded-lg p-4 border h-64 overflow-y-auto">
                    <div className="space-y-3">
                      {/* Current Poll Status */}
                      <div className="flex items-start space-x-2">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          A
                        </div>
                        <div className="bg-white rounded-lg px-3 py-2 shadow-sm max-w-sm">
                          {currentPoll ? (
                            <>
                              <p className="text-sm text-gray-700">Current poll: "{currentPoll.question}"</p>
                              <p className="text-xs text-gray-500 mt-1">
                                Status: {currentPoll.isActive ? 'Visible on homepage' : 'Hidden from homepage'}
                              </p>
                            </>
                          ) : (
                            <>
                              <p className="text-sm text-gray-700">No active poll</p>
                              <p className="text-xs text-gray-500 mt-1">Create a new poll to display on homepage</p>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Poll Options */}
                      <div className="flex items-start space-x-2">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          S
                        </div>
                        <div className="bg-white rounded-lg px-3 py-2 shadow-sm max-w-sm">
                          <p className="text-sm text-gray-700">Available polls ({polls.length}):</p>
                          <div className="mt-2 space-y-1 max-h-32 overflow-y-auto">
                            {polls.length > 0 ? polls.map((poll: any) => (
                              <div key={poll.id} className="flex items-center justify-between">
                                <button 
                                  className={`block w-full text-left text-xs px-2 py-1 rounded ${
                                    poll.isActive ? 'bg-blue-50 text-blue-700' : 'bg-gray-50'
                                  }`}
                                  onClick={() => updatePollVisibilityMutation.mutate({ 
                                    id: poll.id, 
                                    isActive: !poll.isActive 
                                  })}
                                >
                                  {poll.question.substring(0, 30)}...
                                </button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="ml-2 h-6 w-6 p-0"
                                  onClick={() => deletePollMutation.mutate(poll.id)}
                                >
                                  <X className="w-3 h-3" />
                                </Button>
                              </div>
                            )) : (
                              <p className="text-xs text-gray-500">No polls created yet</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Poll Control Actions */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="border-green-200">
                      <CardContent className="p-4">
                        <div className="text-center">
                          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                          </div>
                          <h3 className="font-semibold text-green-800 mb-2">Show Poll</h3>
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            Make Visible
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-yellow-200">
                      <CardContent className="p-4">
                        <div className="text-center">
                          <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Edit2 className="w-6 h-6 text-yellow-600" />
                          </div>
                          <h3 className="font-semibold text-yellow-800 mb-2">Change Poll</h3>
                          <Button size="sm" variant="outline" className="border-yellow-300 text-yellow-700 hover:bg-yellow-50">
                            Switch Poll
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-red-200">
                      <CardContent className="p-4">
                        <div className="text-center">
                          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <XCircle className="w-6 h-6 text-red-600" />
                          </div>
                          <h3 className="font-semibold text-red-800 mb-2">Hide Poll</h3>
                          <Button size="sm" variant="outline" className="border-red-300 text-red-700 hover:bg-red-50">
                            Make Hidden
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Create New Poll */}
                  <Card className="border-[#1e3a8a]">
                    <CardHeader>
                      <CardTitle className="text-lg text-[#1e3a8a]">Create New Poll</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Form {...pollForm}>
                        <form onSubmit={pollForm.handleSubmit((data) => {
                          const validOptions = newPollOptions.filter(opt => opt.trim() !== '');
                          if (validOptions.length < 2) {
                            toast({ 
                              title: "Error", 
                              description: "Please provide at least 2 options", 
                              variant: "destructive" 
                            });
                            return;
                          }
                          createPollMutation.mutate({
                            question: data.question,
                            options: validOptions,
                            isActive: true
                          });
                        })} className="space-y-4">
                          <FormField
                            control={pollForm.control}
                            name="question"
                            render={({ field }) => (
                              <FormItem>
                                <Label>Poll Question</Label>
                                <FormControl>
                                  <Input placeholder="Enter your poll question..." {...field} />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {newPollOptions.map((option, index) => (
                              <div key={index}>
                                <Label>Option {index + 1}{index >= 2 ? ' (Optional)' : ''}</Label>
                                <Input
                                  placeholder={`${index === 0 ? 'First' : index === 1 ? 'Second' : index === 2 ? 'Third' : 'Fourth'} option...`}
                                  value={option}
                                  onChange={(e) => {
                                    const newOptions = [...newPollOptions];
                                    newOptions[index] = e.target.value;
                                    setNewPollOptions(newOptions);
                                  }}
                                />
                              </div>
                            ))}
                          </div>
                          <Button 
                            type="submit" 
                            className="bg-[#1e3a8a] hover:bg-[#1e40af]"
                            disabled={createPollMutation.isPending}
                          >
                            {createPollMutation.isPending ? 'Creating...' : 'Create Poll'}
                          </Button>
                        </form>
                      </Form>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Edit Dialog */}
        {editingItem && (
          <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  Edit {editingItem.type === 'article' ? 'Article' : 
                       editingItem.type === 'gallery' ? 'Gallery Item' : 'Announcement'}
                </DialogTitle>
              </DialogHeader>
              
              {editingItem.type === 'article' && (
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target as HTMLFormElement);
                  const data = {
                    title: formData.get('title') as string,
                    slug: formData.get('slug') as string,
                    excerpt: formData.get('excerpt') as string,
                    content: formData.get('content') as string,
                    author: formData.get('author') as string || editingItem.item.author,
                    category: formData.get('category') as string || editingItem.item.category,
                    isFeatured: formData.get('isFeatured') === 'on',
                    isPublished: formData.get('isPublished') === 'on'
                  };
                  console.log('Submitting article update:', data);
                  updateArticleMutation.mutate({ id: editingItem.item.id, data });
                }} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="edit-title">Title</Label>
                      <Input name="title" defaultValue={editingItem.item.title} />
                    </div>
                    <div>
                      <Label htmlFor="edit-slug">Slug</Label>
                      <Input name="slug" defaultValue={editingItem.item.slug} />
                    </div>
                    <div>
                      <Label htmlFor="edit-excerpt">Excerpt</Label>
                      <Textarea name="excerpt" defaultValue={editingItem.item.excerpt} rows={2} />
                    </div>
                    <div>
                      <Label htmlFor="edit-author">Author</Label>
                      <Select name="author" defaultValue={editingItem.item.author}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Admin">Admin</SelectItem>
                          <SelectItem value="Content Writer">Content Writer</SelectItem>
                          <SelectItem value="Others">Others</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="edit-category">Category</Label>
                      <Select name="category" defaultValue={editingItem.item.category}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="IPL">IPL</SelectItem>
                          <SelectItem value="ICC">ICC</SelectItem>
                          <SelectItem value="Match Report">Match Report</SelectItem>
                          <SelectItem value="News">News</SelectItem>
                          <SelectItem value="Player Profile">Player Profile</SelectItem>
                          <SelectItem value="Training">Training</SelectItem>
                          <SelectItem value="Events">Events</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center space-x-2">
                        <input 
                          type="checkbox" 
                          name="isFeatured" 
                          defaultChecked={editingItem.item.isFeatured}
                          className="rounded"
                        />
                        <Label>Featured Article</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input 
                          type="checkbox" 
                          name="isPublished" 
                          defaultChecked={editingItem.item.isPublished}
                          className="rounded"
                        />
                        <Label>Published</Label>
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="edit-content">Content</Label>
                    <Textarea name="content" defaultValue={editingItem.item.content} rows={6} />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setEditingItem(null)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={updateArticleMutation.isPending}>
                      {updateArticleMutation.isPending ? "Updating..." : "Update Article"}
                    </Button>
                  </div>
                </form>
              )}
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}

export default function ComprehensiveAdmin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAdminAuth();
  }, []);

  const checkAdminAuth = async () => {
    try {
      const response = await fetch('/api/admin/verify', {
        credentials: 'include',
      });
      
      if (response.ok) {
        setIsAuthenticated(true);
      } else {
        window.location.href = '/admin/login';
      }
    } catch (error) {
      window.location.href = '/admin/login';
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1e3a8a] to-[#3b82f6] flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <ComprehensiveAdminContent />;
}