# Checklist de Deploy no Render

Use este checklist antes e depois do deploy para garantir que tudo está funcionando.

## ✅ Pré-Deploy

### Repositório
- [ ] Todos os arquivos estão commitados
- [ ] Código testado localmente
- [ ] Sem erros de sintaxe
- [ ] `.gitignore` configurado corretamente

### Banco de Dados
- [ ] Tabelas criadas no Neon Database
- [ ] Script `db.sql` executado com sucesso
- [ ] Conexão testada localmente
- [ ] Credenciais corretas em `config/database.php`

### Arquivos Essenciais
- [ ] `api/login.php` presente
- [ ] `api/check_session.php` presente
- [ ] `config/database.php` presente
- [ ] `.htaccess` na raiz
- [ ] `index.html`, `login.html`, `game.html` presentes

## ✅ Configuração no Render

### Serviço Web
- [ ] Repositório conectado
- [ ] Environment: PHP selecionado
- [ ] Start Command configurado: `php -S 0.0.0.0:$PORT -t .`
- [ ] Branch correto selecionado (main/master)

### Variáveis de Ambiente (Opcional)
- [ ] Se usar variáveis de ambiente, todas configuradas
- [ ] Valores corretos inseridos

## ✅ Pós-Deploy

### Testes Básicos
- [ ] URL do Render acessível
- [ ] Página inicial carrega
- [ ] Redirecionamento para login funciona
- [ ] Página de login exibe corretamente

### Testes de API
- [ ] `/api/test_connection.php` retorna JSON válido
- [ ] Conexão com banco funcionando
- [ ] Tabelas existem no banco

### Testes de Funcionalidade
- [ ] Formulário de login funciona
- [ ] Validação de campos funciona
- [ ] Login salva no banco de dados
- [ ] Redirecionamento para jogo funciona
- [ ] Jogo carrega corretamente
- [ ] Controles do jogo funcionam

### Testes de Responsividade
- [ ] Funciona em desktop
- [ ] Funciona em tablet
- [ ] Funciona em mobile
- [ ] Layout responsivo correto

## ✅ Segurança

- [ ] Credenciais não expostas no código (ou em variáveis de ambiente)
- [ ] `.htaccess` protegendo arquivos sensíveis
- [ ] APIs com validação de entrada
- [ ] CORS configurado corretamente

## ✅ Performance

- [ ] Páginas carregam rapidamente
- [ ] APIs respondem em tempo razoável
- [ ] Sem erros no console do navegador
- [ ] Sem erros nos logs do Render

## 🐛 Problemas Comuns

### Se algo não funcionar:

1. **Erro 500**
   - [ ] Verificar logs no Render Dashboard
   - [ ] Testar conexão com banco
   - [ ] Verificar sintaxe PHP

2. **Erro de Conexão**
   - [ ] Verificar credenciais do banco
   - [ ] Confirmar que tabelas existem
   - [ ] Testar conexão diretamente

3. **404 Not Found**
   - [ ] Verificar se arquivos foram commitados
   - [ ] Confirmar estrutura de pastas
   - [ ] Verificar `.htaccess`

4. **JavaScript não funciona**
   - [ ] Verificar console do navegador
   - [ ] Confirmar que arquivos JS foram carregados
   - [ ] Verificar caminhos dos arquivos

## 📊 Monitoramento

Após deploy bem-sucedido:
- [ ] Adicionar ao monitoramento (opcional)
- [ ] Configurar alertas (opcional)
- [ ] Documentar URL de produção
- [ ] Compartilhar com equipe/usuários

## 🎉 Deploy Completo!

Se todos os itens acima estão marcados, seu deploy está completo e funcionando!


