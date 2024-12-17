<?php

// Assuming a database connection is established
session_start();
// Allow requests from any origin
header("Access-Control-Allow-Origin: *");

// Allow specific HTTP methods (GET, POST, etc.)
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");

// Allow specific headers
header("Access-Control-Allow-Headers: Content-Type, Authorization");

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

// Get the POST data
$product_name = $_POST['name'];
$item_price = $_POST['price'];
$description = $_POST['description'];
$itemId = $_POST['id']; // Get the product ID from POST data

// Prepare the SQL statement to update the product
$query = "UPDATE menu_items SET name = ?, price = ?, description = ? WHERE id = ?";
$stmt = $conn->prepare($query);  // Use $conn here instead of $db
$stmt->bind_param('sdsi', $product_name, $item_price, $description, $itemId); // Corrected variable names

// Execute the statement
if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => 'Database error']);
}

// Close the statement and connection
$stmt->close();
$conn->close();  // Close the connection
?>
