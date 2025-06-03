import {
  users, teams, venues, competitions, players, matches, lineups, playerStats, teamStats,
  matchPerformances, articles, socialPosts, polls, quizzes, gallery, galleryLikes, announcements,
  triviaQuestions, triviaLeaderboard, forumCategories, forumTopics, forumPosts,
  forumPostLikes, userProfiles, communityEvents, eventParticipants,
  playerRegistrations, // Added playerRegistrations table import
  type User, type InsertUser, type Team, type InsertTeam, type Venue, type InsertVenue,
  type Competition, type InsertCompetition, type Player, type InsertPlayer,
  type Match, type InsertMatch, type Lineup, type InsertLineup,
  type PlayerStats, type InsertPlayerStats, type MatchPerformance, type InsertMatchPerformance,
  type Article, type InsertArticle, type SocialPost, type InsertSocialPost, type Poll, type InsertPoll,
  type Quiz, type InsertQuiz, type GalleryItem, type InsertGalleryItem,
  type GalleryLike, type InsertGalleryLike,
  type Announcement, type InsertAnnouncement,
  type TriviaQuestion, type InsertTriviaQuestion, type TriviaLeaderboard, type InsertTriviaLeaderboard,
  type ForumCategory, type InsertForumCategory, type ForumTopic, type InsertForumTopic,
  type ForumPost, type InsertForumPost, type ForumPostLike, type InsertForumPostLike,
  type UserProfile, type InsertUserProfile, type CommunityEvent, type InsertCommunityEvent,
  type EventParticipant, type InsertEventParticipant,
  type PlayerRegistration, type InsertPlayerRegistration // Added PlayerRegistration types
} from "@shared/schema"; // Ensure this path points to your Drizzle schema definitions
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
  deletePoll(id: number): Promise<void>;

  // Quizzes
  getActiveQuizzes(): Promise<Quiz[]>;
  getQuiz(id: number): Promise<Quiz | undefined>;
  createQuiz(quiz: InsertQuiz): Promise<Quiz>;

  // Gallery
  getGalleryItems(): Promise<GalleryItem[]>;
  createGalleryItem(item: InsertGalleryItem): Promise<GalleryItem>;
  deleteGalleryItem(id: number): Promise<void>;

  // Gallery likes
  likeGalleryItem(galleryItemId: number, userIp: string, userAgent?: string): Promise<boolean>;
  unlikeGalleryItem(galleryItemId: number, userIp: string): Promise<boolean>;
  hasUserLikedGalleryItem(galleryItemId: number, userIp: string): Promise<boolean>;

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
    matchesLost: number;
    matchesDraw: number;
    totalMatches: number;
    totalRuns: number;
    wicketsTaken: number;
    oversBowled: number;
    winRate: number;
    nrr: number;
  }>;
  updateTeamStats(data: {
    matchesWon: number;
    matchesLost: number;
    matchesDraw: number;
    totalMatches: number;
    totalRuns: number;
    wicketsTaken: number;
    oversBowled: number;
    winRate?: number;
    nrr?: number;
    runsAgainst?: number;
    oversAgainst?: number;
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

  // Player Registrations
  createPlayerRegistration(registrationData: InsertPlayerRegistration): Promise<PlayerRegistration>;
  getPlayerRegistration(id: number): Promise<PlayerRegistration | undefined>;
  getAllPlayerRegistrations(): Promise<PlayerRegistration[]>;
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
    try {
      const playerList = await db
        .select()
        .from(players)
        .where(eq(players.isActive, true))
        .orderBy(players.name);
      return playerList.map(player => ({
        ...player,
        stats: undefined
      }));
    } catch (error) {
      console.error('Error fetching players:', error);
      return [];
    }
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
    await db.delete(playerStats).where(eq(playerStats.playerId, id));
    await db.delete(players).where(eq(players.id, id));
  }

  async deleteAllPlayers(): Promise<void> {
    await db.update(matches).set({ playerOfMatch: null });
    await db.delete(lineups);
    await db.delete(playerStats);
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
        homeTeam: teams,
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
      const [awayTeam] = await db.select().from(teams).where(eq(teams.id, row.match.awayTeamId as number));
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
    const [matchData] = await db
      .select({
        match: matches,
        homeTeam: teams,
        venue: venues,
        competition: competitions
      })
      .from(matches)
      .innerJoin(teams, eq(matches.homeTeamId, teams.id))
      .innerJoin(venues, eq(matches.venueId, venues.id))
      .innerJoin(competitions, eq(matches.competitionId, competitions.id))
      .where(eq(matches.id, id));

    if (!matchData) return undefined;

    const [awayTeam] = await db.select().from(teams).where(eq(teams.id, matchData.match.awayTeamId as number));
    if (!awayTeam) return undefined;

    return {
      ...matchData.match,
      homeTeam: matchData.homeTeam,
      awayTeam,
      venue: matchData.venue,
      competition: matchData.competition
    };
  }

  async createMatch(match: InsertMatch): Promise<Match> {
    const [newMatch] = await db.insert(matches).values(match).returning();
    return newMatch;
  }

  async updateMatch(id: number, match: Partial<InsertMatch>): Promise<void> {
    await db.update(matches).set(match).where(eq(matches.id, id));
  }

  async getLiveMatches(): Promise<(Match & { homeTeam: Team; awayTeam: Team })[]> {
    const liveMatchesData = await db
      .select({ match: matches, homeTeam: teams })
      .from(matches)
      .innerJoin(teams, eq(matches.homeTeamId, teams.id))
      .where(eq(matches.status, 'live'))
      .orderBy(desc(matches.matchDate));

    const results = [];
    for (const row of liveMatchesData) {
      const [awayTeam] = await db.select().from(teams).where(eq(teams.id, row.match.awayTeamId as number));
      if (awayTeam) {
        results.push({ ...row.match, homeTeam: row.homeTeam, awayTeam });
      }
    }
    return results;
  }

  async getUpcomingMatches(): Promise<(Match & { homeTeam: Team; awayTeam: Team; venue: Venue })[]> {
    const upcomingMatchesData = await db
      .select({ match: matches, homeTeam: teams, venue: venues })
      .from(matches)
      .innerJoin(teams, eq(matches.homeTeamId, teams.id))
      .innerJoin(venues, eq(matches.venueId, venues.id))
      .where(and(eq(matches.status, 'scheduled'), sql`${matches.matchDate} > NOW()`))
      .orderBy(matches.matchDate);

    const results = [];
    for (const row of upcomingMatchesData) {
      const [awayTeam] = await db.select().from(teams).where(eq(teams.id, row.match.awayTeamId as number));
      if (awayTeam) {
        results.push({ ...row.match, homeTeam: row.homeTeam, awayTeam, venue: row.venue });
      }
    }
    return results;
  }

  async getRecentMatches(): Promise<(Match & { homeTeam: Team; awayTeam: Team })[]> {
    const recentMatchesData = await db
      .select({ match: matches, homeTeam: teams })
      .from(matches)
      .innerJoin(teams, eq(matches.homeTeamId, teams.id))
      .where(and(eq(matches.status, 'completed'), sql`${matches.matchDate} <= NOW()`))
      .orderBy(desc(matches.matchDate))
      .limit(5);

    const results = [];
    for (const row of recentMatchesData) {
      const [awayTeam] = await db.select().from(teams).where(eq(teams.id, row.match.awayTeamId as number));
      if (awayTeam) {
        results.push({ ...row.match, homeTeam: row.homeTeam, awayTeam });
      }
    }
    return results;
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

  async deletePoll(id: number): Promise<void> {
    await db.delete(polls).where(eq(polls.id, id));
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
    await db.delete(galleryLikes).where(eq(galleryLikes.galleryItemId, id));
    await db.delete(gallery).where(eq(gallery.id, id));
  }

  async likeGalleryItem(galleryItemId: number, userIp: string, userAgent?: string): Promise<boolean> {
    try {
      const existingLike = await db
        .select()
        .from(galleryLikes)
        .where(and(eq(galleryLikes.galleryItemId, galleryItemId), eq(galleryLikes.userIp, userIp)));
      if (existingLike.length > 0) {
        return false;
      }
      await db.insert(galleryLikes).values({ galleryItemId, userIp, userAgent: userAgent || null });
      await db.update(gallery).set({ likesCount: sql`${gallery.likesCount} + 1` }).where(eq(gallery.id, galleryItemId));
      return true;
    } catch (error) {
      console.error('Error liking gallery item:', error);
      return false;
    }
  }

  async unlikeGalleryItem(galleryItemId: number, userIp: string): Promise<boolean> {
    try {
      const deleted = await db
        .delete(galleryLikes)
        .where(and(eq(galleryLikes.galleryItemId, galleryItemId), eq(galleryLikes.userIp, userIp)))
        .returning({ id: galleryLikes.id });

      if (deleted.length > 0) {
        await db.update(gallery).set({ likesCount: sql`${gallery.likesCount} - 1` }).where(eq(gallery.id, galleryItemId));
      }
      return deleted.length > 0;
    } catch (error) {
      console.error('Error unliking gallery item:', error);
      return false;
    }
  }

  async hasUserLikedGalleryItem(galleryItemId: number, userIp: string): Promise<boolean> {
    try {
      const existingLike = await db
        .select()
        .from(galleryLikes)
        .where(and(eq(galleryLikes.galleryItemId, galleryItemId), eq(galleryLikes.userIp, userIp)));
      return existingLike.length > 0;
    } catch (error) {
      console.error('Error checking gallery like:', error);
      return false;
    }
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

  async updateAnnouncement(id: number, announcement: Partial<InsertAnnouncement>): Promise<void> {
    await db.update(announcements).set(announcement).where(eq(announcements.id, id));
  }

  async deleteAnnouncement(id: number): Promise<void> {
    await db.delete(announcements).where(eq(announcements.id, id));
  }

  async updatePlayerStats(playerId: number, stats: Partial<PlayerStats>): Promise<void> {
    const existingStats = await db.select().from(playerStats).where(eq(playerStats.playerId, playerId)).limit(1);
    if (existingStats.length > 0) {
      await db.update(playerStats).set(stats).where(eq(playerStats.playerId, playerId));
    } else {
      await db.insert(playerStats).values({ playerId, ...stats } as InsertPlayerStats);
    }
  }

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
    for (const performance of playerPerformances) {
      await this.createMatchPerformance(performance);
      if (!performance.playerId) continue;

      const currentStatsResult = await db.select().from(playerStats).where(eq(playerStats.playerId, performance.playerId)).limit(1);
      const existingStats = currentStatsResult[0];

      if (existingStats) {
        await db.update(playerStats)
          .set({
            matches: (existingStats.matches || 0) + 1,
            runsScored: (existingStats.runsScored || 0) + (performance.runsScored || 0),
            ballsFaced: (existingStats.ballsFaced || 0) + (performance.ballsFaced || 0),
            fours: (existingStats.fours || 0) + (performance.fours || 0),
            sixes: (existingStats.sixes || 0) + (performance.sixes || 0),
            wicketsTaken: (existingStats.wicketsTaken || 0) + (performance.wicketsTaken || 0),
            ballsBowled: (existingStats.ballsBowled || 0) + (performance.ballsBowled || 0),
            runsConceded: (existingStats.runsConceded || 0) + (performance.runsConceded || 0),
            catches: (existingStats.catches || 0) + (performance.catches || 0),
            stumpings: (existingStats.stumpings || 0) + (performance.stumpings || 0),
            runOuts: (existingStats.runOuts || 0) + (performance.runOuts || 0),
          })
          .where(eq(playerStats.playerId, performance.playerId));
      } else {
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
          runOuts: performance.runOuts || 0,
        });
      }
    }
  }

  async getTeamStats(): Promise<{
    matchesWon: number;
    matchesLost: number;
    matchesDraw: number;
    totalMatches: number;
    totalRuns: number;
    wicketsTaken: number;
    oversBowled: number;
    winRate: number;
    nrr: number;
  }> {
    const tuskersTeam = await this.getTuskersTeam();
    if (!tuskersTeam || !tuskersTeam.id) {
         console.warn("Tuskers team ID not found for stats calculation. Ensure 'isOurTeam' is set for one team.");
         return { matchesWon: 0, matchesLost: 0, matchesDraw: 0, totalMatches: 0, totalRuns: 0, wicketsTaken: 0, oversBowled: 0, winRate: 0, nrr: 0 };
    }

    // Assumes teamStats table has a teamId foreign key.
    // If your teamStats table has its own primary key that is the same as teams.id, adjust accordingly.
    const [stats] = await db.select().from(teamStats).where(eq(teamStats.teamId, tuskersTeam.id)); // Adjust 'teamStats.teamId' if your FK is named differently

    if (stats) {
        return {
            matchesWon: stats.matchesWon || 0,
            matchesLost: stats.matchesLost || 0, // Ensure these field names match your teamStats schema
            matchesDraw: stats.matchesDraw || 0, // Ensure these field names match your teamStats schema
            totalMatches: stats.matchesPlayed || 0, // Assuming 'matchesPlayed' in teamStats schema
            totalRuns: stats.totalRunsScored || 0,
            wicketsTaken: stats.wicketsTakenByBowlers || 0,
            oversBowled: stats.oversBowledByTeam || 0,
            winRate: stats.winRate || 0,
            nrr: stats.nrr || 0,
        };
    }
    console.warn(`No pre-calculated team stats found for team ID ${tuskersTeam.id}. Consider initializing or updating team stats.`);
    return { matchesWon: 0, matchesLost: 0, matchesDraw: 0, totalMatches: 0, totalRuns: 0, wicketsTaken: 0, oversBowled: 0, winRate: 0, nrr: 0 };
  }

  async updateTeamStats(data: {
    matchesWon: number;
    matchesLost: number;
    matchesDraw: number;
    totalMatches: number;
    totalRuns: number;
    wicketsTaken: number;
    oversBowled: number;
    winRate?: number;
    nrr?: number;
    runsAgainst?: number;
    oversAgainst?: number;
  }): Promise<void> {
    const tuskersTeam = await this.getTuskersTeam();
    if (!tuskersTeam || !tuskersTeam.id) {
      console.error("Tuskers team not found, cannot update stats.");
      throw new Error("Tuskers team not found for stat update.");
    }
    const teamId = tuskersTeam.id;

    const totalRunsScored = Number(data.totalRuns) || 0;
    const oversFacedByTeam = Number(data.oversAgainst) || 0;
    const totalRunsConceded = Number(data.runsAgainst) || 0;
    const oversBowledByTeam = Number(data.oversBowled) || 0;

    let nrr = data.nrr !== undefined ? Number(data.nrr) : 0;
    if (data.nrr === undefined && oversFacedByTeam > 0 && oversBowledByTeam > 0) {
      const runRateFor = totalRunsScored / oversFacedByTeam;
      const runRateAgainst = totalRunsConceded / oversBowledByTeam;
      nrr = Math.round((runRateFor - runRateAgainst) * 1000) / 1000;
    }

    let winRate = data.winRate !== undefined ? Number(data.winRate) : 0;
    if (data.winRate === undefined && (data.totalMatches || 0) > 0) {
        winRate = Math.round(((data.matchesWon || 0) / (data.totalMatches || 1)) * 10000) / 100;
    }

    const statsToUpdate = {
      teamId: teamId, // This field MUST exist in your teamStats table schema for this logic
      matchesPlayed: Number(data.totalMatches) || 0,
      matchesWon: Number(data.matchesWon) || 0,
      matchesLost: Number(data.matchesLost) || 0,
      matchesDraw: Number(data.matchesDraw) || 0,
      totalRunsScored: totalRunsScored,
      totalOversFaced: oversFacedByTeam,
      totalRunsConceded: totalRunsConceded,
      oversBowledByTeam: oversBowledByTeam,
      wicketsTakenByBowlers: Number(data.wicketsTaken) || 0,
      nrr: nrr,
      winRate: winRate,
      lastUpdated: new Date(),
    };

    const existingStats = await db.select().from(teamStats).where(eq(teamStats.teamId, teamId)).limit(1);

    if (existingStats.length > 0) {
      await db.update(teamStats).set(statsToUpdate).where(eq(teamStats.teamId, teamId));
    } else {
      await db.insert(teamStats).values(statsToUpdate);
    }
  }

  async getTriviaQuestions(): Promise<TriviaQuestion[]> {
    return await db.select().from(triviaQuestions).where(eq(triviaQuestions.isActive, true));
  }

  async getTriviaLeaderboard(): Promise<TriviaLeaderboard[]> {
    const today = new Date();
    const todayDateString = today.toISOString().split('T')[0];
    return await db
      .select()
      .from(triviaLeaderboard)
      .where(sql`DATE(${triviaLeaderboard.playDate}) = ${todayDateString}`)
      .orderBy(desc(triviaLeaderboard.score), desc(triviaLeaderboard.accuracy))
      .limit(50);
  }

  async submitTriviaScore(entry: InsertTriviaLeaderboard): Promise<TriviaLeaderboard> {
    const [result] = await db.insert(triviaLeaderboard).values(entry).returning();
    return result;
  }

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
    return { activeMembersCount: membersCount.count };
  }

  // Player Registration Methods
