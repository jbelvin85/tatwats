# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/en/2.0.0/).

## [Unreleased]

### Added
- **Infrastructure:** Created `Dockerfile`s for backend and frontend services.
- **Infrastructure:** Introduced `docker-compose.yml` for containerized PostgreSQL management.
- **Scripts:** Created robust cross-platform `setup.sh`/`setup.bat` scripts for initial project configuration and `.env` file generation.
- **Scripts:** Created robust cross-platform `deploy.sh`/`deploy.bat` scripts to bring up all services (PostgreSQL, backend, frontend).
- **Scripts:** Created robust cross-platform `shutdown.sh`/`shutdown.bat` scripts to safely bring down all services.
- **Backend:** Added a `/api/status/server` endpoint to report backend server status.
- **Frontend:** Updated `HomePage.js` to serve as the TATWATS Administrator Control Panel, displaying backend server status.
- **Frontend:** Integrated `RecentChatsCard.js` into `Dashboard.js` to display recent conversations.
- **Frontend:** Implemented client-side routing using `react-router-dom` for individual pages (Home, Process Management, Helper Admin, Chat, User Management).
- **Frontend:** Implemented `UserManagement.js` for user administration.
- **Frontend:** Implemented `ChatApp.js` for chat functionality.

### Changed
- **Backend:** Refactored `database.js` to use PostgreSQL (`pg` library) instead of SQLite.
- **Backend:** Updated `routes.js` to support group chat functionality and use PostgreSQL queries.
- **Frontend:** Updated `ChatApp.js` to support group chat UI and interact with the new chat API.
- **Frontend:** Enhanced `Dashboard.js` and `Dashboard.css` for improved UI/UX and styling.
- **Scripts:** Replaced `start_all.bat`/`start_all.sh` and `stop_all.bat`/`stop_all.sh` with new `deploy` and `shutdown` scripts.
- **Documentation:** Updated `the.MEDIATOR.md` to reflect the transition from file-based communication to the new database-driven chat system.
- **Documentation:** Updated `README.md` with new setup and deployment instructions.
- **Documentation:** Updated `docs/ROADMAP.md` with the Admin Control Panel architectural outline.
- **Helpers:** Updated `the_gemini_connector/gemini_connector.js` to use `node-fetch` and interact with the new chat API.
- **Dependencies:** Updated `webapp/client/package.json` and `webapp/client/package-lock.json` for `react-router-dom` and other dependencies.
- **Dependencies:** Updated `webapp/server/package.json` and `webapp/server/package-lock.json` for dependency updates.

### Removed
- **Infrastructure:** Removed `helpers/the_mediator/scripts` and `helpers/the_mediator/common_room` directories as they are no longer needed due to the new database-driven chat system.
- **Frontend:** Removed `ChatMonitor` import from `App.js` as it's no longer directly rendered.

### Fixed
- **Backend:** Corrected `SyntaxError: Identifier 'express' has already been declared` in `webapp/server/index.js`.
- **Backend:** Removed invalid triple quotes and duplicate `module.exports` in `webapp/server/routes.js`.

### Added
- **Infrastructure:** Created `Dockerfile`s for backend and frontend services.

### Changed
- **Infrastructure:** Updated `docker-compose.yml` to include backend and frontend services.
- **Scripts:** Simplified `deploy.sh`/`deploy.bat` to use `docker-compose up -d --build`.
- **Scripts:** Simplified `shutdown.sh`/`shutdown.bat` to use `docker-compose down`.

### Added
- **Infrastructure:** Introduced `docker-compose.yml` for containerized PostgreSQL management.
- **Scripts:** Created robust cross-platform `setup.sh`/`setup.bat` scripts for initial project configuration and `.env` file generation.
- **Scripts:** Created robust cross-platform `deploy.sh`/`deploy.bat` scripts to bring up all services (PostgreSQL, backend, frontend).
- **Scripts:** Created robust cross-platform `shutdown.sh`/`shutdown.bat` scripts to safely bring down all services.
- **Backend:** Added a `/api/status/server` endpoint to report backend server status.
- **Frontend:** Updated `HomePage.js` to serve as the TATWATS Administrator Control Panel, displaying backend server status.
- **Frontend:** Integrated `RecentChatsCard.js` into `Dashboard.js` to display recent conversations.
- **Frontend:** Implemented client-side routing using `react-router-dom` for individual pages (Home, Process Management, Helper Admin, Chat).

