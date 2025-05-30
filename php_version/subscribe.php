<?php
require_once 'includes/functions.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

$email = sanitizeInput($_POST['email'] ?? '');

if (empty($email)) {
    echo json_encode(['success' => false, 'message' => 'Email is required']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Invalid email format']);
    exit;
}

try {
    $conn = getConnection();
    
    // Check if email already exists
    $check_query = "SELECT email FROM newsletter_subscribers WHERE email = :email";
    $check_stmt = $conn->prepare($check_query);
    $check_stmt->bindParam(':email', $email);
    $check_stmt->execute();
    
    if ($check_stmt->fetch()) {
        echo json_encode(['success' => false, 'message' => 'Email already subscribed']);
        exit;
    }
    
    // Insert new subscriber
    $insert_query = "INSERT INTO newsletter_subscribers (email, subscribed_at) VALUES (:email, NOW())";
    $insert_stmt = $conn->prepare($insert_query);
    $insert_stmt->bindParam(':email', $email);
    
    if ($insert_stmt->execute()) {
        // Send confirmation email to tuskerscckandy@gmail.com
        $subject = "New Newsletter Subscription - TUSKERS CRICKET CLUB";
        $message = "A new subscriber has joined the TUSKERS CRICKET CLUB newsletter.\n\n";
        $message .= "Email: " . $email . "\n";
        $message .= "Subscription Date: " . date('Y-m-d H:i:s') . "\n\n";
        $message .= "Best regards,\nTUSKERS CRICKET CLUB Website";
        
        $headers = "From: noreply@tuskerscc.com\r\n";
        $headers .= "Reply-To: tuskerscckandy@gmail.com\r\n";
        $headers .= "X-Mailer: PHP/" . phpversion();
        
        // Send notification email
        mail('tuskerscckandy@gmail.com', $subject, $message, $headers);
        
        echo json_encode(['success' => true, 'message' => 'Successfully subscribed to newsletter']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to subscribe']);
    }
    
} catch (Exception $e) {
    error_log("Newsletter subscription error: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'An error occurred while processing your subscription']);
}
?>