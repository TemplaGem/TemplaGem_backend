# 📚 Документация: База данных и Архитектура Бэкенда (PromptHub)

## 📌 Содержание

1. [Общая архитектура бэкенда](#1-общая-архитектура-бэкенда)
   - 1.1. [Dataflow: Путешествие запроса пользователя по сервисам](#11-dataflow-путешествие-запроса-пользователя-по-сервисам)
2. [Архитектура и схема Базы Данных](#2-архитектура-и-схема-базы-данных)
3. [Модели Mongoose и Типизация](#3-модели-mongoose-и-типизация)
4. [Связи и целостность данных](#4-связи-и-целостность-данных)
5. [Миграции базы данных](#5-миграции-базы-данных)
6. [Спецификация REST API](#6-спецификация-rest-api)
7. [Аутентификация и безопасность](#7-аутентификация-и-безопасность)
8. [Конфигурация и окружение](#8-конфигурация-и-окружение)

---

## 1. Общая архитектура бэкенда

Бэкенд **PromptHub** построен на базе **Node.js** (ES Modules) и **Express 5** на языке **TypeScript**. Архитектура организована по принципу разделения ответственности (Layered Architecture):

```
src/
├── index.ts               # Точка входа приложения
├── app.ts                 # Конфигурация Express, middleware, CORS, Swagger
├── routes/                # HTTP-роутеры и обработчики эндпоинтов
│   ├── auth.ts            # Роуты регистрации, логина, рефреша, логаута
│   ├── users.ts           # Роуты управления профилями пользователей
│   └── prompts.ts         # Роуты CRUD операций над промптами
├── services/              # Слой бизнес-логики
│   ├── user.service.ts    # Сервис работы с пользователями (создание, пароли, удаление)
│   └── prompt.services.ts # Сервис промптов (создание, обновление, удаление)
├── models/                # Mongoose схемы и модели данных
│   ├── user-model.ts      # Модель UserModel
│   └── prompt-model.ts    # Модель PromptModel
├── types/                 # TypeScript интерфейсы и DTO
│   ├── user.types.ts      # Типы пользователя, JWT payload
│   └── prompt.types.ts    # Типы промптов и входные DTO сервисов
├── validation/            # Схемы валидации запросов через Zod
│   ├── user-validation.ts # Валидация логина, паролей, email
│   └── prompt-validation.ts # Валидация заголовков, тегов, иконок, доступа
├── middleware/            # Промежуточные обработчики
│   └── protect.ts         # JWT авторизация (проверка access токена)
├── migrations/            # Скрипты миграций данных
│   ├── add-prompt-icon.ts # Добавление поля icon
│   └── add-user-rating.ts # Добавление поля rating
└── utils/                 # Утилиты
    ├── dbConnect.ts       # Подключение к MongoDB (local/remote)
    ├── jwt-generator.ts   # Генерация и верификация Access/Refresh токенов
    └── loggers.ts         # Логирование через Pino
```

---

## 1.1. Dataflow: Путешествие запроса пользователя по сервисам

Каждый входящий HTTP-запрос от клиента (браузерного расширения, фронтенда или внешнего клиента) проходит через строго структурированный конвейер обработки (**Request Processing Pipeline**).

### Архитектурная схема Dataflow (Flowchart)

```mermaid
flowchart TD
    Client(["Клиент (Extension / Web App)"])

    subgraph GlobalMiddlewares ["Глобальные Middleware (src/app.ts)"]
        CORS["CORS Middleware\n(whitelist origins)"]
        Parser["Body and Cookie Parsers\n(express.json, cookieParser)"]
        Logger["HTTP Logger\n(pino-http)"]
    end

    subgraph Routing ["Слой маршрутизации (src/routes/)"]
        RouterDispatcher{"Маршрутизатор\n(/api/auth, /api/users, /api/prompts)"}
    end

    subgraph AuthLayer ["Слой авторизации (src/middleware/)"]
        Protect{"protect.ts\n(JWT Bearer verify)"}
    end

    subgraph Validation ["Слой валидации (src/validation/)"]
        ZodParser{"Zod safeParse\n(схемы DTO)"}
    end

    subgraph ServiceLayer ["Слой бизнес-логики (src/services/)"]
        PromptService["PromptService"]
        UserService["UserService"]
    end

    subgraph DataAccess ["Слой моделей Mongoose (src/models/)"]
        PromptModel[("PromptModel\n(prompts)")]
        UserModel[("UserModel\n(users)")]
    end

    subgraph DatabaseEngine ["СУБД"]
        MongoDB[("MongoDB")]
    end

    %% Поток запроса
    Client -->|"HTTP Request"| CORS
    CORS --> Parser
    Parser --> Logger
    Logger --> RouterDispatcher

    RouterDispatcher -->|"Публичный роут /api/auth"| ZodParser
    RouterDispatcher -->|"Защищенный роут (/prompts, /users)"| Protect

    Protect -->|"Токен валиден (req.user)"| ZodParser
    Protect -->|"401 Unauthorized"| Client

    ZodParser -->|"Данные валидны"| PromptService
    ZodParser -->|"Данные валидны"| UserService
    ZodParser -->|"400 Bad Request"| Client

    PromptService -->|"CRUD операции"| PromptModel
    PromptService -->|"Синхронизация user.prompts"| UserModel
    UserService -->|"Хеширование bcrypt и каскады"| UserModel
    UserService -->|"Каскадное удаление"| PromptModel

    PromptModel --> MongoDB
    UserModel --> MongoDB

    MongoDB -->|"Документы"| DataAccess
    DataAccess -->|"Результат"| ServiceLayer
    ServiceLayer -->|"DTO или Результат"| RouterDispatcher
    RouterDispatcher -->|"HTTP Response 200/201 JSON"| Client
```

### Пошаговый разбор этапов Dataflow:

1. **Сетевой вход и глобальные Middleware (`src/app.ts`)**:
   - `cors`: проверяет заголовок `Origin`. Разрешает запросы от расширения (`chrome-extension://`), локальных портов (`http://localhost:*`) или прямые запросы без Origin (Postman, background service worker).
   - `express.json()`: парсит тело запроса в объект JavaScript (`req.body`).
   - `cookieParser()`: извлекает cookie, включая защищенный `refreshToken`.
   - `httpLogger` (Pino): логирует метод, путь, статус и время выполнения запроса.

2. **Маршрутизация (`src/routes/`)**:
   - Express направляет запрос в соответствующий роутер:
     - `/api/auth` ➔ `authRouter` (публичные эндпоинты регистрации, логина, рефреша).
     - `/api/users` ➔ `userRouter` (защищенные эндпоинты профиля, смены пароля, удаления).
     - `/api/prompts` ➔ `promptsRouter` (защищенные CRUD-операции над промптами).

3. **Авторизация и идентификация пользователя (`src/middleware/protect.ts`)**:
   - Извлекает токен из заголовка `Authorization: Bearer <accessToken>`.
   - Вызывает `jwtGenerator.verifyAccessToken(token)`.
   - Если токен просрочен или поврежден ➔ мгновенный возврат `401 Unauthorized`.
   - Если токен валиден: находит пользователя в базе `userModel.findOne({ email: payload.email })` и сохраняет его в контекст запроса: `req.user = user`.

4. **Валидация схемы данных (`src/validation/` на базе Zod)**:
   - Внутри обработчика роута вызывается `safeParse(req.body)` для соответствующей схемы (например, `createPromptSchema`, `updatePromptTitleSchema`, `updatePasswordSchema`).
   - Если входные данные не соответствуют ограничениям (например, пароль без спецсимволов или пустой заголовок) ➔ мгновенный возврат `400 Bad Request` с сообщением об ошибке Zod, не нагружая сервисы и базу.

5. **Бизнес-логика в сервисах (`src/services/`)**:
   - Контроллер вызывает метод сервиса (`PromptService` или `UserService`), передавая `userId` из `req.user` и валидированные данные:
     ```typescript
     await promptService.createPrompt({ userId, title, body, tags, icon });
     ```
   - Сервис инкапсулирует бизнес-правила (проверка уникальности, хеширование пароля через bcrypt с 10 раундами, гарантия владения ресурсом).

6. **Слой данных (Mongoose ODM) и каскадная согласованность**:
   - Сервисы обращаются к моделям `userModel` и `promptModel`.
   - При операциях над промптами сервис автоматически обновляет ссылки у пользователя:
     - При создании: `$push` идентификатора в `user.prompts`.
     - При удалении: `$pull` идентификатора из `user.prompts`.
     - При удалении пользователя: каскадное удаление всех его промптов через `promptModel.deleteMany({ createdBy: user._id })`.

7. **Формирование ответа клиенту**:
   - Сервисы возвращают чистые DTO (пароли всегда исключаются проекцией `"-password"`).
   - Роут отправляет структурированный ответ с кодом `200 OK` или `201 Created`.
   - При возникновении непредвиденных ошибок глобальный Error Handler (`app.use`) перехватывает исключение, логирует стек через `logger.error()` и возвращает `500 Internal Server Error`.

---

### Сквозной Sequence-пример: Создание промпта (`POST /api/prompts/create`)

```mermaid
sequenceDiagram
    autonumber
    actor User as Клиент (Extension)
    participant App as Express App
    participant Protect as protect Middleware
    participant Route as promptsRouter
    participant Zod as createPromptSchema (Zod)
    participant Service as PromptService
    participant Mongoose as Mongoose Models
    participant DB as MongoDB

    User->>App: POST /api/prompts/create (Bearer Token, Body JSON)
    App->>App: cors, express.json, pino-http
    App->>Protect: protect(req, res, next)

    Protect->>Protect: jwt.verify(token, ACCESS_SECRET)
    Protect->>DB: userModel.findOne(email)
    DB-->>Protect: User Document
    Protect->>Route: req.user = user, переход к next()

    Route->>Zod: createPromptSchema.safeParse(req.body)
    alt Ошибка валидации
        Zod-->>Route: validation.success = false
        Route-->>User: 400 Bad Request (Validation error)
    else Валидация успешна
        Zod-->>Route: validation.data (title, body, tags, icon)
        Route->>Service: createPrompt(userId, promptData)

        Service->>Mongoose: promptModel.create(doc)
        Mongoose->>DB: INSERT INTO prompts
        DB-->>Mongoose: prompt Document

        Service->>Mongoose: userModel.findByIdAndUpdate(push promptId)
        Mongoose->>DB: UPDATE users SET prompts
        DB-->>Mongoose: OK

        Service-->>Route: Created IPrompt
        Route-->>User: 201 Created (Prompt created successfully)
    end
```

---

## 2. Архитектура и схема Базы Данных

В проекте используется **MongoDB** под управлением **Mongoose 9**. База данных нормализована: промпты вынесены в отдельную коллекцию `prompts`, а пользователи хранятся в коллекции `users`.

### Entity-Relationship (ER) диаграмма

```mermaid
erDiagram
    UserModel ||--o{ PromptModel : "owns / createdBy"
    UserModel {
        ObjectId _id PK
        string email UK "Уникальный email пользователя"
        string password "Хеш пароля bcrypt (salt 10)"
        date registeredAt "Дата регистрации"
        ObjectIdArray prompts FK "Массив ссылок на PromptModel"
        number rating "Рейтинг пользователя"
    }
    PromptModel {
        ObjectId _id PK
        ObjectId createdBy FK "Ссылка на автора UserModel"
        string title "Заголовок промпта от 1 до 100 символов"
        string body "Тело промпта от 1 до 10000 символов"
        string icon "Идентификатор или название иконки"
        stringArray tags "Массив тегов до 10 тегов"
        number likes "Количество лайков"
        number downloads "Количество скачиваний"
        string access "Уровень доступа: public, private или link"
        date createdAt "Метка времени создания"
        date updatedAt "Метка времени последнего обновления"
    }
```

---

## 3. Модели Mongoose и Типизация

### 3.1. Коллекция `users` (`userModel`)

- **Коллекция:** `usermodels` (или `users`)
- **TypeScript интерфейс:** `IUser`

| Поле           | Тип                       | Обязательное      | Дефолтное значение | Описание                             |
| :------------- | :------------------------ | :---------------- | :----------------- | :----------------------------------- |
| `_id`          | `Types.ObjectId`          | Да (генерируется) | Auto               | Уникальный идентификатор             |
| `email`        | `String`                  | Да                | —                  | Email (уникальный, валидируется Zod) |
| `password`     | `String`                  | Да                | —                  | Хеш пароля (bcrypt)                  |
| `registeredAt` | `Date`                    | Да                | `Date.now`         | Дата и время регистрации             |
| `prompts`      | `[Schema.Types.ObjectId]` | Нет               | `[]`               | Ссылки на документы в `PromptModel`  |
| `rating`       | `Number`                  | Да                | `0`                | Рейтинг пользователя на платформе    |

### 3.2. Коллекция `prompts` (`promptModel`)

- **Коллекция:** `promptmodels` (или `prompts`)
- **TypeScript интерфейс:** `IPromptDocument`

| Поле        | Тип                     | Обязательное      | Дефолтное значение | Описание                                           |
| :---------- | :---------------------- | :---------------- | :----------------- | :------------------------------------------------- |
| `_id`       | `Types.ObjectId`        | Да (генерируется) | Auto               | Идентификатор промпта                              |
| `createdBy` | `Schema.Types.ObjectId` | Да                | —                  | Ref на `UserModel`, с индексом для быстрого поиска |
| `title`     | `String`                | Да                | —                  | Название промпта                                   |
| `body`      | `String`                | Да                | —                  | Содержимое/текст промпта                           |
| `icon`      | `String`                | Да                | `""`               | Иконка промпта                                     |
| `tags`      | `[String]`              | Да                | `[]`               | Список тегов (максимум 10)                         |
| `likes`     | `Number`                | Да                | `0`                | Счётчик лайков                                     |
| `downloads` | `Number`                | Да                | `0`                | Счётчик скачиваний/использований                   |
| `access`    | `String` (enum)         | Да                | `"private"`        | Доступ: `"public"`, `"private"` или `"link"`       |
| `createdAt` | `Date`                  | Авто              | `now`              | Дата создания (`timestamps: true`)                 |
| `updatedAt` | `Date`                  | Авто              | `now`              | Дата изменения (`timestamps: true`)                |

---

## 4. Связи и целостность данных

### Двусторонняя связь (Bidirectional Reference)

1. В документе `UserModel`: массив `prompts: [ObjectId]` хранит список ID промптов, созданных пользователем.
2. В документе `PromptModel`: поле `createdBy: ObjectId` содержит ссылку на владельца.

### Каскадные операции:

- **Создание промпта (`PromptService.createPrompt`)**:
  1. Создаётся документ в `PromptModel` с `createdBy = userId`.
  2. ID созданного промпта добавляется в массив пользователя через `$push`:
     ```ts
     await userModel.findByIdAndUpdate(userId, {
       $push: { prompts: prompt._id },
     });
     ```
- **Удаление одного промпта (`PromptService.deletePrompt`)**:
  1. Удаляется документ из `PromptModel` по `_id` и `createdBy`.
  2. ID промпта удаляется из массива `prompts` пользователя через `$pull`:
     ```ts
     await userModel.findByIdAndUpdate(userId, {
       $pull: { prompts: promptId },
     });
     ```
- **Удаление всех промптов (`PromptService.deleteAllPrompts`)**:
  1. Удаляются все документы в `PromptModel` с `createdBy: userId`.
  2. Массив `prompts` у пользователя очищается: `$set: { prompts: [] }`.
- **Удаление пользователя (`UserService.deleteUser`)**:
  1. Каскадно удаляются все промпты пользователя:
     ```ts
     await promptModel.deleteMany({ createdBy: user._id });
     ```
  2. Удаляется документ пользователя из `userModel`.

---

## 5. Миграции базы данных

Все миграции размещаются в `src/migrations/` и написаны с обеспечением **идемпотентности** (повторный запуск безопасен и не дублирует изменения).

| Скрипт миграции                     | Команда запуска               | Что делает                                                                                                           |
| :---------------------------------- | :---------------------------- | :------------------------------------------------------------------------------------------------------------------- |
| `src/migrations/add-prompt-icon.ts` | `npm run migrate:prompt-icon` | Находит все промпты, где `icon` отсутствует (`{ icon: { $exists: false } }`), и устанавливает дефолт `""`.           |
| `src/migrations/add-user-rating.ts` | `npm run migrate:user-rating` | Находит всех пользователей, где `rating` отсутствует (`{ rating: { $exists: false } }`), и устанавливает дефолт `0`. |

---

## 6. Спецификация REST API

### 6.1. Аутентификация (`/api/auth`)

| Метод  | Путь                 | Auth        | Описание                    | Тело запроса          | Ответ                                                   |
| :----- | :------------------- | :---------- | :-------------------------- | :-------------------- | :------------------------------------------------------ |
| `POST` | `/api/auth/register` | Нет         | Регистрация нового аккаунта | `{ email, password }` | `201 Created` `{ message }`                             |
| `POST` | `/api/auth/login`    | Нет         | Вход в систему              | `{ email, password }` | `200 OK` `{ accessToken, refreshToken }` + `Set-Cookie` |
| `POST` | `/api/auth/refresh`  | Cookie/Body | Обновление access токена    | `{ refreshToken? }`   | `200 OK` `{ accessToken }`                              |
| `POST` | `/api/auth/logout`   | Нет         | Выход (очистка cookie)      | —                     | `200 OK` `{ message }`                                  |

### 6.2. Пользователи (`/api/users`)

| Метод    | Путь                  | Auth   | Описание                                   | Тело запроса      | Ответ                       |
| :------- | :-------------------- | :----- | :----------------------------------------- | :---------------- | :-------------------------- |
| `GET`    | `/api/users`          | Bearer | Получить список всех пользователей         | —                 | `200 OK` `{ users: [...] }` |
| `GET`    | `/api/users/:email`   | Bearer | Получить данные пользователя по email      | —                 | `200 OK` `{ user: {...} }`  |
| `PUT`    | `/api/users/email`    | Bearer | Обновить email текущего пользователя       | `{ newEmail }`    | `200 OK` `{ message }`      |
| `PATCH`  | `/api/users/password` | Bearer | Обновить пароль текущего пользователя      | `{ newPassword }` | `200 OK` `{ message }`      |
| `DELETE` | `/api/users`          | Bearer | Удалить аккаунт (каскадно удаляет промпты) | —                 | `200 OK` `{ message }`      |

### 6.3. Промпты (`/api/prompts`)

| Метод    | Путь                         | Auth   | Описание                                      | Тело запроса                            | Ответ                         |
| :------- | :--------------------------- | :----- | :-------------------------------------------- | :-------------------------------------- | :---------------------------- |
| `GET`    | `/api/prompts`               | Bearer | Список промптов текущего пользователя         | —                                       | `200 OK` `{ prompts: [...] }` |
| `POST`   | `/api/prompts/create`        | Bearer | Создание нового промпта                       | `{ title, body, tags, icon?, access? }` | `201 Created` `{ message }`   |
| `PATCH`  | `/api/prompts/change/title`  | Bearer | Изменение заголовка промпта                   | `{ promptId, title }`                   | `200 OK` `{ message }`        |
| `PATCH`  | `/api/prompts/change/body`   | Bearer | Изменение текста промпта                      | `{ promptId, body }`                    | `200 OK` `{ message }`        |
| `PATCH`  | `/api/prompts/change/tags`   | Bearer | Изменение тегов                               | `{ promptId, tags }`                    | `200 OK` `{ message }`        |
| `PATCH`  | `/api/prompts/change/icon`   | Bearer | Изменение иконки                              | `{ promptId, icon }`                    | `200 OK` `{ message }`        |
| `PATCH`  | `/api/prompts/change/access` | Bearer | Изменение доступа (`public`/`private`/`link`) | `{ promptId, access }`                  | `200 OK` `{ message }`        |
| `DELETE` | `/api/prompts/delete`        | Bearer | Удаление конкретного промпта                  | `{ promptId }`                          | `200 OK` `{ message }`        |
| `DELETE` | `/api/prompts/delete/all`    | Bearer | Удаление всех промптов пользователя           | —                                       | `200 OK` `{ message }`        |

### 6.4. Системные эндпоинты (`/api`)

| Метод | Путь          | Auth | Описание                                 | Ответ                                                 |
| :---- | :------------ | :--- | :--------------------------------------- | :---------------------------------------------------- |
| `GET` | `/api/health` | Нет  | Проверка состояния сервиса (healthcheck) | `200 OK` `{ status: "ok", service, port, timestamp }` |

---

## 7. Аутентификация и безопасность

### Схема работы JWT

```mermaid
sequenceDiagram
    autonumber
    Client ->> Server: POST /api/auth/login (email, password)
    Server ->> Server: bcrypt.compare(password, user.password)
    Server ->> Server: Генерация Access Token (15 мин) и Refresh Token (7 дней)
    Server -->> Client: 200 OK (accessToken) + HttpOnly Secure Cookie (refreshToken)

    Note over Client, Server: Авторизованные запросы
    Client ->> Server: GET /api/prompts (Authorization: Bearer accessToken)
    Server ->> Server: Middleware protect: верификация токена и извлечение user
    Server -->> Client: 200 OK (prompts)
```

- **Пароли:** Хешируются с помощью `bcrypt` с 10 раундами salt. Пароль исключается из ответов сервисов (`"-password"`).
- **Access Token:** Подписывается секретом `ACCESS_SECRET`, передаётся в заголовке `Authorization: Bearer <token>`, время жизни `15m`.
- **Refresh Token:** Подписывается `REFRESH_SECRET`, хранится в защищенной cookie (`httpOnly: true, secure: true, sameSite: "strict"`), время жизни `7d`.
- **Валидация:** Все входящие тела запросов строго валидируются через схемы `Zod`.
- **CORS:** Настроен whitelist для `localhost:*`, `chrome-extension://` и запросов без Origin (Postman, background scripts).

---

## 8. Конфигурация и окружение

Подключение к базе данных управляется централизованно через [src/utils/dbConnect.ts](file:///Users/levkovskyivladimir/Dev/PromptHub_backend/src/utils/dbConnect.ts):

- При `MONGO_URL` (например, в Docker Compose) — используется данный URL.
- При `MONGO_ENV=local` — используется `MONGO_LOCAL_URL` (`mongodb://promptHub:promptHub@127.0.0.1:27017/promptHub?authSource=admin`).
- При `MONGO_ENV=remote` — используется `MONGO_REMOTE_URL` (`mongodb://...:27017/promptHub?authSource=admin`).

### Swagger UI

Интерактивная документация доступна локально по адресу:
`http://localhost:4300/api/docs`
