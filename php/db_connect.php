<?php
// Allow requests from any origin
header("Access-Control-Allow-Origin: *");

// Allow specific HTTP methods (GET, POST, etc.)
header("Access-Control-Allow-Methods: POST, GET, DELETE, OPTIONS");

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
?>
