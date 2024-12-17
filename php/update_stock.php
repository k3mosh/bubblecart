<?php
// update_stock.php
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

// Get the POST data
$data = json_decode(file_get_contents('php://input'), true);

if (isset($data)) {
    // Loop through the items and update stock in the database
    foreach ($data as $item) {
        $itemName = $item['itemName'];
        $quantity = $item['quantity'];

        // Assuming you have a database connection set up
        $stmt = $pdo->prepare("UPDATE menu_items SET stock_quantity = stock_quantity - :quantity WHERE name = :name");
        $stmt->execute([
            ':quantity' => $quantity,
            ':name' => $itemName
        ]);
    }

    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false]);
}
?>
