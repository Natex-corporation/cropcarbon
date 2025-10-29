# CropCarbon Impact Portal

A lightweight static web app that lets visitors:

- Estimate their personal carbon footprint using common lifestyle inputs.
- Learn how CropCarbon uses donations across high-impact regenerative agriculture projects.
- Make donations and see live campaign progress updates.

## Getting Started

No build tools are required—everything runs in the browser.

1. Open `index.html` in any modern browser.
2. Adjust the calculator inputs to estimate your annual per-person footprint.
3. Explore the campaign panel to see the initiatives donations support.
4. Use the donation form to simulate contributions and watch the progress bar update.

## Project Structure

```
├── index.html      # Application layout
├── styles.css      # Visual design and responsive layout
├── app.js          # Calculator logic, campaign data, and donation handling
└── README.md
```

## Customisation Ideas

- Update the emission factors in `app.js` with region-specific data.
- Replace the campaign projects array with live data from your backend or CMS.
- Connect the donation handler to your payment processor API.