class DatabaseStorage {
  /**
   * Inserts a new player registration into the database.
   * @param registrationData The registration data to insert.
   * @returns The newly inserted player registration.
   * @throws Error if the insert fails or the result is empty.
   */
  async createPlayerRegistration(registrationData: InsertPlayerRegistration): Promise<PlayerRegistration> {
    try {
      console.log('Attempting to insert registration:', registrationData);
      const [newRegistration] = await db.insert(playerRegistrations).values(registrationData).returning();
      if (!newRegistration) {
        console.error("Failed to insert player registration into the database. Data:", registrationData);
        throw new Error("Database insert failed. Registration was not saved.");
      }
      console.log("Inserted player registration:", newRegistration);
      return newRegistration;
    } catch (error) {
      console.error("Database error inserting player registration:", error);
      throw error;
    }
  }

  /**
   * Retrieves a player registration by ID.
   * @param id The registration ID.
   * @returns The player registration if found, otherwise undefined.
   */
  async getPlayerRegistration(id: number): Promise<PlayerRegistration | undefined> {
    try {
      const [registration] = await db
        .select()
        .from(playerRegistrations)
        .where(eq(playerRegistrations.id, id));
      return registration || undefined;
    } catch (error) {
      console.error(`Database error retrieving player registration with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Retrieves all player registrations, ordered by registration timestamp descending.
   * @returns An array of all player registrations.
   */
  async getAllPlayerRegistrations(): Promise<PlayerRegistration[]> {
    try {
      return await db
        .select()
        .from(playerRegistrations)
        .orderBy(desc(playerRegistrations.registrationTimestamp));
    } catch (error) {
      console.error("Database error retrieving all player registrations:", error);
      throw error;
    }
  }
}

export const storage = new DatabaseStorage();
