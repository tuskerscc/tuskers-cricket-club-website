import {
  users, teams, venues, competitions, players, matches, lineups, playerStats, teamStats,
  matchPerformances, articles, socialPosts, polls, quizzes, quizQuestions, gallery, galleryLikes, announcements,
  triviaQuestions, triviaLeaderboard, scoringUsers, scoringMatches, scoringInnings, scoringBalls,
  forumCategories, forumTopics, forumPosts,
  forumPostLikes, userProfiles, communityEvents, eventParticipants,
  playerRegistrations,
  type User, type InsertUser, type Team, type InsertTeam, type Venue, type InsertVenue,
  type Competition, type InsertCompetition, type Player, type InsertPlayer,
  type Match, type InsertMatch, type Lineup, type InsertLineup,
  type PlayerStats, type InsertPlayerStats, type MatchPerformance, type InsertMatchPerformance,
  type Article, type InsertArticle, type SocialPost, type InsertSocialPost, type Poll, type InsertPoll,
  type Quiz, type InsertQuiz, type QuizQuestion, type InsertQuizQuestion, type GalleryItem, type InsertGalleryItem,
  type GalleryLike, type InsertGalleryLike,
  type Announcement, type InsertAnnouncement, type TeamStats as TeamStatsType, type InsertTeamStats,
  type TriviaQuestion, type InsertTriviaQuestion, type TriviaLeaderboard, type InsertTriviaLeaderboard,
  type ScoringUser, type InsertScoringUser, type ScoringMatch, type InsertScoringMatch,
  type ScoringInnings, type InsertScoringInnings, type ScoringBall, type InsertScoringBall,
  type ForumCategory, type InsertForumCategory, type ForumTopic, type InsertForumTopic,
  type ForumPost, type InsertForumPost, type ForumPostLike, type InsertForumPostLike,
  type UserProfile, type InsertUserProfile, type CommunityEvent, type InsertCommunityEvent,
  type EventParticipant, type InsertEventParticipant,
  type PlayerRegistration, type InsertPlayerRegistration
} from "@shared/schema"; // Ensure this path points to your Drizzle schema definitions
import { db } from "./db"; // Assuming db is correctly configured and exported from ./db
import { eq, desc, and, sql, count, sum, or,isNull, SQL } from "drizzle-orm";

