<?php

header('Content-Type: application/json');
require '../db.php';

if (!isset($pdo)) {
    http_response_code(500);
    echo json_encode(['error' => 'Database not connected']);
    exit;
}

$countryCode = $_GET['country'] ?? null;

if (!$countryCode) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing country parameter']);
    exit;
}

try {
    $stmt = $pdo->prepare("
        SELECT DISTINCT S.STATE_NAME AS state
        FROM EVENT E
        JOIN STATE S ON E.EVENT_STATE_ID = S.STATE_ID
        WHERE E.COUNTRY_ID = :countryCode
          AND E.EVENT_STATE_ID IS NOT NULL
    ");

    $stmt->execute(['countryCode' => $countryCode]);
    $states = $stmt->fetchAll(PDO::FETCH_COLUMN);

    echo json_encode(['states' => $states]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
