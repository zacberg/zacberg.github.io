# Webmed class prototype

Webmed is a static healthcare service prototype that brings fictional doctor search, insurance, pharmacy, orders, and payment screens into one account. It also includes a care-coordinator patient roster. Every displayed person and record is fictional.

## Run

Open `index.html` in a browser or publish the repository with GitHub Pages. There are no dependencies, frameworks, build steps, or backend services. The app uses hash routes such as `#/login`, `#/register`, `#/home`, and `#/requirements`.

## Demo accounts

Every seeded account uses password `demo123`:

| Role | Email |
| --- | --- |
| Patient | `elena@demo.test` |
| Patient | `priya@demo.test` |
| Caregiver | `sam@demo.test` |
| Provider | `dr.chen@demo.test` |
| Care coordinator | `jordan@demo.test` |

The complete demo state is stored under the single localStorage key `carerelay-demo`. Use **Reset demo data** in the footer to restore the seeded accounts and records.

## Files

- `index.html` contains the shared page shell.
- `styles.css` contains the responsive visual styles.
- `app.js` contains hash routing, demo data, and prototype interactions.

This is a class prototype only. Do not enter real patient information or use it for medical decisions.