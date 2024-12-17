<?php
// Allow requests from any origin (You can specify a specific domain instead of '*')
header("Access-Control-Allow-Origin: *");  // Allows all origins, or specify a particular domain like 'http://example.com'

// Allow specific HTTP methods
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");  // You can add more methods if needed

// Allow specific headers
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

// Database connection
$servername = "srv1632.hstgr.io";
$username = "u143688490_user";
$password = "Kyuzumi112";
$dbname = "u143688490_bubblecart";

// Create the connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    // If connection fails, return error in JSON format
    die(json_encode(['success' => false, 'message' => 'Connection failed: ' . $conn->connect_error]));
}

// Query to get the average stock quantity from menu_items table
$query = "SELECT SUM(stock_quantity) AS avg_stock_quantity FROM menu_items";

// Execute the query
$result = $conn->query($query);

// Check if query execution is successful
if ($result) {
    // Fetch the result
    $data = $result->fetch_assoc();
    
    // Return the result as JSON
    echo json_encode(['success' => true, 'avg_stock_quantity' => round($data['avg_stock_quantity'])]);
} else {
    // If query fails, return an error in JSON format
    echo json_encode(['success' => false, 'message' => 'Query failed: ' . $conn->error]);
}

// Close the database connection
$conn->close();
?>
