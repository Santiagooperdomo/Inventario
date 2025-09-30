<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

require_once 'db.php';

$input = json_decode(file_get_contents('php://input'), true);

$name = $input['name'] ?? null;
$sku = $input['sku'] ?? null;
$quantity = isset($input['quantity']) ? (int)$input['quantity'] : 0;
$price = isset($input['price']) ? (float)$input['price'] : 0;
$description = $input['description'] ?? null;

if (!$name) {
    http_response_code(400);
    echo json_encode(['error' => 'Name is required']);
    exit;
}

try {
    $stmt = $pdo->prepare("INSERT INTO items (name, sku, quantity, price, description) VALUES (?, ?, ?, ?, ?)");
    $stmt->execute([$name, $sku, $quantity, $price, $description]);
    $id = $pdo->lastInsertId();
    echo json_encode(['success' => true, 'id' => $id]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>