<?php

// Set the Content-Type header to application/json. This tells the client the response will be in JSON format.
header('Content-Type: application/json');

// Include the database connection file. This file is expected to define and connect to the database via the $pdo object.
// Ensure the path '/home/aabualha/db.php' is correct for your server environment.
require '/home/aabualha/db.php';

// Check if the PDO database connection object ($pdo) was successfully initialized.
// If it's not set, it means there was an issue connecting to the database.
if (!isset($pdo)) {
    // Set the HTTP response status code to 500 (Internal Server Error) to indicate a server problem.
    http_response_code(500);
    // Output a JSON-encoded error message to the client.
    echo json_encode(['error' => 'Database not connected']);
    // Terminate the script to prevent further execution without a database connection.
    exit;
}

// Get the 'country' parameter from the URL query string (GET request).
// The null coalescing operator (??) ensures that if 'country' is not set, $countryCode defaults to null.
$countryCode = $_GET['country'] ?? null;

// Use a try-catch block to gracefully handle any PDO (database) exceptions that may occur during query execution.
try {
    // Check if a country code was provided in the request.
    if ($countryCode) {
        // If a country code is provided, prepare a SQL query to fetch distinct states
        // that are associated with events in that specific country.
        $stmt = $pdo->prepare("
            SELECT DISTINCT S.STATE_NAME AS state_name, S.STATE_ID AS state_id
            FROM EVENT E
            JOIN STATE S ON E.EVENT_STATE_ID = S.STATE_ID
            WHERE E.COUNTRY_ID = :countryCode AND E.EVENT_STATE_ID IS NOT NULL
        ");
        // Execute the prepared statement, binding the :countryCode placeholder to the $countryCode variable.
        $stmt->execute(['countryCode' => $countryCode]);
    } else {
        // If no country code is provided, prepare a SQL query to fetch all unique states
        // that are associated with any event, regardless of country.
        $stmt = $pdo->prepare("
            SELECT DISTINCT S.STATE_NAME AS state_name, S.STATE_ID AS state_id
            FROM EVENT E
            JOIN STATE S ON E.EVENT_STATE_ID = S.STATE_ID
            WHERE E.EVENT_STATE_ID IS NOT NULL
        ");
        // Execute the prepared statement. No parameters are needed for this query.
        $stmt->execute();
    }

    // Fetch all the results from the executed query.
    // PDO::FETCH_ASSOC ensures that results are returned as an associative array,
    // with column names ('state_name', 'state_id') as keys.
    $states = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Encode the fetched states array into a JSON object and output it to the client.
    // The response will be in the format: {"states": [...]}.
    echo json_encode(['states' => $states]);

} catch (PDOException $e) {
    // If a PDOException occurs (e.g., a SQL error), set the HTTP response status code to 500.
    http_response_code(500);
    // Output a JSON-encoded error message, including the specific database error for debugging.
    echo json_encode(['error' => $e->getMessage()]);
}

?>