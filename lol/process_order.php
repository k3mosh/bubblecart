<?php
// process_order.php
include 'dbconn.php'; // Make sure to include your DB connection file

// Get the POST data
$data = json_decode(file_get_contents('php://input'), true);

// Extract data from the request
$username = $data['username']; // Using username instead of userId
$items = $data['items'];
$totalAmount = $data['totalAmount'];

// Get the user_id based on the username
$userQuery = "SELECT id FROM users WHERE username = ?";
$stmt = $conn->prepare($userQuery);
$stmt->bind_param('s', $username);
$stmt->execute();
$result = $stmt->get_result();

// Check if the username exists
if ($result->num_rows === 1) {
    $user = $result->fetch_assoc();
    $userId = $user['id']; // Get the user_id

    // Insert order into the 'orders' table
    $orderQuery = "INSERT INTO orders (user_id, total_amount) VALUES (?, ?)";
    $stmt = $conn->prepare($orderQuery);
    $stmt->bind_param('id', $userId, $totalAmount);
    $stmt->execute();
    $orderId = $stmt->insert_id; // Get the last inserted order ID
    $stmt->close();

    // Insert each item into the 'order_items' table
    foreach ($items as $item) {
        $itemName = $item['itemName'];
        $quantity = $item['quantity'];
        $price = $item['price'];
        $size = $item['size'];
        $milkBase = $item['milkBase'];
        $sugarLevel = $item['sugarLevel'];
        $iceLevel = $item['iceLevel'];
        $addons = $item['addons'];

        $itemQuery = "INSERT INTO order_items (order_id, item_name, quantity, price, size, milk_base, sugar_level, ice_level, addons) 
                      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        $stmt = $conn->prepare($itemQuery);
        $stmt->bind_param('isidsssss', $orderId, $itemName, $quantity, $price, $size, $milkBase, $sugarLevel, $iceLevel, $addons);
        $stmt->execute();
        $stmt->close();
    }

    // Return success response
    echo json_encode(['success' => true]);
} else {
    // If username is not found, return error
    echo json_encode(['success' => false, 'message' => 'User not found.']);
}
?>
