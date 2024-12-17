<?php
session_start();
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
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

if (isset($_GET['id'])) {
    $itemId = $_GET['id'];

    // Prepare and execute query to fetch the item data using MySQLi
    $stmt = $conn->prepare("SELECT * FROM menu_items WHERE id = ?");
    $stmt->bind_param("i", $itemId); // Bind the ID parameter as integer
    $stmt->execute();

    // Get the result
    $result = $stmt->get_result();

    // Fetch the item data
    if ($item = $result->fetch_assoc()) {
        echo json_encode($item); // Return the item data as JSON
    } else {
        echo json_encode([]); // If no item is found, return an empty array
    }

    // Close the statement and connection
    $stmt->close();
    $conn->close();
} else {
    echo json_encode([]); // If no ID is provided, return an empty array
}
?>
