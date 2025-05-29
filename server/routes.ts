import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPlayerSchema, insertMatchSchema, insertArticleSchema, insertPollSchema } from "@shared/schema";
import { generateCricketPoll, generateCricketQuiz } from "./cricket-api";

export async function registerRoutes(app: Express): Promise<Server> {
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
      const article = await storage.createArticle(validatedData);
      res.status(201).json(article);
    } catch (error) {
      res.status(400).json({ error: "Invalid article data" });
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

  const httpServer = createServer(app);
  return httpServer;
}
