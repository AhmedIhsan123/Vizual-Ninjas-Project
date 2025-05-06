<?php
header('Content-Type: application/json');

// Connect to the database
require '../db.php';

// Get event_id from a GET parameter or other input
$eventId = $_GET['event_id']; // Make sure to validate/sanitize this

// Prepare SQL with parameter
$sql = "
    SELECT
        COUNT(CASE WHEN m.MEMBER_STATE_PROV = e.EVENT_STATE_ID THEN 1 END) AS members_same_state,
        COUNT(CASE WHEN m.MEMBER_STATE_PROV <> e.EVENT_STATE_ID THEN 1 END) AS members_different_state
    FROM
        EVENT_RESULT er
    JOIN MEMBER m ON
        er.PDGA_NUMBER = m.PDGA_NUMBER
    JOIN EVENT e ON
        er.EVENT_ID = e.EVENT_ID
    WHERE
        m.MEMBER_STATE_PROV IS NOT NULL
        AND e.EVENT_ID = ?
";

// Execute query
$stmt = $pdo->prepare($sql);
$stmt->execute([$eventId]);
$result = $stmt->fetch(PDO::FETCH_ASSOC);

// Output result
echo json_encode($result);
?>