### Changed
- **Backend:** Refactored `database.js` to use PostgreSQL (`pg` library) instead of SQLite.
- **Backend:** Updated `routes.js` to support group chat functionality and use PostgreSQL queries.
- **Frontend:** Updated `ChatApp.js` to support group chat UI and interact with the new chat API.
- **Frontend:** Enhanced `Dashboard.js` and `Dashboard.css` for improved UI/UX and styling.
- **Scripts:** Replaced `start_all.bat`/`start_all.sh` and `stop_all.bat`/`stop_all.sh` with new `deploy` and `shutdown` scripts.
- **Documentation:** Updated `the.MEDIATOR.md` to reflect the transition from file-based communication to the new database-driven chat system.

### Removed
- **Infrastructure:** Removed `helpers/the_mediator/scripts` and `helpers/the_mediator/common_room` directories as they are no longer needed.
- **Frontend:** Removed `ChatMonitor` import from `App.js` as it's no longer directly rendered.

## 0.2.3 - 2025-08-20

### Changed

- **Documentation:** Updated `ROADMAP.md` to reflect the TATWATS framework context and include proposed administrative and monitoring UI pages.

## 0.2.2 - 2025-08-20

### Added

- **Frontend:** Initiated development of the user dashboard.

## 0.2.1 - 2025-08-20

### Added

- Renamed `start_all.bat` and `start_all.sh` to `start.bat` and `start.sh` for brevity.
- Renamed `stop_all.bat` and `stop_all.sh` to `stop.bat` and `stop.sh` for brevity.

## 0.2.0 - 2025-08-20

### Changed

- Converted `send_message.sh` to `send_message.js` (Node.js) for cross-platform compatibility.
- Converted `check_messages.sh` to `check_messages.js` (Node.js) for cross-platform compatibility.
- Converted `read_message.sh` to `read_message.js` (Node.js) for cross-platform compatibility.
- Removed deprecated shell scripts (`send_message.sh`, `check_messages.sh`, `read_message.sh`).
- Updated `HELPER_COMMUNICATION.md` to reflect the new Node.js script usage and instructions.

## 0.1.1 - 2025-08-20

### Changed

- Fixed hardcoded absolute paths in `send_message.sh`, `check_messages.sh`, and `read_message.sh` to use relative paths.

## 0.1.0 - 2025-08-20

### Added

- Initial project scaffolding and directory structure.
- Basic documentation including `README.md` and `docs/`.
- Core web application structure (`webapp/client` and `webapp/server`).
- Defined The Mediator's role and communication protocols in `the.MEDIATOR.md`.
- Implemented initial message passing functionality with shell scripts (`send_message.sh`, `check_messages.sh`, `read_message.sh`).
- Documented basic helper communication setup in `HELPER_COMMUNICATION.md`.


## 0.2.3 - 2025-08-20

### Changed

- **Documentation:** Updated `ROADMAP.md` to reflect the TATWATS framework context and include proposed administrative and monitoring UI pages.

## 0.2.2 - 2025-08-20

### Added

- **Frontend:** Initiated development of the user dashboard.

## 0.2.1 - 2025-08-20

### Added

- Renamed `start_all.bat` and `start_all.sh` to `start.bat` and `start.sh` for brevity.
- Renamed `stop_all.bat` and `stop_all.sh` to `stop.bat` and `stop.sh` for brevity.

## 0.2.0 - 2025-08-20

### Changed

- Converted `send_message.sh` to `send_message.js` (Node.js) for cross-platform compatibility.
- Converted `check_messages.sh` to `check_messages.js` (Node.js) for cross-platform compatibility.
- Converted `read_message.sh` to `read_message.js` (Node.js) for cross-platform compatibility.
- Removed deprecated shell scripts (`send_message.sh`, `check_messages.sh`, `read_message.sh`).
- Updated `HELPER_COMMUNICATION.md` to reflect the new Node.js script usage and instructions.

## 0.1.1 - 2025-08-20

### Changed

- Fixed hardcoded absolute paths in `send_message.sh`, `check_messages.sh`, and `read_message.sh` to use relative paths.

## 0.1.0 - 2025-08-20

### Added

- Initial project scaffolding and directory structure.
- Basic documentation including `README.md` and `docs/`.
- Core web application structure (`webapp/client` and `webapp/server`).
- Defined The Mediator's role and communication protocols in `the.MEDIATOR.md`.
- Implemented initial message passing functionality with shell scripts (`send_message.sh`, `check_messages.sh`, `read_message.sh`).
- Documented basic helper communication setup in `HELPER_COMMUNICATION.md`.