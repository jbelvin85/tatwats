
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
