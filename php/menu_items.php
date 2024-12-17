<?php
// Database connection
include "db_connect.php";

$query = "SELECT * FROM menu_items";
$result = $conn->query($query);

$menuItems = [];

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $menuItems[] = [
            'id' => $row['id'],
            'name' => $row['name'],
            'price' => $row['price'],
            'image' => $row['image_url'],
            'stock_quantity' => $row['stock_quantity']
        ];
    }
}

// Return JSON response
header('Content-Type: application/json');
echo json_encode($menuItems);
$conn->close();
?>
