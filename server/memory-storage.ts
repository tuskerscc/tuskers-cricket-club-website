import {
  type User, type InsertUser, type Team, type InsertTeam, type Player, type InsertPlayer,
  type Match, type InsertMatch, type Venue, type Competition, type Article, type InsertArticle,
  type SocialPost, type InsertSocialPost, type Poll, type InsertPoll, type Quiz, type InsertQuiz,
  type GalleryItem, type InsertGalleryItem, type Announcement, type InsertAnnouncement,
  type PlayerStats, type MatchPerformance, type InsertMatchPerformance, type TeamStats as TeamStatsType,
  type TriviaQuestion, type TriviaLeaderboard, type InsertTriviaLeaderboard,
  type ForumCategory, type ForumTopic, type InsertForumTopic, type ForumPost, type InsertForumPost,
  type CommunityEvent, type InsertCommunityEvent, type EventParticipant, type Lineup
} from "@shared/schema";

import { IStorage } from "./storage";

// In-memory data stores
const users: User[] = [];
const teams: Team[] = [
  { id: 1, name: "Tuskers Cricket Club", shortName: "TCC", logo: null, isOurTeam: true },
  { id: 2, name: "Royal Challengers", shortName: "RCB", logo: null, isOurTeam: false },
  { id: 3, name: "Chennai Super Kings", shortName: "CSK", logo: null, isOurTeam: false }
];

const venues: Venue[] = [
  { id: 1, name: "Tuskers Cricket Ground", location: "Stadium Road", capacity: 15000 },
  { id: 2, name: "City Sports Complex", location: "Downtown", capacity: 8000 }
];

const competitions: Competition[] = [
  { id: 1, name: "Local Premier League", shortName: "LPL", type: "league" },
  { id: 2, name: "City Championship", shortName: "CC", type: "tournament" }
];

const players: (Player & { stats?: PlayerStats })[] = [
  {
    id: 543,
    name: "Abilashan",
    jerseyNumber: 1,
    role: "Batsman",
    battingStyle: "Right-handed",
    bowlingStyle: null,
    bio: "Aggressive opening batsman with excellent timing",
    photo: null,
    isCaptain: false,
    isViceCaptain: false,
    dateOfBirth: new Date('1995-03-15'),
    stats: {
      id: 1,
      playerId: 543,
      matches: 25,
      runsScored: 1247,
      ballsFaced: 980,
      fours: 142,
      sixes: 28,
      wicketsTaken: 0,
      ballsBowled: 0,
      runsGiven: 0,
      catches: 15,
      stumpings: 0,
      runOuts: 3
    }
  },
  {
    id: 544,
    name: "Rajesh Sharma",
    jerseyNumber: 7,
    role: "Batsman",
    battingStyle: "Right-handed",
    bowlingStyle: null,
    bio: "Reliable middle-order batsman",
    photo: null,
    isCaptain: false,
    isViceCaptain: false,
    dateOfBirth: new Date('1992-08-22'),
    stats: {
      id: 2,
      playerId: 544,
      matches: 22,
      runsScored: 890,
      ballsFaced: 720,
      fours: 98,
      sixes: 15,
      wicketsTaken: 0,
      ballsBowled: 0,
      runsGiven: 0,
      catches: 12,
      stumpings: 0,
      runOuts: 2
    }
  },
  {
    id: 545,
    name: "Mohammed Ali",
    jerseyNumber: 11,
    role: "Bowler",
    battingStyle: "Right-handed",
    bowlingStyle: "Right-arm fast",
    bio: "Fast bowler with excellent pace and accuracy",
    photo: null,
    isCaptain: false,
    isViceCaptain: false,
    dateOfBirth: new Date('1994-12-10'),
    stats: {
      id: 3,
      playerId: 545,
      matches: 20,
      runsScored: 125,
      ballsFaced: 98,
      fours: 8,
      sixes: 2,
      wicketsTaken: 42,
      ballsBowled: 1200,
      runsGiven: 890,
      catches: 8,
      stumpings: 0,
      runOuts: 1
    }
  },
  {
    id: 546,
    name: "Vikram Singh",
    jerseyNumber: 10,
    role: "All-rounder",
    battingStyle: "Left-handed",
    bowlingStyle: "Left-arm spin",
    bio: "Dynamic all-rounder with good batting and bowling skills",
    photo: null,
    isCaptain: true,
    isViceCaptain: false,
    dateOfBirth: new Date('1990-05-18'),
    stats: {
      id: 4,
      playerId: 546,
      matches: 28,
      runsScored: 945,
      ballsFaced: 780,
      fours: 89,
      sixes: 22,
      wicketsTaken: 35,
      ballsBowled: 840,
      runsGiven: 670,
      catches: 18,
      stumpings: 0,
      runOuts: 4
    }
  }
];

