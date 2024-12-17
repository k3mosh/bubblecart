<?php
header("Content-Type: application/json");
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

session_start();

$host = "srv1632.hstgr.io";
$user = "u143688490_user";
$password = "Kyuzumi112";
$dbname = "u143688490_bubblecart";

// Create connection
$conn = new mysqli($host, $user, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    echo json_encode(["error" => "Database connection failed: " . $conn->connect_error]);
    exit();
}

// Get the raw POST data
$data = json_decode(file_get_contents("php://input"), true); // Decode the JSON request body

if (!isset($data['user_id'], $data['username'], $data['phone'], $data['barangay'], $data['street'])) {
    echo json_encode(["error" => "Missing required fields"]);
    exit();
}

$userId = intval($data['user_id']);
$username = $data['username'];
$phone = $data['phone'];
$barangay = $data['barangay'];
$street = $data['street'];

// Check if the user exists before attempting to update
$checkStmt = $conn->prepare("SELECT COUNT(*) FROM users WHERE id = ?");
$checkStmt->bind_param("i", $userId);
$checkStmt->execute();
$checkStmt->bind_result($userExists);
$checkStmt->fetch();
$checkStmt->close();

if ($userExists == 0) {
    echo json_encode(["error" => "User not found"]);
    exit();
}

// Prepare and execute the update query
$stmt = $conn->prepare("UPDATE users SET username = ?, phone = ?, barangay = ?, street = ? WHERE id = ?");
$stmt->bind_param("ssssi", $username, $phone, $barangay, $street, $userId);
$stmt->execute();

// Check if any rows were affected
if ($stmt->affected_rows > 0) {
    echo json_encode(["success" => "User data updated successfully"]);
} else {
    echo json_encode(["error" => "Failed to update user data or no changes made"]);
}

$stmt->close();
$conn->close();
?>
