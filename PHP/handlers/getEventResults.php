<?php
// PHP/getEventResults.php

// Set the content type to JSON. This tells the client (e.g., web browser) that the response will be a JSON string.
header('Content-Type: application/json');

// Include the database connection file. This file is expected to establish a PDO connection in the $pdo variable.
// You might need to adjust the path to your db.php file based on your server setup.
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
    // Prepare and execute a SQL query to select specific columns from the 'EVENT_RESULT' table.
    // This query retrieves event ID, PDGA number, and event placement for all records.
    $stmt = $pdo->query("
        SELECT 
            EVENT_ID, 
            PDGA_NUMBER, 
            EVENT_PLACE
        FROM EVENT_RESULT
    ");
    
    // Fetch all the results from the executed query.
    // PDO::FETCH_ASSOC ensures that the results are returned as an associative array,
    // where column names are the keys.
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Encode the fetched results array into a JSON string and output it.
    // This is the successful response sent back to the client.
    echo json_encode($results);

} catch (PDOException $e) {
    // If a PDOException occurs during the database operation, catch it.
    // Set the HTTP response status code to 500 (Internal Server Error).
    http_response_code(500);
    // Encode an error message including the specific PDO error message as JSON and output it.
    echo json_encode(['error' => 'Query failed: ' . $e->getMessage()]);
}
?>