<?php
// PHP/events.php
header('Content-Type: application/json');
require '/home/aabualha/db.php';

if (!isset($pdo)) {
    http_response_code(500);
    echo json_encode(['error' => 'Database not connected']);
    exit;
}

try {
    // Filters (as before)
    $filters = [];
    $params = [];

    if (!empty($_GET['tier'])) {
        $filters[] = "e.EVENT_TIER_ID = :tier";
        $params[':tier'] = $_GET['tier'];
    }

    if (!empty($_GET['country'])) {
        $filters[] = "e.COUNTRY_ID = :country";
        $params[':country'] = $_GET['country'];
    }

    if (!empty($_GET['state'])) {
        $filters[] = "e.EVENT_STATE_ID = :state";
        $params[':state'] = $_GET['state'];
    }

    // WHERE clause
    $where = count($filters) > 0 ? 'WHERE ' . implode(' AND ', $filters) : '';

    // Main Query (as before, but adding stats)
    $sql = "SELECT 
            e.EVENT_ID,
            e.EVENT_NAME,
            e.EVENT_TIER_ID,
            e.EVENT_STATE_ID,
            e.EVENT_LATITUDE,
            e.EVENT_LONGITUDE,
            e.COUNTRY_ID,
            e.DATE_EVENT_END,
            COUNT(DISTINCT m.PDGA_NUMBER) AS TOTAL_MEMBERS,
            COUNT(CASE WHEN m.MEMBER_STATE_PROV = e.EVENT_STATE_ID THEN 1 END) AS MEMBERS_IN_STATE,
            COUNT(CASE WHEN m.MEMBER_STATE_PROV <> e.EVENT_STATE_ID THEN 1 END) AS MEMBERS_OUT_OF_STATE,
            ROUND(AVG(
                3959 * ACOS(
                    COS(RADIANS(m.MEMBER_LAT)) * COS(RADIANS(e.EVENT_LATITUDE)) *
                    COS(RADIANS(e.EVENT_LONGITUDE) - RADIANS(m.MEMBER_LON)) +
                    SIN(RADIANS(m.MEMBER_LAT)) * SIN(RADIANS(e.EVENT_LATITUDE))
                )
            ), 2) AS AVG_TRAVEL_DISTANCE_MILES
        FROM 
            EVENT_RESULT er
        JOIN MEMBER m ON er.PDGA_NUMBER = m.PDGA_NUMBER
        JOIN EVENT e ON er.EVENT_ID = e.EVENT_ID
        $where
        GROUP BY 
            e.EVENT_ID, e.EVENT_NAME, e.EVENT_TIER_ID, e.EVENT_STATE_ID, e.COUNTRY_ID
        ORDER BY 
            e.DATE_EVENT_END DESC";

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $events = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($events);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Query failed: ' . $e->getMessage()]);
}
?>