# The Author, The Wizard And The Sourcecode (TATWATS)

Welcome to **TATWATS**, a framework for **building, documenting, and deploying modern Progressive Web Apps (PWAs)** using a **documentation-first architecture**.  

TATWATS uses **AI-assisted writing** to produce a living, educational guide alongside your codebase — a **textbook that updates itself**. Using the **PodTracker app** as a canonical example, TATWATS demonstrates how to go from initial architecture to production-ready PWA while generating **high-quality instructional material in parallel**.

---

## 🧭 Why TATWATS?

Traditional projects often leave documentation as an afterthought, leading to confusion and incomplete guidance. TATWATS changes that by:

1. **Documentation-First:** Every module, API, and feature includes narrative explanation as it is developed.  
2. **AI-Assisted Authoring:** Automatically generates and maintains `THE_PRIMER.md`, keeping it in sync with the codebase.  
3. **Learning by Example:** PodTracker serves as a full-featured reference demonstrating:  
   - React-based frontend  
   - Node.js + Prisma backend  
   - PostgreSQL database  
   - Dockerized development and deployment  
   - Social features (pods, chat, notifications)  
4. **Educational & Practical:** Every code snippet is actionable, verified, and clearly explained.  

---

## 🚀 Key Features

- **Documentation-First Architecture:** Code and narrative evolve together.  
- **AI-Powered Primer:** `THE_PRIMER.md` automatically updates to reflect project changes.  
- **Step-by-Step Tutorials:** Covers setup, development, and deployment.  
- **Progressive Web App:** Offline support, installable, mobile-first.  
- **Social Layer:** Pods, chat, notifications, and user connections modeled and documented.  

---

## 🛠️ Tech Stack

- **Frontend:** React + TailwindCSS + ShadCN  
- **Backend:** Node.js + Prisma ORM  
- **Database:** PostgreSQL  
- **Containerization:** Docker & Docker Compose  
- **AI Integration:** Generates and maintains educational documentation  
- **PWA Features:** Offline caching, installable manifest, service workers  

---

## 📚 Getting Started

1. **Clone the Repository**  
```bash
git clone https://github.com/your-org/tatwats.git
cd tatwats
Install Dependencies

bash
Copy
Edit
npm install
Set Up Environment Variables
This project uses environment variables to manage sensitive information and configuration.

1.  **Create your `.env` file**: Copy the provided `.env.example` file to a new file named `.env` in the project root.
    ```bash
    cp .env.example .env
    ```
2.  **Configure your variables**: Open `.env` and fill in the required values, such as your `GEMINI_API_KEY` and any database connection strings.
    *   **Important**: The `.env` file is ignored by Git and should *never* be committed to version control.
    *   The application uses the `dotenv` package to load these variables at runtime.

### Handling Sensitive Data and Generated Credentials

For security and maintainability, all sensitive data, including API keys, usernames, and passwords, are managed via environment variables. When scripts generate new credentials (e.g., for new users or services), please adhere to the following directives:

*   **Documentation is Mandatory**: Any script that generates credentials will output them to the console. You *must* document these generated credentials immediately in a secure location (e.g., a password manager, a secure note).
*   **Hard Copies for Critical Data**: For critical credentials, it is strongly recommended to create a hard copy (e.g., a printout stored in a secure physical location) in addition to digital documentation.
*   **Strong and Unique**: Always ensure generated credentials are strong, unique, and never hardcoded directly into the application's source code.


Run Development Environment

bash
Copy
Edit
docker-compose up --build
npm run dev
Generate / Update Documentation

bash
Copy
Edit
npm run generate-docs
This updates THE_PRIMER.md to match the current codebase.

📖 Learning Path (Using PodTracker)
Chapter I: Setup & Project Structure → Environment and project scaffolding

Chapter II: Backend Foundations → Database and API architecture

Chapter III: Social Features → Pods, chat, notifications

Chapter IV: Frontend Development → Dashboard, UI components, PWA concepts

Chapter V: Deployment & Infrastructure → Docker, migrations, production deployment

🤝 Contributing
TATWATS welcomes developers and educators. Contributions may include:

Writing new tutorials and AI-guided lessons

Extending the PodTracker example

Adding PWA patterns or integrations

Improving AI documentation generation

Please follow the branching and commit conventions to preserve the integrity of THE_PRIMER.md.

⚡ Vision
TATWATS turns coding into simultaneous learning and teaching. Each project becomes a living textbook, empowering developers to build, understand, and document their work.

PodTracker is the reference implementation — future projects can use TATWATS to maintain authoritative, AI-generated documentation alongside production code.

📜 License
MIT License © 2025 TATWATS Contributors
