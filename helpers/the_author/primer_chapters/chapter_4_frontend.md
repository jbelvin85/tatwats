
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
    import React, { useState } from 'react';

    const Counter: React.FC = () => {
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