const matches: (Match & { homeTeam: Team; awayTeam: Team; venue: Venue; competition: Competition })[] = [
  {
    id: 1,
    homeTeamId: 1,
    awayTeamId: 2,
    venueId: 1,
    competitionId: 1,
    dateTime: new Date('2024-03-15T14:00:00'),
    status: 'completed',
    result: 'Tuskers won by 6 wickets',
    homeTeamScore: '178/4 (18.2 overs)',
    awayTeamScore: '175/8 (20 overs)',
    homeTeam: teams[0],
    awayTeam: teams[1],
    venue: venues[0],
    competition: competitions[0]
  },
  {
    id: 2,
    homeTeamId: 2,
    awayTeamId: 1,
    venueId: 2,
    competitionId: 1,
    dateTime: new Date('2024-04-10T19:00:00'),
    status: 'upcoming',
    result: null,
    homeTeamScore: null,
    awayTeamScore: null,
    homeTeam: teams[1],
    awayTeam: teams[0],
    venue: venues[1],
    competition: competitions[0]
  }
];

const articles: Article[] = [
  {
    id: 108,
    title: "TATA IPL 2025, Qualifier 2: Tuskers vs Royal Challengers Preview",
    slug: "tata-ipl-2025-qualifier-2-preview",
    content: "An exciting qualifier match between Tuskers Cricket Club and Royal Challengers is set to take place. Both teams have shown exceptional form this season and are ready for an intense battle.",
    excerpt: "Preview of the upcoming qualifier match between Tuskers CC and Royal Challengers",
    featuredImage: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
    publishedAt: new Date('2024-03-10T10:00:00'),
    isFeatured: true,
    author: "Sports Desk",
    category: "Match Preview",
    isPublished: true,
    createdAt: new Date('2024-03-10T10:00:00')
  }
];

const galleryItems: GalleryItem[] = [
  {
    id: 4,
    title: "Training Session",
    description: "Players during an intense training session",
    imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    category: "training",
    uploadedAt: new Date('2024-03-01T10:00:00')
  }
];

const triviaQuestions: TriviaQuestion[] = [
  {
    id: 16,
    question: "Who holds the record for the highest individual score in Test cricket?",
    options: ["Brian Lara", "Don Bradman", "Virat Kohli", "Sachin Tendulkar"],
    correctAnswer: "Brian Lara",
    difficulty: "medium",
    category: "records"
  }
];

const announcements: Announcement[] = [];
const socialPosts: SocialPost[] = [];
const polls: Poll[] = [];
const quizzes: Quiz[] = [];
const triviaLeaderboard: TriviaLeaderboard[] = [];
const forumCategories: ForumCategory[] = [];
const forumTopics: ForumTopic[] = [];
const forumPosts: ForumPost[] = [];
const communityEvents: CommunityEvent[] = [];
const eventParticipants: EventParticipant[] = [];
const matchPerformances: MatchPerformance[] = [];
const lineup: Lineup[] = [];

let nextId = 1000;

