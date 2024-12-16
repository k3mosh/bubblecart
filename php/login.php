<?php
// login_check.php

// Set content type to JSON
header('Content-Type: application/json');

// Get the POST data
$username = $_POST['username'];
$password = $_POST['password'];

// Connect to the database (modify with your actual credentials)
include 'dbconn.php';

if ($conn->connect_error) {
    die(json_encode(['success' => false, 'message' => 'Database connection failed.']));
}

// Query to fetch user details
$query = "SELECT id, username, email, password, phone, CONCAT(barangay, ', ', street) AS address 
          FROM customer_signup 
          WHERE username = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 1) {
    $user = $result->fetch_assoc();

    // Check if the password matches
    if (password_verify($password, $user['password'])) {
        // Store in session
        session_start();
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['username'] = $user['username'];
        $_SESSION['phone'] = $user['phone'] ?: 'Not available'; // Default if phone is empty
        $_SESSION['address'] = $user['address'];

        // Send a success response with the necessary user data
        echo json_encode([
            'success' => true,
            'username' => $user['username'],
            'phone' => $user['phone'] ?: 'Not available', // Ensure phone is returned
            'address' => $user['address']
        ]);
    } else {
        // Invalid password
        echo json_encode(['success' => false, 'message' => 'Invalid password.']);
    }
} else {
    // User not found
    echo json_encode(['success' => false, 'message' => 'User not found.']);
}
