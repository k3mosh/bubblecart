<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

$servername = "srv1632.hstgr.io";
$username = "u143688490_user";
$password = "Kyuzumi112";
$dbname = "u143688490_bubblecart";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['id'])) {
    $customerId = $data['id'];
    $stmt = $conn->prepare("DELETE FROM users WHERE id = ?");
    $stmt->bind_param("i", $customerId);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Customer deleted successfully.']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to delete the customer.']);
    }

    $stmt->close();
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request.']);
}

$conn->close();
?>
