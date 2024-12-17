<?php
include 'dbconn.php';

$query = "SELECT * FROM menu_items";
$result = $conn->query($query);

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $stockStatus = ($row['stock_quantity'] > 0) ? "" : "out-of-stock";
        $itemId = htmlspecialchars($row['id']);
        $itemName = htmlspecialchars($row['name']);
        $itemPrice = htmlspecialchars(number_format($row['price']));
        $itemImage = htmlspecialchars($row['image_url']);

        // Check if the item is out of stock
        if ($row['stock_quantity'] > 0) {
            echo "<a href='customize.html?id=$itemId' class='flavor-link'>
                    <div class='flavor-card' data-id='$itemId'>
                    <p>$itemName</p>
                        <div class='price-tag'>₱$itemPrice</div>
                        <img src='$itemImage' alt='$itemName'>
                        

                    </div>
                  </a>";
        } else {
            echo "<div class='flavor-card out-of-stock' data-id='$itemId'>
            <p>$itemName</p>
                    <div class='price-tag'>₱$itemPrice</div>
                    <img src='$itemImage' alt='$itemName'>
                    
                    <p class='out-of-stock-text'>Out of Stock</p>
                  </div>";
        }
    }
} else {
    echo "<p>No items available.</p>";
}

$conn->close();
?>
