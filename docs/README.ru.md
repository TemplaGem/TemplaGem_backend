# TemplaGem Backend (Русский)

Бэкенд-сервис для платформы **TemplaGem**, предоставляющий REST API для управления пользователями, аутентификации и работы с промптами.

---

## 📌 Содержание

- [Технологический стек](#-технологический-стек)
- [Требования](#-требования)
- [Переменные окружения](#-переменные-окружения)
- [Установка и запуск](#-установка-и-запуск)
  - [Локальный запуск](#локальный-запуск)
  - [Запуск через Docker](#запуск-через-docker)
- [Доступные скрипты](#-доступные-скрипты)
- [Структура проекта](#-структура-проекта)
- [Документация API](#-документация-api)
- [Тестирование](#-тестирование)

---

## 🛠 Технологический стек

- **Среда выполнения:** Node.js (ES Modules)
- **Язык:** TypeScript
- **Фреймворк:** Express 5
- **База данных:** MongoDB (Mongoose 9)
- **Аутентификация:** JWT (Access & Refresh токены), bcrypt, cookie-parser
- **Валидация:** Zod
- **Логирование:** Pino, pino-http, pino-pretty
- **Документация API:** Swagger UI Express
- **Тестирование:** Jest, Supertest, mongodb-memory-server
- **Пакетный менеджер:** pnpm

---

## 📋 Требования

- Node.js >= 20.x
- pnpm >= 9.x
- MongoDB (локально или через Docker)

---

## ⚙️ Переменные окружения

Создайте файл `.env` в корневой директории проекта на основе следующего примера:

```env
PORT=4300
MONGO_URL=mongodb://templaGem:templaGem@127.0.0.1:27017/templaGem?authSource=admin
ACCESS_SECRET=your_jwt_access_secret_key
REFRESH_SECRET=your_jwt_refresh_secret_key
ACCESS_EXPIRES=15m
REFRESH_EXPIRES=7d
```

| Переменная        | Описание                                      | По умолчанию |
| ----------------- | --------------------------------------------- | ------------ |
| `PORT`            | Порт, на котором запускается сервер           | `4300`       |
| `MONGO_URL`       | Строка подключения к MongoDB                  | —            |
| `ACCESS_SECRET`   | Секретный ключ для подписи Access токена      | —            |
| `REFRESH_SECRET`  | Секретный ключ для подписи Refresh токена     | —            |
| `ACCESS_EXPIRES`  | Срок действия Access токена (например, `15m`) | `15m`        |
| `REFRESH_EXPIRES` | Срок действия Refresh токена (например, `7d`) | `7d`         |

---

## 🚀 Установка и запуск

### Локальный запуск

1. **Клонируйте репозиторий:**

   ```bash
   git clone <url-репозитория>
   cd TemplaGem_backend
   ```

2. **Установите зависимости:**

   ```bash
   pnpm install
   ```

3. **Настройте переменные окружения:**

   ```bash
   cp .env.example .env # или создайте .env вручную
   ```

4. **Запустите MongoDB** (например, через docker-compose):

   ```bash
   docker compose up -d mongodb
   ```

5. **Запустите сервер в режиме разработки:**

   ```bash
   pnpm run dev
   ```

6. **Сборка и запуск продакшн-версии:**
   ```bash
   pnpm run start
   ```

---

### Запуск через Docker

Запуск всех сервисов (бэкенд + MongoDB) одной командой:

```bash
docker compose up --build -d
```

Сервер будет доступен по адресу: `http://localhost:4300`

---

## 📜 Доступные скрипты

| Команда                   | Описание                                                              |
| ------------------------- | --------------------------------------------------------------------- |
| `pnpm run dev`            | Запуск сервера для разработки с автоперезагрузкой (`nodemon` + `tsx`) |
| `pnpm run start`          | Компиляция TypeScript (`tsc src/index.ts`)                            |
| `pnpm run test`           | Запуск тестов через Jest                                              |
| `pnpm run lint`           | Проверка кода линтером ESLint                                         |
| `pnpm run lint:fix`       | Автоматическое исправление ошибок ESLint                              |
| `pnpm run prettier`       | Форматирование кода с помощью Prettier                                |
| `pnpm run prettier:check` | Проверка форматирования кода                                          |
| `pnpm run typecheck`      | Проверка типов TypeScript без сборки файлов                           |

---

## 📁 Структура проекта

```text
TemplaGem_backend/
├── docs/                 # Документация проекта на разных языках
├── src/
│   ├── index.ts          # Точка входа в приложение
│   ├── app.ts            # Конфигурация Express и middleware
│   ├── swagger.ts        # Описание OpenAPI/Swagger спецификации
│   ├── middleware/       # Промежуточные обработчики (авторизация, проверка токенов)
│   ├── models/           # Схемы и модели Mongoose (пользователи и др.)
│   ├── routes/           # Маршруты Express (auth, users, prompts)
│   ├── services/         # Бизнес-логика приложения
│   ├── types/            # TypeScript типы и интерфейсы
│   ├── utils/            # Утилиты (подключение к БД, генерация JWT, логирование)
│   └── validation/       # Схемы валидации данных (Zod)
├── tests/                # Интеграционные и модульные тесты
├── docker-compose.yaml   # Конфигурация Docker Compose
├── Dockerfile            # Dockerfile для сборки контейнера
├── package.json          # Зависимости и скрипты проекта
└── tsconfig.json         # Настройки компилятора TypeScript
```

---

## 📖 Документация API

После запуска приложения интерактивная документация Swagger UI доступна по адресу:

👉 **[http://localhost:4300/api/docs](http://localhost:4300/api/docs)**

### Основные эндпоинты:

- **Аутентификация (`/api/auth`)**:
  - `POST /api/auth/register` — Регистрация нового пользователя
  - `POST /api/auth/login` — Вход в систему и получение токенов
  - `POST /api/auth/refresh` — Обновление Access токена через Refresh токен
  - `POST /api/auth/logout` — Выход из системы
- **Пользователи (`/api/users`)**:
  - Управление профилем и данными пользователя
- **Промпты (`/api/prompts`)**:
  - CRUD-операции с пользовательскими промптами

---

## 🧪 Тестирование

Для запуска тестов используется Jest с поддержкой `mongodb-memory-server`:

```bash
pnpm run test
```
