<?php
/**
 * Configuração de conexão com o banco de dados PostgreSQL (Neon)
 */

// Configurações do banco de dados PostgreSQL
define('DB_HOST', 'ep-frosty-recipe-ad4uzvcf-pooler.c-2.us-east-1.aws.neon.tech');
define('DB_NAME', 'neondb');
define('DB_USER', 'neondb_owner');
define('DB_PASS', 'npg_VSZBhUm4ox2a');
define('DB_PORT', '5432');
define('DB_CHARSET', 'utf8');

/**
 * Conecta ao banco de dados PostgreSQL
 * @return PDO|null Retorna a conexão PDO ou null em caso de erro
 */
function getDatabaseConnection() {
    try {
        // String de conexão PostgreSQL com SSL
        $dsn = sprintf(
            "pgsql:host=%s;port=%s;dbname=%s;sslmode=require",
            DB_HOST,
            DB_PORT,
            DB_NAME
        );
        
        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
            PDO::ATTR_PERSISTENT         => false,
        ];
        
        $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        return $pdo;
    } catch (PDOException $e) {
        error_log("Erro de conexão com o banco de dados: " . $e->getMessage());
        return null;
    }
}

/**
 * Verifica se a conexão com o banco está funcionando
 * @return bool
 */
function testDatabaseConnection() {
    $pdo = getDatabaseConnection();
    if ($pdo) {
        try {
            $pdo->query("SELECT 1");
            return true;
        } catch (PDOException $e) {
            return false;
        }
    }
    return false;
}

?>
