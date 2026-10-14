# MerchTrack

**GPS-verified retail execution and field merchandising platform.** Built for a nationwide FMCG field team: 40+ merchandisers covering retail outlets across Kenya, supervised from a single web and mobile app.

## Results in production

- +15% sales
- 30% reduction in product returns
- Short-supply incidents cut to zero
- 1,000+ SKUs synced reliably in low-connectivity outlets

## Core capabilities

### Verified field visits

- **GPS geofencing:** the merchandiser's location is checked against the store's calibrated coordinates (500 m threshold).
- **Identity check:** a daily facial sync photo is required to unlock the field module.
- **Session timing:** automatic check-in and finalize timestamps give accurate time-on-site metrics.
- **Mandatory proof:** a shelf photo and a digital manager sign-off (signature pad) are required for every visit log.

### Sales and inventory audit

- **Automated sales calculation:** previous stock from the last visit is compared with the current count to derive units sold.
- **Fast SKU lookup:** searchable product catalogue for quick identification in store.
- **FIFO batch ledger:** expiry dates are tracked at shelf level, with alerts when stock is within 30 days of expiry.

### AI-powered intelligence (Gemini via Genkit)

- **Planogram scanner:** snap a shelf photo and compare it to the corporate standard. Missing SKUs and facing issues are flagged with corrective actions.
- **Document extraction:** GRN and physical return documents are scanned and itemised automatically.
- **Executive briefings:** AI summaries of regional performance, including one-tap audio briefings.
- **Trend detection:** time-per-store analysis highlights operational bottlenecks.
- **Exports:** Word (.doc) exports for performance appraisals and KPI scorecards.

### Team and admin tools

- **Team chat:** peer and group messaging with photo sharing, plus automated FIFO and ghost-visit alerts.
- **Node calibration:** admins set precise geofences with a live GPS lock at the store.
- **KM audit engine:** reported mileage is reconciled with GPS path data to detect travel claim variances.
- **Performance console:** unit-sales goals per SKU with regional pacing against target.

### Offline-first and mobile-optimised

Built for poor connectivity in retail basements: data is captured offline and syncs automatically once a signal returns. The interface is designed for field smartphones.

## How it is used: role by role

### Merchandiser

- **Dashboard:** weekly stats and sales progress against targets.
- **Logging a visit:** guided flow with automatic GPS capture, mandatory photo proof and smart sales and stock reporting.
- **Activity log:** complete history of past visits.
- **Tasks:** a dedicated tab for assigned jobs.
- **AI planogram verification:** use the device camera to check shelf compliance.

### Supervisor

- **Supervisor dashboard:** team performance, pending tasks and recent activity per team member.
- **Team monitoring:** drill down into any merchandiser's full activity log.
- **My activities:** supervisors log their own field visits.
- **Reports and targets:** view-only access to company-wide reports and sales targets.

### Admin, Manager and Director

- **System configuration:** manage users, roles, stores and the master product catalogue.
- **Operational planning:** assign stores to merchandisers to define routes, and set daily, weekly and monthly sales targets per product and store.
- **Global monitoring:** high-level dashboard of all operations, AI-powered insights, and verification of field activity through GPS and photo proof.

## Tech stack

TypeScript, Next.js, Tailwind CSS, Firebase (App Hosting), Gemini API with Genkit.

## Related work

- [field-force-analytics](https://github.com/OKUMUKOKUMU/field-force-analytics): the analytics behind MerchTrack (geofence visit verification, ghost-visit detection, FIFO freshness alerts).
- [stockout-prediction-ml](https://github.com/OKUMUKOKUMU/stockout-prediction-ml): ML that predicts next-week stock-outs per outlet and SKU.

## Author

Fordrane Albert Okumu, Data Scientist and Senior Business Analyst, Nairobi, Kenya.
