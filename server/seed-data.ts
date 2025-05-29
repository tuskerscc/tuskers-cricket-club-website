import { db } from "./db";
import { 
  teams, players, venues, competitions, matches, playerStats, 
  articles, socialPosts, polls, gallery, triviaQuestions 
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
        matchDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
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
        homeTeamId: lightningTeam.id,
        awayTeamId: tuskersTeam.id,
        venueId: homeVenue.id,
        competitionId: premierLeague.id,
        matchDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
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
        matchDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
        status: 'completed',
        homeTeamScore: '245/6',
        awayTeamScore: '187/9',
        homeTeamOvers: '50.0',
        awayTeamOvers: '45.2',
        result: 'Tuskers CC won by 58 runs',
        playerOfMatch: insertedPlayers[0].id,
        isLive: false,
        liveData: null
      },
      {
        homeTeamId: thunderTeam.id,
        awayTeamId: tuskersTeam.id,
        venueId: homeVenue.id,
        competitionId: championsLeague.id,
        matchDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
        status: 'completed',
        homeTeamScore: '198/8',
        awayTeamScore: '201/4',
        homeTeamOvers: '50.0',
        awayTeamOvers: '48.3',
        result: 'Tuskers CC won by 6 wickets',
        playerOfMatch: insertedPlayers[1].id,
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

    // Insert trivia questions
    const triviaQuestionsData = [
      {
        question: "Who holds the record for the highest individual score in Test cricket?",
        options: ["Brian Lara", "Matthew Hayden", "Don Bradman", "Virender Sehwag"],
        correct: "Brian Lara",
        difficulty: "medium",
        category: "Records",
        points: 15
      },
      {
        question: "Which country won the first Cricket World Cup in 1975?",
        options: ["Australia", "West Indies", "England", "India"],
        correct: "West Indies",
        difficulty: "easy",
        category: "World Cup",
        points: 10
      },
      {
        question: "What is the maximum number of overs a bowler can bowl in a One Day International?",
        options: ["8", "10", "12", "15"],
        correct: "10",
        difficulty: "easy",
        category: "Rules",
        points: 10
      },
      {
        question: "Who is known as the 'Captain Cool' in cricket?",
        options: ["Virat Kohli", "MS Dhoni", "Rohit Sharma", "Kane Williamson"],
        correct: "MS Dhoni",
        difficulty: "easy",
        category: "Players",
        points: 10
      },
      {
        question: "Which venue is known as the 'Home of Cricket'?",
        options: ["MCG", "Lord's", "The Oval", "Eden Gardens"],
        correct: "Lord's",
        difficulty: "medium",
        category: "Venues",
        points: 15
      },
      {
        question: "What does LBW stand for in cricket?",
        options: ["Leg Before Wicket", "Left Behind Wicket", "Last Ball Win", "Low Ball Wide"],
        correct: "Leg Before Wicket",
        difficulty: "easy",
        category: "Rules",
        points: 10
      },
      {
        question: "Who has taken the most wickets in Test cricket history?",
        options: ["Shane Warne", "Muttiah Muralitharan", "Anil Kumble", "Glenn McGrath"],
        correct: "Muttiah Muralitharan",
        difficulty: "medium",
        category: "Records",
        points: 15
      },
      {
        question: "In which year was the first T20 World Cup held?",
        options: ["2005", "2007", "2009", "2010"],
        correct: "2007",
        difficulty: "medium",
        category: "T20",
        points: 15
      },
      {
        question: "What is the fastest recorded ball in cricket history?",
        options: ["161.3 km/h", "157.7 km/h", "155.9 km/h", "159.1 km/h"],
        correct: "161.3 km/h",
        difficulty: "hard",
        category: "Records",
        points: 20
      },
      {
        question: "Which team has won the most Cricket World Cups?",
        options: ["Australia", "West Indies", "India", "England"],
        correct: "Australia",
        difficulty: "medium",
        category: "World Cup",
        points: 15
      },
      {
        question: "Who scored the fastest century in ODI cricket?",
        options: ["AB de Villiers", "Corey Anderson", "Shahid Afridi", "Chris Gayle"],
        correct: "AB de Villiers",
        difficulty: "medium",
        category: "Records",
        points: 15
      },
      {
        question: "What is the term for scoring 100 runs in cricket?",
        options: ["Century", "Double", "Ton", "Hundred"],
        correct: "Century",
        difficulty: "easy",
        category: "Terms",
        points: 10
      },
      {
        question: "Which format of cricket has the most overs per innings?",
        options: ["T20", "ODI", "Test", "The Hundred"],
        correct: "Test",
        difficulty: "easy",
        category: "Formats",
        points: 10
      },
      {
        question: "Who is the leading run scorer in international cricket?",
        options: ["Sachin Tendulkar", "Virat Kohli", "Ricky Ponting", "Kumar Sangakkara"],
        correct: "Sachin Tendulkar",
        difficulty: "medium",
        category: "Records",
        points: 15
      },
      {
        question: "What is the term for dismissing a batsman on the first ball they face?",
        options: ["Golden Duck", "Silver Duck", "Diamond Duck", "Platinum Duck"],
        correct: "Golden Duck",
        difficulty: "medium",
        category: "Terms",
        points: 15
      }
    ];

    for (const triviaQuestion of triviaQuestionsData) {
      await db.insert(triviaQuestions).values(triviaQuestion);
    }

    console.log("Database seeded successfully!");
    
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}