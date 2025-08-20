
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
