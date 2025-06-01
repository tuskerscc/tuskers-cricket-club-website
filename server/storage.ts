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
  updateAnnouncement(id: number, announcement: Partial<InsertAnnouncement>): Promise<void>;
  deleteAnnouncement(id: number): Promise<void>;

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
    totalOvers: number;
    runsAgainst: number;
    oversAgainst: number;
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
    totalOvers: number;
    runsAgainst: number;
    oversAgainst: number;
    nrr: number;
  }> {
    try {
      const allStats = await db.select().from(teamStats);
      
      if (allStats.length === 0) {
        return {
          matchesWon: 0,
          totalMatches: 0,
          totalRuns: 0,
          wicketsTaken: 0,
          totalOvers: 0,
          runsAgainst: 0,
          oversAgainst: 0,
          nrr: 0
        };
      }
      
      // Calculate aggregated statistics
      const totalMatchesPlayed = allStats.length;
      const totalMatchesWon = allStats.reduce((sum, stat) => sum + (stat.matchesWon || 0), 0);
      const sumTotalRuns = allStats.reduce((sum, stat) => sum + (stat.totalRuns || 0), 0);
      const sumWicketsTaken = allStats.reduce((sum, stat) => sum + (stat.wicketsTaken || 0), 0);
      const sumTotalOvers = allStats.reduce((sum, stat) => sum + (stat.totalOvers || 0), 0);
      const sumRunsAgainst = allStats.reduce((sum, stat) => sum + (stat.runsAgainst || 0), 0);
      const sumOversAgainst = allStats.reduce((sum, stat) => sum + (stat.oversAgainst || 0), 0);
      
      // Calculate NRR: (sum total_runs ÷ sum total_overs) - (sum runs_against ÷ sum overs_against)
      const runRate = sumTotalOvers > 0 ? sumTotalRuns / sumTotalOvers : 0;
      const concededRate = sumOversAgainst > 0 ? sumRunsAgainst / sumOversAgainst : 0;
      const nrr = runRate - concededRate;
      
      return {
        matchesWon: totalMatchesWon,
        totalMatches: totalMatchesPlayed,
        totalRuns: sumTotalRuns,
        wicketsTaken: sumWicketsTaken,
        totalOvers: sumTotalOvers,
        runsAgainst: sumRunsAgainst,
        oversAgainst: sumOversAgainst,
        nrr: parseFloat(nrr.toFixed(3))
      };
    } catch (error) {
      console.error('Error fetching team stats:', error);
      return {
        matchesWon: 0,
        totalMatches: 0,
        totalRuns: 0,
        wicketsTaken: 0,
        totalOvers: 0,
        runsAgainst: 0,
        oversAgainst: 0,
        nrr: 0
      };
    }
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
      // Convert all inputs to safe integers/floats
      const safeInt = (val: any) => {
        const num = parseInt(String(val)) || 0;
        return isNaN(num) ? 0 : Math.max(0, num);
      };
      
      const safeFloat = (val: any) => {
        const num = parseFloat(String(val)) || 0;
        return isNaN(num) ? 0 : Math.max(0, num);
      };
      
      const matchesWon = safeInt(data.matchesWon);
      const totalMatches = safeInt(data.totalMatches) || 1;
      const totalRuns = safeInt(data.totalRuns);
      const wicketsTaken = safeInt(data.wicketsTaken);
      const totalOvers = safeFloat(data.totalOvers);
      const runsAgainst = safeInt(data.runsAgainst);
      const oversAgainst = safeFloat(data.oversAgainst);
      
      // Calculate NRR safely
      let nrr = 0;
      if (totalOvers > 0 && oversAgainst > 0) {
        const runRate = totalRuns / totalOvers;
        const concededRate = runsAgainst / oversAgainst;
        nrr = runRate - concededRate;
        nrr = Math.round(nrr * 1000) / 1000; // Round to 3 decimal places
      }
      
      // Insert with guaranteed valid values
      await db.insert(teamStats).values({
        matchesWon: matchesWon,
        totalMatches: totalMatches,
        totalRuns: totalRuns,
        wicketsTaken: wicketsTaken,
        totalOvers: totalOvers,
        runsAgainst: runsAgainst,
        oversAgainst: oversAgainst,
        nrr: nrr
      });
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
        // Update existing stats with latest match performance (replace, don't add)
        await db.update(playerStats)
          .set({
            matches: (stats.matches || 0) + 1,
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

import { MemoryStorage } from "./memory-storage";

export const storage = new DatabaseStorage();
