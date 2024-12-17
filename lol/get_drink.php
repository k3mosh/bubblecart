<?php
// Include database connection
include 'dbconn.php';

// Fetch the item details based on the provided `id` in the URL
$drink = null;
if (isset($_GET['id'])) {
    $id = intval($_GET['id']);
    $query = "SELECT * FROM menu_items WHERE id = $id";
    $result = $conn->query($query);

    if ($result && $result->num_rows > 0) {
        $drink = $result->fetch_assoc();
    }
}

// Output the drink as JSON, or return a default if not found
if ($drink) {
    echo json_encode($drink);
} else {
    echo json_encode(['price' => 70]);  // default price if no drink is found
}
?>
