# Architectural Decisions

This document records key architectural and design decisions made during the development of the TATWATS project. Each entry includes the decision, its rationale, and its impact.

---

## 1. Decision: Transition to Database-Driven Helper Communication

*   **Date:** 2025-08-22
*   **Status:** Implemented
*   **Decision:** To replace the file-based helper communication system (`helpers/the_mediator/common_room/` and associated scripts) with a PostgreSQL database-driven system.
*   **Rationale:**
    *   **Scalability:** File-based communication does not scale well with an increasing number of helpers or message volume. Database-driven approach provides a more robust and performant solution.
    *   **Reliability:** Centralized database storage improves message persistence and reduces the risk of data loss or inconsistencies inherent in file-based systems.
    *   **Complexity Reduction:** Simplifies helper logic by abstracting message storage and retrieval behind a unified API, rather than requiring each helper to manage file system interactions.
    *   **Real-time Capabilities:** Facilitates the implementation of real-time features (e.g., webhooks) for more immediate helper responses and interactions.
    *   **Consistency:** Aligns with the project's existing use of PostgreSQL for other data, promoting a consistent data storage strategy.
*   **Impact:**
    *   **Backend:** Required refactoring of `webapp/server/database.js` to use PostgreSQL and `webapp/server/routes.js` to expose new chat API endpoints.
    *   **Helpers:** `helpers/the_gemini_connector/gemini_connector.js` was updated to interact with the new API.
    *   **Scripts:** Old `start.bat`/`start.sh` and `stop.bat`/`stop.sh` were replaced by `deploy.bat`/`deploy.sh` and `shutdown.bat`/`shutdown.sh` to manage Dockerized services.
    *   **Documentation:** `HELPER_COMMUNICATION.md` was completely rewritten, and `CHANGELOG.md` was updated to reflect these changes.
    *   **Development Environment:** Requires Docker and Docker Compose for local setup and database management.
