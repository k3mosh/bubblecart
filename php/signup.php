<?php
include 'dbconn.php';

// Check if the form is submitted
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Get form data and sanitize inputs
    $firstName = $conn->real_escape_string($_POST['first_name']);
    $lastName = $conn->real_escape_string($_POST['last_name']);
    $email = $conn->real_escape_string($_POST['email']);
    $phone = $conn->real_escape_string($_POST['phone']);
    $barangay = $conn->real_escape_string($_POST['barangay']);
    $street = $conn->real_escape_string($_POST['street']);
    $username = $conn->real_escape_string($_POST['username']);
    $password = $_POST['password']; // Password should not be escaped

    // Validate if all required fields are filled
    if (empty($firstName) || empty($lastName) || empty($email) || empty($phone) || empty($barangay) || empty($street) || empty($username) || empty($password)) {
        echo "All fields are required!";
        exit;
    }

    // Check if email or username already exists
    $checkUser = $conn->prepare("SELECT * FROM customer_signup WHERE email = ? OR username = ?");
    $checkUser->bind_param("ss", $email, $username);
    $checkUser->execute();
    $result = $checkUser->get_result();

    if ($result->num_rows > 0) {
        echo "Email or Username already exists!";
        exit;
    }

    // Hash the password
    $passwordHash = password_hash($password, PASSWORD_BCRYPT);

    // Prepare and execute the SQL insert query
    $stmt = $conn->prepare("INSERT INTO customer_signup (first_name, last_name, email, phone, barangay, street, username, password_hash) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("ssssssss", $firstName, $lastName, $email, $phone, $barangay, $street, $username, $passwordHash);

    if ($stmt->execute()) {
        echo "Signup successful!";
    } else {
        echo "Error: " . $stmt->error;
    }

    // Close statements and connection
    $stmt->close();
    $checkUser->close();
    $conn->close();
}
?>
