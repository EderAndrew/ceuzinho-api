# 🏫 Ceuzinho API

Uma API RESTful robusta para gerenciamento de sistema escolar, desenvolvida com TypeScript, Express.js e Prisma ORM.

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Uso](#uso)
- [Endpoints da API](#endpoints-da-api)
- [Autenticação](#autenticação)
- [Contribuição](#contribuição)
- [Licença](#licença)

## 🎯 Sobre o Projeto

A **Ceuzinho API** é uma solução completa para gerenciamento de sistemas escolares, oferecendo funcionalidades para:

- **Gestão de Usuários**: Cadastro, autenticação e recuperação de senhas
- **Agendamentos**: Sistema de horários e salas de aula
- **Gestão de Crianças**: Cadastro e acompanhamento de alunos
- **Sistema de Impedimentos**: Solicitações de troca de horários
- **Posts e Comunicações**: Sistema de comunicação interna
- **Upload de Arquivos**: Gerenciamento de documentos e imagens

## ✨ Funcionalidades

### 🔐 Autenticação e Usuários
- Cadastro de usuários com geração automática de senha
- Login com JWT
- Recuperação de senha via email com códigos OTC
- Upload de avatar com processamento de imagem
- Gestão de perfis e permissões

### 📅 Agendamentos
- Criação e gerenciamento de horários
- Configuração de períodos (Manhã, Tarde, Noite)
- Associação de professores e salas
- Upload de documentos para agendamentos
- Validação de datas e conflitos

### 👶 Gestão de Crianças
- Cadastro de alunos com informações completas
- Upload de fotos dos alunos
- Acompanhamento de questões e problemas
- Relacionamento com responsáveis

### ⚠️ Sistema de Impedimentos
- Solicitação de troca de horários
- Aprovação/rejeição de solicitações
- Notificações automáticas
- Histórico de solicitações

### 📝 Posts e Comunicações
- Sistema de posts internos
- Comunicação entre usuários
- Gestão de conteúdo

## 🛠️ Tecnologias Utilizadas

### Backend
- **Node.js** - Runtime JavaScript
- **TypeScript** - Linguagem de programação
- **Express.js** - Framework web
- **Prisma ORM** - ORM para banco de dados
- **PostgreSQL** - Banco de dados principal

### Autenticação e Segurança
- **JWT** - Autenticação baseada em tokens
- **bcrypt** - Hash de senhas
- **Helmet** - Segurança de headers HTTP
- **CORS** - Cross-Origin Resource Sharing

### Processamento de Arquivos
- **Sharp** - Processamento de imagens
- **Formidable** - Upload de arquivos
- **Multer** - Middleware de upload

### Validação e Utilitários
- **Zod** - Validação de schemas
- **date-fns** - Manipulação de datas
- **Nodemailer** - Envio de emails

### Desenvolvimento
- **TSX** - Execução de TypeScript
- **Jest** - Framework de testes
- **pnpm** - Gerenciador de pacotes

## 📁 Estrutura do Projeto

```
ceuzinho-api/
├── src/
│   ├── core/                 # Configurações core
│   ├── lib/                  # Utilitários e helpers
│   │   ├── types/           # Tipos TypeScript
│   │   └── utils.ts         # Funções utilitárias
│   ├── middlewares/         # Middlewares Express
│   ├── modules/             # Módulos da aplicação
│   │   ├── users/          # Gestão de usuários
│   │   ├── schedule/       # Agendamentos
│   │   ├── recovery/       # Recuperação de senha
│   │   ├── kids/           # Gestão de crianças
│   │   ├── impediment/     # Sistema de impedimentos
│   │   └── posts/          # Posts e comunicações
│   ├── routes/             # Rotas da API
│   └── server.ts           # Servidor principal
├── prisma/
│   ├── migrations/         # Migrações do banco
│   └── schema.prisma       # Schema do banco
├── public/                 # Arquivos estáticos
│   ├── files/             # Documentos
│   └── media/             # Imagens
└── docs/                  # Documentação
```

## 📋 Pré-requisitos

- **Node.js** (versão 18 ou superior)
- **pnpm** (versão 8 ou superior)
- **PostgreSQL** (versão 12 ou superior)
- **Git**

## 🚀 Instalação

1. **Clone o repositório**
   ```bash
   git clone https://github.com/seu-usuario/ceuzinho-api.git
   cd ceuzinho-api
   ```

2. **Instale as dependências**
   ```bash
   pnpm install
   ```

3. **Configure as variáveis de ambiente**
   ```bash
   cp .env.example .env
   ```

4. **Configure o banco de dados**
   ```bash
   # Gere o cliente Prisma
   npx prisma generate
   
   # Execute as migrações
   npx prisma migrate deploy
   ```

## ⚙️ Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

> 📖 **Documentação Completa**: Veja [ENVIRONMENT_SETUP.md](ENVIRONMENT_SETUP.md) para instruções detalhadas de configuração.

```env
# Banco de Dados
DATABASE_URL="postgresql://usuario:senha@localhost:5432/ceuzinho_db"

# JWT
JWT_SECRET="sua-chave-secreta-jwt"

# Email (Nodemailer)
NODEMAILER_EMAIL="seu-email@gmail.com"
NODEMAILER_PWD="sua-senha-de-app"

# URLs de Produção/Desenvolvimento
URL_DOC_PROD="https://api.seudominio.com/"
URL_DOC_DEV="http://localhost:3000/"

# Porta do Servidor
PORT=3000

# Ambiente
NODE_ENV="development"
```

### Configuração do Email

Para usar o sistema de envio de emails, configure um email Gmail com:

1. Ative a verificação em duas etapas
2. Gere uma senha de aplicativo
3. Use essas credenciais no `.env`

## 🏃‍♂️ Uso

### Desenvolvimento
```bash
# Inicia o servidor em modo desenvolvimento
pnpm dev
```

### Produção
```bash
# Compila o TypeScript
pnpm build

# Inicia o servidor em produção
pnpm prod
```

### Deploy
```bash
# Script de deploy completo
pnpm deploy
```

## 📡 Endpoints da API

### Base URL
```
http://localhost:3000/api
```

### 🔐 Autenticação (`/users`)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `POST` | `/signup` | Cadastro de usuário |
| `POST` | `/signin` | Login de usuário |
| `GET` | `/me` | Dados do usuário logado |
| `GET` | `/all` | Lista todos os usuários |
| `PUT` | `/edit/:id` | Edita usuário |
| `PUT` | `/disable/:id` | Desabilita/abilita usuário |
| `PUT` | `/change-password` | Altera senha |
| `POST` | `/upload-avatar/:id` | Upload de avatar |

### 🔄 Recuperação de Senha (`/recovery`)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `POST` | `/sendotc` | Envia código OTC |
| `POST` | `/verifyotc` | Verifica código OTC |

### 📅 Agendamentos (`/schedules`)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `POST` | `/create` | Cria agendamento |
| `GET` | `/all` | Lista agendamentos |
| `PUT` | `/update/:id` | Atualiza agendamento |
| `DELETE` | `/delete/:id` | Remove agendamento |

### ⚠️ Impedimentos (`/impediments`)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `POST` | `/create/:userId` | Cria solicitação |
| `GET` | `/all` | Lista solicitações |
| `PUT` | `/update/:id` | Atualiza solicitação |
| `DELETE` | `/cancel/:id` | Cancela solicitação |

### 👶 Crianças (`/kids`)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `POST` | `/create` | Cadastra criança |
| `GET` | `/all` | Lista crianças |
| `PUT` | `/update/:id` | Atualiza criança |
| `DELETE` | `/delete/:id` | Remove criança |

## 🔐 Autenticação

A API utiliza **JWT (JSON Web Tokens)** para autenticação.

### Como usar:

1. **Faça login** via `POST /api/users/signin`
2. **Receba o token** na resposta
3. **Inclua o token** no header das requisições:
   ```
   Authorization: Bearer <seu-token-jwt>
   ```

### Exemplo de uso:

```bash
curl -X POST http://localhost:3000/api/users/signin \
  -H "Content-Type: application/json" \
  -d '{"email": "usuario@email.com", "password": "senha123"}'

# Resposta inclui o token
{
  "message": "Acesso permitido.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

# Use o token em requisições autenticadas
curl -X GET http://localhost:3000/api/users/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## 📊 Banco de Dados

O projeto utiliza **PostgreSQL** com **Prisma ORM**. Principais entidades:

- **User**: Usuários do sistema
- **Schedule**: Agendamentos
- **Kid**: Crianças/alunos
- **Impediment**: Solicitações de troca
- **Recovery**: Recuperação de senha
- **Post**: Posts e comunicações

### Comandos úteis:

```bash
# Visualizar dados no Prisma Studio
npx prisma studio

# Criar nova migração
npx prisma migrate dev --name nome-da-migracao

# Resetar banco de dados
npx prisma migrate reset
```

## 🧪 Testes

```bash
# Executar testes
pnpm test

# Executar testes em modo watch
pnpm test:watch
```

## 📝 Exemplos de Uso

### Cadastro de Usuário
```bash
curl -X POST http://localhost:3000/api/users/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@email.com",
    "phone": "(11) 99999-9999",
    "role": "TEACHER",
    "sex": "MASCULINO"
  }'
```

### Criação de Agendamento
```bash
curl -X POST http://localhost:3000/api/schedules/create \
  -H "Authorization: Bearer <token>" \
  -F "date=2024-01-15" \
  -F "period=MANHÃ" \
  -F "scheduleType=AULA" \
  -F "room=SALA_01" \
  -F "tema=Matemática Básica" \
  -F "createdBy=1" \
  -F "teatcherOne=2"
```

## 🤝 Contribuição

1. **Fork** o projeto
2. **Crie** uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. **Push** para a branch (`git push origin feature/AmazingFeature`)
5. **Abra** um Pull Request

### Padrões de Código

- Use **TypeScript** para todo o código
- Siga os padrões de **ESLint** configurados
- Escreva **testes** para novas funcionalidades
- Documente **novos endpoints**
- Use **commits semânticos**

## 📄 Licença

Este projeto está sob a licença **ISC**. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📚 Documentação Adicional

- **[Configuração de Ambiente](ENVIRONMENT_SETUP.md)** - Guia completo para configuração das variáveis de ambiente
- **[Notas de Refatoração](REFACTORING_NOTES.md)** - Documentação das melhorias implementadas no código
- **[Prisma Schema](prisma/schema.prisma)** - Estrutura do banco de dados

## 📞 Suporte

- **Email**: suporte@ceuzinho.com
- **Documentação**: [docs.ceuzinho.com](https://docs.ceuzinho.com)
- **Issues**: [GitHub Issues](https://github.com/seu-usuario/ceuzinho-api/issues)

---

**Desenvolvido com ❤️ pela equipe Ceuzinho**