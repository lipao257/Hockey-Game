# Estrutura do Projeto para Render

## 📁 Organização de Pastas

```
Jogo/
├── api/                          # APIs PHP (Backend)
│   ├── login.php                 # API de login/registro
│   ├── check_session.php         # API de verificação de sessão
│   └── test_connection.php       # Teste de conexão com banco
│
├── config/                        # Configurações
│   └── database.php              # Configuração do banco PostgreSQL
│
├── css/                          # Estilos CSS
│   ├── login.css                 # Estilos da página de login
│   └── style.css                 # Estilos do jogo
│
├── js/                           # JavaScript
│   ├── login.js                  # Lógica de login
│   ├── game.js                   # Lógica do jogo
│   └── script.js                 # (arquivo antigo - pode remover)
│
├── docs/                         # Documentação
│   ├── deploy/                   # Instruções de deploy
│   │   ├── RENDER_DEPLOY.md      # Guia de deploy no Render
│   │   └── ESTRUTURA_PROJETO.md  # Este arquivo
│   └── ...
│
├── .htaccess                     # Configurações Apache
├── render.yaml                    # Configuração Render (opcional)
├── index.html                     # Página inicial (redireciona)
├── login.html                     # Página de login
├── game.html                      # Página do jogo
├── db.sql                         # Script SQL para criar tabelas
├── README.md                      # Documentação principal
└── INSTALACAO.md                  # Guia de instalação local
```

## 🔄 Fluxo de Requisições

### 1. Página Inicial
```
Usuário → index.html → Redireciona para login.html
```

### 2. Login
```
Usuário → login.html → js/login.js → api/login.php → PostgreSQL (Neon)
```

### 3. Jogo
```
Usuário → game.html → js/game.js → Canvas API
```

## 📦 Arquivos Essenciais para Deploy

### Obrigatórios:
- ✅ `api/` - Todas as APIs PHP
- ✅ `config/database.php` - Configuração do banco
- ✅ `css/` - Todos os estilos
- ✅ `js/` - Todos os scripts JavaScript
- ✅ `.htaccess` - Configurações do servidor
- ✅ `index.html`, `login.html`, `game.html` - Páginas HTML

### Opcionais:
- `render.yaml` - Configuração específica do Render
- `docs/` - Documentação (não afeta o funcionamento)
- `db.sql` - Script SQL (já executado no Neon)

## 🔐 Arquivos Sensíveis

**NÃO commitar no Git:**
- ❌ Credenciais de banco em arquivos separados
- ❌ Chaves de API
- ❌ Logs de erro

**Já no código (considerar mover para env vars):**
- ⚠️ `config/database.php` - Contém credenciais do Neon

## 🚀 Comandos de Deploy

### Build Command:
```
(vazio - não necessário para PHP)
```

### Start Command:
```
php -S 0.0.0.0:$PORT -t .
```

Ou com Apache (se disponível):
```
apache2-foreground
```

## 📝 Checklist de Deploy

Antes de fazer deploy, verifique:

- [ ] Todos os arquivos estão commitados
- [ ] `.htaccess` está na raiz
- [ ] `config/database.php` tem as credenciais corretas
- [ ] Tabelas do banco foram criadas (db.sql executado)
- [ ] Teste local funcionando
- [ ] APIs respondendo corretamente
- [ ] Sem erros de sintaxe PHP
- [ ] Sem erros de JavaScript no console

## 🔍 Verificação Pós-Deploy

1. Acesse a URL do Render
2. Teste a página de login
3. Verifique a conexão: `/api/test_connection.php`
4. Teste o login completo
5. Verifique se o jogo carrega

## 📊 Estrutura de Dados

### Banco de Dados (PostgreSQL - Neon):
- **Tabela:** `usuarios`
  - `id` (SERIAL)
  - `nome` (VARCHAR 50)
  - `email` (VARCHAR 255, UNIQUE)
  - `data_cadastro` (TIMESTAMP)
  - `ultimo_acesso` (TIMESTAMP)

- **Tabela:** `pontuacoes` (opcional)
  - `id` (SERIAL)
  - `usuario_id` (INTEGER, FK)
  - `pontos`, `vitorias`, `derrotas`, `empates` (INTEGER)
  - `data_atualizacao` (TIMESTAMP)

### LocalStorage (Navegador):
- `userData` - Dados do usuário + time selecionado
- `isLoggedIn` - Status de autenticação
- `userId` - ID do usuário


