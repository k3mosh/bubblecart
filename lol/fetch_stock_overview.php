<?php
// Include the database connection file
include 'dbconn.php';

// Query to fetch all items and their stock quantities
$query = "SELECT id, name, stock_quantity FROM menu_items";
$result = $conn->query($query);

// Check if there are any results
if ($result->num_rows > 0) {
    echo '<table style="width:100%; border-collapse:collapse;">';
    echo '<thead>
            <tr>
                <th style="border:1px solid #ddd; padding:8px;">Item Name</th>
                <th style="border:1px solid #ddd; padding:8px;">Quantity</th>
            </tr>
          </thead>';;
    echo '<tbody>';

    // Loop through each item and display it in a table row
    while ($row = $result->fetch_assoc()) {


    echo '<tr>
    <td style="border:1px solid #ddd; padding:8px;">' . htmlspecialchars($row['name']) . '</td>
    <td style="border:1px solid #ddd; padding:8px;">' . htmlspecialchars($row['stock_quantity']) . '</td>

  </tr>';
}
echo '</div>';
echo '</div>';
} else {
    // If no items are found
    echo '<p>No items available in the stock.</p>';
}

// Close the database connection
$conn->close();
?>
