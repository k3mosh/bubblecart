<?php
include 'dbconn.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username']);
    $password = trim($_POST['password']);
    $email = trim($_POST['email']);
    $phone = trim($_POST['phone']);
    $barangay = trim($_POST['barangay']);
    $street = trim($_POST['street']);

    if (empty($username) || empty($password) || empty($email)) {
        echo json_encode(['success' => false, 'message' => 'All required fields must be filled out.']);
        exit;
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['success' => false, 'message' => 'Invalid email format.']);
        exit;
    }

    $hashedPassword = password_hash($password, PASSWORD_ARGON2ID);

    try {
        $stmt = $conn->prepare("SELECT username, email FROM users WHERE username = ? OR email = ?");
        $stmt->bind_param("ss", $username, $email);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            echo json_encode(['success' => false, 'message' => 'Username or email already exists.']);
            exit;
        }

        $stmt = $conn->prepare("INSERT INTO users (username, password, email, phone, barangay, street) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("ssssss", $username, $hashedPassword, $email, $phone, $barangay, $street);

        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Account created successfully.']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to create account.']);
        }
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => 'An error occurred. Please try again later.']);
    }
}
?>
