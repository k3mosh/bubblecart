<?php
include 'dbconn.php';

// Fetch all menu items
$query = "SELECT id, name, price, description, image_url FROM menu_items";
$result = $conn->query($query);

if ($result->num_rows > 0) {
    echo "<table style='width:100%; border-collapse:collapse;' border='1'>";
    echo "<thead>";
    echo "<tr>";
    echo "<th>Image</th>";
    echo "<th>Name</th>";
    echo "<th>Price</th>";
    echo "<th>Description</th>";
    echo "</tr>";
    echo "</thead>";
    echo "<tbody>";
    
    while ($row = $result->fetch_assoc()) {
        echo "<tr>";
        echo "<td><img src='" . htmlspecialchars($row['image_url']) . "' alt='Item Image' style='width:100px; height:100px;'></td>";
        echo "<td>" . htmlspecialchars($row['name']) . "</td>";
        echo "<td>" . htmlspecialchars($row['price']) . "</td>";
        echo "<td>" . htmlspecialchars($row['description']) . "</td>";
        echo "</tr>";
    }
    
    echo "</tbody>";
    echo "</table>";
} else {
    echo "<p>No items in the menu currently.</p>";
}

$conn->close();
?>
