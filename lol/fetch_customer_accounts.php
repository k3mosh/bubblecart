<?php
// Include database connection
include 'dbconn.php';

// Fetch customer accounts
$sql = "SELECT username, phone, email, CONCAT(barangay, ', ', street) AS address FROM users";
$result = $conn->query($sql);

// Check for errors
if (!$result) {
    die("Query failed: " . $conn->error);
}

// Generate table
if ($result->num_rows > 0) {
    echo '<table style="width:100%; border-collapse:collapse;">';
    echo '<thead>
            <tr>
                <th style="border:1px solid #ddd; padding:8px;">Username</th>
                <th style="border:1px solid #ddd; padding:8px;">Phone</th>
                <th style="border:1px solid #ddd; padding:8px;">Email</th>
                <th style="border:1px solid #ddd; padding:8px;">Address</th>
            </tr>
          </thead>';
    echo '<tbody>';
    while ($row = $result->fetch_assoc()) {
        echo '<tr>
                <td style="border:1px solid #ddd; padding:8px;">' . htmlspecialchars($row['username']) . '</td>
                <td style="border:1px solid #ddd; padding:8px;">' . htmlspecialchars($row['phone']) . '</td>
                <td style="border:1px solid #ddd; padding:8px;">' . htmlspecialchars($row['email']) . '</td>
                <td style="border:1px solid #ddd; padding:8px;">' . htmlspecialchars($row['address']) . '</td>
              </tr>';
    }
    echo '</tbody>';
    echo '</table>';
} else {
    echo '<p>No customer records found.</p>';
}


// Close database connection
$conn->close();
?>
