# TemplaGem Backend

Backend service for the **TemplaGem** platform, providing a REST API for user authentication, management, and prompt handling.

---

## 🌐 Documentation Languages / Языки документации

Choose your preferred language:

- 🇬🇧 [English Documentation](docs/README.en.md)
- 🇺🇦 [Українська документація](docs/README.uk.md)
- 🇷🇺 [Русская документация](docs/README.ru.md)
- 🇫🇷 [Documentation en français](docs/README.fr.md)

---

## 🛠 Tech Stack

- **Runtime:** Node.js (ES Modules)
- **Language:** TypeScript
- **Framework:** Express 5
- **Database:** MongoDB (Mongoose 9)
- **Auth:** JWT (Access & Refresh tokens), bcrypt, cookie-parser
- **Validation:** Zod
- **API Docs:** Swagger UI Express
- **Testing:** Jest, Supertest, mongodb-memory-server
- **Package Manager:** pnpm

---

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone <repo-url>
cd TemplaGem_backend
pnpm install
```

### 2. Environment Variables

Create a `.env` file in the root directory:

```env
PORT=4300
MONGO_URL=mongodb://templaGem:templaGem@127.0.0.1:27017/templaGem?authSource=admin
ACCESS_SECRET=your_jwt_access_secret_key
REFRESH_SECRET=your_jwt_refresh_secret_key
ACCESS_EXPIRES=15m
REFRESH_EXPIRES=7d
```

### 3. Run Locally

```bash
# Start MongoDB via Docker Compose
docker compose up -d mongodb

# Start backend in development mode
pnpm run dev
```

### 4. Or Run via Docker Compose

```bash
docker compose up --build -d
```

Application runs on: `http://localhost:4300`  
Swagger UI documentation: `http://localhost:4300/api/docs`

---

## 📜 Useful Scripts

- `pnpm run dev` — Run development server with auto-reload
- `pnpm run start` — Compile TypeScript
- `pnpm run test` — Run tests with Jest
- `pnpm run lint` — Lint code with ESLint
- `pnpm run prettier` — Format code
- `pnpm run typecheck` — Typecheck without emitting code

---

## 📁 Repository Structure

```text
TemplaGem_backend/
├── docs/                 # Multilingual READMEs (en, uk, ru, fr)
│   ├── README.en.md
│   ├── README.uk.md
│   ├── README.ru.md
│   └── README.fr.md
├── src/                  # Application source code
├── tests/                # Test suites
├── docker-compose.yaml   # Docker Compose setup
├── package.json          # Project dependencies and scripts
└── README.md             # Main repository overview
```
