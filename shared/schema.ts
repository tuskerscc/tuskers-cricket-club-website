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

export const scoringInnings = pgTable("scoring_innings", {
  id: serial("id").primaryKey(),
  matchId: integer("match_id").references(() => scoringMatches.id, { onDelete: 'cascade' }).notNull(),
  battingTeam: varchar("batting_team", { length: 100 }).notNull(),
  bowlingTeam: varchar("bowling_team", { length: 100 }).notNull(),
  inningsNumber: integer("innings_number").notNull(), // 1 or 2
  totalRuns: integer("total_runs").default(0),
  totalWickets: integer("total_wickets").default(0),
  totalOversBowled: real("total_overs_bowled").default(0.0), // Decimal overs
  extras: integer("extras").default(0),
  isCompleted: boolean("is_completed").default(false),
  declared: boolean("declared").default(false),
  followOn: boolean("follow_on").default(false),
});

export const scoringBalls = pgTable("scoring_balls", {
  id: serial("id").primaryKey(),
  inningsId: integer("innings_id").references(() => scoringInnings.id, { onDelete: 'cascade' }).notNull(),
  ballNumberInOver: integer("ball_number_in_over").notNull(), // 1-6 (or more for no-balls)
  overNumber: integer("over_number").notNull(), // Starts from 1
  batsmanName: varchar("batsman_name", { length: 100 }), // Denormalized, or use batsmanId
  // batsmanId: integer("batsman_id"), // Link to a players table for the match
  bowlerName: varchar("bowler_name", { length: 100 }), // Denormalized, or use bowlerId
  // bowlerId: integer("bowler_id"),
  runsScored: integer("runs_scored").default(0), // Runs off the bat
  isWicket: boolean("is_wicket").default(false),
  wicketType: varchar("wicket_type", { length: 50 }), // 'bowled', 'caught', 'lbw', etc.
  // dismissedPlayerName: varchar("dismissed_player_name", { length: 100 }),
  // fielderName: varchar("fielder_name", { length: 100 }), // For catches, run-outs, stumpings
  isExtra: boolean("is_extra").default(false),
  extraType: varchar("extra_type", { length: 20 }), // 'wd' (wide), 'nb' (no-ball), 'b' (bye), 'lb' (leg-bye)
  extraRuns: integer("extra_runs").default(0),
  commentary: text("commentary"),
  timestamp: timestamp("timestamp").defaultNow(),
});

