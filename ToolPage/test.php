<?php
$host = 'localhost';
$db   = 'allenrgr_travel-data';
$user = 'allenrgr';
$pass = 'eVV2Q4@O7c@eu8';

// Create connection
$conn = new mysqli($host, $user, $pass, $db);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Run a query
$sql = "SELECT * FROM `EVENT` WHERE EVENT_TIER_ID = 'C'";
$result = $conn->query($sql);

$events = array(); // Initialize an empty array to hold the results

if ($result->num_rows > 0) {
    // Store results in the array
    while ($row = $result->fetch_assoc()) {
        $events[] = $row; // Add each row to the array
    }
} else {
    $events = []; // No results found, send an empty array
}

// Close connection
$conn->close();

// Return the results as JSON
echo json_encode($events);
?>
