import { pgTable, text, serial, integer, boolean, timestamp, jsonb, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table for admin access
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("admin"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Teams table (opponents and our team)
export const teams = pgTable("teams", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  shortName: text("short_name").notNull(),
  logo: text("logo"),
  isOurTeam: boolean("is_our_team").default(false),
});

// Venues table
export const venues = pgTable("venues", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  location: text("location"),
  capacity: integer("capacity"),
});

// Competitions table
export const competitions = pgTable("competitions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  shortName: text("short_name"),
  type: text("type").notNull(), // league, tournament, etc.
});

// Players table
export const players = pgTable("players", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  jerseyNumber: integer("jersey_number"),
  role: text("role").notNull(), // batsman, bowler, all-rounder, wicket-keeper
  battingStyle: text("batting_style"), // right-handed, left-handed
  bowlingStyle: text("bowling_style"), // right-arm fast, left-arm spin, etc.
  bio: text("bio"),
  photo: text("photo"),
  isCaptain: boolean("is_captain").default(false),
  isViceCaptain: boolean("is_vice_captain").default(false),
  isActive: boolean("is_active").default(true),
});

// Matches table
export const matches = pgTable("matches", {
  id: serial("id").primaryKey(),
  homeTeamId: integer("home_team_id").references(() => teams.id),
  awayTeamId: integer("away_team_id").references(() => teams.id),
  venueId: integer("venue_id").references(() => venues.id),
  competitionId: integer("competition_id").references(() => competitions.id),
  matchDate: timestamp("match_date").notNull(),
  status: text("status").notNull().default("upcoming"), // upcoming, live, completed
  homeTeamScore: text("home_team_score"), // e.g., "245/6"
  awayTeamScore: text("away_team_score"),
  homeTeamOvers: text("home_team_overs"), // e.g., "50.0"
  awayTeamOvers: text("away_team_overs"),
  result: text("result"), // e.g., "Tuskers CC won by 58 runs"
  playerOfMatch: integer("player_of_match").references(() => players.id),
  isLive: boolean("is_live").default(false),
  liveData: jsonb("live_data"), // current batsmen, bowlers, etc.
});

// Starting lineups for matches
export const lineups = pgTable("lineups", {
  id: serial("id").primaryKey(),
  matchId: integer("match_id").references(() => matches.id),
  playerId: integer("player_id").references(() => players.id),
  teamId: integer("team_id").references(() => teams.id),
  isSubstitute: boolean("is_substitute").default(false),
  battingOrder: integer("batting_order"),
});

// Player statistics
export const playerStats = pgTable("player_stats", {
  id: serial("id").primaryKey(),
  playerId: integer("player_id").references(() => players.id),
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
});

