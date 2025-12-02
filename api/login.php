<?php
/**
 * API de Login - Processa requisições de login e registro
 * Banco de dados PostgreSQL: apenas nome e email
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Permitir requisições OPTIONS (CORS preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../config/database.php';

/**
 * Resposta JSON padronizada
 */
function sendResponse($success, $message, $data = null, $statusCode = 200) {
    http_response_code($statusCode);
    echo json_encode([
        'success' => $success,
        'message' => $message,
        'data' => $data
    ], JSON_UNESCAPED_UNICODE);
    exit();
}

/**
 * Validação de dados de entrada
 * Valida apenas nome e email (time não é salvo no banco)
 */
function validateInput($data) {
    $errors = [];
    
    // Validar nome
    if (empty($data['nome']) || strlen(trim($data['nome'])) < 3) {
        $errors['nome'] = 'Nome deve ter pelo menos 3 caracteres';
    } elseif (strlen(trim($data['nome'])) > 50) {
        $errors['nome'] = 'Nome deve ter no máximo 50 caracteres';
    }
    
    // Validar email
    if (empty($data['email'])) {
        $errors['email'] = 'E-mail é obrigatório';
    } elseif (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
        $errors['email'] = 'E-mail inválido';
    }
    
    // Time não precisa ser validado aqui (é apenas para localStorage)
    
    return $errors;
}

// Processar apenas requisições POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse(false, 'Método não permitido', null, 405);
}

// Obter dados JSON do corpo da requisição
$input = file_get_contents('php://input');
$data = json_decode($input, true);

// Se não conseguir decodificar JSON, tentar dados do formulário
if (json_last_error() !== JSON_ERROR_NONE) {
    $data = $_POST;
}

// Validar dados
$errors = validateInput($data);
if (!empty($errors)) {
    sendResponse(false, 'Dados inválidos', ['errors' => $errors], 400);
}

// Sanitizar dados
$nome = trim($data['nome']);
$email = strtolower(trim($data['email']));
// Time não é salvo no banco, apenas no localStorage do cliente

// Conectar ao banco de dados
$pdo = getDatabaseConnection();
if (!$pdo) {
    sendResponse(false, 'Erro ao conectar com o banco de dados', null, 500);
}

try {
    // Verificar se o usuário já existe
    // PostgreSQL com PDO aceita ? como placeholder
    $stmt = $pdo->prepare("SELECT id, nome, email FROM usuarios WHERE email = ?");
    $stmt->execute([$email]);
    $usuario = $stmt->fetch();
    
    if ($usuario) {
        // Usuário existe - atualizar nome e último acesso
        $stmt = $pdo->prepare("
            UPDATE usuarios 
            SET nome = ?, ultimo_acesso = CURRENT_TIMESTAMP 
            WHERE email = ?
        ");
        $stmt->execute([$nome, $email]);
        
        $usuarioId = $usuario['id'];
        $usuario['nome'] = $nome;
    } else {
        // Novo usuário - criar registro (apenas nome e email)
        // PostgreSQL usa RETURNING para obter o ID inserido
        $stmt = $pdo->prepare("
            INSERT INTO usuarios (nome, email, ultimo_acesso) 
            VALUES (?, ?, CURRENT_TIMESTAMP)
            RETURNING id
        ");
        $stmt->execute([$nome, $email]);
        $result = $stmt->fetch();
        $usuarioId = $result['id'];
        
        // Criar registro de pontuação inicial
        $stmt = $pdo->prepare("
            INSERT INTO pontuacoes (usuario_id) 
            VALUES (?)
        ");
        $stmt->execute([$usuarioId]);
        
        $usuario = [
            'id' => $usuarioId,
            'nome' => $nome,
            'email' => $email
        ];
    }
    
    // Retornar sucesso (time será salvo apenas no localStorage do cliente)
    sendResponse(true, 'Login realizado com sucesso', [
        'usuario' => $usuario
    ], 200);
    
} catch (PDOException $e) {
    error_log("Erro no banco de dados: " . $e->getMessage());
    sendResponse(false, 'Erro ao processar login. Tente novamente.', null, 500);
}

?>
