<?php

header('Content-Type: application/json');
require '/home/aabualha/db.php';

// Get event ID from request (sanitize input)
$event_id = isset($_GET['event_id']) ? intval($_GET['event_id']) : 0;

if ($event_id > 0) {
    $sql = "SELECT 
                r.DIVISION_ID,
                r.EVENT_PLACE,
                r.EVENT_ID,
                m.PDGA_NUMBER, 
                m.MEMBER_FULL_NAME, 
                m.MEMBER_CITY, 
                m.MEMBER_STATE_PROV, 
                m.COUNTRY_ID, 
                m.MEMBER_POSTAL_ZIP, 
                m.MEMBER_ADDRESS, 
                m.MEMBER_LAT, 
                m.MEMBER_LON, 
                m.MEMBER_ADDRESS_FORMATTED,
                e.EVENT_LATITUDE,
                e.EVENT_LONGITUDE
            FROM EVENT_RESULT r
            JOIN MEMBER m ON r.PDGA_NUMBER = m.PDGA_NUMBER
            JOIN EVENT e ON r.EVENT_ID = e.EVENT_ID
            WHERE r.EVENT_ID = :event_id";

    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':event_id', $event_id, PDO::PARAM_INT);
} else {
    $sql = "SELECT 
                PDGA_NUMBER, 
                MEMBER_FULL_NAME, 
                MEMBER_CITY, 
                MEMBER_STATE_PROV, 
                COUNTRY_ID, 
                MEMBER_POSTAL_ZIP, 
                MEMBER_ADDRESS, 
                MEMBER_LAT, 
                MEMBER_LON, 
                MEMBER_ADDRESS_FORMATTED
            FROM MEMBER";
    
    $stmt = $pdo->prepare($sql);
}

// Execute the query
$stmt->execute();

// Fetch the results
$results = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Function to calculate distance using Haversine formula
function haversineDistance($lat1, $lon1, $lat2, $lon2) {
    $earthRadius = 3958.8; // Earth's radius in miles

    $latDelta = deg2rad($lat2 - $lat1);
    $lonDelta = deg2rad($lon2 - $lon1);

    $a = sin($latDelta / 2) * sin($latDelta / 2) +
        cos(deg2rad($lat1)) * cos(deg2rad($lat2)) *
        sin($lonDelta / 2) * sin($lonDelta / 2);

    $c = 2 * atan2(sqrt($a), sqrt(1 - $a));

    return $earthRadius * $c;
}

// Calculate the distance traveled for each result
foreach ($results as &$row) {
    if (isset($row['EVENT_LATITUDE'], $row['EVENT_LONGITUDE'], $row['MEMBER_LAT'], $row['MEMBER_LON'])) {
        $row['DISTANCE_TRAVELED_MILES'] = haversineDistance(
            $row['MEMBER_LAT'], $row['MEMBER_LON'],
            $row['EVENT_LATITUDE'], $row['EVENT_LONGITUDE']
        );
    } else {
        $row['DISTANCE_TRAVELED_MILES'] = null; // If data is missing, set distance to null
    }
}

// Output results as JSON
header('Content-Type: application/json');
echo json_encode($results);
?>
