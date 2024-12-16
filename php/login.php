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
$username = $_POST['username'];
$password = $_POST['password'];

$query = "SELECT id, username, email, password, phone, CONCAT(barangay, ', ', street) AS address 
          FROM customer_signup 
          WHERE username = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 1) {
    $user = $result->fetch_assoc();

    // Ensure phone is set or default to 'Not available'
    $phone = $user['phone'] ?: 'Not available'; // If phone is null, set 'Not available'

    // Store in session
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['username'] = $user['username'];
    $_SESSION['phone'] = $phone;
    $_SESSION['address'] = $user['address'];

    // Send a response with the necessary user data
    echo json_encode([
        'success' => true,
        'username' => $user['username'],
        'phone' => $phone, // Ensure phone is returned
        'address' => $user['address']
    ]);
} else {
    echo json_encode(['success' => false, 'message' => 'User not found.']);
}

