
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
