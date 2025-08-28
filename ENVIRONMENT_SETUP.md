# 🔧 Configuração de Variáveis de Ambiente

Este documento explica como configurar as variáveis de ambiente necessárias para executar a **Ceuzinho API**.

## 📋 Variáveis Obrigatórias

### 1. **Banco de Dados**
```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/ceuzinho_db"
```
- **Descrição**: URL de conexão com PostgreSQL
- **Formato**: `postgresql://usuario:senha@host:porta/nome_do_banco`
- **Exemplo**: `postgresql://admin:minhasenha123@localhost:5432/ceuzinho_db`

### 2. **JWT Secret**
```env
JWT_SECRET="sua-chave-secreta-jwt-super-segura"
```
- **Descrição**: Chave para assinatura dos tokens JWT
- **Requisitos**: Mínimo 32 caracteres, deve ser única e segura
- **Exemplo**: `JWT_SECRET="ceuzinho-api-2024-super-secret-key-32-chars"`

### 3. **Email (Nodemailer)**
```env
NODEMAILER_EMAIL="seu-email@gmail.com"
NODEMAILER_PWD="sua-senha-de-app-gmail"
```
- **Descrição**: Credenciais para envio de emails
- **Requisitos**: 
  - Ative verificação em duas etapas no Gmail
  - Gere uma senha de aplicativo
  - Não use a senha normal da conta

### 4. **URLs**
```env
URL_DOC_PROD="https://api.seudominio.com/"
URL_DOC_DEV="http://localhost:3000/"
```
- **Descrição**: URLs base para produção e desenvolvimento
- **Uso**: Para gerar links de arquivos e documentos

### 5. **Servidor**
```env
PORT=3000
NODE_ENV="development"
```
- **PORT**: Porta onde o servidor irá rodar
- **NODE_ENV**: Ambiente de execução (`development`, `production`, `test`)

## 📝 Arquivo .env Completo

Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:

```env
# ===========================================
# CEUZINHO API - VARIÁVEIS DE AMBIENTE
# ===========================================

# Banco de Dados
DATABASE_URL="postgresql://usuario:senha@localhost:5432/ceuzinho_db"

# JWT
JWT_SECRET="sua-chave-secreta-jwt-super-segura-com-pelo-menos-32-caracteres"

# Email (Nodemailer)
NODEMAILER_EMAIL="seu-email@gmail.com"
NODEMAILER_PWD="sua-senha-de-app-gmail"

# URLs
URL_DOC_PROD="https://api.seudominio.com/"
URL_DOC_DEV="http://localhost:3000/"

# Servidor
PORT=3000
NODE_ENV="development"
```

## 🔐 Configuração do Gmail

### Passo a Passo:

1. **Acesse sua conta Google**
   - Vá para [myaccount.google.com](https://myaccount.google.com)

2. **Ative verificação em duas etapas**
   - Segurança → Verificação em duas etapas
   - Siga as instruções para ativar

3. **Gere senha de aplicativo**
   - Segurança → Senhas de app
   - Selecione "App" e "Outro (nome personalizado)"
   - Digite "Ceuzinho API"
   - Copie a senha gerada (16 caracteres)

4. **Configure no .env**
   ```env
   NODEMAILER_EMAIL="seu-email@gmail.com"
   NODEMAILER_PWD="senha-de-16-caracteres-gerada"
   ```

## 🗄️ Configuração do PostgreSQL

### Instalação (Ubuntu/Debian):
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
```

### Criação do Banco:
```bash
# Acesse o PostgreSQL
sudo -u postgres psql

# Crie o usuário e banco
CREATE USER ceuzinho_user WITH PASSWORD 'sua_senha_segura';
CREATE DATABASE ceuzinho_db OWNER ceuzinho_user;
GRANT ALL PRIVILEGES ON DATABASE ceuzinho_db TO ceuzinho_user;
\q
```

### URL de Conexão:
```env
DATABASE_URL="postgresql://ceuzinho_user:sua_senha_segura@localhost:5432/ceuzinho_db"
```

## 🧪 Configuração para Testes

Para ambiente de testes, use:
```env
NODE_ENV="test"
DATABASE_URL="postgresql://usuario:senha@localhost:5432/ceuzinho_test"
```

## 🔒 Segurança

### Boas Práticas:

1. **Nunca commite o arquivo .env**
   - Adicione `.env` ao `.gitignore`
   - Use `.env.example` como template

2. **Use senhas fortes**
   - JWT_SECRET: mínimo 32 caracteres
   - Senhas de banco: mínimo 12 caracteres

3. **Diferentes ambientes**
   - Use variáveis diferentes para dev/prod
   - Nunca use credenciais de produção em desenvolvimento

4. **Rotação de chaves**
   - Troque JWT_SECRET periodicamente
   - Monitore logs de acesso

## 🚨 Troubleshooting

### Erro de Conexão com Banco:
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```
**Solução**: Verifique se o PostgreSQL está rodando
```bash
sudo systemctl status postgresql
sudo systemctl start postgresql
```

### Erro de Email:
```
Error: Invalid login: 535 Incorrect authentication data
```
**Solução**: 
- Verifique se a verificação em duas etapas está ativa
- Use senha de aplicativo, não a senha normal
- Verifique se o email está correto

### Erro JWT:
```
Error: secretOrPrivateKey must have a value
```
**Solução**: Verifique se JWT_SECRET está definido no .env

## 📞 Suporte

Se encontrar problemas:
1. Verifique se todas as variáveis estão definidas
2. Confirme se os serviços (PostgreSQL, Gmail) estão funcionando
3. Verifique os logs do servidor
4. Abra uma issue no GitHub com detalhes do erro
