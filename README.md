# AlpMed Trade website

A responsive static website for a Swiss-led pre-owned medical equipment brokerage.

## Website files

The complete website is present in both `main` and `gh-pages`:

- `index.html` — page structure and copy
- `styles.css` — responsive visual design
- `app.js` — catalogue filters, dialogs and enquiry handling
- `inventory.js` — catalogue inventory
- `assets/favicon.svg` — site icon
- `robots.txt` and `.nojekyll` — static hosting files

## Publish the website

The deployment-ready branch is **`gh-pages`**. No build process is required.

Open **Settings → Pages** and select:

- **Source:** Deploy from a branch
- **Branch:** `gh-pages`
- **Folder:** `/ (root)`

Then click **Save**. The published address is:

`https://hendrivi.github.io/alpmed-trade/`

Direct settings link:

`https://github.com/HendriVi/alpmed-trade/settings/pages`

## Required before commercial launch

1. Register the chosen domain and replace `trade@alpmedtrade.com` in `index.html` and `app.js`.
2. Replace the six demonstration listings in `inventory.js` with verified inventory.
3. Remove the yellow demonstration banner from `index.html`.
4. Connect both forms to an email service, CRM or form endpoint.
5. Add the registered company name, address, privacy notice, terms and regulatory disclosures.
6. Verify ownership, condition, configuration, documentation, deinstallation scope and regulatory status for every listed asset.

## Updating inventory

Edit `inventory.js`. The catalogue count, filters and country list update automatically.

## Local preview

Open `index.html` directly, or run:

```bash
python3 -m http.server 8080
```

Then visit `http://localhost:8080`.
