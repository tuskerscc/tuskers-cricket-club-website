import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { TrendingUp, Trophy, Target, Users, Plus, Edit, Save } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import type { Player, PlayerStats } from "@shared/schema";

const updateStatsSchema = z.object({
  playerId: z.number(),
  runsScored: z.number().min(0),
  ballsFaced: z.number().min(0),
  fours: z.number().min(0),
  sixes: z.number().min(0),
  wicketsTaken: z.number().min(0),
  ballsBowled: z.number().min(0),
  runsConceded: z.number().min(0),
  catches: z.number().min(0),
  stumpings: z.number().min(0),
  runOuts: z.number().min(0),
});

const announcementSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  type: z.enum(["general", "match", "achievement", "training"]),
  priority: z.enum(["low", "medium", "high"]),
});

type UpdateStatsForm = z.infer<typeof updateStatsSchema>;
type AnnouncementForm = z.infer<typeof announcementSchema>;

export default function PlayerStats() {
  const [selectedPlayer, setSelectedPlayer] = useState<number | null>(null);
  const [editingPlayer, setEditingPlayer] = useState<number | null>(null);
  const queryClient = useQueryClient();

  const { data: players = [], isLoading: playersLoading } = useQuery<(Player & { stats?: PlayerStats })[]>({
    queryKey: ["/api/players"],
  });

  const { data: announcements = [] } = useQuery({
    queryKey: ["/api/announcements"],
  });

  const updateStatsMutation = useMutation({
    mutationFn: (data: UpdateStatsForm) =>
      apiRequest(`/api/players/${data.playerId}/stats`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/players"] });
      setEditingPlayer(null);
    },
  });

  const createAnnouncementMutation = useMutation({
    mutationFn: (data: AnnouncementForm) =>
      apiRequest("/api/announcements", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/announcements"] });
      announcementForm.reset();
    },
  });

  const statsForm = useForm<UpdateStatsForm>({
    resolver: zodResolver(updateStatsSchema),
    defaultValues: {
      playerId: 0,
      runsScored: 0,
      ballsFaced: 0,
      fours: 0,
      sixes: 0,
      wicketsTaken: 0,
      ballsBowled: 0,
      runsConceded: 0,
      catches: 0,
      stumpings: 0,
      runOuts: 0,
    },
  });

  const announcementForm = useForm<AnnouncementForm>({
    resolver: zodResolver(announcementSchema),
    defaultValues: {
      title: "",
      content: "",
      type: "general",
      priority: "medium",
    },
  });

  const handleEditPlayer = (player: Player & { stats?: PlayerStats }) => {
    setEditingPlayer(player.id);
    const stats = player.stats || {};
    statsForm.reset({
      playerId: player.id,
      battingRuns: stats.battingRuns || 0,
      battingBalls: stats.battingBalls || 0,
      battingFours: stats.battingFours || 0,
      battingSixes: stats.battingSixes || 0,
      bowlingWickets: stats.bowlingWickets || 0,
      bowlingBalls: stats.bowlingBalls || 0,
      bowlingRuns: stats.bowlingRuns || 0,
      fieldingCatches: stats.fieldingCatches || 0,
      fieldingStumpings: stats.fieldingStumpings || 0,
      fieldingRunOuts: stats.fieldingRunOuts || 0,
    });
  };

  const onUpdateStats = (data: UpdateStatsForm) => {
    updateStatsMutation.mutate(data);
  };

  const onCreateAnnouncement = (data: AnnouncementForm) => {
    createAnnouncementMutation.mutate(data);
  };

  const calculateAverage = (runs: number, outs: number) => {
    return outs === 0 ? runs : (runs / outs).toFixed(2);
  };

  const calculateStrikeRate = (runs: number, balls: number) => {
    return balls === 0 ? 0 : ((runs / balls) * 100).toFixed(2);
  };

  const calculateEconomy = (runs: number, balls: number) => {
    return balls === 0 ? 0 : ((runs / balls) * 6).toFixed(2);
  };

  if (playersLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading player data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Player Stats & Announcements
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage player statistics and create team announcements
        </p>
      </div>

      <Tabs defaultValue="stats" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="stats" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Player Statistics
          </TabsTrigger>
          <TabsTrigger value="announcements" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Announcements
          </TabsTrigger>
        </TabsList>

        <TabsContent value="stats" className="space-y-6">
          <div className="grid gap-6">
            {players.map((player) => (
              <Card key={player.id} className="overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-gold-50 dark:from-blue-950 dark:to-yellow-950">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                        #{player.jerseyNumber}
                      </div>
                      <div>
                        <CardTitle className="text-xl">{player.name}</CardTitle>
                        <CardDescription className="flex items-center gap-2">
                          <Badge variant="outline">{player.position}</Badge>
                          <Badge variant="secondary">{player.battingStyle}</Badge>
                          <Badge variant="secondary">{player.bowlingStyle}</Badge>
                        </CardDescription>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleEditPlayer(player)}
                      variant={editingPlayer === player.id ? "default" : "outline"}
                      size="sm"
                    >
                      {editingPlayer === player.id ? (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Editing
                        </>
                      ) : (
                        <>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Stats
                        </>
                      )}
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="pt-6">
                  {editingPlayer === player.id ? (
                    <Form {...statsForm}>
                      <form onSubmit={statsForm.handleSubmit(onUpdateStats)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {/* Batting Stats */}
                          <div className="space-y-4">
                            <h4 className="font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                              <Target className="h-4 w-4" />
                              Batting
                            </h4>
                            <div className="grid grid-cols-2 gap-3">
                              <FormField
                                control={statsForm.control}
                                name="battingRuns"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Runs</FormLabel>
                                    <FormControl>
                                      <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value) || 0)} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={statsForm.control}
                                name="battingBalls"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Balls</FormLabel>
                                    <FormControl>
                                      <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value) || 0)} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={statsForm.control}
                                name="battingFours"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>4s</FormLabel>
                                    <FormControl>
                                      <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value) || 0)} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={statsForm.control}
                                name="battingSixes"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>6s</FormLabel>
                                    <FormControl>
                                      <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value) || 0)} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          </div>

                          {/* Bowling Stats */}
                          <div className="space-y-4">
                            <h4 className="font-semibold text-green-600 dark:text-green-400 flex items-center gap-2">
                              <Trophy className="h-4 w-4" />
                              Bowling
                            </h4>
                            <div className="grid grid-cols-2 gap-3">
                              <FormField
                                control={statsForm.control}
                                name="bowlingWickets"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Wickets</FormLabel>
                                    <FormControl>
                                      <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value) || 0)} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={statsForm.control}
                                name="bowlingBalls"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Balls</FormLabel>
                                    <FormControl>
                                      <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value) || 0)} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={statsForm.control}
                                name="bowlingRuns"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Runs</FormLabel>
                                    <FormControl>
                                      <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value) || 0)} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          </div>

                          {/* Fielding Stats */}
                          <div className="space-y-4">
                            <h4 className="font-semibold text-purple-600 dark:text-purple-400 flex items-center gap-2">
                              <Users className="h-4 w-4" />
                              Fielding
                            </h4>
                            <div className="grid grid-cols-2 gap-3">
                              <FormField
                                control={statsForm.control}
                                name="fieldingCatches"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Catches</FormLabel>
                                    <FormControl>
                                      <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value) || 0)} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={statsForm.control}
                                name="fieldingStumpings"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Stumpings</FormLabel>
                                    <FormControl>
                                      <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value) || 0)} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={statsForm.control}
                                name="fieldingRunOuts"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Run Outs</FormLabel>
                                    <FormControl>
                                      <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value) || 0)} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-3 justify-end">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setEditingPlayer(null)}
                          >
                            Cancel
                          </Button>
                          <Button type="submit" disabled={updateStatsMutation.isPending}>
                            {updateStatsMutation.isPending ? "Saving..." : "Save Stats"}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Batting Display */}
                      <div className="space-y-3">
                        <h4 className="font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                          <Target className="h-4 w-4" />
                          Batting
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Runs:</span>
                            <span className="font-medium">{player.stats?.battingRuns || 0}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Strike Rate:</span>
                            <span className="font-medium">
                              {calculateStrikeRate(player.stats?.battingRuns || 0, player.stats?.battingBalls || 0)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>4s/6s:</span>
                            <span className="font-medium">
                              {player.stats?.battingFours || 0}/{player.stats?.battingSixes || 0}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Bowling Display */}
                      <div className="space-y-3">
                        <h4 className="font-semibold text-green-600 dark:text-green-400 flex items-center gap-2">
                          <Trophy className="h-4 w-4" />
                          Bowling
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Wickets:</span>
                            <span className="font-medium">{player.stats?.bowlingWickets || 0}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Economy:</span>
                            <span className="font-medium">
                              {calculateEconomy(player.stats?.bowlingRuns || 0, player.stats?.bowlingBalls || 0)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Runs Given:</span>
                            <span className="font-medium">{player.stats?.bowlingRuns || 0}</span>
                          </div>
                        </div>
                      </div>

                      {/* Fielding Display */}
                      <div className="space-y-3">
                        <h4 className="font-semibold text-purple-600 dark:text-purple-400 flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          Fielding
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Catches:</span>
                            <span className="font-medium">{player.stats?.fieldingCatches || 0}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Stumpings:</span>
                            <span className="font-medium">{player.stats?.fieldingStumpings || 0}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Run Outs:</span>
                            <span className="font-medium">{player.stats?.fieldingRunOuts || 0}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="announcements" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Create New Announcement
              </CardTitle>
              <CardDescription>
                Share important updates with the team and fans
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...announcementForm}>
                <form onSubmit={announcementForm.handleSubmit(onCreateAnnouncement)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={announcementForm.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter announcement title" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <FormField
                        control={announcementForm.control}
                        name="type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="general">General</SelectItem>
                                <SelectItem value="match">Match</SelectItem>
                                <SelectItem value="achievement">Achievement</SelectItem>
                                <SelectItem value="training">Training</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={announcementForm.control}
                        name="priority"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Priority</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="low">Low</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  <FormField
                    control={announcementForm.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Content</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter announcement content"
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={createAnnouncementMutation.isPending}>
                    {createAnnouncementMutation.isPending ? "Creating..." : "Create Announcement"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Recent Announcements */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Announcements</CardTitle>
              <CardDescription>Latest team updates and announcements</CardDescription>
            </CardHeader>
            <CardContent>
              {announcements.length === 0 ? (
                <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                  No announcements yet. Create your first announcement above.
                </p>
              ) : (
                <div className="space-y-4">
                  {announcements.map((announcement: any) => (
                    <div key={announcement.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold">{announcement.title}</h4>
                        <div className="flex gap-2">
                          <Badge variant={announcement.priority === "high" ? "destructive" : announcement.priority === "medium" ? "default" : "secondary"}>
                            {announcement.priority}
                          </Badge>
                          <Badge variant="outline">{announcement.type}</Badge>
                        </div>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 mb-2">{announcement.content}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-500">
                        {new Date(announcement.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}