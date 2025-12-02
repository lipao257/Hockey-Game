<?php
/**
 * Script de teste de conexão com o banco de dados PostgreSQL
 * Acesse via navegador para testar: http://localhost/seu-projeto/api/test_connection.php
 */

header('Content-Type: application/json; charset=utf-8');

require_once '../config/database.php';

$result = [
    'status' => 'error',
    'message' => '',
    'details' => []
];

try {
    $pdo = getDatabaseConnection();
    
    if ($pdo) {
        $result['status'] = 'success';
        $result['message'] = 'Conexão estabelecida com sucesso!';
        
        // Testar query simples
        $stmt = $pdo->query("SELECT version() as version");
        $version = $stmt->fetch();
        $result['details']['postgresql_version'] = $version['version'];
        
        // Verificar se as tabelas existem
        $stmt = $pdo->query("
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name IN ('usuarios', 'pontuacoes')
        ");
        $tables = $stmt->fetchAll();
        $result['details']['tables'] = array_column($tables, 'table_name');
        
        // Contar usuários
        $stmt = $pdo->query("SELECT COUNT(*) as total FROM usuarios");
        $count = $stmt->fetch();
        $result['details']['total_usuarios'] = $count['total'];
        
    } else {
        $result['message'] = 'Falha ao conectar com o banco de dados';
    }
    
} catch (PDOException $e) {
    $result['message'] = 'Erro: ' . $e->getMessage();
    $result['details']['error_code'] = $e->getCode();
}

echo json_encode($result, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

?>


