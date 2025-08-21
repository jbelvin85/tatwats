# TATWATS Development Roadmap

This document outlines the planned architectural and feature enhancements for the TATWATS framework. It is a living document that will be updated as the project evolves.

---

## Phase 0: Foundational System Setup

This phase focuses on establishing the core environment and security practices for the TATWATS project.

### Epic 0.1: Credential Management and Security Hardening

*   **Objective:** Ensure secure and verifiable management of all system and application credentials.
*   **Tasks:**
    1.  **Credential Verification and Configuration:** Implement a clear process for users to verify and configure PostgreSQL and application-level credentials, ensuring they are correctly set up in the `.env` file and correspond to active, properly permissioned accounts.

---

## Phase 1: Real-time Infrastructure Foundation

This phase focuses on upgrading the core infrastructure to be more robust, scalable, and efficient, providing a real-time experience for the user.

### Epic 1.1: Database-Driven Message Bus
*   **Objective:** Replace the current file-based messaging system with a transactional, database-driven approach.
*   **Tasks:**
    1.  **Schema Design:** Design and finalize the schemas for `conversations` and `messages` tables in PostgreSQL.
    2.  **Database Migration:** Create a script to migrate any existing messages from the file system to the new database tables.
    3.  **Backend Refactoring:** Update the backend API and helper communication logic to use the database for all message read/write operations.
    4.  **Frontend Refactoring:** Update the `ChatMonitor` component to fetch messages from the new database-backed API endpoints.
    5.  **Cleanup:** Decommission and remove the old file-based `common_room` message directory.

### Epic 1.2: Real-time UI Layer
*   **Objective:** Eliminate polling by implementing a WebSocket layer for instant client-server communication.
*   **Tasks:**
    1.  **Dependency Integration:** Add and configure `socket.io` (or a similar library) on both the backend server and the React frontend.
    2.  **Backend Implementation:** Create a WebSocket service that emits events when key actions occur (e.g., `process_status_changed`, `new_message_received`).
    3.  **Frontend Refactoring (`Dashboard`):** Modify the `Dashboard.js` component to listen for `process_status_changed` events and update the UI in real-time, removing the 5-second polling interval.
    4.  **Frontend Refactoring (`ChatMonitor`):** Modify the `ChatMonitor.js` component to listen for `new_message_received` events and append new messages instantly, removing its polling interval.

---

## Phase 2: Core Framework Functionality

This phase focuses on building the essential features that define TATWATS as a meta-framework for procedurally generating PWA projects.

### Epic 2.1: Project Scaffolding Engine
*   **Objective:** Create the systems necessary for users to define, create, and manage new PWA projects via the TATWATS UI.
*   **Tasks:**
    1.  **Schema Design:** Design and implement a `projects` table in the database to store metadata for each user-created application.
    2.  **API Development:** Build the backend CRUD API endpoints for managing projects.
    3.  **UI Development:** Create a new "Projects" frontend module to provide a user interface for creating, viewing, and managing projects.
    4.  **Helper Empowerment:** Grant a designated helper (e.g., The Author) the capability to execute sandboxed shell commands necessary for scaffolding a new project (e.g., `npx create-react-app`).

### Epic 2.2: Helper Process Sandboxing (Research & PoC)
*   **Objective:** Enhance framework security and stability by investigating methods to isolate helper processes from the core system.
*   **Tasks:**
    1.  **Research:** Conduct a formal investigation into using Docker or similar containerization technologies to sandbox Node.js child processes.
    2.  **Proof of Concept (PoC):** Develop a small-scale proof of concept demonstrating the ability of the main backend server to start, stop, and communicate with a single helper running inside a dedicated Docker container.
    3.  **Documentation:** Record the findings, trade-offs, and a detailed implementation proposal in a new `docs/DECISIONS.md` document.