// Forum Categories
export const forumCategories = pgTable("forum_categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  description: text("description"),
  icon: varchar("icon", { length: 50 }), // e.g., FontAwesome class
  color: varchar("color", { length: 20 }), // e.g., hex color
  sortOrder: integer("sort_order").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Forum Topics/Threads
export const forumTopics = pgTable("forum_topics", {
  id: serial("id").primaryKey(),
  categoryId: integer("category_id").references(() => forumCategories.id, { onDelete: 'cascade' }).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(), // User who created the topic
  title: varchar("title", { length: 200 }).notNull(),
  slug: varchar("slug", { length: 250 }).unique().notNull(),
  // content field removed as first post is in forumPosts
  isSticky: boolean("is_sticky").default(false),
  isLocked: boolean("is_locked").default(false),
  viewCount: integer("view_count").default(0),
  replyCount: integer("reply_count").default(0),
  lastPostId: integer("last_post_id"), // References forumPosts.id
  lastReplyAt: timestamp("last_reply_at"),
  lastReplyUserId: integer("last_reply_user_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Forum Posts/Replies
export const forumPosts = pgTable("forum_posts", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  author: varchar("author", { length: 255 }).notNull(), // Or integer("author_id") if referencing a users table
  topicId: integer("topic_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  forumTopic: varchar("forum_topic", { length: 255 }), // Or integer("forum_topic_id") if referencing a topics table
});

// Post Likes
export const forumPostLikes = pgTable("forum_post_likes", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").references(() => forumPosts.id, { onDelete: 'cascade' }).notNull(),
  userId: integer("user_id").references(() => users.id, { onDelete: 'cascade' }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  // Add unique constraint for (postId, userId)
});

// User Profiles Extended
export const userProfiles = pgTable("user_profiles", {
  id: serial("id").primaryKey(), // Can also use userId as PK and FK
  userId: integer("user_id").references(() => users.id, { onDelete: 'cascade' }).notNull().unique(),
  displayName: varchar("display_name", { length: 50 }),
  bio: text("bio"),
  location: varchar("location", { length: 100 }),
  favoritePlayer: varchar("favorite_player", { length: 100 }), // Could be a reference to players.id
  joinDate: timestamp("join_date").defaultNow(),
  postCount: integer("post_count").default(0), // Denormalized from forumPosts
  reputation: integer("reputation").default(0),
  avatarUrl: varchar("avatar_url", { length: 255 }),
  isOnline: boolean("is_online").default(false), // Requires presence tracking
  lastSeenAt: timestamp("last_seen_at").defaultNow(),
  badges: text("badges").array(), // Array of badge names or IDs
  socialLinks: jsonb("social_links"), // e.g., {"twitter": "url", "facebook": "url"}
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Community Events
export const communityEvents = pgTable("community_events", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  eventDate: timestamp("event_date").notNull(),
  eventTime: varchar("event_time", {length: 50}), // e.g., "10:00 AM - 2:00 PM"
  location: varchar("location", { length: 200 }),
  organizerId: integer("organizer_id").references(() => users.id), // Or just text
  organizerName: varchar("organizer_name", { length: 100 }),
  maxParticipants: integer("max_participants"),
  currentParticipants: integer("current_participants").default(0), // Denormalized
  registrationDeadline: timestamp("registration_deadline"),
  imageUrl: varchar("image_url", { length: 255 }),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Event Participants
export const eventParticipants = pgTable("event_participants", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").references(() => communityEvents.id, { onDelete: 'cascade' }).notNull(),
  userId: integer("user_id").references(() => users.id, { onDelete: 'cascade' }).notNull(),
  status: varchar("status", { length: 20 }).default("registered"), // 'registered', 'attended', 'cancelled', 'waitlisted'
  notes: text("notes"), // Any notes by participant or admin
  registeredAt: timestamp("registered_at").defaultNow(),
  // Add unique constraint for (eventId, userId)
});

// --- Player Registration Table (as provided by user, matches form) ---
export const playerRegistrations = pgTable("player_registrations", {
  id: serial("id").primaryKey(),
  firstName: varchar("first_name", { length: 100 }).notNull(),
  lastName: varchar("last_name", { length: 100 }).notNull(),
  dateOfBirth: varchar("date_of_birth", { length: 20 }).notNull(), // Storing as varchar from form input YYYY-MM-DD
  gender: varchar("gender", { length: 20 }).notNull(), // "Male", "Female", "Prefer not to say"
  email: varchar("email", { length: 255 }).notNull().unique(), // Ensure unique email for registrations
  mobilePhone: varchar("mobile_phone", { length: 20 }).notNull(),
  addressLine1: varchar("address_line_1", { length: 255 }).notNull(),
  addressLine2: varchar("address_line_2", { length: 255 }),
  townCity: varchar("town_city", { length: 100 }).notNull(),
  playingRoles: text("playing_roles").notNull(), // To be stored as JSON string: '["Batsman", "Bowler"]'
  battingStyle: varchar("batting_style", { length: 50 }).notNull(),
  bowlingArm: varchar("bowling_arm", { length: 50 }), // Conditionally required
  bowlingType: varchar("bowling_type", { length: 100 }), // Conditionally required
  highestLevel: varchar("highest_level", { length: 100 }).notNull(),
  otherLevelDetails: varchar("other_level_details", { length: 255 }), // Conditionally required
  previousClubs: text("previous_clubs"),
  hasMedicalConditions: varchar("has_medical_conditions", { length: 10 }).notNull(), // "Yes" or "No"
  medicalDetails: text("medical_details"), // Conditionally required
  isUnder18: varchar("is_under_18", { length: 10 }).notNull(), // "Yes" or "No"
  parentGuardianName: varchar("parent_guardian_name", { length: 100 }), // Conditionally required
  parentGuardianEmail: varchar("parent_guardian_email", { length: 255 }), // Conditionally required
  parentGuardianPhone: varchar("parent_guardian_phone", { length: 20 }), // Conditionally required
  parentalConsent: boolean("parental_consent"), // Conditionally required
  codeOfConductAgreement: boolean("code_of_conduct_agreement").notNull(),
  photographyConsent: varchar("photography_consent", { length: 50 }).notNull(), // "Consent", "Do not consent"
  dataPrivacyConsent: boolean("data_privacy_consent").notNull(),
  howDidYouHear: varchar("how_did_you_hear", { length: 100 }),
  otherHearDetails: varchar("other_hear_details", { length: 255 }), // Conditionally required
  submittedAt: timestamp("submitted_at").defaultNow(),
  status: varchar("status", { length: 20 }).default("pending"), // e.g., 'pending', 'approved', 'rejected', 'waitlisted'
  adminNotes: text("admin_notes"), // For admin internal notes
  // playerId: integer("player_id").references(() => players.id), // Optional: Link to players table after approval
});


// --- Relations ---
// Define relations after all tables are declared.

export const usersRelations = relations(users, ({ one, many }) => ({
    profile: one(userProfiles, { fields: [users.id], references: [userProfiles.userId] }),
    createdTopics: many(forumTopics, { relationName: "topicCreator" }),
    createdPosts: many(forumPosts, { relationName: "postCreator" }),
    likedPosts: many(forumPostLikes),
    eventRegistrations: many(eventParticipants),
    organizedEvents: many(communityEvents),
}));

export const teamsRelations = relations(teams, ({ many }) => ({
  homeMatches: many(matches, { relationName: "homeTeamRelation" }), // Explicit relation names
  awayMatches: many(matches, { relationName: "awayTeamRelation" }),
  lineups: many(lineups),
  stats: many(teamStats) // If teamStats has teamId as FK
}));

export const venuesRelations = relations(venues, ({ many }) => ({
  matches: many(matches),
}));

export const competitionsRelations = relations(competitions, ({ many }) => ({
  matches: many(matches),
}));

export const playersRelations = relations(players, ({ one, many }) => ({
  stats: one(playerStats, { fields: [players.id], references: [playerStats.playerId] }),
  lineups: many(lineups),
  pomMatches: many(matches, { relationName: "playerOfTheMatchRelation" }), // POM = Player of Match
  matchPerformances: many(matchPerformances),
  // registrations: many(playerRegistrations) // If linking approved registrations to players
}));

export const matchesRelations = relations(matches, ({ one, many }) => ({
  homeTeam: one(teams, { fields: [matches.homeTeamId], references: [teams.id], relationName: "homeTeamRelation" }),
  awayTeam: one(teams, { fields: [matches.awayTeamId], references: [teams.id], relationName: "awayTeamRelation" }),
  venueInfo: one(venues, { fields: [matches.venueId], references: [venues.id] }),
  competitionInfo: one(competitions, { fields: [matches.competitionId], references: [competitions.id] }),
  playerOfTheMatchInfo: one(players, { fields: [matches.playerOfMatch], references: [players.id], relationName: "playerOfTheMatchRelation" }),
  galleryItems: many(gallery),
  performances: many(matchPerformances),
  lineups: many(lineups),
}));

export const lineupsRelations = relations(lineups, ({ one }) => ({
  match: one(matches, { fields: [lineups.matchId], references: [matches.id] }),
  player: one(players, { fields: [lineups.playerId], references: [players.id] }),
  team: one(teams, { fields: [lineups.teamId], references: [teams.id] }),
}));

export const playerStatsRelations = relations(playerStats, ({ one }) => ({
  player: one(players, { fields: [playerStats.playerId], references: [players.id] }),
}));

export const matchPerformancesRelations = relations(matchPerformances, ({ one }) => ({
  match: one(matches, { fields: [matchPerformances.matchId], references: [matches.id] }),
  player: one(players, { fields: [matchPerformances.playerId], references: [players.id] }),
  team: one(teams, {fields: [matchPerformances.teamId], references: [teams.id]}),
  bowlerCaughtByInfo: one(players, { fields: [matchPerformances.bowlerCaughtBy], references: [players.id], relationName: "bowlerCaughtByRelation" }),
  fielderAssistedInfo: one(players, { fields: [matchPerformances.fielderAssisted], references: [players.id], relationName: "fielderAssistedRelation" }),
}));

export const articlesRelations = relations(articles, ({ one }) => ({
    authorInfo: one(users, { fields: [articles.authorId], references: [users.id] }),
}));

export const pollsRelations = relations(polls, ({ one }) => ({
    creator: one(users, { fields: [polls.createdBy], references: [users.id] }),
}));

export const quizzesRelations = relations(quizzes, ({ one, many }) => ({
    creator: one(users, { fields: [quizzes.createdBy], references: [users.id] }),
    questions: many(quizQuestions),
}));

export const quizQuestionsRelations = relations(quizQuestions, ({ one }) => ({
    quiz: one(quizzes, { fields: [quizQuestions.quizId], references: [quizzes.id] }),
}));

export const galleryRelations = relations(gallery, ({ one, many }) => ({
  match: one(matches, { fields: [gallery.matchId], references: [matches.id] }),
  uploader: one(users, { fields: [gallery.uploadedBy], references: [users.id] }),
  likes: many(galleryLikes),
}));

export const galleryLikesRelations = relations(galleryLikes, ({ one }) => ({
  galleryItem: one(gallery, { fields: [galleryLikes.galleryItemId], references: [gallery.id] }),
  // user: one(users, { fields: [galleryLikes.userId], references: [users.id] }), // If tracking logged-in user likes
}));

export const announcementsRelations = relations(announcements, ({ one }) => ({
    publisher: one(users, { fields: [announcements.publishedBy], references: [users.id] }),
}));

export const teamStatsRelations = relations(teamStats, ({ one }) => ({
    team: one(teams, { fields: [teamStats.teamId], references: [teams.id] }),
}));

export const triviaQuestionsRelations = relations(triviaQuestions, ({ one }) => ({
    creator: one(users, { fields: [triviaQuestions.createdBy], references: [users.id] }),
}));

export const triviaLeaderboardRelations = relations(triviaLeaderboard, ({ one }) => ({
    // user: one(users, { fields: [triviaLeaderboard.userId], references: [users.id] }),
    quiz: one(quizzes, { fields: [triviaLeaderboard.quizId], references: [quizzes.id] }),
}));

export const scoringMatchesRelations = relations(scoringMatches, ({ one, many }) => ({
    creator: one(scoringUsers, { fields: [scoringMatches.createdBy], references: [scoringUsers.id] }),
    innings: many(scoringInnings),
    currentInningsInfo: one(scoringInnings, { fields: [scoringMatches.currentInningsId], references: [scoringInnings.id]}),
}));

export const scoringInningsRelations = relations(scoringInnings, ({ one, many }) => ({
    match: one(scoringMatches, { fields: [scoringInnings.matchId], references: [scoringMatches.id] }),
    balls: many(scoringBalls),
}));

export const scoringBallsRelations = relations(scoringBalls, ({ one }) => ({
    innings: one(scoringInnings, { fields: [scoringBalls.inningsId], references: [scoringInnings.id] }),
    // batsmanInfo: one(players, { fields: [scoringBalls.batsmanId], references: [players.id] }), // If using IDs
    // bowlerInfo: one(players, { fields: [scoringBalls.bowlerId], references: [players.id] }),
}));

export const forumCategoriesRelations = relations(forumCategories, ({ many }) => ({
  topics: many(forumTopics),
}));

export const forumTopicsRelations = relations(forumTopics, ({ one, many }) => ({
  category: one(forumCategories, { fields: [forumTopics.categoryId], references: [forumCategories.id] }),
  user: one(users, { fields: [forumTopics.userId], references: [users.id], relationName: "topicCreator" }),
  lastPostInfo: one(forumPosts, { fields: [forumTopics.lastPostId], references: [forumPosts.id]}),
  lastReplyUserInfo: one(users, { fields: [forumTopics.lastReplyUserId], references: [users.id], relationName: "lastReplyUser" }),
  posts: many(forumPosts),
}));

export const forumPostsRelations = relations(forumPosts, ({ one, many }) => ({
  topic: one(forumTopics, { fields: [forumPosts.topicId], references: [forumTopics.id] }),
  user: one(users, { fields: [forumPosts.userId], references: [users.id], relationName: "postCreator" }),
  parentPost: one(this, { fields: [forumPosts.parentId], references: [forumPosts.id], relationName: "repliesTo"}),
  replies: many(this, {relationName: "repliesTo"}),
  likes: many(forumPostLikes),
}));

export const forumPostLikesRelations = relations(forumPostLikes, ({ one }) => ({
  post: one(forumPosts, { fields: [forumPostLikes.postId], references: [forumPosts.id] }),
  user: one(users, { fields: [forumPostLikes.userId], references: [users.id] }),
}));

export const userProfilesRelations = relations(userProfiles, ({ one }) => ({
  user: one(users, { fields: [userProfiles.userId], references: [users.id] }),
}));

export const communityEventsRelations = relations(communityEvents, ({ one, many }) => ({
  organizerInfo: one(users, { fields: [communityEvents.organizerId], references: [users.id] }),
  participants: many(eventParticipants),
}));

export const eventParticipantsRelations = relations(eventParticipants, ({ one }) => ({
  event: one(communityEvents, { fields: [eventParticipants.eventId], references: [communityEvents.id] }),
  user: one(users, { fields: [eventParticipants.userId], references: [users.id] }),
}));

export const playerRegistrationsRelations = relations(playerRegistrations, ({ one }) => ({
    // playerProfile: one(players, { fields: [playerRegistrations.playerId], references: [players.id] }), // If linking after approval
}));


// --- Zod Schemas for Insertions (derived from Drizzle schemas) ---

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
    // Transform playingRoles array to JSON string for DB storage
    playingRoles: z.array(z.string()).min(1).transform(val => JSON.stringify(val)),
    // Other fields are directly mapped or types align with Drizzle's varchar/text/boolean for these.
    // Parental consent is boolean and optional, directly maps.
  })
  .superRefine((data, ctx) => {
    // Conditional validation for bowling fields (from PlayerRegistration.tsx)
    if (data.playingRoles && (JSON.parse(data.playingRoles as string)).includes("Bowler") || (JSON.parse(data.playingRoles as string)).includes("All-rounder")) {
      if (!data.bowlingArm) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Bowling arm is required for bowlers/all-rounders.", path: ["bowlingArm"] });
      }
      if (!data.bowlingType) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Bowling type is required for bowlers/all-rounders.", path: ["bowlingType"] });
      }
    }
    // Conditional validation for "Other" highest level
    if (data.highestLevel === "Other (Please specify below)" && !data.otherLevelDetails) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Please specify the other level of cricket.", path: ["otherLevelDetails"] });
    }
    // Conditional validation for medical conditions
    if (data.hasMedicalConditions === "Yes" && !data.medicalDetails) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Please provide details about medical conditions.", path: ["medicalDetails"] });
    }
    // Conditional validation for under 18
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
      if (data.parentalConsent !== true) { // Check for true explicitly
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Parental consent is required for under 18.", path: ["parentalConsent"] });
      }
    }
    // Conditional validation for "Other" hear about us
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
    // Example of customizing a field for Zod if needed, e.g. ensuring date string format
    matchDate: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date format" }),
}).omit({ id: true, createdAt: true, updatedAt: true });

