# Quick Start - Deploy Rápido no Render

## ⚡ Deploy em 5 Minutos

### 1. Preparar Repositório (2 min)
```bash
git add .
git commit -m "Deploy no Render"
git push origin main
```

### 2. Criar Serviço no Render (2 min)
1. Acesse [render.com](https://render.com)
2. **New +** → **Web Service**
3. Conecte seu repositório
4. Configure:
   - **Name:** `jogo-futebol-2d`
   - **Environment:** `PHP`
   - **Start Command:** `php -S 0.0.0.0:$PORT -t .`

### 3. Executar SQL no Neon (1 min)
1. Acesse [neon.tech](https://neon.tech)
2. Abra o SQL Editor
3. Cole o conteúdo de `db.sql`
4. Execute

### 4. Deploy! 🚀
Clique em **Create Web Service** e aguarde!

## ✅ Teste Rápido

Após o deploy, teste:
- `https://seu-app.onrender.com/` → Deve redirecionar para login
- `https://seu-app.onrender.com/api/test_connection.php` → Deve retornar JSON com sucesso

## 🐛 Problema?

**Erro 500?**
- Verifique os logs no Render Dashboard
- Teste: `/api/test_connection.php`

**Erro de conexão?**
- Confirme que executou o `db.sql` no Neon
- Verifique as credenciais em `config/database.php`

## 📚 Documentação Completa

Para mais detalhes, veja:
- `RENDER_DEPLOY.md` - Guia completo
- `ESTRUTURA_PROJETO.md` - Estrutura de arquivos


