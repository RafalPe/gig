# 🎵 GigBuddies (Work in Progress)
 
> 🚧 **Project Status:** Under active development. Deployed on Vercel.

**GigBuddies** is a full-stack web platform that connects music fans. It allows users to discover concerts, create "crews" (groups) for events, and communicate in real-time. The project integrates official data (from the Ticketmaster API) with community-created events, featuring a robust moderation system.

## 🚀 Key Features

### 🎧 For Users

* **Advanced Discovery:**
    * Server-side search with Debouncing.
    * Optimized Pagination with Prefetching for instant navigation.
    * Filter by verified/official events.
* **Crew Management:**
    * Create groups for specific events.
    * **Optimistic UI:** Instant feedback when joining/leaving groups (powered by RTK Query).
* **Real-Time Chat:** Live messaging within groups using Pusher (WebSockets).
* **User Dashboard:**
    * **My Crews:** Manage joined groups.
    * **My Submissions:** Track status of submitted events (Pending/Verified).
    * **Profile Settings:** Edit profile details.
* **Event Submission:** Users can submit events (requires Admin verification).
* **Safety & Logic:** Users cannot delete an event if active groups exist – a "Deletion Request" flow is triggered instead.

### 🛡️ For Administrators

* **Verification Panel:** Review and approve/reject user-submitted events.
* **Request Handling:** Review deletion requests from organizers who want to cancel events with active users.
* **Data Import:** Automated Cron Job (or manual trigger) to sync events from Ticketmaster API.

---

## 🛠️ Tech Stack

### Frontend
* **Framework:** [Next.js 15](https://nextjs.org/) (App Router, Server Components).
* **Language:** TypeScript.
* **State Management:** [Redux Toolkit](https://redux-toolkit.js.org/) + **RTK Query** (Caching, Invalidation, Optimistic Updates).
* **Real-Time:** Pusher (WebSockets).
* **UI:** [Material UI (MUI v5)](https://mui.com/) + Framer Motion (Animations).
* **Forms:** React Hot Toast + Zod Validation.

### Backend & Database
* **API:** Next.js Route Handlers (REST).
* **Database:** PostgreSQL (hosted on Neon/Vercel).
* **ORM:** [Prisma](https://www.prisma.io/) (Schema, Migrations, Seeding).
* **Auth:** [NextAuth.js](https://next-auth.js.org/) (GitHub OAuth).
* **Scheduling:** Vercel Cron Jobs.

### QA & CI/CD
* **E2E Testing:** Playwright (with isolated Docker DB).
* **Unit/Integration:** Jest + React Testing Library.
* **Git Hooks:** Husky (pre-commit linting, pre-push testing).

---

## 💡 Architectural Decisions

> **⚠️ Note on Redux:** I am aware that using Redux in a Next.js project is often considered overkill. However, I chose to use it here **intentionally** to demonstrate proficiency with this ecosystem and to handle complex client-side patterns like Optimistic UI.

### 1. Real-Time Chat (Pusher vs Polling)
Instead of polling the database every few seconds (which kills serverless limits), I implemented Event-Driven Architecture using Pusher. The server publishes an event only when a message is created, and clients react instantly via WebSockets.

### 2. Safety First: The "Deletion Request" Flow
A common issue in social apps is "trolling" by deleting popular events. I implemented a logic check:
* **If an event has 0 groups:** The organizer can delete it instantly.
* **If an event has active groups:** The delete button is replaced by a "Request Deletion" flow. The Admin must review the reason before removing the event, preserving the community's plans.

### 3. RTK Query & Cache Invalidation
I refactored standard `useEffect` fetching to RTK Query. This provides automatic cache invalidation using Tags. For example, when a user joins a group, the `Group` tag is invalidated, automatically refetching the list without manual state management.

---

## ⚙️ Local Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/RafalPe/gig.git
   cd gig
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Create a `.env` file based on the template below:
   ```env
   # Database
   DATABASE_URL="postgresql://user:password@localhost:5432/gig_dev"

   # NextAuth
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key"
   GITHUB_ID="your-github-id"
   GITHUB_SECRET="your-github-secret"

   # Integrations
   TICKETMASTER_API_KEY="your-ticketmaster-key"

   # Pusher (Real-Time)
   PUSHER_APP_ID="your-app-id"
   PUSHER_KEY="your-key"
   PUSHER_SECRET="your-secret"
   PUSHER_CLUSTER="eu"
   NEXT_PUBLIC_PUSHER_KEY="your-key"
   NEXT_PUBLIC_PUSHER_CLUSTER="eu"

   # Cron Security
   CRON_SECRET="your-random-token"

   # App URL
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```

4. **Setup Database:**
   ```bash
   npx prisma migrate dev
   npx prisma db seed
   ```

5. **Run Development Server:**
   ```bash
   npm run dev
   ```

---

## ✅ Testing

* **Unit & Integration:**
  ```bash
  npm run test
  ```
* **End-to-End (E2E):**
  ```bash
  npx playwright test
  ```
* **Type Check:**
  ```bash
  npm run check:all
  ```
