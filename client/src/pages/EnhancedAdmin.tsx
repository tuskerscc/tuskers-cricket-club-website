import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit2, Save, X, Users, FileText, Image, Trophy, MessageSquare } from "lucide-react";
import AdminProtected from "@/components/AdminProtected";
import { Link } from "wouter";
import type { Player, Article, GalleryItem, Team } from "@shared/schema";

function EnhancedAdminContent() {
  const [activeTab, setActiveTab] = useState('players');
  const [editingItem, setEditingItem] = useState<{type: string, id: number} | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Data queries
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

  // Forms
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

  const announcementForm = useForm({
    defaultValues: {
      title: '',
      content: '',
      type: 'general',
      priority: 'medium'
    }
  });

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

  const galleryForm = useForm({
    defaultValues: {
      title: '',
      description: '',
      category: 'match',
      imageUrl: '',
      matchId: null
    }
  });

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

  // Mutations
  const deletePlayerMutation = useMutation({
    mutationFn: (id: number) => apiRequest(`/api/players/${id}`, 'DELETE'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/players'] });
      toast({ title: "Success", description: "Player deleted successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete player", variant: "destructive" });
    }
  });

  const deleteAnnouncementMutation = useMutation({
    mutationFn: (id: number) => apiRequest(`/api/announcements/${id}`, 'DELETE'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/announcements'] });
      toast({ title: "Success", description: "Announcement deleted successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete announcement", variant: "destructive" });
    }
  });

  const deleteArticleMutation = useMutation({
    mutationFn: (id: number) => apiRequest(`/api/articles/${id}`, 'DELETE'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/articles'] });
      toast({ title: "Success", description: "Article deleted successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete article", variant: "destructive" });
    }
  });

  const deleteGalleryMutation = useMutation({
    mutationFn: (id: number) => apiRequest(`/api/gallery/${id}`, 'DELETE'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/gallery'] });
      toast({ title: "Success", description: "Gallery item deleted successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete gallery item", variant: "destructive" });
    }
  });

  const updateAnnouncementMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => 
      apiRequest(`/api/announcements/${id}`, 'PUT', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/announcements'] });
      setEditingItem(null);
      toast({ title: "Success", description: "Announcement updated successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update announcement", variant: "destructive" });
    }
  });

  const createPlayerMutation = useMutation({
    mutationFn: (data: any) => apiRequest('/api/players', 'POST', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/players'] });
      playerForm.reset();
      toast({ title: "Success", description: "Player created successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create player", variant: "destructive" });
    }
  });

  const createAnnouncementMutation = useMutation({
    mutationFn: (data: any) => apiRequest('/api/announcements', 'POST', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/announcements'] });
      announcementForm.reset();
      toast({ title: "Success", description: "Announcement created successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create announcement", variant: "destructive" });
    }
  });

  const createArticleMutation = useMutation({
    mutationFn: (data: any) => apiRequest('/api/articles', 'POST', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/articles'] });
      articleForm.reset();
      toast({ title: "Success", description: "Article created successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create article", variant: "destructive" });
    }
  });

  const createGalleryMutation = useMutation({
    mutationFn: (data: any) => apiRequest('/api/gallery', 'POST', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/gallery'] });
      galleryForm.reset();
      toast({ title: "Success", description: "Gallery item created successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create gallery item", variant: "destructive" });
    }
  });

  const updateStatsMutation = useMutation({
    mutationFn: (data: any) => apiRequest('/api/stats/team', 'PUT', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/stats/team'] });
      toast({ title: "Success", description: "Team statistics updated successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update team statistics", variant: "destructive" });
    }
  });

  const EditableAnnouncementCard = ({ announcement }: { announcement: any }) => {
    const [editData, setEditData] = useState({
      title: announcement.title,
      content: announcement.content,
      type: announcement.type,
      priority: announcement.priority
    });

    if (editingItem?.type === 'announcement' && editingItem.id === announcement.id) {
      return (
        <Card className="w-full">
          <CardHeader className="space-y-2">
            <Input
              value={editData.title}
              onChange={(e) => setEditData({...editData, title: e.target.value})}
              className="text-lg font-bold"
              placeholder="Announcement title"
            />
            <div className="flex flex-col sm:flex-row gap-2">
              <Select value={editData.type} onValueChange={(value) => setEditData({...editData, type: value})}>
                <SelectTrigger className="w-full sm:w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="match">Match</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
              <Select value={editData.priority} onValueChange={(value) => setEditData({...editData, priority: value})}>
                <SelectTrigger className="w-full sm:w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <Textarea
              value={editData.content}
              onChange={(e) => setEditData({...editData, content: e.target.value})}
              rows={3}
              placeholder="Announcement content"
            />
            <div className="flex flex-col sm:flex-row gap-2">
              <Button 
                onClick={() => updateAnnouncementMutation.mutate({ id: announcement.id, data: editData })}
                disabled={updateAnnouncementMutation.isPending}
                className="flex-1"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setEditingItem(null)}
                className="flex-1"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card className="w-full">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
            <CardTitle className="text-lg break-words">{announcement.title}</CardTitle>
            <div className="flex gap-1 flex-wrap">
              <Badge variant={announcement.type === 'urgent' ? 'destructive' : 'secondary'}>
                {announcement.type}
              </Badge>
              <Badge variant={announcement.priority === 'high' ? 'destructive' : 'outline'}>
                {announcement.priority}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-gray-600 break-words">{announcement.content}</p>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setEditingItem({type: 'announcement', id: announcement.id})}
              className="flex-1"
            >
              <Edit2 className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button 
              variant="destructive" 
              size="sm"
              onClick={() => deleteAnnouncementMutation.mutate(announcement.id)}
              disabled={deleteAnnouncementMutation.isPending}
              className="flex-1"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1e3a8a] to-[#1e40af] p-2 sm:p-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg shadow-sm p-4 sm:p-6 mb-6 sm:mb-8 border border-white/20">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#fcd34d] mb-2">TUSKERS CRICKET CLUB</h1>
              <p className="text-white/80 text-sm sm:text-base">Admin Dashboard - Complete Management System</p>
            </div>
            <Link href="/">
              <Button variant="outline" className="w-full sm:w-auto bg-white/20 border-white/30 text-white hover:bg-white/30">
                Back to Website
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-3 sm:p-6">
              <div className="flex items-center space-x-2">
                <Users className="h-6 w-6 sm:h-8 sm:w-8 text-[#fcd34d]" />
                <div>
                  <p className="text-xs sm:text-sm font-medium text-white/80">Players</p>
                  <p className="text-lg sm:text-2xl font-bold text-white">{players.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-3 sm:p-6">
              <div className="flex items-center space-x-2">
                <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-[#fcd34d]" />
                <div>
                  <p className="text-xs sm:text-sm font-medium text-white/80">Articles</p>
                  <p className="text-lg sm:text-2xl font-bold text-white">{articles.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-3 sm:p-6">
              <div className="flex items-center space-x-2">
                <Image className="h-6 w-6 sm:h-8 sm:w-8 text-[#fcd34d]" />
                <div>
                  <p className="text-xs sm:text-sm font-medium text-white/80">Gallery</p>
                  <p className="text-lg sm:text-2xl font-bold text-white">{galleryItems.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-3 sm:p-6">
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-6 w-6 sm:h-8 sm:w-8 text-[#fcd34d]" />
                <div>
                  <p className="text-xs sm:text-sm font-medium text-white/80">Updates</p>
                  <p className="text-lg sm:text-2xl font-bold text-white">{announcements.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-4 sm:p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5 mb-6 bg-white/20">
                <TabsTrigger value="players" className="text-xs sm:text-sm">Players</TabsTrigger>
                <TabsTrigger value="announcements" className="text-xs sm:text-sm">Updates</TabsTrigger>
                <TabsTrigger value="articles" className="text-xs sm:text-sm">Articles</TabsTrigger>
                <TabsTrigger value="gallery" className="text-xs sm:text-sm">Gallery</TabsTrigger>
                <TabsTrigger value="stats" className="text-xs sm:text-sm">Stats</TabsTrigger>
              </TabsList>

              {/* Players Tab */}
              <TabsContent value="players" className="space-y-6">
                <div className="bg-white rounded-lg p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-bold text-[#1e3a8a] mb-4">Add New Player</h3>
                  <form onSubmit={playerForm.handleSubmit((data) => createPlayerMutation.mutate(data))} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Player Name</Label>
                        <Input {...playerForm.register("name")} placeholder="Enter player name" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <Input {...playerForm.register("role")} placeholder="e.g., Batsman, Bowler" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="jerseyNumber">Jersey Number</Label>
                        <Input {...playerForm.register("jerseyNumber", { valueAsNumber: true })} type="number" min="1" max="99" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="battingStyle">Batting Style</Label>
                        <Input {...playerForm.register("battingStyle")} placeholder="e.g., Right-handed" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bowlingStyle">Bowling Style</Label>
                        <Input {...playerForm.register("bowlingStyle")} placeholder="e.g., Right-arm fast" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="photo">Photo URL</Label>
                        <Input {...playerForm.register("photo")} placeholder="https://example.com/photo.jpg" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio">Biography</Label>
                      <Textarea {...playerForm.register("bio")} placeholder="Player biography..." rows={3} />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex items-center space-x-2">
                        <Switch {...playerForm.register("isCaptain")} />
                        <Label>Captain</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch {...playerForm.register("isViceCaptain")} />
                        <Label>Vice Captain</Label>
                      </div>
                    </div>
                    <Button type="submit" disabled={createPlayerMutation.isPending} className="w-full sm:w-auto">
                      {createPlayerMutation.isPending ? "Adding..." : "Add Player"}
                    </Button>
                  </form>
                </div>

                <div className="bg-white rounded-lg p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-bold text-[#1e3a8a] mb-4">Current Players ({players.length})</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {players.map((player) => (
                      <Card key={player.id} className="border border-gray-200">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-base sm:text-lg">{player.name}</CardTitle>
                              <p className="text-sm text-gray-600">#{player.jerseyNumber} • {player.role}</p>
                            </div>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => deletePlayerMutation.mutate(player.id)}
                              disabled={deletePlayerMutation.isPending}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-2">
                          <div className="space-y-1 text-xs sm:text-sm">
                            {player.battingStyle && <p><strong>Batting:</strong> {player.battingStyle}</p>}
                            {player.bowlingStyle && <p><strong>Bowling:</strong> {player.bowlingStyle}</p>}
                            {player.isCaptain && <Badge variant="secondary" className="mr-1">Captain</Badge>}
                            {player.isViceCaptain && <Badge variant="outline" className="mr-1">Vice Captain</Badge>}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* Announcements Tab */}
              <TabsContent value="announcements" className="space-y-6">
                <div className="bg-white rounded-lg p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-bold text-[#1e3a8a] mb-4">Create New Announcement</h3>
                  <form onSubmit={announcementForm.handleSubmit((data) => createAnnouncementMutation.mutate(data))} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input {...announcementForm.register("title")} placeholder="Announcement title" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="type">Type</Label>
                        <Select onValueChange={(value) => announcementForm.setValue("type", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="general">General</SelectItem>
                            <SelectItem value="match">Match</SelectItem>
                            <SelectItem value="urgent">Urgent</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="priority">Priority</Label>
                        <Select onValueChange={(value) => announcementForm.setValue("priority", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="content">Content</Label>
                      <Textarea {...announcementForm.register("content")} placeholder="Announcement content..." rows={4} required />
                    </div>
                    <Button type="submit" disabled={createAnnouncementMutation.isPending} className="w-full sm:w-auto">
                      {createAnnouncementMutation.isPending ? "Creating..." : "Create Announcement"}
                    </Button>
                  </form>
                </div>

                <div className="bg-white rounded-lg p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-bold text-[#1e3a8a] mb-4">Current Announcements ({announcements.length})</h3>
                  <div className="grid grid-cols-1 gap-4">
                    {announcements.map((announcement) => (
                      <EditableAnnouncementCard key={announcement.id} announcement={announcement} />
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* Articles Tab */}
              <TabsContent value="articles" className="space-y-6">
                <div className="bg-white rounded-lg p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-bold text-[#1e3a8a] mb-4">Create New Article</h3>
                  <form onSubmit={articleForm.handleSubmit((data) => {
                    const slug = data.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
                    createArticleMutation.mutate({...data, slug});
                  })} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input {...articleForm.register("title")} placeholder="Article title" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="author">Author</Label>
                        <Input {...articleForm.register("author")} placeholder="Author name" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select onValueChange={(value) => articleForm.setValue("category", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="news">News</SelectItem>
                            <SelectItem value="match-report">Match Report</SelectItem>
                            <SelectItem value="player-spotlight">Player Spotlight</SelectItem>
                            <SelectItem value="announcement">Announcement</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="featuredImage">Featured Image URL</Label>
                        <Input {...articleForm.register("featuredImage")} placeholder="https://example.com/image.jpg" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="excerpt">Excerpt</Label>
                      <Textarea {...articleForm.register("excerpt")} placeholder="Brief description..." rows={2} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="content">Content</Label>
                      <Textarea {...articleForm.register("content")} placeholder="Article content..." rows={6} required />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex items-center space-x-2">
                        <Switch {...articleForm.register("isFeatured")} />
                        <Label>Featured Article</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch {...articleForm.register("isPublished")} />
                        <Label>Published</Label>
                      </div>
                    </div>
                    <Button type="submit" disabled={createArticleMutation.isPending} className="w-full sm:w-auto">
                      {createArticleMutation.isPending ? "Creating..." : "Create Article"}
                    </Button>
                  </form>
                </div>

                <div className="bg-white rounded-lg p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-bold text-[#1e3a8a] mb-4">Current Articles ({articles.length})</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {articles.map((article) => (
                      <Card key={article.id} className="border border-gray-200">
                        <CardHeader>
                          <div className="flex justify-between items-start gap-2">
                            <CardTitle className="text-base sm:text-lg break-words">{article.title}</CardTitle>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => deleteArticleMutation.mutate(article.id)}
                              disabled={deleteArticleMutation.isPending}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <p className="text-sm text-gray-600 break-words">{article.excerpt}</p>
                            <div className="flex flex-wrap gap-1">
                              <Badge variant="secondary">{article.category}</Badge>
                              {article.isFeatured && <Badge variant="default">Featured</Badge>}
                              {article.isPublished && <Badge variant="outline">Published</Badge>}
                            </div>
                            <p className="text-xs text-gray-500">By {article.author}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* Gallery Tab */}
              <TabsContent value="gallery" className="space-y-6">
                <div className="bg-white rounded-lg p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-bold text-[#1e3a8a] mb-4">Add New Gallery Item</h3>
                  <form onSubmit={galleryForm.handleSubmit((data) => createGalleryMutation.mutate(data))} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input {...galleryForm.register("title")} placeholder="Image title" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select onValueChange={(value) => galleryForm.setValue("category", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="match">Match</SelectItem>
                            <SelectItem value="training">Training</SelectItem>
                            <SelectItem value="event">Event</SelectItem>
                            <SelectItem value="team">Team</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2 sm:col-span-2">
                        <Label htmlFor="imageUrl">Image URL</Label>
                        <Input {...galleryForm.register("imageUrl")} placeholder="https://example.com/image.jpg" required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea {...galleryForm.register("description")} placeholder="Image description..." rows={3} />
                    </div>
                    <Button type="submit" disabled={createGalleryMutation.isPending} className="w-full sm:w-auto">
                      {createGalleryMutation.isPending ? "Adding..." : "Add to Gallery"}
                    </Button>
                  </form>
                </div>

                <div className="bg-white rounded-lg p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-bold text-[#1e3a8a] mb-4">Gallery Items ({galleryItems.length})</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {galleryItems.map((item) => (
                      <Card key={item.id} className="border border-gray-200">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-base break-words">{item.title}</CardTitle>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => deleteGalleryMutation.mutate(item.id)}
                              disabled={deleteGalleryMutation.isPending}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-2">
                          <div className="space-y-2">
                            <img src={item.imageUrl} alt={item.title} className="w-full h-32 object-cover rounded" />
                            <p className="text-sm text-gray-600 break-words">{item.description}</p>
                            <Badge variant="secondary">{item.category}</Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* Stats Tab */}
              <TabsContent value="stats" className="space-y-6">
                <div className="bg-white rounded-lg p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-bold text-[#1e3a8a] mb-4">Update Team Statistics</h3>
                  <form onSubmit={statsForm.handleSubmit((data) => updateStatsMutation.mutate(data))} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="matchesWon">Matches Won</Label>
                        <Input {...statsForm.register("matchesWon", { valueAsNumber: true })} type="number" min="0" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="totalMatches">Total Matches</Label>
                        <Input {...statsForm.register("totalMatches", { valueAsNumber: true })} type="number" min="0" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="totalRuns">Total Runs Scored</Label>
                        <Input {...statsForm.register("totalRuns", { valueAsNumber: true })} type="number" min="0" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="wicketsTaken">Wickets Taken</Label>
                        <Input {...statsForm.register("wicketsTaken", { valueAsNumber: true })} type="number" min="0" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="totalOvers">Total Overs Bowled</Label>
                        <Input {...statsForm.register("totalOvers", { valueAsNumber: true })} type="number" min="0" step="0.1" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="runsAgainst">Runs Conceded</Label>
                        <Input {...statsForm.register("runsAgainst", { valueAsNumber: true })} type="number" min="0" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="oversAgainst">Overs Faced</Label>
                        <Input {...statsForm.register("oversAgainst", { valueAsNumber: true })} type="number" min="0" step="0.1" />
                      </div>
                    </div>
                    <Button type="submit" disabled={updateStatsMutation.isPending} className="w-full sm:w-auto">
                      {updateStatsMutation.isPending ? "Updating..." : "Update Statistics"}
                    </Button>
                  </form>
                </div>

                {stats && (
                  <div className="bg-white rounded-lg p-4 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-bold text-[#1e3a8a] mb-4">Current Statistics</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <p className="text-2xl font-bold text-[#1e3a8a]">{stats.matchesWon}/{stats.totalMatches}</p>
                        <p className="text-sm text-gray-600">Matches Won</p>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <p className="text-2xl font-bold text-[#1e3a8a]">{stats.totalRuns}</p>
                        <p className="text-sm text-gray-600">Total Runs</p>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <p className="text-2xl font-bold text-[#1e3a8a]">{stats.wicketsTaken}</p>
                        <p className="text-sm text-gray-600">Wickets Taken</p>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <p className="text-2xl font-bold text-[#1e3a8a]">{stats.nrr?.toFixed(2) || 'N/A'}</p>
                        <p className="text-sm text-gray-600">Net Run Rate</p>
                      </div>
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function EnhancedAdmin() {
  return (
    <AdminProtected>
      <EnhancedAdminContent />
    </AdminProtected>
  );
}