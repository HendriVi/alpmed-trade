# AlpMed Trade website

A responsive static website for a Swiss-led pre-owned medical equipment brokerage.

## Brand direction

**Working name:** AlpMed Trade  
**Positioning:** Swiss coordination for cross-border transactions in used medical equipment.  
**Important:** The name, domain and email address are proposals. Complete trademark and domain clearance before launch.

## Preview locally

Open `index.html` directly, or run a local static server:

```bash
python3 -m http.server 8080
```

Then visit `http://localhost:8080`.

## Required before launch

1. Register a domain and replace every instance of `trade@alpmedtrade.com` in `index.html` and `app.js`.
2. Replace the six example listings in `inventory.js` with verified inventory.
3. Remove the yellow demo banner from `index.html`.
4. Connect the forms to a proper endpoint or CRM. They currently open a pre-filled email.
5. Add the registered company name, address, privacy notice, terms and any applicable regulatory disclosures.
6. Confirm each item's ownership, condition, configuration, documentation, deinstallation scope and regulatory status before publication.

## Updating inventory

Inventory is stored in `inventory.js`. Keep the same object structure and add or remove entries as needed. The catalogue, counts, country filters and category filters update automatically.

## Deployment

The included GitHub Actions workflow publishes the repository to GitHub Pages whenever the `main` branch changes. In GitHub, set **Settings → Pages → Source** to **GitHub Actions**.

## Structure

- `index.html` — page structure and copy
- `styles.css` — visual system and responsive layout
- `app.js` — filters, dialogs and enquiries
- `inventory.js` — catalogue data
- `.github/workflows/pages.yml` — GitHub Pages deployment
