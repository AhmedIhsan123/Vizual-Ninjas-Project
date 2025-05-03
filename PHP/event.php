<?php

header('Content-Type: application/json');

// Connect to the database
require 'db.php';

if (!isset($pdo)) {
    http_response_code(500);
    echo json_encode(['error' => 'Database not connected']);
    exit;
}

try {
    // Grab optional filters from URL
    $filters = [];
    $params = [];

    if (!empty($_GET['tier'])) {
        $filters[] = "e.EVENT_TIER_ID = :tier";
        $params[':tier'] = $_GET['tier'];
    }

    if (!empty($_GET['country'])) {
        $filters[] = "e.COUNTRY = :country";
        $params[':country'] = $_GET['country'];
    }

    if (!empty($_GET['state'])) {
        $filters[] = "e.STATE_PROV = :state";
        $params[':state'] = $_GET['state'];
    }

    if (!empty($_GET['start_date'])) {
        $filters[] = "e.EVENT_START_DATE >= :start_date";
        $params[':start_date'] = $_GET['start_date'];
    }

    if (!empty($_GET['end_date'])) {
        $filters[] = "e.EVENT_START_DATE <= :end_date";
        $params[':end_date'] = $_GET['end_date'];
    }

    // Build WHERE clause
    $where = "WHERE m.MEMBER_LAT IS NOT NULL AND m.MEMBER_LON IS NOT NULL";
    if (!empty($filters)) {
        $where .= " AND " . implode(" AND ", $filters);
    }

    // Final query
    $sql = "
        SELECT 
            e.EVENT_ID, 
            e.EVENT_NAME, 
            AVG(3959 * ACOS(
                COS(RADIANS(m.MEMBER_LAT)) * COS(RADIANS(e.EVENT_LATITUDE)) *
                COS(RADIANS(e.EVENT_LONGITUDE) - RADIANS(m.MEMBER_LON)) +
                SIN(RADIANS(m.MEMBER_LAT)) * SIN(RADIANS(e.EVENT_LATITUDE))
            )) AS avg_distance_miles
        FROM EVENT_RESULT er
        JOIN MEMBER m ON er.PDGA_NUMBER = m.PDGA_NUMBER
        JOIN EVENT e ON er.EVENT_ID = e.EVENT_ID
        $where
        GROUP BY e.EVENT_ID, e.EVENT_NAME
        ORDER BY e.EVENT_NAME ASC
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $results = $stmt->fetchAll();

    echo json_encode($results);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
    exit;
}
