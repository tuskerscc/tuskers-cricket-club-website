import { pgTable, text, serial, integer, boolean, timestamp, jsonb, varchar, real } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// --- TABLES ---

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("admin"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const teams = pgTable("teams", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  shortName: text("short_name").notNull(),
  logo: text("logo"),
  isOurTeam: boolean("is_our_team").default(false),
});

export const venues = pgTable("venues", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  location: text("location"),
  capacity: integer("capacity"),
});

export const competitions = pgTable("competitions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  shortName: text("short_name"),
  type: text("type").notNull(),
});

export const players = pgTable("players", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  jerseyNumber: integer("jersey_number"),
  role: text("role").notNull(),
  battingStyle: text("batting_style"),
  bowlingStyle: text("bowling_style"),
  bio: text("bio"),
  photo: text("photo"),
  isCaptain: boolean("is_captain").default(false),
  isViceCaptain: boolean("is_vice_captain").default(false),
  isActive: boolean("is_active").default(true),
});

export const matches = pgTable("matches", {
  id: serial("id").primaryKey(),
  homeTeamId: integer("home_team_id").references(() => teams.id),
  awayTeamId: integer("away_team_id").references(() => teams.id),
  venueId: integer("venue_id").references(() => venues.id),
  competitionId: integer("competition_id").references(() => competitions.id),
  matchDate: timestamp("match_date").notNull(),
  matchResult: text("match_result"),
  homeTeamScore: varchar("home_team_score"),
  homeTeamOvers: varchar("home_team_overs"),
  awayTeamScore: varchar("away_team_score"),
  awayTeamOvers: varchar("away_team_overs"),
  playerOfMatch: integer("player_of_match").references(() => players.id),
  status: text("status").notNull().default("scheduled"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const lineups = pgTable("lineups", {
  id: serial("id").primaryKey(),
  matchId: integer("match_id").references(() => matches.id).notNull(),
  playerId: integer("player_id").references(() => players.id).notNull(),
  teamId: integer("team_id").references(() => teams.id).notNull(),
  isSubstitute: boolean("is_substitute").default(false),
  battingOrder: integer("batting_order"),
});

export const playerStats = pgTable("player_stats", {
  id: serial("id").primaryKey(),
  playerId: integer("player_id").references(() => players.id).notNull().unique(),
  matches: integer("matches").default(0),
  runsScored: integer("runs_scored").default(0),
  ballsFaced: integer("balls_faced").default(0),
  fours: integer("fours").default(0),
  sixes: integer("sixes").default(0),
  wicketsTaken: integer("wickets_taken").default(0),
  ballsBowled: integer("balls_bowled").default(0),
  runsConceded: integer("runs_conceded").default(0),
  catches: integer("catches").default(0),
  stumpings: integer("stumpings").default(0),
  runOuts: integer("run_outs").default(0),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const matchPerformances = pgTable("match_performances", {
  id: serial("id").primaryKey(),
  matchId: integer("match_id").references(() => matches.id).notNull(),
  playerId: integer("player_id").references(() => players.id).notNull(),
  teamId: integer("team_id").references(() => teams.id),
  runsScored: integer("runs_scored").default(0),
  ballsFaced: integer("balls_faced").default(0),
  fours: integer("fours").default(0),
  sixes: integer("sixes").default(0),
  wicketsTaken: integer("wickets_taken").default(0),
  ballsBowled: integer("balls_bowled").default(0),
  runsConceded: integer("runs_conceded").default(0),
  catches: integer("catches").default(0),
  stumpings: integer("stumpings").default(0),
  runOuts: integer("run_outs").default(0),
  isOut: boolean("is_out").default(false),
  dismissalType: text("dismissal_type"),
  bowlerCaughtBy: integer("bowler_caught_by").references(() => players.id),
  fielderAssisted: integer("fielder_assisted").references(() => players.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const articles = pgTable("articles", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt"),
  content: text("content").notNull(),
  featuredImage: text("featured_image"),
  authorId: integer("author_id").references(() => users.id),
  authorName: text("author_name"),
  category: text("category").notNull(),
  tags: text("tags").array(),
  isPublished: boolean("is_published").default(false),
  isFeatured: boolean("is_featured").default(false),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const socialPosts = pgTable("social_posts", {
  id: serial("id").primaryKey(),
  platform: text("platform").notNull(),
  postId: text("post_id").notNull().unique(),
  content: text("content").notNull(),
  author: text("author").notNull(),
  authorAvatar: text("author_avatar"),
  mediaUrl: text("media_url"),
  postUrl: text("post_url").notNull(),
  likes: integer("likes").default(0),
  comments: integer("comments").default(0),
  shares: integer("shares").default(0),
  postedAt: timestamp("posted_at").notNull(),
  fetchedAt: timestamp("fetched_at").defaultNow(),
});

export const polls = pgTable("polls", {
  id: serial("id").primaryKey(),
  question: text("question").notNull(),
  options: jsonb("options").notNull(),
  votes: jsonb("votes").default('{}'),
  isActive: boolean("is_active").default(true),
  createdBy: integer("created_by").references(() => users.id),
  endsAt: timestamp("ends_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const quizzes = pgTable("quizzes", {
  id: serial("id").primaryKey(),
  title: text("title"),
  isActive: boolean("is_active").default(true),
  createdBy: integer("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const quizQuestions = pgTable("quiz_questions", {
  id: serial("id").primaryKey(),
  quizId: integer("quiz_id").references(() => quizzes.id),
  question: text("question").notNull(),
  options: jsonb("options").notNull(),
  correctOptionId: text("correct_option_id").notNull(),
  explanation: text("explanation"),
  points: integer("points").default(10),
  createdAt: timestamp("created_at").defaultNow(),
});

export const gallery = pgTable("gallery", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  imageUrl: text("image_url").notNull(),
  category: text("category").notNull(),
  matchId: integer("match_id").references(() => matches.id),
  uploadedBy: integer("uploaded_by").references(() => users.id),
  likesCount: integer("likes_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const galleryLikes = pgTable("gallery_likes", {
  id: serial("id").primaryKey(),
  galleryItemId: integer("gallery_item_id").references(() => gallery.id, { onDelete: 'cascade' }).notNull(),
  userIp: text("user_ip").notNull(),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const announcements = pgTable("announcements", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  type: text("type").notNull().default('general'),
  priority: text("priority").notNull().default('medium'),
  isActive: boolean("is_active").default(true),
  publishedBy: integer("published_by").references(() => users.id),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const teamStats = pgTable("team_stats", {
  id: serial("id").primaryKey(),
  teamId: integer("team_id").references(() => teams.id).unique(),
  season: varchar("season", { length: 50 }),
  matchesPlayed: integer("matches_played").default(0),
  matchesWon: integer("matches_won").default(0),
  matchesLost: integer("matches_lost").default(0),
  matchesDraw: integer("matches_draw").default(0),
  matchesTied: integer("matches_tied").default(0),
  totalRunsScored: integer("total_runs_scored").default(0),
  totalOversFaced: real("total_overs_faced").default(0.0),
  wicketsLost: integer("wickets_lost").default(0),
  totalRunsConceded: integer("total_runs_conceded").default(0),
  oversBowledByTeam: real("overs_bowled_by_team").default(0.0),
  wicketsTakenByBowlers: integer("wickets_taken_by_bowlers").default(0),
  nrr: real("nrr").default(0.0),
  points: integer("points").default(0),
  winRate: real("win_rate").default(0.0),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const triviaQuestions = pgTable("trivia_questions", {
  id: serial("id").primaryKey(),
  question: text("question").notNull(),
  options: text("options").array().notNull(),
  correctAnswer: text("correct_answer").notNull(),
  difficulty: text("difficulty").notNull().default('medium'),
  category: text("category").notNull().default('general'),
  points: integer("points").default(10),
  isActive: boolean("is_active").default(true),
  explanation: text("explanation"),
  createdBy: integer("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const triviaLeaderboard = pgTable("trivia_leaderboard", {
  id: serial("id").primaryKey(),
  playerName: text("player_name").notNull(),
  score: integer("score").notNull(),
  questionsAnswered: integer("questions_answered").notNull(),
  accuracy: real("accuracy").notNull(),
  playDate: timestamp("play_date").defaultNow(),
  quizId: integer("quiz_id").references(() => quizzes.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// --- FORUM TABLES ---

export const forumCategories = pgTable("forum_categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  description: text("description"),
  icon: varchar("icon", { length: 50 }),
  color: varchar("color", { length: 20 }),
  sortOrder: integer("sort_order").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const forumTopics = pgTable("forum_topics", {
  id: serial("id").primaryKey(),
  categoryId: integer("category_id").references(() => forumCategories.id, { onDelete: 'cascade' }).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  slug: varchar("slug", { length: 250 }).unique().notNull(),
  isSticky: boolean("is_sticky").default(false),
  isLocked: boolean("is_locked").default(false),
  viewCount: integer("view_count").default(0),
  replyCount: integer("reply_count").default(0),
  lastPostId: integer("last_post_id"),
  lastReplyAt: timestamp("last_reply_at"),
  lastReplyUserId: integer("last_reply_user_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const forumPosts = pgTable("forum_posts", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  author: varchar("author", { length: 255 }).notNull(),
  topicId: integer("topic_id").references(() => forumTopics.id, { onDelete: 'cascade' }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  forumTopic: varchar("forum_topic", { length: 255 }),
});

export const forumPostLikes = pgTable("forum_post_likes", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").references(() => forumPosts.id, { onDelete: 'cascade' }).notNull(),
  userId: integer("user_id").references(() => users.id, { onDelete: 'cascade' }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userProfiles = pgTable("user_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: 'cascade' }).notNull().unique(),
  displayName: varchar("display_name", { length: 50 }),
  bio: text("bio"),
  location: varchar("location", { length: 100 }),
  favoritePlayer: varchar("favorite_player", { length: 100 }),
  joinDate: timestamp("join_date").defaultNow(),
  postCount: integer("post_count").default(0),
  reputation: integer("reputation").default(0),
  avatarUrl: varchar("avatar_url", { length: 255 }),
  isOnline: boolean("is_online").default(false),
  lastSeenAt: timestamp("last_seen_at").defaultNow(),
  badges: text("badges").array(),
  socialLinks: jsonb("social_links"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Base Zod schema for Player Registration (matching form input as closely as possible)
const basePlayerRegistrationFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"), // Expects "YYYY-MM-DD"
  gender: z.enum(["Male", "Female", "Prefer not to say"], { required_error: "Please select your gender" }),
  email: z.string().email("Please enter a valid email address"),
  mobilePhone: z.string().min(1, "Mobile phone number is required"),
  addressLine1: z.string().min(1, "Address line 1 is required"),
  addressLine2: z.string().optional(),
  townCity: z.string().min(1, "Town/City is required"),
  playingRoles: z.array(z.string()).min(1, "Please select at least one playing role"),
  battingStyle: z.enum(["Right-handed Bat", "Left-handed Bat"], { required_error: "Please select batting style" }),
  bowlingArm: z.string().optional(),
  bowlingType: z.string().optional(),
  highestLevel: z.string().min(1, "Please select your highest level of cricket played"),
  otherLevelDetails: z.string().optional(),
  previousClubs: z.string().optional(),
  hasMedicalConditions: z.enum(["Yes", "No"], { required_error: "Please indicate medical conditions" }),
  medicalDetails: z.string().optional(),
  isUnder18: z.enum(["Yes", "No"], { required_error: "Please indicate if player is under 18" }),
  parentGuardianName: z.string().optional(),
  parentGuardianEmail: z.string().email("Invalid email for parent/guardian").optional(),
  parentGuardianPhone: z.string().optional(),
  parentalConsent: z.boolean().optional(),
  codeOfConductAgreement: z.boolean().refine(val => val === true, { message: "You must agree to the Code of Conduct" }),
  photographyConsent: z.enum(["Consent", "Do not consent"], { required_error: "Photography preference required" }),
  dataPrivacyConsent: z.boolean().refine(val => val === true, { message: "You must agree to the data privacy terms" }),
  howDidYouHear: z.string().optional(),
  otherHearDetails: z.string().optional(),
});

// Zod schema for InsertPlayerRegistration (for database insertion, includes transformations)
export const insertPlayerRegistrationSchema = basePlayerRegistrationFormSchema
  .extend({
    playingRoles: z.array(z.string()).min(1).transform(val => JSON.stringify(val)),
  })
  .superRefine((data, ctx) => {
    // Conditional validation for bowling fields
    if (data.playingRoles && (JSON.parse(data.playingRoles as string)).includes("Bowler") || (JSON.parse(data.playingRoles as string)).includes("All-rounder")) {
      if (!data.bowlingArm) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Bowling arm is required for bowlers/all-rounders.", path: ["bowlingArm"] });
      }
      if (!data.bowlingType) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Bowling type is required for bowlers/all-rounders.", path: ["bowlingType"] });
      }
    }
    if (data.highestLevel === "Other (Please specify below)" && !data.otherLevelDetails) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Please specify the other level of cricket.", path: ["otherLevelDetails"] });
    }
    if (data.hasMedicalConditions === "Yes" && !data.medicalDetails) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Please provide details about medical conditions.", path: ["medicalDetails"] });
    }
    if (data.isUnder18 === "Yes") {
      if (!data.parentGuardianName) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Parent/Guardian name required for under 18.", path: ["parentGuardianName"] });
      }
      if (!data.parentGuardianEmail) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Parent/Guardian email required for under 18.", path: ["parentGuardianEmail"] });
      }
      if (!data.parentGuardianPhone) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Parent/Guardian phone required for under 18.", path: ["parentGuardianPhone"] });
      }
      if (data.parentalConsent !== true) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Parental consent is required for under 18.", path: ["parentalConsent"] });
      }
    }
    if (data.howDidYouHear === "Other (Please specify)" && !data.otherHearDetails) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Please specify how you heard about us.", path: ["otherHearDetails"] });
    }
  });

// Standard Insert Schemas (omitting auto-generated fields)
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertTeamSchema = createInsertSchema(teams).omit({ id: true });
export const insertVenueSchema = createInsertSchema(venues).omit({ id: true });
export const insertCompetitionSchema = createInsertSchema(competitions).omit({ id: true });
export const insertPlayerSchema = createInsertSchema(players).omit({ id: true });
export const insertMatchSchema = createInsertSchema(matches, {
    matchDate: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date format" }),
}).omit({ id: true, createdAt: true, updatedAt: true });
export const insertLineupSchema = createInsertSchema(lineups).omit({ id: true });
export const insertPlayerStatsSchema = createInsertSchema(playerStats, {
    matches: z.number().int().nonnegative().optional(),
    runsScored: z.number().int().nonnegative().optional(),
}).omit({ id: true, updatedAt: true });
export const insertMatchPerformanceSchema = createInsertSchema(matchPerformances).omit({ id: true, createdAt: true });
export const insertArticleSchema = createInsertSchema(articles).omit({ id: true, createdAt: true, updatedAt: true });
export const insertSocialPostSchema = createInsertSchema(socialPosts).omit({ id: true, fetchedAt: true });
export const insertPollSchema = createInsertSchema(polls, {
    options: z.array(z.object({ id: z.any(), text: z.string() })).min(2).transform(val => JSON.stringify(val)),
    votes: z.record(z.number().int().nonnegative()).optional().transform(val => JSON.stringify(val || {})),
}).omit({ id: true, createdAt: true, updatedAt: true });
export const insertQuizSchema = createInsertSchema(quizzes).omit({ id: true, createdAt: true, updatedAt: true });
export const insertQuizQuestionSchema = createInsertSchema(quizQuestions).omit({ id: true, createdAt: true });
export const insertGallerySchema = createInsertSchema(gallery).omit({ id: true, createdAt: true, updatedAt: true });
export const insertGalleryLikeSchema = createInsertSchema(galleryLikes).omit({ id: true, createdAt: true });
export const insertAnnouncementSchema = createInsertSchema(announcements).omit({ id: true, createdAt: true, updatedAt: true });
export const insertTeamStatsSchema = createInsertSchema(teamStats).omit({ id: true, updatedAt: true });
export const insertTriviaQuestionSchema = createInsertSchema(triviaQuestions).omit({ id: true, createdAt: true, updatedAt: true });
export const insertTriviaLeaderboardSchema = createInsertSchema(triviaLeaderboard).omit({ id: true, playDate: true, createdAt: true });
export const insertForumCategorySchema = createInsertSchema(forumCategories).omit({ id: true, createdAt: true });
export const insertForumTopicSchema = createInsertSchema(forumTopics).omit({ id: true, createdAt: true, updatedAt: true, lastPostId: true, lastReplyAt: true, lastReplyUserId: true });
export const insertForumPostSchema = createInsertSchema(forumPosts).omit({ id: true, createdAt: true });
export const insertForumPostLikeSchema = createInsertSchema(forumPostLikes).omit({ id: true, createdAt: true });
export const insertUserProfileSchema = createInsertSchema(userProfiles).omit({ id: true, createdAt: true, updatedAt: true, joinDate: true, lastSeenAt: true });

// --- Types ---
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Team = typeof teams.$inferSelect;
export type InsertTeam = z.infer<typeof insertTeamSchema>;
export type Venue = typeof venues.$inferSelect;
export type InsertVenue = z.infer<typeof insertVenueSchema>;
export type Competition = typeof competitions.$inferSelect;
export type InsertCompetition = z.infer<typeof insertCompetitionSchema>;
export type Player = typeof players.$inferSelect;
export type InsertPlayer = z.infer<typeof insertPlayerSchema>;
export type Match = typeof matches.$inferSelect;
export type InsertMatch = z.infer<typeof insertMatchSchema>;
export type Lineup = typeof lineups.$inferSelect;
export type InsertLineup = z.infer<typeof insertLineupSchema>;
export type PlayerStats = typeof playerStats.$inferSelect;
export type InsertPlayerStats = z.infer<typeof insertPlayerStatsSchema>;
export type MatchPerformance = typeof matchPerformances.$inferSelect;
export type InsertMatchPerformance = z.infer<typeof insertMatchPerformanceSchema>;
export type Article = typeof articles.$inferSelect;
export type InsertArticle = z.infer<typeof insertArticleSchema>;
export type SocialPost = typeof socialPosts.$inferSelect;
export type InsertSocialPost = z.infer<typeof insertSocialPostSchema>;
export type Poll = typeof polls.$inferSelect;
export type InsertPoll = z.infer<typeof insertPollSchema>;
export type Quiz = typeof quizzes.$inferSelect;
export type InsertQuiz = z.infer<typeof insertQuizSchema>;
export type QuizQuestion = typeof quizQuestions.$inferSelect;
export type InsertQuizQuestion = z.infer<typeof insertQuizQuestionSchema>;
export type GalleryItem = typeof gallery.$inferSelect;
export type InsertGalleryItem = z.infer<typeof insertGallerySchema>;
export type GalleryLike = typeof galleryLikes.$inferSelect;
export type InsertGalleryLike = z.infer<typeof insertGalleryLikeSchema>;
export type Announcement = typeof announcements.$inferSelect;
export type InsertAnnouncement = z.infer<typeof insertAnnouncementSchema>;
export type TeamStats = typeof teamStats.$inferSelect;
export type InsertTeamStats = z.infer<typeof insertTeamStatsSchema>;
export type TriviaQuestion = typeof triviaQuestions.$inferSelect;
export type InsertTriviaQuestion = z.infer<typeof insertTriviaQuestionSchema>;
export type TriviaLeaderboard = typeof triviaLeaderboard.$inferSelect;
export type InsertTriviaLeaderboard = z.infer<typeof insertTriviaLeaderboardSchema>;
export type ForumCategory = typeof forumCategories.$inferSelect;
export type InsertForumCategory = z.infer<typeof insertForumCategorySchema>;
export type ForumTopic = typeof forumTopics.$inferSelect;
export type InsertForumTopic = z.infer<typeof insertForumTopicSchema>;
export type ForumPost = typeof forumPosts.$inferSelect;
export type InsertForumPost = z.infer<typeof insertForumPostSchema>;
export type ForumPostLike = typeof forumPostLikes.$inferSelect;
export type InsertForumPostLike = z.infer<typeof insertForumPostLikeSchema>;
export type UserProfile = typeof userProfiles.$inferSelect;
export type InsertUserProfile = z.infer<typeof insertUserProfileSchema>;
