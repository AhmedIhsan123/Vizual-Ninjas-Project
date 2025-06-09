<?php

// Set the content type to JSON. This tells the client (e.g., web browser) that the response will be a JSON string.
header('Content-Type: application/json');

// Include the database connection file. This file is expected to establish a PDO connection in the $pdo variable.
// Adjust the path to your db.php file as needed for your server setup.
require '/home/aabualha/db.php';

// Check if the PDO database connection object ($pdo) was successfully created.
// If it's not set, it means db.php likely failed to connect or set up the PDO object.
if (!isset($pdo)) {
    // Set the HTTP response status code to 500 (Internal Server Error).
    http_response_code(500);
    // Encode an error message as JSON and output it.
    echo json_encode(['error' => 'Database not connected']);
    // Stop script execution.
    exit;
}

// Use a try-catch block to handle potential PDO (database) errors gracefully.
try {
    // Query 1: Fetch all unique event tiers.
    // This query selects distinct 'EVENT_TIER_ID' values from the 'EVENT' table,
    // filters out null values, and orders the results in ascending order.
    $stmt1 = $pdo->query("SELECT DISTINCT EVENT_TIER_ID AS tier FROM EVENT WHERE EVENT_TIER_ID IS NOT NULL ORDER BY tier ASC;");
    // Fetch all results as a simple, one-dimensional array (column values only).
    $tiers = $stmt1->fetchAll(PDO::FETCH_COLUMN);

    // Query 2: Fetch all unique states and their IDs associated with events.
    // This query joins the 'EVENT' and 'STATE' tables to get both state names and IDs,
    // ensuring only states linked to an event are returned.
    $stmt = $pdo->query("SELECT DISTINCT S.STATE_NAME AS state_name, S.STATE_ID AS state_id FROM EVENT E JOIN STATE S ON E.EVENT_STATE_ID = S.STATE_ID WHERE E.EVENT_STATE_ID IS NOT NULL");
    // Fetch all results as an associative array, where each state is an object with 'state_name' and 'state_id'.
    $states = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Query 3: Fetch all unique countries associated with events.
    // This query selects distinct 'COUNTRY_ID' values from the 'EVENT' table,
    // filtering out any null values.
    $stmt3 = $pdo->query("SELECT DISTINCT COUNTRY_ID AS country FROM EVENT WHERE COUNTRY_ID IS NOT NULL");
    // Fetch all results as a simple, one-dimensional array (column values only).
    $countries = $stmt3->fetchAll(PDO::FETCH_COLUMN);

    // Combine all query results into a single JSON object.
    // This allows the client to receive all necessary filter options in one request.
    echo json_encode([
        'tiers' => $tiers,
        'states' => $states,
        'countries' => $countries
    ]);

} catch (PDOException $e) {
    // If a PDOException occurs during any database operation, catch it.
    // Set the HTTP response status code to 500 (Internal Server Error).
    http_response_code(500);
    // Encode a detailed error message as JSON and output it, including the specific PDO error.
    echo json_encode(['error' => 'Query failed', 'details' => $e->getMessage()]);
}
?>