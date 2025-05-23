<?php

header('Content-Type: application/json');
require '/home/aabualha/db.php';

if (!isset($pdo)) {
    http_response_code(500);
    echo json_encode(['error' => 'Database not connected']);
    exit;
}

