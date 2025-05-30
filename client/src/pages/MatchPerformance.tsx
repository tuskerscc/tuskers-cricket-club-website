import { useState, useReducer } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Target, Users, Trophy, Calendar, Activity, Zap } from "lucide-react";

interface Player {
  id: number;
  name: string;
  jerseyNumber: number | null;
  role: string;
}

interface Match {
  id: number;
  title: string;
  date: string;
  status: string;
  homeTeam: { name: string; shortName: string };
  awayTeam: { name: string; shortName: string };
  venue: { name: string };
}

interface PerformanceData {
  playerId: number;
  runsScored: number;
  ballsFaced: number;
  fours: number;
  sixes: number;
  wicketsTaken: number;
  ballsBowled: number;
  runsConceded: number;
  catches: number;
  stumpings: number;
  runOuts: number;
}

type PerformanceAction = 
  | { type: 'UPDATE_FIELD'; playerId: number; field: keyof PerformanceData; value: number }
  | { type: 'RESET_PLAYER'; playerId: number }
  | { type: 'RESET_ALL' };

function performanceReducer(state: Record<number, PerformanceData>, action: PerformanceAction): Record<number, PerformanceData> {
  switch (action.type) {
    case 'UPDATE_FIELD':
      return {
        ...state,
        [action.playerId]: {
          ...state[action.playerId],
          [action.field]: action.value
        }
      };
    case 'RESET_PLAYER':
      return {
        ...state,
        [action.playerId]: {
          playerId: action.playerId,
          runsScored: 0,
          ballsFaced: 0,
          fours: 0,
          sixes: 0,
          wicketsTaken: 0,
          ballsBowled: 0,
          runsConceded: 0,
          catches: 0,
          stumpings: 0,
          runOuts: 0
        }
      };
    case 'RESET_ALL':
      return {};
    default:
      return state;
  }
}

