<?php
include 'dbconn.php';

if (isset($_POST['submit'])) {
    $itemName = $_POST['item_name'];
    $itemPrice = $_POST['item_price'];
    $itemDescription = $_POST['item_description'];

    // Handle Image Upload
    $targetDir = "uploads/"; // Directory to store uploaded images
    if (!is_dir($targetDir)) {
        mkdir($targetDir, 0755, true); // Create directory if it does not exist
    }

    $fileName = basename($_FILES["fileToUpload"]["name"]);
    $targetFilePath = $targetDir . time() . "_" . $fileName; // Adding a timestamp to the filename to avoid overwrites
    $fileType = strtolower(pathinfo($targetFilePath, PATHINFO_EXTENSION));

    // Allow certain file formats
    $allowedTypes = array('jpg', 'jpeg', 'png', 'gif');
    if (in_array($fileType, $allowedTypes)) {
        // Upload file to server
        if (move_uploaded_file($_FILES["fileToUpload"]["tmp_name"], $targetFilePath)) {
            // Insert image file name and item details into the database
            $query = "INSERT INTO menu_items (name, price, description, image_url, stock_quantity) VALUES (?, ?, ?, ?, 10)";
            $stmt = $conn->prepare($query);
            $stmt->bind_param("sdss", $itemName, $itemPrice, $itemDescription, $targetFilePath);

            if ($stmt->execute()) {
                header("Location: htdocs/admin_page.html?");
                echo "Item uploaded successfully.";
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
