<?php
// PHP/getEventResults.php
header('Content-Type: application/json');
require '/home/aabualha/db.php'; // Adjust the path to your db.php

if (!isset($pdo)) {
    http_response_code(500);
    echo json_encode(['error' => 'Database not connected']);
    exit;
}

try {
    $stmt = $pdo->query("
        SELECT 
            EVENT_ID, 
            PDGA_NUMBER, 
            EVENT_PLACE
        FROM EVENT_RESULT
    ");
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($results);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Query failed: ' . $e->getMessage()]);
}
?>