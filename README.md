# CropCarbon Impact Portal

A lightweight static web app that lets visitors:

- Estimate their personal carbon footprint using common lifestyle inputs.
- Follow rich field dispatch posts that show which landscapes are raising funds, coming soon, or already thriving.
- Explore a polished campaign portfolio with live project metrics, funding progress, and portfolio rollups.
- Make donations through secure Stripe Checkout, watch campaign progress update, and see impact metrics move in real time.
- Manage content from a built-in admin panel—no need to edit source files for quick changes.
- Persist campaign projects, field updates, and donations in Firebase Firestore (with local caching for offline edits).
- Offer donors a clear breakdown of how funds flow across deployment, farmer enablement, and verification.

## Getting Started

The portal can run as a static site, but enabling Stripe payments requires the lightweight Node server included in this repo.

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

1. Copy `.env.example` to `.env`.
2. Fill in `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, and (optionally) `APP_URL` with your own values.
3. Populate the Firebase fields (`FIREBASE_API_KEY`, `FIREBASE_PROJECT_ID`, etc.) from your Firebase project settings so projects sync through Firestore.
4. Use Stripe test keys while building and swap to live keys before launch.

### 3. Start the server

```bash
npm start
```

By default the app is available at [http://localhost:3000](http://localhost:3000).

### 4. Explore the experience

1. Visit the running site and adjust the calculator inputs to estimate your annual per-person footprint.
2. Browse the refreshed campaign grid, transparency breakdown, and field dispatch feed to see how funding is used.
3. Use the donation form to launch a real Stripe Checkout session—successful payments are reconciled back into the portal automatically.
4. Click **Open Admin** in the hero to edit campaign totals or publish new field updates instantly.
5. Refresh the page—your edits persist through Firestore (or local cache if offline) so you can continue curating without re-entry.

### 5. Connect Firebase (optional but recommended)

- With valid Firebase credentials the portal automatically seeds Firestore with the starter projects, updates, and donations.
- Subsequent admin changes write back to Firestore so every visitor (and device) sees the same curated content.
- If Firebase is not configured the portal gracefully falls back to local storage so you can still demo the experience.

## Project Structure

```
├── index.html       # Application layout
├── styles.css       # Visual design, status styling, and admin panel layout
├── app.js           # Calculator logic, campaign data, Stripe integration, and admin tooling
├── server.js        # Express server exposing Stripe Checkout endpoints and serving static assets
├── package.json     # Node dependencies and scripts
├── .env.example     # Template for required environment variables
└── README.md
```

## Customisation Ideas

- Update the emission factors in `app.js` with region-specific data.
- Replace the campaign projects or dispatch arrays with live data from your backend or CMS.
- Swap out the seeded projects with your own landscapes to update the portfolio rollups instantly.
- Gate the admin panel behind authentication before deploying publicly.
- Add additional Stripe metadata (impact tags, campaign IDs) inside `server.js` to sync with your CRM or data warehouse.
- Tailor the transparency grid in `index.html` to match your real-world fund allocation model.
- Connect the donation confirmation flow to webhook listeners for authoritative ledger updates.

## Stripe configuration tips

- **Test mode first** – Stripe test keys let you validate the flow using cards like `4242 4242 4242 4242` before collecting real money.
- **Set `APP_URL` for production** – Stripe must redirect back to a publicly accessible URL; update the value when deploying.
- **Webhooks recommended** – The portal updates totals on the client once Stripe confirms payment, but production deployments should also consume webhooks for a source-of-truth ledger.
- **Recurring donations** – Selecting monthly or annual frequency creates a Stripe subscription session using the amount you enter.

## Firebase integration tips

- **Firestore structure** – The app stores campaign totals in `campaign/summary`, project tiles in the top-level `projects` collection, field updates in `updates`, and a rolling donation log in `donations`.
- **Security rules** – Lock down read/write access to authenticated admins before launching publicly; the demo assumes development rules.
- **Seeding behaviour** – When the collections are empty the portal writes the seeded sample data to Firestore so you never start with a blank screen.
