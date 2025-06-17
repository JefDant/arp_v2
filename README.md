# Sistema de Gestão de Atas

Sistema web para gestão de atas, contratos, empenhos e pagamentos.

## 🚀 Tecnologias Utilizadas

### Frontend
- HTML5
- CSS3
- JavaScript
- Bootstrap 5

### Backend
- Node.js
- Express.js
- MySQL
- JWT para autenticação

### Infraestrutura
- Docker
- Docker Compose

## 📋 Pré-requisitos

- Docker
- Docker Compose

## 🔧 Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/arp_v2.git
cd arp_v2
```

2. Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:
```env
# MySQL
MYSQL_ROOT_PASSWORD=root_password
MYSQL_DATABASE=arp_db
MYSQL_USER=arp_user
MYSQL_PASSWORD=arp_password

# JWT
JWT_SECRET=your_jwt_secret_key_here

# Node.js
NODE_ENV=development
PORT=3000
```

3. Inicie os containers:
```bash
docker-compose up -d
```

4. Acesse o sistema:
- Frontend: http://localhost
- Backend API: http://localhost:3000

## 👥 Usuários Iniciais

O sistema é inicializado com um usuário administrador:
- Email: admin@sistema.com
- Senha: admin123

## 🔐 Níveis de Acesso

1. ADMIN
   - Acesso total ao sistema
   - Pode cadastrar entidades e usuários master

2. MASTER
   - Acesso total dentro da sua entidade
   - Pode cadastrar usuários comuns

3. USER
   - Acesso básico para visualização e lançamentos

## 📚 Funcionalidades

### Cadastros
- Entidades
- Usuários
- Modalidades
- Fornecedores
- Setores

### Lançamentos
- Atas/Contratos
- Aditivos
- Empenhos
- Pagamentos

### Relatórios
- Atas
- Aditivos
- Empenhos
- Pagamentos

## 🔍 Estrutura do Projeto

```
.
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── services/
│   ├── middleware/
│   ├── config/
│   ├── database/
│   ├── models/
│   ├── server.js
│   └── Dockerfile
├── frontend/
│   ├── login.html
│   ├── dashboard.html
│   └── ...
├── docker-compose.yml
└── .env
```

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes. 