export default function MatchPerformance() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [performances, dispatch] = useReducer(performanceReducer, {});
  const [matchData, setMatchData] = useState({
    opponent: "",
    venue: "",
    date: "",
    result: "Won" as "Won" | "Lost" | "Draw",
  });
  const [selectedPlayers, setSelectedPlayers] = useState<number[]>([]);

  const { data: players = [] } = useQuery<Player[]>({
    queryKey: ["/api/players"],
  });

  const updateStatsMutation = useMutation({
    mutationFn: async (data: { matchData: typeof matchData; playerPerformances: PerformanceData[] }) => {
      const response = await fetch(`/api/match-performance/manual`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          matchData: data.matchData,
          playerPerformances: data.playerPerformances 
        }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to update player statistics");
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Player statistics updated successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/players"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      dispatch({ type: 'RESET_ALL' });
      setMatchData({
        opponent: "",
        venue: "",
        date: "",
        result: "Won",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update player statistics",
        variant: "destructive",
      });
    },
  });

  const handleUpdateField = (playerId: number, field: keyof PerformanceData, value: string) => {
    const numValue = parseInt(value) || 0;
    dispatch({ type: 'UPDATE_FIELD', playerId, field, value: numValue });
  };

  const initializePlayerPerformance = (playerId: number) => {
    if (!performances[playerId]) {
      dispatch({ type: 'RESET_PLAYER', playerId });
    }
  };

  const handleSubmit = () => {
    if (!matchData.opponent || !matchData.venue || !matchData.date) {
      toast({
        title: "Error",
        description: "Please fill in all match details",
        variant: "destructive",
      });
      return;
    }

    const playerPerformances = Object.values(performances).filter(p => 
      p.runsScored > 0 || p.ballsFaced > 0 || p.wicketsTaken > 0 || 
      p.ballsBowled > 0 || p.catches > 0 || p.stumpings > 0 || p.runOuts > 0
    );

    if (playerPerformances.length === 0) {
      toast({
        title: "Error",
        description: "Please enter performance data for at least one player",
        variant: "destructive",
      });
      return;
    }

    updateStatsMutation.mutate({
      matchData,
      playerPerformances
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-blue-900 dark:text-blue-100 mb-2">
          Match Performance Entry
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Update player statistics after each match
        </p>
      </div>

      <div className="grid gap-6">
        {/* Match Details Entry */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Match Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="opponent">Opponent Team</Label>
                <Input
                  id="opponent"
                  value={matchData.opponent}
                  onChange={(e) => setMatchData({...matchData, opponent: e.target.value})}
                  placeholder="Enter opponent team name"
                />
              </div>
              <div>
                <Label htmlFor="venue">Venue</Label>
                <Input
                  id="venue"
                  value={matchData.venue}
                  onChange={(e) => setMatchData({...matchData, venue: e.target.value})}
                  placeholder="Enter venue name"
                />
              </div>
              <div>
                <Label htmlFor="date">Match Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={matchData.date}
                  onChange={(e) => setMatchData({...matchData, date: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="result">Match Result</Label>
                <Select value={matchData.result} onValueChange={(value: "Won" | "Lost" | "Draw") => setMatchData({...matchData, result: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Won">Won</SelectItem>
                    <SelectItem value="Lost">Lost</SelectItem>
                    <SelectItem value="Draw">Draw</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Playing 11 Selection */}
        {matchData.opponent && matchData.venue && matchData.date && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Select Playing 11
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {players.map((player) => (
                  <div
                    key={player.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedPlayers.includes(player.id)
                        ? "bg-blue-100 border-blue-500 dark:bg-blue-950"
                        : "hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`}
                    onClick={() => {
                      if (selectedPlayers.includes(player.id)) {
                        setSelectedPlayers(selectedPlayers.filter(id => id !== player.id));
                      } else if (selectedPlayers.length < 11) {
                        setSelectedPlayers([...selectedPlayers, player.id]);
                      }
                    }}
                  >
                    <div className="text-sm font-medium">{player.name}</div>
                    <div className="text-xs text-gray-500">#{player.jerseyNumber}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                Selected: {selectedPlayers.length}/11 players
              </div>
            </CardContent>
          </Card>
        )}

        {/* Player Performance Entry */}
        {selectedPlayers.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Player Performances
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {players.filter(player => selectedPlayers.includes(player.id)).map((player) => {
                  const performance = performances[player.id];
                  
                  return (
                    <div key={player.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                            <span className="font-bold text-blue-900 dark:text-blue-100">
                              {player.jerseyNumber || "?"}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-semibold">{player.name}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300">{player.role}</p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => initializePlayerPerformance(player.id)}
                        >
                          Add Performance
                        </Button>
                      </div>

                      {performance && (
                        <Tabs defaultValue="batting" className="w-full">
                          <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="batting" className="flex items-center gap-2">
                              <Activity className="h-4 w-4" />
                              Batting
                            </TabsTrigger>
                            <TabsTrigger value="bowling" className="flex items-center gap-2">
                              <Zap className="h-4 w-4" />
                              Bowling
                            </TabsTrigger>
                            <TabsTrigger value="fielding" className="flex items-center gap-2">
                              <Target className="h-4 w-4" />
                              Fielding
                            </TabsTrigger>
                          </TabsList>

                          <TabsContent value="batting" className="mt-4">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              <div>
                                <Label htmlFor={`runs-${player.id}`}>Runs Scored</Label>
                                <Input
                                  id={`runs-${player.id}`}
                                  type="number"
                                  min="0"
                                  value={performance.runsScored}
                                  onChange={(e) => handleUpdateField(player.id, 'runsScored', e.target.value)}
                                />
                              </div>
                              <div>
                                <Label htmlFor={`balls-${player.id}`}>Balls Faced</Label>
                                <Input
                                  id={`balls-${player.id}`}
                                  type="number"
                                  min="0"
                                  value={performance.ballsFaced}
                                  onChange={(e) => handleUpdateField(player.id, 'ballsFaced', e.target.value)}
                                />
                              </div>
                              <div>
                                <Label htmlFor={`fours-${player.id}`}>Fours</Label>
                                <Input
                                  id={`fours-${player.id}`}
                                  type="number"
                                  min="0"
                                  value={performance.fours}
                                  onChange={(e) => handleUpdateField(player.id, 'fours', e.target.value)}
                                />
                              </div>
                              <div>
                                <Label htmlFor={`sixes-${player.id}`}>Sixes</Label>
                                <Input
                                  id={`sixes-${player.id}`}
                                  type="number"
                                  min="0"
                                  value={performance.sixes}
                                  onChange={(e) => handleUpdateField(player.id, 'sixes', e.target.value)}
                                />
                              </div>
                            </div>
                          </TabsContent>

                          <TabsContent value="bowling" className="mt-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <Label htmlFor={`wickets-${player.id}`}>Wickets Taken</Label>
                                <Input
                                  id={`wickets-${player.id}`}
                                  type="number"
                                  min="0"
                                  value={performance.wicketsTaken}
                                  onChange={(e) => handleUpdateField(player.id, 'wicketsTaken', e.target.value)}
                                />
                              </div>
                              <div>
                                <Label htmlFor={`balls-bowled-${player.id}`}>Balls Bowled</Label>
                                <Input
                                  id={`balls-bowled-${player.id}`}
                                  type="number"
                                  min="0"
                                  value={performance.ballsBowled}
                                  onChange={(e) => handleUpdateField(player.id, 'ballsBowled', e.target.value)}
                                />
                              </div>
                              <div>
                                <Label htmlFor={`runs-conceded-${player.id}`}>Runs Conceded</Label>
                                <Input
                                  id={`runs-conceded-${player.id}`}
                                  type="number"
                                  min="0"
                                  value={performance.runsConceded}
                                  onChange={(e) => handleUpdateField(player.id, 'runsConceded', e.target.value)}
                                />
                              </div>
                            </div>
                          </TabsContent>

                          <TabsContent value="fielding" className="mt-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <Label htmlFor={`catches-${player.id}`}>Catches</Label>
                                <Input
                                  id={`catches-${player.id}`}
                                  type="number"
                                  min="0"
                                  value={performance.catches}
                                  onChange={(e) => handleUpdateField(player.id, 'catches', e.target.value)}
                                />
                              </div>
                              <div>
                                <Label htmlFor={`stumpings-${player.id}`}>Stumpings</Label>
                                <Input
                                  id={`stumpings-${player.id}`}
                                  type="number"
                                  min="0"
                                  value={performance.stumpings}
                                  onChange={(e) => handleUpdateField(player.id, 'stumpings', e.target.value)}
                                />
                              </div>
                              <div>
                                <Label htmlFor={`runouts-${player.id}`}>Run Outs</Label>
                                <Input
                                  id={`runouts-${player.id}`}
                                  type="number"
                                  min="0"
                                  value={performance.runOuts}
                                  onChange={(e) => handleUpdateField(player.id, 'runOuts', e.target.value)}
                                />
                              </div>
                            </div>
                          </TabsContent>
                        </Tabs>
                      )}
                    </div>
                  );
                })}

                <div className="flex justify-between pt-4">
                  <Button
                    variant="outline"
                    onClick={() => dispatch({ type: 'RESET_ALL' })}
                  >
                    Reset All
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={updateStatsMutation.isPending}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Trophy className="h-4 w-4 mr-2" />
                    {updateStatsMutation.isPending ? "Updating..." : "Update Player Stats"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}