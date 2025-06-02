import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertPlayerSchema,
  insertMatchSchema,
  insertArticleSchema,
  insertPollSchema,
  insertGallerySchema,
  insertAnnouncementSchema,
  insertPlayerRegistrationSchema // Make sure this is defined in @shared/schema
} from "@shared/schema";
import { generateCricketPoll, generateCricketQuiz } from "./cricket-api";
import { z } from "zod"; // For ZodError checking

// Extend Express Request type to include session
declare module 'express-serve-static-core' {
  interface Request {
    session: {
      adminLoggedIn?: boolean;
      userRole?: string; // Added for clarity based on usage
      adminLoginTime?: number; // Added based on usage
      userId?: number; // Assuming userId might be stored in session for logged-in users
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

  // --- Admin Authentication Routes ---
  app.post('/api/admin/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      console.log('Login attempt:', { username, passwordLength: password?.length }); //

      let userRole = null;
      let isValidLogin = false;

      if (username === 'admin' && password === 'MAt@51BlaX') { //
        userRole = 'admin'; //
        isValidLogin = true; //
        console.log('Admin login successful'); //
      } else if (username === 'contentwriter' && password === 'ContentWriter2024!') { //
        userRole = 'contentwriter'; //
        isValidLogin = true; //
        console.log('Content writer login successful'); //
      } else {
        console.log('Login failed - invalid credentials'); //
      }

      if (isValidLogin) {
        req.session.adminLoggedIn = true; //
        req.session.userRole = userRole; //
        req.session.adminLoginTime = new Date().getTime(); // Set login time
        res.json({ success: true, message: 'Login successful', role: userRole }); //
      } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' }); //
      }
    } catch (error) {
      console.error('Admin login error:', error); //
      res.status(500).json({ success: false, message: 'Server error' }); //
    }
  });

  app.get('/api/admin/verify', async (req, res) => {
    try {
      const isLoggedIn = req.session?.adminLoggedIn;
      const loginTime = req.session?.adminLoginTime;

      if (!isLoggedIn || !loginTime) {
        return res.status(401).json({ success: false, message: 'Not authenticated' });
      }

      // Check if session is older than 8 hours
      const sessionAge = new Date().getTime() - new Date(loginTime).getTime(); //
      const maxAge = 8 * 60 * 60 * 1000; // 8 hours in milliseconds //

      if (sessionAge > maxAge) {
        delete req.session.adminLoggedIn; //
        delete req.session.adminLoginTime; //
        delete req.session.userRole;
        return res.status(401).json({ success: false, message: 'Session expired' });
      }

      res.json({
        success: true,
        message: 'Authenticated',
        role: req.session.userRole || 'admin' //
      });
    } catch (error) {
      console.error('Admin verify error:', error); //
      res.status(500).json({ success: false, message: 'Server error' }); //
    }
  });

  app.get('/api/admin/role', async (req, res) => {
    try {
      const isLoggedIn = req.session?.adminLoggedIn;
      const userRole = req.session?.userRole || 'admin'; // Default to 'admin' if no role but logged in

      if (!isLoggedIn) { //
        return res.status(401).json({ success: false, message: 'Not authenticated' });
      }
      res.json({ role: userRole });
    } catch (error) {
      console.error('Admin role fetch error:', error); //
      res.status(500).json({ success: false, message: 'Server error' });
    }
  });

  app.post('/api/admin/logout', async (req, res) => {
    try {
      if (req.session) {
        delete req.session.adminLoggedIn;
        delete req.session.userRole;
        delete req.session.adminLoginTime;
      }
      res.json({ success: true, message: 'Logged out successfully' });
    } catch (error) {
      console.error('Admin logout error:', error); //
      res.status(500).json({ success: false, message: 'Server error' });
    }
  });

  // Admin middleware
  const adminAuth = (req: Request, res: any, next: any) => { // Changed req type to Request
    const isLoggedIn = req.session?.adminLoggedIn;
    const loginTime = req.session?.adminLoginTime;

    if (!isLoggedIn || !loginTime) {
      return res.status(401).json({ success: false, message: 'Admin authentication required' });
    }

    const sessionAge = new Date().getTime() - new Date(loginTime).getTime();
    const maxAge = 8 * 60 * 60 * 1000; // 8 hours

    if (sessionAge > maxAge) {
      delete req.session.adminLoggedIn;
      delete req.session.adminLoginTime;
      delete req.session.userRole;
      return res.status(401).json({ success: false, message: 'Admin session expired' });
    }
    next();
  };

  // --- Player Registration Route ---
  app.post("/api/player-registration", async (req, res) => {
    try {
      console.log('Player registration request body:', req.body);

      // Validate the incoming data using the Zod schema
      const validatedData = insertPlayerRegistrationSchema.parse(req.body);

      const newRegistration = await storage.createPlayerRegistration(validatedData);

      res.status(201).json({
        success: true,
        message: "Player registration submitted successfully!",
        data: newRegistration
      });

    } catch (error: any) {
      console.error('Player registration error:', error);
      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          message: "Invalid registration data. Please check the fields.",
          errors: error.flatten().fieldErrors
        });
      } else {
        res.status(500).json({
          success: false,
          message: error.message || "An unexpected error occurred while processing your registration."
        });
      }
    }
  });

  // --- Teams Endpoints ---
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

  // --- Players Endpoints ---
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

  app.post("/api/players", adminAuth, async (req, res) => { // Added adminAuth
    try {
      console.log('Player creation request body:', req.body);
      const validatedData = insertPlayerSchema.parse(req.body);
      const player = await storage.createPlayer(validatedData);
      res.status(201).json(player);
    } catch (error: any) {
      console.error('Player creation/validation error:', error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid player data", details: error.flatten().fieldErrors });
      } else {
        res.status(500).json({ error: error.message || "Failed to create player" });
      }
    }
  });

  app.put("/api/players/:id/stats", adminAuth, async (req, res) => {
    try {
      const playerId = parseInt(req.params.id);
      if (isNaN(playerId)) {
        return res.status(400).json({ error: "Invalid player ID" });
      }
      // TODO: Validate req.body against a partial PlayerStats Zod schema
      await storage.updatePlayerStats(playerId, req.body);
      res.json({ success: true, message: "Player stats updated." });
    } catch (error: any) {
      console.error('Error updating player stats:', error);
      res.status(500).json({ error: error.message || 'Failed to update player stats' });
    }
  });

  app.delete("/api/players/all", adminAuth, async (req, res) => { // Added adminAuth
    try {
      await storage.deleteAllPlayers();
      res.json({ success: true, message: "All players deleted successfully" });
    } catch (error: any) {
      console.error("Delete all players error:", error);
      res.status(500).json({ error: error.message || "Failed to delete all players" });
    }
  });

  app.delete("/api/players/:id", adminAuth, async (req, res) => { // Added adminAuth
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid player ID" });
      }
      await storage.deletePlayer(id);
      res.json({ success: true, message: "Player deleted successfully" });
    } catch (error: any) {
      console.error("Delete player error:", error);
      res.status(500).json({ error: error.message || "Failed to delete player" });
    }
  });

  // --- Matches Endpoints ---
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

  app.post("/api/matches", adminAuth, async (req, res) => { // Added adminAuth
    try {
      const validatedData = insertMatchSchema.parse(req.body);
      const match = await storage.createMatch(validatedData);
      res.status(201).json(match);
    } catch (error: any) {
      console.error('Match creation/validation error:', error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid match data", details: error.flatten().fieldErrors });
      } else {
        res.status(500).json({ error: error.message || "Failed to create match" });
      }
    }
  });

  // --- Articles Endpoints ---
  app.get("/api/articles", async (req, res) => {
    try {
      const articles = await storage.getArticles();
      res.json(articles);
    } catch (error: any) {
      console.error('Failed to fetch articles:', error);
      res.status(500).json({ error: error.message || "Failed to fetch articles" });
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

  app.post("/api/articles", adminAuth, async (req, res) => { // Added adminAuth
    try {
      console.log('Article creation request body:', req.body);
      const validatedData = insertArticleSchema.parse(req.body);
      const articleData = {
        ...validatedData,
        publishedAt: validatedData.isPublished ? new Date() : null
      };
      const article = await storage.createArticle(articleData);
      res.status(201).json(article);
    } catch (error: any) {
      console.error('Article creation/validation error:', error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid article data", details: error.flatten().fieldErrors });
      } else {
        res.status(500).json({ error: error.message || "Failed to create article" });
      }
    }
  });

  app.put("/api/articles/:id", adminAuth, async (req, res) => { // Added adminAuth
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid article ID" });
      }
      // TODO: Validate req.body with insertArticleSchema.partial()
      console.log('Updating article:', id, 'with data:', req.body);
      await storage.updateArticle(id, req.body);
      res.json({ success: true, message: "Article updated successfully" });
    } catch (error: any) {
      console.error("Update article error:", error);
      res.status(500).json({ error: error.message || "Failed to update article" });
    }
  });

  // Using PUT for full update, PATCH for partial might be more RESTful,
  // but for simplicity, PUT is often used for general updates.
  app.patch("/api/articles/:id", adminAuth, async (req, res) => { // Added adminAuth
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid article ID" });
      }
      // TODO: Validate req.body with insertArticleSchema.partial()
      console.log('Patching article:', id, 'with data:', req.body);
      await storage.updateArticle(id, req.body); // storage.updateArticle should handle partial updates
      res.json({ success: true, message: "Article updated successfully" });
    } catch (error: any) {
      console.error("Update article error (PATCH):", error);
      res.status(500).json({ error: error.message || "Failed to update article" });
    }
  });

  app.delete("/api/articles/:id", adminAuth, async (req, res) => { // Added adminAuth
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid article ID" });
      }
      await storage.deleteArticle(id);
      res.json({ success: true, message: "Article deleted successfully." });
    } catch (error: any) {
      console.error("Delete article error:", error);
      res.status(500).json({ error: error.message || "Failed to delete article" });
    }
  });


  // --- Social Posts Endpoints ---
  app.get("/api/social-posts", async (req, res) => {
    try {
      const posts = await storage.getSocialPosts();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch social posts" });
    }
  });
  // TODO: POST for social posts with adminAuth and validation

  // --- Polls Endpoints ---
  app.get("/api/polls", async (req, res) => { // Public endpoint to get active polls
    try {
      const polls = await storage.getActivePolls();
      res.json(polls);
    } catch (error: any) {
      console.error('Error fetching active polls:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch polls' });
    }
  });

  app.get("/api/polls/current", async (req, res) => { // Specific for one active poll
    try {
      const polls = await storage.getActivePolls();
      // Logic to determine "current" might need refinement (e.g., latest active)
      const currentPoll = polls.length > 0 ? polls[0] : null; // Example: get the latest active one
      res.json(currentPoll);
    } catch (error: any) {
      console.error('Error fetching current poll:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch current poll' });
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

  app.post("/api/polls", adminAuth, async (req, res) => {
    try {
      // The insertPollSchema should align with what storage.createPoll expects.
      // The original routes.txt had a more complex pollData structure for createPoll.
      // Assuming insertPollSchema matches the simplified storage.createPoll expectation.
      const validatedData = insertPollSchema.parse(req.body);
      const poll = await storage.createPoll(validatedData);
      res.status(201).json(poll);
    } catch (error: any) {
      console.error('Poll creation/validation error:', error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid poll data", details: error.flatten().fieldErrors });
      } else {
        res.status(500).json({ error: error.message || "Failed to create poll" });
      }
    }
  });

  app.post("/api/polls/:id/vote", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { option } = req.body; // Option here is likely the index or key of the choice

      if (isNaN(id) || option === undefined) {
        return res.status(400).json({ error: "Invalid poll ID or option missing" });
      }

      const poll = await storage.getPoll(id);
      if (!poll) {
        return res.status(404).json({ error: "Poll not found" });
      }
      if (!poll.isActive) {
        return res.status(400).json({ error: "This poll is no longer active." });
      }

      // Assuming poll.options is an array of strings and poll.votes is a Record<string, number>
      // or poll.options is JSON string and poll.votes is JSON string of an array/object.
      // The logic needs to match how votes are stored and updated in storage.ts/schema.ts.

      // Let's assume options is an array like ["Option A", "Option B"]
      // and votes is an object like {"Option A": 10, "Option B": 5}
      // The `option` from req.body should be the string of the option itself.

      let currentVotes = poll.votes as Record<string, number>;
      if (typeof currentVotes === 'string') { // If votes are stored as JSON string
          try {
            currentVotes = JSON.parse(currentVotes);
          } catch (e) {
            console.error("Error parsing poll votes JSON:", e);
            return res.status(500).json({ error: "Error processing poll votes."});
          }
      }
      if (typeof currentVotes !== 'object' || currentVotes === null) {
          currentVotes = {};
      }


      if (poll.options && Array.isArray(poll.options) && (poll.options as string[]).includes(option)) {
          currentVotes[option] = (currentVotes[option] || 0) + 1;
      } else if (poll.options && typeof poll.options === 'string') {
          // If options are JSON string of array
          try {
              const parsedOptions = JSON.parse(poll.options as string);
              if (Array.isArray(parsedOptions) && parsedOptions.includes(option)) {
                  currentVotes[option] = (currentVotes[option] || 0) + 1;
              } else {
                  return res.status(400).json({ error: "Invalid option for this poll." });
              }
          } catch(e) {
              return res.status(500).json({ error: "Error processing poll options." });
          }
      }
       else {
        return res.status(400).json({ error: "Invalid option for this poll." });
      }

      await storage.updatePoll(id, { votes: currentVotes }); // votes should be a Record<string, number> or JSON string
      res.json({ success: true, message: "Vote recorded." });
    } catch (error: any) {
      console.error("Error voting on poll:", error);
      res.status(500).json({ error: error.message || "Failed to vote on poll" });
    }
  });

  app.put("/api/polls/:id/visibility", adminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { isActive } = req.body;
      if (isNaN(id) || typeof isActive !== 'boolean') {
        return res.status(400).json({ error: "Invalid poll ID or isActive status" });
      }
      await storage.updatePoll(id, { isActive });
      res.json({ success: true, message: `Poll visibility set to ${isActive}` });
    } catch (error: any) {
      console.error('Error updating poll visibility:', error);
      res.status(500).json({ error: error.message || 'Failed to update poll visibility' });
    }
  });

  app.delete("/api/polls/:id", adminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid poll ID" });
      }
      await storage.deletePoll(id);
      res.json({ success: true, message: "Poll deleted successfully." });
    } catch (error: any) {
      console.error('Error deleting poll:', error);
      res.status(500).json({ error: error.message || 'Failed to delete poll' });
    }
  });

  // --- Quizzes Endpoints ---
  app.get("/api/quizzes", async (req, res) => { // Public endpoint for active quizzes
    try {
      const quizzes = await storage.getActiveQuizzes();
      res.json(quizzes);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch quizzes" });
    }
  });
  // TODO: Add POST, PUT, DELETE for quizzes with adminAuth and validation

  // --- Gallery Endpoints ---
  app.get("/api/gallery", async (req, res) => {
    try {
      const galleryItems = await storage.getGalleryItems();
      res.json(galleryItems);
    } catch (error: any) {
      console.error('Error fetching gallery items:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch gallery items' });
    }
  });

  app.post("/api/gallery", adminAuth, async (req, res) => { // Added adminAuth
    try {
      const validatedData = insertGallerySchema.parse(req.body);
      const galleryItem = await storage.createGalleryItem(validatedData);
      res.status(201).json(galleryItem);
    } catch (error: any) {
      console.error('Gallery item creation/validation error:', error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: 'Invalid gallery item data', details: error.flatten().fieldErrors });
      } else {
        res.status(500).json({ error: error.message || 'Failed to create gallery item' });
      }
    }
  });

  app.delete("/api/gallery/:id", adminAuth, async (req, res) => { // Added adminAuth
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid gallery item ID" });
      }
      await storage.deleteGalleryItem(id);
      res.json({ success: true, message: "Gallery item deleted." });
    } catch (error: any) {
      console.error('Error deleting gallery item:', error);
      res.status(500).json({ error: error.message || 'Failed to delete gallery item' });
    }
  });

  app.post('/api/gallery/:id/like', async (req, res) => {
    try {
      const galleryItemId = parseInt(req.params.id);
      if (isNaN(galleryItemId)) {
        return res.status(400).json({ error: "Invalid gallery item ID" });
      }
      const userIp = req.ip || req.socket.remoteAddress || '127.0.0.1'; // Updated to socket.remoteAddress
      const userAgent = req.get('User-Agent');

      const success = await storage.likeGalleryItem(galleryItemId, userIp, userAgent);
      if (success) {
        res.json({ success: true, message: 'Gallery item liked' });
      } else {
        res.status(400).json({ success: false, message: 'Already liked or an error occurred' });
      }
    } catch (error: any) {
      console.error("Error liking gallery item:", error);
      res.status(500).json({ success: false, message: error.message || "Failed to like gallery item" });
    }
  });

  app.delete('/api/gallery/:id/like', async (req, res) => { // Should this be POST or DELETE? Using DELETE as per original
    try {
      const galleryItemId = parseInt(req.params.id);
      if (isNaN(galleryItemId)) {
        return res.status(400).json({ error: "Invalid gallery item ID" });
      }
      const userIp = req.ip || req.socket.remoteAddress || '127.0.0.1';

      const success = await storage.unlikeGalleryItem(galleryItemId, userIp);
      res.json({ success, message: success ? 'Gallery item unliked' : 'Item was not liked or an error occurred' });
    } catch (error: any) {
      console.error("Error unliking gallery item:", error);
      res.status(500).json({ success: false, message: error.message || "Failed to unlike gallery item" });
    }
  });

  app.get('/api/gallery/:id/liked', async (req, res) => {
    try {
      const galleryItemId = parseInt(req.params.id);
      if (isNaN(galleryItemId)) {
        return res.status(400).json({ error: "Invalid gallery item ID" });
      }
      const userIp = req.ip || req.socket.remoteAddress || '127.0.0.1';
      const isLiked = await storage.hasUserLikedGalleryItem(galleryItemId, userIp);
      res.json({ isLiked });
    } catch (error) {
      console.error("Error checking gallery like status:", error);
      res.status(500).json({ isLiked: false }); // Default to not liked on error
    }
  });


  // --- Statistics Endpoints ---
  app.get("/api/stats/team", async (req, res) => {
    try {
      const stats = await storage.getTeamStats();
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to fetch team statistics" });
    }
  });

  // This PUT endpoint was a bit ambiguous.
  // If it's for updating the overall team stats record:
  app.put("/api/stats/team", adminAuth, async (req, res) => { // Added adminAuth
    try {
      // Expects a full team stats object, or whatever `updateTeamStats` needs.
      // TODO: Validate req.body against a Zod schema for TeamStats
      const statsData = req.body; // Needs careful validation and structuring
      await storage.updateTeamStats(statsData);
      res.json({ success: true, message: "Team statistics updated." });
    } catch (error: any) {
      console.error('Error updating team stats:', error);
      res.status(500).json({ error: error.message || "Failed to update team statistics" });
    }
  });


  // --- Match Recording & Performance Endpoints ---
  // The original file had multiple ways to record matches/performances.
  // These need to be clearly defined or consolidated.

  // Option 1: Record a simple match result and update cumulative team stats
  app.post("/api/record-match", adminAuth, async (req, res) => { // Added adminAuth
    try {
      // This route updates cumulative stats. The data passed to updateTeamStats
      // should be the *new cumulative totals*, not just the delta of one match,
      // unless storage.updateTeamStats is designed to handle deltas.
      // Assuming storage.updateTeamStats takes the NEW FULL CUMULATIVE stats.

      const { opponent, venue, date, result, teamRuns, wicketsTaken, oversFacedByTeam, runsConcededByTeam, oversBowledByTeam } = req.body;
      // TODO: Validate these inputs with Zod

      const currentStats = await storage.getTeamStats();

      const updatedStats = {
        matchesWon: currentStats.matchesWon + (result === 'Won' ? 1 : 0),
        matchesLost: currentStats.matchesLost + (result === 'Lost' ? 1 : 0),
        matchesDraw: currentStats.matchesDraw + (result === 'Draw' ? 1 : 0),
        totalMatches: currentStats.totalMatches + 1,
        totalRuns: currentStats.totalRuns + (Number(teamRuns) || 0),
        wicketsTaken: currentStats.wicketsTaken + (Number(wicketsTaken) || 0), // Wickets by our bowlers
        oversBowled: currentStats.oversBowled + (Number(oversBowledByTeam) || 0), // Overs bowled by our team
        runsAgainst: currentStats.runsAgainst + (Number(runsConcededByTeam) || 0), // Runs conceded by our team
        oversAgainst: currentStats.oversAgainst + (Number(oversFacedByTeam) || 0), // Overs faced by our team
      };

      await storage.updateTeamStats(updatedStats);
      console.log(`Match recorded: ${result} vs ${opponent} at ${venue} on ${date}`);
      res.json({
        success: true,
        message: "Match recorded and team statistics updated successfully"
      });
    } catch (error: any) {
      console.error("Error recording match:", error);
      res.status(500).json({ error: error.message || "Failed to record match" });
    }
  });

  // Option 2: Record detailed player performances for a specific match and update player/team stats
  app.post("/api/matches/:matchId/performances", adminAuth, async (req, res) => { // Added adminAuth
    try {
      const matchId = parseInt(req.params.matchId);
      if (isNaN(matchId)) {
        return res.status(400).json({ error: "Invalid match ID" });
      }

      const { playerPerformances, matchResult } = req.body; // Added matchResult for team stats
      if (!Array.isArray(playerPerformances)) {
        return res.status(400).json({ error: "Player performances must be an array" });
      }
      // TODO: Validate playerPerformances array and its objects with Zod

      // Update player stats from this match's performances
      await storage.updatePlayerStatsFromMatch(matchId, playerPerformances);

      // Update team stats based on this match result and aggregated performances
      if (matchResult) {
          const teamRunsThisMatch = playerPerformances.reduce((sum, p) => sum + (Number(p.runsScored) || 0), 0);
          const teamWicketsThisMatch = playerPerformances.reduce((sum, p) => sum + (Number(p.wicketsTaken) || 0), 0);
          const teamOversBowledThisMatch = playerPerformances.reduce((sum, p) => sum + (Number(p.ballsBowled) || 0), 0) / 6;
          const teamRunsConcededThisMatch = playerPerformances.reduce((sum, p) => sum + (Number(p.runsConceded) || 0), 0);
          // Overs faced by team in this match - this needs to be provided or assumed (e.g. 20 for T20)
          const teamOversFacedThisMatch = 20; // Placeholder, ideally part of request or match data

          const currentTeamStats = await storage.getTeamStats();
          const updatedTeamStats = {
              matchesWon: currentTeamStats.matchesWon + (matchResult === 'Won' ? 1 : 0),
              matchesLost: currentTeamStats.matchesLost + (matchResult === 'Lost' ? 1 : 0),
              matchesDraw: currentTeamStats.matchesDraw + (matchResult === 'Draw' ? 1 : 0),
              totalMatches: currentTeamStats.totalMatches + 1,
              totalRuns: currentTeamStats.totalRuns + teamRunsThisMatch,
              wicketsTaken: currentTeamStats.wicketsTaken + teamWicketsThisMatch,
              oversBowled: currentTeamStats.oversBowled + teamOversBowledThisMatch,
              runsAgainst: currentTeamStats.runsAgainst + teamRunsConcededThisMatch,
              oversAgainst: currentTeamStats.oversAgainst + teamOversFacedThisMatch,
          };
          await storage.updateTeamStats(updatedTeamStats);
      }

      res.json({ success: true, message: "Player stats and team stats updated successfully from match performances." });
    } catch (error: any) {
      console.error("Error updating stats from match performances:", error);
      res.status(500).json({ error: error.message || "Failed to update player stats" });
    }
  });

  // Get performances for a specific match
  app.get("/api/matches/:matchId/performances", async (req, res) => {
    try {
      const matchId = parseInt(req.params.matchId);
      if (isNaN(matchId)) {
        return res.status(400).json({ error: "Invalid match ID" });
      }
      const performances = await storage.getMatchPerformances(matchId);
      res.json(performances);
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to fetch match performances" });
    }
  });

  // The /api/match-performance/manual route seemed very similar to the one above.
  // It's advisable to consolidate these into a clear, single way to record match outcomes and performances.
  // I'm omitting the specific /api/match-performance/manual from lines of routes.txt
  // in favor of the more RESTful /api/matches/:matchId/performances combined with match creation/update.

  // --- Cricket API Mocks ---
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


  // --- Trivia Endpoints ---
  app.get("/api/trivia/questions", async (req, res) => {
    try {
      const questions = await storage.getTriviaQuestions();
      res.json(questions);
    } catch (error: any) {
      console.error('Error fetching trivia questions:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch trivia questions' });
    }
  });

  app.get("/api/trivia/leaderboard", async (req, res) => {
    try {
      const leaderboard = await storage.getTriviaLeaderboard();
      res.json(leaderboard);
    } catch (error: any) {
      console.error('Error fetching trivia leaderboard:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch trivia leaderboard' });
    }
  });

  app.post("/api/trivia/submit-score", async (req, res) => {
    try {
      // TODO: Validate req.body with a Zod schema for InsertTriviaLeaderboard
      const { playerName, score, questionsAnswered, accuracy } = req.body;
      if (!playerName || score === undefined || questionsAnswered === undefined || accuracy === undefined) {
        return res.status(400).json({ error: 'Missing required fields for trivia score' });
      }
      const entry = await storage.submitTriviaScore({
        playerName,
        score,
        questionsAnswered,
        accuracy
        // playDate will be set by default in Drizzle schema if defined with defaultNow()
      });
      res.status(201).json(entry);
    } catch (error: any) {
      console.error('Error submitting trivia score:', error);
      res.status(500).json({ error: error.message || 'Failed to submit trivia score' });
    }
  });


  // --- Announcements Endpoints ---
  app.get("/api/announcements", async (req, res) => {
    try {
      const announcements = await storage.getAnnouncements();
      res.json(announcements);
    } catch (error: any) {
      console.error('Error fetching announcements:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch announcements' });
    }
  });

  app.post("/api/announcements", adminAuth, async (req, res) => {
    try {
      const validatedData = insertAnnouncementSchema.parse(req.body);
      const announcement = await storage.createAnnouncement(validatedData);
      res.status(201).json(announcement);
    } catch (error: any) {
      console.error('Announcement creation/validation error:', error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: 'Invalid announcement data', details: error.flatten().fieldErrors });
      } else {
        res.status(500).json({ error: error.message || 'Failed to create announcement' });
      }
    }
  });

  app.put("/api/announcements/:id", adminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid announcement ID" });
      }
      // TODO: Validate req.body with insertAnnouncementSchema.partial()
      await storage.updateAnnouncement(id, req.body);
      res.json({ success: true, message: "Announcement updated." });
    } catch (error: any) {
      console.error('Error updating announcement:', error);
      // Add ZodError check if validation is added
      res.status(500).json({ error: error.message || 'Failed to update announcement' });
    }
  });

  app.delete("/api/announcements/:id", adminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid announcement ID" });
      }
      await storage.deleteAnnouncement(id);
      res.json({ success: true, message: "Announcement deleted." });
    } catch (error: any) {
      console.error('Error deleting announcement:', error);
      res.status(500).json({ error: error.message || 'Failed to delete announcement' });
    }
  });


  // --- Forum Endpoints ---
  app.get("/api/forum/categories", async (req, res) => {
    try {
      const categories = await storage.getForumCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch forum categories" });
    }
  });

  app.get("/api/forum/topics/recent", async (req, res) => { // Consider query params for categoryId, pagination
    try {
      const categoryId = req.query.categoryId ? parseInt(req.query.categoryId as string) : undefined;
      const topics = await storage.getForumTopics(categoryId);
      res.json(topics);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch forum topics" });
    }
  });

  // Add GET /api/forum/topics/slug/:slug if needed, or a general topic fetch by ID/slug
  app.get("/api/forum/topic/:slug", async (req, res) => { // Example specific topic fetch by slug
    try {
        const topic = await storage.getForumTopic(req.params.slug);
        if (!topic) {
            return res.status(404).json({ error: "Forum topic not found." });
        }
        // Optionally fetch posts for the topic here or have a separate endpoint
        const posts = await storage.getForumPosts(topic.id);
        res.json({ ...topic, posts });
    } catch (error: any) {
        res.status(500).json({ error: error.message || "Failed to fetch forum topic." });
    }
  });


  app.get("/api/forum/topics/popular", async (req, res) => { // As per original file
    try {
      const topics = await storage.getForumTopics(); //
      // TODO: Implement actual popularity logic (e.g., sort by viewCount or replyCount)
      res.json(topics.slice(0, 5)); //
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch popular topics" }); //
    }
  });

  app.get("/api/forum/users/online", async (req, res) => { // As per original file
    try {
      // TODO: Implement actual online user tracking if needed
      res.json([]); //
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch online users" }); //
    }
  });

  app.get("/api/forum/stats", async (req, res) => { // As per original file
    try {
      const stats = await storage.getForumStats(); //
      res.json(stats); //
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch forum stats" }); //
    }
  });

  app.post("/api/forum/topics", async (req, res) => { // Needs auth
    try {
      const { title, content, categoryId } = req.body;
      const userId = req.session?.userId; // Get from actual authenticated user session

      if (!userId) {
        return res.status(401).json({ error: "Authentication required to create a topic." });
      }
      if (!title || !content || !categoryId) {
        return res.status(400).json({ error: "Title, content, and category ID are required" });
      }
      // TODO: Validate with Zod schema for InsertForumTopic

      const topicData = {
        title,
        content, // Content for the first post
        categoryId: parseInt(categoryId),
        userId: userId, // Use actual user ID
        slug: title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''), // Basic slugification
        // Other fields like isSticky, isLocked, viewCount, replyCount are usually handled by DB defaults or later updates
      };
      const newTopic = await storage.createForumTopic(topicData);
      // Optionally create the first post here as well using storage.createForumPost
      if (newTopic && content) {
          await storage.createForumPost({
              topicId: newTopic.id,
              userId: userId,
              content: content,
          });
      }
      res.status(201).json(newTopic);
    } catch (error: any) {
      console.error("Failed to create forum topic:", error);
      res.status(500).json({ error: error.message || "Failed to create forum topic" });
    }
  });

  app.post("/api/forum/topics/:topicId/posts", async (req, res) => { // Needs auth
    try {
        const topicId = parseInt(req.params.topicId);
        const { content } = req.body;
        const userId = req.session?.userId;

        if (isNaN(topicId)) {
            return res.status(400).json({ error: "Invalid topic ID." });
        }
        if (!userId) {
            return res.status(401).json({ error: "Authentication required to create a post." });
        }
        if (!content) {
            return res.status(400).json({ error: "Post content is required." });
        }
        // TODO: Validate with Zod schema for InsertForumPost

        const postData = {
            topicId,
            userId,
            content,
        };
        const newPost = await storage.createForumPost(postData);
        res.status(201).json(newPost);
    } catch (error: any) {
        console.error("Failed to create forum post:", error);
        res.status(500).json({ error: error.message || "Failed to create forum post."});
    }
  });


  // --- Community Events Endpoints ---
  app.get("/api/community/events", async (req, res) => {
    try {
      const events = await storage.getCommunityEvents();
      res.json(events);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch community events" });
    }
  });

  app.post("/api/community/events", adminAuth, async (req, res) => { // Added adminAuth
    try {
      // TODO: Validate req.body with Zod schema for InsertCommunityEvent
      const event = await storage.createCommunityEvent(req.body);
      res.status(201).json(event);
    } catch (error: any) {
      console.error("Failed to create community event:", error);
      res.status(500).json({ error: error.message || "Failed to create community event" });
    }
  });

  app.post("/api/community/events/:id/join", async (req, res) => { // Needs auth
    try {
      const eventId = parseInt(req.params.id);
      const userId = req.session?.userId; // Get from actual authenticated user session

      if (isNaN(eventId)) {
          return res.status(400).json({ error: "Invalid event ID." });
      }
      if (!userId) {
        return res.status(401).json({ error: "Authentication required to join an event." });
      }
      const participant = await storage.joinCommunityEvent(eventId, userId);
      res.status(201).json(participant);
    } catch (error: any) {
      console.error("Failed to join event:", error);
      // Handle specific errors e.g. already joined
      res.status(500).json({ error: error.message || "Failed to join event" });
    }
  });

  app.post("/api/community/events/:id/leave", async (req, res) => { // Needs auth
    try {
      const eventId = parseInt(req.params.id);
      const userId = req.session?.userId; // Get from actual authenticated user session

      if (isNaN(eventId)) {
          return res.status(400).json({ error: "Invalid event ID." });
      }
      if (!userId) {
        return res.status(401).json({ error: "Authentication required to leave an event." });
      }
      await storage.leaveCommunityEvent(eventId, userId);
      res.json({ success: true, message: "Successfully left the event." });
    } catch (error: any) {
      console.error("Failed to leave event:", error);
      res.status(500).json({ error: error.message || "Failed to leave event" });
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

  // --- Scoring System Mock ---
  app.post('/api/scoring/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      if (username === 'tuskers' && password === 'tuskers2024') {
        // In a real app, set a session or token for scorers
        res.json({ success: true, message: 'Scoring login successful', userType: 'tuskers' });
      } else {
        res.status(401).json({ success: false, message: 'Invalid scoring credentials' });
      }
    } catch (error) {
      console.error('Scoring login error:', error);
      res.status(500).json({ success: false, message: 'Server error during scoring login' });
    }
  });

  app.get('/api/scoring/live', async (req, res) => {
    try {
      // TODO: Replace with actual data from storage.getLiveMatches() or a dedicated live scoring table
      const liveMatches = await storage.getLiveMatches();
      if (liveMatches.length > 0) {
          // Format the first live match into the expected structure
          const liveMatch = liveMatches[0];
          const liveData = {
            isLive: true,
            matchName: `${liveMatch.homeTeam.name} vs ${liveMatch.awayTeam.name}`,
            venue: "N/A", // Assuming venue is not directly in liveMatch type, adjust if it is
            status: 'LIVE',
            tuskersScore: liveMatch.homeTeamScore || 'N/A', // Adjust field names as per your Match type
            oppositionScore: liveMatch.awayTeamScore || 'N/A',
            // currentBatsmen and recentOvers would need more detailed live scoring data
            currentBatsmen: [],
            recentOvers: []
          };
          res.json(liveData);
      } else {
        res.json({ isLive: false, message: "No live matches currently." });
      }
    } catch (error) {
      console.error('Live scoring error:', error);
      res.status(500).json({ error: 'Failed to fetch live data' });
    }
  });


  const httpServer = createServer(app);
  return httpServer;
}
