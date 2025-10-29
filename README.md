# CropCarbon Impact Portal

A lightweight static web app that lets visitors:

- Estimate their personal carbon footprint using common lifestyle inputs.
- Follow rich field dispatch posts that show which landscapes are raising funds, coming soon, or already thriving.
- Make donations, see live campaign progress updates, and watch aggregated impact metrics update in real time.
- Manage content from a built-in admin panel—no need to edit source files for quick changes.

## Getting Started

No build tools are required—everything runs in the browser.

1. Open `index.html` in any modern browser.
2. Adjust the calculator inputs to estimate your annual per-person footprint.
3. Explore the campaign panel and field dispatches to see the initiatives donations support.
4. Use the donation form to simulate contributions and watch the progress bar and land updates respond.
5. Click **Open Admin** in the hero to edit campaign totals or publish new field updates instantly.

## Project Structure

```
├── index.html      # Application layout
├── styles.css      # Visual design, status styling, and admin panel layout
├── app.js          # Calculator logic, campaign data, updates feed, and donation handling
└── README.md
```

## Customisation Ideas

- Update the emission factors in `app.js` with region-specific data.
- Replace the campaign projects or dispatch arrays with live data from your backend or CMS.
- Gate the admin panel behind authentication before deploying publicly.
- Connect the donation handler to your payment processor API.
