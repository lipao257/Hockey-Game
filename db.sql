-- Banco de dados para o Jogo de Futebol 2D
-- PostgreSQL (Neon Database)
-- Execute este script no PostgreSQL

-- Tabela de usuários (apenas nome e email)
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ultimo_acesso TIMESTAMP NULL DEFAULT NULL
);

-- Criar índice no email para melhor performance
CREATE INDEX IF NOT EXISTS idx_email ON usuarios(email);

-- Tabela de pontuações (opcional - para histórico)
CREATE TABLE IF NOT EXISTS pontuacoes (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL,
    pontos INTEGER NOT NULL DEFAULT 0,
    vitorias INTEGER NOT NULL DEFAULT 0,
    derrotas INTEGER NOT NULL DEFAULT 0,
    empates INTEGER NOT NULL DEFAULT 0,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Criar índice no usuario_id para melhor performance
CREATE INDEX IF NOT EXISTS idx_usuario_pontuacao ON pontuacoes(usuario_id);

-- Comentários nas tabelas
COMMENT ON TABLE usuarios IS 'Tabela de usuários do jogo - contém apenas nome e email';
COMMENT ON COLUMN usuarios.id IS 'ID único do usuário';
COMMENT ON COLUMN usuarios.nome IS 'Nome do usuário (3-50 caracteres)';
COMMENT ON COLUMN usuarios.email IS 'E-mail único do usuário';
COMMENT ON COLUMN usuarios.data_cadastro IS 'Data e hora do cadastro';
COMMENT ON COLUMN usuarios.ultimo_acesso IS 'Data e hora do último acesso';
