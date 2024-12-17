<?php
// Assuming you have a connection to your database
include('dbconn.php');

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
            echo "Stock updated successfully!";
        } else {
            echo "Failed to update stock.";
        }
    }

    if (isset($_POST['add-stock'])) {
        // Add the stock quantity to the current stock
        $query = "UPDATE menu_items SET stock_quantity = stock_quantity + ? WHERE id = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param('ii', $item_stock, $item_id);
        $stmt->execute();

        if ($stmt->affected_rows > 0) {
            echo "Stock added successfully!";
        } else {
            echo "Failed to add stock.";
        }
    }
}
?>
