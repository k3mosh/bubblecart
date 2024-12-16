<?php
// Database connection
$servername = "srv1632.hstgr.io";
$username = "u143688490_user";
$password = "Kyuzumi112";
$dbname = "u143688490_bubblecart";

$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $fname = trim($_POST['first_name']);
    $lname = trim($_POST['last_name']);
    $username = trim($_POST['username']);
    $password = trim($_POST['password']);
    $email = trim($_POST['email']);
    $phone = trim($_POST['phone']);
    $barangay = trim($_POST['barangay']);
    $street = trim($_POST['street']);

    // Validate required fields
    if (empty($username) || empty($password) || empty($email)) {
        echo json_encode(['success' => false, 'message' => 'All required fields must be filled out.']);
        exit;
    }

    // Validate email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['success' => false, 'message' => 'Invalid email format.']);
        exit;
    }

    // Hash password
    $hashedPassword = password_hash($password, PASSWORD_ARGON2ID);

    try {
        // Check if username or email already exists
        $stmt = $conn->prepare("SELECT username, email FROM users WHERE username = ? OR email = ?");
        $stmt->bind_param("ss", $username, $email);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            echo json_encode(['success' => false, 'message' => 'Username or email already exists.']);
            $stmt->close();
            $conn->close();
            exit;
        }

        // Insert new user
        $stmt = $conn->prepare("INSERT INTO users (first_name, last_name, username, password, email, phone, barangay, street) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("ssssssss", $fname, $lname, $username, $hashedPassword, $email, $phone, $barangay, $street);

        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Account created successfully.']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to create account.']);
        }
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => 'An error occurred. Please try again later.']);
    }

    $stmt->close();
    $conn->close();
}
?>
