# Webmed class prototype

Webmed is a static healthcare service prototype that brings fictional doctor search, insurance, pharmacy, orders, and payment screens into one account. It also includes a care-coordinator patient roster. Every displayed person and record is fictional.

## Run

Open `index.html` in a browser or publish the repository with GitHub Pages. There are no dependencies, frameworks, build steps, or backend services. The app uses hash routes such as `#/login`, `#/register`, `#/home`, and `#/requirements`.

## Demo accounts

Every seeded account uses password `demo123`:

| Role | Email | Demo coverage |
| --- | --- | --- |
| Patient | `elena@demo.test` | Approved coverage, valid lisinopril and expired amoxicillin prescriptions, seeded appointments, patient approvals, pharmacy orders, payment history, and private record. |
| Patient | `priya@demo.test` | Identity verification, no insurance, fictional plan enrollment, Georgia doctor search, appointment booking, and Rx prescription checks. |
| Caregiver | `sam@demo.test` | Acting for Elena; appointments and pharmacy orders enter Elena's approval queue. |
| Provider | `dr.chen@demo.test` | Two seeded appointments; patient view is limited to name, age, weight, and visit reason. |
| Care coordinator | `jordan@demo.test` | Patient roster assignment, search, filters, add-record, and CSV export. |

The complete demo state is stored under the single localStorage key `carerelay-demo`. Use **Reset demo data** in the footer to restore the seeded accounts and records. Every demo account uses password `demo123`.

## Prototype flows

- Find doctors across Tampa and Orlando, Florida, and Atlanta and Savannah, Georgia. Results include specialties and weekly hours; booking offers 30-minute slots within open hours.
- Caregiver bookings and orders wait for patient approval. Elena's home shows the approval queue.
- Pharmacy pricing displays insured and uninsured totals. Rx-only medicines require a current prescription; online payment is simulated and cash on delivery is available.
- Orders include prescription, payment, expected delivery, and a four-step simulated tracking history.
- Insurance access requires a six-digit demo identity code before entering or applying for coverage.

## Files

- `index.html` contains the shared page shell.
- `styles.css` contains the responsive visual styles.
- `app.js` contains hash routing, demo data, and prototype interactions.

This is a class prototype only. Do not enter real patient information or use it for medical decisions.