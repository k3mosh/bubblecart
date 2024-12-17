<?php
session_start();

// Database connection
include 'dbconn.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get the submitted form data
    $baseFlavor = $_POST['base_flavor'];
    $size = $_POST['size'];
    $addOns = isset($_POST['add_ons']) ? implode(', ', $_POST['add_ons']) : '';
    $sweetness = $_POST['sweetness'];

    // Generate a unique cart item ID
    $itemId = uniqid();

    // Prepare item data
    $cartItem = [
        'id' => $itemId,
        'base_flavor' => $baseFlavor,
        'size' => $size,
        'add_ons' => $addOns,
        'sweetness' => $sweetness,
        'quantity' => 1,
        'price' => calculatePrice($size, $addOns) // Calculate the price dynamically
    ];

    // Save to session cart
    if (!isset($_SESSION['cart'])) {
        $_SESSION['cart'] = [];
    }

    // Add to cart
    $_SESSION['cart'][] = $cartItem;

    echo json_encode(['success' => true, 'item' => $cartItem]);
} else {
    echo json_encode(['success' => false]);
}

// Function to calculate the price
function calculatePrice($size, $addOns) {
    $basePrice = 50; // Base price for a small size
    $sizeMultiplier = ['Small' => 1, 'Medium' => 1.5, 'Large' => 2];
    $addOnPrice = 10; // Price per add-on

    $sizePrice = $basePrice * $sizeMultiplier[$size];
    $addOnsCount = count(explode(', ', $addOns));

    return $sizePrice + ($addOnsCount * $addOnPrice);
}
?>
