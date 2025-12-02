# Guia de Instalação - Jogo de Futebol 2D

## Requisitos

- Servidor web (Apache, Nginx ou similar)
- PHP 7.0 ou superior
- PostgreSQL (banco de dados Neon já configurado)
- Extensão PDO com suporte a PostgreSQL habilitada no PHP

## Passo a Passo

### 1. Configurar o Banco de Dados PostgreSQL

O banco de dados já está configurado no Neon Database. As credenciais estão em `config/database.php`.

1. Execute o script SQL no seu cliente PostgreSQL ou no painel do Neon:
   - Copie o conteúdo do arquivo `db.sql`
   - Execute no banco de dados `neondb`

2. Ou use um cliente PostgreSQL como pgAdmin, DBeaver, ou via linha de comando:
```bash
psql "postgresql://neondb_owner:npg_VSZBhUm4ox2a@ep-frosty-recipe-ad4uzvcf-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require"
```

### 2. Verificar a Conexão

A conexão já está configurada em `config/database.php` com as credenciais do Neon Database.

Para testar a conexão, acesse:
```
http://localhost/seu-projeto/api/test_connection.php
```

### 3. Configurar o Servidor Web

#### Apache
- Certifique-se de que o módulo `mod_rewrite` está habilitado
- O arquivo `.htaccess` já está configurado

#### Nginx
Adicione ao seu arquivo de configuração:
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

### 4. Verificar Permissões

Certifique-se de que o PHP tem permissão para:
- Ler arquivos na pasta do projeto
- Conectar ao banco de dados MySQL

### 5. Testar a Conexão

Acesse no navegador:
```
http://localhost/seu-projeto/api/login.php
```

Se aparecer um erro JSON sobre método não permitido, está funcionando!

### 6. Estrutura do Banco de Dados PostgreSQL

O banco contém apenas **nome** e **email** na tabela `usuarios`:

```sql
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ultimo_acesso TIMESTAMP NULL DEFAULT NULL
);
```

**Nota:** O campo `time` (vermelho/azul) é salvo apenas no localStorage do navegador, não no banco de dados.

### 7. Credenciais do Banco de Dados

O banco está hospedado no **Neon Database** (PostgreSQL na nuvem):
- **Host:** ep-frosty-recipe-ad4uzvcf-pooler.c-2.us-east-1.aws.neon.tech
- **Database:** neondb
- **SSL:** Obrigatório (já configurado)

## Solução de Problemas

### Erro de Conexão
- Verifique se o MySQL está rodando
- Confirme as credenciais em `config/database.php`
- Teste a conexão manualmente

### Erro 404 nas APIs
- Verifique se o servidor web está configurado corretamente
- Confirme que os arquivos PHP estão na pasta `api/`

### CORS Errors
- As APIs já têm headers CORS configurados
- Se persistir, verifique as configurações do servidor

## Modo Offline

Se o servidor não estiver disponível, o jogo funciona em modo offline usando apenas localStorage. Os dados não serão salvos no banco neste caso.

