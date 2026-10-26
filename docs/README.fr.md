# TemplaGem Backend (Français)

Service backend pour la plateforme **TemplaGem**, fournissant une API REST pour la gestion des utilisateurs, l'authentification et la manipulation des prompts.

---

## 📌 Table des matières

- [Stack technique](#-stack-technique)
- [Prérequis](#-prérequis)
- [Variables d'environnement](#-variables-denvironnement)
- [Installation et démarrage](#-installation-et-démarrage)
  - [Exécution en local](#exécution-en-local)
  - [Exécution avec Docker](#exécution-avec-docker)
- [Scripts disponibles](#-scripts-disponibles)
- [Structure du projet](#-structure-du-projet)
- [Documentation de l'API](#-documentation-de-lapi)
- [Tests](#-tests)

---

## 🛠 Stack technique

- **Environnement d'exécution :** Node.js (ES Modules)
- **Langage :** TypeScript
- **Framework :** Express 5
- **Base de données :** MongoDB (Mongoose 9)
- **Authentification :** JWT (Tokens Access & Refresh), bcrypt, cookie-parser
- **Validation :** Zod
- **Journalisation (Logging) :** Pino, pino-http, pino-pretty
- **Documentation API :** Swagger UI Express
- **Tests :** Jest, Supertest, mongodb-memory-server
- **Gestionnaire de paquets :** pnpm

---

## 📋 Prérequis

- Node.js >= 20.x
- pnpm >= 9.x
- MongoDB (en local ou via Docker)

---

## ⚙️ Variables d'environnement

Créez un fichier `.env` à la racine du projet en vous basant sur l'exemple suivant :

```env
PORT=4300
MONGO_URL=mongodb://templaGem:templaGem@127.0.0.1:27017/templaGem?authSource=admin
ACCESS_SECRET=votre_cle_secrete_jwt_access
REFRESH_SECRET=votre_cle_secrete_jwt_refresh
ACCESS_EXPIRES=15m
REFRESH_EXPIRES=7d
```

| Variable          | Description                                   | Valeur par défaut |
| ----------------- | --------------------------------------------- | ----------------- |
| `PORT`            | Port d'écoute du serveur                      | `4300`            |
| `MONGO_URL`       | Chaîne de connexion à MongoDB                 | —                 |
| `ACCESS_SECRET`   | Clé secrète pour signer le token Access       | —                 |
| `REFRESH_SECRET`  | Clé secrète pour signer le token Refresh      | —                 |
| `ACCESS_EXPIRES`  | Durée de validité du token Access (ex. `15m`) | `15m`             |
| `REFRESH_EXPIRES` | Durée de validité du token Refresh (ex. `7d`) | `7d`              |

---

## 🚀 Installation et démarrage

### Exécution en local

1. **Cloner le dépôt :**

   ```bash
   git clone <url-du-depot>
   cd TemplaGem_backend
   ```

2. **Installer les dépendances :**

   ```bash
   pnpm install
   ```

3. **Configurer les variables d'environnement :**

   ```bash
   cp .env.example .env # ou créez le fichier .env manuellement
   ```

4. **Démarrer MongoDB** (par exemple avec docker-compose) :

   ```bash
   docker compose up -d mongodb
   ```

5. **Lancer le serveur en mode développement :**

   ```bash
   pnpm run dev
   ```

6. **Compiler et exécuter en mode production :**
   ```bash
   pnpm run start
   ```

---

### Exécution avec Docker

Lancez tous les services (backend + MongoDB) avec une seule commande :

```bash
docker compose up --build -d
```

Le serveur sera accessible sur : `http://localhost:4300`

---

## 📜 Scripts disponibles

| Commande                  | Description                                                                       |
| ------------------------- | --------------------------------------------------------------------------------- |
| `pnpm run dev`            | Démarre le serveur de développement avec rechargement à chaud (`nodemon` + `tsx`) |
| `pnpm run start`          | Compile TypeScript (`tsc src/index.ts`)                                           |
| `pnpm run test`           | Exécute la suite de tests avec Jest                                               |
| `pnpm run lint`           | Analyse le code avec ESLint                                                       |
| `pnpm run lint:fix`       | Corrige automatiquement les erreurs ESLint                                        |
| `pnpm run prettier`       | Formate le code avec Prettier                                                     |
| `pnpm run prettier:check` | Vérifie le formatage du code                                                      |
| `pnpm run typecheck`      | Vérifie les types TypeScript sans générer de fichiers compilés                    |

---

## 📁 Structure du projet

```text
TemplaGem_backend/
├── docs/                 # Documentation multilingue du projet
├── src/
│   ├── index.ts          # Point d'entrée de l'application
│   ├── app.ts            # Configuration Express et middlewares
│   ├── swagger.ts        # Spécification OpenAPI / Swagger
│   ├── middleware/       # Middlewares (authentification, protection de route)
│   ├── models/           # Modèles et schémas Mongoose (utilisateurs, etc.)
│   ├── routes/           # Routes Express (auth, users, prompts)
│   ├── services/         # Logique métier (services)
│   ├── types/            # Types et interfaces TypeScript
│   ├── utils/            # Utilitaires (connexion BD, génération JWT, journalisation)
│   └── validation/       # Schémas de validation Zod
├── tests/                # Tests unitaires et d'intégration
├── docker-compose.yaml   # Configuration Docker Compose
├── Dockerfile            # Fichier de build du conteneur Docker
├── package.json          # Dépendances et scripts du projet
└── tsconfig.json         # Configuration du compilateur TypeScript
```

---

## 📖 Documentation de l'API

Une fois le serveur lancé, accédez à la documentation interactive Swagger UI via :

👉 **[http://localhost:4300/api/docs](http://localhost:4300/api/docs)**

### Principaux points de terminaison :

- **Authentification (`/api/auth`) :**
  - `POST /api/auth/register` — Inscription d'un nouvel utilisateur
  - `POST /api/auth/login` — Connexion et obtention des tokens
  - `POST /api/auth/refresh` — Rafraîchissement du token Access via le token Refresh
  - `POST /api/auth/logout` — Déconnexion de l'utilisateur
- **Utilisateurs (`/api/users`) :**
  - Gestion du profil et des informations utilisateur
- **Prompts (`/api/prompts`) :**
  - Opérations CRUD pour la gestion des prompts

---

## 🧪 Tests

Exécutez les tests via Jest avec le serveur mémoire MongoDB (`mongodb-memory-server`) :

```bash
pnpm run test
```
