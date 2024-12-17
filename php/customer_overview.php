<?php
// Include the database connection file
include('db_connect.php');

// Query to fetch all items and their stock quantities
$query = "
    SELECT 
        CONCAT(first_name, ' ', last_name) AS name,
        id, 
        username, 
        email, 
        phone, 
        CONCAT(street, ', ', barangay) AS address 
        
    FROM users
";

$result = $conn->query($query);

// Initialize an array to store the items
$items = array();

// Check if there are any results
if ($result->num_rows > 0) {
    // Fetch all items and add them to the array
    while ($row = $result->fetch_assoc()) {
        $items[] = $row;
    }
    
    // Return the items as JSON
    echo json_encode($items);
} else {
    // If no items are found, return an empty array
    echo json_encode([]);
}

// Close the database connection
$conn->close();
?>
