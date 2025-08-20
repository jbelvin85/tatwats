# The PodTracker Primer: Building a PWA from the Ground Up

Welcome, aspiring Planeswalker, to the PodTracker Primer! Just as a skilled mage meticulously crafts their deck, we will meticulously build a modern Progressive Web Application (PWA) designed to enhance your Magic: The Gathering Commander experience. This primer is your spellbook, guiding you through each step of constructing PodTracker, from the foundational mana of Docker to the intricate enchantments of React and Node.js.

## Table of Contents

1.  [Introduction to PodTracker and PWA Concepts](#1-introduction-to-podtracker-and-pwa-concepts)
    1.1. [What is PodTracker?](#11-what-is-podtracker)
    1.2. [What is a Progressive Web Application (PWA)?](#12-what-is-a-progressive-web-application-pwa)
    1.3. [Overview of PodTracker's Architecture: The Three-Tiered Mana Base](#13-overview-of-podtrackers-architecture-the-three-tiered-mana-base)
2.  [Setting Up Your Development Environment](#2-setting-up-your-development-environment)
    2.1. [Prerequisites: Gathering Your Tools](#21-prerequisites-gathering-your-tools)
    2.2. [Cloning the Repository: Summoning the Codebase](#22-cloning-the-repository-summoning-the-codebase)
    2.3. [Initial Docker Setup: Forging the Mana Base](#23-initial-docker-setup-forging-the-mana-base)
    2.4. [Backend Environment Configuration: Attuning Your Spells](#24-backend-environment-configuration-attuning-your-spells)
3.  [The Backend: The Command Zone (Node.js, Express, TypeScript, Zod, Prisma)](#3-the-backend-the-command-zone-nodejs-express-typescript-zod-prisma)
    3.1. [Project Structure: Mapping the Command Zone](#31-project-structure-mapping-the-command-zone)
    3.2. [Database Schema (Prisma): Crafting the Library's Lore](#32-database-schema-prisma-crafting-the-librarys-lore)
    3.3. [API Design Principles: The Art of the Spellcast](#33-api-design-principles-the-art-of-the-spellcast)
    3.4. [Building Core API Endpoints: Unleashing Basic Spells](#34-building-core-api-endpoints-unleashing-basic-spells)
    3.5. [Authentication (JWT): Warding Your Domain](#35-authentication-jwt-warding-your-domain)
4.  [The Frontend: The Battlefield (React, Vite, SWR, Tailwind CSS)](#4-the-frontend-the-battlefield-react-vite-swr-tailwind-css)
    4.1. [Project Setup: Preparing the Battlefield](#41-project-setup-preparing-the-battlefield)
    4.2. [Component-Based Architecture: Assembling Your Forces](#42-component-based-architecture-assembling-your-forces)
    4.3. [State Management: Controlling the Flow of Battle](#43-state-management-controlling-the-flow-of-battle)
    4.4. [Data Fetching with SWR: Scrying for Information](#44-data-fetching-with-swr-scrying-for-information)
    4.5. [Styling with Tailwind CSS: Adorning Your Champions](#45-styling-with-tailwind-css-adorning-your-champions)
    4.6. [Routing: Navigating the Planes](#46-routing-navigating-the-planes)
    4.7. [PWA Features: The Planeswalker's Spark](#47-pwa-features-the-planeswalkers-spark)
5.  [Testing: The Gauntlet (Jest, Supertest)](#5-testing-the-gauntlet-jest-test)
    5.1. [Unit Testing: Proving Your Spells](#51-unit-testing-proving-your-spells)
    5.2. [Integration Testing: Testing the Combo](#52-integration-testing-testing-the-combo)
    5.3. [Running Tests: Facing the Challenge](#53-running-tests-facing-the-challenge)
6.  [Deployment and Beyond: The Victory Lap](#6-deployment-and-beyond-the-victory-lap)
    6.1. [Local Deployment with Docker Compose: Unleashing Your Creation](#61-local-deployment-with-docker-compose-unleashing-your-creation)
    6.2. [Basic Nginx Configuration: The Grand Arena](#62-basic-nginx-configuration-the-grand-arena)
    6.3. [Next Steps: The Infinite Frontier](#63-next-steps-the-infinite-frontier)

## 1. Introduction to PodTracker and PWA Concepts

### 1.1 What is PodTracker?

PodTracker is a web application designed for Magic: The Gathering Commander players. It aims to provide a comprehensive suite of tools for managing your play experience, including:

*   **Pod Management:** Organize your playgroups, much like assembling your trusted companions for a grand quest.
*   **Deck Lists:** Keep track of your formidable decklists, complete with commander details and links to external deckbuilding sites.
*   **Game Tracking:** Record the ebb and flow of your battles, from life totals and commander damage to turn order and significant in-game events. Think of it as a detailed chronicle of your epic duels.
*   **Match History:** Review your entire game history, allowing you to analyze past strategies and learn from every encounter.
*   **Player Statistics:** Gain insights into your performance, deck win-rates, and more, helping you refine your skills and master the battlefield.
*   **Chat:** Communicate with your pod members, strategizing or sharing tales of victory and defeat.

### 1.2 What is a Progressive Web Application (PWA)?

Just as a powerful artifact can adapt to various situations, a Progressive Web Application (PWA) is a web application that offers an enhanced, app-like experience directly within a web browser. PWAs are designed to be:

*   **Reliable:** They load instantly and reliably, even in uncertain network conditions, thanks to the magic of Service Workers (your personal scryer, predicting and caching what you'll need).
*   **Fast:** They respond quickly to user interactions with silky smooth animations and no janky scrolling, ensuring a seamless experience.

*   **Engaging:** They feel like a native application on any device, offering features like push notifications, offline access, and the ability to be "installed" to the home screen, bypassing the app store.

PodTracker is being built as a PWA to provide a robust, accessible, and engaging experience for all players, regardless of their device or network connection.

### 1.3 Overview of PodTracker's Architecture: The Three-Tiered Mana Base

PodTracker follows a standard three-tier web architecture, much like a well-balanced mana base supporting your most potent spells. Each tier has a distinct role, working in harmony to deliver the application's functionality:

*   **Frontend (The Battlefield):** This is what the user sees and interacts with – the visual interface where the game unfolds. Built with React, Vite, SWR, and Tailwind CSS, it's responsible for rendering the UI, handling user input, and displaying data.
*   **Backend (The Command Zone):** This tier acts as the central brain, processing requests from the frontend, interacting with the database, and enforcing business logic. Our backend is powered by Node.js with Express, TypeScript, and Zod.
*   **Database (The Library):** This is where all the persistent data is stored – your game history, decklists, player profiles, and more. We utilize PostgreSQL with Prisma ORM to manage and query our data efficiently.

These three tiers communicate seamlessly, ensuring that your actions on the battlefield are recorded in the library and processed by the command zone, creating a cohesive and powerful application.
