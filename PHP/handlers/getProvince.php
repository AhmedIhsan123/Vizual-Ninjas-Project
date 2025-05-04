<?php

header('Content-Type: application/json');
require '../db.php';

if (!isset($pdo)) {
    http_response_code(500);
    echo json_encode(['error' => 'Database not connected']);
    exit;
}

$countryCode = $_GET['country'] ?? null;

try {
    if ($countryCode) {
        // Query for states by specific country
        $stmt = $pdo->prepare("
            SELECT DISTINCT S.STATE_NAME AS state
            FROM EVENT E
            JOIN STATE S ON E.EVENT_STATE_ID = S.STATE_ID
            WHERE E.COUNTRY_ID = :countryCode
              AND E.EVENT_STATE_ID IS NOT NULL
        ");
        $stmt->execute(['countryCode' => $countryCode]);
    } else {
        // Query for all unique states regardless of country
        $stmt = $pdo->prepare("
            SELECT DISTINCT S.STATE_NAME AS state
            FROM EVENT E
            JOIN STATE S ON E.EVENT_STATE_ID = S.STATE_ID
            WHERE E.EVENT_STATE_ID IS NOT NULL
        ");
        $stmt->execute();
    }

    $states = $stmt->fetchAll(PDO::FETCH_COLUMN);
    echo json_encode(['states' => $states]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
