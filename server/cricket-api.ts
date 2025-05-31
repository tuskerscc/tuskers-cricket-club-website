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
  // Return empty array - no external API dependencies
  return [];
}

export async function getRecentMatches(): Promise<LiveMatch[]> {
  // Return empty array - no external API dependencies  
  return [];
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