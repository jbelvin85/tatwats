# The PodTracker Primer: Building a PWA from the Ground Up

Welcome, aspiring Planeswalker, to the PodTracker Primer! Just as a skilled mage meticulously crafts their deck, we will meticulously build a modern Progressive Web Application (PWA) designed to enhance your Magic: The Gathering Commander experience. This primer is your spellbook, guiding you through each step of constructing PodTracker, from the foundational mana of Docker to the intricate enchantments of React and Node.js.

## Table of Contents

1.  [Introduction to PodTracker and PWA Concepts](#1-introduction-to-podtracker-and-pwa-concepts)
    1.1. [What is PodTracker?](#11-what-is-podtracker)
    1.2. [What is a Progressive Web Application (PWA)?](#12-what-is-a-progressive-web-application-pwa)
    1.3. [Overview of PodTracker's Architecture: The Three-Tiered Mana Base](#13-overview-of-podtrackers-architecture-the-three-tiered-mana-base)
2.  [Setting Up Your Development Environment](#2-setting-up-your-development-environment)
    2.1. [Prerequisites: Gathering Your Tools](#21-prerequisites-gathering-your-tools)
    2.2. [Cloning the Repository: Summoning the Codebase](#22-cloning-the-repository-summoning-the-codebase)
    2.3. [Initial Docker Setup: Forging the Mana Base](#23-initial-docker-setup-forging-the-mana-base)
    2.4. [Backend Environment Configuration: Attuning Your Spells](#24-backend-environment-configuration-attuning-your-spells)
3.  [The Backend: The Command Zone (Node.js, Express, TypeScript, Zod, Prisma)](#3-the-backend-the-command-zone-nodejs-express-typescript-zod-prisma)
    3.1. [Project Structure: Mapping the Command Zone](#31-project-structure-mapping-the-command-zone)
    3.2. [Database Schema (Prisma): Crafting the Library's Lore](#32-database-schema-prisma-crafting-the-librarys-lore)
    3.3. [API Design Principles: The Art of the Spellcast](#33-api-design-principles-the-art-of-the-spellcast)
    3.4. [Building Core API Endpoints: Unleashing Basic Spells](#34-building-core-api-endpoints-unleashing-basic-spells)
    3.5. [Authentication (JWT): Warding Your Domain](#35-authentication-jwt-warding-your-domain)
4.  [The Frontend: The Battlefield (React, Vite, SWR, Tailwind CSS)](#4-the-frontend-the-battlefield-react-vite-swr-tailwind-css)
    4.1. [Project Setup: Preparing the Battlefield](#41-project-setup-preparing-the-battlefield)
    4.2. [Component-Based Architecture: Assembling Your Forces](#42-component-based-architecture-assembling-your-forces)
    4.3. [State Management: Controlling the Flow of Battle](#43-state-management-controlling-the-flow-of-battle)
    4.4. [Data Fetching with SWR: Scrying for Information](#44-data-fetching-with-swr-scrying-for-information)
    4.5. [Styling with Tailwind CSS: Adorning Your Champions](#45-styling-with-tailwind-css-adorning-your-champions)
    4.6. [Routing: Navigating the Planes](#46-routing-navigating-the-planes)
    4.7. [PWA Features: The Planeswalker's Spark](#47-pwa-features-the-planeswalkers-spark)
5.  [Testing: The Gauntlet (Jest, Supertest)](#5-testing-the-gauntlet-jest-test)
    5.1. [Unit Testing: Proving Your Spells](#51-unit-testing-proving-your-spells)
    5.2. [Integration Testing: Testing the Combo](#52-integration-testing-testing-the-combo)
    5.3. [Running Tests: Facing the Challenge](#53-running-tests-facing-the-challenge)
6.  [Deployment and Beyond: The Victory Lap](#6-deployment-and-beyond-the-victory-lap)
    6.1. [Local Deployment with Docker Compose: Unleashing Your Creation](#61-local-deployment-with-docker-compose-unleashing-your-creation)
    6.2. [Basic Nginx Configuration: The Grand Arena](#62-basic-nginx-configuration-the-grand-arena)
    6.3. [Next Steps: The Infinite Frontier](#63-next-steps-the-infinite-frontier)

## 1. Introduction to PodTracker and PWA Concepts

### 1.1 What is PodTracker?

PodTracker is a web application designed for Magic: The Gathering Commander players. It aims to provide a comprehensive suite of tools for managing your play experience, including:

*   **Pod Management:** Organize your playgroups, much like assembling your trusted companions for a grand quest.
*   **Deck Lists:** Keep track of your formidable decklists, complete with commander details and links to external deckbuilding sites.
*   **Game Tracking:** Record the ebb and flow of your battles, from life totals and commander damage to turn order and significant in-game events. Think of it as a detailed chronicle of your epic duels.
*   **Match History:** Review your entire game history, allowing you to analyze past strategies and learn from every encounter.
*   **Player Statistics:** Gain insights into your performance, deck win-rates, and more, helping you refine your skills and master the battlefield.
*   **Chat:** Communicate with your pod members, strategizing or sharing tales of victory and defeat.

### 1.2 What is a Progressive Web Application (PWA)?

Just as a powerful artifact can adapt to various situations, a Progressive Web Application (PWA) is a web application that offers an enhanced, app-like experience directly within a web browser. PWAs are designed to be:

*   **Reliable:** They load instantly and reliably, even in uncertain network conditions, thanks to the magic of Service Workers (your personal scryer, predicting and caching what you'll need).
*   **Fast:** They respond quickly to user interactions with silky smooth animations and no janky scrolling, ensuring a seamless experience.

*   **Engaging:** They feel like a native application on any device, offering features like push notifications, offline access, and the ability to be "installed" to the home screen, bypassing the app store.

PodTracker is being built as a PWA to provide a robust, accessible, and engaging experience for all players, regardless of their device or network connection.

### 1.3 Overview of PodTracker's Architecture: The Three-Tiered Mana Base

PodTracker follows a standard three-tier web architecture, much like a well-balanced mana base supporting your most potent spells. Each tier has a distinct role, working in harmony to deliver the application's functionality:

*   **Frontend (The Battlefield):** This is what the user sees and interacts with – the visual interface where the game unfolds. Built with React, Vite, SWR, and Tailwind CSS, it's responsible for rendering the UI, handling user input, and displaying data.
*   **Backend (The Command Zone):** This tier acts as the central brain, processing requests from the frontend, interacting with the database, and enforcing business logic. Our backend is powered by Node.js with Express, TypeScript, and Zod.
*   **Database (The Library):** This is where all the persistent data is stored – your game history, decklists, player profiles, and more. We utilize PostgreSQL with Prisma ORM to manage and query our data efficiently.

These three tiers communicate seamlessly, ensuring that your actions on the battlefield are recorded in the library and processed by the command zone, creating a cohesive and powerful application.

## 2. Setting Up Your Development Environment

Before we can begin crafting the intricate spells and powerful creatures that make up PodTracker, we must first prepare our workshop. This section will guide you through gathering the essential tools and setting up your development environment, ensuring you have a stable and efficient foundation for your magical endeavors.

### 2.1. Prerequisites: Gathering Your Tools

Just as a Planeswalker needs their spellbook, mana, and a clear mind, you'll need a few key tools installed on your system. Ensure you have the following:

*   **Git:** The version control system that allows us to manage our codebase. Download from [git-scm.com](https://git-scm.com/).
*   **Node.js (LTS version):** Our backend is built with Node.js. Download the LTS (Long Term Support) version from [nodejs.org](https://nodejs.org/). This will also install `npm` (Node Package Manager).
*   **Docker Desktop:** This powerful tool allows us to run our database and other services in isolated containers, ensuring consistency across different development environments. Download from [docker.com](https://www.docker.com/products/docker-desktop/). Make sure Docker Desktop is running before proceeding.
*   **A Code Editor (e.g., VS Code):** While any text editor will do, a powerful code editor like Visual Studio Code (VS Code) offers excellent support for TypeScript, React, and Node.js development. Download from [code.visualstudio.com](https://code.visualstudio.com/).

### 2.2. Cloning the Repository: Summoning the Codebase

With your tools gathered, it's time to summon the PodTracker codebase to your local machine. Open your terminal or command prompt and execute the following command:

```bash
git clone https://github.com/your-username/podtracker.git
cd podtracker
```

Replace `https://github.com/your-username/podtracker.git` with the actual URL of your PodTracker repository. This command will create a `podtracker` directory on your system and navigate you into it.

### 2.3. Initial Docker Setup: Forging the Mana Base

Our database (PostgreSQL) and other services will run within Docker containers. Docker Compose allows us to define and run multi-container Docker applications. Navigate to the root of your `podtracker` directory (if you're not already there) and run the following command:

```bash
docker-compose up -d
```

This command will:
*   `docker-compose up`: Build, create, and start the services defined in our `docker-compose.yml` file.
*   `-d`: Run the containers in detached mode (in the background), so you can continue using your terminal.

Give it a moment to download images and start the containers. You can verify that the containers are running by executing:

```bash
docker-compose ps
```

You should see output indicating that your `podtracker-db` (and potentially other services) are up and running.

### 2.4. Backend Environment Configuration: Attuning Your Spells

The backend requires certain environment variables to connect to the database and function correctly. We use a `.env` file for this. Navigate into the `backend` directory:

```bash
cd backend
```

Create a new file named `.env` in the `backend/` directory. You can do this manually or by copying the example file:

```bash
copy .env.example .env
```

Now, open the newly created `.env` file in your code editor. It should contain variables similar to these:

```
DATABASE_URL="postgresql://user:password@localhost:5432/podtracker_db?schema=public"
NODE_ENV=development
PORT=3000
JWT_SECRET="your_jwt_secret_key"
```

**Important:**
*   For `DATABASE_URL`, ensure the `user`, `password`, `localhost:5432`, and `podtracker_db` match the configuration in your `docker-compose.yml` for the database service. By default, `docker-compose.yml` usually sets up a `user` and `password` for the database. If you haven't changed it, the default values in `.env.example` should work.
*   **`JWT_SECRET`:** This is a critical security key. **NEVER use `your_jwt_secret_key` in a production environment.** For development, you can use a random string. In a real application, this would be managed securely (e.g., via environment variables or a secret management service). For now, you can generate a simple one, e.g., `openssl rand -base64 32` (on Linux/macOS) or just type a long random string.

With these environment variables configured, your development environment is now set up, and your mana base is forged. You are ready to delve into the Command Zone and begin building the backend of PodTracker.

## 3. The Backend: The Command Zone (Node.js, Express, TypeScript, Zod, Prisma)

Welcome to the Command Zone, Planeswalker! This is where the true power of PodTracker resides – the backend. Here, we'll build the robust engine that processes requests, interacts with our database (the Library), and enforces the rules of our application. We'll be wielding Node.js with Express for our server, TypeScript for type safety, Zod for validation, and Prisma as our powerful Object-Relational Mapper (ORM) to manage our PostgreSQL database.

### 3.1. Project Structure: Mapping the Command Zone

Just as a well-organized deck allows for efficient play, a well-structured project is crucial for maintainability and scalability. Navigate into the `backend/` directory. You'll find a structure similar to this:

```
backend/
├───src/
│   ├───controllers/
│   │   ├───healthController.ts
│   │   └───spellController.ts
│   ├───lib/
│   │   └───prisma.ts
│   ├───middleware/
│   │   └───validate.ts
│   ├───routes/
│   │   ├───health.ts
│   │   └───spell.ts
│   ├───schemas/
│   │   └───spellSchema.ts
│   └───index.ts
├───prisma/
│   └───schema.prisma
├───tests/
│   ├───health.test.ts
│   └───spell.test.ts
├───.env
├───jest.config.js
├───package.json
├───package-lock.json
└───tsconfig.json
```

Let's break down the key components:

*   **`src/index.ts`**: The main entry point of our application, where we set up the Express server and define global middleware.
*   **`src/controllers/`**: Contains the logic for handling incoming requests. Each controller is responsible for a specific resource (e.g., `healthController.ts` for health checks, `spellController.ts` for spell-related operations).
*   **`src/lib/prisma.ts`**: Our Prisma client instance, providing a centralized way to interact with the database.
*   **`src/middleware/`**: Houses reusable Express middleware functions, such as validation middleware (`validate.ts`).
*   **`src/routes/`**: Defines the API endpoints and maps them to their respective controller functions. Each file typically corresponds to a resource (e.g., `health.ts` for `/api/health`, `spell.ts` for `/api/spells`).
*   **`src/schemas/`**: Stores our Zod schemas, which are used for validating incoming request data.
*   **`prisma/schema.prisma`**: The heart of our database schema, where we define our data models and their relationships.
*   **`tests/`**: Contains our unit and integration tests.
*   **`.env`**: Environment variables for configuration (as discussed in Section 2.4).
*   **`package.json`**: Defines project metadata and dependencies.

### 3.2. Database Schema (Prisma): Crafting the Library's Lore

Our database, the Library, is where all the persistent knowledge of PodTracker is stored. Prisma allows us to define our data models in a clear, type-safe way and then generate a powerful client for interacting with our PostgreSQL database. Open `prisma/schema.prisma`.

Initially, it might contain some basic models. Let's define a simple `User` model to represent our Planeswalkers and a `Pod` model to represent their playgroups. Replace or add the following to your `schema.prisma` file:

```prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(uuid())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  email     String   @unique
  username  String   @unique
  password  String
  pods      Pod[]
}

model Pod {
  id        String   @id @default(uuid())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  name      String   @unique
  ownerId   String
  owner     User     @relation(fields: [ownerId], references: [id])
  members   User[]   @relation(name: "PodMembers")
}
```

**Explanation of the models:**

*   **`User` Model:** Represents a user (Planeswalker) in our system.
    *   `id`: A unique identifier for the user, automatically generated as a UUID.
    *   `createdAt`, `updatedAt`: Timestamps for when the record was created and last updated.
    *   `email`, `username`: Unique fields for user identification.
    *   `password`: Stores the hashed password (we'll discuss hashing later for security).
    *   `pods`: A relation to the `Pod` model, indicating the pods this user owns.

*   **`Pod` Model:** Represents a playgroup (Pod).
    *   `id`, `createdAt`, `updatedAt`: Similar to the `User` model.
    *   `name`: A unique name for the pod.
    *   `ownerId`: The ID of the `User` who owns this pod.
    *   `owner`: A relation field linking to the `User` model, establishing the ownership.
    *   `members`: A many-to-many relation to the `User` model, representing the members of the pod. The `@relation(name: "PodMembers")` is used to disambiguate the relationship when a model has multiple relations to the same other model.

After defining your schema, you need to apply these changes to your database. Navigate to the `backend/` directory in your terminal and run the following Prisma command:

```bash
npx prisma migrate dev --name init
```

*   `npx prisma migrate dev`: This command creates a new migration, applies it to the database, and generates the Prisma Client.
*   `--name init`: Provides a name for this migration. You can choose any descriptive name.

This command will create a new migration file in `prisma/migrations/` and update your database schema. It will also regenerate the Prisma Client, ensuring that your application code has the latest types for interacting with your database models.

### 3.3. API Design Principles: The Art of the Spellcast

Designing a clear and consistent API (Application Programming Interface) is like crafting a precise spell – it needs to be understandable, predictable, and effective. We'll adhere to RESTful (Representational State Transfer) principles for our API, which emphasize using standard HTTP methods and clear resource-based URLs.

**Key RESTful Principles:**

*   **Resources:** Everything is a resource (e.g., `/users`, `/pods`, `/games`).
*   **HTTP Methods:** Use standard HTTP methods to perform actions on resources:
    *   `GET`: Retrieve a resource or a collection of resources.
    *   `POST`: Create a new resource.
    *   `PUT`/`PATCH`: Update an existing resource (`PUT` for full replacement, `PATCH` for partial update).
    *   `DELETE`: Remove a resource.
*   **Statelessness:** Each request from a client to a server must contain all the information needed to understand the request. The server should not store any client context between requests.
*   **Clear URLs:** Use plural nouns for collections (e.g., `/api/users`) and specific IDs for individual resources (e.g., `/api/users/123`).

### 3.4. Building Core API Endpoints: Unleashing Basic Spells

Now, let's put these principles into practice by creating some basic API endpoints. We'll start with a simple health check endpoint and then move on to creating and retrieving users.

#### Health Check Endpoint

This endpoint is like a quick diagnostic spell, ensuring our backend is up and running.

1.  **`src/controllers/healthController.ts`:**

    ```typescript
    import { Request, Response } from 'express';

    export const getHealth = (req: Request, res: Response) => {
      res.status(200).json({ message: 'Backend is healthy!' });
    };
    ```

2.  **`src/routes/health.ts`:**

    ```typescript
    import { Router } from 'express';
    import { getHealth } from '../controllers/healthController';

    const router = Router();

    router.get('/health', getHealth);

    export default router;
    ```

3.  **`src/index.ts`:** (Add the health route)

    ```typescript
    import express from 'express';
    import healthRoutes from './routes/health';
    // ... other imports

    const app = express();
    const PORT = process.env.PORT || 3000;

    app.use(express.json()); // Enable JSON body parsing

    // ... other middleware

    app.use('/api', healthRoutes); // Use the health routes under /api

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
    ```

Now, if your backend server is running (you can start it by navigating to `backend/` and running `npm install` then `npm start` or `npm run dev` if configured), you can access `http://localhost:3000/api/health` in your browser or with a tool like Postman/Insomnia, and you should receive a `{"message": "Backend is healthy!"}` response.

#### User Endpoints (Create and Get All)

Let's create endpoints to register new users and retrieve all existing users. This will involve creating a Zod schema for validation.

1.  **`src/schemas/userSchema.ts`:** (Create this new file)

    ```typescript
    import { z } from 'zod';

    export const createUserSchema = z.object({
      email: z.string().email('Invalid email address'),
      username: z.string().min(3, 'Username must be at least 3 characters long'),
      password: z.string().min(6, 'Password must be at least 6 characters long'),
    });

    export type CreateUserInput = z.infer<typeof createUserSchema>;
    ```

2.  **`src/middleware/validate.ts`:** (Our validation middleware)

    ```typescript
    import { Request, Response, NextFunction } from 'express';
    import { AnyZodObject } from 'zod';

    const validate = (schema: AnyZodObject) =>
      (req: Request, res: Response, next: NextFunction) => {
        try {
          schema.parse({
            body: req.body,
            query: req.query,
            params: req.params,
          });
          next();
        } catch (e: any) {
          return res.status(400).send(e.errors);
        }
      };

    export default validate;
    ```

3.  **`src/controllers/userController.ts`:** (Create this new file)

    ```typescript
    import { Request, Response } from 'express';
    import { PrismaClient } from '@prisma/client';
    import { CreateUserInput } from '../schemas/userSchema';
    import bcrypt from 'bcryptjs'; // For password hashing

    const prisma = new PrismaClient();

    export const createUser = async (req: Request<{}, {}, CreateUserInput>, res: Response) => {
      try {
        const { email, username, password } = req.body;

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
          data: {
            email,
            username,
            password: hashedPassword,
          },
        });

        // Omit password from response for security
        const { password: _, ...result } = user;
        res.status(201).json(result);
      } catch (error: any) {
        if (error.code === 'P2002') { // Prisma unique constraint violation
          return res.status(409).json({ message: 'Email or username already exists.' });
        }
        res.status(500).json({ message: 'Error creating user', error: error.message });
      }
    };

    export const getUsers = async (req: Request, res: Response) => {
      try {
        const users = await prisma.user.findMany({
          select: { id: true, email: true, username: true, createdAt: true, updatedAt: true }, // Exclude password
        });
        res.status(200).json(users);
      } catch (error: any) {
        res.status(500).json({ message: 'Error fetching users', error: error.message });
      }
    };
    ```

    *Note: You will need to install `bcryptjs` for password hashing: `npm install bcryptjs @types/bcryptjs` in your `backend/` directory.*

4.  **`src/routes/user.ts`:** (Create this new file)

    ```typescript
    import { Router } from 'express';
    import { createUser, getUsers } from '../controllers/userController';
    import validate from '../middleware/validate';
    import { createUserSchema } from '../schemas/userSchema';

    const router = Router();

    router.post('/users', validate(createUserSchema), createUser);
    router.get('/users', getUsers);

    export default router;
    ```

5.  **`src/index.ts`:** (Add the user routes)

    ```typescript
    import express from 'express';
    import healthRoutes from './routes/health';
    import userRoutes from './routes/user'; // Import user routes
    // ... other imports

    const app = express();
    const PORT = process.env.PORT || 3000;

    app.use(express.json());

    app.use('/api', healthRoutes);
    app.use('/api', userRoutes); // Use the user routes under /api

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
    ```

With these additions, you now have a basic health check and user management endpoints. You can test them using a tool like Postman or Insomnia:

*   **GET `http://localhost:3000/api/health`**
*   **POST `http://localhost:3000/api/users`** (with JSON body: `{"email": "test@example.com", "username": "testuser", "password": "password123"}`)
*   **GET `http://localhost:3000/api/users`**

### 3.5. Authentication (JWT): Warding Your Domain

Just as a Planeswalker wards their domain against intruders, we need to secure our API endpoints. JSON Web Tokens (JWTs) provide a secure way to transmit information between parties as a compact, URL-safe JSON object. We'll implement a login mechanism that issues a JWT upon successful authentication, and then use this token to protect our routes.

**Key Concepts of JWT:**

*   **Header:** Contains the token type (JWT) and the signing algorithm (e.g., HMAC SHA256 or RSA).
*   **Payload:** Contains the claims (statements about an entity, typically the user, and additional data). Avoid putting sensitive information directly in the payload as it's only encoded, not encrypted.
*   **Signature:** Used to verify that the sender of the JWT is who it says it is and to ensure that the message hasn't been tampered with.

#### Implementing User Login and Token Issuance

We'll add a login endpoint that verifies user credentials and, upon success, issues a JWT.

1.  **`src/controllers/userController.ts`:** (Add the `loginUser` function)

    ```typescript
    import { Request, Response } from 'express';
    import { PrismaClient } from '@prisma/client';
    import { CreateUserInput } from '../schemas/userSchema';
    import bcrypt from 'bcryptjs';
    import jwt from 'jsonwebtoken'; // For JWT

    const prisma = new PrismaClient();

    // ... (existing createUser and getUsers functions)

    export const loginUser = async (req: Request<{}, {}, Pick<CreateUserInput, 'email' | 'password']>, res: Response) => {
      try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) {
          return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
          return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
          throw new Error('JWT_SECRET is not defined');
        }

        const token = jwt.sign(
          { userId: user.id, email: user.email },
          jwtSecret,
          { expiresIn: '1h' } // Token expires in 1 hour
        );

        res.status(200).json({ message: 'Logged in successfully', token });
      } catch (error: any) {
        res.status(500).json({ message: 'Error logging in', error: error.message });
      }
    };
    ```

    *Note: You will need to install `jsonwebtoken` for JWT functionality: `npm install jsonwebtoken @types/jsonwebtoken` in your `backend/` directory.*

2.  **`src/routes/user.ts`:** (Add the login route)

    ```typescript
    import { Router } from 'express';
    import { createUser, getUsers, loginUser } from '../controllers/userController';
    import validate from '../middleware/validate';
    import { createUserSchema } from '../schemas/userSchema';
    import { z } from 'zod'; // Import z for login schema

    const router = Router();

    // Define a schema for login input (only email and password)
    const loginUserSchema = z.object({
      email: z.string().email('Invalid email address'),
      password: z.string().min(6, 'Password must be at least 6 characters long'),
    });

    router.post('/users', validate(createUserSchema), createUser);
    router.get('/users', getUsers);
    router.post('/login', validate(loginUserSchema), loginUser); // New login route

    export default router;
    ```

#### Protecting Routes with Middleware

To protect certain routes, we'll create an authentication middleware that verifies the JWT.

1.  **`src/middleware/auth.ts`:** (Create this new file)

    ```typescript
    import { Request, Response, NextFunction } from 'express';
    import jwt from 'jsonwebtoken';

    interface AuthRequest extends Request {
      userId?: string;
    }

    const auth = (req: AuthRequest, res: Response, next: NextFunction) => {
      try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
          throw new Error('Authentication required');
        }

        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
          throw new Error('JWT_SECRET is not defined');
        }

        const decoded = jwt.verify(token, jwtSecret) as { userId: string };
        req.userId = decoded.userId;
        next();
      } catch (error: any) {
        res.status(401).json({ message: 'Authentication failed', error: error.message });
      }
    };

    export default auth;
    ```

2.  **`src/routes/user.ts`:** (Protect the `getUsers` route as an example)

    ```typescript
    import { Router } from 'express';
    import { createUser, getUsers, loginUser } from '../controllers/userController';
    import validate from '../middleware/validate';
    import auth from '../middleware/auth'; // Import auth middleware
    import { createUserSchema } from '../schemas/userSchema';
    import { z } from 'zod';

    const router = Router();

    const loginUserSchema = z.object({
      email: z.string().email('Invalid email address'),
      password: z.string().min(6, 'Password must be at least 6 characters long'),
    });

    router.post('/users', validate(createUserSchema), createUser);
    router.get('/users', auth, getUsers); // Protected route
    router.post('/login', validate(loginUserSchema), loginUser);

    export default router;
    ```

Now, to access `http://localhost:3000/api/users` (GET), you will need to provide a valid JWT in the `Authorization` header as `Bearer <your_token>`. First, register a user, then log in to get a token, and then use that token to access the protected route.

This completes the Backend section of our primer. You've successfully forged the Command Zone, capable of managing data, handling requests, and securing your domain.

## 4. The Frontend: The Battlefield (React, Vite, SWR, Tailwind CSS)

Welcome to the Battlefield, Planeswalker! This is where the user directly interacts with PodTracker – the visual interface, the spells they cast, and the creatures they summon. Our frontend will be built using a powerful combination of modern web technologies:

*   **React:** A declarative, component-based JavaScript library for building user interfaces.
*   **Vite:** A next-generation frontend tooling that provides an extremely fast development experience.
*   **SWR:** A React Hooks library for data fetching, caching, and revalidation.
*   **Tailwind CSS:** A utility-first CSS framework for rapidly building custom designs.

### 4.1. Project Setup: Preparing the Battlefield

First, let's set up our React project. Navigate back to the root of your `podtracker` directory and create a new Vite project for the frontend:

```bash
cd .. # If you are still in the backend directory
npm create vite@latest frontend --template react-ts
cd frontend
npm install
```

This sequence of commands will:
*   `npm create vite@latest frontend --template react-ts`: Create a new Vite project named `frontend` using the React with TypeScript template.
*   `cd frontend`: Navigate into the newly created `frontend` directory.
*   `npm install`: Install all the necessary npm packages for the frontend.

Now, let's install Tailwind CSS, our chosen styling framework:

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

This will:
*   Install `tailwindcss`, `postcss`, and `autoprefixer` as development dependencies.
*   Create `tailwind.config.js` and `postcss.config.js` files in your `frontend/` directory.

Next, configure your `tailwind.config.js` to scan your React components for Tailwind classes. Open `frontend/tailwind.config.js` and modify the `content` array:

```javascript
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

Finally, add the Tailwind directives to your `frontend/src/index.css` file. Replace its entire content with:

```css
/* frontend/src/index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

You can now start the frontend development server:

```bash
npm run dev
```

Open your browser to the address provided (usually `http://localhost:5173`) and you should see the default Vite + React welcome page. This confirms your frontend battlefield is prepared!

### 4.2. Component-Based Architecture: Assembling Your Forces

React encourages a component-based architecture, much like assembling a deck from individual, specialized cards. Each component is a self-contained, reusable piece of UI. We'll organize our components logically within the `src/components/` directory.

Let's create a simple `Header` component and integrate it into our `App.tsx`.

1.  **Create `frontend/src/components/Header.tsx`:**

    ```typescript jsx
    import React from 'react';

    const Header: React.FC = () => {
      return (
        <header className="bg-gray-800 text-white p-4 shadow-md">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold">PodTracker</h1>
            <nav>
              <ul className="flex space-x-4">
                <li><a href="#" className="hover:text-gray-300">Home</a></li>
                <li><a href="#" className="hover:text-gray-300">Pods</a></li>
                <li><a href="#" className="hover:text-gray-300">Decks</a></li>
                <li><a href="#" className="hover:text-gray-300">Games</a></li>
              </ul>
            </nav>
          </div>
        </header>
      );
    };

    export default Header;
    ```

2.  **Modify `frontend/src/App.tsx`:**

    ```typescript jsx
    import React from 'react';
    import Header from './components/Header';

    function App() {
      return (
        <div className="min-h-screen bg-gray-100">
          <Header />
          <main className="container mx-auto p-4">
            <h2 className="text-xl font-semibold mb-4">Welcome to the Battlefield!</h2>
            <p>Start tracking your Commander games and managing your pods.</p>
          </main>
        </div>
      );
    }

    export default App;
    ```

Now, when you view your frontend in the browser, you should see the new header styled with Tailwind CSS. This demonstrates the basic setup for creating and integrating React components.

### 4.3. State Management: Controlling the Flow of Battle

In React, managing the "state" of your application is crucial, much like a Planeswalker managing their hand and mana pool. State refers to data that changes over time and affects what is rendered on the screen. React provides hooks like `useState` and `useEffect` to manage component-level state and side effects.

Let's create a simple counter component to illustrate `useState`:

1.  **Create `frontend/src/components/Counter.tsx`:**

    ```typescript jsx
    import React, { useState } => {
      const [count, setCount] = useState(0); // Initialize count state with 0

      const increment = () => {
        setCount(prevCount => prevCount + 1);
      };

      const decrement = () => {
        setCount(prevCount => prevCount - 1);
      };

      return (
        <div className="p-4 border rounded-lg shadow-sm bg-white">
          <h3 className="text-lg font-semibold mb-2">Mana Counter</h3>
          <p className="text-3xl font-bold text-center mb-4">{count}</p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={decrement}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
            >
              -1
            </button>
            <button
              onClick={increment}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
            >
              +1
            </button>
          </div>
        </div>
      );
    };

    export default Counter;
    ```

2.  **Modify `frontend/src/App.tsx`:** (Integrate the Counter component)

    ```typescript jsx
    import React from 'react';
    import Header from './components/Header';
    import Counter from './components/Counter'; // Import the Counter component

    function App() {
      return (
        <div className="min-h-screen bg-gray-100">
          <Header />
          <main className="container mx-auto p-4">
            <h2 className="text-xl font-semibold mb-4">Welcome to the Battlefield!</h2>
            <p className="mb-8">Start tracking your Commander games and managing your pods.</p>
            <div className="flex justify-center">
              <Counter /> {/* Render the Counter component */}
            </div>
          </main>
        </div>
      );
    }

    export default App;
    ```

This example demonstrates how `useState` declares a state variable (`count`) and a function to update it (`setCount`). When `setCount` is called, React re-renders the component with the new state value.

### 4.4. Data Fetching with SWR: Scrying for Information

SWR (Stale-While-Revalidate) is a powerful React Hooks library for data fetching. It's like scrying for information – it immediately shows you stale (cached) data while revalidating (fetching fresh) data in the background. This provides a fast and responsive user experience.

Let's use SWR to fetch the list of users from our backend API.

1.  **Install SWR:**

    ```bash
npm install swr
    ```

2.  **Create `frontend/src/hooks/useUsers.ts`:** (A custom hook for fetching users)

    ```typescript
    import useSWR from 'swr';

    interface User {
      id: string;
      email: string;
      username: string;
      createdAt: string;
      updatedAt: string;
    }

    const fetcher = (url: string) => fetch(url).then(res => res.json());

    export const useUsers = () => {
      const { data, error, isLoading } = useSWR<User[]>('/api/users', fetcher);

      return {
        users: data,
        isLoading,
        isError: error,
      };
    };
    ```

3.  **Modify `frontend/src/App.tsx`:** (Display fetched users)

    ```typescript jsx
    import React from 'react';
    import Header from './components/Header';
    import Counter from './components/Counter';
    import { useUsers } from './hooks/useUsers'; // Import the custom hook

    function App() {
      const { users, isLoading, isError } = useUsers();

      if (isError) return <div className="text-red-500 text-center p-4">Failed to load users. Check if backend is running and you are logged in.</div>;
      if (isLoading) return <div className="text-center p-4">Loading users...</div>;

      return (
        <div className="min-h-screen bg-gray-100">
          <Header />
          <main className="container mx-auto p-4">
            <h2 className="text-xl font-semibold mb-4">Welcome to the Battlefield!</h2>
            <p className="mb-8">Start tracking your Commander games and managing your pods.</p>
            <div className="flex justify-center mb-8">
              <Counter />
            </div>

            <section className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Registered Planeswalkers (Users)</h3>
              {users && users.length > 0 ? (
                <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {users.map(user => (
                    <li key={user.id} className="bg-white p-4 rounded-lg shadow-sm">
                      <p className="font-bold">{user.username}</p>
                      <p className="text-gray-600 text-sm">{user.email}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600">No planeswalkers registered yet. Create one via the backend API!</p>
              )}
            </section>
          </main>
        </div>
      );
    }

    export default App;
    ```

    *Note: Remember that the `/api/users` endpoint is protected by JWT authentication. For this example to work, you would typically need to implement a way to provide the JWT token with your fetcher, or temporarily remove the `auth` middleware from the `/api/users` GET route in your backend for testing purposes.*

This demonstrates how SWR simplifies data fetching and provides a great user experience by handling loading and error states, and automatically revalidating data.

### 4.5. Styling with Tailwind CSS: Adorning Your Champions

Tailwind CSS is a utility-first CSS framework that allows you to build custom designs directly in your HTML (or JSX in React) by composing small, single-purpose utility classes. It's like having a vast arsenal of magical adornments, each with a specific effect, that you can combine to create powerful visual enchantments.

We've already set up Tailwind in Section 4.1. Let's enhance our `Header` component and create a simple `Button` component to demonstrate more of Tailwind's power.

1.  **Modify `frontend/src/components/Header.tsx`:** (Add more styling and a login/logout button placeholder)

    ```typescript jsx
    import React from 'react';

    const Header: React.FC = () => {
      return (
        <header className="bg-gradient-to-r from-gray-900 to-gray-700 text-white p-4 shadow-lg">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-3xl font-extrabold tracking-tight">PodTracker</h1>
            <nav>
              <ul className="flex space-x-6 text-lg">
                <li><a href="#" className="hover:text-purple-300 transition duration-300 ease-in-out">Home</a></li>
                <li><a href="#" className="hover:text-purple-300 transition duration-300 ease-in-out">Pods</a></li>
                <li><a href="#" className="hover:text-purple-300 transition duration-300 ease-in-out">Decks</a></li>
                <li><a href="#" className="hover:text-purple-300 transition duration-300 ease-in-out">Games</a></li>
                <li><button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-full shadow-md transition duration-300 ease-in-out">Login</button></li>
              </ul>
            </nav>
          </div>
        </header>
      );
    };

    export default Header;
    ```

2.  **Create `frontend/src/components/Button.tsx`:** (A reusable button component)

    ```typescript jsx
    import React from 'react';

    interface ButtonProps {
      children: React.ReactNode;
      onClick?: () => void;
      className?: string;
      variant?: 'primary' | 'secondary' | 'danger';
    }

    const Button: React.FC<ButtonProps> = ({
      children,
      onClick,
      className = '',
      variant = 'primary',
    }) => {
      const baseStyles = "font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out";
      const variants = {
        primary: "bg-blue-600 hover:bg-blue-700 text-white",
        secondary: "bg-gray-300 hover:bg-gray-400 text-gray-800",
        danger: "bg-red-600 hover:bg-red-700 text-white",
      };

      return (
        <button
          onClick={onClick}
          className={`${baseStyles} ${variants[variant]} ${className}`}
        >
          {children}
        </button>
      );
    };

    export default Button;
    ```

This demonstrates how you can use Tailwind's utility classes directly and also encapsulate them within reusable React components for consistency and maintainability.

### 4.6. Routing: Navigating the Planes

In a multi-page application like PodTracker, we need a way to navigate between different views or "planes." React Router is the standard library for client-side routing in React applications. It allows us to map URLs to specific components, creating a seamless single-page application experience.

1.  **Install React Router DOM:**

    ```bash
npm install react-router-dom
    ```

2.  **Modify `frontend/src/App.tsx`:** (Set up basic routing)

    ```typescript jsx
    import React from 'react';
    import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
    import Header from './components/Header';
    import Counter from './components/Counter';
    import { useUsers } from './hooks/useUsers';

    // Define some placeholder components for our routes
    const HomePage: React.FC = () => (
      <main className="container mx-auto p-4">
        <h2 className="text-xl font-semibold mb-4">Welcome to the Battlefield!</h2>
        <p className="mb-8">Start tracking your Commander games and managing your pods.</p>
        <div className="flex justify-center mb-8">
          <Counter />
        </div>
      </main>
    );

    const PodsPage: React.FC = () => (
      <main className="container mx-auto p-4">
        <h2 className="text-xl font-semibold mb-4">Your Pods</h2>
        <p>Manage your playgroups here.</p>
      </main>
    );

    const DecksPage: React.FC = () => (
      <main className="container mx-auto p-4">
        <h2 className="text-xl font-semibold mb-4">Your Decks</h2>
        <p>Manage your decklists here.</p>
      </main>
    );

    const GamesPage: React.FC = () => (
      <main className="container mx-auto p-4">
        <h2 className="text-xl font-semibold mb-4">Your Games</h2>
        <p>Track your game history here.</p>
      </main>
    );

    function App() {
      const { users, isLoading, isError } = useUsers();

      if (isError) return <div className="text-red-500 text-center p-4">Failed to load users. Check if backend is running and you are logged in.</div>;
      if (isLoading) return <div className="text-center p-4">Loading users...</div>;

      return (
        <Router>
          <div className="min-h-screen bg-gray-100">
            <Header />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/pods" element={<PodsPage />} />
              <Route path="/decks" element={<DecksPage />} />
              <Route path="/games" element={<GamesPage />} />
              {/* Example of a protected route, though actual protection would be handled by auth middleware */}
              <Route path="/users" element={
                <section className="container mx-auto p-4 mt-8">
                  <h3 className="text-xl font-semibold mb-4">Registered Planeswalkers (Users)</h3>
                  {users && users.length > 0 ? (
                    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {users.map(user => (
                        <li key={user.id} className="bg-white p-4 rounded-lg shadow-sm">
                          <p className="font-bold">{user.username}</p>
                          <p className="text-gray-600 text-sm">{user.email}</p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-600">No planeswalkers registered yet. Create one via the backend API!</p>
                  )}
                </section>
              } />
            </Routes>
          </div>
        </Router>
      );
    }

    export default App;
    ```

3.  **Modify `frontend/src/components/Header.tsx`:** (Use `Link` components for navigation)

    ```typescript jsx
    import React from 'react';
    import { Link } from 'react-router-dom';

    const Header: React.FC = () => {
      return (
        <header className="bg-gradient-to-r from-gray-900 to-gray-700 text-white p-4 shadow-lg">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-3xl font-extrabold tracking-tight">PodTracker</h1>
            <nav>
              <ul className="flex space-x-6 text-lg">
                <li><Link to="/" className="hover:text-purple-300 transition duration-300 ease-in-out">Home</Link></li>
                <li><Link to="/pods" className="hover:text-purple-300 transition duration-300 ease-in-out">Pods</Link></li>
                <li><Link to="/decks" className="hover:text-purple-300 transition duration-300 ease-in-out">Decks</Link></li>
                <li><Link to="/games" className="hover:text-purple-300 transition duration-300 ease-in-out">Games</Link></li>
                <li><Link to="/users" className="hover:text-purple-300 transition duration-300 ease-in-out">Users</Link></li>
                <li><button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-full shadow-md transition duration-300 ease-in-out">Login</button></li>
              </ul>
            </nav>
          </div>
        </header>
      );
    };

    export default Header;
    ```

Now, when you run your frontend, you can navigate between the different routes, and the corresponding components will be rendered. This sets the stage for building out the various views of our application.

### 4.7. PWA Features: The Planeswalker's Spark

The Planeswalker's Spark grants extraordinary abilities, and similarly, PWA features elevate a regular web application to an app-like experience. The core components that enable these features are the Web App Manifest and Service Workers.

#### Web App Manifest: Defining Your Spark

The Web App Manifest is a JSON file that tells the browser about your PWA and how it should behave when installed on a user's device. It defines properties like the app's name, icons, start URL, display mode, and theme colors.

1.  **Open `frontend/index.html`:**

    You'll find a link to the manifest file already present, typically:

    ```html
    <link rel="manifest" href="/manifest.webmanifest" />
    ```

2.  **Create `frontend/public/manifest.webmanifest`:** (If it doesn't exist, or modify existing)

    ```json
    {
      "name": "PodTracker",
      "short_name": "PodTracker",
      "description": "Track your Magic: The Gathering Commander games and manage your pods.",
      "start_url": "/",
      "display": "standalone",
      "background_color": "#1a202c",
      "theme_color": "#6b46c1",
      "icons": [
        {
          "src": "/icons/icon-192x192.png",
          "sizes": "192x192",
          "type": "image/png"
        },
        {
          "src": "/icons/icon-512x512.png",
          "sizes": "512x512",
          "type": "image/png"
        },
        {
          "src": "/icons/icon-maskable-192x192.png",
          "sizes": "192x192",
          "type": "image/png",
          "purpose": "maskable"
        },
        {
          "src": "/icons/icon-maskable-512x512.png",
          "sizes": "512x512",
          "type": "image/png",
          "purpose": "maskable"
        }
      ]
    }
    ```

    *Note: You would need to create the actual icon files (e.g., `icon-192x192.png`) and place them in `frontend/public/icons/` for the manifest to work correctly.*

#### Service Workers: Your Personal Scryer

A Service Worker is a JavaScript file that your browser runs in the background, separate from the main web page. It acts as a programmable proxy between the web browser and the network, allowing you to control how network requests are handled. This enables features like offline capabilities, push notifications, and asset caching.

1.  **Create `frontend/public/service-worker.js`:**

    ```javascript
    // frontend/public/service-worker.js
    const CACHE_NAME = 'podtracker-cache-v1';
    const urlsToCache = [
      '/',
      '/index.html',
      '/manifest.webmanifest',
      // Add other assets you want to cache, e.g., CSS, JS bundles, images
      // '/assets/index-XXXX.js', // Vite generates hashed filenames
      // '/assets/index-XXXX.css',
      // '/icons/icon-192x192.png',
    ];

    self.addEventListener('install', (event) => {
      event.waitUntil(
        caches.open(CACHE_NAME)
          .then((cache) => {
            console.log('Opened cache');
            return cache.addAll(urlsToCache);
          })
      );
    });

    self.addEventListener('fetch', (event) => {
      event.respondWith(
        caches.match(event.request)
          .then((response) => {
            // Cache hit - return response
            if (response) {
              return response;
            }
            return fetch(event.request);
          })
      );
    });

    self.addEventListener('activate', (event) => {
      const cacheWhitelist = [CACHE_NAME];
      event.waitUntil(
        caches.keys().then((cacheNames) => {
          return Promise.all(
            cacheNames.map((cacheName) => {
              if (cacheWhitelist.indexOf(cacheName) === -1) {
                return caches.delete(cacheName);
              }
            })
          );
        })
      );
    });
    ```

2.  **Register the Service Worker in `frontend/src/main.tsx`:**

    ```typescript jsx
    import React from 'react';
    import ReactDOM from 'react-dom/client';
    import App from './App.tsx';
    import './index.css';

    ReactDOM.createRoot(document.getElementById('root')!).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
    );

    // Register Service Worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
          .then(registration => {
            console.log('SW registered: ', registration);
          })
          .catch(registrationError => {
            console.log('SW registration failed: ', registrationError);
          });
      });
    }
    ```

With these additions, your PodTracker PWA will start to exhibit app-like behaviors, offering a more reliable and engaging experience for your users. This completes the Frontend section of our primer.

## 5. Testing: The Gauntlet (Jest, Supertest)

Just as a Planeswalker must test their deck against various opponents to ensure its resilience and power, we must rigorously test our application. Testing is a crucial phase in software development, ensuring that our code behaves as expected, catches bugs early, and provides confidence for future changes. In PodTracker, we'll primarily use Jest for unit and integration testing, and Supertest for API integration tests.

### 5.1. Unit Testing: Proving Your Spells

Unit tests focus on individual, isolated units of code (e.g., a single function, a component). They are like proving that each of your spells works perfectly on its own. Jest is a popular JavaScript testing framework that excels at unit testing.

#### Backend Unit Test Example

Let's write a simple unit test for a utility function in our backend.

1.  **Create `backend/src/utils/math.ts`:** (A simple utility function)

    ```typescript
    export const add = (a: number, b: number): number => a + b;
    export const subtract = (a: number, b: number): number => a - b;
    ```

2.  **Create `backend/tests/unit/math.test.ts`:** (Create `unit` directory inside `tests`)

    ```typescript
    import { add, subtract } from '../../src/utils/math';

    describe('Math Utilities', () => {
      test('add function should correctly add two numbers', () => {
        expect(add(1, 2)).toBe(3);
        expect(add(-1, 1)).toBe(0);
        expect(add(0, 0)).toBe(0);
      });

      test('subtract function should correctly subtract two numbers', () => {
        expect(subtract(5, 2)).toBe(3);
        expect(subtract(10, 15)).toBe(-5);
        expect(subtract(0, 0)).toBe(0);
      });
    });
    ```

#### Frontend Unit Test Example

For the frontend, we can test our React components. We'll use Jest along with `@testing-library/react` for rendering components in a test environment.

1.  **Install Testing Library:**

    ```bash
cd frontend
npm install -D @testing-library/react @testing-library/jest-dom
    ```

2.  **Configure Jest for Frontend (if not already):**

    Ensure your `frontend/package.json` has a test script and Jest configuration. You might need to add a `jest.config.js` in the `frontend/` directory or configure it directly in `package.json`.

    *Example `frontend/jest.config.js` (simplified):*

    ```javascript
    // frontend/jest.config.js
    export default {
      testEnvironment: 'jsdom',
      setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
      moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
      },
    };
    ```

    *Create `frontend/src/setupTests.ts` (for `@testing-library/jest-dom` matchers):*

    ```typescript
    // frontend/src/setupTests.ts
    import '@testing-library/jest-dom';
    ```

3.  **Create `frontend/src/components/Counter.test.tsx`:**

    ```typescript jsx
    import { render, screen, fireEvent } from '@testing-library/react';
    import Counter from './Counter';

    describe('Counter Component', () => {
      test('renders with initial count of 0', () => {
        render(<Counter />);
        expect(screen.getByText('0')).toBeInTheDocument();
      });

      test('increments count when +1 button is clicked', () => {
        render(<Counter />);
        const incrementButton = screen.getByRole('button', { name: /\+1/i });
        fireEvent.click(incrementButton);
        expect(screen.getByText('1')).toBeInTheDocument();
      });

      test('decrements count when -1 button is clicked', () => {
        render(<Counter />);
        const decrementButton = screen.getByRole('button', { name: /\-1/i });
        fireEvent.click(decrementButton);
        expect(screen.getByText('-1')).toBeInTheDocument();
      });
    });
    ```

### 5.2. Integration Testing: Testing the Combo

Integration tests verify that different modules or services work correctly together. This is like testing a powerful combo in your deck – ensuring all the pieces interact as expected. For our backend API, Supertest is an excellent library for making HTTP requests in tests.

#### Backend API Integration Test Example

Let's test our user creation and retrieval endpoints.

1.  **Install Supertest:**

    ```bash
cd backend
npm install -D supertest @types/supertest
    ```

2.  **Create `backend/tests/integration/user.test.ts`:** (Create `integration` directory inside `tests`)

    ```typescript
    import request from 'supertest';
    import app from '../../src/index'; // Assuming your Express app is exported from index.ts
    import { PrismaClient } from '@prisma/client';

    const prisma = new PrismaClient();

    describe('User API Integration', () => {
      // Clear the database before each test
      beforeEach(async () => {
        await prisma.user.deleteMany({});
      });

      afterAll(async () => {
        await prisma.$disconnect();
      });

      test('should create a new user', async () => {
        const userData = {
          email: 'test@example.com',
          username: 'testuser',
          password: 'password123',
        };

        const res = await request(app)
          .post('/api/users')
          .send(userData);

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('id');
        expect(res.body.email).toEqual(userData.email);
        expect(res.body.username).toEqual(userData.username);
        expect(res.body).not.toHaveProperty('password'); // Password should not be returned
      });

      test('should get all users', async () => {
        // Create a user first
        await request(app)
          .post('/api/users')
          .send({
            email: 'user1@example.com',
            username: 'user1',
            password: 'password123',
          });

        const res = await request(app)
          .get('/api/users');

        expect(res.statusCode).toEqual(200);
        expect(res.body).toBeInstanceOf(Array);
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0]).toHaveProperty('username', 'user1');
      });

      // Add more tests for validation, error handling, etc.
    });
    ```

    *Note: For this integration test to work, your `backend/src/index.ts` should export the Express `app` instance, e.g., `export default app;`.*

### 5.3. Running Tests: Facing the Challenge

With your tests written, it's time to face the challenge and run them. Jest makes this straightforward.

#### Running Backend Tests

Navigate to your `backend/` directory and run:

```bash
npm test
```

This command, typically configured in your `package.json` (`"test": "jest"`), will discover and execute all files ending with `.test.ts` (or `.test.js`) within your project. You should see output indicating which tests passed or failed.

#### Running Frontend Tests

Navigate to your `frontend/` directory and run:

```bash
npm test
```

Similar to the backend, this will execute your frontend tests. If you configured Jest for watch mode, it might stay open and re-run tests on file changes.

By regularly running your tests, you ensure the quality and stability of your application, much like a Planeswalker constantly refining their deck to withstand any opponent. This completes the Testing section of our primer.

## 6. Deployment and Beyond: The Victory Lap

After meticulously crafting your spells and assembling your forces, it's time for the victory lap – deploying your application. While full production deployment involves many more considerations, this section will guide you through running your complete PodTracker application locally using Docker Compose, and how Nginx acts as a reverse proxy.

### 6.1. Local Deployment with Docker Compose: Unleashing Your Creation

You've already used `docker-compose up -d` to start your database. Now, we'll ensure our `docker-compose.yml` is configured to run our backend and frontend services as well, allowing you to unleash your entire creation with a single command.

Ensure your `docker-compose.yml` at the root of your `podtracker` directory looks something like this. You might need to create or modify it:

```yaml
version: '3.8'

services:
  db:
    image: postgres:14-alpine
    restart: always
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: podtracker_db
    ports:
      - "5432:5432"
    volumes:
      - db-data:/var/lib/postgresql/data

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://user:password@db:5432/podtracker_db?schema=public
      JWT_SECRET: your_jwt_secret_key_for_docker # Use a strong, unique key
      NODE_ENV: production
    depends_on:
      - db
    volumes:
      - ./backend:/app
      - /app/node_modules # Exclude node_modules from host mount

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "5173:5173"
    depends_on:
      - backend
    volumes:
      - ./frontend:/app
      - /app/node_modules # Exclude node_modules from host mount

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      - frontend
      - backend

volumes:
  db-data:
```

**Explanation of additions:**

*   **`backend` service:**
    *   `build`: Tells Docker Compose to build the image from the `backend/` directory using its `Dockerfile`.
    *   `ports`: Maps port 3000 on your host to port 3000 in the container.
    *   `environment`: Sets environment variables for the backend *inside* the container. Note `DATABASE_URL` now points to `db:5432` (the service name `db` within the Docker network) and `NODE_ENV` is `production`.
    *   `volumes`: Mounts your local `backend` directory into the container for live code changes during development. `/app/node_modules` is excluded to prevent issues with host-mounted `node_modules`.

*   **`frontend` service:**
    *   Similar `build`, `ports`, and `volumes` configuration for the frontend.
    *   `depends_on`: Ensures the backend is running before the frontend starts.

*   **`nginx` service:**
    *   We've added an Nginx service to act as a reverse proxy, serving the frontend and forwarding API requests to the backend. More on this in the next section.

Now, create `backend/Dockerfile`:

```dockerfile
# backend/Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

And `frontend/Dockerfile`:

```dockerfile
# frontend/Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev"]
```

With these Dockerfiles and the updated `docker-compose.yml`, navigate to the root `podtracker` directory and run:

```bash
docker-compose up --build -d
```

*   `--build`: Forces Docker Compose to rebuild images, ensuring your latest code changes are included.

This will build and start all your services. Your backend will be accessible on port 3000, and your frontend on port 5173 (though Nginx will handle routing to them).

### 6.2. Basic Nginx Configuration: The Grand Arena

Nginx acts as our Grand Arena, directing traffic to the correct services. It will serve our static frontend files and proxy API requests to our backend. This allows us to access our entire application through a single port (80, the default for HTTP).

1.  **Create `nginx/nginx.conf`:** (Create a new `nginx` directory at the root of your project)

    ```nginx
    # nginx/nginx.conf
    events {
        worker_connections 1024;
    }

    http {
        include       mime.types;
        default_type  application/octet-stream;

        sendfile        on;
        keepalive_timeout  65;

        server {
            listen 80;
            server_name localhost;

            # Serve frontend static files
            location / {
                proxy_pass http://frontend:5173;
                proxy_set_header Host $host;
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_set_header X-Forwarded-Proto $scheme;
            }

            # Proxy API requests to backend
            location /api/ {
                proxy_pass http://backend:3000;
                proxy_set_header Host $host;
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_set_header X-Forwarded-Proto $scheme;
            }
        }
    }
    ```

**Explanation of `nginx.conf`:**

*   `server { listen 80; }`: Nginx listens on port 80.
*   `location / { proxy_pass http://frontend:5173; ... }`: Any request to the root path (`/`) will be forwarded to our `frontend` service running on port 5173 within the Docker network.
*   `location /api/ { proxy_pass http://backend:3000; ... }`: Any request starting with `/api/` will be forwarded to our `backend` service running on port 3000 within the Docker network.

Now, after running `docker-compose up --build -d`, you should be able to access your entire application by navigating to `http://localhost` in your browser. Nginx will handle serving the frontend and routing API calls to the backend.

### 6.3. Next Steps: The Infinite Frontier

Congratulations, Planeswalker! You have successfully built the PodTracker PWA from the ground up, from forging its mana base with Docker to crafting its intricate spells with React and Node.js. This primer has equipped you with the fundamental knowledge and practical steps to create a modern web application.

However, the journey of a developer, much like that of a Planeswalker, is an infinite frontier. Here are some next steps and areas for further exploration:

*   **Implement Remaining Features:** The current PodTracker is a foundation. Dive into implementing the full suite of features outlined in the introduction, such as detailed game tracking, pod management, and real-time chat.
*   **Error Handling and Logging:** Implement more robust error handling mechanisms and integrate a logging solution to monitor your application in production.
*   **Advanced Authentication:** Explore more advanced authentication strategies, such as OAuth or integrating with third-party identity providers.
*   **Real-time Communication:** For features like chat, consider integrating WebSockets (e.g., Socket.IO) for real-time, bidirectional communication between the client and server.
*   **Performance Optimization:** Optimize your frontend and backend for speed and efficiency. This includes code splitting, image optimization, database query optimization, and caching strategies.
*   **Security Best Practices:** Deepen your understanding of web security and implement measures to protect against common vulnerabilities (e.g., XSS, CSRF, SQL injection).
*   **Automated Testing:** Expand your test suite to include end-to-end (E2E) tests using tools like Cypress or Playwright.
*   **CI/CD (Continuous Integration/Continuous Deployment):** Set up automated pipelines to build, test, and deploy your application whenever changes are pushed to your repository.
*   **Cloud Deployment:** Learn how to deploy your Dockerized application to cloud platforms like AWS, Google Cloud, or Azure.
*   **Monitoring and Observability:** Implement tools for monitoring your application's health, performance, and user behavior in production.

Remember, every line of code you write is a spell, and every application you build is a new plane you've created. Keep exploring, keep learning, and may your mana always be abundant!
