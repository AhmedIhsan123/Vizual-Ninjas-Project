<?php

// Set the Content-Type header to application/json. This tells the client that the response will be in JSON format.
header('Content-Type: application/json');

// Include the database connection file. This file is expected to define and connect to the database via the $pdo object.
// Ensure the path '/home/aabualha/db.php' is correct for your server environment.
require '/home/aabualha/db.php';

// --- Database Connection Check ---

// Verify that the PDO database connection object ($pdo) exists and is properly set up.
// If it's not available, it means there was an issue connecting to the database.
if (!isset($pdo)) {
    // Set the HTTP response status code to 500 (Internal Server Error) to indicate a server-side problem.
    http_response_code(500);
    // Output a JSON-encoded error message to the client.
    echo json_encode(['error' => 'Database not connected']);
    // Terminate script execution.
    exit;
}

// --- Query Construction and Filtering ---

// Use a try-catch block to gracefully handle any PDO (database) exceptions that may occur during query execution.
try {
    // Initialize an array to store SQL WHERE clause conditions.
    $filters = [];
    // Initialize an associative array to store parameters for the prepared statement (to prevent SQL injection).
    $params = [];

    // Check for 'tier' filter in the GET request.
    if (!empty($_GET['tier'])) {
        // Add a condition for the event tier to the filters array.
        $filters[] = "e.EVENT_TIER_ID = :tier";
        // Store the tier value in the parameters array.
        $params[':tier'] = $_GET['tier'];
    }

    // Check for 'country' filter in the GET request.
    if (!empty($_GET['country'])) {
        // Add a condition for the event country to the filters array.
        $filters[] = "e.COUNTRY_ID = :country";
        // Store the country value in the parameters array.
        $params[':country'] = $_GET['country'];
    }

    // Check for 'state' filter in the GET request.
    if (!empty($_GET['state'])) {
        // Add a condition for the event state to the filters array.
        $filters[] = "e.EVENT_STATE_ID = :state";
        // Store the state value in the parameters array.
        $params[':state'] = $_GET['state'];
    }

    // --- Date Range Filtering ---

    // Check for 'start_date' filter in the GET request.
    if (!empty($_GET['start_date'])) {
        // Add a condition to ensure the event end date is on or after the specified start date.
        // STR_TO_DATE converts the database date string to a comparable date object.
        $filters[] = "STR_TO_DATE(e.DATE_EVENT_END, '%c/%e/%Y') >= :start_date";
        // Store the start date value in the parameters array.
        $params[':start_date'] = $_GET['start_date'];
    }
    
    // Check for 'end_date' filter in the GET request.
    if (!empty($_GET['end_date'])) {
        // Add a condition to ensure the event end date is on or before the specified end date.
        // STR_TO_DATE converts the database date string to a comparable date object.
        $filters[] = "STR_TO_DATE(e.DATE_EVENT_END, '%c/%e/%Y') <= :end_date";
        // Store the end date value in the parameters array.
        $params[':end_date'] = $_GET['end_date'];
    }

    // Construct the WHERE clause. If there are filters, prepend 'WHERE' and join conditions with ' AND '.
    // Otherwise, the WHERE clause remains an empty string.
    $where = count($filters) > 0 ? 'WHERE ' . implode(' AND ', $filters) : '';

    // --- Main SQL Query ---

    // This is the main SQL query to retrieve event information along with aggregated member data.
    $sql = "SELECT 
                e.EVENT_ID,                     -- Unique identifier for the event
                e.EVENT_NAME,                   -- Name of the event
                e.EVENT_TIER_ID,                -- Tier ID of the event (e.g., A-tier, B-tier)
                e.EVENT_STATE_ID,               -- State ID where the event took place
                e.EVENT_LATITUDE,               -- Latitude coordinate of the event location
                e.EVENT_LONGITUDE,              -- Longitude coordinate of the event location
                e.COUNTRY_ID,                   -- Country ID where the event took place
                e.DATE_EVENT_END,               -- End date of the event
                COUNT(DISTINCT m.PDGA_NUMBER) AS TOTAL_MEMBERS,             -- Total unique members who participated in the event
                COUNT(CASE WHEN m.MEMBER_STATE_PROV = e.EVENT_STATE_ID THEN 1 END) AS MEMBERS_IN_STATE, -- Count of members from the same state as the event
                COUNT(CASE WHEN m.MEMBER_STATE_PROV <> e.EVENT_STATE_ID THEN 1 END) AS MEMBERS_OUT_OF_STATE, -- Count of members from a different state than the event
                ROUND(AVG(                                                   -- Calculate the average travel distance for participants
                    3959 * ACOS(                                              -- 3959 is Earth's radius in miles; ACOS is for arccosine
                        COS(RADIANS(m.MEMBER_LAT)) * COS(RADIANS(e.EVENT_LATITUDE)) * -- Haversine formula part 1
                        COS(RADIANS(e.EVENT_LONGITUDE) - RADIANS(m.MEMBER_LON)) +      -- Haversine formula part 2
                        SIN(RADIANS(m.MEMBER_LAT)) * SIN(RADIANS(e.EVENT_LATITUDE))    -- Haversine formula part 3
                    )
                ), 2) AS AVG_TRAVEL_DISTANCE_MILES                          -- Alias for the calculated average travel distance, rounded to 2 decimal places
            FROM 
                EVENT_RESULT er                 -- Join with the EVENT_RESULT table (alias 'er') to link members to events
            JOIN MEMBER m ON er.PDGA_NUMBER = m.PDGA_NUMBER -- Join with MEMBER table (alias 'm') on PDGA number to get member details
            JOIN EVENT e ON er.EVENT_ID = e.EVENT_ID     -- Join with EVENT table (alias 'e') on Event ID to get event details
            $where                                          -- Dynamically insert the WHERE clause based on user filters
            GROUP BY 
                e.EVENT_ID, e.EVENT_NAME, e.EVENT_TIER_ID, e.EVENT_STATE_ID, e.COUNTRY_ID, -- Group results by event details to allow aggregation
                e.EVENT_LATITUDE, e.EVENT_LONGITUDE, e.DATE_EVENT_END
            ORDER BY 
                AVG_TRAVEL_DISTANCE_MILES DESC, e.DATE_EVENT_END DESC"; // Order results by average travel distance (descending) then by event end date (descending)

    // Prepare the SQL statement for safe execution (prevents SQL injection by using placeholders).
    $stmt = $pdo->prepare($sql);
    // Execute the prepared statement, passing the array of parameters.
    $stmt->execute($params);
    // Fetch all results from the executed query as an associative array.
    $events = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Encode the fetched events array into a JSON string and output it as the API response.
    echo json_encode($events);

} catch (PDOException $e) {
    // If a PDOException occurs (e.g., a SQL error), set the HTTP response status code to 500 (Internal Server Error).
    http_response_code(500);
    // Output a JSON-encoded error message, including the specific database error for debugging purposes.
    echo json_encode(['error' => 'Query failed: ' . $e->getMessage()]);
}

?>