# Guia de Deploy no Render

Este guia explica como fazer o deploy do Jogo de Futebol 2D na plataforma Render.

## 📋 Pré-requisitos

1. Conta no [Render](https://render.com)
2. Conta no [Neon Database](https://neon.tech) (já configurada)
3. Repositório Git (GitHub, GitLab ou Bitbucket)
4. Código do projeto já commitado no repositório

## 🚀 Passo a Passo

### 1. Preparar o Repositório

Certifique-se de que todos os arquivos estão commitados:

```bash
git add .
git commit -m "Preparando para deploy no Render"
git push origin main
```

### 2. Criar Novo Web Service no Render

1. Acesse [Render Dashboard](https://dashboard.render.com)
2. Clique em **"New +"** → **"Web Service"**
3. Conecte seu repositório (GitHub/GitLab/Bitbucket)
4. Selecione o repositório do projeto

### 3. Configurar o Serviço

#### Configurações Básicas:
- **Name:** `jogo-futebol-2d` (ou o nome que preferir)
- **Environment:** `PHP`
- **Region:** Escolha a região mais próxima (ex: `Oregon (US West)`)
- **Branch:** `main` (ou sua branch principal)

#### Build & Deploy:
- **Build Command:** (deixe vazio - não é necessário para PHP)
- **Start Command:** 
  ```
  php -S 0.0.0.0:$PORT -t .
  ```
  Ou se preferir usar Apache:
  ```
  apache2-foreground
  ```

#### Environment Variables:
Não é necessário adicionar variáveis de ambiente, pois as credenciais do banco já estão no código.

### 4. Configurar o Banco de Dados

O banco de dados PostgreSQL já está configurado no Neon Database. As credenciais estão em `config/database.php`.

**Importante:** Certifique-se de que:
- O banco de dados está acessível publicamente
- As tabelas foram criadas (execute o script `db.sql` no Neon)

### 5. Executar Script SQL

1. Acesse o painel do Neon Database
2. Vá para a seção SQL Editor
3. Execute o conteúdo do arquivo `db.sql`:
   ```sql
   -- Copie e cole todo o conteúdo de db.sql aqui
   ```

### 6. Deploy

1. Clique em **"Create Web Service"**
2. O Render começará a fazer o build e deploy automaticamente
3. Aguarde o processo concluir (geralmente 2-5 minutos)

### 7. Verificar o Deploy

Após o deploy, você receberá uma URL como:
```
https://jogo-futebol-2d.onrender.com
```

Teste os seguintes endpoints:
- `https://seu-app.onrender.com/` - Página inicial
- `https://seu-app.onrender.com/login.html` - Página de login
- `https://seu-app.onrender.com/api/test_connection.php` - Teste de conexão

## 🔧 Configurações Adicionais

### Custom Domain (Opcional)

1. No dashboard do Render, vá em **Settings**
2. Clique em **Custom Domains**
3. Adicione seu domínio
4. Configure os registros DNS conforme instruções

### Auto-Deploy

Por padrão, o Render faz deploy automático a cada push no branch principal. Para desabilitar:
1. Vá em **Settings**
2. Desmarque **"Auto-Deploy"**

### Health Check

O Render verifica automaticamente se o serviço está funcionando. O health check está configurado para `/index.html`.

## 🐛 Solução de Problemas

### Erro 500 - Internal Server Error

1. Verifique os logs no dashboard do Render
2. Confirme que o banco de dados está acessível
3. Teste a conexão: `https://seu-app.onrender.com/api/test_connection.php`

### Erro de Conexão com Banco

1. Verifique se o Neon Database permite conexões externas
2. Confirme as credenciais em `config/database.php`
3. Teste a conexão diretamente no Neon

### Arquivos não encontrados (404)

1. Verifique se todos os arquivos foram commitados
2. Confirme que o `.htaccess` está na raiz do projeto
3. Verifique os logs de build no Render

### PHP não encontrado

1. Certifique-se de que selecionou **Environment: PHP**
2. O Render suporta PHP 7.4, 8.0, 8.1, 8.2
3. Verifique se a extensão PDO está habilitada (já está por padrão)

## 📝 Estrutura de Arquivos

```
projeto/
├── api/              # APIs PHP
├── config/           # Configurações
├── css/              # Estilos
├── js/               # JavaScript
├── docs/             # Documentação
├── .htaccess         # Configurações Apache
├── render.yaml       # Configuração Render (opcional)
├── index.html        # Página inicial
├── login.html        # Página de login
├── game.html         # Página do jogo
└── db.sql            # Script SQL
```

## 🔒 Segurança

**IMPORTANTE:** As credenciais do banco estão hardcoded no código. Para produção, considere:

1. Usar variáveis de ambiente do Render
2. Atualizar `config/database.php` para ler de variáveis de ambiente:
   ```php
   define('DB_HOST', getenv('DB_HOST') ?: 'ep-frosty-recipe...');
   define('DB_USER', getenv('DB_USER') ?: 'neondb_owner');
   define('DB_PASS', getenv('DB_PASS') ?: 'npg_VSZBhUm4ox2a');
   ```

3. Adicionar as variáveis no Render Dashboard → Environment

## 📊 Monitoramento

O Render fornece:
- Logs em tempo real
- Métricas de uso
- Status do serviço
- Histórico de deploys

Acesse tudo isso no dashboard do seu serviço.

## 🎉 Pronto!

Seu jogo está no ar! Compartilhe a URL com seus amigos e divirta-se!


