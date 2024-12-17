<?php
// edit_menu_item.php

// Include your database connection file
include('dbconn.php');

if (isset($_POST['submit'])) {
    // Get the item ID and new price from the form
    $item_id = $_POST['item_id'];
    $new_price = $_POST['item_price'];

    // Check if the values are valid
    if (!empty($item_id) && !empty($new_price) && is_numeric($new_price)) {
        // Prepare the SQL query to update the price
        $sql = "UPDATE menu_items SET item_price = ? WHERE id = ?";

        // Prepare and bind the statement
        if ($stmt = $conn->prepare($sql)) {
            // Bind the parameters
            $stmt->bind_param("di", $new_price, $item_id);

            // Execute the query
            if ($stmt->execute()) {
                // If successful, redirect or display a success message
                echo "<script>alert('Price updated successfully!'); window.location.href = 'admin_dashboard.php';</script>";
            } else {
                // If the query fails, display an error message
                echo "<script>alert('Error updating price. Please try again.');</script>";
            }

            // Close the statement
            $stmt->close();
        } else {
            echo "<script>alert('Error preparing query.');</script>";
        }
    } else {
        echo "<script>alert('Invalid input. Please enter a valid price.');</script>";
    }
}

// Close the database connection
$conn->close();
?>