export const insertLineupSchema = createInsertSchema(lineups).omit({ id: true });

export const insertPlayerStatsSchema = createInsertSchema(playerStats, {
    // Customize if needed, e.g. ensuring numbers are non-negative
    matches: z.number().int().nonnegative().optional(),
    runsScored: z.number().int().nonnegative().optional(),
}).omit({ id: true, updatedAt: true });

export const insertMatchPerformanceSchema = createInsertSchema(matchPerformances).omit({ id: true, createdAt: true });
export const insertArticleSchema = createInsertSchema(articles).omit({ id: true, createdAt: true, updatedAt: true });
export const insertSocialPostSchema = createInsertSchema(socialPosts).omit({ id: true, fetchedAt: true });

export const insertPollSchema = createInsertSchema(polls, {
    options: z.array(z.object({ id: z.any(), text: z.string() })).min(2).transform(val => JSON.stringify(val)), // Expects array, stores JSON
    votes: z.record(z.number().int().nonnegative()).optional().transform(val => JSON.stringify(val || {})), // Expects object, stores JSON
}).omit({ id: true, createdAt: true, updatedAt: true });

export const insertQuizSchema = createInsertSchema(quizzes).omit({ id: true, createdAt: true, updatedAt: true });
export const insertQuizQuestionSchema = createInsertSchema(quizQuestions).omit({ id: true, createdAt: true });

