# 🧩 Preproduction Best Practices for PodTracker

Before writing a single line of code, we must prepare the battlefield.  
This **preproduction phase** ensures our goals are clear, our stack is stable, and our project flows smoothly once we begin coding.  

---

## 1. Define the Vision (Your Win Condition)
- **Project Goals:** Why does this app exist?  
- **Target Audience:** Who will use it (competitive vs casual MTG players)?  
- **Scope:** Decide what *not* to build at first (focus on MVP).  
- **Core Use Cases:** Write user stories (e.g., “As a user, I want to create a pod, invite friends, and record a match result”).  

> *MTG Analogy:* Choose your **win condition** before building your deck.  

---

## 2. Outline Core Features (Your Core 60 Cards)
- **Must-have (MVP):**
  - User accounts  
  - Deck management  
  - Pod creation & chat  
  - Game result logging  
- **Nice-to-have (future expansions):**
  - Notifications  
  - Stats & analytics  
  - Tournaments  
  - Integrations with MTG APIs  

> *MTG Analogy:* Every deck has **core spells** and **flex slots**.  

---

## 3. Choose the Tech Stack (Your Mana Base)
- **Frontend:** React + TailwindCSS + PWA setup  
- **Backend:** Node.js + Prisma (with Express or similar)  
- **Database:** PostgreSQL  
- **Infrastructure:** Docker for development/production parity  
- **Hosting:** Cloud/VPS/container host (to be decided)  
- **Realtime Support:** Socket.IO / Supabase (for chat & live pods)  

> *MTG Analogy:* The **mana base** must reliably sup
