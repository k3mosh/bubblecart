<?php
session_start();
include 'dbconn.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $_POST['username'];
    $password = $_POST['password'];

    $stmt = $conn->prepare("SELECT * FROM admins WHERE username = ? AND password = ?");
    $stmt->bind_param("ss", $username, $password);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 1) {
        // Successful login
        $_SESSION['admin_logged_in'] = true;
        echo json_encode(['success' => true]);
    } else {
        // Failed login
        echo json_encode(['success' => false, 'message' => 'Invalid username or password']);
    }

    $stmt->close();
    $conn->close();
}
?>
