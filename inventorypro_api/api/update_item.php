<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit;

require_once 'db.php';

$input = json_decode(file_get_contents('php://input'), true);
$id = isset($input['id']) ? (int)$input['id'] : null;
if (!$id) { http_response_code(400); echo json_encode(['error'=>'id required']); exit; }

$fields = [];
$params = [];
$allowed = ['name','sku','quantity','price','description'];
foreach ($allowed as $field) {
    if (isset($input[$field])) {
        $fields[] = "$field = ?";
        $params[] = $input[$field];
    }
}
if (empty($fields)) { echo json_encode(['success'=>false,'msg'=>'nothing to update']); exit; }
$params[] = $id;
$sql = "UPDATE items SET " . implode(', ', $fields) . " WHERE id = ?";
try {
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    echo json_encode(['success'=>true,'rows'=>$stmt->rowCount()]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error'=>$e->getMessage()]);
}
?>