// Interface definition for the storage methods
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

  // Venues
  getVenues(): Promise<Venue[]>;
  createVenue(venue: InsertVenue): Promise<Venue>;

  // Competitions
  getCompetitions(): Promise<Competition[]>;
  createCompetition(competition: InsertCompetition): Promise<Competition>;

  // Players
  getPlayers(): Promise<(Player & { stats?: PlayerStats })[]>;
  getPlayer(id: number): Promise<(Player & { stats?: PlayerStats }) | undefined>;
  createPlayer(player: InsertPlayer): Promise<Player>;
  updatePlayer(id: number, player: Partial<InsertPlayer>): Promise<void>;
  deletePlayer(id: number): Promise<void>;
  deleteAllPlayers(): Promise<void>; // Added to interface
  getStartingLineup(matchId: number): Promise<(Lineup & { player: Player })[]>;

  // Matches
  getMatches(): Promise<(Match & { homeTeam?: Team; awayTeam?: Team; venue?: Venue; competition?: Competition })[]>;
  getMatch(id: number): Promise<(Match & { homeTeam?: Team; awayTeam?: Team; venue?: Venue; competition?: Competition }) | undefined>;
  createMatch(match: InsertMatch): Promise<Match>;
  updateMatch(id: number, match: Partial<InsertMatch>): Promise<void>;
  getLiveMatches(): Promise<(Match & { homeTeam?: Team; awayTeam?: Team })[]>;
  getUpcomingMatches(): Promise<(Match & { homeTeam?: Team; awayTeam?: Team; venue?: Venue })[]>;
  getRecentMatches(): Promise<(Match & { homeTeam?: Team; awayTeam?: Team })[]>;

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
  votePoll(pollId: number, optionId: string, userId?: number, userIp?: string): Promise<Poll | undefined>;


  // Quizzes & Quiz Questions
  getActiveQuizzes(): Promise<Quiz[]>;
  getQuiz(id: number): Promise<(Quiz & { questions?: QuizQuestion[] }) | undefined>;
  createQuiz(quiz: InsertQuiz): Promise<Quiz>;
  getQuizQuestions(quizId: number): Promise<QuizQuestion[]>;
  createQuizQuestion(question: InsertQuizQuestion): Promise<QuizQuestion>;


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
  getPlayerStats(playerId: number): Promise<PlayerStats | undefined>;
  updatePlayerStats(playerId: number, stats: Partial<PlayerStats>): Promise<void>; // Already exists

  // Match Performances
  createMatchPerformance(performance: InsertMatchPerformance): Promise<MatchPerformance>;
  getMatchPerformances(matchId: number): Promise<(MatchPerformance & { player?: Player })[]>;
  updatePlayerStatsFromMatch(matchId: number): Promise<void>; // Simplified, logic inside

  // Team Statistics
  getTeamStats(teamId: number): Promise<TeamStatsType | undefined>;
  updateTeamStats(teamId: number, data: Partial<Omit<InsertTeamStats, 'teamId' | 'id' | 'updatedAt'>>): Promise<void>;
  calculateAndSaveTeamStats(teamId: number): Promise<TeamStatsType | undefined>;


  // Trivia
  getTriviaQuestions(): Promise<TriviaQuestion[]>;
  getTriviaLeaderboard(): Promise<TriviaLeaderboard[]>;
  submitTriviaScore(entry: InsertTriviaLeaderboard): Promise<TriviaLeaderboard>;

  // Scoring (Live Score Updates)
  getScoringMatch(matchId: number): Promise<ScoringMatch | undefined>;
  getScoringInnings(inningsId: number): Promise<ScoringInnings | undefined>;
  getScoringBallsForInnings(inningsId: number): Promise<ScoringBall[]>;
  createScoringMatch(matchData: InsertScoringMatch): Promise<ScoringMatch>;
  createScoringInnings(inningsData: InsertScoringInnings): Promise<ScoringInnings>;
  addScoringBall(ballData: InsertScoringBall): Promise<ScoringBall>;
  updateLiveMatchScore(matchId: number, inningsId: number, ballData: InsertScoringBall): Promise<void>;


  // Forum
  getForumCategories(): Promise<ForumCategory[]>;
  getForumTopics(categoryId?: number): Promise<ForumTopic[]>; // TODO: Add user info
  getForumTopicBySlug(slug: string): Promise<(ForumTopic & { user?: User, category?: ForumCategory, lastReplyUser?: User }) | undefined>;
  createForumTopic(topic: InsertForumTopic): Promise<ForumTopic>;
  getForumPosts(topicId: number): Promise<(ForumPost & { user?: User })[]>; // TODO: Add user info
  createForumPost(post: InsertForumPost): Promise<ForumPost>;
  getForumStats(): Promise<{ totalTopics: number; totalPosts: number; totalMembers: number }>;
  likeForumPost(postId: number, userId: number): Promise<boolean>;
  unlikeForumPost(postId: number, userId: number): Promise<boolean>;
  getUserProfile(userId: number): Promise<UserProfile | undefined>;
  updateUserProfile(userId: number, profileData: Partial<InsertUserProfile>): Promise<UserProfile | undefined>;


  // Community Events
  getCommunityEvents(): Promise<CommunityEvent[]>; // TODO: Add organizer info
  getCommunityEvent(eventId: number): Promise<(CommunityEvent & { organizer?: User }) | undefined>;
  createCommunityEvent(event: InsertCommunityEvent): Promise<CommunityEvent>;
  joinCommunityEvent(eventId: number, userId: number): Promise<EventParticipant>;
  leaveCommunityEvent(eventId: number, userId: number): Promise<void>;
  getCommunityStats(): Promise<{ activeMembersCount: number }>;

  // Player Registrations
  createPlayerRegistration(registrationData: InsertPlayerRegistration): Promise<PlayerRegistration>;
  getPlayerRegistration(id: number): Promise<PlayerRegistration | undefined>;
  getAllPlayerRegistrations(): Promise<PlayerRegistration[]>;
  updatePlayerRegistrationStatus(id: number, status: string, adminNotes?: string): Promise<PlayerRegistration | undefined>;
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

  async getVenues(): Promise<Venue[]> {
    return db.select().from(venues);
  }

  async createVenue(venueData: InsertVenue): Promise<Venue> {
    const [newVenue] = await db.insert(venues).values(venueData).returning();
    return newVenue;
  }

  async getCompetitions(): Promise<Competition[]> {
    return db.select().from(competitions);
  }

  async createCompetition(competitionData: InsertCompetition): Promise<Competition> {
    const [newCompetition] = await db.insert(competitions).values(competitionData).returning();
    return newCompetition;
  }

  async getPlayers(): Promise<(Player & { stats?: PlayerStats })[]> {
    try {
      const playerList = await db
        .select({
            player: players,
            stats: playerStats
        })
        .from(players)
        .leftJoin(playerStats, eq(players.id, playerStats.playerId))
        .where(eq(players.isActive, true))
        .orderBy(players.name);

      return playerList.map(p => ({
        ...p.player,
        stats: p.stats || undefined
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
    // Consider implications: match performances, lineups, player of match in matches table
    await db.delete(matchPerformances).where(eq(matchPerformances.playerId, id));
    await db.delete(lineups).where(eq(lineups.playerId, id));
    await db.update(matches).set({ playerOfMatch: null }).where(eq(matches.playerOfMatch, id));
    await db.delete(playerStats).where(eq(playerStats.playerId, id));
    await db.delete(players).where(eq(players.id, id));
  }

  async deleteAllPlayers(): Promise<void> {
    await db.update(matches).set({ playerOfMatch: null });
    await db.delete(lineups);
    await db.delete(matchPerformances);
    await db.delete(playerStats);
    await db.delete(players);
  }

  async getStartingLineup(matchId: number): Promise<(Lineup & { player: Player })[]> {
    const lineupResult = await db
      .select()
      .from(lineups)
      .innerJoin(players, eq(lineups.playerId, players.id))
      .where(eq(lineups.matchId, matchId))
      .orderBy(sql`CASE WHEN ${lineups.battingOrder} IS NULL THEN 1 ELSE 0 END`, lineups.battingOrder); // Puts nulls last if sorting by battingOrder

    return lineupResult.map(row => ({
      ...row.lineups,
      player: row.players
    }));
  }

  async getMatches(): Promise<(Match & { homeTeam?: Team; awayTeam?: Team; venue?: Venue; competition?: Competition })[]> {
    const matchesData = await db
      .select({
        match: matches,
        homeTeam: teams, // Alias for home team
        // awayTeam: teams, // This needs to be a separate join or subquery
        venue: venues,
        competition: competitions
      })
      .from(matches)
      .leftJoin(teams, eq(matches.homeTeamId, teams.id)) // For homeTeam
      .leftJoin(venues, eq(matches.venueId, venues.id))
      .leftJoin(competitions, eq(matches.competitionId, competitions.id))
      .orderBy(desc(matches.matchDate));

    // Efficiently fetch all away teams
    const awayTeamIds = matchesData.map(m => m.match.awayTeamId).filter(id => id !== null) as number[];
    let awayTeamsMap: Map<number, Team> = new Map();
    if (awayTeamIds.length > 0) {
        const awayTeamsList = await db.select().from(teams).where(sql`${teams.id} IN ${awayTeamIds}`);
        awayTeamsMap = new Map(awayTeamsList.map(t => [t.id, t]));
    }

    return matchesData.map(row => ({
      ...row.match,
      homeTeam: row.homeTeam || undefined,
      awayTeam: row.match.awayTeamId ? awayTeamsMap.get(row.match.awayTeamId) : undefined,
      venue: row.venue || undefined,
      competition: row.competition || undefined
    }));
  }

  async getMatch(id: number): Promise<(Match & { homeTeam?: Team; awayTeam?: Team; venue?: Venue; competition?: Competition }) | undefined> {
    const [matchData] = await db
      .select({
        match: matches,
        homeTeam: teams,
        venue: venues,
        competition: competitions
      })
      .from(matches)
      .leftJoin(teams, eq(matches.homeTeamId, teams.id))
      .leftJoin(venues, eq(matches.venueId, venues.id))
      .leftJoin(competitions, eq(matches.competitionId, competitions.id))
      .where(eq(matches.id, id));

    if (!matchData) return undefined;

    let awayTeamData: Team | undefined = undefined;
    if (matchData.match.awayTeamId) {
        [awayTeamData] = await db.select().from(teams).where(eq(teams.id, matchData.match.awayTeamId));
    }

    return {
      ...matchData.match,
      homeTeam: matchData.homeTeam || undefined,
      awayTeam: awayTeamData,
      venue: matchData.venue || undefined,
      competition: matchData.competition || undefined
    };
  }

  async createMatch(match: InsertMatch): Promise<Match> {
    const [newMatch] = await db.insert(matches).values(match).returning();
    return newMatch;
  }

  async updateMatch(id: number, match: Partial<InsertMatch>): Promise<void> {
    await db.update(matches).set(match).where(eq(matches.id, id));
  }

  async getLiveMatches(): Promise<(Match & { homeTeam?: Team; awayTeam?: Team })[]> {
     const liveMatchesData = await db
      .select({ match: matches, homeTeam: teams })
      .from(matches)
      .leftJoin(teams, eq(matches.homeTeamId, teams.id))
      .where(eq(matches.status, 'live'))
      .orderBy(desc(matches.matchDate));

    const awayTeamIds = liveMatchesData.map(m => m.match.awayTeamId).filter(id => id !== null) as number[];
    let awayTeamsMap: Map<number, Team> = new Map();
    if (awayTeamIds.length > 0) {
        const awayTeamsList = await db.select().from(teams).where(sql`${teams.id} IN ${awayTeamIds}`);
        awayTeamsMap = new Map(awayTeamsList.map(t => [t.id, t]));
    }

    return liveMatchesData.map(row => ({
        ...row.match,
        homeTeam: row.homeTeam || undefined,
        awayTeam: row.match.awayTeamId ? awayTeamsMap.get(row.match.awayTeamId) : undefined,
    }));
  }

  async getUpcomingMatches(): Promise<(Match & { homeTeam?: Team; awayTeam?: Team; venue?: Venue })[]> {
    const upcomingMatchesData = await db
      .select({ match: matches, homeTeam: teams, venue: venues })
      .from(matches)
      .leftJoin(teams, eq(matches.homeTeamId, teams.id))
      .leftJoin(venues, eq(matches.venueId, venues.id))
      .where(and(eq(matches.status, 'scheduled'), sql`${matches.matchDate} > NOW()`))
      .orderBy(matches.matchDate);

    const awayTeamIds = upcomingMatchesData.map(m => m.match.awayTeamId).filter(id => id !== null) as number[];
    let awayTeamsMap: Map<number, Team> = new Map();
    if (awayTeamIds.length > 0) {
        const awayTeamsList = await db.select().from(teams).where(sql`${teams.id} IN ${awayTeamIds}`);
        awayTeamsMap = new Map(awayTeamsList.map(t => [t.id, t]));
    }
    
    return upcomingMatchesData.map(row => ({
        ...row.match,
        homeTeam: row.homeTeam || undefined,
        awayTeam: row.match.awayTeamId ? awayTeamsMap.get(row.match.awayTeamId) : undefined,
        venue: row.venue || undefined
    }));
  }

  async getRecentMatches(): Promise<(Match & { homeTeam?: Team; awayTeam?: Team })[]> {
    const recentMatchesData = await db
      .select({ match: matches, homeTeam: teams })
      .from(matches)
      .leftJoin(teams, eq(matches.homeTeamId, teams.id))
      .where(and(eq(matches.status, 'completed'), sql`${matches.matchDate} <= NOW()`))
      .orderBy(desc(matches.matchDate))
      .limit(5);

    const awayTeamIds = recentMatchesData.map(m => m.match.awayTeamId).filter(id => id !== null) as number[];
    let awayTeamsMap: Map<number, Team> = new Map();
    if (awayTeamIds.length > 0) {
        const awayTeamsList = await db.select().from(teams).where(sql`${teams.id} IN ${awayTeamIds}`);
        awayTeamsMap = new Map(awayTeamsList.map(t => [t.id, t]));
    }

    return recentMatchesData.map(row => ({
        ...row.match,
        homeTeam: row.homeTeam || undefined,
        awayTeam: row.match.awayTeamId ? awayTeamsMap.get(row.match.awayTeamId) : undefined,
    }));
  }

  async getArticles(): Promise<Article[]> {
    return await db
      .select()
      .from(articles)
      .where(eq(articles.isPublished, true))
      .orderBy(desc(sql`COALESCE(${articles.publishedAt}, ${articles.createdAt})`));
  }

  async getArticle(id: number): Promise<Article | undefined> {
    const [article] = await db.select().from(articles).where(eq(articles.id, id));
    return article || undefined;
  }

  async getArticleBySlug(slug: string): Promise<Article | undefined> {
    const [article] = await db.select().from(articles).where(and(eq(articles.slug, slug), eq(articles.isPublished, true)));
    return article || undefined;
  }

  async createArticle(article: InsertArticle): Promise<Article> {
    const [newArticle] = await db.insert(articles).values(article).returning();
    return newArticle;
  }

  async updateArticle(id: number, article: Partial<InsertArticle>): Promise<void> {
    await db.update(articles).set({...article, updatedAt: new Date()}).where(eq(articles.id, id));
  }

  async deleteArticle(id: number): Promise<void> {
    await db.delete(articles).where(eq(articles.id, id));
  }

  async getFeaturedArticles(): Promise<Article[]> {
    return await db
      .select()
      .from(articles)
      .where(and(eq(articles.isPublished, true), eq(articles.isFeatured, true)))
      .orderBy(desc(sql`COALESCE(${articles.publishedAt}, ${articles.createdAt})`))
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
      .where(and(eq(polls.isActive, true), or(isNull(polls.endsAt), sql`${polls.endsAt} > NOW()`)))
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
    await db.update(polls).set({...poll, updatedAt: new Date()}).where(eq(polls.id, id));
  }

  async deletePoll(id: number): Promise<void> {
    await db.delete(polls).where(eq(polls.id, id));
  }

  async votePoll(pollId: number, optionId: string, userId?: number, userIp?: string): Promise<Poll | undefined> {
    // This is a simplified example. Real voting needs to prevent multiple votes.
    // For now, we assume `votes` is a JSONB field like {"optionId1": count, "optionId2": count}
    const poll = await this.getPoll(pollId);
    if (!poll) throw new Error("Poll not found");

    const currentVotes = (typeof poll.votes === 'string' ? JSON.parse(poll.votes) : poll.votes) || {};
    currentVotes[optionId] = (currentVotes[optionId] || 0) + 1;

    await db.update(polls).set({ votes: currentVotes, updatedAt: new Date() }).where(eq(polls.id, pollId));
    return this.getPoll(pollId);
  }

  async getActiveQuizzes(): Promise<Quiz[]> {
    return await db
      .select()
      .from(quizzes)
      .where(eq(quizzes.isActive, true))
      .orderBy(desc(quizzes.createdAt));
  }

  async getQuiz(id: number): Promise<(Quiz & { questions?: QuizQuestion[] }) | undefined> {
    const [quizData] = await db.select().from(quizzes).where(eq(quizzes.id, id));
    if (!quizData) return undefined;
    const questionsData = await this.getQuizQuestions(id);
    return { ...quizData, questions: questionsData };
  }

  async createQuiz(quiz: InsertQuiz): Promise<Quiz> {
    const [newQuiz] = await db.insert(quizzes).values(quiz).returning();
    return newQuiz;
  }

  async getQuizQuestions(quizId: number): Promise<QuizQuestion[]> {
    return db.select().from(quizQuestions).where(eq(quizQuestions.quizId, quizId)).orderBy(quizQuestions.id);
  }

  async createQuizQuestion(question: InsertQuizQuestion): Promise<QuizQuestion> {
    const [newQuestion] = await db.insert(quizQuestions).values(question).returning();
    return newQuestion;
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
      const [existingLike] = await db
        .select()
        .from(galleryLikes)
        .where(and(eq(galleryLikes.galleryItemId, galleryItemId), eq(galleryLikes.userIp, userIp)));
      if (existingLike) {
        console.log(`User ${userIp} already liked item ${galleryItemId}`);
        return false; // Already liked
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
        await db.update(gallery).set({ likesCount: sql`${gallery.likesCount} - 1` }).where(and(eq(gallery.id, galleryItemId), sql`${gallery.likesCount} > 0`));
      }
      return deleted.length > 0;
    } catch (error) {
      console.error('Error unliking gallery item:', error);
      return false;
    }
  }

  async hasUserLikedGalleryItem(galleryItemId: number, userIp: string): Promise<boolean> {
    try {
      const [existingLike] = await db
        .select({ id: galleryLikes.id })
        .from(galleryLikes)
        .where(and(eq(galleryLikes.galleryItemId, galleryItemId), eq(galleryLikes.userIp, userIp)))
        .limit(1);
      return !!existingLike;
    } catch (error) {
      console.error('Error checking gallery like:', error);
      return false;
    }
  }

  async getAnnouncements(): Promise<Announcement[]> {
    return await db
      .select()
      .from(announcements)
      .where(and(eq(announcements.isActive, true), or(isNull(announcements.expiresAt), sql`${announcements.expiresAt} > NOW()`)))
      .orderBy(desc(announcements.createdAt));
  }

  async createAnnouncement(announcement: InsertAnnouncement): Promise<Announcement> {
    const [newAnnouncement] = await db.insert(announcements).values(announcement).returning();
    return newAnnouncement;
  }

  async updateAnnouncement(id: number, announcement: Partial<InsertAnnouncement>): Promise<void> {
    await db.update(announcements).set({...announcement, updatedAt: new Date()}).where(eq(announcements.id, id));
  }

  async deleteAnnouncement(id: number): Promise<void> {
    await db.delete(announcements).where(eq(announcements.id, id));
  }

  async getPlayerStats(playerId: number): Promise<PlayerStats | undefined> {
    const [stats] = await db.select().from(playerStats).where(eq(playerStats.playerId, playerId));
    return stats;
  }
  
  async updatePlayerStats(playerId: number, statsData: Partial<PlayerStats>): Promise<void> {
    const existingStats = await this.getPlayerStats(playerId);
    if (existingStats) {
      await db.update(playerStats).set({...statsData, updatedAt: new Date()}).where(eq(playerStats.playerId, playerId));
    } else {
      // Ensure all required fields for InsertPlayerStats are present if creating new
      const fullStatsData: InsertPlayerStats = {
        playerId: playerId,
        matches: statsData.matches ?? 0,
        runsScored: statsData.runsScored ?? 0,
        ballsFaced: statsData.ballsFaced ?? 0,
        fours: statsData.fours ?? 0,
        sixes: statsData.sixes ?? 0,
        wicketsTaken: statsData.wicketsTaken ?? 0,
        ballsBowled: statsData.ballsBowled ?? 0,
        runsConceded: statsData.runsConceded ?? 0,
        catches: statsData.catches ?? 0,
        stumpings: statsData.stumpings ?? 0,
        runOuts: statsData.runOuts ?? 0,
        // ... include any other non-optional fields from InsertPlayerStats schema with defaults
        ...statsData, // Spread last to override defaults with provided values
        updatedAt: new Date(),
      };
      await db.insert(playerStats).values(fullStatsData);
    }
  }

  async createMatchPerformance(performance: InsertMatchPerformance): Promise<MatchPerformance> {
    const [result] = await db.insert(matchPerformances).values(performance).returning();
    return result;
  }

  async getMatchPerformances(matchId: number): Promise<(MatchPerformance & { player?: Player })[]> {
    const performances = await db.select({
        performance: matchPerformances,
        player: players
      })
      .from(matchPerformances)
      .leftJoin(players, eq(matchPerformances.playerId, players.id))
      .where(eq(matchPerformances.matchId, matchId));
    
    return performances.map(p => ({
        ...p.performance,
        player: p.player || undefined
    }));
  }

  async updatePlayerStatsFromMatch(matchId: number): Promise<void> {
    const performances = await this.getMatchPerformances(matchId);
    for (const perf of performances) {
      if (!perf.playerId) continue;

      const currentStats = await this.getPlayerStats(perf.playerId) || {
        playerId: perf.playerId, matches: 0, runsScored: 0, ballsFaced: 0, fours: 0, sixes: 0,
        wicketsTaken: 0, ballsBowled: 0, runsConceded: 0, catches: 0, stumpings: 0, runOuts: 0,
      };

      const updatedStats: PlayerStats = {
        ...currentStats,
        id: currentStats.id, // Keep existing ID if present
        matches: (currentStats.matches || 0) + 1,
        runsScored: (currentStats.runsScored || 0) + (perf.runsScored || 0),
        ballsFaced: (currentStats.ballsFaced || 0) + (perf.ballsFaced || 0),
        fours: (currentStats.fours || 0) + (perf.fours || 0),
        sixes: (currentStats.sixes || 0) + (perf.sixes || 0),
        wicketsTaken: (currentStats.wicketsTaken || 0) + (perf.wicketsTaken || 0),
        ballsBowled: (currentStats.ballsBowled || 0) + (perf.ballsBowled || 0), // Stored as balls
        runsConceded: (currentStats.runsConceded || 0) + (perf.runsConceded || 0),
        catches: (currentStats.catches || 0) + (perf.catches || 0),
        stumpings: (currentStats.stumpings || 0) + (perf.stumpings || 0),
        runOuts: (currentStats.runOuts || 0) + (perf.runOuts || 0),
        updatedAt: new Date(),
      };
      await this.updatePlayerStats(perf.playerId, updatedStats);
    }
  }
  
  async getTeamStats(teamId: number): Promise<TeamStatsType | undefined> {
    const [stats] = await db.select().from(teamStats).where(eq(teamStats.teamId, teamId));
    return stats;
  }

  async updateTeamStats(teamId: number, data: Partial<Omit<InsertTeamStats, 'teamId' | 'id' | 'updatedAt'>>): Promise<void> {
    const existingStats = await this.getTeamStats(teamId);
    const updateData = { ...data, updatedAt: new Date() };
    if (existingStats) {
      await db.update(teamStats).set(updateData).where(eq(teamStats.teamId, teamId));
    } else {
      await db.insert(teamStats).values({ ...updateData, teamId });
    }
  }

  async calculateAndSaveTeamStats(teamId: number): Promise<TeamStatsType | undefined> {
    const teamMatches = await db.select()
        .from(matches)
        .where(or(eq(matches.homeTeamId, teamId), eq(matches.awayTeamId, teamId)))
        .where(eq(matches.status, 'completed'));

    if (teamMatches.length === 0) {
        const defaultStats: InsertTeamStats = { teamId, matchesPlayed: 0, matchesWon: 0, matchesLost: 0, matchesDraw: 0, totalRunsScored: 0, totalOversFaced: 0, wicketsLost: 0, totalRunsConceded: 0, oversBowledByTeam: 0, wicketsTakenByBowlers: 0, nrr: 0, points: 0, winRate: 0, updatedAt: new Date() };
        const existing = await this.getTeamStats(teamId);
        if(existing) await db.update(teamStats).set(defaultStats).where(eq(teamStats.teamId, teamId));
        else await db.insert(teamStats).values(defaultStats);
        return this.getTeamStats(teamId);
    }
    
    let matchesWon = 0;
    let matchesLost = 0;
    let matchesDraw = 0;
    let totalRunsScoredByTeam = 0;
    let totalOversFacedByTeam = 0; // Decimal overs
    let totalWicketsLostByTeam = 0;
    let totalRunsConcededByTeam = 0;
    let totalOversBowledByTeam = 0; // Decimal overs
    let totalWicketsTakenByTeam = 0;

    for (const match of teamMatches) {
        const isHomeTeam = match.homeTeamId === teamId;
        const teamScoreStr = isHomeTeam ? match.homeTeamScore : match.awayTeamScore;
        const teamOversStr = isHomeTeam ? match.homeTeamOvers : match.awayTeamOvers;
        const opponentScoreStr = isHomeTeam ? match.awayTeamScore : match.homeTeamScore;
        const opponentOversStr = isHomeTeam ? match.awayTeamOvers : match.homeTeamOvers;

        const parseScore = (scoreStr: string | null) => {
            if (!scoreStr) return { runs: 0, wickets: 0};
            const parts = scoreStr.split('/');
            return { runs: parseInt(parts[0]) || 0, wickets: parseInt(parts[1]) || 0 };
        };
        const parseOvers = (oversStr: string | null) => parseFloat(oversStr || '0') || 0;

        const teamScore = parseScore(teamScoreStr);
        const teamOvers = parseOvers(teamOversStr);
        const opponentScore = parseScore(opponentScoreStr);
        const opponentOvers = parseOvers(opponentOversStr);

        totalRunsScoredByTeam += teamScore.runs;
        totalOversFacedByTeam += teamOvers;
        totalWicketsLostByTeam += teamScore.wickets;
        totalRunsConcededByTeam += opponentScore.runs;
        totalOversBowledByTeam += opponentOvers;
        // Wickets taken needs to come from opponent's score if detailed that way, or aggregated from player bowling stats.
        // For simplicity, if opponentScore includes wickets, we use that.
        totalWicketsTakenByTeam += opponentScore.wickets;


        if (match.matchResult) {
            if (match.matchResult.toLowerCase().includes('won')) { // Assuming result string indicates winning team if not 'Tuskers won'
                if ((isHomeTeam && teamScore.runs > opponentScore.runs) || (!isHomeTeam && teamScore.runs > opponentScore.runs)) {
                    matchesWon++;
                } else if ((isHomeTeam && teamScore.runs < opponentScore.runs) || (!isHomeTeam && teamScore.runs < opponentScore.runs)){
                    matchesLost++;
                } else {
                    // Could be a tie where result string says "Team X won by super over"
                    // This simple logic might need refinement based on exact matchResult format
                }
            } else if (match.matchResult.toLowerCase().includes('lost')) {
                 if ((isHomeTeam && teamScore.runs < opponentScore.runs) || (!isHomeTeam && teamScore.runs < opponentScore.runs)) {
                    matchesLost++;
                } else if ((isHomeTeam && teamScore.runs > opponentScore.runs) || (!isHomeTeam && teamScore.runs > opponentScore.runs)){
                    matchesWon++;
                }
            } else if (match.matchResult.toLowerCase().includes('draw') || match.matchResult.toLowerCase().includes('tied')) {
                matchesDraw++;
            }
        }
    }

    const nrr = (totalOversFacedByTeam > 0 && totalOversBowledByTeam > 0)
        ? (totalRunsScoredByTeam / totalOversFacedByTeam) - (totalRunsConcededByTeam / totalOversBowledByTeam)
        : 0;
    
    const winRate = teamMatches.length > 0 ? (matchesWon / teamMatches.length) * 100 : 0;

    const calculatedStats: InsertTeamStats = {
        teamId,
        matchesPlayed: teamMatches.length,
        matchesWon,
        matchesLost,
        matchesDraw,
        totalRunsScored: totalRunsScoredByTeam,
        totalOversFaced: totalOversFacedByTeam,
        wicketsLost: totalWicketsLostByTeam,
        totalRunsConceded: totalRunsConcededByTeam,
        oversBowledByTeam: totalOversBowledByTeam,
        wicketsTakenByBowlers: totalWicketsTakenByTeam,
        nrr: parseFloat(nrr.toFixed(3)),
        points: (matchesWon * 2) + (matchesDraw * 1), // Example point system
        winRate: parseFloat(winRate.toFixed(2)),
        updatedAt: new Date(),
    };
    
    await this.updateTeamStats(teamId, calculatedStats);
    return this.getTeamStats(teamId);
}


  async getTriviaQuestions(): Promise<TriviaQuestion[]> {
    return await db.select().from(triviaQuestions).where(eq(triviaQuestions.isActive, true));
  }

  async getTriviaLeaderboard(): Promise<TriviaLeaderboard[]> {
    // Example: Get top 50 for today. Adjust as needed.
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    return await db
      .select()
      .from(triviaLeaderboard)
      .where(and(
        sql`${triviaLeaderboard.playDate} >= ${todayStart}`,
        sql`${triviaLeaderboard.playDate} <= ${todayEnd}`
      ))
      .orderBy(desc(triviaLeaderboard.score), desc(triviaLeaderboard.accuracy)) // Assuming accuracy is a field
      .limit(50);
  }

  async submitTriviaScore(entry: InsertTriviaLeaderboard): Promise<TriviaLeaderboard> {
    const [result] = await db.insert(triviaLeaderboard).values(entry).returning();
    return result;
  }

  // Scoring (Live Score Updates)
  async getScoringMatch(matchId: number): Promise<ScoringMatch | undefined> {
    const [match] = await db.select().from(scoringMatches).where(eq(scoringMatches.id, matchId));
    return match;
  }
  async getScoringInnings(inningsId: number): Promise<ScoringInnings | undefined> {
    const [innings] = await db.select().from(scoringInnings).where(eq(scoringInnings.id, inningsId));
    return innings;
  }
  async getScoringBallsForInnings(inningsId: number): Promise<ScoringBall[]> {
    return db.select().from(scoringBalls).where(eq(scoringBalls.inningsId, inningsId)).orderBy(scoringBalls.overNumber, scoringBalls.ballNumberInOver);
  }
  async createScoringMatch(matchData: InsertScoringMatch): Promise<ScoringMatch> {
    const [newMatch] = await db.insert(scoringMatches).values(matchData).returning();
    return newMatch;
  }
  async createScoringInnings(inningsData: InsertScoringInnings): Promise<ScoringInnings> {
    const [newInnings] = await db.insert(scoringInnings).values(inningsData).returning();
    // If this is the first innings, update scoringMatches.currentInningsId
    if (newInnings.matchId && newInnings.inningsNumber === 1) {
        await db.update(scoringMatches).set({ currentInningsId: newInnings.id }).where(eq(scoringMatches.id, newInnings.matchId));
    }
    return newInnings;
  }
  async addScoringBall(ballData: InsertScoringBall): Promise<ScoringBall> {
    const [newBall] = await db.insert(scoringBalls).values(ballData).returning();
    return newBall;
  }
  async updateLiveMatchScore(matchId: number, inningsId: number, ballData: InsertScoringBall): Promise<void> {
    // Add the ball
    await this.addScoringBall({ ...ballData, inningsId });

    // Update innings score
    const currentInnings = await this.getScoringInnings(inningsId);
    if (!currentInnings) throw new Error("Innings not found for live update");

    let totalRuns = currentInnings.totalRuns || 0;
    let totalWickets = currentInnings.totalWickets || 0;
    let extras = currentInnings.extras || 0;

    totalRuns += (ballData.runsScored || 0) + (ballData.extraRuns || 0);
    if (ballData.isWicket) {
        totalWickets += 1;
    }
    if (ballData.isExtra) {
        extras += (ballData.extraRuns || 0);
    }
    
    // Calculate total overs bowled (more complex due to partial overs)
    // This requires knowing the max balls per over (usually 6, excluding extras)
    // For simplicity, this example might not perfectly calculate decimal overs from balls alone.
    // A more robust solution would track balls in current over.
    // const ballsInOver = await db.select({count: count()}).from(scoringBalls).where(and(eq(scoringBalls.inningsId, inningsId), eq(scoringBalls.overNumber, ballData.overNumber), eq(scoringBalls.isExtra, false))));
    // const completedOvers = ballData.overNumber -1;
    // const currentOverBalls = ballsInOver[0].count;
    // const totalOversBowled = completedOvers + (currentOverBalls / 6);

    // Simplified totalOversBowled - assumes ballData.overNumber is the current full over if last ball
    // This needs a more robust calculation based on all balls.
    const allBallsInInnings = await this.getScoringBallsForInnings(inningsId);
    let legalBalls = 0;
    let maxOver = 0;
    allBallsInInnings.forEach(b => {
        if (!b.isExtra || (b.extraType === 'nb' && b.runsScored > 0) ) { // No-ball with runs counts as a ball faced, but not for over completion in some rules
             // Standard rule: only no-balls and wides don't count towards the 6 balls of an over.
             // For simplicity here, we count non-extra balls.
            if(!b.isExtra || (b.extraType === 'nb' && b.runsScored > 0)){ // count no balls that have runs as legal for runs, but not for over count
                 // A no-ball that batsmen score off is still one of the 6 if it's not also a wide.
                 // This logic can be tricky. Let's count balls that are not wide or no-ball (unless runs scored on no-ball for some systems)
            }
        }
        if(b.overNumber > maxOver) maxOver = b.overNumber;
    });
    // This is still a simplification. True over calculation is complex.
    // Drizzle ORM doesn't have a direct way to do `COUNT(DISTINCT over_number)` easily combined with sum of fractional last over.
    // Often, totalOversBowled is directly updated or calculated based on a 'balls_in_current_over' field.

    const lastBallOfOver = allBallsInInnings.filter(b => b.overNumber === maxOver && !b.isExtra && b.extraType !== 'wd').length;
    const totalOversBowledDecimal = (maxOver -1) + (lastBallOfOver / 6.0);


    await db.update(scoringInnings).set({
        totalRuns,
        totalWickets,
        extras,
        totalOversBowled: parseFloat(totalOversBowledDecimal.toFixed(1)) // Store as decimal
    }).where(eq(scoringInnings.id, inningsId));

    // Potentially update match status if innings/match ends
    const matchDetails = await this.getScoringMatch(matchId);
    if (matchDetails && matchDetails.oversPerInnings) {
        if (totalWickets >= 10 || totalOversBowledDecimal >= matchDetails.oversPerInnings) {
            await db.update(scoringInnings).set({ isCompleted: true }).where(eq(scoringInnings.id, inningsId));
            // Further logic for match completion, next innings etc.
        }
    }
  }


  async getForumCategories(): Promise<ForumCategory[]> {
    return await db.select().from(forumCategories).orderBy(forumCategories.sortOrder, forumCategories.name);
  }

  async getForumTopics(categoryId?: number): Promise<ForumTopic[]> { // TODO: Add user info
    let query = db.select({
        topic: forumTopics,
        user: users, // For topic creator
        // lastReplyUser: users, // Need alias for last reply user
        category: forumCategories
    })
    .from(forumTopics)
    .innerJoin(users, eq(forumTopics.userId, users.id))
    .innerJoin(forumCategories, eq(forumTopics.categoryId, forumCategories.id))
    // .leftJoin(users, eq(forumTopics.lastReplyUserId, users.id)) // This needs an alias for users table
    .orderBy(desc(forumTopics.isSticky), desc(forumTopics.lastReplyAt), desc(forumTopics.createdAt));

    if (categoryId) {
      query = query.where(eq(forumTopics.categoryId, categoryId));
    }
    
    const results = await query;
    // Manual join for lastReplyUser if needed or adjust schema for better Drizzle support with aliases
    return results.map(r => ({
        ...r.topic,
        user: r.user,
        category: r.category,
        // lastReplyUser: Find manually or improve query
    }));
  }

  async getForumTopicBySlug(slug: string): Promise<(ForumTopic & { user?: User, category?: ForumCategory, lastReplyUser?: User }) | undefined> {
    const [result] = await db.select({
        topic: forumTopics,
        user: users,
        category: forumCategories,
        // lastReplyUser: users // Needs alias
    })
    .from(forumTopics)
    .innerJoin(users, eq(forumTopics.userId, users.id))
    .innerJoin(forumCategories, eq(forumTopics.categoryId, forumCategories.id))
    // .leftJoin(users, eq(forumTopics.lastReplyUserId, users.id)) // Needs alias
    .where(eq(forumTopics.slug, slug));

    if (!result) return undefined;
    // Fetch lastReplyUser separately if needed
    let lastReplyUserData: User | undefined = undefined;
    if (result.topic.lastReplyUserId) {
        [lastReplyUserData] = await db.select().from(users).where(eq(users.id, result.topic.lastReplyUserId));
    }

    return {
        ...result.topic,
        user: result.user,
        category: result.category,
        lastReplyUser: lastReplyUserData
    };
  }


  async createForumTopic(topicData: InsertForumTopic): Promise<ForumTopic> {
    const [newTopic] = await db.insert(forumTopics).values(topicData).returning();
    return newTopic;
  }

  async getForumPosts(topicId: number): Promise<(ForumPost & { user?: User })[]> { // TODO: Add user info
    const postResults = await db.select({
        post: forumPosts,
        user: users
    })
    .from(forumPosts)
    .innerJoin(users, eq(forumPosts.userId, users.id))
    .where(eq(forumPosts.topicId, topicId))
    .orderBy(forumPosts.createdAt);
    
    return postResults.map(r => ({
        ...r.post,
        user: r.user
    }));
  }

  async createForumPost(postData: InsertForumPost): Promise<ForumPost> {
    const [newPost] = await db.insert(forumPosts).values(postData).returning();
    // Update topic's replyCount and lastReplyAt/lastReplyUserId
    await db.update(forumTopics)
      .set({
        replyCount: sql`${forumTopics.replyCount} + 1`,
        lastReplyAt: new Date(),
        lastReplyUserId: newPost.userId, // Assuming newPost has userId
        lastPostId: newPost.id
      })
      .where(eq(forumTopics.id, newPost.topicId));
    return newPost;
  }

  async getForumStats(): Promise<{ totalTopics: number; totalPosts: number; totalMembers: number }> {
    const [topicsCount] = await db.select({ count: count() }).from(forumTopics);
    const [postsCount] = await db.select({ count: count() }).from(forumPosts);
    const [membersCount] = await db.select({ count: count() }).from(users); // Assuming 'users' is your general user table
    return {
      totalTopics: topicsCount.count,
      totalPosts: postsCount.count,
      totalMembers: membersCount.count
    };
  }

  async likeForumPost(postId: number, userId: number): Promise<boolean> {
    try {
        const [existingLike] = await db.select().from(forumPostLikes).where(and(eq(forumPostLikes.postId, postId), eq(forumPostLikes.userId, userId)));
        if (existingLike) return false; // Already liked

        await db.insert(forumPostLikes).values({ postId, userId });
        // Optionally, update a likes_count on forumPosts table:
        // await db.update(forumPosts).set({ likesCount: sql`${forumPosts.likesCount} + 1` }).where(eq(forumPosts.id, postId));
        return true;
    } catch (error) {
        console.error("Error liking forum post:", error);
        return false;
    }
  }
  async unlikeForumPost(postId: number, userId: number): Promise<boolean> {
    try {
        const result = await db.delete(forumPostLikes).where(and(eq(forumPostLikes.postId, postId), eq(forumPostLikes.userId, userId))).returning({id: forumPostLikes.id});
        if (result.length > 0) {
            // Optionally, update a likes_count on forumPosts table:
            // await db.update(forumPosts).set({ likesCount: sql`${forumPosts.likesCount} - 1` }).where(eq(forumPosts.id, postId));
            return true;
        }
        return false;
    } catch (error) {
        console.error("Error unliking forum post:", error);
        return false;
    }
  }

  async getUserProfile(userId: number): Promise<UserProfile | undefined> {
    const [profile] = await db.select().from(userProfiles).where(eq(userProfiles.userId, userId));
    return profile;
  }

  async updateUserProfile(userId: number, profileData: Partial<InsertUserProfile>): Promise<UserProfile | undefined> {
    const existing = await this.getUserProfile(userId);
    const dataToSet = {...profileData, updatedAt: new Date()};
    if (existing) {
        await db.update(userProfiles).set(dataToSet).where(eq(userProfiles.userId, userId));
    } else {
        await db.insert(userProfiles).values({ ...dataToSet, userId });
    }
    return this.getUserProfile(userId);
  }


  async getCommunityEvents(): Promise<CommunityEvent[]> { // TODO: Add organizer info
    return await db.select({
        event: communityEvents,
        organizer: users 
    })
    .from(communityEvents)
    .leftJoin(users, eq(communityEvents.organizerId, users.id))
    .orderBy(communityEvents.eventDate);
  }
  
  async getCommunityEvent(eventId: number): Promise<(CommunityEvent & { organizer?: User }) | undefined> {
    const [result] = await db.select({
        event: communityEvents,
        organizer: users
    })
    .from(communityEvents)
    .leftJoin(users, eq(communityEvents.organizerId, users.id))
    .where(eq(communityEvents.id, eventId));

    if(!result) return undefined;
    return { ...result.event, organizer: result.organizer || undefined };
  }


  async createCommunityEvent(event: InsertCommunityEvent): Promise<CommunityEvent> {
    const [newEvent] = await db.insert(communityEvents).values(event).returning();
    return newEvent;
  }

  async joinCommunityEvent(eventId: number, userId: number): Promise<EventParticipant> {
    // Check if already joined
    const [existingParticipant] = await db.select().from(eventParticipants).where(and(eq(eventParticipants.eventId, eventId), eq(eventParticipants.userId, userId)));
    if (existingParticipant) return existingParticipant;

    const [participant] = await db.insert(eventParticipants)
      .values({ eventId, userId, status: "registered" }) // Assuming default status
      .returning();
    // Update currentParticipants count on communityEvents table
    await db.update(communityEvents).set({ currentParticipants: sql`${communityEvents.currentParticipants} + 1`}).where(eq(communityEvents.id, eventId));
    return participant;
  }

  async leaveCommunityEvent(eventId: number, userId: number): Promise<void> {
    const deleted = await db.delete(eventParticipants)
      .where(and(eq(eventParticipants.eventId, eventId), eq(eventParticipants.userId, userId)))
      .returning({id: eventParticipants.id});
    if(deleted.length > 0){
        await db.update(communityEvents).set({ currentParticipants: sql`${communityEvents.currentParticipants} - 1`}).where(and(eq(communityEvents.id, eventId), sql`${communityEvents.currentParticipants} > 0`));
    }
  }

  async getCommunityStats(): Promise<{ activeMembersCount: number }> {
    // This might be better as distinct participants in events or forum users
    const [membersCount] = await db.select({ count: count() }).from(users);
    return { activeMembersCount: membersCount.count };
  }

  // Player Registration Methods
  /**
   * Inserts a new player registration into the database.
   * @param registrationData The registration data to insert.
   * @returns The newly inserted player registration.
   * @throws Error if the insert fails or the result is empty.
   */
  async createPlayerRegistration(registrationData: InsertPlayerRegistration): Promise<PlayerRegistration> {
    try {
      console.log('Attempting to insert registration:', registrationData);
      // Ensure all required fields for playerRegistrations are present in registrationData
      // or have defaults in the schema / are nullable.
      const dataToInsert: InsertPlayerRegistration = {
        ...registrationData,
        // submittedAt is handled by defaultNow() in schema if defined there, otherwise ensure it is provided
        // status defaults to 'pending' in schema if defined there
      };
      const [newRegistration] = await db.insert(playerRegistrations).values(dataToInsert).returning();
      if (!newRegistration) {
        console.error("Failed to insert player registration into the database. Data:", registrationData);
        throw new Error("Database insert failed. Registration was not saved.");
      }
      console.log("Inserted player registration:", newRegistration);
      return newRegistration;
    } catch (error) {
      console.error("Database error inserting player registration:", error);
      // More specific error handling or re-throwing
      if (error instanceof Error && error.message.includes("unique constraint")) {
          throw new Error("A registration with this email already exists.");
      }
      throw error; // Re-throw original error if not a known constraint violation
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
        .orderBy(desc(playerRegistrations.submittedAt)); // Assuming 'submittedAt' from schema
    } catch (error) {
      console.error("Database error retrieving all player registrations:", error);
      throw error;
    }
  }

  async updatePlayerRegistrationStatus(id: number, status: string, adminNotes?: string): Promise<PlayerRegistration | undefined> {
    try {
        const dataToUpdate: Partial<PlayerRegistration> = { status };
        if (adminNotes !== undefined) {
            dataToUpdate.adminNotes = adminNotes;
        }
        const [updatedRegistration] = await db.update(playerRegistrations)
            .set(dataToUpdate)
            .where(eq(playerRegistrations.id, id))
            .returning();
        return updatedRegistration;
    } catch (error) {
        console.error(`Database error updating status for registration ID ${id}:`, error);
        throw error;
    }
  }

} // This closes the main `export class DatabaseStorage implements IStorage`

export const storage = new DatabaseStorage();
