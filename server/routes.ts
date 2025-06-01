import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPlayerSchema, insertMatchSchema, insertArticleSchema, insertPollSchema, insertGallerySchema, insertAnnouncementSchema } from "@shared/schema";
import { generateCricketPoll, generateCricketQuiz } from "./cricket-api";

// Extend Express Request type to include session
declare module 'express-serve-static-core' {
  interface Request {
    session: {
      adminLoggedIn?: boolean;
      [key: string]: any;
    };
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve ads.txt for Google AdSense
  app.get('/ads.txt', (req, res) => {
    res.setHeader('Content-Type', 'text/plain');
    res.sendFile('ads.txt', { root: './client' });
  });

  // Admin authentication routes
  app.post('/api/admin/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      
      // Simple credentials for demo (in production, use environment variables and hashed passwords)
      const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
      const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'MAt@51BlaX';
      
      if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        // Set session
        req.session.adminLoggedIn = true;
        
        res.json({ success: true, message: 'Login successful' });
      } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
      }
    } catch (error) {
      console.error('Admin login error:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  });

  // Admin verification endpoint
  app.get('/api/admin/verify', async (req, res) => {
    try {
      if (req.session && req.session.adminLoggedIn) {
        res.json({ success: true, message: 'Authenticated' });
      } else {
        res.status(401).json({ success: false, message: 'Not authenticated' });
      }
    } catch (error) {
      console.error('Admin verify error:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  });

  // Admin logout endpoint
  app.post('/api/admin/logout', async (req, res) => {
    try {
      if (req.session) {
        req.session.adminLoggedIn = false;
      }
      res.json({ success: true, message: 'Logged out' });
    } catch (error) {
      console.error('Admin logout error:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  });

  app.get('/api/admin/verify', async (req, res) => {
    try {
      const isLoggedIn = (req.session as any)?.adminLoggedIn;
      const loginTime = (req.session as any)?.adminLoginTime;
      
      if (!isLoggedIn || !loginTime) {
        return res.status(401).json({ success: false, message: 'Not authenticated' });
      }
      
      // Check if session is older than 8 hours
      const sessionAge = new Date().getTime() - new Date(loginTime).getTime();
      const maxAge = 8 * 60 * 60 * 1000; // 8 hours in milliseconds
      
      if (sessionAge > maxAge) {
        delete (req.session as any).adminLoggedIn;
        delete (req.session as any).adminLoginTime;
        return res.status(401).json({ success: false, message: 'Session expired' });
      }
      
      res.json({ success: true, message: 'Authenticated' });
    } catch (error) {
      console.error('Admin verify error:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  });

  app.post('/api/admin/logout', async (req, res) => {
    try {
      delete (req.session as any).adminLoggedIn;
      delete (req.session as any).adminLoginTime;
      res.json({ success: true, message: 'Logged out successfully' });
    } catch (error) {
      console.error('Admin logout error:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  });

  // Admin middleware to protect admin routes
  const adminAuth = (req: any, res: any, next: any) => {
    const isLoggedIn = req.session?.adminLoggedIn;
    const loginTime = req.session?.adminLoginTime;
    
    if (!isLoggedIn || !loginTime) {
      return res.status(401).json({ success: false, message: 'Admin authentication required' });
    }
    
    // Check session age
    const sessionAge = new Date().getTime() - new Date(loginTime).getTime();
    const maxAge = 8 * 60 * 60 * 1000; // 8 hours
    
    if (sessionAge > maxAge) {
      delete req.session.adminLoggedIn;
      delete req.session.adminLoginTime;
      return res.status(401).json({ success: false, message: 'Admin session expired' });
    }
    
    next();
  };

  // Teams endpoints
  app.get("/api/teams", async (req, res) => {
    try {
      const teams = await storage.getTeams();
      res.json(teams);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch teams" });
    }
  });

  app.get("/api/teams/tuskers", async (req, res) => {
    try {
      const team = await storage.getTuskersTeam();
      if (!team) {
        return res.status(404).json({ error: "Tuskers team not found" });
      }
      res.json(team);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch Tuskers team" });
    }
  });

  // Players endpoints
  app.get("/api/players", async (req, res) => {
    try {
      const players = await storage.getPlayers();
      res.json(players);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch players" });
    }
  });

  app.get("/api/players/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid player ID" });
      }

      const player = await storage.getPlayer(id);
      if (!player) {
        return res.status(404).json({ error: "Player not found" });
      }
      res.json(player);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch player" });
    }
  });

  app.post("/api/players", async (req, res) => {
    try {
      const validatedData = insertPlayerSchema.parse(req.body);
      const player = await storage.createPlayer(validatedData);
      res.status(201).json(player);
    } catch (error) {
      res.status(400).json({ error: "Invalid player data" });
    }
  });

  app.delete("/api/players/all", async (req, res) => {
    try {
      await storage.deleteAllPlayers();
      res.json({ success: true, message: "All players deleted successfully" });
    } catch (error) {
      console.error("Delete all players error:", error);
      res.status(500).json({ error: "Failed to delete all players" });
    }
  });

  app.delete("/api/players/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid player ID" });
      }

      await storage.deletePlayer(id);
      res.json({ success: true, message: "Player deleted successfully" });
    } catch (error) {
      console.error("Delete player error:", error);
      res.status(500).json({ error: "Failed to delete player" });
    }
  });

  // Matches endpoints
  app.get("/api/matches", async (req, res) => {
    try {
      const matches = await storage.getMatches();
      res.json(matches);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch matches" });
    }
  });

  app.get("/api/matches/live", async (req, res) => {
    try {
      const liveMatches = await storage.getLiveMatches();
      res.json(liveMatches);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch live matches" });
    }
  });

  app.get("/api/matches/upcoming", async (req, res) => {
    try {
      const upcomingMatches = await storage.getUpcomingMatches();
      res.json(upcomingMatches);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch upcoming matches" });
    }
  });

  app.get("/api/matches/recent", async (req, res) => {
    try {
      const recentMatches = await storage.getRecentMatches();
      res.json(recentMatches);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch recent matches" });
    }
  });

  app.get("/api/matches/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid match ID" });
      }

      const match = await storage.getMatch(id);
      if (!match) {
        return res.status(404).json({ error: "Match not found" });
      }
      res.json(match);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch match" });
    }
  });

  app.get("/api/matches/:id/lineup", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid match ID" });
      }

      const lineup = await storage.getStartingLineup(id);
      res.json(lineup);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch starting lineup" });
    }
  });

  app.post("/api/matches", async (req, res) => {
    try {
      const validatedData = insertMatchSchema.parse(req.body);
      const match = await storage.createMatch(validatedData);
      res.status(201).json(match);
    } catch (error) {
      res.status(400).json({ error: "Invalid match data" });
    }
  });

  // Articles endpoints
  app.get("/api/articles", async (req, res) => {
    try {
      const articles = await storage.getArticles();
      res.json(articles);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch articles" });
    }
  });

  app.get("/api/articles/featured", async (req, res) => {
    try {
      const featuredArticles = await storage.getFeaturedArticles();
      res.json(featuredArticles);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch featured articles" });
    }
  });

  app.get("/api/articles/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid article ID" });
      }

      const article = await storage.getArticle(id);
      if (!article) {
        return res.status(404).json({ error: "Article not found" });
      }
      res.json(article);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch article" });
    }
  });

  app.get("/api/articles/slug/:slug", async (req, res) => {
    try {
      const slug = req.params.slug;
      const article = await storage.getArticleBySlug(slug);
      if (!article) {
        return res.status(404).json({ error: "Article not found" });
      }
      res.json(article);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch article" });
    }
  });

  app.post("/api/articles", async (req, res) => {
    try {
      const validatedData = insertArticleSchema.parse(req.body);
      // Set publishedAt to current date if the article is published
      const articleData = {
        ...validatedData,
        publishedAt: validatedData.isPublished ? new Date() : null
      };
      const article = await storage.createArticle(articleData);
      res.status(201).json(article);
    } catch (error) {
      res.status(400).json({ error: "Invalid article data" });
    }
  });

  app.patch("/api/articles/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid article ID" });
      }

      await storage.updateArticle(id, req.body);
      res.json({ success: true });
    } catch (error) {
      console.error("Update article error:", error);
      res.status(500).json({ error: "Failed to update article" });
    }
  });

  app.delete("/api/articles/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid article ID" });
      }

      await storage.deleteArticle(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Delete article error:", error);
      res.status(500).json({ error: "Failed to delete article" });
    }
  });

  // Social posts endpoints
  app.get("/api/social-posts", async (req, res) => {
    try {
      const posts = await storage.getSocialPosts();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch social posts" });
    }
  });

  // Polls endpoints
  app.get("/api/polls", async (req, res) => {
    try {
      const polls = await storage.getActivePolls();
      res.json(polls);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch polls" });
    }
  });

  app.get("/api/polls/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid poll ID" });
      }

      const poll = await storage.getPoll(id);
      if (!poll) {
        return res.status(404).json({ error: "Poll not found" });
      }
      res.json(poll);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch poll" });
    }
  });

  app.post("/api/polls", async (req, res) => {
    try {
      const validatedData = insertPollSchema.parse(req.body);
      const poll = await storage.createPoll(validatedData);
      res.status(201).json(poll);
    } catch (error) {
      res.status(400).json({ error: "Invalid poll data" });
    }
  });

  app.post("/api/polls/:id/vote", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { option } = req.body;

      if (isNaN(id) || !option) {
        return res.status(400).json({ error: "Invalid poll ID or option" });
      }

      const poll = await storage.getPoll(id);
      if (!poll) {
        return res.status(404).json({ error: "Poll not found" });
      }

      // Update poll votes
      const votes = poll.votes as Record<string, number>;
      votes[option] = (votes[option] || 0) + 1;

      await storage.updatePoll(id, { votes });
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to vote on poll" });
    }
  });

  // Quizzes endpoints
  app.get("/api/quizzes", async (req, res) => {
    try {
      const quizzes = await storage.getActiveQuizzes();
      res.json(quizzes);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch quizzes" });
    }
  });

  // Gallery endpoints
  app.get("/api/gallery", async (req, res) => {
    try {
      const galleryItems = await storage.getGalleryItems();
      res.json(galleryItems);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch gallery items" });
    }
  });

  // Statistics endpoints
  app.get("/api/stats/team", async (req, res) => {
    try {
      const stats = await storage.getTeamStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch team statistics" });
    }
  });

  app.put("/api/stats/team", async (req, res) => {
    try {
      const { matchResult, totalRuns, wicketsTaken, totalOvers, runsAgainst, oversAgainst } = req.body;
      
      // Robust validation with logging
      console.log('Raw input values:', { matchResult, totalRuns, wicketsTaken, totalOvers, runsAgainst, oversAgainst });
      
      // Convert to numbers with proper fallbacks
      const parsedTotalRuns = Number(totalRuns) || 0;
      const parsedWicketsTaken = Number(wicketsTaken) || 0;
      const parsedTotalOvers = Number(totalOvers) || 0;
      const parsedRunsAgainst = Number(runsAgainst) || 0;
      const parsedOversAgainst = Number(oversAgainst) || 0;
      
      // Ensure matchWon is always 0 or 1
      const matchWon = matchResult === 'won' ? 1 : 0;
      
      const statsData = {
        matchesWon: matchWon,
        totalMatches: 1,
        totalRuns: parsedTotalRuns,
        wicketsTaken: parsedWicketsTaken,
        totalOvers: parsedTotalOvers,
        runsAgainst: parsedRunsAgainst,
        oversAgainst: parsedOversAgainst
      };
      
      console.log('Processed stats data:', statsData);
      
      // Validate no NaN values before sending to database
      for (const [key, value] of Object.entries(statsData)) {
        if (isNaN(value)) {
          console.error(`NaN detected in ${key}:`, value);
          return res.status(400).json({ error: `Invalid value for ${key}` });
        }
      }
      
      await storage.updateTeamStats(statsData);
      
      res.json({ success: true });
    } catch (error) {
      console.error('Error updating team stats:', error);
      res.status(500).json({ error: "Failed to update team statistics" });
    }
  });

  // Record match and update team statistics
  app.post("/api/record-match", async (req, res) => {
    try {
      const { opponent, venue, date, result, teamRuns, wicketsTaken, oversFaced, runsConceded } = req.body;
      
      // Get current team stats
      const currentStats = await storage.getTeamStats();
      
      // Calculate new statistics
      const newMatchesWon = currentStats.matchesWon + (result === 'Won' ? 1 : 0);
      const newTotalMatches = currentStats.totalMatches + 1;
      const newTotalRuns = currentStats.totalRuns + (teamRuns || 0);
      const newWicketsTaken = currentStats.wicketsTaken + (wicketsTaken || 0);
      
      // Calculate NRR components - use actual match data
      const newTotalOvers = (currentStats.totalMatches * 20) + (oversFaced || 20);
      const newRunsAgainst = currentStats.totalRuns + (runsConceded || 0);
      const newOversAgainst = newTotalOvers;
      
      // Update team statistics
      await storage.updateTeamStats({
        matchesWon: newMatchesWon,
        totalMatches: newTotalMatches,
        totalRuns: newTotalRuns,
        wicketsTaken: newWicketsTaken,
        totalOvers: newTotalOvers,
        runsAgainst: newRunsAgainst,
        oversAgainst: newOversAgainst
      });
      
      console.log(`Match recorded: ${result} vs ${opponent} at ${venue} on ${date}`);
      res.json({ 
        success: true, 
        message: "Match recorded and team statistics updated successfully"
      });
    } catch (error) {
      console.error("Error recording match:", error);
      res.status(500).json({ error: "Failed to record match" });
    }
  });

  // Record match with player performances
  app.post("/api/record-match-performance", async (req, res) => {
    try {
      const { opponent, venue, date, result, selectedPlayers, playerPerformances } = req.body;
      
      if (!selectedPlayers || selectedPlayers.length !== 11) {
        return res.status(400).json({ error: "Exactly 11 players must be selected" });
      }

      if (!playerPerformances || !Array.isArray(playerPerformances)) {
        return res.status(400).json({ error: "Player performances data is required" });
      }

      // Calculate team totals from individual performances
      const teamRuns = playerPerformances.reduce((total, perf) => total + (perf.runsScored || 0), 0);
      const teamWickets = playerPerformances.reduce((total, perf) => total + (perf.wicketsTaken || 0), 0);
      const totalRunsConceded = playerPerformances.reduce((total, perf) => total + (perf.runsConceded || 0), 0);
      const totalBallsBowled = playerPerformances.reduce((total, perf) => total + (perf.ballsBowled || 0), 0);
      const oversBowled = totalBallsBowled / 6;

      // Get current team stats
      const currentStats = await storage.getTeamStats();
      
      // Calculate new team statistics (cumulative)
      const newMatchesWon = currentStats.matchesWon + (result === 'Won' ? 1 : 0);
      const newTotalMatches = currentStats.totalMatches + 1;
      const newTotalRuns = currentStats.totalRuns + teamRuns;
      const newWicketsTaken = currentStats.wicketsTaken + teamWickets;
      
      // Calculate overs properly for NRR
      const oversFaced = 20; // Assume T20 format
      const newTotalOvers = currentStats.totalOvers + oversFaced;
      const newRunsAgainst = currentStats.runsAgainst + totalRunsConceded;
      const newOversAgainst = currentStats.oversAgainst + oversBowled;
      
      // Update team statistics
      await storage.updateTeamStats({
        matchesWon: newMatchesWon,
        totalMatches: newTotalMatches,
        totalRuns: newTotalRuns,
        wicketsTaken: newWicketsTaken,
        totalOvers: newTotalOvers,
        runsAgainst: newRunsAgainst,
        oversAgainst: newOversAgainst
      });

      // Update individual player statistics
      for (const performance of playerPerformances) {
        await storage.updatePlayerStats(performance.playerId, {
          runsScored: performance.runsScored || 0,
          ballsFaced: performance.ballsFaced || 0,
          fours: performance.fours || 0,
          sixes: performance.sixes || 0,
          wicketsTaken: performance.wicketsTaken || 0,
          runsConceded: performance.runsConceded || 0,
          ballsBowled: performance.ballsBowled || 0,
          catches: performance.catches || 0,
          stumpings: performance.stumpings || 0,
          runOuts: performance.runOuts || 0
        });
      }
      
      console.log(`Match performance recorded: ${result} vs ${opponent} at ${venue} on ${date}`);
      console.log(`Team totals: ${teamRuns} runs, ${teamWickets} wickets taken`);
      
      res.json({ 
        success: true, 
        message: "Match and player performances recorded successfully",
        teamTotals: {
          runs: teamRuns,
          wickets: teamWickets,
          result: result
        }
      });
    } catch (error) {
      console.error("Error recording match performance:", error);
      res.status(500).json({ error: "Failed to record match performance" });
    }
  });

  // Cricket data endpoints

  app.get("/api/cricket/live-poll", async (req, res) => {
    try {
      const poll = generateCricketPoll();
      res.json(poll);
    } catch (error) {
      res.status(500).json({ error: "Failed to generate cricket poll" });
    }
  });

  app.get("/api/cricket/live-quiz", async (req, res) => {
    try {
      const quiz = generateCricketQuiz();
      res.json(quiz);
    } catch (error) {
      res.status(500).json({ error: "Failed to generate cricket quiz" });
    }
  });

  // Trivia endpoints
  app.get("/api/trivia/questions", async (req, res) => {
    try {
      const questions = await storage.getTriviaQuestions();
      res.json(questions);
    } catch (error) {
      console.error('Error fetching trivia questions:', error);
      res.status(500).json({ error: 'Failed to fetch trivia questions' });
    }
  });

  app.get("/api/trivia/leaderboard", async (req, res) => {
    try {
      const leaderboard = await storage.getTriviaLeaderboard();
      res.json(leaderboard);
    } catch (error) {
      console.error('Error fetching trivia leaderboard:', error);
      res.status(500).json({ error: 'Failed to fetch trivia leaderboard' });
    }
  });

  app.post("/api/trivia/submit-score", async (req, res) => {
    try {
      const { playerName, score, questionsAnswered, accuracy } = req.body;
      
      if (!playerName || score === undefined || questionsAnswered === undefined || accuracy === undefined) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const entry = await storage.submitTriviaScore({
        playerName,
        score,
        questionsAnswered,
        accuracy
      });

      res.json(entry);
    } catch (error) {
      console.error('Error submitting trivia score:', error);
      res.status(500).json({ error: 'Failed to submit trivia score' });
    }
  });

  // Gallery endpoints
  app.get("/api/gallery", async (req, res) => {
    try {
      const galleryItems = await storage.getGalleryItems();
      res.json(galleryItems);
    } catch (error) {
      console.error('Error fetching gallery items:', error);
      res.status(500).json({ error: 'Failed to fetch gallery items' });
    }
  });

  app.post("/api/gallery", async (req, res) => {
    try {
      const validatedData = insertGallerySchema.parse(req.body);
      const galleryItem = await storage.createGalleryItem(validatedData);
      res.status(201).json(galleryItem);
    } catch (error) {
      console.error('Error creating gallery item:', error);
      res.status(400).json({ error: 'Invalid gallery item data' });
    }
  });

  app.delete("/api/gallery/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid gallery item ID" });
      }

      await storage.deleteGalleryItem(id);
      res.json({ success: true });
    } catch (error) {
      console.error('Error deleting gallery item:', error);
      res.status(500).json({ error: 'Failed to delete gallery item' });
    }
  });

  // Announcements endpoints
  app.get("/api/announcements", async (req, res) => {
    try {
      const announcements = await storage.getAnnouncements();
      res.json(announcements);
    } catch (error) {
      console.error('Error fetching announcements:', error);
      res.status(500).json({ error: 'Failed to fetch announcements' });
    }
  });

  app.post("/api/announcements", async (req, res) => {
    try {
      const validatedData = insertAnnouncementSchema.parse(req.body);
      const announcement = await storage.createAnnouncement(validatedData);
      res.status(201).json(announcement);
    } catch (error) {
      console.error('Error creating announcement:', error);
      res.status(400).json({ error: 'Invalid announcement data' });
    }
  });

  app.put("/api/announcements/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid announcement ID" });
      }
      const validatedData = insertAnnouncementSchema.parse(req.body);
      await storage.updateAnnouncement(id, validatedData);
      res.json({ success: true });
    } catch (error) {
      console.error('Error updating announcement:', error);
      res.status(400).json({ error: 'Invalid announcement data' });
    }
  });

  app.delete("/api/announcements/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid announcement ID" });
      }
      await storage.deleteAnnouncement(id);
      res.json({ success: true });
    } catch (error) {
      console.error('Error deleting announcement:', error);
      res.status(500).json({ error: 'Failed to delete announcement' });
    }
  });

  app.delete("/api/players/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid player ID" });
      }
      await storage.deletePlayer(id);
      res.json({ success: true });
    } catch (error) {
      console.error('Error deleting player:', error);
      res.status(500).json({ error: 'Failed to delete player' });
    }
  });

  app.delete("/api/articles/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid article ID" });
      }
      await storage.deleteArticle(id);
      res.json({ success: true });
    } catch (error) {
      console.error('Error deleting article:', error);
      res.status(500).json({ error: 'Failed to delete article' });
    }
  });

  app.delete("/api/gallery/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid gallery item ID" });
      }
      await storage.deleteGalleryItem(id);
      res.json({ success: true });
    } catch (error) {
      console.error('Error deleting gallery item:', error);
      res.status(500).json({ error: 'Failed to delete gallery item' });
    }
  });

  // Player stats endpoints
  app.put("/api/players/:id/stats", async (req, res) => {
    try {
      const playerId = parseInt(req.params.id);
      if (isNaN(playerId)) {
        return res.status(400).json({ error: "Invalid player ID" });
      }

      await storage.updatePlayerStats(playerId, req.body);
      res.json({ success: true });
    } catch (error) {
      console.error('Error updating player stats:', error);
      res.status(500).json({ error: 'Failed to update player stats' });
    }
  });

  // Cricket scoring endpoints
  app.post('/api/scoring/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      
      // Tuskers CC scoring system credentials
      if (username === 'tuskers' && password === 'tuskers2024') {
        res.json({ success: true, message: 'Login successful', userType: 'tuskers' });
      } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
      }
    } catch (error) {
      console.error('Scoring login error:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  });

  app.get('/api/scoring/live', async (req, res) => {
    try {
      // Return current live match data for homepage widget
      const liveData = {
        isLive: true,
        matchName: 'Tuskers CC vs Lightning Bolts',
        venue: 'Premier Cricket Ground',
        status: 'LIVE',
        tuskersScore: '156/3 (28.4 overs)',
        oppositionScore: 'Lightning Bolts: Yet to bat',
        currentBatsmen: [
          { name: 'R. Sharma', runs: 45, balls: 32 },
          { name: 'V. Kohli', runs: 28, balls: 25 }
        ],
        recentOvers: ['4', '1', '0', '6', '2', '1']
      };
      
      res.json(liveData);
    } catch (error) {
      console.error('Live scoring error:', error);
      res.status(500).json({ error: 'Failed to fetch live data' });
    }
  });

  // Forum endpoints
  app.get("/api/forum/categories", async (req, res) => {
    try {
      const categories = await storage.getForumCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch forum categories" });
    }
  });

  app.get("/api/forum/topics/recent", async (req, res) => {
    try {
      const topics = await storage.getForumTopics();
      res.json(topics);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch forum topics" });
    }
  });

  app.get("/api/forum/topics/popular", async (req, res) => {
    try {
      const topics = await storage.getForumTopics();
      // Return topics sorted by view count (mock popular topics for now)
      res.json(topics.slice(0, 5));
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch popular topics" });
    }
  });

  app.get("/api/forum/users/online", async (req, res) => {
    try {
      // Mock online users for now
      res.json([]);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch online users" });
    }
  });

  app.get("/api/forum/stats", async (req, res) => {
    try {
      const stats = await storage.getForumStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch forum stats" });
    }
  });

  app.post("/api/forum/topics", async (req, res) => {
    try {
      const { title, content, categoryId } = req.body;
      
      if (!title || !content || !categoryId) {
        return res.status(400).json({ error: "Title, content, and category are required" });
      }

      const topic = await storage.createForumTopic({
        title,
        content,
        categoryId: parseInt(categoryId),
        userId: 1, // Mock user ID for now
        slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
        isSticky: false,
        isLocked: false,
        viewCount: 0,
        replyCount: 0,
      });
      
      res.json(topic);
    } catch (error) {
      console.error("Failed to create forum topic:", error);
      res.status(500).json({ error: "Failed to create forum topic" });
    }
  });

  // Community Events endpoints
  app.get("/api/community/events", async (req, res) => {
    try {
      const events = await storage.getCommunityEvents();
      res.json(events);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch community events" });
    }
  });

  app.post("/api/community/events", async (req, res) => {
    try {
      const event = await storage.createCommunityEvent(req.body);
      res.json(event);
    } catch (error) {
      res.status(500).json({ error: "Failed to create community event" });
    }
  });

  app.post("/api/community/events/:id/join", async (req, res) => {
    try {
      const eventId = parseInt(req.params.id);
      const userId = 1; // Mock user ID for now
      const participant = await storage.joinCommunityEvent(eventId, userId);
      res.json(participant);
    } catch (error) {
      res.status(500).json({ error: "Failed to join event" });
    }
  });

  app.post("/api/community/events/:id/leave", async (req, res) => {
    try {
      const eventId = parseInt(req.params.id);
      const userId = 1; // Mock user ID for now
      await storage.leaveCommunityEvent(eventId, userId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to leave event" });
    }
  });

  app.get("/api/community/stats", async (req, res) => {
    try {
      const stats = await storage.getCommunityStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch community stats" });
    }
  });

  // Match Performance endpoints
  app.post("/api/matches/:matchId/performances", async (req, res) => {
    try {
      const matchId = parseInt(req.params.matchId);
      if (isNaN(matchId)) {
        return res.status(400).json({ error: "Invalid match ID" });
      }

      const { playerPerformances } = req.body;
      if (!Array.isArray(playerPerformances)) {
        return res.status(400).json({ error: "Player performances must be an array" });
      }

      // Add matchId to each performance
      const performances = playerPerformances.map(perf => ({
        ...perf,
        matchId
      }));

      // Update player stats based on match performances
      await storage.updatePlayerStatsFromMatch(matchId, performances);

      res.json({ success: true, message: "Player stats updated successfully" });
    } catch (error) {
      console.error("Error updating player stats:", error);
      res.status(500).json({ error: "Failed to update player stats" });
    }
  });

  // Manual match performance entry endpoint
  app.post("/api/match-performance/manual", adminAuth, async (req, res) => {
    try {
      const { matchData, playerPerformances } = req.body;
      
      if (!matchData || !Array.isArray(playerPerformances)) {
        return res.status(400).json({ message: 'Match data and player performances are required' });
      }

      // Update individual player stats
      for (const performance of playerPerformances) {
        if (performance.playerId && Object.keys(performance).some(key => 
          key !== 'playerId' && performance[key] > 0
        )) {
          // Only update if there are actual performance values
          const statsUpdate: any = {};
          if (performance.runsScored > 0) statsUpdate.runsScored = performance.runsScored;
          if (performance.ballsFaced > 0) statsUpdate.ballsFaced = performance.ballsFaced;
          if (performance.fours > 0) statsUpdate.fours = performance.fours;
          if (performance.sixes > 0) statsUpdate.sixes = performance.sixes;
          if (performance.wicketsTaken > 0) statsUpdate.wicketsTaken = performance.wicketsTaken;
          if (performance.ballsBowled > 0) statsUpdate.ballsBowled = performance.ballsBowled;
          if (performance.runsConceded > 0) statsUpdate.runsConceded = performance.runsConceded;
          if (performance.catches > 0) statsUpdate.catches = performance.catches;
          if (performance.stumpings > 0) statsUpdate.stumpings = performance.stumpings;
          if (performance.runOuts > 0) statsUpdate.runOuts = performance.runOuts;

          if (Object.keys(statsUpdate).length > 0) {
            await storage.updatePlayerStats(performance.playerId, statsUpdate);
          }
        }
      }

      // Update team stats if match result is available
      if (matchData.result && (matchData.result === 'Won' || matchData.result === 'Lost' || matchData.result === 'Draw')) {
        const currentStats = await storage.getTeamStats();
        const newTotalMatches = currentStats.totalMatches + 1;
        const newMatchesWon = matchData.result === 'Won' ? currentStats.matchesWon + 1 : currentStats.matchesWon;
        
        // Calculate totals from this match
        const totalRunsThisMatch = playerPerformances.reduce((sum, perf) => sum + (perf.runsScored || 0), 0);
        const totalWicketsThisMatch = playerPerformances.reduce((sum, perf) => sum + (perf.wicketsTaken || 0), 0);

        await storage.updateTeamStats({
          matchesWon: newMatchesWon,
          totalMatches: newTotalMatches,
          totalRuns: currentStats.totalRuns + totalRunsThisMatch,
          wicketsTaken: currentStats.wicketsTaken + totalWicketsThisMatch,
          totalOvers: 20, // Default overs for manual entry
          runsAgainst: 150, // Default opposition runs
          oversAgainst: 20, // Default opposition overs
        });
      }
      
      res.json({ message: 'Match performance recorded successfully' });
    } catch (error) {
      console.error('Error recording manual match performance:', error);
      res.status(500).json({ message: 'Failed to record match performance' });
    }
  });

  app.get("/api/matches/:matchId/performances", async (req, res) => {
    try {
      const matchId = parseInt(req.params.matchId);
      if (isNaN(matchId)) {
        return res.status(400).json({ error: "Invalid match ID" });
      }

      const performances = await storage.getMatchPerformances(matchId);
      res.json(performances);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch match performances" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
