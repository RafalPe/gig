# 🎵 GigBuddies (Work in Progress)

> 🚧 **Project Status:** Under active development. Core features are implemented; optimization and expansion of social features are ongoing.

**GigBuddies** is a full-stack web platform that connects music fans. It allows users to discover concerts, create "crews" (groups) for events, and communicate with each other. The project integrates official data (from the Ticketmaster API) with community-created events.

## 🚀 Key Features

### For Users
* **Event Discovery:** Browse and search for concerts (integration with Ticketmaster API + local database).
* **Crew Management:**
    * Create groups for specific events.
    * Join and leave groups (implemented with **Optimistic UI** for instant interface response).
    * View the list of crew members.
* **Community:**
    * Message board (chat) within each group.
    * User profiles.
    * Notifications about new members.
* **Event Submission:** Submission form for users (requires admin verification).

### For Administrators
* **Verification Panel:** Review and approve events submitted by users.
* **Data Import:** Tool for bulk importing events from the Ticketmaster API.

---

## 🛠️ Tech Stack

The project was built based on modern standards and best practices (as of 2025).

### Frontend
* **Framework:** [Next.js 15](https://nextjs.org/) (App Router, Server Components).
* **Language:** TypeScript.
* **State Management:** [Redux Toolkit](https://redux-toolkit.js.org/) + **RTK Query** (for server state management, caching, and tag invalidation).
* **UI:** [Material UI (MUI v5)](https://mui.com/) with a custom theme and responsive design.
* **Forms & Dates:** `react-hot-toast`, `@mui/x-date-pickers`.
* **Animations:** Framer Motion.

### Backend & Database
* **API:** Next.js Route Handlers (REST API).
* **Database:** PostgreSQL.
* **ORM:** [Prisma](https://www.prisma.io/) (data modeling, migrations, seeding).
* **Authentication:** [NextAuth.js](https://next-auth.js.org/) (GitHub Provider, Prisma adapter).
* **Integrations:** Ticketmaster Discovery API.

### Code Quality (QA)
* **Testing:** Jest + React Testing Library (Unit & Integration tests).
* **CI/CD (Local):** Husky + lint-staged.
    * `pre-commit`: Automatic ESLint and formatting.
    * `pre-push`: Blocks code push if tests fail or TypeScript reports errors.

---

## 💡 Key Design Decisions (Why?)

1.  **RTK Query instead of `useEffect`:**
    In the initial phase, data was fetched manually. I decided to refactor to RTK Query to eliminate boilerplate, gain automatic caching, and – most importantly – automatic data revalidation (e.g., the group list refreshes itself after a user joins thanks to the Tag system).

2.  **Optimistic UI:**
    For interactions like "Join group", the application updates the interface immediately, before the server confirms the change. This ensures a feeling of instant app performance. In case of an API error, changes are automatically rolled back.

3.  **PostgreSQL instead of SQLite:**
    Although SQLite is simpler to start with, the project uses PostgreSQL to handle advanced text filtering (`mode: 'insensitive'`) and ensure compatibility with the production environment (Vercel).

---

## ⚙️ Local Setup

To run the project on your local machine:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/RafalPe/gig.git
    cd gig
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure environment variables:**
    Create a `.env` file in the root directory and populate it following this pattern:
    ```env
    # Database (PostgreSQL)
    DATABASE_URL="postgresql://user:password@localhost:5432/gig_dev"

    # NextAuth
    NEXTAUTH_URL="http://localhost:3000"
    NEXTAUTH_SECRET="your-secret-key"
    
    # GitHub OAuth (for login)
    GITHUB_ID="your-github-id"
    GITHUB_SECRET="your-github-secret"

    # External API (optional, required for import)
    TICKETMASTER_API_KEY="your-ticketmaster-key"
    
    # Cron Job Security
    CRON_SECRET="your-random-token"
    ```

4.  **Prepare the database:**
    ```bash
    npx prisma migrate dev  # Creates tables
    npx prisma db seed      # Populates the database with test data (Events, Users)
    ```

5.  **Run the server:**
    ```bash
    npm run dev
    ```

The application will be available at `http://localhost:3000`.

---

## ✅ Testing

The project has a configured testing environment.

* **Run all tests:**
    ```bash
    npm run test
    ```
* **Check types and tests (pre-push simulation):**
    ```bash
    npm run check:all
    ```

---

## 🗺️ Roadmap (Plans)

* [ ] Implement End-to-End (E2E) testing with Cypress/Playwright.
* [ ] Implement WebSockets (Pusher) for real-time chat.
* [ ] Expand the user panel (event history).
