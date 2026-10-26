export const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "TemplaGem API",
    version: "1.0.0",
    description: "API documentation for TemplaGem backend",
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
        description: "Enter JWT access token",
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
              "8-32 characters, at least one uppercase letter and one special character",
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
              "8-32 characters, at least one uppercase letter and one special character",
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
      SyncPromptItem: {
        type: "object",
        required: ["title", "body"],
        properties: {
          clientTempId: {
            type: "string",
            example: "550e8400-e29b-41d4-a716-446655440000",
          },
          promptId: {
            type: "string",
            example: "66a26d708309cf8fcf650b2b",
          },
          title: {
            type: "string",
            example: "Senior Code Reviewer",
          },
          body: {
            type: "string",
            example: "Act as a Senior Software Engineer...",
          },
          tags: {
            type: "array",
            items: {
              type: "string",
            },
            example: ["development", "code-review"],
          },
          icon: {
            type: "string",
            example: "code",
          },
          access: {
            type: "string",
            enum: ["public", "private", "link"],
            example: "private",
          },
          createdAt: {
            type: "string",
            format: "date-time",
            example: "2026-10-25T12:00:00.000Z",
          },
          updatedAt: {
            type: "string",
            format: "date-time",
            example: "2026-10-25T12:00:00.000Z",
          },
        },
      },
      SyncPromptsRequest: {
        type: "object",
        properties: {
          lastSyncTimestamp: {
            type: "string",
            format: "date-time",
            nullable: true,
            example: "2026-10-25T10:00:00.000Z",
          },
          created: {
            type: "array",
            items: {
              $ref: "#/components/schemas/SyncPromptItem",
            },
          },
          updated: {
            type: "array",
            items: {
              $ref: "#/components/schemas/SyncPromptItem",
            },
          },
          deletedIds: {
            type: "array",
            items: {
              type: "string",
            },
            example: ["66a26d708309cf8fcf650b2b"],
          },
        },
      },
      SyncPromptsResponse: {
        type: "object",
        properties: {
          applied: {
            type: "object",
            properties: {
              created: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    clientTempId: { type: "string" },
                    serverId: { type: "string" },
                    createdAt: { type: "string", format: "date-time" },
                    updatedAt: { type: "string", format: "date-time" },
                  },
                },
              },
              updated: {
                type: "array",
                items: { type: "string" },
              },
              deleted: {
                type: "array",
                items: { type: "string" },
              },
            },
          },
          serverChanges: {
            type: "object",
            properties: {
              prompts: {
                type: "array",
                items: {
                  $ref: "#/components/schemas/PromptItem",
                },
              },
              deletedIds: {
                type: "array",
                items: { type: "string" },
              },
            },
          },
          syncTimestamp: {
            type: "string",
            format: "date-time",
            example: "2026-10-25T12:05:00.000Z",
          },
        },
      },
    },
  },
  paths: {
    "/api/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Register a new user",
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
            description: "User registered successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/MessageResponse",
                },
              },
            },
          },
          400: {
            description: "Input data validation error",
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
        summary: "Authenticate user (login)",
        description:
          "Sets HttpOnly cookie `refreshToken` and returns `accessToken` with `refreshToken`.",
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
            description: "Authentication successful",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/AuthLoginResponse",
                },
              },
            },
          },
          400: {
            description: "Invalid request or validation error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
          401: {
            description: "Invalid email or password",
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
        summary: "Refresh access token via refresh token cookie",
        security: [
          {
            cookieAuth: [],
          },
        ],
        responses: {
          200: {
            description: "New access token obtained",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/AuthRefreshResponse",
                },
              },
            },
          },
          401: {
            description: "Refresh token is missing or invalid",
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
        summary: "Sign out user (clear refreshToken cookie)",
        responses: {
          200: {
            description: "Logged out successfully",
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
        summary: "Get list of all users",
        security: [
          {
            bearerAuth: [],
          },
        ],
        responses: {
          200: {
            description: "Users list successfully retrieved",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/UsersListResponse",
                },
              },
            },
          },
          401: {
            description: "Unauthorized",
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
        summary: "Delete current user",
        security: [
          {
            bearerAuth: [],
          },
        ],
        responses: {
          200: {
            description: "User deleted successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/MessageResponse",
                },
              },
            },
          },
          401: {
            description: "Unauthorized",
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
        summary: "Update user email",
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
            description: "Email updated successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/MessageResponse",
                },
              },
            },
          },
          400: {
            description: "Email validation error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
          401: {
            description: "Unauthorized",
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
        summary: "Update user password",
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
            description: "Password updated successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/MessageResponse",
                },
              },
            },
          },
          400: {
            description: "New password validation error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
          401: {
            description: "Unauthorized",
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
        summary: "Get specific user by email",
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
            description: "User email",
            schema: {
              type: "string",
              format: "email",
              example: "user@example.com",
            },
          },
        ],
        responses: {
          200: {
            description: "User retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/UserResponse",
                },
              },
            },
          },
          401: {
            description: "Unauthorized",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
          404: {
            description: "User not found",
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
    "/api/prompts/sync": {
      post: {
        tags: ["Prompts"],
        summary: "Batch synchronization of prompts (Local-First sync)",
        description:
          "Synchronizes local client state with the cloud backend using Last-Write-Wins and tombstone-based soft delete.",
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
                $ref: "#/components/schemas/SyncPromptsRequest",
              },
            },
          },
        },
        responses: {
          200: {
            description: "Prompts synchronized successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/SyncPromptsResponse",
                },
              },
            },
          },
          400: {
            description: "Validation error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
          401: {
            description: "Unauthorized",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
          403: {
            description: "Feature flag disabled",
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
        summary: "Get current user prompts list",
        security: [
          {
            bearerAuth: [],
          },
        ],
        responses: {
          200: {
            description: "Prompts list successfully retrieved",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/PromptsListResponse",
                },
              },
            },
          },
          401: {
            description: "Unauthorized",
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
        summary: "Create a new prompt",
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
            description: "Prompt created successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/MessageResponse",
                },
              },
            },
          },
          400: {
            description: "Validation error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
          401: {
            description: "Unauthorized",
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
        summary: "Update prompt title",
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
            description: "Prompt title updated successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/MessageResponse",
                },
              },
            },
          },
          400: {
            description: "Validation error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
          401: {
            description: "Unauthorized",
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
        summary: "Update prompt body content",
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
            description: "Prompt body updated successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/MessageResponse",
                },
              },
            },
          },
          400: {
            description: "Validation error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
          401: {
            description: "Unauthorized",
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
        summary: "Update prompt tags",
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
            description: "Prompt tags updated successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/MessageResponse",
                },
              },
            },
          },
          400: {
            description: "Validation error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
          401: {
            description: "Unauthorized",
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
        summary: "Update prompt icon",
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
            description: "Prompt icon updated successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/MessageResponse",
                },
              },
            },
          },
          400: {
            description: "Validation error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
          401: {
            description: "Unauthorized",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
          404: {
            description: "Prompt not found",
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
        summary: "Delete prompt",
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
            description: "Prompt deleted successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/MessageResponse",
                },
              },
            },
          },
          400: {
            description: "Validation error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
          401: {
            description: "Unauthorized",
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
        summary: "Delete all prompts of the current user",
        security: [
          {
            bearerAuth: [],
          },
        ],
        responses: {
          200: {
            description: "All prompts deleted successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/MessageResponse",
                },
              },
            },
          },
          401: {
            description: "Unauthorized",
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
