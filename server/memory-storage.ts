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

// In-memory data stores - cleared for fresh start
const users: User[] = [];
const teams: Team[] = [
  { id: 1, name: "Tuskers Cricket Club", shortName: "TCC", logo: null, isOurTeam: true }
];

const venues: Venue[] = [];
const competitions: Competition[] = [];
const players: (Player & { stats?: PlayerStats })[] = [];
const matches: (Match & { homeTeam: Team; awayTeam: Team; venue: Venue; competition: Competition })[] = [];
const articles: Article[] = [];
const galleryItems: GalleryItem[] = [];
const triviaQuestions: TriviaQuestion[] = [];

const announcements: Announcement[] = [
  {
    id: 1,
    title: "Welcome to Tuskers Cricket Club Official Website",
    content: "We are excited to launch our new official website with enhanced features including live match updates, player statistics, and community forum. Stay connected with us for all the latest news and updates!",
    type: "general",
    priority: "high",
    isActive: true,
    createdAt: new Date('2024-01-15'),
  },
  {
    id: 2,
    title: "Upcoming Match: Tuskers vs Lightning Bolts",
    content: "Get ready for an exciting match this Saturday at 2:00 PM at our home ground. Team selection and strategy discussions are underway. Come support your favorite team!",
    type: "match",
    priority: "medium",
    isActive: true,
    createdAt: new Date('2024-01-20'),
  },
  {
    id: 3,
    title: "Training Session Schedule Updated",
    content: "New training schedule is now available. All players are required to attend the practice sessions starting Monday. Please check with the coaching staff for detailed timings.",
    type: "training",
    priority: "medium",
    isActive: true,
    createdAt: new Date('2024-01-22'),
  }
];
const socialPosts: SocialPost[] = [];
const polls: Poll[] = [];
const quizzes: Quiz[] = [];
const triviaLeaderboard: TriviaLeaderboard[] = [];
const forumCategories: ForumCategory[] = [
  {
    id: 1,
    name: "Official News & Announcements",
    description: "Official club news, match announcements, and important updates",
    color: "#1e3a8a",
    icon: "📢",
    sortOrder: 1,
    isActive: true,
    createdAt: new Date()
  },
  {
    id: 2,
    name: "Match Day Hub",
    description: "Live match discussions, match previews, and post-match analysis",
    color: "#dc2626",
    icon: "🏏",
    sortOrder: 2,
    isActive: true,
    createdAt: new Date()
  },
  {
    id: 3,
    name: "Training Ground & Coaching",
    description: "Training tips, coaching advice, and skill development discussions",
    color: "#059669",
    icon: "🎯",
    sortOrder: 3,
    isActive: true,
    createdAt: new Date()
  },
  {
    id: 4,
    name: "The Pavilion (General Discussion)",
    description: "General cricket chat, club activities, and community discussions",
    color: "#7c3aed",
    icon: "💬",
    sortOrder: 4,
    isActive: true,
    createdAt: new Date()
  },
  {
    id: 5,
    name: "Get Involved: Volunteering & Club Support",
    description: "Volunteer opportunities, club events, and ways to support the team",
    color: "#ea580c",
    icon: "🤝",
    sortOrder: 5,
    isActive: true,
    createdAt: new Date()
  },
  {
    id: 6,
    name: "Suggestions & Feedback",
    description: "Your ideas for improving the club and website feedback",
    color: "#0891b2",
    icon: "💡",
    sortOrder: 6,
    isActive: true,
    createdAt: new Date()
  }
];
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

  async updateAnnouncement(id: number, announcement: Partial<InsertAnnouncement>): Promise<void> {
    const index = announcements.findIndex(a => a.id === id);
    if (index !== -1) {
      announcements[index] = { ...announcements[index], ...announcement };
    }
  }

  async deleteAnnouncement(id: number): Promise<void> {
    const index = announcements.findIndex(a => a.id === id);
    if (index !== -1) {
      announcements.splice(index, 1);
    }
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
    winningRate: number;
  }> {
    const completedMatches = matches.filter(m => m.status === 'completed');
    const matchesWon = completedMatches.filter(m => 
      m.result?.toLowerCase().includes('tuskers') && m.result?.toLowerCase().includes('won')
    ).length;

    // Calculate total runs by summing player stats
    const allPlayerStats = players.map(p => p.stats).filter(s => s !== undefined);
    const totalRuns = allPlayerStats.reduce((sum, stats) => sum + (stats?.runsScored || 0), 0);
    const wicketsTaken = allPlayerStats.reduce((sum, stats) => sum + (stats?.wicketsTaken || 0), 0);

    // Calculate winning rate (percentage)
    const winningRate = completedMatches.length > 0 ? (matchesWon / completedMatches.length) * 100 : 0;

    // For NRR calculation, we'll use estimated values based on matches
    // In real implementation, you'd store overs data for each match
    const totalOvers = completedMatches.length * 20; // Assuming T20 format
    const runsAgainst = totalRuns * 0.85; // Estimated opponent runs (can be updated with real data)
    const oversAgainst = totalOvers;

    // Calculate NRR: (Runs scored / Overs faced) - (Runs conceded / Overs bowled)
    const runRate = totalOvers > 0 ? totalRuns / totalOvers : 0;
    const runRateAgainst = oversAgainst > 0 ? runsAgainst / oversAgainst : 0;
    const nrr = runRate - runRateAgainst;

    return {
      matchesWon,
      totalMatches: completedMatches.length,
      totalRuns,
      wicketsTaken,
      totalOvers,
      runsAgainst,
      oversAgainst,
      nrr: Number(nrr.toFixed(3)),
      winningRate: Number(winningRate.toFixed(1))
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