<?php

header('Content-Type: application/json');
require '/home/aabualha/db.php';

if (!isset($pdo)) {
    http_response_code(500);
    echo json_encode(['error' => 'Database not connected']);
    exit;
}

try {
    // Query 1: Unique Tiers
    $stmt1 = $pdo->query("SELECT DISTINCT EVENT_TIER_ID AS tier FROM EVENT WHERE EVENT_TIER_ID IS NOT NULL ORDER BY tier ASC;");
    $tiers = $stmt1->fetchAll(PDO::FETCH_COLUMN);

    // Query 2: Unique States
    $stmt = $pdo->query("SELECT DISTINCT S.STATE_NAME AS state_name, S.STATE_ID AS state_id FROM EVENT E JOIN STATE S ON E.EVENT_STATE_ID = S.STATE_ID WHERE E.EVENT_STATE_ID IS NOT NULL");$states = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Query 3: Unique Countries
    $stmt3 = $pdo->query("SELECT DISTINCT COUNTRY_ID AS country FROM EVENT WHERE COUNTRY_ID IS NOT NULL");
    $countries = $stmt3->fetchAll(PDO::FETCH_COLUMN);

    // Return all results as separate objects
    echo json_encode([
        'tiers' => $tiers,
        'states' => $states,
        'countries' => $countries
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Query failed', 'details' => $e->getMessage()]);
}
?>