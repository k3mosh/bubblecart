<?php
session_start();
// Allow requests from any origin
header("Access-Control-Allow-Origin: *");

// Allow specific HTTP methods (GET, POST, etc.)
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");

// Allow specific headers
header("Access-Control-Allow-Headers: Content-Type, Authorization");


// Database connection
$servername = "srv1632.hstgr.io";
$username = "u143688490_user";
$password = "Kyuzumi112";
$dbname = "u143688490_bubblecart";

$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if (isset($_POST['submit'])) {
    $itemName = $_POST['product_name'];
    $itemPrice = $_POST['item_price'];
    $itemDescription = $_POST['description'];
    $stockQuantity = $_POST['stock_qty']; // Get the stock quantity from the form

    // Handle Image Upload
    $targetDir = "uploads/"; // Directory to store uploaded images
    if (!is_dir($targetDir)) {
        mkdir($targetDir, 0755, true); // Create directory if it does not exist
    }

    $fileName = basename($_FILES["image_upload"]["name"]);
    $targetFilePath = $targetDir . time() . "_" . $fileName; // Adding a timestamp to the filename to avoid overwrites
    $fileType = strtolower(pathinfo($targetFilePath, PATHINFO_EXTENSION));

    // Allow certain file formats
    $allowedTypes = array('jpg', 'jpeg', 'png', 'gif');
    if (in_array($fileType, $allowedTypes)) {
        // Upload file to server
        if (move_uploaded_file($_FILES["image_upload"]["tmp_name"], $targetFilePath)) {
            // Insert image file name and item details into the database
            $query = "INSERT INTO menu_items (name, price, description, image_url, stock_quantity) VALUES (?, ?, ?, ?, ?)";
            $stmt = $conn->prepare($query);
            $stmt->bind_param("sdssi", $itemName, $itemPrice, $itemDescription, $targetFilePath, $stockQuantity);

            if ($stmt->execute()) {
                header("Location: ../admin_editmenu.html?status=success");    
                exit();  
            } else {
                echo "Database Error: " . $stmt->error;
            }

            $stmt->close();
        } else {
            echo "Sorry, there was an error uploading your file.";
        }
    } else {
        echo "Sorry, only JPG, JPEG, PNG, & GIF files are allowed.";
    }
} else {
    echo "Invalid access.";
}

$conn->close();
?>