export const insertGallerySchema = createInsertSchema(gallery).omit({ id: true, createdAt: true, updatedAt: true });
export const insertGalleryLikeSchema = createInsertSchema(galleryLikes).omit({ id: true, createdAt: true });
export const insertAnnouncementSchema = createInsertSchema(announcements).omit({ id: true, createdAt: true, updatedAt: true });
export const insertTeamStatsSchema = createInsertSchema(teamStats).omit({ id: true, updatedAt: true });

export const insertTriviaQuestionSchema = createInsertSchema(triviaQuestions).omit({ id: true, createdAt: true, updatedAt: true });
export const insertTriviaLeaderboardSchema = createInsertSchema(triviaLeaderboard).omit({ id: true, playDate: true, createdAt: true });

export const insertScoringUserSchema = createInsertSchema(scoringUsers).omit({ id: true, createdAt: true });
export const insertScoringMatchSchema = createInsertSchema(scoringMatches).omit({ id: true, createdAt: true });
export const insertScoringInningsSchema = createInsertSchema(scoringInnings).omit({ id: true });
export const insertScoringBallSchema = createInsertSchema(scoringBalls).omit({ id: true, timestamp: true });

export const insertForumCategorySchema = createInsertSchema(forumCategories).omit({ id: true, createdAt: true });
export const insertForumTopicSchema = createInsertSchema(forumTopics).omit({ id: true, createdAt: true, updatedAt: true, lastPostId: true, lastReplyAt: true, lastReplyUserId: true });
export const insertForumPostSchema = createInsertSchema(forumPosts).omit({ id: true, createdAt: true, updatedAt: true });
export const insertForumPostLikeSchema = createInsertSchema(forumPostLikes).omit({ id: true, createdAt: true });
export const insertUserProfileSchema = createInsertSchema(userProfiles).omit({ id: true, createdAt: true, updatedAt: true, joinDate: true, lastSeenAt: true });
export const insertCommunityEventSchema = createInsertSchema(communityEvents).omit({ id: true, createdAt: true, updatedAt: true });
export const insertEventParticipantSchema = createInsertSchema(eventParticipants).omit({ id: true, registeredAt: true });


