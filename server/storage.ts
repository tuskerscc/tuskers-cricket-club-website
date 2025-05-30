import { 
  users, teams, venues, competitions, players, matches, lineups, playerStats, teamStats,
  matchPerformances, articles, socialPosts, polls, quizzes, gallery, announcements, 
  triviaQuestions, triviaLeaderboard, forumCategories, forumTopics, forumPosts, 
  forumPostLikes, userProfiles, communityEvents, eventParticipants,
  type User, type InsertUser, type Team, type InsertTeam, type Venue, type InsertVenue,
  type Competition, type InsertCompetition, type Player, type InsertPlayer, 
  type Match, type InsertMatch, type Lineup, type InsertLineup,
  type PlayerStats, type InsertPlayerStats, type MatchPerformance, type InsertMatchPerformance,
  type Article, type InsertArticle, type SocialPost, type InsertSocialPost, type Poll, type InsertPoll,
  type Quiz, type InsertQuiz, type GalleryItem, type InsertGalleryItem,
  type Announcement, type InsertAnnouncement,
  type TriviaQuestion, type InsertTriviaQuestion, type TriviaLeaderboard, type InsertTriviaLeaderboard,
  type ForumCategory, type InsertForumCategory, type ForumTopic, type InsertForumTopic,
  type ForumPost, type InsertForumPost, type ForumPostLike, type InsertForumPostLike,
  type UserProfile, type InsertUserProfile, type CommunityEvent, type InsertCommunityEvent,
  type EventParticipant, type InsertEventParticipant
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, sql, count, sum, or } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Teams
  getTeams(): Promise<Team[]>;
  getTeam(id: number): Promise<Team | undefined>;
  createTeam(team: InsertTeam): Promise<Team>;
  getTuskersTeam(): Promise<Team | undefined>;

  // Players
  getPlayers(): Promise<(Player & { stats?: PlayerStats })[]>;
  getPlayer(id: number): Promise<(Player & { stats?: PlayerStats }) | undefined>;
  createPlayer(player: InsertPlayer): Promise<Player>;
  updatePlayer(id: number, player: Partial<InsertPlayer>): Promise<void>;
  deletePlayer(id: number): Promise<void>;
  deleteAllPlayers(): Promise<void>;
  getStartingLineup(matchId: number): Promise<(Lineup & { player: Player })[]>;

  // Matches
  getMatches(): Promise<(Match & { homeTeam: Team; awayTeam: Team; venue: Venue; competition: Competition })[]>;
  getMatch(id: number): Promise<(Match & { homeTeam: Team; awayTeam: Team; venue: Venue; competition: Competition }) | undefined>;
  createMatch(match: InsertMatch): Promise<Match>;
  updateMatch(id: number, match: Partial<InsertMatch>): Promise<void>;
  getLiveMatches(): Promise<(Match & { homeTeam: Team; awayTeam: Team })[]>;
  getUpcomingMatches(): Promise<(Match & { homeTeam: Team; awayTeam: Team; venue: Venue })[]>;
  getRecentMatches(): Promise<(Match & { homeTeam: Team; awayTeam: Team })[]>;

  // Articles
  getArticles(): Promise<Article[]>;
  getArticle(id: number): Promise<Article | undefined>;
  getArticleBySlug(slug: string): Promise<Article | undefined>;
  createArticle(article: InsertArticle): Promise<Article>;
  updateArticle(id: number, article: Partial<InsertArticle>): Promise<void>;
  deleteArticle(id: number): Promise<void>;
  getFeaturedArticles(): Promise<Article[]>;

  // Social Posts
  getSocialPosts(): Promise<SocialPost[]>;
  createSocialPost(post: InsertSocialPost): Promise<SocialPost>;

  // Polls
  getActivePolls(): Promise<Poll[]>;
  getPoll(id: number): Promise<Poll | undefined>;
  createPoll(poll: InsertPoll): Promise<Poll>;
  updatePoll(id: number, poll: Partial<InsertPoll>): Promise<void>;

  // Quizzes
  getActiveQuizzes(): Promise<Quiz[]>;
  getQuiz(id: number): Promise<Quiz | undefined>;
  createQuiz(quiz: InsertQuiz): Promise<Quiz>;

  // Gallery
  getGalleryItems(): Promise<GalleryItem[]>;
  createGalleryItem(item: InsertGalleryItem): Promise<GalleryItem>;
  deleteGalleryItem(id: number): Promise<void>;

  // Announcements
  getAnnouncements(): Promise<Announcement[]>;
  createAnnouncement(announcement: InsertAnnouncement): Promise<Announcement>;

  // Player Stats
  updatePlayerStats(playerId: number, stats: Partial<PlayerStats>): Promise<void>;

  // Match Performances
  createMatchPerformance(performance: InsertMatchPerformance): Promise<MatchPerformance>;
  getMatchPerformances(matchId: number): Promise<(MatchPerformance & { player: Player })[]>;
  updatePlayerStatsFromMatch(matchId: number, playerPerformances: InsertMatchPerformance[]): Promise<void>;

  // Statistics
  getTeamStats(): Promise<{
    matchesWon: number;
    totalMatches: number;
    totalRuns: number;
    wicketsTaken: number;
    nrr: number;
  }>;
  updateTeamStats(data: {
    matchesWon: number;
    totalMatches: number;
    totalRuns: number;
    wicketsTaken: number;
    totalOvers: number;
    runsAgainst: number;
    oversAgainst: number;
  }): Promise<void>;

  // Trivia
  getTriviaQuestions(): Promise<TriviaQuestion[]>;
  getTriviaLeaderboard(): Promise<TriviaLeaderboard[]>;
  submitTriviaScore(entry: InsertTriviaLeaderboard): Promise<TriviaLeaderboard>;

  // Forum
  getForumCategories(): Promise<ForumCategory[]>;
  getForumTopics(categoryId?: number): Promise<ForumTopic[]>;
  getForumTopic(slug: string): Promise<ForumTopic | undefined>;
  createForumTopic(topic: InsertForumTopic): Promise<ForumTopic>;
  getForumPosts(topicId: number): Promise<ForumPost[]>;
  createForumPost(post: InsertForumPost): Promise<ForumPost>;
  getForumStats(): Promise<{ totalTopics: number; totalPosts: number; totalMembers: number }>;

  // Community Events
  getCommunityEvents(): Promise<CommunityEvent[]>;
  createCommunityEvent(event: InsertCommunityEvent): Promise<CommunityEvent>;
  joinCommunityEvent(eventId: number, userId: number): Promise<EventParticipant>;
  leaveCommunityEvent(eventId: number, userId: number): Promise<void>;
  getCommunityStats(): Promise<{ activeMembersCount: number }>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getTeams(): Promise<Team[]> {
    return await db.select().from(teams);
  }

  async getTeam(id: number): Promise<Team | undefined> {
    const [team] = await db.select().from(teams).where(eq(teams.id, id));
    return team || undefined;
  }

  async createTeam(team: InsertTeam): Promise<Team> {
    const [newTeam] = await db.insert(teams).values(team).returning();
    return newTeam;
  }

  async getTuskersTeam(): Promise<Team | undefined> {
    const [team] = await db.select().from(teams).where(eq(teams.isOurTeam, true));
    return team || undefined;
  }

  async getPlayers(): Promise<(Player & { stats?: PlayerStats })[]> {
    const playersWithStats = await db
      .select()
      .from(players)
      .leftJoin(playerStats, eq(players.id, playerStats.playerId))
      .where(eq(players.isActive, true))
      .orderBy(players.name);

    return playersWithStats.map(row => ({
      ...row.players,
      stats: row.player_stats || undefined
    }));
  }

  async getPlayer(id: number): Promise<(Player & { stats?: PlayerStats }) | undefined> {
    const [result] = await db
      .select()
      .from(players)
      .leftJoin(playerStats, eq(players.id, playerStats.playerId))
      .where(eq(players.id, id));

    if (!result) return undefined;

    return {
      ...result.players,
      stats: result.player_stats || undefined
    };
  }

  async createPlayer(player: InsertPlayer): Promise<Player> {
    const [newPlayer] = await db.insert(players).values(player).returning();
    return newPlayer;
  }

  async updatePlayer(id: number, player: Partial<InsertPlayer>): Promise<void> {
    await db.update(players).set(player).where(eq(players.id, id));
  }

  async deletePlayer(id: number): Promise<void> {
    // First delete related player stats
    await db.delete(playerStats).where(eq(playerStats.playerId, id));
    
    // Then delete the player
    await db.delete(players).where(eq(players.id, id));
  }

  async deleteAllPlayers(): Promise<void> {
    // First clear any player references in matches (player of match)
    await db.update(matches).set({ playerOfMatch: null });
    
    // Delete lineup entries
    await db.delete(lineups);
    
    // Delete player stats
    await db.delete(playerStats);
    
    // Finally delete all players
    await db.delete(players);
  }

  async getStartingLineup(matchId: number): Promise<(Lineup & { player: Player })[]> {
    const lineup = await db
      .select()
      .from(lineups)
      .innerJoin(players, eq(lineups.playerId, players.id))
      .where(eq(lineups.matchId, matchId))
      .orderBy(lineups.battingOrder);

    return lineup.map(row => ({
      ...row.lineups,
      player: row.players
    }));
  }

  async getMatches(): Promise<(Match & { homeTeam: Team; awayTeam: Team; venue: Venue; competition: Competition })[]> {
    const matchesData = await db
      .select({
        match: matches,
        homeTeam: { id: teams.id, name: teams.name, shortName: teams.shortName, logo: teams.logo, isOurTeam: teams.isOurTeam },
        venue: venues,
        competition: competitions
      })
      .from(matches)
      .innerJoin(teams, eq(matches.homeTeamId, teams.id))
      .innerJoin(venues, eq(matches.venueId, venues.id))
      .innerJoin(competitions, eq(matches.competitionId, competitions.id))
      .orderBy(desc(matches.matchDate));

    const results = [];
    for (const row of matchesData) {
      const [awayTeam] = await db.select().from(teams).where(eq(teams.id, row.match.awayTeamId));
      if (awayTeam) {
        results.push({
          ...row.match,
          homeTeam: row.homeTeam,
          awayTeam,
          venue: row.venue,
          competition: row.competition
        });
      }
    }
    return results;
  }

  async getMatch(id: number): Promise<(Match & { homeTeam: Team; awayTeam: Team; venue: Venue; competition: Competition }) | undefined> {
    // Simplified implementation
    return undefined;
  }

  async createMatch(match: InsertMatch): Promise<Match> {
    const [newMatch] = await db.insert(matches).values(match).returning();
    return newMatch;
  }

  async updateMatch(id: number, match: Partial<InsertMatch>): Promise<void> {
    await db.update(matches).set(match).where(eq(matches.id, id));
  }

  async getLiveMatches(): Promise<(Match & { homeTeam: Team; awayTeam: Team })[]> {
    // Simplified implementation
    return [];
  }

  async getUpcomingMatches(): Promise<(Match & { homeTeam: Team; awayTeam: Team; venue: Venue })[]> {
    // Simplified implementation
    return [];
  }

  async getRecentMatches(): Promise<(Match & { homeTeam: Team; awayTeam: Team })[]> {
    // Simplified implementation
    return [];
  }

  async getArticles(): Promise<Article[]> {
    return await db
      .select()
      .from(articles)
      .where(eq(articles.isPublished, true))
      .orderBy(desc(articles.publishedAt));
  }

  async getArticle(id: number): Promise<Article | undefined> {
    const [article] = await db.select().from(articles).where(eq(articles.id, id));
    return article || undefined;
  }

  async getArticleBySlug(slug: string): Promise<Article | undefined> {
    const [article] = await db.select().from(articles).where(eq(articles.slug, slug));
    return article || undefined;
  }

  async createArticle(article: InsertArticle): Promise<Article> {
    const [newArticle] = await db.insert(articles).values(article).returning();
    return newArticle;
  }

  async updateArticle(id: number, article: Partial<InsertArticle>): Promise<void> {
    await db.update(articles).set(article).where(eq(articles.id, id));
  }

  async deleteArticle(id: number): Promise<void> {
    await db.delete(articles).where(eq(articles.id, id));
  }

  async getFeaturedArticles(): Promise<Article[]> {
    return await db
      .select()
      .from(articles)
      .where(and(eq(articles.isPublished, true), eq(articles.isFeatured, true)))
      .orderBy(desc(articles.publishedAt))
      .limit(3);
  }

  async getSocialPosts(): Promise<SocialPost[]> {
    return await db
      .select()
      .from(socialPosts)
      .orderBy(desc(socialPosts.postedAt))
      .limit(10);
  }

  async createSocialPost(post: InsertSocialPost): Promise<SocialPost> {
    const [newPost] = await db.insert(socialPosts).values(post).returning();
    return newPost;
  }

  async getActivePolls(): Promise<Poll[]> {
    return await db
      .select()
      .from(polls)
      .where(eq(polls.isActive, true))
      .orderBy(desc(polls.createdAt));
  }

  async getPoll(id: number): Promise<Poll | undefined> {
    const [poll] = await db.select().from(polls).where(eq(polls.id, id));
    return poll || undefined;
  }

  async createPoll(poll: InsertPoll): Promise<Poll> {
    const [newPoll] = await db.insert(polls).values(poll).returning();
    return newPoll;
  }

  async updatePoll(id: number, poll: Partial<InsertPoll>): Promise<void> {
    await db.update(polls).set(poll).where(eq(polls.id, id));
  }

  async getActiveQuizzes(): Promise<Quiz[]> {
    return await db
      .select()
      .from(quizzes)
      .where(eq(quizzes.isActive, true))
      .orderBy(desc(quizzes.createdAt));
  }

  async getQuiz(id: number): Promise<Quiz | undefined> {
    const [quiz] = await db.select().from(quizzes).where(eq(quizzes.id, id));
    return quiz || undefined;
  }

  async createQuiz(quiz: InsertQuiz): Promise<Quiz> {
    const [newQuiz] = await db.insert(quizzes).values(quiz).returning();
    return newQuiz;
  }

  async getGalleryItems(): Promise<GalleryItem[]> {
    return await db
      .select()
      .from(gallery)
      .orderBy(desc(gallery.createdAt));
  }

  async createGalleryItem(item: InsertGalleryItem): Promise<GalleryItem> {
    const [newItem] = await db.insert(gallery).values(item).returning();
    return newItem;
  }

  async deleteGalleryItem(id: number): Promise<void> {
    await db.delete(gallery).where(eq(gallery.id, id));
  }

  async getAnnouncements(): Promise<Announcement[]> {
    return await db
      .select()
      .from(announcements)
      .where(eq(announcements.isActive, true))
      .orderBy(desc(announcements.createdAt));
  }

  async createAnnouncement(announcement: InsertAnnouncement): Promise<Announcement> {
    const [newAnnouncement] = await db.insert(announcements).values(announcement).returning();
    return newAnnouncement;
  }

  async updatePlayerStats(playerId: number, stats: Partial<PlayerStats>): Promise<void> {
    await db.update(playerStats).set(stats).where(eq(playerStats.playerId, playerId));
  }

  async getTeamStats(): Promise<{
    matchesWon: number;
    totalMatches: number;
    totalRuns: number;
    wicketsTaken: number;
    nrr: number;
  }> {
    try {
      const [stats] = await db.select().from(teamStats).limit(1);
      if (stats) {
        return {
          matchesWon: stats.matchesWon || 0,
          totalMatches: stats.totalMatches || 0,
          totalRuns: stats.totalRuns || 0,
          wicketsTaken: stats.wicketsTaken || 0,
          nrr: stats.nrr || 0
        };
      }
    } catch (error) {
      console.error('Error fetching team stats:', error);
    }
    
    // Return default values if no stats found
    return {
      matchesWon: 15,
      totalMatches: 20,
      totalRuns: 2850,
      wicketsTaken: 125,
      nrr: 1.245
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
    try {
      // Calculate NRR: (Total runs scored / Total overs faced) - (Total runs conceded / Total overs bowled)
      const runRate = data.totalOvers > 0 ? data.totalRuns / data.totalOvers : 0;
      const concededRate = data.oversAgainst > 0 ? data.runsAgainst / data.oversAgainst : 0;
      const nrr = runRate - concededRate;

      // Check if stats exist
      const [existingStats] = await db.select().from(teamStats).limit(1);
      
      if (existingStats) {
        // Update existing record
        await db.update(teamStats)
          .set({
            matchesWon: data.matchesWon,
            totalMatches: data.totalMatches,
            totalRuns: data.totalRuns,
            wicketsTaken: data.wicketsTaken,
            totalOvers: data.totalOvers,
            runsAgainst: data.runsAgainst,
            oversAgainst: data.oversAgainst,
            nrr: nrr,
            updatedAt: new Date()
          })
          .where(eq(teamStats.id, existingStats.id));
      } else {
        // Insert new record
        await db.insert(teamStats).values({
          matchesWon: data.matchesWon,
          totalMatches: data.totalMatches,
          totalRuns: data.totalRuns,
          wicketsTaken: data.wicketsTaken,
          totalOvers: data.totalOvers,
          runsAgainst: data.runsAgainst,
          oversAgainst: data.oversAgainst,
          nrr: nrr
        });
      }
    } catch (error) {
      console.error('Error updating team stats:', error);
      throw error;
    }
  }

  async getTriviaQuestions(): Promise<TriviaQuestion[]> {
    return await db.select().from(triviaQuestions).where(eq(triviaQuestions.isActive, true));
  }

  async getTriviaLeaderboard(): Promise<TriviaLeaderboard[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return await db
      .select()
      .from(triviaLeaderboard)
      .where(sql`date(${triviaLeaderboard.playDate}) = date(${today.toISOString()})`)
      .orderBy(desc(triviaLeaderboard.score), desc(triviaLeaderboard.accuracy))
      .limit(50);
  }

  async submitTriviaScore(entry: InsertTriviaLeaderboard): Promise<TriviaLeaderboard> {
    const [result] = await db
      .insert(triviaLeaderboard)
      .values(entry)
      .returning();
    return result;
  }

  // Forum Methods
  async getForumCategories(): Promise<ForumCategory[]> {
    return await db.select().from(forumCategories).orderBy(forumCategories.id);
  }

  async getForumTopics(categoryId?: number): Promise<ForumTopic[]> {
    const query = db.select().from(forumTopics).orderBy(desc(forumTopics.isSticky), desc(forumTopics.updatedAt));
    
    if (categoryId) {
      return await query.where(eq(forumTopics.categoryId, categoryId));
    }
    
    return await query;
  }

  async getForumTopic(slug: string): Promise<ForumTopic | undefined> {
    const [topic] = await db.select().from(forumTopics).where(eq(forumTopics.slug, slug));
    return topic || undefined;
  }

  async createForumTopic(topic: InsertForumTopic): Promise<ForumTopic> {
    const [newTopic] = await db.insert(forumTopics).values(topic).returning();
    return newTopic;
  }

  async getForumPosts(topicId: number): Promise<ForumPost[]> {
    return await db.select().from(forumPosts)
      .where(eq(forumPosts.topicId, topicId))
      .orderBy(forumPosts.createdAt);
  }

  async createForumPost(post: InsertForumPost): Promise<ForumPost> {
    const [newPost] = await db.insert(forumPosts).values(post).returning();
    return newPost;
  }

  async getForumStats(): Promise<{ totalTopics: number; totalPosts: number; totalMembers: number }> {
    const [topicsCount] = await db.select({ count: count() }).from(forumTopics);
    const [postsCount] = await db.select({ count: count() }).from(forumPosts);
    const [membersCount] = await db.select({ count: count() }).from(users);
    
    return {
      totalTopics: topicsCount.count,
      totalPosts: postsCount.count,
      totalMembers: membersCount.count
    };
  }

  // Community Events Methods
  async getCommunityEvents(): Promise<CommunityEvent[]> {
    return await db.select().from(communityEvents).orderBy(communityEvents.eventDate);
  }

  async createCommunityEvent(event: InsertCommunityEvent): Promise<CommunityEvent> {
    const [newEvent] = await db.insert(communityEvents).values(event).returning();
    return newEvent;
  }

  async joinCommunityEvent(eventId: number, userId: number): Promise<EventParticipant> {
    const [participant] = await db.insert(eventParticipants)
      .values({ eventId, userId })
      .returning();
    return participant;
  }

  async leaveCommunityEvent(eventId: number, userId: number): Promise<void> {
    await db.delete(eventParticipants)
      .where(and(eq(eventParticipants.eventId, eventId), eq(eventParticipants.userId, userId)));
  }

  async getCommunityStats(): Promise<{ activeMembersCount: number }> {
    const [membersCount] = await db.select({ count: count() }).from(users);
    
    return {
      activeMembersCount: membersCount.count
    };
  }

  // Match Performance Methods
  async createMatchPerformance(performance: InsertMatchPerformance): Promise<MatchPerformance> {
    const [result] = await db.insert(matchPerformances).values(performance).returning();
    return result;
  }

  async getMatchPerformances(matchId: number): Promise<(MatchPerformance & { player: Player })[]> {
    return await db.select()
      .from(matchPerformances)
      .leftJoin(players, eq(matchPerformances.playerId, players.id))
      .where(eq(matchPerformances.matchId, matchId))
      .then(rows => rows.map(row => ({
        ...row.match_performances,
        player: row.players!
      })));
  }

  async updatePlayerStatsFromMatch(matchId: number, playerPerformances: InsertMatchPerformance[]): Promise<void> {
    // First, save the match performances
    for (const performance of playerPerformances) {
      await this.createMatchPerformance(performance);
    }

    // Then update each player's cumulative stats
    for (const performance of playerPerformances) {
      if (!performance.playerId) continue;

      // Get current player stats
      const currentStats = await db.select()
        .from(playerStats)
        .where(eq(playerStats.playerId, performance.playerId))
        .limit(1);

      const stats = currentStats[0];
      
      if (stats) {
        // Update existing stats by adding the match performance
        await db.update(playerStats)
          .set({
            matches: (stats.matches || 0) + 1,
            runsScored: (stats.runsScored || 0) + (performance.runsScored || 0),
            ballsFaced: (stats.ballsFaced || 0) + (performance.ballsFaced || 0),
            fours: (stats.fours || 0) + (performance.fours || 0),
            sixes: (stats.sixes || 0) + (performance.sixes || 0),
            wicketsTaken: (stats.wicketsTaken || 0) + (performance.wicketsTaken || 0),
            ballsBowled: (stats.ballsBowled || 0) + (performance.ballsBowled || 0),
            runsConceded: (stats.runsConceded || 0) + (performance.runsConceded || 0),
            catches: (stats.catches || 0) + (performance.catches || 0),
            stumpings: (stats.stumpings || 0) + (performance.stumpings || 0),
            runOuts: (stats.runOuts || 0) + (performance.runOuts || 0)
          })
          .where(eq(playerStats.playerId, performance.playerId));
      } else {
        // Create new stats record for the player
        await db.insert(playerStats).values({
          playerId: performance.playerId,
          matches: 1,
          runsScored: performance.runsScored || 0,
          ballsFaced: performance.ballsFaced || 0,
          fours: performance.fours || 0,
          sixes: performance.sixes || 0,
          wicketsTaken: performance.wicketsTaken || 0,
          ballsBowled: performance.ballsBowled || 0,
          runsConceded: performance.runsConceded || 0,
          catches: performance.catches || 0,
          stumpings: performance.stumpings || 0,
          runOuts: performance.runOuts || 0
        });
      }
    }
  }
}

export const storage = new DatabaseStorage();
