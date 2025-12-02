<?php
/**
 * API para verificar sessão do usuário
 * Retorna apenas nome e email do banco de dados PostgreSQL
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../config/database.php';

session_start();

function sendResponse($success, $message, $data = null, $statusCode = 200) {
    http_response_code($statusCode);
    echo json_encode([
        'success' => $success,
        'message' => $message,
        'data' => $data
    ], JSON_UNESCAPED_UNICODE);
    exit();
}

// Verificar se há dados de sessão no localStorage (via parâmetro)
$userId = isset($_GET['user_id']) ? intval($_GET['user_id']) : null;

if ($userId) {
    $pdo = getDatabaseConnection();
    if ($pdo) {
        try {
            // Retornar apenas nome e email do banco
            $stmt = $pdo->prepare("SELECT id, nome, email FROM usuarios WHERE id = ?");
            $stmt->execute([$userId]);
            $usuario = $stmt->fetch();
            
            if ($usuario) {
                sendResponse(true, 'Sessão válida', ['usuario' => $usuario], 200);
            } else {
                sendResponse(false, 'Usuário não encontrado', null, 404);
            }
        } catch (PDOException $e) {
            sendResponse(false, 'Erro ao verificar sessão', null, 500);
        }
    } else {
        sendResponse(false, 'Erro de conexão', null, 500);
    }
} else {
    sendResponse(false, 'Sessão não encontrada', null, 401);
}

?>
