const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY || "0958181a25mshdd91bd784761359p1fbc29jsnbeae1a0d580f";
const RAPIDAPI_HOST = process.env.CRICKET_API_HOST || "free-cricbuzz-cricket-api.p.rapidapi.com";

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

export function generateCricketPoll() {
  const historicalPolls = [
    {
      question: "Which team has won the most Cricket World Cup titles?",
      options: ["Australia", "West Indies", "India", "England"],
      context: "Cricket World Cup History",
      isLive: false
    },
    {
      question: "Who holds the record for the highest individual score in Test cricket?",
      options: ["Brian Lara (400*)", "Matthew Hayden (380)", "Mahela Jayawardene (374)", "Don Bradman (334)"],
      context: "Test Cricket Records",
      isLive: false
    },
    {
      question: "Which venue is known as the 'Home of Cricket'?",
      options: ["Lord's Cricket Ground", "Melbourne Cricket Ground", "Eden Gardens", "The Oval"],
      context: "Cricket Venues",
      isLive: false
    },
    {
      question: "Who was the first cricketer to score 10,000 runs in ODI cricket?",
      options: ["Sachin Tendulkar", "Sunil Gavaskar", "Allan Border", "Javed Miandad"],
      context: "ODI Cricket Milestones",
      isLive: false
    },
    {
      question: "Which team won the inaugural T20 World Cup in 2007?",
      options: ["India", "Pakistan", "Australia", "South Africa"],
      context: "T20 Cricket History",
      isLive: false
    }
  ];

  return historicalPolls[Math.floor(Math.random() * historicalPolls.length)];
}

export function generateCricketQuiz() {
  const historicalQuizzes = [
    {
      question: "Who holds the record for the highest individual score in Test cricket?",
      options: ["Brian Lara (400*)", "Matthew Hayden (380)", "Don Bradman (334)", "Virat Kohli (254*)"],
      correct: "Brian Lara (400*)",
      context: "Test Cricket Records - Trinidad 2004"
    },
    {
      question: "Which country won the first Cricket World Cup in 1975?",
      options: ["West Indies", "Australia", "England", "India"],
      correct: "West Indies",
      context: "Cricket World Cup History - Lord's 1975"
    },
    {
      question: "Who has taken the most wickets in international cricket (all formats)?",
      options: ["Muttiah Muralitharan (1347)", "Shane Warne (1001)", "Anil Kumble (956)", "James Anderson (900+)"],
      correct: "Muttiah Muralitharan (1347)",
      context: "International Cricket Records"
    },
    {
      question: "Which batsman scored the first double century in ODI cricket?",
      options: ["Sachin Tendulkar", "Rohit Sharma", "Virender Sehwag", "Chris Gayle"],
      correct: "Sachin Tendulkar",
      context: "ODI Cricket Milestones - Gwalior 2010"
    },
    {
      question: "What is the fastest recorded delivery in cricket history?",
      options: ["161.3 km/h (Shoaib Akhtar)", "158.8 km/h (Brett Lee)", "157.7 km/h (Jeff Thomson)", "156.2 km/h (Mitchell Starc)"],
      correct: "161.3 km/h (Shoaib Akhtar)",
      context: "Bowling Records - 2003 World Cup"
    },
    {
      question: "Which team has won the most Ashes series?",
      options: ["Australia (34)", "England (32)", "Australia (35)", "England (33)"],
      correct: "Australia (34)",
      context: "The Ashes History - 1882-2023"
    }
  ];

  return historicalQuizzes[Math.floor(Math.random() * historicalQuizzes.length)];
}