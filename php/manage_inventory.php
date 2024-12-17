<?php
// Assuming you have a connection to your database
include('db_connect.php');

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $item_id = $_POST['item_id'];
    $item_stock = $_POST['item_stock'];

    if (isset($_POST['update-stock'])) {
        // Update the stock quantity for the selected item
        $query = "UPDATE menu_items SET stock_quantity = ? WHERE id = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param('ii', $item_stock, $item_id);
        $stmt->execute();
    
        if ($stmt->affected_rows > 0) {
            echo json_encode(['success' => true, 'message' => 'Stock updated successfully']);
            // Redirect to another HTML page after successful update
            
            header("Location: /admin_inventory.html");
            exit();
        } else {
            echo json_encode(['success' => false, 'error' => 'Database error']);
        }
        
    }
    
    if (isset($_POST['add-stock'])) {
        // Add the stock quantity to the current stock
        $query = "UPDATE menu_items SET stock_quantity = stock_quantity + ? WHERE id = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param('ii', $item_stock, $item_id);
        $stmt->execute();
    
        if ($stmt->affected_rows > 0) {
            header("Location: /admin_inventory.html");
            echo json_encode(['success' => true, 'message' => 'Stock added successfully']);
        } else {
            echo json_encode(['success' => false, 'error' => 'Database error']);
        }
    }
}
?>
