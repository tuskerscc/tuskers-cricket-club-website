<?php
require_once 'config/database.php';

// Database helper functions
function getConnection() {
    $database = new Database();
    return $database->getConnection();
}

// Player functions
function getPlayers() {
    $conn = getConnection();
    $query = "SELECT p.*, ps.runs_scored, ps.wickets_taken, ps.matches 
              FROM players p 
              LEFT JOIN player_stats ps ON p.id = ps.player_id 
              ORDER BY p.jersey_number ASC";
    $stmt = $conn->prepare($query);
    $stmt->execute();
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function getPlayer($id) {
    $conn = getConnection();
    $query = "SELECT p.*, ps.* 
              FROM players p 
              LEFT JOIN player_stats ps ON p.id = ps.player_id 
              WHERE p.id = :id";
    $stmt = $conn->prepare($query);
    $stmt->bindParam(':id', $id);
    $stmt->execute();
    return $stmt->fetch(PDO::FETCH_ASSOC);
}

function addPlayer($data) {
    $conn = getConnection();
    $query = "INSERT INTO players (name, jersey_number, role, batting_style, bowling_style, bio, photo, is_captain, is_vice_captain, is_active) 
              VALUES (:name, :jersey_number, :role, :batting_style, :bowling_style, :bio, :photo, :is_captain, :is_vice_captain, :is_active)";
    $stmt = $conn->prepare($query);
    return $stmt->execute($data);
}

// Articles functions
function getArticles($limit = null) {
    $conn = getConnection();
    $query = "SELECT * FROM articles ORDER BY created_at DESC";
    if ($limit) {
        $query .= " LIMIT :limit";
    }
    $stmt = $conn->prepare($query);
    if ($limit) {
        $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
    }
    $stmt->execute();
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function getArticle($id) {
    $conn = getConnection();
    $query = "SELECT * FROM articles WHERE id = :id";
    $stmt = $conn->prepare($query);
    $stmt->bindParam(':id', $id);
    $stmt->execute();
    return $stmt->fetch(PDO::FETCH_ASSOC);
}

function getFeaturedArticles() {
    $conn = getConnection();
    $query = "SELECT * FROM articles WHERE is_featured = true ORDER BY created_at DESC LIMIT 3";
    $stmt = $conn->prepare($query);
    $stmt->execute();
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

// Team stats functions
function getTeamStats() {
    $conn = getConnection();
    $query = "SELECT 
                SUM(CASE WHEN match_result = 'won' THEN 1 ELSE 0 END) as matches_won,
                COUNT(*) as total_matches,
                SUM(total_runs) as total_runs,
                SUM(wickets_taken) as wickets_taken,
                SUM(total_overs) as total_overs,
                SUM(runs_against) as runs_against,
                SUM(overs_against) as overs_against
              FROM team_match_stats";
    $stmt = $conn->prepare($query);
    $stmt->execute();
    $stats = $stmt->fetch(PDO::FETCH_ASSOC);
    
    // Calculate NRR
    $nrr = 0;
    if ($stats['total_overs'] > 0 && $stats['overs_against'] > 0) {
        $run_rate = $stats['total_runs'] / $stats['total_overs'];
        $run_rate_against = $stats['runs_against'] / $stats['overs_against'];
        $nrr = $run_rate - $run_rate_against;
    }
    
    $stats['nrr'] = round($nrr, 2);
    $stats['win_percentage'] = $stats['total_matches'] > 0 ? 
        round(($stats['matches_won'] / $stats['total_matches']) * 100, 1) : 0;
    
    return $stats;
}

// Gallery functions
function getGalleryItems() {
    $conn = getConnection();
    $query = "SELECT * FROM gallery ORDER BY created_at DESC";
    $stmt = $conn->prepare($query);
    $stmt->execute();
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

// Utility functions
function sanitizeInput($data) {
    return htmlspecialchars(strip_tags(trim($data)));
}

function formatDate($date) {
    return date('F j, Y', strtotime($date));
}

function formatDateTime($datetime) {
    return date('F j, Y g:i A', strtotime($datetime));
}

// Session functions
function startSession() {
    if (session_status() == PHP_SESSION_NONE) {
        session_start();
    }
}

function isLoggedIn() {
    startSession();
    return isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true;
}

function requireLogin() {
    if (!isLoggedIn()) {
        header('Location: admin/login.php');
        exit();
    }
}

function login($username, $password) {
    // Simple authentication - in production, use proper password hashing
    if ($username === 'admin' && $password === 'tuskers2024') {
        startSession();
        $_SESSION['admin_logged_in'] = true;
        $_SESSION['username'] = $username;
        return true;
    }
    return false;
}

function logout() {
    startSession();
    session_destroy();
}
?>