// --- Drizzle-infered Select and Insert Types ---
export type User = typeof users.$inferSelect;
// export type InsertUser = typeof users.$inferInsert; // Use Zod schema for validated inserts
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

export type ScoringUser = typeof scoringUsers.$inferSelect;
export type InsertScoringUser = z.infer<typeof insertScoringUserSchema>;

export type ScoringMatch = typeof scoringMatches.$inferSelect;
export type InsertScoringMatch = z.infer<typeof insertScoringMatchSchema>;

export type ScoringInnings = typeof scoringInnings.$inferSelect;
export type InsertScoringInnings = z.infer<typeof insertScoringInningsSchema>;

export type ScoringBall = typeof scoringBalls.$inferSelect;
export type InsertScoringBall = z.infer<typeof insertScoringBallSchema>;

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

export type CommunityEvent = typeof communityEvents.$inferSelect;
export type InsertCommunityEvent = z.infer<typeof insertCommunityEventSchema>;

export type EventParticipant = typeof eventParticipants.$inferSelect;
export type InsertEventParticipant = z.infer<typeof insertEventParticipantSchema>;

// Player Registration Types (already defined in your input, just ensuring they are here)
export type PlayerRegistration = typeof playerRegistrations.$inferSelect;
// export type InsertPlayerRegistration = typeof playerRegistrations.$inferInsert; // Use Zod schema for validated inserts
export type InsertPlayerRegistration = z.infer<typeof insertPlayerRegistrationSchema>;
