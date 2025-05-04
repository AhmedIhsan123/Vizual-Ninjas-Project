<?php

header('Content-Type: application/json');
require 'db.php';

if (!isset($pdo)) {
    http_response_code(500);
    echo json_encode(['error' => 'Database not connected']);
    exit;
}

try {
    // Query 1: Unique Tiers
    $stmt1 = $pdo->query("SELECT DISTINCT EVENT_TIER_ID AS tier FROM EVENT WHERE EVENT_TIER_ID IS NOT NULL");
    $tiers = $stmt1->fetchAll(PDO::FETCH_COLUMN);

    // Query 2: Unique States
    $stmt2 = $pdo->query("SELECT DISTINCT EVENT_STATE_ID AS state FROM EVENT WHERE EVENT_STATE_ID IS NOT NULL");
    $states = $stmt2->fetchAll(PDO::FETCH_COLUMN);

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
    echo json_encode(['error' => $e->getMessage()]);
}
