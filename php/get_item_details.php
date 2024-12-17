<?php
// Database connection
include "db_connect.php";

// Get the item ID from the query parameter
$itemId = isset($_GET['id']) ? $_GET['id'] : null;

if ($itemId) {
    $query = "SELECT * FROM menu_items WHERE id = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $itemId);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $item = $result->fetch_assoc();
        // Return item details as JSON
        echo json_encode([
            'id' => $item['id'],
            'name' => $item['name'],
            'image_url' => $item['image_url'],
            'description' => $item['description'],
            'price' => $item['price'] // Ensure the price is returned here
        ]);
    } else {
        echo json_encode(['error' => 'Item not found']);
    }
} else {
    echo json_encode(['error' => 'Invalid item ID']);
}

$conn->close();
?>
