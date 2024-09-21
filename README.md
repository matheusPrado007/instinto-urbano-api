Aqui está o texto formatado em Markdown para a documentação da API "Instinto Urbano":


# Documentação da API - Instinto Urbano

## Descrição do Projeto
A API "Instinto Urbano" é uma aplicação backend desenvolvida em Node.js e Typescript. Ela permite armazenar e gerenciar dados de usuários e livros, integrando-se ao MongoDB e utilizando o Firebase para armazenar imagens. Os flipbooks dos escritores são armazenados no site FlipHTML5.

**Link no GitHub:** [Instinto Urbano API](https://github.com/matheusPrado007/instinto-urbano-api)

## Na sua máquina você deve ter:
- O Node deve ter versão igual ou superior à 16.14.0 LTS:
  - Para instalar o nvm, acesse esse [link](https://github.com/nvm-sh/nvm#installing-and-updating).
  - Rode os comandos abaixo para instalar a versão correta de Node e usá-la:
    ```bash
    nvm install 16.14 --lts
    nvm use 16.14
    nvm alias default 16.14
    ```

## Instruções do Projeto
1. Clone o repositório:
   ```bash
   git@github.com:matheusPrado007/instinto-urbano-api.git
   ```
2. Acesse o diretório:
   ```bash
   cd instinto-urbano-api
   ```
3. Instale as dependências:
   ```bash
   npm install
   ```
4. Rode a aplicação em modo de desenvolvimento:
   ```bash
   npm run dev
   ```
5. Rodar com Docker:
   ```bash
   docker-compose up --build
   ```

## Tecnologias Utilizadas e Seus Requisitos

- **Node.js:**
  - Requisitos: sistema operacional compatível (Windows, macOS, Linux).
  - Instalação: siga as instruções no site oficial do [Node.js](https://nodejs.org/).

- **Express:**
  - Requisitos: Node.js instalado.
  - Instalação:
    ```bash
    npm install express
    ```

- **Mongoose:**
  - Requisitos: Node.js instalado e MongoDB em execução.
  - Instalação:
    ```bash
    npm install mongoose
    ```

- **Firebase:**
  - Requisitos: Conta no Firebase e configuração do projeto no console do Firebase.
  - Instalação do SDK:
    ```bash
    npm install firebase
    ```

- **Docker:**
  - Requisitos: Sistema operacional compatível e Docker Desktop instalado.
  - Instalação: Siga as instruções no site oficial do [Docker](https://www.docker.com/).

- **Docker Compose:**
  - Requisitos: Docker instalado.
  - Instalação: Geralmente incluído com o Docker Desktop. Caso contrário, siga as instruções no site oficial do [Docker Compose](https://docs.docker.com/compose/).

- **JWT (JSON Web Tokens):**
  - Requisitos: Node.js instalado.
  - Instalação:
    ```bash
    npm install jsonwebtoken
    ```

- **Bcrypt:**
  - Requisitos: Node.js instalado.
  - Instalação:
    ```bash
    npm install bcrypt
    ```

- **Jest:**
  - Requisitos: Node.js instalado.
  - Instalação:
    ```bash
    npm install --save-dev jest
    ```

## Estrutura do Projeto
```
├── src/
│   ├── app.ts
│   ├── models/
│   │   ├── Arte.ts
│   │   └── User.ts
│   ├── routes/
│   │   ├── arte.ts
│   │   └── user.ts
│   ├── tests/
│   │   ├── arte.test.ts
│   │   └── user.test.ts
│   ├── controllers/
│   ├── middleware/
│   └── types/
├── package.json
├── Dockerfile
└── docker-compose.yml
```

## Models
### 1. Model de Usuário (User)
```javascript
const UserSchema = new Schema({
  username: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  senha: { type: String, required: true },
  descricao_perfil: { type: String, required: true },
  foto_perfil: { type: String, required: true },
  foto_capa: { type: String, required: false },
  linkedin: { type: String, required: false },
  instagram: { type: String, required: false },
  administrador: { type: Boolean, required: true },
  descricao_curta: { type: String, required: true, maxlength: 100 }
});
```

### 2. Model de Arte (Arte)
```javascript
const ArteSchema = new Schema({
  username: { type: String, required: true },
  nome_artista: { type: String, required: true },
  nome: { type: String, required: true },
  foto: { type: String, required: true },
  descricao: { type: String, required: true },
  uf: { type: String, required: true },
  cidade: { type: String, required: true },
  endereco: { type: String, required: true },
});
```

## Controllers
### 1. Controller de Usuário (userController.ts)
```javascript
export const create = async (req, res) => { /* Lógica para criar um usuário */ };
export const findAll = async (req, res) => { /* Lógica para listar todos os usuários */ };
export const update = async (req, res) => { /* Lógica para atualizar um usuário */ };
export const remove = async (req, res) => { /* Lógica para remover um usuário */ };
export const loginPost = async (req, res) => { /* Lógica para autenticar um usuário */ };
```

### 2. Controller de Arte (arteController.ts)
```javascript
export const create = async (req, res) => { /* Lógica para criar uma obra de arte */ };
export const findAll = async (req, res) => { /* Lógica para listar todas as obras de arte */ };
export const update = async (req, res) => { /* Lógica para atualizar uma obra de arte */ };
export const remove = async (req, res) => { /* Lógica para remover uma obra de arte */ };
```

## Middleware
### 1. Middleware de Autenticação (authMiddleware.ts)
```javascript
import jwt from 'jsonwebtoken';
export const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};
```

### 2. Middleware de Upload (uploadMiddleware.ts)
```javascript
import multer from 'multer';
const storage = multer.memoryStorage();
export const upload = multer({ storage: storage });
export const multipleUploadStorage = upload.array('images', 10);
export const singleUpload = upload.single('image');
```

## Services
### 1. Service de JWT (jwtService.ts)
```javascript
import jwt from 'jsonwebtoken';
export const generateAccessToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
};
export const generateRefreshToken = (user) => {
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
};
```

## Rotas
### 1. Rota de Usuários
- **POST /login:** Realiza o login de um usuário.
- **POST /createUser:** Cria um novo usuário, incluindo upload de imagens.
- **GET /users:** Obtém a lista de usuários.
- **PUT /updateUser/:id:** Atualiza um usuário específico, incluindo upload de imagens.
- **DELETE /deleteuser/:id:** Remove um usuário específico.

### 2. Rota de Artes
- **POST /createArte:** Cria uma nova obra de arte, com autenticação e upload de imagem.
- **GET /artes:** Obtém a lista de obras de arte.
- **PUT /updatearte/:id:** Atualiza uma obra de arte específica, com autenticação e upload de imagem.
- **DELETE /deletearte/:id:** Remove uma obra de arte específica, com autenticação.

## Uso do Firebase para Armazenamento de Imagens
O Firebase é utilizado para armazenar imagens de perfis e artes. Ao enviar uma imagem, a URL retornada pelo Firebase deve ser armazenada no campo `foto_perfil` ou `foto` dos respectivos modelos.

### Exemplo de Upload de Imagem
```javascript
const uploadImage = async (file) => {
  const storageRef = firebase.storage().ref();
  const imageRef = storageRef.child(`images/${file.name}`);
  await imageRef.put(file);
  const url = await imageRef.getDownloadURL();
  return url;
};
```

## Cobertura de Testes
A aplicação possui uma cobertura de testes de pelo menos 90%. Os testes são realizados utilizando o Jest e incluem testes unitários e de integração para as rotas e controladores

.

## Licença
Este projeto é licenciado sob a Licença MIT.


