# TemplaGem Backend (English)

Backend service for the **TemplaGem** platform, providing a REST API for user management, authentication, and prompt operations.

---

## 📌 Table of Contents

- [Tech Stack](#-tech-stack)
- [Requirements](#-requirements)
- [Environment Variables](#-environment-variables)
- [Installation and Setup](#-installation-and-setup)
  - [Local Development](#local-development)
  - [Docker Setup](#docker-setup)
- [Available Scripts](#-available-scripts)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Testing](#-testing)

---

## 🛠 Tech Stack

- **Runtime:** Node.js (ES Modules)
- **Language:** TypeScript
- **Framework:** Express 5
- **Database:** MongoDB (Mongoose 9)
- **Authentication:** JWT (Access & Refresh tokens), bcrypt, cookie-parser
- **Validation:** Zod
- **Logging:** Pino, pino-http, pino-pretty
- **API Documentation:** Swagger UI Express
- **Testing:** Jest, Supertest, mongodb-memory-server
- **Package Manager:** pnpm

---

## 📋 Requirements

- Node.js >= 20.x
- pnpm >= 9.x
- MongoDB (locally installed or via Docker)

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory based on the following template:

```env
PORT=4300
MONGO_URL=mongodb://templaGem:templaGem@127.0.0.1:27017/templaGem?authSource=admin
ACCESS_SECRET=your_jwt_access_secret_key
REFRESH_SECRET=your_jwt_refresh_secret_key
ACCESS_EXPIRES=15m
REFRESH_EXPIRES=7d
```

| Variable          | Description                            | Default |
| ----------------- | -------------------------------------- | ------- |
| `PORT`            | Port the server listens on             | `4300`  |
| `MONGO_URL`       | MongoDB connection URI                 | —       |
| `ACCESS_SECRET`   | Secret key for signing Access JWTs     | —       |
| `REFRESH_SECRET`  | Secret key for signing Refresh JWTs    | —       |
| `ACCESS_EXPIRES`  | Lifespan of Access token (e.g., `15m`) | `15m`   |
| `REFRESH_EXPIRES` | Lifespan of Refresh token (e.g., `7d`) | `7d`    |

---

## 🚀 Installation and Setup

### Local Development

1. **Clone the repository:**

   ```bash
   git clone <repo-url>
   cd TemplaGem_backend
   ```

2. **Install dependencies:**

   ```bash
   pnpm install
   ```

3. **Configure environment variables:**

   ```bash
   cp .env.example .env # or create .env manually
   ```

4. **Start MongoDB** (e.g., with docker-compose):

   ```bash
   docker compose up -d mongodb
   ```

5. **Start development server:**

   ```bash
   pnpm run dev
   ```

6. **Build and run production version:**
   ```bash
   pnpm run start
   ```

---

### Docker Setup

Start all services (backend + MongoDB) with a single command:

```bash
docker compose up --build -d
```

The application will be accessible at: `http://localhost:4300`

---

## 📜 Available Scripts

| Command                   | Description                                                  |
| ------------------------- | ------------------------------------------------------------ |
| `pnpm run dev`            | Start development server with hot-reload (`nodemon` + `tsx`) |
| `pnpm run start`          | Compile TypeScript (`tsc src/index.ts`)                      |
| `pnpm run test`           | Run test suite with Jest                                     |
| `pnpm run lint`           | Check code with ESLint                                       |
| `pnpm run lint:fix`       | Fix auto-fixable ESLint issues                               |
| `pnpm run prettier`       | Format codebase using Prettier                               |
| `pnpm run prettier:check` | Check code formatting                                        |
| `pnpm run typecheck`      | Run TypeScript type checks without emitting build files      |

---

## 📁 Project Structure

```text
TemplaGem_backend/
├── docs/                 # Multilingual project documentation
├── src/
│   ├── index.ts          # Application entry point
│   ├── app.ts            # Express setup and middleware configuration
│   ├── swagger.ts        # OpenAPI / Swagger specification
│   ├── middleware/       # Custom middlewares (auth protection, token validation)
│   ├── models/           # Mongoose schemas and models (users, etc.)
│   ├── routes/           # Express routes (auth, users, prompts)
│   ├── services/         # Application business logic
│   ├── types/            # TypeScript interfaces and types
│   ├── utils/            # Utilities (database connection, JWT generators, logging)
│   └── validation/       # Zod validation schemas
├── tests/                # Integration and unit tests
├── docker-compose.yaml   # Docker Compose configuration
├── Dockerfile            # Container build configuration
├── package.json          # Dependencies and scripts
└── tsconfig.json         # TypeScript compiler configuration
```

---

## 📖 API Documentation

Once the server is running, explore the interactive Swagger UI at:

👉 **[http://localhost:4300/api/docs](http://localhost:4300/api/docs)**

### Key Endpoints:

- **Authentication (`/api/auth`)**:
  - `POST /api/auth/register` — Register a new user
  - `POST /api/auth/login` — Authenticate user and issue tokens
  - `POST /api/auth/refresh` — Refresh expired Access token using Refresh token
  - `POST /api/auth/logout` — Revoke session / logout
- **Users (`/api/users`)**:
  - Manage user profile and information
- **Prompts (`/api/prompts`)**:
  - CRUD operations for prompt management

---

## 🧪 Testing

Run test suites using Jest with in-memory MongoDB support (`mongodb-memory-server`):

```bash
pnpm run test
```
