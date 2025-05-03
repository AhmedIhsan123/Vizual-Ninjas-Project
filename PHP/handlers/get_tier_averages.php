<?php
// Ensure $pdo is available from db.php
if (!isset($pdo)) {
    http_response_code(500);
    echo json_encode(['error' => 'Database not connected']);
    exit;
}

try {
    $sql = "
        SELECT e.EVENT_TIER_ID,
        AVG(3959 * ACOS(
            COS(RADIANS(m.MEMBER_LAT)) * COS(RADIANS(e.EVENT_LATITUDE)) *
            COS(RADIANS(e.EVENT_LONGITUDE) - RADIANS(m.MEMBER_LON)) +
            SIN(RADIANS(m.MEMBER_LAT)) * SIN(RADIANS(e.EVENT_LATITUDE))
            )
            )
        AS avg_distance_miles
        FROM EVENT_RESULT er 
        JOIN MEMBER m ON er.PDGA_NUMBER = m.PDGA_NUMBER
        JOIN EVENT e ON er.EVENT_ID = e.EVENT_ID
        WHERE m.MEMBER_LAT IS NOT NULL
        AND m.MEMBER_LON IS NOT NULL
        GROUP BY e.EVENT_TIER_ID
        ORDER BY avg_distance_miles DESC
    ";

    $stmt = $pdo->query($sql);
    $results = $stmt->fetchAll();

    echo json_encode($results);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Query failed', 'details' => $e->getMessage()]);
}
