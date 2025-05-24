<?php

header('Content-Type: application/json');
require '/home/aabualha/db.php';

// Get event ID from request (sanitize input)
$event_id = isset($_GET['event_id']) ? intval($_GET['event_id']) : 0;

// Prepare SQL query
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
            m.MEMBER_ADDRESS_FORMATTED
        FROM EVENT_RESULT r
        JOIN MEMBER m ON r.PDGA_NUMBER = m.PDGA_NUMBER
        WHERE r.EVENT_ID = :event_id";

// Prepare and execute the statement
$stmt = $pdo->prepare($sql);
$stmt->bindParam(':event_id', $event_id, PDO::PARAM_INT);
$stmt->execute();

// Fetch the results
$results = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Output results as JSON
header('Content-Type: application/json');
echo json_encode($results);
?>
