<?php
// Allow requests from any origin
header("Access-Control-Allow-Origin: *");  // Allows all origins, or specify a particular domain like 'http://example.com'

// Allow specific HTTP methods
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");  // You can add more methods if needed

// Allow specific headers
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

// Start the session
session_start();

// Database connection
$servername = "srv1632.hstgr.io";
$username = "u143688490_user";
$password = "Kyuzumi112";
$dbname = "u143688490_bubblecart";

// Create the connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check the connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Check if user ID is set in the session
if (isset($_SESSION['user_id'])) {
    $user_id = $_SESSION['user_id'];  // Assuming user ID is stored in session

    // Prepare the query to fetch user data
    $query = "SELECT 
                    CONCAT(first_name, ' ', last_name) AS name,
                    username, 
                    email, 
                    phone, 
                    CONCAT(street, ', ', barangay) AS address 
              FROM users
              WHERE id = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $stmt->bind_result($name, $username, $email, $phone, $address);
    
    // Fetch the result
    if ($stmt->fetch()) {
        // Return the data as a JSON response
        echo json_encode([
            'full_name' => $name,
            'username' => $username,
            'email' => $email,
            'phone' => $phone,
            'address' => $address
        ]);
    } else {
        // Handle the case where no user is found
        echo json_encode(['error' => 'User not found']);
    }

    $stmt->close();
} else {
    // Handle the case where the session is not set or user is not logged in
    echo json_encode(['error' => 'User not logged in']);
}

// Close the connection
$conn->close();
?>
