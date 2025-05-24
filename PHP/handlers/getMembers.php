<?php
// PHP/getMembers.php
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
            PDGA_NUMBER, 
            MEMBER_FULL_NAME, 
            MEMBER_LAT, 
            MEMBER_LON, 
            MEMBER_STATE_PROV,
            COUNTRY_ID
        FROM MEMBER
    ");
    $members = $stmt->fetchAll(PDO::FETCH_ASSOC);

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $row['MEMBER_LAT'] = floatval($row['MEMBER_LAT']);
        $row['MEMBER_LON'] = floatval($row['MEMBER_LON']);
        $members[] = $row;
    }
    echo json_encode($members);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Query failed: ' . $e->getMessage()]);
}
?>