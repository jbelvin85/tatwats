# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/en/2.0.0/).

## [Unreleased]

### Added
- **Infrastructure:** Implemented Gemini API reporting mechanism in `the_gemini_connector` to process and log helper reports.

### Changed
- **Documentation:** Clarified the distinction between the tatwats project and the PodTracker example PWA across various helper and documentation files.
- **Documentation:** Updated The Archivist's duties to include committing and pushing documentation changes to the GitHub repository.

## 0.2.3 - 2025-08-20

### Changed

- **Documentation:** Updated `ROADMAP.md` to reflect the TATWATS framework context and include proposed administrative and monitoring UI pages.

## 0.2.2 - 2025-08-20

### Added

- **Frontend:** Initiated development of the user dashboard.

## 0.2.1 - 2025-08-20

### Added

- Introduced `start_all.bat` for Windows to automate launching the backend server, frontend application, and message listener.
- Introduced `start_all.sh` for macOS/Linux to automate launching the backend server, frontend application, and message listener.
- Introduced `stop_all.bat` for Windows to automate stopping the backend server, frontend application, and message listener.
- Introduced `stop_all.sh` for macOS/Linux to automate stopping the backend server, frontend application, and message listener.

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
