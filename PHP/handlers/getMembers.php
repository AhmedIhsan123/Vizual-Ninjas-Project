<?php

// Set the content type to JSON. This informs the client (e.g., a web browser) that the response will be a JSON string.
header('Content-Type: application/json');

// Include the database connection file. This file is expected to establish a PDO database connection in the $pdo variable.
// Make sure the path '/home/aabualha/db.php' is correct for your server environment.
require '/home/aabualha/db.php';

// --- Database Connection Check ---

// Verify that the PDO database connection object ($pdo) exists and is set up.
// If $pdo is not available, it indicates a failure in the database connection.
if (!isset($pdo)) {
    // Set the HTTP response status code to 500 (Internal Server Error) to indicate a server-side problem.
    http_response_code(500);
    // Output a JSON-encoded error message to the client.
    echo json_encode(['error' => 'Database not connected']);
    // Terminate script execution.
    exit;
}

// --- Input Validation and Query Construction ---

// Get the 'event_id' from the URL query parameters (GET request).
// It sanitizes the input by casting it to an integer. If 'event_id' is not provided, it defaults to 0.
$event_id = isset($_GET['event_id']) ? intval($_GET['event_id']) : 0;

// Conditional logic to determine which SQL query to execute based on whether an event_id is provided.
if ($event_id > 0) {
    // --- Query for a Specific Event's Participants and Their Travel Distances ---
    // If an event_id is provided, fetch detailed results for participants in that specific event.
    $sql = "SELECT 
                r.DIVISION_ID,          -- Division ID from event result
                r.EVENT_PLACE,          -- Participant's place in the event
                r.EVENT_ID,             -- Event ID (from event result)
                m.PDGA_NUMBER,          -- Participant's PDGA number
                m.MEMBER_FULL_NAME,     -- Participant's full name
                m.MEMBER_CITY,          -- Participant's city
                m.MEMBER_STATE_PROV,    -- Participant's state/province ID
                s.STATE_NAME,           -- State name (joined from STATE table)
                m.COUNTRY_ID,           -- Participant's country ID
                m.MEMBER_POSTAL_ZIP,    -- Participant's postal/zip code
                m.MEMBER_ADDRESS,       -- Participant's address
                m.MEMBER_LAT,           -- Participant's latitude
                m.MEMBER_LON,           -- Participant's longitude
                e.EVENT_LATITUDE,       -- Event's latitude
                e.EVENT_LONGITUDE       -- Event's longitude
            FROM EVENT_RESULT r         -- Start with the EVENT_RESULT table (alias 'r')
            JOIN MEMBER m ON r.PDGA_NUMBER = m.PDGA_NUMBER  -- Join with MEMBER table on PDGA_NUMBER
            JOIN EVENT e ON r.EVENT_ID = e.EVENT_ID        -- Join with EVENT table on EVENT_ID
            LEFT JOIN STATE s ON m.MEMBER_STATE_PROV = s.STATE_ID -- Left join with STATE table for state name (optional)
            WHERE r.EVENT_ID = :event_id"; // Filter results by the provided event_id
    
    // Prepare the SQL statement for safe execution (prevents SQL injection).
    $stmt = $pdo->prepare($sql);
    // Bind the event_id parameter to the prepared statement. PDO::PARAM_INT ensures it's treated as an integer.
    $stmt->bindParam(':event_id', $event_id, PDO::PARAM_INT);
} else {
    // --- Query for All Unique Members (if no event_id is provided) ---
    // If no event_id is provided, fetch distinct information for all members.
    $sql = "SELECT DISTINCT 
                m.PDGA_NUMBER,          -- Member's PDGA number
                m.MEMBER_FULL_NAME,     -- Member's full name
                m.MEMBER_CITY,          -- Member's city
                m.MEMBER_STATE_PROV,    -- Member's state/province ID
                s.STATE_NAME,           -- State name (joined from STATE table)
                m.COUNTRY_ID,           -- Member's country ID
                m.MEMBER_POSTAL_ZIP,    -- Member's postal/zip code
                m.MEMBER_ADDRESS,       -- Member's address
                m.MEMBER_LAT,           -- Member's latitude
                m.MEMBER_LON            -- Member's longitude
            FROM MEMBER m               -- Start with the MEMBER table (alias 'm')
            LEFT JOIN STATE s ON m.MEMBER_STATE_PROV = s.STATE_ID"; // Left join with STATE table for state name (optional)
    
    // Prepare the SQL statement. No parameters to bind here.
    $stmt = $pdo->prepare($sql);
}

// --- Execute Query and Fetch Results ---

// Execute the prepared SQL statement.
$stmt->execute();

// Fetch all results from the executed query.
// PDO::FETCH_ASSOC ensures that results are returned as an associative array (column names as keys).
$results = $stmt->fetchAll(PDO::FETCH_ASSOC);

// --- Haversine Distance Calculation Function ---

/**
 * Calculates the great-circle distance between two points on a sphere (like Earth)
 * given their longitudes and latitudes using the Haversine formula.
 *
 * @param float $lat1 Latitude of point 1 (in degrees).
 * @param float $lon1 Longitude of point 1 (in degrees).
 * @param float $lat2 Latitude of point 2 (in degrees).
 * @param float $lon2 Longitude of point 2 (in degrees).
 * @return float The distance in miles, rounded to 2 decimal places, or null if input is invalid.
 */
function haversineDistance($lat1, $lon1, $lat2, $lon2) {
    $earthRadius = 3958.8; // Earth's radius in miles

    // Convert degrees to radians for trigonometric functions.
    $latDelta = deg2rad($lat2 - $lat1);
    $lonDelta = deg2rad($lon2 - $lon1);

    // Apply the Haversine formula.
    $a = sin($latDelta / 2) * sin($latDelta / 2) +
         cos(deg2rad($lat1)) * cos(deg2rad($lat2)) *
         sin($lonDelta / 2) * sin($lonDelta / 2);

    $c = 2 * atan2(sqrt($a), sqrt(1 - $a));

    // Calculate the distance and round to 2 decimal places for practicality.
    return round($earthRadius * $c, 2); 
}

// --- Calculate Distance Traveled for Each Result ---

// Iterate through each row in the fetched results. The '&' makes $row a reference,
// allowing direct modification of the array elements.
foreach ($results as &$row) {
    // Check if both event and member latitude/longitude data are available for the current row.
    if (isset($row['EVENT_LATITUDE'], $row['EVENT_LONGITUDE'], $row['MEMBER_LAT'], $row['MEMBER_LON'])) {
        // If all necessary coordinates are present, calculate the distance.
        $row['DISTANCE_TRAVELED_MILES'] = haversineDistance(
            $row['MEMBER_LAT'], $row['MEMBER_LON'],
            $row['EVENT_LATITUDE'], $row['EVENT_LONGITUDE']
        );
    } else {
        // If any required coordinate data is missing, set 'DISTANCE_TRAVELED_MILES' to null.
        $row['DISTANCE_TRAVELED_MILES'] = null; 
    }
}

// --- Output Results ---

// Re-set the Content-Type header to JSON (good practice, though already set at the beginning).
header('Content-Type: application/json');
// Encode the final results array (now including distances) into a JSON string and output it to the client.
echo json_encode($results);

?>