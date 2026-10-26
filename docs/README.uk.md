# TemplaGem Backend (Українська)

Бекенд-сервіс для платформи **TemplaGem**, що надає REST API для керування користувачами, автентифікації та роботи з промптами.

---

## 📌 Зміст

- [Технологічний стек](#-технологічний-стек)
- [Вимоги](#-вимоги)
- [Змінні оточення](#-змінні-оточення)
- [Встановлення та запуск](#-встановлення-та-запуск)
  - [Локальний запуск](#локальний-запуск)
  - [Запуск через Docker](#запуск-через-docker)
- [Доступні скрипти](#-доступні-скрипти)
- [Структура проєкту](#-структура-проєкту)
- [Документація API](#-документація-api)
- [Тестування](#-тестування)

---

## 🛠 Технологічний стек

- **Середовище виконання:** Node.js (ES Modules)
- **Мова:** TypeScript
- **Фреймворк:** Express 5
- **База даних:** MongoDB (Mongoose 9)
- **Автентифікація:** JWT (Access & Refresh токени), bcrypt, cookie-parser
- **Валідація:** Zod
- **Логування:** Pino, pino-http, pino-pretty
- **Документація API:** Swagger UI Express
- **Тестування:** Jest, Supertest, mongodb-memory-server
- **Пакетний менеджер:** pnpm

---

## 📋 Вимоги

- Node.js >= 20.x
- pnpm >= 9.x
- MongoDB (локально або через Docker)

---

## ⚙️ Змінні оточення

Створіть файл `.env` у кореневій директорії проєкту на основі наступного прикладу:

```env
PORT=4300
MONGO_URL=mongodb://templaGem:templaGem@127.0.0.1:27017/templaGem?authSource=admin
ACCESS_SECRET=your_jwt_access_secret_key
REFRESH_SECRET=your_jwt_refresh_secret_key
ACCESS_EXPIRES=15m
REFRESH_EXPIRES=7d
```

| Змінна            | Опис                                        | За замовчуванням |
| ----------------- | ------------------------------------------- | ---------------- |
| `PORT`            | Порт, на якому запускається сервер          | `4300`           |
| `MONGO_URL`       | Рядок підключення до бази даних MongoDB     | —                |
| `ACCESS_SECRET`   | Секретний ключ для підпису Access токена    | —                |
| `REFRESH_SECRET`  | Секретний ключ для підпису Refresh токена   | —                |
| `ACCESS_EXPIRES`  | Термін дії Access токена (наприклад, `15m`) | `15m`            |
| `REFRESH_EXPIRES` | Термін дії Refresh токена (наприклад, `7d`) | `7d`             |

---

## 🚀 Встановлення та запуск

### Локальний запуск

1. **Клонуйте репозиторій:**

   ```bash
   git clone <url-репозиторію>
   cd TemplaGem_backend
   ```

2. **Встановіть залежності:**

   ```bash
   pnpm install
   ```

3. **Налаштуйте змінні оточення:**

   ```bash
   cp .env.example .env # або створіть .env вручну
   ```

4. **Запустіть MongoDB** (наприклад, через docker-compose):

   ```bash
   docker compose up -d mongodb
   ```

5. **Запустіть сервер у режимі розробки:**

   ```bash
   pnpm run dev
   ```

6. **Компіляція та запуск продакшн-версії:**
   ```bash
   pnpm run start
   ```

---

### Запуск через Docker

Запуск усіх сервісів (бекенд + MongoDB) однією командою:

```bash
docker compose up --build -d
```

Сервер буде доступний за адресою: `http://localhost:4300`

---

## 📜 Доступні скрипти

| Команда                   | Опис                                                                    |
| ------------------------- | ----------------------------------------------------------------------- |
| `pnpm run dev`            | Запуск сервера для розробки з автоперезавантаженням (`nodemon` + `tsx`) |
| `pnpm run start`          | Компіляція TypeScript (`tsc src/index.ts`)                              |
| `pnpm run test`           | Запуск тестів за допомогою Jest                                         |
| `pnpm run lint`           | Перевірка коду лінтером ESLint                                          |
| `pnpm run lint:fix`       | Автоматичне виправлення помилок ESLint                                  |
| `pnpm run prettier`       | Форматування коду за допомогою Prettier                                 |
| `pnpm run prettier:check` | Перевірка форматування коду                                             |
| `pnpm run typecheck`      | Перевірка типів TypeScript без створення файлів збірки                  |

---

## 📁 Структура проєкту

```text
TemplaGem_backend/
├── docs/                 # Документація проєкту різними мовами
├── src/
│   ├── index.ts          # Точка входу в застосунок
│   ├── app.ts            # Конфігурація Express та middleware
│   ├── swagger.ts        # Опис OpenAPI/Swagger специфікації
│   ├── middleware/       # Проміжні обробники (авторизація, валідація токенів)
│   ├── models/           # Схеми та моделі Mongoose (користувачі тощо)
│   ├── routes/           # Маршрути Express (auth, users, prompts)
│   ├── services/         # Бізнес-логіка застосунку
│   ├── types/            # TypeScript типи та інтерфейси
│   ├── utils/            # Допоміжні утиліти (підключення до БД, генерація JWT, логування)
│   └── validation/       # Схеми валідації вхідних даних (Zod)
├── tests/                # Інтеграційні та модульні тести
├── docker-compose.yaml   # Конфігурація Docker Compose
├── Dockerfile            # Dockerfile для збірки контейнера
├── package.json          # Залежності та скрипти проєкту
└── tsconfig.json         # Налаштування компілятора TypeScript
```

---

## 📖 Документація API

Після запуску застосунку інтерактивна документація Swagger UI доступна за адресою:

👉 **[http://localhost:4300/api/docs](http://localhost:4300/api/docs)**

### Основні ендпоінти:

- **Автентифікація (`/api/auth`)**:
  - `POST /api/auth/register` — Реєстрація нового користувача
  - `POST /api/auth/login` — Вхід у систему та отримання токенів
  - `POST /api/auth/refresh` — Оновлення Access токена через Refresh токен
  - `POST /api/auth/logout` — Вихід із системи
- **Користувачі (`/api/users`)**:
  - Керування профілем і даними користувачів
- **Промпти (`/api/prompts`)**:
  - CRUD-операції з користувацькими промптами

---

## 🧪 Тестування

Для запуску тестів використовується Jest з підтримкою `mongodb-memory-server`:

```bash
pnpm run test
```