export class MemoryStorage implements IStorage {
  // Users
  async getUser(id: number): Promise<User | undefined> {
    return users.find(user => user.id === id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return users.find(user => user.username === username);
  }

  async createUser(user: InsertUser): Promise<User> {
    const newUser: User = { ...user, id: nextId++, createdAt: new Date() };
    users.push(newUser);
    return newUser;
  }

  // Teams
  async getTeams(): Promise<Team[]> {
    return teams;
  }

  async getTeam(id: number): Promise<Team | undefined> {
    return teams.find(team => team.id === id);
  }

  async createTeam(team: InsertTeam): Promise<Team> {
    const newTeam: Team = { ...team, id: nextId++ };
    teams.push(newTeam);
    return newTeam;
  }

  async getTuskersTeam(): Promise<Team | undefined> {
    return teams.find(team => team.isOurTeam);
  }

  // Players
  async getPlayers(): Promise<(Player & { stats?: PlayerStats })[]> {
    return players;
  }

  async getPlayer(id: number): Promise<(Player & { stats?: PlayerStats }) | undefined> {
    return players.find(player => player.id === id);
  }

  async createPlayer(player: InsertPlayer): Promise<Player> {
    const newPlayer: Player = { 
      ...player, 
      id: nextId++,
      dateOfBirth: player.dateOfBirth || new Date()
    };
    players.push(newPlayer);
    return newPlayer;
  }

  async updatePlayer(id: number, player: Partial<InsertPlayer>): Promise<void> {
    const index = players.findIndex(p => p.id === id);
    if (index !== -1) {
      players[index] = { ...players[index], ...player };
    }
  }

  async deletePlayer(id: number): Promise<void> {
    const index = players.findIndex(p => p.id === id);
    if (index !== -1) {
      players.splice(index, 1);
    }
  }

  async deleteAllPlayers(): Promise<void> {
    players.length = 0;
  }

  async getStartingLineup(matchId: number): Promise<(Lineup & { player: Player })[]> {
    return lineup
      .filter(l => l.matchId === matchId)
      .map(l => {
        const player = players.find(p => p.id === l.playerId);
        return { ...l, player: player! };
      })
      .filter(l => l.player);
  }

  // Matches
  async getMatches(): Promise<(Match & { homeTeam: Team; awayTeam: Team; venue: Venue; competition: Competition })[]> {
    return matches;
  }

  async getMatch(id: number): Promise<(Match & { homeTeam: Team; awayTeam: Team; venue: Venue; competition: Competition }) | undefined> {
    return matches.find(match => match.id === id);
  }

  async createMatch(match: InsertMatch): Promise<Match> {
    const newMatch: Match = { ...match, id: nextId++ };
    matches.push({
      ...newMatch,
      homeTeam: teams.find(t => t.id === match.homeTeamId)!,
      awayTeam: teams.find(t => t.id === match.awayTeamId)!,
      venue: venues.find(v => v.id === match.venueId)!,
      competition: competitions.find(c => c.id === match.competitionId)!
    });
    return newMatch;
  }

  async updateMatch(id: number, match: Partial<InsertMatch>): Promise<void> {
    const index = matches.findIndex(m => m.id === id);
    if (index !== -1) {
      matches[index] = { ...matches[index], ...match };
    }
  }

  async getLiveMatches(): Promise<(Match & { homeTeam: Team; awayTeam: Team })[]> {
    return matches.filter(match => match.status === 'live');
  }

  async getUpcomingMatches(): Promise<(Match & { homeTeam: Team; awayTeam: Team; venue: Venue })[]> {
    return matches.filter(match => match.status === 'upcoming');
  }

  async getRecentMatches(): Promise<(Match & { homeTeam: Team; awayTeam: Team })[]> {
    return matches.filter(match => match.status === 'completed').slice(0, 5);
  }

  // Articles
  async getArticles(): Promise<Article[]> {
    return articles.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
  }

  async getArticle(id: number): Promise<Article | undefined> {
    return articles.find(article => article.id === id);
  }

  async getArticleBySlug(slug: string): Promise<Article | undefined> {
    return articles.find(article => article.slug === slug);
  }

  async createArticle(article: InsertArticle): Promise<Article> {
    const newArticle: Article = { 
      ...article, 
      id: nextId++,
      publishedAt: article.publishedAt || new Date()
    };
    articles.push(newArticle);
    return newArticle;
  }

  async updateArticle(id: number, article: Partial<InsertArticle>): Promise<void> {
    const index = articles.findIndex(a => a.id === id);
    if (index !== -1) {
      articles[index] = { ...articles[index], ...article };
    }
  }

  async deleteArticle(id: number): Promise<void> {
    const index = articles.findIndex(a => a.id === id);
    if (index !== -1) {
      articles.splice(index, 1);
    }
  }

  async getFeaturedArticles(): Promise<Article[]> {
    return articles.filter(article => article.isFeatured).slice(0, 3);
  }

  // Social Posts
  async getSocialPosts(): Promise<SocialPost[]> {
    return socialPosts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createSocialPost(post: InsertSocialPost): Promise<SocialPost> {
    const newPost: SocialPost = { 
      ...post, 
      id: nextId++,
      createdAt: new Date()
    };
    socialPosts.push(newPost);
    return newPost;
  }

  // Polls
  async getActivePolls(): Promise<Poll[]> {
    return polls.filter(poll => poll.isActive);
  }

  async getPoll(id: number): Promise<Poll | undefined> {
    return polls.find(poll => poll.id === id);
  }

  async createPoll(poll: InsertPoll): Promise<Poll> {
    const newPoll: Poll = { 
      ...poll, 
      id: nextId++,
      createdAt: new Date()
    };
    polls.push(newPoll);
    return newPoll;
  }

  async updatePoll(id: number, poll: Partial<InsertPoll>): Promise<void> {
    const index = polls.findIndex(p => p.id === id);
    if (index !== -1) {
      polls[index] = { ...polls[index], ...poll };
    }
  }

  // Quizzes
  async getActiveQuizzes(): Promise<Quiz[]> {
    return quizzes.filter(quiz => quiz.isActive);
  }

  async getQuiz(id: number): Promise<Quiz | undefined> {
    return quizzes.find(quiz => quiz.id === id);
  }

  async createQuiz(quiz: InsertQuiz): Promise<Quiz> {
    const newQuiz: Quiz = { 
      ...quiz, 
      id: nextId++,
      createdAt: new Date()
    };
    quizzes.push(newQuiz);
    return newQuiz;
  }

  // Gallery
  async getGalleryItems(): Promise<GalleryItem[]> {
    return galleryItems.sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime());
  }

  async createGalleryItem(item: InsertGalleryItem): Promise<GalleryItem> {
    const newItem: GalleryItem = { 
      ...item, 
      id: nextId++,
      uploadedAt: new Date()
    };
    galleryItems.push(newItem);
    return newItem;
  }

  async deleteGalleryItem(id: number): Promise<void> {
    const index = galleryItems.findIndex(item => item.id === id);
    if (index !== -1) {
      galleryItems.splice(index, 1);
    }
  }

  // Announcements
  async getAnnouncements(): Promise<Announcement[]> {
    return announcements.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createAnnouncement(announcement: InsertAnnouncement): Promise<Announcement> {
    const newAnnouncement: Announcement = { 
      ...announcement, 
      id: nextId++,
      createdAt: new Date()
    };
    announcements.push(newAnnouncement);
    return newAnnouncement;
  }

  // Player Stats
  async updatePlayerStats(playerId: number, stats: Partial<PlayerStats>): Promise<void> {
    const player = players.find(p => p.id === playerId);
    if (player && player.stats) {
      player.stats = { ...player.stats, ...stats };
    }
  }

  // Match Performances
  async createMatchPerformance(performance: InsertMatchPerformance): Promise<MatchPerformance> {
    const newPerformance: MatchPerformance = { ...performance, id: nextId++ };
    matchPerformances.push(newPerformance);
    return newPerformance;
  }

  async getMatchPerformances(matchId: number): Promise<(MatchPerformance & { player: Player })[]> {
    return matchPerformances
      .filter(mp => mp.matchId === matchId)
      .map(mp => {
        const player = players.find(p => p.id === mp.playerId);
        return { ...mp, player: player! };
      })
      .filter(mp => mp.player);
  }

  async updatePlayerStatsFromMatch(matchId: number, playerPerformances: InsertMatchPerformance[]): Promise<void> {
    // Update player stats based on match performances
    for (const performance of playerPerformances) {
      const player = players.find(p => p.id === performance.playerId);
      if (player && player.stats) {
        player.stats.runsScored = (player.stats.runsScored || 0) + (performance.runsScored || 0);
        player.stats.ballsFaced = (player.stats.ballsFaced || 0) + (performance.ballsFaced || 0);
        player.stats.wicketsTaken = (player.stats.wicketsTaken || 0) + (performance.wicketsTaken || 0);
      }
    }
  }

  // Statistics
  async getTeamStats(): Promise<{
    matchesWon: number;
    totalMatches: number;
    totalRuns: number;
    wicketsTaken: number;
    totalOvers: number;
    runsAgainst: number;
    oversAgainst: number;
    nrr: number;
  }> {
    const completedMatches = matches.filter(m => m.status === 'completed');
    const matchesWon = completedMatches.filter(m => 
      m.result?.toLowerCase().includes('tuskers') && m.result?.toLowerCase().includes('won')
    ).length;

    return {
      matchesWon,
      totalMatches: completedMatches.length,
      totalRuns: 2840,
      wicketsTaken: 45,
      totalOvers: 120,
      runsAgainst: 2650,
      oversAgainst: 120,
      nrr: 1.58
    };
  }

  async updateTeamStats(data: {
    matchesWon: number;
    totalMatches: number;
    totalRuns: number;
    wicketsTaken: number;
    totalOvers: number;
    runsAgainst: number;
    oversAgainst: number;
  }): Promise<void> {
    // In memory storage - stats are calculated dynamically
  }

  // Trivia
  async getTriviaQuestions(): Promise<TriviaQuestion[]> {
    return triviaQuestions;
  }

  async getTriviaLeaderboard(): Promise<TriviaLeaderboard[]> {
    return triviaLeaderboard.sort((a, b) => b.score - a.score).slice(0, 10);
  }

  async submitTriviaScore(entry: InsertTriviaLeaderboard): Promise<TriviaLeaderboard> {
    const newEntry: TriviaLeaderboard = { 
      ...entry, 
      id: nextId++,
      submittedAt: new Date()
    };
    triviaLeaderboard.push(newEntry);
    return newEntry;
  }

  // Forum
  async getForumCategories(): Promise<ForumCategory[]> {
    return forumCategories;
  }

  async getForumTopics(categoryId?: number): Promise<ForumTopic[]> {
    return categoryId 
      ? forumTopics.filter(topic => topic.categoryId === categoryId)
      : forumTopics;
  }

  async getForumTopic(slug: string): Promise<ForumTopic | undefined> {
    return forumTopics.find(topic => topic.slug === slug);
  }

  async createForumTopic(topic: InsertForumTopic): Promise<ForumTopic> {
    const newTopic: ForumTopic = { 
      ...topic, 
      id: nextId++,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    forumTopics.push(newTopic);
    return newTopic;
  }

  async getForumPosts(topicId: number): Promise<ForumPost[]> {
    return forumPosts.filter(post => post.topicId === topicId);
  }

  async createForumPost(post: InsertForumPost): Promise<ForumPost> {
    const newPost: ForumPost = { 
      ...post, 
      id: nextId++,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    forumPosts.push(newPost);
    return newPost;
  }

  async getForumStats(): Promise<{ totalTopics: number; totalPosts: number; totalMembers: number }> {
    return {
      totalTopics: forumTopics.length,
      totalPosts: forumPosts.length,
      totalMembers: users.length
    };
  }

  // Community Events
  async getCommunityEvents(): Promise<CommunityEvent[]> {
    return communityEvents.sort((a, b) => a.eventDate.getTime() - b.eventDate.getTime());
  }

  async createCommunityEvent(event: InsertCommunityEvent): Promise<CommunityEvent> {
    const newEvent: CommunityEvent = { 
      ...event, 
      id: nextId++,
      createdAt: new Date()
    };
    communityEvents.push(newEvent);
    return newEvent;
  }

  async joinCommunityEvent(eventId: number, userId: number): Promise<EventParticipant> {
    const participant: EventParticipant = {
      id: nextId++,
      eventId,
      userId,
      joinedAt: new Date()
    };
    eventParticipants.push(participant);
    return participant;
  }

  async leaveCommunityEvent(eventId: number, userId: number): Promise<void> {
    const index = eventParticipants.findIndex(p => p.eventId === eventId && p.userId === userId);
    if (index !== -1) {
      eventParticipants.splice(index, 1);
    }
  }

  async getCommunityStats(): Promise<{ activeMembersCount: number }> {
    return {
      activeMembersCount: users.filter(user => user.role === 'member').length
    };
  }
}