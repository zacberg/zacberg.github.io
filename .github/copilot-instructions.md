# Workspace Notes

- This is a static GitHub Pages prototype. Keep the implementation in `index.html`, `styles.css`, and `app.js`; do not add a build step, framework, dependency, or backend.
- Keep every patient, account, and care-team record fictional. The on-page warning must remain visible on every route.
- Keep all app data in the single localStorage key `carerelay-demo`, and wrap every storage read/write in `try/catch`.
- Preserve hash routing, role-specific navigation, sign-in and registration, identity-gated insurance, doctor search and appointment booking, patient approval queues, pharmacy pricing and prescription checks, order tracking, and patient-only payment history.
- Keep caregiver requests pending until patient approval, limit providers to their own booked visits and the explicitly allowed patient fields, and deny patients access to other patient record IDs.
- Keep the coordinator roster's assignment, search, filter, add, and CSV-export controls working.
- Keep the red cross mark, existing colors, fonts, glass-card styling, and responsive layouts consistent.
- No dependencies or extensions are required. Open `index.html` in a browser to run it.
- Validate UI changes in a browser at desktop and mobile widths when browser tools are available.