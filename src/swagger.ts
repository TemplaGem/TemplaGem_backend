export const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "PromptHub API",
    version: "1.0.0",
    description: "API документация для PromptHub backend",
  },
  servers: [
    {
      url: "/",
      description: "Local development server",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Введите JWT access token",
      },
      cookieAuth: {
        type: "apiKey",
        in: "cookie",
        name: "refreshToken",
        description: "HttpOnly refreshToken cookie",
      },
    },
    schemas: {
      ErrorResponse: {
        type: "object",
        properties: {
          error: {
            type: "string",
            example: "Error message details",
          },
        },
      },
      MessageResponse: {
        type: "object",
        properties: {
          message: {
            type: "string",
            example: "Operation completed successfully.",
          },
        },
      },
      AuthRegisterRequest: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: {
            type: "string",
            format: "email",
            example: "user@example.com",
          },
          password: {
            type: "string",
            minLength: 8,
            maxLength: 32,
            example: "Password1!",
            description:
              "8-32 символа, минимум одна заглавная буква и один спецсимвол",
          },
        },
      },
      AuthLoginRequest: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: {
            type: "string",
            format: "email",
            example: "user@example.com",
          },
          password: {
            type: "string",
            example: "Password1!",
          },
        },
      },
      AuthLoginResponse: {
        type: "object",
        properties: {
          accessToken: {
            type: "string",
            example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
          },
          refreshToken: {
            type: "string",
            example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
          },
        },
      },
      AuthRefreshResponse: {
        type: "object",
        properties: {
          accessToken: {
            type: "string",
            example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
          },
        },
      },
      UserUpdateEmailRequest: {
        type: "object",
        required: ["newEmail"],
        properties: {
          newEmail: {
            type: "string",
            format: "email",
            example: "newuser@example.com",
          },
        },
      },
      UserUpdatePasswordRequest: {
        type: "object",
        required: ["newPassword"],
        properties: {
          newPassword: {
            type: "string",
            minLength: 8,
            maxLength: 32,
            example: "NewPassword1!",
            description:
              "8-32 символа, минимум одна заглавная буква и один спецсимвол",
          },
        },
      },
      UserItem: {
        type: "object",
        properties: {
          _id: {
            type: "string",
            example: "66a26d708309cf8fcf650b2a",
          },
          email: {
            type: "string",
            format: "email",
            example: "user@example.com",
          },
          registeredAt: {
            type: "string",
            format: "date-time",
            example: "2026-07-24T12:00:00.000Z",
          },
          prompts: {
            type: "array",
            items: {
              $ref: "#/components/schemas/PromptItem",
            },
          },
        },
      },
      UserResponse: {
        type: "object",
        properties: {
          user: {
            $ref: "#/components/schemas/UserItem",
          },
        },
      },
      UsersListResponse: {
        type: "object",
        properties: {
          users: {
            type: "array",
            items: {
              $ref: "#/components/schemas/UserItem",
            },
          },
        },
      },
      PromptCreateRequest: {
        type: "object",
        required: ["title", "body", "tags"],
        properties: {
          title: {
            type: "string",
            example: "Code Review Assistant",
          },
          body: {
            type: "string",
            example: "Act as a Senior Engineer reviewing this code...",
          },
          tags: {
            type: "array",
            items: {
              type: "string",
            },
            example: ["coding", "review", "typescript"],
          },
          icon: {
            type: "string",
            example: "code-icon",
          },
        },
      },
      PromptUpdateTitleRequest: {
        type: "object",
        required: ["promptId", "title"],
        properties: {
          promptId: {
            type: "string",
            example: "66a26d708309cf8fcf650b2b",
          },
          title: {
            type: "string",
            example: "Updated Prompt Title",
          },
        },
      },
      PromptUpdateBodyRequest: {
        type: "object",
        required: ["promptId", "body"],
        properties: {
          promptId: {
            type: "string",
            example: "66a26d708309cf8fcf650b2b",
          },
          body: {
            type: "string",
            example: "Updated content for the prompt body...",
          },
        },
      },
      PromptUpdateTagsRequest: {
        type: "object",
        required: ["promptId", "tags"],
        properties: {
          promptId: {
            type: "string",
            example: "66a26d708309cf8fcf650b2b",
          },
          tags: {
            type: "array",
            items: {
              type: "string",
            },
            example: ["coding", "refactoring"],
          },
        },
      },
      PromptUpdateIconRequest: {
        type: "object",
        required: ["promptId", "icon"],
        properties: {
          promptId: {
            type: "string",
            example: "66a26d708309cf8fcf650b2b",
          },
          icon: {
            type: "string",
            example: "code-icon",
          },
        },
      },
      PromptDeleteRequest: {
        type: "object",
        required: ["promptId"],
        properties: {
          promptId: {
            type: "string",
            example: "66a26d708309cf8fcf650b2b",
          },
        },
      },
      PromptItem: {
        type: "object",
        properties: {
          _id: {
            type: "string",
            example: "66a26d708309cf8fcf650b2b",
          },
          title: {
            type: "string",
            example: "Code Review Assistant",
          },
          body: {
            type: "string",
            example: "Act as a Senior Engineer reviewing this code...",
          },
          tags: {
            type: "array",
            items: {
              type: "string",
            },
            example: ["coding", "review"],
          },
          icon: {
            type: "string",
            example: "code-icon",
          },
        },
      },
      PromptsListResponse: {
        type: "object",
        properties: {
          prompts: {
            type: "array",
            items: {
              $ref: "#/components/schemas/PromptItem",
            },
          },
        },
      },
      PlatformItem: {
        type: "object",
        properties: {
          id: { type: "string", example: "gemini" },
          name: { type: "string", example: "Google Gemini" },
          enabled: { type: "boolean", example: true },
          accentColor: { type: "string", example: "#1A73E8" },
          theme: {
            type: "object",
            properties: {
              accentColor: { type: "string", example: "#1A73E8" },
            },
          },
          matches: {
            type: "array",
            items: { type: "string" },
            example: ["https://gemini.google.com/*"],
          },
          selectors: {
            type: "object",
            properties: {
              input: {
                type: "array",
                items: { type: "string" },
              },
              container: {
                type: "array",
                items: { type: "string" },
              },
              submitButton: {
                type: "array",
                items: { type: "string" },
              },
            },
          },
          editor: {
            type: "object",
            properties: {
              type: { type: "string", example: "quill" },
              insertStrategy: { type: "string", example: "execCommand" },
            },
          },
          popover: {
            type: "object",
            properties: {
              attachTo: { type: "string", example: "container" },
              offset: {
                type: "object",
                properties: {
                  x: { type: "number", example: 0 },
                  y: { type: "number", example: 8 },
                },
              },
            },
          },
        },
      },
      PlatformsManifestResponse: {
        type: "object",
        properties: {
          version: { type: "integer", example: 1 },
          updatedAt: {
            type: "string",
            format: "date-time",
            example: "2026-10-27T12:00:00Z",
          },
          ttlMinutes: { type: "integer", example: 60 },
          platforms: {
            type: "array",
            items: {
              $ref: "#/components/schemas/PlatformItem",
            },
          },
        },
      },
    },
  },
  paths: {
    "/api/v1/platforms/manifest": {
      get: {
        tags: ["Platforms"],
        summary: "Get platforms manifest configuration",
        description:
          "Public endpoint returning supported platforms manifest for extension injection with caching headers",
        responses: {
          200: {
            description: "Platforms manifest retrieved successfully",
            headers: {
              "Cache-Control": {
                schema: {
                  type: "string",
                  example: "public, max-age=3600, stale-while-revalidate=86400",
                },
                description: "Caching policy directives",
              },
            },
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/PlatformsManifestResponse",
                },
              },
            },
          },
        },
      },
    },
    "/api/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Регистрация нового пользователя",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/AuthRegisterRequest",
              },
            },
          },
        },
        responses: {
          201: {
            description: "Пользователь успешно зарегистрирован",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/MessageResponse",
                },
              },
            },
          },
          400: {
            description: "Ошибка валидации входных данных",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
        },
      },
    },
    "/api/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Аутентификация пользователя (логин)",
        description:
          "Устанавливает HttpOnly cookie `refreshToken` и возвращает `accessToken` с `refreshToken`.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/AuthLoginRequest",
              },
            },
          },
        },
        responses: {
          200: {
            description: "Успешная авторизация",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/AuthLoginResponse",
                },
              },
            },
          },
          400: {
            description: "Некорректный запрос или ошибки валидации",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
          401: {
            description: "Неверный логин или пароль",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
        },
      },
    },
    "/api/auth/refresh": {
      post: {
        tags: ["Auth"],
        summary: "Обновление access токена через refresh token cookie",
        security: [
          {
            cookieAuth: [],
          },
        ],
        responses: {
          200: {
            description: "Новый access token получен",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/AuthRefreshResponse",
                },
              },
            },
          },
          401: {
            description: "Refresh токен отсутствует или невалиден",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
        },
      },
    },
    "/api/auth/logout": {
      post: {
        tags: ["Auth"],
        summary: "Выход из системы (очистка refreshToken cookie)",
        responses: {
          200: {
            description: "Успешный выход",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/MessageResponse",
                },
              },
            },
          },
        },
      },
    },
    "/api/users": {
      get: {
        tags: ["Users"],
        summary: "Получение списка всех пользователей",
        security: [
          {
            bearerAuth: [],
          },
        ],
        responses: {
          200: {
            description: "Список пользователей успешно получен",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/UsersListResponse",
                },
              },
            },
          },
          401: {
            description: "Не авторизован",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
        },
      },
      delete: {
        tags: ["Users"],
        summary: "Удаление текущего пользователя",
        security: [
          {
            bearerAuth: [],
          },
        ],
        responses: {
          200: {
            description: "Пользователь успешно удален",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/MessageResponse",
                },
              },
            },
          },
          401: {
            description: "Не авторизован",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
        },
      },
    },
    "/api/users/email": {
      put: {
        tags: ["Users"],
        summary: "Обновление email пользователя",
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/UserUpdateEmailRequest",
              },
            },
          },
        },
        responses: {
          200: {
            description: "Email успешно обновлен",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/MessageResponse",
                },
              },
            },
          },
          400: {
            description: "Ошибка валидации email",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
          401: {
            description: "Не авторизован",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
        },
      },
    },
    "/api/users/password": {
      patch: {
        tags: ["Users"],
        summary: "Обновление пароля пользователя",
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/UserUpdatePasswordRequest",
              },
            },
          },
        },
        responses: {
          200: {
            description: "Пароль успешно обновлен",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/MessageResponse",
                },
              },
            },
          },
          400: {
            description: "Ошибка валидации нового пароля",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
          401: {
            description: "Не авторизован",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
        },
      },
    },
    "/api/users/{email}": {
      get: {
        tags: ["Users"],
        summary: "Получение конкретного пользователя по email",
        security: [
          {
            bearerAuth: [],
          },
        ],
        parameters: [
          {
            name: "email",
            in: "path",
            required: true,
            description: "Email пользователя",
            schema: {
              type: "string",
              format: "email",
              example: "user@example.com",
            },
          },
        ],
        responses: {
          200: {
            description: "Пользователь успешно получен",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/UserResponse",
                },
              },
            },
          },
          401: {
            description: "Не авторизован",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
          404: {
            description: "Пользователь не найден",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
        },
      },
    },
    "/api/prompts": {
      get: {
        tags: ["Prompts"],
        summary: "Получение списка промптов текущего пользователя",
        security: [
          {
            bearerAuth: [],
          },
        ],
        responses: {
          200: {
            description: "Список промптов успешно получен",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/PromptsListResponse",
                },
              },
            },
          },
          401: {
            description: "Не авторизован",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
        },
      },
    },
    "/api/prompts/create": {
      post: {
        tags: ["Prompts"],
        summary: "Создание нового промпта",
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/PromptCreateRequest",
              },
            },
          },
        },
        responses: {
          201: {
            description: "Промпт успешно создан",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/MessageResponse",
                },
              },
            },
          },
          400: {
            description: "Ошибка валидации входных данных",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
          401: {
            description: "Не авторизован",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
        },
      },
    },
    "/api/prompts/change/title": {
      patch: {
        tags: ["Prompts"],
        summary: "Изменение заголовка промпта",
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/PromptUpdateTitleRequest",
              },
            },
          },
        },
        responses: {
          200: {
            description: "Заголовок промпта успешно обновлен",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/MessageResponse",
                },
              },
            },
          },
          400: {
            description: "Ошибка валидации",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
          401: {
            description: "Не авторизован",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
        },
      },
    },
    "/api/prompts/change/body": {
      patch: {
        tags: ["Prompts"],
        summary: "Изменение текста промпта",
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/PromptUpdateBodyRequest",
              },
            },
          },
        },
        responses: {
          200: {
            description: "Текст промпта успешно обновлен",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/MessageResponse",
                },
              },
            },
          },
          400: {
            description: "Ошибка валидации",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
          401: {
            description: "Не авторизован",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
        },
      },
    },
    "/api/prompts/change/tags": {
      patch: {
        tags: ["Prompts"],
        summary: "Изменение тегов промпта",
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/PromptUpdateTagsRequest",
              },
            },
          },
        },
        responses: {
          200: {
            description: "Теги промпта успешно обновлены",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/MessageResponse",
                },
              },
            },
          },
          400: {
            description: "Ошибка валидации",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
          401: {
            description: "Не авторизован",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
        },
      },
    },
    "/api/prompts/change/icon": {
      patch: {
        tags: ["Prompts"],
        summary: "Изменение иконки промпта",
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/PromptUpdateIconRequest",
              },
            },
          },
        },
        responses: {
          200: {
            description: "Иконка промпта успешно обновлена",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/MessageResponse",
                },
              },
            },
          },
          400: {
            description: "Ошибка валидации",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
          401: {
            description: "Не авторизован",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
          404: {
            description: "Промпт не найден",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
        },
      },
    },
    "/api/prompts/delete": {
      delete: {
        tags: ["Prompts"],
        summary: "Удаление промпта",
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/PromptDeleteRequest",
              },
            },
          },
        },
        responses: {
          200: {
            description: "Промпт успешно удален",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/MessageResponse",
                },
              },
            },
          },
          400: {
            description: "Ошибка валидации",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
          401: {
            description: "Не авторизован",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
        },
      },
    },
    "/api/prompts/delete/all": {
      delete: {
        tags: ["Prompts"],
        summary: "Удаление всех промптов текущего пользователя",
        security: [
          {
            bearerAuth: [],
          },
        ],
        responses: {
          200: {
            description: "Все промпты успешно удалены",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/MessageResponse",
                },
              },
            },
          },
          401: {
            description: "Не авторизован",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
        },
      },
    },
  },
};