// Articles/News table
export const articles = pgTable("articles", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt"),
  content: text("content").notNull(),
  featuredImage: text("featured_image"),
  author: text("author").notNull(),
  category: text("category").notNull(), // news, match-report, training, etc.
  isPublished: boolean("is_published").default(false),
  isFeatured: boolean("is_featured").default(false),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Social media posts cache
export const socialPosts = pgTable("social_posts", {
  id: serial("id").primaryKey(),
  platform: text("platform").notNull(), // twitter, instagram, facebook
  postId: text("post_id").notNull(),
  content: text("content").notNull(),
  author: text("author").notNull(),
  authorAvatar: text("author_avatar"),
  likes: integer("likes").default(0),
  comments: integer("comments").default(0),
  shares: integer("shares").default(0),
  postedAt: timestamp("posted_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Polls table
export const polls = pgTable("polls", {
  id: serial("id").primaryKey(),
  question: text("question").notNull(),
  options: jsonb("options").notNull(), // array of options
  votes: jsonb("votes").notNull().default('{}'), // option votes count
  isActive: boolean("is_active").default(true),
  endsAt: timestamp("ends_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Quiz questions
export const quizzes = pgTable("quizzes", {
  id: serial("id").primaryKey(),
  question: text("question").notNull(),
  options: jsonb("options").notNull(), // array of options
  correctAnswer: text("correct_answer").notNull(),
  explanation: text("explanation"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Gallery items
export const gallery = pgTable("gallery", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  imageUrl: text("image_url").notNull(),
  category: text("category").notNull(), // match, training, celebration, etc.
  matchId: integer("match_id").references(() => matches.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const teamsRelations = relations(teams, ({ many }) => ({
  homeMatches: many(matches, { relationName: "homeTeam" }),
  awayMatches: many(matches, { relationName: "awayTeam" }),
  lineups: many(lineups),
}));

export const venuesRelations = relations(venues, ({ many }) => ({
  matches: many(matches),
}));

export const competitionsRelations = relations(competitions, ({ many }) => ({
  matches: many(matches),
}));

export const playersRelations = relations(players, ({ many, one }) => ({
  stats: one(playerStats),
  lineups: many(lineups),
  matchesWon: many(matches, { relationName: "playerOfMatch" }),
}));

export const matchesRelations = relations(matches, ({ one, many }) => ({
  homeTeam: one(teams, {
    fields: [matches.homeTeamId],
    references: [teams.id],
    relationName: "homeTeam",
  }),
  awayTeam: one(teams, {
    fields: [matches.awayTeamId],
    references: [teams.id],
    relationName: "awayTeam",
  }),
  venue: one(venues, {
    fields: [matches.venueId],
    references: [venues.id],
  }),
  competition: one(competitions, {
    fields: [matches.competitionId],
    references: [competitions.id],
  }),
  playerOfMatch: one(players, {
    fields: [matches.playerOfMatch],
    references: [players.id],
    relationName: "playerOfMatch",
  }),
  lineups: many(lineups),
  galleryItems: many(gallery),
}));

export const lineupsRelations = relations(lineups, ({ one }) => ({
  match: one(matches, {
    fields: [lineups.matchId],
    references: [matches.id],
  }),
  player: one(players, {
    fields: [lineups.playerId],
    references: [players.id],
  }),
  team: one(teams, {
    fields: [lineups.teamId],
    references: [teams.id],
  }),
}));

export const playerStatsRelations = relations(playerStats, ({ one }) => ({
  player: one(players, {
    fields: [playerStats.playerId],
    references: [players.id],
  }),
}));

export const galleryRelations = relations(gallery, ({ one }) => ({
  match: one(matches, {
    fields: [gallery.matchId],
    references: [matches.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertTeamSchema = createInsertSchema(teams).omit({
  id: true,
});

export const insertVenueSchema = createInsertSchema(venues).omit({
  id: true,
});

export const insertCompetitionSchema = createInsertSchema(competitions).omit({
  id: true,
});

export const insertPlayerSchema = createInsertSchema(players).omit({
  id: true,
});

export const insertMatchSchema = createInsertSchema(matches).omit({
  id: true,
});

export const insertLineupSchema = createInsertSchema(lineups).omit({
  id: true,
});

export const insertPlayerStatsSchema = createInsertSchema(playerStats).omit({
  id: true,
});

export const insertArticleSchema = createInsertSchema(articles).omit({
  id: true,
  createdAt: true,
  publishedAt: true,
});

export const insertSocialPostSchema = createInsertSchema(socialPosts).omit({
  id: true,
  createdAt: true,
});

export const insertPollSchema = createInsertSchema(polls).omit({
  id: true,
  createdAt: true,
});

export const insertQuizSchema = createInsertSchema(quizzes).omit({
  id: true,
  createdAt: true,
});

export const insertGallerySchema = createInsertSchema(gallery).omit({
  id: true,
  createdAt: true,
});

// Types
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

export type Article = typeof articles.$inferSelect;
export type InsertArticle = z.infer<typeof insertArticleSchema>;

export type SocialPost = typeof socialPosts.$inferSelect;
export type InsertSocialPost = z.infer<typeof insertSocialPostSchema>;

export type Poll = typeof polls.$inferSelect;
export type InsertPoll = z.infer<typeof insertPollSchema>;

export type Quiz = typeof quizzes.$inferSelect;
export type InsertQuiz = z.infer<typeof insertQuizSchema>;

export type GalleryItem = typeof gallery.$inferSelect;
export type InsertGalleryItem = z.infer<typeof insertGallerySchema>;
