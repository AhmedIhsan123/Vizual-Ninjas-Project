<?php
// Database connection settings
$host = 'localhost';
$db   = 'allenrgr_travel-data';
$user = 'allenrgr';
$pass = 'eVV2Q4@O7c@eu8';
$charset = 'utf8mb4';

// Data Source Name
$dsn = "mysql:host=$host;dbname=$db;charset=$charset";

// PDO options for better security and error reporting
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION, // Throw exceptions on errors
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,       // Fetch associative arrays by default
    PDO::ATTR_EMULATE_PREPARES   => false,                  // Use real prepared statements
];

try {
    // Create and export the PDO object
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
    // Handle connection errors gracefully
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed']);
    exit;
}