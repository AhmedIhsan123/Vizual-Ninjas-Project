<?php
header('Content-Type: application/json');

// Connect to the database
require 'db.php';

// Get the action from the query string
$action = $_GET['action'] ?? null;

switch ($action) {
    case 'get_event_averages':
        require 'handlers/get_event_averages.php';
        break;

    case 'get_tier_averages':
        require 'handlers/get_tier_averages.php';
        break;

    case 'event.php':
        require 'handlers/event.php';

    default:
        http_response_code(400);
        echo json_encode(['error' => 'Invalid or missing action']);
        break;
}

?>
