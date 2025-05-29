import { db } from "./db";
import { 
  teams, players, venues, competitions, matches, playerStats, 
  articles, socialPosts, polls, gallery 
} from "@shared/schema";

export async function seedDatabase() {
  try {
    // Insert Tuskers CC team
    const [tuskersTeam] = await db.insert(teams).values({
      name: "Tuskers CC",
      shortName: "TC",
      logo: "/assets/tuskers-logo.png",
      isOurTeam: true
    }).returning();

    // Insert opponent teams
    const [lightningTeam] = await db.insert(teams).values({
      name: "Lightning Bolts",
      shortName: "LGT",
      logo: null,
      isOurTeam: false
    }).returning();

    const [thunderTeam] = await db.insert(teams).values({
      name: "Thunder Hawks",
      shortName: "THU",
      logo: null,
      isOurTeam: false
    }).returning();

    // Insert venues
    const [homeVenue] = await db.insert(venues).values({
      name: "Tuskers Cricket Ground",
      location: "Stadium Road",
      capacity: 15000
    }).returning();

    // Insert competitions
    const [premierLeague] = await db.insert(competitions).values({
      name: "Premier League",
      shortName: "PL",
      type: "league"
    }).returning();

    const [championsLeague] = await db.insert(competitions).values({
      name: "Champions League",
      shortName: "CL",
      type: "tournament"
    }).returning();

    // Insert players
    const playersData = [
      {
        name: "Rajesh Sharma",
        jerseyNumber: 7,
        role: "Batsman",
        battingStyle: "Right-handed",
        bowlingStyle: null,
        bio: "Aggressive top-order batsman and team captain",
        photo: null,
        isCaptain: true,
        isViceCaptain: false,
        isActive: true
      },
      {
        name: "Mohammed Ali",
        jerseyNumber: 10,
        role: "Fast Bowler",
        battingStyle: "Right-handed",
        bowlingStyle: "Right-arm fast",
        bio: "Express pace bowler with deadly yorkers",
        photo: null,
        isCaptain: false,
        isViceCaptain: false,
        isActive: true
      },
      {
        name: "Deepak Kumar",
        jerseyNumber: 1,
        role: "Wicket-keeper",
        battingStyle: "Right-handed",
        bowlingStyle: null,
        bio: "Reliable wicket-keeper batsman",
        photo: null,
        isCaptain: false,
        isViceCaptain: true,
        isActive: true
      },
      {
        name: "Suresh Khan",
        jerseyNumber: 8,
        role: "Spin Bowler",
        battingStyle: "Left-handed",
        bowlingStyle: "Left-arm spin",
        bio: "Crafty spin bowler with excellent control",
        photo: null,
        isCaptain: false,
        isViceCaptain: false,
        isActive: true
      },
      {
        name: "Amit Patel",
        jerseyNumber: 3,
        role: "All-rounder",
        battingStyle: "Right-handed",
        bowlingStyle: "Right-arm medium",
        bio: "Dependable all-rounder with solid technique",
        photo: null,
        isCaptain: false,
        isViceCaptain: false,
        isActive: true
      }
    ];

    const insertedPlayers = [];
    for (const playerData of playersData) {
      const [player] = await db.insert(players).values(playerData).returning();
      insertedPlayers.push(player);
    }

    // Insert player stats
    const statsData = [
      { playerId: insertedPlayers[0].id, matches: 25, runsScored: 1247, ballsFaced: 1156, fours: 98, sixes: 23, wicketsTaken: 0, ballsBowled: 0, runsConceded: 0, catches: 15, stumpings: 0, runOuts: 3 },
      { playerId: insertedPlayers[1].id, matches: 25, runsScored: 156, ballsFaced: 98, fours: 12, sixes: 2, wicketsTaken: 42, ballsBowled: 1156, runsConceded: 987, catches: 8, stumpings: 0, runOuts: 1 },
      { playerId: insertedPlayers[2].id, matches: 25, runsScored: 687, ballsFaced: 756, fours: 56, sixes: 8, wicketsTaken: 0, ballsBowled: 0, runsConceded: 0, catches: 23, stumpings: 12, runOuts: 5 },
      { playerId: insertedPlayers[3].id, matches: 23, runsScored: 234, ballsFaced: 298, fours: 18, sixes: 3, wicketsTaken: 38, ballsBowled: 1087, runsConceded: 856, catches: 12, stumpings: 0, runOuts: 2 },
      { playerId: insertedPlayers[4].id, matches: 24, runsScored: 567, ballsFaced: 634, fours: 45, sixes: 12, wicketsTaken: 18, ballsBowled: 456, runsConceded: 387, catches: 18, stumpings: 0, runOuts: 4 }
    ];

    for (const statData of statsData) {
      await db.insert(playerStats).values(statData);
    }

    // Insert matches
    const matchesData = [
      {
        homeTeamId: tuskersTeam.id,
        awayTeamId: lightningTeam.id,
        venueId: homeVenue.id,
        competitionId: premierLeague.id,
        matchDate: new Date('2024-12-15T14:30:00Z'),
        status: 'upcoming',
        homeTeamScore: null,
        awayTeamScore: null,
        homeTeamOvers: null,
        awayTeamOvers: null,
        result: null,
        playerOfMatch: null,
        isLive: false,
        liveData: null
      },
      {
        homeTeamId: tuskersTeam.id,
        awayTeamId: thunderTeam.id,
        venueId: homeVenue.id,
        competitionId: championsLeague.id,
        matchDate: new Date('2024-11-28T14:30:00Z'),
        status: 'completed',
        homeTeamScore: '245/6',
        awayTeamScore: '187/9',
        homeTeamOvers: '50.0',
        awayTeamOvers: '45.2',
        result: 'Tuskers CC won by 58 runs',
        playerOfMatch: insertedPlayers[0].id,
        isLive: false,
        liveData: null
      }
    ];

    for (const matchData of matchesData) {
      await db.insert(matches).values(matchData);
    }

    // Insert articles
    const articlesData = [
      {
        title: "Tuskers CC Wins Champions League Final",
        slug: "tuskers-cc-wins-champions-league-final",
        excerpt: "An incredible performance by the team led to a dominant victory in the championship match.",
        content: "In a thrilling final match, Tuskers CC showcased exceptional cricket to defeat their opponents and claim the Champions League title. Captain Rajesh Sharma's brilliant century set the foundation for this historic win.",
        featuredImage: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        author: "Sports Desk",
        category: "match-report",
        isPublished: true,
        isFeatured: true,
        publishedAt: new Date('2024-11-29T10:00:00Z')
      },
      {
        title: "New Training Facility Inaugurated",
        slug: "new-training-facility-inaugurated",
        excerpt: "State-of-the-art training facilities now available for player development.",
        content: "Tuskers CC has inaugurated a new world-class training facility equipped with modern amenities and technology to enhance player performance and development.",
        featuredImage: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        author: "Management Team",
        category: "facilities",
        isPublished: true,
        isFeatured: false,
        publishedAt: new Date('2024-11-25T09:00:00Z')
      }
    ];

    for (const articleData of articlesData) {
      await db.insert(articles).values(articleData);
    }

    // Insert social posts
    const socialPostsData = [
      {
        platform: "twitter",
        postId: "tweet_001",
        content: "What an incredible match! Tuskers CC continues to dominate the league with outstanding performance! 🏏 #TuskersCC #Cricket",
        author: "tuskerscc_official",
        authorAvatar: null,
        likes: 234,
        comments: 45,
        shares: 23,
        postedAt: new Date('2024-11-30T15:30:00Z')
      },
      {
        platform: "instagram",
        postId: "insta_001",
        content: "Behind the scenes training session with our champion players! The dedication is real 💪 #TrainingDay #TuskersCC",
        author: "tuskerscc_official",
        authorAvatar: null,
        likes: 567,
        comments: 89,
        shares: 34,
        postedAt: new Date('2024-11-29T12:00:00Z')
      }
    ];

    for (const postData of socialPostsData) {
      await db.insert(socialPosts).values(postData);
    }

    // Insert polls
    await db.insert(polls).values({
      question: "Which team do you think will win the current India vs Australia Test series?",
      options: ["India", "Australia", "Draw", "Too close to call"],
      votes: { "India": 67, "Australia": 43, "Draw": 12, "Too close to call": 28 },
      isActive: true,
      endsAt: new Date('2025-01-15T14:30:00Z')
    });

    // Insert gallery items
    const galleryData = [
      {
        title: "Championship Victory Celebration",
        description: "Team celebrating the Champions League victory",
        imageUrl: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        category: "celebration",
        matchId: null
      },
      {
        title: "Training Session",
        description: "Players during practice session",
        imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        category: "training",
        matchId: null
      }
    ];

    for (const galleryItem of galleryData) {
      await db.insert(gallery).values(galleryItem);
    }

    console.log("Database seeded successfully!");
    
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}