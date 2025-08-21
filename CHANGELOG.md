# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/en/2.0.0/).

## [Unreleased]

### Added
- **Database:** Integrated PostgreSQL for managing helper definitions.
- **Database:** Implemented a `database.js` module with connection pooling and initialization logic.
- **Database:** Created a `helpers` table to store process configurations.
- **Backend:** Added full CRUD API endpoints (`/api/helpers`) for managing helpers in the database.
- **Frontend:** Developed a new "Helpers Management" module (`HelperAdmin.js`) for full CRUD operations on the helpers table.
- **Frontend:** Implemented a Process Management Dashboard UI to view and control server statuses.
- **Backend:** Added API endpoints (`/api/processes/start/:id`, `/api/processes/stop/:id`, `/api/processes/status/:id`, `/api/processes/allStatus`) for managing application processes.
- **Infrastructure:** Implemented process spawning and termination logic in the backend server for cross-platform compatibility.
- **Infrastructure:** Implemented Gemini API reporting mechanism in `the_gemini_connector` to process and log helper reports.

### Changed
- **Architecture:** Migrated core process configuration from a file-based (`helpers.json`) to a database-driven system.
- **Backend:** Refactored server startup to load helper configurations from PostgreSQL.
- **Frontend:** Updated the main App layout to include the new Helpers Management module.
- **Documentation:** Added PostgreSQL connection variables to `.env.example`.
- **Documentation:** Clarified the distinction between the tatwats project and the PodTracker example PWA across various helper and documentation files.
- **Documentation:** Renamed `The Archivist` to `The Keeper`, consolidating documentation, historical stewardship, and decision-recording responsibilities.

### Removed
- **Infrastructure:** Removed the now-obsolete `helpers.json` configuration file.

### Fixed
- **Infrastructure:** Resolved port conflict issues (e.g., port 3000) by implementing process termination before starting new processes.
- **Infrastructure:** Corrected `npm install` execution for subdirectories by using `cd <directory> && npm install`.

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