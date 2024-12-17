<?php

// Allow requests from any origin
header("Access-Control-Allow-Origin: *");

// Allow specific HTTP methods (GET, POST, etc.)
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");

// Allow specific headers
header("Access-Control-Allow-Headers: Content-Type, Authorization");

include "db_connect.php";

// Start session for login tracking
session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get form data
    $username = $_POST['username'];
    $password = $_POST['password'];

    // Prevent SQL Injection
    $username = mysqli_real_escape_string($conn, $username);
    $password = mysqli_real_escape_string($conn, $password);

    // Check if the username exists in the users table
    $query = "SELECT * FROM users WHERE username = ?";
    if ($stmt = $conn->prepare($query)) {
        $stmt->bind_param('s', $username);
        $stmt->execute();
        $result = $stmt->get_result();

        // If user exists
        if ($result->num_rows > 0) {
            $user = $result->fetch_assoc();
            
            // Verify password (assuming password is hashed)
            if (password_verify($password, $user['password'])) {
                // Password is correct
                $_SESSION['user_id'] = $user['id']; // Store user session with user ID
                $_SESSION['username'] = $user['username']; // Store the username in session (optional)
                
                // You can return more data as needed (e.g., user name, email, etc.)
                echo json_encode([
                    'success' => true,
                    'message' => 'Login successful',
                    'user_id' => $user['id'],  // Returning user ID
                    'username' => $user['username'],  // You can return more user data here
                ]);
            } else {
                // Incorrect password
                echo json_encode(['success' => false, 'message' => 'Invalid password']);
            }
        } else {
            // Username not found
            echo json_encode(['success' => false, 'message' => 'Username not found']);
        }

        $stmt->close();
    } else {
        echo json_encode(['success' => false, 'message' => 'Database query failed']);
    }

    $conn->close();
}
?>
