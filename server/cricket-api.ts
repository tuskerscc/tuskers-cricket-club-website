const RAPIDAPI_KEY = "0958181a25mshdd91bd784761359p1fbc29jsnbeae1a0d580f";
const RAPIDAPI_HOST = "free-cricbuzz-cricket-api.p.rapidapi.com";

interface LiveMatch {
  id: string;
  name: string;
  matchType: string;
  status: string;
  venue: string;
  teams: {
    team1: { name: string; shortName: string; };
    team2: { name: string; shortName: string; };
  };
  scores?: {
    team1?: { runs: number; wickets: number; overs: string; };
    team2?: { runs: number; wickets: number; overs: string; };
  };
  currentBatsmen?: Array<{
    name: string;
    runs: number;
    balls: number;
  }>;
  currentBowler?: {
    name: string;
    overs: string;
    runs: number;
    wickets: number;
  };
}

export async function getLiveMatches(): Promise<LiveMatch[]> {
  try {
    const response = await fetch("https://free-cricbuzz-cricket-api.p.rapidapi.com/cricket-livescores", {
      method: "GET",
      headers: {
        "x-rapidapi-key": RAPIDAPI_KEY,
        "x-rapidapi-host": RAPIDAPI_HOST,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Live cricket data received:", JSON.stringify(data, null, 2));
    
    // Transform the API response to our format
    const matches: LiveMatch[] = [];
    
    // Handle different possible response structures
    if (data && Array.isArray(data)) {
      for (const match of data) {
        if (match.status && match.status.toLowerCase().includes('live')) {
          matches.push({
            id: match.id || Math.random().toString(),
            name: match.title || match.name || `${match.team1} vs ${match.team2}`,
            matchType: match.format || match.matchType || "International",
            status: match.status || "Live",
            venue: match.venue || "Unknown Venue",
            teams: {
              team1: {
                name: match.team1 || match.teams?.team1?.name || "Team 1",
                shortName: match.team1_short || match.teams?.team1?.shortName || "T1"
              },
              team2: {
                name: match.team2 || match.teams?.team2?.name || "Team 2", 
                shortName: match.team2_short || match.teams?.team2?.shortName || "T2"
              }
            },
            scores: match.scores ? {
              team1: match.scores.team1 ? {
                runs: match.scores.team1.runs || 0,
                wickets: match.scores.team1.wickets || 0,
                overs: match.scores.team1.overs || "0.0"
              } : undefined,
              team2: match.scores.team2 ? {
                runs: match.scores.team2.runs || 0,
                wickets: match.scores.team2.wickets || 0,
                overs: match.scores.team2.overs || "0.0"
              } : undefined
            } : undefined
          });
        }
      }
    } else if (data && data.matches) {
      // Handle if the response has a matches property
      for (const match of data.matches) {
        matches.push({
          id: match.id || Math.random().toString(),
          name: match.title || match.name || `${match.team1} vs ${match.team2}`,
          matchType: match.format || "International",
          status: match.status || "Live",
          venue: match.venue || "Unknown Venue",
          teams: {
            team1: {
              name: match.team1 || "Team 1",
              shortName: match.team1_short || "T1"
            },
            team2: {
              name: match.team2 || "Team 2",
              shortName: match.team2_short || "T2"
            }
          }
        });
      }
    }

    return matches.slice(0, 5); // Return top 5 live matches
  } catch (error) {
    console.error("Error fetching live matches:", error);
    return [];
  }
}

export async function getRecentMatches(): Promise<LiveMatch[]> {
  try {
    const response = await fetch("https://cricbuzz-cricket.p.rapidapi.com/matches/v1/recent", {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": RAPIDAPI_KEY,
        "X-RapidAPI-Host": RAPIDAPI_HOST,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Transform recent matches data similar to live matches
    const matches: LiveMatch[] = [];
    
    if (data.typeMatches) {
      for (const typeMatch of data.typeMatches) {
        if (typeMatch.seriesMatches) {
          for (const seriesMatch of typeMatch.seriesMatches) {
            if (seriesMatch.seriesAdWrapper?.matches) {
              for (const match of seriesMatch.seriesAdWrapper.matches) {
                matches.push({
                  id: match.matchInfo.matchId.toString(),
                  name: match.matchInfo.matchDesc || `${match.matchInfo.team1?.teamSName} vs ${match.matchInfo.team2?.teamSName}`,
                  matchType: match.matchInfo.matchFormat || "Unknown",
                  status: match.matchInfo.status || "Completed",
                  venue: match.matchInfo.venueInfo?.ground || "Unknown Venue",
                  teams: {
                    team1: {
                      name: match.matchInfo.team1?.teamName || "Team 1",
                      shortName: match.matchInfo.team1?.teamSName || "T1"
                    },
                    team2: {
                      name: match.matchInfo.team2?.teamName || "Team 2",
                      shortName: match.matchInfo.team2?.teamSName || "T2"
                    }
                  }
                });
              }
            }
          }
        }
      }
    }

    return matches.slice(0, 10); // Return top 10 recent matches
  } catch (error) {
    console.error("Error fetching recent matches:", error);
    return [];
  }
}

export function generateLivePoll(matches: LiveMatch[]) {
  if (matches.length === 0) {
    return {
      question: "Which team do you think will win the next big international series?",
      options: ["India", "Australia", "England", "Pakistan"],
      isLive: false
    };
  }

  const liveMatch = matches[0];
  
  return {
    question: `Who will win the live ${liveMatch.matchType} match: ${liveMatch.teams.team1.shortName} vs ${liveMatch.teams.team2.shortName}?`,
    options: [
      liveMatch.teams.team1.name,
      liveMatch.teams.team2.name,
      "Draw/Tie",
      "Too close to call"
    ],
    isLive: true,
    matchInfo: {
      venue: liveMatch.venue,
      status: liveMatch.status,
      scores: liveMatch.scores
    }
  };
}

export function generateLiveQuiz(matches: LiveMatch[]) {
  const quizzes = [
    {
      question: "Who holds the record for the highest individual score in Test cricket?",
      options: ["Brian Lara", "Matthew Hayden", "Don Bradman", "Virat Kohli"],
      correct: "Brian Lara"
    },
    {
      question: "Which country won the first Cricket World Cup in 1975?",
      options: ["West Indies", "Australia", "England", "India"],
      correct: "West Indies"
    },
    {
      question: "What is the maximum number of players allowed on the field for the fielding team?",
      options: ["10", "11", "12", "9"],
      correct: "11"
    },
    {
      question: "Who has taken the most wickets in international cricket?",
      options: ["Muttiah Muralitharan", "Shane Warne", "Anil Kumble", "James Anderson"],
      correct: "Muttiah Muralitharan"
    }
  ];

  if (matches.length > 0) {
    const liveMatch = matches[0];
    return {
      ...quizzes[Math.floor(Math.random() * quizzes.length)],
      context: `Live Match Context: ${liveMatch.teams.team1.shortName} vs ${liveMatch.teams.team2.shortName}`,
      isLive: true
    };
  }

  return {
    ...quizzes[Math.floor(Math.random() * quizzes.length)],
    isLive: false
  };
}