<?php
// Return JSON format
header("Content-Type: application/json");

// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Allow requests from any origin
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

// Start the session
session_start();

// Database connection settings
$host = "srv1632.hstgr.io";
$user = "u143688490_user";
$password = "Kyuzumi112";
$dbname = "u143688490_bubblecart";

try {
    // Get the raw POST data
    $data = json_decode(file_get_contents("php://input"), true); // Decode the JSON request body

    // Check if user_id is provided
    if (!isset($data['user_id'])) {
        echo json_encode(["error" => "No user ID provided"]);
        exit();
    }

    $userId = intval($data['user_id']); // Sanitize input to prevent SQL injection

    // Establish database connection using PDO
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $user, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Prepare and execute the query to fetch user data
    $stmt = $pdo->prepare("SELECT username, phone, barangay, street FROM users WHERE id = ?");
    $stmt->execute([$userId]);

    // Fetch user data
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    // Return the data as JSON
    if ($user) {
        echo json_encode($user);
    } else {
        echo json_encode(["error" => "User not found"]);
    }
} catch (PDOException $e) {
    // Return JSON error message
    echo json_encode(["error" => "Database error: " . $e->getMessage()]);
    exit();
}
?>
