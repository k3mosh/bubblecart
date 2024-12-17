<?php
session_start();
include 'dbconn.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'];

    if (!isset($_SESSION['user_id'])) {
        echo json_encode(['success' => false, 'message' => 'User not logged in.']);
        exit;
    }

    $userId = $_SESSION['user_id'];

    if ($action === 'fetch') {
        // Fetch user details
        $query = "SELECT username, email, phone, barangay, street FROM users WHERE id = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("i", $userId);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows === 1) {
            $user = $result->fetch_assoc();
            echo json_encode([
                'success' => true,
                'username' => $user['username'],
                'email' => $user['email'],
                'phone' => $user['phone'],
                'barangay' => $user['barangay'],
                'street' => $user['street']
            ]);
        } else {
            echo json_encode(['success' => false, 'message' => 'User not found.']);
        }
    } elseif ($action === 'update') {
        // Get form inputs
        $username = $_POST['username'];
        $phone = $_POST['phone'];
        $barangay = $_POST['barangay'];
        $street = $_POST['street'];
        $currentPassword = $_POST['current-password'];
        $newPassword = $_POST['new-password'];
        $confirmPassword = $_POST['confirm-password'];

        // Check current password
        $passwordQuery = "SELECT password FROM users WHERE id = ?";
        $passwordStmt = $conn->prepare($passwordQuery);
        $passwordStmt->bind_param("i", $userId);
        $passwordStmt->execute();
        $passwordResult = $passwordStmt->get_result();

        if ($passwordResult->num_rows !== 1) {
            echo json_encode(['success' => false, 'message' => 'User not found.']);
            exit;
        }

        $user = $passwordResult->fetch_assoc();

        if (!password_verify($currentPassword, $user['password'])) {
            echo json_encode(['success' => false, 'message' => 'Current password is incorrect.']);
            exit;
        }

        // Validate new password
        if (!empty($newPassword)) {
            if ($newPassword !== $confirmPassword) {
                echo json_encode(['success' => false, 'message' => 'New password and confirm password do not match.']);
                exit;
            }

            // Hash the new password
            $hashedPassword = password_hash($newPassword, PASSWORD_BCRYPT);
        } else {
            $hashedPassword = $user['password']; // Keep the current password
        }

        // Update user details
        $updateQuery = "UPDATE users SET username = ?, phone = ?, barangay = ?, street = ?, password = ? WHERE id = ?";
        $updateStmt = $conn->prepare($updateQuery);
        $updateStmt->bind_param("sssssi", $username, $phone, $barangay, $street, $hashedPassword, $userId);

        if ($updateStmt->execute()) {
            // After the update, fetch the new user data and update the session
            $fetchQuery = "SELECT username, email, phone, barangay, street FROM users WHERE id = ?";
            $fetchStmt = $conn->prepare($fetchQuery);
            $fetchStmt->bind_param("i", $userId);
            $fetchStmt->execute();
            $fetchResult = $fetchStmt->get_result();
        
            if ($fetchResult->num_rows === 1) {
                $updatedUser = $fetchResult->fetch_assoc();
        
                // Update session with new values
                $_SESSION['username'] = $updatedUser['username'];
                $_SESSION['email'] = $updatedUser['email'];
                $_SESSION['phone'] = $updatedUser['phone'];
                $_SESSION['barangay'] = $updatedUser['barangay'];
                $_SESSION['street'] = $updatedUser['street'];
        
                echo json_encode(['success' => true, 'message' => 'Account updated successfully.']);
            } else {
                echo json_encode(['success' => false, 'message' => 'Failed to fetch updated user data.']);
            }
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to update account.']);
        }
        
    }
}

// Log the session user ID for debugging
error_log("Session user_id: " . (isset($_SESSION['user_id']) ? $_SESSION['user_id'] : 'Not set'));

