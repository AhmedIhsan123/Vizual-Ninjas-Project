<?php

header('Content-Type: application/json');
require '/home/aabualha/db.php';

if (!isset($pdo)) {
    http_response_code(500);
    echo json_encode(['error' => 'Database not connected']);
    exit;
}

$eventId = $_GET['event_id'] ?? null;
if (!$eventId) {
    echo json_encode([]);
    exit;
}

$stmt = $pdo->prepare("SELECT PLAYER_NAME AS name, DISTANCE_KM AS distanceKm, STATE_ID AS state FROM PLAYER_EVENT WHERE EVENT_ID = ?");
$stmt->execute([$eventId]);
echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));