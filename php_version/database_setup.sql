-- TUSKERS CRICKET CLUB Database Setup for MySQL
-- Run this in phpMyAdmin or MySQL command line

-- Create database
CREATE DATABASE IF NOT EXISTS tuskers_cricket;
USE tuskers_cricket;

-- Players table
CREATE TABLE players (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    jersey_number INT UNIQUE,
    role VARCHAR(50),
    batting_style VARCHAR(50),
    bowling_style VARCHAR(50),
    bio TEXT,
    photo VARCHAR(255),
    is_captain BOOLEAN DEFAULT FALSE,
    is_vice_captain BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Player statistics table
CREATE TABLE player_stats (
    id INT AUTO_INCREMENT PRIMARY KEY,
    player_id INT,
    runs_scored INT DEFAULT 0,
    wickets_taken INT DEFAULT 0,
    matches INT DEFAULT 0,
    balls_faced INT DEFAULT 0,
    fours INT DEFAULT 0,
    sixes INT DEFAULT 0,
    balls_bowled INT DEFAULT 0,
    runs_conceded INT DEFAULT 0,
    catches INT DEFAULT 0,
    stumpings INT DEFAULT 0,
    run_outs INT DEFAULT 0,
    FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE
);

-- Articles table
CREATE TABLE articles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    image_url VARCHAR(255),
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Gallery table
CREATE TABLE gallery (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_url VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Team match statistics table
CREATE TABLE team_match_stats (
    id INT AUTO_INCREMENT PRIMARY KEY,
    match_date DATE,
    opponent VARCHAR(100),
    match_result ENUM('won', 'lost', 'draw', 'no_result') DEFAULT 'no_result',
    total_runs INT DEFAULT 0,
    wickets_taken INT DEFAULT 0,
    total_overs DECIMAL(4,1) DEFAULT 0,
    runs_against INT DEFAULT 0,
    overs_against DECIMAL(4,1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Newsletter subscribers table
CREATE TABLE newsletter_subscribers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample players
INSERT INTO players (name, jersey_number, role, batting_style, bowling_style, bio, is_captain, is_vice_captain) VALUES
('Abilashan', 1, 'Wicket Keeper Batsman', 'Right-handed', NULL, 'Experienced wicket keeper with excellent batting skills', FALSE, FALSE),
('Amalan', 2, 'All Rounder', 'Right-handed', 'Right-arm medium', 'Versatile all-rounder contributing in all departments', FALSE, FALSE),
('Akalanka', 3, 'Opening Batsman', 'Right-handed', NULL, 'Aggressive opening batsman known for quick starts', FALSE, FALSE),
('Dulmina', 4, 'Batsman', 'Left-handed', NULL, 'Stylish left-handed batsman with solid technique', FALSE, FALSE),
('Dinuka', 5, 'Captain & All Rounder', 'Right-handed', 'Right-arm medium', 'Dynamic captain leading from the front', TRUE, FALSE),
('Chathura', 6, 'Bowler', 'Right-handed', 'Right-arm fast', 'Fast bowler with excellent pace and accuracy', FALSE, FALSE),
('Damith', 7, 'All Rounder', 'Right-handed', 'Right-arm off-spin', 'Reliable all-rounder with good bowling variations', FALSE, FALSE),
('Denuka', 8, 'Vice Captain & Batsman', 'Right-handed', NULL, 'Experienced batsman and strategic vice captain', FALSE, TRUE);

-- Insert player statistics
INSERT INTO player_stats (player_id, runs_scored, wickets_taken, matches, balls_faced, fours, sixes, balls_bowled, runs_conceded, catches) VALUES
(1, 245, 0, 8, 156, 28, 4, 0, 0, 12),
(2, 189, 15, 8, 134, 22, 2, 240, 198, 6),
(3, 167, 0, 7, 98, 19, 8, 0, 0, 4),
(4, 134, 0, 6, 102, 16, 1, 0, 0, 3),
(5, 198, 12, 8, 145, 21, 3, 180, 156, 5),
(6, 45, 22, 8, 32, 4, 1, 288, 234, 2),
(7, 78, 18, 7, 67, 8, 0, 216, 189, 4),
(8, 156, 0, 7, 118, 18, 2, 0, 0, 6);

-- Insert sample articles
INSERT INTO articles (title, content, is_featured) VALUES
('TATA IPL 2025, Qualifier 1: RCB vs KKR Match Preview', 'The excitement builds as Royal Challengers Bangalore takes on Kolkata Knight Riders in the first qualifier of TATA IPL 2025. Both teams have shown exceptional form throughout the season and are set for an epic clash at the Eden Gardens.', TRUE),
('TUSKERS CRICKET CLUB Wins Local Championship', 'In a thrilling final match, TUSKERS CRICKET CLUB secured victory in the local championship with an outstanding performance by the entire team. Captain Dinuka led from the front with both bat and ball.', TRUE),
('New Training Facilities Inaugurated', 'TUSKERS CRICKET CLUB proudly announces the inauguration of new state-of-the-art training facilities. The new complex includes modern nets, fitness center, and analysis rooms to enhance player development.', FALSE);

-- Insert sample gallery items
INSERT INTO gallery (title, description, image_url) VALUES
('Training Session', 'Players during an intensive training session', '/assets/images/training1.jpg'),
('Victory Celebration', 'Team celebrating championship victory', '/assets/images/celebration1.jpg'),
('Team Photo 2024', 'Official team photograph for 2024 season', '/assets/images/team2024.jpg'),
('Practice Match', 'Action shots from a practice match', '/assets/images/practice1.jpg');

-- Insert sample team match statistics
INSERT INTO team_match_stats (match_date, opponent, match_result, total_runs, wickets_taken, total_overs, runs_against, overs_against) VALUES
('2024-01-15', 'City Warriors', 'won', 178, 8, 19.4, 156, 20.0),
('2024-01-22', 'Metro Lions', 'lost', 145, 6, 20.0, 167, 18.2),
('2024-01-29', 'Valley Tigers', 'won', 189, 10, 18.5, 134, 20.0);