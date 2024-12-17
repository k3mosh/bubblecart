<?php
include ('db_connect.php');

$query = "SELECT id, name FROM menu_items"; // Only fetch necessary fields (id and name)
$result = $conn->query($query);

$items = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $items[] = $row;
    }
    echo json_encode($items); // Return data as JSON
} else {
    echo json_encode([]); // Return empty array if no data found
}

$conn->close();
?>
