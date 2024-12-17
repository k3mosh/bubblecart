<?php
// Ensure you have started a session for logged-in users
session_start();

// Database connection
include 'dbconn.php';

// Check if the user is logged in
if (isset($_SESSION['user_id'])) {
    $userId = $_SESSION['user_id'];

    // Query to fetch user details
    $sql = "SELECT username, phone, CONCAT(barangay, ', ', street) AS address FROM users WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();
        echo json_encode($user);
    } else {
        echo json_encode(['error' => 'User details not found.']);
    }

    $stmt->close();
} else {
    echo json_encode(['error' => 'User not logged in.']);
}

$conn->close();
?>
