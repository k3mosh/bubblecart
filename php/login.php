<?php
// login_check.php

// Set content type to JSON
header('Content-Type: application/json');

// Get the JSON data from the request
$data = json_decode(file_get_contents('php://input'), true);

// Connect to the database (modify with your actual credentials)
include 'dbconn.php';

if ($conn->connect_error) {
    die(json_encode(['success' => false, 'message' => 'Database connection failed.']));
}

// Get the username and password from the request
$user = $data['username'];
$pass = $data['password'];

// Prepare SQL query to check if the user exists
$sql = "SELECT * FROM customer_signup WHERE username = ? AND password = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ss", $user, $pass);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    // User found, login success
    echo json_encode(['success' => true]);
} else {
    // User not found, login failed
    echo json_encode(['success' => false, 'message' => 'Invalid username or password.']);
}

$stmt->close();
$conn->close();
?>
