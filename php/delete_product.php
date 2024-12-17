<?php
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
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['id'])) {
        $itemId = $_POST['id'];

        // Prepare the DELETE SQL statement
        $query = "DELETE FROM menu_items WHERE id = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("i", $itemId); // 'i' indicates the itemId is an integer

        if ($stmt->execute()) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'error' => 'Failed to delete product.']);
        }
    } else {
        echo json_encode(['success' => false, 'error' => 'Product ID is missing.']);
    }
} else {
    echo json_encode(['success' => false, 'error' => 'Invalid request method.']);
}

?>
